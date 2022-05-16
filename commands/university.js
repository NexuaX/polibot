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
            room: room
        }

        const response = await fetch(backend + "/getRoomData", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res =>
            res.json()
        ).catch(err => {
                // TODO remove
                // mock
                return {
                    code: "200",
                    response: {
                        building: "Budynek WIiTCH",
                        name: "s. 135",
                        floor: "Piętro 1",
                        description: "Lewe skrzydło",
                        image_url: "https://i.ibb.co/h8RdZqj/bud-wiitch.png"
                    }
                }
        });

        if (response.code !== "200") {
            message.channel.send("Error.");
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

    }

}