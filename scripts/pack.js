#!/usr/bin/env node

'use strict';

const packZip = require('pack-zip');
const path = require('path');
const fs = require('fs');

let resolvePathRelativeTo = (() => {
    let pcwd = process.cwd();
    return cwd => path.resolve.bind(path, cwd || pcwd);
})();

function getPackageFileAtDir(cwd) {
    let at = resolvePathRelativeTo(cwd);
    return require(at('package.json'));
}

module.exports = exports;
exports.exec = async () => {
    console.log('Making distribution zip package');
    var args = process.argv.slice(2);
    if (args.length <= 2) {
        let source = args.length >= 1 ? { source: path.resolve(args[0]) } : {};
        let destination = args.length >= 2 ? { destination: path.resolve(args[1]) } : {};
        let destFile = destination.destination;
        if (destination.destination && fs.lstatSync(destination.destination).isDirectory()) {
            const pkg = getPackageFileAtDir(source.source);
            destFile = resolvePathRelativeTo(destination.destination)(`${pkg.name}.zip`);
            destination = {destination: destFile};
        }
        console.log(`Distribution zip package is saved to: ${destFile}`);
        packZip.pack(Object.assign(source, destination))
            .then(() => process.exit(0))
            .catch(error => {
                console.error(error);
                process.exit(1);
            });
    } else {
        await console.log('USAGE: pack-zip [source dir] [destination dir]');
        process.exit(1);
    }
};
