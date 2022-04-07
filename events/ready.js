const client = require("../main")

client.once("ready", () => {
    const date = new Date().toISOString()
        .replace(/T/, ' ')
        .replace(/\..+/, '');
    console.log(`${client.user.username} ubrany i gotowy! ${date}`);
});