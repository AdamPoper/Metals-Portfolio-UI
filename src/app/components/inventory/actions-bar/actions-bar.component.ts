import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { PositionStoreService } from 'src/app/stores/services/position.store.service';
import { PositionQuery } from 'src/app/queries/position.query';

@Component({
	selector: 'app-actions-bar',
	templateUrl: './actions-bar.component.html',
	styleUrls: ['./actions-bar.component.scss']
})
export class ActionsBarComponent {
	@ViewChild('addPositionModal') modal?: ModalComponent;
	@ViewChild('liquidationActionModal') liquidationModal?: ModalComponent;

	readonly positions$ = this.positionQuery.positions$;

	addPositionForm = this.formBuilder.group({
		type: [1, Validators.required],
		quantity: [0, [Validators.required, Validators.min(0.01)]],
		cost_basis: [0, [Validators.required, Validators.min(0)]],
		acquired: ['', Validators.required]
	});

	liquidationActionForm = this.formBuilder.group({
		position_id: [null, Validators.required],
		quantity_sold: [0, [Validators.required, Validators.min(0.01)]],
		proceeds: [0, [Validators.required, Validators.min(0)]],
		sale_date: ['', Validators.required]
	});

	constructor(private formBuilder: FormBuilder,
				private positionStoreService: PositionStoreService,
				private positionQuery: PositionQuery) { }

	openAddPositionModal() {
		if (this.modal) {
			this.modal.openModal();
		}
	}

	openLiquidationActionModal() {
		if (this.liquidationModal) {
			this.liquidationModal.openModal();
		}
	}

	submitNewPosition(): void {
		if (this.addPositionForm.valid) {
			this.positionStoreService.addPosition(this.addPositionForm.value).subscribe(() => {
				this.addPositionForm.reset();
				if (this.modal) {
					this.modal.closeModal();
				}
			});
		}
	}

	submitLiquidationAction(): void {
		if (this.liquidationActionForm.valid) {
			this.positionStoreService.addLiquidationAction(this.liquidationActionForm.value).subscribe(() => {
				this.liquidationActionForm.reset();
				if (this.liquidationModal) {
					this.liquidationModal.closeModal();
				}
			});
		}
	}
}
