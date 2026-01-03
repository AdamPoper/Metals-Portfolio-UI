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
        );
    }

    /**
     * @param start YYYY-MM-dd
     * @param end YYYY-MM-dd
     * @returns Snapshots for the given date range
     */
    public fetchTimeSeriesByDateRange(start: string, end: string): Observable<Snapshot[]> {
        return this.http.get<Snapshot[]>(
            `${this.env.apiBaseUrl}/time-series/date-range?start=${start}&end=${end}`
        );
    }

    public addSnapshotToTimeSeries(snap: Snapshot): Observable<any> {
        return this.http.post<Snapshot>(
            `${this.env.apiBaseUrl}/time-series/add`,
            snap
        );
    }
}