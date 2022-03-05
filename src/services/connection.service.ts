import { Injectable } from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

    constructor(
        private metadata: Meta
    ) { }
    private _connected = false;
    get online()
    {
        return this._connected;
    }
    updateStatus(online: boolean)
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
}
