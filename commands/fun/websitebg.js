const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function websitebg(message, args, bot, client) {

if (args[0] === 'reset') {
  await db.set(message.author.id+'.websiteData.image', 'null')
  return message.reply('**<:AgnabotCheck:1153525610665214094> ||** you are so Reseto')
  }

  const imageRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;

  if (!args[0]) { args[0] = 'My ballsack' }
  let saveUrl

  if (!args[0].match(imageRegex)) {
    try {
    saveUrl = message.attachments.first().proxyURL
  } catch (error) {
    return message.reply('**<:AgnabotX:1153460434691698719> ||** you need a valid image link or image')
  }
  } else {
    saveUrl = args[0]
  }

  await db.set(message.author.id+'.websiteData.image', saveUrl)
  
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** ok i did it :    )\nit may take a while for the website to update because it has to Save and then get Loaded by the website so')

}

module.exports = websitebg