import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
	Chart, 
	LineController,
	LineElement,
	PointElement,
	LinearScale,
	CategoryScale,
	Tooltip,
  	Legend
} from 'chart.js';
import { combineLatest, map, take, tap } from 'rxjs';
import { Snapshot } from 'src/app/models/snapshot';
import { PortfolioTimeSeriesQuery } from 'src/app/queries/time-series.query';
import { PortfolioTimeSeriesStoreService } from 'src/app/stores/services/portfolio-time-series.store.service';
import { PositionStoreService } from 'src/app/stores/services/position.store.service';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
);

@Component({
	selector: 'app-time-series',
	templateUrl: './time-series.component.html',
	styleUrls: ['./time-series.component.scss']
})
export class TimeSeriesComponent implements OnInit, OnDestroy {

	@ViewChild('chartCanvas') canvas: ElementRef<HTMLCanvasElement>;
	chart: Chart;

	readonly currentPortfolioValue$ = this.positionStoreService.getCurrentPortfolioValue$();

	readonly loading$ = this.timeSeriesQuery.loading$;

	readonly netDailyChange$ = combineLatest([this.timeSeriesQuery.latestSnapshot$, this.currentPortfolioValue$])
		.pipe(map(([snapshot, currentValue]) => {
			const netChangeValue = currentValue - snapshot.value;
			const netChangePercent = netChangeValue / snapshot.value * 100;
			return {
				netChangeValue,
				netChangePercent
			}
		}));

	constructor(private positionStoreService: PositionStoreService,
				private timeSeriesStoreService: PortfolioTimeSeriesStoreService,
				private timeSeriesQuery: PortfolioTimeSeriesQuery
	) { }

	ngOnInit(): void {
		combineLatest([this.timeSeriesStoreService.getCurrentSnapshot$(), this.timeSeriesStoreService.fetchAllTimeSeriesData()])
			.pipe(take(1))
			.pipe(tap(([currentSnapshot, snapshots]) => {
				const allSnapShots = snapshots.slice();
				allSnapShots.push(currentSnapshot);
				const values = allSnapShots.map((snap: Snapshot) => snap.value);
				const labels = allSnapShots.map((snap: Snapshot) => snap.date);
				if (this.chart) {
					this.chart.destroy();
				}

				this.chart = new Chart(this.canvas.nativeElement, {
					type: 'line',
					data: {
						labels,
						datasets: [{
							label: 'Portfolio Value',
							data: values,
							tension: 0.3,
							borderColor: '#5865f2',
							backgroundColor: '#5865f2',
							pointRadius: 0,
							borderWidth: 2
						}]
					},
					options: {
						responsive: true,
						maintainAspectRatio: false,
					}
				});
			})).subscribe();
		
		this.timeSeriesStoreService.fetchAllTimeSeriesData().subscribe();
	}

	ngOnDestroy(): void {
		this.chart.destroy();
	}
}
