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
            'direct-write': true
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
  // コンテンツの再生
  .then(()=>{
    [
      '/MOVIE/QT/TITLE.MOV',
      '/MOVIE/QT/START.MOV',
'/SAMPLING/01LAFEMM/01_01.AIF',
'/SAMPLING/01LAFEMM/01_02.AIF',
'/SAMPLING/01LAFEMM/01_03.AIF',
'/SAMPLING/01LAFEMM/01_04.AIF',
'/SAMPLING/02MADPIE/02_01.AIF',
'/SAMPLING/02MADPIE/02_02.AIF',
'/SAMPLING/02MADPIE/02_03.AIF',
'/SAMPLING/02MADPIE/02_04.AIF',
'/SAMPLING/03FIRECR/03_01.AIF',
'/SAMPLING/03FIRECR/03_02.AIF',
'/SAMPLING/03FIRECR/03_03.AIF',
'/SAMPLING/03FIRECR/03_04.AIF',
'/SAMPLING/03FIRECR/03_05.AIF',
'/SAMPLING/04TONGPO/04_01.AIF',
'/SAMPLING/04TONGPO/04_02.AIF',
'/SAMPLING/04TONGPO/04_03.AIF',
'/SAMPLING/04TONGPO/04_04.AIF',
'/SAMPLING/04TONGPO/04_05.AIF',
'/SAMPLING/04TONGPO/04_06.AIF',
'/SAMPLING/05SIMOON/05_01.AIF',
'/SAMPLING/05SIMOON/05_02.AIF',
'/SAMPLING/05SIMOON/05_03.AIF',
'/SAMPLING/05SIMOON/05_04.AIF',
'/SAMPLING/05SIMOON/05_05.AIF',
'/SAMPLING/05SIMOON/05_06.AIF',
'/SAMPLING/05SIMOON/05_07.AIF',
'/SAMPLING/05SIMOON/05_08.AIF',
'/SAMPLING/06COSMIC/06_01.AIF',
'/SAMPLING/06COSMIC/06_02.AIF',
'/SAMPLING/07RYDEEN/07_01.AIF',
'/SAMPLING/07RYDEEN/07_02.AIF',
'/SAMPLING/07RYDEEN/07_03.AIF',
'/SAMPLING/07RYDEEN/07_04.AIF',
'/SAMPLING/07RYDEEN/07_05.AIF',
'/SAMPLING/08TECHNO/08_01.AIF',
'/SAMPLING/08TECHNO/08_02.AIF',
'/SAMPLING/08TECHNO/08_03.AIF',
'/SAMPLING/08TECHNO/08_04.AIF',
'/SAMPLING/09BEHIND/09_01.AIF',
'/SAMPLING/09BEHIND/09_02.AIF',
'/SAMPLING/09BEHIND/09_03.AIF',
'/SAMPLING/10CASTAL/10_01.AIF',
'/SAMPLING/10CASTAL/10_02.AIF',
'/SAMPLING/11SOLID/11_01.AIF',
'/SAMPLING/11SOLID/11_02.AIF',
'/SAMPLING/11SOLID/11_03.AIF',
'/SAMPLING/11SOLID/11_04.AIF',
'/SAMPLING/11SOLID/11_05.AIF',
'/SAMPLING/11SOLID/11_06.AIF',
'/SAMPLING/11SOLID/11_07.AIF',
'/SAMPLING/12INSOMN/12_01.AIF',
'/SAMPLING/12INSOMN/12_02.AIF',
'/SAMPLING/13DAYTRI/13_01.AIF',
'/SAMPLING/13DAYTRI/13_02.AIF',
'/SAMPLING/13DAYTRI/13_03.AIF',
'/SAMPLING/13DAYTRI/13_04.AIF',
'/SAMPLING/14ABSOLU/14_01.AIF',
'/SAMPLING/14ABSOLU/14_02.AIF',
'/SAMPLING/14ABSOLU/14_03.AIF',
'/SAMPLING/15MULTI/15_01.AIF',
'/SAMPLING/16NICEAG/16_01.AIF',
'/SAMPLING/16NICEAG/16_02.AIF',
'/SAMPLING/17CITIZE/17_01.AIF',
'/SAMPLING/18JINGLE/18_01.AIF',
'/SAMPLING/19PRURJA/19_01.AIF',
'/SAMPLING/19PRURJA/19_02.AIF',
'/SAMPLING/19PRURJA/19_03.AIF',
'/SAMPLING/19PRURJA/19_04.AIF',
'/SAMPLING/19PRURJA/19_05.AIF',
'/SAMPLING/19PRURJA/19_06.AIF',
'/SAMPLING/20GRADAT/20_01.AIF',
'/SAMPLING/20GRADAT/20_02.AIF',
'/SAMPLING/21NEWTAN/21_01.AIF',
'/SAMPLING/21NEWTAN/21_02.AIF',
'/SAMPLING/21NEWTAN/21_03.AIF',
'/SAMPLING/21NEWTAN/21_04.AIF',
'/SAMPLING/21NEWTAN/21_05.AIF',
'/SAMPLING/21NEWTAN/21_06.AIF',
'/SAMPLING/21NEWTAN/21_07.AIF',
'/SAMPLING/21NEWTAN/21_08.AIF',
'/SAMPLING/22STAIRS/22_01.AIF',
'/SAMPLING/22STAIRS/22_02.AIF',
'/SAMPLING/23SEOULM/23_01.AIF',
'/SAMPLING/23SEOULM/23_02.AIF',
'/SAMPLING/23SEOULM/23_03.AIF',
'/SAMPLING/23SEOULM/23_04.AIF',
'/SAMPLING/24LIGHTI/24_01.AIF',
'/SAMPLING/24LIGHTI/24_02.AIF',
'/SAMPLING/25PROLOG/25_01.AIF',
'/SAMPLING/25PROLOG/25_02.AIF',
'/SAMPLING/25PROLOG/25_03.AIF',
'/SAMPLING/26KEY/26_01.AIF',
'/SAMPLING/26KEY/26_02.AIF',
'/SAMPLING/26KEY/26_03.AIF',
'/SAMPLING/26KEY/26_04.AIF',
'/SAMPLING/27LIMBO/27_01.AIF',
'/SAMPLING/28THEMAD/28_01.AIF',
'/SAMPLING/28THEMAD/28_02.AIF',
'/SAMPLING/28THEMAD/28_03.AIF',
'/SAMPLING/29PERSPE/29_01.AIF'
    ].forEach((p) => {
      console.log(p);
      player.play(mainWindow,p);
    });
    //player.playEnd();

    return player.playPromises;
  }).then(()=>{
    console.log('play end?.');
    setTimeout(function wait (){
      console.log(player.count);
      if(player.count){
        setTimeout(wait,1000);
      } else {
        player.clear();
      }
    },500);
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



