import { Injectable } from '@angular/core';

interface Message {
    type: 'info' | 'debug' | 'error' | 'warn';
    content: string;
    from: string;
    lifetime?: number;

}

@Injectable({
    providedIn: 'root'
})
export class NotificationService {

    constructor() { }
}
