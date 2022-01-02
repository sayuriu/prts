import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'text-field',
	templateUrl: './info-text-field.component.html',
	styleUrls: ['./info-text-field.component.scss']
})
export class InfoTextFieldComponent implements OnInit {

	constructor() { }

	@Input() width!: string;
	@Input() labelField!: TextFieldMetadata;
	@Input() valueField!: TextFieldMetadata;

	ngOnInit(): void {
	}
}

interface TextFieldMetadata extends TextFieldContainerMetadata {
	textValue?: string;
	textColor?: string;
}

interface TextFieldContainerMetadata {
	width?: string;
	marginUD?: string;
	textMarginUD?: string;
	bgColor?: string;
	borderFgMatchBg?: boolean;
	borderFg?: string;
}

interface BoundRectMetadata {
	width: number;
	height: number;
	bgColor: string;
	borderFg: string;
	ceterChild?: boolean;
}