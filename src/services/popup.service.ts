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
    private _initTransform = 'translate(0, 0)';
    get initTransform() { return this._initTransform; }
    set initTransform(value: string) {
        this._initTransform = value;
    }

    display(content: string, location: AbsoluteLocation, axis: 'h' | 'v' = 'h')
    {
        console.log('display', this);
        this.location = location;
        this.content = this.sanitizer.bypassSecurityTrustHtml(content);
        this.visible = true;
    }
    clear()
    {
        console.log('clear', this);
        this.visible = false;
        this.content = '';
    }
}

type AbsoluteLocation = {
    x: number,
    y: number,
}
