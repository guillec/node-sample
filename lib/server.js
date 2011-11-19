var formidable = require('formidable'),
    http = require('http'),
    sys = require('util'),
    fs = require('fs'),
    knox = require('knox');

var client = knox.createClient({
      key: ''
    , secret: ''
    , bucket: ''
  });

var server = http.createServer(function(req, res){
  if (req.url == '/upload' && req.method.toLowerCase() == 'post') {
    //parse a file upload
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
      for (file in files) {
        console.log(files[file].name);
	var fileStream = fs.createReadStream(files[file].path)
	client.putStream(fileStream, files[file].name, { 'Content-Type':'image/png' }  ,function(err, res){
          console.log('------------------');
	  console.log(fileStream);
	});
      };
      res.writeHead(200, {'content-type' : 'text/plain'});
      res.write('received upload:\n\n');
      res.end(sys.inspect({fields: fields, files: files}));
    });
    return;
  }

  res.writeHead(200, {'content-type' : 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
});
server.listen(8000);


