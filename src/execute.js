#!/usr/bin/env node
const util = require('util');
const readline = require('readline');
const exec = util.promisify(require('child_process').exec);
const constants = require('./constants.json');
const inquire = require('./inquire');

async function execReq() {
    // get the command parameters
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
        // send request to sem-cli server
        const { command, dangerLevel } = await inquire(messages.join(' '), os);
        // run the command
        if (dangerLevel !== 'high') {
            const { stdout, stderr } = await exec(`${command} ${params.join(' ')}`);
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.error(stderr);
            }
        } else {
            const rl = readline.createInterface({
                input: process.stdin,
                output: process.stdout
            });

            rl.question(`Are you sure to run: ${command} ? (type 'y' for yes, 'n' for no)\n`, async function (answer) {
                if (answer === 'y' || answer === 'Y') {
                    const { stdout, stderr } = await exec(`${command} "${params.join(' ')}"`);
                    if (stdout) {
                        console.log(stdout);
                    }
                    if (stderr) {
                        console.error(stderr);
                    }
                }
                rl.close();
            });
        }
    } catch (err) {
        console.error(err);
    }
}
// execute the request
execReq();
