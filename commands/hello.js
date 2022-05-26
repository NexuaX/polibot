const {prefix} = require("../config.json");

module.exports = {
    name: 'hello',
    description: "maniery, maniery!!",
    details: "technicznie jest to taki ping do mnie, aby sprawdzić czy żyje lub po prostu się przywitać :D",
    usage: `\`${prefix} hello\``,
    execute(message, args) {
        message.channel.send("Tutaj bot PK!");
    }
}