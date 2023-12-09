const Discord = require('discord.js');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function mc(message, args, bot) {
  try {

    const playersOnline = Object.keys(bot.players)
    let playerText = `${playersOnline.length - 1} players:`
    playersOnline.forEach((name, i) => {
    if (name == 'AGNABOT') return
    playerText = `${playerText}\n${i}. ${name}`
  })
    playerText += '\n'

    const serverEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('>=- Minecraft server -=<')
  .setDescription(`
    ===--- Online Players ---===
    ${playerText}===---                ---===
    `)
    message.channel.send({ embeds: [serverEmbed] });

  } catch (e) {
    console.error(e)
    message.reply('**<:AgnabotX:1153460434691698719> ||** bot not on server')
  }
}

module.exports = mc
