import { Injectable } from '@angular/core';
import { Locales } from '@root/parser/struct/Basic';
import { Subject } from 'rxjs';
import { ImageDataService } from './image-data.service';

type CharData = {
	en_US: typeof import('@assets/gamedata/json/locales/en_US/charnameLinkID.json'),
	ja_JP: typeof import('@assets/gamedata/json/locales/ja_JP/charnameLinkID.json'),
	ko_KR: typeof import('@assets/gamedata/json/locales/ko_KR/charnameLinkID.json'),
	zh_CN: typeof import('@assets/gamedata/json/locales/zh_CN/charnameLinkID.json'),
	zh_TW: typeof import('@assets/gamedata/json/locales/zh_TW/charnameLinkID.json'),
}

class OperatorAssetData
{
	charList!: CharData;
	isLoaded = false;
	allEntry!: CharData[Locales];
	constructor()
	{
		this.loadAssets()
			.then(() => this.isLoaded = true)
			.catch(() => console.error('Failed to load operator name assets!'));
	}
	async loadAssets()
	{
		this.charList = {
			en_US: await import('@assets/gamedata/json/locales/en_US/charnameLinkID.json').then(getDefault),
			ja_JP: await import('@assets/gamedata/json/locales/ja_JP/charnameLinkID.json').then(getDefault),
			ko_KR: await import('@assets/gamedata/json/locales/ko_KR/charnameLinkID.json').then(getDefault),
			zh_CN: await import('@assets/gamedata/json/locales/zh_CN/charnameLinkID.json').then(getDefault),
			zh_TW: await import('@assets/gamedata/json/locales/zh_TW/charnameLinkID.json').then(getDefault),
		}
	}
}

@Injectable({
	providedIn: 'root'
})
export class OperatorDataManagerService {
	events: Subject<this>;
	constructor(private cachedImages: ImageDataService) {
		this.events = new Subject();
	}
}

interface HasDefault<T extends unknown> extends Record<string, any>
{
	default: T;
}

function getDefault<T>(obj: T)
{
	return (obj as unknown as HasDefault<T>).default;
}
