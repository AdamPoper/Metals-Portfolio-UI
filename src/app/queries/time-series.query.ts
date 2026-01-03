import { Injectable } from "@angular/core";
import { PortfolioTimeSeriesStore, TimeSeriesState } from "../stores/portfolio-time-series.store";
import { Snapshot } from "../models/snapshot";
import { Query } from "@datorama/akita";
import { combineLatest, map } from "rxjs";
import { TimeSeries } from "../models/time-series-options";

@Injectable({providedIn: 'root'})
export class PortfolioTimeSeriesQuery extends Query<TimeSeriesState> {

    readonly loading$ = this.selectLoading();

    readonly timeSeriesByDateRange$ = this.select('dateRangeSnapshots');

    readonly selectedTimeSeriesOption$ = this.select('selectedTimeSeries');

    readonly selectedTimeSeriesSnapshots$ = combineLatest([
        this.timeSeriesByDateRange$,
        this.selectedTimeSeriesOption$
    ]).pipe(map(([timeSeriesByDateRange, option]) => {
        const result = timeSeriesByDateRange[option];
        if (!!result) {
            return result;
        }
        return [];
    }));

    readonly latestSnapshot$ = this.selectedTimeSeriesSnapshots$
        .pipe(map((snapshots: Snapshot[]) => snapshots[snapshots.length - 1]));

    constructor(protected override store: PortfolioTimeSeriesStore) {
        super(store);
    }

    public getSelectedTimeSeriesOption(): TimeSeries {
        return this.getValue().selectedTimeSeries;
    }

    public getSelectedTimeSeries(): Snapshot[] {
        return this.getDateRangeSnapshots()[this.getSelectedTimeSeriesOption()];
    }

    public getDateRangeSnapshots(): Record<TimeSeries, Snapshot[]> {
        return this.getValue().dateRangeSnapshots
    }

    public hasTimeSeriesData(timeSeries: TimeSeries): boolean {
        return !!this.getValue().dateRangeSnapshots[timeSeries];
    }
}