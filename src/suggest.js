#!/usr/bin/env node
const https = require('https');

//regex definitions
const intentRegex = /^intent=['|"](.*?)['|"]$/g;
const commandRegex = /^command=['|"](.*?)['|"]$/g;
const dangerLevelRegex = /^dangerLevel=['|"](.*?)['|"]$/g;

function suggest(intent, command, os, dangerLevel) {
    const options = {
        hostname: 'sem-cli.herokuapp.com',
        method: 'POST',
        path: '/suggest',
        body: {
            intent: intent,
            command: command,
            os: os,
            dangerLevel: dangerLevel
        }
    };

    return new Promise((resolve, reject) => {
        const req = https.request(options, (res) => {
            res.setEncoding('utf8');
            if (res.statusCode === 200) {
                resolve(res.body);
            } else {
                reject('error occured');
            }
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

    if (!args || args.length !== 3 || !os) {
        console.error('missing parameters');
        return;
    }

    let intent = args.find((item) => item.match(intentRegex));
    let command = args.find((item) => item.match(commandRegex));
    let dangerLevel = args.find((item) => item.match(dangerLevelRegex));

    if (!intent || !command || !dangerLevel) {
        console.error('missing parameters');
        return;
    }

    try {
        // send request to sem-cli-server
        let result = await suggest(intent, command, os, dangerLevel);
        console.log(result);
    } catch (err) {
        console.error('error occured');
    }
}
// execute the request
execReq();
