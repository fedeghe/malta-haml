require('malta').checkDeps('hamljs');

var haml = require("hamljs"),
	path = require('path'),
	fs = require('fs');

function malta_haml(o, options) {

	var self = this,
		name = o.name,
		start = new Date(),
		msg,
        pluginName = path.basename(path.dirname(__filename)),
        dataFilename = path.dirname(self.tplPath) + '/' + options.dataFile,
        hasData = 'dataFile' in options && fs.existsSync(dataFilename),
        data = {},
		oldname = o.name;

	try {
		if (hasData){
			data = JSON.parse(fs.readFileSync(dataFilename));
		}
	} catch (err) {
		self.doErr(err, o, pluginName);
	}

	// convert tabss to 2 spaces
	// 
	o.content = o.content.replace(/\t/gm, "  ");

	try {
		o.content = haml.render(o.content+'', {locals : data});
	} catch (err) {
		self.doErr(err, o, pluginName);
	}
	o.name = o.name.replace(/\.haml/, '.html');

	return function (solve, reject){
		fs.writeFile(o.name, o.content, function(err) {	
			err && self.doErr(err, o, pluginName);
			msg = 'plugin ' + pluginName.white() + ' wrote ' + o.name + ' (' + self.getSize(o.name) + ')';
			fs.unlink(oldname, () => {});
			solve(o);
			self.notifyAndUnlock(start, msg);
		});
	};
}
malta_haml.ext = 'haml';
module.exports = malta_haml;