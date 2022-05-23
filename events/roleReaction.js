const client = require("../main");
const fetch = require("node-fetch");
const {backend} = require("../config.json");

client.on("ready", async () => {
    client.globals.roleReactionMessage = new Map();
    client.guilds.cache.forEach((guild) => {
        const data = {
            guild_id: guild.id
        };
        fetch(backend + "/getGroupsInfo", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).then(response => {
            if (response.code === "200") {
                client.globals.roleReactionMessage.set(guild.id, response.response.message_id);
                console.log(`roleReaction message for guild ${guild.name} registered`);
            }
        }).catch(() => {
            console.log("connection to /getGroupsInfo failed, moving on");
        });
    });
});

client.on("messageReactionAdd", async (reaction, user) => {

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
    if (user.bot) return;

    if (client.globals.roleReactionMessage.has(reaction.message.guildId)) {
        if (client.globals.roleReactionMessage.get(reaction.message.guildId) !== reaction.message.id) {
            return;
        }
    }

    const response = await fetchRoleReactionData(reaction);

    if (response.code !== "200") {
        console.log("roleReaction fetch error.");
        return;
    }

    if (reaction.message.id === response.response.message_id) {
        const reactionRole = reaction.message.guild.roles.cache.find(role => role.name === response.response.role_name);

        if (!reactionRole) return;

        reaction.message.guild.members.cache.get(user.id).roles.add(reactionRole).catch(error => console.log(error));

        reaction.message.channel.send(`Student ${user} dołączył do ${reactionRole}`);

        if (!client.globals.roleReactionMessage.has(reaction.message.guildId)) {
            client.globals.roleReactionMessage.set(reaction.message.guildId, response.response.message_id);
        }
    }

});

client.on("messageReactionRemove", async (reaction, user) => {

    if (reaction.partial) await reaction.fetch();
    if (user.partial) await user.fetch();
    if (user.bot) return;

    if (client.globals.roleReactionMessage.has(reaction.message.guildId)) {
        if (client.globals.roleReactionMessage.get(reaction.message.guildId) !== reaction.message.id) {
            return;
        }
    }

    const response = await fetchRoleReactionData(reaction);

    if (response.code !== "200") {
        console.log("roleReaction fetch error.");
        return;
    }

    if (reaction.message.id === response.response.message_id) {
        const reactionRole = reaction.message.guild.roles.cache.find(role => role.name === response.response.role_name);

        if (!reactionRole) return;

        reaction.message.guild.members.cache.get(user.id).roles.remove(reactionRole).catch(error => console.log(error));

        reaction.message.channel.send(`Student ${user} opuścił ${reactionRole}`);

        if (!client.globals.roleReactionMessage.has(reaction.message.guildId)) {
            client.globals.roleReactionMessage.set(reaction.message.guildId, response.response.message_id);
        }
    }

});

async function fetchRoleReactionData(reaction) {
    const data = {
        guild_id: reaction.message.guildId,
        message_id: reaction.message.id,
        emoji_name: reaction.emoji.name
    }

    return await fetch(backend + "/getReactionRole", {
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
}