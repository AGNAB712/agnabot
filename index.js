//requirements
require("dotenv").config();
const { Client, GatewayIntentBits, Partials, ActivityType, ActionRowBuilder, ButtonBuilder, ButtonStyle, WebHookClient, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, PermissionsBitField, EmbedBuilder } = require("discord.js");
const { QuickDB: OriginalQuickDB } = require("quick.db")
const path = require("path")
const fs = require("fs")
const os = require("os")

const dataDir =
  process.env.AGNABOT_DATA_DIR ??
  path.join(os.homedir(), ".local/share/agnabot")
fs.mkdirSync(dataDir, { recursive: true })

// override QuickDB to always use absolute path
require.cache[require.resolve("quick.db")].exports.QuickDB = class QuickDB extends OriginalQuickDB {
  constructor(options = {}) {
    options.filePath = options.filePath || path.join(dataDir, "json.sqlite")
    super(options)
  }
}


//require misc functions
const { autoReact } = require('./info/autoReactions.js')
const { getGlobalVar, setGlobalVar } = require('./info/editGlobalJson.js')
const { getTextUntilDelimiter, isvalidhexcode, readJSONFile, parseDuration, durationToMilliseconds, formatDuration, updateCategoryName, hasArtifact, getRandomInt, validUserId, isNumeric, objectPage, fishingLoot, percentify, updateDatabase } = require('./info/generalFunctions.js')
const { saveSqlite, forceSaveSqlite, loadSqlite, loadCurrentStatus, doChildLabor, updatePets, payPets, deleteNonNumericIds, deprivePets, loadWebsite } = require('./info/initFunctions.js')
const { marriageImage, podium, fetchProfilePicture, balance, petImage } = require('./info/canvasFunctions.js')

const { google } = require('googleapis');
const credentials = require('./info/googleServiceAccount.json')




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
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.DirectMessageTyping,
    GatewayIntentBits.DirectMessages,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
  disableMentions: 'everyone'
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
/*if (process.env.PM2_HOME) {
replit = true;
replitText = 'strats sent this'
} else {
replit = false
replitText = 'agnab sent this'
}*/

let drive

//ready stuff
client.on('ready', async () => {

if (replit) {
    console.log("hi strats");
} else {
    console.log("hi agnab");
}
console.log(`logged in as ${client.user.tag}`);

  await loadSqlite(client, replit);
  //await loadWebsite()
  loadCurrentStatus(client);
  await updateCategoryName(client.channels.cache.get('1092554907883683961'), replit); 
  setInterval(updateCategoryName, 600000, client.channels.cache.get('1092554907883683961'), replit); 
  setInterval(doChildLabor, 300000);
  setInterval(updatePets, 300000);
  setInterval(forceSaveSqlite, 300000, client, replit);
  //setInterval(loadWebsite, 300000);
  setInterval(function() {
    const now = new Date();
    const minutes = now.getMinutes();
    if (minutes === 30) {
      payPets();
    }
  }, 60000);

const auth = new google.auth.GoogleAuth({
  credentials: credentials,
  scopes: ['https://www.googleapis.com/auth/drive.readonly']
});
drive = google.drive({ version: 'v3', auth: auth });
 
});


