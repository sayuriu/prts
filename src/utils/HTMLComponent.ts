import { ElementRef } from "@angular/core";

export abstract class HTMLBasedComponent {
	protected abstract eleRef: ElementRef;
	updateInnerHTML(query: string, value: string) {
		this.eleRef.nativeElement.querySelector(query).innerHTML = value;
	}
	clearInnerHTML(query: string) {
		this.eleRef.nativeElement.querySelector(query).innerHTML = "";
	}
}