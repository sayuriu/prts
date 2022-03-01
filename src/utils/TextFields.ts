import { ExcludeProp } from "./utils";

export interface BoundRectMetadata {
	height?: string;
	width?: string;
	expandToAvailableSpace?: boolean;
	border?: string;
	borderMatrixOverride?: [string?, string?, string?, string?];
	margin?: string;
	background?: string;
	borderFg?: string;
	borderFgMatchBg?: boolean;
	centerChildren?: [boolean, string?];
	minHeight?: string;
	minWidth?: string;
	maxHeight?: string;
	maxWidth?: string;
	extraCSS?: { [key: string]: string };
}

export interface TextFieldMetadata extends ExcludeProp<BoundRectMetadata, 'centerChildren'> {
	textValue: string;
	textColor?: string;
	textAlign?: string;
	textDecor?: string;
	textSize?: string;
    fontWeight?: string;
	asHTML?: boolean;
}

export class BoundRect implements BoundRectMetadata {
	height = 'auto';
	width = 'auto';
	expandToAvailableSpace = false;
	margin = '0';
	background = 'transparent';
	border = '';
	borderFg = '';
	minHeight = '';
	minWidth = '';
	maxHeight = '';
	maxWidth = '';
	borderFgMatchBg = false;
	borderMatrixOverride = ['', '', '', ''] as [string, string, string, string];
	centerChildren = [false, 'center'] as [boolean, string];
	extraCSS: { [key: string]: string } = {};

	constructor(metadata: BoundRectMetadata = {}) {
		Object.assign(this, metadata);
	}

	copyFrom(target: this)
	{
		Object.assign(this, target);
	}

	_toNgStyle(preprocessedCSSProps: Record<string, any> = {})
	{
		const prop: Record<string, any> = Object.assign({
			'height': this.height,
			'width': this.width,
			'border': this.border,
			'border-color': this.borderFg,
			'margin': this.margin,
			'background': this.background,
			'min-height': this.minHeight,
			'min-width': this.minWidth,
			'max-height': this.maxHeight,
			'max-width': this.maxWidth,
		}, this.extraCSS, preprocessedCSSProps);
		if (this.borderFgMatchBg)
			prop['border-color'] = this.background;
		if (this.centerChildren[0])
		{
			prop['display'] = 'flex';
			prop['align-items'] = 'center';
			prop['justify-content'] = this.centerChildren[1] || 'center';
		}
		if (this.expandToAvailableSpace)
		{
			prop['flex'] = '1';
			prop['flex-grow'] = '1';
		}
		if (this.borderMatrixOverride.some(v => v !== ''))
		{
			const [bt, br, bb, bl] = this.borderMatrixOverride;
			if (bt) prop['border-top'] = bt;
			if (br) prop['border-right'] = br;
			if (bb) prop['border-bottom'] = bb;
			if (bl) prop['border-left'] = bl;
		}
		return prop;
	}
	toNgStyle()
	{
		return this._toNgStyle();
	}
	update(metadata: BoundRectMetadata = {})
	{
		Object.assign(this, metadata);
	}
}

export class TextField extends BoundRect implements TextFieldMetadata {
	textValue: string = '';
	textColor: string = '';
	textAlign: string = '';
	textDecor: string = '';
	textSize: string = '';
    fontWeight: string = '';
	asHTML: boolean = false;

	constructor(metadata: TextFieldMetadata = { textValue: '' }) {
		super(metadata);
		Object.assign(this, metadata);
	}

	toNgStyle()
	{
		return this._toNgStyle({
			'color': this.textColor,
			'text-align': this.textAlign,
			'text-decoration': this.textDecor,
			'font-size': this.textSize,
            'font-weight': this.fontWeight,
		})
	}

	update(metadata: TextFieldMetadata = { textValue: '' })
	{
		super.update(metadata);
		Object.assign(this, metadata);
	}
}
