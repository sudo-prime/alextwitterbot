/* info.js
    Implements the info command, which replies with a message containing details about the bot.
*/

const { MessageEmbed } = require('discord.js');
const content = require('../util/content');

module.exports = async (interaction) => {
    const { title, body } = content.info;
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(body);
    await interaction.reply({ embeds: [embed] });
}