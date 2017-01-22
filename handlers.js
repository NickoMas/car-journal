var fs    = require('fs');
var form  = require('./form.json');
var rep   = require('./repair_data.json');

var funcs = {
	'form'   : s_form,
	'submit' : s_submit,
	'list'   : s_list
};

function s_form(body,req, res) {
	res.writeHead(200,{'Content-Type':'text/plain'})
	res.end(form[req.url]);
}

function s_submit(body,req, res) {

	var obj = rep[req.url];

	for(var k in obj){
		obj[k].push(body.data[k]);
	}

	fs.writeFile('flex/repair_data.json',JSON.stringify(rep),function(err){
		if (err) throw err;
	    console.log('It\'s saved!');
    });

	res.writeHead(200,{'Content-Type':'text/plain'})
	res.end('Data was written');

}

function s_list(body,req,res) {
	var obj = rep[req.url];
	res.writeHead(200,{'Content-Type':'text/plain'})
	res.end(JSON.stringify(obj));
}

exports.funcs = funcs;