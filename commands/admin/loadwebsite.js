const Discord = require('discord.js');
const { PermissionsBitField } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { validUserId, isNumeric } = require("../../info/generalFunctions.js");
const { forceSaveSqlite } = require("../../info/initFunctions.js");
const db = new QuickDB();

const token = process.env.WEBSITEAUTH;

async function loadwebsite(message, args, bot, client) {

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

    fetch('https://agnab.onrender.com/api/loadsqlite', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await db.all()),
    })
      .then(response => {
        console.log('sent file over to the website successfuly')
        message.reply('**<:AgnabotCheck:1153525610665214094> ||** I did it congrats')
      })
      .catch(error => {
        console.error(error)
      });

  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no admin')
  }

}

module.exports = loadwebsite
