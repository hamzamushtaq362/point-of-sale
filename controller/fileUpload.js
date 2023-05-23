var express = require('express')
var multer  = require('multer')
var app = express()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname + '../uploads')      //you tell where to upload the files,
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.png')
  }
})

var upload = multer({storage: storage,
    onFileUploadStart: function (file) {
      console.log(file.originalname + ' is starting ...')
    },
});

app.set('view engine', 'ejs');

app.get('/', function(req, res, next){    
    res.render('mult');  //our html document
})

exports.fileUp =(upload.single('avatar'), function (req, res, next) {
  // req.file is the `avatar` file
  console.log(req.file);
  return false;
})