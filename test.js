"use strict";
exports.__esModule = true;
var decoder_1 = require("./converter/decoder");
var fs = require('fs');
var buffer = fs.readFileSync('C:\\Users\\Nauman Umer\\C.BAS');
var _decoder = new decoder_1.decoder();
_decoder.setStream(buffer);
console.log(_decoder.decode());
