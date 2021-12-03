interface Changelog {
	date: string;
	version?: string;
	changes: string[];
}

export const Changelogs: Changelog[]= [
	{
		date: '12-04-21',
		version: '1.0.30b@120421',
		changes: [
			'[Bug-Fixed] Callstack error',
			'Fixed. Caused by double event listener.',
			'Mascot is done now, but not really finished. I will plan to add more variants in the future.',
			'Well, this changelog list wack. I will try fixing it by tomorrow.',
		]
	},
	{
		date: '12-02-21',
		version: '1.0.30b@120221',
		changes: [
			'[Bug] Callstack error.',
			'Idea for a new chibi mascot.'
		]
	},
	{
		date: '12-01-21',
		version: '1.0.30b@120121',
		changes: [
			'Mascot now reacts on events instead of pure CSS selectors.'
		]
	}
]