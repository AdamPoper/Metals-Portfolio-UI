import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PricesStoreService } from './stores/services/prices.store.service';
import { PricesQuery } from './queries/prices.query';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	readonly goldPrice$ = this.pricesQuery.goldPrice$;
	readonly silverPrice$ = this.pricesQuery.silverPrice$;

	constructor(private pricesStoreService: PricesStoreService,
		        private pricesQuery: PricesQuery
	) {}

	ngOnInit() {
		this.pricesStoreService.fetchCurrentPrices().subscribe();
		setInterval(() => {
			this.pricesStoreService.fetchCurrentPrices().subscribe();
		}, 60000);
	}
}
