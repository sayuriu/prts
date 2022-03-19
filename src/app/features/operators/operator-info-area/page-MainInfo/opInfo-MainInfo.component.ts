import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { defaultCharFaction } from '@struct/Operator/CharFaction';
import { Operator } from '@struct/Operator/Char';
import { CharTrustAttributes } from '@root/src/struct/Operator/CharTrustData';
import { Optional, Nullable, Undef } from '@utils/utils';

import Gender_Male from '@assets/gamedata/json/tl-data/gender/男.json';
import Gender_Female from '@assets/gamedata/json/tl-data/gender/女.json';
import Gender_Conviction from '@assets/gamedata/json/tl-data/gender/断罪.json'
import { AnimManagerService } from '@services/anim-manager.service';
import { OperatorUtilsService } from '@services/OperatorData/op-utils.service';
// import { trigger, transition, style, stagger, animate, query } from '@angular/animations';
// import { AnimationFunctions } from '@utils/anims';

@Component({
	selector: 'op-info-maininfo',
	templateUrl: './opInfo-MainInfo.component.html',
	styleUrls: ['./opInfo-MainInfo.component.scss', '../operator-info-area.component.scss'],
	animations: [
		// trigger('AppearDisappear-List', [
		// 	transition('* <=> *', [
		// 		query(':enter', [
		// 			style({ opacity: 0 }),
		// 			stagger(150, [
		// 				animate('200ms ' + AnimationFunctions.Forceful, style({ opacity: 1 })),
		// 			])
		// 		], { optional: true }),
		// 		query(':leave', [
		// 			animate('200ms ' + AnimationFunctions.Forceful,  style({ opacity: 0 })),
		// 			// stagger(150, [
		// 			// ])
		// 		],{ optional: true })
		// 	]),
		// ])
	]
})
export class OpMainInfoComponent implements OnInit {

	constructor(
        public manager: OperatorDataManagerService,
        public sanitizer: DomSanitizer,
        private animManager: AnimManagerService,
        public opUtils: OperatorUtilsService
    ) { }

	@Input() currentOperator!: Operator & { id: string };
	@Input() currentOperatorCN!: Operator;
	currentOpFaction = defaultCharFaction;
    currentOpNation = defaultCharFaction;
	readonly opGender : { [key: string]: Undef<typeof Gender_Conviction> } = Object.fromEntries([['男', Gender_Male], ['女', Gender_Female], ['断罪', Gender_Conviction]]);

	factionImgURL!: string;
	rarity!: 0[];

    @Output() onAnimationEnd = new EventEmitter<0>();
    @Input() animAlreadyPlayed: Nullable<''> = null;
    animID = -1;
	ngOnInit(): void {
        if (!this.animManager.enabled)
            this.animAlreadyPlayed = '';
        else
            this.animID = setTimeout(() => {this.onAnimationEnd.emit(0)}, 5000) as unknown as number;
		void this.init();
	}

    ngOnDestroy() {
        if (this.animID !== -1)
            clearTimeout(this.animID);
    }

	readonly genderColor: Record<string, Undef<string>> = {
		'男': '#0e59e4',	// M
		'女': '#e02350',	// F
		'断罪': '#6f6f6f',	// N
		'unknown': '#000000',
	}

    currentOpTrait = 'This does not have anything noticeable.'
	currentOpSubclass = 'NO_SUBCLASS';
	currentOpClass = 'NO_CLASS';
	currentOpHR: Record<string, any> = {};

