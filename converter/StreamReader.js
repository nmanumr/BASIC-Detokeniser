"use strict";
exports.__esModule = true;
var tokens_1 = require("./tokens");
var ByteBuffer = require('bytebuffer');
var StreamReader = (function () {
    function StreamReader(baseStream) {
        this._tokens = new tokens_1.tokens();
        // binary
        this.buffer = ByteBuffer.allocate(8, true);
        this.baseStream = baseStream;
        this.len = baseStream.length;
        this.position = 1; // skiping magic byte
    }
    /**
     * Change the byte stream
     * @param byteStream New byte stream
     */
    StreamReader.prototype.setStream = function (byteStream) {
        this.baseStream = byteStream;
    };
    StreamReader.prototype.getStream = function () {
        return this.baseStream;
    };
    StreamReader.prototype.peek = function () {
        var x = this.read();
        this.position += 1;
        return x;
    };
    StreamReader.prototype.read = function (n) {
        if (n === void 0) { n = 0; }
        return this.baseStream[this.position + n] || -1;
    };
    StreamReader.prototype.ReadNext = function (n) {
        if (n === void 0) { n = 1; }
        var string = "";
        while (n > 0) {
            var charcode = this.read(n - 1);
            string += String.fromCharCode((charcode > -1) ? charcode : 0x0);
            n--;
        }
        return string;
    };
    StreamReader.prototype.ReadLast = function (n) {
        var string = "";
        while (n > 0) {
            string += String.fromCharCode(this.read(-1 * n));
            n--;
        }
        return string;
    };
    /**
     * Check for End of Stream
     */
    StreamReader.prototype.isEOS = function () {
        if (this.read() == 0x1a)
            return true;
        return false;
    };
    StreamReader.prototype.isEOL = function () {
        if (this.read() == 0x00)
            return true;
        return false;
    };
    /**
     * Go to pos
     * @param {number} pos pos to jump
     */
    StreamReader.prototype.goBack = function (pos) {
        if (pos === void 0) { pos = 0; }
        this.position -= pos;
        return this.read(this.position - 1);
    };
    /**
     * go fore if byte is eqaul to current byte
     * @param {number} ch Char code
     */
    StreamReader.prototype.peekIfByte = function (ch) {
        if (ch === this.read()) {
            this.position++;
            return true;
        }
        return false;
    };
    /**
     * go fore until condition is not false
     * @param {(number) => boolean} condition Char codes
     */
    StreamReader.prototype.peekWhilebyte = function (condition) {
        var posNow = this.position;
        while (this.position < this.len && condition(this.read())) {
            this.position++;
        }
        return this.position - posNow;
    };
    StreamReader.prototype.readu8 = function () {
        this.position++;
        return this.read();
    };
    StreamReader.prototype.read16 = function () {
        this.buffer.clear();
        this.buffer.writeByte(this.read()).writeByte(this.read()).flip();
        this.position += 2;
        return this.buffer.readShort();
    };
    StreamReader.prototype.readu16 = function () {
        return this.read16() & 0xFFFF;
    };
    StreamReader.prototype.readf32 = function () {
        this.buffer.clear();
        this.buffer.writeByte(this.read()).
            writeByte(this.read()).
            writeByte(this.read()).
            writeByte(this.read()).
            flip();
        this.position += 4;
        var bs = this.buffer.toArrayBuffer();
        if (bs[3] != -1 && bs[3] && bs[3] != 0) {
            var sign = bs[2] & 0x80;
            var exp = (bs[3] - 2) & 0xFF;
            bs[3] = sign | (exp >> 1);
            bs[2] = (exp << 7) | (bs[2] & 0x7F);
            return this.buffer.readFloat();
        }
        return 0.0;
    };
    StreamReader.prototype.readf64 = function () {
        var bs = [
            this.read(),
            this.read(),
            this.read(),
            this.read(),
            this.read(),
            this.read(),
            this.read(),
            this.read()
        ];
        this.position += 8;
        // convert MBF to IEEE
        //  http://stackoverflow.com/questions/2973913/convert-mbf-single-and-double-to-ieee
        if (bs[7] != -1 && bs[7] && bs[7] != 0) {
            var iees = [];
            var sign = bs[6] & 0x80;
            var exp = (bs[3] - 128 - 1 + 1023) & 0xFFFF;
            iees[7] = sign | (exp >> 4);
            iees[6] = exp << 4;
            for (var idx = 6; idx >= 1; idx--) {
                bs[idx] = ((bs[idx] << 1) | (bs[idx - 1] >> 7)) & 0xFF;
                iees[idx] = iees[idx] | (bs[idx] >> 4);
                iees[idx - 1] = iees[idx - 1] | (bs[idx] << 4);
            }
            bs[0] = bs[0] << 1;
            iees[0] = iees[0] | (bs[0] >> 4);
            return ByteBuffer.wrap(iees, true, true).readDouble();
        }
        return 0.0;
    };
    return StreamReader;
}());
exports.StreamReader = StreamReader;
