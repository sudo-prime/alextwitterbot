const { MessageEmbed } = require('discord.js');
const { isHomeSet, isGuildMember } = require('../util/homeguilds');
const { generateScoresGraph, getTodaysWordle, getWordles } = require('../util/wordletools');
const { format } = require('../util/util');
const config = require("../config.json");
const content = require('../util/content');

module.exports = async (interaction) => {
    const wordles = getWordles();
    const userId = interaction.user.id;
    const member = await interaction.guild.members.fetch(userId);
    if (!isHomeSet(interaction.guildId)) {
        const embed = new MessageEmbed()
            .setTitle(content.nohomeset.title)
            .setDescription(format(content.nohomeset.body, member.displayName))
        await interaction.reply({ embeds: [embed] });
        return;
    }
    const wordleNum = getTodaysWordle();
    const todayScores = Object.keys(wordles)
        .filter(id => isGuildMember(id, interaction.guild.id))
        .filter(id => wordles[id] !== undefined)
        .filter(id => wordles[id][wordleNum] !== undefined)
        .map(id => wordles[id][wordleNum]);
    if (todayScores.length === 0) {
        const embed = new MessageEmbed()
            .setTitle(format(content.recap.title, wordleNum))
            .setDescription(content.recap.nowordle);
        await interaction.reply({ embeds: [embed] });
        return;
    }
    const wonGames = todayScores
        .filter((score) => score !== config.lose_score);
    const avgGuessesPerWin = (wonGames
        .reduce((a, b) => a + b, 0) 
        / wonGames.length).toFixed(2);
    const winPct = Math.floor((wonGames.length / todayScores.length) * 100);
    const distribution = [1, 2, 3, 4, 5, 6].map(numGuesses => 
        todayScores
            .filter(score => score === numGuesses)
            .length
    )
    const graph = generateScoresGraph(distribution);
    const embed = new MessageEmbed()
        .setTitle(format(content.recap.title, wordleNum))
        .setDescription(format(content.recap.body, todayScores.length, winPct, avgGuessesPerWin, graph));
    await interaction.reply({ embeds: [embed] });
};