import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feature-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss']
})
export class OperatorsComponent implements OnInit {

	constructor(private router: Router) { }

	ngOnInit(): void {
		this.lastVisitedOp = this.loadOperator();
	}

	lastVisitedOp!: string | null;
	loadOperator() {
		const demand = this.getURLParamValue('opname');
		if (new Boolean(demand).valueOf()) return demand;
		return localStorage.getItem('cache:Operator@LastVisited');
	}

	getURLParamValue(param: string)
	{
		return this.router.parseUrl(this.router.url).queryParamMap.get(param);
	}

}