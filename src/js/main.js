'use strict';

var app = require('app');
var BrowserWindow = require('browser-window');
var ipc = require('ipc');
var fs = require('fs');
var path = require('path');
var cacheRoot = path.join(app.getPath('cache'),'sfpgmr');
var cachePath = path.join(cacheRoot,'gigacapsule');
var gigaCapsule = '';

require('crash-reporter').start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});

function denodeify(nodeFunc){
    var baseArgs = Array.prototype.slice.call(arguments, 1);
    return function() {
        var nodeArgs = baseArgs.concat(Array.prototype.slice.call(arguments));
        return new Promise((resolve, reject) => {
            nodeArgs.push((error, data) => {
                if (error) {
                    reject(error);
                } else if (arguments.length > 2) {
                    resolve(Array.prototype.slice.call(arguments, 1));
                } else {
                    resolve(data);
                }
            });
            nodeFunc.apply(null, nodeArgs);
        });
    }
}

app.on('ready', function() {
  // Giga Capsule ディスクをチェックする
  // Windows のみ...
  var exec = denodeify(require('child_process').exec);
  exec('wmic logicaldisk get caption')
  .then((stdout,stderr) => {
    return new Promise((resolve,reject) => {
        stdout.split(/\r\r\n/).forEach((d)=>{
          if(d.match(/\:/)){
            let drive = d.trim();
            if(fs.existsSync(drive + '/YMOGIGA.EXE')){
              resolve(drive);
            }
          }
        });
        reject('Giga Capsule Disk Not Found.');
    });
  })
  .then((drive)=>{
    // Giga Capsuleのドライブ判明
    gigaCapsule = path.join(drive,'/');
    // キャッシュディレクトリ作成
    return new Promise((resolve,reject) => {
      try {
        fs.mkdirSync(cacheRoot);
      } catch (e) {
        if(e.code !== 'EEXIST'){
          reject(e.description);
        }
      }
      try {
        fs.mkdirSync(cachePath);
      } catch (e) {
        if(e.code !== 'EEXIST'){
          reject(e.description);
        }
      }
      resolve();
    });
  })
  .then(()=>{
    // ブラウザ(Chromium)の起動, 初期画面のロード
    mainWindow = new BrowserWindow({width: 800, height: 600});
    mainWindow.loadUrl('file://' + __dirname + '/../index.html');
    mainWindow.on('closed', function() {
      mainWindow = null;
    });
  })
  .catch((e)=>{
    console.log(e);
  });
  //app.quit();
});