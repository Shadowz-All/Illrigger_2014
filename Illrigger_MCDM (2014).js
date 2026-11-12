/*	-INFORMATION-
	Subject:	Class, Subclass, Spells
	Effect:		This script adds the Illrigger MCDM class ("The Illrigger Revised") for the 2014 ruleset.
				Originally developed by jaydee829 and later maintained by Tedge.
	Code by:	ShadowzAll with portions borrowed from Nod, ReadingToskr, MasterJedi, Pokesimmer and others.
	Updated:	v14.2.0 syntax (2014 ruleset)
*/

var iFileName = "Illrigger_MCDM (2014).js";
RequiredSheetVersion("14.0.0", false);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //
// >>> Define Sources for everything first >>> //
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> //

SourceList["IR"] = {
	name: "MCDM: The Illrigger Revised",
	abbreviation: "IR",
	date: "2024/12/31",
	group: "MCDM",
	url: "https://www.dndbeyond.com/sources/dnd/tir/the-illrigger-revised"
};

// >>>>>>>>>>>>>>>>>>>>>> //
// >>> Add Base Class >>> //
// >>>>>>>>>>>>>>>>>>>>>> //

ClassList["illrigger"] = {
	name: "Illrigger",
	regExpSearch: /illrigger/i,
	source: [["IR", 9]],
	primaryAbility: "Strength, Dexterity or Charisma, and Constitution",
	abilitySave: 6,
	prereqs: "Strength or Dexterity 13 & Charisma 13",
	die: 10,
	improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
	saves: ["Con", "Cha"],
	skillstxt: {
		primary: "Choose two from Arcana, Athletics, Deception, Insight, Intimidation, Investigation, Persuasion, Religion, and Stealth"
	},
	armorProfs: {
		primary: [true, true, false, true],
		secondary: [true, true, false, true]
	},
	weaponProfs: {
		primary: [true, true],
		secondary: [true, true]
	},
	equipment: "Illrigger starting equipment:" +
		"\n \u2022 Two martial weapons or one martial weapon and a shield" +
		"\n \u2022 Chain shirt or leather armor, a longbow, and 20 arrows" +
		"\n \u2022 A priest's pack or a dungeoneer's pack" +
		"\n \u2022 Five javelins" +
		"\n\nAlternatively, you can forgo the starting equipment and background equipment, and start with 5d4 \u00D7 10 gp.",
	subclasses: ["Diabolic Contracts", []],
	subclassGainedLevel: 3,
	attacks: levels.map(function (n) { return n < 5 ? 1 : 2; }),
	features: {
		"baleful interdict": {
			name: "Baleful Interdict - Seals",
			source: [["IR", 11]],
			range: "30 ft",
			minlevel: 1,
			description: desc([
				"Once per turn, when I hit a target with a weapon attack, I can place a magical seal on a creature within 30 ft of me, or I can use a bonus action to place a seal on a target I can see within range. This seal lasts for 1 minute or until burned. See Notes page."
			]),
			toNotesPage: [{
				name: "Baleful Interdict",
				note: [
					"A creature with one or more seals is Interdicted. Seals you place are invisible to other creatures, but appear to you as glowing glyphs.",
					"\u2022 Burning Seals. When an Interdicted creature you can see within 30 ft takes damage from any source other than an Illrigger seal, you can burn any number of seals you have placed on them to deal 1d6 Fire or Necrotic damage (choice), per seal, to that creature. This damage is dealt immediately after triggering the damage. Burning a seal does not require an action, and cannot be done while incapacitated. Once a seal is burned, it vanishes.",
					"   At 5th level (2d6), 11th level (3d6), and 20th level (4d6), your seals deal increased Fire or Necrotic damage per seal.",
					"\u2022 Interdict Save. Your Interdict Save DC is the same as your Ability DC."
				],
				page3notes: true
			}],
			additional: levels.map(function (n) {
				return (n < 5 ? 1 : n < 11 ? 2 : n < 20 ? 3 : 4) + "d6";
			}),
			usages: levels.map(function (n) {
				return n < 3 ? 3 : n < 7 ? 4 : n < 13 ? 5 : n < 18 ? 6 : 7;
			}),
			recovery: "short rest",
			action: [["bonus action", "Place/Move Seal"]]
		},
		"forked tongue": {
			name: "Forked Tongue",
			source: [["IR", 11]],
			minlevel: 1,
			languageProfs: [["Infernal"], 2],
			changeeval: function (level) {
				if (level[1] >= 9 && level[0] < 9) {
					processLanguages(true, "Illrigger: Forked Tongue", [1]);
				} else if (level[1] < 9 && level[0] >= 9) {
					processLanguages(false, "Illrigger: Forked Tongue", [1]);
				}
			},
			description: levels.map(function (n) {
				var descr = [
					"I know Infernal and can choose two other languages. I can replace one of those two languages once per long rest."
				];
				if (n >= 9) {
					descr.push("At 9th level, I learn another language and gain Adv. on Wis (Insight) checks to determine sincerity and intention.");
				}
				return desc(descr);
			}),
			forkedtongueadv: {
				vision: [["Adv. on Insight (sincerity & intention)"]],
				advantages: [["Insight", true]]
			},
			autoSelectExtrachoices: [{
				extrachoice: "forkedtongueadv",
				minlevel: 9
			}]
		},
		"combat mastery": {
			name: "Combat Mastery",
			source: [["IR", 12]],
			minlevel: 2,
			description: desc([
				"Choose a Combat Mastery using the \"Choose Feature\" button above."
			]),
			choices: ["Bravado", "Brutal", "Inexorable", "Lies", "Lissome", "Unfettered"],
			choicesNotInMenu: false,
			"bravado": {
				name: "Combat Mastery: Bravado",
				source: [["IR", 12]],
				description: desc([
					"While I am not wearing armor, my AC is 10 + Dexterity modifier + Charisma modifier. I can use a shield and still gain this benefit."
				]),
				armorOptions: [{
					regExpSearch: /justToAddToDropDownAndEffectWildShape/,
					name: "Unarmored Defense (Cha)",
					source: [["IR", 8]],
					ac: "10+Cha+Dex"
				}]
			},
			"brutal": {
				name: "Combat Mastery: Brutal",
				source: [["IR", 12]],
				description: desc([
					"When I hit a creature up to one size larger with a two-handed melee weapon, I can move the target 5 ft horizontally and use part of my movement to occupy that space."
				])
			},
			"inexorable": {
				name: "Combat Mastery: Inexorable",
				source: [["IR", 12]],
				description: desc([
					"I gain a +1 bonus to saving throws for each hostile creature within 5 ft of me, up to +5."
				])
			},
			"lies": {
				name: "Combat Mastery: Lies",
				source: [["IR", 12]],
				description: desc([
					"I can choose a melee weapon type and add my Charisma modifier, instead of my Strength or Dexterity modifier, for attack and damage rolls. I can change weapon types after a long rest."
				]),
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							if (v.isMeleeWeapon && What('Cha Mod') > What(AbilityScores.abbreviations[fields.Mod - 1] + ' Mod')) {
								fields.Mod = 6;
							}
						},
						"I can choose a melee weapon type and use my Charisma modifier instead of Strength or Dexterity for attack and damage rolls."
					]
				}
			},
			"lissome": {
				name: "Combat Mastery: Lissome",
				source: [["IR", 12]],
				description: desc([
					"When I hit a creature with a melee weapon attack, I can spend my movement to move 5 ft without provoking opportunity attacks."
				])
			},
			"unfettered": {
				name: "Combat Mastery: Unfettered",
				source: [["IR", 12]],
				description: desc([
					"When I place or burn seals, the range is 60 ft. When I gain Infernal Conduit, its range is 30 ft. Being within 5 ft of an enemy doesn't impose disadvantage on my attack rolls with ranged weapons."
				])
			}
		},
		"interdiction": {
			name: "Interdiction",
			source: [["IR", 12]],
			minlevel: 2,
			description: desc([
				"I learn one Interdict Boon of my choice and gain additional boons as I level. Whenever I gain an Illrigger level, I can replace a boon I know with another."
			]),
			additional: levels.map(function (n) {
				var count = n < 7 ? 1 : n < 13 ? 2 : n < 18 ? 3 : 4;
				return count + " Interdict Boon" + (count > 1 ? "s" : "") + " known";
			}),
			extraname: "Interdiction Boon",
			extrachoices: [
				"Abating Seal", "Bedevil", "Soul Eater", "Styx's Apathy", "Swift Retribution",
				"Acheron's Chain", "Conflagrant Channel", "Eyes of the Gate", "Shadow Shroud", "Unleash Hell", "Vengeful Shot",
				"Dis's Onslaught", "Flash of Brimstone", "Hellish Frenzy", "Hellsight", "Impaling Shot", "Iron Gaol", "Last Word", "Soul's Doom"
			],
			extratimes: levels.map(function (n) {
				return n < 7 ? 1 : n < 13 ? 2 : n < 18 ? 3 : 4;
			}),
			choicesNotInMenu: false,
			"abating seal": {
				name: "Abating Seal",
				submenu: "[Interdict Boon 02+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
				description: desc([
					"When a creature I can see damages me or an ally within 30 ft of me, I can expend a seal as a reaction to reduce damage taken by 1d10 + half my Illrigger level."
				]),
				action: [["reaction", ""]]
			},
			"bedevil": {
				name: "Bedevil",
				submenu: "[Interdict Boon 02+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
				description: desc([
					"When I burn a seal on an Interdicted creature, I can activate this boon. The target must subtract my Proficiency Bonus from the result of the next saving throw made before the end of its next turn."
				])
			},
			"soul eater": {
				name: "Soul Eater",
				submenu: "[Interdict Boon 02+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
				description: desc([
					"When I burn a seal on an Interdicted creature, I can activate this boon to gain temporary hit points equal to my Illrigger level."
				])
			},
			"styx's apathy": {
				name: "Styx's Apathy",
				submenu: "[Interdict Boon 02+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
				description: desc([
					"When I burn a seal on an Interdicted creature, I can use my reaction to prevent the target from using its reaction until the end of its next turn."
				]),
				action: [["reaction", ""]]
			},
			"swift retribution": {
				name: "Swift Retribution",
				submenu: "[Interdict Boon 02+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 2; },
				description: desc([
					"When an Interdicted creature provokes an opportunity attack from me, I can attack without using my reaction. I cannot benefit from this boon again until the start of my next turn."
				])
			},
			"acheron's chain": {
				name: "Acheron's Chain",
				submenu: "[Interdict Boon 07+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
				description: desc([
					"When I use a bonus action to place or move a seal on a Large or smaller creature, the target must make a Strength save (DC = Ability Save DC) or be pulled 10 ft toward me or Grappled until the end of my next turn."
				]),
				action: [["bonus action", ""]]
			},
			"conflagrant channel": {
				name: "Conflagrant Channel",
				submenu: "[Interdict Boon 07+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
				description: desc([
					"I can expend a seal as a bonus action to teleport up to 60 ft to an unoccupied space I can see."
				]),
				action: [["bonus action", ""]]
			},
			"eyes of the gate": {
				name: "Eyes of the Gate",
				submenu: "[Interdict Boon 07+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
				description: desc([
					"As an action, I can expend 1+ seals on a creature within 60 ft (Wis save, can willingly fail). On a failure, I bind to its senses for 1 hour per seal expended. As an action, I can see/hear through it (using its special senses) and use seals/boons through it; it becomes aware and can use an action to repeat the save."
				]),
				action: [["action", ""]]
			},
			"shadow shroud": {
				name: "Shadow Shroud",
				submenu: "[Interdict Boon 07+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
				description: desc([
					"I can expend a seal as a bonus action to increase my AC or the AC of a creature within 5 ft by +2 for 1 minute."
				]),
				action: [["bonus action", ""]]
			},
			"unleash hell": {
				name: "Unleash Hell",
				submenu: "[Interdict Boon 07+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
				description: desc([
					"When I burn 1+ seals on an Interdicted creature, I can use my reaction to force chosen creatures within 5 ft of it to make a Dexterity save, taking the same amount and type of damage on a failed save, or half on a success."
				]),
				action: [["reaction", ""]]
			},
			"vengeful shot": {
				name: "Vengeful Shot",
				submenu: "[Interdict Boon 07+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 7; },
				description: desc([
					"I can expend a seal as a reaction when a creature makes a ranged attack against me or an ally within 30 ft to make a ranged weapon attack against the attacker, dealing extra damage equal to half my Illrigger level on a hit."
				]),
				action: [["reaction", ""]]
			},
			"dis's onslaught": {
				name: "Dis's Onslaught",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"When I use a bonus action to place or move a seal, I can make a weapon attack."
				])
			},
			"flash of brimstone": {
				name: "Flash of Brimstone",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"When I place or move a seal, I can teleport to an unoccupied space within 5 ft of the target (no action required)."
				])
			},
			"hellish frenzy": {
				name: "Hellish Frenzy",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"When I start my turn within 30 ft of an Interdicted creature, I can expend a seal to Frenzy until the start of my next turn: my speed is doubled, I gain +2 AC, and I can make 1 extra attack when taking the Attack action."
				])
			},
			"hellsight": {
				name: "Hellsight",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"I can expend a seal as an action to gain Truesight out to 60 ft for 1 hour."
				]),
				action: [["action", ""]]
			},
			"impaling shot": {
				name: "Impaling Shot",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"When I hit an Interdicted creature with a ranged weapon attack, I can expend a seal as a bonus action to reduce its AC by my Proficiency Bonus until the end of my next turn."
				]),
				action: [["bonus action", ""]]
			},
			"iron gaol": {
				name: "Iron Gaol",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"As an action, I can touch a creature and expend 4 seals to banish it to Hell (Cha save). Natives to Hell or creatures of CR/level 4 or lower remain there; others return after 1 minute (can repeat save as an action)."
				]),
				action: [["action", ""]]
			},
			"last word": {
				name: "Last Word",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"When reduced to 0 HP with unplaced seals, I can expend up to 3 seals to explode (3d6 Fire per seal, Dex save for half) to chosen creatures within 30 ft. If at least one takes damage, I regain HP equal to the total rolled."
				])
			},
			"soul's doom": {
				name: "Soul's Doom",
				submenu: "[Interdict Boon 13+]",
				prereqeval: function (v) { return classes.known.illrigger.level >= 13; },
				description: desc([
					"When I use a bonus action to place or move a seal, I can scorch it into the target. For 1 minute, whenever the target takes damage, it takes extra damage equal to my Proficiency Bonus."
				])
			}
		},
		"subclassfeature3": {
			name: "Diabolic Contract",
			source: [["IR", 13]],
			minlevel: 3,
			description: desc([
				"Choose a Diabolic Contract to commit to and put it in the \"Class\" field on the first page."
			])
		},
		"infernalconduit": {
			name: "Infernal Conduit",
			source: [["IR", 13]],
			minlevel: 6,
			description: desc([
				"I gain a pool of d10s. As an action, I can spend 1+ dice and touch a creature to force a Con save (can willingly fail) to Invigorate or Devour it. See Notes page."
			]),
			toNotesPage: [{
				name: "Infernal Conduit",
				page3notes: true,
				note: [
					"\u2022 Invigorate. Target regains HP equal to the total rolled on the dice (half on a successful save). I take necrotic damage equal to the HP restored; if this drops me to 0 HP, I fall unconscious and am stabilized.",
					"\u2022 Devour. Target takes necrotic damage equal to the total rolled (half on a successful save), and I regain HP equal to the damage dealt. This damage cannot be mitigated in any way.",
					"   At 11th level, a target that fails its save against Devour also gains 1 level of exhaustion (max 3)."
				]
			}],
			additional: levels.map(function (n) {
				if (n < 6) return "";
				var dice = Math.floor((n + 2) / 2);
				return dice + "d10" + (n >= 11 ? " + 1 Exhaustion" : "");
			}),
			usages: [0, 0, 0, 0, 0, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10],
			action: [["action", ""]],
			recovery: "long rest"
		},
		"bloodprice": {
			name: "Blood Price",
			source: [["IR", 14]],
			minlevel: 10,
			description: desc([
				"When I fail a saving throw, I can spend one Hit Die and add it to the save roll."
			])
		},
		"terrorizingforce": {
			name: "Terrorizing Force",
			source: [["IR", 14]],
			minlevel: 11,
			description: desc([
				"When I hit with a weapon attack, I deal an extra 1d8 Cold, Fire, Necrotic, or Poison damage (chosen after a long rest)."
			]),
			calcChanges: {
				atkAdd: [
					function (fields, v) {
						if (v.isWeapon) {
							fields.Description += (fields.Description ? '; ' : '') + '+1d8 Cold/Fire/Necrotic/Poison dmg';
						}
					},
					"My weapon attacks deal an extra 1d8 Cold, Fire, Necrotic, or Poison damage."
				]
			}
		},
		"superiorinterdict": {
			name: "Superior Interdict",
			source: [["IR", 14]],
			minlevel: 14,
			description: desc([
				"Damage from my seals ignores resistances. Once per long rest, I can use a bonus action to regain a seal if I have none remaining."
			]),
			usages: 1,
			recovery: "long rest",
			action: [["bonus action", "Regain 1 Seal"]]
		},
		"infernalmajesty": {
			name: "Infernal Majesty",
			source: [["IR", 14]],
			minlevel: 17,
			description: desc([
				"Once per long rest as a bonus action, I gain the following benefits for 10 minutes:",
				"\u2022 Resistance to fire, cold, and necrotic damage, and a 60 ft fly speed.",
				"\u2022 When I use Blood Price, an enemy within 10 ft takes damage equal to the die rolled.",
				"\u2022 Terrorizing Force deals 2d8 extra damage instead of 1d8.",
				"\u2022 If I die during this time, my body vanishes in flame (leaving gear) and reforms at full HP in 1d6 days."
			]),
			usages: 1,
			recovery: "long rest",
			action: [["bonus action", ""]]
		},
		"masterofhell": {
			name: "Master of Hell",
			source: [["IR", 14]],
			minlevel: 20,
			description: desc([
				"Once per long rest as an action, I summon a 50 ft radius hellstorm within 150 ft, choosing Inferno, Pestilence, or Darkness. See Notes page."
			]),
			toNotesPage: [{
				name: "Master of Hell",
				page3notes: true,
				note: [
					"\u2022 Inferno. Enemies make a Dex save or take 5d10 Fire + 5d10 Necrotic damage (half on save) and burn for 1 minute (1d10 Fire + 1d10 Necrotic at end of turn until they succeed on a Dex save; nonmagical means can't extinguish).",
					"\u2022 Pestilence. Enemies make a Con save or take 5d10 Poison + 5d10 Necrotic damage and are Poisoned for 1 minute (half damage and not poisoned on save).",
					"\u2022 Darkness. Enemies make a Con save or take 10d10 Cold damage (half on save). Hostiles in the area are Blinded for 1 minute or until they leave the area."
				]
			}],
			usages: 1,
			recovery: "long rest",
			action: [["action", ""]]
		}
	}
};

