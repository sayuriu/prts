import { Component, ElementRef, OnInit, OnChanges } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { query, transition, trigger } from '@angular/animations';
import { fader } from '@utils/anims';

import { ErrorService } from '../services/error.service';

@Component({
  	selector: 'app-root',
  	templateUrl: './app.component.html',
  	styleUrls: ['./app.component.scss'],

	animations: [
		fader,
	],
})
export class AppComponent implements OnInit {

	constructor(
			private errorService: ErrorService,
			public router: Router,
		)
	{}

	ngOnInit() {
		const loadingText = document.getElementById('LOAD_STATUS');
		setTimeout(() => {
			(loadingText as HTMLElement).style.opacity = '0';
			(loadingText as HTMLElement).style.zIndex = '-1';
		}, 200);
	}

	prepareOutlet(outlet: RouterOutlet) {
		return outlet && outlet.activatedRouteData && outlet.activatedRouteData.animation;
	}
}