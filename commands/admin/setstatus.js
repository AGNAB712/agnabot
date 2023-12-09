const Discord = require('discord.js');
const { PermissionsBitField, ActivityType } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { validUserId, isNumeric } = require("../../info/generalFunctions.js");
const db = new QuickDB();

async function setstatus(message, args, bot, client) {


 if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

  const typeOfStatus = args.shift();
  const newStatus = args.join(' ');

  if (!typeOfStatus) {
    return message.channel.send('uhhh thats not valid (remember, you can do watching, playing, competing or listening)');
  }

  if (typeOfStatus.toLowerCase() === 'watching') {
  client.user.setActivity(newStatus, { type: ActivityType.Watching });
  client.channels.cache.get('1140672130619543603').send(`${newStatus}, watching`)
  message.channel.send(`my new status is watching ${newStatus}`);
  } else if (typeOfStatus.toLowerCase() === 'playing') {
  client.user.setActivity(newStatus);
  client.channels.cache.get('1140672130619543603').send(`${newStatus}, playing`)
  message.channel.send(`my new status is playing ${newStatus}`);
  } else if (typeOfStatus.toLowerCase() == 'competing') {
  client.channels.cache.get('1140672130619543603').send(`${newStatus}, competing`)
  client.user.setActivity(newStatus, { type: ActivityType.Competing });
  message.channel.send(`my new status is competing in ${newStatus}`);
  } else if (typeOfStatus.toLowerCase() == 'listening') {
  client.channels.cache.get('1140672130619543603').send(`${newStatus}, listening`)
  message.channel.send(`my new status is listening to ${newStatus}`);
  client.user.setActivity(newStatus, { type: ActivityType.Listening });
  } else {
    message.channel.send('uhhh thats not valid (remember, you can do watching, playing, competing or listening)')
  }
    } 
    else {
    message.channel.send(`lol no perms`);
    }

}

module.exports = setstatus
