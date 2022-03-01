import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { AnimManagerService } from '@services/anim-manager.service';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { CharCombatSkill } from '@struct/Operator/DetailedSkill';
import { Operator } from '@struct/Operator/Char';
import { Nullable, waitAsync } from '@utils/utils';

@Component({
	selector: 'op-info-skills',
	templateUrl: './opInfo-Skills.component.html',
	styleUrls: ['./opInfo-Skills.component.scss']
})
export class OpSkillsComponent implements OnInit, OnChanges {

	constructor(
        public anime: AnimManagerService,
        private manager: OperatorDataManagerService,
    ) { }

	@Input() currentOperator!: Operator;

    @Output() onAnimationEnd = new EventEmitter<1>();
    @Input() animAlreadyPlayed: Nullable<''> = null;
    @Input() currentOperatorSkills!: Nullable<CharCombatSkill>[];
    animID = -1;

    currentCombatSkillLevel = 0;
    currentSkillIndex = -1;
    currentFocus = -1;
    changingSkill = false;
    mapToIndex = (_: any, index: number) => index;
    async setCurrentSkill(newIndex: number) {
        this.changingSkill = true;
        this.removeFocus(this.currentFocus);
        await waitAsync(300);
        this.focusOn(newIndex);
        this.currentSkillIndex = newIndex;
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

    processSkillDesc(input: string)
    {
        // input.replace(/<[@](.+?)>(.+?)<\/>/g, ())
        return input;
    }

    handleSkillLevelChange(input: any, event: any)
    {
        this.currentCombatSkillLevel = input.value;
    }

    //? this is stupid
    add1(input: number)
    {
        return new Number(input).valueOf() + 1;
    }
    getSkillLevelData(index: unknown)
    {
        return this.currentOperatorSkills[index as number]!.levels;
    }
    //?

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
}
