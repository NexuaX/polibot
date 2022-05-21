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
                    sendLastNewsToTheChat(message);
                }, 5000);
                break;
            case "off":
                message.channel.send("disabled");
                clearInterval(facultyNewsInterval);
                break;
        }

    }
}

async function parseWebsite() {
    const result = await fetch("https://it.pk.edu.pl/");
    const text = await result.text();
    const parser = new JSDOM(text);
    return parser.window.document;
}

function sendIfNewsHasBeenUpdated(latestNews, message, newsEmbed) {
    if (lastMessage == null || lastMessage.innerHTML !== latestNews.innerHTML) {
        message.channel.send({embeds: [newsEmbed]});
        lastMessage = latestNews;
    }
}

function addLink(isLinkHidden, link, newsEmbed) {
    let linkHref;
    if (!isLinkHidden) {
        linkHref = link.getAttribute('href');
        linkHref = linkHref.split(" ").join("%20");
        newsEmbed.addField('Więcej', linkHref);
    }
}

function decorateMessage(latestNews) {
    return new MessageEmbed()
        .setTitle("Latest News")
        .setDescription(latestNews.innerHTML);
}

function extractNewsInfo(parsedDocument) {
    const newsCollection = parsedDocument.querySelector('[mytype="news"]');
    const latestNews = newsCollection.querySelector(".readmetxt");
    const linkContainer = newsCollection.querySelector(".text-right");
    const link = linkContainer.querySelector('a');
    let isLinkHidden = linkContainer.innerHTML.includes("visibility:hidden");
    return {latestNews, link, isLinkHidden};
}

async function sendLastNewsToTheChat(message) {
    const parsedDocument = await parseWebsite();
    let {latestNews, link, isLinkHidden} = extractNewsInfo(parsedDocument);
    const newsEmbed = decorateMessage(latestNews);
    addLink(isLinkHidden, link, newsEmbed);
    sendIfNewsHasBeenUpdated(latestNews, message, newsEmbed);
}