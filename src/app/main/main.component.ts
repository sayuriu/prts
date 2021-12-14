import { Component, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { trigger, transition, style, stagger, animate, query } from '@angular/animations';
import { request } from '@octokit/request';
import { gsap } from 'gsap';

import { BrowserWindow } from '@utils/interfaces/common';
import { repository } from '@utils/package';
import GitCommit from '@utils/interfaces/GitCommit';
import { HTMLBasedComponent } from '@utils/HTMLComponent';
import { AnimationFunctions, AppearDisappear } from '@utils/anims';
import { Nullable, waitAsync } from '@utils/utils';

import { ThemeMangerService } from '@services/theme-manger.service';
import { HoverReactService } from '@services/hover-react.service';

import { Changelog } from '@struct/Changelog';
import { JSONLoadService } from '@services/jsonload.service';

interface GitCommitSimple {
	cMessage: string;
    cDate: Date;
    cHash: string;
    cURL: string;
    cAuthorName: string;
    cAuthorUsrname?: string;
    cAuthorURL?: string;
}
const appearDisappear = AppearDisappear(`250ms ${AnimationFunctions.Forceful}`);
@Component({
	selector: 'app-home',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
	animations: [
		appearDisappear,
		trigger('AppearDisappear-List', [
			transition('* <=> *', [
				query(':enter', [
					style({ opacity: 0 }),
					stagger(150, [
						animate('200ms ' + AnimationFunctions.Forceful, style({ opacity: 1 })),
					])
				], { optional: true }),
				query(':leave', [
					stagger(150, [
						animate('200ms ' + AnimationFunctions.Forceful,  style({ opacity: 0 })),
					])
				],{ optional: true })
			]),
		])
	]
})
export class MainComponent extends HTMLBasedComponent implements OnInit, OnDestroy {

	readonly appVersion = (window as BrowserWindow).__env.AppVersion;
	currentMenuOptions = menuOptions;

	constructor(
		protected eleRef: ElementRef,
		private theme: ThemeMangerService,
		private hoverReact: HoverReactService,
		private json: JSONLoadService
	) {
		super();
	}

	ngOnInit(): void {
		this.theme.listen((this.eleRef.nativeElement as HTMLElement).querySelector('.container') as HTMLElement);
		this.loadCommit();
		this.loadChangelogs();
		// new Stagger().arrow('#arrow', false);
	}
	ngOnDestroy(): void {
		this.changelogs = [];
	}

	mascotImg = 'mascot.png'
	mascotReact(isHovered: boolean, imgID = 'mascot')
	{
		this.mascotImg = `${imgID}.png`;
		this.hoverReact.react(this.eleRef.nativeElement?.querySelector('#mascot'), isHovered);
	}

	changelogs: Changelog[] = [];
	_cachedChangelogs: Changelog[] = [];
	visibleChangelogs = true;
	changelogLoadingString = '';
	changelogLoadingProg = 0;
	toggleChangelog()
	{
		const empty = [{changes: [], date: '', version: ''}];
		// ! Warning: Reduntdant assignment
		this.visibleChangelogs = !this.visibleChangelogs;
		this.visibleChangelogs ? this.changelogs = this._cachedChangelogs : this.changelogs = empty;
	}
	async loadChangelogs()
	{
		const inv = this.startAwaitAnim('changelogLoadingString', 'Fetching changelogs');
		await waitAsync(250);
		this.changelogs = [];
		this.json.load(
			'CHANGELOGS.json',
			{
				onExpire: () => {},
				force: true,
				onprogress: (_, e) => {
					if (e?.lengthComputable)
					{
						this.changelogLoadingProg = e.loaded / e.total;
					}
				}
			}
		).then((json) => {
			if (json)
			{
				this._cachedChangelogs = json as unknown as Changelog[];
				// ! Warning: Reduntdant assignment
				this.changelogs = this._cachedChangelogs;
				this.changelogLoadingProg = 1;
				clearInterval(inv);
			}
		}).catch(() => {
			this.changelogLoadingProg = 1;
			clearInterval(inv);
		});
	}

	startAwaitAnim(propBind: 'commitString' | 'changelogLoadingString', template: string)
	{
		let i = 0;
		return setInterval(() => {
			this[propBind] = template + '.'.repeat(i).padEnd(3, ' ');
			if (i === 3) i = -1;
			i++;
		}, 200);
	}

	gitData: Nullable<GitCommitSimple> = null;
	gitLoaded = false;
	commitString = '';
	async loadCommit(fetchNewest = false)
	{
		this.gitLoaded = false;
		const inv = this.startAwaitAnim('commitString', 'Hold on, fetching git commits');
		if (!fetchNewest)
		{
			const data = GitUtils.loadFromCache();
			if (data)
			{
				setTimeout(() => {
					clearInterval(inv);
					this.gitData = data;
					this.gitLoaded = true;
				}, 500);
				return;
			}
		}
		const res = await GitUtils.fetchRecentRepo();
		if (res)
		{
			console.log(res);
			const { sha, author: { name, date, url: auURL, username }, url, message: cMessage } = res;
			setTimeout(async () => {
				clearInterval(inv);
				this.gitData = {
					cAuthorName: name,
					cAuthorURL: auURL,
					cAuthorUsrname: username,
					cDate: new Date(date),
					cHash: sha,
					cMessage,
					cURL: url,
				}
				this.gitLoaded = true;
			}, 1500);
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
				this.loadCommit(true);
			}, GitUtils.CACHE_TIMEOUT_MS);
			return;
		}
		GitUtils.deleteCache();
		this.commitString = 'Encounter an error while fetching git.';
	}
}

class Stagger {
	arrow(query: string, pause: boolean)
	{
		if (!document.querySelectorAll(query).length) return;
		gsap
			.timeline({
				repeat: -1,
				repeatDelay: 1,
			})
			.to(query, { opacity: 0, duration: 1, ease: AnimationFunctions.Forceful })
			.to(query, { opacity: 1, duration: 1, ease: AnimationFunctions.Forceful })
	}
}

type Tuple7Array<T> = [T, T, T, T, T, T, T];

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
	static loadFromCache(): Nullable<GitCommitSimple>
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
			return {
				cMessage,
				cDate: new Date(cDate),
				cHash: cHash.substring(0, 7),
				cURL,
				cAuthorName,
				cAuthorUsrname,
				cAuthorURL
			};
		}
		return null;
	}
	static async fetchRecentRepo()
	{
		const res = await request(`GET /repos/${repository.url.substring('https://github.com/'.length, repository.url.length)}/commits`);
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
