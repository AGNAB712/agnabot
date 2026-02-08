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
const { AgnabotItem, incrementItem, decrementItem } = require('../../info/itemclass.js')
const db = new QuickDB();

const cooldowns = new Map()

async function sell(message, args, bot, client) {

    let amountToSell = 1;
    const inventory = await db.get(message.author.id+'.inv')
    for (i = 0; i < inventory.length; i++) {
      if (inventory[i].quantity <= 0) {delete inventory[i]}
    }
    console.log(inventory)
    if (inventory.length == 0) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you have literally no shit you are poor as FUCK.')}


    if (isNaN(args[0])) {return message.reply('**<:AgnabotX:1153460434691698719> ||** thats not a Cool Number!')}
    const indexToSell = Math.round(parseInt(args[0]) - 1)
    if (!indexToSell && !indexToSell == 0) {return message.reply('**<:AgnabotX:1153460434691698719> ||** i cant sell nothing stupid')}
    if (indexToSell > (inventory.length - 1)) {return message.reply('**<:AgnabotX:1153460434691698719> ||** Womp womp')}
    if (indexToSell + 1 <= 0 ) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you are stupid')}

    if (args[1]) {
      if (args[1] === 'all') {amountToSell = inventory[indexToSell].quantity} else {

      if (isNaN(args[1])) {return message.reply('**<:AgnabotX:1153460434691698719> ||** not a number')}
      const amountToSellQuery = parseInt(args[1])
      if (amountToSellQuery > inventory[inventory[indexToSell]]) {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant sell stuff you dont have')}
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
        content: `are you sure you want to sell **${amountToSell}** ${inventory[indexToSell].shopLabel} for **${amountToSell * inventory[indexToSell].value}** agnabucks?`,
        components: [row],
    });

const collectorFilter = i => message.author.id;

try {

  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId === 'confirmSell') {

    await db.add(message.author.id+'.a', amountToSell * inventory[indexToSell].value)
    await decrementItem(message.author.id, inventory[indexToSell], amountToSell)
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
  console.error(e)
}

  }

module.exports = sell
