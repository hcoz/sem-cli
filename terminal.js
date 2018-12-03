#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
    const { stdout, stderr } = await exec('ls -la');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}
lsExample();
