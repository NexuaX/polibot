const {MessageEmbed} = require("discord.js");
const imageUrls = require("../assets/urls.json");
const fetch = require("node-fetch");
const {backend} = require("../config.json");

module.exports = {
    name: "university",
    description: "wyświetlam dane o kampusie i salach",
    execute: commandHandler
}

async function commandHandler(message, args) {

    // usunięcie nazwy komendy z listy
    args.shift();

    const subcommand = args[0];

    if (subcommand === "campus") {

        const choice = args[1] ?? "warszawska";
        const embed = new MessageEmbed();

        if (choice === "warszawska") {
            embed.setTitle("Kampus PK Warszawska")
            embed.setImage(imageUrls.kampus_warszawska);
        }

        message.channel.send({embeds: [embed]});

    } else if (subcommand === "room") {

        const room = args[1];

        if (!room) {
            message.channel.send("Sprecyzuj salę.");
            return;
        }

        const data = {
            name: room
        }

        const response = await fetch(backend + "/getRoomData", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res =>
            res.json()
        ).catch(() => {
            return {
                code: "-1",
                response: {}
            }
        });

        if (response.code === "-1") {
            message.channel.send("Data fetch error.");
            return;
        }

        if (response.code === "400") {
            message.channel.send("Room not found!");
            return;
        }

        const responseData = response.response;

        const embed = new MessageEmbed()
            .setTitle(responseData.name)
            .setDescription(`` +
                `**${responseData.building}**\n` +
                `${responseData.floor}, ${responseData.description}`
            )
            .setThumbnail(imageUrls.pklogo)
            .setImage(responseData.image_url)
            .setColor("#013571");

        message.channel.send({embeds: [embed]});

    } else {
        message.channel.send(`Nieznana podkomenda \`${subcommand}\``);
    }

}