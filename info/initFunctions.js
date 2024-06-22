const { ActivityType } = require('discord.js')
const { QuickDB } = require("quick.db");
const db = new QuickDB();
const { getGlobalVar, setGlobalVar } = require('./editGlobalJson.js')
const { hasArtifact, getRandomInt } = require('./generalFunctions.js')
const fs = require('fs');
const token = process.env.WEBSITEAUTH;
const CharacterAI = require("node_characterai");
const characterAI = new CharacterAI();

async function deleteNonNumericIds() {
  const allKeys = await db.all()
  const mapKeys = allKeys.map(entry => entry.id);

  mapKeys.forEach(async (key) => {
    console.log(key)
    const theGuyStuff = await db.get(key)
    let compensation = 0;

    if (theGuyStuff?.inv) {
      const inventoryStuff = Object.keys(theGuyStuff?.inv) 
      inventoryStuff.forEach(async (me, i) => {

        const theThingToCheck = theGuyStuff.inv[me]
        if (typeof theThingToCheck === "object") {
          console.log("Deleted:", me)
          if (theThingToCheck?.rarity) {
            compensation = compensation + theThingToCheck.rarity.length
            console.log("compensation", compensation)
          }
          delete theGuyStuff.inv[me]
        }

      })

      theGuyStuff.inv.artifacts = compensation
    };

    if (theGuyStuff?.outfit) {
      delete theGuyStuff.outfit
    }
    await db.set(key, theGuyStuff)
  });

}

async function saveSqlite(replit, client) {
if (!replit) {return}
const lockdown = getGlobalVar("lockdown")
if (lockdown !== false) {return}

const saveCount = getGlobalVar("savecount")
if (saveCount < 5) {
setGlobalVar("savecount", saveCount++)
console.log(`will save sqlite in ${5 - saveCount + 1} counts`)
return
}

forceSaveSqlite(client)

}

async function loadWebsite() {

    fetch('https://agnab.onrender.com/api/loadsqlite', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(await db.all()),
    })
      .then(response => {
        console.log('sent file over to the website successfuly')
      })
      .catch(error => {
        console.error(error)
      });
}

async function forceSaveSqlite(client, replit) {
if (!replit) {return}
  setGlobalVar("savecount", 0)
  const fileName = 'json.sqlite';
  await client.channels.cache.get('1156302752218091530').messages.fetch('1156302916873900032').then((msg) => 
      msg.edit({
        content: `*${Date.now()}*`, 
        files: ['./json.sqlite']
      })
    )
    
    console.log('saved sqlite')
    
}

//load sqlite function
async function loadSqlite(client, replit) {
if (replit) {return}
await client.channels.cache.get('1156302752218091530').messages.fetch('1156302916873900032').then(async (lastMessage) => {
    if (lastMessage.attachments.size > 0) {
      const attachment = lastMessage.attachments.first();
      const fileName = attachment.name;
      if (fileName.endsWith('.sqlite')) {
        const file = await fetchAttachment(attachment.url);
        fs.writeFileSync(fileName, file);
        console.log(`sqlite loaded`);
      }
    }
}
  )
}

//status load function
async function loadCurrentStatus(client) {
  const channelId = '1140672130619543603';
  const channel = client.channels.cache.get(channelId);
  channel.messages.fetch({ limit: 1 })
    .then(messages => {
      const firstMessage = messages.first();
    const data = firstMessage.content;
    const splitData = data.split(',')
    if (!splitData[1]) {
    client.user.setActivity(splitData[0]);
    } else if (splitData[1].trim() === 'watching') {
    client.user.setActivity(splitData[0], { type: ActivityType.Watching });
    } else if (splitData[1].trim() === 'playing') {
    client.user.setActivity(splitData[0]);
    } else if (splitData[1].trim() === 'competing') {
    client.user.setActivity(splitData[0], { type: ActivityType.Competing });
    } else if (splitData[1].trim() === 'listening') {
    client.user.setActivity(splitData[0], { type: ActivityType.Listening });
    }
    })
    .catch(console.error);
}

