#!/usr/bin/env node
const https = require('https');
const util = require('util');
const readline = require('readline');
const exec = util.promisify(require('child_process').exec);

const constants = require('./constants.json');

function inquire(text, os) {
    const options = {
        hostname: 'sem-cli.herokuapp.com',
        method: 'GET',
        path: '/inquire?q=' + text + '&os=' + os
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                try {
                    // if response don't have necessary fields return error
                    let data = JSON.parse(chunk);
                    if (!data.command || !data.danger_level) {
                        reject(constants.NO_RESPONSE);
                        req.end();
                        return;
                    }
                    resolve(data);
                } catch (err) {
                    reject(constants.NO_RESPONSE);
                    req.end();
                    return;
                }
            });
        });

        req.on('error', (err) => {
            reject(err.message);
        });

        req.end();
    });
}

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
        //run the command
        if (result.danger_level !== 'high') {
            const { stdout, stderr } = await exec(`${result.command} ${params.join(' ')}`);
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

            rl.question(`Are you sure to run: ${result.command} ? (type 'y' for yes, 'n' for no)\n`, async (answer) => {
                if (answer === 'y' || answer === 'Y') {
                    const { stdout, stderr } = await exec(`${result.command} "${params.join(' ')}"`);
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
