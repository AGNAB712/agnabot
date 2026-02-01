const Canvas = require('@napi-rs/canvas');
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { AttachmentBuilder } = require('discord.js')
const { request } = require('undici');
const fishingJs = require('./fishing.js')

Canvas.GlobalFonts.registerFromPath('./fonts/FiraSansCondensed-Bold.ttf', 'fira')
Canvas.GlobalFonts.registerFromPath('./fonts/segoe-ui-emoji.ttf', 'Segoe UI Emoji')

//canvasfunctions wouldn't recognize these two functions in general functions for some reason????? thanks node js
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

async function hasArtifact(id, artifactName) {

  let outfitArray
  let output = false;
  if (typeof id === 'object') {
    outfitArray = Object.values(id)
  } else {
    if (!id) {return false}
    const me = await db.get(id.toString())
    if (!me?.outfit) {return false}
    outfitArray = Object.values(me.outfit)
  }

  outfitArray.forEach((key, i) => { 
    if (outfitArray[i][0] === artifactName) {
      const myArtifact = fishingJs.artifacts[artifactName]
      output = [outfitArray[i][1], myArtifact.values[parseInt(outfitArray[i][1]) - 1]];
      return;
    }
  })
  return output
}

async function marriageImage(guy1, guy2, type) {

  try {
    const canvas = Canvas.createCanvas(2000, 1000);
    const context = canvas.getContext('2d');

  const avatar1pos = [500, 500, 700]

  let avatar = await Canvas.loadImage(guy1.displayAvatarURL({ extension: 'jpg' }));
  context.save();
  context.beginPath();
  context.arc(avatar1pos[2]/2+(avatar1pos[0]-(avatar1pos[2]/2)), avatar1pos[2]/2+(avatar1pos[1]-(avatar1pos[2]/2)), avatar1pos[2]/2, 0, Math.PI * 2, true);
  context.closePath();
  context.strokeStyle = 'white'
  context.lineWidth = 30;
  context.stroke();
  context.strokeStyle = 'black'
  context.lineWidth = 10;
  context.stroke();
  context.clip();
  context.drawImage(avatar, avatar1pos[0]-(avatar1pos[2]/2), avatar1pos[1]-(avatar1pos[2]/2), avatar1pos[2], avatar1pos[2]);
  context.restore();

  const avatar2pos = [1500, 500, 700]

  avatar = await Canvas.loadImage(guy2.displayAvatarURL({ extension: 'jpg' }));
  context.save();
  context.beginPath();
  context.arc(avatar2pos[2]/2+(avatar2pos[0]-(avatar2pos[2]/2)), avatar2pos[2]/2+(avatar2pos[1]-(avatar2pos[2]/2)), avatar2pos[2]/2, 0, Math.PI * 2, true);
  context.closePath();
  context.strokeStyle = 'white'
  context.lineWidth = 30;
  context.stroke();
  context.strokeStyle = 'black'
  context.lineWidth = 10;
  context.stroke();
  context.clip();
  context.drawImage(avatar, avatar2pos[0]-(avatar2pos[2]/2), avatar2pos[1]-(avatar2pos[2]/2), avatar2pos[2], avatar2pos[2]);
  context.restore();

  let overlayImage
  switch(type) {
  case 'propose':
    overlayImage = await Canvas.loadImage('./images/marriage/questionmark.png');
  break;
  case 'confirm':
    overlayImage = await Canvas.loadImage('./images/marriage/heart.png');
  break;
  case 'deny':
    overlayImage = await Canvas.loadImage('./images/marriage/X.png');
  break;
  }
  context.drawImage(overlayImage, 1000-(overlayImage.width/2), 500-(overlayImage.height/2), overlayImage.width, overlayImage.width);

  context.strokeStyle = 'white';
  context.lineWidth = 30;
  context.strokeRect(0, 0, canvas.width, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'marriage.png' });

  return attachment;
    } catch (err) {
      console.error('Error occurred:', err);
    }}

async function podium(winner, loser, channel) {

    try {
    const canvas = Canvas.createCanvas(499, 630);
    const context = canvas.getContext('2d');
  
  const background = await Canvas.loadImage('./images/podium.png');

  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  const avatar = await Canvas.loadImage(winner.displayAvatarURL({ extension: 'jpg' }));

  context.drawImage(avatar, 310, 25, 125, 125);

  const avatar2 = await Canvas.loadImage(loser.displayAvatarURL({ extension: 'jpg' }));

  context.drawImage(avatar2, 100, 100, 125, 125);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'podium.png' });

  return attachment;
    } catch (err) {
      console.error('Error occurred:', err);
    }
}

