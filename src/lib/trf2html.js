import { EMFJS, RTFJS, WMFJS } from 'rtf.js';

function stringToArrayBuffer(string) {
    var buffer = new ArrayBuffer(string.length);
    var bufferView = new Uint8Array(buffer);
    for (var i = 0; i < string.length; i++) {
        bufferView[i] = string.charCodeAt(i);
    }
    return buffer;
}

RTFJS.loggingEnabled(false);
WMFJS.loggingEnabled(false);
EMFJS.loggingEnabled(false);

export default rtf => {
    if (!rtf) rtf = ''
    return new RTFJS.Document(stringToArrayBuffer(rtf));
}