import { Component, ElementRef, OnInit, OnChanges } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { query, transition, trigger } from '@angular/animations';
import { fader, slideBetween } from '@utils/anims';

import { ErrorService } from '../services/error.service';

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.scss'],

	animations: [
		fader,
		// slideBetween,
	],
})
export class AppComponent implements OnInit {

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