const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt } = require('../../info/generalFunctions.js')
const { buyArray, inventoryFormats, itemWorth } = require('../../info/buyMap.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();

const cooldowns = new Map()

const defaultPet = {
  name: null,
  image: null,
  background: './images/petbg.png',
  hunger: 100,
  affection: 100,
  health: 100
}

async function buy(message, args, bot, client) {

    let children = await db.get(message.author.id+".children")
  if (!children) {
    childrenPrice = 1000
  } else {
    childrenPrice = 5000 * children
  }


    const curbal = await db.get(message.author.id+'.a');
    const hotelBought = await db.get(`${message.author.id}.hotel`) 
    const riggedBought = await db.get(`${message.author.id}.slotMachine`)
    const fishBought = await db.get(`${message.author.id}.fish`)
    const avacadoBought = await db.get(`${message.author.id}.avacado`)
    const verified = await db.get(`${message.author.id}.mc`)
    const hasPet = await db.get(`${message.author.id}.pet`)

      const select = new StringSelectMenuBuilder()
      .setCustomId('buy')
      .setPlaceholder('Click here to choose what to buy')
    
    buyArray.forEach((me, i) => {
    if (me.value === 'premium' && message.member?.roles.cache?.has('1120808808655102035')) {return}
    if ((me.value === 'cocaine' || me.value === 'meth' || me.value === 'alcohol') && message.member?.roles.cache?.has('1120830175114973215')) {return}
    if (me.value === 'hotel' && hotelBought) {return}
    if (me.value === 'rigged' && riggedBought) {return}
    if (me.value === 'fish' && fishBought) {return}
    if (me.value === 'avacado' && avacadoBought) {return}
    if (me.value === 'pet' && hasPet) {return}
    if (me.value === 'name' && !message.member.guild.roles.cache.find(role => role.name === "Minecraft Participant")) {return}
    if (me.value === 'head' && !verified) {return}
    select.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel(me.label)
        .setDescription(me.description.replace(/\[money\]/g, childrenPrice))
        .setValue(me.value)
        .setEmoji(me.emoji),
    );
    })

    const row = new ActionRowBuilder()
      .addComponents(select);

const response = await message.reply({
  content: `choose what you want to buy`,
  components: [row],
});

const collectorFilter = i => i.user.id === message.author.id;

try {
  const confirmation = await response.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
  if (confirmation.user.id !== message.author.id) {
  return message.channel.send(`${confirmation.user} you cant buy using someone else's buy command bro`)
  }
  response.delete()

switch (confirmation.values[0]) {

case 'cancel':
message.reply('**<:AgnabotX:1153460434691698719> ||** oook bai bai :3')
break;

case 'pet':
  const myPet = await db.get(`${message.author.id}.pet`)
  if (myPet && myPet !== 'null') {return message.reply('**<:AgnabotX:1153460434691698719> ||** you already have a pet Lol')}
  if (curbal > 1000) {
    await db.set(`${message.author.id}.pet`, defaultPet)
    await db.set(message.author.id+'.a', parseInt(curbal) - 1000) 
    return message.reply('**<:AgnabotPet:1180752541097668708> ||** pet bought! \nin order to get started with your pet, please use a.pet name (your pets name) and a.pet image (your image) \nwithout this your pet will not accrue agnabucks')
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
  }
break;

case 'hotel':
  const myHotel = await db.get(message.author.id+'.hotel')
  if (!myHotel || myHotel === 'undefined') {
    if (curbal > 5000) {
    const categoryId = '1130959364073717801';
    const channelName = `${message.author.username.toLowerCase()}s-room`;
      const channel = await message.guild.channels.create({
        name: channelName,
        type: 0,
        parent: categoryId,
      });
    channel.setTopic(`owned by ${message.author.username}`);
    channel.permissionOverwrites.edit(message.author.id, { ManageMessages: true });
    await db.set(`${message.author.id}.hotel`, channel.id)
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 5000))
    await channel.send(`<@${message.author.id}>`)
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** stop being Poor')
  }
} else {
  message.reply('**<:AgnabotX:1153460434691698719> ||**you already have a room dude')
}
break;
  
case 'cocaine':
if (curbal > 10000) {
await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 10000));
message.reply('https://cdn.discordapp.com/attachments/831714424658198532/1119014960127811655/Martin_Cabello_-_Cocaina_No_Flour_Original_video_online-video-cutter.com.mp4')
const reminderTime = Date.now() + 60 * 24 * 60 * 1000; 
await db.set(`reminder_` + message.author.id , parseInt(reminderTime));

