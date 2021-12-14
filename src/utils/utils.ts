export function waitAsync(ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export function waitSync(ms = 0) {
	const timeout = Date.now() + ms;
	while (Date.now() < timeout);
	return;
}

export function isFullScreen()
{
	return window.innerWidth === screen.width && window.innerHeight === screen.height;
}

export const emptyFunc = (...args: any[]) => {};

export type Nullable<T> = T | null;
export type NullablePromise<T> = Promise<Nullable<T>>;
export type ValueOf<T> = T[keyof T];