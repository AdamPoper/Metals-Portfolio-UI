import { Query } from "@datorama/akita";
import { PositionState, PositionStore } from "../stores/position.store";
import { Injectable } from "@angular/core";
import { Position } from "../models/position";
import { MetalOptions } from "../models/metal-options";
import { map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class PositionQuery extends Query<PositionState> {

    readonly positions$ = this.select('positions');

    readonly goldPositions$ = this.positions$.pipe(
        map((positions: Position[]) => positions.filter(position => position.type === MetalOptions.GOLD))
    );

    readonly silverPositions$ = this.positions$.pipe(
        map((positions: Position[]) => positions.filter(position => position.type === MetalOptions.SILVER))
    );
    
    constructor(protected override store: PositionStore) {
        super(store);
    }

    public getPositions(): Position[] {
        return this.store.getValue().positions;
    }
}