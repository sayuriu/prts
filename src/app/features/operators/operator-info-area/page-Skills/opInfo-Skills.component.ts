import { Component, EventEmitter, Input, OnChanges, OnInit, AfterViewChecked, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

import { AnimManagerService } from '@services/anim-manager.service';
import { OperatorUtilsService } from '@services/OperatorData/op-utils.service';
import { OperatorDataManagerService } from '@services/OperatorData/operator-data-manager.service';
import { PopupService } from '@services/popup.service';
import { CharCombatSkill, SkillLevelData } from '@struct/Operator/DetailedSkill';
import { AttackRange } from '@struct/Operator/AttackRange';
import { Operator } from '@struct/Operator/Char';
import { Nullable, waitAsync, get2dArraySize } from '@utils/utils';

class Utils {
    add1(input: number)
    {
        return Number(input).valueOf() + 1;
    }
    parseNumber(input: string)
    {
        return Number(input).valueOf();
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
        public popup: PopupService,
        public opUtils: OperatorUtilsService,
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
        this.currentSkillRanges = new Array(this.currentOperatorSkills.length).fill([[], [0, 0]]);
        this.getEliteRangeData();
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

    currentSkillRanges!: Nullable<[Nullable<number>[][], [number, number]]>[];
    currentSkillDescriptions!: string[];
    updateSkillDescription() {
        this.opUtils.Interpolate<Nullable<CharCombatSkill>>(
            new Array(...this.currentOperatorSkills),
            (skill, index) => {
                if (!skill) return '{@NO_PROCESS}The wielder has refused to disclose this art.'
                this.currentSkillRanges[index] = this.createSkillRangeTable(skill!.levels[this.currentCombatSkillLevel.value]) ?? [[], [0, 0]];
                const currentSkillLevel = skill.levels[this.currentCombatSkillLevel.value];
                if (!currentSkillLevel.description)
                    return '{@NO_PROCESS}The wielder has refused to disclose this art.'
                return currentSkillLevel.description;
            },
            (skill) => skill?.levels[this.currentCombatSkillLevel.value]?.blackboard ?? [],
        ).then(out => {
            this.currentSkillDescriptions = out;
        });
    }

    handleSkillLevelChange(input: HTMLInputElement, event?: Event)
    {
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

    // onSkillParamHover(element: Element, event: Event, inbound: boolean, data: string)
    // {
    //     if (inbound)
    //     {
    //         const { x, y, height } = (element as HTMLElement).getBoundingClientRect();
    //         this.popup.initTransform.setValue('translateY(20px)');
    //         this.popup.display(
    //             [
    //                 `<p style="color: #fff; background-color: #000">${data}</p>`,
    //             ].join(''),
    //             {
    //                 x: x + 15,
    //                 y: y + height,
    //             },
    //             'v'
    //         )
    //         return;
    //     }
    //     this.popup.clear();
    // }

    atkRangeByElite: [string, number][] = [];
    currentEliteLevel = 0;
    getEliteRangeData()
    {
        for (let i = 0; i < this.currentOperator.phases.length; i++)
        {
            const { rangeId } = this.currentOperator.phases[i]!;
            if (this.atkRangeByElite.findIndex(x => x[0] === rangeId) === -1)
                this.atkRangeByElite.push([rangeId, i]);
        }
    }

    createSkillRangeTable(currentSkill: SkillLevelData): [Nullable<number>[][], [number, number]] | null
    {
        const extend = currentSkill.blackboard.find(x => x.key === 'ability_range_forward_extend');
        let rangeData: Nullable<AttackRange>;
        let computed: Nullable<number>[][];
        if (extend)
        {
            rangeData = this.manager.getRangeData(this.currentOperator.phases[this.currentEliteLevel]!.rangeId);
            if (!rangeData) return null;
            computed = this.opUtils.createRangeTable(rangeData, extend.value);
            return [computed, get2dArraySize(computed) as [number, number]];
        }

        rangeData = this.manager.getRangeData(currentSkill.rangeId);
        if (!rangeData) return null;
        computed = this.opUtils.createRangeTable(rangeData);

        return [computed, get2dArraySize(computed) as [number, number]];
    }

    hasRangeData(skillIndex: number, skillLevel: number)
    {
        const { rangeId, blackboard } = this.currentOperatorSkills[skillIndex]!.levels[skillLevel];
        return !!rangeId || !!blackboard.find(x => x.key === 'ability_range_forward_extend');
    }
}
