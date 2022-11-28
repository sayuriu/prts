import { Directive, ElementRef } from '@angular/core';

@Directive({
    selector: '[HTMLElementRef]',
    exportAs: 'HTMLElementRef'
})
export class ElementDirective {
    constructor(public self: ElementRef) { }
}
