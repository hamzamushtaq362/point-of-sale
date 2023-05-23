const multer = require('multer')
var bodyParser = require('body-parser')
const path = require('path')
// import "../public/images/pics"
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images/pics')
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      let extArray = file.mimetype.split("/");
      let extension = extArray[extArray.length - 1];
      cb(null, file.fieldname + '-' + uniqueSuffix + '.' + extension)
  }
  })

// const upload = multer({ dest: './uploads' })
const upload = multer({ storage: storage });
module.exports = upload;