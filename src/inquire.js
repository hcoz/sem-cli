#!/usr/bin/env node
const https = require('https');
const util = require('util');
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
    const [,, ...args] = process.argv;
    const os = process.platform;

    if (!args && !os) {
        console.error(constants.MISSING_PARAM);
        return;
    }

    try {
        // send request to sem-cli-server
        let result = await inquire(args.join('-'), os);
        //run the command
        if (result.danger_level !== 'high') {
            const { stdout, stderr } = await exec(result.command);
            if (stdout) {
                console.log(stdout);
            }
            if (stderr) {
                console.error(stderr);
            }
        } else {
            console.log(constants.ARE_YOU_SURE, result.command);
        }
    } catch (err) {
        console.error(constants.ERROR);
    }
}
// execute the request
execReq();
