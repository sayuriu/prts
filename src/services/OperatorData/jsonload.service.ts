import { Injectable } from '@angular/core';
import { defaultOptions } from '@utils/Fetch';
import { join } from '@utils/PathUtils';
import { emptyFunc } from '@utils/utils';
import { CachedXMLHttpBasedService, Entity, XHRModOptions } from '@utils/CachedXMLHttpBasedService';

type JSONBasedObject = Record<string | number, unknown>;
class JSONEntity extends Entity<JSONBasedObject> {}

@Injectable({
	providedIn: 'root'
})
export class JSONLoadService extends CachedXMLHttpBasedService<JSONBasedObject> {
	readonly BASE_PATH = 'assets/gamedata/json';
	readonly CACHE_TIMEOUT_MS = 600000;
	constructor()
	{
		super();
	}
	load(path: string, options: XHRModOptions<JSONBasedObject>  = defaultOptions)
	{
		options.responseType = 'json';
		return this._load(join(this.BASE_PATH, path), options);
	}
	protected save(path: string, data: JSONBasedObject, timeout = this.CACHE_TIMEOUT_MS, onExpires: (data: JSONEntity) => void = emptyFunc)
	{
		this._save(join(this.BASE_PATH, path), data, timeout, onExpires);
	}
	protected renew(path: string)
	{
		this._renew(path);
	}
}
