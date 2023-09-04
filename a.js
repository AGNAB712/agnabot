const { Client, GatewayIntentBits, MessageContent, GuildMessages, MessageCreate } = require('discord.js');
const Discord = require('discord.js');

const client = new Client({
intents: [
  Discord.GatewayIntentBits.Guilds,
  Discord.GatewayIntentBits.GuildMessages,
  Discord.GatewayIntentBits.MessageContent,
  ],
  partials: [Discord.Partials.Message, Discord.Partials.Channel, Discord.Partials.Reaction],
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
    console.log('checkpoint 0'); // testing checkpoint
  if (message.author.bot) return; // Ignore messages from bots
  if (message.content.includes('e')) {
    console.log('checkpoint 1'); // testing checkpoint
    message.author.timeout(1 * 60 * 1000, '(this is a random action done by the random bot)');
    message.channel.send('e');
  };
});

client.login('ODk3NTkwNDEyMDQxMTM0MTAw.GyOO6k.C5Ib1lsBBfar6iAlXRfy8rbnlDrHi4QqbcHatI');