const { MessageEmbed, Permissions } = require('discord.js');
const { setChannel } = require('../util/homeguilds');
const content = require('../util/content');

module.exports = async (interaction) => {
    const permissions = interaction.memberPermissions
    if (!permissions.has(Permissions.FLAGS.MANAGE_CHANNELS)) {
        const embed = new MessageEmbed()
            .setTitle(content.insufficientpermissions.title)
            .setDescription(content.insufficientpermissions.body);
        await interaction.reply({ embeds: [embed] });
        return;
    }
    setChannel(interaction.guildId, interaction.channelId);

    const embed = new MessageEmbed()
        .setTitle(content.home.title)
        .setDescription(content.home.body);

    await interaction.reply({ embeds: [embed] });
}