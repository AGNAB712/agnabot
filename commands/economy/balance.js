const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, commas } = require('../../info/generalFunctions.js')
const { balanceImage } = require('../../info/canvasFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const cooldowns = new Map()

let balEmbed = new EmbedBuilder()
.setImage('attachment://balance.png')
.setColor('#235218')
.setTitle('Your balance')

async function balance(message, args, bot, client) {
  
    let targetUser = message.mentions.users.first();

    if (targetUser) {
    const userId = targetUser.id;
    const variableValue = await db.get(userId+'.a');
    console.log(await db.get(userId))
    console.log(await db.get('pet_'+userId))

    if (!variableValue) {
  const userId = targetUser.id;
  await db.set(userId+'.a', 100);
  
  const variableValue = await db.get(userId+'.a');
  //message.reply(`their money is ${variableValue} agnabucks`);

  } else { 
    const attachment = await balanceImage(targetUser) 
    const curbal = await db.get(targetUser.id+'.a')
    balEmbed.setFooter({ text: `${curbal}` })
    balEmbed.setTitle(`>---=${targetUser.username}'s balance=---<`)
    message.reply({ embeds: [balEmbed], files: [attachment] })
  }

  } else {

    let targetUser = message.author;

    if (targetUser) {
    const userId = targetUser.id;
    const variableValue = await db.get(userId+'.a');
    console.log(await db.get(userId))
    console.log(await db.get('pet_'+userId))

    if (!variableValue) {
  const userId = targetUser.id;
  await db.set(userId+'.a', 100);
  
  const variableValue = await db.get(userId+'.a');
  //message.reply(`your money is ${variableValue} agnabucks`);

    } else { 
  const attachment = await balanceImage(targetUser) 
  const curbal = await db.get(targetUser.id+'.a')
  balEmbed.setFooter({ text: `${commas(curbal)}` })
  balEmbed.setTitle(`>---=<  ${targetUser.username}'s balance  >=---<`)
  message.reply({ embeds: [balEmbed], files: [attachment] })
  }


  }

}
}

module.exports = balance
