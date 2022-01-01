import { Component, Input, OnInit } from '@angular/core';
import { Operator } from '@struct/Operator/Char';

@Component({
	selector: 'op-info-stats',
	templateUrl: './opInfo-Stats.component.html',
	styleUrls: ['./opInfo-Stats.component.scss']
})
export class OpStatsComponent implements OnInit {

	constructor() { }

	@Input() currentOperator!: Operator;

	ngOnInit(): void {
	}

}