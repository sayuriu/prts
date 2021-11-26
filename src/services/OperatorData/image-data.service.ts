import { Injectable } from '@angular/core';
import { emptyFunc } from '@utils/utils';

// This will be limited to components that rely on heavy uses of images.
@Injectable({
	providedIn: 'root'
})
export class ImageDataService {
	private _cache: Map<string, [ImageData, number]> = new Map();
	static CACHE_TIMEOUT_MS = 600000; // 10 minutes
	constructor() { }
	load(id: string)
	{
		const res = this._cache.get(id);
		if (res?.length)
		{
			this.save(id, res[0]);
			return res[0];
		}
		return null;
	}
	save(id: string, data: ImageData)
	{
		this._cache.set(id, [data, setTimeout(() => {
			const data = this._cache.get(id)!;
			data[0].onExpires(data[0]);
			this._cache.delete(id);

		}, data.lifeTime) as unknown as number]);
	}
}

interface Expire
{
	timeout?: number;
	onExpires?: (data: ImageData) => void;
}
export class ImageData
{
	id: string;
	time: number;
	rawData: Blob;
	lifeTime: number;
	onExpires: (data: this) => void;
	constructor(id: string, rawData: Blob, expiry: Expire)
	{
		this.id = id;
		this.time = Date.now();
		this.rawData = rawData;
		this.lifeTime = expiry.timeout || ImageDataService.CACHE_TIMEOUT_MS;
		this.onExpires = (expiry.onExpires ?? emptyFunc);
	}
}