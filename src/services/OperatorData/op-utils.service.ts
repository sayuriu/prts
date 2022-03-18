import { Injectable } from '@angular/core';
// import { PopupService } from '@services/popup.service';

import { BlackboardItem } from '@struct/Operator/BlackBoardItem';
import {IndexedCallback, escapeRegExp, bindEventListeners, padArray, Nullable, copyArray} from '@utils/utils';
import { OperatorDataManagerService } from './operator-data-manager.service';
import { AttackRange } from '@struct/Operator/AttackRange';

@Injectable({
  providedIn: 'root'
})
export class OperatorUtilsService {
	constructor(
		private manager: OperatorDataManagerService,
		// private popUp: PopupService,
	) { }

	async Interpolate<T extends unknown>(
		input: T[],
		stringPreprocess: IndexedCallback<T, string>,
		blackboard: IndexedCallback<T, BlackboardItem[]>,
		interpolateOptions: InterpolateOptions = { blackboardValues: true, terms: true, richStyles: true }
	)
	{
		const { blackboardValues, terms, richStyles } = interpolateOptions;
		let output = new Array<string>(input.length).fill('');
		for (let i = 0; i < output.length; i++)
		{
			let _str = stringPreprocess(input[i], i).replace('\n', '<br>');
			const _blackboard = blackboard(input[i], i);
			if (_str.match('{@NO_PROCESS}'))
			{
				output[i] = _str.replace('{@NO_PROCESS}', '');
				continue;
			}
			if (richStyles)
				_str = this.interpolateRichStyles(_str);
			if (blackboardValues)
				_str = this.interpolateBlackboard(_str, _blackboard);
			if (terms)
				_str = await this.interpolateTerms(_str);

			output[i] = _str;
		}
		return output
	}
	private async interpolateTerms(input: string)
	{
		const termDescriptionDict = await this.manager.getTermDescriptionDict();
		return input.replace(/<\$(.+?)>(.+?)<\/>/g, (match: string, tag: string, content: string) => {
			let out = content;
			const term = termDescriptionDict[tag];
			if (term)
				out = [
					'<span class="term-padcomp"><span ',
						`id="${term.termId.replace(/\./g, '-')}" termId="${term.termId}" name="${term.termName}" description="${term.description}" `,
						'class="ak-term rel">',
						`<u class="cur-help">${out}</u>`,
					'</span></span>'
				].join('');
			return out;
		})
	}
	private interpolateRichStyles(input: string)
	{
		return input.replace(/<@(.+?)>(.+?)<\/>/g, (_: string, tag: string, content) => {
			const richText = this.manager.getRichTextStyles(tag);
			if (!richText)
				return content;
			const color = (richText.match(/color=(#[0-9A-F]{6})/) ?? [])[1];
			return color ?
				[
					`<span class="ak-color" style="color: ${color}"><span class="padcomp">`,
					`${richText
						.replace(/<\/?color(=#[0-9A-F]{6})?>/g, '')
						.replace('{0}', content)}`,
					'</span></span>'
				].join('') :
				`${richText.replace('{0}', content)}`;
		})
	}
	private interpolateBlackboard(input: string, blackboard: BlackboardItem[])
	{
		let out = input;
		for (const { key, value } of blackboard)
			out = out.replace(
                new RegExp(`\{(-)?(${escapeRegExp(key)})(:0(%|\.0[f%]?)?)?\}`, 'ig'),
            //match key
                (_1, isNegative, _key, _4, isDecimal, floatOrPercent) => {
                    let num = (`${floatOrPercent}` + `${isDecimal}`).includes('%') ?
                        Number((value * 100 * (isNegative ? -1 : 1)).toFixed(2)).valueOf().toString() + '%':
                        Number((value * (isNegative ? -1 : 1)).toFixed(2)).toString();
                    return `<span class="ak-numeric" key="${key}">${num}</span>`;
			    }
            );
		return out;
	}

	sortBlackboard(blackboard: BlackboardItem[])
	{
		return blackboard.sort((a, b) => {
			return a.key.localeCompare(b.key);
		})
	}
	createHoverDescription(term: TermDescription)
	{
		if (!term) return '';
		return [
			`<ak-term-hover-description class="abs tfull o0">`,
				`<div id="term-title" class="inline">`,
					`<ak-term-title>${term.termName}</ak-term-title>`,
					`<ak-term-id>${term.termId}</ak-term-id>`,
				`</div>`,
				`<ak-term-description>${term.description}</ak-term-description>`,
			`</ak-term-hover-description>`
		].join('');
	}
	updateHoverDescListeners()
	{
		return;
		//!
		//TODO
		const match = document.querySelectorAll('span.term-padcomp');
		for (let i = 0; i < match.length; i++)
			this.toolTipListener(match[i] as HTMLElement);
	}
	toolTipListener(element: HTMLElement)
	{
        return;
		const refThis = this;

		const onLeave = function(this: GlobalEventHandlers, ev: MouseEvent) {
			console.log("leave")
			// element.removeEventListener("mouseleave", onLeave)
		}

		const onEnter = function(this: GlobalEventHandlers, ev: Event) {
			console.log("enter");
			// element.addEventListener("mouseleave", onLeave)
		}

		element.onmouseleave = onLeave;
		// @ts-ignore
        element.querySelector('span')?.onmouseenter = onEnter;
	}

	resolveSpType(spType: number) {
		switch (spType) {
			case 1: return 'Per second';
			case 2: return 'Offensive';
			case 4: return 'Defensive';
			case 8: return 'Always';
			default: return 'Unknown';
		}
	}
	resolveSpTypeColor(type: number) {
		switch (type) {
			case 1: return { bg: '#22ECBC', text: '#000000' };
			case 2: return { bg: '#EF0F0F', text: '#FFFFFF' };
			case 4: return { bg: '#FF7A00', text: '#000000' };
			case 8: return { bg: '#00A3FF', text: '#FFFFFF' };
			default: return { bg: '#C4C4C4', text: '#FFFFFF' };
		}
	}
	resolveSkillType(skillType: number)
	{
		switch (skillType) {
			case 0 : return 'Passive';
			case 1 : return 'Manual';
			case 2 : return 'Auto';
			default: return 'Unknown';
		}
	}
	resolveSkillDuration(duration: number)
	{
		switch (duration) {
			case 0 : return 'Instant';
			case -1 : return '∞';
			default: return duration + 's';
		}
	}

	createRangeTable(range: AttackRange, extend?: AttackRange['grids'] | number)
	{
		const coordinates = new Map<number, number[]>();
        let biasX = 0;
        let biasY = 0;
        let maxLength = 0;
		for (const { row, col } of range.grids)
		{
            if (row < biasY)
                biasY = row;
            if (col < biasX)
                biasX = col;
			if (coordinates.has(row))
				coordinates.get(row)!.push(col);
			else
				coordinates.set(row, [col]);
		}
		biasY = Math.abs(biasY);
        biasX = Math.abs(biasX);
		const shiftedCoordinates = new Map<number, number[]>();
		[...coordinates.keys()].forEach(key => {
			const newKey = key + biasY;
			shiftedCoordinates.set(newKey, coordinates.get(key)!.map((_) => {
                const sum = _ + biasX;
                if ((sum + 1) > maxLength)
                    maxLength = sum + 1;
                return sum;
            }));
		});
		let out: Nullable<number>[][] = [];
		for (const [row, cols] of shiftedCoordinates)
		{
			out[row] = [];
			for (const col of cols)
				out[row][col] = 1;
			out[row] = padArray(out[row], null);
		}
		if (extend)
		{
			if (typeof extend === 'number')
				for (let row = 0; row < out.length; row++)
					out[row] = out[row].concat(new Array(extend).fill(2))
			else
				for (const { row, col } of extend)
					out[row + biasY][col] = 2;
		}
		out = padArray(out, null);
        out[biasY][biasX] = 3;
		return out.map(r => copyArray(r, new Array(maxLength).fill(null))) as Nullable<number>[][];
	}
}

function determinePosition(x: number, y: number, width: number, height: number) : [number, boolean][]
{
	let _x: number, _y: number;
	const intrusionX = x + width;
	const intrusionY = y + height;
	const { innerWidth, innerHeight } = window;

	const lowerHalf = (intrusionY / innerHeight > .5);
	_y = lowerHalf ? (y - 5) : (y + height + 5);
	_x = x;
	return [[_x, false], [_y, lowerHalf]];
}


interface InterpolateOptions {
	blackboardValues?: boolean;
	terms?: boolean;
	richStyles?: boolean;
}

export interface OpClass {
	name: string;
	tl: string;
	en: string;
}

export interface TermDescription
{
	termId: string;
	termName: string;
	description: string;
}
