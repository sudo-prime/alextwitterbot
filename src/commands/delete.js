const { MessageEmbed } = require('discord.js');
const { getWordles, deleteWordle } = require('../util/wordletools');
const { format } = require('../util/util');
const content = require('../util/content');


module.exports = async (interaction) => {
    const wordleId = interaction.options.getInteger('wordle');
    console.log(wordleId);
    const wordles = getWordles();
    const userId = interaction.user.id;

    if (!wordles[userId]) {
        wordles[userId] = {};
    }
    if (!wordles[userId][wordleId]) {
        // User has no wordle saved
        const embed = new MessageEmbed()
            .setTitle(content.delete.nowordle);
        await interaction.reply({ embeds: [embed] });
        return;
    }
    deleteWordle(userId, wordleId)
    const embed = new MessageEmbed()
        .setTitle(content.delete.title)
        .setDescription(format(content.delete.body, wordleId));
    await interaction.reply({ embeds: [embed] });
}