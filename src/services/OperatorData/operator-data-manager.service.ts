import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { CHAR_NAME, Operator } from '@struct/Operator/Char';
import { CharFaction, defaultCharFaction } from '@struct/Operator/CharFaction';
import { CharCombatSkill } from '@struct/Operator/DetailedSkill';
import { CharTrustAttributes } from '@struct/Operator/CharTrustData';
import { AttackRange } from '@struct/Operator/AttackRange';
import { ItemMaterial } from "@struct/Item";
import { Locales } from '@struct/Basic';
import { join } from '@utils/PathUtils';
import {
    arrayAtMany,
    emptyFunc,
    ExcludeProp,
    getDefault,
    Nullable,
    NullablePromise,
    NullableRecord,
    Optional
} from '@utils/utils';
import { ImageDataService } from '@services/image-data.service';
import { JSONLoadService } from '@services/OperatorData/jsonload.service';
import { OpClass, TermDescription } from '@services/OperatorData/op-utils.service';
import { NotifService } from "@services/notif.service";
import { LogService } from '@services/log.service';


export type StatsPropMap = typeof import('@assets/gamedata/json/StatsPropMap.json');

export type ParamDesc = typeof import('@assets/gamedata/json/tl-data/paramDesc.json');
export type ParamSign = typeof import('@assets/gamedata/json/tl-data/paramSign.json');

export type MaterialImgMap = typeof import('@assets/gamedata/json/locales/zh_CN/items/idToImg.json');
export type MaterialTypeMap = typeof import('@assets/gamedata/json/locales/zh_CN/items/itemToType.json');

export type RichColor_zh_CN = typeof import('@assets/gamedata/json/locales/zh_CN/gamedata-const/richTextStyles.json');
export type RangeTables_zh_CN = typeof import('@assets/gamedata/json/locales/zh_CN/ranges/allRanges.json');

export type en_US_CharIndex = typeof import('@assets/gamedata/json/locales/en_US/charnameLinkID.json');
export type ja_JP_CharIndex = typeof import('@assets/gamedata/json/locales/ja_JP/charnameLinkID.json');
export type ko_KR_CharIndex = typeof import('@assets/gamedata/json/locales/ko_KR/charnameLinkID.json');
export type zh_CN_CharIndex = typeof import('@assets/gamedata/json/locales/zh_CN/charnameLinkID.json');
export type zh_TW_CharIndex = typeof import('@assets/gamedata/json/locales/zh_TW/charnameLinkID.json');
export type EX_CharIndex = typeof import('@assets/gamedata/json/locales/ex/charnameLinkID.json');

