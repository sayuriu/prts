import { Component, EventEmitter, Input, OnChanges, OnInit, AfterViewChecked, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';

import { AnimManagerService } from '@services/anim-manager.service';
import { OperatorUtilsService } from '@services/OperatorData/op-utils.service';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { CharCombatSkill } from '@struct/Operator/DetailedSkill';
import { Operator } from '@struct/Operator/Char';
import { Nullable, waitAsync } from '@utils/utils';
import { DomSanitizer } from '@angular/platform-browser';
import { BlackboardItem } from '@root/src/struct/Operator/BlackBoardItem';

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
export
class OpSkillsComponent
extends Utils
implements OnInit, OnChanges, AfterViewChecked {

	constructor(
        public anime: AnimManagerService,
        public sanitizer: DomSanitizer,
        public manager: OperatorDataManagerService,
        private opUtils: OperatorUtilsService
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
        if (this.currentSkillIndex === newIndex) return;
        // if (this.skillParamsVisible) this.toggleSkillParams();
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

	ngOnInit() {
        this.currentSkillDescriptions = new Array(this.currentOperatorSkills.length).fill('');
        if (!this.anime.enabled)
            this.animAlreadyPlayed = '';
        else
            this.animID = setTimeout(() => {this.onAnimationEnd.emit(1)}, 5000) as unknown as number;
        waitAsync(150)
            .then(() => this.setCurrentSkill(0))
            .then(() => this.updateSkillDescription());

	}

    ngOnChanges(changes: SimpleChanges): void {
        // console.log(changes);
    }

    viewUpdated = false;
    ngAfterViewChecked(): void {
        // console.log('ngAfterViewChecked');
        if (this.viewUpdated) return;
        this.opUtils.updateHoverDescListeners();
        this.viewUpdated = true;
        setTimeout(() => this.viewUpdated = false, 200);
    }

    sortSkillBlackboard(skill: Nullable<CharCombatSkill>) {
        if (!skill?.levels?.length) return [];
        return skill.levels[this.currentCombatSkillLevel.value].blackboard.sort((a, b) => {
            if (a.key < b.key) return -1;
            if (a.key > b.key) return 1;
            return 0;
        });
    }

    skillParamsVisible = false;
    toggleSkillParams() {
        this.skillParamsVisible = !this.skillParamsVisible;
    }

    currentSkillDescriptions!: string[];
    updateSkillDescription() {
        this.opUtils.Interpolate<Nullable<CharCombatSkill>>(
            new Array(...this.currentOperatorSkills),
            (skill, index) => {
                if (!skill) return '{@NO_PROCESS}The weilder has refused to disclose this art.'
                const currentSkillLevel = skill.levels[this.currentCombatSkillLevel.value];
                if (!currentSkillLevel.description)
                    return '{@NO_PROCESS}The weilder has refused to disclose this art.'
                return currentSkillLevel.description;
            },
            (skill) => skill?.levels[this.currentCombatSkillLevel.value]?.blackboard ?? [],
        ).then(out => {
            this.currentSkillDescriptions = out;
        });
    }


    handleSkillLevelChange(input: HTMLInputElement, event?: Event)
    {
        console.log('skillLevelUpdate');
        if (event instanceof WheelEvent)
        {
            if (event.deltaY < 0)
            {
                if (this.currentCombatSkillLevel.value + 1 > this.currentOperatorSkills[this.currentSkillIndex]!.levels.length - 1) return;
                this.currentCombatSkillLevel.setValue(this.currentCombatSkillLevel.value + 1);
            }
            else if (event.deltaY > 0)
            {
                if (this.currentCombatSkillLevel.value - 1 < 0) return;
                this.currentCombatSkillLevel.setValue(this.currentCombatSkillLevel.value - 1);
            }
        }
        else this.currentCombatSkillLevel.setValue(input.valueAsNumber);
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
