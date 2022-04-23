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

    const [ name, who, when, where ] = args;

    const whenDate = new Date(when);

    const data = {
        guild_id: message.guildId,
        name: name,
        who: "",
        when: when,
        where: message.mentions.channels.first().id,
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
        message.reply("Przypomnienie ustawione.");

        // TODO usunąć w produkcji
        message.channel.send("```json\n" + JSON.stringify(data, null, 2) + "\n```");
    });

}