async function fetchProfilePicture(userId) {
  try {
    const user = await client.users.fetch(userId);
    const profilePictureUrl = user.displayAvatarURL({ format: 'png', size: 256 });
    const response = await fetch(profilePictureUrl);
    if (!response.ok) throw new Error('Failed to fetch the profile picture');
    return await response.buffer();
  } catch (error) {
    console.error('Error fetching profile picture:', error);
    throw error;
  }
}

function simplifyInteger(number) {
  if (typeof number !== "number" || !Number.isInteger(number)) {
    throw new Error("Input must be an integer.");
  }

  const abbreviations = [
    { value: 1e18, symbol: "E" },
    { value: 1e15, symbol: "P" },
    { value: 1e12, symbol: "T" },
    { value: 1e9, symbol: "B" },
    { value: 1e6, symbol: "mil" },
    { value: 1e3, symbol: "k" },
  ];

  for (let i = 0; i < abbreviations.length; i++) {
    if (number >= abbreviations[i].value) {
      const simplified = (number / abbreviations[i].value).toFixed(2);
      return `${simplified}${abbreviations[i].symbol}`;
    }
  }

  return number.toString(); // Return the original number if not simplified.
}

async function balanceImage(mention) {


  const customBackground = await db.get(mention.id+'.balimage')

  const canvas = Canvas.createCanvas(700, 250);
  const context = canvas.getContext('2d');

  let background
  
  if (!(!customBackground || customBackground === null)) {

  try {
    background = await Canvas.loadImage(customBackground);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  } catch (e) {
    let background = await Canvas.loadImage('./images/balance.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  }

  } else {
    let background = await Canvas.loadImage('./images/balance.png');
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  }

  context.strokeStyle = 'black';
  context.lineWidth = 10;

  context.font = applyText(canvas, `${mention.username}'s balance:`, 50)
  context.fillStyle = '#ffffff';

  context.strokeText(`${mention.username}'s balance:`, canvas.width / 2.7, canvas.height / 2.4);
  context.fillText(`${mention.username}'s balance:`, canvas.width / 2.7, canvas.height / 2.4)

  const curbal = simplifyInteger(parseInt(await db.get(mention.id+'.a')));

  context.font = applyText(canvas, `${mention.username}'s balance:`, 100)
  context.fillStyle = '#ffffff';

  context.strokeText(`${curbal} agnabucks`, canvas.width / 2.7, canvas.height / 1.3);
  context.fillText(`${curbal} agnabucks`, canvas.width / 2.7, canvas.height / 1.3)


  context.strokeRect(25, 25, 200, 200);

  console.log(mention.displayAvatarURL({ extension: 'png' }))

  const { body } = await request(mention.displayAvatarURL({ extension: 'png' }));
  const avatar = await Canvas.loadImage(mention.displayAvatarURL({ extension: 'png' }));
  context.drawImage(avatar, 25, 25, 200, 200);

  context.strokeStyle = 'white';

  context.strokeRect(0, 0, canvas.width, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'balance.png' });

  return attachment;

}

const applyText = (canvas, text, fontSize) => {
  //console.log(canvas)
  const context = canvas.getContext('2d');

  do {
    context.font = `${fontSize -= 10}px Segoe UI Emoji`;
  } while (context.measureText(text).width > canvas.width - 300);

  return context.font;

};

async function petImage(pet, id) {

  try {

  const canvas = Canvas.createCanvas(600, 400);
  const context = canvas.getContext('2d');
  const caretaker = true
  let color = '#235218'
  if (pet.hex && caretaker) {
  color = '#'+pet.hex
  }

  //return with specified strings if null
  if (!pet.image) {return 'image'}
  if (!pet.name) {return 'name'}

  //pet background
  try {
    const background = await Canvas.loadImage(pet.background);
    context.drawImage(background, 0, 0, canvas.width, canvas.height);
  } catch (e) {
    return 'background'
  }

  //pet marker thing
  const petMarker = await Canvas.loadImage('./images/petmarker.png');
  context.drawImage(petMarker, 30, 25, 100, 100);

  //pet name
  context.strokeStyle = 'black';
  context.lineWidth = 10;
  context.font = applyText(canvas, pet.name, 90)
  context.fillStyle = '#ffffff';
  context.strokeText(pet.name, 70, 100);
  context.fillText(pet.name, 70, 100)

  //pet subtitle
  if (pet.subtitle && caretaker) {
  context.strokeStyle = 'black';
  context.lineWidth = 5;
  context.font = `25px fira`;
  context.fillStyle = '#939393';
  context.strokeText(pet.subtitle, 80, 130);
  context.fillText(pet.subtitle, 80, 130)
  }

  //pet image
  try {
    const petImage = await Canvas.loadImage(pet.image);
    context.drawImage(petImage, canvas.width / 1.99, canvas.height / 2.2, 200, 200);
  } catch (e) {
    return 'image'
  }

  //hunger bar text
  context.strokeStyle = 'black';
  context.lineWidth = 6;
  context.font = applyText(canvas, `Hunger (${pet.hunger}%)`, 30)
  context.fillStyle = '#ffffff';
  context.strokeText(`Hunger (${pet.hunger}%)`, 35, 175);
  context.fillText(`Hunger (${pet.hunger}%)`, 35, 175)

  //hunger bar fill
  context.fillStyle = color;
  context.lineWidth = 10;
  context.fillRect(35, 190, (pet.hunger / 100) * 150, 20);

  //hunger bar outline
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.strokeRect(35, 190, 150, 20);

  //affection bar text
  context.strokeStyle = 'black';
  context.lineWidth = 6;
  context.font = applyText(canvas, `Affection (${pet.affection}%)`, 30)
  context.fillStyle = '#ffffff';
  context.strokeText(`Affection (${pet.affection}%)`, 35, 240);
  context.fillText(`Affection (${pet.affection}%)`, 35, 240)

  //affection bar fill
  context.fillStyle = color;
  context.lineWidth = 10;
  context.fillRect(35, 255, (pet.affection / 100) * 150, 20);

  //affection bar outline
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.strokeRect(35, 255, 150, 20);

  //health bar text
  context.strokeStyle = 'black';
  context.lineWidth = 6;
  context.font = applyText(canvas, `Health (${pet.health}%)`, 30)
  context.fillStyle = '#ffffff';
  context.strokeText(`Health (${pet.health}%)`, 35, 305);
  context.fillText(`Health (${pet.health}%)`, 35, 305)

  //health bar fill
  context.fillStyle = color;
  context.lineWidth = 10;
  context.fillRect(35, 315, (pet.health / 100) * 150, 20);

  //health bar outline
  context.strokeStyle = 'black';
  context.lineWidth = 3;
  context.strokeRect(35, 315, 150, 20);

  //pet emotion
  context.drawImage(await calculateEmotions(pet), 400, 30 / 2.2, 138, 120);

  //shielded
  if (pet.shielded) {
  const shieldImage = await Canvas.loadImage('./images/shielded.png');
  context.drawImage(shieldImage, canvas.width - 65, canvas.height - 65, 60, 60);
  }

  //outline
  if (color !== '#235218') {
    context.strokeStyle = color;
  } else {
    context.strokeStyle = 'white';
  }
  context.lineWidth = 10;
  context.strokeRect(0, 0, canvas.width, canvas.height);

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'balance.png' });

  return attachment;
    } catch (err) {
      console.error('Error occurred:', err);
    }
}

