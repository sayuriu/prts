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
	ActiveClockInv!: number | null;
	ngOnInit() {
		this.StartClock();
		this.InitTheme();
		this.startRouteListener();
	}
	private StartClock() {
		this.ActiveClockInv = setInterval(() => this.currentTime = generateTimeString());
	}
	private PauseClock()
	{
		clearInterval(this.ActiveClockInv as number);
		this.ActiveClockInv = null;
	}

	currentTheme = '';
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

	UIAlignmentState: UIAlignmentState = 'default';
	currentRouteURL!: string;
	startRouteListener()
	{
		this.currentRouteURL = this.router.url;
		this.handleRouteChange(true);
		this.router.events.subscribe(evt => this.handleRouteChange(false, evt));
	}

	clockAlignmentState: UIAlignmentState = 'default';
	handleRouteChange(initOnFirst = false, routeEvent?: Event)
	{
		if (!initOnFirst && this.router.url === this.currentRouteURL) return;
		this.currentRouteURL = this.router.url;
		if (this.currentRouteURL === '/') {
			this.UIAlignmentState = 'default';
			this.clockAlignmentState = 'default';
		}
		else
		{
			if (this.currentRouteURL !== '/main')
			{
				this.clockAlignmentState = 'hidden';
				this.currentTime = '';
				this.PauseClock();
			}
			else
			{
				this.StartClock();
				this.clockAlignmentState = 'default';
			}
			this.UIAlignmentState = 'asNavigation';
		}
		//TODO: if error, state is hidden
		UpdateManyElementStates([
			{
				ele: this.eleRef.nativeElement,
				state: this.UIAlignmentState,
			},
			{
				ele: document.getElementById('Clock') as HTMLElement,
				state: this.clockAlignmentState,
			}
		])
	}
}

type UIAlignmentState = 'default' | 'asNavigation' | 'hidden';
type KnownAlignmentStates =  UIAlignmentState;

function UpdateManyElementStates(queries: {ele: HTMLElement, state: KnownAlignmentStates}[])
{
	for (const { ele, state } of queries)
		UpdateElementState(state, ele);
}

function UpdateElementState(state: KnownAlignmentStates, element: HTMLElement)
{
	element?.setAttribute('state', state);
}