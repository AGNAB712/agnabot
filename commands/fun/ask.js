const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();
const cleverbot = require('cleverbot-free');

let conversation = [];

setGlobalVar("conversation", conversation)

async function ask(message, args, bot, client) {

message.channel.sendTyping()
    cleverbot(args.join(' '), conversation)
    .then(res=>{
      conversation.push(args.join(' '))
      conversation.push(res);
      message.reply(res.toLowerCase().replace(/\./g, ''));
      if (conversation.length > 10) {conversation = []}
    })
    .catch(error => console.error(`error with ai: ${error}`))

}

module.exports = ask