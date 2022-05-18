const {MessageEmbed} = require("discord.js");

module.exports = {
    name: 'poll',
    description: "Tworzy ankiete umozliwiajaca glosowanie",
    execute(message, args) {

        let pollReactions = {
            1: '🇦',
            2: '🇧',
            3: '🇨',
            4: '🇩',
            5: '🇪',
            6: '🇫',
            7: '🇬',
            8: '🇭',
            9: '🇮',
            10: '🇯',
            11: '🇰',
            12: '🇱',
            13: '🇲',
            14: '🇳',
            15: '🇴',
            16: '🇵',
            17: '🇶',
            18: '🇷',
            19: '🇸',
            20: '🇹',
        }

        const questionRegex = /'(.*)'/gmi;
        const questionOriginal = args.join(' ').match(questionRegex) // Question Of Poll
        const questionEdited = questionOriginal[0].replace("'", "").replace("'", "") // To Remove `` From Question
        if (!questionOriginal || !questionEdited) return message.reply(`No Question Provided`)
        let options = args.join(' ').slice(questionOriginal[0].length).split(' | ')
        let result = ''

        if (options.length <= 1) {
            const embed = new MessageEmbed()
                .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setColor("#013571")
                .setDescription(`**${questionEdited}**\n 🟢 : Tak\n 🔴 : Nie`)
            message.channel.send({embeds: [embed]}).then(msg => {
                msg.react("🟢").then(() => {})
                msg.react("🔴").then(() => {})
            })
        } else{
            if (options.length > 20) return message.reply(`You Can't Have More Then 20 Options`)
            result = options.map((c, i) => {
                return `${pollReactions[i + 1]} ${c}`
            })

            const embed = new MessageEmbed()
                .setAuthor({ name: `${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                .setTimestamp()
                .setColor("#013571")
                .setDescription(`**${questionEdited}**${result.join('\n')}`)
            message.channel.send({embeds: [embed]}).then(msg => {
                options.map(async (c, x) => {
                    await msg.react(pollReactions[x + 1])
                })
            })
        }

    }
}