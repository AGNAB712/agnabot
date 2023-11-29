//requirements
const Discord = require('discord.js');
require("dotenv").config();
const { ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebHookClient, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus, entersState, NoSubscriberBehavior } = require('@discordjs/voice');
const voice = require('@discordjs/voice');
const { QuickDB } = require("quick.db");
const { exec } = require('child_process');
const db = new QuickDB();
const cleverbot = require('cleverbot-free');
const Canvas = require('@napi-rs/canvas');
const { request } = require('undici');
const axios = require('axios');
const cheerio = require('cheerio');
const { readFile } = require('fs/promises');
const { Image } = require('@napi-rs/canvas');
const { funEmbed, utilityEmbed, bankEmbed, adminEmbed, hotelEmbed, petEmbed, statEmbed } = require('./info/embeds.js')
const { buyArray, inventoryFormats, itemWorth } = require('./info/buyMap.js')
const { workArray } = require('./info/agnabot_work_texts.js')
const { fishingArray, fishingLootMap, artifacts, outfitFormats } = require('./info/fishing.js')
//ignore this horrible coding practice idfk at this point
const fishingJs = require('./info/fishing.js')
const { google } = require('googleapis');
const { promises } = require('fs')
const { join } = require('path')
const os = require('os');
const Jimp = require('jimp')
const Trello = require('trello');
const mineflayer = require('mineflayer');
const deathEvent = require("mineflayer-death-event")
const mcs = require('node-mcstatus');

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

//consts and global variables
const prefix = `a.`;
const token = process.env.TOKEN;
const backupToken = process.env.TESTTOKEN;
const currentDateTime = new Date();
let saveCount = 0
let curPlay = false;
let msgId = [];
let lockdown = 'false';
const fightTimeout = 10000;
const playersInFight = new Set();
const player = new createAudioPlayer();
const googleAuth = process.env.GOOGLEAPIAUTH;
const youtube = google.youtube({
  version: 'v3',
  auth: googleAuth
});
let lastVideoId = null;
let noFirst = 'true';
const channelId = '1092546678613094461';
const youtubeChannelId = process.env.YOUTUBECHANNELID;
let sqliteChannel = ''
let inBan = false;
let inFight = false;
let player1Health = 0
let player2Health = 0
let sbLoop = 0;
let replit = true;
let replitText = 'error';
if (!(os.hostname() === 'agnabs-computer')) {
replit = true;
replitText = 'strats sent this'
} else {
replit = false
replitText = 'agnab sent this'
}
const trello = new Trello(process.env.TRELLOKEY, process.env.TRELLOTOKEN);

//arrays
const says = [];
let users = [];
let queue = [];
let conversation = [];
let minecraftPlayersCooldown = []
const cuss = ['FUCK','SHIT','BITCH']

//maps
const cooldowns = new Map();
const cooldowns2 = new Map();
const cooldowns3 = new Map();
const isFishing = new Map();
const verifyMap = new Map();
const mutes = new Map();
const defaultPet = {
  name: null,
  image: null,
  background: './images/petbg.png',
  hunger: 100,
  affection: 100,
  health: 100
}

//extra embeds
let testEmbed = new EmbedBuilder()
.setTitle('fight results:')
.setImage('attachment://podium.png')
.setColor('#235218')
let balEmbed = new EmbedBuilder()
.setImage('attachment://balance.png')
.setColor('#235218')
.setTitle('Your balance')
let seedEmbed = new EmbedBuilder()
.setColor('#235218')
let fishingEmbed = new EmbedBuilder()
.setTitle('Fishing...')
.setImage('attachment://fishing.png')
.setColor('#235218')
let whitelistEmbed = new EmbedBuilder()
.setColor('#235218')
.setTitle('~=-Whitelist Request-=~')

//saving sqlite function
async function saveSqlite() {
if (!replit) {return}
if (lockdown !== 'false') {return}

//guard to stop it always saving because it gets laggy often
if (saveCount < 5) {
saveCount++
console.log(`will save sqlite in ${5 - saveCount} counts`)
return
}

forceSaveSqlite()

}

async function forceSaveSqlite() {
if (!replit) {return}
  saveCount = 0
  const fileName = 'json.sqlite';
  await client.channels.cache.get('1156302752218091530').messages.fetch('1156302916873900032').then((msg) => 
      msg.edit({
        content: `**${replitText}** || *${Date.now()}*`, 
        files: ['./json.sqlite']
      })
    )
    
    console.log('saved sqlite', saveCount)
    
}

//load sqlite function
async function loadSqlite() {
if (!replit) {return}
await client.channels.cache.get('1156302752218091530').messages.fetch('1156302916873900032').then(async (lastMessage) => {
    if (lastMessage.attachments.size > 0) {
      const attachment = lastMessage.attachments.first();
      const fileName = attachment.name;
      if (fileName.endsWith('.sqlite')) {
        const file = await fetchAttachment(attachment.url);
        fs.writeFileSync(fileName, file);
        console.log(`sqlite loaded`);
      }
    }
}
  )
}



//status load function
async function loadCurrentStatus() {
  const channelId = '1140672130619543603';
  const channel = client.channels.cache.get(channelId);
  channel.messages.fetch({ limit: 1 })
    .then(messages => {
      const firstMessage = messages.first();
    const data = firstMessage.content;
    const splitData = data.split(',')
    if (!splitData[1]) {
    client.user.setActivity(splitData[0]);
    } else if (splitData[1].trim() === 'watching') {
    client.user.setActivity(splitData[0], { type: ActivityType.Watching });
    } else if (splitData[1].trim() === 'playing') {
    client.user.setActivity(splitData[0]);
    } else if (splitData[1].trim() === 'competing') {
    client.user.setActivity(splitData[0], { type: ActivityType.Competing });
    } else if (splitData[1].trim() === 'listening') {
    client.user.setActivity(splitData[0], { type: ActivityType.Listening });
    }
    })
    .catch(console.error);
}

//child labor function (for the child labor shop item)
async function doChildLabor() {

  const amassing = client.guilds.cache.get('969752864585035777');

  const allUserData = await db.all()
  const toWork = allUserData.filter(data => data.id.startsWith('children_'))
  await toWork.forEach(async (value, index) => {
    const userId = value.id.slice(9)
    if (!amassing.members.cache.get(userId)) {return}
    const curbal = await db.get(userId+'.a')
    const laziness = await hasArtifact(userId, 'amuletoflaziness');
    let multiplyValue = 1
    if (laziness) {multiplyValue = 0.5}
    await db.set(userId+'.a', parseInt(parseInt(curbal) + (value.value * 0.5)));
  })
}

//for updating pet stats
async function updatePets() {

  const allUserData = await db.all()
  const toUpdate = allUserData.filter(data => data.id.startsWith('pet_'))
  toUpdate.forEach(async (value, index) => {

    const userId = value.id.slice(4);
    const myPet = await db.get('pet_' + userId);

    const laziness = await hasArtifact(userId, 'amuletoflaziness');
    if (!laziness) {
      await db.set('pet_' + userId + '.lazy', false);
      await deprivePets(myPet, userId)
    } else {

      if (myPet.lazy) {
        if (myPet.hunger === 100 && myPet.health === 100 && myPet.affection === 100) {
          await db.set('pet_' + userId + '.lazy', false);
        }
        if (myPet.health + laziness[1] > 100) {await db.set('pet_' + userId + '.health', 100);} else {await db.add('pet_' + userId + '.health', laziness[1]);}
        if (myPet.affection + laziness[1] > 100) {await db.set('pet_' + userId + '.affection', 100);} else {await db.add('pet_' + userId + '.affection', laziness[1]);}
        if (myPet.hunger + laziness[1] > 100) {await db.set('pet_' + userId + '.hunger', 100);} else {await db.add('pet_' + userId + '.hunger', laziness[1]);}
      } else {
        if (myPet.hunger - 1 < 25 || myPet.health - 1 < 25 || myPet.affection - 1 < 25) {
          await db.set('pet_' + userId + '.lazy', true);
        }

        await deprivePets(myPet, userId)
      }

    }
  })
}

async function deprivePets(myPet, userId) {

  const shield = hasArtifact(userId, 'impenetrableshield')

  if (getRandomInt(3) + 1 === 3) {
    if (myPet.hunger - 1 < 0) {
      await db.set('pet_' + userId + '.hunger', 0);
      return;
    }
    await db.set('pet_' + userId + '.hunger', myPet.hunger - 1);
  }

  if (getRandomInt(2) + 1 === 2) {
    if (myPet.affection - 1 < 0) {
      await db.set('pet_' + userId + '.affection', 0);
      return;
    }
    await db.set('pet_' + userId + '.affection', myPet.affection - 1);
  }

  if (shield) {
  
    await db.set('pet_' + userId + '.shielded', true);

  if (myPet.hunger == 0 && myPet.affection) {
    if (myPet.health - 3 < 0) {
      await db.set('pet_' + userId + '.health', 0);
      return;
    }
    await db.set('pet_' + userId + '.health', myPet.health - 3);
  }

  } else {

    await db.set('pet_' + userId + '.shielded', false);
    if (getRandomInt(5) + 1 === 5) {
      if (myPet.health - 1 < 0) {
        await db.set('pet_' + userId + '.health', 0);
        return;
      }
      await db.set('pet_' + userId + '.health', myPet.health - 1);
    }
  }
}

async function payPets() {
  const allUserData = await db.all()
  const toUpdate = allUserData.filter(data => data.id.startsWith('pet_'))
  await toUpdate.forEach(async (value, index) => {
    const userId = value.id.slice(4)
    const myPet = await db.get('pet_' + userId)
    const curbal = await db.get(userId+'.a')
    const helmet = await hasArtifact(playerID, 'emeraldhelmet')
    const shield = await hasArtifact(playerID, 'impenetrableshield')
    if (helmet) {return}

    let toAdd = myPet.affection + myPet.hunger
    if (!shield) {
      toAdd += myPet.health
    } else {
      toAdd += myPet.health * shield[1]
    }

    await db.add(userId+'.a', toAdd)
  })
}

//loads stopautoreact stuff
async function loadStopUsers() {
  const channelId = '1117068093953409094';
  const channel = client.channels.cache.get(channelId);
  channel.messages.fetch({ limit: 1 })
    .then(messages => {
      const firstMessage = messages.first();
    const data = firstMessage.content;
    users = JSON.parse(data);
    })
    .catch(console.error);
}

//saves stop autoreact stuff
async function saveStopUsers() {
const channel = await client.channels.cache.get('1117068093953409094')
const lastMessage = await client.channels.cache.get(channelId).messages.lastMessage;
    await channel.send(JSON.stringify(users));
}

async function checkMinecraftServer() {
  console.log('checking if minecraft server is online...')
  if (await isMinecraftOnline()) {
  console.log('is online!')
  try {
  if (bot.health) {
  console.log('bot is online too')
}
  } catch (e) {
  console.log('is online but bot is not online')
  await createMinecraftBot()
  }
} else {
  console.log('isnt online')
}
}

//ready stuff
client.on('ready', async () => {

console.log(os.hostname(), os.platform(), os.arch())
minecraftchat = await client.channels.cache.get('1159952276882997309')

if (await isMinecraftOnline()) {
  await createMinecraftBot();
}


console.log(`logged in as ${client.user.tag}`);
if (replit) {
    console.log("hi strats");
} else {
    console.log("hi agnab");
}
//client.channels.cache.get('1108491109258244156').send('hallo guys it is me i am online');



  await loadSqlite();
  loadStopUsers();
  loadCurrentStatus();
  await updateCategoryName(); 
  setInterval(updateCategoryName, 600000); 
  setInterval(doChildLabor, 300000);
  setInterval(updatePets, 300000);
  setInterval(checkMinecraftServer, 300000)
  setInterval(function() {
  var now = new Date();
  var minutes = now.getMinutes();
  if (minutes === 0) {
  payPets();
  }
  }, 60000);

const newSqliteChannel = await client.channels.cache.get('1156302752218091530')


//this gets google credentials without dot env
credentialsChannel = await client.channels.cache.get('1129208531036422205')
credentialsMessage = await credentialsChannel.messages.fetch("1137436047890976889")
credentials = JSON.parse(credentialsMessage.content)
folderId = '1uhXVBbhrcLaUpYB6MuGDYJd7dSn5R0G8';
auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
drive = google.drive({ version: 'v3', auth: auth });

 
});


client.on('messageCreate', async (message) => {

if (message.channel.type === 1) {return}
if (replit && message.guild.id == '831714424658198529') {return}


if (message.channel.id === minecraftchat?.id && !message.author.bot && replit) {
  if (message.content.length >= 150) {return message.reply('that message is too long Loooool')}
  if (message.content.includes('\n')) {return message.reply('cant have a message with a linebreak')}
  let attachmentEmoji = ''
  if (message.attachments.size > 0) {
  attachmentEmoji = '🖼'
  }
  try {
  if (message.reference) {
  const repliedMessage = await message.channel.messages.fetch(message.reference.messageId)
  if (repliedMessage.author.id == '1107764918293372989') {
  const minecraftAuthor = getTextUntilDelimiter(repliedMessage.content, '||').replace(/\*/g, '').trim()
  bot.chat(`/dctomc ${message.author.username} (replying to ${minecraftAuthor}) ${message.content} ${attachmentEmoji}`)
  } else {
  bot.chat(`/dctomc ${message.author.username} (replying to ${repliedMessage.author.username}) ${message.content} ${attachmentEmoji}`)
  }
  } else {
  bot.chat(`/dctomc ${message.author.username} ${message.content} ${attachmentEmoji}`)
  }
  } catch (e) {
  //this means that the server is online, but agnabot isn't on the server
  /*const waitMessage = await message.reply('oh the server is online, but im not on the server. hold on')
  await createMinecraftBot()
  waitMessage.delete()
  bot.chat(`/tellraw @a {"text":"${message.author.username} || ${message.content}","color":"dark_green"}`)*/
}
}

//duo blocked agnabot :           (
/*if (message.channel.type === 1 && message.content.includes('yukari') && message.author.id !== '1107764918293372989') {
const user = await client.users.fetch("335800596424818690").catch(() => null);
user.send(message.content)
message.reply('sent')
console.log(`${message.author.username} sent`, message.content)
}*/

if (await db.get('reminder_' + message.author.id)) {
const timeWaitingFor = await db.get('reminder_' + message.author.id);
const now = Date.now();

if (timeWaitingFor <= now) {

var role = message.member.guild.roles.cache.find(role => role.name === "high as shit brah");

if (message.member.roles.cache.has(role.id)) {
message.member.roles.remove(role);
console.log('look at this guy lol')
await db.set(message.author.id + '_time', -5);
}

    await db.delete('reminder_' + message.author.id);
    await saveSqlite();
  }
}

  const content = message.content.trim();
  if (!isNaN(content) && parseInt(content) < 13 && parseInt(content) > 3) {
    message.delete()
      .then(() => console.log(`Deleted message: "${message.content}"`))
      .catch((error) => console.error('Error while deleting message:', error));
  }


if (lockdown === 'true') {
if (message.content === 'a.unlock' || message.content === 'a.unlockdown' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
lockdown = 'false'
message.reply('im free yipee')
}
if (message.content === 'a.lockstatus') {
message.reply('locked')
}
return
}


//dumb shit

  if(message.content.includes('<@907055124503994398>','<@!907055124503994398>')) {

  if (message.author.id !== '1107764918293372989') { 
    if (message.content.includes('<@907055124503994398>','<@!907055124503994398>')) {
    message.reply('explode')
  }
  }};

    if(message.author.id!== '437808476106784770') {

  
    if(message.author.id !== '1107764918293372989' && users.includes(message.author.id) === false) {

    if (message.content.toLowerCase().includes('ohio')) {
        message.channel.send('OHIO KILLED MY GRANDMA............');
    }
    

    if (message.content.toLowerCase().includes('theophobia')) {
        message.delete();
    }

    if (message.content.toLowerCase().includes(' sus ') || message.content.toLowerCase().includes(' sussy ') && !(message.content.toLowerCase().includes('jesus'))) {
        message.channel.send('lol you are So funny LOL lol lol i am lmfao i am');
    }

    if (message.content.includes('Wild') && message.author.id !== '1107764918293372989') {
        message.reply('Wild');
    }

    if (message.content.includes('<@1107764918293372989>') && cuss.some(word => message.content.includes(word))) { 
      message.reply(cuss[getRandomInt(cuss.length)])
   }
    
    if (message.content.toLowerCase().includes('ayo') || message.content.toLowerCase().includes('🤨') || message.content.toLowerCase().includes('ayo?')) {
        message.channel.send('you are 9 years old');
    }
        
    if (message.content.toLowerCase().includes('cybergrind')) {
        message.channel.send('https://media.discordapp.net/attachments/1100521311534592041/1107968544492224532/image.png?width=197&height=585');
    }

    }
    
    if (message.content.toLowerCase().includes('agnab') && message.content.toLowerCase().includes('bad')) {
    message.author.send(`say that one more time again and you'll be sorry.`).catch(error => console.log('cant send messages to that user'));
    }

    if (message.content.toLowerCase() === 'would' || message.content.toLowerCase() === 'smash' || message.content.toLowerCase() === 'would') {
    try {
    message.author.send(`you are a degenerate`).catch(error => console.log('cant send messages to that user'));
    } catch (error) {
      console.error(error)
    }
    }
  }
    
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();
    
 //actual commands
  if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

  if (command === 'test') {
    const pet = await db.get('pet_'+message.author.id)
    console.log('ok!')
    await updatePets()
  }

  if (command === 'test2') {
    await db.set('pet_'+message.author.id+'.health', 10)
    await db.set('pet_'+message.author.id+'.affection', 10)
    await db.set('pet_'+message.author.id+'.hunger', 10)
    await updatePets()
  }

  if (command === 'test3') {
    await db.set('pet_'+message.author.id+'.health', 100)
    await db.set('pet_'+message.author.id+'.affection', 100)
    await db.set('pet_'+message.author.id+'.hunger', 100)
    await updatePets()
  }

  if (command === 'pull' && message.author.id == '765581160755363840') {
  const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** Loading...')
    exec('git merge --strategy-option theirs', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    exec('pm2 reload all', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(`stdout: ${stdout}`);
    });
    loadingMessage.delete()
    message.reply('`**<:AgnabotCheck:1153525610665214094> ||** pulled successfully')
  }

  if (command === 'giveartifact' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
  await db.add(`${message.author.id}.inv.${args[0]}.count`, 1)
  await db.push(`${message.author.id}.inv.${args[0]}.rarity`, 'uber')
  }

  if (command === 'rob') {message.reply('i just set your balance to 0 you fucking filthy criminal')}
  if (command === 'bak') {
    message.reply('lol')}

  if (command === 'mcsudo' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    bot.chat(args.join(' '))}

  if (command === 'lock' || command === 'lockdown' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    //if (!replit) {return}
    message.reply("y'all are dumb");
    lockdown = 'true';
    forceSaveSqlite();}

  if (command === 'lockstatus') {
    message.reply('open')}

  if (command === 'whitelist') {

  if (!args[0]) {return message.reply('give me a username to whitelist')}
  const minecraftUsername = args[0]
  whitelistEmbed.setDescription(`minecraft username: ${minecraftUsername}\ndiscord user: ${message.author}`)

  const confirm = new ButtonBuilder()
      .setCustomId('confirmWhitelist')
      .setLabel('confirm')
      .setStyle(ButtonStyle.Success);
  const deny = new ButtonBuilder()
      .setCustomId('denyWhitelist')
      .setLabel('deny')
      .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
  row.addComponents(confirm, deny);

  message.delete();
  message.channel.send({ embeds: [whitelistEmbed], components: [row] })}

  if (command === 'verify') {

    const playersOnline = Object.keys(bot.players)


    let select = new StringSelectMenuBuilder()
      .setCustomId('verify')
      .setPlaceholder('Choose your username')
      .addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`Cancel`)
      .setValue(`cancel`)
    )

    playersOnline.forEach((name, i) => {
    select.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`${name}`)
      .setValue(`${name}`)
    )
    })

    const row = new ActionRowBuilder()
      .addComponents(select);

    const myMessage = await message.reply({
      content: 'a reminder, you have to be on the server to use this command',
      components: [row],
    });

    const collectorFilter = i => i.user.id === message.author.id;

