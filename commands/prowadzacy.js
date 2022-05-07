const {MessageEmbed, MessageActionRow, MessageButton} = require("discord.js");
const fetch = require("node-fetch");
const formData = require("form-data");

let embeds = []
let pages = {}

module.exports = {
    name: "prowadzacy",
    description: "Wypisuje dane prowadzacego",
    async execute(message, args) {
        const teacherName = args.slice(1).join(' ')
        if (!areArgsValid(args, message, teacherName)) return

        let count
        let teachers = []
        let offset = 1
        embeds = []
        pages = {}

        const teacherData = await getTeacherData(teacherName, offset)
        teachers = teacherData.list
        count = teacherData.count

        while (teachers.length !== count) {
            offset++;
            const moreTeacherData = await getTeacherData(teacherName, offset)
            teachers.push(...moreTeacherData.list)
        }
        await handleTeacherData(teachers, message)
    }
}

function getTeacherData(teacherName, offset) {

    const teacherFormData = new formData();
    teacherFormData.append('id', teacherName);
    teacherFormData.append('ou', '');
    teacherFormData.append('child', 1);
    teacherFormData.append('wybor_szukaj', 1);
    teacherFormData.append('offset', offset);

    return fetch("https:spispracownikow.pk.edu.pl/data.php", {
        method: "POST",
        body: teacherFormData
    }).then(function (response) {
        return response.json();
    }).then(function (data) {
        return data
    }).catch(error => console.warn(error))
}

function getFormattedPhoneNumbers(phoneNumbers) {
    phoneNumbers.forEach(function(part, index) {
        if(this[index].length === 7) this[index] = `12 ${this[index]}`;
    }, phoneNumbers)
    return phoneNumbers.join(', ')
}

function getFormattedParents(parentsAndEmploymentInfo) {
    const parents = parentsAndEmploymentInfo.slice(1)
    parents.forEach(function(part, index) {
        this[index] = this[index].slice(3);
    }, parents)

    return parents.join(", ")
}

async function handleTeacherData(teacherList, message) {

    teacherList.forEach(function (teacher, i){
        const name = `${(teacher.pleduPersonDegree === "---") ? "" : teacher.pleduPersonDegree} ${teacher.givenName} ${teacher.sn}`
        const phoneNumbers = getFormattedPhoneNumbers(Array.from(teacher.phone))
        const emails = Array.from(teacher.mails).join(', ')
        const parentsAndEmploymentInfo = teacher.ou.split(",").slice(0, -4)
        const parents = getFormattedParents(parentsAndEmploymentInfo)
        const employment = parentsAndEmploymentInfo.shift().slice(3)
        const info = teacher.description

        const teacherEmbed = new MessageEmbed()
            .setTitle('Dane prowadzącego')
            .setThumbnail('https://www.pk.edu.pl/images/PK18/promocja/KIW_2020/SYGNET_PK/PK_SYGNET_RGB.jpg')
            .setColor("#013571")
            .setFooter({ text: `${i + 1}/${teacherList.length}`})

        if(Boolean(name)) teacherEmbed.addField('Imię i nazwisko', name)
        if(Boolean(phoneNumbers)) teacherEmbed.addField('Telefon', phoneNumbers)
        if(Boolean(emails)) teacherEmbed.addField('E-mail', emails)
        if(Boolean(parents)) teacherEmbed.addField('Jednostki nadrzędne', parents)
        if(Boolean(employment)) teacherEmbed.addField('Jednostka zatrudnienia', employment)
        if(Boolean(info)) teacherEmbed.addField('Informacje własne pracownika', info)

        embeds.push(teacherEmbed)
    })


    const id = message.author.id
    pages[id] = pages[id] || 0
    const embed = embeds[pages[id]]
    let reply
    let collector

    const filter = (i) => i.user.id === message.author.id
    const time = 1000 * 60 * 5

    if (message) {
        reply = await message.reply({
            embeds: [embed],
            components: (embeds.length > 1) ? [getRow(id)] : []
        })

        collector = reply.createMessageComponentCollector({filter, time})
    } else {
        message.interaction.reply({
            ephemeral: true,
            embeds: [embed],
            components: (embeds.length > 1) ? [getRow(id)] : []
        })

        collector = message.channel.createMessageComponentCollector({filter, time})
    }

    collector.on('collect', (btnInt) => {
        if (!btnInt) {
            return
        }

        btnInt.deferUpdate().then({})

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
            }).then({})
        } else {
            message.interaction.editReply({
                embeds: [embeds[pages[id]]],
                components: [getRow(id)]
            }).then({})
        }
    })

    collector.on('end', () => {
        if (reply) {
            reply.edit({
                components: []
            }).then({})
        } else {
            message.interaction.editReply({
                components: []
            }).then({})
        }
    });
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
    if (args.length < 2) {
        message.reply({content: 'Podaj imię i/lub nazwisko prowadzącego.', ephemeral: true});
        return false
    }
    if (teacherName.length < 3) {
        message.reply({content: 'Podaj minimum 3 znaki.', ephemeral: true});
        return false
    }
    return true
}


