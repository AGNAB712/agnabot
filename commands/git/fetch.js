const Discord = require('discord.js');
const { exec } = require('child_process');

async function fetch(message, args) {
  const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** Fetching...')
  exec('git fetch', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    loadingMessage.delete()
    message.reply('`**<:AgnabotCheck:1153525610665214094> ||** fetched successfully')
    });
}

module.exports = fetch