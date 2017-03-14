import { tokens } from './tokens';
declare function require(name: string);
var ByteBuffer = require('bytebuffer')

export class StreamReader {

    public baseStream;
    private len: number;
    public position: number;
    public _tokens = new tokens();

    constructor(baseStream) {
        this.baseStream = baseStream;
        this.len = baseStream.length;
        this.position = 1; // skiping magic byte
    }

    /**
     * Change the byte stream
     * @param byteStream New byte stream
     */
    public setStream(byteStream) {
        this.baseStream = byteStream;
    }

    /**
     * ret
     */
    public getStream() {
        return this.baseStream;
    }

    public peek(): number {
        var x = this.read();
        this.position += 1;
        return x;
    }

    public read(n: number = 0): number {
        return this.baseStream[this.position + n] || -1;
    }

    public ReadNext(n: number = 1): string {
        var string: string ="";
        while (n > 0) {
            var charcode = this.read(n-1);
            string += String.fromCharCode((charcode > -1)? charcode: 0x0);
            n--;
        }
        return string;
    }

    public ReadLast(n: number) {
        var string: string="";
        while (n > 0) {
            string += String.fromCharCode(this.read(-1*n));
            n--;
        }
        return string;
    }

    /**
	 * Check for End of Stream
	 */
    public isEOS(): boolean {
        if (this.read() == 0x1a)
            return true;
        return false
    }

    public isEOL(): boolean {
        if (this.read() == 0x00)
            return true;
        return false;
    }

    /**
	 * Go to pos
	 * @param {number} pos pos to jump
	 */
    public goBack(pos: number = 0) {
        this.position -= pos;
        return this.read(this.position - 1);
    }

    /**
	 * go fore if byte is eqaul to current byte
	 * @param {number} ch Char code
	 */
    public peekIfByte(ch: number): boolean {
        if (ch === this.read()) {
            this.position++;
            return true;
        }
        return false;
    }

    /**
	 * go fore until condition is not false
	 * @param {(number) => boolean} condition Char codes
	 */
    public peekWhilebyte(condition: (ch: number) => boolean): number {
        let posNow = this.position;
        while (this.position < this.len && condition(this.read())) {
            this.position++;
        }
        return this.position - posNow;
    }


    // binary
    private buffer = ByteBuffer.allocate(8, true);
    public readu8(): number {
        this.position++;
        return this.read();
    }

    public read16(): number {
        this.buffer.clear();
        this.buffer.writeByte(this.read()).writeByte(this.read()).flip();
        this.position += 2;
        return this.buffer.readShort();
    }

    public readu16(): number {
        return this.read16() & 0xFFFF;
    }

    public readf32(): number {
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
    }

    public readf64(): number {
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
    }
}