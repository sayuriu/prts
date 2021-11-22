import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppearDisappear } from '@utils/anims';
import { op as Saileach } from './op-Saileach.mockadata';

@Component({
  selector: 'app-feature-operators',
  templateUrl: './operators.component.html',
  styleUrls: ['./operators.component.scss'],
  animations: [
	AppearDisappear
  ]
})
export class OperatorsComponent implements OnInit {

	constructor(private router: Router, private ele: ElementRef) { }

	headerString!: string;
	ngOnInit(): void {
		this.lastVisitedOp = this.loadOperator();
		if (!this.lastVisitedOp)
		{
			document.getElementById('info-area')?.setAttribute('picked', '');
			this.headerString = 'Choose a character!'
		}
		else
			document.getElementById('info-area')?.setAttribute('picked', this.lastVisitedOp)
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