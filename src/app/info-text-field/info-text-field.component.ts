import { Component, OnInit, OnChanges, Input, SimpleChanges } from '@angular/core';
import { BoundRect, TextField, BoundRectMetadata, TextFieldMetadata } from '@utils/TextFields';

@Component({
	selector: 'text-field',
	templateUrl: './info-text-field.component.html',
	styleUrls: ['./info-text-field.component.scss']
})
export class InfoTextFieldComponent implements OnInit, OnChanges {

	constructor() {
		this._boundRect = new BoundRect();
		this._labelField = new BoundRect();
		this._valueField = new BoundRect();
		this._labelFieldText = new TextField();
		this._valueFieldText = new TextField();
	}

	@Input() boundRect!: BoundRectMetadata;
	@Input() labelField!: BoundRectMetadata;
	@Input() valueField!: BoundRectMetadata;
	@Input() labelFieldText!: TextFieldMetadata;
	@Input() valueFieldText!: TextFieldMetadata;

	_boundRect!: BoundRect;
	_labelField!: BoundRect;
	_valueField!: BoundRect;
	_labelFieldText!: TextField;
	_valueFieldText!: TextField;
	ngOnInit(): void {
		this._boundRect.update(this.boundRect);
		this._labelField.update(this.labelField);
		this._valueField.update(this.valueField);
		this._labelFieldText.update(this.labelFieldText);
		this._valueFieldText.update(this.valueFieldText);
	}
	ngOnChanges(changes: SimpleChanges)
	{
		for (const key in changes)
			if (['boundRect', 'labelField', 'valueField', 'labelFieldText', 'valueFieldText'].includes(key))
				// @ts-ignore
				this[`_${key}`].update(changes[key].currentValue);
	}
}