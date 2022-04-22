const client = require("../main")

client.once("ready", () => {

    // TODO wczytanie z bazy przypomnień
    const checkForRemainders = async () => {

        console.log("Sprawdzam czy mam coś do przypomnienia ...");

        // pętla wywołania co minutę
        setTimeout(checkForRemainders, 1000 * 60);
    };

    checkForRemainders();
});