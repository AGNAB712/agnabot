const Discord = require('discord.js');
require("dotenv").config();
const keepAlive = require('./server.js')
const { ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus, entersState, NoSubscriberBehavior } = require('@discordjs/voice');
const voice = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;
const { QuickDB } = require("quick.db");
const db = new QuickDB(); // will make a json.sqlite in the root folder

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

const currentDateTime = new Date();

const player = createAudioPlayer({ behaviors: { noSubscriber: NoSubscriberBehavior.Stop } });

    let curPlay = false;

let msgId = [];

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

let categoryNames = ["hi","what the freak","poopoo","hallo","chattery","shake my pants","loud","sillies","very cool","telling","text","Uÿ=","but they didnt gave me my banana 👿","Pop Bob Smellex","dog pouder 🐶 consumers gang","FEETLOVERS","i love feet","the elder variable 😤","the adult constant 😒","the baby function 🤑","the child equation ☺️","📍","⌂","👾","Wild","ˢᵘʳʳᵉᵃˡ - Bambi Fantrack (LOUD, blue's outerspacial abominations 1/8)","bambi","OLMA! Olimar. 🥕","🫏💨","noxy we need to cook","i HATE dave and Bambi…. Grrrrrrrrrrrr","person in charge for a couple 👫 👫 and 8⃣ 8⃣ 8⃣ 8⃣ in a position 🖥️ 🖥️ 🖥️ 🖥️ I have a 600 😟 😟","why is the category saying hi to me bro","'♥Щ@мIi╞амн !K 8↑╕","https://media.discordapp.net/attachments/1109957407636987984/1118010322108813332/Bre.gif%22%22AGNABOB%22%22/%22the mwaganzanists","https://media.discordapp.net/attachments/967405625665540156/1031932494435586078/agony.gif%22,%22tat 🗽 tat 🗽 tat 🗽 tat 🗽","pro tip: interestingshallot13 will get a suprise after his vacation 🤫","🥺🥺🥺haiii :3 hewwo","འȺԱ↻ටԱϚ Manbi","untouchable grass","https://cdn.discordapp.com/attachments/1092557930349477960/1118344310291693688/image.png%22,%22Agnab Boyclit ❌","penit butt e:Cryingaboutit: :Cryingaboutit: :Cryingaboutit:"]

let users = [];

let queue = [];

const cuss = ['FUCK','SHIT','BITCH']

