import { Component } from '@angular/core';
import { PositionQuery } from 'src/app/queries/position.query';

@Component({
	selector: 'app-performance',
	templateUrl: './performance.component.html',
	styleUrls: ['./performance.component.scss']
})
export class PerformanceComponent {
	constructor(private positionsQuery: PositionQuery) { }
	
}
