import { Observable, of } from "rxjs";
import { Position } from "../models/position";
import { Injectable } from "@angular/core";

const testData = [
	{
		id: 0,
		type: 1,
		quantity: 10,
		acquired: '2024-01-15',
		cost_basis: 1800.50
	},
	{
		id: 1,
		type: 2,
		quantity: 250,
		acquired: '2023-11-03',
		cost_basis: 22.75
	},
	{
		id: 2,
		type: 1,
		quantity: 5,
		acquired: '2025-02-20',
		cost_basis: 1950.00
	},
	{
		id: 3,
		type: 2,
		quantity: 100,
		acquired: '2022-08-10',
		cost_basis: 18.40
	},
	{
		id: 4,
		type: 1,
		quantity: 2,
		acquired: '2021-05-27',
		cost_basis: 1725.30
	}
] as Position[];

@Injectable({ providedIn: 'root' })
export class InventoryTestService {
	public getAllPositions(): Observable<Position[]> {
		return of(testData);
	}
}