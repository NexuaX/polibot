const client = require("../main");

client.on("messageReactionAdd", async (reaction, user) => {
    if (reaction.partial) {
        try {
            await reaction.fetch();
        } catch (error) {
            console.error("Reaction message fetch error!", error);
            return;
        }
    }

    console.log(`Message gained reaction! Count: ${reaction.count}`);
});