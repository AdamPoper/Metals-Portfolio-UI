import { Injectable } from "@angular/core";
import { InventoryService } from "src/app/rest-services/inventory.service";
import { CurrentValues, PositionStore } from "../position.store";
import { combineLatest, map, Observable, tap } from "rxjs";
import { Position } from "src/app/models/position";
import { PositionQuery } from "src/app/queries/position.query";
import { PricesQuery } from "src/app/queries/prices.query";
import { MetalOptions } from "src/app/models/metal-options";

@Injectable({ providedIn: 'root' })
export class PositionStoreService {
    constructor(private inventoryService: InventoryService,
                private positionStore: PositionStore,
                private positionQuery: PositionQuery,
                private pricesQuery: PricesQuery
    ) {}

    public getAllPositions(): Observable<Position[]> {
        return this.inventoryService.getAllPositions()
        .pipe(tap((positions: Position[]) => {
            this.positionStore.update({ positions });
        }));
    }

    public addPosition(position: Partial<Position>): Observable<Position> {
        return this.inventoryService.addPosition(position)
            .pipe(tap((newPosition: Position) => {
                this.positionStore.update(state => ({
                    positions: [...state.positions, newPosition]
                }));
            }));
    }

    public calculateGainLoss$(): Observable<Record<number, CurrentValues>> {
        return combineLatest([
            this.pricesQuery.spotPrices$,
            this.positionQuery.positions$
        ]).pipe(map(([spotPrices, positions]) => {
            const gainLossData: Record<number, CurrentValues> = {};
            positions.forEach(position => {
                const currentPrice = position.type === 0 ? spotPrices.gold : spotPrices.silver;
                const marketValue = currentPrice * position.quantity;
                const gainLossValue = marketValue - position.cost_basis;
                const gainLossPercent = gainLossValue / position.cost_basis * 100;
                gainLossData[position.id] = {
                    gainLossValue,
                    gainLossPercent,
                    marketValue
                };
            });

            return gainLossData;
        }));
    }

    public getCurrentPortfolioValue$(): Observable<number> {
        return combineLatest([
            this.positionQuery.positions$,
            this.pricesQuery.goldPrice$,
            this.pricesQuery.silverPrice$
        ]).pipe(
            map(([positions, goldPrice, silverPrice]) => {
                return positions.reduce((total, position) => {
                    const price =
                        position.type === MetalOptions.GOLD
                            ? goldPrice
                            : silverPrice;

                    return total + position.quantity * price;
                }, 0)
            })
        );
    }
}