let sbLoop = 0;

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
    message.reply('dafuq you want from pirate?')
  }
  
	if(message.author.id === '907055124503994398') {
		message.react('🤓');
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
    
    if (message.content.toLowerCase().includes(' ayo ') || message.content.toLowerCase().includes('🤨') || message.content.toLowerCase().includes(' ayo? ')) {
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

  if (command === 'agnaradio') {

  const command2 = args[0]

  if (command2 === "play") {


    // Check if the message author is in a voice channel
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      return message.reply('You need to be in a voice channel to use this command.');
    }

    // Join the voice channel
    const connection = joinVoiceChannel({
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
    };

    const streamUrl = args[1];


let regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;

const regex2 = /^(?:https?:\/\/)?(?:www\.)?youtu\.be(?:\S+)?$/;

player.addListener("stateChange", async (oldOne, newOne) => {
    if (newOne.status == "idle") {
      queue.shift();
      console.log(queue);
      curPlay = false
      
      if (!curPlay && type !== 'none' && queue.length > 0) {

if (type === 'youtube') {

    const stream = ytdl(queue[0], { filter: 'audioonly', ...streamOptions });

    // Create an audio player and play the audio stream
    const resource = createAudioResource(stream);
    player.play(resource);
    subscription = connection.subscribe(player);

    message.channel.send(`now playing ${queue[0]}`);
    
  } else if (type === 'soundcloud') {
	try {

        const trackInfo = await scdl.getInfo(queue[0]);
        const stream = await scdl.download(queue[0], process.env.SOUNDCLOUDID);
        const resource = createAudioResource(stream);

        connection.subscribe(player);
        player.play(resource);

    message.channel.send(`now playing ${queue[0]}`);

          } catch (error) {
      console.error('Error fetching SoundCloud track:', error);
      message.reply('An error occurred while playing the SoundCloud track.');
    }

} else { message.channel.send(`added that to the queue`); }

}


    }
});

player.addListener(AudioPlayerStatus.Playing, () => {
  curPlay = true
});

regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;

      const youtubeRegex = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.?be)\/.+$/;
      const soundcloudRegex = /^(https?:\/\/)?(www\.)?soundcloud\.com\/.+$/;
      
      let type = 'none';

      if (youtubeRegex.test(streamUrl)) {
type = 'youtube';
      } else if (soundcloudRegex.test(streamUrl)) {
type = 'soundcloud';
      } else {
        message.reply('invalid link');
type = 'none';
      }
    
    if (type !== 'none') {
    queue.push(streamUrl);
    }
    
      if (youtubeRegex.test(queue[0])) {
type = 'youtube';
      } else if (soundcloudRegex.test(queue[0])) {
type = 'soundcloud';
      } else {
type = 'none';
      }


if (!curPlay && type !== 'none') {

if (type === 'youtube') {

    const stream = ytdl(queue[0], { filter: 'audioonly', ...streamOptions });

    // Create an audio player and play the audio stream
    const resource = createAudioResource(stream);
    player.play(resource);
    connection.subscribe(player);

    message.channel.send(`now playing ${queue[0]}`);

  } else if (type === 'soundcloud') {
	try {

        const trackInfo = await scdl.getInfo(queue[0]);
        const stream = await scdl.download(queue[0], process.env.SOUNDCLOUDID);
        const resource = createAudioResource(stream);

        connection.subscribe(player);
        player.play(resource);

    message.channel.send(`now playing ${queue[0]}`);

          } catch (error) {
      console.error('Error fetching SoundCloud track:', error);
      message.reply('An error occurred while playing the SoundCloud track.');
    }

} else { message.channel.send(`added that to the queue`); }

}

};

if (command2 === 'stop') {
  try {
  const gid = message.guild.id
  player.stop();
  voice.getVoiceConnection(gid).disconnect();
  getVoiceConnection(gid).destroy();
  queue = [];
  } catch (error) { console.error('bro', error); }
  }

if (command2 === 'skip') {

if (queue.length > 0) {
  player.stop();
}

}

if (command2 === 'queue') {

  if (queue.length > 0) {

      const queueE = new EmbedBuilder()
      .setTitle('AGNARADIO')
      .setDescription('Queue:')
      .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
      .setColor('Green');
    queue.forEach((element, i) => {
      if (i !== 0) {
      queueE.addFields({ name: `Number ${i}`, value: element },);
    } else {
      queueE.addFields({ name: `Now Playing`, value: element },);
    }
    });

    message.channel.send({ embeds: [queueE] });
} else {

 message.channel.send('no queue') 
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

    await db.set(playerID, parseInt(curbal) + getRandomInt(50) + 50);
    saveSqlite();

    curbal = await db.get(playerID);
      
      message.reply(`great uhhh job working your money is now ${curbal}`);
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

      if (message.author.id === "907055124503994398") {
        chance = 1;
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

    if (command === 'leaderboard' || command === 'lb') {
    const guild = message.guild;
    
    // Fetch all user data from the database
    const userData = db.all().filter((data) => data.ID.startsWith('userdata_'));

    // Sort the data based on the number (assuming it's stored under 'number' key)
    const sortedData = userData.sort((a, b) => b.data.number - a.data.number);

    // Prepare the leaderboard embed
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Leaderboard')
      .setDescription(`Here are the top users in ${guild.name}:`)
      .setTimestamp();

    // Loop through the sorted data and add fields to the embed
    let count = 0;
    for (const data of sortedData) {
      const userId = data.ID.slice(9);
      const member = guild.members.cache.get(userId);
      if (member) {
        count++;
        embed.addField(`${count}. ${member.user.username}`, `Number: ${data.data.number}`);
      }
      if (count === 10) break; // Show top 10 users
    }

    // Send the leaderboard embed
    message.channel.send(embed);

  }

  if (command === 'test') {

    message.channel.send('computing...')
    const data = await db.all();
    const entries = Object.entries(data);
    const numArray = [];
    const peopleArray = [];

    
    for (const [key, value] of entries) {
      const userId = value.id;
      const username = await getUsername(userId, message.guild, value.value);

      if (username) {
        numArray.push(value.value);
        peopleArray.push(username.user.username);
        console.log(username.user.username);
      }
    }



    message.channel.send(`done! \n${numArray.sort((a, b) => b - a)}\n\n${peopleArray}`);

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
    { name: 'a.convert', value: `converts feet to meters or meters to feet \nformatted as "a.convert (meters/feet) (amount)"` },
    { name: 'a.credits', value: `gives the credits for agnabot` },
    { name: 'a.promo', value: `gives all of agnab's shit` },
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

    const matchingMessages = targetMessages.filter((msg) =>
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

    message.delete()

    const words = randomMessage.content.split(' ');

    if (randomMessage.content.includes('https')) {

      message.channel.send(words[0]);

      if (words[1]) {

      message.channel.send(`(this speechbubble is property of ${words[1]})`)

    }

    } else {

      message.channel.send(randomMessage.attachments.first().url);

    }

  }

  if (command === 'convert') {
    const value = parseFloat(args[1]);

    if (isNaN(value)) {
      message.reply('gimme a Cool Number Broski');
      return;
    }

    const unit = args[0];

    const embed = new EmbedBuilder().setColor('Green')

    if (unit === 'meters') {
      const feet = value * 3.28084;
      embed.setTitle(`${value} meters is ${feet.toFixed(2)} feet.`)
      message.reply({ embeds: [embed] });
    } else if (unit === 'feet') {
      const meters = value / 3.28084;
      embed.setTitle(`${value} feet is ${meters.toFixed(2)} meters`)
      message.reply({ embeds: [embed] });
    } else {
      message.reply('gimme either feet or meters bro');
    }
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

  const invEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle(`${message.author.username}'s inventory `)
  .addFields({ name: 'TTS passes:', value: `${passNum}`})

    message.channel.send({ embeds: [invEmbed] });

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
    const channelsFiltered = channels.filter((channel) => channel.type === 0);
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
//console.log(err);
await findRandomMessage(message);
    })
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
