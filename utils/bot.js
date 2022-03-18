const Discord = require("discord.js");
const ytdl = require("ytdl-core");

const config = require("../config.json");

const client = new Discord.Client();

let connection;
let channel;
let dispatcher;

client.login(config.token);

async function join(channelId) {
  channel = await client.channels.fetch(channelId);

  if (channel) {
    connection = await channel.join();
  }
}

function leave() {
  if (!channel) {
    return;
  }

  channel.leave();
  channel = null;
}

function play(youtubeHash) {
  if (!connection) {
    return;
  }

  dispatcher = connection.play(
    ytdl(`https://www.youtube.com/watch?v=${youtubeHash}`, {
      filter: "audioonly",
    })
  );
}

function pause() {
  if (!dispatcher || dispatcher.destroyed || dispatcher.paused) {
    return;
  }

  dispatcher.pause();
}

function resume() {
  if (!dispatcher || dispatcher.destroyed || !dispatcher.paused) {
    return;
  }

  dispatcher.resume();
}

function stop() {
  if (!dispatcher || dispatcher.destroyed) {
    return;
  }

  dispatcher.destroy();
}

module.exports = { join, leave, play, pause, resume, stop };
