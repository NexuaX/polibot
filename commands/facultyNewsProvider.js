const nodeParser = require('node-html-parser');
module.exports = {
    name: 'news',
    description: "shows latest news",
    execute(message) {
        let request = require("request");

        request(
            { uri: "https://it.pk.edu.pl" },
            function(error, response, body) {
                const page = nodeParser.parse(body);
                const newsCollection = page.querySelectorAll('[mytype="news"]');
                const latestNews = newsCollection.at(0).querySelector(".readmetxt").innerText;
                message.channel.send(latestNews);
            }
        );

    }
}