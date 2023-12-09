const Discord = require('discord.js');
const { EmbedBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const db = new QuickDB();

async function verify(message, args, bot) {
  try {

    const playersOnline = Object.keys(bot.players)


    let select = new StringSelectMenuBuilder()
      .setCustomId('verify')
      .setPlaceholder('Choose your username')
      .addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`Cancel`)
      .setValue(`cancel`)
    )

    playersOnline.forEach((name, i) => {
    select.addOptions(    
      new StringSelectMenuOptionBuilder()
      .setLabel(`${name}`)
      .setValue(`${name}`)
    )
    })

    const row = new ActionRowBuilder()
      .addComponents(select);

    const myMessage = await message.reply({
      content: 'a reminder, you have to be on the server to use this command',
      components: [row],
    });

    const collectorFilter = i => i.user.id === message.author.id;

  const confirmation = await myMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  console.log(confirmation.values[0])
  if (confirmation.values[0] === 'cancel') {return await confirmation.update({ content: '**<:AgnabotX:1153460434691698719> ||** oook bai :3', components: [] })}
  await confirmation.update({ content: `**<:AgnabotCheck:1153525610665214094> ||** chose username: ${confirmation.values[0]}
  a message will now be whispered to your player in game, please send the code given in chat
  if this was a mistake, just send "cancel"`, components: [] });
  
  const code = Math.floor(Math.random() * (999999 - 100000 + 1) + 100000)
  console.log(code)

  bot.chat(`/w ${confirmation.values[0]} your code is: ${code}`)

  const msg_filter = (m) => m.author.id === message.author.id;
  const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });
  
  if (collected.first().content == code) {
  myMessage.edit('`**<:AgnabotCheck:1153525610665214094> ||** congrats your minecraft account is now linked')
  await db.set(message.author.id+'.mc', confirmation.values[0])
  saveSqlite();
  } else {
  return myMessage.edit('**<:AgnabotX:1153460434691698719> ||** wrong code')
  }

  } catch (e) {
    console.error(e)
    message.reply('**<:AgnabotX:1153460434691698719> ||** bot not on server')
  }
}

module.exports = verify
