/*	-INFORMATION-
    Subject:	Class, Subclass
    Effect:		This script updates the Illrigger MCDM class, originally developed by jaydee829 and later maintained by Tedge.
    Code by:	ShadowzAll with portions borrowed from Nod, ReadingToskr, MasterJedi, Pokesimmer and others.
    Date:		2024-12-31 (sheet v13.2.3)
    Notes:		This iteration will be from the "The Illrigger Revised".
            	
*/

var iFileName = "MCDM_Illrigger.js";
RequiredSheetVersion("13.2.3");

/*	-SCRIPT AUTHOR NOTE-
    This file should be installed AFTER the other 2024 PHB & DMG scripts made by ThePokésimmer (if using 2024 rules).
*/

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >>> Define Sources for everything first >>> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

SourceList["MCDM"] = {
    name: "MCDM: The Illrigger Revised",
    abbreviation: "tIR",
    date: "2024/12/31",
    group: "MCDM",
    url: "https://www.dndbeyond.com/sources/dnd/tir/the-illrigger-revised",
};
// Add Base Class
ClassList["illrigger"] = {
    name: "Illrigger",
    regExpSearch: /illrigger/i,
    source: ["IR", 9],
    primaryAbility: "Strength, Dexterity or Charisma, and Constitution",
    abilitySave: 6,
    prereqs: "Strength or Dexterity 13 & Charisma 13",
    die: 10,
    improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
    saves: ["Con", "Cha"],
    skillstxt: { primary: "Choose two from Arcana, Athletics, Deception, Insight, Intimidation, Investigation, Persuasion, Religion, and Stealth" },
    armorProfs: {
        primary: [true, true, false, true],
        secondary: [true, true, false, true]
    },
    weaponProfs: {
        primary: [true, true],
        secondary: [true, true],
    },
    equipment: "Illrigger starting equipment:" +
        "\n \u2022 Two martial weapons or one martial weapon and a shield" +
        "\n \u2022 Chain shirt or leather armor, a longbow, and 20 arrows" +
        "\n \u2022 A priest's pack or a dungeoneer's pack" +
        "\n \u2022 Five javelins" +
        "\n\nAlternatively, you can forgo the starting equipment and background equipment, and start with 5d4 x 10 gp.",
    subclasses: ["Diabolic Contracts", []],
    attacks: levels.map(function (n) { return n < 5 ? 1 : 2 }),
    features: {
        "baleful interdict": {
            name: "Baleful Interdict - Seals",
            source: ["IR", 11],
            range: "30ft",
            minlevel: 1,
            description: desc([
                "Once per turn, when I hit a target with a weapon attack, I can place a magical seal on a",
                "creature within 30ft of me, or I can use a bonus action to place a seal on a target I can see",
                "within range. This seal lasts for 1 minute or until burned. See Pg3 notes.",
            ]),
            toNotesPage: [{
                name: "Baleful Interdict",
                note: desc([
                    "A creature with one or more seals is Interdicted. Seals you place are invisible to other\n   creatures, but appear to you as glowing glyphs.",
                    "\u2022 Burning Seals. When an Interdicted creature you can see within 30ft takes damage from any\n     source other than an Illrigger seal, you can burn any number of seals you have placed on\n     them to deal 1d6 Fire or Necrotic damage (choice), per seal, to that creature. This\n     damage is dealt immediately after triggering the damage. Burning a seal does not require an\n     action, and cannot be done while incapacitated. Once a seal is burned, it vanishes." +
                    "\n     At 5th level (2d6), 11th level (3d6), 20th level (4d6) your seals gain an extra incremental 1d6\n     to its Fire or Necrotic damage.",
                    "\u2022 Interdict Save. Your Interdict Save DC is the same as your Ability DC.",
                ]),
                page3notes: true,
            }],
            additional: ["1d6", "1d6", "1d6", "1d6", "2d6", "2d6", "2d6", "2d6", "2d6", "2d6", "3d6", "3d6", "3d6", "3d6", "3d6", "3d6", "3d6", "3d6", "3d6", "4d6"],
            usages: levels.map(function (n) {
                return n < 3 ? 3 : n < 7 ? 4 : n < 13 ? 5 : n < 18 ? 6 : 7
            }),
            recovery: "short rest",
            action: ["bonus action", ""],
        },
        "forked tongue": {
            name: "Forked Tongue",
            source: ["IR", 11],
            minlevel: 1,
            languageProfs: [["Infernal"], 2],
            changeeval: function (level, field) {
                if (level[1] >= 9 && level[0] < 9) {
                    processLanguages(true, "Illrigger: Forked Tongue", [1]);
                }
                else if (level[1] < 9 && level[0] >= 9) {
                    processLanguages(false, "Illrigger: Forked Tongue", [1]);
                }
            },
            description: levels.map(function (n) {
                var descr = desc(["I know Infernal and can choose two other languages. I can replace one of those two\n   languages once per long rest."]);
                if (n >= 9) {
                    descr += desc(["At 9th level, I learn another language and gain Adv on Wis (Insight)."]);
                }
                return descr;
            }),
            forkedtongueadv: {
                vision: ["Adv on Insight checks: sincerity and intention"],
                advantages: [["Ins", true]],
            },
            autoSelectExtrachoices: [{
                extrachoice: "forkedtongueadv",
                minlevel: 9,
            }]

        },
        "combat mastery": {
            name: "Combat Mastery",
            source: ["IR", 12],
            minlevel: 2,
            description: "\n   " + "Choose a Combat Mastery from the Class Features Options",
            choices: ["Bravado", "Brutal", "Inexorable", "Lies", "Lissome", "Unfettered"],
            choicesNotInMenu: false,
            "bravado": {
                name: "Bravado",
                description: "\n   " + "While I am not wearing armor, my AC is 10 + Dexterity Modifier + Charisma Modifier.\n" + "   I can use a shield and still gain this benefit.",
                armorOptions: {
                    regExpSearch: /justToAddToDropDownAndEffectWildShape/,
                    name: "Unarmored Defense (Cha)",
                    source: ["IR", 8],
                    ac: "10 + Cha + Dex",
                },
            },
            "brutal": {
                name: "Brutal",
                description: desc([
                    "When I hit a creature up to one size larger with a two-handed melee weapon, I can move the\n" + "   target 5ft horizontally and use part of my movement to occupy that space."
                ]),
            },
            "inexorable": {
                name: "Inexorable",
                description: desc([
                    "I gain a +1 bonus to Saving Throws for each hostile creature within 5ft of me, up to +5.",
                ]),
            },
            "lies": {
                name: "Lies",
                description: desc(["I can choose a melee weapon type and add my Charisma modifier, instead of my Strength or ",
                    "Dexterity modifiers, for Attack \u0026 Damage rolls. I can change weapon types after a long rest.",
                ]),
                    calcChanges: {
                    atkAdd: [
                        function (fields, v) {
                            // if Weapon is a melee weapon (example: battleaxe, greatsword,etc) you can use Cha Mod, Str Mod, Dex Mod for attack and dmg rolls. Whichever is higher.
                            if (What('Cha Mod') > What(AbilityScores.abbreviations[fields.Mod - 1] + ' Mod') && (v.isMeleeWeapon))
                                fields.Mod = 6;
                        },
                        "I can choose a melee weapon type and use my Charisma Modifier instead of Strength or Dexterity for attack and damage rolls.",
                    ]
                },
            },
            "lissome": {
                name: "Lissome",
                description: desc([
                    "When I hit a creature with a melee weapon attack, I can spend my movement to move 5ft\n   without provoking opportunity attacks."
                ]),
            },
            "unfettered": {
                name: "Unfettered",
                description: desc([
                    "When I place or burn seals, the range is 60ft. When I gain the Infernal Conduit Feat, the range\n   is 30ft. Being within 5ft of an enemy doesn't impose Disadvantage on my attack rolls with\n   ranged weapons."
                ]),
            },
        },
        "interdiction": {
            name: "Interdiction",
            source: ["IR", 12],
            minlevel: 2,
            description: desc([
                "I learn one Interdict Boon of my choice. I gain additional Interdict Boons as I level.",
                "When I gain an Illrigger Level, I can replace a Boon I know with another."
            ]),
            additional: levels.map(function (n) {
                return n < 1 ? "" : (n < 7 ? 1 : n < 13 ? 2 : n < 18 ? 3 : 4) + " Interdict Boon's known.";
            }),
            extraname: "Interdiction Boon",
            extrachoices: ["Abating Seal", "Bedevil", "Soul Eater", "Styx's Apathy", "Swift Retribution", "Acheron's Chain", "Conflagrant Channel", "Eyes of the Gate", "Shadow Shroud", "Unleash Hell", "Vengeful Shot", "Dis's Onslaught", "Flash of Brimstone", "Hellish Frenzy", "Hellsight", "Impaling Shot", "Iron Gaol", "Last Word", "Soul's Doom"],
            extratimes: levels.map(function (n) {
                return n < 1 ? 0 : n < 7 ? 1 : n < 13 ? 2 : n < 18 ? 3 : 4;
            }),
            choicesNotInMenu: false,
            "abating seal": {
                name: "Abating Seal",
                submenu: "[Interdict Boon  02+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
                description: desc([
                    "When a creature I can see damages me or an ally within 30ft of me, I can expend a seal as a\n   Reaction to reduce damage taken by an amount equal to 1d10 + half my Illrigger level."
                ]),
                action: ["reaction", ""]
            },
            "bedevil": {
                name: "Bedevil",
                submenu: "[Interdict Boon  02+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
                description: desc([
                    "When I burn a seal on an Interdicted creature, I can activate this Boon. The target must\n   subtract a number equal to my Proficiency Bonus from the result of the next Saving Throw\n   made before the end of their next turn.",
                ])
            },
            "soul eater": {
                name: "Soul Eater",
                submenu: "[Interdict Boon  02+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
                description: desc([
                    "When I burn a seal on an Interdicted creature, I can activate this Boon to gain temporary hit\n   points equal to my Illrigger level."
                ])
            },
            "styx's apathy": {
                name: "Styx's Apathy",
                submenu: "[Interdict Boon  02+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
                description: desc([
                    "When I burn a seal on an Interdicted creature, I can use my Reaction to prevent the target from\n   using their Reaction until the end of their next turn."
                ]),
                action: ["reaction", ""]
            },
            "swift retribution": {
                name: "Swift Retribution (Passive)",
                submenu: "[Interdict Boon  02+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
                description: desc([
                    "When an Interdicted creature provokes an opportunity attack from me, I can attack without\n   using my Reaction. I cannot benefit from this Boon again until the start of my next turn."
                ])
            },
            "acheron's chain": {
                name: "Acheron's Chain (Trgr: Place/Move Seal)",
                submenu: "[Interdict Boon  07+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
                description: desc([
                    "When I use a Bonus Action to place or move a seal on a Large or smaller creature, the target",
                    "must make a Strength Saving Throw (no action). On fail, I can pull the target 10ft towards me",
                    "or cause them to be Grappled until the end of my next turn. Nothing happens on success.",
                    "The Save DC is my Interdict (Ability) Save DC.",
                ]),
                action: ["bonus action", ""]
            },
            "conflagrant channel": {
                name: "Conflagrant Channel",
                submenu: "[Interdict Boon  07+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
                description: desc([
                    "I can expend a seal as a Bonus Action to teleport up to 60ft to an unoccupied space I can see."
                ]),
                action: ["bonus action", ""]
            },
            "eyes of the gate": {
                name: "Eyes Of The Gate",
                submenu: "[Interdict Boon  07+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
                description: desc([
                    "I can use an Action to expend 1+ seals on a creature I can see within 60ft to bind our senses.",
                    "The creature must make a Wisdom Saving Throw; they can willingly fail. On fail, I am ",
                    "bound to the targets awareness for a number of hours equal to the amount of seals used. For ",
                    "the duration, I can use an action to see and hear through the target, using any special senses, ",
                    "until I use my action to return to my own. I can place or burn seals, and use Interdict Boons ",
                    "through the target; the target becomes aware. and can use their Action to repeat the saving",
                    "throw, ending on success. I cannot use my own senses when I am using the target's senses.",
                ]),
                action: ["action", ""]
            },
            "shadow shroud": {
                name: "Shadow Shroud",
                submenu: "[Interdict Boon  07+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
                description: desc([
                    " I can expend a seal as a Bonus Action to increase my AC, or target (5ft) AC by +2 for 1 minute.",
                ]),
                action: ["bonus action", ""]
            },
            "unleash hell": {
                name: "Unleash Hell",
                submenu: "[Interdict Boon  07+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
                description: desc([
                    "When I burn 1+ seals on an Interdicted creature, I can use my Reaction to trigger a Dexterity ",
                    "Saving throw on each creature I choose within 5ft of the target. On fail, a creature takes the ",
                    "amount and type of damage the seals dealt to the Interdicted creature. On a success,",
                    "creature takes half damage."
                ]),
                action: ["reaction", ""]
            },
            "vengeful shot": {
                name: "Vengeful Shot",
                submenu: "[Interdict Boon  07+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
                description: desc([
                    "I can expend a seal as a Reaction when a creature makes a ranged attack against me, or an ",
                    "ally I can see within 30ft. I can make a ranged weapon attack against the attacker. If it hits, I ",
                    "deal extra damage equal to half of my Illrigger level, rounded down."
                ]),
                action: ["reaction", ""]
            },
            "dis's onslaught": {
                name: "Dis's Onslaught (Passive)",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "When I use a Bonus Action to place or move a seal, I can make a weapon attack."
                ])
            },
            "flash of brimstone": {
                name: "Flash of Brimstone (Trgr: Place/Move Seal)",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "When I place or move a seal, I can teleport to unoccupied space within 5ft of the target.\n   (No action req)."
                ])
            },
            "hellish frenzy": {
                name: "Hellish Frenzy",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "When I start my turn within 30ft of Interdicted creature, I can expend a seal to Frenzy until the ",
                    "start of my next turn. While frenzied: my movement is doubled, +2 bonus AC, +1 extra attack\n   with attack action."
                ]),
            },
            "hellsight": {
                name: "Hell Sight",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "I can expend a seal as an Action to gain Truesight:60ft for 1 hour."
                ]),
                action: ["action", ""]
            },
            "impaling shot": {
                name: "Impaling Shot",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "When I hit an Interdicted creature with a ranged weapon attack, I can expend a seal as a\n   Bonus Action. " +
                    "Target takes -AC equal to my Proficiency Bonus until the end of my next turn."
                ]),
                action: ["bonus action", ""]
            },
            "iron gaol": {
                name: "Iron Gaol",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "As an Action, I can touch a creature and expend 4 seals to send it to Hell. The target must ",
                    "make a Charisma saving throw. If target is native to Hell, or level <4 or CR is <4, they remain ",
                    "must find their way out. Otherwise, target banished for 1 minute and reappears into previous ",
                    "space or nearest unoccupied space. The target can spend it's Action to repeat Save ending",
                    "effect on success."
                ]),
                action: ["action", ""]
            },
            "last word": {
                name: "Last Word",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "If I have unplaced seals, and my health is reduced to 0, I may spend up to 3 seals to cause an ",
                    "explosion. 3d6 per seal expended. Each creature I choose within 30ft must make a Dexterity ",
                    "Saving throw. On fail, creature(s) take Fire damage equal to the total; Half damage on success",
                    "If at least one creature is damaged, I regain hitpoints equal to the total I rolled."
                ])
            },
            "soul's doom": {
                name: "Soul's Doom",
                submenu: "[Interdict Boon  13+]",
                prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
                description: desc([
                    "When I use a Bonus Action to place or move a seal, I can scorch the seals into the target.",
                    "For 1 min, when target takes damage, they take extra damage equal to my Proficiency Bonus."
                ])
            },
        },
        "subclassfeature3": {
            name: "Diabolic Contract",
            source: ["IR", 13],
            minlevel: 3,
            description: " Choose your Illrigger Subclass.",
        },
        "infernalconduit": {
            name: "Infernal Conduit",
            source: ["IR", 13],
            minlevel: 6,
            description: desc([
                "I gain a pool of Infernal Conduit dice (d10). Spent Infernal Conduit die are regained after a",
                "long rest. As an Action, I can touch another creature and spend 1+ Internal Conduit die. The",
                "target must make a Constitution save against my Ability DC. The target can willingly fail the",
                "save. On success, I can then choose to Invigorate or Devour the target. See Pg3 Notes."
            ]),
            toNotesPage: [{
                name: "Infernal Conduit",
                page3notes: true,
                note: [
                    "\u2022 Invigorate. On failed Infernal Conduit Save, target regains hit points equal to the total I",
                    "rolled; half on success. I take Necrotic damage equal to the total damage dealt. If I fall to 0 ",
                    "hit points, I fall unconscious and am stabilized.",
                    "\u2022 Devour. On failed Infernal Conduit Save, target takes Necrotic damage equal to the total ",
                    "rolled; half on success. I regain hit points equal to the damage dealt to target. The",
                    "Necrotic damage cannot be reduced in any way. If used at 11th level, target also gains 1",
                    "level of exhaustion on failed save. A creature cannot gain > 3 levels of exhaustion this way."
                ]
            }],
            usages: [0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
            action: ["action", ""],
            recovery: "long rest",
        },
        "bloodprice": {
            name: "Blood Price",
            source: ["IR", 14],
            minlevel: 10,
            description: desc([
                "When I fail a saving throw, I can spend one Hit Die and add it to the save roll.",
            ]),
        },
        "terrorizingforce": {
            name: "Terrorizing Force",
            source: ["IR", 14],
            minlevel: 11,
            description: desc([
                "When I hit with a weapon attack, I can add an extra 1d8 Cold, Fire, Necrotic, or Poison\n   damage. " +
                "I can choose a different damage type when I finish a long rest.",
            ]),
            calcChanges: {
                atkAdd: [
                    function (fields, v) {
                        if (v.isMeleeWeapon | v.isRangedWeapon | v.isThrownWeapon) {
                            fields.Description += (fields.Description ? '; ' : '') + '+1d8 Cold/Fire/Necrotic/Poison Dmg(1).';
                        }
                    }
                ]
            },
        },
        "superiorinterdict": {
            name: "Superior Interdict",
            source: ["IR", 14],
            minlevel: 14,
            description: desc([
                "Seal damage ignores target resistance(s).",
                "Once per long rest, I can use a Bonus Action to regain a seal if I have none remaining."
            ]),
            usages: 1,
            recovery: "long rest",
            action: ["bonus action", "SuperiorInterdict-Gain1Seal"],
        },
        "infernalmajesty": {
            name: "Infernal Majesty",
            source: ["IR", 14],
            minlevel: 17,
            description: desc([
                "I can use a Bonus Action to gain the following effects for 10 minutes:",
                "\u2022Resistance to fire, cold, and necrotic damage.",
                "\u2022Wings appear on my back, granting me a flight speed of 60ft.",
                "\u2022When I use Blood Price, I can cause an enemy I see within 10ft to take damage equal to the\n   number rolled.",
                "\u2022When I hit with a weapon attack, my Terrorizing Force deals 2d8 instead of 1d8.",
                "For the duration, if I die, I can choose to have my body disappear in a burst of flame only\n   leaving my equipment. " +
                "My body reforms in 1d6 days and I return to life at full Hit Points.",
                "Once I channel Infernal Majesty, I must finish a long rest before I can use it again.",
            ]),
            usages: 1,
            recovery: "long rest",
            action: [["bonus action", ""]]
        },
        "masterofhell": {
            name: "Master Of Hell",
            source: ["IR", 14],
            minlevel: 20,
            description: desc([
                "As an Action, I can summon a hellstorm centered on a point I can see within 150ft.",
                "I can choose between Inferno, Pestilence, and Darkness to fill a 50ft radius sphere on the\n   point. See Pg3 notes.",
            ]),
            toNotesPage: [{
                name: "Master of Hell",
                page3notes: true,
                note: [
                    "\u2022 Inferno. Each enemy in the area must make a Dexterity Saving Throw. On a failed save, a ",
                    "creature takes 5d10 Fire damage plus 5d10 Necrotic damage and burn for 1 minute. On a ",
                    "successful save, they take half damage, and do not burn. Burning creatures must repeat the",
                    "save at the end of their turn, taking 1d10 Fire and 1d10 Necrotic damage on a failed save or ",
                    "ending the effect on success. The fire cannot be extinguished by nonmagical means.",
                    "\u2022 Pestilence. Each enemy within the 50ft-rad sphere must make a Constitution save. On fail,",
                    "take 5d10 Poison + 5d10 Necrotic damage and is Poisoned for 1min. On success, take half.",
                    "\u2022 Darkness. Each enemy within the 50ft-rad sphere must make a Constitution save. On fail,",
                    "take 10d10 Cold damage; half on save. Hostiles within the area Blinded for 1 min or until they\n   leave the area."

                ]
            }],
            usages: 1,
            recovery: "long rest",
            action: ["action", ""],
        }
    },
}
// Add Subclasses
//Add Architect of Ruin Subclass
AddSubClass("illrigger", "architect of ruin", {
    regExpSearch: /architect of ruin/i,
    subname: "Architect of Ruin",
    source: ["IR", 17],
    features: {
        "subclassfeature3.1": {
            name: "Asmodeus's Blessing",
            source: ["IR", 17],
            minlevel: 3,
            description: desc([
                "I gain proficiency in one of the following skills: Arcana, History, Nature, or Religion.",
                "Select your choice under the Class Features options."
            ]),
            skillstxt: "Choose one from Arcana, History, Nature, or Religion.",
            extraname: "Asmodeus's Blessing",
            extrachoices: ["Arcana Proficiency", "History Proficiency", "Nature Proficiency", "Religion Proficiency"],
            "arcana proficiency": {
                name: "Asmodeus's Blessing: Arcana Proficiency", description: "",
                prereqeval: function (v) { return v.skillProfs.indexOf("Arcana") == -1; },
                skills: ["Arcana"]
            },
            "history proficiency": {
                name: "Asmodeus's Blessing: History Proficiency", description: "",
                prereqeval: function (v) { return v.skillProfs.indexOf("History") == -1; },
                skills: ["History"]
            },
            "nature proficiency": {
                name: "Asmodeus's Blessing: Nature Proficiency", description: "",
                prereqeval: function (v) { return v.skillProfs.indexOf("Nature") == -1; },
                skills: ["Nature"]
            },
            "religion proficiency": {
                name: "Asmodeus's Blessing: Religion Proficiency", description: "",
                source: [["TDCSR", 174]],
                prereqeval: function (v) { return v.skillProfs.indexOf("Religion") == -1; },
                skills: ["Religion"]
            },
        },
        "subclassfeature3.2": {
            name: "Spellcasting",
            source: ["IR", 17],
            minlevel: 3,
            additional: levels.map(function (n, idx) {
                var cantr = [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3][idx];
                var splls = [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13][idx];
                return cantr + " cantrips \u0026 " + splls + " spells known";
            }),
            description: desc([
                "I can cast Illrigger cantrips and spells, using Charisma as my spellcasting ability.",
            ]),
        },
        "subclassfeature3.3": {
            name: "Invoke Hell",
            source: ["IR", 22],
            minlevel: 3,
            description: desc(["I gain 2 Invoke Hell options. When I use one of the Invocations, I must finish a short",
                "rest before using either again."]),
            usages: 1,
            recovery: "short rest",

            "enervatingspell": {
                name: "Enervating Spell (Trgr: DmgW/Spell - Seal)",
                source: ["IR", 18],
                description: desc([
                    "When I deal damage with an Illrigger spell, I can expend a seal (No Action).",
                    "The target has vulnerability to that spell's damage, ignoring any resistance or immunity",
                ]),
            },

            "spellblade": {
                name: "Spellblade",
                source: ["IR", 19],
                description: desc([
                    "I can use my action to make both a melee weapon attack, and cast an spell that has a casting\n   time of 1a.",
                ]),
            },
            autoSelectExtrachoices: [{
                extrachoice: "enervatingspell",
                minlevel: 3
            }, {
                extrachoice: "spellblade",
                minlevel: 3
            }]
        },
        "subclassfeature7": {
            name: "Hellish Versatility",
            source: ["IR", 19],
            minlevel: 7,
            description: desc([
                "I can cast an Illrigger cantrip in place of one of my attacks granted by 'Extra Attack'.",
            ]),
        },
        "subclassfeature7.1": {
            name: "Asmodeus's Interdiction - Boons",
            source: ["IR", 19],
            minlevel: 7,
            description: desc([
                "I gain additional Interdict Boons. They do not count to the number of known Interdict Boons.",
            ]),
            "axiomaticseals": {
                name: "Axiomatic Seals (Passive)",
                source: ["IR", 19],
                description: desc([
                    "When I burn a seal to damage to a creature, I can add my Charisma modifier to the damage.",
                ]),
            },
            "spellbreaker": {
                name: "Spellbreaker",
                source: ["IR", 19],
                description: desc([
                    "When Interdicted creature I can see casts a spell, I can use my Reaction to burn 1+ seals on",
                    "them and cast Counterspell without using a spellslot. The spell level is \u003d to \u0023 of seals burnt.",
                ]),
                action: ["reaction", "Counterspell"],
                spellcastingBonus: [{
                    spells: ["counterspell"],
                    name: "Spellbreaker:Counterspell",
                    selection: ["counterspell"],
                }],
            },
            "hellmage": {
                name: "Hell Mage (Passive)",
                source: ["IR", 19],
                description: desc([
                    "When I or an ally within 30ft succeed on a saving throw from an enemy's spell or magical effect, I can place 1 or more seals on that enemy.",
                    "The number of seals I can place is equal to my proficiency bonus",
                ]),
            },
            autoSelectExtrachoices: [{
                extrachoice: "axiomaticseals",
                minlevel: 7
            }, {
                extrachoice: "spellbreaker",
                minlevel: 13
            }, {
                extrachoice: "hellmage",
                minlevel: 18
            }]
        },
        "subclassfeature11": {
            name: "Submit",
            source: ["IR", 19],
            minlevel: 11,
            description: desc([
                "When I cast a spell I know, I can burn two seals on an Interdicted target to impose\n   disadvantage on their saving throw against the spell.",
            ]),
        },
        "subclassfeature15": {
            name: "Vile Transmogrification",
            source: ["IR", 19],
            minlevel: 15,
            description: desc([
                "Once per long rest, I can do the following:",
                "I can use my bonus action to regain seals, or regain spell slots.",
                "I can expend one spell slot to regain a number of seals equal to that slot's level.",
                "I may choose to instead expend any number of seals to regain a spell slot equal to one-third\n   that number.",
            ]),
            action: [["bonus action", ""]],
            recovery: "long rest",
        },
    },
    spellcastingFactor: 1,
    spellcastingTable: [
        [0, 0, 0, 0, 0, 0, 0, 0, 0], // 0
        [0, 0, 0, 0, 0, 0, 0, 0, 0], // 1
        [0, 0, 0, 0, 0, 0, 0, 0, 0], // 2
        [2, 0, 0, 0, 0, 0, 0, 0, 0], // 3
        [3, 0, 0, 0, 0, 0, 0, 0, 0], // 4
        [3, 0, 0, 0, 0, 0, 0, 0, 0], // 5
        [3, 0, 0, 0, 0, 0, 0, 0, 0], // 6
        [4, 2, 0, 0, 0, 0, 0, 0, 0], // 7
        [4, 2, 0, 0, 0, 0, 0, 0, 0], // 8
        [4, 2, 0, 0, 0, 0, 0, 0, 0], // 9
        [4, 3, 0, 0, 0, 0, 0, 0, 0], // 10
        [4, 3, 0, 0, 0, 0, 0, 0, 0], // 11
        [4, 3, 0, 0, 0, 0, 0, 0, 0], // 12
        [4, 3, 2, 0, 0, 0, 0, 0, 0], // 13
        [4, 3, 2, 0, 0, 0, 0, 0, 0], // 14
        [4, 3, 2, 0, 0, 0, 0, 0, 0], // 15
        [4, 3, 3, 0, 0, 0, 0, 0, 0], // 16
        [4, 3, 3, 0, 0, 0, 0, 0, 0], // 17
        [4, 3, 3, 0, 0, 0, 0, 0, 0], // 18
        [4, 3, 3, 1, 0, 0, 0, 0, 0], // 19
        [4, 3, 3, 1, 0, 0, 0, 0, 0], // 20
    ],
    spellcastingKnown: {
        cantrips : [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
        spells : [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13],
    },
    spellcastingList: {
        extraspells: [
            "chill touch", "dancing lights", "fire bolt", "message", "minor illusion", "ray of frost", "shocking grasp", "thaumaturgy", "vicious mockery",
            "bane", "burning hands", "charm person", "color spray", "command", "detect magic", "disguise self", "hellish rebuke", "shield", "shield of faith", "silent image",
            "arcanists magic aura", "augury", "blur", "darkness", "detect thoughts", "enthrall", "heat metal", "hold person", "invisibility", "lesser restoration", "mirror image", "ray of enfeeblement", "scorching ray", "silence", "suggestion",
            "bestow curse", "dispel magic", "fear", "fly", "haste", "major image", "phantom steed", "remove curse", "revivify", "slow",
            "banishment", "blight", "compulsion", "death ward", "dimension door", "dominate beast", "greater invisibility", "hallucinatory terrain", "locate creature", "phantasmal killer",
        ],
        class: ["illrigger"],
    },
})

// Add Hellspeaker Subclass
AddSubClass("illrigger", "hellspeaker", {
    regExpSearch: /hellspeaker/i,
    subname: "Hellspeaker",
    source: ["IR", 22],
    features: {
        "subclassfeature3.1": {
            name: "Moloch's Blessing",
            source: ["IR", 22],
            minlevel: 3,
            description: desc([
                "I gain proficiency in one of the following skills of my choice: Persuasion or Deception.",
                "If already proficient in skill of choice, the Proficiency Bonus is doubled in that skill",
                "I have advantage on Charisma checks to influence creatures who can hear me."
            ]),
            vision: [["Adv vs Cha (Influence)"]],
            extraname: "Moloch's Blessing",
            extrachoices: ["Persuasion Proficiency", "Persuasion (Already Prof)", "Deception Proficiency", "Deception (Already Prof)"],
            "persuasion proficiency": {
                name: "Persuasion Proficiency", description: "",
                prereqeval: function (v) { return v.skillProfs.indexOf("Persuasion") == -1; },
                skills: ["Persuasion"]
            },
            "persuasion (already prof)": {
                name: "Persuasion Prof Bonus", description: "",
                skills: ["Persuasion", "incremental"]
            },
            "deception proficiency": {
                name: "Deception Proficiency", description: "",
                prereqeval: function (v) { return v.skillProfs.indexOf("Deception") == -1; },
                skills: ["Deception"]
            },
            "deception (already prof)": {
                name: "Deception Prof Bonus", description: "",
                skills: ["Deception", "incremental"]
            },
            languageProfs: [1],
        },
        "subclassfeature3.2": {
            name: "Charm Enemy",
            source: ["IR", 22],
            minlevel: 3,
            description: desc([
                "When I use my bonus action to place a seal on a Humanoid, I can attempt to charm them.",
                "The target must succeed on a Charisma saving throw or be charmed for 1 hr or until my\n   companions or I do anything harmful to them.",
                "While charmed, the target sees me as friendly. When the charmed condition ends, the target\n   knows they were charmed by me.",
                "When I use this bonus action, I can burn one or more seals on additional Interdicted\n   Humanoids within 30 ft, attempting to charm those targets as well.",
                "After taking damage from the burned seals, each of those targets must succeed on a\n   Charisma saving throw or be under the same charmed effect."
            ]),
            usages: "Charisma modifier per ",
            usagescalc: "event.value = Math.max(1, What('Cha Mod'));",
            recovery: "short rest",
        },
        "subclassfeature3.3": {
            name: "Invoke Hell",
            source: ["IR", 22],
            minlevel: 3,
            description: desc(["I gain 2 Invoke Hell options. When I use one of the Invocations, I must finish a short",
                "rest before using either again."]),
            usages: 1,
            recovery: "short rest",

            "honeysweetblades": {
                name: "Honey-Sweet Blades",
                source: ["IR", 22],
                description: desc(["When I make an attack against an Interdicted creature, I gain Advantage on that attack.",
                    "If the attack hits, it becomes a critical hit."]),
            },

            "turncoat": {
                name: "Turncoat",
                source: ["IR", 23],
                description: desc(["As an action, I can choose a number of enemy creatures, up to my Proficiency Bonus, within\n   60ft that can hear me. "+
                    "Each target must succeed on a Charisma saving throw or use their\n   Reaction to make a\n   weapon attack against a single target of my choice. The target cannot\n   attack itself."
                ]),
            },
            autoSelectExtrachoices: [{
                extrachoice: "honeysweetblades",
                minlevel: 3
            }, {
                extrachoice: "turncoat",
                minlevel: 3
            }]
        },
        "subclassfeature7": {
            name: "Moloch's Interdiction - Boons",
            source: ["IR", 23],
            minlevel: 7,
            description: desc([
                "I gain additional Interdict Boons. They do not count to the number of known Interdict Boons.",
            ]),

            "redcant": {
                name: "Red Cant",
                source: ["IR", 23],
                minlevel: 7,
                description: desc([
                    "When I make a Charisma check, I can expend a seal to treat a d20 roll of 9 or lower as a 10.",
                ]),
            },

            "slipperyploy": {
                name: "Slippery Ploy",
                source: ["IR", 23],
                minlevel: 13,
                description: desc([
                    "When a creature targets me with an attack, spell, or other magical effect, I can place a seal on\n   them as a reaction and force them to make a Charisma saving throw.",
                    "On a failed save, the creature must choose a new target or lose the attack or effect.",
                ]),
                action: "reaction",
            },

            "incontrovertible": {
                name: "Incontrovertible",
                source: ["IR", 23],
                minlevel: 18,
                description: desc([
                    "Interdicted creatures have Disadvantage on Wisdom and Charisma saving throws.",
                ]),
            },
            autoSelectExtrachoices: [{
                extrachoice: "redcant",
                minlevel: 7
            }, {
                extrachoice: "slipperyploy",
                minlevel: 13
            }, {
                extrachoice: "incontrovertible",
                minlevel: 18
            }]
        },
        "subclassfeature11": {
            name: "Intransigent",
            source: ["IR", 23],
            minlevel: 11,
            description: desc([
                "Each creature I choose, within 10ft, are immune to the charmed condition while conscious.",
            ]),
        },
        "subclassfeature11.1": {
            name: "Let's Make a Deal",
            source: ["IR", 23],
            minlevel: 11,
            description: desc([
                "Choose one willing creature within 60ft who can hear me. That creature can choose to gain\n   Advantage on one attack roll or saving throw and add a bonus equal to my\n   Prof Bonus.",
                "If the attack hits, or the saving roll succeeds, the creature gains temporary hitpoints equal to\n   my Illrigger level. Otherwise, they have Disadvantage on the attack or saving throw roll.",
                "The Disadvantage can't be canceled or removed. A creature can only make one deal at a time.",
            ]),
            usages: "Proficiency bonus per ",
            usagescalc: "event.value = (How('Proficiency Bonus'));",
            recovery: "long rest",
            action: ["bonus action", ""]
        },
        "subclassfeature15": {
            name: "Quid Pro Quo",
            source: ["IR", 23],
            minlevel: 15,
            description: desc([
                "As an action, I can target a creature I can see within 30ft. to make a Charisma saving throw.",
                "On a fail, the target is banished to Hell for 1 min, returning to the nearest unoccupied space\n   from where they left.",
                "The creature can repeat the saving throw at the end of each of their turns, ending the effect\n   on a success. Affected creatures cannot be banished in this way for 24 hours.",
                "If the target is banished, a devil jurist or horned devil appears in their place. They are friendly\n   to you and follow your command for the duration.",
                "If you successfully banish a creature in this way, this feature can't be used again until you\n   finish a long rest.",
            ]),
            usages: 1,
            recovery: "long rest",
            action: ["action", ""]
        },
    },
})

// Add Painkiller Subclass
AddSubClass("illrigger", "painkiller", {
    regExpSearch: /painkiller/i,
    subname: "Painkiller",
    source: ["IR", 23],
    features: {
        "subclassfeature3.1": {
            name: "Dispater's Blessing",
            source: ["IR", 24],
            minlevel: 3,
            description: desc(["I gain proficiency with heavy armor."]),
            armorProfs: [true, true, true, true],
        },
        "subclassfeature3.2": {
            name: "Devastator",
            source: ["IR", 24],
            minlevel: 3,
            usages: 1,
            recovery: "short rest",
            description: desc([
                "As an Action, I can make a weapon attack and choose a number of willing creatures up to my\n   proficiency bonus who I can see within 30 ft.",
                "Each creature I choose can use a reaction to make a weapon attack or cast a damage-dealing\n   cantrip. Once used, I can't use it again until I finish a rest.",
            ]),
            action: "action",

        },
        "subclassfeature3.3": {
            name: "Invoke Hell",
            source: ["IR", 24],
            minlevel: 3,
            description: desc(["I gain 2 Invoke Hell options. When I use one of the Invocations, I must finish a short",
                "rest before using either again."]),
            usages: 1,
            recovery: "short rest",

            "grandstrategist": {
                name: "Grand Strategist (NoAction-OrderAlliesToAtk)",
                source: ["IR", 24],
                description: desc(["You can order your allies to follow your formation (no action req). Choose 1+ creatures within\n   60ft who can hear you, up to a number equal to your Prof Bonus. Each chosen target can\n   move up to half their speed without provoking opportunity attacks."]),
            },

            "punishment": {
                name: "Punishment",
                source: ["IR", 24],
                description: desc(["When I am damaged by an attack, I can use my Reaction to force the attacker to make a\n   Wisdom saving throw. " +
                    "On a failed save, the attacker takes necrotic damage equal to the\n   damage they dealt with the triggering attack. Half as much on a successful save."
                ]),
                action: ["reaction", ""],
            },
            autoSelectExtrachoices: [{
                extrachoice: "grandstrategist",
                minlevel: 3
            }, {
                extrachoice: "punishment",
                minlevel: 3
            }],
        },
        "subclassfeature7": {
            name: "Dispater's Interdiction - Boons",
            source: ["IR", 24],
            minlevel: 7,
            description: desc(["I gain additional Interdict Boons. They do not count to the number of known Interdict Boons."]),

            "telekineticseal": {
                name: "Telekinetic Seal (Reaction)",
                source: ["IR", 24],
                description: desc([
                    "When a creature I can see moves within 5ft of me, I can use my Reaction to place a seal.",
                    "Target makes a Wisdom saving throw or be: pushed back 15ft or knocked prone (my choice).",
                ]),
            },

            "bythethroat": {
                name: "By the Throat",
                source: ["IR", 24],
                description: desc([
                    "When I use Bonus Action to place/move seal on crea one size larger than me: they",
                    "must make Wisdom saving throw or Restrained until end of their next turn."
                ]),
            },

            "dispaterssupremacy": {
                name: "Dispater's Supremacy",
                source: ["IR", 24],
                description: desc([
                    "My attacks against an Interdicted Creature are Critical hits on attack roll of 18-20",
                ]),
            },

            autoSelectExtrachoices: [{
                extrachoice: "telekineticseal",
                minlevel: 7
            }, {
                extrachoice: "bythethroat",
                minlevel: 13
            }, {
                extrachoice: "dispaterssupremacy",
                minlevel: 17
            }]
        },
        "subclassfeature11": {
            name: "You Die On My Command!",
            source: ["IR", 24],
            minlevel: 11,
            description: desc([
                "When an ally within 30ft of me drops to 0 hp without being killed outright, I may use my\n   reaction to cause them to drop to 1 hp instead.",
                "Once I use this as a Reaction, I can't use it again until I complete a Short/Long rest."
            ]),
            usages: 1,
            action: ["reaction", ""],
            recovery: "short rest",
        },
        "subclassfeature15": {
            name: "Deathstrike",
            source: ["IR", 25],
            minlevel: 15,
            description: desc([
                "When I make a melee attack on an Interdicted creature, I can use my Reaction to burn one\n   seal to make it a critical hit. " +
                "The burned seal dmg doubles. I can do this a number of times\n   equal to my Proficiency Bonus; regain on LR."
            ]),
            action: ["reaction", ""],
            usages: "Proficiency bonus per ",
            usagescalc: "event.value = (How('Proficiency Bonus'));",
            recovery: "long rest",
        },
    }
})

// Add Sanguine Knight Subclass
AddSubClass("illrigger", "sanguine knight", {
    regExpSearch: /sanguine knight/i,
    subname: "Sanguine Knight",
    source: ["IR", 25],
    features: {
        "subclassfeature3.1": {
            name: "Exsanguinate",
            source: ["IR", 26],
            minlevel: 3,
            description: desc([
                "When I burn seals on a creature who isn't a Construct or Undead, I can choose an ally within\n   30ft. The ally gains temporary HP \u003d to the damage dealt by the seals to the creature.",
            ]),
        },
        "subclassfeature3.2": {
            name: "Sutekh's Blessing",
            source: ["IR", 26],
            minlevel: 3,
            description: desc([
                "As an Action, I can sense creatures who have blood within 120ft of me without seeing them;\n   until the end of my next turn. " +
                "This penetrates most barriers, but is blocked by 1ft of stone, 1in\n   of common metal, a thin sheet of lead, or 3ft of wood or dirt. " +
                "I know the distance, direction,\n   type of each creature. I can use this a number of times \u003d to my proficiency bonus; uses are\n   regained after a long rest. " +
                "I gain proficiency in Religion."
            ]),
            action: "action",
            recovery: "long rest",
            usages: "Proficiency bonus per ",
            usagescalc: "event.value = (How('Proficiency Bonus'));",
            skill: ["Religion"]
        },
        "subclassfeature3.3": {
            name: "Invoke Hell",
            source: ["IR", 26],
            minlevel: 3,
            description: desc(["I gain 2 Invoke Hell options. When I use one of the Invocations, I must finish a short",
                "rest before using either again."]),
            usages: 1,
            recovery: "short rest",
            "emboldenallies": {
                name: "Embolden Allies",
                description: desc([
                    "Restore hit points equal to 5 x Illrigger Level, spread amongst myself and any other creatures\n   I choose w/in 30ft."]),
                action: ["bonus action", ""],
            },
            "vitalize": {
                name: "Vitalize - (NoActionReq)",
                description: desc([
                    "For 1 min, each creature of my choice within 30ft gains a bonus to ability checks equal to my proficiency bonus."]),
            },
            autoSelectExtrachoices: [{
                extrachoice: "emboldenallies",
                minlevel: 3
            }, {
                extrachoice: "vitalize",
                minlevel: 3
            }],
        },
        "subclassfeature7": {
            name: "Sutekh's Interdiction - Boons",
            source: ["IR", 26],
            minlevel: 7,
            description: desc(["I gain additional Interdict Boons. They do not count to the number of known Interdict Boons."]),

            "foulinterchange": {
                name: "Foul Interchange",
                source: ["IR", 26],
                description: desc([
                    "I can use an action to choose a creature I can see within 30ft and expend a seal to end one of\n   the following conditions: " +
                    "Blinded, Charmed, Dazed, Deafened, Frightened, Paralyzed, or\n   Poisoned. " +
                    "Another creature I can see within 60ft must succeed on a Constitution Save or gain\n   that condition until the end of my next turn. " +
                    "If that creature is immune to that condition, they\n   do not gain the condition, but the condition ends for the original creature.",
                ]),
                action: ["action", ""],
            },
            "sanguinegift": {
                name: "Sangiune Gift (Trgr:Crea/AllyGainHP Seal)",
                source: ["IR", 26],
                description: desc([
                    "When a creature I can see within 30ft regains hit points, I can expend a seal (no action) and it\n   gains extra hit points equal to my Illrigger level."
                ]),
            },
            "bloodforblood": {
                name: "Blood for Blood (Passive)",
                source: ["IR", 26],
                additional: (How('Proficiency Bonus')) + " Necr dmg",
                description: desc([
                    "Whenever an ally takes damage from an Interdicted creature, that creature takes Necrotic damage equal to my Proficiency Bonus."
                ]),
            },
            autoSelectExtrachoices: [{
                extrachoice: "foulinterchange",
                minlevel: 7
            }, {
                extrachoice: "sanguinegift",
                minlevel: 13
            }, {
                extrachoice: "bloodforblood",
                minlevel: 18
            }]
        },
        "subclassfeature11": {
            name: "Bloodstroke",
            source: ["IR", 26],
            minlevel: 11,
            additional: How('Proficiency Bonus') + " dmg",
            description: desc([
                "When an ally who has temporary hit points from Exsanguinate is hit by a melee attack, the\n   attacker takes my choice of cold\u002ffire\u002fnecrotic damage equal to your Illrigger level."
            ])
        },
        "subclassfeature15": {
            name: "Haemal Exchange",
            source: ["IR", 26],
            minlevel: 15,
            description: desc([
                "When an Interdicted creature within 60ft makes an attack roll or saving throw, I can use a\n   Reaction to burn one seal. " +
                "The target must roll a d8 and subtract the roll from the triggering\n   attack or saving throw. " +
                "When an ally within 30ft makes an attack roll or saving throw, they roll\n   a d8 and add the number rolled to their attack or save roll."
            ]),
            action: ["reaction", ""]
        },
    },
})

// Add Shadowmaster Subclass
AddSubClass("illrigger", "shadowmaster", {
    regExpSearch: /shadowmaster/i,
    subname: "Shadowmaster",
    source: ["IR", 27],
    features: {
        "subclassfeature3.1": {
            name: "Marked for Death",
            source: ["IR", 27],
            minlevel: 3,
            description: desc(["I have Advantage on my first attack against an Interdicted creature on each of my turns."]),
        },
        "subclassfeature3.2": {
            name: "Strike From The Dark",
            source: ["IR", 27],
            minlevel: 3,
            description: desc([
                "Once per turn, when I hit an Interdicted creature with a melee weapon attack and I have\n   Advantage on the attack roll, I can roll a number of d4s equal to my proficiency bonus and\n   deal extra damage equal to the total rolled. " +
                "The damage is increased by 1d4 if the target is in\n   Dim light or Darkness.",
            ]),
        },
        "subclassfeature3.3": {
            name: "Invoke Hell",
            source: ["IR", 27],
            minlevel: 3,
            description: desc(["I gain 2 Invoke Hell options. When I use one of the Invocations, I must finish a short",
                "rest before using either again."]),
            usages: 1,
            recovery: "short rest",
            "masterofdisguise": {
                name: "Master of Disguise",
                description: desc(["As an Action, I can cast the disguise self spell without expending a spell slot."]),
                action: ["action", "Master..Disguise"],
                spellcastingBonus: [{
                    spells: ["disguise self"],
                    name: "Master of Disguise: Disguise Self",
                    selection: ["disguise self"],
                    firstCol: "atwill"
                }],
            },
            "noescape": {
                name: "No Escape",
                description: desc(["As a Bonus action, you can call on shadows to entrap a creature you can see within 30ft. The\n   target must make a Charisma saving throw, with DisAdv if in Dim light or Darkness. On fail,\n   the target's speed is halved, and they can't willingly move more than 30ft from me. Effect\n   ends if I am incapacitated, die, or the target is more than 30ft from me."]),
                action: ["bonus action", ""],
            },
            autoSelectExtrachoices: [{
                extrachoice: "masterofdisguise",
                minlevel: 3
            }, {
                extrachoice: "noescape",
                minlevel: 3
            }],
        },
        "subclassfeature7": {
            name: "Belial's Interdiction - Boons",
            source: ["IR", 27],
            minlevel: 7,
            description: desc(["I gain additional Interdict Boons. They do not count to the number of known Interdict Boons."]),

            "veiloflies": {
                name: "Veil of Lies",
                description: desc(["As a Bonus action, I can expend a seal to become Invisible for 10mins or until I attack or cast\n   a spell."]),
                action: ["bonus action", ""]
            },
            "hellsassassin": {
                name: "Hell's Assassin (Passive)",
                description: desc(["Whenever I roll a 1 or 2 to determing damage of my seals or weapon attacks against\n   Interdicted creatures, I can reroll and must use the new roll."])
            },
            "darkmalediction": {
                // Note from MCDM: This is designed to provide damage boost from 'Strike from the Dark' and 'Doomed to the Shadows'; not to blind targets. Bonus: it gives crea DisAdv on saving throw for 'No Escape'
                name: "Dark Malediction (Passive)",
                description: desc(["Interdicted creatures radiate darkness in a 10ft radius. Normal light can't penetrate, but\n   darkvision can see through it. If the darkness overlaps light created by magic or psionics, the\n   overlapped area is illuminated by the light."])
            },
            autoSelectExtrachoices: [{
                extrachoice: "veiloflies",
                minlevel: 7,
            }, {
                extrachoice: "hellsassassin",
                minlevel: 13,
            }, {
                extrachoice: "darkmalediction",
                minlevel: 18,
            }],
        },
        "subclassfeature11": {
            name: "Umbral Killer",
            source: ["IR", 28],
            minlevel: 11,
            description: desc(["I gain the following benefits:",
                "\u2022Darkvision: 60ft. If I already have it, it's increased +60ft.",
                "\u2022Movement speed increases +10",
                "\u2022Adv on Dex (Stealth) checks to hide. Dex Save: Pass - no dmg, Fail - 1\u002f2 dmg."]),
            speed: { allModes: "+10" },
            vision: [["Darkvision", "fixed 60"], ["Darkvision", "+60"], ["Adv vs Stealth (Hide)"]],
            savetxt: { text: ["Dex vs. area effects: Pass - no dmg, Fail - 1\u002f2 dmg"] },
            advantages: [["Stealth", true]]
        },
        "subclassfeature15": {
            name: "Doomed to the Shadows",
            source: ["IR", 28],
            minlevel: 15,
            description: desc([
                "\u2022Strike from the Dark damage increase to number of d8's equal to your Proficiency Bonus. If\n   target is in Dim light or Darkness, I deal an extra 2d8.",
                "If Strike from the Dark does damage, I can use my Reaction to burn a seal on the creature and the\n   creature is Blinded for 1min (no dmg)."
            ]),
            action: ["reaction", ""]
        },
    },
})
// Add New Spells
SpellsList["aura of desecration"] = {
    name: "Aura of Desecration",
    classes: ["illrigger"],
    source: ["IR", 32],
    level: 4,
    school: "Abj",
    time: "1 a",
    range: "S:30-ft rad",
    components: "V",
    compMaterial: "",
    duration: "Conc, 10 min",
    save: "Con",
    description: "Chosen crea's, enter/start 4d6 Necrotic, no hp until start of next turn; save half",
    descriptionFull: "Life-defiling energy radiates from you in an aura with a 30 - foot radius. Until spell end, the aura moves with you, centered on you. When any creatures of my choice enters the area or starts its turn there, it must make a Constitution saving throw. On a failed save, a creature takes 4d6 necrotic damage, and can't regain hit points until the start of their next turn. On save, half-damage only.",
    ritual: false,
};
SpellsList["hell's lash"] = {
    name: "Hell's Lash",
    classes: ["illrigger"],
    source: ["IR", 32],
    level: 1,
    school: "Evoc",
    time: "1 a ",
    range: "30 ft",
    components: "V,S,M",
    compMaterial: "forked tongue of a serpent",
    duration: "Conc, 1 min",
    save: "Con",
    description: "4d4+2d4/SL fire dmg; tethered. Tethered 2d4+1d4/SL at start/turn. Rea-seal, all crea save with disadv",
    descriptionFull: "You produce a whip of crimson energy that lashes out at a creature within range, creating a conduit between you and the target. The target must succeed on a Constitution saving throw or take 4d4 + 2d4/SL fire damage and be tethered. A tethered creature takes 2d4 + 1d4/SL damage at the beginning of each of their turns, and can attempt to repeat the saving throw at the end of each of their turns, ending the effect. For the duration, if the target is an interdicted creature, you can use your reaction to burn one of your seals on the creature. When you do, the creature makes the next saving throw to end this spell with disadvantage.",
    ritual: false,
};
SpellsList["hellfire"] = {
    name: "Hellfire",
    classes: ["illrigger"],
    source: ["IR", 33],
    level: 0,
    school: "Evoc",
    time: "1 a",
    range: "120 ft",
    components: "V,S",
    compMaterial: "",
    duration: "Instantaneous",
    save: "Cha",
    description: "Choose target you can see within range. Cha save or 1d4 Fire plus 1d4 Necro dmg.",
    descriptionFull: "You create an eruption of smoldering hellfire around a creature you can see within range. The target must succeed on a Charisma saving throw or take 1d4 fire damage plus 1d4 necrotic damage. Both of the spell's damage types increase by 1d4 when you reach 5th level (2d4), 11th level (3d4),and 17th level (4d4).",
    ritual: false,
};
SpellsList["infernal challenge"] = {
    name: "Infernal Challenge",
    classes: ["illrigger"],
    source: ["IR", 33],
    level: 2,
    school: "Ench",
    time: "1 ba",
    range: "30 ft",
    components: "V",
    compMaterial: "",
    duration: "Conc, 1 min",
    save: "Cha",
    description: "If no ally within 5ft, choose crea in range who can see/hear you. Cha Save or I get +2 AC, target has disadv on atk rolls on creatures other me, Cha Save on first time moving away or speed 0.",
    descriptionFull: "You offer a creature a creature a compelling challenge. If you have no allies within 5 feet of you, choose one creature withing range who can see and hear you. They must succeed on a Charisma saving throw or answer your challenge and fight you. For the duration, you gain a +2 bonus to AC, the target has disadvantage on attack rolls against creatures other than you, and the first time the target tries to move away from you on a turn, the must succeed on a Charismas saving throw or their speed becomes 0 until the start of their next turn. This spell ends if you end your turn more than 30 feet away from the target.",
    ritual: false,
};
SpellsList["maligned weapon"] = {
    name: "Maligned Weapon",
    classes: ["illrigger"],
    source: ["IR", 33],
    level: 4,
    school: "Evoc",
    time: "1 ba",
    range: "Touch",
    components: "V,S",
    compMaterial: "",
    duration: "Conc, 1 hr",
    save: "Wis",
    description: "Imbue weapon. Extinguish light in 30f radius. Add 2d6 Necro. on hit. Bns to end early and 30f burst, 4d6 Necro.+frightened on failed Wis Save or half no frightened. Can save at end of each turn.",
    descriptionFull: "You imbue a weapon you touch with an infernal blessing. Until the spell ends, the weapon extinguishes any mundane sources of light in a 30-foot radius. In addition, attacks made with the weapon deal an extra 2d6 necrotic damage on a hit. If the weapon isn’t already a magic weapon, it becomes one for the duration. As a bonus action on your turn while holding this weapon, you can end the spell early and cause the weapon to emit a burst of dark energy. Each creature of your choice who you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature takes 4d6 necrotic damage and is frightened for 1 minute. On a successful save, a creature takes half as much damage and isn’t frightened. At the end of each of their turns, a frightened creature can make a Wisdom saving throw, ending the effect on themself on a success.",
    ritual: false,
};
SpellsList["mote of hell"] = {
    name: "Mote of Hell",
    classes: ["illrigger"],
    source: ["IR", 33],
    level: 3,
    school: "Conj",
    time: "1 a",
    range: "150 ft",
    components: "V,S,M",
    compMaterial: "piece of sulfur",
    duration: "Conc, 1 min",
    save: "Wis",
    description: "15ft rad sphere of Hell: magic dark, diff terr, crea start inside 3d6 Fire dmg/blinded; end turn 30ft rad Wis save or 3d6 Psych dmg",
    descriptionFull: "You manifest a pocket of Hell. A 15-foot-radius sphere of darkness, brimstone, and blasting heat appears, centered on a point within range and lasting for the duration. The cloud of hellfire echoes with the cries of damned souls that can be heard by creatures within 30 feet of it. No light, even magical light, can illuminate the cloud, and any creatures fully within the area are blinded. The cloud warps the timescape, making the cloud's area difficult terrain. A creature that starts their turn in the area takes 3d6 fire damage. A creature that ends their turn in the area must succeed on a Wisdom saving throw or take 3d6 psychic damage as the voices of the damned crowd their mind.",
    ritual: false,
};
SpellsList["vengeful blade"] = {
    name: "Vengeful Blade",
    classes: ["illrigger"],
    source: ["IR", 34],
    level: 0,
    school: "Evoc",
    time: "1 a",
    range: "S: 5-ft rad",
    components: "S,M",
    compMaterial: "melee weapon worth 1gp",
    duration: "Instantaneous",
    save: "",
    description: "Melee wea atk w/cast; hit: If CL5, +1d8 Necro dmg on melee at; if atk or cast before next rnd +1d8 Necro. dmg: +1d8 to both at CL5(1d8&2d8), 11(2d8&3d8), 17(3d8&4d8).",
    descriptionFull: "You brandish the weapon used in the spell’s casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target  suffers the weapon attack’s normal effects and then radiates a dark aura of energy until the start of your next turn. If the target makes an attack or casts a spell before then, the target takes 1d8 necrotic damage and the spell ends. This spell’s damage increases when you reach certain levels. At 5th level, the melee attack deals an extra 1d8 necrotic damage to the target on a hit, and the damage the target takes for making an attack or casting a spell increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8).",
    ritual: false,
};
SpellsList["wall of death"] = {
    name: "Wall of Death",
    classes: ["illrigger"],
    source: ["IR", 34],
    level: 4,
    school: "Necro",
    time: "1 a",
    range: "120 ft",
    components: "V,S,M",
    compMaterial: "chip of onyx",
    duration: "Conc, 1 min",
    save: "Con",
    description: "60x1x20ft (lxwxh) or 10ft rad 20ft high opaque wall; at cast all in Con save or 4d8 Necro dmg if fail; save halves; One chosen side of wall 4d8 Necro. to all w/i 10ft or inside or entering. Rea to gain temp HP = dmg dealt.",
    descriptionFull: "You create a wall of necrotic energy on a surface within range. You can make a wall up to 60 feet long, 20 feet high, and 1 foot thick, or can make a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration. When the wall appears, each creature in its area must make a Constitution saving throw. A creature takes 4d8 necrotic damage on a failed save, or half as much damage on a successful one. One side of the wall, selected by you when you cast this spell, deals 4d8 necrotic damage to each creature who ends their turn within 10 feet of that  side or inside the wall. A creature takes the same damage when they enter the wall for the first timeon a turn or end their turn there. The other side of the wall deals no damage. Whenever a creature takes damage from the wall, you can use your reaction to gain temporary hit points equal to the amount of damage dealt.",
    ritual: false,
};