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
export function normalizeArrayIndex(index: number, length: number): number
{
	return index < 0 ? normalizeArrayIndex(length + index, length) : index;
}
export function arrayAtMany<T>(array: T[], ...indexes: number[])
{
	const out: Nullable<T>[] = [];
	for (const index of indexes)
		out[normalizeArrayIndex(index, array.length)] = arrayAt(array, index);

	return out;
}
export function arrayAt<T>(arr: T[], index: number): Nullable<T>
{
	if (index < 0)
	{
		index = arr.length + index;
		return arrayAt(arr, index);
	}
	return [...new Array(...arr).values()][index] ?? null;
}

export const emptyFunc = () => {};

export type Nullable<T> = T | null;
export type NullablePromise<T> = Promise<Nullable<T>>;
export type ValueOf<T> = T[keyof T];
export type ExcludeProp<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type Optional<T> = { [P in keyof T]?: T[P] };
export type Concrete<T> = { [P in keyof T]-?: T[P] };