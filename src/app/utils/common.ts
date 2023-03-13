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

export const lightOrDark = (colorHex: string) => {
    const r = parseInt(colorHex.substring(0, 2), 16);
    const g = parseInt(colorHex.substring(2, 4), 16);
    const b = parseInt(colorHex.substring(4, 6), 16);
    const uicolors = [r / 255, g / 255, b / 255];
    const c = uicolors.map((col) => {
        if (col <= 0.03928) {
            return col / 12.92;
        }
        return Math.pow((col + 0.055) / 1.055, 2.4);
    });
    const l = 0.2126 * c[0] + 0.7152 * c[1] + 0.0722 * c[2];
    return l > 0.179 ? 'light' : 'dark';
}
