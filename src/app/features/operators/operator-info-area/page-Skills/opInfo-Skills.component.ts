import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnimManagerService } from '@services/anim-manager.service';
import { Operator } from '@struct/Operator/Char';
import { Nullable } from '@utils/utils';

@Component({
	selector: 'op-info-skills',
	templateUrl: './opInfo-Skills.component.html',
	styleUrls: ['./opInfo-Skills.component.scss']
})
export class OpSkillsComponent implements OnInit {

	constructor(
        private anime: AnimManagerService
    ) { }

	@Input() currentOperator!: Operator;

    @Output() onAnimationEnd = new EventEmitter<1>();
    @Input() animAlreadyPlayed: Nullable<''> = null;
    animID = -1;

    currentSkillIndex = 0;
    setCurrentSkill(skill: number) {
        this.currentSkillIndex = skill;
    }

	ngOnInit(): void {
        if (!this.anime.enabled)
            this.animAlreadyPlayed = '';
        else
            this.animID = setTimeout(() => {this.onAnimationEnd.emit(1)}, 5000) as unknown as number;
	}
}
