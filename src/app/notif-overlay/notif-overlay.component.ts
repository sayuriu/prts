import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Message, NotifService } from '@services/Notification/notif.service';
import { AnimationFunctions, AppearDisappear } from '@utils/anims';
import { waitAsync } from '@utils/utils';

const slideUpDown = trigger('slideUpDown', [
	transition(':enter', [
		style({
			position: 'absolute',
			bottom: 0,
			opacity: 0,
			transform: 'translateY(3rem)',
		}),
		animate(
			'0.3s ' + AnimationFunctions.Forceful,
			style({ opacity: 1 }),
		),
		animate(
			'0.5s ' + AnimationFunctions.Forceful,
			style({ transform: 'translateY(0)' }),
		),

	]),
	transition(':leave', [
		style({
			position: 'absolute',
			bottom: 0,
			transform: 'translateY(0)',
		}),

		animate(
			'0.5s ' + AnimationFunctions.Forceful,
			style({ transform: 'translateY(3rem)' }),
		),
		animate(
			'0.3s ' + AnimationFunctions.Forceful,
			style({ opacity: 0 }),
		),
	]),
]);

@Component({
	selector: 'notif-overlay',
	templateUrl: './notif-overlay.component.html',
	styleUrls: ['./notif-overlay.component.scss'],
	animations: [
		slideUpDown,
		AppearDisappear,
	],
})
export class NotifOverlayComponent implements OnInit {

	title: string = '';
	message: string = '';
	level: Message['level'] = 'info';
	progress: number = 100;
	timeout: number = 0;

	private _activeTimeout?: number;
	private _activeInterval?: number;
	currentlyBeingSkipped = false;
	isShown = false;

	queue: Message[];
	private data?: Message['data'];

	constructor(private notif: NotifService) {
		this.queue = [];
		this.notif.events.subscribe((m: Message) => this.onMessage(m))
	}

	ngOnInit(): void {
		// setInterval(() => this.processQueue(), 500);
	}
	private async onMessage(message: Message)
	{
		if (message?.timeout === 0 && message.message === 'skip')
		{
			this.skip();
			return;
		}
		if (this.message && this.data?.dynamic)
			await this.skip();
		this.queue.push(message);
		this.processQueue();
	}
	private processQueue()
	{
		if (this.queue.length && !this._activeInterval && !this._activeTimeout)
		{
			const message = this.queue.shift();
			Object.assign(this, message);
			this.notif.currentMessage = message;
			this.isShown = true;
			this.currentlyBeingSkipped = false;
			if (!message?.data.presist)
			{
				this._activeInterval = setInterval(() => this.progress--, this.timeout / 100) as unknown as number;
				this._activeTimeout = setTimeout(() => this.clearCurrent(), this.timeout) as unknown as number;
			}
		}
	}
	async skip()
	{
		this.currentlyBeingSkipped = true;
		await this.clearCurrent();
		this.processQueue();
	}
	private async clearCurrent()
	{
		clearInterval(this._activeInterval as number);
		clearTimeout(this._activeTimeout as number);
		await waitAsync(300);
		this.isShown = false;
		this.title = '';
		this.message = '';
		this.progress = 100;
		this.level = 'info';
		this.timeout = 0;
		delete this._activeInterval;
		delete this._activeTimeout;
		delete this.data;
		delete this.notif.currentMessage;
	}
	async clearAll()
	{
		await this.clearCurrent();
		this.queue = [];
	}
}
