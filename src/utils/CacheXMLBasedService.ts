import { Expire } from "@utils/DoExpire";
import { XHROptions, Fetch } from "@utils/Fetch";
import { emptyFunc, Nullable, NullablePromise } from "@utils/utils";

interface EntityExpireCallback<T> {
	onExpire: (entity: Entity<T>) => void;
}

export type XHRModOptions<T> = XHROptions<T> & EntityExpireCallback<T>;

export abstract class CacheXMLBasedService<E>
{
	abstract readonly CACHE_TIMEOUT_MS: number;
	protected _cache = new Map<string, Entity<E>>();
	protected abstract load(path: string, options: XHRModOptions<E>): NullablePromise<E>;
	protected abstract load(id: string, options: XHRModOptions<E>): NullablePromise<E>;
	protected _load(id: string, options: XHRModOptions<E>): NullablePromise<E>
	{
		return new Promise((resolve, reject) => {
			if (this._cache.has(id) && !options.force)
			{
				const data = this._cache.get(id)!;
				if (Date.now() - (data.instantiatedTimestamp + data.lifetime) < 60000) this.renew(id);
				return resolve(data.value);
			}
			Fetch<E>(id, options)
				.then((value) => {
					this.save(id, value, options.lifetime, options.onExpire);
					resolve(value);
				})
				.catch(e => {
                    // console.error(e);
                    reject(e);
                });
		})
	}
	protected abstract save(path: string, data: E, timeout?: number, onExpire?: (data: Entity<E>) => void): void;
	protected abstract save(id  : string, data: E, timeout?: number, onExpire?: (data: Entity<E>) => void): void;
	protected _save(id: string, data: E, timeout: number, onExpire: (data: Entity<E>) => void = emptyFunc)
	{
		this._cache.set(
			id,
			new Entity<E>(
				id,
				data,
				timeout,
				setTimeout(() => {
					const _data = this._cache.get(id)!;
					_data.onExpire(_data);
					this._cache.delete(id);
				}, timeout) as unknown as number,
				onExpire
			),
		);
	}
	protected abstract renew(path: string): void;
	protected abstract renew(id: string): void;
	protected _renew(id: string)
	{
		const existSession = this._cache.get(id);
		if (existSession?.timeoutId)
			clearTimeout(existSession.timeoutId);
		this._cache.set(
			id,
			new Entity<E>(
				'',
				null,
				0,
				setTimeout(() => {
					const data = this._cache.get(id)!;
					data.onExpire(data);
					this._cache.delete(id);
				}, existSession?.lifetime ?? 0) as unknown as number,
				undefined,
				existSession
			)
		);
	}
}

export class Entity<T extends unknown> implements Expire<Entity<T>>
{
	readonly id: string;
	readonly value: Nullable<T>;
	private _instantiatedTimestamp: number;
	readonly onExpire: (entity: Entity<T>) => void;

	constructor(id: string, data: Nullable<T>, public readonly lifetime: number, public timeoutId: number, onExpire: (data: Entity<T>) => void = emptyFunc, existingInstance?: Entity<T>)
	{
		this.id = id;
		this.value = data;
		this._instantiatedTimestamp = Date.now();
		this.onExpire = onExpire;
		if (existingInstance)
			Object.assign(this, existingInstance);
	}
	get instantiatedTimestamp()
	{
		return this._instantiatedTimestamp;
	}
}
