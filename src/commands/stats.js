const { MessageEmbed } = require('discord.js');
const { isHomeSet } = require('../util/homeguilds');
const { getStats, getWordles } = require('../util/wordletools');
const { format } = require('../util/util');
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

    const stats = getStats(wordles[userId]);
    if (!stats.numPlayed) {
        const embed = new MessageEmbed()
            .setTitle(format(content.stats.nowordle, member.displayName))
        await interaction.reply({ embeds: [embed] });
        return;
    }
    let embed;
    if (stats.wonGames.length > 0) {
        embed = new MessageEmbed()
            .setTitle(format(content.stats.title, member.displayName, member.user.tag))
            .setDescription(format(content.stats.body, stats.numPlayed, stats.winPct, stats.currentStreak, stats.avgGuessesPerWinFixed, stats.graph));
    } else {
        embed = new MessageEmbed()
            .setTitle(format(content.stats.title, member.displayName, member.user.tag))
            .setDescription(format(content.stats.nowins, stats.numPlayed));
    }
    await interaction.reply({ embeds: [embed] });
}