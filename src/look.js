#!/usr/bin/env node
const constants = require('./constants.json');
const inquire = require('./inquire');

async function execReq() {
    // get command parameters
    const [, , ...args] = process.argv;
    const os = process.platform;

    if (!args && !os) {
        console.error(constants.MISSING_PARAM);
        return;
    }

    try {
        let messages = [],
            params = [];
        // seperate messages and parameters
        for (let item of args) {
            if (item.match(/p=/g)) {
                params.push(item.substring(2));
            } else {
                messages.push(item);
            }
        }
        // send request to sem-cli-server
        let result = await inquire(messages.join('-'), os);
        // show the command
        console.log(`Your command: "${result.command} ${params.join(' ')}" with danger level: "${result.danger_level}"`);
    } catch (err) {
        console.error(err);
    }
}
// execute the request
execReq();
