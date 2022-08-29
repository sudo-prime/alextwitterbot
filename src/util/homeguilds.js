const fs = require('fs');
const config = require('../config.json');

const getChannels = () => {
    const file = fs.readFileSync(config.homeguilds_path);
    return JSON.parse(file);
}

const getUsers = () => {
    const file = fs.readFileSync(config.users_path);
    return JSON.parse(file);
}

const isHomeSet = (guildId) => {
    const parsed = getChannels();
    return parsed[guildId] !== undefined;
}

const getChannel = (guildId) => {
    const parsed = getChannels();
    return parsed[guildId];
}

const setChannel = (guildId, channelId) => {
    const parsed = getChannels();
    parsed[guildId] = channelId;
    const out = JSON.stringify(parsed);
    fs.writeFileSync(config.homeguilds_path, out);
}

const isGuildMember = (userId, guildId) => {
    const parsed = getUsers();
    if (parsed[guildId] === undefined) {
        parsed[guildId] = [];
    }
    if (parsed[guildId].length === 0) {
        return false;
    }
    return parsed[guildId].includes(userId);
}

const saveGuildMember = (userId, guildId) => {
    const parsed = getUsers();
    if (parsed[guildId] === undefined) {
        parsed[guildId] = [];
    }
    if (parsed[guildId].includes(userId)) {
        return;
    }
    parsed[guildId].push(userId);
    const out = JSON.stringify(parsed);
    fs.writeFileSync(config.users_path, out);
}

const getGuildMembers = (guildId) => {
    const parsed = getUsers();
    if (parsed[guildId] === undefined) {
        parsed[guildId] = [];
    }
    return parsed[guildId];
}

module.exports = {
    getUsers,
    getChannels, 
    getChannel, 
    isHomeSet, 
    setChannel,
    isGuildMember,
    saveGuildMember,
    getGuildMembers
}