//child labor function (for the child labor shop item)
async function doChildLabor() {

  const allUserData = await db.all()
  const toWork = allUserData.filter(data => !isNaN(data.id))
  await toWork.forEach(async (value, index) => {
    if (!value.value.children) {return}
    const laziness = await hasArtifact(value.id, 'amuletoflaziness');
    let multiplyValue = 1
    if (laziness) {multiplyValue = 0.5}
    await db.add(value.id+'.a', Math.floor(multiplyValue * parseInt(value.value.children)));
  })
}

//for updating pet stats
async function updatePets() {

  const allUserData = await db.all()
  const toUpdate = allUserData.filter(data => !isNaN(data.id))
  toUpdate.forEach(async (value, index) => {

    const userId = value.id
    const myPet = await db.get(userId+'.pet');
    if (!myPet) {return}

    const laziness = await hasArtifact(userId, 'amuletoflaziness');
    if (!laziness) {
      await db.set(userId+'.pet.lazy', false);
      await deprivePets(myPet, userId)
    } else {

      if (myPet.lazy) {
        if (myPet.hunger === 100 && myPet.health === 100 && myPet.affection === 100) {
          await db.set(userId+'.pet.lazy', false);
        }
        if (myPet.health + laziness[1] > 100) {await db.set('pet_' + userId + '.health', 100);} else {await db.add('pet_' + userId + '.health', laziness[1]);}
        if (myPet.affection + laziness[1] > 100) {await db.set('pet_' + userId + '.affection', 100);} else {await db.add('pet_' + userId + '.affection', laziness[1]);}
        if (myPet.hunger + laziness[1] > 100) {await db.set('pet_' + userId + '.hunger', 100);} else {await db.add('pet_' + userId + '.hunger', laziness[1]);}
      } else {
        if (myPet.hunger - 1 < 25 || myPet.health - 1 < 25 || myPet.affection - 1 < 25) {
          await db.set(userId+'.pet.lazy', true);
        }

        await deprivePets(myPet, userId)
      }

    }
  })
}

async function deprivePets(myPet, userId) {

  const shield = await hasArtifact(userId, 'impenetrableshield')

  if (getRandomInt(3) + 1 === 3) {
    if (myPet.hunger - 1 < 0) {
      await db.set(userId+'.pet.hunger', 0);
      return;
    }
    await db.set(userId+'.pet.hunger', myPet.hunger - 1);
  }

  if (getRandomInt(2) + 1 === 2) {
    if (myPet.affection - 1 < 0) {
      await db.set(userId+'.pet.affection', 0);
      return;
    }
    await db.set(userId+'.pet.affection', myPet.affection - 1);
  }

  if (shield) {
  
    await db.set(userId+'.pet.shielded', true);

  if (myPet.hunger == 0 && myPet.affection == 0) {
    if (myPet.health - 3 < 0) {
      await db.set(userId+'.pet.health', 0);
      return;
    }
    await db.set(userId+'.pet.health', myPet.health - 3);
  }

  } else {

    await db.set(userId+'.pet.shielded', false);
    if (getRandomInt(5) + 1 === 5) {
      if (myPet.health - 1 < 0) {
        await db.set(userId+'.pet.health', 0);
        return;
      }
      await db.set(userId+'.pet.health', myPet.health - 1);
    }
  }
}

async function payPets() {
  const allUserData = await db.all()
  await allUserData.forEach(async (value, index) => {
    const userId = value
    const myPet = await db.get(userId+'.pet')
    if (!myPet) {return}
    const curbal = await db.get(userId+'.a')
    const helmet = await hasArtifact(userId, 'emeraldhelmet')
    const shield = await hasArtifact(userId, 'impenetrableshield')
    if (helmet) {return}

    let toAdd = myPet.affection + myPet.hunger
    if (!shield) {
      toAdd += myPet.health
    } else {
      toAdd += myPet.health * shield[1]
    }

    await db.add(userId+'.a', toAdd)
  })
}

async function fetchAttachment(url) {
  const res = await fetch(url);
  const arrayBuffer = await res.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  return buffer;
}

module.exports = {
  saveSqlite, forceSaveSqlite, loadSqlite, loadCurrentStatus, doChildLabor, updatePets, payPets, deleteNonNumericIds, deprivePets, loadWebsite
}