async function calculateEmotions(pet) {

  const totalScore = pet.health + pet.affection + pet.hunger
  let emotionImage;

  console.log(totalScore)

  if (pet.lazy) {
    return await Canvas.loadImage('./images/emotions/lazy.png');
  }

  if (totalScore == 0) {
  if (getRandomInt(99) >= 15) {
  return await Canvas.loadImage('./images/emotions/dead.png');
  } else {
  return await Canvas.loadImage('./images/emotions/dead2.png');
  }
}

  if (pet.hunger <= 20 && pet.affection <= 20 && pet.health <= 20) {return await Canvas.loadImage('./images/emotions/suffering.png')}
  if (pet.hunger <= 20) {return await Canvas.loadImage('./images/emotions/famished.png')}
  if (pet.affection <= 20) {return await Canvas.loadImage('./images/emotions/neglected.png')}
  if (pet.health <= 20) {return await Canvas.loadImage('./images/emotions/wounded.png')}

  if (totalScore > 279) {
  if (getRandomInt(99) >= 15) {
  return await Canvas.loadImage('./images/emotions/amazing.png');
  } else {
  return await Canvas.loadImage('./images/emotions/amazing2.png');
  }
  }

  if (totalScore > 200) {return await Canvas.loadImage('./images/emotions/happy.png');}
  if (totalScore > 100) {return await Canvas.loadImage('./images/emotions/ok.png');}
  if (totalScore < 100) {return await Canvas.loadImage('./images/emotions/sad.png');}

  return await Canvas.loadImage('./images/emotions/sad.png');

}

