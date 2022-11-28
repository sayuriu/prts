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

export const whichWider = () => (window.innerWidth > window.innerHeight) ? 'width' : 'height';
export const joinClasses = (...classes: string[]) => classes.filter(Boolean).join(' ');
export const joinModuleClasses = (moduleStyle: Record<string, string>) => (...classes: string[]) => joinClasses(...classes.map(c => moduleStyle[c]));

export const wait = (ms: number) => { const timeout = Date.now() + ms; while (Date.now() < timeout) {} };
export const waitAsync = (ms: number): Promise<void> => new Promise(resolve => setTimeout(resolve, ms));
export const emptyFunc = () => {};
