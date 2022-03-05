import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { waitAsync } from '../utils/utils';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
    constructor(
        private sanitizer: DomSanitizer,
    ) { }

    location: { value: AbsoluteLocation } & FormControl = new FormControl({
        x: 0,
        y: 0,
    })
    visible = new FormControl(false);
    content = new FormControl({});
    initTransform = new FormControl('translate(0, 0)');

    async display(contentHTML: string, location: AbsoluteLocation, axis: 'h' | 'v' = 'h')
    {
        console.log('display', this);
        this.location.setValue(location);
        await waitAsync(200);
        this.content.setValue(this.sanitizer.bypassSecurityTrustHtml(contentHTML));
        this.visible.setValue(true);
    }
    async clear()
    {
        console.log('clear', this);
        this.visible.setValue(false);
        await waitAsync(300);
        this.content.setValue('');
        this.initTransform.setValue('translate(0, 0)');
    }
}

type AbsoluteLocation = {
    x: number,
    y: number,
}
