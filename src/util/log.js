/* log.js
    Simple logging util. Utilizes simple-node-logger dependency.
*/
const config = require('../config.json');
const fs = require('fs');
const path = require('path');
const logFilePath = path.resolve(__dirname + config.log_path);
const logFolderPath = path.resolve(__dirname + config.log_path + '/..');

if(!fs.existsSync(logFilePath)) {
    console.log(`No log file was found at ${logFilePath}. Creating one...`);
    if(!fs.existsSync(logFolderPath)) {
        try {
            fs.mkdirSync(logFolderPath);
        } catch (error) {
            console.error("An error was encountered while creating the log folder");
            throw error;
        }
    }
    try {
        fs.closeSync(fs.openSync(logFilePath, 'a'));
    } catch (error) {
        console.error("An error was encountered while creating the log file");
        throw error;
    }
}

const log = require('simple-node-logger')
    .createSimpleFileLogger(logFilePath);

const info = (string) => {
    console.log(string);
    log.info(string);
}

const error = (string) => {
    console.error(string);
    log.error(string);
}

module.exports = {
    info,
    error
}