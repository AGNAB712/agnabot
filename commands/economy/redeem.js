const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const cooldowns2 = new Map()

async function redeem(message, args, bot, client) {

const playerID = message.author.id;

    if (cooldowns2.has(playerID)) {
      const expirationTime = cooldowns2.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      return message.reply(`**<:AgnabotX:1153460434691698719> COOLDOWN ||** ${remainingTime.toFixed(1)} seconds left`);
    }

    if (await hasArtifact(playerID, 'impenetrableshield')) {
      return message.reply(`**<:AgnabotX:1153460434691698719> ARTIFACT ||** impenetrable shield equipped`);
    }

    const member = message.member;

    let curbal = await db.get(playerID+'.a');

    let bonus = 0

    try {
    if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'LEVEL 50 - Agnabian Royalty').id)) {
    bonus = 100
    
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'LEVEL 40 - Master Agnabian').id)) {
    bonus = 75
    
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'LEVEL 30 - Loyal Agnabian').id)) {
    bonus = 50
    
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'LEVEL 20 - Agnab Enthusiast').id)) {
    bonus = 30
    
    } else if (member.roles.cache.has(message.guild.roles.cache.find(role => role.name === 'LEVEL 10 - Agnab Novice').id)) {
    bonus = 20
    
    } else {
      return message.channel.send('sorry youre not a high enough level to use this yet');
    }
  } catch (e) {
    return message.channel.send('sorry youre not a high enough level to use this yet');
  }

    await db.set(playerID+'.a', parseInt(curbal) + bonus);

    const embed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>---=**REDEEM**=---<')
      .setDescription(`
      **<:AgnabotCheck:1153525610665214094> +${bonus} ||** thanks for supporting the server :     )`)
      .setFooter({ text: `your money is now ${await db.get(playerID+'.a')}`})

      message.reply({ embeds: [embed] })

      const cooldownDuration = 300000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns2.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns2.delete(playerID);
      }, cooldownDuration);

}

module.exports = redeem