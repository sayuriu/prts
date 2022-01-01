import { Injectable } from '@angular/core';
import { CacheXMLBasedService, XHRModOptions, Entity } from '@services/CacheXMLBasedService';
import { join } from '@utils/PathUtils';
import { emptyFunc, NullablePromise } from '@utils/utils';

// This will be limited to components that rely on heavy uses of images.
@Injectable({
	providedIn: 'root'
})
export class ImageDataService extends CacheXMLBasedService<Blob> {
	readonly BASE_PATH = 'assets/gamedata/img';
	readonly CACHE_TIMEOUT_MS = 600000;
	constructor()
	{
		super();
	}
	load(path: string, options: XHRModOptions<Blob>): NullablePromise<Blob> {
		options.responseType = 'blob';
		options.saveMimeType = 'image/png';
		return this._load(join(this.BASE_PATH, path), options);
	}
	protected save(path: string, data: Blob, timeout = this.CACHE_TIMEOUT_MS, onExpires: (data: Entity<Blob>) => void = emptyFunc)
	{
		console.log(data);
		this._save(join(this.BASE_PATH, path), data, timeout, onExpires);
	}
	protected renew(path: string): void {
		this._renew(path);
	}
}