// >>>>>>>>>>>>>>>>>>>>>> //
// >>> Add Subclasses >>> //
// >>>>>>>>>>>>>>>>>>>>>> //

// Architect of Ruin
AddSubClass("illrigger", "architect of ruin", {
	regExpSearch: /architect of ruin/i,
	subname: "Architect of Ruin",
	source: [["IR", 17]],
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
		[4, 3, 3, 1, 0, 0, 0, 0, 0]  // 20
	],
	spellcastingKnown: {
		cantrips: [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3],
		spells: [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13]
	},
	spellcastingList: {
		class: "illrigger",
		extraspells: [
			"chill touch", "dancing lights", "fire bolt", "message", "minor illusion", "ray of frost", "shocking grasp", "thaumaturgy", "vicious mockery",
			"bane", "burning hands", "charm person", "color spray", "command", "detect magic", "disguise self", "hellish rebuke", "shield", "shield of faith", "silent image",
			"arcanists magic aura", "augury", "blur", "darkness", "detect thoughts", "enthrall", "heat metal", "hold person", "invisibility", "lesser restoration", "mirror image", "ray of enfeeblement", "scorching ray", "silence", "suggestion",
			"bestow curse", "dispel magic", "fear", "fly", "haste", "major image", "phantom steed", "remove curse", "revivify", "slow",
			"banishment", "blight", "compulsion", "death ward", "dimension door", "dominate beast", "greater invisibility", "hallucinatory terrain", "locate creature", "phantasmal killer"
		]
	},
	features: {
		"subclassfeature3.1": {
			name: "Asmodeus's Blessing",
			source: [["IR", 17]],
			minlevel: 3,
			description: desc([
				"I gain proficiency in Arcana, History, Nature, or Religion using the \"Choose Feature\" button."
			]),
			skillstxt: "Choose one from Arcana, History, Nature, or Religion",
			extraname: "Asmodeus's Blessing",
			extrachoices: ["Arcana Proficiency", "History Proficiency", "Nature Proficiency", "Religion Proficiency"],
			"arcana proficiency": {
				name: "Asmodeus's Blessing: Arcana",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("Arcana") == -1; },
				skills: ["Arcana"]
			},
			"history proficiency": {
				name: "Asmodeus's Blessing: History",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("History") == -1; },
				skills: ["History"]
			},
			"nature proficiency": {
				name: "Asmodeus's Blessing: Nature",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("Nature") == -1; },
				skills: ["Nature"]
			},
			"religion proficiency": {
				name: "Asmodeus's Blessing: Religion",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("Religion") == -1; },
				skills: ["Religion"]
			}
		},
		"subclassfeature3.2": {
			name: "Spellcasting",
			source: [["IR", 17]],
			minlevel: 3,
			additional: levels.map(function (n, idx) {
				var cantr = [0, 0, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3][idx];
				var splls = [0, 0, 3, 4, 4, 4, 5, 6, 6, 7, 8, 8, 9, 10, 10, 11, 11, 11, 12, 13][idx];
				return cantr + " cantrips & " + splls + " spells known";
			}),
			description: desc([
				"I can cast Illrigger cantrips and spells using Charisma as my spellcasting ability."
			])
		},
		"subclassfeature3.3": {
			name: "Invoke Hell",
			source: [["IR", 22]],
			minlevel: 3,
			description: desc([
				"I gain two Invoke Hell options (Enervating Spell and Spellblade). Once I use either option, I must finish a short or long rest before using Invoke Hell again."
			]),
			usages: 1,
			recovery: "short rest",
			"enervatingspell": {
				name: "Invoke Hell: Enervating Spell",
				source: [["IR", 18]],
				description: desc([
					"When I deal damage with an Illrigger spell, I can expend a seal (no action) to give the target vulnerability to that spell's damage, ignoring resistance or immunity."
				])
			},
			"spellblade": {
				name: "Invoke Hell: Spellblade",
				source: [["IR", 19]],
				description: desc([
					"I can use my action to make both a melee weapon attack and cast an Illrigger spell with a casting time of 1 action."
				]),
				action: [["action", ""]]
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
			source: [["IR", 19]],
			minlevel: 7,
			description: desc([
				"I can cast an Illrigger cantrip in place of one of my attacks granted by Extra Attack."
			])
		},
		"subclassfeature7.1": {
			name: "Asmodeus's Interdiction",
			source: [["IR", 19]],
			minlevel: 7,
			description: desc([
				"I gain additional Interdict Boons at 7th, 13th, and 18th level that don't count against my boons known."
			]),
			"axiomaticseals": {
				name: "Axiomatic Seals",
				source: [["IR", 19]],
				description: desc([
					"When I burn a seal to deal damage to a creature, I add my Charisma modifier to the damage."
				])
			},
			"spellbreaker": {
				name: "Spellbreaker",
				source: [["IR", 19]],
				description: desc([
					"When an Interdicted creature I can see casts a spell, I can use my reaction to burn 1+ seals on it and cast Counterspell without a spell slot at a level equal to the seals burned."
				]),
				action: [["reaction", "Counterspell"]],
				spellcastingBonus: [{
					spells: ["counterspell"],
					name: "Spellbreaker: Counterspell",
					selection: ["counterspell"]
				}]
			},
			"hellmage": {
				name: "Hell Mage",
				source: [["IR", 19]],
				description: desc([
					"When I or an ally within 30 ft succeed on a saving throw against an enemy's spell or magical effect, I can place up to my Proficiency Bonus in seals on that enemy."
				])
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
			source: [["IR", 19]],
			minlevel: 11,
			description: desc([
				"When I cast an Illrigger spell, I can burn two seals on an Interdicted target to impose disadvantage on its saving throw against the spell."
			])
		},
		"subclassfeature15": {
			name: "Vile Transmogrification",
			source: [["IR", 19]],
			minlevel: 15,
			description: desc([
				"Once per long rest as a bonus action, I can expend one spell slot to regain seals equal to the slot's level, or expend seals to regain a spell slot of a level equal to one-third the seals spent."
			]),
			usages: 1,
			recovery: "long rest",
			action: [["bonus action", ""]]
		}
	}
});

