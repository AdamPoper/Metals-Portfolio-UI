import { Injectable } from "@angular/core";
import { PortfolioTimeSeriesStore, TimeSeriesState } from "../stores/portfolio-time-series.store";
import { Snapshot } from "../models/snapshot";
import { Query } from "@datorama/akita";

@Injectable({providedIn: 'root'})
export class PortfolioTimeSeriesQuery extends Query<TimeSeriesState> {

    constructor(protected override store: PortfolioTimeSeriesStore) {
        super(store);
    }

    public getAllTimeSeriesData(): Snapshot[] {
        return this.getValue().snapshots;
    }
}