const role = message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
message.member.roles.add(role);
} else {
message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
}
break;

case 'meth':
    if (curbal > 1000) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 1000));
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** high as shit brah')
    const reminderTime = Date.now() + 60 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    
    const role= message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    message.member.roles.add(role);
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'alcohol':
    if (curbal > 100) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 100));
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** i too am also a crippling alcoholic')
    const reminderTime = Date.now() + 1 * 60 * 1000; 
    await db.set(`reminder_` + message.author.id , parseInt(reminderTime));
    
    const role = message.member.guild.roles.cache.find(role => role.name === "high as shit brah");
    message.member.roles.add(role);
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'premium':
    if (curbal > 10000) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 10000));
    message.reply('**<:AgnabotCheck:1153525610665214094> ||**  you are so premium broski')
    const role = message.member.guild.roles.cache.find(role => role.name === "AGNAB Premium");
    message.member.roles.add(role);
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'bomb':
    if (curbal > 1000) {
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 1000));
    const muteGuy = message.mentions.members.first();
    if (muteGuy) {
      if (muteGuy.id == '1107764918293372989') {return message.reply('noob')}
      const auraOfDeflection = await hasArtifact(muteGuy.id, 'auraofdeflection')
      const cooldownDuration = 60000;
      const expirationTime = Date.now() + cooldownDuration;
      const randomChance = getRandomInt(99) + 1
      console.log(randomChance, auraOfDeflection[1])
      if (randomChance <= auraOfDeflection[1]) {
        message.member.timeout(cooldownDuration)
        message.reply(`**<:AgnabotCheck:1153525610665214094> ||** **(AURA OF DEFLECTION CAUSED BOMB TO BACKFIRE)** \n<@${message.author.id}> you just got MUTED! what a nerd.........................`)
      } else {
        muteGuy.timeout(cooldownDuration)
        message.reply(`**<:AgnabotCheck:1153525610665214094> ||** <@${muteGuy.id}> you just got MUTED! what a nerd.........................`)
      }

      setTimeout(() => {
        message.channel.send(`<@${muteGuy.id}> your mute is over`);
      }, cooldownDuration);

    } else {
      message.reply('**<:AgnabotX:1153460434691698719> ||** gotta mention someone bro')
    }
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
  }
break;