try {
  const confirmation = await myMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  console.log(confirmation.values[0])
  if (confirmation.values[0] === 'cancel') {return await confirmation.update({ content: '**<:AgnabotX:1153460434691698719> ||** oook bai :3', components: [] })}
  await confirmation.update({ content: `**<:AgnabotCheck:1153525610665214094> ||** chose username: ${confirmation.values[0]}
  a message will now be whispered to your player in game, please send the code given in chat
  if this was a mistake, just send "cancel"`, components: [] });
  
  const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
  console.log(code)

  bot.chat(`/w ${confirmation.values[0]} your code is: ${code}`)

  const msg_filter = (m) => m.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });
  
  if (collected.first().content == code) {
  myMessage.edit('`**<:AgnabotCheck:1153525610665214094> ||** congrats your minecraft account is now linked')
  await db.set(message.author.id+'.mc', confirmation.values[0])
  saveSqlite();
  } else {
  return myMessage.edit('**<:AgnabotX:1153460434691698719> ||** wrong code')
  }

} catch (e) {
  console.log(e)
  await myMessage.edit({ content: '**<:AgnabotX:1153460434691698719> ||** confirmation not received within 1 minute, cancelling', components: [] });
}}

  if (command === 'minecraft' || command === 'mc') {
    if (await isMinecraftOnline()) {
  try {
    const playersOnline = Object.keys(bot.players)
    let playerText = `${playersOnline.length - 1} players:`
    playersOnline.forEach((name, i) => {
    if (name == 'AGNABOT') return
    playerText = `${playerText}\n${i}. ${name}`
  })
    playerText += '\n'

    const serverEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('>=- Minecraft server -=<')
  .setDescription(`
    ===--- Online Players ---===
    ${playerText}===---                ---===
    `)
    message.channel.send({ embeds: [serverEmbed] });
  } catch (e) {

  //this means that the server is online, but agnabot isn't on the server
  const waitMessage = await message.reply('oh the server is online, but im not on the server. hold on')
  await createMinecraftBot()
  waitMessage.delete()


  }
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** server offline')
  }}

 if (command === 'leaderboard' || command === 'lb') {
    const allUserData = await db.all()

    const filtertop = allUserData.filter(data => !isNaN(data.id))
    await filtertop.sort((a, b) => b.value.a - a.value.a);

    const topUsers = filtertop.slice(0, 10);


  let descText = ''

  for (let i = 0; i !== 10; i++) {
  const user = await client.users.fetch(topUsers[i].id)
  descText = descText + `${i + 1}. ${user.username} - ${topUsers[i].value.a} agnabucks\n`
  }

  const leaderboadEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('Leaderboard')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .setDescription(descText)

  message.reply({ embeds: [leaderboadEmbed] })}

  if (command === 'ping') {
  const pingMessage = `API Latency: ${client.ws.ping}ms\nClient Latency: ${Date.now() - message.createdTimestamp}ms`
  message.reply(`${pingMessage}`)}

  if (command === 'instance') {
  await message.reply(`${os.hostname()}`)}

  if (command === 'crash' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
  await message.reply('cya')
  process.exit(0);}

  if (command === 'crashlog' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
  await message.reply({ files: ['./info/crash logs/error.txt'] })}

  if (command === 'pet') {

  const myPet = await db.get(`pet_${message.author.id}`)
  const command2 = args[0]
  const curbal = await db.get(message.author.id+'.a')

  //console.log(myPet)

  if (!command2) {

  if (!myPet || myPet === 'null') {return message.reply('you dont have a pet')}

let row = new ActionRowBuilder()

if (myPet.health + myPet.affection + myPet.hunger !== 0) {
const feed = new ButtonBuilder()
      .setCustomId('feed')
      .setLabel('Feed (10 agnabucks, 20% gain)')
      .setStyle(ButtonStyle.Success);

const play = new ButtonBuilder()
      .setCustomId('play')
      .setLabel('Play (Free, 100% gain)')
      .setStyle(ButtonStyle.Success);

const heal = new ButtonBuilder()
      .setCustomId('heal')
      .setLabel('Give medicine (50 agnabucks, 50% gain)')
      .setStyle(ButtonStyle.Success);

row.addComponents(feed, play, heal);
} else {
  const revive = new ButtonBuilder()
      .setCustomId('revive')
      .setLabel('Revive your pet. You monster. (1,000 AGNABUCKS)')
      .setStyle(ButtonStyle.Danger);

row.addComponents(revive);

}
  const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** Loading...')
  const attachment = await petImage(myPet, message.author.id)
  loadingMessage.delete()
  if (attachment === 'image') {return message.reply('you need to set an image for the pet first (a.pet image)')}
  if (attachment === 'name') {return message.reply('you need to set an name for the pet first (a.pet name)')}
try {
  const response = await message.reply({ files: [attachment], components: [row] })
} catch (e) {
  message.reply('some sorta error occured')
  console.error(e)
}

  }

  if (command2 === "buy") {
  if (myPet && myPet !== 'null') {return message.reply('you already have a pet Lol')}
  if (curbal > 1000) {
  await db.set(`pet_${message.author.id}`, defaultPet)
  return message.reply('pet bought! \nin order to get started with your pet, please use a.pet name (your pets name) and a.pet image (your image) \nwithout this your pet will not accrue agnabucks')
  await db.set(message.author.id+'.a', parseInt(curbal) - 1000) 
  await saveSqlite();
  }
  }

  if (!myPet) {return message.reply('you dont have a pet')}

  if (command2 === "disown") {
  if (myPet && myPet !== 'null') {
  await db.set(`pet_${message.author.id}`, 'null')
  message.channel.send('ok goodbye :         (')
  await saveSqlite();
  }
  }

  if (command2 === 'image') {
  try {
    saveUrl = message.attachments.first().proxyURL
  } catch (error) {
    return message.reply('you need a valid image')
  }
  await db.set(('pet_' + message.author.id) + '.image', saveUrl)
  saveSqlite();
  message.reply('ok i did it :    )')
  }

  if (command2 === 'name') {
  const shift = args.shift()
  const newName = args.join(' ')
  if (!newName) {return message.reply('come on give me a name')}
  if (newName.length >= 25) {return message.reply('shorter name please :       )')}
  await db.set(('pet_' + message.author.id) + '.name', newName)
  saveSqlite();
  message.reply(`your pets new name is ${newName}`)
  }

  if (command2 === 'background') {
  try {
    saveUrl = message.attachments.first().proxyURL
  } catch (error) {
    return message.reply('you need a valid image')
  }
  await db.set(('pet_' + message.author.id) + '.background', saveUrl)
  await saveSqlite();
  message.reply('ok i did it :    )')
  }

  if (command2 === 'color') {
  const caretaker = await hasArtifact(message.author.id, 'auraofthecaretaker')
  if (!caretaker) {return}
  const hex = args[1]
  if (!hex) {return message.reply('come on give me a hex')}
  if (!isvalidhexcode(hex)) {return message.reply('not a valid hex code')}
  await db.set(('pet_' + message.author.id) + '.hex', hex)
  saveSqlite();
  message.reply('ok i did it :    )')
  }

  if (command2 === 'subtitle') {
  const caretaker = await hasArtifact(message.author.id, 'auraofthecaretaker')
  if (!caretaker) {return}
  const shift = args.shift()
  const subtitle = args.join(' ')
  if (!subtitle) {return message.reply('come on give me a subtitle')}
  if (subtitle.length >= 25) {return message.reply('shorter subtitle please :       )')}
  await db.set(('pet_' + message.author.id) + '.subtitle', subtitle)
  saveSqlite();
  message.reply(`your pets new subtitle is ${subtitle}`)
  }
}

  if (command === 'hotel') {

  const myHotel = await db.get(`hotel_${message.author.id}`)

  const command2 = args[0]

  if (!command2) return message.reply('read the syntax please :   )')

  if (command2 === "buy") {

  curbal = await db.get(message.author.id+'.a')

  if (!myHotel || myHotel === 'undefined') {

  if (curbal > 5000) {

  const categoryId = '1130959364073717801';
  const channelName = `${message.author.username.toLowerCase()}s-room`;

    // Create the channel in the specified category
    const channel = await message.guild.channels.create({
      name: channelName,
      type: 0,
      parent: categoryId,
    });

  channel.setTopic(`owned by ${message.author.username}`);

  channel.permissionOverwrites.edit(message.author.id, { ManageMessages: true });

  await db.set(`hotel_${message.author.id}`, channel.id)

  await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 5000))

  saveSqlite();

  await channel.send(`Do not use this room to break rules.
Do not use this room to talk about people behind their backs.
If you need help, contact a mod.`)

} else {
  message.reply('stop being Poor')
}

} else {
  message.reply('you already have a room dude')
}
  }

  if (command2 === "delete") {
  if (!myHotel || myHotel === 'undefined') {
  message.reply(`you don't have a room dude`)
} else {
  await db.set(`hotel_${message.author.id}`, 'undefined')
  saveSqlite();
  client.channels.fetch(myHotel)
  .then( async channel => {
    channel.delete();
    message.reply(channel.name + ' has been deleted')
  })
  .catch(error => console.error('error deleting channel', error))
}
  }

  if (command2 === "rename" || command2 === "name") {
  const command2shifted = args.shift()
  const newName = args.join('-');

  if (!newName) {
    return message.reply('gimme a thing to rename it to')
  }

  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

    if (isValidCategoryName(newName)) {
    client.channels.cache.get(myHotel).setName(newName);
    } else {
    message.reply('thats not a valid category name')
    }
  }

}

  if (command2 === "description") {
  const command2shifted = args.shift()
  const newName = args.join(' ');

  if (!newName) {
    return message.reply('gimme a thing to set the description to')
  }

  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

    client.channels.cache.get(myHotel).setTopic(`${newName} (owned by ${message.author.username})`);

  }

}

  if (command2 === "private") {
  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(channel.guild.roles.everyone, { ViewChannel: false });
channel.permissionOverwrites.edit(message.author.id, { ViewChannel: true });
  })
  .catch(error => console.error('error privating channel', error));

  message.reply('changed permissions successfully')

  }
  }

  if (command2 === "public") {
  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(channel.guild.roles.everyone, { ViewChannel: true });
  })
  .catch(error => console.error('error privating channel', error));

  message.reply('changed permissions successfully')

  }
  }

  if (command2 === "invite") {

  const theGuy = message.mentions.users.first()

  if (!theGuy) return message.reply('gotta mention someone bro')

  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(theGuy.id, { ViewChannel: true });
  })
  .catch(error => console.error('error inviting to channel', error));

  message.reply(`${theGuy.username} can now see your hotel room`)

  }
  }

  if (command2 === "remove") {

  const theGuy = message.mentions.users.first()

  if (!theGuy) return message.reply('gotta mention someone bro')

  if (theGuy.id === message.author.id) return message.reply('bro thats literally you')

  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(theGuy.id, { ViewChannel: false });
  })
  .catch(error => console.error('error privating channel', error));

  message.reply(`${theGuy.username} can now not see your hotel room`)

  }
  }

  if (command2 === "lock") {
  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: false });
