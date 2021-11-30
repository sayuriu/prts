import { Injectable } from '@angular/core';
import { Expire } from '@utils/DoExpire';
import { XHROptions } from '@utils/Fetch';
import { emptyFunc } from '@utils/utils';

// This will be limited to components that rely on heavy uses of images.
@Injectable({
	providedIn: 'root'
})
export class ImageDataService {
// 	private _cache: Map<string, [ImageEntity, number]> = new Map();
// 	static CACHE_TIMEOUT_MS = 600000; // 10 minutes
// 	constructor() { }
// 	load(id: string, options: XHROptions = {})
// 	{
//
// 	}
// 	save(id: string, data: ImageEntity)
// 	{
//
// 	}
}

// class ImageEntity implements Expire<ImageEntity>
// {
// 	readonly id: string;
// 	readonly data: string;
// 	readonly instantiatedTimestamp: number;
// 	readonly onExpire: (entity: ImageEntity) => void;
//
// 	constructor(id: string, data: string, onExpire: (entity: ImageEntity) => void = emptyFunc)
// 	{
// 		this.id = id;
// 		this.data = data;
// 		this.instantiatedTimestamp = Date.now();
// 		this.onExpire = onExpire;
// 	}
// }
//
// type ResponseDataT = 'blob' | 'arraybuffer' | 'text';
//
// export class ImageLoader {
// 	load(
// 		url: string,
// 		responseType: ResponseDataT = 'arraybuffer',
// 		callbacks: CallbackOptions = {},
// 	)
// 	{
// 		return new Promise((resolve, reject) => {
// 			Fetch(
// 				url,
// 				Object.assign({ responseType }, callbacks),
// 			)
// 			.then((value: XMLHttpRequest['response']) => resolve(window.URL.createObjectURL(new Blob([value]))))
// 			.catch(reject);
// 		});
// 	}
// }