const fetch = require("node-fetch");
const {JSDOM} = require("jsdom");
const {MessageEmbed} = require("discord.js");
const {scheduleIcon} = require("../assets/urls.json");
const {backend, prefix} = require("../config.json");

const dayMapping = new Map([
    ["monday", "poniedziałek"],
    ["tuesday", "wtorek"],
    ["wednesday", "środa"],
    ["thursday", "czwartek"],
    ["friday", "piątek"],
    ["saturday", "sobota"],
    ["sunday", "niedziela"]
]);

module.exports = {
    name: "schedule",
    description: "sprawdzam/wyświetlam plan",
    details: "mogę sprawdzić ostatnią aktualizację planu na stronie wydziału " +
        "oraz wyświetlić zapisany w bazie plan zajęć na dany dzień dla całej lub połowy grupy\n\n" +
        `np. \`${prefix} schedule show monday grupa2\`\n` +
        `lub \`${prefix} schedule show tuesday grupa2 2\``,
    usage: `\`${prefix} schedule check\`\n` +
        `\`${prefix} schedule show <monday|tuesday|...> <group> [<subgroup>]\``,
    execute: commandHandler
}

async function commandHandler(message, args) {

    // usunięcie nazwy komendy z listy
    args.shift();

    const subcommand = args[0];

    if (subcommand === "check") {

        const response = await fetch("https://it.pk.edu.pl/?page=rz").catch(() => null);
        if (!response) {
            message.channel.send("Fetch from website error.");
            return;
        }
        const text = await response.text();

        const parser = new JSDOM(text);
        const parsedDocument = parser.window.document;

        const div = parsedDocument.querySelectorAll("div.alert.readmetxt.alert-white")[0];
        const link = div.querySelector("a");
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

        const {code, response} = await fetch(backend + "/getScheduleForGroup", {
            method: "POST",
            body: JSON.stringify(data)
        }).then(response => {
            return response.json()
        }).catch(() => {
            return {
                code: "-1",
                response: {}
            }
        });

        if (code === "-1") {
            message.channel.send("Fetch from database error.");
            return;
        }

        if (code !== "200") {
            message.channel.send("Backend error. " + response);
            return;
        }

        if (group === "experimental") {
            message.channel.send(generateTable(response.schedule));
            return;
        }

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

    } else {
        message.channel.send(`Nieznana podkomenda \`${subcommand}\``);
    }

}

// experimental
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