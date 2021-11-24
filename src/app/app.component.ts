import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

import { routeAnims } from '@utils/anims';
import { version } from '@utils/package';
import { ErrorService } from '@services/error/error.service';
import { NotifService } from '@services/Notification/notif.service';
import type { BrowserWindow } from '@interfaces/common';

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

		document.addEventListener('mousemove', (event) => {
			if (window.location.href.includes('inspect')) {
				console.warn('You are in development mode.\n' +
					'Please do not open dev tools in production mode.');
			}
		});
		document.addEventListener('fullscreenchange', (event) => {
			if (document.fullscreenElement)
				this.notif.send('System', 'Entered fullscreen.');
		});
		// document.addEventListener('keypress', (event) => {
		// 	console.log(event)
		// 	if (event.key === 'F11') {
		// 		console.log('F11');
		// 		console.log(document.fullscreenElement);
		// 	}
		// })
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