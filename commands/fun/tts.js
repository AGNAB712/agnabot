const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { AgnabotItem, incrementItem, decrementItem, hasItem } = require('../../info/itemclass.js')
const { listOfItems } = require('../../info/buyMap.js')

const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function tts(message, args, bot, client) {

  const passes = hasItem(message.author.id, listOfItems['ttspass']);
  const text = args.join(' ')

  if (!passes || passes === 0) {
  return message.reply('<:AgnabotX:1153460434691698719> || dont got no PASSES!')
  }
  if (!text) {
    return message.reply('<:AgnabotX:1153460434691698719> || cant say nothing dude')
  }

  await message.channel.send({content: `${text}`, tts: true});
  decrementItem(message.author.id, listOfItems['ttspass'], 1)

}

module.exports = tts