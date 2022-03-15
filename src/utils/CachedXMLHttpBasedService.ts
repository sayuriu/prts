import { Expire } from "@utils/DoExpire";
import { XHROptions, Fetch } from "@utils/Fetch";
import { emptyFunc, Nullable, NullablePromise } from "@utils/utils";

interface EntityExpireCallback<T> {
	onExpire: (entity: Entity<T>) => void;
}

export type XHRModOptions<T> = XHROptions<T> & EntityExpireCallback<T>;

export abstract class CachedXMLHttpBasedService<E>
{
	abstract readonly CACHE_TIMEOUT_MS: number;
	protected _cache = new Map<string, [Entity<E>, number]>();
	protected abstract load(path: string, options: XHRModOptions<E>): NullablePromise<E>;
	protected abstract load(id: string, options: XHRModOptions<E>): NullablePromise<E>;
	protected _load(id: string, options: XHRModOptions<E>): NullablePromise<E>
	{
		return new Promise((resolve, reject) => {
			if (this._cache.has(id) && !options.force)
			{
				const data = this._cache.get(id)![0];
				if (Date.now() - (data.instantiatedTimestamp + data.lifetime) < 5000) this.renew(id);
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
		});
	}
	protected abstract save(path: string, data: E, timeout?: number, onExpire?: (data: Entity<E>) => void): void;
	protected abstract save(id  : string, data: E, timeout?: number, onExpire?: (data: Entity<E>) => void): void;
	protected _save(instanceID: string | Entity<E>, data: Nullable<E> = null, timeout = -1, onExpire: (data: Entity<E>) => void = emptyFunc)
	{
        const isInstance = instanceID instanceof Entity;
        let entity = isInstance ? instanceID : new Entity<E>(instanceID, data, timeout, onExpire);
		this._cache.set(
            isInstance ? instanceID.id : instanceID,
           [
               entity,
               setTimeout(() => {
                   entity.onExpire(entity);
                   this._cache.delete(isInstance ? instanceID.id : instanceID);
               }, timeout) as unknown as number
           ]
        );
	}
	protected abstract renew(path: string): void;
	protected abstract renew(id: string): void;
	protected _renew(id: string)
	{
		const existSession = this._cache.get(id);
        if (!existSession) return false;
		if (existSession[1]) clearTimeout(existSession[1]);
        this._save(existSession[0]);
        return true;
	}
}

export class Entity<T extends unknown> implements Expire<Entity<T>>
{
	readonly id: string;
	readonly value: Nullable<T>;
	readonly instantiatedTimestamp: number;
	readonly onExpire: (entity: Entity<T>) => void;

	constructor(id: string, data: Nullable<T>, public readonly lifetime: number, onExpire: (data: Entity<T>) => void = emptyFunc)
	{
		this.id = id;
		this.value = data;
		this.instantiatedTimestamp = Date.now();
		this.onExpire = onExpire;
	}
}
