import { Expire } from "@utils/DoExpire";
import { XHROptions, Fetch } from "@utils/Fetch";
import { emptyFunc, Nullable } from "@utils/utils";

interface EntityExpireCallback<T> {
	onExpire: (entity: Entity<T>) => void;
}

export type XHRModOptions<T> = XHROptions<T> & EntityExpireCallback<T>;

export abstract class CacheXMLBaseService<E>
{
	abstract readonly CACHE_TIMEOUT_MS: number;
	protected _cache = new Map<string, Entity<E>>();
	protected abstract load(path: string, options: XHRModOptions<E>): Promise<Nullable<E>>
	protected abstract load(id: string, options: XHRModOptions<E>): Promise<Nullable<E>>
	protected _load(id: string, options: XHRModOptions<E>): Promise<Nullable<E>>
	{
		if (this._cache.has(id) && !options.force)
		{
			const data = this._cache.get(id)!;
			this.renew(id);
			return Promise.resolve(data.value);
		}
		return new Promise((resolve, reject) => {
			Fetch<E>(id, options)
				.then((value) => {
					this.save(id, value, options.lifetime, options.onExpire);
					resolve(value);
				})
				.catch(reject);
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
				setTimeout(() => {
					const data = this._cache.get(id)!;
					data.onExpire(data);
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

	constructor(id: string, data: Nullable<T>, public timeoutId: number, onExpire: (data: Entity<T>) => void = emptyFunc, existingInstance?: Entity<T>)
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