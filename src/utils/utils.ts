export function waitAsync(ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitSync(ms = 0) {
	const timeout = Date.now() + ms;
	while (Date.now() < timeout);
	return;
}

export const emptyFunc = (...args: any[]) => {};

export type Nullable<T> = T | null;
export type ValueOf<T> = T[keyof T];