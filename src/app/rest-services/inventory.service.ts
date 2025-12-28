import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Position } from '../models/position';
import { EnvService } from '../services/env.service';
import { PositionStore } from '../stores/position.store';

@Injectable({ providedIn: 'root' })
export class InventoryService {

    constructor(private http: HttpClient, 
                private env: EnvService,
                private positionStore: PositionStore
    ) {}

    public getAllPositions(): Observable<Position[]> {
        const url = `${this.env.apiBaseUrl}/positions/all`;
        return this.http.get<Position[]>(url);
    }

    public addPosition(position: Partial<Position>): Observable<Position> {
        const url = `${this.env.apiBaseUrl}/positions/add`;
        return this.http.post<Position>(url, position);
    }
}