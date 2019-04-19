var express = require('express')
var $ajax = require('axios')

var multer = require('multer');
var fs = require('fs');
var UPLOAD_PATH = './uploads'
var upload = multer({ dest: UPLOAD_PATH })

var native = require('../../config/native')
var port = require('../../config/interface')
var router = express.Router()
var common = require('../common')

module.exports = router
