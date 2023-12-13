//requirements
const Discord = require('discord.js');
require("dotenv").config();
const { ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebHookClient, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const fs = require('fs');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

//require misc functions
const { autoReact } = require('./info/autoReactions.js')
const { getGlobalVar, setGlobalVar } = require('./info/editGlobalJson.js')
const { sendMinecraftChat, createMinecraftBot, checkMinecraftServer, isMinecraftOnline } = require('./info/minecraftFunctions.js')
const { getTextUntilDelimiter, isvalidhexcode, readJSONFile, parseDuration, durationToMilliseconds, formatDuration, updateCategoryName, hasArtifact, getRandomInt, validUserId, isNumeric, objectPage, fishingLoot, percentify, updateDatabase } = require('./info/generalFunctions.js')
const { saveSqlite, forceSaveSqlite, loadSqlite, loadCurrentStatus, doChildLabor, updatePets, payPets } = require('./info/initFunctions.js')
const { marriageImage, podium, fetchProfilePicture, balance, petImage } = require('./info/canvasFunctions.js')

const ngrok = require('ngrok');
const { google } = require('googleapis');
const credentials = require('./info/googleServiceAccount.json')
const os = require('os')

//import commands
const commands = {}
let commandJson
let commandAliases
readJSONFile('./commands/commands.json', (err, result) => {
  if (err) {
    console.error('Error reading JSON file:', err);
    return;
  }
  
  commandJson = result.commands;
  commandAliases = result.aliases;

  for (const property in commandJson) {
    commands[property] = require(`./commands/${commandJson[property].category}/${property}.js`)
    console.log(`Loaded command ${property}`);
  }
});

let lastmessage;

//client intents and partials
const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildMessageReactions,
  Discord.GatewayIntentBits.GuildVoiceStates,
  Discord.GatewayIntentBits.DirectMessageTyping,
  Discord.GatewayIntentBits.DirectMessages,
  ],
  partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
  })

const botArgs = {
  host: 'localhost',
  port: 25565, 
  username: 'AGNABOT',
}
let bot;

//consts and global variables
const prefix = `a.`;
const token = process.env.TOKEN;
const backupToken = process.env.TESTTOKEN;
setGlobalVar('savecount', 0)
setGlobalVar('lockdown', false)

let minecraftchat
let replit = true;
let replitText = 'error';
if (!(os.hostname() === 'agnabs-computer')) {
replit = true;
replitText = 'strats sent this'
} else {
replit = false
replitText = 'agnab sent this'
}

let drive

//ready stuff
client.on('ready', async () => {

minecraftchat = await client.channels.cache.get('1159952276882997309')
if (await isMinecraftOnline()) {
  await createMinecraftBot(bot);
}
if (replit) {
    console.log("hi strats");
} else {
    console.log("hi agnab");
}
console.log(`logged in as ${client.user.tag}`);

  //await loadSqlite(client, replit);
  //await updateDatabase(client);
  loadCurrentStatus(client);
  await updateCategoryName(client.channels.cache.get('1092554907883683961'), replit); 
  setInterval(updateCategoryName, 600000, client.channels.cache.get('1092554907883683961'), replit); 
  setInterval(doChildLabor, 300000);
  setInterval(updatePets, 300000);
  setInterval(checkMinecraftServer, 300000)
  setInterval(saveSqlite, 300000, replit);
  setInterval(function() {
  var now = new Date();
  var minutes = now.getMinutes();
  if (minutes === 30) {
  payPets();
  }
  }, 60000);

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
drive = google.drive({ version: 'v3', auth: auth });

await runNgrok()
 
});


