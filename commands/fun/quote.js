const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const Jimp = require('jimp')
const Canvas = require('@napi-rs/canvas');
const db = new QuickDB();
const { request } = require('undici');
const { promises } = require('fs');

async function quote(message, args, bot, client) {
try {

  if (!message.reference) {return message.reply('reply to a message NOW!!!!!!!!!!')}

  const repliedMessage = await message.channel.messages.fetch(message.reference.messageId)
  if (!repliedMessage.content) {return message.reply('**<:AgnabotX:1153460434691698719> ||** that message does NOT have text!')}

      const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** Loading...')

    const canvas = Canvas.createCanvas(500, 250);
    const context = canvas.getContext('2d');

  context.fillStyle = 'white';

  // Draw a rectangle with the dimensions of the entire canvas
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.strokeStyle = 'black';
  context.lineWidth = 5;

  // Draw a rectangle with the dimensions of the entire canvas
  context.strokeRect(50, 50, canvas.height - 100, canvas.height - 100);

  const { body } = await request(repliedMessage.author.displayAvatarURL({ extension: 'jpg' }));
  const avatar = await Canvas.loadImage(await body.arrayBuffer());
  context.drawImage(avatar, 50, 50, canvas.height - 100, canvas.height - 100);
  
  const gradient = await Canvas.loadImage('./images/gradient.png');
  context.drawImage(gradient, -200, 0, canvas.width + 200, canvas.height);

  context.font = '20px Segoe UI Emoji'

  const textArray = splitText(context, '"'+repliedMessage.content+'"')

  for (let i = 0; i < textArray.length; i++) {

  const textUh = textArray[i]

  context.strokeText(textUh, canvas.width / 2 - (context.measureText(textUh).width / 2) + 120, canvas.height / 2 + (25 * i) - 50);
  context.fillText(textUh, canvas.width / 2 - (context.measureText(textUh).width / 2) + 120, canvas.height / 2 + (25 * i) - 50)
}

  context.fillStyle = 'gray';

  context.fillRect(canvas.width / 2 + 100, canvas.height / 2 + (textArray.length * 25) - 50, 40, 5);
  context.font = '10px Segoe UI Emoji'
  context.fillText(`- ${repliedMessage.author.username}`, canvas.width / 2 - (context.measureText(`- ${repliedMessage.author.username}`).width / 2) + 120, canvas.height / 2 + (textArray.length * 25) - 25)

  context.strokeStyle = 'white'
  context.lineWidth = 5
  context.strokeRect(0, 0, canvas.width, canvas.height);

  const pngData = await canvas.encode('png')
  const image = await Jimp.read(pngData)
  await image.color([{apply:'greyscale', params: [10]}])
  .writeAsync('./images/quote.png');

  const attachment = new AttachmentBuilder('./images/quote.png', { name: 'quote.png' });
  loadingMessage.delete()
  message.reply({ files: [attachment] });
    } catch (err) {
      console.error('Error occurred:', err);
    }
}

const splitText = (canvas, text) => {
  const context = canvas.canvas.getContext('2d');

  const words = text.split('')
  let parsedText = []
  let splitText2 = ''
  words.forEach((word) => {
  if (word === ' ') {
  if (canvas.canvas.width / 2 - (context.measureText(splitText2).width / 2) + 140 + context.measureText(splitText2).width < canvas.canvas.width) {
  splitText2 = `${splitText2}${word}`
  } else {
  parsedText.push(splitText2)
  splitText2 = word
  }
  } else {
  if (canvas.canvas.width / 2 - (context.measureText(splitText2).width / 2) + 140 + context.measureText(splitText2).width < (canvas.canvas.width + 50)) {
  splitText2 = `${splitText2}${word}`
  } else {
  parsedText.push(splitText2)
  splitText2 = '-'+word
  }
  }

})
  parsedText.push(splitText2)
  return parsedText

};

module.exports = quote