channel.permissionOverwrites.edit(message.author.id, { SendMessages: true });
  })
  .catch(error => console.error('error privating channel', error));

  message.reply('now nobody can talk in your hotel room')

  }
  }

  if (command2 === "unlock") {
  if (!myHotel || myHotel === 'undefined') {
    message.reply(`you don't have a room dude`)
  } else {

  client.channels.fetch(myHotel)
  .then(async channel => {
channel.permissionOverwrites.edit(channel.guild.roles.everyone, { SendMessages: true });
  })
  .catch(error => console.error('error privating channel', error));

  message.reply('now everybody can talk in your hotel room')

  }
  }}

  if (command === 'work') {
    const playerID = message.author.id;
    const me = await db.get(message.author.id)

    if (cooldowns.has(playerID)) {
      const expirationTime = cooldowns.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      message.reply(`**<:AgnabotX:1153460434691698719> COOLDOWN ||** ${remainingTime.toFixed(1)} seconds left`);
    } else {

    let curbal = await db.get(playerID+'.a');

    let moneyEarned = getRandomInt(50) + 50

    if (message.member.roles.cache.some(role => role.name === 'high as shit brah')) {
      moneyEarned += 100
    }

    if (message.member.roles.cache.some(role => role.name === 'AGNAB premium')) {
      moneyEarned = math.floor(moneyEarned * 1.25)
    }

    saveSqlite();

    curbal = await db.get(playerID+'.a');
    const workArrayIndex = getRandomInt(workArray.length)
    const coolAssDescription = workArray[workArrayIndex].replace(/\[money\]/g, `**${moneyEarned}**`)

      let embed = new EmbedBuilder()
        .setColor('#235218')
        .setTitle('>---=**WORK**=---<')
        .setDescription(`
        **<:AgnabotCheck:1153525610665214094> + ${moneyEarned} ||** ${coolAssDescription}`)
        .setFooter({ text: `your money is now ${curbal} || work text ${workArrayIndex}` })

      let file
      if (workArrayIndex !== 38) {
        file = new AttachmentBuilder(`./images/work/${workArrayIndex + 1}.png`, { name: 'workimage.png' })
      } else {
        if (moneyEarned !== 65) {
        file = new AttachmentBuilder(`./images/work/38.2.png`, { name: 'workimage.png' })
      } else {
        file = new AttachmentBuilder(`./images/work/38.1.png`, { name: 'workimage.png' })
      }
      }

      embed.setImage(`attachment://workimage.png`)
      
      message.reply({ embeds: [embed], files: [file] });
      const cooldownDuration = 60000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns.delete(playerID);
      }, cooldownDuration);

    await db.add(playerID+'.a', moneyEarned);
    if (me.married) {
      const auraOfDevotion = await hasArtifact(message.author.id, 'auraofdevotion')
      if (!auraOfDevotion) return;
      const percentage = (auraOfDevotion[1] / 100)
      const marriedUserId = me.married
      console.log(percentage, moneyEarned * percentage)
      await db.add(marriedUserId+'.a', Math.round(moneyEarned * percentage))
    }

    }}

  if (command === 'setmoney' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

    const targetUser = message.mentions.users.first();

    if (targetUser) {

    const userId = targetUser.id;

    const variableValue = args[1];

    if (isNumeric(variableValue)) {
    await db.set(userId+'.a', variableValue);
    await saveSqlite();
    message.channel.send('saved');
  } else {
        message.channel.send('not a number');
  }

  } else {
    message.channel.send('gotta mention someone dude')
  }}

  if (command === 'setlevel') {
    await db.set(message.author.id+'.fish.level', JSON.parse(args.join(' ')))}

  if (command === 'inv' || command === 'inventory') {
  const me = await db.get(message.author.id)
  if (!me.inv) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have an inventory')}
  const myCoolEmbed = objectPage(me.inv, 0)
  //const myCoolEmbed = objectPage(funnyObject, 0)

  const nextButton = new ButtonBuilder()
    .setCustomId('next')
    .setEmoji('➡')
    .setStyle(ButtonStyle.Success)

  if (Math.floor(Object.keys(me.inv).length / 3) === 0 || Object.keys(me.inv).length === 3) {
    nextButton.setDisabled(true)
  }

  const backButton = new ButtonBuilder()
    .setCustomId('back')
    .setEmoji('⬅️')
    .setStyle(ButtonStyle.Success)
    .setDisabled(true)

  const row = new ActionRowBuilder()
    .addComponents(backButton, nextButton);

  message.reply({ embeds: [myCoolEmbed], components: [row] })}

  if (command === 'fish') {

  if (isFishing.has(message.author.id)) {return message.reply(`**<:AgnabotX:1153460434691698719> ||** youre already fishing bro`)}
  isFishing.set(message.author.id, true)
  const me = await db.get(message.author.id)
  if (me.fish == null) {
  message.reply('**<:AgnabotX:1153460434691698719> ||** you cant FISH!!! (buy a fishing rod from the shop)')
  return
  }

  fishingEmbed.setTitle('Fishing...')
  fishingEmbed.setFooter({ text: `level ${me.fish.level} | ${me.fish.exp} exp | ${me.fish.expLevel - me.fish.exp} exp until next level` })
  let fishButton = new ButtonBuilder()
      .setCustomId('fish')
      .setLabel('aaaaaaaa this is a button')
      .setStyle(ButtonStyle.Success)
      .setDisabled(true);

const row = new ActionRowBuilder()
      .addComponents(fishButton);

  const randomTime = (getRandomInt(5) * 1000)

  const attachment = await fishingImage(message.author, 1)
  const attachment2 = await fishingImage(message.author, 2)
  const response = await message.reply({ content: 'What a nice time', embeds: [fishingEmbed], files: [attachment], components: [row] })

  const collectorFilter = i => i.user.id === response.mentions.users.first().id

  await setTimeout(async () => {


  fishButton.setDisabled(false);
  fishingEmbed.setTitle('You caught something!')
  fishingEmbed.setFooter({ text: `level ${me.fish.level} | ${me.fish.exp} exp | ${me.fish.expLevel - me.fish.exp} exp until next level` })
  await response.edit({ files: [attachment2], embeds: [fishingEmbed], components: [row] })

try {
  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 3000 });
  //response.delete();
  await fishingLoot(message, collected);
  isFishing.delete(message.author.id)



} catch (e) {
console.log(e)
await response.edit({ content: '**<:AgnabotX:1153460434691698719> ||** you did not fish in time', embeds: [], files: [], components: [] })

isFishing.delete(message.author.id)
}

  }, randomTime + 5000)}

  if (command === 'don' || command === 'doubleornothing') {

      const curbal = await db.get(message.author.id+'.a');

      const chanceBought = await db.get(message.author.id+'.slotMachine');

      let chance = 0.5;

      if (chanceBought) {
       chance = 0.6;
      }



      if (isNumeric(args[0])) {

      if (parseInt(args[0]) > 100) {
        return message.reply('canot gamble over 100');
      }

      const DONembed = new EmbedBuilder()
        .setColor('#235218')
        .setTitle('Double or Nothing');


      if (parseInt(args[0]) < parseInt(curbal) && parseInt(args[0]) > 0) {

      coinFlip = Math.random();

      if (coinFlip < chance) {
      await db.set(message.author.id+'.a', parseInt(curbal) + parseInt(args[0]));
      const newBal = parseInt(curbal) + parseInt(args[0])
      DONembed
      .setDescription('You flipped a coin, and you got heads!')
      .setFooter({ text: `Your new balance is ${newBal}`});

      message.reply({ embeds: [DONembed] })

      } else if (coinFlip > chance) {
      await db.set(message.author.id+'.a', curbal - args[0]);
      const newBal = parseInt(curbal) - parseInt(args[0])
      DONembed
      .setColor('Red')
      .setDescription('You flipped a coin, and you got tails')
      .setFooter({ text: `Your new balance is ${newBal}`});

      message.reply({ embeds: [DONembed] })
      } else {
      message.channel.send('ermmm wtf something went wrong');
      }

    } else {
      message.reply('STOP BEING POOR you donot have aneough money');
    }

      } else {
        message.reply('cant gamble nothing bro')
      }}

  if (command === 'donate') {

  const curbal = await db.get(message.author.id+'.a');
  console.log(curbal)

  const targetUser = message.mentions.users.first();

  if (targetUser && curbal) {
  const userId = targetUser.id;
  const otherGuy = await db.get(userId+'.a');

  if (!args[1] || !isNumeric(args[1]) || args[1] < 1) {
    return message.channel.send('come on bro...... cant do that')
  }

  if (userId === message.author.id) {
    return message.channel.send('LOL')
  }


  if (curbal > parseInt(args[1])) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - parseInt(args[1])) );
    await db.set(userId+'.a', parseInt(parseInt(otherGuy) + parseInt(args[1])));

    message.channel.send(`their money is now ${await db.get(userId+'.a')} agnabucks`);
    message.channel.send(`your money is now ${await db.get(message.author.id+'.a')} agnabucks`);

    await saveSqlite();

  } else {
    message.channel.send('stop being Poor');
  }

  } else {

    message.channel.send('gotta mention someone to donate to, and yknow, how much you wanna donate')
  }}

  if (command === 'loot') {

    const playerID = message.author.id;

    const helmet = await hasArtifact(playerID, 'emeraldhelmet')

    if (cooldowns3.has(playerID)) {
      const expirationTime = cooldowns3.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      return message.reply(`**<:AgnabotX:1153460434691698719> COOLDOWN ||** ${remainingTime.toFixed(1)} seconds left`);
    }

    if (!helmet) {
      return message.reply(`**<:AgnabotX:1153460434691698719> ARTIFACT ||** you don't have an emerald helmet equipped`);
    }

    await db.add(playerID+'.a', helmet[1]);

    const embed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>---=**LOOT**=---<')
      .setDescription(`
      **<:AgnabotCheck:1153525610665214094> +${helmet[1]} ||**  Lootylicious`)
      .setFooter({ text: `your money is now ${await db.get(playerID+'.a')}`})

      message.reply({ embeds: [embed] })

      const cooldownDuration = 300000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns3.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns3.delete(playerID);
      }, cooldownDuration);}

  if (command === 'redeem') {

    const playerID = message.author.id;

    if (cooldowns2.has(playerID)) {
      const expirationTime = cooldowns2.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      return message.reply(`**<:AgnabotX:1153460434691698719> COOLDOWN ||** ${remainingTime.toFixed(1)} seconds left`);
    }

    if (await hasArtifact(playerID, 'impenetrableshield')) {
      return message.reply(`**<:AgnabotX:1153460434691698719> ARTIFACT ||** impenetrable shield equipped`);
    }

    const member = message.member;

    let curbal = await db.get(playerID+'.a');

    let bonus = 0

    try {
    if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'Agnabian Royalty (Level 50)').id)) {
    bonus = 100
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'Master Agnabian (Level 35)').id)) {
    bonus = 75
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'True Agnabian (Level 25)').id)) {
    bonus = 50
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'AGNAB Novice (Level 15)').id)) {
    bonus = 30
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'AGNAB Enthusiast (Level 10)').id)) {
    bonus = 20
    saveSqlite();
    } else {
      return message.channel.send('sorry youre not a high enough level to use this yet');
    }
  } catch (e) {
    return message.channel.send('sorry youre not a high enough level to use this yet');
  }

    await db.set(playerID+'.a', parseInt(curbal) + bonus);

    const embed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>---=**REDEEM**=---<')
      .setDescription(`
      **<:AgnabotCheck:1153525610665214094> +${bonus} ||** thanks for supporting the server :     )`)
      .setFooter({ text: `your money is now ${await db.get(playerID+'.a')}`})

      message.reply({ embeds: [embed] })

      const cooldownDuration = 300000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns2.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns2.delete(playerID);
      }, cooldownDuration);}

  if (command === 'ask') {

    message.channel.sendTyping()
    cleverbot(args.join(' '),conversation)
    .then(res=>{
      conversation.push(args.join(' '))
      conversation.push(res);
      message.reply(res.toLowerCase().replace(/\./g, ''));
    })
    .catch(error => console.error(`error with ai: ${error}`))}

  if (command === 'clearconversation') {
    conversation = [];
    message.channel.send('cleared conversation')}

  if (command === 'balbackground' || command === 'balancebackground' || command === 'balimage' || command === 'balanceimage') {

  if (args[0] === 'reset') {
  await db.set('balimage_' + message.author.id, null)
  await saveSqlite()
  return message.reply('you are so Reseto')
  }

  const imageRegex = /\.(jpg|jpeg|png|gif|bmp)$/i;

  if (!args[0]) { args[0] = 'My ballsack' }

  if (!args[0].match(imageRegex)) {
    try {
    saveUrl = message.attachments.first().proxyURL
  } catch (error) {
    return message.reply('you need a valid image link or image')
  }
  } else {
    saveUrl = args[0]
  }

  await db.set('balimage_' + message.author.id, saveUrl)
  await saveSqlite();

  message.reply('ok i did it :    )')}

  if (command === 'impersonate') {
let webhookCollection = await message.channel.fetchWebhooks();
if (webhookCollection.first()) {
    webhook = webhookCollection.first();
} else {
    webhook = await message.channel.createWebhook({
      name: 'AGNABOT',
      avatar: 'https://media.discordapp.net/attachments/831714424658198532/1130627602298699796/black_cat_night_Lol.png',
    });
}

let targetUser = message.mentions.users.first();
let targetUsername = null

if (args.length < 2 || !targetUser) {
  const isValidUser = await validUserId(args[0], message)
  if (isValidUser) {
  targetUser = isValidUser
  targetUsername = targetUser.nickname
  if (!targetUsername) {
  targetUsername = targetUser.user.username
  }
  } else {
  return message.reply('read the documentation :    )')
  }
}

if (!targetUsername) {
targetUsername = targetUser.username
}
const textContent = args.slice(1).join(' ');

const messageSent = await webhook.send({
  content: textContent,
  username: targetUsername,
  avatarURL: targetUser.displayAvatarURL({ format: 'png', dynamic: true }),
});

userId = message.author.id

client.channels.cache.get('1122152368591601754').send(await messageSent.id + ' ' + userId + ' ' + args.slice(1).join(' '))

try {
message.delete()
} catch (error) {
  console.error(error)
}}

  if (command === 'buy' || command === 'shop' ) {

      let children = await db.get('children_' + message.author.id)
  if (!children) {
    childrenPrice = 1000
  } else {
    childrenPrice = 5000 * children
  }


    const curbal = await db.get(message.author.id+'.a');
    const hotelBought = await db.get(`hotel_${message.author.id}`) 
    const riggedBought = await db.get(`${message.author.id}.slotMachine`)
    const fishBought = await db.get(`${message.author.id}.fish`)
    const avacadoBought = await db.get(`${message.author.id}.avacado`)
    const verified = await db.get(`${message.author.id}.mc`)
    console.log('has premium =', message.member.roles.cache.has('1120808808655102035'))
    console.log('has weed =', message.member.roles.cache.has('1120830175114973215'))

      const select = new StringSelectMenuBuilder()
      .setCustomId('buy')
      .setPlaceholder('Click here to choose what to buy')
    
    buyArray.forEach((me, i) => {
    if (me.value === 'premium' && message.member.roles.cache.has('1120808808655102035')) {return}
    if ((me.value === 'cocaine' || me.value === 'meth' || me.value === 'alcohol') && message.member.roles.cache.has('1120830175114973215')) {return}
    if (me.value === 'hotel' && hotelBought) {return}
    if (me.value === 'rigged' && riggedBought) {return}
    if (me.value === 'fish' && fishBought) {return}
    if (me.value === 'avacado' && avacadoBought) {return}
    if (me.value === 'name' && !message.member.guild.roles.cache.find(role => role.name === "Minecraft Participant")) {return}
    if (me.value === 'head' && !verified) {return}
    select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(me.label)
        .setDescription(me.description.replace(/\[money\]/g, childrenPrice))
        .setValue(me.value)
        .setEmoji(me.emoji),
    );
    })

    const row = new ActionRowBuilder()
      .addComponents(select);

const response = await message.reply({
  content: `choose what you want to buy`,
  components: [row],
});

const collectorFilter = i => i.user.id === message.author.id;

try {
  const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (confirmation.user.id !== message.author.id) {
  return message.channel.send(`${confirmation.user} you cant buy using someone else's buy command bro`)
  }
  response.delete()

switch (confirmation.values[0]) {

case 'cancel':
message.reply('**<:AgnabotX:1153460434691698719> ||** oook bai bai :3')
break;

case 'hotel':
message.reply('**<:AgnabotX:1153460434691698719> ||** dude use a.hotel buy :   (')
break;
  
case 'cocaine':
if (curbal > 10000) {
await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 10000));
message.reply('https://cdn.discordapp.com/attachments/831714424658198532/1119014960127811655/Martin_Cabello_-_Cocaina_No_Flour_Original_video_online-video-cutter.com.mp4')
const reminderTime = Date.now() + 60 * 24 * 60 * 1000; 
await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
await saveSqlite();
const role = message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
message.member.roles.add(role);
} else {
message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
}
break;

case 'meth':
    if (curbal > 1000) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 1000));
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** high as shit brah')
    const reminderTime = Date.now() + 60 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    await saveSqlite();
    const role= message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    message.member.roles.add(role);
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'alcohol':
    if (curbal > 100) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 100));
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** i too am also a crippling alcoholic')
    const reminderTime = Date.now() + 1 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    await saveSqlite();
    const role = message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    message.member.roles.add(role);
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'premium':
    if (curbal > 10000) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 10000));
    message.reply('**<:AgnabotCheck:1153525610665214094> ||**  you are so premium broski')
    const role = message.member.guild.roles.cache.find(role => role.name === "AGNAB Premium");
    message.member.roles.add(role);
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'bomb':
    if (curbal > 1000) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 1000));
    const muteGuy = message.mentions.members.first();
    const auraOfDeflection = await hasArtifact(muteGuy.id, 'auraofdeflection')
    if (muteGuy.id == '1107764918293372989') {return message.reply('noob')}
    if (muteGuy) {
      const cooldownDuration = 60000;
      const expirationTime = Date.now() + cooldownDuration;
      const randomChance = getRandomInt(99) + 1
      console.log(randomChance, auraOfDeflection[1])
      if (randomChance <= auraOfDeflection[1]) {
        message.member.timeout(cooldownDuration)
        message.reply(`**<:AgnabotCheck:1153525610665214094> ||** **(AURA OF DEFLECTION CAUSED BOMB TO BACKFIRE)** \n<@${message.author.id}> you just got MUTED! what a nerd.........................`)
      } else {
        muteGuy.timeout(cooldownDuration)
        message.reply(`**<:AgnabotCheck:1153525610665214094> ||** <@${muteGuy.id}> you just got MUTED! what a nerd.........................`)
      }

      setTimeout(() => {
        message.channel.send(`<@${muteGuy.id}> your mute is over`);
      }, cooldownDuration);

    } else {
      message.reply('**<:AgnabotX:1153460434691698719> ||** gotta mention someone bro')
    }
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
  }
break;

case 'rigged':
    if (curbal > 5000) {
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** lol you Cheat')
    await db.set(message.author.id+'.slotMachine', true);
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 5000));
    await saveSqlite();
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'tts':
    if (curbal > 100) {

    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 100));
    const passes = await db.get(message.author.id+'.inv.ttspasses');

    await db.set(message.author.id+'.inv.ttspasses', passes + 1);
    if (!passes) {await db.set(message.author.id+'.inv.ttspasses', 1);}

    message.reply(`**<:AgnabotCheck:1153525610665214094> ||** wow this will certainly not get annoying\nyou have ${await db.get(message.author.id+'.inv.ttspasses')} tts passes`)

    await saveSqlite();

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'speechbubble':
    if (curbal > 200) {

    const channel = client.channels.cache.get('1085289780901842996');
    const messages = await channel.messages.fetch();
    const attachments = messages.filter((msg) => msg.attachments.size > 0 || msg.content.includes('https'));

    if (attachments.size === 0) {
      return console.log('No attachments found in the channel.');
    }

    const randomMessage = attachments.random();

    if (randomMessage.content.includes('https')) {
      if (randomMessage.author.id !== '1107764918293372989') {
        const words = randomMessage.content.split(' ');
        message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${words[0]}`)
        client.channels.cache.get('1085289780901842996').send(`${words[0]} ${message.author.username}`)
        randomMessage.delete();
      } else {

      const words = randomMessage.content.split(' ');
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${words[0]}`)
      randomMessage.edit(`${words[0]} ${message.author.username}`)
    }
    } else {
      if (randomMessage.author.id !== '1107764918293372989') {
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${randomMessage.attachments.first().url}`)
      client.channels.cache.get('1085289780901842996').send(`${randomMessage.attachments.first().url} ${message.author.username}`)
      randomMessage.delete();
      } else {
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${randomMessage.attachments.first().url}`)
      randomMessage.edit(`${randomMessage.attachments.first().url} ${message.author.username}`)
    }
    }
  await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 200));
  await saveSqlite();
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
  }
break;

case 'child':
    if (curbal > childrenPrice-1) {


    let newChildren = 0
    if (!children) {
      newChildren = 1
      await db.set('children_'+message.author.id, 1);
    } else {
      if (children === 10) {return message.reply('you have 10 already')}
      newChildren = children + 1
      await db.set('children_'+message.author.id, children + 1);
    }
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - childrenPrice));

    message.reply(`**<:AgnabotCheck:1153525610665214094> ||**  wowie zowie thats crazy now you have ${newChildren} agnabucks per 5 minute`)

    await saveSqlite();

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'ring':
    if (curbal > 10000) {

    let rings = await db.get(message.author.id+'.inv.rings')
    console.log(!rings)

    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 10000));
    await db.set(message.author.id+'.inv.rings', rings + 1);
    if (!rings) {await db.set(message.author.id+'.inv.rings', 1)}

    saveSqlite();

  message.reply('**<:AgnabotCheck:1153525610665214094> ||** congrats Yipee')

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'fish':
    if (curbal > 5000) {
    let rings = await db.get(message.author.id+'.fish')

    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 5000));
    await db.set(message.author.id+'.fish', { level: 0, exp: 0, expLevel: 100 });

    saveSqlite();

    message.reply('**<:AgnabotCheck:1153525610665214094> ||** this feature is currently a wip btw')

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'avacado':
    if (curbal > 100000) {
    message.reply({ content: '**<:AgnabotCheck:1153525610665214094> ||** congrats here is your avacado', files: [ './images/avacado.png' ] })
    await db.set(message.author.id+'.avacado', true);
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 100000));
    await saveSqlite();
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'head':
    if (curbal > 25000) {
    try {
    if (!await isMinecraftOnline()) return message.reply('**<:AgnabotX:1153460434691698719> ||** server offline, sorry')
    const mcUsername = await db.get(message.author.id+'.mc')
    const playersOnline = Object.keys(bot.players)
    if (!playersOnline.includes(mcUsername)) return message.reply('**<:AgnabotX:1153460434691698719> ||** get on the server first')
    bot.chat(`/give ${mcUsername} minecraft:player_head{SkullOwner:${mcUsername}}`)
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** it should be in your inventory now')
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 25000));
    await saveSqlite();
  } catch (e) {
    message.reply('**<:AgnabotX:1153460434691698719> ||** sorry an error occured')
  }
    } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'name':
if (curbal > 50000) {
const mcUsername = await db.get(message.author.id+'.mc')
if (!await isMinecraftOnline()) return message.reply('**<:AgnabotX:1153460434691698719> ||** server offline, sorry')
if (!mcUsername) return message.reply('**<:AgnabotX:1153460434691698719> ||** link your account first with a.verify')
const playersOnline = Object.keys(bot.players)
if (!playersOnline.includes(mcUsername)) return message.reply('**<:AgnabotX:1153460434691698719> ||** get on the server first')
message.reply('**<:AgnabotCheck:1153525610665214094> ||** cool, now say the hex code')
const msg_filter = (m) => m.author.id === message.author.id;
const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });
  
