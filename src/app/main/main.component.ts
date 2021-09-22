import { Component, OnInit, Input } from '@angular/core';
import { BrowserWindow } from '@utils/interfaces/common';

@Component({
	selector: 'app-home',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {

	readonly appVersion = (window as BrowserWindow).__env.AppVersion;
	currentMenuOptions = menuOptions;
	currentTheme = document.documentElement.getAttribute('theme');
	constructor() {}

	ngOnInit(): void {

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
		name: 'Operators',
		routerTarget: '/operators',
		CSSTargetAccessor: 'opInfo',
		associatedBackgoundURL: 'G3_Thumbnail.png',
		description: 'Details of operators / factions.',
		available: false,
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
