const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

let inBan = false;

async function ban(message, args, bot, client) {

if (inBan) {return}

const targetUser = message.mentions.members.first();

if (!targetUser) {
  return message.channel.send('**<:AgnabotX:1153460434691698719> ||** gimme a guy come on');
}

if (targetUser.user.id === '765581160755363840') {
  return message.reply('**<:AgnabotX:1153460434691698719> ||** LOL you Canot ban the owner');
}

if (targetUser.user.id === '1107764918293372989') {
  return message.reply('**<:AgnabotX:1153460434691698719> ||** you are Stupid');
}

const banMessage = await message.channel.send(`*attempting to ban ${targetUser.user.username.toLowerCase()}*`)

    // Creating a countdown from 5 to 1
    let countdown = 10;
    inBan = true;
    const countdownInterval = setInterval( async () => {
      if (countdown > 0) {
        if (countdown > 3) {
        banMessage.edit(`USER ${targetUser.user.username.toUpperCase()} WILL BE BANNED IN ${countdown}...`);
      } else {
        banMessage.edit(`**USER ${targetUser.user.username.toUpperCase()} WILL BE BANNED IN ${countdown}...**`);
      }
        countdown--;
      } else {
        clearInterval(countdownInterval);
        message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** *USER ${targetUser.user.username.toUpperCase()} HAS BEEN BANNED.*`);
        banMessage.delete();
        inBan = false;
      }
    }, 1000);
}

module.exports = ban