const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();
const fs = require('fs');

async function showcategories(message, args, bot, client) {
    const categoryNames = await db.get('category')
    const categoriesMessage = categoryNames.map((category, index) => `${index + 1}. ${category}`).join('\n');
    const filename = `${Date.now()}_text.txt`
    fs.writeFileSync(filename, categoriesMessage);
    await message.reply({ files: [filename] });
    fs.unlinkSync(filename);
  }

module.exports = showcategories