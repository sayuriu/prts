import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ThemeMangerService {
	private _currentTheme: string;
	private events = new Subject<string>();
	constructor() {
		this._currentTheme = ThemeManager.Load();
	}
	get currentTheme()
	{
		return this._currentTheme;
	}
	switch()
	{
		this._currentTheme = ThemeManager.Switch(this.currentTheme);
		this.events.next(this._currentTheme);
	}
	listen(root: HTMLElement)
	{
		if (!root.getAttribute('theme'))
			root.setAttribute('theme', this.currentTheme);
		this.events.subscribe(theme => root.setAttribute('theme', theme))
	}
}

class ThemeManager {
	static Switch(currentTheme = 'light')
	{
		if (currentTheme === 'light') currentTheme = 'dark';
		else currentTheme = 'light';
		if (localStorage) localStorage.setItem('theme', currentTheme);
		document.documentElement.setAttribute('theme', currentTheme);
		return currentTheme;
	}
	static Load()
	{
		const theme = localStorage.getItem('theme') || 'light';
		document.documentElement.setAttribute('theme', theme);
		return theme;
	}
}
