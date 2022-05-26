const { MessageEmbed } = require("discord.js");
const { pfp, team } = require("../assets/urls.json");
const {prefix} = require("../config.json");

module.exports = {
    name: "team",
    description: "panel chwały",
    details: "zostawiam wzmiankę o swoich twórcach\n\n" +
        "ot co, jestem im wdzięczny za wszystko co potrafię!\n" +
        "mam też swojego ulubieńca, ale to sekret",
    usage: `\`${prefix} team\``,
    execute(message, args) {
        message.channel.sendTyping();
        const teammates = [
            "Albert Mouhoubi",
            "Mateusz Nosal",
            "Jacek Oleksy",
            "Mikołaj Michalczak",
            "Natalia Nahlik",
            "Łukasz Miętka",
            "Mateusz Mizak",
            "Ivan Morhaliuk"
        ];
        const teamEmbed = new MessageEmbed()
            .setTitle("PoliBot Team!")
            .setDescription("To oni nadali mi życie!")
            .setThumbnail(pfp)
            .addField('team', teammates.join('\n'))
            .setImage(team);

        message.channel.send({embeds: [teamEmbed]});
    }
}