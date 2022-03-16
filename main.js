const Discord = require("discord.js");
const Config = require("./config");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"] });
const prefix = "#polibot ";

client.once("ready", () => {
    console.log("Melduje sie!");
});

client.on("message", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).split(/ +/);
    const command = args.shift().toLocaleLowerCase();

    if (command === "czołem") {
        message.channel.send("kolanem!");
    }
});

client.login(Config.token);

