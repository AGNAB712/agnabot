const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function impersonate(message, args, bot, client) {
let webhookCollection = await message.channel.fetchWebhooks();
if (webhookCollection.first()) {
    webhook = webhookCollection.first();
} else {
    webhook = await message.channel.createWebhook({
      name: 'AGNABOT',
      avatar: 'https://media.discordapp.net/attachments/831714424658198532/1130627602298699796/black_cat_night_Lol.png',
    });
}

let targetUser = message.mentions.users.first();
let targetUsername = null

if (args.length < 2 || !targetUser) {
  const isValidUser = await validUserId(args[0], message)
  if (isValidUser) {
  targetUser = isValidUser
  targetUsername = targetUser.nickname
  if (!targetUsername) {
  targetUsername = targetUser.user.username
  }
  } else {
  return message.reply('read the documentation :    )')
  }
}

if (!targetUsername) {
targetUsername = targetUser.username
}
const textContent = args.slice(1).join(' ');

const messageSent = await webhook.send({
  content: textContent,
  username: targetUsername,
  avatarURL: targetUser.displayAvatarURL({ format: 'png', dynamic: true }),
});

userId = message.author.id

client.channels.cache.get('1122152368591601754').send(await messageSent.id + ' ' + userId + ' ' + args.slice(1).join(' '))

try {
message.delete()
} catch (error) {
  console.error(error)
}}

module.exports = impersonate