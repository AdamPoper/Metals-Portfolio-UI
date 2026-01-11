import { Component, ViewChild } from '@angular/core';
import { ModalComponent } from '../../modal/modal.component';
import { Form, FormBuilder, Validators } from '@angular/forms';
import { PositionStoreService } from 'src/app/stores/services/position.store.service';

@Component({
	selector: 'app-actions-bar',
	templateUrl: './actions-bar.component.html',
	styleUrls: ['./actions-bar.component.scss']
})
export class ActionsBarComponent {
	@ViewChild('addPositionModal') modal?: ModalComponent;

	form = this.formBuilder.group({
		type: [1, Validators.required],
		quantity: [0, [Validators.required, Validators.min(0.01)]],
		cost_basis: [0, [Validators.required, Validators.min(0)]],
		acquired: ['', Validators.required]
	});

	constructor(private formBuilder: FormBuilder,
				private positionStoreService: PositionStoreService) { }

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
