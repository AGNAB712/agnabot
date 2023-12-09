const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, objectPage, percentify } = require('../../info/generalFunctions.js')
const { commandInspector } = require('../../info/canvasFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const { statEmbed } = require('../../info/embeds.js')
const { fishingArray, fishingLootMap, artifacts, outfitFormats } = require('../../info/fishing.js')
const fs = require('fs');
const db = new QuickDB();

const commandsObject = require('../commands.json')

async function help(message, args, bot, client) {

  if (args.length > 0) {
    const fullArgs = args.join('')
    const command = commandsObject.commands[fullArgs]

    if (!command) {return message.reply( `**<:AgnabotX:1153460434691698719> ||** not a valid command`)}

    /*const commandEmbed = new EmbedBuilder()
    .setColor('#235218')
    .setTitle('-~= COMMAND INSPECTOR =~-')
    .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
    .setDescription(`***Command name***: ${fullArgs}

      ${command.description}

      **Category:** ${command.category}
      *Syntax:* \n${command.syntax}
      `)*/
    const aliasesObject = switchKeysAndValues(commandsObject.aliases)
    const aliases = aliasesObject[fullArgs]
    const attachment = await commandInspector(fullArgs, command, aliases)

    message.reply({ files: [attachment] })
    return
  }

    const commands = new ButtonBuilder()
      .setCustomId('commands')
      .setLabel('Commands')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1183109297698246796')

    const guides = new ButtonBuilder()
      .setCustomId('guides')
      .setLabel('Guides')
      .setStyle(ButtonStyle.Secondary)
      .setEmoji('1183109297698246796')

    const row = new ActionRowBuilder()
      .addComponents(commands, guides);

    const response = await message.reply({
        content: '**<:AgnabotCheck:1153525610665214094> ||** would you like to see the command list or guides?',
        components: [row],
    });

    const collectorFilter = i => i.user.id

try {

  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  response.delete()
  if (collected.customId == 'commands') {

    let selectCommand = new StringSelectMenuBuilder()
      .setCustomId('command')
      .setPlaceholder(`Command category list`)

    const folderArray = fs.readdirSync('./commands', { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

    folderArray.forEach((name, i) => {

    let emojiId = '1183109297698246796'
    if (name === 'hotel') {emojiId = '1180755217126543420'}
    if (name === 'pet') {emojiId = '1180752541097668708'}
    if (name === 'inventory') {emojiId = '1181067287889977425'}
    selectCommand.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(name)
      .setValue(name)
      .setEmoji(emojiId)
    )
    })

    const row2 = new ActionRowBuilder()
      .addComponents(selectCommand);

    const myMessage = await message.reply({
      content: '<:AgnabotCheck:1153525610665214094> **||** Choose a category!',
      components: [row2],
    });

  const confirmation = await myMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  myMessage.delete()

  if (confirmation.values[0] === 'pet' || confirmation.values[0] === 'hotel') {
    const aliasesObject = switchKeysAndValues(commandsObject.aliases)
    const aliases = aliasesObject[confirmation.values[0]]

    const attachment = await commandInspector(confirmation.values[0], commandsObject.commands[confirmation.values[0]], aliases)
    message.reply({ files: [attachment] })
    return
  }

    let selectCommand2 = new StringSelectMenuBuilder()
      .setCustomId('command')
      .setPlaceholder(`Command category list`)

    const commandArray = Object.keys(filterObjects(commandsObject.commands, confirmation.values[0]))
    //console.log(commandArray, filterObjects(commandsObject.commands, confirmation.values[0]))

    commandArray.forEach((name, i) => {
    selectCommand2.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(name)
      .setValue(name)
    )
    })

    const row3 = new ActionRowBuilder()
      .addComponents(selectCommand2);

    const myMessage2 = await message.reply({
      content: '<:AgnabotCheck:1153525610665214094> **||** Choose a command!',
      components: [row3],
    });

  const confirmation2 = await myMessage2.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  myMessage2.delete()

  const aliasesObject = switchKeysAndValues(commandsObject.aliases)
  const aliases = aliasesObject[confirmation2.values[0]]

  const attachment = await commandInspector(confirmation2.values[0], commandsObject.commands[confirmation2.values[0]], aliases)
  message.reply({ files: [attachment] })

  }
  if (collected.customId == 'guides') {
    message.reply('imagine this is a list of guides')
  }
  } catch (e) {
    console.log(e)
  }
}

function filterObjects(obj, keyInput) {
  const filtered = {};
  for (const key in obj) {
    if (obj[key].category === keyInput) {
      filtered[key] = obj[key];
    }
  }
  return filtered;
}

//i love chatgpt
function switchKeysAndValues(obj) {
  const switched = {};
  for (const key in obj) {
    if (Object.hasOwnProperty.call(obj, key)) {
      const value = obj[key];
      if (switched[value] === undefined) {
        switched[value] = [key];
      } else {
        switched[value].push(key);
      }
    }
  }
  return switched;
}

module.exports = help
