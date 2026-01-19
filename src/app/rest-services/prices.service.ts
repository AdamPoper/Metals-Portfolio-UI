import { Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvService } from "../services/env.service";
import { SpotPrices } from "../models/spot-prices";
import { MetalSnapshot } from "../models/metal_snapshot";
import { MetalOptions } from "../models/metal-options";

@Injectable({
    providedIn: 'root'
})
export class PricesService {
    constructor(private http: HttpClient, private env: EnvService) { }

    public getMetalSpotPrice(): Observable<SpotPrices> {
        return this.http.get<MetalSnapshot[]>(`${this.env.apiBaseUrl}/prices/latest`).pipe(
            map(snapshots => {
                if (snapshots.length !== 0) {
                    const gold = snapshots.find(snap => snap.type === MetalOptions.GOLD);
                    const silver = snapshots.find(snap => snap.type === MetalOptions.SILVER);
                    return {
                        gold: gold.price,
                        silver: silver.price
                    } as SpotPrices;
                }
                return { gold: null, silver: null} as SpotPrices;
            })
        );
    }
}