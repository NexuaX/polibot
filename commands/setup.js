const {MessageEmbed} = require("discord.js");
const {backend} = require("../config.json");
const fetch = require("node-fetch");
const client = require("../main");

const fruitEmoji = [
    "🍉", "🍊", "🍋", "🥭", "🍐", "🍑", "🥝", "🍓"
];

module.exports = {
    name: 'setup',
    description: "ustaw role i parametry serwera",
    async execute(message, args) {
        if (args[1] === "chairman") {

            const role = message.guild.roles.cache.find(role => role.name === "chairman");
            if (role) {
                const user = message.guild.members.cache.find(member => member.displayName === args[2]);
                if (user) {
                    user.roles.add(role);
                    message.channel.send(`Student ${user} dostał role ${role}`);
                } else {
                    message.channel.send("Nie ma takiego usera.");
                }
            } else {
                message.channel.send("Najpierw utwórz role.");
            }

        } else if (args[1] === "server") {

            const data = {
                guild_id: message.guildId,
                faculty: args[2],
                year: args[3],
                department: args[4],
            };

            const response = await fetch(backend + "/setupServer", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const jsonResponse = await response.json();

            if (jsonResponse.code === '200') {
                message.channel.send("Success.");
            } else {
                message.channel.send("Failed.");
            }

        } else if (args[1] === "groups") {

            const groupsStringArray = [];
            for (let i = 2; i < args.length; i++) {
                groupsStringArray.push(`${fruitEmoji[i - 2]} : - ${args[i]}`);
            }
            const groupsString = groupsStringArray.join("\n\n");

            const groupsEmbed = new MessageEmbed()
                .setColor("GREEN")
                .setTitle("Wybierz swoją grupe!")
                .setDescription("Ustawienie grupy pozoli Ci korzystać z wielu funkcjonalności bota")
                .addField("\u200b", groupsString);

            const data = {
                guild_id: message.guildId,
                message_id: "",
                roles: []
            };

            const sendMessage = await message.channel.send({embeds: [groupsEmbed]});

            data.message_id = sendMessage.id;
            for (let i = 0; i < args.length - 2; i++) {
                const reaction = await sendMessage.react(fruitEmoji[i]);
                data.roles.push({
                    role_name: args[i + 2],
                    emoji_name: reaction.emoji.name
                });
            }

            const response = await fetch(backend + "/setupGroups", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            const jsonResponse = await response.json();

            if (jsonResponse.code === '200') {
                message.channel.send("Success.");
                client.globals.roleReactionMessage.set(sendMessage.guildId, sendMessage.id);
            } else {
                message.channel.send("Failed.");
            }

        }
    }
}