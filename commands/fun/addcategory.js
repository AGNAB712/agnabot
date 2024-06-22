const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

async function addcategory(message, args, bot, client) {



    message.delete();

    const repliedMessage = await message.channel.messages.fetch(message.reference?.messageId)
    let categoryName = args.join(' ');
    if (repliedMessage.content) {categoryName = repliedMessage.content}
    if (!categoryName) {
      message.channel.send('**<:AgnabotX:1153460434691698719> ||** gimme a category name.');
      return;
    }

    if (categoryName.length > 100) {
      message.reply('**<:AgnabotX:1153460434691698719> ||** category too long');
      return;
    }

    const categoryEmbed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle(`=-~ CATEGORY SUGGESTION ~-=`)
      .setDescription(`${categoryName}`)
      .setFooter({ text: `requested by ${message.author.username}` })

    const sentMessage = await message.channel.send({ embeds: [categoryEmbed] });
    await sentMessage.react('1153525610665214094');
    await sentMessage.react('1153460434691698719');

    const filter = (reaction, user) => !user.bot;
    const collector = sentMessage.createReactionCollector(filter, { time: 60000 });

    collector.on('collect', async (reaction) => {
      if (reaction.count === 5 && reaction.id === '1153525610665214094') {
        await db.push('category', categoryName);
        const categories = await db.get('category')
        message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** category "${categoryName}" has been added. (category number **${categories.length+1}**)`);
        collector.stop();
        sentMessage.delete();
      }
      if (reaction.count === 5 && reaction.id === '1153460434691698719') {
        await db.push('category', categoryName);
        message.channel.send(`**<:AgnabotCheck:1153460434691698719> ||** category "${categoryName}" has NOT. been added.`);
        collector.stop();
        sentMessage.delete()
      }
    });
}

module.exports = addcategory