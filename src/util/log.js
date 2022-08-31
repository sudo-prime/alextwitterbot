
const config = require('../config.json');
const log = require('simple-node-logger')
    .createSimpleFileLogger(__dirname + config.log_path);

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