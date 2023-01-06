import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {
    online = new Observable<boolean>((observer) => {
        window.addEventListener('online', () => observer.next(true));
        window.addEventListener('offline', () => observer.next(false));
        return () => {
            window.removeEventListener('online', () => observer.next(true));
            window.removeEventListener('offline', () => observer.next(false));
        };
    });
    server = 'en';
    constructor() { }
}
