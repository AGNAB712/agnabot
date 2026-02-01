const path = require("path")
const fs = require("fs")
const missingImage = './images/dungeons/missing.png'
const { getRandomInt } = require('../generalFunctions.js')
const dungeonCanvas = require("./dungeonsCanvas.js")
const roomTypes = [
	{ chance: 5, type: "treasure" }, //5%
	{ chance: 30, type: "empty" }, //25%
	{ chance: 40, type: "trap" }, //10%
	{ chance: 100, type: "encounter" }, //70%
]
const enemyTypes = ["basic", "distributor", "tank", "healer"] //put non-solo enemies last
const { QuickDB } = require("quick.db");
const db = new QuickDB();



const dungeonData = {
	dungeons: [
		{ 
			name: "poseidon's trial", 
			description: "its blue", 
			minimumLevel: 0
		},
		{ 
			name: "the association", 
			description: "joe's domain", 
			minimumLevel: 3
		},
		{ 
			name: "Shibuya Incident", 
			description: "the Disaster Curses attack Shibuya", 
			minimumLevel: 7
		},
		{ 
			name: "Slime Rain", 
			description: "Ohhhhhmygodslime. Ok? Ok", 
			minimumLevel: 3
		},
		],
	classAttacks: {
		fighter: [{label:"Attack", enemy:true}, {label:"Defend"}, {label:"Knife Rain"}],
		wizard: [{label:"Spell Attack"}, {label:"Coinflip", enemy:true}, {label:"Shield"}],
		paladin: [{label:"Attack", enemy:true}, {label:"Brutal Smite", enemy:true}, {label:"Divine Smite", enemy:true}],
		cleric: [{label:"Defend"}, {label:"Basic Heal", ally:true}, {label:"Healing Word"}]
	}
}


//@params
//string name
//array[Player] players
class Dungeon {
	constructor(name, players) {
		this.name = name
		this.players = players
		this.allPlayers = [] //here so i can remove players from the players array, and then still reward all players Yahhhhh
		players.forEach((player) => {
			this.allPlayers.push(player)
		})
		this.rooms = []

		const playerAmount = players.length
		let averageLevel = 0;
		players.forEach((player, i) => {
			averageLevel = averageLevel + player.level
		})
		this.level = Math.ceil(averageLevel / playerAmount)
		const dungeonInfoKey = require(`../../images/dungeons/dungeon_assets/${name}/key.json`)
		this.lootLevel = dungeonInfoKey.level
	}

	generateRoom() {
		const room = new Room(this.name, this.players, this.level)
		this.rooms.push(room)
		return room
	}

	generateBossRoom() {
		const room = new BossRoom(this.name, this.players, this.level)
		this.rooms.push(room)
		return room
	}
}

//@params
//string name
//array[Player] players
//number level
//i probably should have made this a subclass or extends or whatever but idk this works fine
class Room {
	constructor(name, players, level) {
		this.type = (() => {
			const number = getRandomInt(100) + 1 //because getRandomInt(100) max is 99 min is 0
			let roomTypeFinal;
			let shouldSkip = false
			roomTypes.forEach((roomType) => {
				if (shouldSkip) {
					return
				}
				if (number < roomType.chance) {
					roomTypeFinal = roomType.type
					shouldSkip = true
				}
			})
			return roomTypeFinal
		})()

		this.players = players
		this.level = level //yeah def shouldve made this extend dungeon Whoopsies
		this.name = name
		const imagePath = `./images/dungeons/dungeon_assets/${name}/background.png`
		if (!fs.existsSync(imagePath)) {
			this.backgroundImage = missingImage
		} else {
			this.backgroundImage = imagePath
		}

		//add in different behaviours for different types later - 6/22
		switch(this.type) {
			case "encounter":
				let enemies = []

				if (this.players.length == 1) {
					for (let i = 0; i < players.length; i++) {
						enemies.push(new Enemy(name, level, enemyTypes[getRandomInt(enemyTypes.length - 1)] /*random enemy type without healer*/))
					}
				} else {
					for (let i = 0; i < players.length; i++) {
						enemies.push(new Enemy(name, level, enemyTypes[getRandomInt(enemyTypes.length)] /*random enemy type*/))
					}
				}
				
				this.enemies = enemies 
			break;

			case "empty":
				players.forEach((player) => {
					player.heal(player.level * 25)
				})
			break;

			case "trap":
				this.trapLevel = getRandomInt(2) + 1
				players.forEach((player) => {
					player.damage((this.trapLevel * 15) * Math.ceil(player.level / 5))
				})
			break;

			case "treasure":
				this.treasureLevel = getRandomInt(3)
				players.forEach((player) => {
					player.heal(player.level * 25)
				})
				//add more later once i figure out treasure
			break;
		}
	}

