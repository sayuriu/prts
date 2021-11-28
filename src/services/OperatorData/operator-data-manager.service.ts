import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CHAR_NAME, SUMMON_NAME, TRAP_NAME, Operator } from '@struct/Operator/Char';
import { Locales } from '@struct/Basic';
import { ImageDataService } from './image-data.service';
import { Nullable, ValueOf } from '@utils/utils';
import { JSONLoadService } from '@services/JSON/jsonload.service';
import { ImageLoader } from '@utils/ImageLoader';

type en_US_CharIndex = typeof import('@assets/gamedata/json/locales/en_US/charnameLinkID.json');
type ja_JP_CharIndex = typeof import('@assets/gamedata/json/locales/ja_JP/charnameLinkID.json');
type ko_KR_CharIndex = typeof import('@assets/gamedata/json/locales/ko_KR/charnameLinkID.json');
type zh_CN_CharIndex = typeof import('@assets/gamedata/json/locales/zh_CN/charnameLinkID.json');
type zh_TW_CharIndex = typeof import('@assets/gamedata/json/locales/zh_TW/charnameLinkID.json');

type AllCharIndexes = en_US_CharIndex & ja_JP_CharIndex & ko_KR_CharIndex & zh_CN_CharIndex & zh_TW_CharIndex;
// type AllCharIndexNames = keyof (AllCharIndexes);
// type AllCharIndexIds = ValueOf<AllCharIndexes>;

type CharData = {
	en_US: Nullable<en_US_CharIndex>;
	ja_JP: Nullable<ja_JP_CharIndex>;
	ko_KR: Nullable<ko_KR_CharIndex>;
	zh_CN: Nullable<zh_CN_CharIndex>;
	zh_TW: Nullable<zh_TW_CharIndex>;
}

const Data_JSON = {
	// _base: '@assets/gamedata/json/locales/{locales}/',
	_base: 'locales/{locales}/',
	characters: 'characters/{id}.json',
	range: 'ranges/{id}.json',

	materials: 'items/materials/{type}/{id}.json',
	materials_types: 'items/types/{id}.json',
	materials_indexes: ['itemToType.json', 'typeToItems.json'],


	//* This can be used for later, but not needed for now.
	// medals: 'medals/list/{types}/{id}.json',
	// medals_types: 'medals/types/{id}.json',
	// medals_indexes: ['medalToType.json', 'typeToMedals.json'],
}

const Data_IMG = {
	characters_avatars: 	'characters/avatars/{char}{id}.png',
	characters_full: 		'characters/full/{char}{id}.png',
	characters_portraits: 	'characters/portraits/{char}{id}.png',
	// char_ui

	skill_combat: 			'characters/skills/combat/skill_icon_{type}_{charname}_{id}.png',
	skill_infra_types: 		'characters/skills/infrastructure/skill_icon_{type}_{charname}_{id}.png',
	skill_infra_variants: 	'characters/skills/infrastructure/skill/{id}.png',
}

@Injectable({
	providedIn: 'root'
})
export class OperatorDataManagerService {
	events: Subject<this>;
	charList!: CharData;
	isLoaded = false;

	constructor(
		private cachedImages: ImageDataService,
		private JSONAssets: JSONLoadService
	) {
		this.events = new Subject<this>();
		this.loadAssets()
			.then(() => {
				this.isLoaded = true;
				console.log('Operator index loaded.');
				this.events.next(this);
			})
			.catch(() => {
				this.events.next(this);
				console.error('Failed to load operator index!');
				this.charList = {
					en_US: null,
					ja_JP: null,
					ko_KR: null,
					zh_CN: null,
					zh_TW: null,
				};
			});
	}

	private async loadAssets()
	{
		console.log('Loading operator index...');
		this.charList = {
			en_US: await import('@assets/gamedata/json/locales/en_US/charnameLinkID.json').then(getDefault),
			ja_JP: await import('@assets/gamedata/json/locales/ja_JP/charnameLinkID.json').then(getDefault),
			ko_KR: await import('@assets/gamedata/json/locales/ko_KR/charnameLinkID.json').then(getDefault),
			zh_CN: await import('@assets/gamedata/json/locales/zh_CN/charnameLinkID.json').then(getDefault),
			zh_TW: await import('@assets/gamedata/json/locales/zh_TW/charnameLinkID.json').then(getDefault),
		}
	}
	getCharId(charName: string, locale: Locales = 'en_US')
	{
		for (let locale in this.charList)
		{
			const key = this.charList[locale as Locales];
			if (key && key[charName as keyof typeof key])
				return key[charName as keyof typeof key];
		}
		return null;
	}
	async getCharData(charId: CHAR_NAME, locale: Locales = 'en_US')
	{
		const { _base, characters } = Data_JSON;
		const charPath = (_base + characters)
			.replace('{locales}', locale)
			.replace('{id}', charId);

		console.log(charPath);
		return this.JSONAssets.load(charPath);
		// const charData = await import(charPath).then(getDefault);
		// return charData ?? null;
	}
}

interface HasDefault<T extends unknown> extends Record<string, unknown>
{
	default: T;
}

function getDefault<T>(obj: T)
{
	return (obj as unknown as HasDefault<T>).default;
}