if (isvalidhexcode(collected.first().content)) {
message.reply('**<:AgnabotCheck:1153525610665214094> ||** CONGRATS it worked')
bot.chat(`wow ${mcUsername} just set their color to something else CONGRATS`)
bot.chat(`/chatformathex ${mcUsername} ${collected.first().content}`)
await saveSqlite();
} else {
  return message.reply('**<:AgnabotX:1153460434691698719> ||** not a valid hex code')
}

} else {
message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
}
break;

}

} catch (e) {
  console.error(e)
  await response.edit({ content: '**<:AgnabotX:1153460434691698719> ||** Confirmation not received within 1 minute, cancelling', components: [] });
}}

  if (command === 'fight') {

  const mentionedUser = message.mentions.users.first()
    if (!mentionedUser) {
      message.channel.send('you need to mention the person you want to fight');
      return;
    }

    if (mentionedUser.bot) {
      message.channel.send('bots cannot be fought');
      return;
    }

    if (inFight) {return message.channel.send('already a battle in progress!')} 

    message.channel.send(`${message.author.username} has challenged ${mentionedUser.username} to a fight! react with ✅ to accept`);

    try {
      const filter = (reaction, user) => user.id === mentionedUser.id;
      const collector = message.createReactionCollector(filter, { time: 10000 });

      collector.on('collect', async (reaction, user) => {
        if (reaction.emoji.name === '✅' && user.id === mentionedUser.id) {

          inFight = true;

          message.channel.send('The fight begins!');
          player1Health = 5
          player2Health = 5
        for (let i = 0; i < 11; i++) {
        if (inFight) {
          if (player1Health < 1) {
          testEmbed.setDescription(`${mentionedUser.username} wins! game has ended`)
          const attachment = await podium(mentionedUser, message.author) 
          message.channel.send({ embeds: [testEmbed], files: [attachment] })
          inFight = false;
          break;
          } else if (player2Health < 1) {
          testEmbed.setDescription(`${message.author.username} wins! game has ended`)
          const attachment = await podium(message.author, mentionedUser) 
          message.channel.send({ embeds: [testEmbed], files: [attachment] })
          inFight = false;
          break;
          } else if (i == 11) {
          message.channel.send(`Time's up! Lets see who won...`)
          const coolMessage = message.channel.send(`drumroll please...`)
          setTimeout( async () => {
          coolMessage.delete();
          if (player1Health > player2Health) {
          message.channel.send(`${message.author} wins with ${player1Health} health!`)
          const attachment = await podium(message.author, mentionedUser) 
          message.channel.send({ files: [attachment] })
          } else if (player1Health < player2Health) {
          message.channel.send(`${mentionedUser} wins with ${player2Health} health!`)
          const attachment = await podium(mentionedUser, message.author) 
          message.channel.send({ files: [attachment] })
          } else {
          message.channel.send(`It's a draw!`)
          }
          }, 1000);
          inFight = false;
          break;
          } else {
          await startFight(message.author, mentionedUser, message.channel);
        }
      } else {
        break;
      }
        }
          playersInFight.delete(message.author.id);
          playersInFight.delete(mentionedUser.id);
        }
      });

      collector.on('end', (collected, reason) => {
        if (reason === 'time') {
          message.channel.send('the fight did not start as the challenge was not accepted in time');
          playersInFight.delete(message.author.id);
          playersInFight.delete(mentionedUser.id);
        }
      });

      await message.react('✅');
    } catch (error) {
      console.error('Error occurred during fight:', error);
      playersInFight.delete(message.author.id);
      playersInFight.delete(mentionedUser.id);
    }}

  if (command === 'quote') {

  try {

  if (!message.reference) {return message.reply('reply to a message NOW!!!!!!!!!!')}

  const repliedMessage = await message.channel.messages.fetch(message.reference.messageId)
  if (!repliedMessage.content) {return message.reply('that message does NOT have text!')}

      const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** Loading...')

    const canvas = Canvas.createCanvas(500, 250);
    const context = canvas.getContext('2d');

  context.fillStyle = 'white';

  // Draw a rectangle with the dimensions of the entire canvas
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'black';
  context.lineWidth = 5;

  // Draw a rectangle with the dimensions of the entire canvas
  context.strokeRect(50, 50, canvas.height - 100, canvas.height - 100);

  const { body } = await request(repliedMessage.author.displayAvatarURL({ extension: 'jpg' }));
  const avatar = await Canvas.loadImage(await body.arrayBuffer());
  context.drawImage(avatar, 50, 50, canvas.height - 100, canvas.height - 100);
  
  const gradient = await Canvas.loadImage('./images/gradient.png');
  context.drawImage(gradient, -200, 0, canvas.width + 200, canvas.height);

  context.font = 'bold 20px Arial'

  const textArray = splitText(context, '"'+repliedMessage.content+'"')
  console.log(textArray.length)

  for (let i = 0; i < textArray.length; i++) {

  const textUh = textArray[i]

  context.strokeText(textUh, canvas.width / 2 - (context.measureText(textUh).width / 2) + 120, canvas.height / 2 + (25 * i) - 50);
  context.fillText(textUh, canvas.width / 2 - (context.measureText(textUh).width / 2) + 120, canvas.height / 2 + (25 * i) - 50)
}

  context.fillStyle = 'gray';

  context.fillRect(canvas.width / 2 + 100, canvas.height / 2 + (textArray.length * 25) - 50, 40, 5);
  context.font = 'bold 10px Arial'
  context.fillText(`- ${repliedMessage.author.username}`, canvas.width / 2 - (context.measureText(`- ${repliedMessage.author.username}`).width / 2) + 120, canvas.height / 2 + (textArray.length * 25) - 25)

  context.strokeStyle = 'white'
  context.lineWidth = 5
  context.strokeRect(0, 0, canvas.width, canvas.height);

  const pngData = await canvas.encode('png')
  await promises.writeFile('./images/quote.png', pngData)

  const image = await Jimp.read('./images/quote.png')
  await image.color([{apply:'greyscale', params: [10]}])
  .write('./images/quote.png');

  const attachment = new AttachmentBuilder('./images/quote.png', { name: 'quote.png' });
  loadingMessage.delete()
  message.reply({ files: [attachment] });
    } catch (err) {
      console.error('Error occurred:', err);
    }}

  //reminder to reformat this command later
  if (command === 'help') {

      const select = new StringSelectMenuBuilder()
      .setCustomId('starter')
      .setPlaceholder('Click here to choose the help menu')
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel('Cancel')
          .setDescription('deletes this menu')
          .setValue('cancel'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Fun')
          .setDescription('brings up agnabots fun commands (a.impersonate, a.say, a.seed, etc)')
          .setValue('fun'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Utility')
          .setDescription('brings up agnabots utility commands (a.freedomunits, a.timer, a.calculator, etc)')
          .setValue('utility'),
        new StringSelectMenuOptionBuilder()
          .setLabel('AGNABANK')
          .setDescription('brings up agnabot commands having to do with money (a.work, a.redeem, a.shop, etc)')
          .setValue('agnabank'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Hotel')
          .setDescription('brings up agnabots hotel commands (get started with a.hotel buy)')
          .setValue('hotel'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Pets')
          .setDescription('brings up agnabots pet related commands')
          .setValue('pets'),
        new StringSelectMenuOptionBuilder()
          .setLabel('Admin')
          .setDescription('brings up commands that can only be used by administrators')
          .setValue('admin'),
      );

    const row = new ActionRowBuilder()
      .addComponents(select);

const response = await message.reply({
  content: `heres all the help menus`,
  components: [row],
});

const collectorFilter = i => i.user.id === message.author.id;

try {
  const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  response.delete()
  message.delete()

if (confirmation.values[0] === 'cancel') {
message.channel.send('oook bai bai :3')
}

if (confirmation.values[0] === 'fun') {
message.channel.send({ embeds: [funEmbed] })
}

if (confirmation.values[0] === 'utility') {
message.channel.send({ embeds: [utilityEmbed] })
}

if (confirmation.values[0] === 'agnabank') {
message.channel.send({ embeds: [bankEmbed] })
}

if (confirmation.values[0] === 'hotel') {
message.channel.send({ embeds: [hotelEmbed] })
}

if (confirmation.values[0] === 'pets') {
message.channel.send({ embeds: [petEmbed] })
}

if (confirmation.values[0] === 'admin') {
message.channel.send({ embeds: [adminEmbed] })
}
} catch (error) {

}

if (args[0] === 'fun') {


  message.channel.send({ embeds: [felpEmbed] });
} else if (args[0] === 'utility') {

  message.channel.send({ embeds: [uelpEmbed] });
} else if (args[0] === 'agnabank') {

  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [belpEmbed] });

} else if (args[0] === 'admin') {

  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [delpEmbed] });
} else if (args[0] === 'hotel') {

}}
  
  if (command === 'credits') {
  const arembed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('Credits')
  .addFields(
    { name: 'AGNAB', value: 'most commands and p much everything' },
    { name: 'pirate_zip', value: '24/7 server and replit (things agnab is too dumb to figure out)' },
    { name: 'aether & granderutai', value: 'agnabot documentation' },
    { name: 'strats', value: 'hosting a bot on his old laptop' },
    { name: 'shubibubi', value: 'fishing sprites (https://shubibubi.itch.io)' },
  )
  .setFooter({ text: 'want to be added here? contact me!' });
  message.channel.send({ embeds: [arembed] });}
     
  if (command === 'setstatus') {
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
    }}

  if (command === 'define') {
    const searchQuery = args.join(' ');
    if (!searchQuery) {
      return message.reply('gimme a word');
    }

    try {
      const result = await fetch(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(searchQuery)}`);
      const data = await result.json();

      if (data.list.length === 0) {
        return message.reply('couldnt find any results');
      }

      const [definition] = data.list;
      const embed = new EmbedBuilder()
        .setColor('#235218')
        .setTitle(definition.word)
        .setURL(definition.permalink)
        .setDescription(definition.definition)
        .setFooter({ text: `written by ${definition.author}` })
        .addFields(
          { name: 'Example', value: definition.example},
          { name: '👍', value: definition.thumbs_up.toString()},
          { name: '👎', value: definition.thumbs_down.toString()});

      message.channel.send({ embeds: [embed] });
    } catch (error) {
      console.error('Error retrieving data from Urban Dictionary:', error);
      message.reply('error happene OH NO!!!!!!!!');
    }}
  
  if (command === 'balance' || command === 'bal') {

  
    let targetUser = message.mentions.users.first();

    if (targetUser) {
    const userId = targetUser.id;
    const variableValue = await db.get(userId+'.a');
    console.log(await db.get(userId))
    console.log(await db.get('pet_'+userId))


    if (!variableValue) {
  const userId = targetUser.id;
  await db.set(userId+'.a', 100);
  saveSqlite();
  const variableValue = await db.get(userId+'.a');
  //message.reply(`their money is ${variableValue} agnabucks`);

    } else { 
  const attachment = await balance(targetUser) 
  const curbal = await db.get(targetUser.id+'.a')
  balEmbed.setFooter({ text: `${curbal}` })
  balEmbed.setTitle(`>---=${targetUser.username}'s balance=---<`)
  message.reply({ embeds: [balEmbed], files: [attachment] })
  }

  } else {

    let targetUser = message.author;

    if (targetUser) {
    const userId = targetUser.id;
    const variableValue = await db.get(userId+'.a');
    console.log(await db.get(userId))
    console.log(await db.get('pet_'+userId))

    if (!variableValue) {
  const userId = targetUser.id;
  await db.set(userId+'.a', 100);
  saveSqlite();
  const variableValue = await db.get(userId+'.a');
  //message.reply(`your money is ${variableValue} agnabucks`);

    } else { 
  const attachment = await balance(targetUser) 
  const curbal = await db.get(targetUser.id+'.a')
  balEmbed.setFooter({ text: `${curbal}` })
  balEmbed.setTitle(`>---=<  ${targetUser.username}'s balance  >=---<`)
  message.reply({ embeds: [balEmbed], files: [attachment] })
  }


  }

}}

  if (command === 'addcategory') {
    if (args.length === 0) {
      message.channel.send('Please provide a category name.');
      return;
    }

    try {
    
    message.delete();

  } catch (error) {
    console.log(error);
  }

    const categoryName = args.join(' ');

    const sentMessage = await message.channel.send(categoryName);
    await sentMessage.react('👍');

    const filter = (reaction, user) => reaction.emoji.name === '👍' && !user.bot;
    const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

    collector.on('collect', async (reaction) => {
      if (reaction.count === 5) {
        await db.push('category', categoryName);
        message.channel.send(`Category "${categoryName}" has been added.`);
        collector.stop();
      }
    });

    // Event listener for the collector end event
    collector.on('end', (collected, reason) => {
      if (reason === 'time') {
        // Remove the thumbs up reaction if the collector times out
        sentMessage.reactions.cache.get('👍').users.remove(client.user);
        message.channel.send('Command timed out. Please try again.');
      }
    });}
  
  if (command === 'forcecategory' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    // Check if any category name was provided after the command
    if (args.length === 0) {
      message.channel.send('Please provide a category name.');
      return;
    }

    // Join the arguments into a single string
    const categoryName = args.join(' ');
        await db.push('category', categoryName);
        message.channel.send(`Category "${categoryName}" has been added.`);}

  if (command === 'toggleautoreact' || command === 'tar') {
    if (!(users.includes(message.author.id))) {
      users.push(message.author.id);
      message.channel.send(`my bad`);
      saveStopUsers()
    } else {
  const index = users.indexOf(message.author.id);
  if (index > -1) { // only splice array when item is found
    users.splice(index, 1); // 2nd parameter means remove one item only
  }
    message.channel.send(`im back baby`);
    saveStopUsers()
    }}

  if (command === 'say') {
    if (!await db.get('locked_' + message.author.id)) {
    if (args.length === 0) {
      message.channel.send('i cant just say nothing bro');
      return;
    }

    if (message.reference) {

    const repliedMessage = message.reference;

    const repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);

    if (repliedMessage) {

    repliedMessageFull.reply(args.join(' '));

    } 
    } else {

    const messageSent = await message.channel.send(args.join(' '))

    userId = message.author.id

    client.channels.cache.get('1122152368591601754').send(await messageSent.id + ' ' + userId + ' ' + args.join(' '))

    }
    try {
    message.delete()
  } catch (error) {
    console.log(error);
  }
}}

  if (command === 'reveal') {
        const repliedMessageID = message.reference?.messageId;
        const repliedMessageFull = await message.channel.messages.fetch(repliedMessageID);
    if (!message.reference) {
      return message.channel.send('reply to the message Broski');
    }

    const targetChannel = client.channels.cache.get('1122152368591601754');

    const targetMessages = await targetChannel.messages.fetch({ limit: 100 }); // Adjust the limit as per your requirements

    let matchingMessages = targetMessages.filter((msg) =>
      msg.content.includes(repliedMessageID)
    );

    if (matchingMessages.size === 0) {
      return message.channel.send('couldnt find that');
    }

    const matchingMessageIDs = matchingMessages.map((msg) => msg.content.trim().split(' '))

    const userName = client.users.cache.get(Array.from(matchingMessageIDs)[0][1]);


        const revealEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle(`${userName.username}`)
      .setDescription(`${userName.username} sent "${repliedMessageFull.content}"`)
      .setImage(userName.displayAvatarURL({ format: 'png', dynamic: true }));

        message.channel.send({ embeds: [revealEmbed] });}

  if (command === 'showcategories') {
    const categoryNames = await db.get('category')
    if (categoryNames.length === 0) {
      message.channel.send('its blank bro');
      return;
    }
    const categoriesMessage = categoryNames.map((category, index) => `${index + 1}. ${category}`).join('\n');
    const filename = `${Date.now()}_text.txt`
    fs.writeFileSync(filename, categoriesMessage);
    await message.reply({ files: [filename] });
    fs.unlinkSync(filename);}

  
