import { Component } from '@angular/core';
import { ApiService } from './service/api.service';
import { OnInit } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { SpotPrices } from './models/spot-prices';
import ApiTestService from './service/api.test.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	metalSpotPrices$: Observable<SpotPrices> = this.apiTestService.getMetalSpotPriceTestData();

	constructor(private apiService: ApiService,
				private apiTestService: ApiTestService
	) {}

	ngOnInit() {
		// this.apiService.getMetalSpotPrice().subscribe((data) => {
		// 	console.log('Metals Spot Price:', data);
		// });
		// this.apiTestService.getMetalSpotPriceTestData().subscribe((data) => {
		// 	console.log('Test Metals Spot Price:', data);
		// });
		setInterval(() => {
			this.metalSpotPrices$ = this.apiTestService.getMetalSpotPriceTestData();
		}, 5000)
	}
}
