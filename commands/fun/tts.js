const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function tts(message, args, bot, client) {

  const passes = await db.get(message.author.id+'.inv.ttspasses');
  const text = args.join(' ')

  if (!passes || passes === 0) {
  return message.reply('<:AgnabotX:1153460434691698719> || dont got no PASSES!')
  }
  if (!text) {
    return message.reply('<:AgnabotX:1153460434691698719> || cant say nothing dude')
  }

  await message.channel.send({content: `${text}`, tts: true});
  await db.set(message.author.id+'.inv.ttspasses', passes - 1);

}

module.exports = tts