"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var StreamReader_1 = require("./StreamReader");
var TokenisedLineReader = (function (_super) {
    __extends(TokenisedLineReader, _super);
    function TokenisedLineReader(stream) {
        return _super.call(this, stream.baseStream) || this;
    }
    TokenisedLineReader.prototype.ReadUnsignedInteger = function () {
        var firstBit = this.peek();
        return 0x100 * this.peek() + firstBit;
    };
    /**
     * Read two's complement little-endian int token
     */
    TokenisedLineReader.prototype.ReadSignedInteger = function () {
        // 2's complement signed int, least significant byte first, sign bit is most significant bit
        var firstBit = this.peek();
        var lastBit = this.peek();
        var value = 0x100 * (lastBit & 0x7f) + firstBit;
        if ((lastBit & 0x80) == 0x80)
            return -0x8000 + value;
        return value;
    };
    /**
     * Reads BASIC octall number
     */
    TokenisedLineReader.prototype.ReadOctal = function () {
        var number = this.ReadUnsignedInteger();
        return "&O" + number.toString(8);
    };
    /**
     * Reads BASIC hexa number
     */
    TokenisedLineReader.prototype.ReadHex = function () {
        var number = this.ReadUnsignedInteger();
        return "&H" + number.toString(16).toUpperCase();
    };
    /**
     * Reads a byte from input stream from current position
     */
    TokenisedLineReader.prototype.readByte = function () {
        var current = this.peek();
        if (current == -1)
            return '';
        return String.fromCharCode(current);
    };
    /**
     * Reads BASIC line number
     */
    TokenisedLineReader.prototype.ReadLineNumber = function () {
        var word = this.ReadNext(2);
        if (word == "\0\0" || word.length < 2) {
            if (word.length > 0)
                this.position -= word.length - 1;
            return -1;
        }
        else if (word.length < 2) {
            this.position -= word.length - 2;
            return -1;
        }
        return this.ToUnsignedInteger(word);
    };
    /**
     * Convert given value to unsigned int
     * @param value A number to be converted
     */
    TokenisedLineReader.prototype.ToUnsignedInteger = function (value) {
        if (value.length != 2)
            throw "Invalid Basic Integer format";
        return 0x100 * value[1].charCodeAt(0) + value[0].charCodeAt(0);
    };
    /**
     * Reads BASIC numbers
     */
    TokenisedLineReader.prototype.ReadNumber = function () {
        var current = this.peek();
        if (current >= 0x11 && current < 0x1B)
            return (current - 0x11).toString();
        switch (current) {
            case 0x0B:
                return this.ReadOctal();
            case 0x0C:
                return this.ReadHex();
            case 0x0F:
                this.position--;
                var token = this.readu8().toString();
                this.position++;
                return token;
            case 0x1B:
                return "10";
            case 0x1C:
                return this.ReadSignedInteger().toString();
            case 0x1D:
                return this.readf32().toString();
            case 0x1F:
                return this.readf64().toString();
        }
        if (current > -1)
            this.position--;
        return null;
    };
    /**
     * Reads BASIC keyword
     */
    TokenisedLineReader.prototype.ReadKeywords = function () {
        var isComment = false;
        // try for single-byte token or two-byte token
        // if no match, first char is passed unchanged
        var current = this.peek();
        var keyword;
        var string = "";
        if (current >= 0xFD && current <= 0xFF) {
            keyword = this._tokens.fromOptCode((current << 8) | this.peek()).text;
        }
        else {
            keyword = this._tokens.fromOptCode(current).text;
        }
        if (keyword == "'")
            isComment = true;
        else if (keyword == "REM") {
            var next = this.peek();
            if (next > -1) {
                switch (next) {
                    case 0xd9:
                        // if next char is token('), we have the special value REM'
                        // -- replaced by ' below.
                        string += '\'';
                        break;
                    default:
                        this.position--;
                        break;
                }
            }
            isComment = true;
        }
        return { string: (string || keyword), comment: isComment };
    };
    return TokenisedLineReader;
}(StreamReader_1.StreamReader));
exports.TokenisedLineReader = TokenisedLineReader;
