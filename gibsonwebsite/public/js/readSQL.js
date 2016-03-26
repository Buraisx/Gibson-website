var fs = require('fs');

/*	Constant vars for file names below
*/

exports.getSQL = function (file_name){
	console.log(__dirname+ '/../../SQL/' + file_name);
	return fs.readFileSync(__dirname+ '/../../SQL/' + file_name, 'utf8');
};