/* bot.js
    The main bot script. Logs in with a token, then listens for interactions.
*/

require('dotenv').config()

const { Client } = require('discord.js');

const { COMMANDS_MAPPING, init } = require('./util/commands');
const { saveGuildMember } = require('./util/guilds');
const fs = require('fs');
const path = require('path');
const log = require('./util/log');
const config = require('./config.json');

const token = config.debug ? process.env.DEBUG : process.env.TOKEN;

const client = new Client({ 
    intents: []
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
    if (!interaction.guildId) return;
    if (!Object.keys(COMMANDS_MAPPING).includes(interaction.commandName)) return;

    const command = interaction.commandName;
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const member = await interaction.guild.members.fetch(userId);

    log.info(`Responding to /${command} for user ${member.displayName}`);

    try {
        saveGuildMember(guildId, userId);
        await COMMANDS_MAPPING[command](interaction);
    } catch (error) {
        log.error(`Error thrown responding to /${command} for user ${member.displayName}`);
        log.error(error);
    }
});

client.once('ready', async () => {
	log.info('Connected successfully.');
    await init(token, client);
});

process.on('uncaughtException', (error) => {
    log.error(error);
    if (config.debug) process.exit(1);
});

const resolvedEnvPath = path.resolve(__dirname + '/../.env');
if (!fs.existsSync(resolvedEnvPath)) {
    log.error(`No .env file has been found at ${resolvedEnvPath}`);
    log.error('This file is necessary to run the bot. Please read the README for more information about creating this file.');
    throw new Error(`No .env file found at ${resolvedEnvPath}`);
}
if (!token) {
    log.error(`The provided authentication token is invalid.`);
    log.error('Please check the .env file and try again.');
    throw new Error(`Invalid authentication token provided`);
}

try {
    client.login(token);
} catch (error) {
    log.error("An error occurred while trying to log in:");
    log.error(error);
}