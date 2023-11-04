const buyArray = 
[
{ label: 'Cancel', description: 'deletes this menu', value: 'cancel', emoji: '1153460434691698719' }, 
{ label: 'HOTEL', description: '5,000 AGNABUCKS \n(buys a hotel, use a.hotel buy!)', value: 'hotel', emoji: '🏨' }, 
{ label: 'Cocaina', description: '10,000 AGNABUCKS \n(high for one day)', value: 'cocaine', emoji: '1154570594797486100' }, 
{ label: 'Methamphetamin', description: '1,000 AGNABUCKS \n(high for one hour)', value: 'meth', emoji: '🍃' },
{ label: 'Alcohol', description: '100 AGNABUCKS \n(high for one minute)', value: 'alcohol', emoji: '🍺' }, 
{ label: 'AGNAB premium', description: '10,000 AGNABUCKS \n(access to secret chat + 25% boost to a.work)', value: 'premium', emoji: '1120846837436399718' }, 
{ label: 'Thermonuclear bomb', description: '1,000 AGNABUCKS \n(mention someone and they get muted for a minute)', value: 'bomb', emoji: '💣' }, 
{ label: 'Rigged slot machine', description: '5,000 AGNABUCKS \n(increases the chance of you winning in double or nothing to 60%)', value: 'rigged', emoji: '🎰' },
{ label: 'TTS pass', description: '100 AGNABUCKS \n(one time a.tts usage)', value: 'tts', emoji: '🎟️' }, 
{ label: 'Speechbubble', description: '200 AGNABUCKS \n(buys a random speechbubble from the speechbubble pool', value: 'speechbubble', emoji: '🗨️' }, 
{ label: 'Child labor', description: '[money] AGNABUCKS \n(one agnabuck every 5 minuto per level)', value: 'child', emoji: '🚸' }, 
{ label: 'Wedding ring', description: '10,000 AGNABUCKS \n(you can propose to someone Yipee)', value: 'ring', emoji: '💍' },
{ label: 'Fishing Rod', description: '5,000 AGNABUCKS (unlocks fishing)', value: 'fish', emoji: '🎣' },
{ label: 'Avacado', description: '100,000 AGNABUCKS (literally just an avacado)', value: 'avacado', emoji: '1155948289305362542' },
{ label: 'Name color', description: '50,000 AGNABUCKS (colors your name in minecraft)', value: 'name', emoji: '🟥' },
{ label: 'Player head', description: '25,000 AGNABUCKS (gives you your player head in minecraft)', value: 'head', emoji: '1169665834315161741' },
]

const inventoryFormats = {
	rings: `\💍 \`Wedding rings:     [count]\` \n`,
	ttspasses: `\🎟 \`TTS passes:     [count]\` \n`,
	trash: `\<:trash:1165126468649615391> \`Fishing trash:     [count]\` \n`,
	common: `\<:common:1165126466258862171> \`Common fish:     [count]\` \n`,
	rare: `\<:rare:1165126462622416937> \`Rare fish:     [count]\` \n`,
	legendary: `\<:legendary:1165126464782487632> \`Legendary fish:     [count]\` \n`
}

const itemWorth = {
	rings: 10000,
	ttspasses: 100,
	trash: 10,
	common: 500,
	rare: 2500,
	legendary: 5000
}

module.exports ={
	buyArray, inventoryFormats, itemWorth
}