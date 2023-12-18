const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { validUserId, isNumeric } = require("../../info/generalFunctions.js");
const { forceSaveSqlite } = require("../../info/initFunctions.js");
const db = new QuickDB();

async function savesqlite(message, args, bot, client) {

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

  await forceSaveSqlite(client)
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** I did it congrats')

  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no admin')
  }

}

module.exports = savesqlite
