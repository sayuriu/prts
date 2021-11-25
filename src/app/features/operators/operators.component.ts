import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppearDisappear } from '@utils/anims';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { ImageDataService } from '@services/OperatorData/image-data.service';
@Component({
		selector: 'app-feature-operators',
		templateUrl: './operators.component.html',
		styleUrls: ['./operators.component.scss'],
		providers: [OperatorDataManagerService],
		animations: [
			AppearDisappear
		]

	})
export class OperatorsComponent implements OnInit {
	// CharImgAssetData: OperatorImageAssetData;

	constructor(
		private router: Router,
		private ele: ElementRef,
		private manager: OperatorDataManagerService,
		private images: ImageDataService
	) {
		// if (!operatorImageAssetData)
		// 	this.CharImgAssetData = new OperatorImageAssetData();
		// else this.CharImgAssetData = operatorImageAssetData;
	}
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
		// import('@assets/gamedata/json/locales/en_US/charnameLinkID.json').then();

		// this works, use xhr on relational paths
		// const img1 = new ImageLoader();
		// img1.load('../../../../assets/gamedata/img/characters/full/char_003_kalts_1.png');
		// new ImageLoader().load('https://prts.vercel.app/assets/gamedata/img/characters/full/char_003_kalts_1.png');

		// document.getElementById('img-area')?.appendChild(img1);
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