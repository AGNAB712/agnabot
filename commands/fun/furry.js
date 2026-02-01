const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId, readJSONFile } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const fs = require('fs');
const db = new QuickDB();
const folderId = '1uhXVBbhrcLaUpYB6MuGDYJd7dSn5R0G8'

async function furry(message, args, bot, client, drive) {

    const files = await drive.files.list({
      q: `'${folderId}' in parents and mimeType contains 'image/'`,
      fields: 'files(id, name)',
      orderBy: 'createdTime desc'
    });

    let currentIndex = await db.get('furryIndex')
    if (currentIndex > files.data.files.length || !currentIndex) {
      await db.set('furryIndex', 1)
      currentIndex = 1
    } else {
      await db.add('furryIndex', 1)
    }
    const randomFile = files.data.files[currentIndex];

    const waitMessage = await message.channel.send('**<a:AgnabotLoading:1155973084868784179> ||** Downloading...')
    const response = await drive.files.get({ fileId: randomFile.id, alt: "media" }, { responseType: "stream" });
    const buffers = [];
    response.data.on("data", chunk => buffers.push(chunk));
    response.data.on("end", async () => {
      waitMessage.delete();
      const furryBuffer = Buffer.concat(buffers);

      const attachment = new AttachmentBuilder(furryBuffer, { name: 'furry.png' })

      const embed = new EmbedBuilder()
        .setURL(`https://drive.google.com/file/d/${randomFile.id}/view`)
        .setTitle(`-= FURRY =-`)
        .setImage(`attachment://furry.png`)
        .setColor('#235218')
        .setFooter({ text: `index: ${currentIndex}` });

      await message.channel.send({ files: [attachment], embeds: [embed] });
    });


}

module.exports = furry