client.on('messageCreate', async (message) => {

if (message.channel.type === 1) {return}
if (replit && message.guild.id == '831714424658198529') {return}
if (!message.author.bot) {lastmessage = message}

if (message.channel.id === minecraftchat?.id && !message.author.bot && replit) {
  const { getGlobalVar, setGlobalVar } = require('./info/editGlobalJson.js')
}

  const content = message.content.trim();
  if (!isNaN(content) && parseInt(content) < 13 && parseInt(content) > 3) {
    message.delete()
      .then(() => console.log(`Deleted message: "${message.content}"`))
      .catch((error) => console.error('Error while deleting message:', error));
  }

const lockdown = getGlobalVar("lockdown")

if (lockdown === true) {
if (message.content === 'a.unlock' || message.content === 'a.unlockdown' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
setGlobalVar("lockdown", false)
message.reply(`**<:AgnabotCheck:1153525610665214094> ||** y'all are not dumb.`)
}
if (message.content === 'a.lockstatus') {
message.reply('**<:AgnabotX:1153460434691698719> ||** locked')
}
return}

autoReact(message);
    
const args = message.content.slice(prefix.length).trim().split(' ');
const command = args.shift().toLowerCase();
    
if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;
if (message.mentions.everyone || message.mentions.here) {return}

//this is for updating website stuff
const me = await db.get(message.author.id)
if (!me?.a) {await db.set(message.author.id+'.a', 100)}
const user = {
  username: message.author.username,
  avatar: message.author.displayAvatarURL({ format: 'png', dynamic: true }),
  image: me?.websiteData?.image
};
if (me?.websiteData != user) {
  db.set(message.author.id+'.websiteData', user);
}

//actual commands
  try {
    if (command in commands) {
      if (commands[command].category === 'git' && message.author.id != '765581160755363840') {return message.reply('**<:AgnabotX:1153460434691698719> ||** only agnab can use git commands')}

        //command executor
        commands[command](message, args, bot, client, drive)
        return

    } else if (command in commandAliases) { //this is for command aliases

        const commandToRun = commandAliases[command]
        //command executor
        commands[commandToRun](message, args, bot, client, drive)
    }     
  } catch (e) {
    console.error(e)
    const errorEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('~-= ERROR OCCURED =-~')
      .setDescription(`${new Date().toISOString()} - Uncaught Exception: ${e.message}\n${e.stack}`);

    return message.reply({ content: '**<:AgnabotError:1179991823352090644> || error occured**', embeds: [errorEmbed] })
  }

//test command
if (command === 'test') {
  deprivePets(await db.get('pet_'+message.author.id), message.author.id);
}

  //unfinished
if (command === 'divorce') {
  await db.set(message.author.id+'.married', false)
}

  //reminder to reformat this command later

});

