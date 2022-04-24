const client = require("../main");
const {backend} = require("../config.json");
const fetch = require("node-fetch");
const {MessageEmbed} = require("discord.js");

client.once("ready", () => {

    // TODO wczytanie z bazy przypomnień
    const checkForRemainders = async () => {

        console.log("Sprawdzam czy mam coś do przypomnienia ...");

        for (const [snowflake, guild] of client.guilds.cache) {
            const data = {
                guild_id: snowflake
            }

            const response = await fetch(backend + "/getReminders", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const responseData = await response.json();

            if (responseData.code !== "200") {
                console.log("Reminders fetch error!");
                console.log(response);
                break;
            }

            if (responseData.response.reminders.length === 0) {
                console.log("No remidners to print!");
                break;
            }

            printReminders(responseData.response, guild);
        }

        // pętla wywołania co minutę
        setTimeout(checkForRemainders, 1000 * 60);
    };

    checkForRemainders();
});

async function printReminders(data, guild) {

    for (const reminder of data.reminders) {
        const date = new Date(reminder.deadline);
        const dateString = date.toLocaleString().slice(0, -3);

        const role = await guild.roles.fetch(reminder.who);

        const message = `Przypomnienie dla ${role}`;

        const reminderEmbed = new MessageEmbed()
            .setColor("RED")
            .setTitle(reminder.name.toUpperCase())
            .setDescription(reminder.message)
            .addField("Data", dateString);

        const channel = await guild.channels.fetch(reminder.channel);
        await channel.send({content: message ,embeds: [reminderEmbed]});
    }

}