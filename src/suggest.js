#!/usr/bin/env node
const https = require('https');

const constants = require('./constants.json');

function suggest(intent, command, os, dangerLevel) {
    const postData = JSON.stringify({
        intent: intent,
        command: command,
        os: os,
        dangerLevel: dangerLevel
    });

    const options = {
        hostname: 'sem-cli.herokuapp.com',
        method: 'POST',
        path: '/suggest',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            if (res.statusCode === 200) {
                // send server response
                res.on('data', (chunk) => {
                    resolve(chunk);
                });
            } else {
                reject(constants.ERROR);
            }
        });

        req.on('error', (err) => {
            reject(err.message);
        });

        req.write(postData);
        req.end();
    });
}

async function execReq() {
    //regex definitions
    const intentRegex = /^intent=(.*?)$/g;
    const commandRegex = /^command=(.*?)$/g;
    const dangerLevelRegex = /^dangerLevel=(.*?)$/g;

    // get command parameters
    const [, , ...args] = process.argv;
    const os = process.platform;

    if (!args || args.length !== 3 || !os) {
        console.error(constants.MISSING_EMPTY_PARAM);
        return;
    }

    try {
        // prepare suggestion parameters
        let intent = intentRegex.exec(args[0])[1];
        let command = commandRegex.exec(args[1])[1];
        let dangerLevel = dangerLevelRegex.exec(args[2])[1];

        if (!intent || !command || !dangerLevel) {
            console.error(constants.MISSING_EMPTY_PARAM);
            return;
        }
        // send request to sem-cli-server
        let result = await suggest(intent, command, os, dangerLevel.toLowerCase());
        console.log(result);
    } catch (err) {
        console.error(constants.ERROR);
    }
}
// execute the request
execReq();
