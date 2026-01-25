import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ModalComponent } from '../modal/modal.component';

@Component({
	selector: 'app-login',
	templateUrl: './login.component.html',
	styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

	username: string = '';
	password: string = '';

	@Output() loginEvent = new EventEmitter<void>();

	constructor(private authService: AuthService) {}

	ngOnInit(): void {
	
	}

	onLoginSubmit(): void {
		if (this.username && this.password) {
			this.authService.login(this.username, this.password)
			.subscribe({
				next: (authenticated) => {
					if (authenticated) {
						this.loginEvent.emit();
					}
				},
				error: (err) => {
					console.error('Login failed', err);
					this.username = '';
					this.password = '';
				}
			});
		}
	}
}
