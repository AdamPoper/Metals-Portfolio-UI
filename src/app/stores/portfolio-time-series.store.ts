import { Store, StoreConfig } from "@datorama/akita";
import { Snapshot } from "../models/snapshot";
import { Injectable } from "@angular/core";
import { TimeSeries, TimeSeriesOptions } from "../models/time-series-options";

export interface TimeSeriesState {
    dateRangeSnapshots: Record<TimeSeries, Snapshot[]>,
    selectedTimeSeries: TimeSeries
}

function createInitialState() {
    return {
        dateRangeSnapshots: {},
        selectedTimeSeries: TimeSeriesOptions.THREE_MONTH
    } as TimeSeriesState;
}

@Injectable({providedIn: 'root'})
@StoreConfig({name: 'TimeSeries'})
export class PortfolioTimeSeriesStore extends Store<TimeSeriesState> {
    constructor() {
        super(createInitialState());
    }

    public addDateRangeSnapshots(rangeKey: string, snapshots: Snapshot[]): void {
        if (!rangeKey) {
            return;
        }

        const records = this.getValue().dateRangeSnapshots;
        this.update({
            dateRangeSnapshots: {
                ...records,
                [rangeKey]: snapshots
            }
        });
    }
}