import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { defaultCharFaction } from '@struct/Operator/CharFaction';
import { Operator } from '@struct/Operator/Char';
import { CharTrustAttributes } from '@root/src/struct/Operator/CharTrustData';
import { Optional } from '@utils/utils';

import Gender_Male from '@assets/gamedata/json/tl-data/gender/男.json';
import Gender_Female from '@assets/gamedata/json/tl-data/gender/女.json';
import Gender_Conviction from '@assets/gamedata/json/tl-data/gender/断罪.json'

@Component({
	selector: 'op-info-maininfo',
	templateUrl: './opInfo-MainInfo.component.html',
	styleUrls: ['./opInfo-MainInfo.component.scss']
})
export class OpMainInfoComponent implements OnInit {

	constructor(
		private manager: OperatorDataManagerService,
		private sanitizer: DomSanitizer
	) { }

	@Input() currentOperator!: Operator;
	@Input() currentOperatorCN!: Operator;
	currentOpFaction = defaultCharFaction;
	readonly opGender = Object.fromEntries([['男', Gender_Male], ['女', Gender_Female], ['断罪', Gender_Conviction]]);

	factionImgURL!: string;
	rarity!: 0[];
	ngOnInit(): void {
		this.init();
	}

	readonly genderColor: Record<string, string> = {
		'男': '#0e59e4',	// M
		'女': '#e02350',	// F
		'断罪': '#6f6f6f',	// N
		'unknown': '#000000',
	}

	currentOpSubclass = 'NO_SUBCLASS';
	currentOpClass = 'NO_CLASS';
	currentOpHR: Record<string, any> = {};

	async init() {
		this.currentOpFaction = await this.manager.getFactionData(this.getFactionID());
		this.factionImgURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL((await this.manager.loadOpImages('char_nodata', 'avatars', undefined, true))!)) as string;
		this.rarity = new Array(this.currentOperator.rarity + 1).fill(0);
		this.currentOpHR = await this.manager.humanResource(this.currentOperatorCN.name) ?? {};
		await this.manager.resolveClassName(this.currentOperator.profession).then(data => {
			if (data && data[this.currentOperatorCN.subProfessionId])
				this.currentOpSubclass = data[this.currentOperatorCN.subProfessionId]['en'];
		})
		const imgblob = await this.manager.loadFactionImage(this.getFactionID());
		if (imgblob)
			this.factionImgURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imgblob)) as string;
		this.formatClassName();
		this.processAvailableTLData();
		this.resolveTrustDiff();
	}

	async formatClassName()
	{
		this.currentOpClass = this.currentOperator.profession.toLowerCase()
			.replace('warrior', 'guard')
			.replace('tank', 'defender')
			.replace('pioneer', 'vanguard')
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
			if (!str.match(/^[0-5]-[0-2]+-[0-9]?[0-9]$/)) continue;
			const [phase, level, potential] = str.split('-');
			levelData.add(parseInt(level));
			eliteData.add(parseInt(phase));
			potentialData.add(parseInt(potential));
		}
		this.opTLEliteOptions = [...eliteData].sort();
		this.opTLPotentialOptions = [...potentialData].sort();
		this.opTLLevelOptions = [...levelData].sort();
		this.currentTLElite = this.opTLEliteOptions[0];
		this.currentTLPotential = this.opTLPotentialOptions[0];
		this.currentTLLevel = this.opTLLevelOptions[0];
		console.log(this.currentTLElite, this.currentTLPotential, this.currentTLLevel);
		this.updateOpTLData();
	}

	setTLElite(value: number)
	{
		this.currentTLElite = value;
		this.updateOpTLData();
	}
	setTLPotential(value: number)
	{
		this.currentTLPotential = value;
		this.updateOpTLData();
	}
	setTLLevel(value: number)
	{
		this.currentTLLevel = value;
		this.updateOpTLData();
	}
	async updateOpTLData()
	{
		console.log(this.currentTLElite, this.currentTLPotential, this.currentTLLevel);
		const avg = (this.currentTLElite + this.currentTLPotential + this.currentTLLevel) / 3;
		for (let i = 0; i < this.currentOperator.talents.length; i++)
		{
			const talent = this.currentOperator.talents[i];
			let holdAvg = undefined;
			let holdIndex = -1;
			for (let j = 0; j < talent.candidates.length; j++)
			{
				const candidate = talent.candidates[j];
				const { unlockCondition: { phase, level }, requiredPotentialRank } = candidate;
				if (phase <= this.currentTLElite && level <= this.currentTLLevel && requiredPotentialRank <= this.currentTLPotential)
				{
					const _avg = (phase + level + requiredPotentialRank) / 3;
					if (holdAvg === undefined)
					{
						holdAvg = _avg;
						holdIndex = j;
					}
					if (avg - _avg <= avg - holdAvg)
					{
						holdAvg = _avg;
						holdIndex = j;
					}
				}
			}
			this.currentOpTL[i] = talent.candidates[holdIndex];
		}
		this.currentOpTL = this.currentOpTL.filter(x => x !== undefined);
		console.log(this.currentOpTL);
		console.log(this.currentOpTL.map(v => v.description));
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