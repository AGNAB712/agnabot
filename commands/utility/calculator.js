const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const { evaluate } = require('mathjs')
const db = new QuickDB();

async function calculator(message, args, bot, client) {
    if (args.length < 1) {
      return message.reply('gimme an expression');
    }

    const expression = args.join(' ');
    let result = '';

    try {
      result = evaluate(expression);
      if (expression === '9 + 10' || expression === '9+10') {
        result = 21
      }
    } catch (error) {
      return message.reply('i cant eval that');
    }

    const embed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('Calculator')
      .addFields(
      { name: 'Expression', value: `${expression}` }, 
      { name: 'Result', value: `${result}` }
      );

    message.reply({ embeds: [embed] });
}

module.exports = calculator

//wow this is small