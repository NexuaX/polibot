const {MessageEmbed} = require("discord.js");
const {backend, prefix} = require("../config.json");
const fetch = require("node-fetch");
const client = require("../main");

const fruitEmoji = [
    "🍉", "🍊", "🍋", "🥭", "🍐", "🍑", "🥝", "🍓"
];

module.exports = {
    name: 'setup',
    description: "ustawienia serwera (rocznik, grupy, starosta)",
    details: "przeprowadzam podstawową konfigurację, która jest wymagana " +
        "by niektóre inne systemy działały prawidłowo, na początku należy " +
        "ustawić podstawowe dane o serwerze, potem można ustalić panel nadawania " +
        "grupy oraz prosty mechanizm dodania starosty\n\n" +
        "po wydaniu polecenia groups pojawi się panel z reakcjami, " +
        "każda reakcja odpowiada innej grupie, student może sobie wybrac " +
        "do któej należy, w każdym momencie może zmienić wybór odnaczają poprzenią\n\n" +
        `np. \`${prefix} setup server Informatyka 2019/20 WIiT\`\n` +
        `np. \`${prefix} setup chairman Janek\`\n` +
        `np. \`${prefix} setup groups grupa1 grupa2 grupa3\`\n`,
    usage: `\`${prefix} setup server <faculty> <year> <department>\`\n` +
        `\`${prefix} setup chairman <username>\`\n` +
        `\`${prefix} setup groups <groups ...>\`\n`,
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
                body: JSON.stringify(data)
            }).then(response => {
                return response.json();
            }).catch(() => {
                return {
                    code: "-1",
                    response: {}
                }
            });

            if (response.code === '200') {
                message.channel.send("Success.");
            } else {
                message.channel.send("Failed. " + response.code);
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

            const response = await fetch(backend + "/setupGroups", {
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

            if (response.code === '200') {
                message.channel.send("Success.");
                client.globals.roleReactionMessage.set(sendMessage.guildId, sendMessage.id);
            } else {
                message.channel.send("Failed. " + response.code);
            }

            for (let i = 0; i < args.length - 2; i++) {
                const reaction = await sendMessage.react(fruitEmoji[i]);
                data.roles.push({
                    role_name: args[i + 2],
                    emoji_name: reaction.emoji.name
                });
            }

        }
    }
}