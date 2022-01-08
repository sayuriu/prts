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

	// port
	port_replace(strMatch: string, strReplace: string) {
		return (_in: string) => _in.replace(strMatch, strReplace);
	}

	getFactionID()
	{
		if (this.currentOperator.teamId)
			return this.currentOperator.teamId;
		else if (this.currentOperator.groupId)
			return this.currentOperator.groupId;
		return this.currentOperator.nationId;
	}
}