import { StreamReader } from './StreamReader';
declare var Buffer: any;

export function unprotect(byteStream, stream: StreamReader) {
    // 13-byte and 11-byte keys used by GW-BASIC
    var key1 = [0xA9, 0x84, 0x8D, 0xCD, 0x75, 0x83, 0x43, 0x63, 0x24, 0x83, 0x19, 0xF7, 0x9A]
    var key2 = [0x1E, 0x1D, 0xC4, 0x77, 0x26, 0x97, 0xE0, 0x74, 0x59, 0x88, 0x7C]

    var index = 0, n = 2;
    var token = stream.read(1);
    var output = [0xff]

    while (token != -1 && token != null) {
        var next = stream.read(n);

        // drop last char (EOF 0x1a)
        if (stream.isEOS()) {
            break;
        }

        var charCode = String.fromCharCode(token).charCodeAt(0);
        charCode -= 11 - (index % 11)
        charCode ^= key1[index % 13]
        charCode ^= key2[index % 11]
        charCode += 13 - (index % 13)

        output.push(String.fromCharCode(charCode).charCodeAt(0));

        index = (index + 1) % (13 * 11);
        token = next;
        n++;
    }
    var outBuffer = Buffer.from(output);

    return outBuffer;
}