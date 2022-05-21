const fetch = require("node-fetch");
const {JSDOM} = require("jsdom");
const {MessageEmbed} = require("discord.js");
const {scheduleIcon} = require("../assets/urls.json");
const {backend} = require("../config.json");

const dayMapping = new Map([
    ["monday", "poniedziałek"],
    ["tuesday", "wtorek"]
]);

module.exports = {
    name: "schedule",
    description: "sprawdzam plan, wyświetlam",
    execute: commandHandler
}

async function commandHandler(message, args) {

    // usunięcie nazwy komendy z listy
    args.shift();

    const subcommand = args[0];

    if (subcommand === "newest") {

        const response = await fetch("https://it.pk.edu.pl/?page=rz");
        const text = await response.text();

        const parser = new JSDOM(text);
        const parsedDocument = parser.window.document;

        const div = parsedDocument.querySelectorAll("div.alert.readmetxt.alert-white")[0];
        const link = div.querySelector("a");
        const href = link.href;
        const linkText = link.innerHTML;
        const updateText = linkText.substring(linkText.indexOf("(aktualizacja"));

        const embed = new MessageEmbed()
            .setTitle("Najnowszy plan")
            .setDescription(updateText)
            .setThumbnail(scheduleIcon)
            .addField("Link", "https://it.pk.edu.pl/?page=rz")
            .setColor("GOLD");

        message.channel.send({embeds: [embed]});

    } else if (subcommand === "show") {

        const [ , day, group, subGroup ] = args;

        const data = {
            day,
            group
        };

        // fetch from database
        const {code, response} = await fetch(backend + "/getScheduleForGroup", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(response => response.json());

        if (code !== "200") {
            message.channel.send("Error.");
            return;
        }

        if (group === "experimental") {
            message.channel.send(generateTable(response.schedule));
            return;
        }

        // debug
        // message.channel.send("```json\n" + JSON.stringify(response, null, 2) + "\n```");

        const embed = new MessageEmbed()
            .setTitle(`Plan na ${dayMapping.get(response.day)}`)
            .setDescription(`dla ${response.group}${subGroup ? " sub" + subGroup : ''}`)
            .setThumbnail(scheduleIcon)
            .setColor("GOLD")
            .setFooter({text: `Last update ${response.last_update}`});

        const spLeftPad = (number, places) => String(number).padStart(places, " ");
        const spRightPad = (number, places) => String(number).padEnd(places, " ");

        for (let course of response.schedule) {
            if (subGroup && course.type.includes('.') && course.type.split('.')[1] !== subGroup)
                continue;
            embed.addField(`${course.name} ${course.type}`,
                `\`${spRightPad(course.room, 10)}\` : \`${spLeftPad(course.time_from.slice(0, -3), 5)} - ${spLeftPad(course.time_to.slice(0, -3), 5)}\``);
        }

        message.channel.send({embeds: [embed]});

    }

}

function generateTable(schedule) {

    const [
        leftUpCorner,
        horizontal,
        vertical,
        leftDownCorner,
        rightUpCorner,
        rightDownCorner
    ] = ["╔", "═", "║", "╚", "╗", "╝"];

    const [ startHour, startMinutes ] = alignStart(schedule[0].from);
    const [ endHour, endMinutes ] = alignEnd(schedule[schedule.length - 1].to);

    const [timeWidth, cellWidth] = [7, 10];

    const rows = [];

    const timediff = (endHour - startHour) * 4 - (endMinutes - startMinutes) / 15;

    console.log(startHour + " " + startMinutes);
    console.log(endHour + " " + endMinutes);
    console.log(timediff);

    let [ currentHour, currentMinutes ] = [ startHour, startMinutes ];
    const zeroPad = (number, places) => String(number).padStart(places, "0");
    const spacePad = (number, places) => String(number).padStart(places, " ");

    for (let i = 0; i < timediff; i++) {
        let row = "";
        if (i%2 === 0) {
            row += `${vertical} ${spacePad(currentHour, 2)}:${zeroPad(currentMinutes, 2)} ${vertical}`;
        } else {
            row += `${vertical} ${' '.repeat(timeWidth - 2)} ${vertical}`;
        }
        row += ' '.repeat(cellWidth) + vertical + "\n";
        currentMinutes += 15;
        if (currentMinutes%60 === 0) {
            currentMinutes = 0;
            currentHour += 1;
        }
        rows.push(row);
    }

    const line = vertical + horizontal.repeat(timeWidth + cellWidth + 1) + vertical + "\n";

    const table = [
        "```\n",
        leftUpCorner + horizontal.repeat(timeWidth + cellWidth + 1) + rightUpCorner + "\n",
        rows.join(line),
        leftDownCorner + horizontal.repeat(timeWidth + cellWidth + 1) + rightDownCorner + "\n",
        "```",
    ].join("");

    return table;
}

function alignStart(time) {
    const [ hour, minutes ] = time.split(":");

    if (minutes === "15") {
        return [+ hour, 0];
    } else if (minutes === "45") {
        return [+ hour, 30];
    } else {
        return [+ hour, + minutes];
    }
}

function alignEnd(time) {
    const [ hour, minutes ] = time.split(":");

    if (minutes === "15") {
        return [+ hour, 30];
    } else if (minutes === "45") {
        return [(+ hour) + 1, 0];
    } else {
        return [+ hour, + minutes];
    }
}