// type AllCharIndexes = en_US_CharIndex & ja_JP_CharIndex & ko_KR_CharIndex & zh_CN_CharIndex & zh_TW_CharIndex & EX_CharIndex;
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
    skill_combat: 'skills/combat/{id}.json',
    skill_infrastructure: 'skills/infrastructure/{id}.json',

	materials: 'items/materials/{type}/{id}.json',
	materials_types: 'items/types/{id}.json',
    mat_drop_rates: 'items/drop-rates/{id}.json',
	materials_indexes: ['itemToType.json', 'typeToItems.json'],
    term_descriptions: 'gamedata-const/termDescriptionDict.json',

	teams: 'teams/{id}.json',

    stage_overview: 'stages/stageLinkID.json',

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
	isLoaded = false;
	private _charList!: CharData;
    private _locale: Locales = 'en_US';
    private richTextStyles!: Nullable<RichColor_zh_CN>;
    private ranges!: Nullable<RangeTables_zh_CN>;
    private paramDesc!: Nullable<ParamDesc>;
    private paramSign!: Nullable<ParamSign>;
	private statPropsMap!: Nullable<StatsPropMap>;
    private matImgIdMap!: Nullable<MaterialImgMap>;
    private matTypeMap!: Nullable<MaterialTypeMap>;

	readonly imagePath = 'gamedata/img';

    get charList()
    {
        return this._charList;
    }

    setLocale(locale: Locales) {
        this._locale = locale;
    }
    get locale() {
        return this._locale;
    }
	constructor(
		public cachedImages: ImageDataService,
		private JSONAssets: JSONLoadService,
        private notif: NotifService,
        // private log: LogService,
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
				this._charList = {
					en_US: null,
					ja_JP: null,
					ko_KR: null,
					zh_CN: null,
					zh_TW: null,
					ex: null,
				};
			});
        void this.loadRichTextStyles();
        void this.loadRanges();
        void this.loadParamDesc();
        void this.loadParamSign();
        void this.loadStatPropsMap();
        void this.loadMatImgIdMap();
        void this.loadMatTypeMap();
	}

	private async loadAssets()
	{
		console.log('Loading operator index...');
		this._charList = {
			en_US: await import('@assets/gamedata/json/locales/en_US/charnameLinkID.json').then(getDefault),
			ja_JP: await import('@assets/gamedata/json/locales/ja_JP/charnameLinkID.json').then(getDefault),
			ko_KR: await import('@assets/gamedata/json/locales/ko_KR/charnameLinkID.json').then(getDefault),
			zh_CN: await import('@assets/gamedata/json/locales/zh_CN/charnameLinkID.json').then(getDefault),
			zh_TW: await import('@assets/gamedata/json/locales/zh_TW/charnameLinkID.json').then(getDefault),
			ex: await import('@assets/gamedata/json/locales/ex/charnameLinkID.json').then(getDefault),
		}
	}
    private async loadRichTextStyles()
    {
        console.log('Loading rich text styles...');
        try {
            this.richTextStyles = await import('@assets/gamedata/json/locales/zh_CN/gamedata-const/richTextStyles.json').then(getDefault);
            console.log('Rich text styles loaded.');
        }
        catch (e) {
            console.error('Failed to load rich text styles!');
            this.richTextStyles = null;
        }
    }
    private async loadRanges()
    {
        console.log('Loading ranges...');
        try {
            this.ranges = await import('@assets/gamedata/json/locales/zh_CN/ranges/allRanges.json').then(getDefault);
            console.log('Ranges loaded.');
        }
        catch (e) {
            console.error('Failed to load atk range data!');
            this.ranges = null;
        }
    }
    private async loadParamDesc()
    {
        console.log('Loading param notes...');
        try {
            this.paramDesc = await import('@assets/gamedata/json/tl-data/paramDesc.json').then(getDefault);
            console.log('Param notes loaded.');
        }
        catch (e) {
            console.error('Failed to load param notes!');
            this.paramDesc = null;
        }
    }
    private async loadParamSign()
    {
        console.log('Loading param signs...');
        try {
            this.paramSign = await import('@assets/gamedata/json/tl-data/paramSign.json').then(getDefault);
            console.log('Param signs loaded.');
        }
        catch (e) {
            console.error('Failed to load param signs!');
            this.paramSign = null;
        }
    }
    private async loadStatPropsMap()
    {
        console.log('Loading stat keys map...');
        try {
            this.statPropsMap = await import('@assets/gamedata/json/StatsPropMap.json').then(getDefault);
            console.log('Stat keys map loaded.');
        }
        catch (e) {
            console.error('Failed to load stat keys map!');
            this.statPropsMap = null;
        }
    }
    private async loadMatImgIdMap()
    {
        console.log('Loading mat img id map...');
        try {
            this.matImgIdMap = await import('@assets/gamedata/json/locales/zh_CN/items/idToImg.json').then(getDefault);
            console.log('Mat img id map loaded.');
        }
        catch (e) {
            console.error('Failed to load mat img id map!');
            this.matImgIdMap = null;
        }
    }
    private async loadMatTypeMap()
    {
        console.log('Loading mat type map...');
        try {
            this.matTypeMap = await import('@assets/gamedata/json/locales/zh_CN/items/itemToType.json').then(getDefault);
            console.log('Mat type map loaded.');
        }
        catch (e) {
            console.error('Failed to load mat type map!');
            this.matTypeMap = null;
        }
    }

    stages: NullableRecord<string, Record<string, { code: string, name: string }>> = {};
    async prefetchStages(preferredLocale: Locales = this.locale)
    {
        if (this.stages[preferredLocale])
            return;
        const { _base, stage_overview } = Data_JSON;
        this.stages[preferredLocale] = await this.JSONAssets.load(
            join(_base, stage_overview).replace('{locales}', preferredLocale),
            {
                lifetime: Number.MAX_SAFE_INTEGER,
                onExpire: emptyFunc
            }
        ) as Nullable<Record<string, { code: string, name: string }>>;
    }
    async getStageIdName(stageId: string, preferredLocale: Locales = this.locale): Promise<{ code: string, name: string }>
    {
        stageId = stageId.replace(/_(rep|perm)/g, '');
        if (!this.stages[preferredLocale])
            await this.prefetchStages(preferredLocale);
        if (this.stages[preferredLocale] && this.stages[preferredLocale]![stageId]) {
            const {code, name} = this.stages[preferredLocale]![stageId];
            return {
                code,
                name: `"${name}"`
            }
        }
        let _name;
        // if (stageId.match(/randomMaterial/))
        //     _name = stageId.match(/Rune/) ? `<CC#${(stageId.match(/\d+/) ?? [''])[0]} lootbox>` : `<lootbox>`;
        // if (stageId.match(/(.*)(_(rep|perm))/))
        //     return (await this.getStageIdName(stageId.replace(/(_(rep|perm))/, ''), preferredLocale));
        // else
            _name = (await this.getMaterialData(stageId, preferredLocale) ?? {name: '<unknown>'}).name;

        return {
            code: stageId,
            name: `${_name}`
        }
    }
	getCharId(charName: string, preferredLocale = this.locale): [Nullable<string>, Locales]
	{
        //TODO
		// @ts-ignore
		if (this._charList[preferredLocale][charName])
        {
            this.setLocale(preferredLocale);
            // @ts-ignore
            return [this._charList[preferredLocale][charName], preferredLocale];
        }

		for (let locale in this._charList)
		{
			const key = this._charList[locale as Locales];
			if (key && charName in key)
            {
                this.setLocale(locale as Locales);
                return [key[charName as keyof typeof key], locale as Locales];
            }
		}
		return [null, preferredLocale];
	}
	async getCharData(charId: CHAR_NAME, preferredLocale = this.locale)
	{
		const { _base, characters } = Data_JSON;
		const charPath = (_base + characters)
			.replace('{locales}', preferredLocale)
			.replace('{id}', charId);

		try {
            return await this.JSONAssets.load(charPath, {
                lifetime: 600000,
                onExpire: (d) => {
                    console.log('Destroyed', d.id, d);
                }
            }) as Nullable<Operator>;
        }
        catch (e) {
            // console.error(e);
            return null;
        }
	}
    async getCharCombatSkillData(skillId: string, preferredLocale = this.locale): NullablePromise<CharCombatSkill>
    {
        const { _base, skill_combat } = Data_JSON;
        const skillPath = (_base + skill_combat)
            .replace('{locales}', preferredLocale)
            .replace('{id}', skillId);

        try {
            return await this.JSONAssets.load(skillPath, {
                lifetime: 600000,
                onExpire: (d) => {
                    console.log('Destroyed', d.id, d);
                },
            }) as Nullable<CharCombatSkill>;
        }
        catch (e) {
            // console.error(e);
            return null;
        }
    }
	async getFactionData(factionId: string, preferredLocale = this.locale): Promise<CharFaction>
	{
		const { _base, teams } = Data_JSON;
		const teamPath = (_base + teams)
			.replace('{locales}', preferredLocale)
			.replace('{id}', factionId);

        try {
            const value = await this.JSONAssets.load(teamPath, {
                lifetime: 600000,
                onExpire: (d) => {
                    console.log('Destroyed', d.id, d);
                }
            }) as unknown as CharFaction;
            return value ?? defaultCharFaction;
        }
        catch (e) {
            // console.error(e);
            return defaultCharFaction;
        }
	}
    resolveItemType(itemId: string)
    {
        if (this.matTypeMap && itemId in this.matTypeMap)
            return this.matTypeMap[itemId as keyof MaterialTypeMap];
        return null;
    }
    async getMaterialData(materialId: string, preferredLocale = this.locale): NullablePromise<ItemMaterial>
    {
        const { _base, materials } = Data_JSON;
        const materialPath = (_base + materials)
            .replace('{locales}', preferredLocale)
            .replace('{type}', this.resolveItemType(materialId) ?? '')
            .replace('{id}', materialId);

        try {
            return await this.JSONAssets.load(materialPath, {
                lifetime: 600000,
                onExpire: (d) => {
                    console.log('Destroyed', d.id, d);
                }
            }) as Nullable<ItemMaterial>;
        }
        catch (e) {
            // console.error(e);
            return null;
        }
    }
    async getMaterialDropRate(itemId: string, preferredLocale = this.locale)
    {
        const { _base, mat_drop_rates } = Data_JSON;
        const path = join(_base, mat_drop_rates)
            .replace('{locales}', preferredLocale)
            .replace('{id}', itemId);
        try {
            return await this.JSONAssets.load(path, {
                lifetime: 6000000,
                onExpire: (d) => {
                    console.log('Destroyed', d.id, d);
                }
            }) as Nullable<Record<string, Record<string, number>>>;
        }
        catch (e) {
            // console.error(e);
            return null;
        }
    }

    async getTermDescriptionDict(preferredLocale = this.locale): Promise<Record<string, TermDescription>>
    {
        const { _base, term_descriptions } = Data_JSON;
        const termPath = (_base + term_descriptions)
            .replace('{locales}', preferredLocale);
        const res = await this.JSONAssets.load(termPath, {
            lifetime: 600000,
            onExpire: (d) => {
                console.log('Destroyed', d.id, d);
            }
        }) as Nullable<Record<string, TermDescription>>;
        return res ?? {};
    }
    getRangeData(rangeId: string): Nullable<AttackRange>
    {
        if (this.ranges && rangeId in this.ranges)
            return this.ranges[rangeId as keyof RangeTables_zh_CN];
        return null;
    }
    getRichTextStyles(tag: string): Nullable<string>
    {
        if (this.richTextStyles && tag in this.richTextStyles)
            return this.richTextStyles[tag as keyof RichColor_zh_CN];
        return null;
    }
    getParamDesc(param: string): Nullable<string> {
        if (this.paramDesc)
        {
            if (param in this.paramDesc.overrides)
                return this.paramDesc.overrides[param as keyof ParamDesc['overrides']];
            if (param in this.paramDesc && param !== 'overrides')
                return this.paramDesc[param as keyof ExcludeProp<ParamDesc, 'overrides'>];
        }
        return null;
    }
    getMatImg(matId: string): [MaterialImg, MaterialRarityImg]
    {
        if (this.matImgIdMap)
        {
            if (matId in this.matImgIdMap)
            {
                const { iconId, rarity } = this.matImgIdMap[matId as keyof MaterialImgMap];
                return [`/assets/gamedata/img/items/${iconId}.png`, `/assets/gamedata/img/items/bg/item-${rarity + 1}.png`]
            }
        }
        return ['/assets/img/ui/no_data_class.png', '/assets/img/ui/no_data_class.png'];
    }
    interpolateParamValue(param: string, value: number): [Nullable<boolean>, string]
    {
        if (this.paramSign)
        {
            const positive = value > 0;
            const { opposite, sign } = Object.create(this.paramSign[param as keyof ParamSign] ?? {});
            const out = `${sign ? (positive ? '+' : '-') : ''}${Math.abs(value)}`;
            switch (opposite)
            {
                case true: return [!positive, out];
                case false: return [positive, out];
                default: return [null, out];
            }
        }
        return [null, value.toString()];
    }
	async loadOpImages(charId: string, type: 'avatars' | 'portraits' | 'full', id?: string, ex?: boolean): NullablePromise<Blob>
	async loadOpImages(charId: CHAR_NAME, type: 'avatars' | 'portraits' | 'full', id?: string, ex = false): NullablePromise<Blob>
	{
		return this.resolveImage(`characters${ex ? '-ex' : ''}/${type}/${charId}${id || ''}.png`);
	}
    resolveOpImagePath(charId: string, type: 'avatars' | 'portraits' | 'full', id?: string, ex = false): string
    {
        return join(this.imagePath, `characters${ex ? '-ex' : ''}/${type}/${charId}${id || ''}.png`);
    }
	async loadFactionImage(faction: string): NullablePromise<Blob>
	{
		return this.resolveImage(`factions/logo_${faction}.png`);
	}
	async resolveImage(path: string): NullablePromise<Blob>
	{
		return new Promise((resolve) => {
			this.cachedImages
				.load(join(this.imagePath, path), { onExpire: emptyFunc, onerror: () => resolve(null) })
				.then(v => resolve(v?.type.match('image') ? v : null));
		});
	}
	async humanResource(charNameCN: string)
	{
		return await this.JSONAssets.load(`tl-data/human_resource/${charNameCN}.json`, { onExpire: emptyFunc });
	}

	resolveTrustData(trustStatsData: Operator['favorKeyFrames'])
	{
		let out: Optional<CharTrustAttributes> = {};
		const [minTrust, maxTrust] = arrayAtMany(trustStatsData, 0, -1).map(v => v ? v : null);
		if (minTrust && maxTrust)
			for (const key in maxTrust.data)
			{
				type TrustAttrKey = keyof CharTrustAttributes;
				const
					minAttr = minTrust.data[key as TrustAttrKey],
					maxAttr = maxTrust.data[key as TrustAttrKey];
				if (minAttr !== maxAttr)
				{
					if (typeof maxAttr === 'number' && typeof minAttr === 'number')
						// @ts-ignore
						out[key as TrustAttrKey] = maxAttr - minAttr;
					else
						// @ts-ignore
						out[key as TrustAttrKey] = maxAttr;
				}
			}
		const refThis = this;
		return Object.assign(
			out, {
				maxFavorLevel: maxTrust?.level ?? 0,
				toString()
				{
					const str: string[] = [];
					for (const [k, v] of Object.entries(out))
					{
						if (['toString', 'maxFavorLevel'].includes(k)) continue;
                        if (refThis.statPropsMap)
                        {
                            type keyNum = keyof StatsPropMap['num'];
                            type keyBool = keyof StatsPropMap['bool'];
                            if (typeof v === 'boolean')
                            {
                                str.push(`${v ? '+' : '-'}${refThis.statPropsMap.bool[k as keyBool]}`);
                                continue;
                            }
                            const keyName = refThis.statPropsMap.num[k as keyNum];
                            if (typeof keyName === 'string')
                                str.push(`${keyName}\u205F${v > 0 ? '+' : '-'}${v}`);
                            else str.push(`${keyName.key}\u205F${v > 0 ? '+' : '-'}${v}${keyName.unit}`);
                        }
                        else
                            str.push(`${k}\u205F${v > 0 ? '+' : '-'}${v}`);
					}
					return str.join('\u2009|\u2009');
				}
			});
	}
	async resolveClassName(mainClass: Operator['profession']): NullablePromise<Record<string, OpClass>>
	{
		const _class = await this.JSONAssets.load(`tl-data/classes.json`);
		if (_class)
			if (_class[mainClass])
				return _class[mainClass] as Record<string, OpClass>;
		return null;
	}
}

type MaterialImg = string;
type MaterialRarityImg = string;
