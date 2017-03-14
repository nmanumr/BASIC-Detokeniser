import { StreamReader } from './StreamReader';
import { tokens } from './tokens';

export class TokenisedLineReader extends StreamReader {

    constructor(stream) {
        super(stream.baseStream);
    }

    public ReadUnsignedInteger(): number {
        var firstBit = this.peek();
        return 0x100 * this.peek() + firstBit;
    }

    /**
     * Read two's complement little-endian int token
     */
    private ReadSignedInteger(): number {
        // 2's complement signed int, least significant byte first, sign bit is most significant bit
        var firstBit = this.peek();
        var lastBit = this.peek();

        var value = 0x100 * (lastBit & 0x7f) + firstBit;
        if ((lastBit & 0x80) == 0x80)
            return -0x8000 + value;

        return value;
    }

    /**
     * Reads BASIC octall number
     */
    private ReadOctal(): string {
        var number = this.ReadUnsignedInteger();
        return "&O" + number.toString(8);
    }

    /**
     * Reads BASIC hexa number
     */
    private ReadHex(): string {
        var number = this.ReadUnsignedInteger();
        return "&H" + number.toString(16).toUpperCase();
    }

    /**
     * Reads a byte from input stream from current position
     */
    public readByte(): string {
        var current = this.peek();
        if (current == -1)
            return '';

        return String.fromCharCode(current);
    }

    /**
     * Reads BASIC line number
     */
    public ReadLineNumber(): number {
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
    }

    /**
     * Convert given value to unsigned int
     * @param value A number to be converted
     */
    public ToUnsignedInteger(value: string): number {
        if (value.length != 2)
            throw "Invalid Basic Integer format";

        return 0x100 * value[1].charCodeAt(0) + value[0].charCodeAt(0);
    }

    /**
     * Reads BASIC numbers
     */
    public ReadNumber(): string {
        var current = this.peek();

        if (current >= 0x11 && current < 0x1B)
            return (current - 0x11).toString();

        switch (current) {
            case 0x0B: // Octal Constant
                return this.ReadOctal();
            case 0x0C: // hexadecimal Constant
                return this.ReadHex();
            case 0x0F: // byte Constant
                this.position --;
                var token = this.readu8().toString();
                this.position ++;
                return token;
            case 0x1B: // 10 Constant
                return "10";
            case 0x1C: // integer Constant
                return this.ReadSignedInteger().toString();
            case 0x1D: // float Constant
                return this.readf32().toString();
            case 0x1F: // double Constant
                return this.readf64().toString();
        }

        if (current > -1)
            this.position--;

        return null;
    }

    /**
     * Reads BASIC keyword
     */
    public ReadKeywords() {
        var isComment = false;
        // try for single-byte token or two-byte token
        // if no match, first char is passed unchanged
        var current = this.peek();
        var keyword: string;
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
    }
}