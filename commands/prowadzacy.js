const { MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");

const embeds = []
const pages = {}

module.exports = {
    name: "prowadzacy",
    description: "Wypisuje dane prowadzacego",
    async execute(message, args) {
        const teacherName = args.slice(1).join(' ')
        if (!areArgsValid(args, message, teacherName)) return

        const teacherData = JSON.parse(getTeacherData(teacherName))
        const phoneNumbers = teacherData.phoneNumbers.join('\n')
        const emails = teacherData.emails.join('\n')
        const parentUnits = teacherData.parentUnits.join('\n')

        for (let a = 0; a < 4; a++) {
            const teacherEmbed = new MessageEmbed()
                .setTitle('Dane prowadzącego')
                .setDescription(`Page: ${a + 1}`)
                .addFields(
                    {name: 'Imię i nazwisko', value: `${teacherData.name} ${teacherData.surname}`},
                    {name: 'Telefon', value: phoneNumbers},
                    {name: 'E-mail', value: emails},
                    {name: 'Jednostki nadrzędne', value: parentUnits},
                    {name: 'Jednostka zatrudnienia', value: teacherData.employmentUnit}
                )
            if (teacherData.website) {
                teacherEmbed.addField('Strona internetowa', teacherData.website)
            }
            embeds.push(teacherEmbed)
        }

        const id = message.author.id
        pages[id] = pages[id] || 0
        const embed = embeds[pages[id]]
        let reply
        let collector

        const filter = (i) => i.user.id === message.author.id
        const time = 1000 * 60 * 5

        if (message) {
            reply = await  message.reply({
                embeds: [embed],
                components: [getRow(id)]
            })

            collector = reply.createMessageComponentCollector({filter, time})
        } else {
            message.interaction.reply({
                ephemeral: true,
                embeds: [embed],
                components: [getRow(id)]
            })

            collector = message.channel.createMessageComponentCollector({filter, time})
        }

        collector.on('collect', (btnInt) => {
            if (!btnInt) {
                return
            }

            btnInt.deferUpdate().then(r => {})

            if (
                btnInt.customId !== 'prev_embed' &&
                btnInt.customId !== 'next_embed'
            ) {
                return
            }

            if (btnInt.customId === 'prev_embed' && pages[id] > 0) {
                --pages[id]
            } else if (
                btnInt.customId === 'next_embed' &&
                pages[id] < embed.length - 1
            ) {
                ++pages[id]
            }

            if (reply) {
                reply.edit({
                    embeds: [embeds[pages[id]]],
                    components: [getRow(id)]
                }).then(r => {})
            } else {
                message.interaction.editReply({
                    embeds: [embeds[pages[id]]],
                    components: [getRow(id)]
                }).then(r => {})
            }
        })
    }
}

function getTeacherData(teacherName) {
    const obj = {
        name: 'Jan',
        surname: 'Nowak',
        phoneNumbers: ['123456456', '466444875'],
        emails: ['jan.nowak@pk.edu.pl', 'jan.nowak2@pk.edu.pl'],
        parentUnits: ['Wydział Architektury (A)'],
        employmentUnit: 'Katedra Informatyki (F-1)',
        website: 'https://wp.pl'
    }
    return JSON.stringify(obj)
}

const getRow = (id) => {
    const row = new MessageActionRow()

    row.addComponents(
        new MessageButton()
            .setCustomId('prev_embed')
            .setStyle('SECONDARY')
            .setEmoji('⬅️')
            .setDisabled(pages[id] === 0)
    )
    row.addComponents(
        new MessageButton()
            .setCustomId('next_embed')
            .setStyle('SECONDARY')
            .setEmoji('➡️')
            .setDisabled(pages[id] === embeds.length - 1)
    )
    return row
}

function areArgsValid(args, message, teacherName) {
    if(args.length < 2) {
        message.reply({content: 'Podaj imię i/lub nazwisko prowadzącego.', ephemeral: true});
        return false
    }
    if(teacherName.length < 3){
        message.reply({content: 'Podaj minimum 3 znaki.', ephemeral: true});
        return false
    }
    return true
}


