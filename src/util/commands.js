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

const alextwitter = require("../commands/alextwitter");
const notimplemented = require("../commands/notimplemented");

require('dotenv').config()

COMMANDS_MAPPING = {
    'alextwitter': alextwitter,
    '69thtweet': notimplemented,
};

COMMANDS_JSON = [
    new SlashCommandBuilder()
        .setName('alextwitter')
        .setDescription('Random funny tweet from our favorite funny man')
        .toJSON(),
];

const refreshCommandsIfNeeded = async (token, client) => {
    if (!config.refresh_commands) return;
    if (!process.env.DEBUG_GUILD) {
        log.error(`The provided debug guild ID is invalid: ${process.env.DEBUG_GUILD}`);
        log.error(`Please check the .env file and try again. Consult the README for more info about the debug guild ID.`);
        return;
    }
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
    alextwitter, 
    notimplemented
}