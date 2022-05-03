const {backend} = require('../config.json');
const fetch = require("node-fetch");

module.exports = {
    name: 'reminder',
    description: "pomagam przypomnieć o różnych sprawach",
    usage: "name who when where(channel)",
    execute: commandHandler
}

async function commandHandler(message, args) {

    // usunięcie nazwy komendy z listy
    args.shift();

    if (args.length !== 4) {
        message.channel.send("Niepoprawna liczba argumentów.");
        return;
    }

    const [ name, who, deadline, channel ] = args;

    const deadlineDate = new Date(deadline);

    const data = {
        guild_id: message.guildId,
        name: name,
        who: "",
        deadline: deadline,
        channel: message.mentions.channels.first().id,
        message: ""
    };

    data.who = message.mentions.everyone ? message.guild.roles.everyone.id : message.mentions.roles.first().id;

    message.reply("Teraz podaj wiadomość przypomnienia.");

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

        // TODO wysłanie do bazy
        // select to_char(timestamp '2022-04-20T14:45', 'DD/MM/YYYY HH24:MI')

        const response = await fetch(backend + '/setReminder', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });

        const responseData = await response.json();

        if (responseData.code === "200") {
            message.reply("Przypomnienie ustawione.");
        } else {
            message.reply("Failed.");
        }

        // TODO usunąć w produkcji
        message.channel.send("```json\n" + JSON.stringify(data, null, 2) + "\n```");
    });

}