export type Optional<T> = { [P in keyof T]?: T[P]; }
export type Concrete<T> = { [P in keyof T]-?: T[P]; }

export type Nullable<T> = T | null;
export type NullablePromise<T> = Promise<Nullable<T>>;
export const findNearestMultiple = (multiplier: number, target: number, isGreater = true) =>
    multiplier * Math[isGreater ? 'ceil' : 'floor'](target / multiplier);
export const nullTryReturn = <T, A>(action: (...args: A[]) => T, ...args: A[]): Nullable<T> => {
    try {
        return action(...args);
    } catch(_) {
        return null;
    }
};
export const localGet = (key: string): Nullable<string> => nullTryReturn((k) => localStorage.getItem(k), key);
export const localSet = (key: string, value: string): void => void nullTryReturn((k, v) => localStorage.setItem(k, v), key, value);
export const localRemove = (key: string): void => void nullTryReturn((k) => localStorage.removeItem(k), key);
export const wait = (ms: number) => { const timeout = Date.now() + ms; while (Date.now() < timeout) {} };
export const waitAsync = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
export const emptyFunc = () => {};

export const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
