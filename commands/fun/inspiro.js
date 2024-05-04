const Discord = require('discord.js');
const { EmbedBuilder, ButtonStyle, ActionRowBuilder, ButtonBuilder } = require('discord.js')
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const fetch = require('node-fetch')

const inspiroEmbed = new EmbedBuilder()
.setColor('#235218')
.setTitle('~=< INSPIROBOT >=~')

async function inspiro(message, args, bot, client) {

const inspiroResponse = await fetch("http://inspirobot.me/api?generate=true")
const url = await inspiroResponse.text();

inspiroEmbed.setImage(url)

message.reply({ embeds: [inspiroEmbed] })


}

module.exports = inspiro