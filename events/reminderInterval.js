const client = require("../main")
const {MessageEmbed} = require("discord.js");

client.once("ready", () => {

    // TODO wczytanie z bazy przypomnień
    const checkForRemainders = async () => {

        console.log("Sprawdzam czy mam coś do przypomnienia ...");

        for (const [snowflake, guild] of client.guilds.cache) {
            const data = {
                guild_id: snowflake
            }
            // fetch data
            // dummy
            const response = {
                "guild_id": "948547267319722026",
                "reminders": [
                    {
                        "name": "zadanie",
                        "who": "963364915106680892",
                        "when": "2022-04-20T10:45",
                        "where": "953775635422122015",
                        "message": "Kolokwium dla grupy 2 z baz danych, sala 132"
                    }
                ]
            }

            // EVERYONE TEST
            // const response = {
            //     "guild_id": "948547267319722026",
            //     "reminders": [
            //         {
            //             "name": "kolokwium",
            //             "who": "948547267319722026",
            //             "when": "2022-04-24T10:45",
            //             "where": "956844387810291802",
            //             "message": "Ale jazda"
            //         }
            //     ]
            // }

            printReminders(response, guild);
        }

        // pętla wywołania co minutę
        setTimeout(checkForRemainders, 1000 * 60);
    };

    // checkForRemainders();
});

async function printReminders(data, guild) {

    for (const reminder of data.reminders) {
        const date = new Date(reminder.when);
        const dateString = date.toLocaleString();

        const role = await guild.roles.fetch(reminder.who);

        const message = `Przypomnienie dla ${role}`;

        const reminderEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(reminder.name.toUpperCase())
            .setDescription(reminder.message)
            .addField("Data", dateString);

        const channel = await guild.channels.fetch(reminder.where);
        await channel.send({content: message ,embeds: [reminderEmbed]});
    }

}