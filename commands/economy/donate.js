const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function donate(message, args, bot, client) {

  const curbal = await db.get(message.author.id+'.a');
  const targetUser = message.mentions.users.first();

  if (!targetUser) {
  	message.reply('**<:AgnabotX:1153460434691698719> ||** cant donate to nobody bro')
  }

  const userId = targetUser.id;
  const otherGuy = await db.get(userId+'.a');

  if (!args[1] || !isNumeric(args[1]) || args[1] < 1 || userId === message.author.id) {
    return message.channel.send('**<:AgnabotX:1153460434691698719> ||** come on bro...... cant do that')
  }

  if (curbal < parseInt(args[1])) {
  	message.channel.send('stop being Poor');
  }

    await db.sub(message.author.id+'.a', parseInt(args[1]));
    await db.add(userId+'.a', parseInt(args[1]));

    let embed = new EmbedBuilder()
        .setColor('#235218')
        .setTitle('>---=**DONATION**=---<')
        .setDescription(`**<:AgnabotCheck:1153525610665214094> ||** donated ${args[1]} to ${targetUser.username}`)
        .setFooter({ text: `your money is now ${await db.get(message.author.id+'.a')}` })

	message.channel.send({ embeds: [embed] });

}

module.exports = donate