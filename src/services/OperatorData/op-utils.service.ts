import { Injectable } from '@angular/core';
import { PopupService } from '@services/popup.service';

import { BlackboardItem } from '@struct/Operator/BlackBoardItem';
import { IndexedCallback, escapeRegExp } from '@utils/utils';
import { OperatorDataManagerService } from './operator-data-manager.service';

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
                    '<span ',
                        `id="${term.termId.replace(/\./g, '-')}" termId="${term.termId}" name="${term.termName}" description="${term.description}" `,
                        'class="ak-term rel">',
                        `<u class="cur-help">${out}</u>`,
                    '</span>'
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
			out = out.replace(new RegExp(`\{(${escapeRegExp(key)})(:0(%|.0))?\}`, 'g'), (_1, _2, percentageOrDecimal) => {
                let num = percentageOrDecimal === ':0%' ?
                    new Number((value * 100).toFixed(2)).valueOf().toString() + '%':
                    new Number(value.toFixed(2)).toString();
                return `<span class="ak-numeric" key="${key}">${num}</span>`;
			});
        return out;
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
        const match = document.querySelectorAll('.ak-term[id][name] u');
        for (let i = 0; i < match.length; i++)
            this.toolTipListener(match[i] as HTMLElement);
    }
    toolTipListener(element: HTMLElement)
    {
        const refThis = this;
        element.addEventListener('mouseenter', function(ev) {
            console.log(ev);
            const { x: srcX, y: srcY, width: srcWidth, height: srcHeight } = this.getBoundingClientRect();
            const [x, y] = determinePosition(srcX, srcY, srcWidth, srcHeight);
            refThis.popUp.display(
                refThis.createHoverDescription({
                    description: this.getAttribute('description') as string,
                    termName: this.getAttribute('name') as string,
                    termId: this.getAttribute('id') as string,
                }),
                {
                    x,
                    y
                },
            )
        });
        element.addEventListener('mouseleave', function(ev) {
            console.log(ev);
            refThis.popUp.clear();
        });
    }
}

function determinePosition(x: number, y: number, width: number, height: number) {
    let _x: number, _y: number;
    const intrusionX = x + width;
    const intrusionY = y + height;
    const { innerWidth, innerHeight } = window;
    _y = (intrusionY / innerHeight > .5 ) ? (y - 5) : (y + height + 5);
    _x = x;
    return [_x, _y];
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
