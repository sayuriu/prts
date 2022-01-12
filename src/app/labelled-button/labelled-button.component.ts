import { Component, Input, OnInit } from '@angular/core';
import { BoundRectMetadata } from '@utils/TextFields';

@Component({
	selector: 'label-button',
	templateUrl: './labelled-button.component.html',
	styleUrls: ['./labelled-button.component.scss']
})
export class LabelledButtonComponent implements OnInit {
	activated = false;

	constructor() { }
	@Input() boundRect!: BoundRectMetadata;
	@Input() iconURL!: string;
	@Input() label!: string;
	@Input() onClick!: (...params: any[]) => void;
	private _style!: ButtonMetadata;
	ngOnInit(): void {

	}
	handleClick()
	{
		this.activated = true;
		this.onClick();
	}
	_toNgStyle()
	{
		return {
			'background-image': `url(${this.iconURL})`,
			'background-size': 'contain',

		}
	}
}

interface ButtonMetadata {
	height?: string;
	width?: string;
	background?: string;
	border?: string;
	borderFg?: string;
	borderFgMatchBg?: boolean;
	borderMatrixOverride?: [string?, string?, string?, string?];
	margin?: string;
	minHeight?: string;
	minWidth?: string;
}