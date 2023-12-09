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

async function inventory(message, args, bot, client) {


    let outfit = await db.get(message.author.id+'.outfit')
    if (!outfit) {
      await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
      outfit = { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] }
    }
    let outfitRaritiesReformat = []

    Object.values(outfit).forEach((key, i) => {
      //the me variable here is the number value of the rarity
      let me = key[1]
      if (me == 1) {me = 'rare'} else if (me == 2) {me = 'legendary'} else if (me == 0) {me = '(none)'} else {me = 'uber'}
      outfitRaritiesReformat.push(me)
    })

    const equipEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>==-- Equip Menu --==<')
      .addFields(
    { name: `Slot 1 (rarity ${outfitRaritiesReformat[0]})`, value: `${outfitFormats[outfit.slot1[0]]}`, inline: true },
    { name: `Slot 2 (rarity ${outfitRaritiesReformat[1]})`, value: `${outfitFormats[outfit.slot2[0]]}`, inline: true },
    { name: `Slot 3 (rarity ${outfitRaritiesReformat[2]})`, value: `${outfitFormats[outfit.slot3[0]]}`, inline: true },
        )
      .setFooter({ text: 'please select the slot you want to equip in' })

    const slot1 = new ButtonBuilder()
      .setCustomId('slot1')
      .setLabel('slot 1')
      .setStyle(ButtonStyle.Success)
      .setEmoji('1️⃣')
    const slot2 = new ButtonBuilder()
      .setCustomId('slot2')
      .setLabel('slot 2')
      .setStyle(ButtonStyle.Success)
      .setEmoji('2️⃣')
    const slot3 = new ButtonBuilder()
      .setCustomId('slot3')
      .setLabel('slot 3')
      .setStyle(ButtonStyle.Success)
      .setEmoji('3️⃣')
    const cancel = new ButtonBuilder()
      .setCustomId('cancelEquip')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('<:AgnabotX:1153460434691698719>')

    const row = new ActionRowBuilder()
      .addComponents(slot1, slot2, slot3, cancel);

    const response = await message.reply({
        embeds: [equipEmbed],
        components: [row],
    });

    let slot = 1

const collectorFilter = i => message.author.id;

try {

  const collected2 = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected2.customId == 'cancelEquip') {return collected2.update({ 
    content: `**<:AgnabotX:1153460434691698719> ||** goobye :3`,
    components: [],
    embeds: [],
  })}
  slot = collected2.customId
  response.delete()

} catch (e) {
  return response.edit({ 
    content: `**<:AgnabotX:1153460434691698719> ||** timed out`,
    components: [],
    embeds: [],
  })
}

    const inv = await db.get(message.author.id+'.inv')
    const invArray = Object.keys(inv)
    let artifacts = {}; 

    //filter to be only artifacts
    invArray.forEach((key, i) => {
      if (typeof inv[key] !== 'object') {
        return delete inv[key];
      }
      if (key == 'undefined') {
        return delete inv[key];
      }
      if (inv[key].count === 0) {
        return delete inv[key];
      }

      const myObject = inv[key];

      if (myObject.count > 1) {
        for (let i = 0; i < myObject.count; i++) {

          //this weird ass piece of code checks if there's an artifact of the same rarity and name, and if so skips one of the artifacts
          let numberRarity = 0
          if (inv[key].rarity[i] == 'uber') {numberRarity = 3} else if (inv[key].rarity[i] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
          if (outfit.slot1[0] == key) {
          console.log(`${key} (${inv[key].rarity[i]}) is already equipped`)
          } else if (outfit.slot2[0] == key) {
          console.log(`${key} (${inv[key].rarity[i]}) is already equipped`)
          } else if (outfit.slot3[0] == key) {
          console.log(`${key} (${inv[key].rarity[i]}) is already equipped`)
          } else {
          artifacts[key + ` #${(i + 1)}`] = inv[key].rarity[i]
          } 

        }
      } else {

        let numberRarity = 0
        if (inv[key].rarity[0] == 'uber') {numberRarity = 3} else if (inv[key].rarity[0] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
        //same down here
        //i should prob use a guard system using returns or a for loop but im lazy
        if (outfit.slot1[0] == key && outfit.slot1[1] == numberRarity) {outfit.slot1 = ['', '']}
        else if (outfit.slot2[0] == key && outfit.slot2[1] == numberRarity) {outfit.slot2 = ['', '']}
        else if (outfit.slot3[0] == key && outfit.slot3[1] == numberRarity) {outfit.slot3 = ['', '']}
        else {
        artifacts[key] = inv[key].rarity[0]
        }
      }
    })
    

    const artifactArray = Object.keys(artifacts)

    let select = new StringSelectMenuBuilder()
      .setCustomId('equip')
      .setPlaceholder('Equip an artifact')
      .addOptions(
      new StringSelectMenuOptionBuilder()
      .setLabel(`Cancel`)
      .setValue(`cancel`),
      new StringSelectMenuOptionBuilder()
      .setLabel(`Unequip`)
      .setValue(`unequip`)
    )

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
        artifactDescription = fishingJs.artifacts[name].description
        artifactEmoji = inventoryFormats[name].split(' ')[0]
      }

      if (i > 22) {return}

    select.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`${name} (${artifacts[name]})`)
      .setValue(`${name}`)
      .setDescription(`"${artifactDescription}"`)
      .setEmoji(artifactEmoji)
    )
    })

    const row2 = new ActionRowBuilder()
      .addComponents(select);

    const myMessage = await message.reply({
      content: 'equip what artifact?',
      components: [row2],
    });

try {
  const confirmation = await myMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });


  if (confirmation.values[0] === 'cancel') {return await confirmation.update({ content: '**<:AgnabotX:1153460434691698719> ||** oook bai :3', components: [] })}
  if (confirmation.values[0] === 'unequip') {
  confirmation.update({ content: `**<:AgnabotCheck:1153525610665214094> ||** successfully unequipped **${slot}**`, components: [] })
  return await db.set(message.author.id+'.outfit.'+slot, [ "null", 0 ])
  }

  let toEquipName
  let toEquipRarity
  const regex = /#(\d+)$/; // regex to match " #(number)" at the end of the string
  const match = confirmation.values[0].match(regex);
  if (match) {
    const number = match[1];
    toEquipName = confirmation.values[0].slice(0, -1*(number.length+1)).trim()
    toEquipRarity = inv[toEquipName].rarity[parseInt(number, 10) - 1];
  } else {
    toEquipName = confirmation.values[0]
    toEquipRarity = inv[toEquipName].rarity[0];
  }

  let toEquipRarityNumber = 0
  if (toEquipRarity === 'uber') {toEquipRarityNumber = 3} else if (toEquipRarity === 'legendary') {toEquipRarityNumber = 2} else {toEquipRarityNumber = 1}
  await db.set(message.author.id+'.outfit.'+slot, [ toEquipName, toEquipRarityNumber ])
  confirmation.update({ content: `**<:AgnabotCheck:1153525610665214094> ||** successfully equipped **${toEquipName}** (of rarity **${toEquipRarity}**) in **${slot}**`, components: [] })

} catch (e) {
  console.error(e)
  myMessage.edit({ content: '**<:AgnabotX:1153460434691698719> ||** timed out', components: [] })
}}

module.exports = inventory
