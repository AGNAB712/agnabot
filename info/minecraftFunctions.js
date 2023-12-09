getTextUntilDelimiter = require('../index.js')
const mineflayer = require('mineflayer');
const deathEvent = require("mineflayer-death-event")
const mcs = require('node-mcstatus');

async function sendMinecraftChat(message, bot) {
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

async function createMinecraftBot(message) {
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

return bot

});

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
  await createMinecraftBot(bot)
  }
} else {
  console.log('isnt online')
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

module.exports = {
    sendMinecraftChat, createMinecraftBot, checkMinecraftServer, isMinecraftOnline
}