if (command === 'deletecategory') {
 if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    if (args.length === 0) {
      message.channel.send('gimme the index to delete');
      return;
    }

    const index = parseInt(args[0], 10);

    if (isNaN(index) || index < 1 || index > await db.get('category').length) {
      message.channel.send('cant delete that bro');
      return;
    }

    const categoryNames = await db.get('category')
    const toPull = categoryNames[index - 1]
    const deletedCategory = await db.pull('category', toPull);
    message.channel.send(`deleted "${toPull}"`);
    
   } else {
    message.channel.send(`lol no perms`);
    }

  }

    if (command === 'sb' || command === 'speechbubble') {
    const channel = client.channels.cache.get('1085289780901842996');
    const messages = await channel.messages.fetch();
    const attachments = messages.filter((msg) => msg.attachments.size > 0 || msg.content.includes('https'));
    if (attachments.size === 0) {
      return console.log('No attachments found in the channel.');
    }

    const randomMessage = attachments.random();

    let repliedMessageFull = null;

    if (message.reference) {
    const repliedMessage = message.reference;
    repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);
    }

    message.delete()

    const words = randomMessage.content.split(' ');
    
    if (randomMessage.content.includes('https')) {

      if (!repliedMessageFull) {
      message.channel.send(words[0]);
    } else {
      repliedMessageFull.reply(words[0]);
    }

      if (words[1]) {

      message.channel.send(`(this speechbubble is property of ${words[1]})`)

    }

    } else {

      if (!repliedMessageFull) {
      message.channel.send(randomMessage.attachments.first().url);
    } else {
      repliedMessageFull.reply(randomMessage.attachments.first().url); 
    }

    }

  }

  if (command === 'fsb' || command === 'furryspeechbubble') {
    message.delete()

        const files = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name)',
      orderBy: 'createdTime desc'
    });

    const randomIndex = Math.floor(Math.random() * files.data.files.length);
    const randomFile = files.data.files[randomIndex];

    const waitMessage = await message.channel.send('downloading...')
    const filePath = `./temp/${randomFile.name}`;
    const dest = fs.createWriteStream(filePath);
    await drive.files.get(
      { fileId: randomFile.id, alt: 'media' },
      { responseType: 'stream' }
    ).then(res => {
      return new Promise((resolve, reject) => {
        res.data
          .on('end', () => {
            console.log(`Downloaded ${randomFile.name} from Google Drive.`);
            resolve();
          })
          .on('error', err => {
            console.error(`Error downloading file from Google Drive: ${err}`);
            reject(err);
          })
          .pipe(dest);
      });
    });

    console.log(filePath)
    waitMessage.delete()

    const furryFile = await readFile(filePath);
    const furry = new Image();
    furry.src = furryFile

    console.log(furry.width, furry.height)
    const canvas = Canvas.createCanvas(furry.width, furry.height);
    const context = canvas.getContext('2d');

    context.drawImage(furry, 0, 0, canvas.width, canvas.height);
    const speechBubbleImage = await Canvas.loadImage('./images/speechbubble.png');
    context.drawImage(speechBubbleImage, 0, 0, canvas.width, canvas.height / 8);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'speechbubble.png' });

        if (message.reference) {
    const repliedMessage = message.reference;
    const repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);
    if (repliedMessage) {
    await repliedMessageFull.reply({ files: [attachment] });
    } 
  } else {
    await message.channel.send({ files: [attachment] })
  }

    fs.unlinkSync(filePath);
  }

    if (command === 'freedomunits' || command === 'fu' || command === 'convert') {
    if (args.length !== 3) {
      return message.channel.send('gimme the right unit');
    }

    const value = parseFloat(args[0]);
    const fromUnit = args[1].toLowerCase();
    const toUnit = args[2].toLowerCase();

    const embed = new EmbedBuilder().setColor('#235218')

    if (isNaN(value)) {
      return message.channel.send('thats not a cool value WTF');
    }

    let result;
    let fromUnitLabel;
    let toUnitLabel;

    if (fromUnit === 'centimeters' && toUnit === 'inches') {
      result = value / 2.54;
      fromUnitLabel = 'centimeters';
      toUnitLabel = 'inches';
    } else if (fromUnit === 'inches' && toUnit === 'centimeters') {
      result = value * 2.54;
      fromUnitLabel = 'inches';
      toUnitLabel = 'centimeters';
    } else if (fromUnit === 'feet' && toUnit === 'meters') {
      result = value / 3.281;
      fromUnitLabel = 'feet';
      toUnitLabel = 'meters';
    } else if (fromUnit === 'meters' && toUnit === 'feet') {
      result = value * 3.281;
      fromUnitLabel = 'meters';
      toUnitLabel = 'feet';
    } else if (fromUnit === 'yards' && toUnit === 'meters') {
      result = value / 1.094;
      fromUnitLabel = 'yards';
      toUnitLabel = 'meters';
    } else if (fromUnit === 'meters' && toUnit === 'yards') {
      result = value * 1.094;
      fromUnitLabel = 'meters';
      toUnitLabel = 'yards';
    } else if (fromUnit === 'miles' && toUnit === 'kilometers') {
      result = value * 1.609;
      fromUnitLabel = 'miles';
      toUnitLabel = 'kilometers';
    } else if (fromUnit === 'kilometers' && toUnit === 'miles') {
      result = value / 1.609;
      fromUnitLabel = 'kilometers';
      toUnitLabel = 'miles';
    } else {
      return message.channel.send('cant convert those, use a.help utility for list of syntax');
    }

    embed.setTitle(`${value} ${fromUnitLabel} is approximately ${result.toFixed(2)} ${toUnitLabel}.`);

    message.reply({ embeds: [embed] })
  }

        if (command === 'furry') {

    const files = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name)',
      orderBy: 'createdTime desc'
    });

    const randomIndex = Math.floor(Math.random() * files.data.files.length);
    const randomFile = files.data.files[randomIndex];

    const waitMessage = await message.channel.send('downloading...')
    const filePath = `./temp/${randomFile.name}`;
    const dest = fs.createWriteStream(filePath);
    await drive.files.get(
      { fileId: randomFile.id, alt: 'media' },
      { responseType: 'stream' }
    ).then(res => {
      return new Promise((resolve, reject) => {
        res.data
          .on('end', () => {
            console.log(`Downloaded ${randomFile.name} from Google Drive.`);
            resolve();
          })
          .on('error', err => {
            console.error(`Error downloading file from Google Drive: ${err}`);
            reject(err);
          })
          .pipe(dest);
      });
    });

    console.log(filePath)
    waitMessage.delete()
    if (args[0] === 'speechbubble' || args[0] === 'sb') {

    const furryFile = await readFile(filePath);
    const furry = new Image();
    furry.src = furryFile

    console.log(furry.width, furry.height)
    const canvas = Canvas.createCanvas(furry.width, furry.height);
    const context = canvas.getContext('2d');

    context.drawImage(furry, 0, 0, canvas.width, canvas.height);
    const speechBubbleImage = await Canvas.loadImage('./images/speechbubble.png');
    context.drawImage(speechBubbleImage, 0, 0, canvas.width, canvas.height / 8);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'speechbubble.png' });

        if (message.reference) {
    const repliedMessage = message.reference;
    const repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);
    if (repliedMessage) {
    repliedMessageFull.reply({ files: [attachment] });
    } 
  } else {
    await message.channel.send({ files: [attachment] });
  }

    message.delete()

    } else {
    await message.channel.send({ files: [`./temp/${randomFile.name}`] });
  }

    fs.unlinkSync(filePath);
  }


  if (command === 'calculator' || command === 'calc') {
    if (args.length < 1) {
      return message.reply('gimme an expression');
    }

    const expression = args.join(' ');
    let result = '';

    try {
      result = eval(expression);
      if (expression === '9 + 10' || expression === '9+10') {
        result = 21
      }
    } catch (error) {
      return message.reply('i cant eval that');
    }

    const embed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('Calculator')
      .addFields(
      { name: 'Expression', value: `${expression}` }, 
      { name: 'Result', value: `${result}` }
      );

    message.reply({ embeds: [embed] });
  }

  if (command === 'ban') {

    if (!inBan) {

    const targetUser = message.mentions.members.first();

    if (!targetUser) {
      return message.channel.send('gimme a guy come on');
    }

    if (targetUser.user.username === 'agnab') {
      return message.reply('LOL you Canot ban the owner');
    }

    if (targetUser.user.username === 'AGNABOT') {
      return message.reply('you are Stupid');
    }

const banMessage = await message.channel.send(`*attempting to ban ${targetUser.user.username.toLowerCase()}*`)

    // Creating a countdown from 5 to 1
    let countdown = 10;
    inBan = true;
    const countdownInterval = setInterval( async () => {
      if (countdown > 0) {
        if (countdown > 3) {
        banMessage.edit(`USER ${targetUser.user.username.toUpperCase()} WILL BE BANNED IN ${countdown}...`);
      } else {
        banMessage.edit(`**USER ${targetUser.user.username.toUpperCase()} WILL BE BANNED IN ${countdown}...**`);
      }
        countdown--;
      } else {
        clearInterval(countdownInterval);
        message.channel.send(`USER ${targetUser.user.username.toUpperCase()} HAS BEEN BANNED.`);
        banMessage.delete();
        inBan = false;



        if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
          const mutedRole = message.guild.roles.cache.find(role => role.name === 'muted');
          if (mutedRole) {
            targetUser.roles.add(mutedRole);
            setTimeout(() => {
              targetUser.roles.remove(mutedRole);
            }, 10000);
          }
        }
      }
    }, 1000);
  }
  }


    if (command === 'fart') {
    // Perform fart action here

    // Play fart sound in the user's voice channel (if available)
    if (message.member.voice.channel) {
      const voiceChannel = message.member.voice.channel;
      const connection = await joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

    const streamOptions = {
      seek: 0,
      volume: 0.9,
      bitrate: 'auto',
      passes: 3,
      quality: 'highestaudio',
    }

    setTimeout(async () => {
    const resource = await createAudioResource('./audio/peak.mp3');
    subscription = await connection.subscribe(player);
    const dispatcher = player.play(resource);
    }, 1000);

    player.addListener("stateChange", async (oldOne, newOne) => {

    if (newOne.status == "idle") {
      try {
      const gid = message.guild.id
      player.stop();
      voice.getVoiceConnection(gid).disconnect();
      getVoiceConnection(gid).destroy();
      } catch (error) {}
    }

  });

    } else {
      // Send a message if the user is not in a voice channel
      message.reply("You need to be in a voice channel to fart!");
    }
  }

  if (command === 'stats') {

let hasBonus = '❌ \n*(get this with agnab premium, adds a +25% bonus to a.work)*'
if (message.member.roles.cache.some(role => role.name === 'AGNAB Premium')) {
hasBonus = '✅'
}
let hasChance = '❌ \n*(get this with rigged slot machine, increases a.don chance to 60%)*'
if (await db.get(message.author.id+'.slotMachine')) {
hasChance = '✅'
}
let isMarried = '❌ \n*(use a.marry after you buy a ring from the shop)*'
if (await db.get(message.author.id+'.married')) {
isMarried = `✅ (married to ${client.users.fetch(await db.get(message.author.id+'.married')).username})`
}

let petText = 'you dont have a pet'
const myPet = await db.get('pet_' + message.author.id)
if (myPet && myPet !== 'null') {
var now = new Date();
petText = 
`**Pet Hunger:** \`${myPet.hunger}\`
**Pet Affection:** \`${myPet.affection}\`
**Pet Health:** \`${myPet.health}\`

*next pet payout in ${60 - now.getMinutes()} minutes*
`
}

let minecraftText = 'Linked account: ❌ \n(use a.verify to link your minecraft account)'
const minecraftUser = await db.get(message.author.id+'.mc')
if (minecraftUser) {
minecraftText = 
`
Linked account: ✅
Minecraft username: ${minecraftUser}
Player head:
`
const mcUserId = await fetch(`https://api.mojang.com/users/profiles/minecraft/${minecraftUser}`)
.then(data => data.json())
.then(player => player.id)
statEmbed.setImage(`https://minotar.net/helm/${mcUserId}.png`)
}

let fishingText = '**Has fishing rod: ❌** \n*(buy a fishing rod from the shop)*'
const fishingExists = await db.get(message.author.id+'.fish')
if (fishingExists) {

const me = await db.get(message.author.id)
let fishingLevelRounded = Math.floor(me.fish.level / 5)
if (fishingLevelRounded > fishingArray.length) {
  fishingLevelRounded = fishingArray.length
}
let myFishingArray = fishingArray[fishingLevelRounded]
if (!myFishingArray) {myFishingArray = fishingArray[fishingArray.length - 1]}
const percents = percentify(myFishingArray)

fishingText = 
`
**Has fishing rod**: ✅
**Fishing level**: \`${fishingExists.level}\`
**Fishing EXP**: \`${fishingExists.exp}\`
**EXP until next level**: \`${fishingExists.expLevel}\`

*With current loadout and level, here are your chances of getting each item*
**Trash: ${Math.round(percents[0])}** *(${myFishingArray[0]} points)*
**Common: ${Math.round(percents[1])}** *(${myFishingArray[1]} points)*
**Rare: ${Math.round(percents[2])}** *(${myFishingArray[2]} points)*
**Legendary: ${Math.round(percents[3])}** *(${myFishingArray[3]} points)*
**ARTIFACT: ${Math.round(percents[4])}** *(${myFishingArray[4]} points)*
`
}

statEmbed.setDescription(`
**AGNABUCKS:** ${await db.get(message.author.id+'.a')}
*~------------------------------SHOP-ITEMS-----------------------------------~*
**Children:** ${await db.get('children_' + message.author.id)} 
*(${await db.get('children_' + message.author.id)} agnabucks every 5 minutes)*
**Premium bonus:** ${hasBonus}
**Rigged slot machine bonus:** ${hasChance}
**Is married:** ${isMarried}
*~---------------------------------PET-----------------------------------------~*
${petText}
*~----------------------------FISHING-----------------------------------~*
${fishingText}
*~----------------------------MINECRAFT-----------------------------------~*
${minecraftText}

`)

message.reply({ embeds: [statEmbed] })

  }



  if (command === 'tts') {

  const passes = await db.get(message.author.id+'.inv.ttspasses');
  if (!passes || passes === 0) {
  return message.reply('dont got no PASSES!')
  }
  const text = args.join(' ')

  if (text) {
  await message.channel.send({content: `${text}`, tts: true});
  await db.set(message.author.id+'.inv.ttspasses', passes - 1);
  await saveSqlite();
  } else {
    message.reply('cant say nothing dude')
  }

  }

  if (command === 'marry') {
  const me = await db.get(message.author.id)
  const proposalRecipient = message.mentions.users.first()
  if (!proposalRecipient) {return message.reply(`<:AgnabotX:1153460434691698719> || can't marry nobody bro Smh`)}
  if (!(me.inv.rings > 0)) {return message.reply(`<:AgnabotX:1153460434691698719> || you dont have any wedding rings`)}
  const them = await db.get(proposalRecipient.id)
  if (them.married || me.married) {return message.reply(`<:AgnabotX:1153460434691698719> || one of yall is already married`)}
  if (proposalRecipient.bot) {return message.reply(`<:AgnabotX:1153460434691698719> || what`)}
  if (proposalRecipient.id == message.author.id) {return message.reply(`<:AgnabotX:1153460434691698719> || sorry no sologamy`)}

    const accept = new ButtonBuilder()
      .setCustomId('acceptProposal')
      .setLabel('Accept')
      .setStyle(ButtonStyle.Success)
      .setEmoji('<:AgnabotCheck:1153525610665214094>')

    const cancel = new ButtonBuilder()
      .setCustomId('cancelProposal')
      .setLabel('Deny')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('<:AgnabotX:1153460434691698719>')

    const row = new ActionRowBuilder()
      .addComponents(accept, cancel);

    const attachment = await marriageImage(message.author, proposalRecipient, "propose")

    let marryEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>-= MARRIAGE PROPOSAL =-<')
      .setDescription(`>-= **${message.author.username}** wants to marry **${proposalRecipient.username}**! =-<`)
      .setImage('attachment://marriage.png')

    const response = await message.reply({
        embeds: [marryEmbed],
        files: [attachment],
        components: [row],
    });

    const collectorFilter = i => i.user.id == proposalRecipient.id;

try {

  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId == 'acceptProposal') {
  
  const attachment2 = await marriageImage(message.author, proposalRecipient, "confirm")
  marryEmbed.setDescription(`>-= Congrats **${message.author.username}**! **${proposalRecipient.username}** accepted your proposal! =-<`)

  collected.update({ 
    embeds: [marryEmbed],
    components: [],
    files: [attachment2],
  })

  await db.sub(message.author.id+'.inv.rings', 1)
  await db.set(message.author.id+'.married', proposalRecipient.id)
  await db.set(proposalRecipient.id+'.married', message.author.id)
  await saveSqlite()
  }
  if (collected.customId == 'cancelProposal') {

  const attachment2 = await marriageImage(message.author, proposalRecipient, "deny")
  marryEmbed.setDescription(`>-= Sorry **${message.author.username}**, but **${proposalRecipient.username}** denied your proposal. =-<`).setColor('Red')

  collected.update({ 
    embeds: [marryEmbed],
    components: [],
    files: [attachment2],
  })}
  } catch (e) {
    console.log(e)
  }
}

  if (command === 'divorce') {
    await db.set(message.author.id+'.married', false)
  }

  if (command === 'equip') {

    let outfit = await db.get(message.author.id+'.outfit')
    if (!outfit) {
      await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
      outfit = { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] }
    }
    let outfitRaritiesReformat = []

    Object.values(outfit).forEach((key, i) => {
      //the me variable here is the number value of the rarity
      let me = key[1]
      if (me == 1) {me = 'rare'} else if (me == 2) {me = 'legendary'} else if (me == 0) {me = '(none)'} else {me = 'uber'}
      outfitRaritiesReformat.push(me)
    })

    const equipEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>==-- Equip Menu --==<')
      .addFields(
    { name: `Slot 1 (rarity ${outfitRaritiesReformat[0]})`, value: `${outfitFormats[outfit.slot1[0]]}`, inline: true },
    { name: `Slot 2 (rarity ${outfitRaritiesReformat[1]})`, value: `${outfitFormats[outfit.slot2[0]]}`, inline: true },
    { name: `Slot 3 (rarity ${outfitRaritiesReformat[2]})`, value: `${outfitFormats[outfit.slot3[0]]}`, inline: true },
        )
      .setFooter({ text: 'please select the slot you want to equip in' })

    const slot1 = new ButtonBuilder()
      .setCustomId('slot1')
      .setLabel('slot 1')
      .setStyle(ButtonStyle.Success)
      .setEmoji('1️⃣')
    const slot2 = new ButtonBuilder()
      .setCustomId('slot2')
      .setLabel('slot 2')
      .setStyle(ButtonStyle.Success)
      .setEmoji('2️⃣')
    const slot3 = new ButtonBuilder()
      .setCustomId('slot3')
      .setLabel('slot 3')
      .setStyle(ButtonStyle.Success)
      .setEmoji('3️⃣')
    const cancel = new ButtonBuilder()
      .setCustomId('cancelEquip')
      .setLabel('Cancel')
      .setStyle(ButtonStyle.Danger)
      .setEmoji('<:AgnabotX:1153460434691698719>')

    const row = new ActionRowBuilder()
      .addComponents(slot1, slot2, slot3, cancel);

    const response = await message.reply({
        embeds: [equipEmbed],
        components: [row],
    });

    let slot = 1

const collectorFilter = i => message.author.id;

try {

  const collected2 = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected2.customId == 'cancelEquip') {return collected2.update({ 
    content: `**<:AgnabotX:1153460434691698719> ||** goobye :3`,
    components: [],
    embeds: [],
  })}
  slot = collected2.customId
  response.delete()

} catch (e) {
  return response.edit({ 
    content: `**<:AgnabotX:1153460434691698719> ||** timed out`,
    components: [],
    embeds: [],
  })
}

    const inv = await db.get(message.author.id+'.inv')
    const invArray = Object.keys(inv)
    let artifacts = {}; 

    //filter to be only artifacts
    invArray.forEach((key, i) => {
      if (typeof inv[key] !== 'object') {
        return delete inv[key];
      }
      if (key == 'undefined') {
        return delete inv[key];
      }
      if (inv[key].count === 0) {
        return delete inv[key];
      }

      const myObject = inv[key];

      if (myObject.count > 1) {
        for (let i = 0; i < myObject.count; i++) {

          //this weird ass piece of code checks if there's an artifact of the same rarity and name, and if so skips one of the artifacts
          let numberRarity = 0
          if (inv[key].rarity[i] == 'uber') {numberRarity = 3} else if (inv[key].rarity[i] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
          if (outfit.slot1[0] == key) {
          console.log(`${key} (${inv[key].rarity[i]}) is already equipped`)
          } else if (outfit.slot2[0] == key) {
          console.log(`${key} (${inv[key].rarity[i]}) is already equipped`)
          } else if (outfit.slot3[0] == key) {
          console.log(`${key} (${inv[key].rarity[i]}) is already equipped`)
          } else {
          artifacts[key + ` #${(i + 1)}`] = inv[key].rarity[i]
          } 

        }
      } else {

        let numberRarity = 0
        if (inv[key].rarity[0] == 'uber') {numberRarity = 3} else if (inv[key].rarity[0] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
        //same down here
        //i should prob use a guard system using returns or a for loop but im lazy
        if (outfit.slot1[0] == key && outfit.slot1[1] == numberRarity) {outfit.slot1 = ['', '']}
        else if (outfit.slot2[0] == key && outfit.slot2[1] == numberRarity) {outfit.slot2 = ['', '']}
        else if (outfit.slot3[0] == key && outfit.slot3[1] == numberRarity) {outfit.slot3 = ['', '']}
        else {
        artifacts[key] = inv[key].rarity[0]
        }
      }
    })
    

    const artifactArray = Object.keys(artifacts)

    let select = new StringSelectMenuBuilder()
      .setCustomId('equip')
      .setPlaceholder('Equip an artifact')
      .addOptions(
      new StringSelectMenuOptionBuilder()
      .setLabel(`Cancel`)
      .setValue(`cancel`),
      new StringSelectMenuOptionBuilder()
      .setLabel(`Unequip`)
      .setValue(`unequip`)
    )

    artifactArray.forEach((name, i) => {

      let artifactDescription
      let artifactEmoji
      const regex = /#(\d+)$/; // regex to match " #(number)" at the end of the string
      const match = name.match(regex);
      if (match) {
        const number = match[1];
        artifactDescription = fishingJs.artifacts[name.slice(0, -1*(number.length+1)).trim()].description //gets the artifact name without the #(number)
        artifactEmoji = inventoryFormats[name.slice(0, -1*(number.length+1)).trim()].split(' ')[0]
      } else {
        artifactDescription = fishingJs.artifacts[name].description
        artifactEmoji = inventoryFormats[name].split(' ')[0]
      }

      if (i > 22) {return}

    select.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`${name} (${artifacts[name]})`)
      .setValue(`${name}`)
      .setDescription(`"${artifactDescription}"`)
      .setEmoji(artifactEmoji)
    )
    })

    const row2 = new ActionRowBuilder()
      .addComponents(select);

    const myMessage = await message.reply({
      content: 'equip what artifact?',
      components: [row2],
    });

