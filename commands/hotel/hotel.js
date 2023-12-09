const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder } = require('discord.js')
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const db = new QuickDB();
const { petImage } = require('../../info/canvasFunctions.js')
const { hasArtifact } = require('../../info/generalFunctions.js')

async function hotel(message, args, bot, client) {
try {

  const myHotel = await db.get(`hotel_${message.author.id}`)
  const command2 = args[0]

  if (!command2) {return message.reply('**<:AgnabotX:1153460434691698719> ||** read the syntax please :   )')}
  if (!myHotel || myHotel === 'undefined') {return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have a room')}

  const command2shifted = args.shift()
  const newName = args.join('-');
  const theGuy = message.mentions.users.first()

  switch (command2) {

  case "delete":
  await db.set(`hotel_${message.author.id}`, 'undefined')
  client.channels.fetch(myHotel)
  .then( async channel => {
    channel.delete();
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** '+channel.name+' has been deleted')
  })
  .catch(error => console.error('error deleting channel', error))
  break;
    if (!newName) {
      return message.reply('**<:AgnabotX:1153460434691698719> ||** gimme a thing to rename it to')
    }
    if (isValidCategoryName(newName)) {
    client.channels.cache.get(myHotel).setName(newName);
    } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** thats not a valid category name')
    }
  break;

  case "name":
    if (!newName) {
      return message.reply('**<:AgnabotX:1153460434691698719> ||** gimme a thing to rename it to')
    }
    if (isValidCategoryName(newName)) {
    client.channels.cache.get(myHotel).setName(newName);
    } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** thats not a valid category name')
    }
  break;

  case "description": 
  if (!newName) {
    return message.reply('**<:AgnabotX:1153460434691698719> ||** gimme a thing to set the description to')
  }
  client.channels.cache.get(myHotel).setTopic(`${newName} (owned by ${message.author.username})`);
  break;

  case "private":
    client.channels.fetch(myHotel)
    .then(async channel => {
      channel.permissionOverwrites.edit(channel.guild.roles.everyone, { ViewChannel: false });
      channel.permissionOverwrites.edit(message.author.id, { ViewChannel: true });
    })
    .catch(error => console.error('error privating channel', error));

    message.reply('**<:AgnabotCheck:1153525610665214094> ||** changed permissions successfully')
  break;

case "public":
  client.channels.fetch(myHotel)
  .then(async channel => {
    channel.permissionOverwrites.edit(channel.guild.roles.everyone, { ViewChannel: true });
  })
  .catch(error => console.error('error privating channel', error));

  message.reply('**<:AgnabotCheck:1153525610665214094> ||** changed permissions successfully')
break;

case "invite": 
  if (!theGuy) return message.reply('**<:AgnabotX:1153460434691698719> ||** gotta mention someone bro')
  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(theGuy.id, { ViewChannel: true });
  })
  .catch(error => console.error('error inviting to channel', error));
  message.reply(`**<:AgnabotCheck:1153525610665214094> ||** ${theGuy.username} can now see your hotel room`)
break;

case "remove":
  if (!theGuy) return message.reply('**<:AgnabotX:1153460434691698719> ||** gotta mention someone bro')
  if (theGuy.id === message.author.id) return message.reply('**<:AgnabotX:1153460434691698719> ||** bro thats literally you')
  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(theGuy.id, { ViewChannel: false });
  })
  .catch(error => console.error('error privating channel', error));

  message.reply(`${theGuy.username} can now not see your hotel room`)
break;

case "lock":
  client.channels.fetch(myHotel)
  .then(async channel => {
    channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });
    channel.permissionOverwrites.edit(message.author.id, { SendMessages: true });
  })
  .catch(error => console.error('error privating channel', error));
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** now nobody can talk in your hotel room')
break;

case "unlock":
  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });
  })
  .catch(error => console.error('error privating channel', error));
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** now everybody can talk in your hotel room')
break;
}
} catch (e) {
  const errorEmbed = new EmbedBuilder()
    .setColor('#235218')
    .setTitle('~-= ERROR OCCURED =-~')
    .setDescription(`${new Date().toISOString()} - Uncaught Exception: ${e.message}\n${e.stack}`);

  return message.reply({ content: '**<:AgnabotError:1179991823352090644> || error occured**', embeds: [errorEmbed] })
}
}

function isValidCategoryName(name) {
  if (!name || name.length > 100) {
    return false;
  }

  const validCharsRegex = /^[a-zA-Z0-9_-]+$/;
  if (!validCharsRegex.test(name)) {
    return false;
  }

  // Check if the name doesn't start or end with a space
  if (name.trim() !== name) {
    return false;
  }

  return true;
}

module.exports = hotel