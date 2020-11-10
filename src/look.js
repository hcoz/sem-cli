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
        const messages = [];
        const params = [];
        // seperate messages and parameters
        for (let item of args) {
            if (item.match(/p=/g)) {
                params.push(item.substring(2));
            } else {
                messages.push(item);
            }
        }
        // send request to sem-cli-server
        const result = await inquire(messages.join(' '), os);
        // show the command
        let { command } = result;
        if (params.length > 0) {
            command += ` ${params.join(' ')}`;
        }
        console.log(`Your command: "${command}" with danger level: "${result.dangerLevel}" for your current operating system.`);
    } catch (err) {
        console.error(err);
    }
}
// execute the request
execReq();
