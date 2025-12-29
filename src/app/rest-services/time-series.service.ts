import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Snapshot } from "../models/snapshot";
import { Observable } from "rxjs";
import { EnvService } from "../services/env.service";


@Injectable({providedIn: 'root'})
export class TimeSeriesService {

    constructor(private http: HttpClient,
                private env: EnvService
    ) {}

    public fetchTimeSeriesData(): Observable<Snapshot[]> {
        return this.http.get<Snapshot[]>(
            `${this.env.apiBaseUrl}/time-series/all`
        )
    }

    public addSnapshotToTimeSeries(snap: Snapshot): Observable<any> {
        return this.http.post<Snapshot>(
            `${this.env.apiBaseUrl}/time-series/add`,
            snap
        );
    }
}