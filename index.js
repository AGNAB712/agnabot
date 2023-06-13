const Discord = require('discord.js');
require("dotenv").config();
const keepAlive = require('./server.js')
const { ActivityType } = require("discord.js");
const fs = require('fs');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus } = require('@discordjs/voice');
const voice = require('@discordjs/voice');
const ytdl = require('ytdl-core');
const scdl = require('soundcloud-downloader').default;

// Create a new Client instance
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

const player = createAudioPlayer();

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

const channelId = '1117068125586866218';
const youtubeChannelId = process.env.YOUTUBECHANNELID;

const prefix = `a.`;

let noFirst = 'true';

let categoryNames = ['judgement', 'talk', 'talkity talk', 'talking talk', 'the talkest', 'talkity talkity', 'talkity talkity talkity talk', 'talk talkity', 'oh gabriel'];

let users = [];

let queue = [];

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
  client.user.setPresence({
			process: process.pid,
			status: 'invisible'
		});
      client.user.setActivity(/* change what is inside of the `` quotes to change the status suffix */`you...`, { type: ActivityType./* you can change this to be the prefix of the status*/Listening });
//      client.user.
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
if (lockdown === 'false') {



//dumb shit
	if(message.author.id === '907055124503994398') {
		message.react('🤓');
	}
	

    if(message.author.id!== '437808476106784770') {

  
    if(message.author.id !== '1107764918293372989') {
    if (message.content.toLowerCase().includes('ohio')) {
        message.channel.send('OHIO KILLED MY GRANDMA............');
    }
    }

    if (message.content.toLowerCase().includes('sus') && !(message.content.toLowerCase().includes('jesus'))) {
        message.channel.send('lol you are So funny LOL lol lol i am lmfao i am');
    }
    
    if (message.content.toLowerCase().includes('ayo') || message.content.toLowerCase().includes('🤨')) {
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
    
    
 //actual commands
 if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).trim().split(' ');
  const command = args.shift().toLowerCase();

  if (command === "play") {


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

    const streamUrl = args.join(' ');
    queue.push(streamUrl);

let regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;

const regex2 = /^(?:https?:\/\/)?(?:www\.)?youtu\.be(?:\S+)?$/;

player.addListener("stateChange", async (oldOne, newOne) => {
    if (newOne.status == "idle") {
      queue.shift();
      console.log(queue);
      curPlay = false

let regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;

const regex2 = /^(?:https?:\/\/)?(?:www\.)?youtu\.be(?:\S+)?$/;

if (regex.test(queue[0]) || regex2.test(queue[0])) {

    const stream = ytdl(queue[0], { filter: 'audioonly', ...streamOptions });

    // Create an audio player and play the audio stream
    const resource = createAudioResource(stream);
    player.play(resource);
    connection.subscribe(player);

    message.channel.send(`now playing ${queue[0]}`);

  } else {

  regex = /^(?:https?:\/\/)?(?:www\.)?soundcloud\.com(?:\S+)?$/;

  if (regex.test(queue[0])) {
try {

        const trackInfo = await scdl.getInfo(queue[0]);
        const stream = await scdl.download(queue[0], process.env.SOUNDCLOUDID);
        const resource = createAudioResource(stream);

        connection.subscribe(player);
        player.play(resource);

        message.reply(`now playing ${queue[0]}`);

          } catch (error) {
      console.error('Error fetching SoundCloud track:', error);
      message.reply('An error occurred while playing the SoundCloud track.');
    }

  }

}
    }
});

player.addListener(AudioPlayerStatus.Playing, () => {
  curPlay = true
});

regex = /^(?:https?:\/\/)?(?:www\.)?youtube\.com(?:\S+)?$/;




if (!curPlay) {

if (regex.test(queue[0]) || regex2.test(queue[0])) {

    const stream = ytdl(queue[0], { filter: 'audioonly', ...streamOptions });

    // Create an audio player and play the audio stream
    const resource = createAudioResource(stream);
    player.play(resource);
    connection.subscribe(player);

    message.channel.send(`now playing ${queue[0]}`);

  } else {

  regex = /^(?:https?:\/\/)?(?:www\.)?soundcloud\.com(?:\S+)?$/;

  if (regex.test(queue[0])) {
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

  }

}

} else { message.channel.send(`added that to the queue`); }

};

if (command === 'stop') {
  try {
  const gid = message.guild.id
  voice.getVoiceConnection(gid).disconnect();
  queue = [];
  } catch (error) { console.error('bro', error); }
  }

if (command === 'skip') {

if (queue.length > 0) {
  player.stop();
}

}

if (command === 'queue') {

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
  
  if (command === 'help') {

    if (args[0] === null) {
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
    { name: 'a.help admin', value: 'brings up the admin help menu (all the commands are admin only)' },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [helpEmbed] });

} else if (args[0] === 'fun') {
            const felpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.addcategory', value: `suggests something for the random selection of category names \n once a message reaches 5 thumbs ups it is added` },
    { name: 'a.say', value: `makes agnabot say whatever... \n formatted as a.say text` },
    { name: 'a.sb/a.speechbubble', value: `gets a random speechbubble from agnabs collection (why does he have so many)` },
    { name: 'a.autoresponses/a.ar', value: `gives a list of agnabot's automatic responses` },
    { name: 'a.showcategories', value: `shows the possible category names from agnabot to pick from` },
    { name: 'a.mean', value: 'He will never be mean!' },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

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
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [uelpEmbed] });
} else if (args[0] === 'agnaradio') {
            const aelpEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  //.setURL('https://discord.js.org/')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  //.setDescription('Some description here')
  //.setThumbnail('https://i.imgur.com/AfFp7pu.png')
  .addFields(
    { name: 'a.play', value: 'plays a youtube or soundcloud link' },
    { name: 'a.queue', value: 'shows the queue' },
    { name: 'a.skip', value: 'skips a song' },
    { name: 'a.stop', value: 'stops the music and resets the queue' },
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
    { name: 'a.deletecategory', value: `deletes a category from the list (admin only) \n formatted as a.deletecategory (category index)` },
  )
  //.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
  //.setImage('https://i.imgur.com/AfFp7pu.png')
  //.setTimestamp()
  //.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

  message.channel.send({ embeds: [delpEmbed] });
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
	)
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
    const newStatus = args.join(' ');
    client.user.setActivity(newStatus);
    message.channel.send(`my new status is ${newStatus}`);
    } 
    else {
    message.channel.send(`lol no perms`);
    }
    
     }
     
