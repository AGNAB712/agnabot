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
	legendary: `\<:legendary:1165126464782487632> \`Legendary fish:     [count]\` \n`,
	factorygloves: '<:factorygloves:1171510979700465716> \`Factory gloves:     [count]\` \n',
	basementenlarger: '<:basementenlarger:1171510886104571964> \`Basement enlarger:     [count]\` \n',
	smogshard: '<:smokeshard:1171510993055129661> \`Smogshard:     [count]\` \n',
	elixiroftears: `<:elixeroftears:1171510888965087232> \`Elixir of tears:     [count]\` \n`,
	amuletoflaziness: '<:amuletoflaziness:1171510874163384452> \`Amulet of laziness:     [count]\` \n',
	impenetrableshield: `<:impenetrableshield:1171510897399844874> \`Impenetrable shield:     [count]\` \n`,
	moneylaundrymachine: `<:moneylaundrymachine:1171510988839858237> \`Money laundry machine:     [count]\` \n`,
	fourleafclover: `<:fourleafclover:1171510980849709136> \`4 leaf clover:     [count]\` \n`,
	emeraldhelmet: `<:emeraldhelmet:1171510890407923802> \`Emerald helmet:     [count]\` \n`,
	amuletofdedication: `<:amuletofdedication:1171510872246603847> \`Amulet of dedication:     [count]\` \n`,
	workmanscharm: `<:workmanscharm:1171510903691292794> \`Workman's charm:     [count]\` \n`,
	cryoheart: `<:cryoheart:1171510887459336332> \`Cryoheart:     [count]\` \n`,
	laboriouslure: `<:laboriouslure:1171510987489284158> \`Laborious lure:     [count]\` \n`,
	mosseater: `<:mosseater:1171510900704944249> \`Moss eater:     [count]\` \n`,
	gemofgreatness: `<:gemofgreatness:1171510895462068295> \`Gem of greatness:     [count]\` \n`,
	sharktoothnecklace: `<:sharktoothnecklace:1171510991784263791> \`Shark tooth necklace:     [count]\` \n`,
	amuletofaquaboon: `<:amuletofaquaboon:1171510868798885929> \`Amulet of aquaboon:     [count]\` \n`,
	auraofdeflection: `<:auraofdeflection:1171510878772924436> \`Aura of deflection:     [count]\` \n`,
	auraofdevotion: `<:auraofdevotion:1171510881285328906> \`Aura of deflection:     [count]\` \n`,
	auraofthecraft: `<:auraofthecraft:1171510884934361198> \`Aura of the craft:     [count]\` \n`,
	auraofthecaretaker: '<:auraofthecaretaker:1171510882749141073> \`Aura of the caretaker:     [count]\` \n',
	auraoffemboy: '<:auraoffemboy:1171512600903819324> \`Aura of femboy:     [count]\` \n'
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