const fs = require('fs');
const _ = require('lodash');
const config = require('../config.json');

const getContext = () => {
    const filePath = config.debug ? config.debug_path : config.context_path;
    const file = fs.readFileSync(__dirname + filePath);
    return JSON.parse(file);
}

const setContext = (context) => {
    const filePath = config.debug ? config.debug_path : config.context_path;
    const out = JSON.stringify(context);
    fs.writeFileSync(__dirname + filePath, out);
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
