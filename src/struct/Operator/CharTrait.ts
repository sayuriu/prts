import { HasCandidate, Range } from "../Basic";
import { AttackRange as CharRangeId } from "./AttackRange";
import { BlackboardItem } from "./BlackBoardItem";
import {SkillUnlockCond} from "@struct/Operator/CharSkill";

type Range0_2 = Range.$0_2;
type Range0_5 = Range.$0_5;

export interface CharTraitCandidate
{
	unlockCondition: {
		phase: Range0_2;
		level: number;
	};
	requiredPotentialRank: Range0_5,
	blackboard: BlackboardItem[];
	overrideDescripton: string;
	rangeId: CharRangeId;
	//TODO: parser needed for the following fields
	prefabKey: string;
}

export type CharTrait = HasCandidate<CharTraitCandidate>;
