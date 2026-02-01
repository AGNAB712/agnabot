const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const db = new QuickDB();

async function lb(message, args, bot, client) {
  const allUserData = await db.all()

  const filtertop = allUserData
  await filtertop.sort((a, b) => b.value.a - a.value.a);

  const topUsers = filtertop.slice(0, 10);

  let descText = ''
  console.log(filtertop)

  for (let i = 0; i !== 10; i++) {
    const user = await client.users.fetch(topUsers[i].id)
    descText = descText + `${i + 1}. ${user.username} - ${topUsers[i].value.a} agnabucks\n`
  }

  const leaderboadEmbed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('Leaderboard')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .setDescription(descText)

  message.reply({ embeds: [leaderboadEmbed] })
}

module.exports = lb
