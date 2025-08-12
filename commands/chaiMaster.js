const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric } = require('../info/generalFunctions.js')
const { workArray } = require('../info/agnabot_work_texts.js')
const db = new QuickDB();
/*const CharacterAI = require("node_characterai");

const hotelChats = {
	'1158209246706532432': null
}

let chat;
let characterAI
async function createClient(hotelId) {
	characterAI = new CharacterAI();
	await characterAI.authenticateWithToken(process.env.CHAITOKEN);
	if (!hotelId) {
		chat = await characterAI.createOrContinueChat('Ak08oJrzr9zQy5901bKpVbeIv68HEEM5mj9uLMk9rCw');
		chat.saveAndStartNewChat()
	} else {
		const hotelIds = Object.keys(hotelChats)
		if (!hotelIds.includes(hotelId)) return
		hotelChats[hotelId] = await characterAI.createOrContinueChat('Ak08oJrzr9zQy5901bKpVbeIv68HEEM5mj9uLMk9rCw');
		hotelChats[hotelId].saveAndStartNewChat()
		console.log('i added', hotelId)
	}
	console.log(hotelChats)
}




createClient(false)*/


async function chai(message, args, bot, client) {
	message.reply('sorry, character AI updated their policies and now this doesnt work anymore. i might add a gpt thing here eventually')
	/*console.log('please help')
	message.channel.sendTyping()
	const chatToSend = hotelChats[`${message.channel.id}`] || chat
	console.log(chatToSend)
	const response = await chatToSend.sendAndAwaitResponse(args.join(), true);
	message.reply(response.text)*/
}

/*async function resetchai(message, args, bot, client) {
	if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return
	chat.saveAndStartNewChat()
	message.reply(`**<:AgnabotCheck:1153525610665214094> ||** reset chai`)
}

async function switchchai(message, args, bot, client) {
	if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return
	const select = new StringSelectMenuBuilder()
      .setCustomId('switchchai')
      .setPlaceholder('Choose a personality')

    const personalities = await db.get('chai')

    personalities.forEach((me, i) => {
        select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(me.name)
        .setValue(me.id)
    );
    })

    const row = new ActionRowBuilder()
      .addComponents(select);

    const response = await message.reply({
	  content: `choose a personality`,
	  components: [row],
	});

	const collectorFilter = i => i.user.id === message.author.id;

	const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
	if (confirmation.user.id !== message.author.id) {
		return message.channel.send(`${confirmation.user} no`)
	}
	response.delete()

	chat = await characterAI.createOrContinueChat(confirmation.values[0])
	message.reply(`**<:AgnabotCheck:1153525610665214094> ||** okey dokey i am now the thing you chose`)
}

async function addchai(message, args, bot, client) {
	if (!message.member.permissions.has(PermissionsBitField.Flags.Administrator)) return
	let toPush = {}
	const r1 = await userInput(message, 'name?')
	toPush.name = r1
	const r2 = await userInput(message, 'chai id? (the last part of the url)')
	toPush.id = r2
	await message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** ok i hope that was valid because i do not have a checker that checks for this`)
	await db.push('chai', toPush)
}

async function userInput(message, question) {
	const awaitMessage = await message.channel.send(`**<:AgnabotCheck:1153525610665214094> ||** ${question}`)
	const msg_filter = (m) => m.author.id === message.author.id;
	const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });
	return collected.first().content
}
*/
module.exports = { chai }