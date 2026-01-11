import { Component, OnInit } from '@angular/core';
import { combineLatest, map, Observable } from 'rxjs';
import { PositionQuery } from 'src/app/queries/position.query';
import { PositionStoreService } from 'src/app/stores/services/position.store.service';
import { Position } from 'src/app/models/position';

type Summary = {
    quantity: number;
    marketValue: number;
    costBasis: number;
    gainLossValue: number;
    gainLossPercent: number;
};

@Component({
    selector: 'app-mobile-inventory',
    templateUrl: './mobile-inventory.component.html',
    styleUrls: ['./mobile-inventory.component.scss']
})
export class MobileInventoryComponent {

    readonly goldSummary$: Observable<Summary>;
    readonly silverSummary$: Observable<Summary>;
	
    readonly totals$ = this.positionStoreService.calculatePositionTotals$();

    constructor(private positionQuery: PositionQuery,
                private positionStoreService: PositionStoreService) {

        const gainLoss$ = this.positionStoreService.calculateGainLoss$();

        this.goldSummary$ = combineLatest([this.positionQuery.goldPositions$, gainLoss$]).pipe(
            map(([positions, gainLossData]) => this.buildSummary(positions, gainLossData))
        );

        this.silverSummary$ = combineLatest([this.positionQuery.silverPositions$, gainLoss$]).pipe(
            map(([positions, gainLossData]) => this.buildSummary(positions, gainLossData))
        );
    }

    private buildSummary(positions: Position[], gainLossData: Record<number, any>): Summary {
        const quantity = positions.reduce((acc, p) => acc + (Number(p.quantity) || 0), 0);
        const marketValue = positions.reduce((acc, p) => acc + (Number(gainLossData?.[p.id]?.marketValue) || 0), 0);
        const costBasis = positions.reduce((acc, p) => acc + (Number(p.cost_basis) || 0), 0);
        const gainLossValue = positions.reduce((acc, p) => acc + (Number(gainLossData?.[p.id]?.gainLossValue) || 0), 0);
        const gainLossPercent = costBasis ? (gainLossValue / costBasis * 100) : 0;

        return { quantity, marketValue, costBasis, gainLossValue, gainLossPercent };
    }
}
