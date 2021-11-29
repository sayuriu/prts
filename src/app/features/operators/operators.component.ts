import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppearDisappear } from '@utils/anims';
import { waitAsync } from '@utils/utils';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { ImageDataService } from '@services/OperatorData/image-data.service';
import { NotifService } from '@services/notif.service';
import { AvailableLocales, Locales } from '@struct/Basic';

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
	currentOpId!: string | null;
	locale!: Locales;
	uiAlignmentState!: 'default' | 'fullInfo' | 'fullImg';

	ngOnInit(): void {
		const self = this;
		if (!this.manager.isLoaded)
			this.notif.send('Operators', 'Loading operator indexes...', 'info', { dynamic: true, presist: true });
		this.manager.events.subscribe(async inst => {
			if (inst.isLoaded)
			{
				//TODO: need {ACE_ROOT_DIR}/ace translation notes
				await waitAsync(1000);
				this.notif.send('Operators', 'Operator indexes loaded.', 'success', { dynamic: true }, 1800);
				const query = this.loadOperator();
				this.locale = this.getLocale();
				this.currentOpId = this.manager.getCharId(query ?? '', this.locale);
				if (!this.currentOpId)
				{
					document.getElementById('info-area')?.setAttribute('picked', '');
					this.headerString = 'Choose a character!';
				}
				else
					document.getElementById('info-area')?.setAttribute('picked', `${this.currentOpId}`);
			}
			else
				this.notif.send('Operators', 'Failed to load operator indexes.', 'error', { presist: true });


		});
	}
	loadOperator() {
		const demand = this.getURLParamValue('opname');
		if (demand)
			return demand.trim();
		return localStorage.getItem('cache:Operator@LastVisited');
	}
	getLocale(): Locales {
		let demand = this.getURLParamValue('locale');
		if (!demand) demand = localStorage.getItem('cache:ServerLocale');
		if (AvailableLocales[`${demand}` as Locales]) return demand as Locales;
		return 'en_US';
	}

	getURLParamValue(param: string)
	{
		return this.router.parseUrl(this.router.url).queryParamMap.get(param);
	}
}

