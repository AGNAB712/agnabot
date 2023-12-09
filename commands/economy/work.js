const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const cooldowns = new Map()

async function work(message, args, bot, client) {
    const playerID = message.author.id;
    const me = await db.get(message.author.id)

    if (cooldowns.has(playerID)) {
      const expirationTime = cooldowns.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      return message.reply(`**<:AgnabotX:1153460434691698719> COOLDOWN ||** ${remainingTime.toFixed(1)} seconds left`);
    }

    let curbal = me.a;

    let moneyEarned = getRandomInt(50) + 50

    if (message.member.roles.cache.some(role => role.name === 'high as shit brah')) {
      moneyEarned += 100
    }

    if (message.member.roles.cache.some(role => role.name === 'AGNAB premium')) {
      moneyEarned = math.floor(moneyEarned * 1.25)
    }

    curbal = await db.get(playerID+'.a');
    const workArrayIndex = getRandomInt(workArray.length)
    const coolAssDescription = workArray[workArrayIndex].replace(/\[money\]/g, `**${moneyEarned}**`)

      let embed = new EmbedBuilder()
        .setColor('#235218')
        .setTitle('>---=**WORK**=---<')
        .setDescription(`
        **<:AgnabotCheck:1153525610665214094> + ${moneyEarned} ||** ${coolAssDescription}`)
        .setFooter({ text: `your money is now ${curbal} || work text ${workArrayIndex}` })

      let file
      if (workArrayIndex !== 38) {
        file = new AttachmentBuilder(`./images/work/${workArrayIndex + 1}.png`, { name: 'workimage.png' })
      } else {
        if (moneyEarned !== 65) {
        file = new AttachmentBuilder(`./images/work/38.2.png`, { name: 'workimage.png' })
      } else {
        file = new AttachmentBuilder(`./images/work/38.1.png`, { name: 'workimage.png' })
      }
      }

      embed.setImage(`attachment://workimage.png`)
      
      message.reply({ embeds: [embed], files: [file] });
      const cooldownDuration = 60000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns.delete(playerID);
      }, cooldownDuration);

    await db.add(playerID+'.a', moneyEarned);
    if (me.married) {
      const auraOfDevotion = await hasArtifact(message.author.id, 'auraofdevotion')
      if (!auraOfDevotion) return;
      const percentage = (auraOfDevotion[1] / 100)
      const marriedUserId = me.married
      console.log(percentage, moneyEarned * percentage)
      await db.add(marriedUserId+'.a', Math.round(moneyEarned * percentage))
    }
}

module.exports = work
