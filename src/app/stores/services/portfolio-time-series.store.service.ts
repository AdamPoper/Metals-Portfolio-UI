import { Observable, of, tap } from "rxjs";
import { Snapshot } from "src/app/models/snapshot";
import { TimeSeriesService } from "src/app/rest-services/time-series.service";
import { PortfolioTimeSeriesStore } from "../portfolio-time-series.store";
import { PricesQuery } from "src/app/queries/prices.query";
import { PositionQuery } from "src/app/queries/position.query";
import { MetalOptions } from "src/app/models/metal-options";
import { PortfolioTimeSeriesQuery } from "src/app/queries/time-series.query";
import { Injectable } from "@angular/core";

@Injectable({providedIn: 'root'})
export class PortfolioTimeSeriesStoreService {

    constructor(private timeSeriesService: TimeSeriesService,
                private timeSeriesStore: PortfolioTimeSeriesStore,
                private pricesQuery: PricesQuery,
                private positionQuery: PositionQuery,
                private timeSeriesQuery: PortfolioTimeSeriesQuery
    ) {}

    public fetchAllTimeSeriesData(): Observable<Snapshot[]> {
        return this.timeSeriesService.fetchTimeSeriesData()
            .pipe(tap((snapshots: Snapshot[]) => this.timeSeriesStore.update({ snapshots })));
    }

    public updateTimeSeries(): Observable<any> {
        const allPositions = this.positionQuery.getPositions();
        const goldPrice = this.pricesQuery.getGoldPrice();
        const silverPrice = this.pricesQuery.getSilverPrice();
        let value = 0;
        for (const position of allPositions) {
            if (position.type === MetalOptions.GOLD) {
                value += position.quantity * goldPrice;
            } else if (position.type === MetalOptions.SILVER) {
                value += position.quantity * silverPrice;
            }
        }
        const date = this.getEasternDateString();
        const snapshot = {
            date,
            value
        } as Snapshot;

        return this.timeSeriesService.addSnapshotToTimeSeries(snapshot)
            .pipe(tap((newSnapShot: Snapshot) => {
                const allSnapShots = this.timeSeriesQuery.getAllTimeSeriesData();
                this.timeSeriesStore.update({
                    snapshots: [
                        newSnapShot,
                        ...allSnapShots
                    ]
                });
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