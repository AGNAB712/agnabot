const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, objectPage, percentify } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const { statEmbed } = require('../../info/embeds.js')
const { fishingArray, fishingLootMap, artifacts, outfitFormats } = require('../../info/fishing.js')
const db = new QuickDB();

const cooldowns = new Map()

async function stats(message, args, bot, client) {
let hasBonus = '❌ \n*(get this with agnab premium, adds a +25% bonus to a.work)*'
if (message.member.roles.cache.some(role => role.name === 'AGNAB Premium')) {
hasBonus = '✅'
}
let hasChance = '❌ \n*(get this with rigged slot machine, increases a.don chance to 60%)*'
if (await db.get(message.author.id+'.slotMachine')) {
hasChance = '✅'
}
let isMarried = '❌ \n*(use a.marry after you buy a ring from the shop)*'
if (await db.get(message.author.id+'.married')) {
isMarried = `✅ (married to ${client.users.fetch(await db.get(message.author.id+'.married')).username})`
}

let petText = 'you dont have a pet'
const myPet = await db.get(message.author.id+'.pet')
if (myPet && myPet !== 'null') {
var now = new Date();
petText = 
`**Pet Hunger:** \`${myPet.hunger}\`
**Pet Affection:** \`${myPet.affection}\`
**Pet Health:** \`${myPet.health}\`

*next pet payout in ${60 - now.getMinutes()} minutes*
`
}

let minecraftText = 'Linked account: ❌ \n(use a.verify to link your minecraft account)'
const minecraftUser = await db.get(message.author.id+'.mc')
if (minecraftUser) {
minecraftText = 
`
Linked account: ✅
Minecraft username: ${minecraftUser}
Player head:
`
const mcUserId = await fetch(`https://api.mojang.com/users/profiles/minecraft/${minecraftUser}`)
.then(data => data.json())
.then(player => player.id)
statEmbed.setImage(`https://minotar.net/helm/${mcUserId}.png`)
}

let fishingText = '**Has fishing rod: ❌** \n*(buy a fishing rod from the shop)*'
const fishingExists = await db.get(message.author.id+'.fish')
if (fishingExists) {

const me = await db.get(message.author.id)
let fishingLevelRounded = Math.floor(me.fish.level / 5)
if (fishingLevelRounded > fishingArray.length) {
  fishingLevelRounded = fishingArray.length
}
let myFishingArray = fishingArray[fishingLevelRounded]
if (!myFishingArray) {myFishingArray = fishingArray[fishingArray.length - 1]}
const percents = percentify(myFishingArray)

fishingText = 
`
**Has fishing rod**: ✅
**Fishing level**: \`${fishingExists.level}\`
**Fishing EXP**: \`${fishingExists.exp}\`
**EXP until next level**: \`${fishingExists.expLevel}\`

*With current loadout and level, here are your chances of getting each item*
**Trash: ${Math.round(percents[0])}** *(${myFishingArray[0]} points)*
**Common: ${Math.round(percents[1])}** *(${myFishingArray[1]} points)*
**Rare: ${Math.round(percents[2])}** *(${myFishingArray[2]} points)*
**Legendary: ${Math.round(percents[3])}** *(${myFishingArray[3]} points)*
**ARTIFACT: ${Math.round(percents[4])}** *(${myFishingArray[4]} points)*
`
}

statEmbed.setDescription(`
**AGNABUCKS:** ${await db.get(message.author.id+'.a')}
*~------------------------------SHOP-ITEMS-----------------------------------~*
**Children:** ${await db.get('children_' + message.author.id)} 
*(${await db.get('children_' + message.author.id)} agnabucks every 5 minutes)*
**Premium bonus:** ${hasBonus}
**Rigged slot machine bonus:** ${hasChance}
**Is married:** ${isMarried}
*~---------------------------------PET-----------------------------------------~*
${petText}
*~----------------------------FISHING-----------------------------------~*
${fishingText}
*~----------------------------MINECRAFT-----------------------------------~*
${minecraftText}

`)

message.reply({ embeds: [statEmbed], content: 'this will "soon" be replaced with a website, so sorry for any bugs/innacuracies at the moment' })
}

module.exports = stats
