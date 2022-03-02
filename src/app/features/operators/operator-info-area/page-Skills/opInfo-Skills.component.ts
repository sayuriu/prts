import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AnimManagerService } from '@services/anim-manager.service';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { CharCombatSkill } from '@struct/Operator/DetailedSkill';
import { Operator } from '@struct/Operator/Char';
import { Nullable, waitAsync } from '@utils/utils';
import { DomSanitizer } from '@angular/platform-browser';

class Utils {
    add1(input: number)
    {
        return new Number(input).valueOf() + 1;
    }
    parseNumber(input: string)
    {
        return new Number(input).valueOf();
    }
}

@Component({
	selector: 'op-info-skills',
	templateUrl: './opInfo-Skills.component.html',
	styleUrls: ['./opInfo-Skills.component.scss']
})
export class OpSkillsComponent extends Utils implements OnInit, OnChanges {

	constructor(
        public anime: AnimManagerService,
        public sanitizer: DomSanitizer,
        private manager: OperatorDataManagerService,
    ) {
        super();
    }

	@Input() currentOperator!: Operator;
    @Input() currentOperatorSkills!: Nullable<CharCombatSkill>[];
    @Output() onSkillIndexChange = new EventEmitter<number>();

    @Output() onAnimationEnd = new EventEmitter<1>();
    @Input() animAlreadyPlayed: Nullable<''> = null;
    animID = -1;

    currentCombatSkillLevel = new FormControl(0);
    currentSkillIndex = -1;
    currentFocus = -1;
    changingSkill = false;
    async setCurrentSkill(newIndex: number) {
        this.changingSkill = true;
        this.removeFocus(this.currentFocus);
        await waitAsync(300);
        this.focusOn(newIndex);
        this.currentSkillIndex = newIndex;
        this.updateSkillDescription();
        this.changingSkill = false;
    }
    removeFocus(index: number) {
        if (this.currentFocus === index)
            this.currentFocus = -1;
    }
    focusOn(index: number) {
        this.currentFocus = index;
    }

	ngOnInit(): void {
        if (!this.anime.enabled)
            this.animAlreadyPlayed = '';
        else
            this.animID = setTimeout(() => {this.onAnimationEnd.emit(1)}, 5000) as unknown as number;
        waitAsync(150).then(() => this.setCurrentSkill(0));
	}

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes);
    }

    currentSkillDescription!: string[];
    updateSkillDescription() {
        // this.currentSkillDescription = this.currentOperatorSkills[this.currentSkillIndex]!.levels[this.currentCombatSkillLevel.value]?.description;
        this.getSkillDesc().then(out => {
            this.currentSkillDescription = out;
        });
    }

    async getSkillDesc()
    {
        let output = new Array<string>(this.currentOperatorSkills.length).fill('');
        const termDescriptionDict = await this.manager.getTermDescriptionDict();
        for (let i = 0; i < output.length; i++)
        {
            const currentSkillLevel = this.currentOperatorSkills[i]!.levels[this.currentCombatSkillLevel.value];
            if (!currentSkillLevel.description)
            {
                output[i] = 'The weilder has refused to disclose this art.';
                continue;
            }
            output[i] = currentSkillLevel.description.replace(/<[@$](.+?)>(.+?)<\/>/g, (match: string, tag: string, content: string) => {
                let out = '';
                out = content.replace(/\{(.+?)\}/g, (_: string, _txt: string) => {
                    const blackboardKey = (_txt.match(/[a-zA-Z_]+/) ?? [])[0];
                    const { key, value } = currentSkillLevel.blackboard.find((item => item.key === blackboardKey)) ?? {};
                    if (!value)
                        return '';
                    if (_txt.match(':0%'))
                        return new Number((value * 100).toFixed(2)).valueOf().toString() + '%';
                    return new Number(value.toFixed(2)).toString();
                });
                const desc = termDescriptionDict[tag];
                if (desc)
                {
                    out = `<term id="${desc.termId}" name="${desc.termName}" description="${desc.description}">
                        ${out}</term>`;
                }
                const richText = this.manager.getRichTextStyles(tag);
                if (richText)
                {
                    const color = (richText.match(/color=(#[0-9A-F]{6})/) ?? [])[1];
                    if (color)
                    {
                        out =
                            `<span style="color: ${color}; background: #000">
                                ${richText
                                    .replace(/<\/?color(=#[0-9A-F]{6})?>/g, '')
                                    .replace('{0}', out)}</span>`
                    }
                }
                return out;
            });
        }
        return output;
    }

    handleSkillLevelChange(input: any, event: any)
    {
        this.currentCombatSkillLevel.setValue(this.parseNumber(input.value));
        this.updateSkillDescription();
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
    resolveSkillType(skilType: number)
    {
        switch (skilType) {
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
}
