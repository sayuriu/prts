import { trigger, transition, style, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Message, NotifService } from '@services/notif.service';
import { AnimationFunctions, AppearDisappear } from '@utils/anims';
import { waitAsync } from '@utils/utils';

const anim_AppearDisappear = AppearDisappear();
const anim_SlideUpDown = trigger('slideUpDown', [
	transition(':enter', [
		style({
			position: 'absolute',
			bottom: 0,
			opacity: 0,
			transform: 'translate(-50%, 3rem)',
		}),
		animate(
			'0.3s ' + AnimationFunctions.Forceful,
			style({ opacity: 1 }),
		),
		animate(
			'0.5s ' + AnimationFunctions.Forceful,
			style({ transform: 'translate(-50%, 0)' }),
		),

	]),
	transition(':leave', [
		style({
			position: 'absolute',
			bottom: 0,
			transform: 'translate(-50%, 0)',
		}),

		animate(
			'0.5s ' + AnimationFunctions.Forceful,
			style({ transform: 'translate(-50%, 3rem)' }),
		),
		animate(
			'0.3s ' + AnimationFunctions.Forceful,
			style({ opacity: 0 }),
		),
	]),
]);


const emptyMessage: Message = {title: '', level: 'info', message: '', timeout: 0, data: {}};
@Component({
	selector: 'notif-overlay',
	templateUrl: './notif-overlay.component.html',
	styleUrls: ['./notif-overlay.component.scss'],
	animations: [
		anim_SlideUpDown,
		anim_AppearDisappear,
	],
})
export class NotifOverlayComponent implements OnInit {

	progress: number = 100;

	currentlyBeingSkipped = false;
	isShown = false;
	private _activeInterval?: number;

	queue: Message[];
	currentMessage: Message = emptyMessage;

	constructor(private notif: NotifService) {
		this.queue = [];
		this.notif.events.subscribe((m: Message) => this.onMessage(m));
	}

	ngOnInit(): void {}

	private async onMessage(data: Message): Promise<void>
	{
		if (data.timeout === 0 && data.message === 'skip')
			return void this.skip();
		if (this.currentMessage.data.dynamic)
			await this.skip();
		this.queue.push(data);
		this.processQueue();
	}

	private async processQueue()
	{
		if (this.queue.length && !this._activeInterval)
		{
			this.currentMessage = this.queue.shift()!;
			this.isShown = true;
			this.notif.setCurrentMessage(this.currentMessage);

			if (!this.currentMessage.data.presist)
			{
				let queuedForSkip = false;
				this._activeInterval = setInterval((): void => {
					this.progress -= 0.1;
					if (this.progress <= 0)
					{
						if (queuedForSkip) return;
						queuedForSkip = true;
						return void this.skip();
					}
				}, this.currentMessage.timeout / 1000) as unknown as number;
			}
		}
	}

	async skip()
	{
		await this.reset();
		this.processQueue();
	}

	async clearAll()
	{
		this.queue = [];
		await this.reset();
	}

	private async reset()
	{
		clearInterval(this._activeInterval);
		this.notif.clearCurrentMessage();
		await waitAsync(300);
		this.isShown = false;
		this.progress = 100;
		this.currentMessage = emptyMessage;
		delete this._activeInterval;
	}
}