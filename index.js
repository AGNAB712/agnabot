const Discord = require('discord.js');
require("dotenv").config();
const keepAlive = require('./server.js')
const { ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebHookClient } = require("discord.js");
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus, entersState, NoSubscriberBehavior } = require('@discordjs/voice');
const voice = require('@discordjs/voice');
const { QuickDB } = require("quick.db");
const { exec } = require('child_process');
const db = new QuickDB();
const cleverbot = require('cleverbot-free');




const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildMessageReactions,
  Discord.GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
  })
  
const token = process.env.TOKEN;
const gpt2PythonScript = './gpt2.py';
const currentDateTime = new Date();

    let curPlay = false;

let msgId = [];

const workArray = ['wow you worked so good good job YIPEE \nyou earned ', 'you worked at a nuclear power plant and died but you still got ', 'you were hired as a hitman and assasinated joe biden and earned ', 'prostitution. \n+', 'happy birthday you got ', 'you made a your mom joke in a stand-up comedy club and got ', 'you watched AGNAB VIDEO AND HE GAVE YOU ', 'palk beat you up on the side of the road but he felt bad and came back and gave you ', 'agnab decided he was too rich and gave you ', 'you went on a date with brando and he liked you so much he gave you ', 'this funky little dude with a big haircut came and gave you [Big Big MONEY!] and [Buy! Now! 70%] and you earned ', 'everyone fucking died and you took all their money and got ', 'mmmmmm adzuki mmmm mmmmm oh sorry heres your ']

const { EmbedBuilder } = require('discord.js');

const { PermissionsBitField } = require('discord.js');

let lockdown = 'false';

const { google } = require('googleapis');

const googleAuth = process.env.GOOGLEAPIAUTH;

const youtube = google.youtube({
  version: 'v3',
  auth: googleAuth
});

let lastVideoId = null;

const cooldowns = new Map();

const cooldowns2 = new Map();

const mutes = new Map();

const says = [];

const channelId = '1092546678613094461';
const youtubeChannelId = process.env.YOUTUBECHANNELID;

const prefix = `a.`;

let noFirst = 'true';

let inBan = false;

let categoryNames = ["hi","what the freak","poopoo","hallo","chattery","shake my pants","loud","sillies","very cool","telling","text","Uÿ=","but they didnt gave me my banana 👿","Pop Bob Smellex","dog pouder 🐶 consumers gang","FEETLOVERS","i love feet","the elder variable 😤","the adult constant 😒","the baby function 🤑","the child equation ☺️","📍","⌂","👾","Wild","ˢᵘʳʳᵉᵃˡ - Bambi Fantrack (LOUD, blue's outerspacial abominations 1/8)","bambi","OLMA! Olimar. 🥕","🫏💨","noxy we need to cook","i HATE dave and Bambi…. Grrrrrrrrrrrr","person in charge for a couple 👫 👫 and 8⃣ 8⃣ 8⃣ 8⃣ in a position 🖥️ 🖥️ 🖥️ 🖥️ I have a 600 😟 😟","why is the category saying hi to me bro","'♥Щ@мIi╞амн !K 8↑╕","https://media.discordapp.net/attachments/1109957407636987984/1118010322108813332/Bre.gif%22%22AGNABOB%22%22/%22the mwaganzanists","https://media.discordapp.net/attachments/967405625665540156/1031932494435586078/agony.gif%22,%22tat 🗽 tat 🗽 tat 🗽 tat 🗽","pro tip: interestingshallot13 will get a suprise after his vacation 🤫","🥺🥺🥺haiii :3 hewwo","འȺԱ↻ටԱϚ Manbi","untouchable grass","https://cdn.discordapp.com/attachments/1092557930349477960/1118344310291693688/image.png%22,%22Agnab Boyclit ❌","penit butt e:Cryingaboutit: :Cryingaboutit: :Cryingaboutit:"]

let users = [];

let queue = [];

let conversation = [];

const cuss = ['FUCK','SHIT','BITCH']

let sbLoop = 0;

const credentials = require('./cool.json')
const folderId = '1uhXVBbhrcLaUpYB6MuGDYJd7dSn5R0G8';
const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
const drive = google.drive({ version: 'v3', auth: auth });

async function saveSqlite() {

    const fileName = 'json.sqlite';

      client.channels.cache.get('1118953993662644256').send({
        files: [fileName]
      });

    console.log('saved sqlite')

}

async function loadSqlite() {

    const messages = await client.channels.cache.get('1118953993662644256').messages.fetch({ limit: 1 }); // Fetch the last sent message

    const lastMessage = messages.first();
    if (lastMessage.attachments.size > 0) {
      const attachment = lastMessage.attachments.first();
      const fileName = attachment.name;

      if (fileName.endsWith('.sqlite')) {
        const file = await fetchAttachment(attachment.url);
        fs.writeFileSync(fileName, file);
        console.log(`SQLite file ${fileName} downloaded successfully.`);
      }
    }

}


async function loadCategoryNames() {
  const channelId = '1117068125586866218';
  
  const channel = client.channels.cache.get(channelId);
  channel.messages.fetch({ limit: 1 })
    .then(messages => {
      const firstMessage = messages.first();
      console.log('First message content:', firstMessage.content);
    const data = firstMessage.content;
    categoryNames = JSON.parse(data);
    console.log('Data loaded successfully!');
    })
    .catch(console.error);

}

async function saveCategoryNames() {
const channel = await client.channels.cache.get('1117068125586866218')
const lastMessage = await client.channels.cache.get(channelId).messages.lastMessage;
    await channel.send(JSON.stringify(categoryNames));
  console.log('Data saved successfully!');
  }

