const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { validUserId, isNumeric } = require("../../info/generalFunctions.js");
const db = new QuickDB();

async function setmoney(message, args) {

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
  let idToSet;
  let amountToSet;

  if (args[0].length == 18) {idToSet = args[0]} else if (message.mentions.users.first()) {idToSet = message.mentions.users.first().id} else {message.reply('**<:AgnabotX:1153460434691698719> ||** no target')}

  amountToSet = args[1];

  if (isNumeric(amountToSet)) {
    await db.set(idToSet+'.a', amountToSet);
    message.reply('temp confirmation command')
  } else {
    message.channel.send('**<:AgnabotX:1153460434691698719> ||** not a number');
  }

  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no admin')
  }

}

module.exports = setmoney
