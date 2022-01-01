import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { CHAR_NAME, Operator } from '@struct/Operator/Char';
import { Locales, Range } from '@struct/Basic';
import { OperatorDataManagerService, zh_CN_CharIndex } from '@services/OperatorData/operator-data-manager.service';
import { AnimationFunctions } from '@utils/anims';

@Component({
	selector: 'app-operator-info-area',
	templateUrl: './operator-info-area.component.html',
	styleUrls: ['./operator-info-area.component.scss'],
	animations: [
		trigger('slideUpDown', [
			transition(':increment', [
				group([
					query(':leave', [
						style({
							position: 'absolute',
							top: '0',
							left: '0',
							opacity: 1,
						}),
						animate(
							`0.3s ${AnimationFunctions.Forceful}`,
							style({
								opacity: 0,
								top: '-30px',
							})
						),
					]),
					query(':enter', [
						style({
							position: 'absolute',
							top: '30px',
							left: '0',
							opacity: 0,
						}),
						animate(
							`0.5s ${AnimationFunctions.Forceful}`,
							style({
								opacity: 1,
								top: 0,
							})
						),
					]),
				]),
			]),
			transition(':decrement', [
				group([
					query(':leave', [
						style({
							position: 'absolute',
							top: '0',
							left: '0',
							opacity: 1,
						}),
						animate(
							`0.3s ${AnimationFunctions.Forceful}`,
							style({
								opacity: 0,
								top: '30px',
							})
						),
					]),
					query(':enter', [
						style({
							position: 'absolute',
							top: '-30px',
							left: '0',
							opacity: 0,
						}),
						animate(
							`0.5s ${AnimationFunctions.Forceful}`,
							style({
								opacity: 1,
								top: 0,
							})
						),
					]),
				]),
			]),
		]),
	]
})
export class OperatorInfoAreaComponent implements OnInit {

	constructor(
		private manager: OperatorDataManagerService,
	) { }

	@Input() opId!: string;
	@Input() serverLocale!: Locales;
	currentOp!: Operator;
	@Output() onOperatorChange = new EventEmitter<OperatorHeaderData>();

	ngOnInit(): void {
		this.init();
	}
	async init()
	{
		this.currentOp = await this.manager.getCharData(this.opId as CHAR_NAME, this.serverLocale) as Operator;
		document.title = `${this.currentOp.name ?? 'Operators'} - PRTS Analysis OS`;
		console.log(this.currentOp);
		console.log('%c ', `font-size: 1000px; height: 720px; width: 540px; background:url('https://prts.vercel.app/assets/gamedata/img/characters/avatars/${this.opId}.png') repeat;`);
		this.sendOperatorHeaderData();
	}
	sendOperatorHeaderData()
	{
		this.onOperatorChange.emit({
			id: this.opId,
			displayNumber: this.currentOp.displayNumber,
			name: this.currentOp.name,
			groupId: this.currentOp.groupId ?? '',
			nationId: this.currentOp.nationId,
		});
	}

	currentMenuIndex: number = 0;
	setMenuIndex(index: Range<0, 3>)
	{
		this.currentMenuIndex = index;
	}
}

export type OperatorHeaderData = {
	id: string;
	displayNumber: string;
	name: string;
	nationId: string;
	groupId: string;
}