const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function reveal(message, args, bot, client) {

        const repliedMessageID = message.reference?.messageId;
        const repliedMessageFull = await message.channel.messages.fetch(repliedMessageID);
    if (!message.reference) {
      return message.channel.send('<:AgnabotX:1153460434691698719> || reply to the message Broski');
    }

    const targetChannel = client.channels.cache.get('1122152368591601754');

    const targetMessages = await targetChannel.messages.fetch({ limit: 100 }); // Adjust the limit as per your requirements

    let matchingMessages = targetMessages.filter((msg) =>
      msg.content.includes(repliedMessageID)
    );

    if (matchingMessages.size === 0) {
      return message.channel.send('<:AgnabotX:1153460434691698719> || couldnt find that');
    }

    const matchingMessageIDs = matchingMessages.map((msg) => msg.content.trim().split(' '))

    const userName = client.users.cache.get(Array.from(matchingMessageIDs)[0][1]);


        const revealEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle(`-= REVEAL EMBED =-`)
      .setDescription(`${userName.username} sent "${repliedMessageFull.content}"`)
      .setImage(userName.displayAvatarURL({ format: 'png', dynamic: true }));

        message.channel.send({ embeds: [revealEmbed] });
}

module.exports = reveal