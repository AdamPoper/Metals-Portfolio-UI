import { Injectable } from "@angular/core";
import { PortfolioTimeSeriesStore, TimeSeriesState } from "../stores/portfolio-time-series.store";
import { Snapshot } from "../models/snapshot";
import { Query } from "@datorama/akita";
import { map } from "rxjs";

@Injectable({providedIn: 'root'})
export class PortfolioTimeSeriesQuery extends Query<TimeSeriesState> {

    readonly snapshots$ = this.select('snapshots');

    readonly loading$ = this.selectLoading();

    readonly latestSnapshot$ = this.snapshots$.pipe(map((snapshots: Snapshot[]) => {
        return snapshots[snapshots.length - 1];
    }));

    constructor(protected override store: PortfolioTimeSeriesStore) {
        super(store);
    }

    public getAllTimeSeriesData(): Snapshot[] {
        return this.getValue().snapshots;
    }
}