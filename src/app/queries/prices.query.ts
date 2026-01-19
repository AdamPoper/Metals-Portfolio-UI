import { Query } from "@datorama/akita";
import { PricesState, PricesStore } from "../stores/prices.store";
import { Injectable } from "@angular/core";
import { SpotPrices } from "../models/spot-prices";
import { combineLatest, map } from "rxjs";

@Injectable({ providedIn: "root" })
export class PricesQuery extends Query<PricesState> {

    readonly goldPrice$ = this.select('goldPrice');
    readonly silverPrice$ = this.select('silverPrice');

    readonly spotPrices$ = combineLatest([this.goldPrice$, this.silverPrice$])  
        .pipe(map(([goldPrice, silverPrice]) => ({ gold: goldPrice, silver: silverPrice } as SpotPrices)));

    constructor(protected override store: PricesStore) {
        super(store);
    }

    public getGoldPrice(): number {
        return this.store.getValue().goldPrice;
    }

    public getSilverPrice(): number {
        return this.store.getValue().silverPrice;
    }
}