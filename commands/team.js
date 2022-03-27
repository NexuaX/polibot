const { MessageEmbed, MessageAttachment} = require("discord.js");

module.exports = {
    name: "team",
    description: "wypisuje twórców bota",
    execute(message, args) {
        const profilePicture = new MessageAttachment("assets/pfp.png").setDescription("profile");
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
            .setThumbnail('attachment://pfp.png')
            .addField('team', teammates)
            .setImage('attachment://team.jpg');

        message.channel.send({embeds: [teamEmbed], files: [profilePicture, teamPicture]});
    }
}