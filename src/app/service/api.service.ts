import { Observable, map } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { EnvService } from "./env.service";
import { SpotPrices } from "../models/spot-prices";
import { RealTimeMetalsApiResponse } from "../models/real-time-metal-api-response";

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    constructor(private http: HttpClient, private env: EnvService) { }

    public getMetalSpotPrice(): Observable<SpotPrices> {
        return this.http.get<RealTimeMetalsApiResponse>(
            `${this.env.metalsApiUrlLatest}`
        ).pipe(
            map(response => response.metals),
            map(metals => ({ gold: metals.gold, silver: metals.silver }))
        );
    }
}