const {backend, prefix} = require('../config.json');
const fetch = require("node-fetch");

module.exports = {
    name: 'reminder',
    description: "przypominam o ustalonych sprawach",
    details: "system cyklicznego przypominania o dowolnych sprawach, " +
        "w miarę możliwości przypominam wszystkim lub konkretnej grupie " +
        "o danym wydarzeniu 3 razy (kolejno 7, 3, 1 dni przed)\n\n" +
        "czas podajemy w formacie `yyyy-mm-ddThh:mm`\n" +
        "wiadomość przypomnienia podaje się w następnej wiadomości (poproszę o nią)\n" +
        "aby usunąć przypomnienie należy podać id, zwracane przy tworzeniu\n\n" +
        `np. \`${prefix} reminder add kolowkium @grupa2 2022-04-25T14:45 #ogloszenia\``,
    usage: `\`${prefix} reminder add <name> <@grupa|everyone> <deadline> <#channel>\`\n` +
        `\`${prefix} reminder delete <id>\``,
    execute: commandHandler
}

async function commandHandler(message, args) {

    // usunięcie nazwy komendy z listy
    args.shift();

    const subcommand = args[0];

    if (subcommand === "add") {

        if (args.length !== 5) {
            message.channel.send("Niepoprawna liczba argumentów.");
            return;
        }

        const [ , name, who, deadline, channel ] = args;

        const data = {
            guild_id: message.guildId,
            name: name,
            who: "",
            deadline: deadline,
            channel: message.mentions.channels.first().id,
            message: ""
        };

        data.who = message.mentions.everyone ? message.guild.roles.everyone.id : message.mentions.roles.first().id;

        if (!data.who) {
            message.channel.send("Wspomnij odpowiedni obiekt.");
            return;
        }

        message.reply("Teraz podaj wiadomość przypomnienia. (60s)");

        const filter = (collected) => {
            return collected.author.id === message.author.id;
        };

        const collector = message.channel.createMessageCollector({
            filter,
            max: 1,
            time: 1000*60
        });

        collector.on("end", async (collected) => {
            const collectedMessage = collected.first();
            if (!collectedMessage) {
                message.reply("Timeout.");
                return;
            }

            data.message = collectedMessage.content;

            // select to_char(timestamp '2022-04-20T14:45', 'DD/MM/YYYY HH24:MI')

            const response = await fetch(backend + '/setReminder', {
                method: "POST",
                body: JSON.stringify(data)
            }).then(response => {
                return response.json()
            }).catch(() => {
                return {
                    code: "-1",
                    response: {}
                }
            });

            if (response.code === "200") {
                message.reply(`Przypomnienie ustawione. \`id: ${response.response.reminder_id}\``);
            } else {
                message.reply("Failed. " + response.code);
            }
        });

    } else if (subcommand === "delete") {

        const id = args[1];

        if (!id) {
            message.channel.send("Brak id przypomnienia do usunięcia. `reminder delete <id>`");
            return;
        }

        const data = {
            guild_id: message.guildId,
            reminder_id: id
        }

        const response = await fetch(backend + '/deleteReminder', {
            method: "POST",
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).catch(() => {
            return {
                code: "-1",
                response: {}
            }
        });

        if (response.code === "200") {
            message.reply(`Przypomnienie usunięte.`);
        } else {
            message.reply("Failed. " + response.code);
        }

    } else {
        message.channel.send(`Nieznana podkomenda \`${subcommand}\``);
    }

}