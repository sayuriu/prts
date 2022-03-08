import { Injectable } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { waitAsync } from '@utils/utils';

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
    textContent = new FormControl('');
    initTransform = new FormControl('translate(0, 0)');

    currentTimeout: number = -1;
    async display(data: PopupData)
    {
        const { html, location, text } = data;
        this.location.setValue(location);
        this.currentTimeout = setTimeout(async () => {
            await waitAsync(200);
            this.textContent.setValue(text ?? html);
            this.content.setValue(this.sanitizer.bypassSecurityTrustHtml(html));
            this.visible.setValue(true);
        }, 400) as unknown as number;

    }
    async clear()
    {
        if (this.currentTimeout !== -1)
        {
            console.log('clear');
            clearTimeout(this.currentTimeout);
            this.currentTimeout = -1;
            this.visible.setValue(false);
            await waitAsync(300);
            this.content.setValue('');
            this.initTransform.setValue('translate(0, 0)');
        }
    }
}
type PopupData = {
    html: string;
    text?: string;
    location?: AbsoluteLocation;
    axis?: 'h' | 'v';
}
type AbsoluteLocation = {
    x: number,
    y: number,
}