if (command === 'addcategory') {
    // Check if any category name was provided after the command
    if (args.length === 0) {
      message.channel.send('Please provide a category name.');
      return;
    }
    
    message.delete();

    // Join the arguments into a single string
    const categoryName = args.join(' ');

    // Send the message and add thumbs up reaction
    const sentMessage = await message.channel.send(categoryName);
    await sentMessage.react('👍');

    // Create a filter to check for 5 thumbs up reactions
    const filter = (reaction, user) => reaction.emoji.name === '👍' && !user.bot;
    const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

    // Event listener for collecting reactions
    collector.on('collect', (reaction) => {
      if (reaction.count === 5) {
        // Add the category name to the array
        categoryNames.push(categoryName);

        // Save the array data to the file
        saveCategoryNames();

        // Send a confirmation message
        message.channel.send(`Category "${categoryName}" has been added.`);

        // Stop the collector
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
  
  if (command === 'forceaddcategory') {
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
    if (args.length === 0) {
      message.channel.send('i cant just say nothing bro');
      return;
    }
    message.channel.send(args.join(' '));
    message.delete()
  }

  
  if (command === 'showcategories') {
    if (categoryNames.length === 0) {
      message.channel.send('its blank bro');
      return;
    }
    const categoriesMessage = categoryNames.map((category, index) => `${index + 1}. ${category}`).join('\n');

    message.channel.send(`current possible category names:\n${categoriesMessage}`);
  }
    
      if (command === 'showusers') {
    if (users.length === 0) {
      message.channel.send('its blank bro');
      return;
    }
    const categoriesMessage = users.map((category, index) => `${index + 1}. ${category}`).join('\n');

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
    if (!channel) return console.log('Invalid channel ID.');
    const messages = await channel.messages.fetch();
    const attachments = messages.filter((msg) => msg.attachments.size > 0);
    if (attachments.size === 0) {
      return console.log('No attachments found in the channel.');
    }
    const randomMessage = attachments.random();
    message.channel.send(randomMessage.attachments.first().url);
    message.delete()
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
  const reactedMessage = reaction.message;
  const messageContent = reactedMessage.content;
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const embeddedUrls = messageContent.match(urlRegex);
  if (embeddedUrls && embeddedUrls.length > 0) {
    console.log('Embedded URL(s) detected in the reacted message!');
    embeddedUrls.forEach(url => {
      reaction.message.channel.send('added whatever that was to the speechbubble pool')
      client.channels.cache.get('1085289780901842996').send(url)
    });
  }   } 
  
 
  
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




client.login(token);
keepAlive();
