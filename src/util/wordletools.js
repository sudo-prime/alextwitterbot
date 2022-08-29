const config = require("../config.json");
const { saveGuildMember } = require('./homeguilds');
const { format } = require("./util");
const fs = require('fs');
const log = require('simple-node-logger')
    .createSimpleFileLogger(config.log_path);

const getTodaysWordle = () => {
    const date1 = new Date("6/19/2021");
    const date2 = new Date(Date.now());
    date2.setHours(date2.getHours() - 5);

    // One day in milliseconds
    const oneDay = 1000 * 60 * 60 * 24;

    // Calculating the time difference between two dates
    const diffInTime = date2.getTime() - date1.getTime();

    // Calculating the no. of days between two dates
    const diffInDays = Math.floor(diffInTime / oneDay);

    return diffInDays;
};

const isWordle = (message) => {
    const regx = /Wordle \d{3} \d\/6|Wordle \d{3} X\/6/g;
    return regx.test(message.content);
};

const parseWordleNumber = (message) => {
    const regx = /\d{3}/g;
    return message.content.match(regx);
};

const parseWordleScore = (message) => {
    const scoreRegx = /\d\/6|X\/6/g;
    const scoreStr = message.content.match(scoreRegx);
    if (!scoreStr) return;
    const digiRegx = /^\d|X/g;
    const scoreNumStr = scoreStr[0].match(digiRegx);
    if (!scoreNumStr) return;
    if (scoreNumStr == 'X') return config.lose_score;
    return parseInt(scoreNumStr);
};

const generateScoresGraph = (distribution) => {
    const max = Math.max(...distribution);
    if (max === 0) return "";
    let graph = "```";
    for (let numGuesses = 1; numGuesses <= 6; numGuesses++) {
        const portionFilledIn = distribution[numGuesses - 1] / max;
        const numCharsFilledIn = Math.ceil(portionFilledIn * config.score_graph_width);
        graph = graph 
            + `${numGuesses} `
            + config.score_graph_char
            + config.score_graph_char.repeat(numCharsFilledIn) 
            + ` ${distribution[numGuesses - 1]}`
            + '\n';
    }
    graph += "```";
    return graph;
};

const getCurrentStreak = (wordles) => {
    const wordleIds = [...Object.keys(wordles)].sort((a, b) => b - a);
    let streak = 0;
    for (let index = 0; index < wordleIds.length; index++) {
        if (wordles[wordleIds[index]] !== config.lose_score) {
            streak = streak + 1;
        } else {
            return streak;
        }
    }
    return streak;
}

const getStats = (wordles, all=true) => {
    const stats = {};
    stats.numPlayed = Object.keys(wordles).length;
    if (!stats.numPlayed) return stats;
    
    stats.wonGames = Object.values(wordles)
        .filter((score) => score !== config.lose_score);
    stats.numWins = stats.wonGames.length;
    stats.winPct = Math.floor((stats.numWins / stats.numPlayed) * 100);
    stats.avgGuessesPerWin = stats.wonGames
        .reduce((a, b) => a + b, 0) 
        / stats.numWins;
    stats.avgGuessesPerWinFixed = stats.avgGuessesPerWin.toFixed(2);
    if (!all) return stats;

    stats.distribution = [1, 2, 3, 4, 5, 6].map(numGuesses => 
        Object.values(wordles).filter(result => result === numGuesses).length
    )
    stats.graph = generateScoresGraph(stats.distribution);
    stats.currentStreak = getCurrentStreak(wordles);
    return stats;
}

const makeLeaderboard = (leaderboard) => {
    let str = "```\n";
    const medals = {
        '1': '🥇 ',
        '2': '🥈 ',
        '3': '🥉 ',
    };
    for (const entry of leaderboard) {
        const symbol = [1, 2, 3].includes(entry.rank) ? medals[entry.rank.toString()] : ' ' + entry.rank.toString() + '. ';
        const formatTxt = format("{0} {1} {2} {3}", symbol, entry.displayName, entry.username, entry.value)
        let paddingAmount = config.score_graph_width - formatTxt.length;
        paddingAmount = paddingAmount < 0 ? 0 : paddingAmount;
        str = str 
            + formatTxt
            + ' '.repeat(paddingAmount)
            + '\n';
    }
    str = str + '```';
    return str;
}

const getWordles = () => {
    try {
        const path = config.debug ? config.debug_path : config.wordle_path;
        const wordles = JSON.parse(fs.readFileSync(__dirname + path, 'utf-8'));
        return wordles;
    } catch (error) {
        log.error("Error retrieving wordles: ");
        log.error(error);
        return {};
    }
}

const saveWordle = async (message) => {
    const wordles = getWordles();
    const wordleId = parseWordleNumber(message);
    const userId = message.author.id;
    const guildId = message.guildId;

    if (message.channel.isThread()) {
        if (message.channel.archived) return;
    }
    if (!wordles[userId]) {
        wordles[userId] = {};
    }
    if (wordles[userId][wordleId]) {
        // User already has a wordle saved
        return;
    }

    const score = parseWordleScore(message);
    const path = config.debug ? config.debug_path : config.wordle_path;
    wordles[userId][wordleId] = score;
    fs.writeFile(__dirname + path, JSON.stringify(wordles), (error) => {
        if (error) {
            log.error(`Error saving wordle for user ${message.author.username} with content ${message.content}`);
            log.error(error);
            console.error(`Error saving wordle for user ${message.author.username}`);
            console.error(error);
            throw error;
        }
    });
    saveGuildMember(userId, guildId);
    log.info(`Wordle saved for user ${message.author.username}`);
    console.log(`Wordle saved for user ${message.author.username}`);
    try {
        await message.react('✅');
    } catch (error) {
        console.error(`Error encountered reacting to Wordle for ${message.author.username}`);
        console.error(error);
        log.error(`Error encountered reacting to Wordle for ${message.author.username}`);
        log.error(error);
    }
}

const deleteWordle = async (userId, wordleId) => {
    const wordles = getWordles();

    if (!wordles[userId]) {
        wordles[userId] = {};
    }
    if (!wordles[userId][wordleId]) {
        // User has no wordle saved
        return;
    }
    wordles[userId][wordleId] = undefined;
    const path = config.debug ? config.debug_path : config.wordle_path;
    fs.writeFile(__dirname + path, JSON.stringify(wordles), (error) => {
        if (error) {
            log.error(`Error saving wordles after deleting one:`);
            log.error(error);
            console.error(`Error saving wordles after deleting one:`);
            console.error(error);
            throw error;
        }
    });
    console.log(`Wordle deleted for user with id ${userId}`);
    log.info(`Wordle deleted for user with id ${userId}`);
}

module.exports = {
    getTodaysWordle,
    isWordle,
    parseWordleNumber,
    parseWordleScore,
    generateScoresGraph,
    getCurrentStreak,
    getStats,
    makeLeaderboard,
    getWordles,
    saveWordle,
    deleteWordle
}