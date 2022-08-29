require('dotenv').config()

const { Client, Intents } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const { SlashCommandBuilder } = require('@discordjs/builders');
const { home, recap, stats, top, info, notimplemented, delete_ } = require('./util/commands');
const { isWordle, saveWordle } = require('./util/wordletools');
const { getChannel, isHomeSet, saveGuildMember } = require('./util/homeguilds');

const log = require('simple-node-logger')
    .createSimpleFileLogger(__dirname + '/log/wordlebot.log');
const config = require('./config.json');
const content = require('./util/content');

const token = config.debug ? process.env.DEBUG : process.env.TOKEN;

const client = new Client({ 
    intents: [
        Intents.FLAGS.GUILDS, 
        Intents.FLAGS.GUILD_MESSAGES, 
        Intents.FLAGS.GUILD_MEMBERS
    ]
});

COMMANDS_MAPPING = {
    'home': home,
    'stats': stats,
    'top': top,
    'recap': recap,
    'info': info,
    'heatmap': notimplemented,
    'delete': delete_
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
    new SlashCommandBuilder()
        .setName('recap')
        .setDescription(content.recap.description)
        .toJSON(),
    new SlashCommandBuilder()
        .setName('stats')
        .setDescription(content.stats.description)
        .toJSON(),
    new SlashCommandBuilder()
        .setName('heatmap')
        .setDescription(content.heatmap.description)
        .toJSON(),
    new SlashCommandBuilder()
        .setName('delete')
        .setDescription(content.delete.description)
        .addIntegerOption(option =>
            option.setName('wordle')
                .setDescription('The wordle to delete')
                .setRequired(true))
        .toJSON(),
    new SlashCommandBuilder()
        .setName('top')
        .setDescription(content.top.description)
        .addStringOption(option =>
            option.setName('stat')
                .setDescription('Which stat to rank by')
                .setRequired(false)
                .addChoice('Guesses per Win', 'gperw')
                .addChoice('Number of Wins', 'wins')
                .addChoice('Games Played', 'numplayed')
                .addChoice('Winrate', 'winrate'))
        .toJSON(),
];

const readMessages = async () => {
    for (let guildId of client.guilds.cache.keys()) {
        if (!isHomeSet(guildId)) {
            continue;
        }

        let channel;
        try {
            const channelId = await getChannel(guildId);
            channel = await client.channels.fetch(channelId);
        } catch (error) {
            console.error(error);
            log.error(error);
            return;
        }

        const messages = await channel.messages.fetch()
        messages.reverse().each(async (message) => {
            if (isWordle(message)) {
                await saveWordle(message);
            }
        })
    }
}

const refreshCommandsIfNeeded = async () => {
    if (!config.refresh_commands) return;
    const rest = new REST({ version: '9' }).setToken(token);
    const command = config.debug ? Routes.applicationGuildCommands : Routes.applicationCommands;
    const args = config.debug ? [client.user.id, config.debug_guild_id] : client.application.id;
    try {
        await rest.put(command(...args), { body: COMMANDS_JSON });
        console.log('Successfully reloaded application (/) commands.');
        log.info('Successfully reloaded application (/) commands.');
    } catch (error) {
        console.error(error);
        log.error(error);
    }
};

client.on('messageCreate', async message => {
    if (!isHomeSet(message.guildId)) return;
    const channelId = getChannel(message.guildId);
    if (!channelId) return;
    if (message.channelId !== channelId) return;
    if (!isWordle(message)) return;
    await saveWordle(message);
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
        saveGuildMember(userId, guildId);
        await COMMANDS_MAPPING[command](interaction);
    } catch (error) {
        log.error(`Error thrown responding to /${command} for user ${member.displayName}`);
        log.error(error);
        console.log(error);
    }
});

client.once('ready', async () => {
	log.info('WordleBot connected!');
    console.log('WordleBot connected!');
    await refreshCommandsIfNeeded();
    await readMessages();
});

client.login(token);

process.on('uncaughtException', (error) => {
    log.error(error);
    console.error(error);
    process.exit(1);
});