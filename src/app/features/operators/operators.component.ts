import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';

import { AppearDisappear } from '@utils/anims';
import { emptyFunc, Nullable, waitAsync } from '@utils/utils';
import { en_US_CharIndex, ja_JP_CharIndex, OperatorDataManagerService, zh_CN_CharIndex } from '@services/OperatorData/operator-data-manager.service';
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
export class OperatorsComponent implements OnInit, OnChanges
{
	// CharImgAssetData: OperatorImageAssetData;

	constructor(
		private router: Router,
		private manager: OperatorDataManagerService,
		private notif: NotifService,
		private json: JSONLoadService,
		private sanitizer: DomSanitizer
	) {}

	headerString!: string;
	currentOpId!: string | null;
	locale!: Locales;
	uiAlignmentState!: 'default' | 'fullInfo' | 'fullImg';

	ngOnInit(): void {
		// @ts-ignore
		// globalThis.__prts_opInterface__ = this;
		if (this.manager.isLoaded)
			this.init();
		else
		{
			this.pickerUIVisible = true;
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
	}

	ngOnChanges(changes: SimpleChanges): void {
		// if (changes.currentOpId)
		// 	this.init(changes.currentOpId.currentValue, changes.locale.currentValue);
	}

	// loadChar(currentOpId: string, locale: Locales)
	// {
	// 	this.init(currentOpId, locale);
	// }

	private init(overrideCharID?: string, overrideLocale?: Locales) {
		const query = overrideCharID ?? this.loadOperator();
		this.locale = overrideLocale ?? this.getLocale();
		let [op, _loc] = this.manager.getCharId(query ?? '', this.locale);
		if (this.locale !== _loc)
		{
			// this.notif.send('Operators', `Operator ${query} is not available in [${this.locale}], using [${_loc}] instead.`, 'warning', { dynamic: true }, 10000);
			this.locale = _loc;
		}
		if (!op)
		{
			this.router.navigate(['/operators'], { replaceUrl: true });
			this.headerString = 'Choose a character!';
		}
		this.switchView(op);
	}

	opHeaderData?: OperatorHeaderData;
	opHeaderCNName = '';
	opHeaderImg = '';
	opHeaderRarityImg = '';
	opHeaderRarityImgLoaded = false;
	opHeaderID = '';
	opHeaderCodeSize = '16px';

	async setOperatorHeaderData(data: OperatorHeaderData)
	{
		this.opHeaderImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL((await this.manager.loadOpImages('char_nodata', 'avatars', undefined, true))!)) as string;
		this.opHeaderRarityImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob())) as string;
		const imgblob = await this.manager.loadOpImages(`${this.currentOpId}`, 'avatars', undefined, new Boolean(data.displayNumber.match(/EX\d+/)).valueOf());
		if (imgblob)
			this.opHeaderImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imgblob)) as string;
		waitAsync(100).then(() => this.opHeaderCodeSize = '20px');
		waitAsync(500).then(() => {
			this.opHeaderData = data;
			this.opHeaderCNName = this.locale === 'en_US' ?
				Object.keys(this.manager.charList.ja_JP!).filter(k => this.manager.charList.ja_JP![k as keyof ja_JP_CharIndex] === this.currentOpId)[0] ?? '' :
				data.appellation;
			this.manager.cachedImages.load(`gamedata/img/characters/ui/chara/glow-${data.rarity + 1}.png`, { onExpire: emptyFunc }).then(v => {
				if (v)
				{
					this.opHeaderRarityImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(v)) as string;
					waitAsync(200).then(() => this.opHeaderRarityImgLoaded = true);
				}
			})
		});
	}

	setCurrentOpId(opId: Nullable<string>)
	{
		this.currentOpId = opId;
	}

	pickerUIVisible = false;
	opInfoUIVisible = false;
	private async switchView(opId: Nullable<string>)
	{
		if (opId)
		{
			this.pickerUIVisible = false;
			await waitAsync(1000);
			this.setCurrentOpId(opId);
			this.opInfoUIVisible = true;
		}
		else
		{
			this.opInfoUIVisible = false;
			await waitAsync(1000);
			this.setCurrentOpId(opId);
			this.pickerUIVisible = true;
		}
	}

	private loadOperator() {
		const demand = this.getURLParamValue('opname');
		if (demand)
			return demand.trim();
		return localStorage.getItem('cache:Operator@LastVisited');
	}
	private getLocale(): Locales {
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
