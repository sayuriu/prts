import { Injectable } from '@angular/core';
import { PopupService } from '@services/popup.service';

import { BlackboardItem } from '@struct/Operator/BlackBoardItem';
import { IndexedCallback, escapeRegExp, bindEventListeners, padArray } from '@utils/utils';
import { OperatorDataManagerService } from './operator-data-manager.service';
import { AttackRange } from '../../../parser/struct/Operator/AttackRange';

@Injectable({
  providedIn: 'root'
})
export class OperatorUtilsService {
	constructor(
		private manager: OperatorDataManagerService,
        private popUp: PopupService,
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
																			      //   match key
			out = out.replace(new RegExp(`\{(${escapeRegExp(key)})(:0(%|\.0f?))?\}`, 'g'), (_1, _2, percentageOrDecimal) => {
                let num = percentageOrDecimal === ':0%' ?
                    new Number((value * 100).toFixed(2)).valueOf().toString() + '%':
                    new Number(value.toFixed(2)).toString();
                return `<span class="ak-numeric" key="${key}">${num}</span>`;
			});
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
        //!
        //TODO
//         const refThis = this;
//
//         const onLeave = function(this: HTMLElement, ev: MouseEvent) {
//             console.log("leave")
//             // element.removeEventListener("mouseleave", onLeave)
//         }
//
//         const onEnter = function(this: HTMLElement, ev: Event) {
//             console.log("enter");
//             // element.addEventListener("mouseleave", onLeave)
//         }
//
//         element.addEventListener("mouseleave", onLeave);
//         element.querySelector('u')?.addEventListener("mouseenter", onEnter);

    }
}

function createRangeTable(range: AttackRange, extend?: AttackRange['grids'])
{
    const coordinates = new Map<number, number[]>();
    for (const { row, col } of range.grids)
    {
        if (coordinates.has(row))
            coordinates.get(row)!.push(col);
        else
            coordinates.set(row, [col]);
    }
    const bias = Math.abs(Math.min(...coordinates.keys()));
    const shiftedCoordinates = new Map<number, number[]>();
    [...coordinates.keys()].forEach(key => {
        const newKey = key + bias;
        shiftedCoordinates.set(newKey, coordinates.get(key)!);
    });

    let out: (null | number)[][] = [];
    for (const [row, cols] of shiftedCoordinates)
    {
        out[row] = [];
        for (const col of cols)
            out[row][col] = 1;
        out[row] = padArray(out[row], null);
    }
    if (extend)
        for (const { row, col } of extend)
            out[row + bias][col] = 2;
    out = padArray(out, null);
    return out;
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
