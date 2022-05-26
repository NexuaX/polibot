const client = require("../main");
const {prefix} = require("../config.json");
const {MessageEmbed} = require("discord.js");

module.exports = {
    name: "help",
    description: "wyświetla to okno",
    details: "wyświetla okno z informacjami o dostępnych komendach jak i ich detalach",
    usage: `\`${prefix} help [<command_name>]\``,
    execute: commandHandler
}

function commandHandler(message, args) {

    const [, subcommand] = args;

    if (!subcommand) {

        let generatedDescription = "";
        let index = 1;

        for (const [, command] of client.commands) {
            generatedDescription += `\`${command.name}\` - ${command.description}\n`
        }

        const embed = new MessageEmbed()
            .setTitle("Dostęne komendy")
            .setAuthor({name: client.user.username})
            .setThumbnail(client.user.avatarURL())
            .setDescription(generatedDescription)
            .addField("Więcej", `Aby poznać szczegóły napisz \`${prefix} help <command_name>\``)
            .setColor("ORANGE")

        message.channel.send({embeds: [embed]});

    } else {

        const command = client.commands.get(subcommand);

        if (!command) {
            message.channel.send(`Komenda ${subcommand} nie istnieje.`);
            return;
        }

        const embed = new MessageEmbed()
            .setTitle(subcommand)
            .setAuthor({name: client.user.username})
            .setThumbnail(client.user.avatarURL())
            .setDescription(command.details)
            .addField("Użycie", command.usage)
            .setColor("ORANGE")

        message.channel.send({embeds: [embed]});

    }

}