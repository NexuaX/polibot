const client = require("../main");
const {prefix} = require("../config.json");

client.on("messageCreate", message => {
    if (message.author.bot) return;
    if (message.content.includes("@here") || message.content.includes("@everyone") || message.type === "REPLY") return false;

    if (message.mentions.has(client.user.id)) {
        message.channel.send(`Aby poznać moje komendy napisz \`${prefix} help\``);
    }
});