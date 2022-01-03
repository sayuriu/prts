import { Component, Input, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { defaultCharFaction } from '@struct/Operator/CharFaction';
import { Operator } from '@struct/Operator/Char';

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
	currentOpFaction = defaultCharFaction;

	factionImgURL!: string;
	rarity!: 0[];
	ngOnInit(): void {
		this.init();
	}

	readonly genderColor = {
		'M': '#0e59e4',
		'F': '#e02350',
		'N': '#6f6f6f'
	}

	async init() {
		this.currentOpFaction = await this.manager.getFactionData(this.getFactionID());
		this.factionImgURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL((await this.manager.loadOpImages('char_nodata', 'avatars', undefined, true))!)) as string;
		this.rarity = new Array(this.currentOperator.rarity + 1).fill(0);
		const imgblob = await this.manager.loadFactionImage(this.getFactionID());
		if (imgblob)
			this.factionImgURL = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imgblob)) as string;
	}

	getFactionID()
	{
		if (this.currentOperator.teamId)
			return this.currentOperator.teamId;
		else if (this.currentOperator.teamId)
			return this.currentOperator.teamId;
		return this.currentOperator.nationId;
	}
}