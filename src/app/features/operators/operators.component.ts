import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { AvailableLocales, Locales } from '@struct/Basic';
import { AppearDisappear } from '@utils/anims';
import { emptyFunc, Nullable, waitAsync } from '@utils/utils';
import { en_US_CharIndex, ja_JP_CharIndex, OperatorDataManagerService, zh_CN_CharIndex } from '@services/OperatorData/operator-data-manager.service';
import { NotifService } from '@services/notif.service';
import { OperatorHeaderData } from './operator-info-area/operator-info-area.component';
import { JSONLoadService } from '@services/OperatorData/jsonload.service';
import { PopupService } from '@services/popup.service';
import { OperatorUtilsService } from '@services/OperatorData/op-utils.service';

const anim_AppearDisappear = AppearDisappear();
@Component({
	selector: 'app-feature-operators',
	templateUrl: './operators.component.html',
	styleUrls: ['./operators.component.scss'],
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
		private sanitizer: DomSanitizer,
        private opUtils: OperatorUtilsService
	) {}

	headerString!: string;
	currentOpId!: string | null;
	locale!: Locales;
	uiAlignmentState!: 'default' | 'fullInfo' | 'fullImg';

	ngOnInit(): void {
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
        setTimeout(() => {
            if (window.innerWidth < 1500)
            {
                this.UISlow = true;
                this.UIExpanded = true;
            }
        }, 3000)
	}

	ngOnChanges(changes: SimpleChanges): void {
		// if (changes.currentOpId)
		// 	this.init(changes.currentOpId.currentValue, changes.locale.currentValue);
	}

    UIExpanded = false;
    UISlow = false;
    toggleWidth() {
        this.UISlow = true;
        this.UIExpanded = !this.UIExpanded;
    }

	private init(overrideCharID?: string, overrideLocale?: Locales) {
		const query = overrideCharID ?? this.loadOperator();
		this.manager.setLocale(overrideLocale ?? this.getLocale());
		let [op, _loc] = this.manager.getCharId(query ?? '', this.manager.locale);
		if (this.manager.locale !== _loc)
		{
			// this.notif.send('Operators', `Operator ${query} is not available in [${this.locale}], using [${_loc}] instead.`, 'warning', { dynamic: true }, 10000);
			this.manager.setLocale(_loc);
		}
		if (!op && this.router.url.includes('/operators'))
		{
			this.router.navigate(['/operators'], { replaceUrl: true });
			this.headerString = 'Choose a character!';
		}
		this.switchView(op);
	}

	opHeaderData?: OperatorHeaderData;
	opHeaderCNName = '';
	opHeaderForeignName = '';
	opHeaderImg = '';
	opHeaderRarityImg = '';
	opHeaderRarityImgLoaded = false;
	opHeaderID = '';
	opHeaderCodeSize = '16px';

	async setOperatorHeaderData(data: OperatorHeaderData)
	{
		this.opHeaderImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL((await this.manager.loadOpImages('char_nodata', 'avatars', undefined, true))!)) as string;
		this.opHeaderRarityImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(new Blob())) as string;
		await this.json.load(`tl-data/foreign_names/${data.appellation}.json`).then(async res => {
			if (res)
				this.opHeaderForeignName = res.name as string;
		});
		const imgblob = await this.manager.loadOpImages(`${this.currentOpId}`, 'avatars', undefined, new Boolean(data.displayNumber.match(/EX\d+/)).valueOf());
		if (imgblob)
			this.opHeaderImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(imgblob)) as string;
		waitAsync(100).then(() => this.opHeaderCodeSize = '20px');
		waitAsync(500).then(() => {
			this.opHeaderData = data;
			this.opHeaderCNName =
				this.manager.locale !== 'zh_CN' ?
				Object.keys(this.manager.charList.zh_CN!).filter(k => this.manager.charList.zh_CN![k as keyof zh_CN_CharIndex] === this.currentOpId)[0] ?? '' :
				// this.manager.locale !== 'ja_JP' ?
				// (Object.keys(this.manager.charList.ja_JP!).filter(k => this.manager.charList.ja_JP![k as keyof ja_JP_CharIndex] === this.currentOpId)[0] ?? '') :
				data.appellation;
			this.manager.cachedImages.load(`gamedata/img/characters/ui/chara/glow-${data.rarity + 1}.png`, { onExpire: emptyFunc }).then(v => {
				if (v)
				{
					this.opHeaderRarityImg = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(v)) as string;
					waitAsync(200).then(() => this.opHeaderRarityImgLoaded = true);
				}
			});
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
        //! what
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
		if (localStorage) return localStorage.getItem('cache:Operator@LastVisited');
		return null;
	}
	private getLocale(): Locales {
		let demand = this.getURLParamValue('locale');
		if (!demand && localStorage) demand = localStorage.getItem('cache:ServerLocale');
		if (AvailableLocales[`${demand}` as Locales]) return demand as Locales;
		return 'en_US';
	}

	getURLParamValue(param: string)
	{
		return this.router.parseUrl(this.router.url).queryParamMap.get(param);
	}
}
