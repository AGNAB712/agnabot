const Discord = require('discord.js');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

let whitelistEmbed = new EmbedBuilder()
.setColor('#235218')
.setTitle('~=-Whitelist Request-=~')

async function whitelist(message, args, bot) {
  try {

    if (!args[0]) {return message.reply('**<:AgnabotX:1153460434691698719> ||** give me a username to whitelist')}

    const minecraftUsername = args[0]
    whitelistEmbed.setDescription(`minecraft username: ${minecraftUsername}\ndiscord user: ${message.author}`)

    const confirm = new ButtonBuilder()
      .setCustomId('confirmWhitelist')
      .setLabel('confirm')
      .setStyle(ButtonStyle.Success);
    const deny = new ButtonBuilder()
      .setCustomId('denyWhitelist')
      .setLabel('deny')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
    row.addComponents(confirm, deny);

    message.delete();
    message.channel.send({ embeds: [whitelistEmbed], components: [row] })
  } catch (e) {
    console.error(e)
    message.reply('**<:AgnabotX:1153460434691698719> ||** bot not on server')
  }
}

module.exports = whitelist
