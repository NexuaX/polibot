const { MessageEmbed, MessageAttachment} = require("discord.js");
const { pfp } = require("../assets/urls.json");

module.exports = {
    name: "team",
    description: "wypisuje twórców bota",
    execute(message, args) {
        message.channel.sendTyping();
        const teamPicture = new MessageAttachment("assets/team.jpg").setDescription("team");
        const teammates =
            `
            Albert Mouhoubi
            Mateusz Nosal
            Jacek Oleksy
            Mikołaj Michalczak
            Natalia Nahlik
            Łukasz Miętka
            Mateusz Mizak
            Ivan Morhaliuk
            `;
        const teamEmbed = new MessageEmbed()
            .setTitle("PoliBot Team!")
            .setDescription("To oni nadali mi życie!")
            .setThumbnail(pfp)
            .addField('team', teammates)
            .setImage('attachment://team.jpg');

        message.channel.send({embeds: [teamEmbed], files: [teamPicture]});
    }
}