try {
  const confirmation = await myMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });


  if (confirmation.values[0] === 'cancel') {return await confirmation.update({ content: '**<:AgnabotX:1153460434691698719> ||** oook bai :3', components: [] })}
  if (confirmation.values[0] === 'unequip') {
  confirmation.update({ content: `**<:AgnabotCheck:1153525610665214094> ||** successfully unequipped **${slot}**`, components: [] })
  return await db.set(message.author.id+'.outfit.'+slot, [ "null", 0 ])
  }

  let toEquipName
  let toEquipRarity
  const regex = /#(\d+)$/; // regex to match " #(number)" at the end of the string
  const match = confirmation.values[0].match(regex);
  if (match) {
    const number = match[1];
    toEquipName = confirmation.values[0].slice(0, -1*(number.length+1)).trim()
    toEquipRarity = inv[toEquipName].rarity[parseInt(number, 10) - 1];
  } else {
    toEquipName = confirmation.values[0]
    toEquipRarity = inv[toEquipName].rarity[0];
  }

  let toEquipRarityNumber = 0
  if (toEquipRarity === 'uber') {toEquipRarityNumber = 3} else if (toEquipRarity === 'legendary') {toEquipRarityNumber = 2} else {toEquipRarityNumber = 1}
  await db.set(message.author.id+'.outfit.'+slot, [ toEquipName, toEquipRarityNumber ])
  confirmation.update({ content: `**<:AgnabotCheck:1153525610665214094> ||** successfully equipped **${toEquipName}** (of rarity **${toEquipRarity}**) in **${slot}**`, components: [] })

} catch (e) {
  console.error(e)
  myMessage.edit({ content: '**<:AgnabotX:1153460434691698719> ||** timed out', components: [] })
}}

  //debug command technically
  if (command === 'outfitreset') {
  await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
  message.reply('**<:AgnabotCheck:1153525610665214094> ||** just reset your outfit :   )')}

  if (command === 'outfit') {

  let outfit = await db.get(message.author.id+'.outfit')
  if (!outfit) {
  await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
  outfit = { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] }
  }

  let responseArray = []
  let outfitArray = Object.values(outfit)
for (let i = 1; i < 4; i++) {
  if (outfitFormats.hasOwnProperty(outfitArray[i-1][0])) {
    let textRarity
    if (outfitArray[i-1][1] == 0) {textRarity = '(none)'} else if (outfitArray[i-1][1] == 1) {textRarity = 'RARE'} else if (outfitArray[i-1][1] == 2) {textRarity = 'LEGENDARY'} else {textRarity = 'UBER'}
    responseArray[i-1] = `${i}. **` + outfitFormats[outfitArray[i-1][0]] + `** of rarity **${textRarity}**`
  } else {
    responseArray[i-1] = `${i}. ❔ || **UNKNOWN** (${outfitArray[i-1][0]})`
  }
}


  let meEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle(`~=-${message.author.username}'s outfit-=~`)
  .setDescription(`${responseArray[0]}\n${responseArray[1]}\n${responseArray[2]}`)

  message.reply({ embeds: [meEmbed] })}

  if (command === 'sell') {

    let amountToSell = 1;
    const inventory = await db.get(message.author.id+'.inv')
    let inventoryArray = Object.keys(inventory)
    inventoryArray.forEach((key, i) => {
      if (inventory[key] == 0 || inventory[key] < 0) {
        delete inventory[key];
        delete inventoryArray[inventoryArray.indexOf(key)];
      }
    }) 
    inventoryArray = inventoryArray.filter(n => n)
    console.log(inventoryArray.filter(n => n))
    if (!inventory) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you have literally no shit you are poor as FUCK.')}


    if (isNaN(args[0])) {return message.reply('**<:AgnabotX:1153460434691698719> ||** thats not a Cool Number!')}
    const indexToSell = parseInt(args[0]) - 1
    console.log(inventoryArray.length, indexToSell > inventoryArray.length)
    if (!indexToSell && !indexToSell == 0) {return message.reply('**<:AgnabotX:1153460434691698719> ||** i cant sell nothing stupid')}
    if (indexToSell > inventoryArray.length) {return message.reply('**<:AgnabotX:1153460434691698719> ||** Womp womp')}
    if (indexToSell + 1 <= 0 ) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you are stupid')}
    if (typeof inventory[inventoryArray[indexToSell]] === 'object') {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant sell artifacts')}

    if (args[1]) {
    if (args[1] === 'all') {amountToSell = parseInt(inventory[inventoryArray[indexToSell]])} else {

    if (isNaN(args[1])) {return message.reply('**<:AgnabotX:1153460434691698719> ||** not a number')}
    const amountToSellQuery = parseInt(args[1])
    if (amountToSellQuery > inventory[inventoryArray[indexToSell]]) {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant sell stuff you dont have')}
    if (amountToSellQuery <= 0) {return message.reply('**<:AgnabotX:1153460434691698719> ||** you are stupid')}
    amountToSell = amountToSellQuery

    }
    }

    const confirm = new ButtonBuilder()
      .setCustomId('confirmSell')
      .setLabel('confirm')
      .setStyle(ButtonStyle.Success);
    const cancel = new ButtonBuilder()
      .setCustomId('cancelSell')
      .setLabel('cancel')
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder()
      .addComponents(confirm, cancel);

    const response = await message.reply({
        content: `are you sure you want to sell **${amountToSell}** ${inventoryArray[indexToSell]} for **${amountToSell * itemWorth[inventoryArray[indexToSell]]}** agnabucks?`,
        components: [row],
    });

const collectorFilter = i => message.author.id;

try {

  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId === 'confirmSell') {
    await db.add(message.author.id+'.a', amountToSell * itemWorth[inventoryArray[indexToSell]])
    await db.add(message.author.id+'.inv.'+inventoryArray[indexToSell], -1 * amountToSell)
    response.edit({    
    content: `**<:AgnabotCheck:1153525610665214094> ||** your balance is now ${await db.get(message.author.id+'.a')}`,
    components: [],
  })
  } else {
    response.edit({    
    content: `**<:AgnabotX:1153460434691698719> ||** okey doke`,
    components: [],
  })
  }

} catch (e) {
  response.edit({ 
    content: `**<:AgnabotX:1153460434691698719> ||** timed out`,
    components: [],
  })
}

  }

  if (command === 'trade') {

  if (!message.mentions.users.first()) {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant trade with nobody bro')}
  const myInv = await db.get(message.author.id+'.inv')
  const theirInv = await db.get(message.mentions.users.first().id+'.inv')
  if (!myInv || !theirInv) {return message.reply('**<:AgnabotX:1153460434691698719> ||** one of you doesnt have an inventory')}
  if (message.mentions.users.first().id == message.author.id) {return message.reply('**<:AgnabotX:1153460434691698719> ||** cant trade with yourself')}
  let myTrade = await tradePage(message.author.id, message, message.author.username);

  if (myTrade == 'cancel') {return message.channel.send('**<:AgnabotX:1153460434691698719> ||** ok goobai :3')}

  let amount = [1, 1]

  if (typeof myTrade === 'string') {

  if (typeof myInv[myTrade] == 'object') {
    let rarityNum = 0
    if (myInv[myTrade].rarity == 'uber') {rarityNum = 3} else if (myInv[myTrade].rarity == 'legendary') {rarityNum = 2} else {rarityNum = 1}
    myTrade = [myTrade, rarityNum]
  } else {

  const awaitMessage = await message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** how many ${myTrade}?`)
  const msg_filter = (m) => m.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });

  let itemMax
  if (myTrade == 'agnabucks') { itemMax = await db.get(message.author.id+'.a') } else { itemMax = myInv[myTrade] }

  amount[0] = parseInt(collected.first().content)
  if (isNaN(amount[0])) {

    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** gotta be a number')}
  if (amount[0] > itemMax) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have enough of that')}
  if (amount[1] <= 0) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** lol')}
  }
}
  
  let theirTrade = await tradePage(message.mentions.users.first().id, message, message.mentions.users.first().username)

  if (theirTrade == 'cancel') {return message.channel.send('**<:AgnabotX:1153460434691698719> ||** ok goobai :3')}

  if (typeof theirTrade === 'string') {

  if (typeof theirInv[theirTrade] == 'object') {
    let rarityNum = 0
    if (theirInv[theirTrade].rarity == 'uber') {rarityNum = 3} else if (theirInv[theirTrade].rarity == 'legendary') {rarityNum = 2} else {rarityNum = 1}
    theirTrade = [theirTrade, rarityNum]
  } else {

  const awaitMessage = await message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** how many ${theirTrade}?`)
  const msg_filter = (m) => m.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });

  if (theirTrade == 'agnabucks') { itemMax = await db.get(message.mentions.users.first().id+'.a') } else { itemMax = theirInv[theirTrade] }

  amount[1] = parseInt(collected.first().content)
  if (isNaN(amount[1])) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** gotta be a number')}
  if (amount[1] > itemMax) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** you dont have enough of that')}
  if (amount[1] <= 0) {
    awaitMessage.delete()
    return message.reply('**<:AgnabotX:1153460434691698719> ||** lol')}
  }

  }

  console.log(myTrade, amount[0], theirTrade, amount[1])

  let mySellText
  if (typeof myTrade == 'string') {
    mySellText = `**${amount[0]} ${myTrade}**`
  } else {
    let rarityText
    if (myTrade[1] == 1) {rarityText = 'RARE'} else if (myTrade[1] == 2) {rarityText = 'LEGENDARY'} else {rarityText = 'UBER'}
    mySellText = `**${myTrade[0]}** artifact of rarity **${rarityText}**`
  }

  let theirSellText
  if (typeof theirTrade == 'string') {
    theirSellText = `**${amount[1]} ${theirTrade}**`
  } else {
    let rarityText
    if (theirTrade[1] == 1) {rarityText = 'RARE'} else if (theirTrade[1] == 2) {rarityText = 'LEGENDARY'} else {rarityText = 'UBER'}
    theirSellText = `**${theirTrade[0]}** artifact of rarity **${rarityText}**`
  }

  const tradeEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('-=~ Trade offer ~=-')
  .setImage('https://media.discordapp.net/attachments/1141115132399849603/1173077239584280586/zKC0fTR.png?ex=6562a450&is=65502f50&hm=e136f904b020946086373a623079b7e3cce3264d02354f587eaf3c32cff25bf4&=&width=306&height=431')
  .setDescription(`-**${message.author.username}** offers **${message.mentions.users.first().username}** a deal-
  ${mySellText} 
  -FOR-
  ${theirSellText}`)

  const confirm = new ButtonBuilder()
      .setCustomId('confirmTrade')
      .setLabel('Agree')
      .setStyle(ButtonStyle.Success);
  const deny = new ButtonBuilder()
      .setCustomId('denyTrade')
      .setLabel('Reject')
      .setStyle(ButtonStyle.Danger);

  const row = new ActionRowBuilder()
  row.addComponents(confirm, deny);

  const tradeMessage = await message.channel.send({ components: [row], embeds: [tradeEmbed] })

  const collectorFilter = i => {
  console.log(i.user.id, message.mentions.users.first().id)
  return i.user.id === message.mentions.users.first().id
  };

  try {
  const collected = await tradeMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId === 'confirmTrade') {
    tradeEmbed.setColor('Green').setDescription(`-=**${message.mentions.users.first().username}** ACCEPTED THE DEAL=-`)
    collected.update({ embeds: [tradeEmbed], components: [] })

    console.log(typeof myTrade)

    if (typeof myTrade == 'object') {
      await db.sub(`${message.author.id}.inv.${myTrade[0]}.count`, 1)
      let rarityText
      if (myTrade[1] === 1) {rarityText = 'rare'} else if (myTrade[1] === 2) {rarityText = 'legendary'} else {rarityText = 'uber'}
      await db.pull(`${message.author.id}.inv.${myTrade[0]}.rarity`, rarityText)

      await db.add(`${message.mentions.users.first().id}.inv.${myTrade[0]}.count`, 1)
      await db.push(`${message.mentions.users.first().id}.inv.${myTrade[0]}.rarity`, rarityText)
    } else {
      if (myTrade == 'agnabucks') {
        await db.sub(`${message.author.id}.a`, amount[0])
        await db.add(`${message.mentions.users.first().id}.a`, amount[0])
      } else {
        await db.sub(`${message.author.id}.inv.${myTrade}`, amount[0])
        await db.add(`${message.mentions.users.first().id}.inv.${myTrade}`, amount[0]) 
      }
    }

    if (typeof theirTrade == 'object') {
      await db.add(`${message.author.id}.inv.${theirTrade[0]}.count`, 1)
      let rarityText
      if (theirTrade[1] == 1) {rarityText = 'rare'} else if (theirTrade[1] == 2) {rarityText = 'legendary'} else {rarityText = 'uber'}
      await db.push(`${message.author.id}.inv.${theirTrade[0]}.rarity`, rarityText)

      await db.sub(`${message.mentions.users.first().id}.inv.${theirTrade[0]}.count`, 1)
      await db.pull(`${message.mentions.users.first().id}.inv.${theirTrade[0]}.rarity`, rarityText)
    } else {
      if (theirTrade == 'agnabucks') {
        await db.add(`${message.author.id}.a`, amount[1])
        await db.sub(`${message.mentions.users.first().id}.a`, amount[1])
      } else {
        await db.add(`${message.author.id}.inv.${theirTrade}`, amount[1])
        await db.sub(`${message.mentions.users.first().id}.inv.${theirTrade}`, amount[1]) 
      }
    }

    saveSqlite()

  }
  if (collected.customId === 'denyTrade') {
    tradeEmbed.setColor('Red').setDescription(`-=**${message.mentions.users.first().username}** REJECTED THE DEAL=-`)
    collected.update({ embeds: [tradeEmbed], components: [] })
  return
  }
} catch (e) {
  tradeMessage.edit({ content: 'they took too long Lol', components: [], embeds: [] })
}

}

if (command === `inspect`) {
const index = args[0]
if (!index) {return message.reply(`<:AgnabotX:1153460434691698719> || gimme an index`)}
if (isNaN(index)) {return message.reply(`<:AgnabotX:1153460434691698719> || gotta be a number bro`)}
const me = await db.get(message.author.id)
if (!me.inv) {return message.reply(`<:AgnabotX:1153460434691698719> || you dont have an inventory`)}
let inv = me.inv
for (const property in inv) {
  if (inv[property] == 0 || inv[property] < 0) {delete inv[property]}
  if (property == 'undefined') {delete inv[property]}
}
const inventoryArray = Object.keys(inv)
const artifactName = inventoryArray[index - 1]
if (typeof me.inv[artifactName] !== `object`) {return message.reply(`<:AgnabotX:1153460434691698719> || not an artifact`)}
const artifactObject = fishingJs.artifacts[artifactName]

const inspectEmbed = new EmbedBuilder()
.setTitle(`-=~artifact ${artifactName}~=-`)
.setDescription(`*${artifactObject.description}*

${artifactObject.text}`)
.setColor(`#235218`)
message.reply({ embeds: [inspectEmbed] })
}

});

async function hasArtifact(id, artifactName) {

  let outfitArray
  let output = false;
  if (typeof id === 'object') {
    outfitArray = Object.values(id)
  } else {
    const me = await db.get(id)
    if (!me?.outfit) {return false}
    outfitArray = Object.values(me.outfit)
  }

  outfitArray.forEach((key, i) => { 
    if (outfitArray[i][0] === artifactName) {
      const myArtifact = fishingJs.artifacts[artifactName]
      output = [outfitArray[i][1], myArtifact.values[parseInt(outfitArray[i][1]) - 1]];
      return;
    }
  })
  return output
}

async function tradePage(id, message, username) {
  const inv = await db.get(id+'.inv')
  const invArray = Object.keys(inv)
  let outfit = await db.get(id+'.outfit')
    if (!outfit) {
      await db.set(message.author.id+'.outfit', { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] })
      outfit = { slot1: ['null', 0], slot2: ['null', 0], slot3: ['null', 0] }
    }
  let artifacts = {}; 

    //filter to be only artifacts
    invArray.forEach((key, i) => {

      const myObject = inv[key];

      if (myObject <= 0 || myObject?.count <= 0) {return}

      if (outfit.slot1[0] == key) {return}
      if (outfit.slot2[0] == key) {return}
      if (outfit.slot3[0] == key) {return}

      if (typeof myObject !== 'object') {
        artifacts[key] = inv[key]
        return
      }

      if (myObject.count > 1) {
        for (let i = 0; i < myObject.count; i++) {
          let numberRarity = 0
          if (inv[key].rarity[i] == 'uber') {numberRarity = 3} else if (inv[key].rarity[i] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
          artifacts[key + ` #${(i + 1)}`] = inv[key].rarity[i]
        }
      } else {

        let numberRarity = 0
        if (inv[key].rarity[0] == 'uber') {numberRarity = 3} else if (inv[key].rarity[0] == 'legendary') {numberRarity = 2} else {numberRarity = 1}
        artifacts[key] = inv[key].rarity[0]}

    })    

    const artifactArray = Object.keys(artifacts)

    let select = new StringSelectMenuBuilder()
      .setCustomId('equip')
      .setPlaceholder(`${username}'s inventory`)
      .addOptions(
      new StringSelectMenuOptionBuilder()
      .setLabel(`Cancel`)
      .setValue(`cancel`)
      .setEmoji('<:AgnabotX:1153460434691698719>'),
      new StringSelectMenuOptionBuilder()
      .setLabel(`AGNABUCKS`)
      .setValue(`agnabucks`)
      .setDescription(`you currently have ${await db.get(id+'.a')} agnabucks`)
      .setEmoji('💰')
    )

    //console.log(fishingJs.artifacts)

    artifactArray.forEach((name, i) => {

      let artifactDescription
      let artifactEmoji
      const regex = /#(\d+)$/; // regex to match " #(number)" at the end of the string
      const match = name.match(regex);
      if (match) {
        const number = match[1];
        artifactDescription = fishingJs.artifacts[name.slice(0, -1*(number.length+1)).trim()].description //gets the artifact name without the #(number)
        artifactEmoji = inventoryFormats[name.slice(0, -1*(number.length+1)).trim()].split(' ')[0]
      } else {
        if (typeof inv[name] !== 'object') {
        artifactDescription = `${username} has ${inv[name]} of these`
        artifactEmoji = inventoryFormats[name].split(' ')[0]
        } else {
        artifactDescription = fishingJs.artifacts[name].description
        artifactEmoji = inventoryFormats[name].split(' ')[0]
      }
      }

      if (i > 22) {return}

    select.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`${name} (${artifacts[name]})`)
      .setValue(`${name}`)
      .setDescription(`${artifactDescription}`)
      .setEmoji(artifactEmoji)
    )
    })

    const row2 = new ActionRowBuilder()
      .addComponents(select);

    const myMessage = await message.reply({
      content: 'choose an item to trade',
      components: [row2],
    });

    const collectorFilter = i => i.user.id === message.author.id;
