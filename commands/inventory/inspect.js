



//DEPRECATED COMMAND






const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, objectPage } = require('../../info/generalFunctions.js')
const { outfitFormats } = require('../../info/fishing.js')
const fishingJs = require('../../info/fishing.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const { buyArray, inventoryFormats, itemWorth } = require('../../info/buyMap.js')
const db = new QuickDB();

const cooldowns = new Map()

async function inspect(message, args, bot, client) {
const index = args[0]
if (!index) {return message.reply(`<:AgnabotX:1153460434691698719> || gimme an index`)}
if (isNaN(index)) {return message.reply(`<:AgnabotX:1153460434691698719> || gotta be a number bro`)}
const me = await db.get(message.author.id)
if (!me.inv) {return message.reply(`<:AgnabotX:1153460434691698719> || you dont have an inventory`)}
let inv = me.inv
for (const property in inv) {
  if (inv[property] == 0 || inv[property] < 0) {delete inv[property]}
  if (property == 'undefined') {delete inv[property]}
}
const inventoryArray = Object.keys(inv)
const artifactName = inventoryArray[index - 1]
if (typeof me.inv[artifactName] !== `object`) {return message.reply(`<:AgnabotX:1153460434691698719> || not an artifact`)}
const artifactObject = fishingJs.artifacts[artifactName]

const inspectEmbed = new EmbedBuilder()
.setTitle(`-=~artifact ${artifactName}~=-`)
.setDescription(`*${artifactObject.description}*

${artifactObject.text}`)
.setColor(`#235218`)
message.reply({ embeds: [inspectEmbed] })
}

module.exports = inspect
