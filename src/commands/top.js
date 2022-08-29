const { MessageEmbed } = require('discord.js');
const { isHomeSet, getGuildMembers } = require('../util/homeguilds');
const { getStats, makeLeaderboard, getWordles } = require('../util/wordletools');
const { format } = require('../util/util');
const config = require("../config.json");
const content = require('../util/content');

const STAT_INFO = {
    gperw: {
        comparisonProp: 'avgGuessesPerWin',
        displayProp: 'avgGuessesPerWinFixed',
        comparisonFunc: (a, b) => a < b,
        format: ' Guesses per Win',
        friendlyName: 'Guesses per Win'
    },
    wins: {
        comparisonProp: 'numWins',
        displayProp: 'numWins',
        comparisonFunc: (a, b) => a > b,
        format: ' Wins',
        friendlyName: 'Number of Wins'
    },
    numplayed: {
        comparisonProp: 'numPlayed',
        displayProp: 'numPlayed',
        comparisonFunc: (a, b) => a > b,
        format: ' Games Played',
        friendlyName: 'Games Played'
    },
    winrate: {
        comparisonProp: 'winPct',
        displayProp: 'winPct',
        comparisonFunc: (a, b) => a > b,
        format: '% Winrate',
        friendlyName: 'Winrate'
    }
};

module.exports = async (interaction) => {
    const stat = interaction.options.getString('stat') || 'gperw';
    const wordles = getWordles();
    const userId = interaction.user.id;
    const guildId = interaction.guild.id;
    const member = await interaction.guild.members.fetch(userId);
    if (!isHomeSet(interaction.guildId)) {
        const embed = new MessageEmbed()
            .setTitle(content.nohomeset.title)
            .setDescription(format(content.nohomeset.body, member.displayName));
        await interaction.reply({ embeds: [embed] });
        return;
    }
    const stats = getGuildMembers(guildId)
        .reduce((obj, id) => {
            obj[id] = getStats(wordles[id], false);
            return obj;
        }, {});
    const ids = Object.keys(stats);

    if (!ids.length) {
        const embed = new MessageEmbed()
            .setTitle(format(content.top.title, STAT_INFO[stat].friendlyName))
            .setDescription(content.top.nowordle);
        await interaction.reply({ embeds: [embed] });
        return;
    }

    let i = ids.length;
    while (i--) {
        let failedFetch;
        try {
            await interaction.guild.members.fetch(ids[i]);
            failedFetch = false;
        } catch (e) {
            failedFetch = true;
        }
        if (failedFetch) { 
            ids.splice(i, 1);
        } 
    }
    
    ids.sort((id1, id2) => {
        const statName = STAT_INFO[stat].comparisonProp;
        if (stats[id1][statName] === stats[id2][statName]) {
            return 0;
        }
        if (STAT_INFO[stat].comparisonFunc(stats[id1][statName], stats[id2][statName])) {
            return -1;
        } else {
            return 1;
        }
    });
    
    let rankings = [1];
    ids.map(id => stats[id])
        .reduce((prev, curr) => {
            const statName = STAT_INFO[stat].comparisonProp;
            const prevRank = rankings[rankings.length - 1];
            if (prev[statName] === curr[statName]) {
                rankings.push(prevRank);
            } else {
                rankings.push(prevRank + 1);
            }
            return curr;
        });
    
    if (rankings.length < config.leaderboard_length) {
        const paddingAmount = config.leaderboard_length - rankings.length;
        const last = rankings[rankings.length - 1];
        for (let i = 1; i <= paddingAmount; i++) {
            rankings.push(last + i);
        }
    }

    rankings = rankings.slice(0, config.leaderboard_length);
    let leaderboard = [];
    let index = 0;
    for (let id of ids) {
        let member;
        try {
            member = await interaction.guild.members.fetch(id);
        } catch (e) {
            continue;
        }
        
        if (rankings[index] === undefined) {
            continue;
        }
        
        const entry = {
            displayName: member.displayName,
            username: '(' + member.user.username + '#' + member.user.discriminator + ')',
            value: stats[id][STAT_INFO[stat].displayProp].toString() + STAT_INFO[stat].format,
            rank: rankings[index]
        };
        leaderboard.push(entry);
        index++;
    }

    if (leaderboard.length < config.leaderboard_length) {
        const paddingAmount = config.leaderboard_length - leaderboard.length;
        for (let i = leaderboard.length; i <= paddingAmount; i++) {
            leaderboard.push({
                displayName: '-',
                username: '',
                value: '',
                rank: rankings[i]
            });
        }
    }
    
    if (leaderboard.length > config.leaderboard_length) {
        leaderboard = leaderboard.slice(0, config.leaderboard_length);
    }

    const strLeaderboard = makeLeaderboard(leaderboard);

    const embed = new MessageEmbed()
        .setTitle(format(content.top.title, STAT_INFO[stat].friendlyName))
        .setDescription(strLeaderboard);

    await interaction.reply({ embeds: [embed] });
};