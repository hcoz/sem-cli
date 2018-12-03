#!/usr/bin/env node

const util = require('util');
const exec = util.promisify(require('child_process').exec);

async function lsExample() {
    const { stdout, stderr } = await exec('dir');
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
}
lsExample();

const [,, ...args] = process.argv;

console.log(`your args ${args}`);
