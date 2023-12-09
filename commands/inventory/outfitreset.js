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

async function outfitreset(message, args, bot, client) {
  await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** just reset your outfit :   )')
}

module.exports = outfitreset
