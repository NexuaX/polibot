const client = require("../main");
const {reminders_switch, backend} = require("../config.json");
const fetch = require("node-fetch");
const {MessageEmbed} = require("discord.js");
const imageUrls = require("../assets/urls.json");

client.once("ready", () => {

    const checkForRemainders = async () => {

        console.log("Sprawdzam czy mam coś do przypomnienia ...");

        for (const [snowflake, guild] of client.guilds.cache) {
            const data = {
                guild_id: snowflake
            }

            const response = await fetch(backend + "/getReminders", {
                method: "POST",
                body: JSON.stringify(data)
            }).then(response => {
                return response.json();
            }).catch(() => {
                return {
                    code: "-1",
                    response: {}
                }
            });

            if (response.code !== "200") {
                console.log("Reminders fetch error!");
                console.log(response);
                break;
            }

            if (response.response.reminders.length === 0) {
                console.log("No remidners to print!");
                break;
            }

            await printReminders(response.response, guild);
        }

        // pętla wywołania co minutę
        setTimeout(checkForRemainders, 1000 * 60);
    };

    if (reminders_switch === "on")
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
            .addField("Data", dateString)
            .setThumbnail(imageUrls.reminderIcon);

        const channel = await guild.channels.fetch(reminder.channel);
        await channel.send({content: message ,embeds: [reminderEmbed]});
    }

}