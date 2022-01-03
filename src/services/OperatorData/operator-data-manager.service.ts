import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CHAR_NAME, SUMMON_NAME, TRAP_NAME, Operator } from '@struct/Operator/Char';
import { CharFaction, defaultCharFaction } from '@struct/Operator/CharFaction';
import { Locales } from '@struct/Basic';
import { ImageDataService } from '../image-data.service';
import { Nullable, NullablePromise, ValueOf } from '@utils/utils';
import { JSONLoadService } from '@services/OperatorData/jsonload.service';
import { join } from '@utils/PathUtils';

export type en_US_CharIndex = typeof import('@assets/gamedata/json/locales/en_US/charnameLinkID.json');
export type ja_JP_CharIndex = typeof import('@assets/gamedata/json/locales/ja_JP/charnameLinkID.json');
export type ko_KR_CharIndex = typeof import('@assets/gamedata/json/locales/ko_KR/charnameLinkID.json');
export type zh_CN_CharIndex = typeof import('@assets/gamedata/json/locales/zh_CN/charnameLinkID.json');
export type zh_TW_CharIndex = typeof import('@assets/gamedata/json/locales/zh_TW/charnameLinkID.json');
export type EX_CharIndex = typeof import('@assets/gamedata/json/locales/ex/charnameLinkID.json');

type AllCharIndexes = en_US_CharIndex & ja_JP_CharIndex & ko_KR_CharIndex & zh_CN_CharIndex & zh_TW_CharIndex & EX_CharIndex;
// type AllCharIndexNames = keyof (AllCharIndexes);
// type AllCharIndexIds = ValueOf<AllCharIndexes>;

type CharData = {
	en_US: Nullable<en_US_CharIndex>;
	ja_JP: Nullable<ja_JP_CharIndex>;
	ko_KR: Nullable<ko_KR_CharIndex>;
	zh_CN: Nullable<zh_CN_CharIndex>;
	zh_TW: Nullable<zh_TW_CharIndex>;
	ex: Nullable<EX_CharIndex>;
}

const Data_JSON = {
	// _base: '@assets/gamedata/json/locales/{locales}/',
	_base: 'locales/{locales}/',
	characters: 'characters/{id}.json',
	range: 'ranges/{id}.json',

	materials: 'items/materials/{type}/{id}.json',
	materials_types: 'items/types/{id}.json',
	materials_indexes: ['itemToType.json', 'typeToItems.json'],

	teams: 'teams/{id}.json',

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
	readonly imagePath = 'gamedata/img';

	constructor(
		public cachedImages: ImageDataService,
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
					ex: null,
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
			ex: await import('@assets/gamedata/json/locales/ex/charnameLinkID.json').then(getDefault),
		}
	}
	getCharId(charName: string, preferredLocale: Locales): [Nullable<string>, Locales]
	{
		// @ts-ignore
		if (this.charList[preferredLocale][charName])
			// @ts-ignore
			return [this.charList[preferredLocale][charName], preferredLocale];

		for (let locale in this.charList)
		{
			const key = this.charList[locale as Locales];
			if (key && key[charName as keyof typeof key])
				return [key[charName as keyof typeof key], locale as Locales];
		}
		return [null, preferredLocale];
	}
	async getCharData(charId: CHAR_NAME, preferredLocale: Locales = 'en_US')
	{
		const { _base, characters } = Data_JSON;
		const charPath = (_base + characters)
			.replace('{locales}', preferredLocale)
			.replace('{id}', charId);

		return this.JSONAssets.load(charPath, {
			lifetime: 600000,
			onExpire: (d) => {
				console.log('Destroyed', d.id, d);
			}
		}) as NullablePromise<Operator>;
	}
	async getFactionData(factionId: string, preferredLocale: Locales = 'en_US'): Promise<CharFaction>
	{
		const { _base, teams } = Data_JSON;
		const teamPath = (_base + teams)
			.replace('{locales}', preferredLocale)
			.replace('{id}', factionId);

		const value = await this.JSONAssets.load(teamPath, {
			lifetime: 600000,
			onExpire: (d) => {
				console.log('Destroyed', d.id, d);
			}
		}) as unknown as CharFaction;

		return value ?? defaultCharFaction;
	}
	async loadOpImages(charId: string, type: 'avatars' | 'portraits' | 'full', id?: string, ex?: boolean): NullablePromise<Blob>
	async loadOpImages(charId: CHAR_NAME, type: 'avatars' | 'portraits' | 'full', id?: string, ex = false): NullablePromise<Blob>
	{
		return this.resolveImage(`characters${ex ? '-ex' : ''}/${type}/${charId}${id || ''}.png`);
	}
	async loadFactionImage(faction: string): NullablePromise<Blob>
	{
		return this.resolveImage(`factions/logo_${faction}.png`);
	}
	async resolveImage(path: string): NullablePromise<Blob>
	{
		return new Promise((resolve) => {
			this.cachedImages
				.load(join(this.imagePath, path), { onExpire: console.log, onerror: () => resolve(null) })
				.then(v => resolve(v?.type.match('image') ? v : null));
		});
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
