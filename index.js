'use strict';

/*
 * Imports
 */
const discord = require('discord.js');
const nconf = require('nconf');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

if (!fs.existsSync("./SnoreToast.exe")) {
    console.log("Downloading SnoreToast.exe...");
    require('./toast_install.js').install();
}

const snore = path.join(__dirname, "SnoreToast.exe");
const bot = new discord.Client();
nconf.file({ file: './config.json' });

/*
 * Discord events 
 */

bot.on('message', async message => {
    // Private messages
    if (message.channel.type === "dm") {
        notification("DM from " + message.author.username, message.content);
    }
    // Mentions
    if (await message.isMentioned(bot.user) || message.content.toLowerCase().indexOf(bot.user.username.toLowerCase()) >= 0) {
        notification("Mentioned by " + message.author.username, message.content.replace(`<@${bot.user.id}>`, `@${bot.user.username}`));
    }
    // TODO: Look for keywords
});

bot.on('ready', async () => {
    console.log("Connected to Discord");
});

/*
 * Functions 
 */

async function notification() {
    let title = (arguments.length > 1 ? arguments[0] : null).replace("\\", "");
    let body = (arguments.length > 1 ? arguments[1] : arguments[0]).replace("\\", "");
    exec(`${snore} -t "${title}" -m "${body}"`, (err, stdout, stderr) => {
        if (err) {
            console.log(`Failed to notify, error: ${stderr}`);
            return;
        }
    });
}

if (getVar("token") === "<token>") {
    return console.log("Please enter your Discord token in the config.json file.");
}
 
bot.login(getVar("token"));

/*
 * Config
 */

function setVar(key, value) {
    nconf.set(key, value);
    nconf.save();
}

function getVar(key) {
    return nconf.get(key);
}