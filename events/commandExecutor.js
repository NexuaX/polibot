const client = require("../main");
const {prefix} = require("../config.json");
const fetch = require("node-fetch");

client.on("messageCreate", async message => {
    if (!message.content.startsWith(prefix) || message.author.bot) return;

    if (message.content.trim() === prefix.trim()) {
        await message.reply(`Aby poznać moje komendy napisz \`${prefix} help\``)
        return;
    }

    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const command = client.commands.get(args[0]);

    if (!command) {
        const response = await fetch('http://127.0.0.1:9090/prediction/' + args[0])
            .then(response => response.json())
            .catch(() => "nlp error");

        const result = await (async function () {
            if (response !== "nlp error") {
                console.log('Response:', response);
                const prediction = Object.getOwnPropertyNames(response)[0] ?? null;

                if (prediction) {
                    const copyArgs = [...args];
                    copyArgs[0] = prediction;
                    const reply = await message.reply(`Czy chodziło o \`${copyArgs.join(" ")}\`?`);
                    await reply.react("✅");
                    await reply.react("❌");

                    const collector = reply.createReactionCollector({
                        time: 1000 * 30,
                        filter: (reaction, user) => !user.bot,
                        max: 1
                    });

                    let ok = false;

                    collector.on("end", collected => {
                        const reaction = collected.first();
                        if (!reaction) return;
                        if (reaction.emoji.name === "✅") {
                            args[0] = copyArgs[0];
                            ok = true;
                        }
                    });

                    while (!collector.ended) {
                        await new Promise(resolve => setTimeout(resolve, 100));
                    }

                    return ok;
                } else {
                    return false;
                }
            } else {
                console.log("nlp server error.");
                return false;
            }
        })();

        if (result) {
            client.commands.get(args[0]).execute(message, args);
        } else {
            await message.reply({content: `Nieznana komenda \`${args[0]}\`\nNapisz \`${prefix} help\` aby skorzystać z pomocy`});
        }

    } else {
        command.execute(message, args);
    }
});