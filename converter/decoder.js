"use strict";
exports.__esModule = true;
var TokenisedLineReader_1 = require("./TokenisedLineReader");
var tokens_1 = require("./tokens");
var StreamReader_1 = require("./StreamReader");
var Unprotect_1 = require("./Unprotect");
var decoder = (function () {
    function decoder() {
        this.first_byte = 0xFF; // first byte of the file (unencrypted)
        this.first_bcrpt = 0xFE; // first byte of the file (encrypted)
        this._tokens = new tokens_1.tokens();
    }
    decoder.prototype.setStream = function (byteStream) {
        this.firstByteofSteam = byteStream[0];
        this.type = this._getType();
        this.stream = new StreamReader_1.StreamReader(byteStream);
        if (this.type == 'P') {
            var unprotected = Unprotect_1.unprotect(byteStream, this.stream);
            this.stream.setStream(unprotected);
        }
    };
    decoder.prototype._getType = function () {
        switch (this.firstByteofSteam) {
            case this.first_byte:
                return 'T'; // tokenised
            case this.first_bcrpt:
                return 'P'; // protected
            default:
                return 'A'; // plain text
        }
    };
    decoder.prototype.decode = function () {
        var program = [];
        var inputStream = new TokenisedLineReader_1.TokenisedLineReader(this.stream);
        while (true) {
            var line = this.detokeniseLine(inputStream);
            if (!(line) || line.lineNum == -1)
                break;
            program.push(line.text);
        }
        return program.join('\n');
    };
    decoder.prototype.detokeniseLine = function (stream) {
        var inputStream = stream;
        var lineNumber;
        var outputStream = [];
        if (inputStream.read() == 32)
            inputStream.peek();
        var line = this._DetokeniseLine(inputStream);
        if (line)
            return { lineNum: line.lineNum, text: line.text };
        else
            return null;
    };
    decoder.prototype._DetokeniseLine = function (readerStream) {
        var writerStream = [];
        var currentLine = readerStream.ReadLineNumber();
        if (currentLine < 0)
            return null;
        // ignore up to one space after line number 0
        if (currentLine == 0 && readerStream.read() == 32)
            readerStream.peek();
        writerStream.push(currentLine.toString());
        // write one extra whitespace character after line number
        // unless first char is TAB
        if (readerStream.peek() != 9)
            writerStream.push(' ');
        readerStream.position--;
        writerStream.push(this.DetokeniseCompoundStatement(readerStream));
        return { lineNum: currentLine, text: writerStream.join('') };
        ;
    };
    decoder.prototype.DetokeniseCompoundStatement = function (readerStream) {
        var stringLiteral = false;
        var comment = false;
        var output = "";
        var lastTokenLength;
        while (true) {
            var current = readerStream.peek();
            if (current == -1 || current == 0x00)
                // \x00 ends lines and comments when listed,
                // if not inside a number constant
                // stream ended or end of line                
                break;
            if (current == 0x22) {
                // start of literal string, passed verbatim
                // until a closing quote or EOL comes by
                // however number codes are *printed* as the corresponding numbers,
                // even inside comments & literals
                var token = String.fromCharCode(current);
                lastTokenLength = token.length;
                output += token;
                stringLiteral = !stringLiteral;
            }
            else if (this._tokens.NumberTypeTokens.indexOf(String.fromCharCode(current)) > -1) {
                readerStream.position--;
                var token = readerStream.ReadNumber();
                lastTokenLength = token.length;
                output += token;
            }
            else if (this._tokens.LineNumberTokens.indexOf(String.fromCharCode(current)) > -1) {
                // 0D: line pointer (unsigned int) - this token should not be here;
                // interpret as line number and carry on
                // 0E: line number (unsigned int)
                var token = readerStream.ReadUnsignedInteger().toString();
                lastTokenLength = token.length;
                output += token;
            }
            else if (comment || stringLiteral || (current >= 0x20 && current <= 0x7E)) {
                var token = String.fromCharCode(current);
                lastTokenLength = token.length;
                output += token;
            }
            else if (current == 0x0A) {
                var token = "\x0A\x0D";
                lastTokenLength = token.length;
                output += token;
            }
            else if (current <= 0x09) {
                var token = String.fromCharCode(current);
                lastTokenLength = token.length;
                output += token;
            }
            else {
                //output = ""
                readerStream.position--;
                if (output.length > 0) {
                    // letter or number followed by token is separated by a space
                    var position = output.length - lastTokenLength;
                    var lastByte = output[position];
                    if (this._tokens.DecimalDigits.indexOf(lastByte) > -1 && !(this._tokens.Operators.indexOf(lastByte) > -1))
                        output = [output.slice(0, position), ' ', output.slice(position)].join(''); // adding space before last token
                }
                var keywordreader = readerStream.ReadKeywords();
                var keyword = keywordreader.string;
                comment = keywordreader.comment;
                output += keyword;
                // check for special cases
                //   [:REM']   ->  [']
                if (output.slice(-4) == ":REM")
                    output = output.slice(0, -4) + "'";
                else if (output.slice(-6) == "WHILE+")
                    output = output.slice(0, -6) + "WHILE";
                else if (output.slice(-4) == "ELSE") {
                    // note that anything before ELSE gets cut off,
                    // e.g. if we have 1ELSE instead of :ELSE it also becomes ELSE
                    var lastSix = output.slice(-6);
                    if (lastSix[1] == ':' && this._tokens.DecimalDigits.indexOf(lastSix[0]))
                        output = output.slice(0, -6) + ": ELSE";
                    else
                        output = output.slice(0, -6) + ":ELSE";
                }
                // token followed by token or number is separated by a space,
                // except operator tokens and SPC(, TAB(, FN, USR
                var next = readerStream.peek();
                readerStream.position--;
                var currentStr = String.fromCharCode(current);
                if (!comment && this.ShouldAddWhiteSpace(next) &&
                    !(this._tokens.Operators.indexOf(currentStr) > -1 ||
                        this._tokens.WithBracketTokens.indexOf(currentStr) > -1 ||
                        currentStr == "\xd0" ||
                        currentStr == "\xd1" // fn keyword
                    )) {
                    output += " ";
                }
            }
        }
        return output;
    };
    decoder.prototype.ShouldAddWhiteSpace = function (nextValue) {
        if (nextValue <= 0)
            return false;
        var nextStr = String.fromCharCode(nextValue);
        if (this._tokens.Operators.indexOf(nextStr) > -1)
            return false;
        if (nextStr == "'")
            return false;
        switch (nextValue) {
            case '"'.charCodeAt(0):
            case ','.charCodeAt(0):
            case ' '.charCodeAt(0):
            case ':'.charCodeAt(0):
            case '('.charCodeAt(0):
            case ')'.charCodeAt(0):
            case '$'.charCodeAt(0):
            case '%'.charCodeAt(0):
            case '!'.charCodeAt(0):
            case '#'.charCodeAt(0):
            case '_'.charCodeAt(0):
            case '@'.charCodeAt(0):
            case '~'.charCodeAt(0):
            case '|'.charCodeAt(0):
            case '`'.charCodeAt(0):
                return false;
        }
        return true;
    };
    return decoder;
}());
exports.decoder = decoder;
var line = (function () {
    function line() {
    }
    return line;
}());
exports.line = line;
