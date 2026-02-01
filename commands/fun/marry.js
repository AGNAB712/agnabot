const Discord = require('discord.js');
const { ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebHookClient, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const { marriageImage } = require('../../info/canvasFunctions.js')
const db = new QuickDB();

async function marry(message, args, bot, client) {

  const me = await db.get(message.author.id)
  const proposalRecipient = message.mentions.users.first()
  if (!proposalRecipient) {return message.reply(`<:AgnabotX:1153460434691698719> || can't marry nobody bro Smh`)}
  if (!(me.inv.rings > 0)) {return message.reply(`<:AgnabotX:1153460434691698719> || you dont have any wedding rings`)}
  const them = await db.get(proposalRecipient.id)
  if (them.married || me.married) {return message.reply(`<:AgnabotX:1153460434691698719> || one of yall is already married`)}
  if (proposalRecipient.bot) {return message.reply(`<:AgnabotX:1153460434691698719> || what`)}
  if (proposalRecipient.id == message.author.id) {return message.reply(`<:AgnabotX:1153460434691698719> || sorry no sologamy`)}

    const accept = new ButtonBuilder()
      .setCustomId('acceptProposal')
      .setLabel('Accept')
      .setStyle(ButtonStyle.Success)
      .setEmoji('<:AgnabotCheck:1153525610665214094>')

    const cancel = new ButtonBuilder()
      .setCustomId('cancelProposal')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('<:AgnabotX:1153460434691698719>')

    const row = new ActionRowBuilder()
      .addComponents(accept, cancel);

    const attachment = await marriageImage(message.author, proposalRecipient, "propose")

    let marryEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>-= MARRIAGE PROPOSAL =-<')
      .setDescription(`>-= **${message.author.username}** wants to marry **${proposalRecipient.username}**! =-<`)
      .setImage('attachment://marriage.png')

    const response = await message.reply({
        embeds: [marryEmbed],
        files: [attachment],
        components: [row],
    });

    const collectorFilter = i => i.user.id == proposalRecipient.id;

try {

  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId == 'acceptProposal') {
  
  const attachment2 = await marriageImage(message.author, proposalRecipient, "confirm")
  marryEmbed.setDescription(`>-= Congrats **${message.author.username}**! **${proposalRecipient.username}** accepted your proposal! =-<`)

  collected.update({ 
    embeds: [marryEmbed],
    components: [],
    files: [attachment2],
  })

  await db.sub(message.author.id+'.inv.rings', 1)
  await db.set(message.author.id+'.married', proposalRecipient.id)
  await db.set(proposalRecipient.id+'.married', message.author.id)
  
  }
  if (collected.customId == 'cancelProposal') {

  const attachment2 = await marriageImage(message.author, proposalRecipient, "deny")
  marryEmbed.setDescription(`>-= Sorry **${message.author.username}**, but **${proposalRecipient.username}** denied your proposal. =-<`).setColor('Red')

  collected.update({ 
    embeds: [marryEmbed],
    components: [],
    files: [attachment2],
  })}
  } catch (e) {
    console.log(e)
  }
}

module.exports = marry