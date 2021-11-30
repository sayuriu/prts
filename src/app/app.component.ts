import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { ErrorService } from '@services/error.service';
import { NotifService } from '@services/notif.service';

import { routeAnims } from '@utils/anims';
import { version } from '@utils/package';
import type { BrowserWindow } from '@interfaces/common';
import { AllowedURLParams, AllowedURLParamMap } from '@utils/URLParams';
import { getURLWithoutParams } from '@utils/PathUtils';


@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.scss'],

	animations: [
		routeAnims,
	],
})
export class AppComponent implements OnInit {

	constructor(
			private errorService: ErrorService,
			public router: Router,
			private notif: NotifService,
		)
	{}

	ngOnInit() {
		OverlayUtils.removeLoadStatus();
		(window as BrowserWindow).__env.AppVersion = version;
		window.addEventListener('resize', () => {
			if (window.screen.height === window.innerHeight && window.screen.width === window.innerWidth)
				this.notif.send('System', 'Entered fullscreen.', 'info', {}, 3300)
			else if (
				this.notif.currentMessage?.title === '[SYSTEM]' &&
				this.notif.currentMessage?.message === 'Entered fullscreen.'
			)
			this.notif.skip();
		});
		this.router.malformedUriErrorHandler = (e, serializer, url) => {
			const path = getURLWithoutParams(url);
			this.router.navigateByUrl(path, { replaceUrl: true });
			return this.router.createUrlTree([path]);
		}
		this.router.events.subscribe(() => {
			const currentRoute = getURLWithoutParams(this.router.url)
			let base = currentRoute;
			const URLParams = this.router.parseUrl(this.router.url).queryParams;
			for (const params in URLParams)
			{
				if ((AllowedURLParams as AllowedURLParamMap)[currentRoute].includes(params))
					base += base.includes('?') ? `&${params}=${URLParams[params]}` : `?${params}=${URLParams[params]}`;
			}
			if ((AllowedURLParams as AllowedURLParamMap)[currentRoute])
				this.router.navigateByUrl(base, { replaceUrl: true });
		});
	}

	prepareOutlet(outlet: RouterOutlet) {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
	}
}

const OverlayUtils = {
	currentInterval: null,
	evt: new Event('LOAD_STATUS'),
	removeLoadStatus()
	{
		const loadingText = document.getElementById('LOAD_STATUS');
		loadingText?.setAttribute('status', 'idle');
		this.emitUpdate();
		setTimeout(() => {
			(loadingText as HTMLElement).style.opacity = '0';
			(loadingText as HTMLElement).style.zIndex = '-1';
		}, 200);
	},
	assertLoadStatus()
	{
		const loadingText = document.getElementById('LOAD_STATUS');
		loadingText?.setAttribute('status', 'busy');
		this.emitUpdate();
		setTimeout(() => {
			(loadingText as HTMLElement).style.opacity = '1';
			(loadingText as HTMLElement).style.zIndex = '10000';
		}, 200);
	},
	emitUpdate()
	{
		document.dispatchEvent(this.evt);
	}
}