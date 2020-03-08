const haml = require("hamljs"),
	path = require('path'),
	fs = require('fs');

function malta_haml(o, options) {

	const self = this,
		start = new Date(),
        pluginName = path.basename(path.dirname(__filename)),
        dataFilename = path.dirname(self.tplPath) + '/' + options.dataFile,
        hasData = 'dataFile' in options && fs.existsSync(dataFilename),
		oldname = o.name;
        
	let	msg,
        data = {};

	try {
		if (hasData){
			data = JSON.parse(fs.readFileSync(dataFilename));
		}
	} catch (err) {
		self.doErr(err, o, pluginName);
	}

	// convert tabss to 2 spaces
	o.content = o.content.replace(/\t/gm, "  ");
	o.name = o.name.replace(/\.haml/, '.html');

	return function (solve, reject){
        try {
            o.content = haml.render(o.content+'', {locals : data});
            fs.writeFile(o.name, o.content, err => {	
                err && self.doErr(err, o, pluginName);
                msg = 'plugin ' + pluginName.white() + ' wrote ' + o.name + ' (' + self.getSize(o.name) + ')';
                fs.unlink(oldname, () => {});
                err
                    ? reject(`Plugin ${pluginName} write error:\n${err}`)
                    : solve(o);
                self.notifyAndUnlock(start, msg);
            });
        } catch (err) {
            reject(`Plugin ${pluginName} compilation error:\n${err}`)
            self.doErr(err, o, pluginName);
        }
	};
}
malta_haml.ext = 'haml';
module.exports = malta_haml;