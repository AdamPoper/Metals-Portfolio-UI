import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { PricesStoreService } from './stores/services/prices.store.service';
import { PricesQuery } from './queries/prices.query';
import { PortfolioTimeSeriesStoreService } from './stores/services/portfolio-time-series.store.service';
import { switchMap } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	readonly goldPrice$ = this.pricesQuery.goldPrice$;
	readonly silverPrice$ = this.pricesQuery.silverPrice$;

	isAuthenticated = this.authService.isAuthenticated();

	constructor(private pricesStoreService: PricesStoreService,
		        private pricesQuery: PricesQuery,
				private timeSeriesStoreService: PortfolioTimeSeriesStoreService,
				private authService: AuthService
	) {}

	ngOnInit() {
		if (this.isAuthenticated) {
			this.pricesStoreService.fetchCurrentPrices().subscribe();
		}

		setInterval(() => {
			this.pricesStoreService.fetchCurrentPrices()
				.pipe(switchMap(() => this.timeSeriesStoreService.refreshAllCachedTimeSeriesData()))
				.subscribe();
		}, 60000); // every minute prob change this
	}

	onLoginEvent(): void {
		this.isAuthenticated = this.authService.isAuthenticated();
		if (!this.isAuthenticated) {
			return;
		}
		this.pricesStoreService.fetchCurrentPrices().subscribe();
	}
}
