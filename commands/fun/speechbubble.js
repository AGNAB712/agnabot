const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function speechbubble(message, args, bot, client) {

    const channel = client.channels.cache.get('1085289780901842996');
    const messages = await channel.messages.fetch();
    const attachments = messages.filter((msg) => msg.attachments.size > 0 || msg.content.includes('https'));
    if (attachments.size === 0) {
      return console.log('No attachments found in the channel.');
    }

    const randomMessage = attachments.random();

    let repliedMessageFull = null;

    if (message.reference) {
    const repliedMessage = message.reference;
    repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);
    }

    message.delete()

    const words = randomMessage.content.split(' ');
    
    if (randomMessage.content.includes('https')) {

      if (!repliedMessageFull) {
      message.channel.send(words[0]);
    } else {
      repliedMessageFull.reply(words[0]);
    }

      if (words[1]) {

      message.channel.send(`(this speechbubble is property of ${words[1]})`)

    }

    } else {

      if (!repliedMessageFull) {
      message.channel.send(randomMessage.attachments.first().url);
    } else {
      repliedMessageFull.reply(randomMessage.attachments.first().url); 
    }

    }

}

module.exports = speechbubble