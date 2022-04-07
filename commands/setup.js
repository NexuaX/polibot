const {MessageEmbed} = require("discord.js");
const fruitEmoji = [
    "🍉", "🍊", "🍋", "🥭", "🍐", "🍑", "🥝", "🍓"
];

module.exports = {
    name: 'setup',
    description: "ustaw role i parametry serwera",
    execute(message, args) {
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

            // api call aby zapisać guild_id => faculty
            message.channel.send("Jeszcze niezaimplementowane.")

        } else if (args[1] === "groups") {

            const groupsEmbed = new MessageEmbed()
                .setTitle("Wybierz swoją grupe!")
                .setDescription("Ustawienie grupy pozoli Ci korzystać z wielu funkcjonalności bota");
            for (let i = 2; i < args.length; i++) {
                groupsEmbed.addField('\u200B', `${fruitEmoji[i-2]} : ${args[i]}`);
            }
            message.channel.send({embeds: [groupsEmbed]})
                .then(async sendMessage => {
                    for (let i = 0; i < args.length - 2; i++) {
                        await sendMessage.react(fruitEmoji[i]);
                    }
                }).catch();

        }
    }
}