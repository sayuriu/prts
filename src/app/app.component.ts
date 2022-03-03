import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { ErrorService } from '@services/error.service';
import { NotifService } from '@services/notif.service';
import { ConnectionService } from '@services/connection.service';

import { routeAnims } from '@utils/anims';
import { version } from '@utils/package';
import type { BrowserWindow } from '@interfaces/common';
import { getURLWithoutParams } from '@utils/PathUtils';
import { isFullScreen } from '@utils/utils';
import { PopupService } from '../services/popup.service';


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
			// private errorService: ErrorService,
			public router: Router,
			private notif: NotifService,
            public connection: ConnectionService,
            public popup: PopupService
		)
	{}

	ngOnInit() {
        this.popup.content
		OverlayUtils.removeLoadStatus();
		(window as BrowserWindow).__env.AppVersion = version;
		this.router.malformedUriErrorHandler = (e, serializer, url) => {
			const path = getURLWithoutParams(url);
			this.router.navigateByUrl(path, { replaceUrl: true });
			return this.router.createUrlTree([path]);
		}
		window.addEventListener('resize', (() =>{
			if (isFullScreen())
				this.notif.send('System', 'Entered fullscreen.', 'info', {}, 3300)
			else if (
				this.notif.currentMessage?.title === '[SYSTEM]' &&
				this.notif.currentMessage?.message === 'Entered fullscreen.'
			)
			this.notif.skipCurrent();
		}).bind(this));
        window.addEventListener('online', () => {
            this.connection.updateStatus(true);
        })
        window.addEventListener('offline', () => {
            this.connection.updateStatus(false);
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