async function loadStopUsers() {
  const channelId = '1117068093953409094';
  
  const channel = client.channels.cache.get(channelId);
  channel.messages.fetch({ limit: 1 })
    .then(messages => {
      const firstMessage = messages.first();
      console.log('First message content:', firstMessage.content);
    const data = firstMessage.content;
    users = JSON.parse(data);
    console.log('Data loaded successfully!');
    })
    .catch(console.error);
}

async function saveStopUsers() {
const channel = await client.channels.cache.get('1117068093953409094')
const lastMessage = await client.channels.cache.get(channelId).messages.lastMessage;
    await channel.send(JSON.stringify(users));
  console.log('Data saved successfully!');
}

client.on('ready', async () => {

    
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get('1108491109258244156').send('hallo guys it is me i am online');
  loadSqlite();
  loadCategoryNames();
  loadStopUsers();
  updateCategoryName(); 
  setInterval(updateCategoryName, 600000); 


//this is for youtube things

  try {
    const channelData = await youtube.channels.list({
      part: 'contentDetails',
      id: youtubeChannelId
    });

    const uploadsPlaylistId = channelData.data.items[0].contentDetails.relatedPlaylists.uploads;

    setInterval(async () => {
      const playlistItems = await youtube.playlistItems.list({
        part: 'snippet',
        playlistId: uploadsPlaylistId,
        maxResults: 1
      });

      const videoId = playlistItems.data.items[0].snippet.resourceId.videoId;
      const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

      if (videoId !== lastVideoId) {
        lastVideoId = videoId;

        const channel = await client.channels.fetch(channelId);
        if (channel && channel instanceof Discord.TextChannel) {
        if (noFirst === 'true') {
        noFirst = 'false';
        }
        else {
          channel.send(`<@&969759643880554496> wow new video check it out.............\n${videoUrl}`);
        }
        }
      }
    }, 60000); // Check every 1 minute
  } catch (error) {
    console.error('Error:', error);
  }
 
});


client.on('messageCreate', async (message) => {

if (!(await db.get(message.author.id))) {
  await db.set(message.author.id, 100);
  saveSqlite();
}


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
  if (!isNaN(content) && parseInt(content) < 13) {
    message.delete()
      .then(() => console.log(`Deleted message: "${message.content}"`))
      .catch((error) => console.error('Error while deleting message:', error));
  }


if (lockdown === 'false') {



//dumb shit

  if(message.content.includes('<@907055124503994398>','<@!907055124503994398>')) {

  if (message.author.id !== '1107764918293372989') { 
    if (message.content.includes('<@907055124503994398>','<@!907055124503994398>')) {
    message.reply('dafuq you want from pirate?')
  }
  }};

	if(message.author.id === '907055124503994398') {
		//message.react('🤓');
	}
	

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
  
    if (message.content.includes('a.lockdown') && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    message.channel.send("ya'll are dumb");
    lockdown = 'true';
    }
    
    if (message.content.toLowerCase().includes('agnab') && message.content.toLowerCase().includes('bad')) {
    message.author.send(`say that one more time again and you'll be sorry.`);
    }
  }
    
  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (says.includes(message.author.id)) {
if (message.content === 'a.togglesay') {
const index = says.indexOf(message.author.id);
if (index > -1) {
  says.splice(index, 1);
}
message.delete();
return;
}
    if (message.reference) {
    const repliedMessage = message.reference;
    const repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);
    if (repliedMessage) {
    repliedMessageFull.reply(message.content);
    } 
    } else {
    const messageSent = await message.channel.send(message.content)
    userId = message.author.id
    client.channels.cache.get('1122152368591601754').send(await messageSent.id + ' ' + userId + ' ' + message.content)
    }
    try {
    message.delete()
  } catch (error) {
    console.log(error);
  }
}
    
 //actual commands
 if (!message.content.toLowerCase().startsWith(prefix) || message.author.bot) return;

  if (command === 'hotel') {

  const myHotel = await db.get(`hotel_${message.author.id}`)

  const command2 = args[0]

  if (!command2) return message.reply('red the syntax please :   )')

  if (command2 === "buy") {

  curbal = await db.get(message.author.id)

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

  await db.set(message.author.id, parseInt(parseInt(curbal) - 500))

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
  }

}

if (command === 'work') {
    const playerID = message.author.id;

    if (cooldowns.has(playerID)) {
      const expirationTime = cooldowns.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      message.reply(`cooldown bro..... you got ${remainingTime.toFixed(1)} seconds left`);
    } else {

    let curbal = await db.get(playerID);

    const moneyEarned = getRandomInt(50) + 50

    await db.set(playerID, parseInt(curbal) + moneyEarned);
    saveSqlite();

    curbal = await db.get(playerID);

      const embed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('work')
        .setDescription(workArray[getRandomInt(workArray.length)] + moneyEarned + ' agnabucks')
        .setFooter({ text: `your money is now ${curbal}` })
      
      message.reply({ embeds: [embed] });
      const cooldownDuration = 60000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns.delete(playerID);
      }, cooldownDuration);
    }
  }

