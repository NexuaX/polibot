const client = require("../main");
const {prefix} = require("../config.json");

client.on("messageCreate", message => {
    // TODO: usunąć w produkcji xD
    if (message.content.startsWith("ez?")) message.reply("ez.");

    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(args[0]);

    if (!command) {
        message.reply({content: '? Nie rozumiem.', ephemeral: true});
    } else {
        command.execute(message, args);
    }
});