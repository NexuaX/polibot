const client = require("../main");
const fetch = require("node-fetch");
const {backend} = require("../config.json");

client.on("messageReactionAdd", async (reaction, user) => {

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
    if (user.bot) return;

    const data = {
        guild_id: reaction.message.guildId,
        message_id: reaction.message.id
    }

    // const response = await fetch(backend + "/getReactionMessage", {
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify(data)
    // });

    const response = {
        guild_id: "dummy",
        message_id: "961724327613567026",
        role: {
            role_name: "grupa1",
            emoji_name: "🍉"
        }
    };

    if (reaction.message.id === response.message_id) {
        const role = reaction.message.guild.roles.cache.find(role => role.name === response.role.role_name);
        reaction.message.guild.members.cache.get(user.id).roles.add(role).catch(error => console.log(error));

        reaction.message.channel.send(`Student ${user} dołączył do ${role}`);
    }

    console.log("roleReaction!");
});