try {
  const confirmation = await myMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  myMessage.delete()

  const regex = /#(\d+)$/; // regex to match " #(number)" at the end of the string
  const match = confirmation.values[0].match(regex);
  if (match) {
    const number = match[1];
    const name = confirmation.values[0].slice(0, -1*(number.length+1)).trim()
    const rarityNum = parseInt(number, 10) - 1
    return [name, rarityNum]
  }

  return confirmation.values[0]
} catch (e) {
  console.error(e)
  myMessage.edit({ content: '**<:AgnabotX:1153460434691698719> ||** timed out', components: [] })
}

}

function objectPage(testmap, page) {
  let testEmbed = new EmbedBuilder()
    .setTitle('placeholder')
    .setColor('#235218')

  for (const property in testmap) {
    if (testmap[property] == 0 || testmap[property] < 0 || testmap[property]?.count == 0) {delete testmap[property]}
    if (property == 'undefined') {delete testmap[property]}
  }

  const pages = Math.ceil(testmap.size / 3)
  const inventoryArray = Object.keys(testmap);
  let curPage = page
  let description = 'Inventory:\n'

  for (let i = curPage * 3; i < (curPage * 3) + 3; i++) {
    if (!inventoryArray[i]) {description += ''} else {

    if (inventoryFormats.hasOwnProperty(inventoryArray[i])) {
      if (typeof testmap[inventoryArray[i]] === 'object') {
      description += inventoryArray.indexOf(inventoryArray[i]) + 1 + '. ' + inventoryFormats[inventoryArray[i]].replace("[count]", `${testmap[inventoryArray[i]].count} (${testmap[inventoryArray[i]].rarity})`);
      } else {
      description += inventoryArray.indexOf(inventoryArray[i]) + 1 + '. ' + inventoryFormats[inventoryArray[i]].replace("[count]", testmap[inventoryArray[i]]);
    }
    } else {
      if (typeof testmap[inventoryArray[i]] === 'object') {
        description += `${inventoryArray.indexOf(inventoryArray[i]) + 1}. \❔ \`Unknown Artifact (${inventoryArray[i]}):     ${testmap[inventoryArray[i]].count} (${testmap[inventoryArray[i]].rarity})\` \n`
      } else {
        description += `${inventoryArray.indexOf(inventoryArray[i]) + 1}. \❔ \`Unknown (${inventoryArray[i]}):     ${testmap[inventoryArray[i]]}\` \n`
      }
    }

    }
  }

  testEmbed
  .setDescription(description)
  .setTitle(`~=-Page ${curPage + 1}-=~`)

  return testEmbed
}

function getTextUntilDelimiter(text, delimiter) {
  let index = text.indexOf(delimiter);
  if (index !== -1) {
    return text.substring(0, index);
  } else {
    return text;
  }
}

async function isMinecraftOnline() {
let testServer = false
await mcs.statusJava('bay-logan.gl.joinmc.link')    
.then((result) => {
//console.log(result.online)
testServer = result.online
    })
    .catch((error) => {
testServer = false
console.error(error)
    })
return testServer
}

async function createMinecraftBot() {
console.log('checkpoint 1')
bot = await mineflayer.createBot(botArgs);
console.log('checkpoint 2')

bot.on('login', () => {
  console.log('minecraft bot is ready');
  const playersOnline = Object.keys(bot.players)
  playersOnline.forEach((name) => {
  minecraftPlayersCooldown.push(name)
  })

  bot.chat(`/login helloguys`)

  setTimeout(() => {
  minecraftPlayersCooldown = []
}, 5000)  
});

bot.loadPlugin(deathEvent)

bot.on('end', () => {
  bot = null
  console.log('minecraft bot left server')
  //minecraftchat.send('BOT LEFT SERVER')
});

bot.on('chat', (username, message) => {
  if (username === bot.username) return
  minecraftchat.send(`**${username}** || ${message}`)
})

bot.on('playerJoined', (player) => {
if (player.username === bot.username) return
if (!minecraftPlayersCooldown.includes(player.username)) {
minecraftPlayersCooldown.push(player.username)
minecraftchat.send(`[+] **${player.username}**`)
setTimeout(() => {
minecraftPlayersCooldown.splice(minecraftPlayersCooldown.indexOf(player), 1)
}, 5000)
}
})

bot.on('playerLeft', (player) => {
if (player.username === bot.username) return
if (minecraftPlayersCooldown.includes(player.username)) return
minecraftchat.send(`[-] **${player.username}**`)
})

bot.on("playerDeath", (data) => {
    console.log(data);
    if (data.victim) {
        console.info('victim => ', data.victim.detail().username);
    }
    console.info('method => ', data.method);
minecraftchat.send(`${data.victim.detail().username} died (${data.method})`)

});

}

// Helper function to parse the duration arguments
function parseDuration(args) {
  if (args.length === 3) {
    const hours = parseInt(args[0]);
    const minutes = parseInt(args[1]);
    const seconds = parseInt(args[2]);

    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
      return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    }
  }
  return null;
}

// Helper function to convert the duration object to milliseconds
function durationToMilliseconds(duration) {
  const hoursToMilliseconds = duration.hours * 60 * 60 * 1000;
  const minutesToMilliseconds = duration.minutes * 60 * 1000;
  const secondsToMilliseconds = duration.seconds * 1000;

  return hoursToMilliseconds + minutesToMilliseconds + secondsToMilliseconds;
}

// Helper function to format the duration for display
function formatDuration(duration) {
  const hours = duration.hours > 0 ? `${duration.hours} hour${duration.hours > 1 ? 's' : ''}` : '';
  const minutes = duration.minutes > 0 ? `${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}` : '';
  const seconds = duration.seconds > 0 ? `${duration.seconds} second${duration.seconds > 1 ? 's' : ''}` : '';

  return `${hours} ${minutes} ${seconds}`.trim();
}


client.on('messageReactionAdd', async (reaction, user) => {
  const message = !reaction.message.author
    ? await reaction.message.fetch()
    : reaction.message;
    
  if (users.includes(reaction.message.author.id) === false && users.includes(user.id) && user.id !== '1107764918293372989') {
reaction.message.react('yeah:1106953116311625768');
  }
  
 
  if (reaction.emoji.id === '1112395248337965166') {

  if (user.id === '765581160755363840') {
    message.channel.send('added that to the speechbubble pool')
      client.channels.cache.get('1085289780901842996').send(reaction.message.content)
  }
}

  
 
  
});



async function updateCategoryName() {

   if (!replit) {return}
        
  const channel = client.channels.cache.get('1092554907883683961');

  const categoryNames = await db.get('category')
  //console.log(categoryNames)

  const randomName = categoryNames[getRandomInt(categoryNames.length)];
  //client.channels.cache.get('1108491109258244156').send(randomName);
  
  channel.setName(randomName)
    .then(updatedChannel => console.log(`Updated category name to ${randomName}`))
    .catch(error => console.error(`Error updating category name: ${error}`));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function fetchAttachment(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
         !isNaN(parseFloat(str)) 
}

async function getUsername(userId, guild, balance) {

if (parseInt(balance) < 1000 || !balance) {
return;
}

try {
  const theGuy = await guild.members.fetch(userId);
  if (theGuy) {
    console.log('woohooo theyre part of the thing')
    return theGuy;
  } else {
    return null;
  }
} catch (error) {
    return null;
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

async function startFight(player1, player2, channel) {

    // Get player1's move
    const player1Move = await getPlayerMove(player1);

    // Get player2's move
    const player2Move = await getPlayerMove(player2);

    if (player1Move === 'end' || player2Move === 'end') {
      return 'end';
    }

  const fightEmbed = new EmbedBuilder()
    .setColor('#235218')
    .setTitle(`Fight between ${player1.username} and ${player2.username}`)
    .setDescription(`${player1} Attacked: ${player1Move[0]}, and defended: ${player1Move[1]} \n ${player2} Attacked: ${player2Move[0]}, and defended: ${player2Move[1]}`)

  if (player1Move[0] === 'up') {
    if (player2Move[1] === 'up') {
    //if player 1 gets blocked by player 2 in up attack
    fightEmbed.addFields({ name: `${player2.username} blocked up, negating ${player1.username}'s attack!`, value: `${player2} health: ${player2Health}` })
    } else {
    //if player 1 doesnt get blocked by player 2 in up attack
    if (player1Move[1] === 'attack') {
      player2Health = player2Health - 3
      fightEmbed.addFields({ name: `${player2.username} failed to block up and ${player1.username} double attacked, dealing ${player2.username} 3 damage!`, value: `${player2} health: ${player2Health}` })
    } else {
      player2Health = player2Health - 1
      fightEmbed.addFields({ name: `${player2.username} failed to block up and ${player1.username} attacked up, dealing 1 damage!`, value: `${player2} health: ${player2Health}` })
    }
    }
  } else {
    if (player1Move[1] === 'down') {
    //if player 1 gets blocked by player 2 in down attack
    fightEmbed.addFields({ name: `${player2.username} blocked down, negating ${player1.username}'s attack!`, value: `${player2} health: ${player2Health}` })
    } else {
    //if player 1 doesnt get blocked by player 2 in down attack
    if (player1Move[1] === 'attack') {
      player2Health = player2Health - 3
      fightEmbed.addFields({ name: `${player2.username} failed to block down and ${player1.username} double attacked, dealing ${player2.username} 3 damage!`, value: `${player2} health: ${player2Health}` })
    } else {
      player2Health = player2Health - 1
      fightEmbed.addFields({ name: `${player2.username} failed to block down and ${player1.username} attacked down, dealing 1 damage!`, value: `${player2} health: ${player2Health}` })
    }
    }

  }

  if (player2Move[0] === 'up') {
    if (player1Move[1] === 'up') {
    //if player 1 gets blocked by player 2 in up attack
    fightEmbed.addFields({ name: `${player1.username} blocked up, negating ${player2.username}'s attack!`, value: `${player1} health: ${player1Health}` })
    } else {
    //if player 1 doesnt get blocked by player 2 in up attack
    if (player2Move[1] === 'attack') {
      player1Health = player1Health - 3
      fightEmbed.addFields({ name: `${player1.username} failed to block up and ${player2.username} double attacked, dealing ${player1.username} 3 damage!`, value: `${player1} health: ${player1Health}` })
    } else {
      player1Health = player1Health - 1
      fightEmbed.addFields({ name: `${player1.username} failed to block up and ${player2.username} attacked up, dealing 1 damage!`, value: `${player1} health: ${player1Health}` })
    }
    }
  } else {
    if (player1Move[1] === 'down') {
    //if player 1 gets blocked by player 2 in down attack
    fightEmbed.addFields({ name: `${player1.username} blocked down, negating ${player2.username}'s attack!`, value: `${player1} health: ${player1Health}` })
    } else {
    //if player 1 doesnt get blocked by player 2 in down attack
    if (player2Move[1] === 'attack') {
      player1Health = player1Health - 3
      fightEmbed.addFields({ name: `${player1.username} failed to block down and ${player2.username} double attacked, dealing ${player1.username} 3 damage!`, value: `${player1} health: ${player1Health}` })
    } else {
      player1Health = player1Health - 1
      fightEmbed.addFields({ name: `${player1.username} failed to block down and ${player2.username} attacked down, dealing 1 damage!`, value: `${player1} health: ${player1Health}` })
    }
    }
  }

  channel.send({ embeds: [fightEmbed] })
}

async function getPlayerMove(player) {

  const fightResponse = [];

  const up = new ButtonBuilder()
      .setCustomId('up')
      .setLabel('Attack up')
      .setStyle(ButtonStyle.Primary);

const down = new ButtonBuilder()
      .setCustomId('down')
      .setLabel('Attack down')
      .setStyle(ButtonStyle.Primary);

  const up2 = new ButtonBuilder()
      .setCustomId('up')
      .setLabel('Defend up')
      .setStyle(ButtonStyle.Primary);

const down2 = new ButtonBuilder()
      .setCustomId('down')
      .setLabel('Defend down')
      .setStyle(ButtonStyle.Primary);

const attack = new ButtonBuilder()
      .setCustomId('attack')
      .setLabel('Double down on attacking')
      .setStyle(ButtonStyle.Secondary);

const row = new ActionRowBuilder()
      .addComponents(up, down);
const row2 = new ActionRowBuilder()
      .addComponents(up2, down2, attack);

const response = await player.send({
    content: 'Enter the way you want to attack!',
    components: [row],
  });

const collectorFilter = i => player.id;

try {

  const collected = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (collected.customId === 'down') {
fightResponse.push('down')
  await collected.update({ content: 'Attacking down!', components: [] });
  } else {
fightResponse.push('up')
  await collected.update({ content: 'Attacking up!', components: [] });
  }
} catch (e) {
    response.delete()
    inFight = false;
    player.send('Timed out. Battle has stopped.')
    return 'end';
}

const response2 = await player.send({
    content: 'Enter the way you want to defend! Choosing attack triples your damage, but leaves you defenseless',
    components: [row2],
  });

try {

  const collected2 = await response2.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

  if (collected2.customId === 'down') {
    fightResponse.push('down')
  await collected2.update({ content: 'Defending down!', components: [] });
  } else if (collected2.customId === 'attack') {
    fightResponse.push('attack')
  await collected2.update({ content: 'Doubling down!', components: [] });
  } else {
    fightResponse.push('up')
  await collected2.update({ content: 'Defending up!', components: [] });
  }

} catch (e) {
  console.log(e)
    response.delete()
    inFight = false;
    player.send('Timed out. Battle has stopped.')
    return 'end';
}

return fightResponse;

}

async function marriageImage(guy1, guy2, type) {

  try {
    const canvas = Canvas.createCanvas(2000, 1000);
    const context = canvas.getContext('2d');

  const avatar1pos = [500, 500, 700]

  let avatar = await Canvas.loadImage(guy1.displayAvatarURL({ extension: 'jpg' }));
  context.save();
  context.beginPath();
  context.arc(avatar1pos[2]/2+(avatar1pos[0]-(avatar1pos[2]/2)), avatar1pos[2]/2+(avatar1pos[1]-(avatar1pos[2]/2)), avatar1pos[2]/2, 0, Math.PI * 2, true);
  context.closePath();
  context.strokeStyle = 'white'
  context.lineWidth = 30;
  context.stroke();
  context.strokeStyle = 'black'
  context.lineWidth = 10;
  context.stroke();
  context.clip();
  context.drawImage(avatar, avatar1pos[0]-(avatar1pos[2]/2), avatar1pos[1]-(avatar1pos[2]/2), avatar1pos[2], avatar1pos[2]);
  context.restore();

  const avatar2pos = [1500, 500, 700]

  avatar = await Canvas.loadImage(guy2.displayAvatarURL({ extension: 'jpg' }));
  context.save();
  context.beginPath();
  context.arc(avatar2pos[2]/2+(avatar2pos[0]-(avatar2pos[2]/2)), avatar2pos[2]/2+(avatar2pos[1]-(avatar2pos[2]/2)), avatar2pos[2]/2, 0, Math.PI * 2, true);
  context.closePath();
  context.strokeStyle = 'white'
  context.lineWidth = 30;
  context.stroke();
  context.strokeStyle = 'black'
  context.lineWidth = 10;
  context.stroke();
  context.clip();
  context.drawImage(avatar, avatar2pos[0]-(avatar2pos[2]/2), avatar2pos[1]-(avatar2pos[2]/2), avatar2pos[2], avatar2pos[2]);
  context.restore();

  let overlayImage
  switch(type) {
  case 'propose':
    overlayImage = await Canvas.loadImage('./images/marriage/questionmark.png');
  break;
  case 'confirm':
    overlayImage = await Canvas.loadImage('./images/marriage/heart.png');
  break;
  case 'deny':
    overlayImage = await Canvas.loadImage('./images/marriage/X.png');
  break;
  }
  context.drawImage(overlayImage, 1000-(overlayImage.width/2), 500-(overlayImage.height/2), overlayImage.width, overlayImage.width);

  context.strokeStyle = 'white';
  context.lineWidth = 30;
  context.strokeRect(0, 0, canvas.width, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'marriage.png' });

  return attachment;
    } catch (err) {
      console.error('Error occurred:', err);
    }
  }

async function podium(winner, loser, channel) {

    try {
    const canvas = Canvas.createCanvas(499, 630);
    const context = canvas.getContext('2d');
  
  const background = await Canvas.loadImage('./images/podium.png');

  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatar = await Canvas.loadImage(winner.displayAvatarURL({ extension: 'jpg' }));

  context.drawImage(avatar, 310, 25, 125, 125);

  const avatar2 = await Canvas.loadImage(loser.displayAvatarURL({ extension: 'jpg' }));

  context.drawImage(avatar2, 100, 100, 125, 125);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'podium.png' });

  return attachment;
    } catch (err) {
      console.error('Error occurred:', err);
    }
  }

async function fetchProfilePicture(userId) {
  try {
    const user = await client.users.fetch(userId);
    const profilePictureUrl = user.displayAvatarURL({ format: 'png', size: 256 });
    const response = await fetch(profilePictureUrl);
    if (!response.ok) throw new Error('Failed to fetch the profile picture');
    return await response.buffer();
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    throw error;
  }
}

function simplifyInteger(number) {
  if (typeof number !== "number" || !Number.isInteger(number)) {
    throw new Error("Input must be an integer.");
  }

  const abbreviations = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "mil" },
    { value: 1e3, symbol: "k" },
  ];

  for (let i = 0; i < abbreviations.length; i++) {
    if (number >= abbreviations[i].value) {
      const simplified = (number / abbreviations[i].value).toFixed(2);
      return `${simplified}${abbreviations[i].symbol}`;
    }
  }

  return number.toString(); // Return the original number if not simplified.
}

async function balance(mention) {

    try {

  const customBackground = await db.get('balimage_' + mention.id)

  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext('2d');

  let background = await Canvas.loadImage('./images/balance.png');
  
  if (!(!customBackground || customBackground === null)) {
  background = await Canvas.loadImage(customBackground);
  }
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'black';
  context.lineWidth = 10;

  context.font = applyText(canvas, `${mention.username}'s balance:`, 50)
  context.fillStyle = '#ffffff';

  context.strokeText(`${mention.username}'s balance:`, canvas.width / 2.7, canvas.height / 2.4);
  context.fillText(`${mention.username}'s balance:`, canvas.width / 2.7, canvas.height / 2.4)

  const curbal = simplifyInteger(parseInt(await db.get(mention.id+'.a')));

  context.font = applyText(canvas, `${mention.username}'s balance:`, 100)
  context.fillStyle = '#ffffff';

  context.strokeText(`${curbal} agnabucks`, canvas.width / 2.7, canvas.height / 1.3);
  context.fillText(`${curbal} agnabucks`, canvas.width / 2.7, canvas.height / 1.3)


  context.strokeRect(25, 25, 200, 200);

  const { body } = await request(mention.displayAvatarURL({ extension: 'png' }));
  const avatar = await Canvas.loadImage(await body.arrayBuffer());
  context.drawImage(avatar, 25, 25, 200, 200);

  context.strokeStyle = 'white';

  context.strokeRect(0, 0, canvas.width, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'balance.png' });

  return attachment;
    } catch (err) {
      console.error('Error occurred:', err);
    }
  }

