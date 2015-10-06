'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var _denodeify = require('./denodeify');

var _denodeify2 = _interopRequireDefault(_denodeify);

var _ipc = require('ipc');

var _ipc2 = _interopRequireDefault(_ipc);

var _fs = require('fs');

var fs = _interopRequireWildcard(_fs);

var _path = require('path');

var path = _interopRequireWildcard(_path);

var _makedir = require('./makedir');

var _makedir2 = _interopRequireDefault(_makedir);

var _child_process = require('child_process');

_ipc2['default'].setMaxListeners(0);

var access = (0, _denodeify2['default'])(fs.access);

var exec = (0, _denodeify2['default'])(_child_process.exec);

var Player = (function () {
	function Player(gigaCapsulePath, cachePath, workPath) {
		_classCallCheck(this, Player);

		this.gigaCapsulePath = gigaCapsulePath;
		this.cachePath = cachePath;
		this.workPath = workPath;
		this.count = 0;
		this.playPromises = null;
		this.cachePromises = null;
		this.cacheMakers = {
			'.MOV': this.makeVideoCache.bind(this),
			'.AIF': this.makeAudioCache.bind(this)
		};
	}

	// 動画ファイルのキャッシュ生成

	_createClass(Player, [{
		key: 'makeVideoCache',
		value: function makeVideoCache(window, pathFlagment) {
			var pathSrc = path.join(this.gigaCapsulePath, pathFlagment);
			var ext = path.extname(pathFlagment);
			var pathDest = path.join(this.cachePath, path.basename(pathFlagment.replace(/\//ig, '_'), ext) + '.mp4');
			return this.makeCache(pathSrc, pathDest, this.playVideo_.bind(this, window, pathDest));
		}

		// オーディオファイルのキャッシュ生成
	}, {
		key: 'makeAudioCache',
		value: function makeAudioCache(window, pathFlagment) {
			var pathSrc = path.join(this.gigaCapsulePath, pathFlagment);
			var ext = path.extname(pathFlagment);
			var pathDest = path.join(this.cachePath, path.basename(pathFlagment.replace(/\//ig, '_'), ext) + '.opus');
			return this.makeCache(pathSrc, pathDest, this.playAudio_.bind(this, window, pathDest));
		}
	}, {
		key: 'makeCacheAndPlay',
		value: function makeCacheAndPlay(window, path_) {
			var _this = this;

			this.count++;
			var ext = path.extname(path_).toUpperCase();
			var this_ = this;
			return this.cacheMakers[ext](window, path_).then(function (p) {
				if (_this.playPromises) {
					_this.playPromises = _this.playPromises.then(p).then(function () {
						this_.count--;
					});
				} else {
					_this.playPromises = p().then(function () {
						this_.count--;
					});
				}
			});
		}
	}, {
		key: 'play',
		value: function play(window, path_) {
			var _this2 = this;

			// Promiseのチェインを2つ（キャッシュチェイン、再生チェイン）作る
			// 再生中に後続のデータのキャッシュを作れるようにするため

			// キャッシュのチェイン
			// 先行のキャッシュ生成が終わったらキャッシュ生成をシーケンシャルに行う
			if (this.cachePromises) {
				this.cachePromises = this.cachePromises.then(function () {
					// 再生のチェイン
					// 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
					//console.log(p);
					return _this2.makeCacheAndPlay(window, path_);
				});
			} else {
				this.cachePromises = this.makeCacheAndPlay(window, path_);
			}
		}
	}, {
		key: 'isPlaying',
		value: function isPlaying() {
			return this.counter !== 0;
		}

		// playEnd(){
		// 	this.cachePromises.then((p)=>{
		// 		// 再生のチェイン
		// 		// 先行の再生完了 -> キャッシュの生成終了まち -> 再生をシーケンシャルに行う
		// 		if(p){
		// 			this.playPromises = this.playPromises.then(p);
		// 		}
		// 	});		
		// }

		// コンテンツを再生可能な形式に変換し、キャッシュする
	}, {
		key: 'makeCache',
		value: function makeCache(src, dest, play_, option) {
			var _this3 = this;

			option = option || '';
			console.log(src, dest);
			return access(dest, fs.F_OK).then(function () {
				return Promise.resolve(play_);
			}, // resolve
			function () {
				// reject
				// 作業中のファイルはテンポラリに保存
				var tmpPath = path.join(_this3.workPath, path.basename(dest));
				// ffmpegでファイル変換
				return exec('ffmpeg.exe -y -loglevel fatal -i ' + src + ' ' + option + ' ' + tmpPath)
				// 変換からテンポラリから移動
				.then(exec.bind(null, 'cmd /c move /Y ' + tmpPath + ' ' + dest), function (e) {
					console.log(e);
				})
				// 変換後のファイル名を返す
				.then(function () {
					return Promise.resolve(play_);
				});
			});
		}

		// ビデオの再生
	}, {
		key: 'playVideo_',
		value: function playVideo_(window, path) {
			return new Promise(function (resolve, reject) {
				window.webContents.send('playVideo', path);
				_ipc2['default'].once('playVideoEnd', function () {
					resolve();
					console.log(path);
				});
			});
		}

		// オーディオの再生
	}, {
		key: 'playAudio_',
		value: function playAudio_(window, path) {
			return new Promise(function (resolve, reject) {
				window.webContents.send('playAudio', path);
				_ipc2['default'].once('playAudioEnd', function () {
					resolve();
					console.log(path);
				});
			});
		}

		// Promise チェインのクリア
	}, {
		key: 'clear',
		value: function clear() {
			this.playPromises = null;
			this.cachePromises = null;
		}
	}]);

	return Player;
})();

;

exports['default'] = Player;
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;base64,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QU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7QUFDdkMsVUFBTSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsV0FBVyxFQUFFLElBQUksQ0FBQyxDQUFDO0FBQzNDLHFCQUFJLElBQUksQ0FBQyxjQUFjLEVBQUUsWUFBWTtBQUNwQyxZQUFPLEVBQUUsQ0FBQztBQUNWLFlBQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7S0FDbEIsQ0FBQyxDQUFDO0lBQ0gsQ0FBQyxDQUFDO0dBQ0g7Ozs7O1NBR0ksaUJBQUU7QUFDTixPQUFJLENBQUMsWUFBWSxHQUFHLElBQUksQ0FBQztBQUN6QixPQUFJLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztHQUMxQjs7O1FBN0hJLE1BQU07OztBQThIWCxDQUFDOztxQkFFYSxNQUFNIiwiZmlsZSI6InBsYXllci5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2Ugc3RyaWN0JztcclxuXHJcbmltcG9ydCBkZW5vZGVpZnkgZnJvbSAnLi9kZW5vZGVpZnknO1xyXG5pbXBvcnQgaXBjIGZyb20gJ2lwYyc7XHJcbmlwYy5zZXRNYXhMaXN0ZW5lcnMoMCk7XHJcbmltcG9ydCAqIGFzIGZzIGZyb20gJ2ZzJztcclxuaW1wb3J0ICogYXMgcGF0aCAgZnJvbSAncGF0aCc7XHJcbmltcG9ydCBtYWtlZGlyIGZyb20gJy4vbWFrZWRpcic7XHJcbnZhciBhY2Nlc3MgPSBkZW5vZGVpZnkoZnMuYWNjZXNzKTtcclxuaW1wb3J0IHsgZXhlYyAgYXMgZXhlY18gfSBmcm9tICdjaGlsZF9wcm9jZXNzJztcclxudmFyIGV4ZWMgPSBkZW5vZGVpZnkoZXhlY18pO1xyXG5cclxuY2xhc3MgUGxheWVyIHtcclxuXHRjb25zdHJ1Y3RvcihnaWdhQ2Fwc3VsZVBhdGgsY2FjaGVQYXRoLHdvcmtQYXRoKXtcclxuXHRcdHRoaXMuZ2lnYUNhcHN1bGVQYXRoID0gZ2lnYUNhcHN1bGVQYXRoO1xyXG5cdFx0dGhpcy5jYWNoZVBhdGggPSBjYWNoZVBhdGg7XHJcblx0XHR0aGlzLndvcmtQYXRoID0gd29ya1BhdGg7XHJcblx0XHR0aGlzLmNvdW50ID0gMDtcclxuXHRcdHRoaXMucGxheVByb21pc2VzID0gbnVsbDtcclxuXHRcdHRoaXMuY2FjaGVQcm9taXNlcyA9IG51bGw7XHJcblx0XHR0aGlzLmNhY2hlTWFrZXJzID0ge1xyXG5cdFx0XHQnLk1PVicgOiB0aGlzLm1ha2VWaWRlb0NhY2hlLmJpbmQodGhpcyksXHJcblx0XHRcdCcuQUlGJyA6IHRoaXMubWFrZUF1ZGlvQ2FjaGUuYmluZCh0aGlzKVxyXG5cdFx0fTtcclxuXHR9XHJcblx0XHJcblx0Ly8g5YuV55S744OV44Kh44Kk44Or44Gu44Kt44Oj44OD44K344Ol55Sf5oiQXHJcblx0bWFrZVZpZGVvQ2FjaGUod2luZG93LHBhdGhGbGFnbWVudCl7XHJcblx0XHR2YXIgcGF0aFNyYyA9IHBhdGguam9pbih0aGlzLmdpZ2FDYXBzdWxlUGF0aCxwYXRoRmxhZ21lbnQpO1xyXG5cdFx0dmFyIGV4dCA9IHBhdGguZXh0bmFtZShwYXRoRmxhZ21lbnQpO1xyXG5cdFx0dmFyIHBhdGhEZXN0ID0gcGF0aC5qb2luKHRoaXMuY2FjaGVQYXRoLHBhdGguYmFzZW5hbWUocGF0aEZsYWdtZW50LnJlcGxhY2UoL1xcLy9pZywnXycpLGV4dCkgKyAnLm1wNCcpO1xyXG5cdFx0cmV0dXJuIHRoaXMubWFrZUNhY2hlKHBhdGhTcmMscGF0aERlc3QsdGhpcy5wbGF5VmlkZW9fLmJpbmQodGhpcyx3aW5kb3cscGF0aERlc3QpKTtcclxuXHR9XHJcblxyXG5cdC8vIOOCquODvOODh+OCo+OCquODleOCoeOCpOODq+OBruOCreODo+ODg+OCt+ODpeeUn+aIkFxyXG5cdG1ha2VBdWRpb0NhY2hlKHdpbmRvdyxwYXRoRmxhZ21lbnQpe1xyXG5cdFx0dmFyIHBhdGhTcmMgPSBwYXRoLmpvaW4odGhpcy5naWdhQ2Fwc3VsZVBhdGgscGF0aEZsYWdtZW50KTtcclxuXHRcdHZhciBleHQgPSBwYXRoLmV4dG5hbWUocGF0aEZsYWdtZW50KTtcclxuXHRcdHZhciBwYXRoRGVzdCA9IHBhdGguam9pbih0aGlzLmNhY2hlUGF0aCxwYXRoLmJhc2VuYW1lKHBhdGhGbGFnbWVudC5yZXBsYWNlKC9cXC8vaWcsJ18nKSxleHQpICsgJy5vcHVzJyk7XHJcblx0XHRyZXR1cm4gdGhpcy5tYWtlQ2FjaGUocGF0aFNyYyxwYXRoRGVzdCx0aGlzLnBsYXlBdWRpb18uYmluZCh0aGlzLHdpbmRvdyxwYXRoRGVzdCkpO1xyXG5cdH1cclxuXHJcblx0bWFrZUNhY2hlQW5kUGxheSAod2luZG93LHBhdGhfKSB7XHJcblx0XHR0aGlzLmNvdW50Kys7XHJcblx0XHR2YXIgZXh0ID0gcGF0aC5leHRuYW1lKHBhdGhfKS50b1VwcGVyQ2FzZSgpO1xyXG5cdFx0dmFyIHRoaXNfID0gdGhpcztcclxuXHRcdHJldHVybiB0aGlzLmNhY2hlTWFrZXJzW2V4dF0od2luZG93LHBhdGhfKVxyXG5cdFx0XHQudGhlbigocCk9PntcclxuXHRcdFx0XHRpZih0aGlzLnBsYXlQcm9taXNlcyl7XHJcblx0XHRcdFx0XHR0aGlzLnBsYXlQcm9taXNlcyA9IHRoaXMucGxheVByb21pc2VzXHJcblx0XHRcdFx0XHQudGhlbihwKVxyXG5cdFx0XHRcdFx0LnRoZW4oKCk9Pnt0aGlzXy5jb3VudC0tO30pO1xyXG5cdFx0XHRcdH0gZWxzZSB7XHJcblx0XHRcdFx0XHR0aGlzLnBsYXlQcm9taXNlcyA9IHAoKS50aGVuKCgpPT57dGhpc18uY291bnQtLTt9KTtcclxuXHRcdFx0XHR9XHJcblx0XHRcdH0pO1x0XHRcdFxyXG5cdH1cclxuXHJcblxyXG5cdHBsYXkod2luZG93LHBhdGhfKXtcclxuXHRcdC8vIFByb21pc2Xjga7jg4HjgqfjgqTjg7PjgpIy44Gk77yI44Kt44Oj44OD44K344Ol44OB44Kn44Kk44Oz44CB5YaN55Sf44OB44Kn44Kk44Oz77yJ5L2c44KLXHJcblx0XHQvLyDlho3nlJ/kuK3jgavlvozntprjga7jg4fjg7zjgr/jga7jgq3jg6Pjg4Pjgrfjg6XjgpLkvZzjgozjgovjgojjgYbjgavjgZnjgovjgZ/jgoFcclxuXHJcblx0XHQvLyDjgq3jg6Pjg4Pjgrfjg6Xjga7jg4HjgqfjgqTjg7NcclxuXHRcdC8vIOWFiOihjOOBruOCreODo+ODg+OCt+ODpeeUn+aIkOOBjOe1guOCj+OBo+OBn+OCieOCreODo+ODg+OCt+ODpeeUn+aIkOOCkuOCt+ODvOOCseODs+OCt+ODo+ODq+OBq+ihjOOBhlxyXG5cdFx0aWYodGhpcy5jYWNoZVByb21pc2VzKXtcclxuXHRcdFx0dGhpcy5jYWNoZVByb21pc2VzID0gdGhpcy5jYWNoZVByb21pc2VzLnRoZW4oKCk9PntcclxuXHRcdFx0XHQvLyDlho3nlJ/jga7jg4HjgqfjgqTjg7NcclxuXHRcdFx0XHQvLyDlhYjooYzjga7lho3nlJ/lrozkuoYgLT4g44Kt44Oj44OD44K344Ol44Gu55Sf5oiQ57WC5LqG44G+44GhIC0+IOWGjeeUn+OCkuOCt+ODvOOCseODs+OCt+ODo+ODq+OBq+ihjOOBhlxyXG5cdFx0XHRcdC8vY29uc29sZS5sb2cocCk7XHJcblx0XHRcdFx0cmV0dXJuIHRoaXMubWFrZUNhY2hlQW5kUGxheSh3aW5kb3cscGF0aF8pO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0gZWxzZSB7XHJcblx0XHRcdHRoaXMuY2FjaGVQcm9taXNlcyA9IHRoaXMubWFrZUNhY2hlQW5kUGxheSh3aW5kb3cscGF0aF8pO1xyXG5cdFx0fVx0XHRcclxuXHR9XHJcblx0XHJcblx0aXNQbGF5aW5nKCl7XHJcblx0XHRyZXR1cm4gdGhpcy5jb3VudGVyICE9PSAwIDtcclxuXHR9XHJcblxyXG5cdC8vIHBsYXlFbmQoKXtcclxuXHQvLyBcdHRoaXMuY2FjaGVQcm9taXNlcy50aGVuKChwKT0+e1xyXG5cdC8vIFx0XHQvLyDlho3nlJ/jga7jg4HjgqfjgqTjg7NcclxuXHQvLyBcdFx0Ly8g5YWI6KGM44Gu5YaN55Sf5a6M5LqGIC0+IOOCreODo+ODg+OCt+ODpeOBrueUn+aIkOe1guS6huOBvuOBoSAtPiDlho3nlJ/jgpLjgrfjg7zjgrHjg7Pjgrfjg6Pjg6vjgavooYzjgYZcclxuXHQvLyBcdFx0aWYocCl7XHJcblx0Ly8gXHRcdFx0dGhpcy5wbGF5UHJvbWlzZXMgPSB0aGlzLnBsYXlQcm9taXNlcy50aGVuKHApO1xyXG5cdC8vIFx0XHR9XHJcblx0Ly8gXHR9KTtcdFx0XHJcblx0Ly8gfVxyXG5cclxuXHQvLyDjgrPjg7Pjg4bjg7Pjg4TjgpLlho3nlJ/lj6/og73jgarlvaLlvI/jgavlpInmj5vjgZfjgIHjgq3jg6Pjg4Pjgrfjg6XjgZnjgotcclxuXHRtYWtlQ2FjaGUoc3JjLGRlc3QscGxheV8sb3B0aW9uKVxyXG5cdHtcclxuXHRcdG9wdGlvbiA9IG9wdGlvbiB8fCAnJztcclxuXHRcdGNvbnNvbGUubG9nKHNyYyxkZXN0KTtcclxuXHRcdHJldHVybiBhY2Nlc3MoZGVzdCxmcy5GX09LKVxyXG5cdFx0LnRoZW4oKCk9PiBQcm9taXNlLnJlc29sdmUocGxheV8pLC8vIHJlc29sdmVcclxuXHRcdCgpPT57Ly8gcmVqZWN0XHJcblx0XHRcdC8vIOS9nOalreS4reOBruODleOCoeOCpOODq+OBr+ODhuODs+ODneODqeODquOBq+S/neWtmFxyXG5cdFx0XHR2YXIgdG1wUGF0aCA9IHBhdGguam9pbih0aGlzLndvcmtQYXRoLHBhdGguYmFzZW5hbWUoZGVzdCkpO1xyXG5cdFx0XHQvLyBmZm1wZWfjgafjg5XjgqHjgqTjg6vlpInmj5tcclxuXHRcdFx0cmV0dXJuIGV4ZWMoJ2ZmbXBlZy5leGUgLXkgLWxvZ2xldmVsIGZhdGFsIC1pICcgKyBzcmMgKyAnICcgKyBvcHRpb24gKyAnICcgKyB0bXBQYXRoKVxyXG5cdFx0XHQvLyDlpInmj5vjgYvjgonjg4bjg7Pjg53jg6njg6rjgYvjgonnp7vli5VcclxuXHRcdFx0LnRoZW4oZXhlYy5iaW5kKG51bGwsJ2NtZCAvYyBtb3ZlIC9ZICcgKyB0bXBQYXRoICsgJyAnICsgZGVzdCksKGUpPT57Y29uc29sZS5sb2coZSk7fSlcclxuXHRcdFx0Ly8g5aSJ5o+b5b6M44Gu44OV44Kh44Kk44Or5ZCN44KS6L+U44GZXHJcblx0XHRcdC50aGVuKCgpPT5Qcm9taXNlLnJlc29sdmUocGxheV8pKTtcclxuXHRcdH1cclxuXHRcdCk7XHJcblx0fVxyXG5cclxuXHQvLyDjg5Pjg4fjgqrjga7lho3nlJ9cclxuXHRwbGF5VmlkZW9fKHdpbmRvdyxwYXRoKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHR3aW5kb3cud2ViQ29udGVudHMuc2VuZCgncGxheVZpZGVvJywgcGF0aCk7XHJcblx0XHRcdGlwYy5vbmNlKCdwbGF5VmlkZW9FbmQnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHBhdGgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHQvLyDjgqrjg7zjg4fjgqPjgqrjga7lho3nlJ9cclxuXHRwbGF5QXVkaW9fKHdpbmRvdyxwYXRoKSB7XHJcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xyXG5cdFx0XHR3aW5kb3cud2ViQ29udGVudHMuc2VuZCgncGxheUF1ZGlvJywgcGF0aCk7XHJcblx0XHRcdGlwYy5vbmNlKCdwbGF5QXVkaW9FbmQnLCBmdW5jdGlvbiAoKSB7XHJcblx0XHRcdFx0cmVzb2x2ZSgpO1xyXG5cdFx0XHRcdGNvbnNvbGUubG9nKHBhdGgpO1xyXG5cdFx0XHR9KTtcclxuXHRcdH0pO1xyXG5cdH1cclxuXHRcclxuXHQvLyBQcm9taXNlIOODgeOCp+OCpOODs+OBruOCr+ODquOColxyXG5cdGNsZWFyKCl7XHJcblx0XHR0aGlzLnBsYXlQcm9taXNlcyA9IG51bGw7XHJcblx0XHR0aGlzLmNhY2hlUHJvbWlzZXMgPSBudWxsO1xyXG5cdH1cdFxyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGxheWVyO1xyXG4iXSwic291cmNlUm9vdCI6Ii9zb3VyY2UvIn0=
