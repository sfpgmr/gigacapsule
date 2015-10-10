'use strict';

import app from 'app';
import denodeify from './denodeify';
import BrowserWindow from 'browser-window';
import ipc from 'ipc';
import * as fs from 'fs';
import * as path  from 'path';
import makedir from './makedir';
import { exec  as exec_ } from 'child_process';
import crashReporter  from 'crash-reporter';
import Player from './player';

var access = denodeify(fs.access);
var exec = denodeify(exec_);
var playPromises = Promise.resolve(0);
var cachePromises = Promise.resolve(0);
var cacheRoot = path.join(app.getPath('cache'),'sfpgmr');
var cachePath = path.join(cacheRoot,'gigacapsule');
var workPath = path.join(cachePath,'work');
var gigaCapsule = '';
var player;

ipc.setMaxListeners(0);
crashReporter.start();

var mainWindow = null;

app.on('window-all-closed', function() {
  if (process.platform != 'darwin')
    app.quit();
});


app.on('ready', function() {
  // Giga Capsule ディスクをチェックする
  // Windows のみ...
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
    console.log(gigaCapsule);
    // キャッシュディレクトリ作成
    return Promise.resolve();
  })
  .then(makedir(cacheRoot))
  .then(makedir(cachePath))
  .then(makedir(workPath))
  .then(() => {
    // プレイヤー
    player = new Player(gigaCapsule,cachePath,workPath);

    return new Promise(function(resolve,reject){
    // ブラウザ(Chromium)の起動, 初期画面のロード
      mainWindow = new BrowserWindow(
        {
          'width': 1024,
          'height': 768,
          'use-content-size':true,
          'center':true,
          'auto-hide-menu-bar': true,
          'title':'YMO Giga Capusle Viewer',
          'web-preferences':{
            'direct-write': true,
            'webgl':true,
            'webaudio':true
          }
        }
      );
      mainWindow.loadUrl('file://' + __dirname + '/../index.html');
      mainWindow.on('closed', function() {
        mainWindow = null;
      });
      mainWindow.webContents.on('did-finish-load', function() {
        resolve();
      });    
    });
  })
  // オープニングコンテンツの再生
  .then(()=>{
    [
      // '/MOVIE/QT/TITLE.MOV',
      // '/MOVIE/QT/START.MOV'
    ].forEach((p) => {
      player.play(mainWindow,p);
    });
    //player.playEnd();
    return Promise.all([player.prepareCache('/MOVIE/SOUND/OPENING.AIF','.ogg','-a:b 256k'),player.playPromises]);
  }).then((args)=>{
    return player.wait().then(()=>args[0]);
  })
  .then((path_)=>{
    console.log('play end.');
    player.clear();
    return new Promise ((resolve,reject)=>{
      mainWindow.loadUrl('file://' + __dirname + '/../html/jingle.html');
      mainWindow.webContents.on('did-finish-load', function() {
        resolve(path_);
      });    
    });
  })
  .then((path_)=>{
    console.log('loaded.');
    mainWindow.webContents.send('play',path_);
  })
  .catch((e)=>{
    var dialog = require('dialog');
    dialog.showErrorBox('Error',e);
    if (process.platform != 'darwin')
      app.quit();
//    console.log(e);
  });
  //app.quit();
});



