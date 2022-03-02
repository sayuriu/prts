import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ConnectionService {

    constructor() { }
    private _connected = false;
    get online()
    {
        return this._connected;
    }
    updateStatus(online: boolean)
    {
        this._connected = online;
    }
}
