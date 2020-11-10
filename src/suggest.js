#!/usr/bin/env node
const https = require('https');
const constants = require('./constants.json');

const regex = {
    intent: /^intent=(.*?)$/g,
    command: /^command=(.*?)$/g,
    dangerLevel: /^dangerLevel=(.*?)$/g
};

function suggest(intent, command, os, dangerLevel) {
    const options = {
        hostname: 'sem-cli-serverless.azurewebsites.net',
        method: 'POST',
        path: '/api/suggest',
        headers: {
            'Content-Type': 'application/json'
        }
    };
    const postData = JSON.stringify({ intent, command, os, dangerLevel });

    return new Promise((resolve, reject) => {
        const req = https.request(options, function (res) {
            res.setEncoding('utf8');
            if (res.statusCode === 200) {
                // send server response
                res.on('data', function (chunk) {
                    resolve(chunk);
                });
            } else {
                reject(constants.ERROR);
            }
        });

        req.on('error', function (err) {
            reject(err.message);
        });

        req.write(postData);
        req.end();
    });
}

async function execReq() {
    // get command parameters
    const [, , ...args] = process.argv;
    const os = process.platform;

    if (!args || args.length !== 3 || !os) {
        console.error(constants.MISSING_EMPTY_PARAM);
        return;
    }

    try {
        // prepare suggestion parameters
        const intent = regex.intent.exec(args[0])[1];
        const command = regex.command.exec(args[1])[1];
        const dangerLevel = regex.dangerLevel.exec(args[2])[1];

        if (!intent || !command || !dangerLevel) {
            console.error(constants.MISSING_EMPTY_PARAM);
            return;
        }
        // send request to sem-cli-server
        const result = await suggest(intent, command, os, dangerLevel.toLowerCase());
        console.log(result);
    } catch (err) {
        console.error(constants.ERROR);
    }
}
// execute the request
execReq();
