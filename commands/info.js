const {MessageEmbed} = require("discord.js");
const imageUrls = require("../assets/urls.json");
const fetch = require("node-fetch");
const {backend, prefix} = require("../config.json");
const client = require("../main");

module.exports = {
    name: "info",
    description: "przedstawiam dane o serwerze i grupach",
    details: "przedstawiam dane zapisane w bazie oraz statystyki (jeśli istnieją) " +
        "na temat serwera lub jego grup i studentów",
    usage: `\`${prefix} info <server|groups>\`\n` +
        `\`${prefix} info group <@group>\``,
    execute: commandHandler
}

async function commandHandler(message, args) {

    // usunięcie nazwy komendy
    args.shift()

    const subcommand = args[0];

    if (subcommand === "server") {

        const data = {
            guild_id: message.guildId
        }

        const serverInfo = await fetchData(backend + "/getServerInfo", data)

        if (serverInfo.code === "-1") {
            message.channel.send("Data fetch error.");
            return;
        }

        if (serverInfo.code === "400") {
            message.channel.send("Server not configured!");
            return;
        }

        const responseData = serverInfo.response;

        const chairman = message.guild.members.cache.find(member => {
            return member.roles.cache.find(role => role.name === "chairman")
        });

        const groupData = await fetchData(backend + "/getGroupsInfo", data)

        if (groupData.code === "-1") {
            message.channel.send("Data fetch error.");
            return;
        }

        const embed = new MessageEmbed()
            .setTitle(`${responseData.faculty}`)
            .setDescription(
                `${responseData.department} rocznik ${responseData.year}\n\n` +
                `**Starosta**: ${chairman ?? "nie ustawiono"}\n` +
                `**Studentów**: ${message.guild.memberCount}\n` +
                `**Groupy**: ${groupData.response.roles.length ?? "nie ustawiono"}`)
            .setFooter({text: "Proudly serviced by Polibot", iconURL: client.user.avatarURL()})
            .setThumbnail(imageUrls.pklogo)
            .setColor("GREEN");

        message.channel.send({embeds: [embed]});

    } else if (subcommand === "groups") {

        const data = {
            guild_id: message.guildId
        }

        const groupData = await fetchData(backend + "/getGroupsInfo", data)

        if (groupData.code === "-1") {
            message.channel.send("Data fetch error.");
            return;
        }

        if (groupData.code === "400") {
            message.channel.send("Groups not configured!");
            return;
        }

        const groupsArray = groupData.response.roles.map(elem => elem.role_name);

        const groupsResolved = message.guild.roles.cache.filter(role => groupsArray.includes(role.name));

        let generatedDescription = "";
        for (const [, role] of groupsResolved) {
            generatedDescription += `${role}: ${role.members.size}\n`
        }

        const embed = new MessageEmbed()
            .setTitle(`Lista grup na serwerze`)
            .setDescription(`${generatedDescription}`)
            .setFooter({text: "Proudly serviced by Polibot", iconURL: client.user.avatarURL()})
            .setThumbnail(imageUrls.pklogo)
            .setColor("GREEN");

        message.channel.send({embeds: [embed]});

    } else if (subcommand === "group") {

        await message.guild.members.fetch();
        const group = message.mentions.roles.first();

        if (!group) {
            message.channel.send("Określ grupę. `info group @groupName`");
        }

        const groupMembers = group.members;

        let generatedDescription = "";
        for (const [, member] of groupMembers) {
            generatedDescription += `${member}\n`
        }

        const embed = new MessageEmbed()
            .setTitle(`Lista członków ${group.name}`)
            .setDescription(`${generatedDescription}`)
            .setFooter({text: "Proudly serviced by Polibot", iconURL: client.user.avatarURL()})
            .setThumbnail(imageUrls.pklogo)
            .setColor("GREEN");

        message.channel.send({embeds: [embed]});

    } else {
        message.channel.send(`Nieznana podkomenda \`${subcommand}\``);
    }

}

function fetchData(endpoint, data) {
    return fetch(endpoint, {
        method: "POST",
        body: JSON.stringify(data)
    }).then(response => {
        return response.json()
    }).catch(err => {
        return {
            code: "-1",
            response: {}
        }
    });
}