client.on('messageCreate', async (message) => {

if (message.channel.type === 1) {return}
if (replit && message.guild.id == '831714424658198529') {return}
if (!message.author.bot) {lastmessage = message}

if (message.channel.id === minecraftchat?.id && !message.author.bot && replit) {
  const { getGlobalVar, setGlobalVar } = require('./info/editGlobalJson.js')
}

const content = message.content.trim();

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
      if (commands[command]?.category === 'git' && message.author.id != '765581160755363840') {return message.reply('**<:AgnabotX:1153460434691698719> ||** only agnab can use git commands')}

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
  updatePets()
}

if (command === 'categoryupdate') {
  const array = [];
  const fileContents = fs.readFileSync('./categories.txt', 'utf8');
  const lines = fileContents.split('\n');

  lines.forEach(line => {
    const processedLine = line.replace(/^\d+\.\s/, '');
    array.push(processedLine);
  });

  await db.set('category', array)
  message.reply('done')
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
  if (customId === 'dadgood') {
    const repliedMessage = await interaction.message.channel.messages.fetch(interaction.message.reference.messageId)
    const embeds = interaction.message.embeds
    const theGoodEmbed = embeds[0]
    const jokeId = theGoodEmbed.footer.text.substr(9)
    
    const joke = await db.get(`jokes.${jokeId}`)
    if (!joke) return
    if (joke.gooded.includes(interaction.user.id)) return await interaction.reply({
      content: 'you are cooked little bro',
      ephemeral: true
    });
    joke.score++
    joke.gooded.push(interaction.user.id)
    if (joke.baded.includes(interaction.user.id)) {
      const index = joke.baded.indexOf(interaction.user.id)
      joke.baded.splice(index, 1)
      joke.score++
    }
    await db.set(`jokes.${jokeId}`, joke)
    await interaction.reply({
      content: `the joke's score is now ${joke.score}`,
      ephemeral: true
    });

    interaction.message.edit({ content: `**<:AgnabotCheck:1153525610665214094> ||** joke score: ${joke.score}` })
  }
  if (customId === 'dadsucks') {
    const repliedMessage = await interaction.message.channel.messages.fetch(interaction.message.reference.messageId)
    const embeds = interaction.message.embeds
    const theGoodEmbed = embeds[0]
    const jokeId = theGoodEmbed.footer.text.substr(9)
    
    const joke = await db.get(`jokes.${jokeId}`)
    if (!joke) return
    if (joke.baded.includes(interaction.user.id)) return await interaction.reply({
      content: 'you are cooked little bro',
      ephemeral: true
    });
    joke.score--
    joke.baded.push(interaction.user.id)
    if (joke.gooded.includes(interaction.user.id)) {
      const index = joke.gooded.indexOf(interaction.user.id)
      joke.gooded.splice(index, 1)
      joke.score--
    }
    await db.set(`jokes.${jokeId}`, joke)
    await interaction.reply({
      content: `the joke's score is now ${joke.score}`,
      ephemeral: true
    });

    interaction.message.edit({ content: `**<:AgnabotCheck:1153525610665214094> ||** joke score: ${joke.score}` })
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

  const myPet = await db.get(`${id}.pet`)
  if (!myPet || myPet === 'null') {return interaction.message.channel.send('you dont have a pet')}

  if (customId === 'feed') {
  if (myPet.hunger + 20 >= 100) {
  await db.set(`${id}.pet.hunger`, 100) 
  } else {
  await db.set(`${id}.pet.hunger`, myPet.hunger + 20) 
  }
  await db.set(id+'.a', parseInt(curbal) - 10) 
  await interaction.reply({
  content: `you fed ${myPet.name} CONGRATS!`,
  ephemeral: true
  });
  }

  if (customId === 'play') {
  await db.set(`${id}.pet.affection`, 100) 
  await interaction.reply({
  content: `you played with ${myPet.name} CONGRATS!`,
  ephemeral: true
  });
  }

  if (customId === 'heal') {
  if (myPet.health + 50 >= 100) {
    await db.set(`${id}.pet.health`, 100) 
  } else {
    await db.set(`${id}.pet.health`, myPet.health + 50) 
  }
  await interaction.reply({
  content: `you healed ${myPet.name} CONGRATS!`,
  ephemeral: true
  });
  await db.set(id+'.a', parseInt(curbal) - 50) 
  }

  if (customId === 'revive') {
    await db.set(`${id}.pet.health`, 25) 
    await db.set(`${id}.pet.hunger`, 25) 
    await db.set(`${id}.pet.affection`, 25) 
    await interaction.reply({
      content: `i hope you die soon`,
      ephemeral: true
    });
    await db.set(id+'.a', parseInt(curbal) - 1000)

    let row = new ActionRowBuilder()

    const feed = new ButtonBuilder()
          .setCustomId('feed')
          .setLabel('Feed (10 agnabucks)')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1180752541097668708');

    const play = new ButtonBuilder()
          .setCustomId('play')
          .setLabel('Play (Free)')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1180752541097668708');

    const heal = new ButtonBuilder()
          .setCustomId('heal')
          .setLabel('Give medicine (50 agnabucks)')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('1180752541097668708');
    row.addComponents(feed, play, heal);
    interaction.message.edit({ components: [row] })
  }

  

  const attachment = await petImage(await db.get(`${id}.pet`), id)
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
});

process.on('SIGINT', () => {
  shutdown().catch(err => {
    console.error('Error during shutdown:', err);
    process.exit(1);
  });});

process.on('SIGTERM', () => {
  shutdown().catch(err => {
    console.error('Error during shutdown:', err);
    process.exit(1);
  });});

async function shutdown() {
  console.log('Bot is shutting down...');
  process.exit(0);}

//agnab if you dont remember to switch this back i swear to god
//who tf wrote this did i write this???? was it pirate??? was it me???? -agnab
if (replit) {
client.login(token);
} else {
client.login(backupToken);
}

module.exports = {
  client,
  db,
};