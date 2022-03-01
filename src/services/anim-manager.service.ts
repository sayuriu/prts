import { Injectable } from '@angular/core';
import { AnimationFunctions } from '@utils/anims';

@Injectable({
  providedIn: 'root'
})
export class AnimManagerService {
	constructor() { }
    timeFunc = AnimationFunctions;
	enabled = true;
	toggle() {
		this.enabled = !this.enabled;
	}
}
