/* home.js
    Implements the home command. This sets a particular channel in a guild as the "home" channel.
    This channel can be used to designate a specific location for the bot to operate in.
*/

const { MessageEmbed, Permissions } = require('discord.js');
const { setHomeChannel } = require('../util/guilds');
const content = require('../util/content');

module.exports = async (interaction) => {
    const permissions = interaction.memberPermissions
    if (!permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        const { title, body } = content.insufficientpermissions;
        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(body);
        await interaction.reply({ embeds: [embed] });
        return;
    }
    setHomeChannel(interaction.guildId, interaction.channelId);

    const { title, body } = content.home;
    const embed = new MessageEmbed()
        .setTitle(title)
        .setDescription(body);

    await interaction.reply({ embeds: [embed] });
}