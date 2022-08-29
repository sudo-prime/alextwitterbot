module.exports = {
    info: {
        description: 'Information regarding how to use WordleBot.',
        title: 'WordleBot Info',
        body: 'To enable WordleBot, first use the /home command to designate the wordle home channel. Then, after playing a game of wordle, click the "Share" button to copy the results of that game into your clipboard. Paste that into your designated wordle home channel to let your friends know how you did. WordleBot will save that the outcome of that game and enable you to use commands to generate statistics about your cumulative performance!'
    },
    home: {
        title: 'Success!',
        body: 'WordleBot will monitor this channel for wordle scores.',
        description: 'Designate this channel for saving wordle scores.'
    },
    stats: {
        title: 'Statistics for **{0}** ({1})',
        body: '**{0}** Games Played\n**{1}%** Winrate\n**{2}** Current Streak\n**{3}** Average Guesses per Win\n\n**Guess Distribution**\n{4}',
        nowins: '**{0}** Games Played\n**0%** Winrate\n**0** Current Streak\nNo wins yet!',
        description: 'Get your very own wordle scores.',
        nowordle: '**{0}**, you haven\'t saved any wordle scores yet.',
    },
    top: {
        title: 'Server rankings for **{0}**',
        description: 'View the top wordle rankings by a stat of your choosing. (default: guesses per win)',
        nowordle: 'Nobody has sent a wordle yet!'
    },
    heatmap: {
        description: 'View a heatmap of daily wordle performance.'
    },
    delete: {
        title: 'Success',
        body: 'The score for wordle {0} was deleted.',
        description: 'Delete the score for a particular wordle.',
        nowordle: 'You don\'t have a score saved for that wordle.'
    },
    recap: {
        description: 'View a recap of today\'s wordle scores.',
        nowordle: 'Nobody has played today\'s wordle yet!',
        title: 'Recap for Wordle {0}',
        body: '**{0}** Games Played\n**{1}%** Winrate\n**{2}** Average Guesses per Win\n\n**Guess Distribution**\n{3}',
    },
    nohomeset: {
        body: '**{0}**, no wordle home channel has been set for this server yet. Use `/home` to designate this channel as the wordle home channel.',
        title: 'No wordle home!'
    },
    notimplemented: {
        title: 'Not implemented yet :\'(',
        body: 'Have you tried waiting?'
    },
    insufficientpermissions: {
        title: 'Insufficient Permissions',
        body: 'Using this command requires the `MANAGE_CHANNELS` permission.'
    }
};