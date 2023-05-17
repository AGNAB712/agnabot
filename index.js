const Discord = require('discord.js');
require("dotenv").config();
const keepAlive = require('./server.js')
const { ActivityType } = require("discord.js");

// Create a new Client instance
const client = new Discord.Client({ intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  Discord.GatewayIntentBits.GuildMembers,
  Discord.GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
  })

const token = process.env.TOKEN;

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

const channelId = '1092546678613094461';
const youtubeChannelId = process.env.YOUTUBECHANNELID;

const prefix = `(A)`;

let noFirst = 'true';

const categoryNames = ['judgement', 'talk', 'talkity talk', 'talking talk', 'the talkest', 'talkity talkity', 'talkity talkity talkity talk', 'talk talkity', 'oh gabriel'];


client.on('ready', async () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get('1108491109258244156').send('hallo guys it is me i am online');
      client.user.setActivity(/* change what is inside of the `` quotes to change the status suffix */`to you...`, { type: ActivityType./* you can change this to be the prefix of the status*/Listening });

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



client.on('messageCreate', (message) => {
if (lockdown === 'false') {

//dumb shit
	  if(message.author.id === '907055124503994398') {
		message.react('🤓');
	}
  
    if(message.author.id !== '1107764918293372989') {
    if (message.content.toLowerCase().includes('ohio')) {
        message.channel.send('OHIO KILLED MY GRANDMA............');
    }
    }
    if (message.content.toLowerCase().includes('sussy')) {
        message.channel.send('lol you are So funny LOL lol lol i am lmfao i am');
    }
    if (message.content.toLowerCase().includes('sus')) {
        message.channel.send('lol you are So funny LOL lol lol i am lmfao i am');
    }
        
    if (message.content.toLowerCase().includes('cybergrind')) {
        message.channel.send('https://media.discordapp.net/attachments/1100521311534592041/1107968544492224532/image.png?width=197&height=585');
    }
  
    if (message.content.includes('(A)lockdown') && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
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
  
  if (command === 'help') {
      const helpEmbed = new EmbedBuilder()
	.setColor('Green')
	.setTitle('Command List')
	//.setURL('https://discord.js.org/')
	.setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
	//.setDescription('Some description here')
	//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: '(A)help', value: 'brings up this screen' },
		{ name: '(A)lockdown', value: 'locks down agnabots responses in case of abuse' },
		{ name: '(A)unlockdown', value: 'stops lockdown' },
		{ name: '(A)invite', value: 'gives the invite link' },
		{ name: '(A)setstatus', value: `sets status obv\nformatted as (A)setstatus (status)` },
		{ name: '(A)timer', value: `timer/reminder command, formatted as "(A)timer hours minutes seconds" \n optionally you can add a reminder by typing in a one string phrase at the end starting with "-"` },
		{ name: '(A)mean', value: 'He will never be mean!' },
	)
	//.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	//.setImage('https://i.imgur.com/AfFp7pu.png')
	//.setTimestamp()
	//.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

	message.channel.send({ embeds: [helpEmbed] });
	
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


    
    } else {
    
    if (message.content.includes('(A)unlockdown') && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
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

client.on('messageReactionAdd', (reaction, user) => {
    if(user.id !== '1107764918293372989') {
    if(reaction.emoji.name !== '⭐') {
            reaction.message.react('<:yeah:1106953116311625768>');
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



client.login(token);
keepAlive();
