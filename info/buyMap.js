const buyArray = 
[
{ label: 'Cancel', description: 'deletes this menu', value: 'cancel', emoji: '1153460434691698719' }, 
{ label: 'HOTEL', description: '5,000 AGNABUCKS \n(buys a hotel, use a.hotel buy!)', value: 'hotel', emoji: '1180755217126543420' }, 
{ label: 'PET', description: '1,000 AGNABUCKS \n(buys a pet)', value: 'pet', emoji: '1180752541097668708' }, 
{ label: 'FISHING ROD', description: '5,000 AGNABUCKS (unlocks fishing)', value: 'fish', emoji: '1181067287889977425' },
{ label: 'AGNAB premium', description: '10,000 AGNABUCKS \n(access to secret chat + 25% boost to a.work)', value: 'premium', emoji: '1120846837436399718' }, 
{ label: 'Thermonuclear bomb', description: '1,000 AGNABUCKS \n(mention someone and they get muted for a minute)', value: 'bomb', emoji: '💣' }, 
{ label: 'Rigged slot machine', description: '5,000 AGNABUCKS \n(increases the chance of you winning in double or nothing to 60%)', value: 'rigged', emoji: '🎰' },
{ label: 'TTS pass', description: '100 AGNABUCKS \n(one time a.tts usage)', value: 'tts', emoji: '🎟️' }, 
{ label: 'Speechbubble', description: '200 AGNABUCKS \n(buys a random speechbubble from the speechbubble pool', value: 'speechbubble', emoji: '🗨️' }, 
{ label: 'Child labor', description: '[money] AGNABUCKS \n(one agnabuck every 5 minuto per level)', value: 'child', emoji: '🚸' }, 
{ label: 'Wedding ring', description: '10,000 AGNABUCKS \n(you can propose to someone Yipee)', value: 'ring', emoji: '💍' },
{ label: 'Avacado', description: '100,000 AGNABUCKS (literally just an avacado)', value: 'avacado', emoji: '1155948289305362542' },
{ label: 'Dungeon Key', description: '5,000 AGNABUCKS \n(allows one dungeon run)', value: 'dungeonkey', emoji: '1254915382129590362' }
]

const inventoryFormats = {
	rings: { emoji: "\💍", title: "Wedding rings" },
	ttspasses: { emoji: "\🎟", title: "TTS passes" },
	trash: { emoji: "\<:trash:1165126468649615391>", title: "Fishing trash" },
	common: { emoji: "\<:common:1165126466258862171>", title: "Common fish" },
	rare: { emoji: "\<:rare:1165126462622416937>", title: "Rare fish" },
	legendary: { emoji: "\<:legendary:1165126464782487632>", title: "Legendary fish" },
	artifacts: { emoji: "\<:legendary:1165126464782487632>", title: "Artifacts" },
	gold: { emoji: "\<:gold_treasure:1258133707043373076>", title: "Gold Treasure" },
	copper: { emoji: "\<:copper_treasure:1258133703742193756>", title: "Copper Treasure" },
	silver: { emoji: "\<:silver_treasure:1258133709517750354>", title: "Silver Treasure" },
	dungeonkeys: { emoji: "\<:dungeonkey:1254915382129590362>", title: "Dungeon Key" },
}

const itemWorth = {
	rings: 10000,
	ttspasses: 100,
	trash: 10,
	common: 500,
	rare: 2500,
	legendary: 5000,
	artifacts: 10000,
	gold: 2500,
	copper: 100,
	silver: 1000,
	dungeonkeys: 5000
}

module.exports = {
	buyArray, inventoryFormats, itemWorth
}