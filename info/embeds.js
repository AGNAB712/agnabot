  const { EmbedBuilder } = require('discord.js');

  const funEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: 'a.addcategory', value: `suggests something for the random selection of category names \n once a message reaches 5 thumbs ups it is added` },
    { name: 'a.say', value: `makes agnabot say whatever... \n formatted as a.say text` },
    { name: 'a.sb/a.speechbubble', value: `gets a random speechbubble from agnabs collection (why does he have so many)` },
    { name: 'a.autoresponses/a.ar', value: `gives a list of agnabot's automatic responses` },
    { name: 'a.showcategories', value: `shows the possible category names from agnabot to pick from` },
    { name: 'a.mean', value: 'He will never be mean!' },
    { name: 'a.tts', value: `sends a tts message using agnabot (requires a tts pass which you can buy)` },
    { name: 'a.fart', value: `farts in vc STINKY` },
    { name: 'a.furry', value: `gets a random furry image` },
    { name: 'a.impersonate', value: `impersonate a person \nformatted as a.impersonate @(user)/user id (text)` },
    { name: 'a.fsb/a.furryspeechbubble', value: `basically the furry command but adds a speechbubble thing on it` },
    { name: 'a.fight', value: `you can fight someone :      )` },
    { name: 'a.quote', value: `quotes someones message` },
  )

const utilityEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: 'a.invite', value: 'gives the invite link' },
    { name: 'a.timer', value: `timer/reminder command, formatted as "a.timer hours minutes seconds" \n optionally you can add a reminder by typing in a one string phrase at the end starting with "-"` },
    { name: 'a.toggleautoreact', value: `toggles agnabot reacting to your messages when someone else reacts to it` },
    { name: 'a.convert/a.freedomunits/a.fu', value: `converts things in the metric system to imperial system and back \nformatted as a.convert (amount) (from, always plural) (to, always plural)\nan example would be a.fu 10 miles kilometers"` },
    { name: 'a.credits', value: `gives the credits for agnabot` },
    { name: 'a.define', value: `defines something from urban dictionary\nformatted as "a.define (phrase)"` },
    { name: 'a.calculator', value: `parses mathematical expressions (So Mathematical!)` },
    { name: 'a.stats', value: 'views your agnabot stats'}
  )

let statEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('AGNABOT STATS')

const bankEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: 'a.bal/a.balance', value: 'gives the balance of whoever you ping\nformatted as a.bal @(user)' },
    { name: 'a.work', value: `gives you some money! (can only be done once every minute, between 50 and 100 agnabucks)` },
    { name: 'a.redeem', value: `gives you money based off your level roles starting at level 10\nlvl 10 is 20, level 15 is 30, level 25 is 50, level 35 is 75, and level 50 is 100` },
    { name: 'a.don/a.doubleornothing', value: `either doubles or takes your money\nformatted as a.don (amount of money to wager)` },
    { name: 'a.buy', value: `buys something from the shop` },
    { name: 'a.donate', value: `donates money to someone\nformatted as a.donate @(user)` },
    { name: 'a.rng', value: `generates a random number, if your number is the one it generates you gain 30 agnabucks\nformatted as "a.rng (number 1-5)"` },
    { name: 'a.balimage', value: `sets your a.balance image to your image` },
  )

const adminEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: 'a.lockdown', value: 'locks down agnabots responses in case of abuse' },
    { name: 'a.unlockdown', value: 'stops lockdown' },
    { name: 'a.setstatus', value: `sets status obv\nformatted as a.setstatus (status)` },
    { name: 'a.forcecategory', value: 'forces a possible category name \n formatted as a.forcecategory (category name)' },
    { name: 'a.deletecategory', value: `deletes a category from the list \n formatted as a.deletecategory (category index)` },
    { name: 'a.setmoney', value: `sets a persons money\nformatted as a.setmoney @(user)` },
    { name: 'a.locksay', value: `locks a persons say command \n formatted as a.locksay @(user)` },
  )

const hotelEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: 'a.hotel buy', value: 'buys a hotel room' },
    { name: 'a.hotel name/rename', value: 'rename your hotel room' },
    { name: 'a.hotel description', value: `sets the description of your hotel room` },
    { name: 'a.hotel public', value: 'sets your hotel to be public' },
    { name: 'a.hotel private', value: `sets your hotel to be private` },
    { name: 'a.hotel invite', value: `invites someone to your hotel if it is private` },
    { name: 'a.hotel remove', value: `removes someone from your hotel if it is private` },
    { name: 'a.hotel lock', value: `makes it so you are the only one who can send messages in your hotel` },
    { name: 'a.hotel unlock', value: `makes it so everyone can send messages again` },
  )

const petEmbed = new EmbedBuilder()
  .setColor('Green')
  .setTitle('Command List')
  .setAuthor({ name: 'AGNABOT', iconURL: 'https://media.discordapp.net/attachments/831714424658198532/1108080081106116759/ALCwGrbxStSvAAAAAElFTkSuQmCC.png'})
  .addFields(
    { name: 'a.pet', value: 'views your pet' },
    { name: 'a.pet buy', value: 'buys a pet (1000 agnabucks)' },
    { name: 'a.pet disown', value: `disowns your pet` },
    { name: 'a.pet image', value: 'sets your pets image' },
    { name: 'a.pet name', value: `renames your pet` },
    { name: 'a.pet background', value: `sets the background of your pet to an image` },
  )

module.exports = {
  funEmbed,
  utilityEmbed,
  bankEmbed,
  adminEmbed,
  hotelEmbed,
  petEmbed,
  statEmbed
};

