import { Component, Input, OnInit } from '@angular/core';
import { Operator } from '@struct/Operator/Char';

@Component({
	selector: 'op-info-skills',
	templateUrl: './opInfo-Skills.component.html',
	styleUrls: ['./opInfo-Skills.component.scss']
})
export class OpSkillsComponent implements OnInit {

	constructor() { }

	@Input() currentOperator!: Operator;

	ngOnInit(): void {
	}

}