import { Injectable } from "@angular/core";
import { Nullable } from "@utils/utils";

@Injectable({
	providedIn: 'root'
})
export class HoverReactService {
	constructor() { }
	react(element: Nullable<HTMLElement>, isHovered: boolean, className = 'isReacting', ...additionalClassses: string[]): void {
		if (element)
			isHovered ? element.classList.add(className) : element.classList.remove(className);
	}
}