import { Injectable } from "@angular/core";
import { Store, StoreConfig } from "@datorama/akita";

export interface PricesState {
    goldPrice: number;
    silverPrice: number;
}

function createInitialState(): PricesState {
    return {
        goldPrice: 0,
        silverPrice: 0
    };
}

@Injectable({ providedIn: "root" })
@StoreConfig({ name: "prices" })
export class PricesStore extends Store<PricesState> {
    constructor() {
        super(createInitialState());
    }
}