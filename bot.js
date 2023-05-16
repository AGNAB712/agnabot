const Discord = require('discord.js');
require("dotenv").config();

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

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.channels.cache.get('831714424658198532').send('hallo guys it is me i am online');
});

client.on('messageCreate', (message) => {
    if (message.content.includes('ohio')) {
        message.channel.send('OHIO KILLED MY GRANDMA............');
    }
    if (message.content.includes('sussy')) {
        message.channel.send('lol you are So funny LOL lol lol i am lmfao i am');
    }
    if (message.content.includes('sus')) {
        message.channel.send('lol you are So funny LOL lol lol i am lmfao i am');
    }
    
    if (message.mentions.has('665699278647197716')) {
        message.channel.send('AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA');
    };
    
    if (message.content.includes('cybergrind')) {
        message.channel.send('https://media.discordapp.net/attachments/1100521311534592041/1107968544492224532/image.png?width=197&height=585');
    }

    
});

client.on('messageReactionAdd', (reaction, user) => {
    if(user.id !== 1107764918293372989) {
    if(reaction.emoji.name !== '⭐') {
            reaction.message.react("👍");
    }
    }
});


client.login(token);
