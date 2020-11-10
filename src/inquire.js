#!/usr/bin/env node
const https = require('https');
const querystring = require('querystring');
const constants = require('./constants.json');

function inquire(text, os) {
    const options = {
        hostname: 'sem-cli-serverless.azurewebsites.net',
        method: 'GET',
        path: `/api/inquire?q=${querystring.escape(text)}&os=${os}`
    };

    return new Promise(function (resolve, reject) {
        const req = https.request(options, function (res) {
            res.setEncoding('utf8');
            res.on('data', function (chunk) {
                try {
                    // if the response doesn't have necessary fields, return an error
                    let data = JSON.parse(chunk);
                    if (!data.command || !data.dangerLevel) {
                        req.end();
                        return reject(constants.NO_RESPONSE);
                    }
                    resolve(data);
                } catch (err) {
                    req.end();
                    return reject(constants.NO_RESPONSE);
                }
            });
        });

        req.on('error', function (err) {
            reject(err.message);
        });
        req.end();
    });
}

module.exports = inquire;
