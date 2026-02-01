const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const db = new QuickDB();

async function lock(message, args) {
  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    const lockdown = getGlobalVar("lockdown");
    if (!lockdown) {
      await setGlobalVar("lockdown", true)
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** y'all are dumb.`)
    }
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no admin')
  }
}

module.exports = lock
