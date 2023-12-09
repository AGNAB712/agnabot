const { PermissionsBitField, EmbedBuilder, AttachmentBuilder } = require('discord.js')
const { buyArray, inventoryFormats, itemWorth } = require('./buyMap.js')
const fs = require('fs')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const fishingJs = require('./fishing.js')
const { fishingImage, artifactImage, fishingLootImage } = require('./canvasFunctions.js')
const { fishingArray, fishingLootMap, artifacts, outfitFormats } = require('./fishing.js')

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

async function validUserId(id, message) {
    const userID = id.replace(/[\\<>@!]/g, '');
    try {
      const guild = message.guild;
      const member = await guild.members.fetch(userID);
      return member;
    } catch (error) {
      return false;
    }
}


function getTextUntilDelimiter(text, delimiter) {
  let index = text.indexOf(delimiter);
  if (index !== -1) {
    return text.substring(0, index);
  } else {
    return text;
  }
}

function isvalidhexcode(input) {
  const hexRegex = /^[0-9a-fA-F]+$/;
  return hexRegex.test(input);
}

function readJSONFile(path, callback) {
  fs.readFile(path, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      callback(err, null);
      return;
    }
    
    const jsonData = JSON.parse(data);
    callback(null, jsonData);
  });
}

function parseDuration(args) {
  if (args.length === 3) {
    const hours = parseInt(args[0]);
    const minutes = parseInt(args[1]);
    const seconds = parseInt(args[2]);

    if (!isNaN(hours) && !isNaN(minutes) && !isNaN(seconds)) {
      return {
        hours: hours,
        minutes: minutes,
        seconds: seconds
      };
    }
  }
  return null;
}

// Helper function to convert the duration object to milliseconds
function durationToMilliseconds(duration) {
  const hoursToMilliseconds = duration.hours * 60 * 60 * 1000;
  const minutesToMilliseconds = duration.minutes * 60 * 1000;
  const secondsToMilliseconds = duration.seconds * 1000;

  return hoursToMilliseconds + minutesToMilliseconds + secondsToMilliseconds;
}

// Helper function to format the duration for display
function formatDuration(duration) {
  const hours = duration.hours > 0 ? `${duration.hours} hour${duration.hours > 1 ? 's' : ''}` : '';
  const minutes = duration.minutes > 0 ? `${duration.minutes} minute${duration.minutes > 1 ? 's' : ''}` : '';
  const seconds = duration.seconds > 0 ? `${duration.seconds} second${duration.seconds > 1 ? 's' : ''}` : '';

  return `${hours} ${minutes} ${seconds}`.trim();
}

async function updateCategoryName(channel, replit) {

   if (!replit) {return}
        
  const categoryNames = await db.get('category')

  const randomName = categoryNames[getRandomInt(categoryNames.length)];
  //client.channels.cache.get('1108491109258244156').send(randomName);
  
  channel.setName(randomName)
    .then(updatedChannel => console.log(`Updated category name to ${randomName}`))
    .catch(error => console.error(`Error updating category name: ${error}`));
}

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function isNumeric(str) {
  if (typeof str != "string") return false 
  return !isNaN(str) && 
         !isNaN(parseFloat(str)) 
}

function objectPage(testmap, page) {
  let testEmbed = new EmbedBuilder()
    .setTitle('placeholder')
    .setColor('#235218')

  for (const property in testmap) {
    if (testmap[property] == 0 || testmap[property] < 0 || testmap[property]?.count == 0) {delete testmap[property]}
    if (property == 'undefined') {delete testmap[property]}
  }

  const pages = Math.ceil(testmap.size / 3)
  const inventoryArray = Object.keys(testmap);
  let curPage = page
  let description = 'Inventory:\n'

  for (let i = curPage * 3; i < (curPage * 3) + 3; i++) {
    if (!inventoryArray[i]) {description += ''} else {

    if (inventoryFormats.hasOwnProperty(inventoryArray[i])) {
      if (typeof testmap[inventoryArray[i]] === 'object') {
      description += inventoryArray.indexOf(inventoryArray[i]) + 1 + '. ' + inventoryFormats[inventoryArray[i]].replace("[count]", `${testmap[inventoryArray[i]].count} (${testmap[inventoryArray[i]].rarity})`);
      } else {
      description += inventoryArray.indexOf(inventoryArray[i]) + 1 + '. ' + inventoryFormats[inventoryArray[i]].replace("[count]", testmap[inventoryArray[i]]);
    }
    } else {
      if (typeof testmap[inventoryArray[i]] === 'object') {
        description += `${inventoryArray.indexOf(inventoryArray[i]) + 1}. \❔ \`Unknown Artifact (${inventoryArray[i]}):     ${testmap[inventoryArray[i]].count} (${testmap[inventoryArray[i]].rarity})\` \n`
      } else {
        description += `${inventoryArray.indexOf(inventoryArray[i]) + 1}. \❔ \`Unknown (${inventoryArray[i]}):     ${testmap[inventoryArray[i]]}\` \n`
      }
    }

    }
  }

  testEmbed
  .setDescription(description)
  .setTitle(`~=-Page ${curPage + 1}-=~`)

  return testEmbed
}

