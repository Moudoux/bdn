'use strict';

/*
 *  This file will download and extract SnoreToast.exe (https://github.com/KDE/snoretoast) 
 *  which is used to make toasts in Windows.
 */

// Imports
const https = require('https');
const fs = require('fs');
const { zip, unzip } = require('cross-unzip')
const path = require('path');
const request = require('request');

const uri = "https://download.kde.org/stable/snoretoast/0.5.2/bin/snoretoast_v0.5.2-x64.7z";

const rmdir = function(dir) {
    let list = fs.readdirSync(dir);
    for(let i = 0; i < list.length; i++) {
        let filename = path.join(dir, list[i]);
        let stat = fs.statSync(filename);
        if(filename == "." || filename == "..") {
        } else if(stat.isDirectory()) {
            rmdir(filename);
        } else {
            fs.unlinkSync(filename);
        }
    }
    fs.rmdirSync(dir);
};

async function install() {
    request(uri).pipe(fs.createWriteStream('snoretoast.7z')).on('close', function() {
        unzip('snoretoast.7z', 'temp/', err => {
            fs.rename(path.join(__dirname, "temp", "snoretoast_v0.5.2-x64", "bin", "SnoreToast.exe"), path.join(__dirname, "SnoreToast.exe"), function (err) {
                if (err) return console.error(err)
                fs.unlinkSync("./snoretoast.7z");
                rmdir("./temp/");
                console.log("Installed SnoreToast.exe");
            });
        });
    });    
}

module.exports = { install };
