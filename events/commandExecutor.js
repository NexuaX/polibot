const client = require("../main");
const {prefix} = require("../config.json");

client.on("messageCreate", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(args[0]);

    if (!command) {
        message.reply({content: `Nieznana komenda \`${args[0]}\``, ephemeral: true});
    } else {
        command.execute(message, args);
    }
});