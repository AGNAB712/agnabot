const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, objectPage, fishingLoot } = require('../../info/generalFunctions.js')
const { fishingImage } = require('../../info/canvasFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const isFishing = new Map()

let fishingEmbed = new EmbedBuilder()
.setTitle('Fishing...')
.setImage('attachment://fishing.png')
.setColor('#235218')

async function fish(message, args, bot, client) {
 if (isFishing.has(message.author.id)) {return message.reply(`**<:AgnabotX:1153460434691698719> ||** youre already fishing bro`)}
  const me = await db.get(message.author.id)
  if (me.fish == null) {
  message.reply('**<:AgnabotX:1153460434691698719> ||** you cant FISH!!! (buy a fishing rod from the shop)')
  return
  }
  isFishing.set(message.author.id, true)

  fishingEmbed.setTitle('Fishing...')
  fishingEmbed.setFooter({ text: `level ${me.fish.level} | ${me.fish.exp} exp | ${me.fish.expLevel - me.fish.exp} exp until next level` })
  let fishButton = new ButtonBuilder()
      .setCustomId('fish')
      .setLabel('Fish')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1181067287889977425')
      .setDisabled(true);

const row = new ActionRowBuilder()
      .addComponents(fishButton);

  const randomTime = (getRandomInt(5) * 1000)

  const attachment = await fishingImage(message.author, 1)
  const attachment2 = await fishingImage(message.author, 2)
  const response = await message.reply({ embeds: [fishingEmbed], files: [attachment], components: [row] })

  const collectorFilter = i => i.user.id === response.mentions.users.first().id

  await setTimeout(async () => {


  fishButton.setDisabled(false);
  fishingEmbed.setTitle('You caught something!')
  fishingEmbed.setFooter({ text: `level ${me.fish.level} | ${me.fish.exp} exp | ${me.fish.expLevel - me.fish.exp} exp until next level` })
  await response.edit({ files: [attachment2], embeds: [fishingEmbed], components: [row] })

try {
  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 3000 });
  //response.delete();
  await fishingLoot(message, collected, fishingEmbed);
  isFishing.delete(message.author.id)



} catch (e) {
console.log(e)
await response.edit({ content: '**<:AgnabotX:1153460434691698719> ||** you did not fish in time', embeds: [], files: [], components: [] })

isFishing.delete(message.author.id)
}

  }, randomTime + 5000)
}

module.exports = fish
