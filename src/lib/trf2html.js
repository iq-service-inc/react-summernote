function newstringToArrayBuffer(string) {

    var ret = [],
        rePictureHeader = /\{\\pict[\s\S]+?\\bliptag\-?\d+(\\blipupi\-?\d+)?(\{\\\*\\blipuid\s?[\da-fA-F]+)?[\s\}]*?/,
        rePicture = new RegExp('(?:(' + rePictureHeader.source + '))([\\da-fA-F\\s]+)\\}', 'g'),
        wholeImages,
        imageType

    var start = string.indexOf('\{\\*\\listpicture')
    if(start > -1){
        var brackets = 0, i = start
        for (i; i < string.length; i++) {
            const char = string[i];
            if (char == '{') brackets = brackets + 1
            if (char == '}') brackets = brackets - 1
            if (brackets == 0) break
        }
        var str = string.substring(0, start) + string.substring(i)
    }
    else str = string

    wholeImages = str.match(rePicture);

    if (!wholeImages) {

        return ret;
    }

    for (var i = 0; i < wholeImages.length; i++) {
        if (rePictureHeader.test(wholeImages[i])) {

            if (wholeImages[i].indexOf('\\pngblip') !== -1) {
                imageType = 'image/png';
            } else if (wholeImages[i].indexOf('\\jpegblip') !== -1) {

                imageType = 'image/jpeg';
            } else {
                continue;
            }

            ret.push({
                hex: imageType ? wholeImages[i].replace(rePictureHeader, '').replace(/[^\da-fA-F]/g, '') : null,
                type: imageType
            });
        }
    }
    return ret;

}

function convertHexStringToBytes(hexString) {
    var bytesArray = [],
        bytesArrayLength = hexString.length / 2,
        i;

    for (i = 0; i < bytesArrayLength; i++) {

        bytesArray.push(parseInt(hexString.substr(i * 2, 2), 16));
    }
    return bytesArray;
}

function convertBytesToBase64(bytesArray) {
    var base64characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/',
        base64string = '',
        bytesArrayLength = bytesArray.length,
        i;

    for (i = 0; i < bytesArrayLength; i += 3) {
        var array3 = bytesArray.slice(i, i + 3),
            array3length = array3.length,
            array4 = [],
            j;

        if (array3length < 3) {
            for (j = array3length; j < 3; j++) {
                array3[j] = 0;
            }
        }

        // 0xFC -> 11111100 || 0x03 -> 00000011 || 0x0F -> 00001111 || 0xC0 -> 11000000 || 0x3F -> 00111111
        array4[0] = (array3[0] & 0xFC) >> 2;
        array4[1] = ((array3[0] & 0x03) << 4) | (array3[1] >> 4);
        array4[2] = ((array3[1] & 0x0F) << 2) | ((array3[2] & 0xC0) >> 6);
        array4[3] = array3[2] & 0x3F;

        for (j = 0; j < 4; j++) {
            if (j <= array3length) {
                base64string += base64characters.charAt(array4[j]);
            } else {
                base64string += '=';
            }
        }

    }
    return base64string;
}


function createSrcWithBase64(img) {
    return img.type ? 'data:' + img.type + ';base64,' + convertBytesToBase64(convertHexStringToBytes(img.hex)) : null;
}


export default rtf => {
    if (!rtf) rtf = ''
    var hexImage = newstringToArrayBuffer(rtf)
    const newSrcValues = []
    hexImage.forEach(function (img) {
        newSrcValues.push(createSrcWithBase64(img))
    })

    return newSrcValues;
}