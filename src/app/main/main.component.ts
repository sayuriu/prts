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
	currentTheme = document.documentElement.getAttribute('theme');
	constructor() {}

	ngOnInit(): void {
		this.getLatestCommit();
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
	async getLatestCommit(force = false)
	{
		const inv = this.startAwaitAnim();
		let message = await GitUtils.loadFromCache();
		if (message && !force)
			document.getElementById('latest-commit-text')!.innerHTML = message;
			// this.commitString = message;
		else
		{
			const res = await GitUtils.fetchRecentRepo();
			if (res)
			{
				const ngTag = document.getElementById('latest-commit-text')?.attributes[0].localName;
				const { sha, author: { name, date, url: auURL, username }, url, message: cMessage } = res;
				message = [
					`<commit-time ${ngTag} data-title="${new Date(date).toUTCString()}">${date.substr(0, 11)}<i style="filter: brightness(30%);font-weight: 200;">${date.substr(11, date.length)}</i></commit-time>`,
					`&nbsp;`,
					`<a ${ngTag}
						id="commit-author"
						href=${auURL && username ? `"${auURL}"` : `"#"`}
						data-title="Go to ${username}'s Git profile ->"
						target="_blank"
					>${name}</a>`,
					`<t style="font-weight:200">&#8201;|&#8201;</t>`,
					`<a ${ngTag}
						id="commit-hash"
						href="${url}"
						data-title="Go to commit's page ->"
						target="_blank"
					><i style="filter: brightness(30%);font-weight: 200;">${sha.substr(0, 7)}</i></a>&#8201;`,
					`&nbsp;`,
					`<commit-message ${ngTag} ${cMessage.length > 44 ? `data-title="${cMessage.toString()}" .overflow` : ''}>${cMessage.length > 44 ? cMessage.substr(0, 41) + '...' : cMessage}</commit-message>`
				].join('');
				setTimeout(() => {
					clearInterval(inv);
					document.getElementById('latest-commit-text')!.innerHTML = message as string;
				}, 2000);
				// this.commitString = message;
				GitUtils.saveCacheStorageAttr('Message', message);
				GitUtils.saveCacheStorageAttr('Timestamp', new Date().toISOString());
				setTimeout(() => {
					GitUtils.deleteCacheStorageAttr('Message');
					GitUtils.deleteCacheStorageAttr('Timestamp');
				}, GitUtils.CACHE_TIMEOUT_MS);
				return;
			}
			GitUtils.deleteCacheStorageAttr('Message');
			GitUtils.deleteCacheStorageAttr('Timestamp');
			// this.commitString = 'Encounter an error while fetching git.';
		}
		return;
	}

}

class GitUtils {
	static readonly CACHE_TIMEOUT_MS = 600000;
	static loadCacheStorageAttr(name: string): string | null {
		return localStorage.getItem(`cache:Commit@${name}`);
	}
	static deleteCacheStorageAttr(name: string) {
		return localStorage.removeItem(`cache:Commit@${name}`);
	}
	static saveCacheStorageAttr(name: string, value: string) {
		return localStorage.setItem(`cache:Commit@${name}`, value);
	}
	static async loadFromCache()
	{
		const cachedCommitMessage = GitUtils.loadCacheStorageAttr('Message');
		const cachedCommitTimestamp = GitUtils.loadCacheStorageAttr('Timestamp');

		if (cachedCommitMessage && cachedCommitTimestamp)
		{
			const age = Date.now() - new Date(cachedCommitTimestamp).getTime();
			if (Number.isNaN(age) || age > GitUtils.CACHE_TIMEOUT_MS)
				return null;
			return cachedCommitMessage;
		}
		return null;
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
