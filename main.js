const Discord = require("discord.js");
const { token, prefix } = require("./config.json");
const fs = require("fs");

const client = new Discord.Client({intents: ["GUILDS", "GUILD_MESSAGES"] });

client.once("ready", () => {
    console.log("Melduje sie!");
});

// wczytanie komend
client.commands = new Discord.Collection();
const commandFiles = fs.readdirSync("./commands").filter(file => file.endsWith(".js"));
for (const file of commandFiles) {
    const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
}

// obsługa wpisanych komend
client.on("messageCreate", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(args[0]);

    if (!command) {
        message.reply({content: '? Nie rozumiem.', ephemeral: true});
    } else {
        command.execute(message, args);
    }

});

client.login(token);
