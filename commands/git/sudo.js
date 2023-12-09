const Discord = require('discord.js');
const { exec } = require('child_process');

async function sudo(message, args) {
const loadingMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** executing...')
const toExecute = args.join(' ') 
if (!toExecute) {
  loadingMessage.delete()
  return message.reply('**<:AgnabotX:1153460434691698719> ||** no args')
} 
exec(toExecute, (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    loadingMessage.delete()
    message.reply('**<<:AgnabotX:1153460434691698719> ||** error')
    message.channel.send(error.message)
    return;
    }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    loadingMessage.delete()
    message.reply('**<<:AgnabotX:1153460434691698719> ||** stderror')
    message.channel.send(stderr.message)
    return;
    }

    loadingMessage.delete()
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** executed successfully')

    }); 
}

module.exports = sudo