async function fishingLoot(message, collected, fishingEmbed) {
const me = await db.get(message.author.id)
const fishingLevelRounded = Math.floor(me.fish.level / 5)
let myFishingArray = fishingArray[fishingLevelRounded]
if (!myFishingArray) {myFishingArray = fishingArray[fishingArray.length - 1]}
const percents = percentify(myFishingArray)
const randomNum = getRandomInt(99) + 1

let sum = 0;
let index = 0;
while (sum + percents[index] < randomNum) {
  sum += percents[index];
  index++;
}


let lootToDraw
let type
let color
let exp
if (index == 0) {
type = 'trash';
lootToDraw = fishingLootMap.trash[getRandomInt(3)]
color = '#222222'
exp = 10
} else if (index == 1) {
type = 'common';
lootToDraw = fishingLootMap.common[getRandomInt(3)]
color = '#105808'
exp = 50
} else if (index == 2) {
type = 'rare';
lootToDraw = fishingLootMap.rare[getRandomInt(3)]
color = '#311fac'
exp = 100
} else if (index == 3) {
type = 'legendary';
lootToDraw = fishingLootMap.legendary[getRandomInt(3)]
color = '#fffc39'
exp = 500
} else {
const newMessage = await giftArtifact(message)
collected.update(newMessage)

return
}



const name = getTextUntilDelimiter(lootToDraw.replace(/^.*[\\/]/, ''), '.png')
const attachment = await fishingLootImage(message.author, lootToDraw, { name: name, rarity: type, color: color })
fishingEmbed.setTitle(`Congrats! You earned ${exp} exp!`)
if (me.fish.exp + exp >= me.fish.expLevel) {
fishingEmbed.setFooter({ text: `level ${me.fish.level + 1} | 0 exp | ${((Math.floor((me.fish.level + 1) / 5) + 1) * 100) + me.fish.level * 25} exp until next level` })
await db.add(message.author.id+'.fish.level', 1)
await db.set(message.author.id+'.fish.exp', 0)

await db.set(message.author.id+'.fish.expLevel', (((Math.floor((me.fish.level + 1) / 5) + 1) * 100) + me.fish.level * 25))
//next fishing level, divided by five so it only goes up every 5 levels, plus 1 so 0 is never a factor, * 100, + fishing level * 25

} else {
fishingEmbed.setFooter({ text: `level ${me.fish.level} | ${me.fish.exp + exp} exp | ${me.fish.expLevel - (me.fish.exp + exp)} exp until next level` })
await db.add(message.author.id+'.fish.exp', exp)
}
collected.update({ embeds: [fishingEmbed], files: [attachment], components: [] })

await db.add(`${message.author.id}.inv.${type}`, 1)



} 

function percentify(array) {
if (!array) {array = fishingArray[fishingArray.length]}
const sum = array.reduce((acc, number) => acc + number, 0);
const percentages = array.map(number => (number / sum) * 100);
return percentages
}

async function giftArtifact(message) {

  const artifactArray = Object.keys(artifacts)
  const randomArtifact = artifactArray[getRandomInt(artifactArray.length)]

  const artifactRarityChance = getRandomInt(99)

  let artifactRarity = [];
  let artifactColor 
  if (artifactRarityChance < 60) {
    artifactRarity = ['rare', 0];
    artifactColor = '#690d0d'
  } else if (artifactRarityChance < 90) {
    artifactRarity = ['legendary', 1];
    artifactColor = '#ffe582'
  } else {
    artifactRarity = ['uber', 2];
    artifactColor = '#5380c3'
  }

  const attachment = await artifactImage(message.author, `./images/fishing/artifacts/${randomArtifact}.png`, { name: randomArtifact, rarity: artifactRarity[0], color: artifactColor })
  let xText = ''
  if (artifacts[randomArtifact].values[artifactRarity[1]] != 0) {
  xText = `\n***X = ${artifacts[randomArtifact].values[artifactRarity[1]]}***`
  }

  let artifactEmbed = new EmbedBuilder()
    .setTitle('~-=ARTIFACT CAUGHT=-~')
    .setImage('attachment://fishing.png')
    .setColor(artifactColor)
    .setDescription(`**You got ${randomArtifact.toUpperCase()} of rarity ${artifactRarity[0].toUpperCase()}**
    ~-=*${artifacts[randomArtifact].description}*=-~
    ${artifacts[randomArtifact].text}
    ${xText}

    *(this is part of the set "${artifacts[randomArtifact].set}")*`)

  const artifactRarityString = artifactRarity[0]
  await db.add(`${message.author.id}.inv.${randomArtifact}.count`, 1)
  await db.push(`${message.author.id}.inv.${randomArtifact}.rarity`, artifactRarityString)

  return { embeds: [artifactEmbed], files: [attachment], components: [], content: 'You fished up an artifact!' }

}

module.exports = {
  getTextUntilDelimiter, isvalidhexcode, readJSONFile, parseDuration, durationToMilliseconds, formatDuration, updateCategoryName, hasArtifact, getRandomInt, validUserId, isNumeric, objectPage, fishingLoot, percentify
}