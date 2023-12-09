const Discord = require('discord.js');
const { exec } = require('child_process');

async function pull(message, args) {
    const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** Pulling...')
    exec('git merge --strategy-option theirs', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return;
      }
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
      }
      console.log(stdout.trim())
      if (stdout.trim() === 'Already up to date.') {
        loadingMessage.delete()
        return message.channel.send('**<:AgnabotX:1153460434691698719> ||** already up to date (did you push correctly/use a.fetch?)')
      } 
    loadingMessage.delete()
    message.reply('`**<:AgnabotCheck:1153525610665214094> ||** pulled successfully (remember to use a.reload)')
    });
}

module.exports = pull