if (command === 'rng') {

const curbal = await db.get(message.author.id)

if (!isNumeric(args[0]) || parseInt(args[0]) > 5 || parseInt(args[0]) < 1) {
  return message.reply('use a Cool number Beeyatch');
}

const toGuess = getRandomInt(5) + 1;

if (toGuess === parseInt(args[0])) {
  winEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('you win!')
  .setDescription('you gained 30 ꬰ')
  .setFooter({ text: `your balance is now ${curbal + 30}`})
  await db.set(message.author.id, parseInt(parseInt(curbal) + 30));
  message.reply({ embeds: [winEmbed] });
} else {
  loseEmbed = new EmbedBuilder()
  .setColor('Red')
  .setTitle('you lose')
  .setDescription(`the number was ${toGuess} and yours was ${args[0]}`)
  .setFooter({ text: `better luck next time`})
  message.reply({ embeds: [loseEmbed] });
}

  }

  if (command === 'setmoney' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

    const targetUser = message.mentions.users.first();

    if (targetUser) {

    const userId = targetUser.id;

    const variableValue = args[1];

    if (isNumeric(variableValue)) {
    await db.set(userId, variableValue);
    await saveSqlite();
    message.channel.send('saved');
  } else {
        message.channel.send('not a number');
  }

  } else {
    message.channel.send('gotta mention someone dude')
  }
  }

  if (command === 'locksay') {

  if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

    criminal = message.mentions.users.first();

    if (!criminal) {
      return message.channel.send('gotta mention someone broski');
    }

    if (await db.get('locked_' + criminal.id)) {
    message.reply(`wow redemption arc`)
    await db.set('locked_' + criminal.id, false);
    await saveSqlite();
    } else {
    message.reply(`what a silly goose ${criminal.username} was`)
    await db.set('locked_' + criminal.id, true);
    await saveSqlite();
    }

  } else {
    message.channel.send('no perms LOL!!!!! LO')
  }


  }

if (command === 'random') {

await findRandomMessage(message);
  }



      if (command === 'don' || command === 'doubleornothing') {

      const curbal = await db.get(message.author.id);

      const chanceBought = await db.get(`chance_` + message.author.id);

      let chance = 0.5;

      if (chanceBought) {
       chance = 0.6;
      }



      if (isNumeric(args[0])) {

      if (parseInt(args[0]) > 100) {
        return message.reply('canot gamble over 100');
      }

      const DONembed = new EmbedBuilder()
        .setColor('00ff2f')
        .setTitle('Double or Nothing');


      if (parseInt(args[0]) < parseInt(curbal) && parseInt(args[0]) > 0) {

      coinFlip = Math.random();

      if (coinFlip < chance) {
      await db.set(message.author.id, parseInt(curbal) + parseInt(args[0]));
      await saveSqlite()
      const newBal = await db.get(message.author.id);
      DONembed
      .setDescription('You flipped a coin, and you got heads!')
      .setFooter({ text: `Your new balance is ${newBal}`});

      message.reply({ embeds: [DONembed] })

      } else if (coinFlip > chance) {
      await db.set(message.author.id, curbal - args[0]);
      await saveSqlite()
      const newBal = await db.get(message.author.id);
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
      }

  }

  if (command === 'donate') {

  await loadSqlite();

  const curbal = await db.get(message.author.id);

  const targetUser = message.mentions.users.first();

  if (targetUser && curbal) {
  const userId = targetUser.id;
  const otherGuy = await db.get(userId);

  if (!args[1] || !isNumeric(args[1]) || args[1] < 1) {
    return message.channel.send('come on bro...... cant do that')
  }

  if (userId === message.author.id) {
    return message.channel.send('LOL')
  }


  if (curbal > parseInt(args[1])) {
    const otherValue = await db.set(message.author.id, parseInt(parseInt(curbal) - parseInt(args[1])) );
    const variableValue = await db.set(userId, parseInt(parseInt(otherGuy) + parseInt(args[1])));

    message.channel.send(`their money is now ${variableValue} agnabucks`);
    message.channel.send(`your money is now ${otherValue} agnabucks`);

    await saveSqlite();

  } else {
    message.channel.send('stop being Poor');
  }

  } else {

    message.channel.send('gotta mention someone to donate to, and yknow, how much you wanna donate')
  }


  }

  if (command === 'shop') {
  const shop = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Shop')
  .setDescription('**Buy a hotel room with "a.hotel buy" for 5,000 agnabucks!**')
  .setAuthor({ name: 'AGNASHOP', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: '1. Cocaina', value: `10,000 AGNABUCKS (high for one day)` },
    { name: '2. Methamphetamin', value: `1,000 AGNABUCKS (high for one hour)` },
    { name: '3. Alcohol', value: `100 AGNABUCKS (high for one minuto)` },
    { name: '4. AGNAB premium', value: `10,000 AGNABUCKS (access to secret chat + cool role lol)` },
    { name: '5. Themonuclear bomb', value: `1,000 AGNABUCKS (mention someone and they get muted for a minute)` },
    { name: '6. Weed sample', value: '30 AGNABUCKS (high for 3 minutes, one time buy)'},
    { name: '7. Rigged slot machine', value: `5,000 AGNABUCKS (increases the chance of you winning in double or nothing to 60%)` },
    { name: '8. TTS pass', value: `100 AGNABUCKS (one time a.tts usage)` },
    { name: '9. Speechbubble', value: `200 AGNABUCKS (buys a random speechbubble from the speechbubble pool \nif the speechbubble is brought up with a.sb, your name appears underneath)` },
  )
  message.channel.send({ embeds: [shop] });
  }

  if (command === 'redeem') {

    const playerID = message.author.id;

    if (cooldowns2.has(playerID)) {
      const expirationTime = cooldowns2.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      return message.reply(`cooldown bro..... you got ${remainingTime.toFixed(1)} seconds left`);
    }

    const member = message.member;

    let curbal = await db.get(playerID);

    if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'agnabian royalty (level 50)').id)) {
      message.channel.send(`congrat you get 100 agnabucks\nyou now have ${parseInt(curbal) + 100} agnabuck WOW`);
    await db.set(playerID, parseInt(curbal) + 100);
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'master agnabian (level 35)').id)) {
      message.channel.send(`congrat you get 75 agnabuck\nyou now have ${parseInt(curbal) + 75} agnabuck WOW`);
    await db.set(playerID, parseInt(curbal) + 75);
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'true agnabian (level 25)').id)) {
      message.channel.send(`congrat you get 50 agnabacuks\nyou now have ${parseInt(curbal) + 50} agnabuck WOW`);
    await db.set(playerID, parseInt(curbal) + 50);
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'agnab master (level 15)').id)) {
      message.channel.send(`congrate you get 30 agnabuck\nyou now have ${parseInt(curbal) + 30} agnabuck WOW`);
    await db.set(playerID, parseInt(curbal) + 30);
    saveSqlite();
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'agnab enthusiast (level 10)').id)) {
      message.channel.send(`congrate you get 20 agnabucks \nyou now have ${parseInt(curbal) + 20} agnabuck WOW`);
    await db.set(playerID, parseInt(curbal) + 20);
    saveSqlite();
    } else {
      message.channel.send('sorry youre not a high enough level to use this yet');
    }

      const cooldownDuration = 600000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns2.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns2.delete(playerID);
      }, cooldownDuration);

  }

    if (command === 'ask') {

    message.channel.sendTyping()
    cleverbot(args.join(' '),conversation)
    .then(res=>{
      conversation.push(args.join(' '))
      conversation.push(res);
      message.reply(res.toLowerCase().replace(/\./g, ''));
    })
    .catch(error => console.error(`error with ai: ${error}`))
  

}

  if (command === 'clearconversation') {
    conversation = [];
    message.channel.send('cleared conversation')
  }

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

