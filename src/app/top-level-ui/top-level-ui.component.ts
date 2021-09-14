import { Component, OnInit, ElementRef } from '@angular/core';
import { Router, Event } from '@angular/router';
import Theme from '@utils/ThemeManager';

const generateTimeString = () => `://${new Date().toISOString().substr(0, 21)}`;

@Component({
	selector: 'app-top-level-ui',
	templateUrl: './top-level-ui.component.html',
	styleUrls: ['./top-level-ui.component.scss']
})
export class TopLevelUIComponent implements OnInit {

	constructor(private router: Router, private eleRef: ElementRef) {
	}

	currentTime = generateTimeString();
	currentTheme = 'light';
	ngOnInit() {
		this.InitClock();
		this.InitTheme();
		this.startRouteListener();
	}
	private InitClock() {
		setInterval(() => this.currentTime = generateTimeString());
	}
	private InitTheme() {
		this.currentTheme = Theme.Load();
	}
	ToggleTheme()
	{
		this.currentTheme = Theme.Switch(this.currentTheme);
	}
	ToggleFullscreen() {
		const root = document.documentElement;
		(!document.fullscreenElement ?
			root?.requestFullscreen({ navigationUI: 'hide' }) :
			document.exitFullscreen()
		)?.catch((e) => { console.log(e); alert('Failed to request fullscreen.\nCheck console for details.') });
	}

	UIAlignmentState: ControlState = 'default';
	currentRouteURL!: string;
	startRouteListener()
	{
		this.currentRouteURL = this.router.url;
		this.handleRouteChange(true);
		this.router.events.subscribe(evt => this.handleRouteChange(false, evt));
	}

	handleRouteChange(initOnFirst = false, routeEvent?: Event)
	{
		if (!initOnFirst && this.router.url === this.currentRouteURL) return;
		this.currentRouteURL = this.router.url;
		if (this.currentRouteURL === '/') this.UIAlignmentState = 'default';
		else this.UIAlignmentState = 'asNavigation';
		//TODO: if error, state is hidden
		UpdateTopLevelUI(this.UIAlignmentState, this.eleRef.nativeElement)
	}
}

type ControlState = 'default' | 'asNavigation' | 'hidden';

function UpdateTopLevelUI(state: ControlState, element: HTMLElement)
{
	element.setAttribute('state', state);
}