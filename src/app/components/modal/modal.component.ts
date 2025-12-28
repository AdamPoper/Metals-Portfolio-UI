import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
    @Input() isOpen = false;
    @Output() closeModalEvent = new EventEmitter();

    ngOnInit(): void {

    }

    closeModal() {
		this.isOpen = false;
      	this.closeModalEvent.emit();
    }

	openModal(): void {
		this.isOpen = true;
		console.log('Modal opened', this.isOpen);
	}
}
