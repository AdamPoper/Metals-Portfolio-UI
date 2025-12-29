import { Injectable } from "@angular/core";
import { PricesStore, SpotPrices } from "../prices.store";
import { map, Observable, tap } from "rxjs";
import ApiTestService from "src/app/rest-services/api.test.service";
import { ApiSpotPrices } from "src/app/models/api-spot-prices";
import { ApiService } from "src/app/rest-services/api.service";

@Injectable({ providedIn: "root" })
export class PricesStoreService {
    constructor(private pricesStore: PricesStore,
                private apiService: ApiTestService
    ) { }

    public fetchCurrentPrices(): Observable<SpotPrices> {
        return this.apiService.getMetalSpotPrice()
            .pipe(map((spotPrices: ApiSpotPrices) => ({
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