async function fishingLootImage(guyFishing, lootToDraw, typeMap) {
const canvas = Canvas.createCanvas(750, 500);
const context = canvas.getContext('2d');
  
const background = await Canvas.loadImage('./images/fishing/fishingPoses/background.png');
context.drawImage(background, 0, 0, canvas.width, canvas.height);
const fishinglayer1 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing1/1.png`);
context.drawImage(fishinglayer1, 0, 0, canvas.width, canvas.height);
const avatar = await Canvas.loadImage(guyFishing.displayAvatarURL({ extension: 'jpg' }));
context.save();
context.beginPath();
context.arc(227.5, 277.5, 27.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 200, 250, 55, 55);
context.restore();
const fishinglayer2 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing1/2.png`);
context.drawImage(fishinglayer2, 0, 0, canvas.width, canvas.height);

context.lineWidth = 3;
context.strokeStyle = 'white'
context.fillStyle = 'rgba(0, 0, 0, 0.6)'
context.fillRect(25, 25, 700, 150)
context.strokeRect(25, 25, 700, 150)
context.fillStyle = 'rgba(255, 255, 255, 0.7)'
context.fillRect(50, 50, 100, 100)
context.strokeStyle = typeMap.color
context.strokeRect(50, 50, 100, 100)
const lootThing = await Canvas.loadImage(lootToDraw);
context.drawImage(lootThing, 55, 55, 90, 90);

context.font = 'bold 60px Arial';
context.fillStyle = 'white'
context.lineWidth = 10;
context.strokeText(typeMap.rarity.toUpperCase(), 175, 100)
context.fillText(typeMap.rarity.toUpperCase(), 175, 100)

context.font = 'bold 40px Arial';
context.lineWidth = 4;
context.strokeText(typeMap.name, 175, 140)
context.fillText(typeMap.name, 175, 140)

const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'fishing.png' });

return attachment;

}

