import { map, merge, mergeMap, Observable, of, take, tap } from "rxjs";
import { Snapshot } from "src/app/models/snapshot";
import { TimeSeriesService } from "src/app/rest-services/time-series.service";
import { PortfolioTimeSeriesStore } from "../portfolio-time-series.store";
import { PortfolioTimeSeriesQuery } from "src/app/queries/time-series.query";
import { Injectable } from "@angular/core";
import { PositionStoreService } from "./position.store.service";
import { setLoading } from "@datorama/akita";

@Injectable({providedIn: 'root'})
export class PortfolioTimeSeriesStoreService {

    constructor(private timeSeriesService: TimeSeriesService,
                private timeSeriesStore: PortfolioTimeSeriesStore,
                private timeSeriesQuery: PortfolioTimeSeriesQuery,
                private positionStoreService: PositionStoreService
    ) {}

    public fetchAllTimeSeriesData(): Observable<Snapshot[]> {
        return this.timeSeriesService.fetchTimeSeriesData()
            .pipe(setLoading(this.timeSeriesStore))
            .pipe(tap((snapshots: Snapshot[]) => {
                this.timeSeriesStore.update({ snapshots });
                this.timeSeriesStore.setLoading(false);
            }));
    }

    public updateTimeSeries(): Observable<any> {
        return this.getCurrentSnapshot$()
            .pipe(take(1))
            .pipe(mergeMap((snapshot: Snapshot) => 
                this.timeSeriesService.addSnapshotToTimeSeries(snapshot)
            )).pipe(tap((newSnapShot: Snapshot) => {
                const allSnapShots = this.timeSeriesQuery.getAllTimeSeriesData();
                this.timeSeriesStore.update({
                    snapshots: [
                        newSnapShot,
                        ...allSnapShots
                    ]
                });
            }));
    }

    public getCurrentSnapshot$(): Observable<Snapshot> {
        return this.positionStoreService.getCurrentPortfolioValue$()
            .pipe(map((value: number) => {
                const date = this.getEasternDateString();
                return {
                    date,
                    value
                } as Snapshot;
            }));
    }

    private getEasternDateString(): string {
        const formatter = new Intl.DateTimeFormat('en-CA', {
            timeZone: 'America/New_York',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });

        const parts = formatter.formatToParts(new Date());

        const year = parts.find(p => p.type === 'year')!.value;
        const month = parts.find(p => p.type === 'month')!.value;
        const day = parts.find(p => p.type === 'day')!.value;

        return `${year}-${month}-${day}`; // YYYY-MM-dd
    }
}