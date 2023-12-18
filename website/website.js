const express = require('express');
require('dotenv').config();
const app = express();
const port = 3000;
const { QuickDB } = require("quick.db");
const sizeOf = require('image-size')
const url = require('url')
const http = require('http')
const Discord = require('discord.js');
const fs = require('fs')
const favicon = require('serve-favicon');
const path = require('path')

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

const token = process.env.WEBSITETOKEN;

const defaultRead = {
  username: '(404)',
  avatar: '/agnabot.png',
  bg: '/background.png',
  agnabuckAmount: '(not found)',
  myPlace: '(404)'
}

async function main() {
const db = new QuickDB({ filePath: "./website/json.sqlite" });
const all = await db.all()
const filtertop = all.filter(data => !isNaN(data.id))
await filtertop.sort((a, b) => b.value.a - a.value.a);

// set up the view engine
app.set('view engine', 'ejs');
app.set('views', './website/views');
app.use(favicon(path.join(__dirname, 'public', 'logo.ico')));
app.use(express.static('./website/public'));

app.get('/agnabot/:userId', async (req, res) => {
  const userId = req.params.userId;

  if (await db.has(userId)) {

    const me = await db.get(userId);
    let toRead = {
      username: me?.websiteData?.username,
      avatar: me?.websiteData?.avatar,
      bg: me?.websiteData?.image,
      agnabuckAmount: me?.a,
      myPlace: filtertop.findIndex(obj => obj.id === userId) + 1
    }
    const toReadKeys = Object.keys(toRead)
    toReadKeys.forEach((key) => {
      if (!toRead[key]) {
        toRead[key] = defaultRead[key]
      }
    })
    let inventoryArray
    if (me.inv) {
      inventoryArray = Object.keys(me?.inv)
    } else {
      inventoryArray = []
    }

    console.log(me.websiteData)
    res.render('inventory', toRead);
  } else {
    res.render('notfound', { userId });
  }
});

// define a route to handle the search
app.get('/', async (req, res) => {
  res.render('home');
});

// start the server
app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
}

client.on('ready', async () => {

  await loadSqlite()
  setInterval(loadSqlite, 60000)
  main()

})

async function loadSqlite() {
  await client.channels.cache.get('1156302752218091530').messages.fetch('1156302916873900032').then(async (lastMessage) => {
    if (lastMessage.attachments.size > 0) {
      const attachment = lastMessage.attachments.first();
      const fileName = attachment.name;
      if (fileName.endsWith('.sqlite')) {
        const file = await fetchAttachment(attachment.url);
        fs.writeFileSync(`./website/json.sqlite`, file);
        console.log(`sqlite loaded`);
      }
    }
}
  )
}

async function fetchAttachment(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

client.login(token)

module.exports = main