const client = require("../main");
const {prefix} = require("../config.json");

client.on("messageCreate", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content.trim() === prefix.trim()) {
        message.reply(`Aby poznać moje komendy napisz \`${prefix} help\``)
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(args[0]);

    if (!command) {
        message.reply({content: `Nieznana komenda \`${args[0]}\`\nNapisz \`${prefix} help\` aby skorzystać z pomocy`});
    } else {
        command.execute(message, args);
    }
});