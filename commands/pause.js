const { canModifyQueue, STAY_TIME } = require("../util/Util");
const i18n = require("../util/i18n");

module.exports = {
  name: "pause",
  description: i18n.__("pause.description"),
  execute(message) {
    const queue = message.client.queue.get(message.guild.id);
    if (!queue) return message.reply(i18n.__("pause.errorNotQueue")).catch(console.error);
    if (!canModifyQueue(message.member)) return i18n.__("common.errorNotChannel");

    if (queue.playing) {
      queue.playing = false;
      queue.connection.dispatcher.pause();
	  setTimeout(function () {
        if (queue.playing || !message.guild.me.voice.channel) return;
        queue.channel.leave();
        queue.textChannel.send(i18n.__("play.leaveChannel"));
      }, STAY_TIME * 1000);
      return queue.textChannel
        .send(i18n.__mf("pause.result", { author: message.author }))
        .catch(console.error);
    }
  }
};
