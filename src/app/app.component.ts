import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PricesStoreService } from './stores/services/prices.store.service';
import { PricesQuery } from './queries/prices.query';
import { PortfolioTimeSeriesStoreService } from './stores/services/portfolio-time-series.store.service';
import { switchMap } from 'rxjs';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	readonly goldPrice$ = this.pricesQuery.goldPrice$;
	readonly silverPrice$ = this.pricesQuery.silverPrice$;

	constructor(private pricesStoreService: PricesStoreService,
		        private pricesQuery: PricesQuery,
				private timeSeriesStoreService: PortfolioTimeSeriesStoreService
	) {}

	ngOnInit() {
		this.pricesStoreService.fetchCurrentPrices().subscribe();

		setInterval(() => {
			this.pricesStoreService.fetchCurrentPrices()
				.pipe(switchMap(() => this.timeSeriesStoreService.updateTimeSeries()))
				.subscribe();
		}, 24 * 60 * 60 * 1000 / 30); // run this 30 times per day
	}
}
