const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const db = new QuickDB();
const { petImage } = require('../../info/canvasFunctions.js')
const { hasArtifact, isvalidhexcode } = require('../../info/generalFunctions.js')

async function pet(message, args, bot, client) {
try {
  const myPet = await db.get(`${message.author.id}.pet`)
  const command2 = args[0]
  const curbal = await db.get(message.author.id+'.a')
  const caretaker = await hasArtifact(message.author.id, 'auraofthecaretaker')
  const shift = args.shift()

  //console.log(myPet)

  if (command2 === 'buy') {
    return message.reply('**<:AgnabotX:1153460434691698719> ||** deprecated command, use the shop instead')
  }
  if (!myPet || myPet === 'null') {return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have a pet')}

  switch (command2) {

case 'disown':
  await db.set(`${message.author.id}.pet`, 'null')
  message.channel.send('**<:AgnabotCheck:1153525610665214094> ||** ok goodbye :         (')
break;

case 'image':
  saveUrl = message.attachments.first().proxyURL
  await db.set(message.author.id+'.pet.image', saveUrl)
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** ok i did it :    )')
break;

case 'name':
  const newName = args.join(' ')
  if (!newName) {return message.reply('**<:AgnabotX:1153460434691698719> ||** come on give me a name')}
  if (newName.length >= 25) {return message.reply('**<:AgnabotX:1153460434691698719> ||** shorter name please :       )')}
  await db.set(message.author.id+'.pet.name', newName)
  
  message.reply(`**<:AgnabotCheck:1153525610665214094> ||** your pets new name is ${newName}`)
break;

case 'background':
    saveUrl = message.attachments.first().proxyURL
    await db.set(message.author.id+'.pet.background', saveUrl)
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** ok i did it :    )')
break;

case 'color':
  if (!caretaker) {return}
  const hex = args[0]
  if (!hex) {return message.reply('**<:AgnabotX:1153460434691698719> ||** come on give me a hex')}
  if (!isvalidhexcode(hex)) {return message.reply('**<:AgnabotX:1153460434691698719> ||** not a valid hex code')}
  await db.set(message.author.id+'.pet.hex', hex)
  
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** ok i did it :    )')
break;

case 'subtitle':
  if (!caretaker) {return}
  const subtitle = args.join(' ')
  if (!subtitle) {return message.reply('**<:AgnabotX:1153460434691698719> ||** come on give me a subtitle')}
  if (subtitle.length >= 25) {return message.reply('**<:AgnabotX:1153460434691698719> ||** shorter subtitle please :       )')}
  await db.set(message.author.id+'.pet.subtitle', subtitle)
  
  message.reply(`**<:AgnabotCheck:1153525610665214094> ||** your pets new subtitle is ${subtitle}`)
break;

default:
let row = new ActionRowBuilder()
  if (myPet.health + myPet.affection + myPet.hunger !== 0) {

const feed = new ButtonBuilder()
      .setCustomId('feed')
      .setLabel('Feed (10 agnabucks)')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1180752541097668708');

const play = new ButtonBuilder()
      .setCustomId('play')
      .setLabel('Play (Free)')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1180752541097668708');

const heal = new ButtonBuilder()
      .setCustomId('heal')
      .setLabel('Give medicine (50 agnabucks)')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1180752541097668708');

row.addComponents(feed, play, heal);
} else {
  const revive = new ButtonBuilder()
      .setCustomId('revive')
      .setLabel('Revive your pet. You monster. (1,000 AGNABUCKS)')
      .setStyle(ButtonStyle.Danger);

row.addComponents(revive);
}

  const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** Loading...')
  const attachment = await petImage(myPet, message.author.id)
  loadingMessage.delete()
  if (attachment === 'image') {return message.reply('**<:AgnabotX:1153460434691698719> ||** you need to set an image for the pet first (a.pet image)')}
  if (attachment === 'name') {return message.reply('**<:AgnabotX:1153460434691698719> ||** you need to set an name for the pet first (a.pet name)')}
  const response = await message.reply({ content: `<:AgnabotPet:1180752541097668708> **||** ${message.author.username}'s pet`, files: [attachment], components: [row] })

break;
}
} catch (e) {
  const errorEmbed = new EmbedBuilder()
    .setColor('#235218')
    .setTitle('~-= ERROR OCCURED =-~')
    .setDescription(`${new Date().toISOString()} - Uncaught Exception: ${e.message}\n${e.stack}`);

  return message.reply({ content: '**<:AgnabotError:1179991823352090644> || error occured**', embeds: [errorEmbed] })
}
}

module.exports = pet