	async init() {
		// @ts-ignore
		if (this.currentOperator.ex) this.currentOperatorCN = this.currentOperator;
        this.currentOpTrait = this.opUtils.interpolateRichStyles(this.currentOperator.description);
		this.currentOpFaction = await this.manager.getFactionData(this.getFactionID());
        this.currentOpNation = await this.manager.getFactionData(this.currentOperator.nationId);
		this.factionImgURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL((await this.manager.loadOpImages('char_nodata', 'avatars', undefined, true))!)) as string;
		this.rarity = new Array(this.currentOperator.rarity + 1).fill(0);
		this.currentOpHR = await this.manager.humanResource(this.currentOperatorCN.name) ?? {};
		await this.manager.resolveClassName(this.currentOperator.profession).then(data => {
			if (data && data[this.currentOperatorCN.subProfessionId])
				this.currentOpSubclass = data[this.currentOperatorCN.subProfessionId]['tl'];
		})
		const imgblob = await this.manager.loadFactionImage(this.getFactionID());
		if (imgblob)
			this.factionImgURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imgblob)) as string;
		this.formatClassName();
		this.processAvailableTLData();
		this.resolveTrustDiff();
        this.opUtils.updateHoverDescListeners();
	}

	async formatClassName()
	{
		this.currentOpClass = this.currentOperator.profession.toLowerCase()
			.replace('warrior', 'guard')
			.replace('tank', 'defender')
			.replace('pioneer', 'vanguard')
			.replace('support', 'supporter')
			.replace('special', 'specialist')
			.trim()
			.replace(/ +/g, '_')
			.toUpperCase() || 'NO_CLASS';
		this.currentOpSubclass = this.currentOpSubclass.toUpperCase().trim().replace(/ +/g, '_') || 'NO_SUBCLASS';
	}

	trustDataString = 'NONE';
	trustDiffData: Optional<CharTrustAttributes> & { maxFavorLevel: number } = { maxFavorLevel: 0};
	resolveTrustDiff()
	{
		this.trustDiffData = this.manager.resolveTrustData(this.currentOperatorCN.favorKeyFrames);
		if (Object.keys(this.trustDiffData).length)
			this.trustDataString = this.trustDiffData.toString();
	}

	opTLPotentialOptions: number[] = [];
	opTLEliteOptions: number[] = [];
	opTLLevelOptions: number[] = [];
	async processAvailableTLData()
	{
		const TLOptArray = [];
		for (const talent of this.currentOperator.talents)
			for (const candidate of talent.candidates)
			{
				const { unlockCondition: { phase, level }, requiredPotentialRank } = candidate;
				TLOptArray.push(`${phase}-${level}-${requiredPotentialRank}`);
			}
		this.toTLOptions(TLOptArray.sort());
	}

	currentTLElite!: number;
	currentTLPotential!: number;
	currentTLLevel!: number;
	async toTLOptions(data: string[])
	{
		const
			levelData = new Set<number>(),
			potentialData = new Set<number>(),
			eliteData = new Set<number>();
		for (const str of data)
		{
			if (!str.match(/^[0-2]-[0-9]?[0-9]-[0-5]$/)) continue;
			const [phase, level, potential] = str.split('-');
			levelData.add(parseInt(level));
			eliteData.add(parseInt(phase));
			potentialData.add(parseInt(potential));
		}
		this.opTLEliteOptions = [...eliteData].sort();
		this.opTLPotentialOptions = [...potentialData].sort();
		this.opTLLevelOptions = [...levelData].sort();
		this.currentTLElite = 0;
		this.currentTLPotential = 0;
		this.currentTLLevel = 0;
		this.updateOpTLData();
	}

	setTLElite(value: number)
	{
		this.currentTLElite = value;
		void this.updateOpTLData();
	}
	setTLPotential(value: number)
	{
		this.currentTLPotential = value;
		void this.updateOpTLData();
	}
	setTLLevel(value: number)
	{
		this.currentTLLevel = value;
		void this.updateOpTLData();
	}
	async updateOpTLData()
	{
		this.currentOpTL = [];
		const
			currentTLElite = this.opTLEliteOptions[this.currentTLElite],
			currentTLPotential = this.opTLPotentialOptions[this.currentTLPotential],
			currentTLLevel = this.opTLLevelOptions[this.currentTLLevel];

		const avg = (currentTLElite + currentTLPotential + currentTLLevel) / 3;
		for (let i = 0; i < this.currentOperator.talents.length; i++)
		{
			const talent = this.currentOperator.talents[i];
			let holdAvg = undefined;
			let holdIndex = -1;
			for (let j = 0; j < talent.candidates.length; j++)
			{
				const candidate = talent.candidates[j];
				const { unlockCondition: { phase, level }, requiredPotentialRank } = candidate;
				if (phase <= currentTLElite && level <= currentTLLevel && requiredPotentialRank <= currentTLPotential)
				{
					const currentAvg = (phase + level + requiredPotentialRank) / 3;
					if (holdAvg === undefined)
					{
						holdAvg = currentAvg;
						holdIndex = j;
					}
					if (avg - currentAvg <= avg - holdAvg)
					{
						holdAvg = currentAvg;
						holdIndex = j;
					}
				}
			}
			this.currentOpTL[i] = talent.candidates[holdIndex];
		}
		this.currentOpTL = this.currentOpTL.filter(x => x !== undefined);
	}

	currentOpTL: Operator['talents'][number]['candidates'][number][] = [];

	// port
	port_replace(strMatch: string, strReplace: string) {
		return (_in: string) => _in.replace(strMatch, strReplace);
	}

	getFactionID()
	{
		if (this.currentOperator.teamId)
			return this.currentOperator.teamId;
		if (this.currentOperator.groupId)
			return this.currentOperator.groupId;
		return this.currentOperator.nationId;
	}
}
