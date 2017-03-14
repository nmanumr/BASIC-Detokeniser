import { tokens } from './converter/tokens';
import { decoder } from './converter/decoder';

declare function require(name:string);

var fs = require('fs');
var buffer = fs.readFileSync('C:\\Users\\Nauman Umer\\C.BAS');

var _decoder = new decoder();
_decoder.setStream(buffer);
console.log(_decoder.decode())
