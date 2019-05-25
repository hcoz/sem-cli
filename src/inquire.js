#!/usr/bin/env node
const https = require('https');

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
                    // if the response doesn't have necessary fields, return an error
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

module.exports = inquire;
