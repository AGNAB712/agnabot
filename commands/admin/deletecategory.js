const Discord = require('discord.js');
const { PermissionsBitField, ActivityType } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { validUserId, isNumeric } = require("../../info/generalFunctions.js");
const db = new QuickDB();

async function deletecategory(message, args, bot, client) {
 if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

    if (args.length === 0) {
      message.channel.send('<:AgnabotX:1153460434691698719> || gimme the index to delete');
      return;
    }

    const index = parseInt(args[0], 10);

    if (isNaN(index) || index < 1 || index > await db.get('category').length) {
      message.channel.send('<:AgnabotX:1153460434691698719> || cant delete that bro');
      return;
    }

    const categoryNames = await db.get('category')
    const toPull = categoryNames[index - 1]
    const deletedCategory = await db.pull('category', toPull);
    message.channel.send(`<:AgnabotCheck:1153525610665214094> || deleted "${toPull}"`);
    } else {
    message.channel.send(`<:AgnabotX:1153460434691698719> || lol no perms`);
    }

}

module.exports = deletecategory
