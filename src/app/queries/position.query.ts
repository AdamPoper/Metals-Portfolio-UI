import { Query } from "@datorama/akita";
import { PositionState, PositionStore } from "../stores/position.store";
import { Injectable } from "@angular/core";
import { Position } from "../models/position";

@Injectable({ providedIn: 'root' })
export class PositionQuery extends Query<PositionState> {

    readonly positions$ = this.select('positions');
    
    constructor(protected override store: PositionStore) {
        super(store);
    }

    public getPositions(): Position[] {
        return this.store.getValue().positions;
    }
}