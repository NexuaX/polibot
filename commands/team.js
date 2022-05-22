const { MessageEmbed } = require("discord.js");
const { pfp, team } = require("../assets/urls.json");

module.exports = {
    name: "team",
    description: "wypisuje twórców bota",
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