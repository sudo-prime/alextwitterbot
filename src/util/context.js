/* context.js
    Implements methods which serialize objects to a context file on your computer. Used to keep track
    of bot data that should persist even while the bot is offline. Context is divided into "slices" with
    string names, which are mapped to any value you choose.
*/

const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const config = require('../config.json');
const log = require('./log');

const getContext = () => {
    const filePath = config.debug ? config.debug_path : config.context_path;
    const fullPath = path.resolve(__dirname + filePath);
    const folderPath = path.resolve(__dirname + filePath + '/..');
    if(!fs.existsSync(folderPath)) {
        log.info("No context folder was found. Creating one...");
        try {
            fs.mkdirSync(folderPath);
        } catch (error) {
            console.error("An error was encountered while creating the context folder");
            throw error;
        }
    }
    if(!fs.existsSync(fullPath)) {
        log.info("No context file was found.");
        fs.appendFileSync(fullPath, '{}', function (writeError) {
            if (writeError) {
                log.error("There was a problem creating the context file.");
                log.error(writeError);
                throw writeError;
            }
        });
        log.info(`A new context file was created at ${fullPath}.`);
        return {};
    }
    try {
        const file = fs.readFileSync(fullPath);
        return JSON.parse(file);
    } catch (readError) {
        log.error(`An error was encountered reading the context file at ${fullPath}`);
        log.error(readError);
        throw readError;
    }
}

const setContext = (context) => {
    const filePath = config.debug ? config.debug_path : config.context_path;
    const out = JSON.stringify(context);
    try {
        fs.writeFileSync(__dirname + filePath, out);
    } catch (writeError) {
        log.error("There was a problem serializing context to disk.")
        log.error(writeError);
        throw writeError;
    }
}

const setContextSlice = (path, slice) =>  {
    const context = getContext();
    _.set(context, path, slice);
    setContext(context);
}

module.exports = {
    getContext,
    setContext, 
    setContextSlice
}