if (args.length < 2 || !message.mentions.users.first()) {
  return message.reply('read the documentation :    )')
}


const targetUser = message.mentions.users.first();
const textContent = args.slice(1).join(' ');

const messageSent = await webhook.send({
  content: textContent,
  username: targetUser.username,
  avatarURL: targetUser.displayAvatarURL({ format: 'png', dynamic: true }),
});

userId = message.author.id

client.channels.cache.get('1122152368591601754').send(await messageSent.id + ' ' + userId + ' ' + args.join(' '))

try {
message.delete()
} catch (error) {
  console.error(error)
}

}



  if (command === 'buy') {

    await loadSqlite();

    const curbal = await db.get(message.author.id);



      if (parseInt(args[0]) === 1 || args[0].toLowerCase() === 'cocaine') {
    if (curbal > 10000) {
    await db.set(message.author.id, parseInt(parseInt(curbal) - 10000));
    message.channel.send('https://cdn.discordapp.com/attachments/831714424658198532/1119014960127811655/Martin_Cabello_-_Cocaina_No_Flour_Original_video_online-video-cutter.com.mp4')
    const reminderTime = Date.now() + 60 * 24 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    await saveSqlite();
    const role= message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    message.member.roles.add(role);
      } else {
    message.channel.send('no money Bitch')
    }
    }

          if (parseInt(args[0]) === 2 || args[0].toLowerCase() === 'meth') {
    if (curbal > 1000) {
    await db.set(message.author.id, parseInt(parseInt(curbal) - 1000));
    message.channel.send('high as shit brah')
    const reminderTime = Date.now() + 60 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    await saveSqlite();
    //const role= message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    //message.member.roles.add(role);
      } else {
    message.channel.send('no money Bitch')
    }
    }

    if (parseInt(args[0]) === 3 || args[0].toLowerCase() === 'alcohol') {
    if (curbal > 100) {
    await db.set(message.author.id, parseInt(parseInt(curbal) - 100));
    message.channel.send('i too am also a crippling alcoholic')
    const reminderTime = Date.now() + 1 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    await saveSqlite();
    const role = message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    message.member.roles.add(role);
      } else {
    message.channel.send('no money Bitch')
    }
    }

          if (parseInt(args[0]) === 4 || args[0].toLowerCase() === 'premium') {
    if (curbal > 10000) {
    await db.set(message.author.id, parseInt(parseInt(curbal) - 10000));
    message.channel.send('you are so premium broski')
    const role = message.member.guild.roles.cache.find(role => role.name === "AGNAB Premium");
    message.member.roles.add(role);
      } else {
    message.channel.send('no money Bitch')
    }
    }

    if (parseInt(args[0]) === 5 || args[0].toLowerCase() === 'bomb') {
    if (curbal > 1000) {
    await db.set(message.author.id, parseInt(parseInt(curbal) - 1000));
    const muteGuy = message.mentions.members.first();
    if (muteGuy) {
      const cooldownDuration = 60000;
      const expirationTime = Date.now() + cooldownDuration;
    const role = message.member.guild.roles.cache.find(role => role.name === "Muted");
    muteGuy.roles.add(role);

    message.channel.send(`<@${muteGuy.id}> you just got MUTED! what a nerd.........................`)


      setTimeout(() => {
        message.channel.send(`<@${muteGuy.id}> your mute is over`);
        muteGuy.roles.remove(role);
      }, cooldownDuration);

  } else {
    message.channel.send('gotta mention someone bro')
  }
      } else {
    message.channel.send('no money Bitch')
    }
    }

    if (parseInt(args[0]) === 6 || args[0].toLowerCase() === 'packet') {
    const exists = await db.get(`packet_` + message.author.id)
    if (!exists) {
    if (curbal > 30) {
    await db.set(message.author.id, parseInt(parseInt(curbal) - 30));
    message.channel.send('https://cdn.discordapp.com/attachments/966879955445248050/1121562281742970951/three.mp4')
    const reminderTime = Date.now() + 3 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    await db.set(`packet_` + message.author.id , true);
    await saveSqlite();
    const role = message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    message.member.roles.add(role);
      } else {
    message.channel.send('no money Bitch')
    }
  } else {
    message.channel.send('you already bought it dude')
    }
  }

      if (parseInt(args[0]) === 7 || args[0].toLowerCase() === 'rigged') {
    if (curbal > 5000) {
    message.channel.send('lol you Cheat')
    await db.set(`chance_` + message.author.id , true);
    await db.set(message.author.id, parseInt(parseInt(curbal) - 5000));
    await saveSqlite();
      } else {
    message.channel.send('no money Bitch')
    }
    }

    if (parseInt(args[0]) === 8 || args[0].toLowerCase() === 'tts') {
    if (curbal > 100) {

    await db.set(message.author.id, parseInt(parseInt(curbal) - 100));
    const passes = await db.get(message.author.id + '_passes');
    console.log(passes)

    if (passes === undefined) {
    await db.set(message.author.id + '_passes', 1);
    } else {
    await db.set(message.author.id + '_passes', passes + 1 );
    }

    message.channel.send(`wow im sure this wont get annoying\nyou have ${await db.get(message.author.id + '_passes')} passes`)

    await saveSqlite();

      } else {
    message.channel.send('no money Bitch')
    }
  }

    if (parseInt(args[0]) === 9 || args[0].toLowerCase() === 'speechbubble') {
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
        message.channel.send(`congrats you are now the new owner of this stupid thing ${words[0]}`)
        client.channels.cache.get('1085289780901842996').send(`${words[0]} ${message.author.username}`)
        randomMessage.delete();
      } else {

      const words = randomMessage.content.split(' ');
      message.channel.send(`congrats you are now the new owner of this stupid thing ${words[0]}`)
      randomMessage.edit(`${words[0]} ${message.author.username}`)

    }

    } else {

      if (randomMessage.author.id !== '1107764918293372989') {
      message.channel.send(`congrats you are now the new owner of this stupid thing ${randomMessage.attachments.first().url}`)
      client.channels.cache.get('1085289780901842996').send(`${randomMessage.attachments.first().url} ${message.author.username}`)
      randomMessage.delete();
      } else {


      message.channel.send(`congrats you are now the new owner of this stupid thing ${randomMessage.attachments.first().url}`)
      randomMessage.edit(`${randomMessage.attachments.first().url} ${message.author.username}`)

    }

    }

  await db.set(message.author.id, parseInt(parseInt(curbal) - 200));

  await saveSqlite();


  } else {
    message.channel.send('no money Bitch')
  }
}

}

  if (command === 'help') {

if (args[0] === 'fun') {
            const felpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: 'a.addcategory', value: `suggests something for the random selection of category names \n once a message reaches 5 thumbs ups it is added` },
    { name: 'a.say', value: `makes agnabot say whatever... \n formatted as a.say text` },
    { name: 'a.sb/a.speechbubble', value: `gets a random speechbubble from agnabs collection (why does he have so many)` },
    { name: 'a.autoresponses/a.ar', value: `gives a list of agnabot's automatic responses` },
    { name: 'a.showcategories', value: `shows the possible category names from agnabot to pick from` },
    { name: 'a.mean', value: 'He will never be mean!' },
    { name: 'a.inv/a.inventory', value: `views your inventory` },
    { name: 'a.tts', value: `sends a tts message using agnabot (requires a tts pass which you can buy)` },
    { name: 'a.togglesay', value: `locks you in a mode where everything you type is treated as an a.say command \n is disabled by typing a.togglesay again` },
    { name: 'a.random', value: `sends a random message from the server` },
    { name: 'a.piss', value: `pisses on somebody\nformatted as a.piss @(user)` },
    { name: 'a.hug', value: `hugs somebody\nformatted as a.hug @(user)` },
    { name: 'a.fart', value: `farts in vc STINKY` },
    { name: 'a.furry', value: `gets a random furry image` },
    { name: 'a.impersonate', value: `impersonate a person \nformatted as a.impersonate @(user) (text)` },
  )

  message.channel.send({ embeds: [felpEmbed] });
} else if (args[0] === 'utility') {
            const uelpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.invite', value: 'gives the invite link' },
    { name: 'a.timer', value: `timer/reminder command, formatted as "a.timer hours minutes seconds" \n optionally you can add a reminder by typing in a one string phrase at the end starting with "-"` },
    { name: 'a.toggleautoreact', value: `toggles agnabot reacting to your messages when someone else reacts to it` },
    { name: 'a.convert/a.freedomunits/a.fu', value: `converts things in the metric system to imperial system and back \nformatted as a.convert (amount) (from, always plural) (to, always plural)\nan example would be a.fu 10 miles kilometers"` },
    { name: 'a.credits', value: `gives the credits for agnabot` },
    { name: 'a.promo', value: `gives all of agnab's shit` },
    { name: 'a.define', value: `defines something from urban dictionary\nformatted as "a.define (phrase)"` },
    { name: 'a.calculator', value: `parses mathematical expressions (So Mathematical!)` },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [uelpEmbed] });
} else if (args[0] === 'agnabank') {
            const belpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.bal/a.balance', value: 'gives the balance of whoever you ping\nformatted as a.bal @(user)' },
    { name: 'a.work', value: `gives you some money! (can only be done once every minute, between 50 and 100 agnabucks)` },
    { name: 'a.redeem', value: `gives you money based off your level roles starting at level 10\nlvl 10 is 20, level 15 is 30, level 25 is 50, level 35 is 75, and level 50 is 100` },
    { name: 'a.don/a.doubleornothing', value: `either doubles or takes your money\nformatted as a.don (amount of money to wager)` },
    { name: 'a.shop', value: `brings up the shop menu` },
    { name: 'a.buy', value: `buys something from the shop\nformatted as a.buy (item index OR first word of the item)` },
    { name: 'a.donate', value: `donates money to someone\nformatted as a.donate @(user)` },
    { name: 'a.rng', value: `generates a random number, if your number is the one it generates you gain 30 agnabucks\nformatted as "a.rng (number 1-5)"` },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [belpEmbed] });
} else if (args[0] === 'agnaradio') {
            const aelpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.agnaradio play', value: 'plays a youtube or soundcloud link' },
    { name: 'a.agnaradio queue', value: 'shows the queue' },
    { name: 'a.agnaraio skip', value: 'skips a song' },
    { name: 'a.agnaradio stop', value: 'stops the music and resets the queue' },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [aelpEmbed] });
} else if (args[0] === 'admin') {
            const delpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.lockdown', value: 'locks down agnabots responses in case of abuse' },
    { name: 'a.unlockdown', value: 'stops lockdown' },
    { name: 'a.setstatus', value: `sets status obv\nformatted as a.setstatus (status)` },
    { name: 'a.forcecategory', value: 'forces a possible category name \n formatted as a.forcecategory (category name)' },
    { name: 'a.deletecategory', value: `deletes a category from the list \n formatted as a.deletecategory (category index)` },
    { name: 'a.setmoney', value: `sets a persons money\nformatted as a.setmoney @(user)` },
    { name: 'a.locksay', value: `locks a persons say command \n formatted as a.locksay @(user)` },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [delpEmbed] });
} else if (args[0] === 'hotel') {
            const delpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.hotel buy', value: 'buys a hotel room' },
    { name: 'a.hotel name/rename', value: 'rename your hotel room' },
    { name: 'a.hotel description', value: `sets the description of your hotel room` },
    { name: 'a.hotel public', value: 'sets your hotel to be public' },
    { name: 'a.hotel private', value: `sets your hotel to be private` },
    { name: 'a.hotel invite', value: `invites someone to your hotel if it is private` },
    { name: 'a.hotel remove', value: `removes someone from your hotel if it is private` },
    { name: 'a.hotel lock', value: `makes it so you are the only one who can send messages in your hotel` },
    { name: 'a.hotel unlock', value: `makes it so everyone can send messages again` },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [delpEmbed] });
} else {
            const helpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.help', value: 'brings up this screen' },
    { name: 'a.help fun', value: 'brings up the help menu for fun commands' },
    { name: 'a.help utility', value: 'brings up the help menu for utilities' },
    { name: 'a.help AGNARADIO', value: 'brings up the agnaradio help menu' },
    { name: 'a.help AGNABANK', value: 'brings up the money thinggggggsssssssss' },
    { name: 'a.help admin', value: 'brings up the admin help menu (all the commands are admin only)' },
    { name: 'a.help hotel', value: 'hotel commands' },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [helpEmbed] });
}
	
 }
 
   if (command === 'ar' || command === 'autoresponses' ) {
      const arembed = new EmbedBuilder()
	.setColor('Green')
	.setTitle('AGNABOT Autoresponses')
	.setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
	.addFields(
		{ name: 'Ohio', value: 'OHIO KILLED MY GRANDMA............' },
		{ name: 'sus', value: 'lol you are So funny LOL lol lol i am lmfao i am' },
		{ name: 'Ayo/🤨', value: 'you are 9 years old' },
		{ name: 'cybergrind', value: 'hehe weezer' },
    { name: 'Extras:', value: 'mentioning agnabot saying FUCK, SHIT, or BITCH will prompt him to cuss back at you' },
	)
	message.channel.send({ embeds: [arembed] });
	
	}

   if (command === 'promo') {
      const arembed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('agnab shit')
  .addFields(
    { name: 'Youtube', value: 'https://www.youtube.com/channel/UCOM1RfwE9Zlj_p8umn7P_1A' },
    { name: 'Soundcloud', value: 'https://soundcloud.com/agnab-lol' },
    { name: 'Minecraft Mod', value: 'https://www.curseforge.com/minecraft/mc-mods/agnabs-scythes' },
    { name: 'AGNABOT source code', value: 'https://github.com/AGNAB712/agnabot' },
    { name: 'Discord Server', value: 'dude' },
  )
  message.channel.send({ embeds: [arembed] });
  
  }
	
  if (command === 'credits') {
  const arembed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Credits')
  .addFields(
    { name: 'AGNAB', value: 'most commands and p much everything' },
    { name: 'pirate_zip', value: '24/7 server and replit (things agnab is too dumb to figure out)' },
    { name: 'aether & granderutai', value: 'agnabot documentation' },
  )
  .setFooter({ text: 'want to be added here? contact me!' });
  message.channel.send({ embeds: [arembed] });
  
  }

  if (command === 'timer') {
    const reminderFlagIndex = args.findIndex(arg => arg.startsWith('-'));

    let reminderMessage = '';
    if (reminderFlagIndex !== -1) {
      reminderMessage = args.slice(reminderFlagIndex).join(' ').slice(1);
      args.splice(reminderFlagIndex, 1);
    }

    const duration = parseDuration(args);

    if (duration) {
      const milliseconds = durationToMilliseconds(duration);

      if (milliseconds > 0) {
        message.channel.send(`your timer is set for ${formatDuration(duration)}.`);

        setTimeout(() => {
          message.author.send(`timer done ${message.author}`);

          if (reminderMessage) {
            message.author.send(`remember, ${reminderMessage}`);
          }
        }, milliseconds);
      } else {
        message.channel.send('nah dude you got an invalid format. use the help command to see the correct formatting');
      }
    } else {
      message.channel.send('nah dude you got an invalid format. use the help command to see the correct formatting');
    }
  } 
     
 if (command === 'invite') {
        message.channel.send("here: https://discord.gg/Rjv2URZuYM");
     }
    
 if (command === 'mean') {
        message.channel.send("https://media.discordapp.net/attachments/1100521311534592041/1108196548124360725/image.png");
     }
     
  if (command === 'setstatus') {
 if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {

  const typeOfStatus = args.shift();
  const newStatus = args.join(' ');

  if (!typeOfStatus) {
    return message.channel.send('uhhh thats not valid (remember, you can do watching, playing, competing or listening)');
  }

  if (typeOfStatus.toLowerCase() === 'watching') {
  client.user.setActivity(newStatus, { type: ActivityType.Watching });
  message.channel.send(`my new status is watching ${newStatus}`);
  } else if (typeOfStatus.toLowerCase() === 'playing') {
  client.user.setActivity(newStatus);
  message.channel.send(`my new status is playing ${newStatus}`);
  } else if (typeOfStatus.toLowerCase() == 'competing') {
  client.user.setActivity(newStatus, { type: ActivityType.Competing });
  message.channel.send(`my new status is competing in ${newStatus}`);
  } else if (typeOfStatus.toLowerCase() == 'listening') {
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
        .setColor('Green')
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
    }
  }

  if (command === 'balance' || command === 'bal') {

    await loadSqlite();

    let targetUser = message.mentions.users.first();

    if (targetUser) {
    const userId = targetUser.id;
    const variableValue = await db.get(userId);

    if (!variableValue) {
  const userId = targetUser.id;
  await db.set(userId, 100);
  saveSqlite();
  const variableValue = await db.get(userId);
  message.reply(`their money is ${variableValue} agnabucks`);

    } else { 
    message.reply(`their money is ${variableValue} agnabucks`);
  }

  } else {

    let targetUser = message.author;

    if (targetUser) {
    const userId = targetUser.id;
    const variableValue = await db.get(userId);

    if (!variableValue) {
  const userId = targetUser.id;
  await db.set(userId, 100);
  saveSqlite();
  const variableValue = await db.get(userId);
  message.reply(`your money is ${variableValue} agnabucks`);

    } else { 
    message.reply(`your money is ${variableValue} agnabucks`);
  }


  }

}

}

     
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

    collector.on('collect', (reaction) => {
      if (reaction.count === 5) {
        categoryNames.push(categoryName);

        saveCategoryNames();

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
    });
  }
  
  if (command === 'forcecategory' && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    // Check if any category name was provided after the command
    if (args.length === 0) {
      message.channel.send('Please provide a category name.');
      return;
    }

    // Join the arguments into a single string
    const categoryName = args.join(' ');

        categoryNames.push(categoryName);
        saveCategoryNames();
        message.channel.send(`Category "${categoryName}" has been added.`);
  }

    
    if (command === 'toggleautoreact') {
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
    }
  }

  
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
}
  }

      if (command === 'togglesay') {
if (!await db.get('locked_' + message.author.id)) {
if (!says.includes(message.author.id)) {
message.delete();
says.push(message.author.id);
}
}
  }

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
      .setColor('#FFFF00')
      .setTitle(`${userName.username}`)
      .setDescription(`${userName.username} sent "${repliedMessageFull.content}"`)
      .setImage(userName.displayAvatarURL({ format: 'png', dynamic: true }));

        message.channel.send({ embeds: [revealEmbed] });

  }

  
  if (command === 'showcategories') {
    if (categoryNames.length === 0) {
      message.channel.send('its blank bro');
      return;
    }
    const categoriesMessage = categoryNames.map((category, index) => `${index + 1}. ${category}`).join('\n');

    message.channel.send(`current possible category names:\n${categoriesMessage}`);
  }

  
