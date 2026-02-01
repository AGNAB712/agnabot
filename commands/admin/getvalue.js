const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { validUserId, isNumeric } = require("../../info/generalFunctions.js");
const { forceSaveSqlite } = require("../../info/initFunctions.js");
const db = new QuickDB();

async function getvalue(message, args, bot, client) {

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    const toGet = args.shift()
    const theThing = await db.get(toGet)
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** '+JSON.stringify(theThing))
  }

}

module.exports = getvalue
