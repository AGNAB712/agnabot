const cuss = ['FUCK','SHIT','BITCH']


function autoReact(message) {

	if (message.author.bot) {}

	if(message.content.includes('<@907055124503994398>','<@!907055124503994398>')) {
    	message.reply('explode')
    }

    if (message.content.toLowerCase().includes('ohio')) {
        message.channel.send('OHIO KILLED MY GRANDMA............');
    }
    
    if (message.content.toLowerCase().includes('theophobia')) {
        message.delete();
    }

    if (message.content.includes('Wild')) {
        message.reply('Wild');
    }

    if (message.content.includes('<@1107764918293372989>') && cuss.some(word => message.content.includes(word))) { 
      message.reply(cuss[getRandomInt(cuss.length)])
   }
    
    if (message.content.toLowerCase().includes('ayo') || message.content.toLowerCase().includes('🤨') || message.content.toLowerCase().includes('ayo?')) {
        message.channel.send('you are 9 years old');
    }
        
    if (message.content.toLowerCase().includes('cybergrind')) {
        message.channel.send('https://media.discordapp.net/attachments/1100521311534592041/1107968544492224532/image.png?width=197&height=585');
    }

    if (message.content.toLowerCase().trim() === 'a.rob') {message.reply('i just set your balance to 0 you fucking filthy criminal')}
    if (message.content.toLowerCase().trim() === 'a.bak') {message.reply('lol')}
    if (message.content.toLowerCase().trim() === 'a.lockstatus') {message.reply('**<:AgnabotCheck:1153525610665214094> ||** open')}

    if (message.content.toLowerCase() === 'would' || message.content.toLowerCase() === 'smash') {message.author.send(`you are a degenerate`).catch(error => console.log('cant send messages to that user'));}
	if (message.content.toLowerCase() === 'a.ping') {
		const pingMessage = `API Latency: ${client.ws.ping}ms\nClient Latency: ${Date.now() - message.createdTimestamp}ms`
  		message.reply(`${pingMessage}`)
	}
    if (message.content.toLowerCase() === 'a.vbucks') {
        message.reply(`https://media.discordapp.net/attachments/1092555277049528400/1183130044202225665/latest.png?ex=658736b8&is=6574c1b8&hm=67e834df2f164cd6f94990895f712a5b1f77877928f1068e36916ca2f27a3288&=&format=webp&quality=lossless&width=269&height=269`)
    }

}

module.exports = {
	autoReact
}