// Hellspeaker
AddSubClass("illrigger", "hellspeaker", {
	regExpSearch: /hellspeaker/i,
	subname: "Hellspeaker",
	source: [["IR", 22]],
	features: {
		"subclassfeature3.1": {
			name: "Moloch's Blessing",
			source: [["IR", 22]],
			minlevel: 3,
			description: desc([
				"I gain proficiency (or expertise if already proficient) in Persuasion or Deception, learn an additional language, and have advantage on Charisma checks to influence creatures that can hear me."
			]),
			vision: [["Adv. on Cha checks to influence"]],
			languageProfs: [1],
			extraname: "Moloch's Blessing",
			extrachoices: ["Persuasion Proficiency", "Persuasion Expertise", "Deception Proficiency", "Deception Expertise"],
			"persuasion proficiency": {
				name: "Moloch's Blessing: Persuasion",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("Persuasion") == -1; },
				skills: ["Persuasion"]
			},
			"persuasion expertise": {
				name: "Moloch's Blessing: Persuasion Expertise",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("Persuasion") != -1; },
				skills: ["Persuasion", "only"]
			},
			"deception proficiency": {
				name: "Moloch's Blessing: Deception",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("Deception") == -1; },
				skills: ["Deception"]
			},
			"deception expertise": {
				name: "Moloch's Blessing: Deception Expertise",
				description: "",
				prereqeval: function (v) { return v.skillProfs.indexOf("Deception") != -1; },
				skills: ["Deception", "only"]
			}
		},
		"subclassfeature3.2": {
			name: "Charm Enemy",
			source: [["IR", 22]],
			minlevel: 3,
			description: desc([
				"When I use my bonus action to place a seal on a Humanoid, it must make a Cha save or be Charmed for 1 hour (ends if harmed; knows it was charmed afterward). I can also burn seals on other Interdicted Humanoids within 30 ft during the same bonus action to force them to save after taking seal damage."
			]),
			usages: "Charisma modifier per ",
			usagescalc: "event.value = Math.max(1, What('Cha Mod'));",
			recovery: "short rest"
		},
		"subclassfeature3.3": {
			name: "Invoke Hell",
			source: [["IR", 22]],
			minlevel: 3,
			description: desc([
				"I gain two Invoke Hell options (Honey-Sweet Blades and Turncoat). Once I use either option, I must finish a short or long rest before using Invoke Hell again."
			]),
			usages: 1,
			recovery: "short rest",
			"honeysweetblades": {
				name: "Invoke Hell: Honey-Sweet Blades",
				source: [["IR", 22]],
				description: desc([
					"When I make an attack against an Interdicted creature, I gain advantage on the attack roll, and if it hits, it becomes a critical hit."
				])
			},
			"turncoat": {
				name: "Invoke Hell: Turncoat",
				source: [["IR", 23]],
				description: desc([
					"As an action, choose up to my Proficiency Bonus in enemies within 60 ft that can hear me. Each must make a Cha save or use its reaction to make a weapon attack against a target of my choice (other than itself)."
				]),
				action: [["action", ""]]
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
			name: "Moloch's Interdiction",
			source: [["IR", 23]],
			minlevel: 7,
			description: desc([
				"I gain additional Interdict Boons at 7th, 13th, and 18th level that don't count against my boons known."
			]),
			"redcant": {
				name: "Red Cant",
				source: [["IR", 23]],
				description: desc([
					"When I make a Charisma check, I can expend a seal to treat a d20 roll of 9 or lower as a 10."
				])
			},
			"slipperyploy": {
				name: "Slippery Ploy",
				source: [["IR", 23]],
				description: desc([
					"When a creature targets me with an attack, spell, or magical effect, I can use my reaction to place a seal on it and force a Cha save; on a fail, it must choose a new target or lose the attack/effect."
				]),
				action: [["reaction", ""]]
			},
			"incontrovertible": {
				name: "Incontrovertible",
				source: [["IR", 23]],
				description: desc([
					"Interdicted creatures have disadvantage on Wisdom and Charisma saving throws."
				])
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
			source: [["IR", 23]],
			minlevel: 11,
			description: desc([
				"Chosen creatures within 10 ft of me are immune to the Charmed condition while I am conscious."
			])
		},
		"subclassfeature11.1": {
			name: "Let's Make a Deal",
			source: [["IR", 23]],
			minlevel: 11,
			description: desc([
				"As a bonus action, a willing creature within 60 ft that can hear me can gain advantage on one attack roll or saving throw and add my Proficiency Bonus. If it hits/succeeds, it gains temp HP equal to my Illrigger level; otherwise, its next attack or save has uncancelable disadvantage."
			]),
			usages: "Proficiency bonus per ",
			usagescalc: "event.value = How('Proficiency Bonus');",
			recovery: "long rest",
			action: [["bonus action", ""]]
		},
		"subclassfeature15": {
			name: "Quid Pro Quo",
			source: [["IR", 23]],
			minlevel: 15,
			description: desc([
				"As an action, a creature I can see within 30 ft makes a Cha save or is banished to Hell for 1 minute (repeats save at end of each turn; 24-hr immunity after). While banished, a friendly devil jurist or horned devil appears in its place under my command."
			]),
			usages: 1,
			recovery: "long rest",
			action: [["action", ""]]
		}
	}
});

