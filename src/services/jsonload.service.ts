import { Injectable } from '@angular/core';
import { Expire } from '@utils/DoExpire';
import { defaultOptions, Fetch, XHROptions } from '@utils/Fetch';
import { join } from '@utils/PathUtils';
import { emptyFunc } from '@utils/utils';
import { CacheXMLBaseService, Entity, XHRModOptions } from './CacheXMLBasedService';

// export class _JSONLoadService {
// 	// path based on /src/assets/json
// 	readonly BASE_PATH = 'assets/gamedata/json';
// 	readonly CACHE_TIMEOUT_MS = 600000;
// 	private _cache = new Map<string, [JSONEntity, number]>();
// 	load(path: string, options: XHROptions = {})
// 	{
// 		if (this._cache.has(path) && !options.force)
// 		{
// 			const data = this._cache.get(path)![0];
// 			this.save(path, data);
// 			return data;
// 		}
// 		options.responseType = 'json';
// 		return new Promise((resolve, reject) => {
// 			Fetch(join(this.BASE_PATH, path), options)
// 				.then(value => {
// 					this.save(path, value as JSONEntity);
// 					resolve(value);
// 				})
// 				.catch(reject);
// 		})
// 	}
// 	save(path: string, data: JSONEntity)
// 	{
// 		this._cache.set(
// 			path, [
// 				data,
// 				setTimeout(() => {
// 					const data = this._cache.get(path)![0];
// 					data.onExpires(data);
// 					this._cache.delete(path);
// 				})
// 			]
// 		);
// 	}
// }
// class _JSONEntity implements Expire<JSONEntity> {
// 	readonly key: string;
// 	readonly value: unknown;
// 	readonly instantiatedTimestamp: number;
// 	readonly onExpires: (data: JSONEntity) => void;
//
// 	constructor(key: string, value: unknown, onExpires: (data: JSONEntity) => void = emptyFunc)
// 	{
// 		this.key = key;
// 		this.value = value;
// 		this.instantiatedTimestamp = Date.now();
// 		this.onExpires = onExpires;
// 	}
// }

type JSONBasedObject = Record<string | number, unknown>;
class JSONEntity extends Entity<JSONBasedObject> {}

@Injectable({
	providedIn: 'root'
})
export class JSONLoadService extends CacheXMLBaseService<JSONBasedObject> {
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