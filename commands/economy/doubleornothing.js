const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const cooldowns = new Map()

async function work(message, args, bot, client) {

if (cooldowns.has(message.author.id)) {
  const expirationTime = cooldowns.get(message.author.id);
  const remainingTime = (expirationTime - Date.now()) / 1000;
  return message.reply(`**<:AgnabotX:1153460434691698719> COOLDOWN ||** ${remainingTime.toFixed(1)} seconds left`);
}

const curbal = await db.get(message.author.id+'.a');
const chanceBought = await db.get(message.author.id+'.slotMachine');

let chance = 0.5;

if (chanceBought) {
  chance = 0.6;
}

if (isNumeric(args[0])) {

if (parseInt(args[0]) > 100) {
  return message.reply('canot gamble over 100');
}

const DONembed = new EmbedBuilder()
  .setColor('#235218')
  .setTitle('Double or Nothing');

if (parseInt(args[0]) < parseInt(curbal) && parseInt(args[0]) > 0) {

coinFlip = Math.random();

if (coinFlip < chance) {
  await db.set(message.author.id+'.a', parseInt(curbal) + parseInt(args[0]));
  const newBal = parseInt(curbal) + parseInt(args[0])

  DONembed
  .setDescription('You flipped a coin, and you got heads!')
  .setFooter({ text: `Your new balance is ${newBal}`});
  message.reply({ embeds: [DONembed] })

} else if (coinFlip > chance) {
  await db.set(message.author.id+'.a', curbal - args[0]);
  const newBal = parseInt(curbal) - parseInt(args[0])

  DONembed
  .setColor('Red')
  .setDescription('You flipped a coin, and you got tails')
  .setFooter({ text: `Your new balance is ${newBal}`});

  message.reply({ embeds: [DONembed] })
}

const cooldownDuration = 5000;
const expirationTime = Date.now() + cooldownDuration;
cooldowns.set(message.author.id, expirationTime);

setTimeout(() => {
  cooldowns.delete(message.author.id);
}, cooldownDuration);

} else {
message.reply('**<:AgnabotX:1153460434691698719> ||** STOP BEING POOR you donot have aneough money');
}

} else {
message.reply('**<:AgnabotX:1153460434691698719> ||** cant gamble nothing bro')
}
}

module.exports = work
