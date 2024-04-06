const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const cooldowns3 = new Map()

async function loot(message, args, bot, client) {

    const playerID = message.author.id;

    if (cooldowns3.has(playerID)) {
      const expirationTime = cooldowns3.get(playerID);
      const remainingTime = (expirationTime - Date.now()) / 1000;
      return message.reply(`**<:AgnabotX:1153460434691698719> COOLDOWN ||** ${remainingTime.toFixed(1)} seconds left`);
    }

    await db.add(playerID+'.a', helmet[1]);

    const embed = new EmbedBuilder()
      .setColor('#235218')
      .setTitle('>---=**LOOT**=---<')
      .setDescription(`
      **<:AgnabotCheck:1153525610665214094> +${helmet[1]} ||**  Lootylicious`)
      .setFooter({ text: `your money is now ${await db.get(playerID+'.a')}`})

      message.reply({ embeds: [embed] })

      const cooldownDuration = 300000;
      const expirationTime = Date.now() + cooldownDuration;
      cooldowns3.set(playerID, expirationTime);

      setTimeout(() => {
        cooldowns3.delete(playerID);
      }, cooldownDuration);

}

module.exports = loot