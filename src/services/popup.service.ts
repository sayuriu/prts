import { Injectable } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
    constructor(
        private sanitizer: DomSanitizer,
    ) { }

    location: AbsoluteLocation = {
        x: 0,
        y: 0,
    }
    visible = false;
    content: SafeHtml = {};
    initTransform = 'translate(0, 0)';
    display(content: string, location: AbsoluteLocation, axis: 'h' | 'v' = 'h')
    {
        this.location = location;
        this.content = this.sanitizer.bypassSecurityTrustHtml(content);
        this.visible = true;
    }
    clear()
    {
        this.visible = false;
        this.content = '';
    }
}

type AbsoluteLocation = {
    x: number,
    y: number,
}
