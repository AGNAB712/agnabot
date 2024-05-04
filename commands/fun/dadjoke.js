const Discord = require('discord.js');
const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const fetch = require('node-fetch')

const dadEmbed = new EmbedBuilder()
.setColor('#235218')
.setTitle('~=< Dad Joke >=~')

const row = new ActionRowBuilder()

const yup = new ButtonBuilder()
      .setCustomId('dadgood')
      .setLabel('good joke')
      .setStyle(ButtonStyle.Success)
      .setEmoji('1153525610665214094');

const nope = new ButtonBuilder()
      .setCustomId('dadsucks')
      .setLabel('this sucks')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('1153460434691698719');

row.addComponents(yup, nope)

async function dadjoke(message, args, bot, client) {

const dadjokeResponse = await fetch("https://icanhazdadjoke.com/", {
  headers: { 'Accept': 'application/json' }
})
const dadjoke = await dadjokeResponse.json();

if (dadjoke.status !== 200) {
  return message.reply('**<:AgnabotX:1153460434691698719> ||** received non-success code from icanhazdadjoke')
}

dadEmbed.setDescription(`${dadjoke.joke}`)
dadEmbed.setFooter({ text: `joke id: ${dadjoke.id}` })

let jokeScore = await db.get(`jokes.${dadjoke.id}`) 
if (!jokeScore) {
  await db.set(`jokes.${dadjoke.id}`, { 
    score: 0,
    gooded: [],
    baded: [] 
  })
  jokeScore = 0;
}
message.reply({ content: `**<:AgnabotCheck:1153525610665214094> ||** joke score: ${jokeScore}`, embeds: [dadEmbed], components: [row] })


}

module.exports = dadjoke