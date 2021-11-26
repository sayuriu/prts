export function waitAsync(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export const emptyFunc = (...args: any[]) => {};

export type Nullable<T> = T | null;
export type ValueOf<T> = T[keyof T];