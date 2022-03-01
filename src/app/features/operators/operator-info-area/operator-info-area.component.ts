import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { animate, animateChild, group, query, style, transition, trigger } from '@angular/animations';
import { CHAR_NAME, Operator } from '@struct/Operator/Char';
import { Locales, Range } from '@struct/Basic';
import { OperatorDataManagerService, zh_CN_CharIndex } from '@services/OperatorData/operator-data-manager.service';
import { AnimationFunctions } from '@utils/anims';
import { Nullable, waitAsync } from '@utils/utils';
import { Title, Meta } from '@angular/platform-browser';
import { CharCombatSkill } from '@struct/Operator/DetailedSkill';

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
							`0.5s 0.15s ${AnimationFunctions.Forceful}`,
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
							`0.5s 0.15s ${AnimationFunctions.Forceful}`,
							style({
								opacity: 1,
								top: 0,
							})
						),
					]),
				]),
			]),
		]),
	],
})
export class OperatorInfoAreaComponent implements OnInit, OnChanges
{

	constructor(
		private manager: OperatorDataManagerService,
		private title: Title,
	) { }

	@Input() opId!: string;
	@Input() serverLocale!: Locales;
	@Input() visible = false;
	@Output() onOperatorChange = new EventEmitter<OperatorHeaderData>();

	currentOp!: Operator;
	currentOpCN!: Operator;
	menuVisible = false;
	pagesVisible = false;
	ngOnInit(): void {
		this.visible = true;
		this.init().then(async () => {
			this.menuVisible = true;
			this.pagesVisible = true;
			await waitAsync(600);
			this.setMenuIndex(0);
		});
	}
	ngOnChanges(changes: SimpleChanges): void {
		if (changes.visible && !this.menuVisible && !this.pagesVisible)
			this.init();
	}

    opCombatSkills!: Nullable<CharCombatSkill>[];
    async fetchOpSkills()
    {
        this.opCombatSkills = new Array(this.currentOp.skills.length).fill(null);
        for (let i = 0; i < this.currentOp.skills.length; i++)
            this.opCombatSkills[i] = await this.manager.getCharCombatSkillData(this.currentOp.skills[i]!.skillId, this.serverLocale);
    }

	async init()
	{
		this.currentOp = await this.manager.getCharData(this.opId as CHAR_NAME, this.serverLocale) as Operator;
		this.currentOpCN = await this.manager.getCharData(this.opId as CHAR_NAME, 'zh_CN') as Operator;
        await this.fetchOpSkills();
        //! title
		this.title.setTitle(`${this.currentOp.name ?? 'Operators'} - PRTS Analysis OS`);
		console.log(this.currentOp);
		console.log('%c ', `font-size: 1000px; height: 720px; width: 540px; background:url('https://prts.vercel.app/assets/gamedata/img/characters/avatars/${this.opId}.png') repeat;`);
		this.sendOperatorHeaderData();
	}
	sendOperatorHeaderData()
	{
		this.onOperatorChange.emit({
			id: this.opId,
			rarity: this.currentOp.rarity,
			displayNumber: this.currentOp.displayNumber,
			name: this.currentOp.name,
			appellation: this.currentOp.appellation,
			groupId: this.currentOp.groupId ?? '',
			nationId: this.currentOp.nationId,
		});
	}

    animsPlayed: (null | '')[] = [null, null, null];
	currentMenuIndex: number = -1;
	setMenuIndex(index: Range<0, 3> | -1)
	{
		this.currentMenuIndex = index;
	}
    setAnimsPlayed(index: number)
    {
        this.animsPlayed[index] = '';
    }
}

export type OperatorHeaderData = {
	id: string;
	displayNumber: string;
	name: string;
	appellation: string;
	nationId: string;
	groupId: string;
	rarity: number;
}
