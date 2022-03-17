//This data is meant for contructing data structures.
exports = {
    name: 'L-44"留声机"',
    description: '通常不攻击且阻挡数为0，技能未开启时<@ba.kw>{max_stack_cnt}</>秒内攻击力逐渐提升至<@ba.kw>+{atk:0%}</>，技能结束时重置攻击力',
    potentialItemId: 'p_char_1012_skadi2',
    nationId: 'leithanien',
    displayNumber: 'R001',
    appellation: "Seaborn's Filial Generation",
    position: 'RANGED',
    tagList: ['费用回复', '费用回复', '控场', '爆发'],
    itemUsage: '罗德岛特种机器人Thermal-EX（亦作THRM-EX），被工程师可露希尔派来执行战地作战任务。',
    itemDesc: '这就是你的选择吗？他或许想要一个锚点来固定住自己，他会紧紧抓牢你。',
    itemObtainApproach: '招募寻访、见习任务',
    profession: 'WARRIOR',
    subProfessionId: 'artsprotector',
    phases: [{
            characterPrefabKey: 'token_10000_silent_healrb',
            rangeId: '3-13',
            maxLevel: 50,
            attributesKeyFrames: [{
                    level: 1,
                    data: {
                        maxHp: 699,
                        atk: 276,
                        def: 48,
                        magicResistance: 10,
                        cost: 18,
                        blockCnt: 1,
                        moveSpeed: 1,
                        attackSpeed: 100,
                        baseAttackTime: 1.6,
                        respawnTime: 70,
                        hpRecoveryPerSec: 0,
                        spRecoveryPerSec: 1,
                        maxDeployCount: 1,
                        maxDeckStackCnt: 0,
                        tauntLevel: 0,
                        massLevel: 0,
                        baseForceLevel: 0,
                        stunImmune: false,
                        silenceImmune: false,
                        sleepImmune: false,
                        frozenImmune: false
                    }
                },
                {
                    level: 50,
                    data: {
                        maxHp: 958,
                        atk: 390,
                        def: 81,
                        magicResistance: 10,
                        cost: 18,
                        blockCnt: 1,
                        moveSpeed: 1,
                        attackSpeed: 100,
                        baseAttackTime: 1.6,
                        respawnTime: 70,
                        hpRecoveryPerSec: 0,
                        spRecoveryPerSec: 1,
                        maxDeployCount: 1,
                        maxDeckStackCnt: 0,
                        tauntLevel: 0,
                        massLevel: 0,
                        baseForceLevel: 0,
                        stunImmune: false,
                        silenceImmune: false,
                        sleepImmune: false,
                        frozenImmune: false
                    }
                }
            ],
            evolveCost: null
        },
        {
            characterPrefabKey: 'token_10000_silent_healrb',
            rangeId: '3-12',
            maxLevel: 70,
            attributesKeyFrames: [{
                    level: 1,
                    data: {
                        maxHp: 958,
                        atk: 390,
                        def: 81,
                        magicResistance: 15,
                        cost: 20,
                        blockCnt: 1,
                        moveSpeed: 1,
                        attackSpeed: 100,
                        baseAttackTime: 1.6,
                        respawnTime: 70,
                        hpRecoveryPerSec: 0,
                        spRecoveryPerSec: 1,
                        maxDeployCount: 1,
                        maxDeckStackCnt: 0,
                        tauntLevel: 0,
                        massLevel: 0,
                        baseForceLevel: 0,
                        stunImmune: false,
                        silenceImmune: false,
                        sleepImmune: false,
                        frozenImmune: false
                    }
                },
                {
                    level: 70,
                    data: {
                        maxHp: 1198,
                        atk: 514,
                        def: 110,
                        magicResistance: 15,
                        cost: 20,
                        blockCnt: 1,
                        moveSpeed: 1,
                        attackSpeed: 100,
                        baseAttackTime: 1.6,
                        respawnTime: 70,
                        hpRecoveryPerSec: 0,
                        spRecoveryPerSec: 1,
                        maxDeployCount: 1,
                        maxDeckStackCnt: 0,
                        tauntLevel: 0,
                        massLevel: 0,
                        baseForceLevel: 0,
                        stunImmune: false,
                        silenceImmune: false,
                        sleepImmune: false,
                        frozenImmune: false
                    }
                }
            ],
            evolveCost: [{
                    id: '3251',
                    count: 3,
                    type: 'MATERIAL'
                },
                {
                    id: '30062',
                    count: 4,
                    type: 'MATERIAL'
                },
                {
                    id: '30042',
                    count: 4,
                    type: 'MATERIAL'
                }
            ]
        },
        {
            characterPrefabKey: 'token_10000_silent_healrb',
            rangeId: '3-10',
            maxLevel: 80,
            attributesKeyFrames: [{
                    level: 1,
                    data: {
                        maxHp: 1198,
                        atk: 514,
                        def: 110,
                        magicResistance: 20,
                        cost: 20,
                        blockCnt: 1,
                        moveSpeed: 1,
                        attackSpeed: 100,
                        baseAttackTime: 1.6,
                        respawnTime: 70,
                        hpRecoveryPerSec: 0,
                        spRecoveryPerSec: 1,
                        maxDeployCount: 1,
                        maxDeckStackCnt: 0,
                        tauntLevel: 0,
                        massLevel: 0,
                        baseForceLevel: 0,
                        stunImmune: false,
                        silenceImmune: false,
                        sleepImmune: false,
                        frozenImmune: false
                    }
                },
                {
                    level: 80,
                    data: {
                        maxHp: 1480,
                        atk: 612,
                        def: 121,
                        magicResistance: 20,
                        cost: 20,
                        blockCnt: 1,
                        moveSpeed: 1,
                        attackSpeed: 100,
                        baseAttackTime: 1.6,
                        respawnTime: 70,
                        hpRecoveryPerSec: 0,
                        spRecoveryPerSec: 1,
                        maxDeployCount: 1,
                        maxDeckStackCnt: 0,
                        tauntLevel: 0,
                        massLevel: 0,
                        baseForceLevel: 0,
                        stunImmune: false,
                        silenceImmune: false,
                        sleepImmune: false,
                        frozenImmune: false
                    }
                }
            ],
            evolveCost: [{
                    id: '3253',
                    count: 3,
                    type: 'MATERIAL'
                },
                {
                    id: '30014',
                    count: 10,
                    type: 'MATERIAL'
                },
                {
                    id: '30073',
                    count: 10,
                    type: 'MATERIAL'
                }
            ]
        }
    ],
    skills: [{
            skillId: 'sktok_blkngt_hypnos_s_1',
            overridePrefabKey: 'skchr_myrtle_1',
            overrideTokenKey: null,
            levelUpCostCond: [{
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 28800,
                    levelUpCost: [{
                            id: '3303',
                            count: 5,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30074',
                            count: 3,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30053',
                            count: 5,
                            type: 'MATERIAL'
                        }
                    ]
                },
                {
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 57600,
                    levelUpCost: [{
                            id: '3303',
                            count: 6,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30094',
                            count: 3,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30074',
                            count: 6,
                            type: 'MATERIAL'
                        }
                    ]
                },
                {
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 86400,
                    levelUpCost: [{
                            id: '3303',
                            count: 10,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30135',
                            count: 4,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30014',
                            count: 5,
                            type: 'MATERIAL'
                        }
                    ]
                }
            ],
            unlockCond: {
                phase: 0,
                level: 1
            }
        },
        {
            skillId: 'sktok_blkngt_hypnos_s_2',
            overridePrefabKey: null,
            overrideTokenKey: 'token_10005_mgllan_drone2',
            levelUpCostCond: [{
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 28800,
                    levelUpCost: [{
                            id: '3303',
                            count: 5,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30084',
                            count: 3,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30063',
                            count: 2,
                            type: 'MATERIAL'
                        }
                    ]
                },
                {
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 57600,
                    levelUpCost: [{
                            id: '3303',
                            count: 6,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30104',
                            count: 3,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30084',
                            count: 5,
                            type: 'MATERIAL'
                        }
                    ]
                },
                {
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 86400,
                    levelUpCost: [{
                            id: '3303',
                            count: 10,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30115',
                            count: 4,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30074',
                            count: 5,
                            type: 'MATERIAL'
                        }
                    ]
                }
            ],
            unlockCond: {
                phase: 1,
                level: 1
            }
        },
        {
            skillId: 'sktok_mgllan_drone1',
            overridePrefabKey: null,
            overrideTokenKey: 'token_10005_mgllan_drone3',
            levelUpCostCond: [{
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 28800,
                    levelUpCost: [{
                            id: '3303',
                            count: 5,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30094',
                            count: 3,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30073',
                            count: 4,
                            type: 'MATERIAL'
                        }
                    ]
                },
                {
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 57600,
                    levelUpCost: [{
                            id: '3303',
                            count: 6,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30014',
                            count: 3,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30094',
                            count: 6,
                            type: 'MATERIAL'
                        }
                    ]
                },
                {
                    unlockCond: {
                        phase: 2,
                        level: 1
                    },
                    lvlUpTime: 86400,
                    levelUpCost: [{
                            id: '3303',
                            count: 10,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30125',
                            count: 4,
                            type: 'MATERIAL'
                        },
                        {
                            id: '30034',
                            count: 4,
                            type: 'MATERIAL'
                        }
                    ]
                }
            ],
            unlockCond: {
                phase: 2,
                level: 1
            }
        }
    ],
    talents: [{
            candidates: [{
                unlockCondition: {
                    phase: 0,
                    level: 1
                },
                requiredPotentialRank: 0,
                prefabKey: '1',
                name: null,
                description: '部署后立即爆炸，对前方一格造成伤害并小力度推动敌人，直接击倒前方一格的战场支柱',
                rangeId: 'x-4',
                blackboard: [{
                        key: 'wpnsts_t_1[ally].sp',
                        value: 1
                    },
                    {
                        key: 'wpnsts_t_1[ally].interval',
                        value: 2
                    },
                    {
                        key: 'wpnsts_t_1[enemy].sp',
                        value: 1
                    },
                    {
                        key: 'wpnsts_t_1[enemy].interval',
                        value: 2
                    },
                    {
                        key: 'duration',
                        value: 20
                    },
                    {
                        key: 'stun',
                        value: 5
                    },
                    {
                        key: 'blast_damage',
                        value: 1000
                    }
                ]
            }]
        },
        {
            candidates: [{
                unlockCondition: {
                    phase: 0,
                    level: 1
                },
                requiredPotentialRank: 0,
                prefabKey: '2',
                name: null,
                description: '-',
                rangeId: null,
                blackboard: [{
                    key: 'ep_recovery_per_sec',
                    value: 75
                }]
            }]
        },
        {
            candidates: [{
                unlockCondition: {
                    phase: 0,
                    level: 1
                },
                requiredPotentialRank: 0,
                prefabKey: '3',
                name: null,
                description: null,
                rangeId: null,
                blackboard: []
            }]
        },
        {
            candidates: [{
                unlockCondition: {
                    phase: 0,
                    level: 1
                },
                requiredPotentialRank: 0,
                prefabKey: '4',
                name: null,
                description: null,
                rangeId: null,
                blackboard: []
            }]
        },
        {
            candidates: [{
                unlockCondition: {
                    phase: 0,
                    level: 1
                },
                requiredPotentialRank: 0,
                prefabKey: '5',
                name: null,
                description: null,
                rangeId: null,
                blackboard: []
            }]
        }
    ],
    potentialRanks: [{
            type: 0,
            description: '生命上限+200',
            buff: {
                attributes: {
                    abnormalFlags: null,
                    abnormalImmunes: null,
                    abnormalAntis: null,
                    abnormalCombos: null,
                    abnormalComboImmunes: null,
                    attributeModifiers: [{
                        attributeType: 0,
                        formulaItem: 0,
                        value: 200,
                        loadFromBlackboard: false,
                        fetchBaseValueFromSourceEntity: false
                    }]
                }
            },
            equivalentCost: null
        },
        {
            type: 0,
            description: '再部署时间-10秒',
            buff: {
                attributes: {
                    abnormalFlags: null,
                    abnormalImmunes: null,
                    abnormalAntis: null,
                    abnormalCombos: null,
                    abnormalComboImmunes: null,
                    attributeModifiers: [{
                        attributeType: 4,
                        formulaItem: 0,
                        value: -1,
                        loadFromBlackboard: false,
                        fetchBaseValueFromSourceEntity: false
                    }]
                }
            },
            equivalentCost: null
        },
        {
            type: 0,
            description: '再部署时间-5秒',
            buff: {
                attributes: {
                    abnormalFlags: null,
                    abnormalImmunes: null,
                    abnormalAntis: null,
                    abnormalCombos: null,
                    abnormalComboImmunes: null,
                    attributeModifiers: [{
                        attributeType: 1,
                        formulaItem: 0,
                        value: 30,
                        loadFromBlackboard: false,
                        fetchBaseValueFromSourceEntity: false
                    }]
                }
            },
            equivalentCost: null
        },
        {
            type: 0,
            description: '再部署时间-10秒',
            buff: {
                attributes: {
                    abnormalFlags: null,
                    abnormalImmunes: null,
                    abnormalAntis: null,
                    abnormalCombos: null,
                    abnormalComboImmunes: null,
                    attributeModifiers: [{
                        attributeType: 4,
                        formulaItem: 0,
                        value: -1,
                        loadFromBlackboard: false,
                        fetchBaseValueFromSourceEntity: false
                    }]
                }
            },
            equivalentCost: null
        },
        {
            type: 1,
            description: '第二天赋效果增强',
            buff: {
                attributes: {
                    abnormalFlags: null,
                    abnormalImmunes: null,
                    abnormalAntis: null,
                    abnormalCombos: null,
                    abnormalComboImmunes: null,
                    attributeModifiers: [{
                        attributeType: 4,
                        formulaItem: 0,
                        value: -1,
                        loadFromBlackboard: false,
                        fetchBaseValueFromSourceEntity: false
                    }]
                }
            },
            equivalentCost: null
        }
    ],
    favorKeyFrames: [{
            level: 0,
            data: {
                maxHp: 0,
                atk: 0,
                def: 0,
                magicResistance: 0,
                cost: 0,
                blockCnt: 0,
                moveSpeed: 0,
                attackSpeed: 0,
                baseAttackTime: 0,
                respawnTime: 0,
                hpRecoveryPerSec: 0,
                spRecoveryPerSec: 0,
                maxDeployCount: 0,
                maxDeckStackCnt: 0,
                tauntLevel: 0,
                massLevel: 0,
                baseForceLevel: 0,
                stunImmune: false,
                silenceImmune: false,
                sleepImmune: false,
                frozenImmune: false
            }
        },
        {
            level: 50,
            data: {
                maxHp: 200,
                atk: 70,
                def: 0,
                magicResistance: 0,
                cost: 0,
                blockCnt: 0,
                moveSpeed: 0,
                attackSpeed: 0,
                baseAttackTime: 0,
                respawnTime: 0,
                hpRecoveryPerSec: 0,
                spRecoveryPerSec: 0,
                maxDeployCount: 0,
                maxDeckStackCnt: 0,
                tauntLevel: 0,
                massLevel: 0,
                baseForceLevel: 0,
                stunImmune: false,
                silenceImmune: false,
                sleepImmune: false,
                frozenImmune: false
            }
        }
    ],
    allSkillLvlup: [{
            unlockCond: {
                phase: 0,
                level: 1
            },
            lvlUpCost: [{
                id: '3301',
                count: 4,
                type: 'MATERIAL'
            }]
        },
        {
            unlockCond: {
                phase: 0,
                level: 1
            },
            lvlUpCost: [{
                    id: '3301',
                    count: 5,
                    type: 'MATERIAL'
                },
                {
                    id: '30061',
                    count: 4,
                    type: 'MATERIAL'
                },
                {
                    id: '30031',
                    count: 4,
                    type: 'MATERIAL'
                }
            ]
        },
        {
            unlockCond: {
                phase: 0,
                level: 1
            },
            lvlUpCost: [{
                    id: '3302',
                    count: 6,
                    type: 'MATERIAL'
                },
                {
                    id: '30012',
                    count: 4,
                    type: 'MATERIAL'
                }
            ]
        },
        {
            unlockCond: {
                phase: 1,
                level: 1
            },
            lvlUpCost: [{
                    id: '3302',
                    count: 8,
                    type: 'MATERIAL'
                },
                {
                    id: '30022',
                    count: 4,
                    type: 'MATERIAL'
                },
                {
                    id: '30052',
                    count: 4,
                    type: 'MATERIAL'
                }
            ]
        },
        {
            unlockCond: {
                phase: 1,
                level: 1
            },
            lvlUpCost: [{
                    id: '3302',
                    count: 6,
                    type: 'MATERIAL'
                },
                {
                    id: '30053',
                    count: 4,
                    type: 'MATERIAL'
                }
            ]
        },
        {
            unlockCond: {
                phase: 1,
                level: 1
            },
            lvlUpCost: [{
                    id: '3303',
                    count: 6,
                    type: 'MATERIAL'
                },
                {
                    id: '30063',
                    count: 2,
                    type: 'MATERIAL'
                },
                {
                    id: '30023',
                    count: 3,
                    type: 'MATERIAL'
                }
            ]
        }
    ],
    tokenKey: 'token_10017_skadi2_dedant',
    groupId: 'blacksteel',
    trait: {
        candidates: [{
                unlockCondition: {
                    phase: 0,
                    level: 1
                },
                requiredPotentialRank: 0,
                blackboard: [{
                        key: 'attack@atk_to_hp_recovery_ratio',
                        value: 0.2
                    },
                    {
                        key: 'talent_override_rangeid_flag',
                        value: 0.15
                    },
                    {
                        key: 'max_atk_scale',
                        value: 1.1
                    },
                    {
                        key: 'max_stack_cnt',
                        value: 6
                    }
                ],
                overrideDescripton: '恢复友方单位生命，并回复相当于攻击力<@ba.kw>{ep_heal_ratio:0%}</>的<$ba.dt.element>元素损伤</>（可以回复未受伤友方单位的<$ba.dt.element>元素损伤</>）',
                prefabKey: '-1',
                rangeId: '1-3'
            },
            {
                unlockCondition: {
                    phase: 1,
                    level: 1
                },
                requiredPotentialRank: 0,
                blackboard: [{
                        key: 'attack@max_target',
                        value: 4
                    },
                    {
                        key: 'attack@sluggish',
                        value: 0.5
                    }
                ],
                overrideDescripton: '攻击造成<@ba.kw>法术伤害</>，且会在<@ba.kw>{attack@max_target}</>个敌人间跳跃，每次跳跃伤害降低15%并造成短暂<$ba.sluggish>停顿</>',
                prefabKey: '-1',
                rangeId: null
            },
            {
                unlockCondition: {
                    phase: 2,
                    level: 1
                },
                requiredPotentialRank: 0,
                blackboard: [{
                    key: 'value',
                    value: 70
                }],
                overrideDescripton: '不成为其他角色的治疗目标，每次攻击到敌人后回复自身<@ba.kw>{value}</>生命',
                prefabKey: null,
                rangeId: null
            }
        ]
    },
    teamId: 'followers'
}