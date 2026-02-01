const Discord = require('discord.js');
const { PermissionsBitField, EmbedBuilder, AttachmentBuilder, WebHookClient } = require('discord.js')
const { exec } = require('child_process');
const { QuickDB } = require("quick.db");
const { getGlobalVar, setGlobalVar } = require('../../info/editGlobalJson.js')
const { hasArtifact, getRandomInt, isNumeric, validUserId } = require('../../info/generalFunctions.js')
const { workArray } = require('../../info/agnabot_work_texts.js')
const db = new QuickDB();
const { joinVoiceChannel, createAudioPlayer, createAudioResource, getVoiceConnection, AudioPlayerStatus, VoiceConnectionStatus, entersState, NoSubscriberBehavior } = require('@discordjs/voice');
const voice = require('@discordjs/voice');

const player = new createAudioPlayer();

async function fart(message, args, bot, client) {
    if (message.member.voice.channel) {
      const voiceChannel = message.member.voice.channel;
      const connection = await joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
      });

    const streamOptions = {
      seek: 0,
      volume: 0.9,
      bitrate: 'auto',
      passes: 3,
      quality: 'highestaudio',
    }

    setTimeout(async () => {
    const resource = await createAudioResource('./audio/peak.mp3');
    subscription = await connection.subscribe(player);
    const dispatcher = player.play(resource);
    }, 1000);

    player.addListener("stateChange", async (oldOne, newOne) => {

    if (newOne.status == "idle") {
      try {
      const gid = message.guild.id
      player.stop();
      voice.getVoiceConnection(gid).disconnect();
      getVoiceConnection(gid).destroy();
      } catch (error) {
        console.error(error)
      }
    }

  });

    } else {
      // Send a message if the user is not in a voice channel
      message.reply("**<:AgnabotX:1153460434691698719> ||** You need to be in a voice channel to fart!");
    }
}

module.exports = fart