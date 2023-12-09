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
const { readFile } = require('fs/promises');
const Canvas = require('@napi-rs/canvas');
const { Image } = require('@napi-rs/canvas');

async function furryspeechbubble(message, args, bot, client, drive) {

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
    const filePath = `./info/furryTemp/${randomFile.name}`;
    const dest = fs.createWriteStream(filePath);
    await drive.files.get(
      { fileId: randomFile.id, alt: 'media' },
      { responseType: 'stream' }
    ).then(res => {
      return new Promise((resolve, reject) => {
        res.data
          .on('end', () => {
            console.log(`downloaded ${randomFile.name} from Google Drive.`);
            resolve();
          })
          .on('error', err => {
            console.error(`error downloading file from Google Drive: ${err}`);
            reject(err);
          })
          .pipe(dest);
      });
    });

    waitMessage.delete()
    console.log(await readFile(filePath))

    const furryFile = await readFile(filePath);
    const furry = new Image();
    furry.src = furryFile

    console.log(furry.width, furry.height)
    const canvas = Canvas.createCanvas(furry.width, furry.height);
    const context = canvas.getContext('2d');

    context.drawImage(furry, 0, 0, canvas.width, canvas.height);
    const speechBubbleImage = await Canvas.loadImage('./images/speechbubble.png');
    context.drawImage(speechBubbleImage, 0, 0, canvas.width, canvas.height / 8);

    const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'speechbubble.png' });

  if (message.reference) {
    const repliedMessage = message.reference;
    const repliedMessageFull = await message.channel.messages.fetch(repliedMessage.messageId);
    if (repliedMessage) {
    await repliedMessageFull.reply({ files: [attachment] });
    } 
  } else {
    await message.channel.send({ files: [attachment] })
  }
    fs.unlinkSync(filePath);


}

module.exports = furryspeechbubble