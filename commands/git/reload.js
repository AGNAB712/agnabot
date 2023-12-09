const Discord = require('discord.js');
const { exec } = require('child_process');

async function reload(message, args) {
    exec('pm2 reload all', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
    });
    message.reply('`**<:AgnabotCheck:1153525610665214094> ||** reloaded successfully')
}

module.exports = reload
