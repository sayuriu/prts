import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-home',
	templateUrl: './main.component.html',
	styleUrls: ['./main.component.scss']
})
export class MainComponent implements OnInit {

	currentMenuOptions = menuOptions;
	constructor() {}

	ngOnInit(): void {

	}
}

const menuOptions: MenuItems[] = [
	{
		name: 'Combat',
		CSSTargetAccessor: 'combat',
		associatedBackgoundURL: 'G1_Thumbnail.png',
		description: 'Know your enemies before fighting them.',
		available: true,
	},
	{
		name: 'Op. Info',
		CSSTargetAccessor: 'opInfo',
		associatedBackgoundURL: 'G3_Thumbnail.png',
		description: 'Details of our operators.',
		available: false,
	},
	{
		name: 'Recruitment',
		CSSTargetAccessor: 'recruit',
		associatedBackgoundURL: 'G2_Thumbnail.png',
		description: 'Try your luck?',
		available: true,
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
	// from assets/img/menu folder
	associatedBackgoundURL?: string;
	description: string;
	available: boolean;
}