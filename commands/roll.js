
module.exports = {
    name: 'roll',
    description: "Losuje osobe z grupy, liczbe z zakresu, element ze zbioru",
    execute(message, args) {

        // usunięcie komendy z listy
        args.shift()
        const rollType = args[0];
        // usunięcie typu z listy
        args.shift()

        switch(rollType) {
            case "user":
                handleUserType(message)
                break;
            case "range":
                handleRangeType(message, args)
                break
            case "element":
                handleElementType(message, args)
                break;
            default:
                message.reply({content: 'Niepoprawny typ losowania', ephemeral: true});
        }

    }
}

async function handleUserType(message) {
    await message.guild.members.fetch()
    const group = message.mentions.roles.first()
    if (!group) {
        message.reply({content: "Proszę podać grupę użytkownika", ephemeral: true})
        return
    }

    const groupMembers = group.members
    message.reply({content: `Wylosowano użytkownika: ${groupMembers.random()}`})
}

function handleRangeType(message, args) {
    if(args.length !== 2){
        message.reply({content: "Proszę podać dolną i górną granicę zakresu", ephemeral: true});
        return
    }
    if(!isInt(args[0]) || !isInt(args[1])) {
        message.reply({content: "Granice zakresu muszą być liczbami całkowitymi", ephemeral: true});
        return
    }

    const min = Math.ceil(args[0]);
    const max = Math.floor(args[1]);
    const number = Math.floor(Math.random() * (max - min + 1)) + min
    message.reply({content: `Wylosowano liczbe: ${number}`})
}

function handleElementType(message, args) {
    if(args.length < 1){
        message.reply({content: "Proszę podać zbiór elementów", ephemeral: true});
        return
    }

    const item = args[Math.floor(Math.random() * args.length)];
    message.reply({content: `Wylosowano element: ${item}`})
}

function isInt(value) {
    return !isNaN(value) && (function(x) { return (x | 0) === x; })(parseFloat(value))
}