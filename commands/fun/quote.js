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
  const repliedRepliedMessage = await message.channel.messages.fetch(repliedMessage.reference?.messageId)

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

  let mainTextOffset = 0;
  if (repliedRepliedMessage.content) {

    context.font = '10px Segoe UI Emoji'
    const textArrayReplied = splitText(context, `${repliedRepliedMessage.author.username} - "${repliedRepliedMessage.content}"`)
    context.fillStyle = 'gray'

    for (let i = 0; i < textArrayReplied.length; i++) {

      const textUhReplied = textArrayReplied[i]
      let widthOffset = 0;
      if (i == 0) { widthOffset = 15 }

      context.strokeText(textUhReplied, canvas.width / 2 - (context.measureText(textUhReplied).width / 2) + 120 + widthOffset, canvas.height / 2 + (10 * i) - 65);
      context.fillText(textUhReplied, canvas.width / 2 - (context.measureText(textUhReplied).width / 2) + 120 + widthOffset, canvas.height / 2 + (10 * i) - 65)
    }
    mainTextOffset = textArrayReplied.length*10 + 10

    const repliedRepliedX = canvas.width / 2 - (context.measureText(textArrayReplied[0]).width / 2) + 120
    const repliedRepliedY = canvas.height / 2 - 65 - 2.5

    const avatar2 = await Canvas.loadImage(repliedRepliedMessage.author.displayAvatarURL({ extension: 'jpg' }));
    context.save();
    context.beginPath();
    context.arc(repliedRepliedX, repliedRepliedY, 10, 0, Math.PI * 2, true);
    context.closePath();
    context.strokeStyle = 'white'
    context.lineWidth = 3;
    context.stroke();
    context.clip();
    context.drawImage(avatar2, repliedRepliedX-10, repliedRepliedY-10, 20, 20);
    context.restore();

  }

  context.font = '20px Segoe UI Emoji'
  const textArray = splitText(context, '"'+repliedMessage.content+'"')
  context.fillStyle = 'white'

  for (let i = 0; i < textArray.length; i++) {

    const textUh = textArray[i]

    context.strokeText(textUh, canvas.width / 2 - (context.measureText(textUh).width / 2) + 120, canvas.height / 2 + (25 * i) - 50 + mainTextOffset);
    context.fillText(textUh, canvas.width / 2 - (context.measureText(textUh).width / 2) + 120, canvas.height / 2 + (25 * i) - 50 + mainTextOffset)
  }


  context.fillStyle = 'gray';

  context.fillRect(canvas.width / 2 + 100, canvas.height / 2 + (textArray.length * 25) - 50 + mainTextOffset, 40, 5);
  context.font = '10px Segoe UI Emoji'
  context.fillText(`- ${repliedMessage.author.username}`, canvas.width / 2 - (context.measureText(`- ${repliedMessage.author.username}`).width / 2) + 120, canvas.height / 2 + (textArray.length * 25) - 25 + mainTextOffset)

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
  if (canvas.canvas.width / 2 - (context.measureText(splitText2).width / 2) + 140 + context.measureText(splitText2).width < (canvas.canvas.width - 50)) {
  splitText2 = `${splitText2}${word}`
  } else {
  parsedText.push(splitText2)
  splitText2 = word
  }
  } else {
  if (canvas.canvas.width / 2 - (context.measureText(splitText2).width / 2) + 140 + context.measureText(splitText2).width < (canvas.canvas.width)) {
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