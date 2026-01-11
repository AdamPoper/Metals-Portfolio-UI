import { Component, OnInit, ViewChild } from '@angular/core';
import { PositionQuery } from 'src/app/queries/position.query';
import { ModalComponent } from '../modal/modal.component';
import { PositionStoreService } from 'src/app/stores/services/position.store.service';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
	selector: 'app-inventory',
	templateUrl: './inventory.component.html',
	styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

	readonly positions$ = this.positionQuery.positions$;

	gainLossData$ = this.positionStoreService.calculateGainLoss$();

	totals$ = this.positionStoreService.calculatePositionTotals$();

	constructor(private positionStoreService: PositionStoreService,
				private positionQuery: PositionQuery,
	) { }

	ngOnInit(): void {
		this.positionStoreService.getAllPositions().subscribe();

		setInterval(() => {
			this.gainLossData$ = this.positionStoreService.calculateGainLoss$();
		}, 60000);
	}
}
