const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function say(message, args, bot, client) {
if (message.reference) {
      const repliedMessage = message.reference;
      const repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);
      if (repliedMessage) {
      repliedMessageFull.reply(args.join(' '));
    }
    } else {
      const messageSent = await message.channel.send(args.join(' '))
      userId = message.author.id
      client.channels.cache.get('1122152368591601754').send(await messageSent.id + ' ' + userId + ' ' + args.join(' '))
    }
    message.delete()
}

module.exports = say