import { Component, Input, OnInit } from '@angular/core';
import { Operator } from '@struct/Operator/Char';

@Component({
	selector: 'op-info-maininfo',
	templateUrl: './opInfo-MainInfo.component.html',
	styleUrls: ['./opInfo-MainInfo.component.scss']
})
export class OpMainInfoComponent implements OnInit {

	constructor() { }

	@Input() currentOperator!: Operator;

	ngOnInit(): void {
	}

}