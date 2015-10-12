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
      '/MOVIE/QT/TITLE.MOV',
      '/MOVIE/QT/START.MOV'
    ].forEach((p) => {
      player.play(mainWindow,p);
    });
    //player.playEnd();
    return Promise.all([player.prepareCache('/MOVIE/SOUND/OPENING.AIF','.ogg',''),player.playPromises]);
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
    return Promise.all([new Promise((resolve,reject)=>{
      console.log('loaded.');
      mainWindow.webContents.send('play',path_);
      ipc.on('end',()=>{
        resolve();
      });
    })
    ,player.prepareCache('/MOVIE/SOUND/BG.AIF')
    ,player.prepareCache('/MOVIE/SOUND/03_02.AIF')
    ,player.prepareCache('/MOVIE/SOUND/19_02.AIF')
    ]);
  })
  .then((args)=>{
    console.log('Jingle Y.M.O. played.');
      mainWindow.loadUrl('file://' + __dirname + '/../html/menu.html');
      mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('audioResource',args.slice(2));
        mainWindow.webContents.send('playAudio',args[1],{loop:true});
      });

      ipc.on('click',(e,arg)=>{
        console.log(arg);
        switch(arg){
          case 'Remix':
            mainWindow.loadUrl('file://' + __dirname + '/../html/remix.html');
            mainWindow.webContents.on('did-finish-load', function() {
              initCacheForRemix()
              .then((resources)=>{
                    mainWindow.webContents.send('resources',resources);
              });
            });
            break;
          case 'Interview':
            break;
          case 'Sample':
            break;
          case 'Tracks':
            break;
          case 'RareVideos':
            break;
          case 'RareTracks':
            break;
          case 'Exit':
            app.quit();
            break;
          case 'Menu':
            mainWindow.loadUrl('file://' + __dirname + '/../html/menu.html');
            mainWindow.webContents.on('did-finish-load', function() {
              mainWindow.webContents.send('audioResource',args.slice(2));
              mainWindow.webContents.send('playAudio',args[1],{loop:true});
            });
            break;
        }
      })    
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

function initCacheForRemix()
{
  var resources = [
  {songname:'Behind The Mask',path:'/MOVIE/L2/REMIX/BEHINDS/BACKING.AIF'},
  {songname:'Behind The Mask',path:'/MOVIE/L2/REMIX/BEHINDS/BASS.AIF'},
  {songname:'Behind The Mask',path:'/MOVIE/L2/REMIX/BEHINDS/DRUMS.AIF'},
  {songname:'Behind The Mask',path:'/MOVIE/L2/REMIX/BEHINDS/E_DRUM.AIF'},
  {songname:'Behind The Mask',path:'/MOVIE/L2/REMIX/BEHINDS/MELO_1.AIF'},
  {songname:'Behind The Mask',path:'/MOVIE/L2/REMIX/BEHINDS/MELO_2.AIF'},
  {songname:'Behind The Mask',path:'/MOVIE/L2/REMIX/BEHINDS/VOCODER.AIF'},
  {songname:'Rydeen',path:'/MOVIE/L2/REMIX/RYDEENS/BASS.AIF'},
  {songname:'Rydeen',path:'/MOVIE/L2/REMIX/RYDEENS/CHORD_LR.AIF'},
  {songname:'Rydeen',path:'/MOVIE/L2/REMIX/RYDEENS/DRUMS.AIF'},
  {songname:'Rydeen',path:'/MOVIE/L2/REMIX/RYDEENS/MELO_1LR.AIF'},
  {songname:'Rydeen',path:'/MOVIE/L2/REMIX/RYDEENS/MELO_2.AIF'},
  {songname:'Rydeen',path:'/MOVIE/L2/REMIX/RYDEENS/PERC_LR.AIF'},
  {songname:'Rydeen',path:'/MOVIE/L2/REMIX/RYDEENS/SEQ.AIF'},
  {songname:'Solid State Survivor',path:'/MOVIE/L2/REMIX/SOLIDS/BASS_LR.AIF'},
  {songname:'Solid State Survivor',path:'/MOVIE/L2/REMIX/SOLIDS/DRUMS.AIF'},
  {songname:'Solid State Survivor',path:'/MOVIE/L2/REMIX/SOLIDS/MELO.AIF'},
  {songname:'Solid State Survivor',path:'/MOVIE/L2/REMIX/SOLIDS/PERC_LR.AIF'},
  {songname:'Solid State Survivor',path:'/MOVIE/L2/REMIX/SOLIDS/SE.AIF'},
  {songname:'Solid State Survivor',path:'/MOVIE/L2/REMIX/SOLIDS/SYNGT_LR.AIF'},
  {songname:'Solid State Survivor',path:'/MOVIE/L2/REMIX/SOLIDS/VOCAL.AIF'},
  {songname:'Technopolis',path:'/MOVIE/L2/REMIX/TECHNOS/BASS.AIF'},
  {songname:'Technopolis',path:'/MOVIE/L2/REMIX/TECHNOS/CHORD_LR.AIF'},
  {songname:'Technopolis',path:'/MOVIE/L2/REMIX/TECHNOS/DRUMS.AIF'},
  {songname:'Technopolis',path:'/MOVIE/L2/REMIX/TECHNOS/ETC.AIF'},
  {songname:'Technopolis',path:'/MOVIE/L2/REMIX/TECHNOS/MELO_LR.AIF'},
  {songname:'Technopolis',path:'/MOVIE/L2/REMIX/TECHNOS/TOBI_LR.AIF'},
  {songname:'Technopolis',path:'/MOVIE/L2/REMIX/TECHNOS/VOCODER.AIF'},
  {songname:'Tong Poo',path:'/MOVIE/L2/REMIX/TONGS/BASS.AIF'},
  {songname:'Tong Poo',path:'/MOVIE/L2/REMIX/TONGS/CHORD_LR.AIF'},
  {songname:'Tong Poo',path:'/MOVIE/L2/REMIX/TONGS/DRUM.AIF'},
  {songname:'Tong Poo',path:'/MOVIE/L2/REMIX/TONGS/E_DRUMS.AIF'},
  {songname:'Tong Poo',path:'/MOVIE/L2/REMIX/TONGS/MELO.AIF'},
  {songname:'Tong Poo',path:'/MOVIE/L2/REMIX/TONGS/OBURI_LR.AIF'},
  {songname:'Tong Poo',path:'/MOVIE/L2/REMIX/TONGS/VOCAL.AIF'}
  ];
  var promise = Promise.resolve();
  var res = [];
  var len = resources.length;
  var idx = 0;
  
  while(idx < len)
  {
    var rf = [];
    for(var i = 0;i < 10 && (idx < len);++i){
      var r = resources[idx];
      rf.push(r);
      ++idx;
    }
    promise = promise.then(((rf)=> {
      return () => {
        var arr = [];
        rf.forEach((r) => {
          arr.push(
            player.prepareCache(r.path,'.ogg')
            .then((cachePath)=>{
              console.log(cachePath);
              res.push({songname:r.songname,path:cachePath});
          }));
        });
        return Promise.all(arr);
      }
    })(rf));
  }
  return promise.then(()=> res);
}



