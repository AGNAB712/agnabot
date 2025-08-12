const Canvas = require('@napi-rs/canvas');
const { AttachmentBuilder } = require('discord.js')
const fs = require("fs")
const path = require("path")
const { promises } = require('node:fs')

const pfpPositionOffsets = {
  paladin: [73, 0],
  cleric: [73, 5],
  fighter: [67, -10],
  wizard: [73, -15]
}

Canvas.GlobalFonts.registerFromPath('./fonts/FiraSansCondensed-Bold.ttf', 'fira')

async function roomImage(room) {

  const canvas = Canvas.createCanvas(750, 500);
  const context = canvas.getContext('2d');

  const background = await Canvas.loadImage(room.backgroundImage);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);


  //i would use a foreach loop for this but it doesnt work for some fucking reason???

  let pos;
  let player;
  let enemy

  if (room.players[2]) {
    pos = [540, 300]
    player = room.players[2]

    const classImage1 = await Canvas.loadImage(`./images/dungeons/classes/${player.class}.png`);
    context.drawImage(classImage1, pos[0], pos[1], 151, 157);

    const avatar = await Canvas.loadImage(player.pfpUrl)
    drawPfp(context, avatar, pos[0] + pfpPositionOffsets[player.class][0], pos[1] + pfpPositionOffsets[player.class][1], 45)
  }

  if (room.players[1]) {
    pos = [470, 300]
    player = room.players[1]

    const classImage1 = await Canvas.loadImage(`./images/dungeons/classes/${player.class}.png`);
    context.drawImage(classImage1, pos[0], pos[1], 151, 157);

    const avatar = await Canvas.loadImage(player.pfpUrl)
    drawPfp(context, avatar, pos[0] + pfpPositionOffsets[player.class][0], pos[1] + pfpPositionOffsets[player.class][1], 45)
  }

  pos = [400, 300]
  player = room.players[0]

  const classImage1 = await Canvas.loadImage(`./images/dungeons/classes/${player.class}.png`);
  context.drawImage(classImage1, pos[0], pos[1], 151, 157);

  const avatar = await Canvas.loadImage(player.pfpUrl)
  drawPfp(context, avatar, pos[0] + pfpPositionOffsets[player.class][0], pos[1] + pfpPositionOffsets[player.class][1], 45)





  const enemyNameKey = require(`../../images/dungeons/dungeon_assets/${room.name}/key.json`)

  pos = [250, enemyNameKey.yOffset]
  enemy = room.enemies[0]

  if (enemy.class == "boss") {
    pos = [0, 100]
  }

  const enemyImage = await Canvas.loadImage(enemy.image);
  context.drawImage(enemyImage, pos[0], pos[1], enemyImage.width, enemyImage.height);

  pos[0] = pos[0] - enemyImage.width

  if (room.enemies[1]) {
    enemy = room.enemies[1]

    const enemyImage = await Canvas.loadImage(enemy.image);
    context.drawImage(enemyImage, pos[0], pos[1], enemyImage.width, enemyImage.height);

    pos[0] = pos[0] - enemyImage.width
  }

  if (room.enemies[2]) {
    enemy = room.enemies[2]

    const enemyImage = await Canvas.loadImage(enemy.image);
    context.drawImage(enemyImage, pos[0], pos[1], enemyImage.width, enemyImage.height);

    pos[0] = pos[0] - enemyImage.width
  }


  drawInformation(context, room)


  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'dungeon.png' });
  return attachment;

}

