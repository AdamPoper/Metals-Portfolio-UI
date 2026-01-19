import { Injectable } from "@angular/core";
import { PricesStore } from "../prices.store";
import { map, Observable, tap } from "rxjs";
import { SpotPrices } from "src/app/models/spot-prices";
import { PricesService } from "src/app/rest-services/prices.service";

@Injectable({ providedIn: "root" })
export class PricesStoreService {
    constructor(private pricesStore: PricesStore,
                private pricesService: PricesService
    ) { }

    public fetchCurrentPrices(): Observable<SpotPrices> {
        return this.pricesService.getMetalSpotPrice()
            .pipe(map((spotPrices: SpotPrices) => ({
                gold: spotPrices.gold,
                silver: spotPrices.silver
            })))
            .pipe(tap((spotPrices: SpotPrices) => {
                this.pricesStore.update({
                    goldPrice: spotPrices.gold,
                    silverPrice: spotPrices.silver
                });
            }));
    }
}