	async generateImage() {
		return await dungeonCanvas.roomImage(this)
	}

	async generateStatsImage() {
		return await dungeonCanvas.statsRoomImage(this)
	}
}

class BossRoom {
	constructor(name, players, level) {
		this.type = "boss"
		this.players = players
		this.level = level
		this.name = name
		const imagePath = `./images/dungeons/dungeon_assets/${name}/background.png`
		if (!fs.existsSync(imagePath)) {
			this.backgroundImage = missingImage
		} else {
			this.backgroundImage = imagePath
		}

		let enemies = []
		enemies.push(new Boss(name, level, players.length))
		this.enemies = enemies
	}

	async generateImage() {
		return await dungeonCanvas.roomImage(this)
	}
}

//@params
//number id
//link pfpUrl
//number level
//string class
class Player {

	superAttackUsed = false;
	defending = false;

	constructor(id, pfpUrl, name, level, dungeonClass) {

		if (!id || !level || !dungeonClass || !pfpUrl || !name) {
			throw new Error('Missing parameter');
		}

		this.id = id 
		this.level = level
		this.class = dungeonClass
		this.maxHealth = (level * 30) + 70
		this.health = this.maxHealth
		this.pfpUrl = pfpUrl
		this.name = name
		const imagePath = "./images/dungeons/classes/"+`${dungeonClass}.png`
		if (!fs.existsSync(imagePath)) {
			this.image = missingImage
		} else {
			this.image = imagePath
		}
	}

	damage(amount) {
		if (this.defending) {
			this.defending = false
			return
		}
		this.health = this.health - amount
		if (this.health < 1) {
			this.health = 0
			return this.health
		} else {
			return this.health
		}
	}

	heal(amount) {
		this.health = this.health + amount
		if (this.health > this.maxHealth) {
			this.health = this.maxHealth
			return this.health
		} else {
			return this.health
		}
	}

	attack1(room, enemyIndex) {
		if (enemyIndex > room.enemies.length || (enemyIndex || 0) < 0) {
			throw new Error("Invalid enemy index")
		}
		const enemyToHit = room.enemies[enemyIndex || 0]
		const damageValue = this.level * 25
		switch(this.class) {
			case "fighter":
				enemyToHit.damage(damageValue)
				return `**${this.name}** attacked **${enemyToHit.class}** for **${damageValue}** damage`
			break;

			case "wizard":
				room.enemies.forEach((enemy) => {
					enemy.damage(damageValue / room.enemies.length)
				})
				return `**${this.name}** attacked all enemies for **${damageValue / room.enemies.length}** damage`
			break;

			case "paladin":
				enemyToHit.damage(damageValue)
				return `**${this.name}** attacked **${enemyToHit.class}** for **${damageValue}** damage`
			break;

			case "cleric":
				this.defending = true
				return `**${this.name}** defended`
			break;
		}
	}

