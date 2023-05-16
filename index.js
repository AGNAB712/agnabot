const Discord = require('discord.js');
require("dotenv").config();
const keepAlive = require('./server.js')

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


client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get('831714424658198532').send('hallo guys it is me i am online');
      client.user.setActivity(`doing your mom`);
});



client.on('messageCreate', (message) => {
if (lockdown === 'false') {

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
    
    if (message.mentions.has('665699278647197716')) {
        message.channel.send('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    };
    
    if (message.content.toLowerCase().includes('cybergrind')) {
        message.channel.send('https://media.discordapp.net/attachments/1100521311534592041/1107968544492224532/image.png?width=197&height=585');
    }
  
    if (message.content.includes('(A)lockdown') && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    message.channel.send("ya'll are dumb");
    lockdown = 'true';
    }
    
    if (message.content.includes('(A)invite')) {
    message.channel.send("here: https://discord.gg/Rjv2URZuYM");
    }

    
    
    if (message.content.includes('(A)help')) {
    const exampleEmbed = new EmbedBuilder()
	.setColor('Green')
	.setTitle('Command List')
	//.setURL('https://discord.js.org/')
	.setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
	//.setDescription('Some description here')
	//.setThumbnail('https://i.imgur.com/AfFp7pu.png')
	.addFields(
		{ name: '(A)help', value: 'brings up this screen' },
		{ name: '(A)subscribe', value: 'adds youtube notifications to a channel' },
		{ name: '(A)lockdown', value: 'locks down agnabots responses in case of abuse' },
		{ name: '(A)unlockdown', value: 'stops lockdown' },
		{ name: '(A)invite', value: 'gives the invite link' },
	)
	//.addFields({ name: 'Inline field title', value: 'Some value here', inline: true })
	//.setImage('https://i.imgur.com/AfFp7pu.png')
	//.setTimestamp()
	//.setFooter({ text: 'Some footer text here', iconURL: 'https://i.imgur.com/AfFp7pu.png' });

message.channel.send({ embeds: [exampleEmbed] });
    }
    
    } else {
    
    if (message.content.includes('(A)unlockdown') && message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
    message.channel.send('im free yipee');
    lockdown = 'false';
    }

    
    
    }
    
});

client.on('messageReactionAdd', (reaction, user) => {
    if(user.id !== '1107764918293372989') {
    if(reaction.emoji.name !== '⭐') {
            reaction.message.react('<:yeah:1106953116311625768>');
    }
    }
});

const { google } = require('googleapis');

const googleAuth = process.env.GOOGLEAPIAUTH;

const youtube = google.youtube({
  version: 'v3',
  auth: googleAuth
});

let lastVideoId = null;

client.on('messageCreate', async (message) => {
  if (message.content === '(A)subscribe') {
 if (message.member.permissions.has(PermissionsBitField.Flags.Administrator)) {
  message.channel.send('beep bop boop this channel will receive video notifications');
    try {
      const channelData = await youtube.channels.list({
        part: 'contentDetails',
        id: youtubeChannelId
      });

      const uploadsPlaylistId = channelData.data.items[0].contentDetails.relatedPlaylists.uploads;
          console.log(uploadsPlaylistId);

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

        const notificationEmbed = `<@&969759643880554496> wow new video check it out.............\n${videoUrl}`

        const channel = await client.channels.fetch(channelId);
        if (channel && channel instanceof Discord.TextChannel) {
          channel.send(notificationEmbed);
        }
        }
      }, 60000); // Check every 1 minute
    } catch (error) {
      console.error('Error:', error);
    }
  } else {
  message.channel.send('lol no permision');
  }

  } 
  });

const channelId = '831714424658198532';
const youtubeChannelId = process.env.YOUTUBECHANNELID;

client.login(token);
keepAlive();
