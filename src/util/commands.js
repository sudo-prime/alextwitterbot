/* commands.js
    Utilizes the discord REST API to update slash commands. 
    Maps the names of commands to their implementations.
*/

const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const log = require('./log');
const content = require('./content');
const config = require('../config.json');

const home = require("../commands/home");
const info = require("../commands/info");
const notimplemented = require("../commands/notimplemented");

require('dotenv').config()

COMMANDS_MAPPING = {
    'home': home,
    'info': info,
};

COMMANDS_JSON = [
    new SlashCommandBuilder()
        .setName('home')
        .setDescription(content.home.description)
        .toJSON(),
    new SlashCommandBuilder()
        .setName('info')
        .setDescription(content.info.description)
        .toJSON(),
    // Here's an example of a more complex command
    // new SlashCommandBuilder()
    //     .setName('top')
    //     .setDescription(content.top.description)
    //     .addStringOption(option =>
    //         option.setName('stat')
    //             .setDescription('Which stat to rank by')
    //             .setRequired(false)
    //             .addChoice('Guesses per Win', 'gperw')
    //             .addChoice('Number of Wins', 'wins')
    //             .addChoice('Games Played', 'numplayed')
    //             .addChoice('Winrate', 'winrate'))
    //     .toJSON(),
];

const refreshCommandsIfNeeded = async (token, client) => {
    if (!config.refresh_commands) return;
    log.info("Refreshing commands...");
    const rest = new REST({ version: '9' }).setToken(token);
    const command = config.debug ? Routes.applicationGuildCommands : Routes.applicationCommands;
    const args = config.debug ? [client.user.id, process.env.DEBUG_GUILD] : [client.application.id];
    try {
        await rest.put(command(...args), { body: COMMANDS_JSON });
        log.info('Successfully reloaded slash commands.');
    } catch (error) {
        log.error(error);
    }
};

const init = async (token, client) => {
    await refreshCommandsIfNeeded(token, client);
}

module.exports = {
    init,
    COMMANDS_MAPPING,
    home, 
    info,
    notimplemented
}