	attack2(room, enemyIndex) {
		if (enemyIndex > room.enemies.length || (enemyIndex || 0) < 0) {
			throw new Error("Invalid enemy index")
		}
		const enemyToHit = room.enemies[enemyIndex || 0]
		const damageValue = this.level * 25
		switch(this.class) {
			case "fighter":
				this.defending = true
				return `**${this.name}** defended`
			break;

			case "wizard":
				const flip = getRandomInt(2)
				if (flip == 0) {
					enemyToHit.damage(damageValue * 1.5)
					return `Lucky! **${this.name}** attacked **${enemyToHit.class}** for **${damageValue * 1.5}** damage`
				}
				return `Unlucky. **${this.name}** did not hit **${enemyToHit.class}**`
			break;

			case "paladin":
				enemyToHit.damage(damageValue * 1.5)
				this.damage(damageValue / 2)
				return `**${this.name}** attacked **${enemyToHit.class}** for **${damageValue * 1.5}** damage! They took **${damageValue/2}** damage.`
			break;

			case "cleric":
				const playerToHeal = room.players[enemyIndex]
				const amountToHeal = (playerToHeal.maxHealth-playerToHeal.health) * 0.5
				playerToHeal.heal(amountToHeal)
				return `**${this.name}** healed **${playerToHeal.name}** for **${amountToHeal}** health`
			break;
		}
	}

	//super
	attack3(room, enemyIndex) {
		if (this.superAttackUsed) return

		if (enemyIndex > room.enemies.length || enemyIndex < 0) {
			throw new Error("Invalid enemy index")
		}
		const enemyToHit = room.enemies[enemyIndex || 0]
		const damageValue = this.level * 25
		this.superAttackUsed = true
		switch(this.class) {
			case "fighter":
				room.enemies.forEach((enemy) => {
					enemy.damage((damageValue * 2) / room.enemies.length)
				})
				return `(SUPER) **${this.name}** attacked all enemies for **${(damageValue * 2) / room.enemies.length}** damage`
			break;

			case "wizard":
				room.players.forEach((player) => {
					player.defending = true
				})
				return `(SUPER) **${this.name}** cast a defense spell! All players are now defending.`
			break;

			case "paladin":
				enemyToHit.damage(damageValue * 2)
				return `(SUPER) **${this.name}** has smitten **${enemyToHit.class}** for **${damageValue * 2}** damage!`
			break;

			case "cleric":
				room.players.forEach((player) => {
					player.heal(damageValue * 1.5)
				})
				return `(SUPER) **${this.name}** has healed all players for **${damageValue * 1.5}** damage!`
			break;
		}
		
	}
}

//@params
//string dungeonName
//number level
//string enemyClass
class Enemy {
	constructor(dungeonName, level, enemyClass) {
		this.level = level
		this.class = enemyClass
		if (enemyClass === "tank") {
			this.health = 25 + (level * 50)
			this.maxHealth = 25 + (level * 50)
		} else {
			this.health = 25 + (level * 25)
			this.maxHealth = 25 + (level * 25)
		}
		const imagePath = `./images/dungeons/dungeon_assets/${dungeonName}/enemies/${enemyClass}.png`
		if (!fs.existsSync(imagePath)) {
			this.image = missingImage
		} else {
			this.image = imagePath
		}
	}

	damage(amount) {
		this.health = this.health - amount
		if (this.health < 1) {
			this.health = 0
			return this.health
		} else {
			return this.health
		}
	}

	heal(amount) {
		this.health = this.health + amount
		if (this.health > this.maxHealth) {
			this.health = this.maxHealth
			return this.health
		} else {
			return this.health
		}
	}

	attack(room) {
		switch(this.class) {
			case "basic":
				const playerToDamage = selectRandomPlayer(room.players)
				const attackAmount = 20+(this.level * 20)
				playerToDamage.damage(attackAmount)
				return `**${playerToDamage.name}** took **${attackAmount}** damage from basic enemy`
			break;

			case "distributor":
				const distributedAttackAmount = (20+(this.level * 20)) / room.players.length
				room.players.forEach((player) => {
					player.damage(distributedAttackAmount)
				})
				return `All players took **${distributedAttackAmount}** damage from distributor enemy`
			break;

			case "healer":
				const healAmount = (this.level * 10)
				room.enemies.forEach((enemy) => {
					enemy.heal(healAmount)
				})
				return `All enemies were healed **${healAmount}** damage from healer enemy`
			break;

			case "tank":
				const tankplayerToDamage = selectRandomPlayer(room.players)
				const tankattackAmount = 10+(this.level * 10)
				tankplayerToDamage.damage(tankattackAmount)
				return `**${tankplayerToDamage.name}** took **${tankattackAmount}** damage from tank enemy`
			break;
		}
	}
}


//@params
//string dungeonName
//num level
//num playerAmount
class Boss {

