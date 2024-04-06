const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, objectPage } = require('../../info/generalFunctions.js')
const { outfitFormats } = require('../../info/fishing.js')
const fishingJs = require('../../info/fishing.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const { buyArray, inventoryFormats, itemWorth } = require('../../info/buyMap.js')
const db = new QuickDB();

const cooldowns = new Map()

async function sell(message, args, bot, client) {

    let amountToSell = 1;
    const inventory = await db.get(message.author.id+'.inv')
    let inventoryArray = Object.keys(inventory)
    inventoryArray.forEach((key, i) => {
      if (inventory[key] == 0 || inventory[key] < 0 || key === undefined) {
        delete inventory[key];
        delete inventoryArray[inventoryArray.indexOf(key)];
      }
    }) 
    inventoryArray = inventoryArray.filter(n => n)
    console.log(inventoryArray)
    if (!inventory) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you have literally no shit you are poor as FUCK.')}


    if (isNaN(args[0])) {return message.reply('**<:AgnabotX:1153460434691698719> ||** thats not a Cool Number!')}
    const indexToSell = parseInt(args[0]) - 1
    if (!indexToSell && !indexToSell == 0) {return message.reply('**<:AgnabotX:1153460434691698719> ||** i cant sell nothing stupid')}
    if (indexToSell > (inventoryArray.length - 1)) {return message.reply('**<:AgnabotX:1153460434691698719> ||** Womp womp')}
    if (indexToSell + 1 <= 0 ) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you are stupid')}
    if (typeof inventory[inventoryArray[indexToSell]] === 'object') {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant sell artifacts')}

    if (args[1]) {
    if (args[1] === 'all') {amountToSell = parseInt(inventory[inventoryArray[indexToSell]])} else {

    if (isNaN(args[1])) {return message.reply('**<:AgnabotX:1153460434691698719> ||** not a number')}
    const amountToSellQuery = parseInt(args[1])
    if (amountToSellQuery > inventory[inventoryArray[indexToSell]]) {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant sell stuff you dont have')}
    if (amountToSellQuery <= 0) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you are stupid')}
    amountToSell = amountToSellQuery

    }
    }

    const confirm = new ButtonBuilder()
      .setCustomId('confirmSell')
      .setLabel('confirm')
      .setStyle(ButtonStyle.Success);
    const cancel = new ButtonBuilder()
      .setCustomId('cancelSell')
      .setLabel('cancel')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(confirm, cancel);

    const response = await message.reply({
        content: `are you sure you want to sell **${amountToSell}** ${inventoryArray[indexToSell]} for **${amountToSell * itemWorth[inventoryArray[indexToSell]]}** agnabucks?`,
        components: [row],
    });

const collectorFilter = i => message.author.id;

try {

  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId === 'confirmSell') {
    await db.add(message.author.id+'.a', amountToSell * itemWorth[inventoryArray[indexToSell]])
    await db.add(message.author.id+'.inv.'+inventoryArray[indexToSell], -1 * amountToSell)
    response.edit({    
    content: `**<:AgnabotCheck:1153525610665214094> ||** your balance is now ${await db.get(message.author.id+'.a')}`,
    components: [],
  })
  } else {
    response.edit({    
    content: `**<:AgnabotX:1153460434691698719> ||** okey doke`,
    components: [],
  })
  }

} catch (e) {
  response.edit({ 
    content: `**<:AgnabotX:1153460434691698719> ||** timed out`,
    components: [],
  })
}

  }

module.exports = sell
