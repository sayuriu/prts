import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
export class OpSkillsComponent implements OnInit {

	constructor(
        private anime: AnimManagerService,
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
    async setCurrentSkill(newIndex: number) {
        this.removeFocus(this.currentFocus);
        this.currentSkillIndex = newIndex;
        await waitAsync(200);
        this.focusOn(newIndex);
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

    resolveSpType(spType: number) {
        switch (spType) {
            case 1: return 'Per second';
            case 2: return 'Offensive';
            case 4: return 'Defensive';
            case 8: return 'Always';
            default: return 'Unknown';
        }
    }
    resolveSkilType(skilType: number)
    {
        switch (skilType) {
            case 0 : return "Passive";
            case 1 : return "Manual";
            case 2 : return "Auto";
            default: return 'Unknown';
        }
    }
}
