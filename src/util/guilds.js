const { getContext, setContextSlice } = require('./context');

const setHomeChannel = (guildId, channelId) => {
    const context = getContext();
    if (context.homeChannels === undefined) {
        context.homeChannels = {};
    }
    context.homeChannels[guildId] = channelId;
    setContextSlice('homeChannels', context.homeChannels);
}

const getHomeChannel = (guildId) => {
    const context = getContext();
    if (context.homeChannels === undefined) {
        context.homeChannels = {};
        setContextSlice('homeChannels', context.homeChannels);
    }
    return context.homeChannels[guildId];
}

const saveGuildMember = (guildId, userId) => {
    const context = getContext();
    if (context.guildMembers === undefined) {
        context.guildMembers = {};
    }
    if (context.guildMembers[guildId] === undefined) {
        context.guildMembers[guildId] = [];
    }
    if (!context.guildMembers[guildId].includes(userId)) {
        context.guildMembers[guildId].push(userId);
    }
    setContextSlice('guildMembers', context.guildMembers);
}

module.exports = {
    setHomeChannel,
    getHomeChannel,
    saveGuildMember
}