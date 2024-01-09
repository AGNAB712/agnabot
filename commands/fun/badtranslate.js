const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();
const { translate } = require('@vitalets/google-translate-api');
const translate2 = require('translate-google');
const languages = ['af', 'sq', 'am', 'ar', 'hy', 'az', 'eu', 'be', 'bn', 'bs', 'bg', 'ca', 'ceb', 'ny', 'zh-CN', 'co', 'hr', 'cs', 'da', 'nl', 'en', 'eo', 'et', 'tl', 'fi', 'fr', 'fy', 'gl', 'ka', 'de', 'el', 'gu', 'ht', 'ha', 'haw', 'iw', 'hi', 'hmn', 'hu', 'is', 'ig', 'id', 'ga', 'it', 'ja', 'jw', 'kn', 'kk', 'km', 'rw', 'ko', 'ku', 'ky', 'lo', 'la', 'lv', 'lt', 'lb', 'mk', 'mg', 'ms', 'ml', 'mt', 'mi', 'mr', 'mn', 'my', 'ne', 'no', 'or', 'ps', 'fa', 'pl', 'pt', 'pa', 'ro', 'ru', 'sm', 'gd', 'sr', 'st', 'sn', 'sd', 'si', 'sk', 'sl', 'so', 'es', 'su', 'sw', 'sv', 'tg', 'ta', 'te', 'th', 'tr', 'uk', 'ur', 'ug', 'uz', 'vi', 'cy', 'xh', 'yi', 'yo', 'zu'];

async function badtranslate(message, args, bot, client) {
  let translatedText = args.join(' ');

  const repliedMessage = await message.channel.messages.fetch(message.reference.messageId)
  if (repliedMessage.content) {translatedText = repliedMessage.content}
  if (!translatedText) {return message.reply('**<:AgnabotX:1153460434691698719> ||** that message does NOT have text!')}

  message.channel.sendTyping()
  try {
    for (let i = 0; i < 2; i++) {
      translatedText = await translate2(translatedText, { to: languages[getRandomInt(languages.length)] });
    }

    const finalTranslation = await translate2(translatedText, { from: 'auto', to: 'en' });
    message.reply(`**<:AgnabotCheck:1153525610665214094> ||** ${finalTranslation}`);
  } catch (e) {
    console.log(e)
    const finalTranslation = await translate2(args.join(' '), { to: 'en' });
    message.reply(`**<:AgnabotCheck:1153525610665214094> ||** ${finalTranslation}`);
  }

}

module.exports = badtranslate