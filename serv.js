var http     = require('http');
var url      = require('url');
var static   = require('node-static');
var handlers = require('./handlers.js');

var file = new static.Server();

function onReq(req,res) {

  var body='';

  file.serve(req,res);

  //console.log(req.url);

  if (req.method == 'POST') {
    req.on('data', function(chunk){
      body += chunk;
    }).on('end', function () {
      body = JSON.parse(body);
      handlers.funcs[body.name](body,req,res)
    })

  }

}

http.createServer(onReq).listen(8080);

console.log('Started dafuck');