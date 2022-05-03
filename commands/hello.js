module.exports = {
    name: 'hello',
    description: "mówię dzień dobry",
    execute(message, args) {
        message.channel.send("Tutaj bot PK!");
    }
}