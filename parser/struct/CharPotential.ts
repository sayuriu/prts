export interface CharPotential
{
	//TODO: parser needed for the following fields
	type: number
	equivalentCost: number | null;
	//
	description: string;
	buff: CharPotentialBuffData;
}

interface CharPotentialBuffData
{
	//TODO: parser needed for the following fields
	abnormalFlags: null;
	abnormalImmunes: null;
	abnormalAntis: null;
	abnormalCombos: null;
	abnormalComboImmunes: null;
	//
	attributeModifiers: AttributeModifierData[];
}

interface AttributeModifierData
{
	//TODO: parser needed for the following fields
	attributeType: number,
	formulaItem: number,
	//
	value: number,
	loadFromBlackboard: boolean,
	fetchBaseValueFromSourceEntity: boolean,
}