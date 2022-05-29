const client = require("../main");
const {prefix} = require("../config.json");
const axios = require('axios');

client.on("messageCreate", message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content.trim() === prefix.trim()) {
        message.reply(`Aby poznać moje komendy napisz \`${prefix} help\``)
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(args[0]);

    if (!command) {
        axios.get('http://127.0.0.1:9090/prediction/' + args.slice(0,2).join(' '))
          .then(res => {
            const headerDate = res.headers && res.headers.date ? res.headers.date : 'no response date';
            console.log('Status Code:', res.status);
            console.log('Date in Response header:', headerDate);

            const commands = res.data;
            console.log(commands);
          })
          .catch(err => {
            console.log('Error: ', err.message);
          });
        message.reply({content: `Nieznana komenda \`${args[0]}\`\nNapisz \`${prefix} help\` aby skorzystać z pomocy`});
    } else {
        command.execute(message, args);
    }
});