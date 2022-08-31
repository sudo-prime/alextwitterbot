require('dotenv').config()

const { Client } = require('discord.js');

const { COMMANDS_MAPPING, init } = require('./util/commands');
const { saveGuildMember } = require('./util/guilds');
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

client.login(token);

process.on('uncaughtException', (error) => {
    log.error(error);
    process.exit(1);
});