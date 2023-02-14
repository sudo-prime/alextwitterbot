/* notimplemented.js
    Implements a no-op command. You can map any command name to this, and when it is called, 
    the bot will reply with a generic message that indicates that the command hasn't been implemented yet.
*/

const { MessageEmbed } = require('discord.js');
const content = require('../util/content');

module.exports = async (interaction) => {
    const { title, body } = content.notimplemented;
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(body)
    await interaction.reply({ embeds: [embed] });
}