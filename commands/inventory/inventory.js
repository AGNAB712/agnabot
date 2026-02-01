const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, objectPage } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const cooldowns = new Map()

async function inventory(message, args, bot, client) {
  const me = await db.get(message.author.id)
  if (!me.inv) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have an inventory')}
  const myCoolEmbed = objectPage(me.inv, 0)
  //const myCoolEmbed = objectPage(funnyObject, 0)

  const nextButton = new ButtonBuilder()
    .setCustomId('next')
    .setEmoji('➡')
    .setStyle(ButtonStyle.Success)

  if (Math.floor(Object.keys(me.inv).length / 3) === 0 || Object.keys(me.inv).length === 3) {
    nextButton.setDisabled(true)
  }

  const backButton = new ButtonBuilder()
    .setCustomId('back')
    .setEmoji('⬅️')
    .setStyle(ButtonStyle.Success)
    .setDisabled(true)

  const row = new ActionRowBuilder()
    .addComponents(backButton, nextButton);

  message.reply({ embeds: [myCoolEmbed], components: [row] })
}

module.exports = inventory
