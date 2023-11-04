//key is [trash, common, rare, legendary, artifact]

const fishingArray = 
[[110, 10, 0, 0, 0], //level 0-5
[110, 12, 4, 0, 0], //level 5-10
[110, 15, 7, 3, 0], //10-15 (etc)
[110, 15, 7, 3, 1],
]

const fishingLootMap = {
trash: ['./images/fishing/fishables/plastic bag.png', './images/fishing/fishables/moss ball.png', './images/fishing/fishables/sand dollar.png'],
common: ['./images/fishing/fishables/bass.png', './images/fishing/fishables/bluegill.png', './images/fishing/fishables/guppy.png'],
rare: ['./images/fishing/fishables/axolotl.png', './images/fishing/fishables/dab.png', './images/fishing/fishables/starfish.png'],
legendary: ['./images/fishing/fishables/banded shark.png', './images/fishing/fishables/golden tench.png', './images/fishing/fishables/sea spider.png'],
}

const artifacts = {
	auraofdeflection: {
		values: [10, 25, 33],
		description: "Baby Hortas wishes he could have this.",
		text: "+ You have a X% chance of deflecting a thermonuclear bomb to the person who bought it.",
		set: "cosmetic"
	},
	auraofdevotion: {
		values: [25, 50, 100],
		description: "Theoretical x Holy Expunged is my OTP.",
		text: "+ Your married spouse (if you have one) will get X% as much agnabucks as you do when you use a.work.",
		set: "cosmetic"
	},
	auraofthecraft: {
		values: [10, 5, 1],
		description: "The girl's a miner.",
		text: `+ You gain access to the command "a.fakejoin" which has a cooldown of X minute(s)
			   + You gain access to the command "a.jumpscare" which plays a creeper sound using /playsound (5 minute cooldown)
			   + (uber only) You gain access to the command "a.enderdragon" which plays the ender dragon death sound using /playsound (5 minute cooldown)
			   + You gain access to "a.deathcoords" which give you your last death's coordinates if your account is linked`,
		set: "cosmetic"
	},
	auraofthecaretaker: {
		values: [10, 25, 33],
		description: "This should probably go in the pet category but whatever lmao",
		text: `+ You gain access to "a.pet subtitle" which adds a bit of text under your pet's name
			   + You gain access to "a.pet color" which changes the color of the border around your pet's image
			   + You gain access to "a.pet notif" which toggles if agnabot dms you if your pet is in critical condition (10% on all stats or less)
			   ~ This artifact contributes to pet set bonus
			   ~ The only rarity of this item is rare
			   ~ Unequipping this artifact will clear all of these`,
		set: "pet"
	},
	amuletoflaziness: {
		values: [5, 10, 20],
		description: "Basically child labor at this point.",
		text: `+ When your pet reaches below 25% in all stats, instead of generating money, your pet generates X% per 5 minutes until its stats are full
- Your gain from child labor is halved`,
		set: "pet"
	},
	impenetrableshield: {
		values: [25, 50, 100],
		description: "impenetable shield artifact when it meets my minecraft iron axe",
		text: `+ Your pets' health stat will not deplete until all other stats are depleted, you gain X% more agnabucks from the health stat
- Health stat decreases 3% every 5 minutes
- A.redeem cannot be used`,
		set: "pet"
	},
	moneylaundrymachine: {
		values: [50, 75, 100],
		description: "Impeccably legal.",
		text: `+ You gain X% more money from pet payouts
- A.work cannot be used`,
		set: "pet"
	},
	fourleafclover: {
		values: [50, 75, 100],
		description: "I love the spire it's my favorite landmark!",
		text: `+ Your pet can randomly dig up random amounts of agnabucks (100-300) and trash/common items every X minutes
- A.fish cannot be used`,
		set: "pet"
	},
	emeraldhelmet: {
		values: [150, 200, 250],
		description: "I'll give you 2 carrots for it",
		text: `+ Unlocks command "a.loot" which gives X agnabucks every 10 minutes
- Pets do not give agnabucks
- Looks kinda weird idk bro............................ minecraft villager hat`,
		set: "manual"
	},
	amuletofdedication: {
		values: [4, 3, 2],
		description: "Thanks for supporting the server :     )",
		text: `+ Redeem output is doubled and reduced from 5 minute cooldown to X minute cooldown
- You cannot fish artifacts
- Fishing exp gained is halved
- Your chance of fishing trash is increased greatly`,
		set: "manual"
	},
	workmanscharm: {
		values: [50, 100, 200],
		description: "Impeccable charisma.",
		text: `+ Work cooldown is 30 seconds
+ Y is added to the output of work commands
- Child labor does not accrue money`,
		set: "manual"
	},
	cryoheart: {
		values: [1000, 5000, 10000],
		description: "Artic crystal of 'the grind'. Seems familiar.",
		text: `+ Every 50 "a.work" commands you do, gain X agnabucks
- Child labor does not accrue money 
- Pets do not give agnabucks`,
		set: "manual"
	},
	laboriouslure: {
		values: [20, 25, 30],
		description: "Fishing is manual labor too",
		text: `+ Fishing trash is automatically sold
+ Fishing trash goes for a increased price (X)
+ Fishing time is decreased
~ Fishing stats are eternally locked ([150, 20, 5, 0, 0])
- Fishing exp gain is reduced by 75%
- Upgrades to your fishing rod are not available or applied`,
		set: "manual"
	},
	mosseater: {
		values: [50, 75, 100],
		description: "WHAT THE FUCK SUSIE AND KRIS DELTARUNE",
		text: `+ Trash is automatically sold
+ Moss balls fished up sell for double the price
+ Fishing exp gain on trash and commons is increased by X% (in the case laborious lure is equipped, the reduction is DECREASED by this amount instead)
~ If laborious lure is equipped, fishing stats are locked at [150, 30, 10, 3, 1] instead
- A.work earns 100 dollars less`,
		set: "fish"
	},
	gemofgreatness: {
		values: [1, 2, 5],
		description: "This gem truly is great.",
		text: `+ Artifact chance in fishing is increased by X points
+ Instead of the rarity chance of artifacts when drawn being 60% rare, 30% legendary, and 10% uber, it is 50% rare, 30% legendary, and 20% uber
- You cannot use a.redeem`,
		set: "fish"
	},
}

const outfitFormats = {
	null: '<:emptyslot:1170208861853061140> || **EMPTY SLOT**'
}

module.exports = {
fishingArray, fishingLootMap, artifacts, outfitFormats
}