type PrependNextNum<A extends Array<unknown>> = A['length'] extends infer T ? ((t: T, ...a: A) => void) extends ((...x: infer X) => void) ? X : never : never;
type EnumerateInternal<A extends Array<unknown>, N extends number> = { 0: A, 1: EnumerateInternal<PrependNextNum<A>, N> }[N extends A['length'] ? 0 : 1];
export type Enumerate<N extends number> = EnumerateInternal<[], N> extends (infer E)[] ? E : never;
export type Range<FROM extends number, TO extends number> = Exclude<Enumerate<TO>, Enumerate<FROM>>;

export namespace Range {
	export type $0_2 = Range<0, 2>;
	export type $0_5 = Range<0, 5>;
}

export interface WithNameAndDesc
{
	name: string;
	description: string;
}

export type HasCandidate<P> = { candidates: P[] };

export const AvailableLocales = {
	'en_US': true,
	'ja_JP': true,
	'ko_KR': true,
	'zh_CN': true,
	// 'zh_TW': true,
};

export type Locales = keyof typeof AvailableLocales;