client.on('interactionCreate', async (interaction) => {
  //console.log(interaction)
  if (!interaction.isButton() || getGlobalVar("lockdown") !== false) return;

  try {

  const { customId } = interaction;

  if (customId === 'confirmWhitelist' || customId === 'denyWhitelist') {
  if (!(interaction.user.id == '765581160755363840' || interaction.user.id == '382226955870928897')) {  
  await interaction.reply({
  content: `only strats and agnab can verify`,
  ephemeral: true
  });
  return
  }

  if (customId === 'confirmWhitelist') {
    try {

const minecraftUsername = getTextUntilDelimiter(interaction.message.embeds[0].data.description.slice(20), '\n')

let updatedWhitelistEmbed = new EmbedBuilder()
.setColor('Green')
.setTitle('~=-Whitelist Request-=~')
.setDescription(`**-WHITELIST VERIFIED-**\nusername: ${minecraftUsername}`)
interaction.update({ embeds: [updatedWhitelistEmbed], components: [] })
bot.chat(`/whitelist add ${minecraftUsername}`)
    } catch (e) {
    interaction.update({ content: 'some error occured Sorry', embeds: [], components: [] })
    }
  }

  if (customId === 'denyWhitelist') {
    try {

const minecraftUsername = getTextUntilDelimiter(interaction.message.embeds[0].data.description.slice(20), '\n')

let updatedWhitelistEmbed = new EmbedBuilder()
.setColor('Red')
.setTitle('~=-Whitelist Request-=~')
.setDescription(`**-WHITELIST DENIED-**\nusername: ${minecraftUsername}`)
interaction.update({ embeds: [updatedWhitelistEmbed], components: [] })
    } catch (e) {
    interaction.update({ content: 'some error occured Sorry', embeds: [], components: [] })
    }
  }
  }

  if (customId === 'next' || customId === 'back') {
    const repliedMessage = await interaction.message.channel.messages.fetch(interaction.message.reference.messageId)
    const embeds = interaction.message.embeds
    const theGoodEmbed = embeds[0]
    const myPage = theGoodEmbed.title[8]
    const me = await db.get(repliedMessage.author.id)

    let nextButton = new ButtonBuilder()
    .setCustomId('next')
    .setEmoji('➡')
    .setStyle(ButtonStyle.Success)

    let backButton = new ButtonBuilder()
    .setCustomId('back')
    .setEmoji('⬅️')
    .setStyle(ButtonStyle.Success)
    
    const row = new ActionRowBuilder()
      .addComponents(backButton, nextButton);

    if (customId === 'next') {
    const totalpages = Math.floor(Object.keys(me.inv).length / 3)
    if (`${totalpages}` === myPage) {
      nextButton.setDisabled(true)
    }
    const newEmbed = objectPage(me.inv, parseInt(myPage))
    backButton.setDisabled(false)
    interaction.update({ embeds: [newEmbed], components: [row] })

    } else {
    const newEmbed = objectPage(me.inv, parseInt(myPage) - 2)
    if (myPage === '2') {
      backButton.setDisabled(true)
    }
    interaction.update({ embeds: [newEmbed], components: [row] })
    }
  }
  if (!(customId === 'feed' || customId === 'play' || customId === 'heal' || customId === 'revive') || !interaction.message.mentions.users.first().id) {return}
  //console.log(interaction.message.mentions.users.first().id)
  const id = interaction.user.id
  if (interaction.message.mentions.users.first().id !== id) {
  return await interaction.reply({
  content: 'you cannot use STUPID',
  ephemeral: true
});

}

  const curbal = await db.get(id+'.a')

  const myPet = await db.get(`pet_${id}`)
  if (!myPet || myPet === 'null') {return interaction.message.channel.send('you dont have a pet')}

  if (customId === 'feed') {
  if (myPet.hunger + 20 >= 100) {
  await db.set(`pet_${id}.hunger`, 100) 
  } else {
  await db.set(`pet_${id}.hunger`, myPet.hunger + 20) 
  }
  await db.set(id+'.a', parseInt(curbal) - 10) 
  await interaction.reply({
  content: `you fed ${myPet.name} CONGRATS!`,
  ephemeral: true
  });
  }

  if (customId === 'play') {
  await db.set(`pet_${id}.affection`, 100) 
  await interaction.reply({
  content: `you played with ${myPet.name} CONGRATS!`,
  ephemeral: true
  });
  }

  if (customId === 'heal') {
  if (myPet.health + 50 >= 100) {
  await db.set(`pet_${id}.health`, 100) 
  } else {
  await db.set(`pet_${id}.health`, myPet.health + 50) 
  }
  await interaction.reply({
  content: `you healed ${myPet.name} CONGRATS!`,
  ephemeral: true
  });
  await db.set(id+'.a', parseInt(curbal) - 50) 
  }

  if (customId === 'revive') {
  await db.set(`pet_${id}.health`, 25) 
  await db.set(`pet_${id}.hunger`, 25) 
  await db.set(`pet_${id}.affection`, 25) 
  await interaction.reply({
  content: `i hope you die soon`,
  ephemeral: true
  });
  await db.set(id+'.a', parseInt(curbal) - 1000) 
  }

  

  const attachment = await petImage(await db.get(`pet_${id}`), id)
  await interaction.message.edit({ files: [attachment] });

} catch (e) {
console.log(e)
await interaction.message.reply({
  content: 'sorry some Eror occured my bad',
});
}
})

//crash log system
process.on('uncaughtException', async (err) => {
  console.log('CRASHED, writing error...')
  console.log(err)
  const errorMessage = `${new Date().toISOString()} - Uncaught Exception: ${err.message}\n${err.stack}`;
  await fs.writeFile('./info/crash logs/error.txt', errorMessage, (err) => { 
    if (err) throw err; 
  }) 
  console.log('Done writing...')
  const errorEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('~-= ERROR OCCURED =-~')
  .setDescription(`${new Date().toISOString()} - Uncaught Exception: ${err.message}\n${err.stack}`);
  if (lastmessage) {
    lastmessage.channel.send({ content: '**<:AgnabotError:1179991823352090644> || error occured**', embeds: [errorEmbed] })
  }
  //process.exit(1);
});

process.on('SIGINT', () => {
  // Call the async shutdown function and handle any errors
  shutdown().catch(err => {
    console.error('Error during shutdown:', err);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  });});

process.on('SIGTERM', () => {
  // Call the async shutdown function and handle any errors
  shutdown().catch(err => {
    console.error('Error during shutdown:', err);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  });});

async function shutdown() {
  console.log('Bot is shutting down...');
  process.exit(0);}

if (replit) {
client.login(token);
} else {
client.login(backupToken);
}

async function runNgrok() {
  require('./website.js');

  const url = await ngrok.connect({ authtoken: process.env.NGROKAUTH, addr: 3000 });
  setGlobalVar('url', url)
  console.log(url)
}

module.exports = {
  client,
  db,
};