if (command === 'deletecategory') {
 if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    if (args.length === 0) {
      message.channel.send('gimme the index to delete');
      return;
    }

    const index = parseInt(args[0], 10);

    if (isNaN(index) || index < 1 || index > categoryNames.length) {
      message.channel.send('cant delete that bro');
      return;
    }

    const deletedCategory = categoryNames.splice(index - 1, 1)[0];
    saveCategoryNames();
    message.channel.send(`deleted "${deletedCategory}"`);
    
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

    if (command === 'freedomunits' || command === 'fu' || command === 'convert') {
    if (args.length !== 3) {
      return message.channel.send('gimme the right unit');
    }

    const value = parseFloat(args[0]);
    const fromUnit = args[1].toLowerCase();
    const toUnit = args[2].toLowerCase();

    const embed = new EmbedBuilder().setColor('Green')

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
    await message.channel.send({ files: [`./temp/${randomFile.name}`] });

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
      .setColor('Green')
      .setTitle('Calculator')
      .addFields(
      { name: 'Expression', value: `${expression}` }, 
      { name: 'Result', value: `${result}` }
      );

    message.reply({ embeds: [embed] });
  }
    
      if (command === 'piss') {
      //thanks chat-gpt for completely writing this code for me LMAO
    const targetUser = message.mentions.users.first();

    if (!targetUser) {
      return message.reply('You need to mention a user to piss on!');
    }

    const pissGifUrl = 'https://tenor.com/view/xluna-high-five-gif-25422702'; 
    const pissEmbed = new EmbedBuilder()
      .setColor('#FFFF00')
      .setTitle('piss')
      .setDescription(`${message.author} pissed on ${targetUser}`)
      .setImage(targetUser.displayAvatarURL({ format: 'png', dynamic: true }));

    message.channel.send({ embeds: [pissEmbed] });
  }

    if (command === 'ban') {

    if (!inBan) {

    const targetUser = message.mentions.members.first();

    if (!targetUser) {
      return message.channel.send('gimme a guy come on');
    }

    // Creating a countdown from 5 to 1
    let countdown = 10;
    inBan = true;
    const countdownInterval = setInterval( async () => {
      if (countdown > 0) {
        if (countdown > 3) {
        message.channel.send(`USER ${targetUser.user.username.toUpperCase()} WILL BE BANNED IN ${countdown}...`);
      } else {
        message.channel.send(`**USER ${targetUser.user.username.toUpperCase()} WILL BE BANNED IN ${countdown}...**`);
      }
        countdown--;
      } else {
        clearInterval(countdownInterval);
        message.channel.send(`USER ${targetUser.user.username.toUpperCase()} HAS BEEN BANNED.`);
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

        if (command === 'hug') {
      //thanks chat-gpt for completely writing this code for me LMAO
    const targetUser = message.mentions.users.first();

    if (!targetUser) {
      return message.reply('You need to mention a user to hug!');
    }

    if (targetUser === message.author) {
      return message.reply('you are chronically lonely');
    }

    if (targetUser.id === '1107764918293372989') {
      return message.react('😳');
    }

    if (targetUser.bot) {
      return message.reply('bro they are made of Steel wtf you on');
    }

    const pissEmbed = new EmbedBuilder()
      .setColor('Green')
      .setTitle(`${message.author.username} hugged ${targetUser.username}!`)
      .setImage(targetUser.displayAvatarURL({ format: 'png', dynamic: true }));

    message.channel.send({ embeds: [pissEmbed] });
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
    const resource = await createAudioResource('./peak.mp3');
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

  if (command === 'inventory' || command === 'inv') {

  await loadSqlite();

  const passes = await db.get(message.author.id + '_passes');

  let passNum = 0;

  if (passes) {
    passNum = parseInt(passes);
  }

  const channel = client.channels.cache.get('1085289780901842996');
  const messages = await channel.messages.fetch();
  const speechbubbles = messages.filter((msg) => {
    if (msg.content.includes(message.author.username)) {
    return msg.content;
  }
  })



  const invEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle(`${message.author.username}'s inventory `)
  .addFields({ name: 'TTS passes:', value: `${passNum}`})
  .setFooter({ text: 'send your speechbubbles with a.inv send (index)' })

  let speechToString = [];

  speechbubbles.forEach((msg, i) => {
    const words = msg.content.split(' ');
    speechToString.push(`${i}. ${words[0]}`)
  })

  if (speechbubbles.size > 0) {
  invEmbed.addFields({ name: 'Speechbubbles', value: `${speechToString.join('\n')}`})
  }

  if (args[0] == 'send') {

  if (!isNumeric(args[1])) {
    return message.reply('gotta be an index dude')
  }

  const theOne = speechToString[args[1] - 1]

  if (!theOne) {
    return message.reply('that does not exist')
  } else {
    const words2 = theOne.split(' ');
    message.channel.send(words2[1])
    message.channel.send(`(this speechbubble is owned by ${message.author.username})`)
    message.delete()
  }

  } else {

  message.channel.send({ embeds: [invEmbed] });

  }

  }

  if (command === 'tts') {

  const passes = await db.get(message.author.id + '_passes');

  if (!passes || passes === 0) {
  return message.reply('dont got no PASSES!')
  }

  const text = args.join(' ')

  if (text) {

  await message.channel.send({content: `${text}`, tts: true});

  await db.set(message.author.id + '_passes', passes - 1);

  await saveSqlite();

  } else {
    message.reply('cant say nothing dude')
  }

  }
    

    
    } else {
    
    if (message.content.includes('a.unlockdown') && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    message.channel.send('im free yipee');
    lockdown = 'false';
    }
    }
});

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
    
  if (users.includes(reaction.message.author.id) === false && user.id !== '1107764918293372989') {
reaction.message.react('yeah:1106953116311625768');
  }
  
 
  if (reaction.emoji.id === '1112395248337965166') {

  if (user.id === '765581160755363840') {
    message.channel.send('added that to the speechbubble pool')
      client.channels.cache.get('1085289780901842996').send(reaction.message.content)
  }
}

  
 
  
});



function updateCategoryName() {
        
  const channel = client.channels.cache.get('1092554907883683961');

  const randomName = categoryNames[getRandomInt(categoryNames.length)];
  client.channels.cache.get('1108491109258244156').send(randomName);
  
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

async function stopNull(guy) {

if (!(await db.get(guy))) {
  db.set(guy, 100)
}

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

async function findRandomMessage(message) {
    const server = await client.guilds.cache.get('969752864585035777');
    const channels = await server.channels.cache;
    const channelsFiltered1 = channels.filter((channel) => channel.type === 0);
    const channelsFiltered = channelsFiltered1.filter((channel) => channel.parent.id === '1092554907883683961');
    const randomChannel = channelsFiltered.random();


    randomChannel.messages.fetch().then((messages) => {
      // Exclude bot messages and the command message
      const filteredMessages = messages.filter((msg) => !msg.author.bot && msg.id !== message.id);

      // Select a random message
      const randomMessage = filteredMessages.random();

      const formattedDate = randomMessage.createdAt.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        timeZone: 'UTC'
      });

      const jumpLink = `https://discord.com/channels/${message.guild.id}/${randomChannel.id}/${randomMessage.id}`;

      // Send the random message, sender's name, and date
      let embed = new Discord.EmbedBuilder()
        .setTitle(randomMessage.content)
        .setFooter({ text: `- ${formattedDate}`})
        .setColor('00ff2f')
        .setAuthor({ name: randomMessage.author.username, iconURL: randomMessage.author.displayAvatarURL()})
        .setDescription(`[jump](${jumpLink})`);

      if (randomMessage.attachments.size > 0) {
        embed.setImage(randomMessage.attachments.first())
      }

      message.channel.send({ embeds: [embed] });
    }).catch(async err =>{
await findRandomMessage(message);
    })
}

function findUserByUsername(guild, username) {
  return guild.members.cache.find(
    (member) => member.user.username.toLowerCase().includes(username.toLowerCase())
  );
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

client.login(token);
keepAlive();
