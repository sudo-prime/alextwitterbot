/* alextwitter.js
    Grabs a tweet URL from a JSON list of tweets and replies to the interaction with it.
*/
const fs = require('fs');
const path = require('path');
const { nthString } = require('../util/misc');

module.exports = async (interaction) => {
    const dataPath = '/../data.json';
    const fullPath = path.resolve(__dirname + dataPath);
    const file = fs.readFileSync(fullPath);
    const jsonData = JSON.parse(file);
    const numTweets = jsonData.length;
    const tweetNumber = Math.floor(Math.random() * numTweets); // 1388
    const nthTweet = numTweets - tweetNumber;
    const tweet = jsonData[tweetNumber];
    const tweetUrl = tweet.url;
    if (nthTweet === 69) {
        await interaction.reply(`This is alex's MOSTEST EPICEST tweet: ` + tweetUrl);
        return;
    }
    await interaction.reply(`This is alex's ${nthString(nthTweet)} tweet: ` + tweetUrl);
}

