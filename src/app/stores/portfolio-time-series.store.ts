import { Store, StoreConfig } from "@datorama/akita";
import { Snapshot } from "../models/snapshot";
import { Injectable } from "@angular/core";

export interface TimeSeriesState {
    snapshots: Snapshot[];
}

function createInitialState() {
    return {
        snapshots: []
    } as TimeSeriesState;
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'TimeSeries'})
export class PortfolioTimeSeriesStore extends Store<TimeSeriesState> {
    constructor() {
        super(createInitialState());
    }
}