import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';

import { ErrorService } from '@services/error.service';
import { NotifService } from '@services/notif.service';
import { AppService } from '@services/app.service';
import { PopupService } from '@services/popup.service';

import { AnimationFunctions, routeAnims } from '@utils/anims';
import { version, name } from '@utils/package';
import type { BrowserWindow } from '@interfaces/common';
import { getURLWithoutParams } from '@utils/PathUtils';
import { isFullScreen } from '@utils/utils';
import { AppearDisappear } from '@utils/anims';
import appMetadata from './app.metadata';

const appearDisappear = AppearDisappear(`0.5s ${AnimationFunctions.Forceful}`);
@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.scss'],

	animations: [
		routeAnims,
        appearDisappear,
	],
})
export class AppComponent implements OnInit {
    isPortrait = false;
    screenTooSmall = false;

	constructor(
			// private errorService: ErrorService,
			private notif: NotifService,
			public router: Router,
            public app: AppService,
            public popup: PopupService,
            public title: Title,
            public meta: Meta,
		)
	{}

	ngOnInit() {
		OverlayUtils.removeLoadStatus();
        this.isPortrait = window.innerHeight > window.innerWidth;
		(window as BrowserWindow).__env.AppVersion = version;
        (window as BrowserWindow).__env.AppName = 'PRTS Analysis OS';
		this.router.malformedUriErrorHandler = (e, serializer, url) => {
			const path = getURLWithoutParams(url);
			this.router.navigateByUrl(path, { replaceUrl: true });
			return this.router.createUrlTree([path]);
		}
        this.router.events.subscribe(() => {
            let extra: Record<string, string> = {};
            extra[name.replace(/ +/g, '-')] = version;
            this.meta.updateTag({
                name,
                version,
            }, 'RHODESISLAND')
            this.title.setTitle(name);
            this.app.updateMetadata(appMetadata);
        });
		window.addEventListener('resize', (() =>{
			if (isFullScreen())
				this.notif.send('System', 'Entered fullscreen.', 'info', {}, 3300)
			else if (
				this.notif.currentMessage?.title === '[SYSTEM]' &&
				this.notif.currentMessage?.message === 'Entered fullscreen.'
			)
			this.notif.skipCurrent();
            this.isPortrait = window.innerHeight > window.innerWidth;
            if (this.isPortrait) return;
            this.screenTooSmall = window.innerHeight < 700 || window.innerWidth < 1300;
		}).bind(this));
        window.addEventListener('online', () => {
            this.app.updateConnectionStatus(true);
        })
        window.addEventListener('offline', () => {
            this.app.updateConnectionStatus(false);
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
