



//DEPRECATED COMMAND




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

async function trade(message, args, bot, client) {


  if (!message.mentions.users.first()) {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant trade with nobody bro')}
  const myInv = await db.get(message.author.id+'.inv')
  const theirInv = await db.get(message.mentions.users.first().id+'.inv')
  if (!myInv || !theirInv) {return message.reply('**<:AgnabotX:1153460434691698719> ||** one of you doesnt have an inventory')}
  if (message.mentions.users.first().id == message.author.id) {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant trade with yourself')}
  let myTrade = await tradePage(message.author.id, message, message.author.username);

  if (myTrade == 'cancel') {return message.channel.send('**<:AgnabotX:1153460434691698719> ||** ok goobai :3')}

  let amount = [1, 1]

  if (typeof myTrade === 'string') {

  if (typeof myInv[myTrade] == 'object') {
    let rarityNum = 0
    if (myInv[myTrade].rarity == 'uber') {rarityNum = 3} else if (myInv[myTrade].rarity == 'legendary') {rarityNum = 2} else {rarityNum = 1}
    myTrade = [myTrade, rarityNum]
  } else {

  const awaitMessage = await message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** how many ${myTrade}?`)
  const msg_filter = (m) => m.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });

  let itemMax
  if (myTrade == 'agnabucks') { itemMax = await db.get(message.author.id+'.a') } else { itemMax = myInv[myTrade] }

  amount[0] = parseInt(collected.first().content)
  if (isNaN(amount[0])) {

    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** gotta be a number')}
  if (amount[0] > itemMax) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have enough of that')}
  if (amount[1] <= 0) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** lol')}
  }
}
  
  let theirTrade = await tradePage(message.mentions.users.first().id, message, message.mentions.users.first().username)

  if (theirTrade == 'cancel') {return message.channel.send('**<:AgnabotX:1153460434691698719> ||** ok goobai :3')}

  if (typeof theirTrade === 'string') {

  if (typeof theirInv[theirTrade] == 'object') {
    let rarityNum = 0
    if (theirInv[theirTrade].rarity == 'uber') {rarityNum = 3} else if (theirInv[theirTrade].rarity == 'legendary') {rarityNum = 2} else {rarityNum = 1}
    theirTrade = [theirTrade, rarityNum]
  } else {

  const awaitMessage = await message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** how many ${theirTrade}?`)
  const msg_filter = (m) => m.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });

  if (theirTrade == 'agnabucks') { itemMax = await db.get(message.mentions.users.first().id+'.a') } else { itemMax = theirInv[theirTrade] }

  amount[1] = parseInt(collected.first().content)
  if (isNaN(amount[1])) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** gotta be a number')}
  if (amount[1] > itemMax) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have enough of that')}
  if (amount[1] <= 0) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** lol')}
  }

  }


  let mySellText
  if (typeof myTrade == 'string') {
    mySellText = `**${amount[0]} ${myTrade}**`
  } else {
    let rarityText
    if (myTrade[1] == 1) {rarityText = 'RARE'} else if (myTrade[1] == 2) {rarityText = 'LEGENDARY'} else {rarityText = 'UBER'}
    mySellText = `**${myTrade[0]}** artifact of rarity **${rarityText}**`
  }

  let theirSellText
  if (typeof theirTrade == 'string') {
    theirSellText = `**${amount[1]} ${theirTrade}**`
  } else {
    let rarityText
    if (theirTrade[1] == 1) {rarityText = 'RARE'} else if (theirTrade[1] == 2) {rarityText = 'LEGENDARY'} else {rarityText = 'UBER'}
    theirSellText = `**${theirTrade[0]}** artifact of rarity **${rarityText}**`
  }

  const tradeEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('-=~ Trade offer ~=-')
  .setImage('https://media.discordapp.net/attachments/1141115132399849603/1173077239584280586/zKC0fTR.png?ex=6562a450&is=65502f50&hm=e136f904b020946086373a623079b7e3cce3264d02354f587eaf3c32cff25bf4&=&width=306&height=431')
  .setDescription(`-**${message.author.username}** offers **${message.mentions.users.first().username}** a deal-
  ${mySellText} 
  -FOR-
  ${theirSellText}`)

  const confirm = new ButtonBuilder()
      .setCustomId('confirmTrade')
      .setLabel('Agree')
      .setStyle(ButtonStyle.Success);
  const deny = new ButtonBuilder()
      .setCustomId('denyTrade')
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
  row.addComponents(confirm, deny);

  const tradeMessage = await message.channel.send({ components: [row], embeds: [tradeEmbed] })

  const collectorFilter = i => {
  return i.user.id === message.mentions.users.first().id
  };

  try {
  const collected = await tradeMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId === 'confirmTrade') {
    tradeEmbed.setColor('Green').setDescription(`-=**${message.mentions.users.first().username}** ACCEPTED THE DEAL=-`)
    collected.update({ embeds: [tradeEmbed], components: [] })


    if (typeof myTrade == 'object') {
      await db.sub(`${message.author.id}.inv.${myTrade[0]}.count`, 1)
      let rarityText
      if (myTrade[1] === 1) {rarityText = 'rare'} else if (myTrade[1] === 2) {rarityText = 'legendary'} else {rarityText = 'uber'}
      await db.pull(`${message.author.id}.inv.${myTrade[0]}.rarity`, rarityText)

      await db.add(`${message.mentions.users.first().id}.inv.${myTrade[0]}.count`, 1)
      await db.push(`${message.mentions.users.first().id}.inv.${myTrade[0]}.rarity`, rarityText)
    } else {
      if (myTrade == 'agnabucks') {
        await db.sub(`${message.author.id}.a`, amount[0])
        await db.add(`${message.mentions.users.first().id}.a`, amount[0])
      } else {
        await db.sub(`${message.author.id}.inv.${myTrade}`, amount[0])
        await db.add(`${message.mentions.users.first().id}.inv.${myTrade}`, amount[0]) 
      }
    }

    if (typeof theirTrade == 'object') {
      await db.add(`${message.author.id}.inv.${theirTrade[0]}.count`, 1)
      let rarityText
      if (theirTrade[1] == 1) {rarityText = 'rare'} else if (theirTrade[1] == 2) {rarityText = 'legendary'} else {rarityText = 'uber'}
      await db.push(`${message.author.id}.inv.${theirTrade[0]}.rarity`, rarityText)

      await db.sub(`${message.mentions.users.first().id}.inv.${theirTrade[0]}.count`, 1)
      await db.pull(`${message.mentions.users.first().id}.inv.${theirTrade[0]}.rarity`, rarityText)
    } else {
      if (theirTrade == 'agnabucks') {
        await db.add(`${message.author.id}.a`, amount[1])
        await db.sub(`${message.mentions.users.first().id}.a`, amount[1])
      } else {
        await db.add(`${message.author.id}.inv.${theirTrade}`, amount[1])
        await db.sub(`${message.mentions.users.first().id}.inv.${theirTrade}`, amount[1]) 
      }
    }

  }
  if (collected.customId === 'denyTrade') {
    tradeEmbed.setColor('Red').setDescription(`-=**${message.mentions.users.first().username}** REJECTED THE DEAL=-`)
    collected.update({ embeds: [tradeEmbed], components: [] })
  return
  }
} catch (e) {
  tradeMessage.edit({ content: 'they took too long Lol', components: [], embeds: [] })
}


}

