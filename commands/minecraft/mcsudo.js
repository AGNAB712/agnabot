const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function mcsudo(message, args, bot) {
  try {
    if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
      bot.chat(args.join(' '))
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** said "${args[0]}"`)
    } else {
      message.reply('**<:AgnabotX:1153460434691698719> ||** no admin')
    }
  } catch (e) {
    message.reply('**<:AgnabotX:1153460434691698719> ||** bot not on server')
  }
}

module.exports = mcsudo
