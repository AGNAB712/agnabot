const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, ButtonStyle, ButtonBuilder, ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require('discord.js')
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { getRandomInt } = require('../../info/generalFunctions.js')
const db = new QuickDB();

const dungeonMaster = require('../../info/dungeons/dungeons.js')
const emptyDungeon = {
  level: 1,
  xpTillNextLevel: 100,
  xp: 0,
  class: "fighter"
}

async function dungeons(message, args, bot, client) {

  const dungeonsMessage = await message.reply('**<a:AgnabotLoading:1155973084868784179> ||** setting up dungeons...')
  let myDungeonsData = await db.get(message.author.id+'.dungeons')
  console.log(myDungeonsData)

  if (!myDungeonsData) {
    await dungeonsMessage.edit("**<:AgnabotCheck:1153525610665214094> ||** welcome to dungeons! to start, choose a class (you can change this later)")
    const response = await askButton([{ id: "fighter", label: "Fighter" }, { id: "wizard", label: "Wizard" }, { id: "paladin", label: "Paladin" }, { id: "cleric", label: "Cleric" }], dungeonsMessage)
    if (!response) {
    dungeonsMessage.delete()
    message.reply('**<:AgnabotX:1153460434691698719> ||** ok. don\'t reply then.')
    return}
    emptyDungeon.class = response.customId
    await db.set(message.author.id+'.dungeons', emptyDungeon)
    myDungeonsData = emptyDungeon
  }

  await menuBuilder()

  async function menuBuilder() {

  myDungeonsData = await db.get(message.author.id+'.dungeons')

  const menuEmbed = new EmbedBuilder()
    .setColor('#235218')
    .setTitle('~-= AGNABOT DUNGEONS =-~')
    .setDescription('welcome to agnabot dungeons! select an action to start')
    .setFooter({ text: `${message.author.username} - class: ${myDungeonsData.class}` })

  await dungeonsMessage.edit({ content: "", embeds: [menuEmbed], components: [] })
  const response = await askButton([{ id: "start", label: "Start" }, { id: "settings", label: "Settings/Data" }], dungeonsMessage)

  if (!response) {
    dungeonsMessage.delete()
    message.reply('**<:AgnabotX:1153460434691698719> ||** ok. don\'t reply then.')
    return}
  if (response.customId == "start") {

    //opening dungeon

    menuEmbed.setDescription("Choose a dungeon to open!")

    let selectDungeon = new StringSelectMenuBuilder()
      .setCustomId('dungeonSelect')
      .setPlaceholder(`Select a dungeon`)

    selectDungeon.addOptions(
      new StringSelectMenuOptionBuilder()
        .setLabel("Back")
        .setValue(`dungeonBack`)
        .setDescription("Go back to the menu")
    )

    dungeonMaster.dungeonData.dungeons.forEach((dungeon, i) => {

      if (dungeon.minimumLevel > myDungeonsData.level) return

      selectDungeon.addOptions(    
        new StringSelectMenuOptionBuilder()
        .setLabel(dungeon.name)
        .setValue(dungeon.name)
        .setDescription(dungeon.description)
      )
    })

    const row = new ActionRowBuilder()
      .addComponents(selectDungeon);

    const collectorFilter = i => i.user.id === message.author.id
    await response.update({ content: "", embeds: [menuEmbed], components: [row] })
    let collected
    try {
      collected = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });
    } catch (e) {
      console.error(e)
      dungeonsMessage.delete()
      message.reply('**<:AgnabotX:1153460434691698719> ||** ok. don\'t reply then.')
      return
    }

    if (collected.values[0] === 'dungeonBack') {

      await collected.update('**<a:AgnabotLoading:1155973084868784179> ||** loading...')
      menuBuilder()

    } else {

      menuEmbed.setDescription("Would you like to open this dungeon solo, or invite other people?")
      await collected.update({ content: "", embeds: [menuEmbed], components: [] })
      const response = await askButton([{ id: "solo", label: "Solo" }, { id: "group", label: "Group" }], dungeonsMessage)

      let players = []
      if (!response) {
        dungeonsMessage.delete()
        message.reply('**<:AgnabotX:1153460434691698719> ||** ok. don\'t reply then.')
        return}
      if (response.customId === 'solo') {
        players[0] = new dungeonMaster.Player(message.author.id, message.author.displayAvatarURL({ extension: 'jpg' }), message.author.username, myDungeonsData.level, myDungeonsData.class)

        menuEmbed.setDescription("Creating dungeon...")
        await response.update({ content: "", embeds: [menuEmbed], components: [] })
      } else if (response.customId === "group") {

        menuEmbed.setDescription("Please send a message pinging all the people you want to invite (maximum 2 others)")
        response.update({ content: "", embeds: [menuEmbed], components: [] })

        const msg_filter = (m) => m.author.id === message.author.id;
        const collectedMessage = await message.channel.awaitMessages({ filter: msg_filter, max: 1 });

        players[0] = new dungeonMaster.Player(message.author.id, message.author.displayAvatarURL({ extension: 'jpg' }), message.author.username, myDungeonsData.level, myDungeonsData.class)

        const usersNonFormatted = Array.from(collectedMessage.first()?.mentions?.users?.values())
        console.log(usersNonFormatted)
        if (!usersNonFormatted) {return dungeonsMessage.edit({ content: "**<:AgnabotX:1153460434691698719> ||** no users mentioned", embeds: [] })}
        if (usersNonFormatted.length > 2 || usersNonFormatted.length < 1) {return dungeonsMessage.edit({ content: "**<:AgnabotX:1153460434691698719> ||** invalid amount of people", embeds: [] })}

        let shouldLeave = false
        usersNonFormatted.forEach(async (user) => {
          if (user.id === message.author.id) {
            dungeonsMessage.edit({ content: "**<:AgnabotX:1153460434691698719> ||** cannot add yourself", embeds: [] })
            shouldLeave = true
            return
          }
          if (user.bot) {
            dungeonsMessage.edit({ content: "**<:AgnabotX:1153460434691698719> ||** cannot invite a bot silly billy", embeds: [] })
            shouldLeave = true
            return
          }

          const userDungeon = await db.get(user.id+'.dungeons')
          if (!userDungeon) {
            dungeonsMessage.edit({ content: "**<:AgnabotX:1153460434691698719> ||** someone doesn't have dungeons set up. run a.dungeons to set it up manually", embeds: [] })
            shouldLeave = true
            return
          }

          console.log(user.displayAvatarURL({ extension: 'jpg' }))
          players.push(new dungeonMaster.Player(user.id, user.displayAvatarURL({ extension: 'jpg' }), user.username, userDungeon.level, userDungeon.class))
        })

        if (shouldLeave) return

        
      }

      const inv = await db.get(message.author.id+'.inv')
      if (inv?.dungeonkeys < 1 || !inv?.dungeonkeys) {
        dungeonsMessage.edit({ content: "**<:AgnabotX:1153460434691698719> ||** you don't have any dungeon keys!", embeds: [], components: [] })
        return
      } else {
        await db.sub(message.author.id+'.inv.dungeonkeys', 1)
      }
      let footerText = "Players: "
      players.forEach((player, i) => {
        if (i === players.length - 1) {
          footerText=footerText+player.name
        } else {
          footerText=footerText+player.name+", "
        }
        
      })
      const dungeon = new dungeonMaster.Dungeon(collected.values[0], players, myDungeonsData.level)
      let currentRoom = 0; 
      

      //ACTUAL DUNGEON STUFF
      let room = dungeon.generateRoom()
      console.log(dungeon, room)
      let currentTurn = 0

      await gameLoop(room)

      async function gameLoop(room) {

        if (room.type == 'empty') {

          const attachment = await room.generateStatsImage()

          menuEmbed.setTitle(`-= DUNGEONS || ${room.name} =-`)
          .setDescription(`Room ${currentRoom + 1}
          An empty room. A good place to take a rest.`)
          .setImage('attachment://dungeon.png')
          .setFooter({ text: footerText })

          const continueButton = new ButtonBuilder()
          .setCustomId('continue')
          .setLabel('Continue...')
          .setStyle(ButtonStyle.Success)

          const continueRow = new ActionRowBuilder()
            .addComponents(continueButton);

          await dungeonsMessage.edit({ content: "", components: [continueRow], embeds: [menuEmbed], files: [attachment] })

          const confirmationContinue = await dungeonsMessage.awaitMessageComponent({ filter: (i => true), time: 60000 })
            .catch(err => {});
          if (confirmationContinue) {
            confirmationContinue.update({})
          }

          currentRoom++
          console.log(currentRoom)
          if (currentRoom > 3) {
            console.log("im generating")
            const newRoom = dungeon.generateBossRoom()
            gameLoop(newRoom)
            return
          }
          const newRoom = dungeon.generateRoom()
          currentTurn = 0
          gameLoop(newRoom)
          return

        }

        if (room.type == 'treasure') {

         const attachment = await room.generateStatsImage()
         let possibleTreasure = ['gold', 'silver', 'copper']

         players.forEach(async (player) => {
          await db.add(player.id+'.inv.'+possibleTreasure[room.treasureLevel], 1)
         })

          menuEmbed.setTitle(`-= DUNGEONS || ${room.name} =-`)
          .setDescription(`Room ${currentRoom + 1}
          The room in front of you is filled with treasure! (use your imagination)
          Every player still alive gets 1 ${possibleTreasure[room.treasureLevel]}!`)
          .setImage('attachment://dungeon.png')
          .setFooter({ text: footerText })

          const continueButton = new ButtonBuilder()
          .setCustomId('continue')
          .setLabel('Continue...')
          .setStyle(ButtonStyle.Success)

          const continueRow = new ActionRowBuilder()
            .addComponents(continueButton);

          await dungeonsMessage.edit({ content: "", components: [continueRow], embeds: [menuEmbed], files: [attachment] })

          const confirmationContinue = await dungeonsMessage.awaitMessageComponent({ filter: (i => true), time: 60000 })
            .catch(err => {});
          if (confirmationContinue) {
            confirmationContinue.update({})
          }

          currentRoom++
          if (currentRoom > 3) {
            const newRoom = dungeon.generateBossRoom()
            gameLoop(newRoom)
            return
          }
          const newRoom = dungeon.generateRoom()
          currentTurn = 0
          gameLoop(newRoom)
          return
        }

        if (room.type == 'trap') {
          const attachment = await room.generateStatsImage()

          menuEmbed.setTitle(`-= DUNGEONS || ${room.name} =-`)
          .setDescription(`Room ${currentRoom + 1}
          Oh no! You weren't watching your footing and walked right into a trap! Everyone takes damage`)
          .setImage('attachment://dungeon.png')
          .setFooter({ text: footerText })

          const continueButton = new ButtonBuilder()
          .setCustomId('continue')
          .setLabel('Continue...')
          .setStyle(ButtonStyle.Success)

          const continueRow = new ActionRowBuilder()
            .addComponents(continueButton);

          await dungeonsMessage.edit({ content: "", components: [continueRow], embeds: [menuEmbed], files: [attachment] })

          const confirmationContinue = await dungeonsMessage.awaitMessageComponent({ filter: (i => true), time: 60000 })
            .catch(err => {});
          if (confirmationContinue) {
            confirmationContinue.update({})
          }

          const endDungeon = dungeonMaster.checkForDeath(room)
          if (endDungeon) {
            dungeonsMessage.delete()
            const endImage = await dungeonMaster.endGame(dungeon)
            menuEmbed.setDescription('All players are dead. Here are the spoils of your run')
            message.channel.send({ files: [endImage], embeds: [menuEmbed] })
            return
          }

          currentRoom++
          if (currentRoom > 3) {
            const newRoom = dungeon.generateBossRoom()
            gameLoop(newRoom)
            return
          }

          const newRoom = dungeon.generateRoom()
          currentTurn = 0
          gameLoop(newRoom)
          return
        }

        const continueButton = new ButtonBuilder()
        .setCustomId('continue')
        .setLabel('Continue...')
        .setStyle(ButtonStyle.Success)

        const continueRow = new ActionRowBuilder()
          .addComponents(continueButton);

        menuEmbed.setTitle(`-= DUNGEONS || ${room.name} =-`)
        .setDescription(`Room ${currentRoom + 1}
        ${room.players[currentTurn].name}'s turn`)
        .setImage('attachment://dungeon.png')
        .setFooter({ text: footerText })

        const attack1 = new ButtonBuilder()
        .setCustomId('attack1')
        .setLabel(dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][0].label)
        .setStyle(ButtonStyle.Success)

        const attack2 = new ButtonBuilder()
        .setCustomId('attack2')
        .setLabel(dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][1].label)
        .setStyle(ButtonStyle.Success)

        const superAttack = new ButtonBuilder()
        .setCustomId('superAttack')
        .setLabel(dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][2].label)
        .setStyle(ButtonStyle.Secondary)
        if (room.players[currentTurn].superAttackUsed) {
          superAttack.setDisabled(true)
        }

        const row = new ActionRowBuilder()
          .addComponents(attack1, attack2, superAttack);

        const attachment = await room.generateImage()
        console.log(attachment)
        await dungeonsMessage.edit({ content: "", embeds: [menuEmbed], files: [attachment], components: [row] })


        let collectorFilter = i => i.user.id === room.players[currentTurn].id;

        const confirmation = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 })
          .catch(err => {});;
        if (!confirmation) {
          menuEmbed.setDescription('No action was chosen in time, skipping to next player...')
          await dungeonsMessage.edit({ embeds: [menuEmbed] })
          currentTurn++

          gameLoop(room)
        }
        let attackDescription = "Error occured! Received no text.";

        switch(confirmation.customId) {

          //these should DEFINITELY be functions... would shorten the code by like 100 needless lines and its more scalable
          //will i make them functions now? probably not
          //sorry if you're trying to read this code lol
          case "attack1": 
              if (dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][0].enemy) {

                const collectorFilter = i => i.user.id === room.players[currentTurn].id;
                const row = new ActionRowBuilder()
                room.enemies.forEach((enemy, i) => {

                const button = new ButtonBuilder()
                .setCustomId(`${i}`)
                .setLabel(enemy.class)
                .setStyle(ButtonStyle.Success)

                row.addComponents(button)

                })

                menuEmbed.setDescription('Choose the enemy you want to attack!')
                await confirmation.update({ content: "", embeds: [menuEmbed], components: [row] })

                const enemyToAttack = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 }).catch(err => {});;
                if (!enemyToAttack) {
                  menuEmbed.setDescription('No enemy was chosen in time, skipping to next player...')
                  enemyToAttack.update({ embeds: [menuEmbed] })
                  currentTurn++
                  gameLoop(room)}
                await enemyToAttack.update({})
                attackDescription = room.players[currentTurn].attack1(room, parseInt(enemyToAttack.customId))

                attackDescription
              } else if (dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][0].ally) {

                const collectorFilter = i => i.user.id === room.players[currentTurn].id;
                const row = new ActionRowBuilder()
                room.players.forEach((enemy, i) => {

                const button = new ButtonBuilder()
                .setCustomId(`${i}`)
                .setLabel(enemy.name)
                .setStyle(ButtonStyle.Success)

                row.addComponents(button)

                })

                menuEmbed.setDescription('Choose the ally you want to heal!')
                await confirmation.update({ content: "", embeds: [menuEmbed], components: [row] })

                const enemyToAttack = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 }).catch(err => {});;
                if (!enemyToAttack) {
                  menuEmbed.setDescription('No enemy was chosen in time, skipping to next player...')
                  enemyToAttack.update({ embeds: [menuEmbed] })
                  currentTurn++
                  gameLoop(room)
                }
                await enemyToAttack.update({})
                attackDescription = room.players[currentTurn].attack1(room, parseInt(enemyToAttack.customId))
                
              } else {
                attackDescription = room.players[currentTurn].attack1(room)
              }break;

          case "attack2": 
              if (dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][1].enemy) {

                const collectorFilter = i => i.user.id === room.players[currentTurn].id;
                const row = new ActionRowBuilder()
                room.enemies.forEach((enemy, i) => {

                const button = new ButtonBuilder()
                .setCustomId(`${i}`)
                .setLabel(enemy.class)
                .setStyle(ButtonStyle.Success)

                row.addComponents(button)

                })

                menuEmbed.setDescription('Choose the enemy you want to attack!')
                await confirmation.update({ content: "", embeds: [menuEmbed], components: [row] })

                const enemyToAttack = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 }).catch(err => {});;
                if (!enemyToAttack) {
                  menuEmbed.setDescription('No enemy was chosen in time, skipping to next player...')
                  enemyToAttack.update({ embeds: [menuEmbed] })
                  currentTurn++
                  gameLoop(room)}
                await enemyToAttack.update({})
                attackDescription = room.players[currentTurn].attack2(room, parseInt(enemyToAttack.customId))
              } else if (dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][1].ally) {

                const collectorFilter = i => i.user.id === room.players[currentTurn].id;
                const row = new ActionRowBuilder()
                room.players.forEach((enemy, i) => {

                const button = new ButtonBuilder()
                .setCustomId(`${i}`)
                .setLabel(enemy.name)
                .setStyle(ButtonStyle.Success)

                row.addComponents(button)

                })

                menuEmbed.setDescription('Choose the ally you want to heal!')
                await confirmation.update({ content: "", embeds: [menuEmbed], components: [row] })

                const enemyToAttack = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 }).catch(err => {});;
                if (!enemyToAttack) {
                  menuEmbed.setDescription('No enemy was chosen in time, skipping to next player...')
                  enemyToAttack.update({ embeds: [menuEmbed] })
                  currentTurn++
                  gameLoop(room)}
                await enemyToAttack.update({})
                attackDescription = room.players[currentTurn].attack2(room, parseInt(enemyToAttack.customId))
                
              } else {
                attackDescription = room.players[currentTurn].attack2(room)
              }break;

          case "superAttack": 
              if (dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][2].enemy) {

                const collectorFilter = i => i.user.id === room.players[currentTurn].id;
                const row = new ActionRowBuilder()
                room.enemies.forEach((enemy, i) => {

                const button = new ButtonBuilder()
                .setCustomId(`${i}`)
                .setLabel(enemy.class)
                .setStyle(ButtonStyle.Success)

                row.addComponents(button)

                })

                menuEmbed.setDescription('Choose the enemy you want to attack!')
                await confirmation.update({ content: "", embeds: [menuEmbed], components: [row] })

                const enemyToAttack = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 }).catch(err => {});;
                if (!enemyToAttack) {
                  menuEmbed.setDescription('No enemy was chosen in time, skipping to next player...')
                  enemyToAttack.update({ embeds: [menuEmbed] })
                  currentTurn++
                  gameLoop(room)}
                await enemyToAttack.update({})
                attackDescription = room.players[currentTurn].attack3(room, parseInt(enemyToAttack.customId))
              } else if (dungeonMaster.dungeonData.classAttacks[room.players[currentTurn].class][2].ally) {

                const collectorFilter = i => i.user.id === room.players[currentTurn].id;
                const row = new ActionRowBuilder()
                room.players.forEach((enemy, i) => {

                const button = new ButtonBuilder()
                .setCustomId(`${i}`)
                .setLabel(enemy.name)
                .setStyle(ButtonStyle.Success)

                row.addComponents(button)

                })

                menuEmbed.setDescription('Choose the ally you want to heal!')
                await confirmation.update({ content: "", embeds: [menuEmbed], components: [row] })

                const enemyToAttack = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 }).catch(err => {});;
                if (!enemyToAttack) {
                  menuEmbed.setDescription('No enemy was chosen in time, skipping to next player...')
                  enemyToAttack.update({ embeds: [menuEmbed] })
                  currentTurn++
                  gameLoop(room)}
                await enemyToAttack.update({})
                attackDescription = room.players[currentTurn].attack3(room, parseInt(enemyToAttack.customId))

              } else {
                attackDescription = room.players[currentTurn].attack3(room)
              }
        }

        const endDungeon = dungeonMaster.checkForDeath(room)
          if (endDungeon) {
            dungeonsMessage.delete()
            const endImage = await dungeonMaster.endGame(dungeon)

            menuEmbed.setDescription('All players are dead. Here are the spoils of your run')

            message.channel.send({ files: [endImage], embeds: [menuEmbed] })
            return
          }


        collectorFilter = i => i.user.id;

        if (room.enemies?.length < 1) {
          menuEmbed.setDescription('All enemies defeated!')
          await dungeonsMessage.edit({ embeds: [menuEmbed], components: [continueRow], files: [] })

          const confirmationContinue = await dungeonsMessage.awaitMessageComponent({ filter: (i => true), time: 60000 })
            .catch(err => console.error(err));
          if (confirmationContinue) {
            confirmationContinue.update({})
          }

          currentRoom++
          let newRoom;
          if (currentRoom > 4) {
            dungeonsMessage.delete()
            dungeon.generateRoom() //this is so you get max loot
            const endImage = await dungeonMaster.endGame(dungeon)
            menuEmbed.setDescription('Congrats! You successfuly raided the dungeon. Here are your spoils:')
            message.channel.send({ files: [endImage], embeds: [menuEmbed] })
            return
          }
          if (currentRoom > 3) {
            newRoom = dungeon.generateBossRoom()
            currentTurn = 0
            gameLoop(newRoom)
            return
          }
          newRoom = dungeon.generateRoom()
          currentTurn = 0
          gameLoop(newRoom)
          return
        }
        const attachmentUpdated = await room.generateImage()

        menuEmbed.setDescription(attackDescription)
        await dungeonsMessage.edit({ embeds: [menuEmbed], components: [continueRow], files: [attachmentUpdated] })

        const confirmationContinue = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 })
          .catch(err => {});;
        if (confirmationContinue) {
          await confirmationContinue.update({})
        }

        currentTurn++
        //enemy ai
        if (currentTurn > (room.players.length - 1)) {
          let enemyAttackDescription = ``

          room.enemies.forEach((enemy) => {
            const textToAdd = enemy.attack(room)
            enemyAttackDescription = enemyAttackDescription+textToAdd+'\n'
          })

        const endDungeon = dungeonMaster.checkForDeath(room)
          if (endDungeon) {
            dungeonsMessage.delete()
            const endImage = await dungeonMaster.endGame(dungeon)

            menuEmbed.setDescription('All players are dead. Here are the spoils of your run')

            message.channel.send({ files: [endImage], embeds: [menuEmbed] })
            return
          }

          const attachmentUpdatedAgain = await room.generateImage()

          menuEmbed.setDescription(enemyAttackDescription)
          await dungeonsMessage.edit({ embeds: [menuEmbed], components: [continueRow], files: [attachmentUpdatedAgain] })
          let collectorFilter = i => i.user.id;

          const confirmationContinue = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 })
            .catch(err => {});
          if (confirmationContinue) {
            confirmationContinue.update({})
          }

          currentTurn = 0
        }

        gameLoop(room)


      }
    }


  } else {

    //settings/data

    myDungeonsData = await db.get(message.author.id+'.dungeons') 
    menuEmbed.setDescription(
      `--= Settings =--
      Level: ${myDungeonsData.level}
      XP: ${myDungeonsData.xp}
      XP till next level: ${myDungeonsData.xpTillNextLevel}
      Class: ${myDungeonsData.xpTillNextLevel}

      Change Class:`
    )
    await response.update({ content: "", embeds: [menuEmbed], components: [] })
    const response2 = await askButton([{ id: "backdungeons", label: "Back" }, { id: "fighter", label: "Fighter" }, { id: "wizard", label: "Wizard" }, { id: "paladin", label: "Paladin" }, { id: "cleric", label: "Cleric" }], dungeonsMessage)

    if (!response2) {
        dungeonsMessage.delete()
        message.reply('**<:AgnabotX:1153460434691698719> ||** ok. don\'t reply then.')
        return}
    if (response2.customId == "backdungeons") {
      await response2.update('**<a:AgnabotLoading:1155973084868784179> ||** loading...')
      menuBuilder()
    } else {
      await response2.update('**<a:AgnabotLoading:1155973084868784179> ||** loading...')
      await db.set(message.author.id+'.dungeons.class', response2.customId)
      menuBuilder()
    }
  }

  }

}


//@params
//array[string] options
//Message dungeonsMessage
async function askButton(options, dungeonsMessage) {

  let buttons = [];

  options.forEach((options) => {
    const button = new ButtonBuilder()
    .setCustomId(options.id)
    .setLabel(options.label)
    .setStyle(ButtonStyle.Success)

    buttons.push(button)
  })

  const row = new ActionRowBuilder()
  buttons.forEach((button) => {
    row.addComponents(button)
  })

  dungeonsMessage.edit({
    components: [row]  
  })

  const collectorFilter = i => i.user.id === dungeonsMessage.mentions.users.first().id

  try {
    const collected = await dungeonsMessage.awaitMessageComponent({ filter: collectorFilter, time: 60000 });

    return collected
  } catch (e) {
    console.error(e)
    return undefined
  }

}

module.exports = dungeons