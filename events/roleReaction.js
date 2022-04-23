const client = require("../main");
const fetch = require("node-fetch");
const {backend} = require("../config.json");

client.on("messageReactionAdd", async (reaction, user) => {

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
    if (user.bot) return;

    const data = {
        guild_id: reaction.message.guildId,
        message_id: reaction.message.id,
        emoji_name: reaction.emoji.name
    }

    let response = await fetch(backend + "/getReactionRole", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    response = await response.json();

    if (reaction.message.id === response.response.message_id) {
        const reactionRole = reaction.message.guild.roles.cache.find(role => role.name === response.response.role_name);

        if (!reactionRole) return;

        reaction.message.guild.members.cache.get(user.id).roles.add(reactionRole).catch(error => console.log(error));

        reaction.message.channel.send(`Student ${user} dołączył do ${reactionRole}`);
    }

});

client.on("messageReactionRemove", async (reaction, user) => {

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
    if (user.bot) return;

    const data = {
        guild_id: reaction.message.guildId,
        message_id: reaction.message.id,
        emoji_name: reaction.emoji.name
    }

    let response = await fetch(backend + "/getReactionRole", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
    });

    response = await response.json();

    if (reaction.message.id === response.response.message_id) {
        const reactionRole = reaction.message.guild.roles.cache.find(role => role.name === response.response.role_name);

        if (!reactionRole) return;

        reaction.message.guild.members.cache.get(user.id).roles.remove(reactionRole).catch(error => console.log(error));

        reaction.message.channel.send(`Student ${user} opuścił ${reactionRole}`);
    }

});