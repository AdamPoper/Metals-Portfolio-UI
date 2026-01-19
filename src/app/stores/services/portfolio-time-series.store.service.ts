import { forkJoin, map, mergeMap, Observable, of, take, tap } from "rxjs";
import { Snapshot } from "src/app/models/snapshot";
import { TimeSeriesService } from "src/app/rest-services/time-series.service";
import { PortfolioTimeSeriesStore } from "../portfolio-time-series.store";
import { PortfolioTimeSeriesQuery } from "src/app/queries/time-series.query";
import { Injectable } from "@angular/core";
import { PositionStoreService } from "./position.store.service";
import { setLoading } from "@datorama/akita";
import { TimeSeriesOptions, TimeSeries } from "src/app/models/time-series-options";

export type DateRange = {
    start: string,
    end: string
}

@Injectable({providedIn: 'root'})
export class PortfolioTimeSeriesStoreService {

    constructor(private timeSeriesService: TimeSeriesService,
                private timeSeriesStore: PortfolioTimeSeriesStore,
                private timeSeriesQuery: PortfolioTimeSeriesQuery,
                private positionStoreService: PositionStoreService
    ) {}

    public getTimeSeriesDataByDateRange(timeSeries: TimeSeries): Observable<Snapshot[]> {
        const {start, end} = this.getStartAndEndDates(timeSeries);
        return this.timeSeriesService.fetchTimeSeriesByDateRange(start, end)
            .pipe(setLoading(this.timeSeriesStore))
            .pipe(tap((snapshots: Snapshot[]) => {
                this.timeSeriesStore.update({
                    selectedTimeSeries: timeSeries
                });
        
                this.timeSeriesStore.addDateRangeSnapshots(timeSeries, snapshots);
                this.timeSeriesStore.setLoading(false);
            }));
    }

    public updateSelectedTimeSeriesOption(timeSeries: TimeSeries): void {
        this.timeSeriesStore.update({
            selectedTimeSeries: timeSeries 
        });
    }

    public getCurrentSnapshot$(): Observable<Snapshot> {
        return this.positionStoreService.getCurrentPortfolioValue$()
            .pipe(map((value: number) => {
                const snap_date = this.getEasternDateString(new Date());
                return {
                    snap_date,
                    value
                } as Snapshot;
            }));
    }

    public refreshAllCachedTimeSeriesData(): Observable<any> {
        const allCachedTimeSeries = this.timeSeriesQuery.getDateRangeSnapshots();
        if (Object.entries(allCachedTimeSeries).length === 0) {
            return of([]);
        }

        const cachedKeys = Object.keys(allCachedTimeSeries) as TimeSeries[];
        const dataToRefresh = cachedKeys.map((key: TimeSeries) => {
            return this.getTimeSeriesDataByDateRange(key);
        });
        return forkJoin(dataToRefresh);
    }

    private getEasternDateString(date: Date): string {
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const parts = formatter.formatToParts(date);

        const year = parts.find(p => p.type === 'year')!.value;
        const month = parts.find(p => p.type === 'month')!.value;
        const day = parts.find(p => p.type === 'day')!.value;

        return `${year}-${month}-${day}`; // YYYY-MM-dd
    }

    private getStartAndEndDates(timeSeries: TimeSeries): DateRange {
        const milliSecondsInOneDay = 24 * 60 * 60 * 1000;
        const getMillsOffset = (timeSeries: TimeSeries): number => {
            return {
                [TimeSeriesOptions.THREE_MONTH]: 31 * 3 * milliSecondsInOneDay,
                [TimeSeriesOptions.SIX_MONTH]: 30 * 6 * milliSecondsInOneDay,
                [TimeSeriesOptions.ONE_YEAR]: 365 * milliSecondsInOneDay,
                [TimeSeriesOptions.TWO_YEAR]: 2 * 365 * milliSecondsInOneDay,
                [TimeSeriesOptions.THREE_YEAR]: 3 * 365 * milliSecondsInOneDay,
                [TimeSeriesOptions.FIVE_YEAR]: 5 * 365 * milliSecondsInOneDay,
                [TimeSeriesOptions.ALL]: 99 * 365 * milliSecondsInOneDay
            }[timeSeries];
        }
        const now = new Date();
        const lowerBound = new Date(Date.now() - getMillsOffset(timeSeries));
        return {
            start: this.getEasternDateString(lowerBound),
            end: this.getEasternDateString(now)
        };
    }
}