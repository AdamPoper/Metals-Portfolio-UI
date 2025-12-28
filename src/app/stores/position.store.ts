import { Store, StoreConfig } from '@datorama/akita';
import { Position } from '../models/position';
import { Injectable } from '@angular/core';

export type CurrentValues = {
    gainLossValue: number;
    gainLossPercent: number;
    marketValue: number;
}

export interface PositionState {
    positions: Position[];
}

function createInitialState(): PositionState {
    return {
        positions: []
    };
}

@Injectable({providedIn: 'root'})
@StoreConfig({ name: 'position' })
export class PositionStore extends Store<PositionState> {
    constructor() {
        super(createInitialState());
    }
}
