import type { Operator } from './Operator.interface';

const trait = {
	skill_no_block: 'Can\'t block hostiles when skill is active',
}

const potential_bonuses = {
	deploy: 'Deploy Cost -1',
	redeploy: 'Redeployment Time -4s',
	first_talent: 'First Talent UP!',
	second_talent: 'Second Talent UP!',
	atk: 'ATK +25',
}

const trust_bonuses = {
	atk: 'ATK +40',
	def: 'DEF +40',
}

const op: Operator = {
	overview: {
		names: {
			en: 'Saileach',
			cn: '琴柳',
		},
		id: {
			faction: 'vc10',
			num: '479',
			name: 'sleach'
		},

		rarity: 6,
		position: 'melee',
		sex: 'f',
		faction: 'Victoria',

		roles: ['DP_RECOVERY', 'SUPPORT'],
		trait: 'skill_no_block',
	},
	profession: {
		class: {
			main: 'vanguard',
			sub: 'flag'
		},
		potentials: {
			1: 'deploy',
			2: 'redeploy',
			3: 'atk',
			4: 'first_talent',
			5: 'deploy',
		},
		trust_extra: ['atk', 'def'],
	},
	talents: {
		1: {
			name: 'Unwavering Banner',
			description: [
				'When deployed, holds an $special{Ensign}.',
				'Within the 8 surrounding tiles of the $special{Ensign}:',
				'> ally operators gain $buff{$sleach_t_1[ally].attack_speed};',
				'> and enemies have $buff{$sleach_t_1[enemy].attack_speed}.'
			],
			params: {
				elites: {
					1: {
						'sleach_t_1[ally].attack_speed': '5',
						'sleach_t_1[enemy].attack_speed': '-5'
					},
					2: {
						'sleach_t_1[ally].attack_speed': '10',
						'sleach_t_1[enemy].attack_speed': '-10'
					}
				},
				potentials: {
					5: {
						'sleach_t_1[ally].attack_speed': '-2',
						'sleach_t_1[enemy].attack_speed': '+2'
					}
				}
			}
		},
		2: {
			name: 'Spirital Exchange',
			description: [
				'After this unit\'s deployment:',
				'> Deployment cost of the next operator $buff{is reduced by 2}.'
			]
		}
	},
	skills: {
		combat: {
			1: {
				name: 'Support Order·Type γ',
				trait: {
					sp_charge: 'per_second',
					trigger: 'manual',
				},
				description: ['Stop attacking enemies and gradually obtain $dp_gain while the skill is active.'],
				level_matrix: {
					dp_gain: {
						isConstant: true,
						value: 18
					},
					sp_cost: [35, 34, 33, 32, 31, 30, 29, 28, 27, 26],
					sp_init: [10, 10, 10, 11, 11, 11, 12, 13, 14, 15],
				},
				requirements: {
					matrix: []
				}
			},
			2: {
				name: 'Inheritance of Faith',
				trait: {
					sp_charge: 'per_second',
					trigger: 'manual',
				},
				description: [
					'Stop attacking enemies and gradually obtain $dp_gain while the skill is active.',
					'Pass the $special{Ensign} to the location of the ally with the $hl_min{lowest HP percentage within range}, granting them $def_percentage and healing them for $atk_to_hp_recovery_ratio of Saileach\'s ATK every second.',
					'Retrieve the $special{Ensign} after the skill ends.'
				],
				level_matrix: {
					dp_gain: { isConstant: true, value: 20 },
					def_percentage: [0.1, 0.14, 0.18, 0.22, 0.26, 0.3, 0.35, 0.4, 0.45, 0.5],
					atk_to_hp_recovery_ratio: {
						linkValuesTo: 'def_percentage',
					},
					sp_cost: [38, 37, 36, 35, 34, 33, 32, 31, 30, 29],
					sp_init: [5, 5, 5, 5, 10, 10, 12, 13, 14, 15]
				},
				range: {
					isConstant: true,
					matrix: [
						[null, null, 0],
						[null, 0, 0, 0],
						[0, 0, 0, 0, 0],
						[null, 0, 0, 0],
						[null, null, 0],
					]
				},
				requirements: {
					rank: {
						elite: 1,
						level: 1,
					},
					matrix: []
				}
			},
			3: {
				name: 'Glorious Banner',
				trait: {
					sp_charge: 'per_second',
					trigger: 'manual',
				},
				description: [
					'Stop attacking enemies and immediately obtain $dp_gain.',
					'Throw the $special{Ensign} at the location of a ground enemy, dealing $atk_scale_percent to nearby enemies and Stunning them for $stun_duration.',
					'Inflict $effect_slow and $effect_weaken effect to enemies within the 8 surrounding tiles of the $special{Ensign}.',
					'Retrieve the $special{Ensign} after the skill ends.'
				],
				level_matrix: {
					dp_gain: { isConstant: true, value: 10 },
					skill_duration: { isConstant: true, value: 10 },
					atk_scale: [1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.4, 2.6, 2.8, 3],
					stun_duration: [2.5, 2.5, 2.5, 2.5, 3, 3, 3, 3.5, 3.5, 3.5],
					effect_weaken: [0.15, 0.15, 0.2, 0.2, 0.2, 0.2, 0.25, 0.25, 0.27, 0.3],
					effect_slow: { noStat: true },
					sp_cost: [30, 29, 28, 27, 26, 25, 24, 23, 22, 20],
					sp_init: [0, 0, 0, 0, 5, 5, 6, 7, 7, 7]
				},
				range: {
					isConstant: true,
					matrix: [
						[0],
						[0, 0],
						[1, 0, 0],
						[0, 0],
						[0]
					]
				},
				requirements: {
					rank: {
						elite: 2,
						level: 1,
					},
					matrix: [
						{
							mtl_skill_1: 5
						},
						{
							mat_skill_1: 5,
							mat_keton_1: 6,
							mat_rock_1: 4,
						},
						{
							mat_skill_2: 8,
							mat_device_2: 3,
						},
						{
							mat_skill_2: 8,
							mat_device_2: 3,
							mat_rock_1: 4,
						},
						{
							mat_skill_2: 8,
							mat_loxic_3: 7,
						},
						{
							mat_skill_3: 8,
							mat_manganese_1: 3,
							mat_solvent_1: 5,
						},
						{
							mat_skill_3: 8,
							mat_aloy_4: 8,
							mat_rma7012: 5,
							time: 8,
						},
						{
							mat_skill_3: 12,
							mat_plcf_4: 4,
							mat_device_4: 6,
							time: 16,
						},
						{
							mat_skill_3: 15,
							mat_circuit_4: 4,
							mat_bn_5: 6,
							time: 24,
						},
					]
				}
			}
		},
		infrastructure: {
			1: {
				name: 'Victorian Literature',
				description: 'When stationed at a Dorm, increase mood recovery of one random operator below maximum mood $special{except self} within that dorm by $buff{+0.7 per hour} (When stacked, $special{only the highest effect becomes active})',
			},
			2: {
				name: 'Infectivity',
				description: 'When stationed at the Command Center, if the rate of accumulation of networking resources at HR is less than $diff{+30% (including the base 5%)}, increase accumulation of networking resources by $buff{+20%}',
				traits: 'UNIQUE',
			}
		}
	}
}
