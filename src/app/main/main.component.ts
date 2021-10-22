import { Component, OnInit } from '@angular/core';
import { BrowserWindow } from '@utils/interfaces/common';
import { request } from '@octokit/request';

import { repository } from '@utils/package';
import GitCommit from '@utils/interfaces/GitCommit';

@Component({
	selector: 'app-home',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

	readonly appVersion = (window as BrowserWindow).__env.AppVersion;
	currentMenuOptions = menuOptions;

	constructor() {}

	ngOnInit(): void {
		this.loadCommit();
	}

	commitString!: string;
	startAwaitAnim()
	{
		const sAwait = 'Hold on, fetching git commits';
		let i = 0;
		return setInterval(() => {
			this.commitString = sAwait + '.'.repeat(i);
			if (i === 3) i = -1;
			i++;
		}, 200);
	}
	async loadCommit(fetchNewest = false)
	{
		const ngTag = document.getElementById('latest-commit-text')?.attributes[0].localName!;
		const data = GitUtils.loadFromCache();
		if (data && !fetchNewest)
			document.getElementById('latest-commit-text')!.innerHTML = (await GitUtils.generateHTML(data as Tuple7Array))(ngTag);
		else
		{
			const inv = this.startAwaitAnim();
			const res = await GitUtils.fetchRecentRepo();
			if (res)
			{
				const { sha, author: { name, date, url: auURL, username }, url, message: cMessage } = res;
				setTimeout(async () => {
					clearInterval(inv);
					document.getElementById('latest-commit-text')!.innerHTML = (await GitUtils.generateHTML([cMessage, date, sha, url, name, username, auURL] as Tuple7Array))(ngTag) as string;
				}, 1500);
				// this.commitString = message;
				GitUtils.saveMultipleCacheStorageAttr([
					['LastRefresh', new Date().toISOString()],
					['Message', new String(cMessage).valueOf()],
					['Date', new String(date).valueOf()],
					['Hash', new String(sha).valueOf()],
					['URL', new String(url).valueOf()],
					['AuthorName', new String(name).valueOf()],
					['AuthorUsrname', new String(username).valueOf()],
					['AuthorURL', new String(auURL).valueOf()]
				]);
				setTimeout(() => {
					GitUtils.deleteCache();
					this.loadCommit();
				}, GitUtils.CACHE_TIMEOUT_MS);
				return;
			}
			GitUtils.deleteCache();
			this.commitString = 'Encounter an error while fetching git.';
		}
		return;
	}

}

type Tuple7Array = [string, string, string, string, string, string, string];

class GitUtils {
	static readonly CACHE_TIMEOUT_MS = 600000;
	static loadCacheStorageAttr(name: string): string | null {
		return localStorage.getItem(`cache:LatestCommit@${name}`);
	}
	static deleteCache()
	{
		GitUtils.deleteMultipleCacheStorageAttr(['LastRefresh', 'Message', 'Date', 'Hash', 'URL', 'AuthorName', 'AuthorUsrname', 'AuthorURL']);
	}
	static deleteMultipleCacheStorageAttr(names: string[])
	{
		for (const name in names)
			GitUtils.deleteCacheStorageAttr(name);
	}
	static deleteCacheStorageAttr(name: string) {
		return localStorage.removeItem(`cache:LatestCommit@${name}`);
	}
	static saveMultipleCacheStorageAttr(query: [string, string][]) {
		for (const [name, value] of query)
			GitUtils.saveCacheStorageAttr(name, value);
	}
	static saveCacheStorageAttr(name: string, value: string) {
		return localStorage.setItem(`cache:LatestCommit@${name}`, value);
	}
	static loadFromCache()
	{
		const
			cMessage = GitUtils.loadCacheStorageAttr('Message')!,
			cDate = GitUtils.loadCacheStorageAttr('Date')!,
			cTimestamp = GitUtils.loadCacheStorageAttr('LastRefresh')!,
			cHash = GitUtils.loadCacheStorageAttr('Hash')!,
			cURL = GitUtils.loadCacheStorageAttr('URL')!,
			cAuthorName = GitUtils.loadCacheStorageAttr('AuthorName')!,
			cAuthorUsrname = GitUtils.loadCacheStorageAttr('AuthorUsername')!,
			cAuthorURL = GitUtils.loadCacheStorageAttr('AuthorURL')!;

		if (cTimestamp && cHash)
		{
			const age = Date.now() - new Date(cTimestamp).getTime();
			if (Number.isNaN(age) || age > GitUtils.CACHE_TIMEOUT_MS)
				return null;
			return [ cMessage, cDate, cHash, cURL, cAuthorName, cAuthorUsrname, cAuthorURL ] as Tuple7Array;
		}
		return null;
	}
	static async generateHTML(data: Tuple7Array)
	{
		const [cMessage, cDate, cHash, cURL, cAuthorName, cAuthorUsrname, cAuthorURL] = data;
		return (ngTag: string) => [
			`<commit-time ${ngTag} data-title="${new Date(cDate).toUTCString()}">${cDate.substr(0, 11)}<i style="filter: brightness(30%);font-weight: lighter;">${cDate.substr(11, cDate.length)}</i></commit-time>`,
			`&nbsp;`,
			`<a ${ngTag}
				id="commit-author"
				href=${cAuthorURL && cAuthorUsrname ? `"${cAuthorURL}"` : `"#"`}
				data-title="Go to ${cAuthorUsrname}'s Git profile ->"
				target="_blank"
			>${cAuthorName}</a>`,
			`<t style="font-weight:lighter">&#8201;|&#8201;</t>`,
			`<a ${ngTag}
				id="commit-hash"
				href="${cURL}"
				data-title="Go to commit's page ->"
				target="_blank"
			><i style="filter: brightness(30%);font-weight: lighter;">${cHash.substr(0, 7)}</i></a>&#8201;`,
			`&nbsp;`,
			`<commit-message ${ngTag} ${cMessage.length > 44 ? `data-title="${cMessage.toString()}" .overflow` : ''}>${cMessage.length > 44 ? cMessage.substr(0, 41) + '...' : cMessage}</commit-message>`
		].join('');
	}
	static async fetchRecentRepo()
	{
		const res = await request(`GET /repos/${repository.url.substr('https://github.com/'.length, repository.url.length)}/commits`);
		if (res.status === 200)
		{
			const { commit, author: { login: username, html_url: usrURL }, html_url, sha } = res.data[0];
			return Object.assign(commit, {
				sha,
				url: html_url,
				author: Object.assign(commit.author, { username, url: usrURL })
			}) as GitCommit;
		}

		return null;
	}
}

const menuOptions: MenuItems[] = [
	{
		name: 'Combat',
		routerTarget: '/combat',
		CSSTargetAccessor: 'combat',
		associatedBackgoundURL: 'G1_Thumbnail.png',
		description: 'Know your enemies before fighting them.',
		available: false,
	},
	{
		name: 'Operators (x)',
		routerTarget: '/operators',
		CSSTargetAccessor: 'opInfo',
		associatedBackgoundURL: 'G3_Thumbnail.png',
		description: 'Under construction.',
		// description: 'Details of operators / factions.',
		available: true,
	},
	{
		name: 'Recruitment',
		routerTarget: '/recruit-sim',
		CSSTargetAccessor: 'recruit',
		associatedBackgoundURL: 'G2_Thumbnail.png',
		description: 'Try your luck?',
		available: false,
	},
	// {
	// 	name: 'Extra',
	// 	CSSTargetAccessor: 'extra',
	// 	associatedBackgoundURL: '',
	// 	description: 'Coming soon!',
	// 	available: true,
	// },
	// {
	// 	name: 'Extra',
	// 	CSSTargetAccessor: 'extra_2',
	// 	associatedBackgoundURL: '',
	// 	description: 'Coming soon!',
	// 	available: false,
	// },
]

interface MenuItems {
	name: string;
	CSSTargetAccessor?: string;
	routerTarget?: string;
	// from assets/img/menu folder
	associatedBackgoundURL?: string;
	description: string;
	available: boolean;
}
