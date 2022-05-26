const {prefix} = require("../config.json");

module.exports = {
    name: "purge",
    description: "wymiatam śmieci (wiadomości)",
    details: "siła jaką posiadam dzięki byciu botem pozwala mi na masowe " +
        "usuwanie wiadmości, jakiekolwiek by nie były, firma sprzątająca 5*\n\n" +
        "domyślne 5 wiadomości (nie wliczając wpisanej komendy)",
    usage: `\`${prefix} purge [<number>]\``,
    execute: commandHandler
}

async function commandHandler(message, args) {

    //usunięcie komedy z listy
    args.shift();

    const amount = args[0] ? parseInt(args[0]) : 10;

    await message.delete();
    await message.channel.bulkDelete(amount, true);

}