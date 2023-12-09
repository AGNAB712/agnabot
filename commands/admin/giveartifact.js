const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function giveartifact(message, args) {
  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    await db.add(`${message.author.id}.inv.${args[0]}.count`, 1)
    await db.push(`${message.author.id}.inv.${args[0]}.rarity`, 'uber')
    message.reply(`**<:AgnabotCheck:1153525610665214094> ||** added one ${args[0]} to your inventory`)
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no admin')
  }

}

module.exports = giveartifact
