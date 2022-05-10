const fetch = require("node-fetch");
const {JSDOM} = require("jsdom");
const {MessageEmbed} = require("discord.js");

let facultyNewsInterval;
let lastMessage;
module.exports = {
    name: 'news',
    description: "shows latest news",
    execute(message, args) {

        switch (args[1]) {
            case "on":
                message.channel.send("enabled");
                facultyNewsInterval = setInterval(() => {
                    sendLastNewsToTheChat(message)
                }, 5000);
                break;
            case "off":
                message.channel.send("disabled");
                clearInterval(facultyNewsInterval);
                break;
        }

    }
}

async function sendLastNewsToTheChat(message) {
    const result = await fetch("https://it.pk.edu.pl/");
    const text = await result.text();

    const parser = new JSDOM(text);
    const parsedDocument = parser.window.document;

    const newsCollection = parsedDocument.querySelector('[mytype="news"]');
    const latestNews = newsCollection.querySelector(".readmetxt");
    const linkContainer = newsCollection.querySelector(".text-right");
    const link = linkContainer.querySelector('a');
    let isLinkHidden = linkContainer.innerHTML.includes("visibility:hidden");
    const newsEmbed = new MessageEmbed()
        .setTitle("Latest News")
        .setDescription(latestNews.innerHTML);
    if (!isLinkHidden) {
        linkHref = link.getAttribute('href');
        linkHref = linkHref.split(" ").join("%20");
        newsEmbed.addField('Więcej', linkHref);
        latestNews.innerHTML += '\n' + linkHref;
    }
    if (lastMessage == null || lastMessage.innerHTML !== latestNews.innerHTML) {
        console.log(latestNews.innerHTML);
        message.channel.send({embeds: [newsEmbed]});
        lastMessage = latestNews;
    }
}