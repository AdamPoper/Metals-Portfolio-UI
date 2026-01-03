import { Component, OnInit, ViewChild } from '@angular/core';
import { PositionQuery } from 'src/app/queries/position.query';
import { ModalComponent } from '../modal/modal.component';
import { PositionStoreService } from 'src/app/stores/services/position.store.service';
import { FormBuilder, Validators } from '@angular/forms';
import { combineLatest, map, Observable } from 'rxjs';

@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

	@ViewChild('addPositionModal') modal?: ModalComponent;

	readonly positions$ = this.positionQuery.positions$;

	form = this.formBuilder.group({
		type: [1, Validators.required],
		quantity: [0, [Validators.required, Validators.min(0.01)]],
		cost_basis: [0, [Validators.required, Validators.min(0)]],
		acquired: ['', Validators.required]
	});

	gainLossData$ = this.positionStoreService.calculateGainLoss$();

	totals$: Observable<{ marketValue: number; gainLossValue: number; gainLossPercent: number }> = 
		combineLatest([this.positions$, this.gainLossData$])
		.pipe(map(([positions, gainLossData]) => {
			const totalCostBasis = positions.reduce((acc, p) => acc + (Number(p.cost_basis) || 0), 0);
                const marketValue = positions.reduce((acc, p) => {
                    const d = gainLossData?.[p.id];
                    return acc + (Number(d?.marketValue) || 0);
                }, 0);
                const gainLossValue = positions.reduce((acc, p) => {
                    const d = gainLossData?.[p.id];
                    return acc + (Number(d?.gainLossValue) || 0);
                }, 0);
                const gainLossPercent = totalCostBasis ? (gainLossValue / totalCostBasis * 100) : 0;
                return { marketValue, gainLossValue, gainLossPercent };
		}));

	constructor(private positionStoreService: PositionStoreService,
				private positionQuery: PositionQuery,
				private formBuilder: FormBuilder,
	) { }

	ngOnInit(): void {
		this.positionStoreService.getAllPositions().subscribe();

		setInterval(() => {
			this.gainLossData$ = this.positionStoreService.calculateGainLoss$();
		}, 60000);
	}

	openAddPositionModal() {
		if (this.modal) {
			this.modal.openModal();
		}
	}

	submitNewPosition(): void {
		if (this.form.valid) {
			this.positionStoreService.addPosition(this.form.value).subscribe(() => {
				this.form.reset();
				if (this.modal) {
					this.modal.closeModal();
				}
			});
		}
	}
}
