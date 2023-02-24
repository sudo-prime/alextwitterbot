# boilerplatebot

Boilerplatebot is a basic discord.js bot designed to be a starting point for bot projects.

Before the bot can be started, a .env file must be created within the bot's outermost folder, just outside of /src and adjacent to this readme. The .env file should follow this format:
```
TOKEN="<bot authentication token>"
DEBUG="<a separate token for testing purposes if desired, otherwise the same as TOKEN>"
DEBUG_GUILD="<the ID of the server which you'd like to recieve instant slash command updates for testing purposes>"
```
Replace everything between the quotes with its corresponding value. All three values are required. DEBUG_GUILD can be any guild ID, and the given guild will recieve changes to slash commands nearly instantly (when running in debug mode).

To run the bot, first install its dependencies by running `npm install`. Then, run `npm run dev`.
