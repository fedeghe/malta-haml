This plugin can be used on: **.haml** files

Options :  
    - **dataFile** : path for a json file that is expected to contain all ivariables one may need to use in the template, this path is relative to the template folder:  

    {
        "post" : {
            "title": "My title",
            "subtitle": "my subtitle",
            "content": "Hello haml"
        }
    }

Sample usage:  

    malta app/source/index.haml public -plugins=malta-haml[dataFile:\"params.json\"]

or in the .json file :

    "app/source/index.haml" : "public -plugins=malta-haml[dataFile:\"params.json\"]"

or in a script : 

    var Malta = require('malta');
    Malta.get().check([
        'app/source/index.haml',
        'public',
        '-plugins=malta-haml[dataFile:\"params.json\"]',
        '-options=showPath:false,watchInterval:500,verbose:0'
        ]).start(function (o) {
            var s = this;
            console.log('name : ' + o.name)
            console.log("content : \n" + o.content);
            'plugin' in o && console.log("plugin : " + o.plugin);
            console.log('=========');
        });