async function tradePage(id, message, username) {
  const inv = await db.get(id+'.inv')
  const invArray = Object.keys(inv)
  let outfit = await db.get(id+'.outfit')
    if (!outfit) {
      await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
      outfit = { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] }
    }
  let artifacts = {}; 

    //filter to be only artifacts
    invArray.forEach((key, i) => {

      const myObject = inv[key];

      if (myObject <= 0 || myObject?.count <= 0) {return}

      if (outfit.slot1[0] == key) {return}
      if (outfit.slot2[0] == key) {return}
      if (outfit.slot3[0] == key) {return}

      if (typeof myObject !== 'object') {
        artifacts[key] = inv[key]
        return
      }

      if (myObject.count > 1) {
        for (let i = 0; i < myObject.count; i++) {
          let numberRarity = 0
          if (inv[key].rarity[i] == 'uber') {numberRarity = 3} else if (inv[key].rarity[i] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
          artifacts[key + ` #${(i + 1)}`] = inv[key].rarity[i]
        }
      } else {

        let numberRarity = 0
        if (inv[key].rarity[0] == 'uber') {numberRarity = 3} else if (inv[key].rarity[0] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
        artifacts[key] = inv[key].rarity[0]}

    })    

    const artifactArray = Object.keys(artifacts)

    let select = new StringSelectMenuBuilder()
      .setCustomId('equip')
      .setPlaceholder(`${username}'s inventory`)
      .addOptions(
      new StringSelectMenuOptionBuilder()
      .setLabel(`Cancel`)
      .setValue(`cancel`)
      .setEmoji('<:AgnabotX:1153460434691698719>'),
      new StringSelectMenuOptionBuilder()
      .setLabel(`AGNABUCKS`)
      .setValue(`agnabucks`)
      .setDescription(`you currently have ${await db.get(id+'.a')} agnabucks`)
      .setEmoji('💰')
    )

    //console.log(fishingJs.artifacts)

    artifactArray.forEach((name, i) => {

      let artifactDescription
      let artifactEmoji
      const regex = /#(\d+)$/; // regex to match " #(number)" at the end of the string
      const match = name.match(regex);
      if (match) {
        const number = match[1];
        artifactDescription = fishingJs.artifacts[name.slice(0, -1*(number.length+1)).trim()].description //gets the artifact name without the #(number)
        artifactEmoji = inventoryFormats[name.slice(0, -1*(number.length+1)).trim()].split(' ')[0]
      } else {
        if (typeof inv[name] !== 'object') {
        artifactDescription = `${username} has ${inv[name]} of these`
        artifactEmoji = inventoryFormats[name].split(' ')[0]
        } else {
        artifactDescription = fishingJs.artifacts[name].description
        artifactEmoji = inventoryFormats[name].split(' ')[0]
      }
      }

      if (i > 22) {return}

    select.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`${name} (${artifacts[name]})`)
      .setValue(`${name}`)
      .setDescription(`${artifactDescription}`)
      .setEmoji(artifactEmoji)
    )
    })

    const row2 = new ActionRowBuilder()
      .addComponents(select);

    const myMessage = await message.reply({
      content: 'choose an item to trade',
      components: [row2],
    });

    const collectorFilter = i => i.user.id === message.author.id;
try {
  const confirmation = await myMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  myMessage.delete()

  const regex = /#(\d+)$/; // regex to match " #(number)" at the end of the string
  const match = confirmation.values[0].match(regex);
  if (match) {
    const number = match[1];
    const name = confirmation.values[0].slice(0, -1*(number.length+1)).trim()
    const rarityNum = parseInt(number, 10) - 1
    return [name, rarityNum]
  }

  return confirmation.values[0]
} catch (e) {
  console.error(e)
  myMessage.edit({ content: '**<:AgnabotX:1153460434691698719> ||** timed out', components: [] })
}

}

module.exports = trade