// Painkiller
AddSubClass("illrigger", "painkiller", {
	regExpSearch: /painkiller/i,
	subname: "Painkiller",
	source: [["IR", 23]],
	features: {
		"subclassfeature3.1": {
			name: "Dispater's Blessing",
			source: [["IR", 24]],
			minlevel: 3,
			description: desc(["I gain proficiency with heavy armor."]),
			armorProfs: [true, true, true, true]
		},
		"subclassfeature3.2": {
			name: "Devastator",
			source: [["IR", 24]],
			minlevel: 3,
			description: desc([
				"As an action, I make a weapon attack and choose up to my Proficiency Bonus in willing creatures within 30 ft; each can use its reaction to make a weapon attack or cast a cantrip."
			]),
			usages: 1,
			recovery: "short rest",
			action: [["action", ""]]
		},
		"subclassfeature3.3": {
			name: "Invoke Hell",
			source: [["IR", 24]],
			minlevel: 3,
			description: desc([
				"I gain two Invoke Hell options (Grand Strategist and Punishment). Once I use either option, I must finish a short or long rest before using Invoke Hell again."
			]),
			usages: 1,
			recovery: "short rest",
			"grandstrategist": {
				name: "Invoke Hell: Grand Strategist",
				source: [["IR", 24]],
				description: desc([
					"With no action required, choose up to my Proficiency Bonus in allies within 60 ft that can hear me; each can move up to half its speed without provoking opportunity attacks."
				])
			},
			"punishment": {
				name: "Invoke Hell: Punishment",
				source: [["IR", 24]],
				description: desc([
					"When damaged by an attack, I can use my reaction to force the attacker to make a Wis save, taking necrotic damage equal to the triggering attack's damage on a fail, or half on a success."
				]),
				action: [["reaction", ""]]
			},
			autoSelectExtrachoices: [{
				extrachoice: "grandstrategist",
				minlevel: 3
			}, {
				extrachoice: "punishment",
				minlevel: 3
			}]
		},
		"subclassfeature7": {
			name: "Dispater's Interdiction",
			source: [["IR", 24]],
			minlevel: 7,
			description: desc([
				"I gain additional Interdict Boons at 7th, 13th, and 17th level that don't count against my boons known."
			]),
			"telekineticseal": {
				name: "Telekinetic Seal",
				source: [["IR", 24]],
				description: desc([
					"When a creature I can see moves within 5 ft of me, I can use my reaction to place a seal on it and force a Wis save or be pushed 15 ft or knocked prone (my choice)."
				]),
				action: [["reaction", ""]]
			},
			"bythethroat": {
				name: "By the Throat",
				source: [["IR", 24]],
				description: desc([
					"When I use a bonus action to place or move a seal on a creature up to one size larger than me, it must make a Wis save or be Restrained until the end of its next turn."
				])
			},
			"dispaterssupremacy": {
				name: "Dispater's Supremacy",
				source: [["IR", 24]],
				description: desc([
					"My weapon attacks against an Interdicted creature score a critical hit on a roll of 18\u201320."
				])
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
			source: [["IR", 24]],
			minlevel: 11,
			description: desc([
				"When an ally within 30 ft drops to 0 HP without being killed outright, I can use my reaction to cause them to drop to 1 HP instead."
			]),
			usages: 1,
			recovery: "short rest",
			action: [["reaction", ""]]
		},
		"subclassfeature15": {
			name: "Deathstrike",
			source: [["IR", 25]],
			minlevel: 15,
			description: desc([
				"When I hit an Interdicted creature with a melee attack, I can use my reaction to burn 1 seal to turn the hit into a critical hit and double the burned seal's damage."
			]),
			usages: "Proficiency bonus per ",
			usagescalc: "event.value = How('Proficiency Bonus');",
			recovery: "long rest",
			action: [["reaction", ""]]
		}
	}
});

// Sanguine Knight
AddSubClass("illrigger", "sanguine knight", {
	regExpSearch: /sanguine knight/i,
	subname: "Sanguine Knight",
	source: [["IR", 25]],
	features: {
		"subclassfeature3.1": {
			name: "Exsanguinate",
			source: [["IR", 26]],
			minlevel: 3,
			description: desc([
				"When I burn seals on a creature that isn't a Construct or Undead, an ally within 30 ft gains temporary HP equal to the damage dealt by the seals."
			])
		},
		"subclassfeature3.2": {
			name: "Sutekh's Blessing",
			source: [["IR", 26]],
			minlevel: 3,
			description: desc([
				"I gain proficiency in Religion. As an action, I can sense creatures with blood within 120 ft until the end of my next turn (blocked by 1 ft stone, 1 in metal, thin lead, or 3 ft wood/dirt)."
			]),
			skills: ["Religion"],
			usages: "Proficiency bonus per ",
			usagescalc: "event.value = How('Proficiency Bonus');",
			recovery: "long rest",
			action: [["action", ""]]
		},
		"subclassfeature3.3": {
			name: "Invoke Hell",
			source: [["IR", 26]],
			minlevel: 3,
			description: desc([
				"I gain two Invoke Hell options (Embolden Allies and Vitalize). Once I use either option, I must finish a short or long rest before using Invoke Hell again."
			]),
			usages: 1,
			recovery: "short rest",
			"emboldenallies": {
				name: "Invoke Hell: Embolden Allies",
				source: [["IR", 26]],
				description: desc([
					"As a bonus action, I restore a pool of HP equal to 5 \u00D7 my Illrigger level, divided among myself and any creatures within 30 ft."
				]),
				action: [["bonus action", ""]]
			},
			"vitalize": {
				name: "Invoke Hell: Vitalize",
				source: [["IR", 26]],
				description: desc([
					"With no action required, chosen creatures within 30 ft add my Proficiency Bonus to ability checks for 1 minute."
				])
			},
			autoSelectExtrachoices: [{
				extrachoice: "emboldenallies",
				minlevel: 3
			}, {
				extrachoice: "vitalize",
				minlevel: 3
			}]
		},
		"subclassfeature7": {
			name: "Sutekh's Interdiction",
			source: [["IR", 26]],
			minlevel: 7,
			description: desc([
				"I gain additional Interdict Boons at 7th, 13th, and 18th level that don't count against my boons known."
			]),
			"foulinterchange": {
				name: "Foul Interchange",
				source: [["IR", 26]],
				description: desc([
					"As an action, expend a seal to end Blinded, Charmed, Dazed, Deafened, Frightened, Paralyzed, or Poisoned on a creature within 30 ft; another creature within 60 ft makes a Con save or gains that condition until the end of my next turn."
				]),
				action: [["action", ""]]
			},
			"sanguinegift": {
				name: "Sanguine Gift",
				source: [["IR", 26]],
				description: desc([
					"When a creature I can see within 30 ft regains HP, I can expend a seal (no action) to grant it extra HP equal to my Illrigger level."
				])
			},
			"bloodforblood": {
				name: "Blood for Blood",
				source: [["IR", 26]],
				additional: levels.map(function (n) {
					return n < 18 ? "" : (Math.floor((n - 1) / 4) + 2) + " Necrotic dmg";
				}),
				description: desc([
					"Whenever an ally takes damage from an Interdicted creature, that creature takes necrotic damage equal to my Proficiency Bonus."
				])
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
			source: [["IR", 26]],
			minlevel: 11,
			additional: levels.map(function (n) {
				return n < 11 ? "" : n + " dmg";
			}),
			description: desc([
				"When an ally with temp HP from Exsanguinate is hit by a melee attack, the attacker takes Cold, Fire, or Necrotic damage (my choice) equal to my Illrigger level."
			])
		},
		"subclassfeature15": {
			name: "Haemal Exchange",
			source: [["IR", 26]],
			minlevel: 15,
			description: desc([
				"When an Interdicted creature within 60 ft or an ally within 30 ft makes an attack roll or saving throw, I can use my reaction to burn 1 seal to subtract 1d8 (enemy) or add 1d8 (ally) to the roll."
			]),
			action: [["reaction", ""]]
		}
	}
});

// Shadowmaster
AddSubClass("illrigger", "shadowmaster", {
	regExpSearch: /shadowmaster/i,
	subname: "Shadowmaster",
	source: [["IR", 27]],
	features: {
		"subclassfeature3.1": {
			name: "Marked for Death",
			source: [["IR", 27]],
			minlevel: 3,
			description: desc([
				"I have advantage on my first attack roll against an Interdicted creature on each of my turns."
			])
		},
		"subclassfeature3.2": {
			name: "Strike From The Dark",
			source: [["IR", 27]],
			minlevel: 3,
			description: desc([
				"Once per turn, when I hit an Interdicted creature with a melee weapon attack with advantage, I deal extra d4s of damage equal to my Proficiency Bonus (+1d4 if the target is in dim light or darkness)."
			])
		},
		"subclassfeature3.3": {
			name: "Invoke Hell",
			source: [["IR", 27]],
			minlevel: 3,
			description: desc([
				"I gain two Invoke Hell options (Master of Disguise and No Escape). Once I use either option, I must finish a short or long rest before using Invoke Hell again."
			]),
			usages: 1,
			recovery: "short rest",
			"masterofdisguise": {
				name: "Invoke Hell: Master of Disguise",
				source: [["IR", 27]],
				description: desc([
					"As an action, I can cast Disguise Self without expending a spell slot."
				]),
				action: [["action", "Disguise Self"]],
				spellcastingBonus: [{
					spells: ["disguise self"],
					name: "Master of Disguise",
					selection: ["disguise self"]
				}]
			},
			"noescape": {
				name: "Invoke Hell: No Escape",
				source: [["IR", 27]],
				description: desc([
					"As a bonus action, a creature within 30 ft makes a Cha save (disadv. in dim light/darkness) or has its speed halved and can't willingly move more than 30 ft from me."
				]),
				action: [["bonus action", ""]]
			},
			autoSelectExtrachoices: [{
				extrachoice: "masterofdisguise",
				minlevel: 3
			}, {
				extrachoice: "noescape",
				minlevel: 3
			}]
		},
		"subclassfeature7": {
			name: "Belial's Interdiction",
			source: [["IR", 27]],
			minlevel: 7,
			description: desc([
				"I gain additional Interdict Boons at 7th, 13th, and 18th level that don't count against my boons known."
			]),
			"veiloflies": {
				name: "Veil of Lies",
				source: [["IR", 27]],
				description: desc([
					"As a bonus action, I can expend a seal to become Invisible for 10 minutes or until I attack or cast a spell."
				]),
				action: [["bonus action", ""]]
			},
			"hellsassassin": {
				name: "Hell's Assassin",
				source: [["IR", 27]],
				description: desc([
					"Whenever I roll a 1 or 2 on a damage die for my seals or weapon attacks against Interdicted creatures, I can reroll the die and must use the new roll."
				])
			},
			"darkmalediction": {
				name: "Dark Malediction",
				source: [["IR", 27]],
				description: desc([
					"Interdicted creatures radiate magical darkness in a 10 ft radius that nonmagical light can't penetrate (darkvision sees through it; overlapping magical light illuminates the area)."
				])
			},
			autoSelectExtrachoices: [{
				extrachoice: "veiloflies",
				minlevel: 7
			}, {
				extrachoice: "hellsassassin",
				minlevel: 13
			}, {
				extrachoice: "darkmalediction",
				minlevel: 18
			}]
		},
		"subclassfeature11": {
			name: "Umbral Killer",
			source: [["IR", 28]],
			minlevel: 11,
			description: desc([
				"I gain 60 ft Darkvision (+60 ft if I already have it), +10 ft speed, advantage on Dex (Stealth) checks to hide, and Evasion (half damage on failed Dex saves vs. area effects, none on success)."
			]),
			speed: { allModes: "+10" },
			vision: [["Darkvision", "fixed 60"], ["Darkvision", "+60"], ["Adv. on Stealth (Hide)"]],
			savetxt: { text: ["Dex save vs. area effects: none on success, half on fail"] },
			advantages: [["Stealth", true]]
		},
		"subclassfeature15": {
			name: "Doomed to the Shadows",
			source: [["IR", 28]],
			minlevel: 15,
			description: desc([
				"Strike from the Dark uses d8s instead of d4s (+2d8 in dim light/darkness), and when it deals damage I can use my reaction to burn 1 seal to Blind the target for 1 minute."
			]),
			action: [["reaction", ""]]
		}
	}
});

// >>>>>>>>>>>>>>>>>> //
// >>> Add Spells >>> //
// >>>>>>>>>>>>>>>>>> //

SpellsList["aura of desecration"] = {
	name: "Aura of Desecration",
	classes: ["illrigger"],
	source: [["IR", 32]],
	level: 4,
	school: "Abj",
	time: "1 a",
	range: "S:30-ft rad",
	components: "V",
	duration: "Conc, 10 min",
	save: "Con",
	description: "Chosen creas, enter/start 4d6 Necrotic, no hp until start of next turn; save half",
	descriptionFull: [
		"Life-defiling energy radiates from you in an aura with a 30-foot radius. Until the spell ends, the aura moves with you, centered on you. When any creature of your choice enters the area or starts its turn there, it must make a Constitution saving throw. On a failed save, a creature takes 4d6 necrotic damage and can't regain hit points until the start of its next turn. On a successful save, the creature takes half as much damage and suffers no other effect."
	]
};

SpellsList["hell's lash"] = {
	name: "Hell's Lash",
	classes: ["illrigger"],
	source: [["IR", 32]],
	level: 1,
	school: "Evoc",
	time: "1 a",
	range: "30 ft",
	components: "V,S,M",
	compMaterial: "forked tongue of a serpent",
	duration: "Conc, 1 min",
	save: "Con",
	description: "4d4+2d4/SL fire dmg; tethered. Tethered 2d4+1d4/SL at start/turn. Rea-seal, all crea save with disadv",
	descriptionFull: [
		"You produce a whip of crimson energy that lashes out at a creature within range, creating a conduit between you and the target. The target must succeed on a Constitution saving throw or take 4d4 fire damage and be tethered. A tethered creature takes 2d4 fire damage at the beginning of each of its turns, and can attempt to repeat the saving throw at the end of each of its turns, ending the effect on a success.",
		"For the duration, if the target is an Interdicted creature, you can use your reaction to burn one of your seals on the creature. When you do, the creature makes the next saving throw to end this spell with disadvantage.",
		"At Higher Levels. When you cast this spell using a spell slot of 2nd level or higher, the initial damage increases by 2d4 and the recurring damage increases by 1d4 for each slot level above 1st."
	]
};

SpellsList["hellfire"] = {
	name: "Hellfire*",
	classes: ["illrigger"],
	source: [["IR", 33]],
	level: 0,
	school: "Evoc",
	time: "1 a",
	range: "120 ft",
	components: "V,S",
	duration: "Instantaneous",
	save: "Cha",
	description: "Save or 1d4 fire plus 1d4 Necro; +1d4 Fire and Necro at CL 5, 11, & 17.",
	descriptionCantripDie: "Save or 'CD'd4 fire plus 'CD'd4 Necro",
	descriptionFull: [
		"You create an eruption of smoldering hellfire around a creature you can see within range. The target must succeed on a Charisma saving throw or take 1d4 fire damage plus 1d4 necrotic damage.",
		"Both of the spell's damage types increase by 1d4 when you reach 5th level (2d4), 11th level (3d4), and 17th level (4d4)."
	]
};

SpellsList["infernal challenge"] = {
	name: "Infernal Challenge",
	classes: ["illrigger"],
	source: [["IR", 33]],
	level: 2,
	school: "Ench",
	time: "1 ba",
	range: "30 ft",
	components: "V",
	duration: "Conc, 1 min",
	save: "Cha",
	description: "No allies in 5ft: 1 crea sav or disadv on atks against others, sav moving away or speed 0, & your AC +2.",
	descriptionFull: [
		"You offer a creature a compelling challenge. If you have no allies within 5 feet of you, choose one creature within range who can see and hear you. They must succeed on a Charisma saving throw or answer your challenge and fight you. For the duration, you gain a +2 bonus to AC, the target has disadvantage on attack rolls against creatures other than you, and the first time the target tries to move away from you on a turn, they must succeed on a Charisma saving throw or their speed becomes 0 until the start of their next turn. This spell ends if you end your turn more than 30 feet away from the target."
	]
};

SpellsList["maligned weapon"] = {
	name: "Maligned Weapon",
	classes: ["illrigger"],
	source: [["IR", 33]],
	level: 4,
	school: "Evoc",
	time: "1 ba",
	range: "Touch",
	components: "V,S",
	duration: "Conc, 1 hr",
	save: "Wis",
	description: "Wpn kills light 30ft +2d6 Necro; bns: end & 30ft brst; sav or 4d6 Necro+Fear, save:1/2 dmg; rpt sav EoT.",
	descriptionFull: [
		"You imbue a weapon you touch with an infernal blessing. Until the spell ends, the weapon extinguishes any mundane sources of light in a 30-foot radius. In addition, attacks made with the weapon deal an extra 2d6 necrotic damage on a hit. If the weapon isn't already a magic weapon, it becomes one for the duration.",
		"As a bonus action on your turn while holding this weapon, you can end the spell early and cause the weapon to emit a burst of dark energy. Each creature of your choice who you can see within 30 feet of you must make a Wisdom saving throw. On a failed save, a creature takes 4d6 necrotic damage and is frightened for 1 minute. On a successful save, a creature takes half as much damage and isn't frightened. At the end of each of their turns, a frightened creature can make a Wisdom saving throw, ending the effect on themself on a success."
	]
};

SpellsList["mote of hell"] = {
	name: "Mote of Hell",
	classes: ["illrigger"],
	source: [["IR", 33]],
	level: 3,
	school: "Conj",
	time: "1 a",
	range: "150 ft",
	components: "V,S,M",
	compMaterial: "piece of sulfur",
	duration: "Conc, 1 min",
	save: "Wis",
	description: "15-ft rad sphere: magic dark, diff terr, crea start: 3d6 Fire; end turn 30-ft rad sav or 3d6 Psychic.",
	descriptionFull: [
		"You manifest a pocket of Hell. A 15-foot-radius sphere of darkness, brimstone, and blasting heat appears, centered on a point within range and lasting for the duration. The cloud of hellfire echoes with the cries of damned souls that can be heard by creatures within 30 feet of it. No light, even magical light, can illuminate the cloud, and any creatures fully within the area are blinded. The cloud warps the timescape, making the cloud's area difficult terrain. A creature that starts their turn in the area takes 3d6 fire damage. A creature that ends their turn in the area must succeed on a Wisdom saving throw or take 3d6 psychic damage as the voices of the damned crowd their mind."
	]
};

SpellsList["vengeful blade"] = {
	name: "Vengeful Blade",
	classes: ["illrigger"],
	source: [["IR", 34]],
	level: 0,
	school: "Evoc",
	time: "1 a",
	range: "S: 5-ft rad",
	components: "S,M",
	compMaterial: "melee weapon worth 1gp",
	duration: "Instantaneous",
	description: "Melee atk with cast; hit: +0d8 Necro; if atk/cast next rnd 1d8 Necro; +1d8 to both at CL5, 11, 17.",
	descriptionCantripDie: "Melee atk with cast; hit: +'CD-1'd8 Necro; if atk/cast next rnd 'CD'd8 Necro",
	descriptionFull: [
		"You brandish the weapon used in the spell's casting and make a melee attack with it against one creature within 5 feet of you. On a hit, the target suffers the weapon attack's normal effects and then radiates a dark aura of energy until the start of your next turn. If the target makes an attack or casts a spell before then, the target takes 1d8 necrotic damage and the spell ends.",
		"This spell's damage increases when you reach certain levels. At 5th level, the melee attack deals an extra 1d8 necrotic damage to the target on a hit, and the damage the target takes for making an attack or casting a spell increases to 2d8. Both damage rolls increase by 1d8 at 11th level (2d8 and 3d8) and again at 17th level (3d8 and 4d8)."
	]
};

SpellsList["wall of death"] = {
	name: "Wall of Death",
	classes: ["illrigger"],
	source: [["IR", 34]],
	level: 4,
	school: "Necro",
	time: "1 a",
	range: "120 ft",
	components: "V,S,M",
	compMaterial: "chip of onyx",
	duration: "Conc, 1 min",
	save: "Con",
	description: "60|1|20(l|w|h)/10ft r wall;all in 4d8 Necro;sav 1/2;enter/end in 10ft bad side same;1 rea: THP=dmg.",
	descriptionFull: [
		"You create a wall of necrotic energy on a surface within range. You can make a wall up to 60 feet long, 20 feet high, and 1 foot thick, or can make a ringed wall up to 20 feet in diameter, 20 feet high, and 1 foot thick. The wall is opaque and lasts for the duration.",
		"When the wall appears, each creature in its area must make a Constitution saving throw. A creature takes 4d8 necrotic damage on a failed save, or half as much damage on a successful one. One side of the wall, selected by you when you cast this spell, deals 4d8 necrotic damage to each creature who ends their turn within 10 feet of that side or inside the wall. A creature takes the same damage when they enter the wall for the first time on a turn or end their turn there. The other side of the wall deals no damage. Whenever a creature takes damage from the wall, you can use your reaction to gain temporary hit points equal to the amount of damage dealt."
	]
};
