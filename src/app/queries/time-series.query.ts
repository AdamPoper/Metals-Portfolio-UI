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

    readonly netDailyChange$ = this.selectedTimeSeriesSnapshots$
        .pipe(map((snapshots: Snapshot[]) => {
            if (snapshots.length < 2) {
                return {
                    netChangeValue: 0,
                    netChangePercent: 0
                };
            }
            const latestSnapshot = snapshots[snapshots.length - 1];
            const previousSnapshot = snapshots[snapshots.length - 2];
            const netChangeValue = latestSnapshot.value - previousSnapshot.value;
            const netChangePercent = netChangeValue / previousSnapshot.value * 100;
            return {
                netChangeValue,
                netChangePercent
            };
        }));

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