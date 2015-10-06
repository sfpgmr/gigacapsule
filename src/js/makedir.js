'use strict';

	import * as fs  from 'fs';
	import denodeify from './denodeify';
	var mkdir = denodeify(fs.mkdir);
	function makedir(path){
		return ()=>{
			return mkdir(path)
			.then(()=> Promise.resolve(),
			(e) =>{
				if(e.code !== 'EEXIST'){
				Promise.reject(e);
				} 
				return Promise.resolve();
			});
		}  
	}
	
export default makedir;