const { MessageEmbed} = require("discord.js");

module.exports = {
    name: "prowadzacy",
    description: "Wypisuje dane prowadzacego",
    execute(message, args) {
        const teacherName = args.slice(1).join(' ')
        if(!areArgsValid(args, message, teacherName)) return

        const teacherData = JSON.parse(getTeacherData(teacherName))
        const phoneNumbers = teacherData.phoneNumbers.join('\n')
        const emails = teacherData.emails.join('\n')
        const parentUnits = teacherData.parentUnits.join('\n')

        const teamEmbed = new MessageEmbed()
            .setTitle('Dane prowadzącego')
            .addFields(
                { name: 'Imię i nazwisko', value: `${teacherData.name} ${teacherData.surname}`},
                { name: 'Telefon', value: phoneNumbers},
                { name: 'E-mail', value: emails},
                { name: 'Jednostki nadrzędne', value: parentUnits},
                { name: 'Jednostka zatrudnienia', value: teacherData.employmentUnit}
            )
        if(teacherData.website){
            teamEmbed.addField('Strona internetowa', teacherData.website)
        }

        message.channel.send({embeds: [teamEmbed]});
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


