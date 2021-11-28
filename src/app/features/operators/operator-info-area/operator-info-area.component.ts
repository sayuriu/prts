import { Component, OnInit, Input } from '@angular/core';
import { CHAR_NAME, Operator } from '@struct/Operator/Char';
import { Locales } from '@struct/Basic';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';

@Component({
	selector: 'app-operator-info-area',
	templateUrl: './operator-info-area.component.html',
	styleUrls: ['./operator-info-area.component.scss']
})
export class OperatorInfoAreaComponent implements OnInit {

	constructor(
		private manager: OperatorDataManagerService,
	) { }

	@Input() opId!: string;
	@Input() serverLocale!: Locales;
	currentOp!: Operator;

	ngOnInit(): void {
		this.init();
	}
	async init()
	{
		this.currentOp = await this.manager.getCharData(this.opId as CHAR_NAME, this.serverLocale) as Operator;
		document.title = `${this.currentOp.name} - PRTS Analysis OS`;
		console.log(this.currentOp);
		console.log('%c ', `font-size: 1000px; background:url('https://prts.vercel.app/assets/gamedata/img/characters/avatars/${this.opId}.png') no-repeat;`);
	}
}
