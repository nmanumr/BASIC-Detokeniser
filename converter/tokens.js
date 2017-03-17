"use strict";
exports.__esModule = true;
var tokens = (function () {
    function tokens() {
        this._tokens = (_a = {},
            _a[0x00] = 'EOL',
            _a[0x81] = "END",
            _a[0x82] = "FOR",
            _a[0x83] = "NEXT",
            _a[0x84] = "DATA",
            _a[0x85] = "INPUT",
            _a[0x86] = "DIM",
            _a[0x87] = "READ",
            _a[0x88] = "LET",
            _a[0x89] = "GOTO",
            _a[0x8A] = "RUN",
            _a[0x8B] = "IF",
            _a[0x8C] = "RESTORE",
            _a[0x8D] = "GOSUB",
            _a[0x8E] = "RETURN",
            _a[0x8F] = "REM",
            _a[0x90] = "STOP",
            _a[0x91] = "PRINT",
            _a[0x92] = "CLEAR",
            _a[0x93] = "LIST",
            _a[0x94] = "NEW",
            _a[0x95] = "ON",
            _a[0x96] = "WAIT",
            _a[0x97] = "DEF",
            _a[0x98] = "POKE",
            _a[0x99] = "CONT",
            _a[0x9C] = "OUT",
            _a[0x9D] = "LPRINT",
            _a[0x9E] = "LLIST",
            _a[0xA0] = "WIDTH",
            _a[0xA1] = "ELSE",
            _a[0xA2] = "TRON",
            _a[0xA3] = "TROFF",
            _a[0xA4] = "SWAP",
            _a[0xA5] = "ERASE",
            _a[0xA6] = "EDIT",
            _a[0xA7] = "ERROR",
            _a[0xA8] = "RESUME",
            _a[0xA9] = "DELETE",
            _a[0xAA] = "AUTO",
            _a[0xAB] = "RENUM",
            _a[0xAC] = "DEFSTR",
            _a[0xAD] = "DEFINT",
            _a[0xAE] = "DEFSNG",
            _a[0xAF] = "DEFDBL",
            _a[0xB0] = "LINE",
            _a[0xB1] = "WHILE",
            _a[0xB2] = "WEND",
            _a[0xB3] = "CALL",
            _a[0xB7] = "WRITE",
            _a[0xB8] = "OPTION",
            _a[0xB9] = "RANDOMIZE",
            _a[0xBA] = "OPEN",
            _a[0xBB] = "CLOSE",
            _a[0xBC] = "LOAD",
            _a[0xBD] = "MERGE",
            _a[0xBE] = "SAVE",
            _a[0xBF] = "COLOR",
            _a[0xC0] = "CLS",
            _a[0xC1] = "MOTOR",
            _a[0xC2] = "BSAVE",
            _a[0xC3] = "BLOAD",
            _a[0xC4] = "SOUND",
            _a[0xC5] = "BEEP",
            _a[0xC6] = "PSET",
            _a[0xC7] = "PRESET",
            _a[0xC8] = "SCREEN",
            _a[0xC9] = "KEY",
            _a[0xCA] = "LOCATE",
            _a[0xCC] = "TO",
            _a[0xCD] = "THEN",
            _a[0xCE] = "TAB(",
            _a[0xCF] = "STEP",
            _a[0xD0] = "USR",
            _a[0xD1] = "FN",
            _a[0xD2] = "SPC(",
            _a[0xD3] = "NOT",
            _a[0xD4] = "ERL",
            _a[0xD5] = "ERR",
            _a[0xD6] = "STRING$",
            _a[0xD7] = "USING",
            _a[0xD8] = "INSTR",
            _a[0xD9] = "'",
            _a[0xDA] = "VARPTR",
            _a[0xDB] = "CSRLIN",
            _a[0xDC] = "POINT",
            _a[0xDD] = "OFF",
            _a[0xDE] = "INKEY$",
            _a[0xE6] = ">",
            _a[0xE7] = "=",
            _a[0xE8] = "<",
            _a[0xE9] = "+",
            _a[0xEA] = "-",
            _a[0xEB] = "*",
            _a[0xEC] = "/",
            _a[0xED] = "^",
            _a[0xEE] = "AND",
            _a[0xEF] = "OR",
            _a[0xF0] = "XOR",
            _a[0xF1] = "EQV",
            _a[0xF2] = "IMP",
            _a[0xF3] = "MOD",
            _a[0xF4] = "\\",
            _a[0xFD81] = "CVI",
            _a[0xFD82] = "CVS",
            _a[0xFD83] = "CVD",
            _a[0xFD84] = "MKI$",
            _a[0xFD85] = "MKS$",
            _a[0xFD86] = "MKD$",
            _a[0xFD8B] = "EXTERR",
            _a[0xFE81] = "FILES",
            _a[0xFE82] = "FIELD",
            _a[0xFE83] = "SYSTEM",
            _a[0xFE84] = "NAME",
            _a[0xFE85] = "LSET",
            _a[0xFE86] = "RSET",
            _a[0xFE87] = "KILL",
            _a[0xFE88] = "PUT",
            _a[0xFE89] = "GET",
            _a[0xFE8A] = "RESET",
            _a[0xFE8B] = "COMMON",
            _a[0xFE8C] = "CHAIN",
            _a[0xFE8D] = "DATE$",
            _a[0xFE8E] = "TIME$",
            _a[0xFE8F] = "PAINT",
            _a[0xFE90] = "COM",
            _a[0xFE91] = "CIRCLE",
            _a[0xFE92] = "DRAW",
            _a[0xFE93] = "PLAY",
            _a[0xFE94] = "TIMER",
            _a[0xFE95] = "ERDEV",
            _a[0xFE96] = "IOCTL",
            _a[0xFE97] = "CHDIR",
            _a[0xFE98] = "MKDIR",
            _a[0xFE99] = "RMDIR",
            _a[0xFE9A] = "SHELL",
            _a[0xFE9B] = "ENVIRON",
            _a[0xFE9C] = "VIEW",
            _a[0xFE9D] = "WINDOW",
            _a[0xFE9E] = "PMAP",
            _a[0xFE9F] = "PALETTE",
            _a[0xFEA0] = "LCOPY",
            _a[0xFEA1] = "CALLS",
            _a[0xFEA4] = "NOISE",
            _a[0xFEA5] = "PCOPY",
            _a[0xFEA6] = "TERM",
            _a[0xFEA7] = "LOCK",
            _a[0xFEA8] = "UNLOCK",
            _a[0xFF81] = "LEFT$",
            _a[0xFF82] = "RIGHT$",
            _a[0xFF83] = "MID$",
            _a[0xFF84] = "SGN",
            _a[0xFF85] = "INT",
            _a[0xFF86] = "ABS",
            _a[0xFF87] = "SQR",
            _a[0xFF88] = "RND",
            _a[0xFF89] = "SIN",
            _a[0xFF8A] = "LOG",
            _a[0xFF8B] = "EXP",
            _a[0xFF8C] = "COS",
            _a[0xFF8D] = "TAN",
            _a[0xFF8E] = "ATN",
            _a[0xFF8F] = "FRE",
            _a[0xFF90] = "INP",
            _a[0xFF91] = "POS",
            _a[0xFF92] = "LEN",
            _a[0xFF93] = "STR$",
            _a[0xFF94] = "VAL",
            _a[0xFF95] = "ASC",
            _a[0xFF96] = "CHR$",
            _a[0xFF97] = "PEEK",
            _a[0xFF98] = "SPACE$",
            _a[0xFF99] = "OCT$",
            _a[0xFF9A] = "HEX$",
            _a[0xFF9B] = "LPOS",
            _a[0xFF9C] = "CINT",
            _a[0xFF9D] = "CSNG",
            _a[0xFF9E] = "CDBL",
            _a[0xFF9F] = "FIX",
            _a[0xFFA0] = "PEN",
            _a[0xFFA1] = "STICK",
            _a[0xFFA2] = "STRIG",
            _a[0xFFA3] = "EOF",
            _a[0xFFA4] = "LOC",
            _a[0xFFA5] = "LOF",
            _a);
        this.NumberTypeTokens = ['\x0B', '\x0C', '\x0f', '\x1c', '\x1d', '\x1f', '\x11', '\x12', '\x13', '\x14', '\x15', '\x16', '\x17', '\x18', '\x19', '\x1a', '\x1b'];
        this.LineNumberTokens = ['\x0D', '\x0E'];
        this.OctalDigits = ['0', '1', '2', '3', '4', '5', '6', '7'];
        this.DecimalDigits = this.OctalDigits.concat(['8', '9']);
        this.HexaDigits = this.DecimalDigits.concat([
            'a', 'A',
            'b', 'B',
            'c', 'C',
            'd', 'D',
            'e', 'E',
            'f', 'F'
        ]);
        this.Operators = ['+', '-', '=', '/', '\\', '^', '*', '<', '>'];
        this.WithBracketTokens = ["\xd2", "\xce"];
        var _a;
    }
    tokens.prototype.fromOptCode = function (code) {
        return { TokenCode: code, text: this._tokens[code] };
    };
    tokens.prototype.fromLiteral = function (literal) {
        return { TokenCode: literal.charCodeAt(0), text: String.fromCharCode(parseInt(literal)) };
    };
    tokens.prototype.fromChLiteral = function (ch) {
        return { TokenCode: ch, text: String.fromCharCode(ch) };
    };
    tokens.prototype.fromNumber = function (num, base) {
        var text;
        switch (base) {
            case 8:
                text = "&O" + num.toString(7);
                break;
            case 16:
                text = "&H" + num.toString(16);
                break;
            default:
                text = num.toString();
                break;
        }
        return { TokenCode: -1, text: text };
    };
    tokens.prototype.fromFloat = function (num) {
        return { TokenCode: num, text: num.toString() };
    };
    return tokens;
}());
exports.tokens = tokens;
var token = (function () {
    function token() {
    }
    return token;
}());
exports.token = token;