	constructor(dungeonName, level, playerAmount) {
		this.level = level
		this.class = "boss"
		this.health = (25 + (level * 50)) * playerAmount
		this.maxHealth = (25 + (level * 50)) * playerAmount

		const imagePath = `./images/dungeons/dungeon_assets/${dungeonName}/enemies/boss.png`
		if (!fs.existsSync(imagePath)) {
			this.image = missingImage
		} else {
			this.image = imagePath
		}
	}

	attack(room) {
		const attackToDo = getRandomInt(3) + 1

		switch(attackToDo) {
			case 1:
				const playerToDamage = selectRandomPlayer(room.players)
				const attackAmount = this.level * 30
				playerToDamage.damage(attackAmount)
				return `**${playerToDamage.name}** took **${attackAmount}** damage from the boss`
			break;

			case 2:
				const distributedAttackAmount = (this.level * 30) / room.players.length
				room.players.forEach((player) => {
					player.damage(distributedAttackAmount)
				})
				return `All players took **${distributedAttackAmount}** damage from the boss`
			break;

			case 3:
				const healAmount = (this.level * 10)
				this.heal(healAmount)
				return `The boss was healed for **${healAmount}** damage`
			break;
		}
	}

	damage(amount) {
		this.health = this.health - amount
		if (this.health < 1) {
			this.health = 0
			return this.health
		} else {
			return this.health
		}
	}

	heal(amount) {
		this.health = this.health + amount
	}
}

function selectRandomPlayer(players) {
	return players[getRandomInt(players.length)]
}

function checkForDeath(room) {
	if (room.enemies) {
		room.enemies.forEach((enemy, i) => {
			if (enemy.health < 1) {
				room.enemies.splice(i, 1)
			}
		})
		room.enemies.forEach((enemy, i) => {
			if (enemy.health < 1) {
				room.enemies.splice(i, 1)
			}
		})
		room.enemies.forEach((enemy, i) => {
			if (enemy.health < 1) {
				room.enemies.splice(i, 1)
			}
		})
	}

	room.players.forEach((player, i) => {
		if (player.health < 1) {
			room.players.splice(i, 1)
		}
	})

	if (room.players.length == 0) {
		return true
	} else {
		return null
	}
}

const lootTables = [
	{copper: 0, silver: 0, gold: 0}, //level 1 not completed
	{copper: 2, silver: 1, gold: 0}, //level 1 complete
	{copper: 3, silver: 1, gold: 0}, //level 2 complete
	{copper: 5, silver: 3, gold: 0}, //level 3 complete
	{copper: 7, silver: 5, gold: 1}, //level 4 complete
	{copper: 10, silver: 7, gold: 3} //level 5 complete
]

async function endGame(dungeon) {

	const roomsCompleted = dungeon.rooms.length
	const lootToGive = lootTables[roomsCompleted - 1]

	console.log(dungeon.allPlayers)

	dungeon.allPlayers.forEach(async (player) => {
		const idToGive = player.id
		
		await db.add(idToGive+'.inv.copper', (lootToGive.copper * dungeon.lootLevel))
		await db.add(idToGive+'.inv.silver', (lootToGive.silver * dungeon.lootLevel))
		await db.add(idToGive+'.inv.gold', (lootToGive.gold * dungeon.lootLevel))

		const xpToGive = (roomsCompleted * 10) * (Math.floor(dungeon.level / 5) + 1)
		const currentPlayerStats = await db.get(idToGive+'.dungeons')

		if (currentPlayerStats.xp + xpToGive >= currentPlayerStats.xpTillNextLevel) {
			await db.add(idToGive+'.dungeons.level', 1)
			await db.set(idToGive+'.dungeons.xp', 0)
			await db.set(idToGive+'.dungeons.xpTillNextLevel', 50 + ((currentPlayerStats.level + 1) * 50))
		} else {
			await db.add(idToGive+'.dungeons.xp', xpToGive)
		}
	})

	return await dungeonCanvas.lootRoomImage(dungeon, lootToGive)
}


module.exports = {
	Dungeon,
	checkForDeath,
	dungeonData,
	Player,
	endGame
}