const Discord = require('discord.js');
const { PermissionsBitField, ActivityType } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { validUserId, isNumeric } = require("../../info/generalFunctions.js");
const db = new QuickDB();

async function forcecategory(message, args, bot, client) {


 if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    // Check if any category name was provided after the command
    if (args.length === 0) {
      message.channel.send('<:AgnabotX:1153460434691698719> || gimme a category name.');
      return;
    }

    // Join the arguments into a single string
    const categoryName = args.join(' ');
        await db.push('category', categoryName);
        message.channel.send(`<:AgnabotCheck:1153525610665214094> || category "${categoryName}" has been added.`);
    } 
    else {
    message.channel.send(`<:AgnabotX:1153460434691698719> || lol no perms`);
    }

}

module.exports = forcecategory
