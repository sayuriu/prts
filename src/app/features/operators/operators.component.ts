import { Component, ElementRef, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { AppearDisappear } from '@utils/anims';
import { waitAsync } from '@utils/utils';
import { OperatorDataManagerService, zh_CN_CharIndex } from '@services/OperatorData/operator-data-manager.service';
import { ImageDataService } from '@services/OperatorData/image-data.service';
import { NotifService } from '@services/notif.service';
import { AvailableLocales, Locales } from '@struct/Basic';
import { OperatorHeaderData } from './operator-info-area/operator-info-area.component';
import { DomSanitizer } from '@angular/platform-browser';
import { JSONLoadService } from '@services/OperatorData/jsonload.service';

const anim_AppearDisappear = AppearDisappear();
@Component({
	selector: 'app-feature-operators',
	templateUrl: './operators.component.html',
	styleUrls: ['./operators.component.scss'],
	providers: [OperatorDataManagerService],
	animations: [
		anim_AppearDisappear,
	]
})
export class OperatorsComponent implements OnInit {
	// CharImgAssetData: OperatorImageAssetData;

	constructor(
		private router: Router,
		private ele: ElementRef,
		private manager: OperatorDataManagerService,
		private images: ImageDataService,
		private notif: NotifService,
		private json: JSONLoadService,
		private sanitizer: DomSanitizer
	) {}

	headerString!: string;
	currentOpId!: string | null;
	locale!: Locales;
	uiAlignmentState!: 'default' | 'fullInfo' | 'fullImg';

	ngOnInit(): void {
		const self = this;
		if (this.manager.isLoaded)
			this.init();

		if (!this.manager.isLoaded)
			this.notif.send('Operators', 'Loading operator indexes...', 'info', { dynamic: true, presist: true });
		this.manager.events.subscribe(async inst => {
			if (inst.isLoaded)
			{
				//TODO: need {ACE_ROOT_DIR}/ace translation notes
				await waitAsync(1000);
				this.notif.send('Operators', 'Operator indexes loaded.', 'success', { dynamic: true }, 1800);
				this.init();
			}
			else
				this.notif.send('Operators', 'Failed to load operator indexes.', 'error', { presist: true });
		});
	}

	init() {
		const query = this.loadOperator();
		this.locale = this.getLocale();
		let _loc: Locales;
		[this.currentOpId, _loc] = this.manager.getCharId(query ?? '', this.locale);
		if (this.locale !== _loc)
		{
			this.notif.send('Operators', `Operator ${query} is not available in [${this.locale}], using [${_loc}] instead.`, 'warning', { dynamic: true }, 10000);
			this.locale = _loc;
		}
		if (!this.currentOpId)
		{
			this.router.navigate(['/operators'], { replaceUrl: true });
			document.getElementById('info-area')?.setAttribute('picked', '');
			this.headerString = 'Choose a character!';
		}
		else
			this.displayOp();
	}

	opHeaderData?: OperatorHeaderData;
	opHeaderCNName = '';
	opHeaderImg = '';
	opHeaderID = '';
	opHeaderCodeSize = '16px';

	async setOperatorHeaderData(data: OperatorHeaderData)
	{
		const imgblob = await this.manager.loadOpImages(`${this.currentOpId}`, 'avatars');
		if (imgblob)
			this.opHeaderImg =  this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imgblob)) as string;
			waitAsync(100).then(() => this.opHeaderCodeSize = '20px');
			waitAsync(500).then(() => {
			this.opHeaderData = data;
			this.opHeaderCNName = this.locale === 'zh_CN' ? '/' : Object.keys(this.manager.charList.zh_CN!).filter(k => this.manager.charList.zh_CN![k as keyof zh_CN_CharIndex] === this.currentOpId)[0] ?? '';
		});
	}

	async displayOp() {
		document.getElementById('info-area')?.setAttribute('picked', `${this.currentOpId}`);
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

