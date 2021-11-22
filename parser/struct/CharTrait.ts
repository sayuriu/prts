import { CharRangeId, HasCandidate, Range } from "./Basic";
import { BlackboardItem } from "./BlackBoardItem";

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
