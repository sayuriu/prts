import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AnimManagerService {
	constructor() { }
	enabled = true;
	toggle() {
		this.enabled = !this.enabled;
	}
}
