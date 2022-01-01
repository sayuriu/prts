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

	labelDisplay = new TextField();
	valueDisplay = new TextField();
	ngOnInit(): void {
		this.labelDisplay = new TextField(this.labelField);
		this.valueDisplay = new TextField(this.valueField);
	}
}

interface TextFieldMetadata {
	textValue?: string;
	textColor?: string;
	width?: string;
	marginUD?: string;
	bgColor?: string;
	borderFgMatchBg?: boolean;
	borderFg?: string;
}

class TextField implements TextFieldMetadata {
	textValue = '';
	textColor = '';
	width = '0';
	marginUD = '0';
	bgColor = '';
	borderFgMatchBg = false;
	borderFg = '';
	constructor(data?: TextFieldMetadata) {
		if (data)
			for (const key in data) {
				if (data.hasOwnProperty(key)) {
					// @ts-ignore
					this[key] = data[key];
				}
			}
		if (this.borderFgMatchBg) {
			this.borderFg = this.bgColor;
		}
	}
	setTextValue(textValue: string) {
		this.textValue = textValue;
		return this;
	}
	setTextColor(textColor: string) {
		this.textColor = textColor;
		return this;
	}
	setWidth(width: string) {
		this.width = width;
		return this;
	}
	setMarginUD(marginUD: string) {
		this.marginUD = marginUD;
		return this;
	}
	setBgColor(bgColor: string) {
		this.bgColor = bgColor;
		return this;
	}
	toggleLinkBgFg(overrideBool?: boolean) {
		this.borderFgMatchBg = overrideBool ?? !this.borderFgMatchBg;
		if (this.borderFgMatchBg) {
			this.borderFg = this.bgColor;
		}
		return this;
	}
	setBorderFg(borderFg: string) {
		this.borderFg = borderFg;
		return this;
	}
	toNgStyle() {
		return {
			'color': this.textColor,
			'width': this.width,
			'margin': `${this.marginUD} 0`,
			'background-color': this.bgColor,
			'border-color': this.borderFg,
		};
	}
}

