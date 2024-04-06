




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

async function inventory(message, args, bot, client) {
  let outfit = await db.get(message.author.id+'.outfit')
  if (!outfit) {
  await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
  outfit = { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] }
  }

  let responseArray = []
  let outfitArray = Object.values(outfit)
for (let i = 1; i < 4; i++) {
  if (outfitFormats.hasOwnProperty(outfitArray[i-1][0])) {
    let textRarity
    if (outfitArray[i-1][1] == 0) {textRarity = '(none)'} else if (outfitArray[i-1][1] == 1) {textRarity = 'RARE'} else if (outfitArray[i-1][1] == 2) {textRarity = 'LEGENDARY'} else {textRarity = 'UBER'}
    responseArray[i-1] = `${i}. **` + outfitFormats[outfitArray[i-1][0]] + `** of rarity **${textRarity}**`
  } else {
    responseArray[i-1] = `${i}. ❔ || **UNKNOWN** (${outfitArray[i-1][0]})`
  }
}


  let meEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle(`~=-${message.author.username}'s outfit-=~`)
  .setDescription(`${responseArray[0]}\n${responseArray[1]}\n${responseArray[2]}`)

  message.reply({ embeds: [meEmbed] })}

module.exports = inventory