async function petImage(pet, id) {

  try {

  const canvas = Canvas.createCanvas(600, 400);
  const context = canvas.getContext('2d');
  const caretaker = await hasArtifact(id, 'auraofthecaretaker')
  let color = '#235218'
  if (pet.hex && caretaker) {
  color = '#'+pet.hex
  }

  //return with specified strings if null
  if (!pet.image) {return 'image'}
  if (!pet.name) {return 'name'}

  //pet background
  const background = await Canvas.loadImage(pet.background);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  //pet marker thing
  const petMarker = await Canvas.loadImage('./images/petmarker.png');
  context.drawImage(petMarker, 30, 25, 100, 100);

  //pet name
  context.strokeStyle = 'black';
  context.lineWidth = 10;
  context.font = applyText(canvas, pet.name, 90)
  context.fillStyle = '#ffffff';
  context.strokeText(pet.name, 70, 100);
  context.fillText(pet.name, 70, 100)

  //pet subtitle
  if (pet.subtitle && caretaker) {
  context.strokeStyle = 'black';
  context.lineWidth = 5;
  context.font = `bold 25px Arial`;
  context.fillStyle = '#939393';
  context.strokeText(pet.subtitle, 80, 130);
  context.fillText(pet.subtitle, 80, 130)
  }

  //pet image
  const petImage = await Canvas.loadImage(pet.image);
  context.drawImage(petImage, canvas.width / 1.99, canvas.height / 2.2, 200, 200);

  //hunger bar text
  context.strokeStyle = 'black';
  context.lineWidth = 6;
  context.font = applyText(canvas, `Hunger (${pet.hunger}%)`, 30)
  context.fillStyle = '#ffffff';
  context.strokeText(`Hunger (${pet.hunger}%)`, 35, 175);
  context.fillText(`Hunger (${pet.hunger}%)`, 35, 175)

  //hunger bar fill
  context.fillStyle = color;
  context.lineWidth = 10;
  context.fillRect(35, 190, (pet.hunger / 100) * 150, 20);

  //hunger bar outline
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.strokeRect(35, 190, 150, 20);

  //affection bar text
  context.strokeStyle = 'black';
  context.lineWidth = 6;
  context.font = applyText(canvas, `Affection (${pet.affection}%)`, 30)
  context.fillStyle = '#ffffff';
  context.strokeText(`Affection (${pet.affection}%)`, 35, 240);
  context.fillText(`Affection (${pet.affection}%)`, 35, 240)

  //affection bar fill
  context.fillStyle = color;
  context.lineWidth = 10;
  context.fillRect(35, 255, (pet.affection / 100) * 150, 20);

  //affection bar outline
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.strokeRect(35, 255, 150, 20);

  //health bar text
  context.strokeStyle = 'black';
  context.lineWidth = 6;
  context.font = applyText(canvas, `Health (${pet.health}%)`, 30)
  context.fillStyle = '#ffffff';
  context.strokeText(`Health (${pet.health}%)`, 35, 305);
  context.fillText(`Health (${pet.health}%)`, 35, 305)

  //health bar fill
  context.fillStyle = color;
  context.lineWidth = 10;
  context.fillRect(35, 315, (pet.health / 100) * 150, 20);

  //health bar outline
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.strokeRect(35, 315, 150, 20);

  //pet emotion
  context.drawImage(await calculateEmotions(pet), 400, 30 / 2.2, 138, 120);

  //shielded
  if (pet.shielded) {
  const shieldImage = await Canvas.loadImage('./images/shielded.png');
  context.drawImage(shieldImage, canvas.width - 65, canvas.height - 65, 60, 60);
  }

  //outline
  if (color !== '#235218') {
    context.strokeStyle = color;
  } else {
    context.strokeStyle = 'white';
  }
  context.lineWidth = 10;
  context.strokeRect(0, 0, canvas.width, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'balance.png' });

  return attachment;
    } catch (err) {
      console.error('Error occurred:', err);
    }
  }

const applyText = (canvas, text, fontSize) => {
  //console.log(canvas)
  const context = canvas.getContext('2d');

  do {
    context.font = `bold ${fontSize -= 10}px Arial`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;

};

const splitText = (canvas, text) => {
  const context = canvas.canvas.getContext('2d');

  const words = text.split(' ')
  let parsedText = []
  let splitText2 = ''
  words.forEach((word) => {
  if (canvas.canvas.width / 2 - (context.measureText(splitText2).width / 2) + 140 + context.measureText(splitText2).width < canvas.canvas.width) {
  splitText2 = `${splitText2} ${word}`
  } else {
  parsedText.push(splitText2)
  splitText2 = word
  }

})
  parsedText.push(splitText2)
  return parsedText

};

async function validUserId(id, message) {

    const userID = id.replace(/[\\<>@!]/g, '');


    try {
      const guild = message.guild;
      const member = await guild.members.fetch(userID);
      return member;
    } catch (error) {
      //console.log(error)
      return false;
    }
  }

async function fetchProfilePicture(userId) {
  try {
    const user = await client.users.fetch(userId);
    const profilePictureUrl = user.displayAvatarURL({ format: 'png', size: 256 });
    const response = await fetch(profilePictureUrl);
    if (!response.ok) throw new Error('Failed to fetch the profile picture');
    return await response.buffer();
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    throw error;
  }
}

function percentify(array) {
console.log(array)
if (!array) {array = fishingArray[fishingArray.length]}
const sum = array.reduce((acc, number) => acc + number, 0);
const percentages = array.map(number => (number / sum) * 100);
return percentages
}

async function fishingLoot(message, collected) {
const me = await db.get(message.author.id)
const fishingLevelRounded = Math.floor(me.fish.level / 5)
let myFishingArray = fishingArray[fishingLevelRounded]
if (!myFishingArray) {myFishingArray = fishingArray[fishingArray.length - 1]}
if (message.author.id == '765581160755363840') {myFishingArray = [0, 0, 0, 0, 100]}
const percents = percentify(myFishingArray)
const randomNum = getRandomInt(99) + 1

let sum = 0;
let index = 0;
while (sum + percents[index] < randomNum) {
  sum += percents[index];
  index++;
}


let lootToDraw
let type
let color
let exp
if (index == 0) {
type = 'trash';
lootToDraw = fishingLootMap.trash[getRandomInt(3)]
color = '#222222'
exp = 10
} else if (index == 1) {
type = 'common';
lootToDraw = fishingLootMap.common[getRandomInt(3)]
color = '#105808'
exp = 50
} else if (index == 2) {
type = 'rare';
lootToDraw = fishingLootMap.rare[getRandomInt(3)]
color = '#311fac'
exp = 100
} else if (index == 3) {
type = 'legendary';
lootToDraw = fishingLootMap.legendary[getRandomInt(3)]
color = '#fffc39'
exp = 500
} else {
console.log('hello')
const newMessage = await giftArtifact(message)
collected.update(newMessage)
await saveSqlite()
return
}



const name = getTextUntilDelimiter(lootToDraw.replace(/^.*[\\/]/, ''), '.png')
const attachment = await fishingLootImage(message.author, lootToDraw, { name: name, rarity: type, color: color })
fishingEmbed.setTitle(`Congrats! You earned ${exp} exp!`)
if (me.fish.exp + exp >= me.fish.expLevel) {
fishingEmbed.setFooter({ text: `level ${me.fish.level + 1} | 0 exp | ${((Math.floor((me.fish.level + 1) / 5) + 1) * 100) + me.fish.level * 25} exp until next level` })
await db.add(message.author.id+'.fish.level', 1)
await db.set(message.author.id+'.fish.exp', 0)

await db.set(message.author.id+'.fish.expLevel', (((Math.floor((me.fish.level + 1) / 5) + 1) * 100) + me.fish.level * 25))
//next fishing level, divided by five so it only goes up every 5 levels, plus 1 so 0 is never a factor, * 100, + fishing level * 25

} else {
fishingEmbed.setFooter({ text: `level ${me.fish.level} | ${me.fish.exp + exp} exp | ${me.fish.expLevel - (me.fish.exp + exp)} exp until next level` })
await db.add(message.author.id+'.fish.exp', exp)
}
collected.update({ embeds: [fishingEmbed], files: [attachment], components: [] })

await db.add(`${message.author.id}.inv.${type}`, 1)

await saveSqlite()

} 

async function giftArtifact(message) {

  const artifactArray = Object.keys(artifacts)
  const randomArtifact = artifactArray[getRandomInt(artifactArray.length)]

  const artifactRarityChance = getRandomInt(99)

  let artifactRarity = [];
  let artifactColor 
  if (artifactRarityChance < 60) {
    artifactRarity = ['rare', 0];
    artifactColor = '#690d0d'
  } else if (artifactRarityChance < 90) {
    artifactRarity = ['legendary', 1];
    artifactColor = '#ffe582'
  } else {
    artifactRarity = ['uber', 2];
    artifactColor = '#5380c3'
  }

  const attachment = await artifactImage(message.author, `./images/fishing/artifacts/${randomArtifact}.png`, { name: randomArtifact, rarity: artifactRarity[0], color: artifactColor })
  let xText = ''
  if (artifacts[randomArtifact].values[artifactRarity[1]] != 0) {
  xText = `\n***X = ${artifacts[randomArtifact].values[artifactRarity[1]]}***`
  }

  let artifactEmbed = new EmbedBuilder()
    .setTitle('~-=ARTIFACT CAUGHT=-~')
    .setImage('attachment://fishing.png')
    .setColor(artifactColor)
    .setDescription(`**You got ${randomArtifact.toUpperCase()} of rarity ${artifactRarity[0].toUpperCase()}**
    ~-=*${artifacts[randomArtifact].description}*=-~
    ${artifacts[randomArtifact].text}
    ${xText}

    *(this is part of the set "${artifacts[randomArtifact].set}")*`)

  const artifactRarityString = artifactRarity[0]
  await db.add(`${message.author.id}.inv.${randomArtifact}.count`, 1)
  await db.push(`${message.author.id}.inv.${randomArtifact}.rarity`, artifactRarityString)

  console.log('ok im done')

  return { embeds: [artifactEmbed], files: [attachment], components: [], content: 'You fished up an artifact!' }

}

async function artifactImage(guyFishing, lootToDraw, typeMap) {
const canvas = Canvas.createCanvas(750, 500);
const context = canvas.getContext('2d');
  
const background = await Canvas.loadImage('./images/fishing/fishingPoses/background.png');
context.drawImage(background, 0, 0, canvas.width, canvas.height);
const fishinglayer1 = await Canvas.loadImage(`./images/fishing/fishingPoses/artifact/1.png`);
context.drawImage(fishinglayer1, 0, 0, canvas.width, canvas.height);
const avatar = await Canvas.loadImage(guyFishing.displayAvatarURL({ extension: 'jpg' }));
context.save();
context.beginPath();
context.arc(262.5, 252.5, 22.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 240, 230, 45, 45);
context.restore();

context.lineWidth = 3;
context.strokeStyle = 'white'
context.fillStyle = 'rgba(0, 0, 0, 0.6)'
context.fillRect(25, 25, 700, 150)
context.strokeRect(25, 25, 700, 150)
context.fillStyle = 'rgba(255, 255, 255, 0.7)'
context.fillRect(50, 50, 100, 100)
context.strokeStyle = typeMap.color
context.strokeRect(50, 50, 100, 100)
const lootThing = await Canvas.loadImage(lootToDraw);
context.drawImage(lootThing, 55, 55, 90, 90);

context.font = 'bold 60px Arial';
context.fillStyle = 'black'
context.lineWidth = 6;
context.strokeText(typeMap.rarity.toUpperCase(), 175, 100)
context.fillText(typeMap.rarity.toUpperCase(), 175, 100)

context.font = 'bold 40px Arial';
context.lineWidth = 2;
context.strokeText(typeMap.name, 175, 140)
context.fillText(typeMap.name, 175, 140)

const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'fishing.png' });

return attachment;
}

async function fishingLootImage(guyFishing, lootToDraw, typeMap) {
const canvas = Canvas.createCanvas(750, 500);
const context = canvas.getContext('2d');
  
const background = await Canvas.loadImage('./images/fishing/fishingPoses/background.png');
context.drawImage(background, 0, 0, canvas.width, canvas.height);
const fishinglayer1 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing1/1.png`);
context.drawImage(fishinglayer1, 0, 0, canvas.width, canvas.height);
const avatar = await Canvas.loadImage(guyFishing.displayAvatarURL({ extension: 'jpg' }));
context.save();
context.beginPath();
context.arc(227.5, 277.5, 27.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 200, 250, 55, 55);
context.restore();
const fishinglayer2 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing1/2.png`);
context.drawImage(fishinglayer2, 0, 0, canvas.width, canvas.height);

context.lineWidth = 3;
context.strokeStyle = 'white'
context.fillStyle = 'rgba(0, 0, 0, 0.6)'
context.fillRect(25, 25, 700, 150)
context.strokeRect(25, 25, 700, 150)
context.fillStyle = 'rgba(255, 255, 255, 0.7)'
context.fillRect(50, 50, 100, 100)
context.strokeStyle = typeMap.color
context.strokeRect(50, 50, 100, 100)
const lootThing = await Canvas.loadImage(lootToDraw);
context.drawImage(lootThing, 55, 55, 90, 90);

context.font = 'bold 60px Arial';
context.fillStyle = 'white'
context.lineWidth = 10;
context.strokeText(typeMap.rarity.toUpperCase(), 175, 100)
context.fillText(typeMap.rarity.toUpperCase(), 175, 100)

context.font = 'bold 40px Arial';
context.lineWidth = 4;
context.strokeText(typeMap.name, 175, 140)
context.fillText(typeMap.name, 175, 140)

const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'fishing.png' });

return attachment;

}

async function fishingImage(guyFishing, num) {
try {
const canvas = Canvas.createCanvas(750, 500);
const context = canvas.getContext('2d');

const background = await Canvas.loadImage('./images/fishing/fishingPoses/background.png');
context.drawImage(background, 0, 0, canvas.width, canvas.height);
const fishinglayer1 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing${num}/1.png`);
context.drawImage(fishinglayer1, 0, 0, canvas.width, canvas.height);

const avatar = await Canvas.loadImage(guyFishing.displayAvatarURL({ extension: 'jpg' }));
if (num === 1) {
context.save();
context.beginPath();
context.arc(227.5, 277.5, 27.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 200, 250, 55, 55);
context.restore();
} else {
context.save();
context.beginPath();
context.arc(207.5, 237.5, 27.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 180, 210, 55, 55);
context.restore()
}

const fishinglayer2 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing${num}/2.png`);
context.drawImage(fishinglayer2, 0, 0, canvas.width, canvas.height);

const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'fishing.png' });

return attachment;

} catch (err) {
console.error('Error occurred:', err);
}

}

async function calculateEmotions(pet) {

  const totalScore = pet.health + pet.affection + pet.hunger
  let emotionImage;

  console.log(totalScore)

  if (pet.lazy) {
    return await Canvas.loadImage('./images/emotions/lazy.png');
  }

  if (totalScore == 0) {
  if (getRandomInt(99) >= 15) {
  return await Canvas.loadImage('./images/emotions/dead.png');
  } else {
  return await Canvas.loadImage('./images/emotions/dead2.png');
  }
}

  if (pet.hunger <= 20 && pet.affection <= 20 && pet.health <= 20) {return await Canvas.loadImage('./images/emotions/suffering.png')}
  if (pet.hunger <= 20) {return await Canvas.loadImage('./images/emotions/famished.png')}
  if (pet.affection <= 20) {return await Canvas.loadImage('./images/emotions/neglected.png')}
  if (pet.health <= 20) {return await Canvas.loadImage('./images/emotions/wounded.png')}

  if (totalScore > 279) {
  if (getRandomInt(99) >= 15) {
  return await Canvas.loadImage('./images/emotions/amazing.png');
  } else {
  return await Canvas.loadImage('./images/emotions/amazing2.png');
  }
  }

  if (totalScore > 200) {return await Canvas.loadImage('./images/emotions/happy.png');}
  if (totalScore > 100) {return await Canvas.loadImage('./images/emotions/ok.png');}
  if (totalScore < 100) {return await Canvas.loadImage('./images/emotions/sad.png');}

  return await Canvas.loadImage('./images/emotions/sad.png');

}

client.on('interactionCreate', async (interaction) => {
  //console.log(interaction)
  if (!interaction.isButton() || lockdown !== 'false') return;

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

  saveSqlite();

  const attachment = await petImage(await db.get(`pet_${id}`), id)
  await interaction.message.edit({ files: [attachment] });

} catch (e) {
console.log(e)
await interaction.message.reply({
  content: 'sorry some Eror occured my bad',
});
}


})

client.on('messageUpdate', (oldMessage, newMessage) => {
  //this is if something is pinned
  if (newMessage.pinned && !oldMessage.pinned && newMessage.channel.id === '1108134693574037627') {
const listId = '64f60bea80b83ade3f10e083';

// create a new card
trello.addCard(newMessage.content, `suggested by ${newMessage.author.username}`, listId)
  .then(card => {
    console.log('Card added successfully');
  })
  .catch(err => {
    console.error('Error adding card:', err);
  });
  }
});

//crash log system
process.on('uncaughtException', async (err) => {
  console.log('CRASHED, writing error...')
  console.log(err)
  const errorMessage = `${new Date().toISOString()} - Uncaught Exception: ${err.message}\n${err.stack}`;
  await fs.writeFile('./info/crash logs/error.txt', errorMessage, (err) => { 
    if (err) throw err; 
  }) 
  console.log('Done writing...')
  //process.exit(1);
});

function isvalidhexcode(input) {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(input);
}

process.on('SIGINT', () => {
  // Call the async shutdown function and handle any errors
  shutdown().catch(err => {
    console.error('Error during shutdown:', err);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  });
});

process.on('SIGTERM', () => {
  // Call the async shutdown function and handle any errors
  shutdown().catch(err => {
    console.error('Error during shutdown:', err);
    process.exit(1); // Exit with a non-zero status code to indicate an error
  });
});

async function shutdown() {
  console.log('Bot is shutting down...');
  await saveSqlite();
  process.exit(0);
}

if (replit) {
client.login(token);
} else {
client.login(backupToken);
}

module.exports = {
  db
}