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
import { combineLatest, map } from 'rxjs';
import { Snapshot } from 'src/app/models/snapshot';
import { TimeSeries, TimeSeriesOptions } from 'src/app/models/time-series-options';
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

	timeSeriesOptions: TimeSeries[];

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

	readonly selectedOption$ = this.timeSeriesQuery.selectedTimeSeriesOption$;

	constructor(private positionStoreService: PositionStoreService,
				private timeSeriesStoreService: PortfolioTimeSeriesStoreService,
				private timeSeriesQuery: PortfolioTimeSeriesQuery
	) { }

	ngOnInit(): void {
		this.timeSeriesOptions = Object.values(TimeSeriesOptions);

		this.timeSeriesQuery.selectedTimeSeriesSnapshots$
			.subscribe((snapshots: Snapshot[]) => {
				const allSnapShots = snapshots.slice();
				const values = allSnapShots.map((snap: Snapshot) => snap.value);
				const labels = allSnapShots.map((snap: Snapshot) => snap.snap_date);
				this.buildChart(values, labels);
			});
		
		this.timeSeriesStoreService.getTimeSeriesDataByDateRange(
			TimeSeriesOptions.FIVE_YEAR
		).subscribe();
	}

	onSelectTimeSeries(option: TimeSeries): void {
		if (!this.timeSeriesQuery.hasTimeSeriesData(option)) {
			this.timeSeriesStoreService.getTimeSeriesDataByDateRange(option).subscribe();
		} else {
			this.timeSeriesStoreService.updateSelectedTimeSeriesOption(option);
		}
	}

	buildChart(values: number[], labels: string[]): void {
		if (!this.chart) {
			if (this.canvas) {
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
						plugins: {
							tooltip: {
								enabled: true,
							}
						},
						interaction: {
							mode: 'index',
							intersect: false
						},
						responsive: true,
						maintainAspectRatio: false,
					}
				});
				this.registerVerticalLinePlugin();
			}
		} else {
			this.chart.data.datasets[0].data = values;
			this.chart.data.labels = labels;
			this.chart.update('none');
		}
	}

	registerVerticalLinePlugin(): void {
		const verticalLinePlugin = {
			id: 'verticalLine',
			afterDraw: (chart: any) => {
				if (chart.tooltip && chart.tooltip.getActiveElements()?.length !== 0) {
					const ctx = chart.ctx;
					const x = chart.tooltip.getActiveElements()[0].element.x;
					const topY = chart.scales.y.top;
					const bottomY = chart.scales.y.bottom;

					ctx.save();
					ctx.beginPath();
					ctx.moveTo(x, topY);
					ctx.lineTo(x, bottomY);
					ctx.lineWidth = 1;
					ctx.strokeStyle = '#999';
					ctx.stroke();
					ctx.restore();
    			}
  			}
		};
		Chart.register(verticalLinePlugin);
	}

	ngOnDestroy(): void {
		this.chart.destroy();
	}
}