case 'rigged':
    if (curbal > 5000) {
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** lol you Cheat')
    await db.set(message.author.id+'.slotMachine', true);
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 5000));
    
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'tts':
    if (curbal > 100) {

    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 100));
    const passes = await db.get(message.author.id+'.inv.ttspasses');

    await db.set(message.author.id+'.inv.ttspasses', passes + 1);
    if (!passes) {await db.set(message.author.id+'.inv.ttspasses', 1);}

    message.reply(`**<:AgnabotCheck:1153525610665214094> ||** wow this will certainly not get annoying\nyou have ${await db.get(message.author.id+'.inv.ttspasses')} tts passes`)

    

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'speechbubble':
    if (curbal > 200) {

    const channel = client.channels.cache.get('1085289780901842996');
    const messages = await channel.messages.fetch();
    const attachments = messages.filter((msg) => msg.attachments.size > 0 || msg.content.includes('https'));

    if (attachments.size === 0) {
      return console.log('No attachments found in the channel.');
    }

    const randomMessage = attachments.random();

    if (randomMessage.content.includes('https')) {
      if (randomMessage.author.id !== '1107764918293372989') {
        const words = randomMessage.content.split(' ');
        message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${words[0]}`)
        client.channels.cache.get('1085289780901842996').send(`${words[0]} ${message.author.username}`)
        randomMessage.delete();
      } else {

      const words = randomMessage.content.split(' ');
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${words[0]}`)
      randomMessage.edit(`${words[0]} ${message.author.username}`)
    }
    } else {
      if (randomMessage.author.id !== '1107764918293372989') {
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${randomMessage.attachments.first().url}`)
      client.channels.cache.get('1085289780901842996').send(`${randomMessage.attachments.first().url} ${message.author.username}`)
      randomMessage.delete();
      } else {
      message.reply(`**<:AgnabotCheck:1153525610665214094> ||** congrats you are now the new owner of this stupid thing ${randomMessage.attachments.first().url}`)
      randomMessage.edit(`${randomMessage.attachments.first().url} ${message.author.username}`)
    }
    }
  await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 200));
  
  } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
  }
break;

case 'child':
    if (curbal > childrenPrice-1) {

    let newChildren = 0
    if (!children) {
      newChildren = 1
      await db.set(message.author.id+'.children', 1);
    } else {
      if (children === 10) {return message.reply('you have 10 already')}
      newChildren = children + 1
      await db.add(message.author.id+'.children', 1);
    }
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - childrenPrice));

    message.reply(`**<:AgnabotCheck:1153525610665214094> ||**  wowie zowie thats crazy now you have ${newChildren} agnabucks per 5 minute`)

    

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'ring':
    if (curbal > 10000) {

    let rings = await db.get(message.author.id+'.inv.rings')
    console.log(!rings)

    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 10000));
    await db.set(message.author.id+'.inv.rings', rings + 1);
    if (!rings) {await db.set(message.author.id+'.inv.rings', 1)}

    

  message.reply('**<:AgnabotCheck:1153525610665214094> ||** congrats Yipee')

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'fish':
    if (curbal > 5000) {
    let rings = await db.get(message.author.id+'.fish')

    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 5000));
    await db.set(message.author.id+'.fish', { level: 0, exp: 0, expLevel: 100 });

    

    message.reply('**<:AgnabotCheck:1153525610665214094> ||** this feature is currently a wip btw')

      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'avacado':
    if (curbal > 100000) {
    message.reply({ content: '**<:AgnabotCheck:1153525610665214094> ||** congrats here is your avacado', files: [ './images/avacado.png' ] })
    await db.set(message.author.id+'.avacado', true);
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 100000));
    
      } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'head':
    if (curbal > 25000) {
    try {
    if (!await isMinecraftOnline()) return message.reply('**<:AgnabotX:1153460434691698719> ||** server offline, sorry')
    const mcUsername = await db.get(message.author.id+'.mc')
    const playersOnline = Object.keys(bot.players)
    if (!playersOnline.includes(mcUsername)) return message.reply('**<:AgnabotX:1153460434691698719> ||** get on the server first')
    bot.chat(`/give ${mcUsername} minecraft:player_head{SkullOwner:${mcUsername}}`)
    message.reply('**<:AgnabotCheck:1153525610665214094> ||** it should be in your inventory now')
    await db.set(message.author.id+'.a', parseInt(parseInt(curbal) - 25000));
    
  } catch (e) {
    message.reply('**<:AgnabotX:1153460434691698719> ||** sorry an error occured')
  }
    } else {
    message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
    }
break;

case 'name':
if (curbal > 50000) {
const mcUsername = await db.get(message.author.id+'.mc')
if (!await isMinecraftOnline()) return message.reply('**<:AgnabotX:1153460434691698719> ||** server offline, sorry')
if (!mcUsername) return message.reply('**<:AgnabotX:1153460434691698719> ||** link your account first with a.verify')
const playersOnline = Object.keys(bot.players)
if (!playersOnline.includes(mcUsername)) return message.reply('**<:AgnabotX:1153460434691698719> ||** get on the server first')
message.reply('**<:AgnabotCheck:1153525610665214094> ||** cool, now say the hex code')
const msg_filter = (m) => m.author.id === message.author.id;
const collected = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });
  
if (isvalidhexcode(collected.first().content)) {
message.reply('**<:AgnabotCheck:1153525610665214094> ||** CONGRATS it worked')
bot.chat(`wow ${mcUsername} just set their color to something else CONGRATS`)
bot.chat(`/chatformathex ${mcUsername} ${collected.first().content}`)

} else {
  return message.reply('**<:AgnabotX:1153460434691698719> ||** not a valid hex code')
}

} else {
message.reply('**<:AgnabotX:1153460434691698719> ||** no money Bitch')
}
break;

}

} catch (e) {
  console.error(e)
  await response.edit({ content: '**<:AgnabotX:1153460434691698719> ||** Confirmation not received within 1 minute, cancelling', components: [] });
}
}

module.exports = buy
