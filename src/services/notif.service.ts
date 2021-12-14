import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

type Levels = 'info' | 'warning' | 'error' | 'success';
export interface Message
{
	readonly title: string;
	readonly message: string;
	readonly level: Levels;
	readonly timeout: number;
	readonly data: Data;
}
export interface Data
{
	readonly assistKeys?: string[];
	readonly dynamic?: boolean;
	readonly presist?: boolean;
}

@Injectable({
	providedIn: 'root'
})
export class NotifService {
	events: Subject<Message>;
	currentMessage?: Message;
	constructor() {
		this.events = new Subject();
	}
	public setCurrentMessage(message: Message)
	{
		this.currentMessage = message;
	}
	clearCurrentMessage()
	{
		this.currentMessage = undefined;
	}
	public send(title: string, message: string, level: Levels = 'info', data?: Data, timeout = 5000): void {
		this.events.next({ title: `[${title.toUpperCase()}]`, message, level, timeout, data: data ?? {} });
	}
	public skipCurrent() {
		this.events.next({ title: '', message: 'skip', level: 'info', timeout: 0, data: {} });
	}
}
