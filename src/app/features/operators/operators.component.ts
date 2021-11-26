import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppearDisappear } from '@utils/anims';
import { waitAsync } from '@utils/utils';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { ImageDataService } from '@services/OperatorData/image-data.service';
import { NotifService } from '@services/Notification/notif.service';
import { CHAR_NAME, Operator } from '@struct/Operator/Char';
import { Locales } from '@struct/Basic';

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
		private images: ImageDataService,
		private notif: NotifService
	) {}
	headerString!: string;
	ngOnInit(): void {
		const self = this;
		this.notif.send('Operators', 'Loading operator indexes...', 'info', { dynamic: true }, 30000);
		this.manager.events.subscribe(async inst => {
			if (inst.isLoaded)
			{
				//TODO: hardcoded locale, need ACE_ROOT_DIR/ace translation notes
				const locale: Locales = 'en_US';

				await waitAsync(1000);
				this.notif.send('Operators', 'Operator indexes loaded.', 'success', { dynamic: true }, 1800);
				this.lastVisitedOp = this.loadOperator();
				console.log('lastVisitedOp', this.lastVisitedOp);
				const charId = this.manager.getCharId(this.lastVisitedOp ?? '', locale);
				console.log(charId);
				if (!charId)
				{
					document.getElementById('info-area')?.setAttribute('picked', '');
					this.headerString = 'Choose a character!'
				}
				else
				{
					const charData = await this.manager.getCharData(charId as CHAR_NAME, locale) as Operator;
					console.log(charData);
					console.log('%c ', `font-size: 1000px; background:url('https://prts.vercel.app/assets/gamedata/img/characters/avatars/${charId}.png') no-repeat;`);
					document.getElementById('info-area')?.setAttribute('picked', `${this.lastVisitedOp}`);
				}

			}
			else if (!this.manager.isLoaded)
			{
				this.notif.send('Operators', 'Failed to load operator indexes.', 'error', { dynamic: true });
			}

		});
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

