const { MessageEmbed } = require('discord.js');
const content = require('../util/content');

module.exports = async (interaction) => {
    const embed = new MessageEmbed()
        .setTitle(content.info.title)
        .setDescription(content.info.body);
    await interaction.reply({ embeds: [embed] });
}