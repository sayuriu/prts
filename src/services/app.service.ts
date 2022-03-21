import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';
import { FormControl } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class AppService {

    constructor(
        private metadata: Meta
    ) { }
    private _connected = false;
    get online()
    {
        return this._connected;
    }
    updateConnectionStatus(online: boolean)
    {
        this._connected = online;
    }
    updateMetadata(metadata: Record<string, string>)
    {
        for (const [key, value] of Object.entries(metadata))
        {
            const tag = this.metadata.getTag(`property="${key}"`);
            if (!tag)
            {
                this.metadata.addTag({ property: key, content: value });
                continue;
            }
            if (tag.getAttribute('content') !== value)
                this.metadata.updateTag({ content: value }, `property="${key}"`);
        }
    }
    removeMetadata(metadata: string[])
    {
        for (const key of metadata)
            this.metadata.removeTag(`property="${key}"`);
    }
    screenDimensions = new FormControl([0, 0]);
    isPortrait = new FormControl(false);
    screenTooSmall = new FormControl(false);
    updateScreenDimensions(width: number, height: number)
    {
        this.screenDimensions.setValue([width, height]);

        this.isPortrait.setValue(window.innerHeight > window.innerWidth);
        if (this.isPortrait.value)
            return;
        this.screenTooSmall.setValue(window.innerHeight < 700 || window.innerWidth < 1300);
    }
}
