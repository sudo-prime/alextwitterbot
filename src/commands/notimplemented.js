const { MessageEmbed } = require('discord.js');
const content = require('../util/content');

module.exports = async (interaction) => {
    const embed = new MessageEmbed()
        .setTitle(content.notimplemented.title)
        .setDescription(content.notimplemented.body)
    await interaction.reply({ embeds: [embed] });
}