async function statsRoomImage(room) {

  const canvas = Canvas.createCanvas(750, 500);
  const context = canvas.getContext('2d');

  const background = await Canvas.loadImage(room.backgroundImage);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  let playerPosition = [25, 25]

  context.lineWidth = 3;
  context.strokeStyle = 'white'
  context.fillStyle = 'rgba(0, 0, 0, 0.6)'
  context.fillRect(playerPosition[0], playerPosition[1], (750/2)-50, 250-25)
  context.strokeRect(playerPosition[0], playerPosition[1], (750/2)-50, 250-25)

  context.font = 'bold 20px Arial';
  context.fillStyle = 'white'
  context.lineWidth = 2;
  context.strokeStyle = 'black'
  context.strokeText(room.players[0].name, playerPosition[0] + 10, playerPosition[1] + 25)
  context.fillText(room.players[0].name, playerPosition[0] + 10, playerPosition[1] + 25)

  context.fillStyle = 'green'
  context.strokeStyle = 'white'
  context.lineWidth = 1;
  context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.players[0].health/room.players[0].maxHealth)*((750/3)-100), 15)
  context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

  context.font = 'bold 15px Arial';
  context.fillStyle = 'white'
  context.lineWidth = 2;
  context.strokeStyle = 'black'
  context.strokeText(`${room.players[0].health}/${room.players[0].maxHealth} - Level ${room.players[0].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  context.fillText(`${room.players[0].health}/${room.players[0].maxHealth} - Level ${room.players[0].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)

  if (room.players[1]) {
    playerPosition = [25, 75]

    context.font = 'bold 20px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(room.players[1].name, playerPosition[0] + 10, playerPosition[1] + 25)
    context.fillText(room.players[1].name, playerPosition[0] + 10, playerPosition[1] + 25)

    context.fillStyle = 'green'
    context.strokeStyle = 'white'
    context.lineWidth = 1;
    context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.players[1].health/room.players[1].maxHealth)*((750/3)-100), 15)
    context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

    context.font = 'bold 15px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${room.players[1].health}/${room.players[1].maxHealth} - Level ${room.players[1].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
    context.fillText(`${room.players[1].health}/${room.players[1].maxHealth} - Level ${room.players[1].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  }

  if (room.players[2]) {
    playerPosition = [25, 125]

    context.font = 'bold 20px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(room.players[2].name, playerPosition[0] + 10, playerPosition[1] + 25)
    context.fillText(room.players[2].name, playerPosition[0] + 10, playerPosition[1] + 25)

    context.fillStyle = 'green'
    context.strokeStyle = 'white'
    context.lineWidth = 1;
    context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.players[1].health/room.players[1].maxHealth)*((750/3)-100), 15)
    context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

    context.font = 'bold 15px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${room.players[2].health}/${room.players[2].maxHealth} - Level ${room.players[2].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
    context.fillText(`${room.players[2].health}/${room.players[2].maxHealth} - Level ${room.players[2].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  }

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'dungeon.png' });
  return attachment;

} 

async function lootRoomImage(dungeon, loot) {

  const canvas = Canvas.createCanvas(750, 500);
  const context = canvas.getContext('2d');

  const background = await Canvas.loadImage(`./images/dungeons/dungeon_assets/${dungeon.name}/background.png`);
  context.drawImage(background, 0, 0, canvas.width, canvas.height);

  let playerPosition = [25, 25]

  context.lineWidth = 3;
  context.strokeStyle = 'white'
  context.fillStyle = 'rgba(0, 0, 0, 0.6)'
  context.fillRect(playerPosition[0], playerPosition[1], 750-50, 500-50)
  context.strokeRect(playerPosition[0], playerPosition[1], 750-50, 500-50)

  context.font = 'bold 20px Arial';
  context.fillStyle = 'white'
  context.lineWidth = 2;
  context.strokeStyle = 'black'
  context.strokeText(`All players get:`, playerPosition[0] + 10, playerPosition[1] + 25)
  context.fillText(`All players get:`, playerPosition[0] + 10, playerPosition[1] + 25)

  const copperTreasure = await Canvas.loadImage(`./images/dungeons/copper_treasure.png`);
  context.drawImage(copperTreasure, playerPosition[0] + 10, playerPosition[1] + 50, 50, 50);
  context.strokeText(`x${loot.copper * dungeon.lootLevel} Copper`, playerPosition[0] + 70, playerPosition[1] + 75)
  context.fillText(`x${loot.copper * dungeon.lootLevel} Copper`, playerPosition[0] + 70, playerPosition[1] + 75)

  const silverTreasure = await Canvas.loadImage(`./images/dungeons/silver_treasure.png`);
  context.drawImage(silverTreasure, playerPosition[0] + 10, playerPosition[1] + 100, 50, 50);
  context.strokeText(`x${loot.silver * dungeon.lootLevel} Silver`, playerPosition[0] + 70, playerPosition[1] + 125)
  context.fillText(`x${loot.silver * dungeon.lootLevel} Silver`, playerPosition[0] + 70, playerPosition[1] + 125)

  const goldTreasure = await Canvas.loadImage(`./images/dungeons/gold_treasure.png`);
  context.drawImage(goldTreasure, playerPosition[0] + 10, playerPosition[1] + 150, 50, 50);
  context.strokeText(`x${loot.gold * dungeon.lootLevel} Gold`, playerPosition[0] + 70, playerPosition[1] + 175)
  context.fillText(`x${loot.gold * dungeon.lootLevel} Gold`, playerPosition[0] + 70, playerPosition[1] + 175)

  context.strokeText(`+${(dungeon.rooms.length * 10) * (Math.floor(dungeon.level / 5) + 1)} xp`, playerPosition[0] + 10, playerPosition[1] + 225)
  context.fillText(`+${(dungeon.rooms.length * 10) * (Math.floor(dungeon.level / 5) + 1)} xp`, playerPosition[0] + 10, playerPosition[1] + 225)

  const attachment = new AttachmentBuilder(await canvas.encode('png'), { name: 'dungeon.png' });
  return attachment;

}

