export const AllowedURLParams = {
	'/': [],
	'/home': [],
	'/operators': ['opname', 'opid', 'locale'],
}

export type AllowedURLParamMap = Record<string, string[]>