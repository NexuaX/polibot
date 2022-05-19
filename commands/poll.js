const {MessageEmbed} = require("discord.js");
const pollReactions = [
    '🔴', '🟠', '🟡', '🟢', '🟣', '🟤', '⚪', '⚫',
];

module.exports = {
    name: 'poll',
    description: "Tworzy ankiete umozliwiajaca glosowanie",
    async execute(message, args) {

        // usunięcie komendy z listy
        args.shift()

        const questionRegex = /'(.*)'/gmi;
        const questionOriginal = args.join(' ').match(questionRegex)

        if (!questionOriginal) return message.reply(`Nie zadano pytania`)

        const questionEdited = questionOriginal[0].replace("'", "").replace("'", "") // To Remove `` From Question

        if (!questionEdited) return message.reply(`Nie zadano pytania`)

        let options = args.join(' ').slice(questionOriginal[0].length).split('|')
        options.shift()

        let result = ''

        const now = Date.now();
        const fifteen = (1000 * 60 * 15);
        const deadline = now + fifteen;
        const deadlineDate = new Date(deadline);

        const timeOptions = {
            hour: "2-digit",
            minute: "2-digit"
        }

        if (options.length <= 1) {

            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${message.author.username}`,
                    iconURL: message.author.displayAvatarURL({dynamic: true})
                })
                .setColor("#013571")
                .setTitle(questionEdited)
                .setDescription(`🟢 : \`Tak\`\n🔴 : \`Nie\``)
                .setFooter({text: `Deadline: ${deadlineDate.toLocaleTimeString([], timeOptions)}`})

            const sendMessage = await message.channel.send({embeds: [embed]});
            await sendMessage.react("🟢")
            await sendMessage.react("🔴")

            const results = {
                "yes": 0,
                "no": 0
            }

            const collector = sendMessage.createReactionCollector({
                time: fifteen
            });

            collector.on("collect", (collected) => {
                const name = collected.emoji.name;
                if (name === "🟢") {
                    results["yes"]++;
                } else if (name === "🔴") {
                    results["no"]++;
                }
            });

            collector.on("end", () => {
                embed
                    .setDescription(`🟢 : \`Tak -  ${results["yes"]}\`\n🔴 : \`Nie -  ${results["no"]}\``)
                    .setFooter({text: "Deadline: zakończone."});
                sendMessage.edit({embeds: [embed]});
            });

        } else {
            if (options.length > pollReactions.length)
                return message.reply(`Nie można podać więcej niż ${pollReactions.length} opcji`)

            result = options.map((c, i) => {
                return `${pollReactions[i]} : \` ${c.trim()} \``
            })

            const embed = new MessageEmbed()
                .setAuthor({
                    name: `${message.author.username}`,
                    iconURL: message.author.displayAvatarURL({dynamic: true})
                })
                .setTitle(questionEdited)
                .setColor("#013571")
                .setDescription(`${result.join('\n')}`)
                .setFooter({text: `Deadline: ${deadlineDate.toLocaleTimeString([], timeOptions)}`})

            const results = []

            const sendMessage = await message.channel.send({embeds: [embed]})
            for (let i = 0; i < options.length; i++) {
                await sendMessage.react(pollReactions[i]);
                results.push(0);
            }

            const filter = (reaction, user) => {
                return !user.bot;
            }

            const collector = sendMessage.createReactionCollector({
                filter,
                time: 10000
            });

            collector.on("collect", (collected) => {
                const name = collected.emoji.name;
                for (let i = 0; i < pollReactions.length; i++) {
                    if (pollReactions[i] === name) {
                        results[i] += 1;
                        break;
                    }
                }
            });

            collector.on("end", () => {
                result = options.map((c, i) => {
                    return `${pollReactions[i]} : \` ${c.trim()}  - ${results[i]}\``
                });

                embed
                    .setDescription(`${result.join('\n')}`)
                    .setFooter({text: "Deadline: zakończone."});
                sendMessage.edit({embeds: [embed]});
            });
        }

    }
}