//@params
//link image
//num x
//num y
//num size
function drawPfp(context, avatar, x, y, size) {
  context.save();
  context.beginPath();
  context.arc(x+(size/2), y+(size/2), size/2, 0, Math.PI * 2, true);
  context.closePath();
  context.strokeStyle = 'white'
  context.lineWidth = 3;
  context.stroke();
  context.strokeStyle = 'black'
  context.lineWidth = 1;
  context.stroke();
  context.clip();
  context.drawImage(avatar, x, y, size, size);
  context.restore();
}



function drawInformation(context, room) {

  //players

  let playerPosition = [750/2, 25]

  context.lineWidth = 3;
  context.strokeStyle = 'white'
  context.fillStyle = 'rgba(0, 0, 0, 0.6)'
  context.fillRect(playerPosition[0], playerPosition[1], (750/2)-25, 175)
  context.strokeRect(playerPosition[0], playerPosition[1], (750/2)-25, 175)

  context.font = 'bold 20px Arial';
  context.fillStyle = 'white'
  context.lineWidth = 2;
  context.strokeStyle = 'black'
  context.strokeText(room.players[0].name, playerPosition[0] + 10, playerPosition[1] + 25)
  context.fillText(room.players[0].name, playerPosition[0] + 10, playerPosition[1] + 25)

  context.fillStyle = 'green'
  context.strokeStyle = 'white'
  context.lineWidth = 1;
  context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.players[0].health/room.players[0].maxHealth)*((750/3)-100), 15)
  context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

  context.font = 'bold 15px Arial';
  context.fillStyle = 'white'
  context.lineWidth = 2;
  context.strokeStyle = 'black'
  context.strokeText(`${room.players[0].health}/${room.players[0].maxHealth} - Level ${room.players[0].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  context.fillText(`${room.players[0].health}/${room.players[0].maxHealth} - Level ${room.players[0].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)

  if (room.players[1]) {
    playerPosition = [750/2, 75]

    context.font = 'bold 20px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(room.players[1].name, playerPosition[0] + 10, playerPosition[1] + 25)
    context.fillText(room.players[1].name, playerPosition[0] + 10, playerPosition[1] + 25)

    context.fillStyle = 'green'
    context.strokeStyle = 'white'
    context.lineWidth = 1;
    context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.players[1].health/room.players[1].maxHealth)*((750/3)-100), 15)
    context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

    context.font = 'bold 15px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${room.players[1].health}/${room.players[1].maxHealth} - Level ${room.players[1].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
    context.fillText(`${room.players[1].health}/${room.players[1].maxHealth} - Level ${room.players[1].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  }

  if (room.players[2]) {
    playerPosition = [750/2, 125]

    context.font = 'bold 20px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(room.players[2].name, playerPosition[0] + 10, playerPosition[1] + 25)
    context.fillText(room.players[2].name, playerPosition[0] + 10, playerPosition[1] + 25)

    context.fillStyle = 'green'
    context.strokeStyle = 'white'
    context.lineWidth = 1;
    context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.players[1].health/room.players[1].maxHealth)*((750/3)-100), 15)
    context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

    context.font = 'bold 15px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${room.players[2].health}/${room.players[2].maxHealth} - Level ${room.players[2].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
    context.fillText(`${room.players[2].health}/${room.players[2].maxHealth} - Level ${room.players[2].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  }






  //enemies

  const enemyNameKey = require(`../../images/dungeons/dungeon_assets/${room.name}/key.json`)

  playerPosition = [25, 25]


  context.lineWidth = 3;
  context.strokeStyle = 'white'
  context.fillStyle = 'rgba(0, 0, 0, 0.6)'
  context.fillRect(playerPosition[0], playerPosition[1], (750/2)-25, 175)
  context.strokeRect(playerPosition[0], playerPosition[1], (750/2)-25, 175)

  context.font = 'bold 20px Arial';
  context.fillStyle = 'white'
  context.lineWidth = 2;
  context.strokeStyle = 'black'
  context.strokeText(`${enemyNameKey[room.enemies[0].class]} - ${room.enemies[0].class}`, playerPosition[0] + 10, playerPosition[1] + 25)
  context.fillText(`${enemyNameKey[room.enemies[0].class]} - ${room.enemies[0].class}`, playerPosition[0] + 10, playerPosition[1] + 25)

  context.fillStyle = 'green'
  context.strokeStyle = 'white'
  context.lineWidth = 1;
  context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.enemies[0].health/room.enemies[0].maxHealth)*((750/3)-100), 15)
  context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

  context.font = 'bold 15px Arial';
  context.fillStyle = 'white'
  context.lineWidth = 2;
  context.strokeStyle = 'black'
  context.strokeText(`${room.enemies[0].health}/${room.enemies[0].maxHealth} - Level ${room.enemies[0].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  context.fillText(`${room.enemies[0].health}/${room.enemies[0].maxHealth} - Level ${room.enemies[0].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)

  if (room.enemies[1]) {
    playerPosition = [25, 75]


    context.font = 'bold 20px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${enemyNameKey[room.enemies[1].class]} - ${room.enemies[1].class}`, playerPosition[0] + 10, playerPosition[1] + 25)
    context.fillText(`${enemyNameKey[room.enemies[1].class]} - ${room.enemies[1].class}`, playerPosition[0] + 10, playerPosition[1] + 25)

    context.fillStyle = 'green'
    context.strokeStyle = 'white'
    context.lineWidth = 1;
    context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.enemies[1].health/room.enemies[1].maxHealth)*((750/3)-100), 15)
    context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

    context.font = 'bold 15px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${room.enemies[1].health}/${room.enemies[1].maxHealth} - Level ${room.enemies[1].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
    context.fillText(`${room.enemies[1].health}/${room.enemies[1].maxHealth} - Level ${room.enemies[1].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  }

  if (room.enemies[2]) {
    playerPosition = [25, 125]

    context.font = 'bold 20px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${enemyNameKey[room.enemies[2].class]} - ${room.enemies[2].class}`, playerPosition[0] + 10, playerPosition[1] + 25)
    context.fillText(`${enemyNameKey[room.enemies[2].class]} - ${room.enemies[2].class}`, playerPosition[0] + 10, playerPosition[1] + 25)

    context.fillStyle = 'green'
    context.strokeStyle = 'white'
    context.lineWidth = 1;
    context.fillRect(playerPosition[0] + 10, playerPosition[1] + 35, (room.enemies[2].health/room.enemies[2].maxHealth)*((750/3)-100), 15)
    context.strokeRect(playerPosition[0] + 10, playerPosition[1] + 35, (750/3)-100, 15)

    context.font = 'bold 15px Arial';
    context.fillStyle = 'white'
    context.lineWidth = 2;
    context.strokeStyle = 'black'
    context.strokeText(`${room.enemies[2].health}/${room.enemies[2].maxHealth} - Level ${room.enemies[2].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
    context.fillText(`${room.enemies[2].health}/${room.enemies[2].maxHealth} - Level ${room.enemies[2].level}`, playerPosition[0] + ((750/3)-85), playerPosition[1] + 48)
  }
}

module.exports = { roomImage, statsRoomImage, lootRoomImage }