async function fishingImage(guyFishing, num) {
try {
const canvas = Canvas.createCanvas(750, 500);
const context = canvas.getContext('2d');

const background = await Canvas.loadImage('./images/fishing/fishingPoses/background.png');
context.drawImage(background, 0, 0, canvas.width, canvas.height);
const fishinglayer1 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing${num}/1.png`);
context.drawImage(fishinglayer1, 0, 0, canvas.width, canvas.height);

const avatar = await Canvas.loadImage(guyFishing.displayAvatarURL({ extension: 'jpg' }));
if (num === 1) {
context.save();
context.beginPath();
context.arc(227.5, 277.5, 27.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 200, 250, 55, 55);
context.restore();
} else {
context.save();
context.beginPath();
context.arc(207.5, 237.5, 27.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 180, 210, 55, 55);
context.restore()
}

const fishinglayer2 = await Canvas.loadImage(`./images/fishing/fishingPoses/fishing${num}/2.png`);
context.drawImage(fishinglayer2, 0, 0, canvas.width, canvas.height);

const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'fishing.png' });

return attachment;

} catch (err) {
console.error('Error occurred:', err);
}

}

async function artifactImage(guyFishing, lootToDraw, typeMap) {
const canvas = Canvas.createCanvas(750, 500);
const context = canvas.getContext('2d');
  
const background = await Canvas.loadImage('./images/fishing/fishingPoses/background.png');
context.drawImage(background, 0, 0, canvas.width, canvas.height);
const fishinglayer1 = await Canvas.loadImage(`./images/fishing/fishingPoses/artifact/1.png`);
context.drawImage(fishinglayer1, 0, 0, canvas.width, canvas.height);
const avatar = await Canvas.loadImage(guyFishing.displayAvatarURL({ extension: 'jpg' }));
context.save();
context.beginPath();
context.arc(262.5, 252.5, 22.5, 0, Math.PI * 2, true);
context.closePath();
context.strokeStyle = 'white'
context.lineWidth = 3;
context.stroke();
context.strokeStyle = 'black'
context.lineWidth = 1;
context.stroke();
context.clip();
context.drawImage(avatar, 240, 230, 45, 45);
context.restore();

context.lineWidth = 3;
context.strokeStyle = 'white'
context.fillStyle = 'rgba(0, 0, 0, 0.6)'
context.fillRect(25, 25, 700, 150)
context.strokeRect(25, 25, 700, 150)
context.fillStyle = 'rgba(255, 255, 255, 0.7)'
context.fillRect(50, 50, 100, 100)
context.strokeStyle = typeMap.color
context.strokeRect(50, 50, 100, 100)
const lootThing = await Canvas.loadImage(lootToDraw);
context.drawImage(lootThing, 55, 55, 90, 90);

context.font = 'bold 60px fira';
context.fillStyle = 'black'
context.lineWidth = 6;
context.strokeText(typeMap.rarity.toUpperCase(), 175, 100)
context.fillText(typeMap.rarity.toUpperCase(), 175, 100)

context.font = 'bold 40px fira';
context.lineWidth = 2;
context.strokeText(typeMap.name, 175, 140)
context.fillText(typeMap.name, 175, 140)

const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'fishing.png' });

return attachment;
}

async function commandInspector(name, command, aliases) {

  const parsedText = await splitCommand(command)
  let canvas
  if (!aliases) {
    canvas = Canvas.createCanvas(750, 155 + (parsedText.length * 40));
  } else {
    canvas = Canvas.createCanvas(750, 185 + (parsedText.length * 40));
  }
  const context = canvas.getContext('2d');

  
  context.fillStyle = '#14400d'
  context.fillRect(0, 0, canvas.width, canvas.height);

  context.font = '60px fira';
  context.fillStyle = 'white'
  context.strokeStyle = 'black'
  context.lineWidth = 6;
  context.strokeText(`Command: ${name}`, 15, 70)
  context.fillText(`Command: ${name}`, 15, 70)

  parsedText.forEach((key, i) => {
  context.font = '30px fira';
  context.strokeText(`${key}`, 25, 135 + (i * 40))
  context.fillText(`${key}`, 25, 135 + (i * 40))
  })


  context.font = '20px fira';
  context.lineWidth = 4;
  if (!aliases) {
  context.strokeText(`Syntax: ${command.syntax}`, 10, canvas.height - 10)
  context.fillText(`Syntax: ${command.syntax}`, 10, canvas.height - 10)

  } else {
  context.strokeText(`Syntax: ${command.syntax}`, 10, canvas.height - 30)
  context.fillText(`Syntax: ${command.syntax}`, 10, canvas.height - 30)

  context.font = '20px fira';
  context.lineWidth = 4;
  context.strokeText(`Aliases: ${aliases.join(' ,')}`, 10, canvas.height - 10)
  context.fillText(`Aliases: ${aliases.join(' ,')}`, 10, canvas.height - 10)
  }

  context.strokeText(`(${command.category})`, canvas.width - (context.measureText(`(${command.category})`).width + 10), canvas.height - 10)
  context.fillText(`(${command.category})`, canvas.width - (context.measureText(`(${command.category})`).width + 10), canvas.height - 10)

  context.strokeStyle = 'white';
  context.lineWidth = 10;
  context.strokeRect(0, 0, canvas.width, canvas.height);

const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'command.png' });

return attachment;
}

async function splitCommand(command) {

const canvas = Canvas.createCanvas(750, 1000);
const context = canvas.getContext('2d');

context.font = '30px fira';
context.fillStyle = 'white'
context.strokeStyle = 'black'
context.lineWidth = 3;

const description = command.description
const words = description.split('')

let parsedText = []
let splitText2 = ''
words.forEach((word) => {
if (word === ' ') {

  if (context.measureText(splitText2).width + 25 < canvas.width - 100) {
    splitText2 = `${splitText2}${word}`
  } else {
    parsedText.push(splitText2.trim())
    splitText2 = word
  }

} else if (word === '\n') {

  parsedText.push(splitText2.trim())
  splitText2 = word

} else {

  if (context.measureText(splitText2).width + 25 < canvas.width) {
    splitText2 = `${splitText2}${word}`
  } else {
    parsedText.push(splitText2.trim())
    splitText2 = '-'+word
  }

}
});
parsedText.push(splitText2.trim())

return parsedText;

}

module.exports = { marriageImage, podium, fetchProfilePicture, balanceImage, petImage, fishingImage, fishingLootImage, artifactImage, commandInspector }