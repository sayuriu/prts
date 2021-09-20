import { Component, OnInit, Input } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { slideBetween } from '@utils/anims';
import { version } from '@utils/version';

import { ErrorService } from '../services/error.service';

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.scss'],

	animations: [
		// fader,
		slideBetween,
	],
})
export class AppComponent implements OnInit {

	@Input() readonly appVersion = version;
	constructor(
			private errorService: ErrorService,
			public router: Router,
		)
	{}

	ngOnInit() {
		AnimUtilities.removeLoadStatus();
	}

	prepareOutlet(outlet: RouterOutlet) {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
	}
}

const AnimUtilities = {
	currentInterval: null,
	evt: new Event('load_status'),
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
			(loadingText as HTMLElement).style.zIndex = '999';
		}, 200);
	},
	emitUpdate()
	{
		document.dispatchEvent(this.evt);
	}
}