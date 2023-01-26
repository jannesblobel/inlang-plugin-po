var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from2, except, desc) => {
  if (from2 && typeof from2 === "object" || typeof from2 === "function") {
    for (let key of __getOwnPropNames(from2))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from2[key], enumerable: !(desc = __getOwnPropDesc(from2, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// node-modules-polyfills:buffer
var buffer_exports = {};
__export(buffer_exports, {
  Buffer: () => Buffer2,
  INSPECT_MAX_BYTES: () => INSPECT_MAX_BYTES,
  SlowBuffer: () => SlowBuffer,
  isBuffer: () => isBuffer,
  kMaxLength: () => _kMaxLength
});
function init() {
  inited = true;
  var code = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  for (var i = 0, len = code.length; i < len; ++i) {
    lookup[i] = code[i];
    revLookup[code.charCodeAt(i)] = i;
  }
  revLookup["-".charCodeAt(0)] = 62;
  revLookup["_".charCodeAt(0)] = 63;
}
function toByteArray(b64) {
  if (!inited) {
    init();
  }
  var i, j, l, tmp, placeHolders, arr;
  var len = b64.length;
  if (len % 4 > 0) {
    throw new Error("Invalid string. Length must be a multiple of 4");
  }
  placeHolders = b64[len - 2] === "=" ? 2 : b64[len - 1] === "=" ? 1 : 0;
  arr = new Arr(len * 3 / 4 - placeHolders);
  l = placeHolders > 0 ? len - 4 : len;
  var L = 0;
  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = revLookup[b64.charCodeAt(i)] << 18 | revLookup[b64.charCodeAt(i + 1)] << 12 | revLookup[b64.charCodeAt(i + 2)] << 6 | revLookup[b64.charCodeAt(i + 3)];
    arr[L++] = tmp >> 16 & 255;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  if (placeHolders === 2) {
    tmp = revLookup[b64.charCodeAt(i)] << 2 | revLookup[b64.charCodeAt(i + 1)] >> 4;
    arr[L++] = tmp & 255;
  } else if (placeHolders === 1) {
    tmp = revLookup[b64.charCodeAt(i)] << 10 | revLookup[b64.charCodeAt(i + 1)] << 4 | revLookup[b64.charCodeAt(i + 2)] >> 2;
    arr[L++] = tmp >> 8 & 255;
    arr[L++] = tmp & 255;
  }
  return arr;
}
function tripletToBase64(num) {
  return lookup[num >> 18 & 63] + lookup[num >> 12 & 63] + lookup[num >> 6 & 63] + lookup[num & 63];
}
function encodeChunk(uint8, start, end) {
  var tmp;
  var output = [];
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + uint8[i + 2];
    output.push(tripletToBase64(tmp));
  }
  return output.join("");
}
function fromByteArray(uint8) {
  if (!inited) {
    init();
  }
  var tmp;
  var len = uint8.length;
  var extraBytes = len % 3;
  var output = "";
  var parts = [];
  var maxChunkLength = 16383;
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, i + maxChunkLength > len2 ? len2 : i + maxChunkLength));
  }
  if (extraBytes === 1) {
    tmp = uint8[len - 1];
    output += lookup[tmp >> 2];
    output += lookup[tmp << 4 & 63];
    output += "==";
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + uint8[len - 1];
    output += lookup[tmp >> 10];
    output += lookup[tmp >> 4 & 63];
    output += lookup[tmp << 2 & 63];
    output += "=";
  }
  parts.push(output);
  return parts.join("");
}
function read(buffer, offset, isLE, mLen, nBytes) {
  var e, m;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var nBits = -7;
  var i = isLE ? nBytes - 1 : 0;
  var d = isLE ? -1 : 1;
  var s = buffer[offset + i];
  i += d;
  e = s & (1 << -nBits) - 1;
  s >>= -nBits;
  nBits += eLen;
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  m = e & (1 << -nBits) - 1;
  e >>= -nBits;
  nBits += mLen;
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {
  }
  if (e === 0) {
    e = 1 - eBias;
  } else if (e === eMax) {
    return m ? NaN : (s ? -1 : 1) * Infinity;
  } else {
    m = m + Math.pow(2, mLen);
    e = e - eBias;
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen);
}
function write(buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c;
  var eLen = nBytes * 8 - mLen - 1;
  var eMax = (1 << eLen) - 1;
  var eBias = eMax >> 1;
  var rt = mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0;
  var i = isLE ? 0 : nBytes - 1;
  var d = isLE ? 1 : -1;
  var s = value < 0 || value === 0 && 1 / value < 0 ? 1 : 0;
  value = Math.abs(value);
  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0;
    e = eMax;
  } else {
    e = Math.floor(Math.log(value) / Math.LN2);
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--;
      c *= 2;
    }
    if (e + eBias >= 1) {
      value += rt / c;
    } else {
      value += rt * Math.pow(2, 1 - eBias);
    }
    if (value * c >= 2) {
      e++;
      c /= 2;
    }
    if (e + eBias >= eMax) {
      m = 0;
      e = eMax;
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen);
      e = e + eBias;
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen);
      e = 0;
    }
  }
  for (; mLen >= 8; buffer[offset + i] = m & 255, i += d, m /= 256, mLen -= 8) {
  }
  e = e << mLen | m;
  eLen += mLen;
  for (; eLen > 0; buffer[offset + i] = e & 255, i += d, e /= 256, eLen -= 8) {
  }
  buffer[offset + i - d] |= s * 128;
}
function kMaxLength() {
  return Buffer2.TYPED_ARRAY_SUPPORT ? 2147483647 : 1073741823;
}
function createBuffer(that, length) {
  if (kMaxLength() < length) {
    throw new RangeError("Invalid typed array length");
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = new Uint8Array(length);
    that.__proto__ = Buffer2.prototype;
  } else {
    if (that === null) {
      that = new Buffer2(length);
    }
    that.length = length;
  }
  return that;
}
function Buffer2(arg, encodingOrOffset, length) {
  if (!Buffer2.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer2)) {
    return new Buffer2(arg, encodingOrOffset, length);
  }
  if (typeof arg === "number") {
    if (typeof encodingOrOffset === "string") {
      throw new Error(
        "If encoding is specified then the first argument must be a string"
      );
    }
    return allocUnsafe(this, arg);
  }
  return from(this, arg, encodingOrOffset, length);
}
function from(that, value, encodingOrOffset, length) {
  if (typeof value === "number") {
    throw new TypeError('"value" argument must not be a number');
  }
  if (typeof ArrayBuffer !== "undefined" && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length);
  }
  if (typeof value === "string") {
    return fromString(that, value, encodingOrOffset);
  }
  return fromObject(that, value);
}
function assertSize(size) {
  if (typeof size !== "number") {
    throw new TypeError('"size" argument must be a number');
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative');
  }
}
function alloc(that, size, fill2, encoding) {
  assertSize(size);
  if (size <= 0) {
    return createBuffer(that, size);
  }
  if (fill2 !== void 0) {
    return typeof encoding === "string" ? createBuffer(that, size).fill(fill2, encoding) : createBuffer(that, size).fill(fill2);
  }
  return createBuffer(that, size);
}
function allocUnsafe(that, size) {
  assertSize(size);
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0);
  if (!Buffer2.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0;
    }
  }
  return that;
}
function fromString(that, string, encoding) {
  if (typeof encoding !== "string" || encoding === "") {
    encoding = "utf8";
  }
  if (!Buffer2.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding');
  }
  var length = byteLength(string, encoding) | 0;
  that = createBuffer(that, length);
  var actual = that.write(string, encoding);
  if (actual !== length) {
    that = that.slice(0, actual);
  }
  return that;
}
function fromArrayLike(that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0;
  that = createBuffer(that, length);
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255;
  }
  return that;
}
function fromArrayBuffer(that, array, byteOffset, length) {
  array.byteLength;
  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError("'offset' is out of bounds");
  }
  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError("'length' is out of bounds");
  }
  if (byteOffset === void 0 && length === void 0) {
    array = new Uint8Array(array);
  } else if (length === void 0) {
    array = new Uint8Array(array, byteOffset);
  } else {
    array = new Uint8Array(array, byteOffset, length);
  }
  if (Buffer2.TYPED_ARRAY_SUPPORT) {
    that = array;
    that.__proto__ = Buffer2.prototype;
  } else {
    that = fromArrayLike(that, array);
  }
  return that;
}
function fromObject(that, obj) {
  if (internalIsBuffer(obj)) {
    var len = checked(obj.length) | 0;
    that = createBuffer(that, len);
    if (that.length === 0) {
      return that;
    }
    obj.copy(that, 0, 0, len);
    return that;
  }
  if (obj) {
    if (typeof ArrayBuffer !== "undefined" && obj.buffer instanceof ArrayBuffer || "length" in obj) {
      if (typeof obj.length !== "number" || isnan(obj.length)) {
        return createBuffer(that, 0);
      }
      return fromArrayLike(that, obj);
    }
    if (obj.type === "Buffer" && isArray(obj.data)) {
      return fromArrayLike(that, obj.data);
    }
  }
  throw new TypeError("First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.");
}
function checked(length) {
  if (length >= kMaxLength()) {
    throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x" + kMaxLength().toString(16) + " bytes");
  }
  return length | 0;
}
function SlowBuffer(length) {
  if (+length != length) {
    length = 0;
  }
  return Buffer2.alloc(+length);
}
function internalIsBuffer(b) {
  return !!(b != null && b._isBuffer);
}
function byteLength(string, encoding) {
  if (internalIsBuffer(string)) {
    return string.length;
  }
  if (typeof ArrayBuffer !== "undefined" && typeof ArrayBuffer.isView === "function" && (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength;
  }
  if (typeof string !== "string") {
    string = "" + string;
  }
  var len = string.length;
  if (len === 0)
    return 0;
  var loweredCase = false;
  for (; ; ) {
    switch (encoding) {
      case "ascii":
      case "latin1":
      case "binary":
        return len;
      case "utf8":
      case "utf-8":
      case void 0:
        return utf8ToBytes(string).length;
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return len * 2;
      case "hex":
        return len >>> 1;
      case "base64":
        return base64ToBytes(string).length;
      default:
        if (loweredCase)
          return utf8ToBytes(string).length;
        encoding = ("" + encoding).toLowerCase();
        loweredCase = true;
    }
  }
}
function slowToString(encoding, start, end) {
  var loweredCase = false;
  if (start === void 0 || start < 0) {
    start = 0;
  }
  if (start > this.length) {
    return "";
  }
  if (end === void 0 || end > this.length) {
    end = this.length;
  }
  if (end <= 0) {
    return "";
  }
  end >>>= 0;
  start >>>= 0;
  if (end <= start) {
    return "";
  }
  if (!encoding)
    encoding = "utf8";
  while (true) {
    switch (encoding) {
      case "hex":
        return hexSlice(this, start, end);
      case "utf8":
      case "utf-8":
        return utf8Slice(this, start, end);
      case "ascii":
        return asciiSlice(this, start, end);
      case "latin1":
      case "binary":
        return latin1Slice(this, start, end);
      case "base64":
        return base64Slice(this, start, end);
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return utf16leSlice(this, start, end);
      default:
        if (loweredCase)
          throw new TypeError("Unknown encoding: " + encoding);
        encoding = (encoding + "").toLowerCase();
        loweredCase = true;
    }
  }
}
function swap(b, n, m) {
  var i = b[n];
  b[n] = b[m];
  b[m] = i;
}
function bidirectionalIndexOf(buffer, val, byteOffset, encoding, dir) {
  if (buffer.length === 0)
    return -1;
  if (typeof byteOffset === "string") {
    encoding = byteOffset;
    byteOffset = 0;
  } else if (byteOffset > 2147483647) {
    byteOffset = 2147483647;
  } else if (byteOffset < -2147483648) {
    byteOffset = -2147483648;
  }
  byteOffset = +byteOffset;
  if (isNaN(byteOffset)) {
    byteOffset = dir ? 0 : buffer.length - 1;
  }
  if (byteOffset < 0)
    byteOffset = buffer.length + byteOffset;
  if (byteOffset >= buffer.length) {
    if (dir)
      return -1;
    else
      byteOffset = buffer.length - 1;
  } else if (byteOffset < 0) {
    if (dir)
      byteOffset = 0;
    else
      return -1;
  }
  if (typeof val === "string") {
    val = Buffer2.from(val, encoding);
  }
  if (internalIsBuffer(val)) {
    if (val.length === 0) {
      return -1;
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir);
  } else if (typeof val === "number") {
    val = val & 255;
    if (Buffer2.TYPED_ARRAY_SUPPORT && typeof Uint8Array.prototype.indexOf === "function") {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset);
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset);
      }
    }
    return arrayIndexOf(buffer, [val], byteOffset, encoding, dir);
  }
  throw new TypeError("val must be string, number or Buffer");
}
function arrayIndexOf(arr, val, byteOffset, encoding, dir) {
  var indexSize = 1;
  var arrLength = arr.length;
  var valLength = val.length;
  if (encoding !== void 0) {
    encoding = String(encoding).toLowerCase();
    if (encoding === "ucs2" || encoding === "ucs-2" || encoding === "utf16le" || encoding === "utf-16le") {
      if (arr.length < 2 || val.length < 2) {
        return -1;
      }
      indexSize = 2;
      arrLength /= 2;
      valLength /= 2;
      byteOffset /= 2;
    }
  }
  function read2(buf, i2) {
    if (indexSize === 1) {
      return buf[i2];
    } else {
      return buf.readUInt16BE(i2 * indexSize);
    }
  }
  var i;
  if (dir) {
    var foundIndex = -1;
    for (i = byteOffset; i < arrLength; i++) {
      if (read2(arr, i) === read2(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1)
          foundIndex = i;
        if (i - foundIndex + 1 === valLength)
          return foundIndex * indexSize;
      } else {
        if (foundIndex !== -1)
          i -= i - foundIndex;
        foundIndex = -1;
      }
    }
  } else {
    if (byteOffset + valLength > arrLength)
      byteOffset = arrLength - valLength;
    for (i = byteOffset; i >= 0; i--) {
      var found = true;
      for (var j = 0; j < valLength; j++) {
        if (read2(arr, i + j) !== read2(val, j)) {
          found = false;
          break;
        }
      }
      if (found)
        return i;
    }
  }
  return -1;
}
function hexWrite(buf, string, offset, length) {
  offset = Number(offset) || 0;
  var remaining = buf.length - offset;
  if (!length) {
    length = remaining;
  } else {
    length = Number(length);
    if (length > remaining) {
      length = remaining;
    }
  }
  var strLen = string.length;
  if (strLen % 2 !== 0)
    throw new TypeError("Invalid hex string");
  if (length > strLen / 2) {
    length = strLen / 2;
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16);
    if (isNaN(parsed))
      return i;
    buf[offset + i] = parsed;
  }
  return i;
}
function utf8Write(buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length);
}
function asciiWrite(buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length);
}
function latin1Write(buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length);
}
function base64Write(buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length);
}
function ucs2Write(buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length);
}
function base64Slice(buf, start, end) {
  if (start === 0 && end === buf.length) {
    return fromByteArray(buf);
  } else {
    return fromByteArray(buf.slice(start, end));
  }
}
function utf8Slice(buf, start, end) {
  end = Math.min(buf.length, end);
  var res = [];
  var i = start;
  while (i < end) {
    var firstByte = buf[i];
    var codePoint = null;
    var bytesPerSequence = firstByte > 239 ? 4 : firstByte > 223 ? 3 : firstByte > 191 ? 2 : 1;
    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint;
      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 128) {
            codePoint = firstByte;
          }
          break;
        case 2:
          secondByte = buf[i + 1];
          if ((secondByte & 192) === 128) {
            tempCodePoint = (firstByte & 31) << 6 | secondByte & 63;
            if (tempCodePoint > 127) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 3:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 12 | (secondByte & 63) << 6 | thirdByte & 63;
            if (tempCodePoint > 2047 && (tempCodePoint < 55296 || tempCodePoint > 57343)) {
              codePoint = tempCodePoint;
            }
          }
          break;
        case 4:
          secondByte = buf[i + 1];
          thirdByte = buf[i + 2];
          fourthByte = buf[i + 3];
          if ((secondByte & 192) === 128 && (thirdByte & 192) === 128 && (fourthByte & 192) === 128) {
            tempCodePoint = (firstByte & 15) << 18 | (secondByte & 63) << 12 | (thirdByte & 63) << 6 | fourthByte & 63;
            if (tempCodePoint > 65535 && tempCodePoint < 1114112) {
              codePoint = tempCodePoint;
            }
          }
      }
    }
    if (codePoint === null) {
      codePoint = 65533;
      bytesPerSequence = 1;
    } else if (codePoint > 65535) {
      codePoint -= 65536;
      res.push(codePoint >>> 10 & 1023 | 55296);
      codePoint = 56320 | codePoint & 1023;
    }
    res.push(codePoint);
    i += bytesPerSequence;
  }
  return decodeCodePointsArray(res);
}
function decodeCodePointsArray(codePoints) {
  var len = codePoints.length;
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints);
  }
  var res = "";
  var i = 0;
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    );
  }
  return res;
}
function asciiSlice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 127);
  }
  return ret;
}
function latin1Slice(buf, start, end) {
  var ret = "";
  end = Math.min(buf.length, end);
  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i]);
  }
  return ret;
}
function hexSlice(buf, start, end) {
  var len = buf.length;
  if (!start || start < 0)
    start = 0;
  if (!end || end < 0 || end > len)
    end = len;
  var out = "";
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i]);
  }
  return out;
}
function utf16leSlice(buf, start, end) {
  var bytes = buf.slice(start, end);
  var res = "";
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256);
  }
  return res;
}
function checkOffset(offset, ext, length) {
  if (offset % 1 !== 0 || offset < 0)
    throw new RangeError("offset is not uint");
  if (offset + ext > length)
    throw new RangeError("Trying to access beyond buffer length");
}
function checkInt(buf, value, offset, ext, max, min) {
  if (!internalIsBuffer(buf))
    throw new TypeError('"buffer" argument must be a Buffer instance');
  if (value > max || value < min)
    throw new RangeError('"value" argument is out of bounds');
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
}
function objectWriteUInt16(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 65535 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & 255 << 8 * (littleEndian ? i : 1 - i)) >>> (littleEndian ? i : 1 - i) * 8;
  }
}
function objectWriteUInt32(buf, value, offset, littleEndian) {
  if (value < 0)
    value = 4294967295 + value + 1;
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = value >>> (littleEndian ? i : 3 - i) * 8 & 255;
  }
}
function checkIEEE754(buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length)
    throw new RangeError("Index out of range");
  if (offset < 0)
    throw new RangeError("Index out of range");
}
function writeFloat(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4);
  }
  write(buf, value, offset, littleEndian, 23, 4);
  return offset + 4;
}
function writeDouble(buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8);
  }
  write(buf, value, offset, littleEndian, 52, 8);
  return offset + 8;
}
function base64clean(str) {
  str = stringtrim(str).replace(INVALID_BASE64_RE, "");
  if (str.length < 2)
    return "";
  while (str.length % 4 !== 0) {
    str = str + "=";
  }
  return str;
}
function stringtrim(str) {
  if (str.trim)
    return str.trim();
  return str.replace(/^\s+|\s+$/g, "");
}
function toHex(n) {
  if (n < 16)
    return "0" + n.toString(16);
  return n.toString(16);
}
function utf8ToBytes(string, units) {
  units = units || Infinity;
  var codePoint;
  var length = string.length;
  var leadSurrogate = null;
  var bytes = [];
  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i);
    if (codePoint > 55295 && codePoint < 57344) {
      if (!leadSurrogate) {
        if (codePoint > 56319) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        } else if (i + 1 === length) {
          if ((units -= 3) > -1)
            bytes.push(239, 191, 189);
          continue;
        }
        leadSurrogate = codePoint;
        continue;
      }
      if (codePoint < 56320) {
        if ((units -= 3) > -1)
          bytes.push(239, 191, 189);
        leadSurrogate = codePoint;
        continue;
      }
      codePoint = (leadSurrogate - 55296 << 10 | codePoint - 56320) + 65536;
    } else if (leadSurrogate) {
      if ((units -= 3) > -1)
        bytes.push(239, 191, 189);
    }
    leadSurrogate = null;
    if (codePoint < 128) {
      if ((units -= 1) < 0)
        break;
      bytes.push(codePoint);
    } else if (codePoint < 2048) {
      if ((units -= 2) < 0)
        break;
      bytes.push(
        codePoint >> 6 | 192,
        codePoint & 63 | 128
      );
    } else if (codePoint < 65536) {
      if ((units -= 3) < 0)
        break;
      bytes.push(
        codePoint >> 12 | 224,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else if (codePoint < 1114112) {
      if ((units -= 4) < 0)
        break;
      bytes.push(
        codePoint >> 18 | 240,
        codePoint >> 12 & 63 | 128,
        codePoint >> 6 & 63 | 128,
        codePoint & 63 | 128
      );
    } else {
      throw new Error("Invalid code point");
    }
  }
  return bytes;
}
function asciiToBytes(str) {
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    byteArray.push(str.charCodeAt(i) & 255);
  }
  return byteArray;
}
function utf16leToBytes(str, units) {
  var c, hi, lo;
  var byteArray = [];
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0)
      break;
    c = str.charCodeAt(i);
    hi = c >> 8;
    lo = c % 256;
    byteArray.push(lo);
    byteArray.push(hi);
  }
  return byteArray;
}
function base64ToBytes(str) {
  return toByteArray(base64clean(str));
}
function blitBuffer(src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if (i + offset >= dst.length || i >= src.length)
      break;
    dst[i + offset] = src[i];
  }
  return i;
}
function isnan(val) {
  return val !== val;
}
function isBuffer(obj) {
  return obj != null && (!!obj._isBuffer || isFastBuffer(obj) || isSlowBuffer(obj));
}
function isFastBuffer(obj) {
  return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
}
function isSlowBuffer(obj) {
  return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isFastBuffer(obj.slice(0, 0));
}
var lookup, revLookup, Arr, inited, toString, isArray, INSPECT_MAX_BYTES, _kMaxLength, MAX_ARGUMENTS_LENGTH, INVALID_BASE64_RE;
var init_buffer = __esm({
  "node-modules-polyfills:buffer"() {
    lookup = [];
    revLookup = [];
    Arr = typeof Uint8Array !== "undefined" ? Uint8Array : Array;
    inited = false;
    toString = {}.toString;
    isArray = Array.isArray || function(arr) {
      return toString.call(arr) == "[object Array]";
    };
    INSPECT_MAX_BYTES = 50;
    Buffer2.TYPED_ARRAY_SUPPORT = globalThis.TYPED_ARRAY_SUPPORT !== void 0 ? globalThis.TYPED_ARRAY_SUPPORT : true;
    _kMaxLength = kMaxLength();
    Buffer2.poolSize = 8192;
    Buffer2._augment = function(arr) {
      arr.__proto__ = Buffer2.prototype;
      return arr;
    };
    Buffer2.from = function(value, encodingOrOffset, length) {
      return from(null, value, encodingOrOffset, length);
    };
    if (Buffer2.TYPED_ARRAY_SUPPORT) {
      Buffer2.prototype.__proto__ = Uint8Array.prototype;
      Buffer2.__proto__ = Uint8Array;
    }
    Buffer2.alloc = function(size, fill2, encoding) {
      return alloc(null, size, fill2, encoding);
    };
    Buffer2.allocUnsafe = function(size) {
      return allocUnsafe(null, size);
    };
    Buffer2.allocUnsafeSlow = function(size) {
      return allocUnsafe(null, size);
    };
    Buffer2.isBuffer = isBuffer;
    Buffer2.compare = function compare(a, b) {
      if (!internalIsBuffer(a) || !internalIsBuffer(b)) {
        throw new TypeError("Arguments must be Buffers");
      }
      if (a === b)
        return 0;
      var x = a.length;
      var y = b.length;
      for (var i = 0, len = Math.min(x, y); i < len; ++i) {
        if (a[i] !== b[i]) {
          x = a[i];
          y = b[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer2.isEncoding = function isEncoding(encoding) {
      switch (String(encoding).toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "latin1":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return true;
        default:
          return false;
      }
    };
    Buffer2.concat = function concat(list, length) {
      if (!isArray(list)) {
        throw new TypeError('"list" argument must be an Array of Buffers');
      }
      if (list.length === 0) {
        return Buffer2.alloc(0);
      }
      var i;
      if (length === void 0) {
        length = 0;
        for (i = 0; i < list.length; ++i) {
          length += list[i].length;
        }
      }
      var buffer = Buffer2.allocUnsafe(length);
      var pos = 0;
      for (i = 0; i < list.length; ++i) {
        var buf = list[i];
        if (!internalIsBuffer(buf)) {
          throw new TypeError('"list" argument must be an Array of Buffers');
        }
        buf.copy(buffer, pos);
        pos += buf.length;
      }
      return buffer;
    };
    Buffer2.byteLength = byteLength;
    Buffer2.prototype._isBuffer = true;
    Buffer2.prototype.swap16 = function swap16() {
      var len = this.length;
      if (len % 2 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 16-bits");
      }
      for (var i = 0; i < len; i += 2) {
        swap(this, i, i + 1);
      }
      return this;
    };
    Buffer2.prototype.swap32 = function swap32() {
      var len = this.length;
      if (len % 4 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 32-bits");
      }
      for (var i = 0; i < len; i += 4) {
        swap(this, i, i + 3);
        swap(this, i + 1, i + 2);
      }
      return this;
    };
    Buffer2.prototype.swap64 = function swap64() {
      var len = this.length;
      if (len % 8 !== 0) {
        throw new RangeError("Buffer size must be a multiple of 64-bits");
      }
      for (var i = 0; i < len; i += 8) {
        swap(this, i, i + 7);
        swap(this, i + 1, i + 6);
        swap(this, i + 2, i + 5);
        swap(this, i + 3, i + 4);
      }
      return this;
    };
    Buffer2.prototype.toString = function toString2() {
      var length = this.length | 0;
      if (length === 0)
        return "";
      if (arguments.length === 0)
        return utf8Slice(this, 0, length);
      return slowToString.apply(this, arguments);
    };
    Buffer2.prototype.equals = function equals(b) {
      if (!internalIsBuffer(b))
        throw new TypeError("Argument must be a Buffer");
      if (this === b)
        return true;
      return Buffer2.compare(this, b) === 0;
    };
    Buffer2.prototype.inspect = function inspect() {
      var str = "";
      var max = INSPECT_MAX_BYTES;
      if (this.length > 0) {
        str = this.toString("hex", 0, max).match(/.{2}/g).join(" ");
        if (this.length > max)
          str += " ... ";
      }
      return "<Buffer " + str + ">";
    };
    Buffer2.prototype.compare = function compare2(target, start, end, thisStart, thisEnd) {
      if (!internalIsBuffer(target)) {
        throw new TypeError("Argument must be a Buffer");
      }
      if (start === void 0) {
        start = 0;
      }
      if (end === void 0) {
        end = target ? target.length : 0;
      }
      if (thisStart === void 0) {
        thisStart = 0;
      }
      if (thisEnd === void 0) {
        thisEnd = this.length;
      }
      if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
        throw new RangeError("out of range index");
      }
      if (thisStart >= thisEnd && start >= end) {
        return 0;
      }
      if (thisStart >= thisEnd) {
        return -1;
      }
      if (start >= end) {
        return 1;
      }
      start >>>= 0;
      end >>>= 0;
      thisStart >>>= 0;
      thisEnd >>>= 0;
      if (this === target)
        return 0;
      var x = thisEnd - thisStart;
      var y = end - start;
      var len = Math.min(x, y);
      var thisCopy = this.slice(thisStart, thisEnd);
      var targetCopy = target.slice(start, end);
      for (var i = 0; i < len; ++i) {
        if (thisCopy[i] !== targetCopy[i]) {
          x = thisCopy[i];
          y = targetCopy[i];
          break;
        }
      }
      if (x < y)
        return -1;
      if (y < x)
        return 1;
      return 0;
    };
    Buffer2.prototype.includes = function includes(val, byteOffset, encoding) {
      return this.indexOf(val, byteOffset, encoding) !== -1;
    };
    Buffer2.prototype.indexOf = function indexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, true);
    };
    Buffer2.prototype.lastIndexOf = function lastIndexOf(val, byteOffset, encoding) {
      return bidirectionalIndexOf(this, val, byteOffset, encoding, false);
    };
    Buffer2.prototype.write = function write2(string, offset, length, encoding) {
      if (offset === void 0) {
        encoding = "utf8";
        length = this.length;
        offset = 0;
      } else if (length === void 0 && typeof offset === "string") {
        encoding = offset;
        length = this.length;
        offset = 0;
      } else if (isFinite(offset)) {
        offset = offset | 0;
        if (isFinite(length)) {
          length = length | 0;
          if (encoding === void 0)
            encoding = "utf8";
        } else {
          encoding = length;
          length = void 0;
        }
      } else {
        throw new Error(
          "Buffer.write(string, encoding, offset[, length]) is no longer supported"
        );
      }
      var remaining = this.length - offset;
      if (length === void 0 || length > remaining)
        length = remaining;
      if (string.length > 0 && (length < 0 || offset < 0) || offset > this.length) {
        throw new RangeError("Attempt to write outside buffer bounds");
      }
      if (!encoding)
        encoding = "utf8";
      var loweredCase = false;
      for (; ; ) {
        switch (encoding) {
          case "hex":
            return hexWrite(this, string, offset, length);
          case "utf8":
          case "utf-8":
            return utf8Write(this, string, offset, length);
          case "ascii":
            return asciiWrite(this, string, offset, length);
          case "latin1":
          case "binary":
            return latin1Write(this, string, offset, length);
          case "base64":
            return base64Write(this, string, offset, length);
          case "ucs2":
          case "ucs-2":
          case "utf16le":
          case "utf-16le":
            return ucs2Write(this, string, offset, length);
          default:
            if (loweredCase)
              throw new TypeError("Unknown encoding: " + encoding);
            encoding = ("" + encoding).toLowerCase();
            loweredCase = true;
        }
      }
    };
    Buffer2.prototype.toJSON = function toJSON() {
      return {
        type: "Buffer",
        data: Array.prototype.slice.call(this._arr || this, 0)
      };
    };
    MAX_ARGUMENTS_LENGTH = 4096;
    Buffer2.prototype.slice = function slice(start, end) {
      var len = this.length;
      start = ~~start;
      end = end === void 0 ? len : ~~end;
      if (start < 0) {
        start += len;
        if (start < 0)
          start = 0;
      } else if (start > len) {
        start = len;
      }
      if (end < 0) {
        end += len;
        if (end < 0)
          end = 0;
      } else if (end > len) {
        end = len;
      }
      if (end < start)
        end = start;
      var newBuf;
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        newBuf = this.subarray(start, end);
        newBuf.__proto__ = Buffer2.prototype;
      } else {
        var sliceLen = end - start;
        newBuf = new Buffer2(sliceLen, void 0);
        for (var i = 0; i < sliceLen; ++i) {
          newBuf[i] = this[i + start];
        }
      }
      return newBuf;
    };
    Buffer2.prototype.readUIntLE = function readUIntLE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUIntBE = function readUIntBE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        checkOffset(offset, byteLength2, this.length);
      }
      var val = this[offset + --byteLength2];
      var mul = 1;
      while (byteLength2 > 0 && (mul *= 256)) {
        val += this[offset + --byteLength2] * mul;
      }
      return val;
    };
    Buffer2.prototype.readUInt8 = function readUInt8(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      return this[offset];
    };
    Buffer2.prototype.readUInt16LE = function readUInt16LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] | this[offset + 1] << 8;
    };
    Buffer2.prototype.readUInt16BE = function readUInt16BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      return this[offset] << 8 | this[offset + 1];
    };
    Buffer2.prototype.readUInt32LE = function readUInt32LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return (this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16) + this[offset + 3] * 16777216;
    };
    Buffer2.prototype.readUInt32BE = function readUInt32BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] * 16777216 + (this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3]);
    };
    Buffer2.prototype.readIntLE = function readIntLE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var val = this[offset];
      var mul = 1;
      var i = 0;
      while (++i < byteLength2 && (mul *= 256)) {
        val += this[offset + i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readIntBE = function readIntBE(offset, byteLength2, noAssert) {
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert)
        checkOffset(offset, byteLength2, this.length);
      var i = byteLength2;
      var mul = 1;
      var val = this[offset + --i];
      while (i > 0 && (mul *= 256)) {
        val += this[offset + --i] * mul;
      }
      mul *= 128;
      if (val >= mul)
        val -= Math.pow(2, 8 * byteLength2);
      return val;
    };
    Buffer2.prototype.readInt8 = function readInt8(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 1, this.length);
      if (!(this[offset] & 128))
        return this[offset];
      return (255 - this[offset] + 1) * -1;
    };
    Buffer2.prototype.readInt16LE = function readInt16LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset] | this[offset + 1] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt16BE = function readInt16BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 2, this.length);
      var val = this[offset + 1] | this[offset] << 8;
      return val & 32768 ? val | 4294901760 : val;
    };
    Buffer2.prototype.readInt32LE = function readInt32LE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] | this[offset + 1] << 8 | this[offset + 2] << 16 | this[offset + 3] << 24;
    };
    Buffer2.prototype.readInt32BE = function readInt32BE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return this[offset] << 24 | this[offset + 1] << 16 | this[offset + 2] << 8 | this[offset + 3];
    };
    Buffer2.prototype.readFloatLE = function readFloatLE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return read(this, offset, true, 23, 4);
    };
    Buffer2.prototype.readFloatBE = function readFloatBE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 4, this.length);
      return read(this, offset, false, 23, 4);
    };
    Buffer2.prototype.readDoubleLE = function readDoubleLE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return read(this, offset, true, 52, 8);
    };
    Buffer2.prototype.readDoubleBE = function readDoubleBE(offset, noAssert) {
      if (!noAssert)
        checkOffset(offset, 8, this.length);
      return read(this, offset, false, 52, 8);
    };
    Buffer2.prototype.writeUIntLE = function writeUIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var mul = 1;
      var i = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUIntBE = function writeUIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      byteLength2 = byteLength2 | 0;
      if (!noAssert) {
        var maxBytes = Math.pow(2, 8 * byteLength2) - 1;
        checkInt(this, value, offset, byteLength2, maxBytes, 0);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        this[offset + i] = value / mul & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeUInt8 = function writeUInt8(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 255, 0);
      if (!Buffer2.TYPED_ARRAY_SUPPORT)
        value = Math.floor(value);
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeUInt16LE = function writeUInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeUInt16BE = function writeUInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 65535, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeUInt32LE = function writeUInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset + 3] = value >>> 24;
        this[offset + 2] = value >>> 16;
        this[offset + 1] = value >>> 8;
        this[offset] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeUInt32BE = function writeUInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 4294967295, 0);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeIntLE = function writeIntLE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = 0;
      var mul = 1;
      var sub = 0;
      this[offset] = value & 255;
      while (++i < byteLength2 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeIntBE = function writeIntBE(value, offset, byteLength2, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert) {
        var limit = Math.pow(2, 8 * byteLength2 - 1);
        checkInt(this, value, offset, byteLength2, limit - 1, -limit);
      }
      var i = byteLength2 - 1;
      var mul = 1;
      var sub = 0;
      this[offset + i] = value & 255;
      while (--i >= 0 && (mul *= 256)) {
        if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
          sub = 1;
        }
        this[offset + i] = (value / mul >> 0) - sub & 255;
      }
      return offset + byteLength2;
    };
    Buffer2.prototype.writeInt8 = function writeInt8(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 1, 127, -128);
      if (!Buffer2.TYPED_ARRAY_SUPPORT)
        value = Math.floor(value);
      if (value < 0)
        value = 255 + value + 1;
      this[offset] = value & 255;
      return offset + 1;
    };
    Buffer2.prototype.writeInt16LE = function writeInt16LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
      } else {
        objectWriteUInt16(this, value, offset, true);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeInt16BE = function writeInt16BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 2, 32767, -32768);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 8;
        this[offset + 1] = value & 255;
      } else {
        objectWriteUInt16(this, value, offset, false);
      }
      return offset + 2;
    };
    Buffer2.prototype.writeInt32LE = function writeInt32LE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value & 255;
        this[offset + 1] = value >>> 8;
        this[offset + 2] = value >>> 16;
        this[offset + 3] = value >>> 24;
      } else {
        objectWriteUInt32(this, value, offset, true);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeInt32BE = function writeInt32BE(value, offset, noAssert) {
      value = +value;
      offset = offset | 0;
      if (!noAssert)
        checkInt(this, value, offset, 4, 2147483647, -2147483648);
      if (value < 0)
        value = 4294967295 + value + 1;
      if (Buffer2.TYPED_ARRAY_SUPPORT) {
        this[offset] = value >>> 24;
        this[offset + 1] = value >>> 16;
        this[offset + 2] = value >>> 8;
        this[offset + 3] = value & 255;
      } else {
        objectWriteUInt32(this, value, offset, false);
      }
      return offset + 4;
    };
    Buffer2.prototype.writeFloatLE = function writeFloatLE(value, offset, noAssert) {
      return writeFloat(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeFloatBE = function writeFloatBE(value, offset, noAssert) {
      return writeFloat(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.writeDoubleLE = function writeDoubleLE(value, offset, noAssert) {
      return writeDouble(this, value, offset, true, noAssert);
    };
    Buffer2.prototype.writeDoubleBE = function writeDoubleBE(value, offset, noAssert) {
      return writeDouble(this, value, offset, false, noAssert);
    };
    Buffer2.prototype.copy = function copy(target, targetStart, start, end) {
      if (!start)
        start = 0;
      if (!end && end !== 0)
        end = this.length;
      if (targetStart >= target.length)
        targetStart = target.length;
      if (!targetStart)
        targetStart = 0;
      if (end > 0 && end < start)
        end = start;
      if (end === start)
        return 0;
      if (target.length === 0 || this.length === 0)
        return 0;
      if (targetStart < 0) {
        throw new RangeError("targetStart out of bounds");
      }
      if (start < 0 || start >= this.length)
        throw new RangeError("sourceStart out of bounds");
      if (end < 0)
        throw new RangeError("sourceEnd out of bounds");
      if (end > this.length)
        end = this.length;
      if (target.length - targetStart < end - start) {
        end = target.length - targetStart + start;
      }
      var len = end - start;
      var i;
      if (this === target && start < targetStart && targetStart < end) {
        for (i = len - 1; i >= 0; --i) {
          target[i + targetStart] = this[i + start];
        }
      } else if (len < 1e3 || !Buffer2.TYPED_ARRAY_SUPPORT) {
        for (i = 0; i < len; ++i) {
          target[i + targetStart] = this[i + start];
        }
      } else {
        Uint8Array.prototype.set.call(
          target,
          this.subarray(start, start + len),
          targetStart
        );
      }
      return len;
    };
    Buffer2.prototype.fill = function fill(val, start, end, encoding) {
      if (typeof val === "string") {
        if (typeof start === "string") {
          encoding = start;
          start = 0;
          end = this.length;
        } else if (typeof end === "string") {
          encoding = end;
          end = this.length;
        }
        if (val.length === 1) {
          var code = val.charCodeAt(0);
          if (code < 256) {
            val = code;
          }
        }
        if (encoding !== void 0 && typeof encoding !== "string") {
          throw new TypeError("encoding must be a string");
        }
        if (typeof encoding === "string" && !Buffer2.isEncoding(encoding)) {
          throw new TypeError("Unknown encoding: " + encoding);
        }
      } else if (typeof val === "number") {
        val = val & 255;
      }
      if (start < 0 || this.length < start || this.length < end) {
        throw new RangeError("Out of range index");
      }
      if (end <= start) {
        return this;
      }
      start = start >>> 0;
      end = end === void 0 ? this.length : end >>> 0;
      if (!val)
        val = 0;
      var i;
      if (typeof val === "number") {
        for (i = start; i < end; ++i) {
          this[i] = val;
        }
      } else {
        var bytes = internalIsBuffer(val) ? val : utf8ToBytes(new Buffer2(val, encoding).toString());
        var len = bytes.length;
        for (i = 0; i < end - start; ++i) {
          this[i + start] = bytes[i % len];
        }
      }
      return this;
    };
    INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g;
  }
});

// node-modules-polyfills-commonjs:buffer
var require_buffer = __commonJS({
  "node-modules-polyfills-commonjs:buffer"(exports, module) {
    var polyfill = (init_buffer(), __toCommonJS(buffer_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// node_modules/safer-buffer/safer.js
var require_safer = __commonJS({
  "node_modules/safer-buffer/safer.js"(exports, module) {
    "use strict";
    var buffer = require_buffer();
    var Buffer3 = buffer.Buffer;
    var safer = {};
    var key;
    for (key in buffer) {
      if (!buffer.hasOwnProperty(key))
        continue;
      if (key === "SlowBuffer" || key === "Buffer")
        continue;
      safer[key] = buffer[key];
    }
    var Safer = safer.Buffer = {};
    for (key in Buffer3) {
      if (!Buffer3.hasOwnProperty(key))
        continue;
      if (key === "allocUnsafe" || key === "allocUnsafeSlow")
        continue;
      Safer[key] = Buffer3[key];
    }
    safer.Buffer.prototype = Buffer3.prototype;
    if (!Safer.from || Safer.from === Uint8Array.from) {
      Safer.from = function(value, encodingOrOffset, length) {
        if (typeof value === "number") {
          throw new TypeError('The "value" argument must not be of type number. Received type ' + typeof value);
        }
        if (value && typeof value.length === "undefined") {
          throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " + typeof value);
        }
        return Buffer3(value, encodingOrOffset, length);
      };
    }
    if (!Safer.alloc) {
      Safer.alloc = function(size, fill2, encoding) {
        if (typeof size !== "number") {
          throw new TypeError('The "size" argument must be of type number. Received type ' + typeof size);
        }
        if (size < 0 || size >= 2 * (1 << 30)) {
          throw new RangeError('The value "' + size + '" is invalid for option "size"');
        }
        var buf = Buffer3(size);
        if (!fill2 || fill2.length === 0) {
          buf.fill(0);
        } else if (typeof encoding === "string") {
          buf.fill(fill2, encoding);
        } else {
          buf.fill(fill2);
        }
        return buf;
      };
    }
    if (!safer.kStringMaxLength) {
      try {
        safer.kStringMaxLength = process.binding("buffer").kStringMaxLength;
      } catch (e) {
      }
    }
    if (!safer.constants) {
      safer.constants = {
        MAX_LENGTH: safer.kMaxLength
      };
      if (safer.kStringMaxLength) {
        safer.constants.MAX_STRING_LENGTH = safer.kStringMaxLength;
      }
    }
    module.exports = safer;
  }
});

// node_modules/iconv-lite/lib/bom-handling.js
var require_bom_handling = __commonJS({
  "node_modules/iconv-lite/lib/bom-handling.js"(exports) {
    "use strict";
    var BOMChar = "\uFEFF";
    exports.PrependBOM = PrependBOMWrapper;
    function PrependBOMWrapper(encoder, options) {
      this.encoder = encoder;
      this.addBOM = true;
    }
    PrependBOMWrapper.prototype.write = function(str) {
      if (this.addBOM) {
        str = BOMChar + str;
        this.addBOM = false;
      }
      return this.encoder.write(str);
    };
    PrependBOMWrapper.prototype.end = function() {
      return this.encoder.end();
    };
    exports.StripBOM = StripBOMWrapper;
    function StripBOMWrapper(decoder, options) {
      this.decoder = decoder;
      this.pass = false;
      this.options = options || {};
    }
    StripBOMWrapper.prototype.write = function(buf) {
      var res = this.decoder.write(buf);
      if (this.pass || !res)
        return res;
      if (res[0] === BOMChar) {
        res = res.slice(1);
        if (typeof this.options.stripBOM === "function")
          this.options.stripBOM();
      }
      this.pass = true;
      return res;
    };
    StripBOMWrapper.prototype.end = function() {
      return this.decoder.end();
    };
  }
});

// node-modules-polyfills:string_decoder
var string_decoder_exports = {};
__export(string_decoder_exports, {
  StringDecoder: () => StringDecoder
});
function assertEncoding(encoding) {
  if (encoding && !isBufferEncoding(encoding)) {
    throw new Error("Unknown encoding: " + encoding);
  }
}
function StringDecoder(encoding) {
  this.encoding = (encoding || "utf8").toLowerCase().replace(/[-_]/, "");
  assertEncoding(encoding);
  switch (this.encoding) {
    case "utf8":
      this.surrogateSize = 3;
      break;
    case "ucs2":
    case "utf16le":
      this.surrogateSize = 2;
      this.detectIncompleteChar = utf16DetectIncompleteChar;
      break;
    case "base64":
      this.surrogateSize = 3;
      this.detectIncompleteChar = base64DetectIncompleteChar;
      break;
    default:
      this.write = passThroughWrite;
      return;
  }
  this.charBuffer = new Buffer2(6);
  this.charReceived = 0;
  this.charLength = 0;
}
function passThroughWrite(buffer) {
  return buffer.toString(this.encoding);
}
function utf16DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 2;
  this.charLength = this.charReceived ? 2 : 0;
}
function base64DetectIncompleteChar(buffer) {
  this.charReceived = buffer.length % 3;
  this.charLength = this.charReceived ? 3 : 0;
}
var isBufferEncoding;
var init_string_decoder = __esm({
  "node-modules-polyfills:string_decoder"() {
    init_buffer();
    isBufferEncoding = Buffer2.isEncoding || function(encoding) {
      switch (encoding && encoding.toLowerCase()) {
        case "hex":
        case "utf8":
        case "utf-8":
        case "ascii":
        case "binary":
        case "base64":
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
        case "raw":
          return true;
        default:
          return false;
      }
    };
    StringDecoder.prototype.write = function(buffer) {
      var charStr = "";
      while (this.charLength) {
        var available = buffer.length >= this.charLength - this.charReceived ? this.charLength - this.charReceived : buffer.length;
        buffer.copy(this.charBuffer, this.charReceived, 0, available);
        this.charReceived += available;
        if (this.charReceived < this.charLength) {
          return "";
        }
        buffer = buffer.slice(available, buffer.length);
        charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
        var charCode = charStr.charCodeAt(charStr.length - 1);
        if (charCode >= 55296 && charCode <= 56319) {
          this.charLength += this.surrogateSize;
          charStr = "";
          continue;
        }
        this.charReceived = this.charLength = 0;
        if (buffer.length === 0) {
          return charStr;
        }
        break;
      }
      this.detectIncompleteChar(buffer);
      var end = buffer.length;
      if (this.charLength) {
        buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
        end -= this.charReceived;
      }
      charStr += buffer.toString(this.encoding, 0, end);
      var end = charStr.length - 1;
      var charCode = charStr.charCodeAt(end);
      if (charCode >= 55296 && charCode <= 56319) {
        var size = this.surrogateSize;
        this.charLength += size;
        this.charReceived += size;
        this.charBuffer.copy(this.charBuffer, size, 0, size);
        buffer.copy(this.charBuffer, 0, 0, size);
        return charStr.substring(0, end);
      }
      return charStr;
    };
    StringDecoder.prototype.detectIncompleteChar = function(buffer) {
      var i = buffer.length >= 3 ? 3 : buffer.length;
      for (; i > 0; i--) {
        var c = buffer[buffer.length - i];
        if (i == 1 && c >> 5 == 6) {
          this.charLength = 2;
          break;
        }
        if (i <= 2 && c >> 4 == 14) {
          this.charLength = 3;
          break;
        }
        if (i <= 3 && c >> 3 == 30) {
          this.charLength = 4;
          break;
        }
      }
      this.charReceived = i;
    };
    StringDecoder.prototype.end = function(buffer) {
      var res = "";
      if (buffer && buffer.length)
        res = this.write(buffer);
      if (this.charReceived) {
        var cr = this.charReceived;
        var buf = this.charBuffer;
        var enc = this.encoding;
        res += buf.slice(0, cr).toString(enc);
      }
      return res;
    };
  }
});

// node-modules-polyfills-commonjs:string_decoder
var require_string_decoder = __commonJS({
  "node-modules-polyfills-commonjs:string_decoder"(exports, module) {
    var polyfill = (init_string_decoder(), __toCommonJS(string_decoder_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// node_modules/iconv-lite/encodings/internal.js
var require_internal = __commonJS({
  "node_modules/iconv-lite/encodings/internal.js"(exports, module) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    module.exports = {
      utf8: { type: "_internal", bomAware: true },
      cesu8: { type: "_internal", bomAware: true },
      unicode11utf8: "utf8",
      ucs2: { type: "_internal", bomAware: true },
      utf16le: "ucs2",
      binary: { type: "_internal" },
      base64: { type: "_internal" },
      hex: { type: "_internal" },
      _internal: InternalCodec
    };
    function InternalCodec(codecOptions, iconv) {
      this.enc = codecOptions.encodingName;
      this.bomAware = codecOptions.bomAware;
      if (this.enc === "base64")
        this.encoder = InternalEncoderBase64;
      else if (this.enc === "cesu8") {
        this.enc = "utf8";
        this.encoder = InternalEncoderCesu8;
        if (Buffer3.from("eda0bdedb2a9", "hex").toString() !== "\u{1F4A9}") {
          this.decoder = InternalDecoderCesu8;
          this.defaultCharUnicode = iconv.defaultCharUnicode;
        }
      }
    }
    InternalCodec.prototype.encoder = InternalEncoder;
    InternalCodec.prototype.decoder = InternalDecoder;
    var StringDecoder2 = require_string_decoder().StringDecoder;
    if (!StringDecoder2.prototype.end)
      StringDecoder2.prototype.end = function() {
      };
    function InternalDecoder(options, codec) {
      this.decoder = new StringDecoder2(codec.enc);
    }
    InternalDecoder.prototype.write = function(buf) {
      if (!Buffer3.isBuffer(buf)) {
        buf = Buffer3.from(buf);
      }
      return this.decoder.write(buf);
    };
    InternalDecoder.prototype.end = function() {
      return this.decoder.end();
    };
    function InternalEncoder(options, codec) {
      this.enc = codec.enc;
    }
    InternalEncoder.prototype.write = function(str) {
      return Buffer3.from(str, this.enc);
    };
    InternalEncoder.prototype.end = function() {
    };
    function InternalEncoderBase64(options, codec) {
      this.prevStr = "";
    }
    InternalEncoderBase64.prototype.write = function(str) {
      str = this.prevStr + str;
      var completeQuads = str.length - str.length % 4;
      this.prevStr = str.slice(completeQuads);
      str = str.slice(0, completeQuads);
      return Buffer3.from(str, "base64");
    };
    InternalEncoderBase64.prototype.end = function() {
      return Buffer3.from(this.prevStr, "base64");
    };
    function InternalEncoderCesu8(options, codec) {
    }
    InternalEncoderCesu8.prototype.write = function(str) {
      var buf = Buffer3.alloc(str.length * 3), bufIdx = 0;
      for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode < 128)
          buf[bufIdx++] = charCode;
        else if (charCode < 2048) {
          buf[bufIdx++] = 192 + (charCode >>> 6);
          buf[bufIdx++] = 128 + (charCode & 63);
        } else {
          buf[bufIdx++] = 224 + (charCode >>> 12);
          buf[bufIdx++] = 128 + (charCode >>> 6 & 63);
          buf[bufIdx++] = 128 + (charCode & 63);
        }
      }
      return buf.slice(0, bufIdx);
    };
    InternalEncoderCesu8.prototype.end = function() {
    };
    function InternalDecoderCesu8(options, codec) {
      this.acc = 0;
      this.contBytes = 0;
      this.accBytes = 0;
      this.defaultCharUnicode = codec.defaultCharUnicode;
    }
    InternalDecoderCesu8.prototype.write = function(buf) {
      var acc = this.acc, contBytes = this.contBytes, accBytes = this.accBytes, res = "";
      for (var i = 0; i < buf.length; i++) {
        var curByte = buf[i];
        if ((curByte & 192) !== 128) {
          if (contBytes > 0) {
            res += this.defaultCharUnicode;
            contBytes = 0;
          }
          if (curByte < 128) {
            res += String.fromCharCode(curByte);
          } else if (curByte < 224) {
            acc = curByte & 31;
            contBytes = 1;
            accBytes = 1;
          } else if (curByte < 240) {
            acc = curByte & 15;
            contBytes = 2;
            accBytes = 1;
          } else {
            res += this.defaultCharUnicode;
          }
        } else {
          if (contBytes > 0) {
            acc = acc << 6 | curByte & 63;
            contBytes--;
            accBytes++;
            if (contBytes === 0) {
              if (accBytes === 2 && acc < 128 && acc > 0)
                res += this.defaultCharUnicode;
              else if (accBytes === 3 && acc < 2048)
                res += this.defaultCharUnicode;
              else
                res += String.fromCharCode(acc);
            }
          } else {
            res += this.defaultCharUnicode;
          }
        }
      }
      this.acc = acc;
      this.contBytes = contBytes;
      this.accBytes = accBytes;
      return res;
    };
    InternalDecoderCesu8.prototype.end = function() {
      var res = 0;
      if (this.contBytes > 0)
        res += this.defaultCharUnicode;
      return res;
    };
  }
});

// node_modules/iconv-lite/encodings/utf32.js
var require_utf32 = __commonJS({
  "node_modules/iconv-lite/encodings/utf32.js"(exports) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    exports._utf32 = Utf32Codec;
    function Utf32Codec(codecOptions, iconv) {
      this.iconv = iconv;
      this.bomAware = true;
      this.isLE = codecOptions.isLE;
    }
    exports.utf32le = { type: "_utf32", isLE: true };
    exports.utf32be = { type: "_utf32", isLE: false };
    exports.ucs4le = "utf32le";
    exports.ucs4be = "utf32be";
    Utf32Codec.prototype.encoder = Utf32Encoder;
    Utf32Codec.prototype.decoder = Utf32Decoder;
    function Utf32Encoder(options, codec) {
      this.isLE = codec.isLE;
      this.highSurrogate = 0;
    }
    Utf32Encoder.prototype.write = function(str) {
      var src = Buffer3.from(str, "ucs2");
      var dst = Buffer3.alloc(src.length * 2);
      var write32 = this.isLE ? dst.writeUInt32LE : dst.writeUInt32BE;
      var offset = 0;
      for (var i = 0; i < src.length; i += 2) {
        var code = src.readUInt16LE(i);
        var isHighSurrogate = 55296 <= code && code < 56320;
        var isLowSurrogate = 56320 <= code && code < 57344;
        if (this.highSurrogate) {
          if (isHighSurrogate || !isLowSurrogate) {
            write32.call(dst, this.highSurrogate, offset);
            offset += 4;
          } else {
            var codepoint = (this.highSurrogate - 55296 << 10 | code - 56320) + 65536;
            write32.call(dst, codepoint, offset);
            offset += 4;
            this.highSurrogate = 0;
            continue;
          }
        }
        if (isHighSurrogate)
          this.highSurrogate = code;
        else {
          write32.call(dst, code, offset);
          offset += 4;
          this.highSurrogate = 0;
        }
      }
      if (offset < dst.length)
        dst = dst.slice(0, offset);
      return dst;
    };
    Utf32Encoder.prototype.end = function() {
      if (!this.highSurrogate)
        return;
      var buf = Buffer3.alloc(4);
      if (this.isLE)
        buf.writeUInt32LE(this.highSurrogate, 0);
      else
        buf.writeUInt32BE(this.highSurrogate, 0);
      this.highSurrogate = 0;
      return buf;
    };
    function Utf32Decoder(options, codec) {
      this.isLE = codec.isLE;
      this.badChar = codec.iconv.defaultCharUnicode.charCodeAt(0);
      this.overflow = [];
    }
    Utf32Decoder.prototype.write = function(src) {
      if (src.length === 0)
        return "";
      var i = 0;
      var codepoint = 0;
      var dst = Buffer3.alloc(src.length + 4);
      var offset = 0;
      var isLE = this.isLE;
      var overflow = this.overflow;
      var badChar = this.badChar;
      if (overflow.length > 0) {
        for (; i < src.length && overflow.length < 4; i++)
          overflow.push(src[i]);
        if (overflow.length === 4) {
          if (isLE) {
            codepoint = overflow[i] | overflow[i + 1] << 8 | overflow[i + 2] << 16 | overflow[i + 3] << 24;
          } else {
            codepoint = overflow[i + 3] | overflow[i + 2] << 8 | overflow[i + 1] << 16 | overflow[i] << 24;
          }
          overflow.length = 0;
          offset = _writeCodepoint(dst, offset, codepoint, badChar);
        }
      }
      for (; i < src.length - 3; i += 4) {
        if (isLE) {
          codepoint = src[i] | src[i + 1] << 8 | src[i + 2] << 16 | src[i + 3] << 24;
        } else {
          codepoint = src[i + 3] | src[i + 2] << 8 | src[i + 1] << 16 | src[i] << 24;
        }
        offset = _writeCodepoint(dst, offset, codepoint, badChar);
      }
      for (; i < src.length; i++) {
        overflow.push(src[i]);
      }
      return dst.slice(0, offset).toString("ucs2");
    };
    function _writeCodepoint(dst, offset, codepoint, badChar) {
      if (codepoint < 0 || codepoint > 1114111) {
        codepoint = badChar;
      }
      if (codepoint >= 65536) {
        codepoint -= 65536;
        var high = 55296 | codepoint >> 10;
        dst[offset++] = high & 255;
        dst[offset++] = high >> 8;
        var codepoint = 56320 | codepoint & 1023;
      }
      dst[offset++] = codepoint & 255;
      dst[offset++] = codepoint >> 8;
      return offset;
    }
    Utf32Decoder.prototype.end = function() {
      this.overflow.length = 0;
    };
    exports.utf32 = Utf32AutoCodec;
    exports.ucs4 = "utf32";
    function Utf32AutoCodec(options, iconv) {
      this.iconv = iconv;
    }
    Utf32AutoCodec.prototype.encoder = Utf32AutoEncoder;
    Utf32AutoCodec.prototype.decoder = Utf32AutoDecoder;
    function Utf32AutoEncoder(options, codec) {
      options = options || {};
      if (options.addBOM === void 0)
        options.addBOM = true;
      this.encoder = codec.iconv.getEncoder(options.defaultEncoding || "utf-32le", options);
    }
    Utf32AutoEncoder.prototype.write = function(str) {
      return this.encoder.write(str);
    };
    Utf32AutoEncoder.prototype.end = function() {
      return this.encoder.end();
    };
    function Utf32AutoDecoder(options, codec) {
      this.decoder = null;
      this.initialBufs = [];
      this.initialBufsLen = 0;
      this.options = options || {};
      this.iconv = codec.iconv;
    }
    Utf32AutoDecoder.prototype.write = function(buf) {
      if (!this.decoder) {
        this.initialBufs.push(buf);
        this.initialBufsLen += buf.length;
        if (this.initialBufsLen < 32)
          return "";
        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        var resStr = "";
        for (var i = 0; i < this.initialBufs.length; i++)
          resStr += this.decoder.write(this.initialBufs[i]);
        this.initialBufs.length = this.initialBufsLen = 0;
        return resStr;
      }
      return this.decoder.write(buf);
    };
    Utf32AutoDecoder.prototype.end = function() {
      if (!this.decoder) {
        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        var resStr = "";
        for (var i = 0; i < this.initialBufs.length; i++)
          resStr += this.decoder.write(this.initialBufs[i]);
        var trail = this.decoder.end();
        if (trail)
          resStr += trail;
        this.initialBufs.length = this.initialBufsLen = 0;
        return resStr;
      }
      return this.decoder.end();
    };
    function detectEncoding(bufs, defaultEncoding) {
      var b = [];
      var charsProcessed = 0;
      var invalidLE = 0, invalidBE = 0;
      var bmpCharsLE = 0, bmpCharsBE = 0;
      outer_loop:
        for (var i = 0; i < bufs.length; i++) {
          var buf = bufs[i];
          for (var j = 0; j < buf.length; j++) {
            b.push(buf[j]);
            if (b.length === 4) {
              if (charsProcessed === 0) {
                if (b[0] === 255 && b[1] === 254 && b[2] === 0 && b[3] === 0) {
                  return "utf-32le";
                }
                if (b[0] === 0 && b[1] === 0 && b[2] === 254 && b[3] === 255) {
                  return "utf-32be";
                }
              }
              if (b[0] !== 0 || b[1] > 16)
                invalidBE++;
              if (b[3] !== 0 || b[2] > 16)
                invalidLE++;
              if (b[0] === 0 && b[1] === 0 && (b[2] !== 0 || b[3] !== 0))
                bmpCharsBE++;
              if ((b[0] !== 0 || b[1] !== 0) && b[2] === 0 && b[3] === 0)
                bmpCharsLE++;
              b.length = 0;
              charsProcessed++;
              if (charsProcessed >= 100) {
                break outer_loop;
              }
            }
          }
        }
      if (bmpCharsBE - invalidBE > bmpCharsLE - invalidLE)
        return "utf-32be";
      if (bmpCharsBE - invalidBE < bmpCharsLE - invalidLE)
        return "utf-32le";
      return defaultEncoding || "utf-32le";
    }
  }
});

// node_modules/iconv-lite/encodings/utf16.js
var require_utf16 = __commonJS({
  "node_modules/iconv-lite/encodings/utf16.js"(exports) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    exports.utf16be = Utf16BECodec;
    function Utf16BECodec() {
    }
    Utf16BECodec.prototype.encoder = Utf16BEEncoder;
    Utf16BECodec.prototype.decoder = Utf16BEDecoder;
    Utf16BECodec.prototype.bomAware = true;
    function Utf16BEEncoder() {
    }
    Utf16BEEncoder.prototype.write = function(str) {
      var buf = Buffer3.from(str, "ucs2");
      for (var i = 0; i < buf.length; i += 2) {
        var tmp = buf[i];
        buf[i] = buf[i + 1];
        buf[i + 1] = tmp;
      }
      return buf;
    };
    Utf16BEEncoder.prototype.end = function() {
    };
    function Utf16BEDecoder() {
      this.overflowByte = -1;
    }
    Utf16BEDecoder.prototype.write = function(buf) {
      if (buf.length == 0)
        return "";
      var buf2 = Buffer3.alloc(buf.length + 1), i = 0, j = 0;
      if (this.overflowByte !== -1) {
        buf2[0] = buf[0];
        buf2[1] = this.overflowByte;
        i = 1;
        j = 2;
      }
      for (; i < buf.length - 1; i += 2, j += 2) {
        buf2[j] = buf[i + 1];
        buf2[j + 1] = buf[i];
      }
      this.overflowByte = i == buf.length - 1 ? buf[buf.length - 1] : -1;
      return buf2.slice(0, j).toString("ucs2");
    };
    Utf16BEDecoder.prototype.end = function() {
      this.overflowByte = -1;
    };
    exports.utf16 = Utf16Codec;
    function Utf16Codec(codecOptions, iconv) {
      this.iconv = iconv;
    }
    Utf16Codec.prototype.encoder = Utf16Encoder;
    Utf16Codec.prototype.decoder = Utf16Decoder;
    function Utf16Encoder(options, codec) {
      options = options || {};
      if (options.addBOM === void 0)
        options.addBOM = true;
      this.encoder = codec.iconv.getEncoder("utf-16le", options);
    }
    Utf16Encoder.prototype.write = function(str) {
      return this.encoder.write(str);
    };
    Utf16Encoder.prototype.end = function() {
      return this.encoder.end();
    };
    function Utf16Decoder(options, codec) {
      this.decoder = null;
      this.initialBufs = [];
      this.initialBufsLen = 0;
      this.options = options || {};
      this.iconv = codec.iconv;
    }
    Utf16Decoder.prototype.write = function(buf) {
      if (!this.decoder) {
        this.initialBufs.push(buf);
        this.initialBufsLen += buf.length;
        if (this.initialBufsLen < 16)
          return "";
        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        var resStr = "";
        for (var i = 0; i < this.initialBufs.length; i++)
          resStr += this.decoder.write(this.initialBufs[i]);
        this.initialBufs.length = this.initialBufsLen = 0;
        return resStr;
      }
      return this.decoder.write(buf);
    };
    Utf16Decoder.prototype.end = function() {
      if (!this.decoder) {
        var encoding = detectEncoding(this.initialBufs, this.options.defaultEncoding);
        this.decoder = this.iconv.getDecoder(encoding, this.options);
        var resStr = "";
        for (var i = 0; i < this.initialBufs.length; i++)
          resStr += this.decoder.write(this.initialBufs[i]);
        var trail = this.decoder.end();
        if (trail)
          resStr += trail;
        this.initialBufs.length = this.initialBufsLen = 0;
        return resStr;
      }
      return this.decoder.end();
    };
    function detectEncoding(bufs, defaultEncoding) {
      var b = [];
      var charsProcessed = 0;
      var asciiCharsLE = 0, asciiCharsBE = 0;
      outer_loop:
        for (var i = 0; i < bufs.length; i++) {
          var buf = bufs[i];
          for (var j = 0; j < buf.length; j++) {
            b.push(buf[j]);
            if (b.length === 2) {
              if (charsProcessed === 0) {
                if (b[0] === 255 && b[1] === 254)
                  return "utf-16le";
                if (b[0] === 254 && b[1] === 255)
                  return "utf-16be";
              }
              if (b[0] === 0 && b[1] !== 0)
                asciiCharsBE++;
              if (b[0] !== 0 && b[1] === 0)
                asciiCharsLE++;
              b.length = 0;
              charsProcessed++;
              if (charsProcessed >= 100) {
                break outer_loop;
              }
            }
          }
        }
      if (asciiCharsBE > asciiCharsLE)
        return "utf-16be";
      if (asciiCharsBE < asciiCharsLE)
        return "utf-16le";
      return defaultEncoding || "utf-16le";
    }
  }
});

// node_modules/iconv-lite/encodings/utf7.js
var require_utf7 = __commonJS({
  "node_modules/iconv-lite/encodings/utf7.js"(exports) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    exports.utf7 = Utf7Codec;
    exports.unicode11utf7 = "utf7";
    function Utf7Codec(codecOptions, iconv) {
      this.iconv = iconv;
    }
    Utf7Codec.prototype.encoder = Utf7Encoder;
    Utf7Codec.prototype.decoder = Utf7Decoder;
    Utf7Codec.prototype.bomAware = true;
    var nonDirectChars = /[^A-Za-z0-9'\(\),-\.\/:\? \n\r\t]+/g;
    function Utf7Encoder(options, codec) {
      this.iconv = codec.iconv;
    }
    Utf7Encoder.prototype.write = function(str) {
      return Buffer3.from(str.replace(nonDirectChars, function(chunk) {
        return "+" + (chunk === "+" ? "" : this.iconv.encode(chunk, "utf16-be").toString("base64").replace(/=+$/, "")) + "-";
      }.bind(this)));
    };
    Utf7Encoder.prototype.end = function() {
    };
    function Utf7Decoder(options, codec) {
      this.iconv = codec.iconv;
      this.inBase64 = false;
      this.base64Accum = "";
    }
    var base64Regex = /[A-Za-z0-9\/+]/;
    var base64Chars = [];
    for (i = 0; i < 256; i++)
      base64Chars[i] = base64Regex.test(String.fromCharCode(i));
    var i;
    var plusChar = "+".charCodeAt(0);
    var minusChar = "-".charCodeAt(0);
    var andChar = "&".charCodeAt(0);
    Utf7Decoder.prototype.write = function(buf) {
      var res = "", lastI = 0, inBase64 = this.inBase64, base64Accum = this.base64Accum;
      for (var i2 = 0; i2 < buf.length; i2++) {
        if (!inBase64) {
          if (buf[i2] == plusChar) {
            res += this.iconv.decode(buf.slice(lastI, i2), "ascii");
            lastI = i2 + 1;
            inBase64 = true;
          }
        } else {
          if (!base64Chars[buf[i2]]) {
            if (i2 == lastI && buf[i2] == minusChar) {
              res += "+";
            } else {
              var b64str = base64Accum + this.iconv.decode(buf.slice(lastI, i2), "ascii");
              res += this.iconv.decode(Buffer3.from(b64str, "base64"), "utf16-be");
            }
            if (buf[i2] != minusChar)
              i2--;
            lastI = i2 + 1;
            inBase64 = false;
            base64Accum = "";
          }
        }
      }
      if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii");
      } else {
        var b64str = base64Accum + this.iconv.decode(buf.slice(lastI), "ascii");
        var canBeDecoded = b64str.length - b64str.length % 8;
        base64Accum = b64str.slice(canBeDecoded);
        b64str = b64str.slice(0, canBeDecoded);
        res += this.iconv.decode(Buffer3.from(b64str, "base64"), "utf16-be");
      }
      this.inBase64 = inBase64;
      this.base64Accum = base64Accum;
      return res;
    };
    Utf7Decoder.prototype.end = function() {
      var res = "";
      if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(Buffer3.from(this.base64Accum, "base64"), "utf16-be");
      this.inBase64 = false;
      this.base64Accum = "";
      return res;
    };
    exports.utf7imap = Utf7IMAPCodec;
    function Utf7IMAPCodec(codecOptions, iconv) {
      this.iconv = iconv;
    }
    Utf7IMAPCodec.prototype.encoder = Utf7IMAPEncoder;
    Utf7IMAPCodec.prototype.decoder = Utf7IMAPDecoder;
    Utf7IMAPCodec.prototype.bomAware = true;
    function Utf7IMAPEncoder(options, codec) {
      this.iconv = codec.iconv;
      this.inBase64 = false;
      this.base64Accum = Buffer3.alloc(6);
      this.base64AccumIdx = 0;
    }
    Utf7IMAPEncoder.prototype.write = function(str) {
      var inBase64 = this.inBase64, base64Accum = this.base64Accum, base64AccumIdx = this.base64AccumIdx, buf = Buffer3.alloc(str.length * 5 + 10), bufIdx = 0;
      for (var i2 = 0; i2 < str.length; i2++) {
        var uChar = str.charCodeAt(i2);
        if (32 <= uChar && uChar <= 126) {
          if (inBase64) {
            if (base64AccumIdx > 0) {
              bufIdx += buf.write(base64Accum.slice(0, base64AccumIdx).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), bufIdx);
              base64AccumIdx = 0;
            }
            buf[bufIdx++] = minusChar;
            inBase64 = false;
          }
          if (!inBase64) {
            buf[bufIdx++] = uChar;
            if (uChar === andChar)
              buf[bufIdx++] = minusChar;
          }
        } else {
          if (!inBase64) {
            buf[bufIdx++] = andChar;
            inBase64 = true;
          }
          if (inBase64) {
            base64Accum[base64AccumIdx++] = uChar >> 8;
            base64Accum[base64AccumIdx++] = uChar & 255;
            if (base64AccumIdx == base64Accum.length) {
              bufIdx += buf.write(base64Accum.toString("base64").replace(/\//g, ","), bufIdx);
              base64AccumIdx = 0;
            }
          }
        }
      }
      this.inBase64 = inBase64;
      this.base64AccumIdx = base64AccumIdx;
      return buf.slice(0, bufIdx);
    };
    Utf7IMAPEncoder.prototype.end = function() {
      var buf = Buffer3.alloc(10), bufIdx = 0;
      if (this.inBase64) {
        if (this.base64AccumIdx > 0) {
          bufIdx += buf.write(this.base64Accum.slice(0, this.base64AccumIdx).toString("base64").replace(/\//g, ",").replace(/=+$/, ""), bufIdx);
          this.base64AccumIdx = 0;
        }
        buf[bufIdx++] = minusChar;
        this.inBase64 = false;
      }
      return buf.slice(0, bufIdx);
    };
    function Utf7IMAPDecoder(options, codec) {
      this.iconv = codec.iconv;
      this.inBase64 = false;
      this.base64Accum = "";
    }
    var base64IMAPChars = base64Chars.slice();
    base64IMAPChars[",".charCodeAt(0)] = true;
    Utf7IMAPDecoder.prototype.write = function(buf) {
      var res = "", lastI = 0, inBase64 = this.inBase64, base64Accum = this.base64Accum;
      for (var i2 = 0; i2 < buf.length; i2++) {
        if (!inBase64) {
          if (buf[i2] == andChar) {
            res += this.iconv.decode(buf.slice(lastI, i2), "ascii");
            lastI = i2 + 1;
            inBase64 = true;
          }
        } else {
          if (!base64IMAPChars[buf[i2]]) {
            if (i2 == lastI && buf[i2] == minusChar) {
              res += "&";
            } else {
              var b64str = base64Accum + this.iconv.decode(buf.slice(lastI, i2), "ascii").replace(/,/g, "/");
              res += this.iconv.decode(Buffer3.from(b64str, "base64"), "utf16-be");
            }
            if (buf[i2] != minusChar)
              i2--;
            lastI = i2 + 1;
            inBase64 = false;
            base64Accum = "";
          }
        }
      }
      if (!inBase64) {
        res += this.iconv.decode(buf.slice(lastI), "ascii");
      } else {
        var b64str = base64Accum + this.iconv.decode(buf.slice(lastI), "ascii").replace(/,/g, "/");
        var canBeDecoded = b64str.length - b64str.length % 8;
        base64Accum = b64str.slice(canBeDecoded);
        b64str = b64str.slice(0, canBeDecoded);
        res += this.iconv.decode(Buffer3.from(b64str, "base64"), "utf16-be");
      }
      this.inBase64 = inBase64;
      this.base64Accum = base64Accum;
      return res;
    };
    Utf7IMAPDecoder.prototype.end = function() {
      var res = "";
      if (this.inBase64 && this.base64Accum.length > 0)
        res = this.iconv.decode(Buffer3.from(this.base64Accum, "base64"), "utf16-be");
      this.inBase64 = false;
      this.base64Accum = "";
      return res;
    };
  }
});

// node_modules/iconv-lite/encodings/sbcs-codec.js
var require_sbcs_codec = __commonJS({
  "node_modules/iconv-lite/encodings/sbcs-codec.js"(exports) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    exports._sbcs = SBCSCodec;
    function SBCSCodec(codecOptions, iconv) {
      if (!codecOptions)
        throw new Error("SBCS codec is called without the data.");
      if (!codecOptions.chars || codecOptions.chars.length !== 128 && codecOptions.chars.length !== 256)
        throw new Error("Encoding '" + codecOptions.type + "' has incorrect 'chars' (must be of len 128 or 256)");
      if (codecOptions.chars.length === 128) {
        var asciiString = "";
        for (var i = 0; i < 128; i++)
          asciiString += String.fromCharCode(i);
        codecOptions.chars = asciiString + codecOptions.chars;
      }
      this.decodeBuf = Buffer3.from(codecOptions.chars, "ucs2");
      var encodeBuf = Buffer3.alloc(65536, iconv.defaultCharSingleByte.charCodeAt(0));
      for (var i = 0; i < codecOptions.chars.length; i++)
        encodeBuf[codecOptions.chars.charCodeAt(i)] = i;
      this.encodeBuf = encodeBuf;
    }
    SBCSCodec.prototype.encoder = SBCSEncoder;
    SBCSCodec.prototype.decoder = SBCSDecoder;
    function SBCSEncoder(options, codec) {
      this.encodeBuf = codec.encodeBuf;
    }
    SBCSEncoder.prototype.write = function(str) {
      var buf = Buffer3.alloc(str.length);
      for (var i = 0; i < str.length; i++)
        buf[i] = this.encodeBuf[str.charCodeAt(i)];
      return buf;
    };
    SBCSEncoder.prototype.end = function() {
    };
    function SBCSDecoder(options, codec) {
      this.decodeBuf = codec.decodeBuf;
    }
    SBCSDecoder.prototype.write = function(buf) {
      var decodeBuf = this.decodeBuf;
      var newBuf = Buffer3.alloc(buf.length * 2);
      var idx1 = 0, idx2 = 0;
      for (var i = 0; i < buf.length; i++) {
        idx1 = buf[i] * 2;
        idx2 = i * 2;
        newBuf[idx2] = decodeBuf[idx1];
        newBuf[idx2 + 1] = decodeBuf[idx1 + 1];
      }
      return newBuf.toString("ucs2");
    };
    SBCSDecoder.prototype.end = function() {
    };
  }
});

// node_modules/iconv-lite/encodings/sbcs-data.js
var require_sbcs_data = __commonJS({
  "node_modules/iconv-lite/encodings/sbcs-data.js"(exports, module) {
    "use strict";
    module.exports = {
      "10029": "maccenteuro",
      "maccenteuro": {
        "type": "_sbcs",
        "chars": "\xC4\u0100\u0101\xC9\u0104\xD6\xDC\xE1\u0105\u010C\xE4\u010D\u0106\u0107\xE9\u0179\u017A\u010E\xED\u010F\u0112\u0113\u0116\xF3\u0117\xF4\xF6\xF5\xFA\u011A\u011B\xFC\u2020\xB0\u0118\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\u0119\xA8\u2260\u0123\u012E\u012F\u012A\u2264\u2265\u012B\u0136\u2202\u2211\u0142\u013B\u013C\u013D\u013E\u0139\u013A\u0145\u0146\u0143\xAC\u221A\u0144\u0147\u2206\xAB\xBB\u2026\xA0\u0148\u0150\xD5\u0151\u014C\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\u014D\u0154\u0155\u0158\u2039\u203A\u0159\u0156\u0157\u0160\u201A\u201E\u0161\u015A\u015B\xC1\u0164\u0165\xCD\u017D\u017E\u016A\xD3\xD4\u016B\u016E\xDA\u016F\u0170\u0171\u0172\u0173\xDD\xFD\u0137\u017B\u0141\u017C\u0122\u02C7"
      },
      "808": "cp808",
      "ibm808": "cp808",
      "cp808": {
        "type": "_sbcs",
        "chars": "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F\u0401\u0451\u0404\u0454\u0407\u0457\u040E\u045E\xB0\u2219\xB7\u221A\u2116\u20AC\u25A0\xA0"
      },
      "mik": {
        "type": "_sbcs",
        "chars": "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F\u2514\u2534\u252C\u251C\u2500\u253C\u2563\u2551\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2510\u2591\u2592\u2593\u2502\u2524\u2116\xA7\u2557\u255D\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "cp720": {
        "type": "_sbcs",
        "chars": "\x80\x81\xE9\xE2\x84\xE0\x86\xE7\xEA\xEB\xE8\xEF\xEE\x8D\x8E\x8F\x90\u0651\u0652\xF4\xA4\u0640\xFB\xF9\u0621\u0622\u0623\u0624\xA3\u0625\u0626\u0627\u0628\u0629\u062A\u062B\u062C\u062D\u062E\u062F\u0630\u0631\u0632\u0633\u0634\u0635\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u0636\u0637\u0638\u0639\u063A\u0641\xB5\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649\u064A\u2261\u064B\u064C\u064D\u064E\u064F\u0650\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ascii8bit": "ascii",
      "usascii": "ascii",
      "ansix34": "ascii",
      "ansix341968": "ascii",
      "ansix341986": "ascii",
      "csascii": "ascii",
      "cp367": "ascii",
      "ibm367": "ascii",
      "isoir6": "ascii",
      "iso646us": "ascii",
      "iso646irv": "ascii",
      "us": "ascii",
      "latin1": "iso88591",
      "latin2": "iso88592",
      "latin3": "iso88593",
      "latin4": "iso88594",
      "latin5": "iso88599",
      "latin6": "iso885910",
      "latin7": "iso885913",
      "latin8": "iso885914",
      "latin9": "iso885915",
      "latin10": "iso885916",
      "csisolatin1": "iso88591",
      "csisolatin2": "iso88592",
      "csisolatin3": "iso88593",
      "csisolatin4": "iso88594",
      "csisolatincyrillic": "iso88595",
      "csisolatinarabic": "iso88596",
      "csisolatingreek": "iso88597",
      "csisolatinhebrew": "iso88598",
      "csisolatin5": "iso88599",
      "csisolatin6": "iso885910",
      "l1": "iso88591",
      "l2": "iso88592",
      "l3": "iso88593",
      "l4": "iso88594",
      "l5": "iso88599",
      "l6": "iso885910",
      "l7": "iso885913",
      "l8": "iso885914",
      "l9": "iso885915",
      "l10": "iso885916",
      "isoir14": "iso646jp",
      "isoir57": "iso646cn",
      "isoir100": "iso88591",
      "isoir101": "iso88592",
      "isoir109": "iso88593",
      "isoir110": "iso88594",
      "isoir144": "iso88595",
      "isoir127": "iso88596",
      "isoir126": "iso88597",
      "isoir138": "iso88598",
      "isoir148": "iso88599",
      "isoir157": "iso885910",
      "isoir166": "tis620",
      "isoir179": "iso885913",
      "isoir199": "iso885914",
      "isoir203": "iso885915",
      "isoir226": "iso885916",
      "cp819": "iso88591",
      "ibm819": "iso88591",
      "cyrillic": "iso88595",
      "arabic": "iso88596",
      "arabic8": "iso88596",
      "ecma114": "iso88596",
      "asmo708": "iso88596",
      "greek": "iso88597",
      "greek8": "iso88597",
      "ecma118": "iso88597",
      "elot928": "iso88597",
      "hebrew": "iso88598",
      "hebrew8": "iso88598",
      "turkish": "iso88599",
      "turkish8": "iso88599",
      "thai": "iso885911",
      "thai8": "iso885911",
      "celtic": "iso885914",
      "celtic8": "iso885914",
      "isoceltic": "iso885914",
      "tis6200": "tis620",
      "tis62025291": "tis620",
      "tis62025330": "tis620",
      "10000": "macroman",
      "10006": "macgreek",
      "10007": "maccyrillic",
      "10079": "maciceland",
      "10081": "macturkish",
      "cspc8codepage437": "cp437",
      "cspc775baltic": "cp775",
      "cspc850multilingual": "cp850",
      "cspcp852": "cp852",
      "cspc862latinhebrew": "cp862",
      "cpgr": "cp869",
      "msee": "cp1250",
      "mscyrl": "cp1251",
      "msansi": "cp1252",
      "msgreek": "cp1253",
      "msturk": "cp1254",
      "mshebr": "cp1255",
      "msarab": "cp1256",
      "winbaltrim": "cp1257",
      "cp20866": "koi8r",
      "20866": "koi8r",
      "ibm878": "koi8r",
      "cskoi8r": "koi8r",
      "cp21866": "koi8u",
      "21866": "koi8u",
      "ibm1168": "koi8u",
      "strk10482002": "rk1048",
      "tcvn5712": "tcvn",
      "tcvn57121": "tcvn",
      "gb198880": "iso646cn",
      "cn": "iso646cn",
      "csiso14jisc6220ro": "iso646jp",
      "jisc62201969ro": "iso646jp",
      "jp": "iso646jp",
      "cshproman8": "hproman8",
      "r8": "hproman8",
      "roman8": "hproman8",
      "xroman8": "hproman8",
      "ibm1051": "hproman8",
      "mac": "macintosh",
      "csmacintosh": "macintosh"
    };
  }
});

// node_modules/iconv-lite/encodings/sbcs-data-generated.js
var require_sbcs_data_generated = __commonJS({
  "node_modules/iconv-lite/encodings/sbcs-data-generated.js"(exports, module) {
    "use strict";
    module.exports = {
      "437": "cp437",
      "737": "cp737",
      "775": "cp775",
      "850": "cp850",
      "852": "cp852",
      "855": "cp855",
      "856": "cp856",
      "857": "cp857",
      "858": "cp858",
      "860": "cp860",
      "861": "cp861",
      "862": "cp862",
      "863": "cp863",
      "864": "cp864",
      "865": "cp865",
      "866": "cp866",
      "869": "cp869",
      "874": "windows874",
      "922": "cp922",
      "1046": "cp1046",
      "1124": "cp1124",
      "1125": "cp1125",
      "1129": "cp1129",
      "1133": "cp1133",
      "1161": "cp1161",
      "1162": "cp1162",
      "1163": "cp1163",
      "1250": "windows1250",
      "1251": "windows1251",
      "1252": "windows1252",
      "1253": "windows1253",
      "1254": "windows1254",
      "1255": "windows1255",
      "1256": "windows1256",
      "1257": "windows1257",
      "1258": "windows1258",
      "28591": "iso88591",
      "28592": "iso88592",
      "28593": "iso88593",
      "28594": "iso88594",
      "28595": "iso88595",
      "28596": "iso88596",
      "28597": "iso88597",
      "28598": "iso88598",
      "28599": "iso88599",
      "28600": "iso885910",
      "28601": "iso885911",
      "28603": "iso885913",
      "28604": "iso885914",
      "28605": "iso885915",
      "28606": "iso885916",
      "windows874": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\uFFFD\uFFFD\uFFFD\u2026\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\xA0\u0E01\u0E02\u0E03\u0E04\u0E05\u0E06\u0E07\u0E08\u0E09\u0E0A\u0E0B\u0E0C\u0E0D\u0E0E\u0E0F\u0E10\u0E11\u0E12\u0E13\u0E14\u0E15\u0E16\u0E17\u0E18\u0E19\u0E1A\u0E1B\u0E1C\u0E1D\u0E1E\u0E1F\u0E20\u0E21\u0E22\u0E23\u0E24\u0E25\u0E26\u0E27\u0E28\u0E29\u0E2A\u0E2B\u0E2C\u0E2D\u0E2E\u0E2F\u0E30\u0E31\u0E32\u0E33\u0E34\u0E35\u0E36\u0E37\u0E38\u0E39\u0E3A\uFFFD\uFFFD\uFFFD\uFFFD\u0E3F\u0E40\u0E41\u0E42\u0E43\u0E44\u0E45\u0E46\u0E47\u0E48\u0E49\u0E4A\u0E4B\u0E4C\u0E4D\u0E4E\u0E4F\u0E50\u0E51\u0E52\u0E53\u0E54\u0E55\u0E56\u0E57\u0E58\u0E59\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "win874": "windows874",
      "cp874": "windows874",
      "windows1250": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\u201A\uFFFD\u201E\u2026\u2020\u2021\uFFFD\u2030\u0160\u2039\u015A\u0164\u017D\u0179\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\u0161\u203A\u015B\u0165\u017E\u017A\xA0\u02C7\u02D8\u0141\xA4\u0104\xA6\xA7\xA8\xA9\u015E\xAB\xAC\xAD\xAE\u017B\xB0\xB1\u02DB\u0142\xB4\xB5\xB6\xB7\xB8\u0105\u015F\xBB\u013D\u02DD\u013E\u017C\u0154\xC1\xC2\u0102\xC4\u0139\u0106\xC7\u010C\xC9\u0118\xCB\u011A\xCD\xCE\u010E\u0110\u0143\u0147\xD3\xD4\u0150\xD6\xD7\u0158\u016E\xDA\u0170\xDC\xDD\u0162\xDF\u0155\xE1\xE2\u0103\xE4\u013A\u0107\xE7\u010D\xE9\u0119\xEB\u011B\xED\xEE\u010F\u0111\u0144\u0148\xF3\xF4\u0151\xF6\xF7\u0159\u016F\xFA\u0171\xFC\xFD\u0163\u02D9"
      },
      "win1250": "windows1250",
      "cp1250": "windows1250",
      "windows1251": {
        "type": "_sbcs",
        "chars": "\u0402\u0403\u201A\u0453\u201E\u2026\u2020\u2021\u20AC\u2030\u0409\u2039\u040A\u040C\u040B\u040F\u0452\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\u0459\u203A\u045A\u045C\u045B\u045F\xA0\u040E\u045E\u0408\xA4\u0490\xA6\xA7\u0401\xA9\u0404\xAB\xAC\xAD\xAE\u0407\xB0\xB1\u0406\u0456\u0491\xB5\xB6\xB7\u0451\u2116\u0454\xBB\u0458\u0405\u0455\u0457\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F"
      },
      "win1251": "windows1251",
      "cp1251": "windows1251",
      "windows1252": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\uFFFD\u017D\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\uFFFD\u017E\u0178\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF"
      },
      "win1252": "windows1252",
      "cp1252": "windows1252",
      "windows1253": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\u201A\u0192\u201E\u2026\u2020\u2021\uFFFD\u2030\uFFFD\u2039\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\uFFFD\u203A\uFFFD\uFFFD\uFFFD\uFFFD\xA0\u0385\u0386\xA3\xA4\xA5\xA6\xA7\xA8\xA9\uFFFD\xAB\xAC\xAD\xAE\u2015\xB0\xB1\xB2\xB3\u0384\xB5\xB6\xB7\u0388\u0389\u038A\xBB\u038C\xBD\u038E\u038F\u0390\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039A\u039B\u039C\u039D\u039E\u039F\u03A0\u03A1\uFFFD\u03A3\u03A4\u03A5\u03A6\u03A7\u03A8\u03A9\u03AA\u03AB\u03AC\u03AD\u03AE\u03AF\u03B0\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03B9\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1\u03C2\u03C3\u03C4\u03C5\u03C6\u03C7\u03C8\u03C9\u03CA\u03CB\u03CC\u03CD\u03CE\uFFFD"
      },
      "win1253": "windows1253",
      "cp1253": "windows1253",
      "windows1254": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\uFFFD\uFFFD\u0178\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\u011E\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\u0130\u015E\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\u011F\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\u0131\u015F\xFF"
      },
      "win1254": "windows1254",
      "cp1254": "windows1254",
      "windows1255": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\uFFFD\u2039\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\uFFFD\u203A\uFFFD\uFFFD\uFFFD\uFFFD\xA0\xA1\xA2\xA3\u20AA\xA5\xA6\xA7\xA8\xA9\xD7\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xF7\xBB\xBC\xBD\xBE\xBF\u05B0\u05B1\u05B2\u05B3\u05B4\u05B5\u05B6\u05B7\u05B8\u05B9\u05BA\u05BB\u05BC\u05BD\u05BE\u05BF\u05C0\u05C1\u05C2\u05C3\u05F0\u05F1\u05F2\u05F3\u05F4\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u05D0\u05D1\u05D2\u05D3\u05D4\u05D5\u05D6\u05D7\u05D8\u05D9\u05DA\u05DB\u05DC\u05DD\u05DE\u05DF\u05E0\u05E1\u05E2\u05E3\u05E4\u05E5\u05E6\u05E7\u05E8\u05E9\u05EA\uFFFD\uFFFD\u200E\u200F\uFFFD"
      },
      "win1255": "windows1255",
      "cp1255": "windows1255",
      "windows1256": {
        "type": "_sbcs",
        "chars": "\u20AC\u067E\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0679\u2039\u0152\u0686\u0698\u0688\u06AF\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u06A9\u2122\u0691\u203A\u0153\u200C\u200D\u06BA\xA0\u060C\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\u06BE\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\u061B\xBB\xBC\xBD\xBE\u061F\u06C1\u0621\u0622\u0623\u0624\u0625\u0626\u0627\u0628\u0629\u062A\u062B\u062C\u062D\u062E\u062F\u0630\u0631\u0632\u0633\u0634\u0635\u0636\xD7\u0637\u0638\u0639\u063A\u0640\u0641\u0642\u0643\xE0\u0644\xE2\u0645\u0646\u0647\u0648\xE7\xE8\xE9\xEA\xEB\u0649\u064A\xEE\xEF\u064B\u064C\u064D\u064E\xF4\u064F\u0650\xF7\u0651\xF9\u0652\xFB\xFC\u200E\u200F\u06D2"
      },
      "win1256": "windows1256",
      "cp1256": "windows1256",
      "windows1257": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\u201A\uFFFD\u201E\u2026\u2020\u2021\uFFFD\u2030\uFFFD\u2039\uFFFD\xA8\u02C7\xB8\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\uFFFD\u203A\uFFFD\xAF\u02DB\uFFFD\xA0\uFFFD\xA2\xA3\xA4\uFFFD\xA6\xA7\xD8\xA9\u0156\xAB\xAC\xAD\xAE\xC6\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xF8\xB9\u0157\xBB\xBC\xBD\xBE\xE6\u0104\u012E\u0100\u0106\xC4\xC5\u0118\u0112\u010C\xC9\u0179\u0116\u0122\u0136\u012A\u013B\u0160\u0143\u0145\xD3\u014C\xD5\xD6\xD7\u0172\u0141\u015A\u016A\xDC\u017B\u017D\xDF\u0105\u012F\u0101\u0107\xE4\xE5\u0119\u0113\u010D\xE9\u017A\u0117\u0123\u0137\u012B\u013C\u0161\u0144\u0146\xF3\u014D\xF5\xF6\xF7\u0173\u0142\u015B\u016B\xFC\u017C\u017E\u02D9"
      },
      "win1257": "windows1257",
      "cp1257": "windows1257",
      "windows1258": {
        "type": "_sbcs",
        "chars": "\u20AC\uFFFD\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\uFFFD\u2039\u0152\uFFFD\uFFFD\uFFFD\uFFFD\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\uFFFD\u203A\u0153\uFFFD\uFFFD\u0178\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\u0102\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\u0300\xCD\xCE\xCF\u0110\xD1\u0309\xD3\xD4\u01A0\xD6\xD7\xD8\xD9\xDA\xDB\xDC\u01AF\u0303\xDF\xE0\xE1\xE2\u0103\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\u0301\xED\xEE\xEF\u0111\xF1\u0323\xF3\xF4\u01A1\xF6\xF7\xF8\xF9\xFA\xFB\xFC\u01B0\u20AB\xFF"
      },
      "win1258": "windows1258",
      "cp1258": "windows1258",
      "iso88591": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF"
      },
      "cp28591": "iso88591",
      "iso88592": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0104\u02D8\u0141\xA4\u013D\u015A\xA7\xA8\u0160\u015E\u0164\u0179\xAD\u017D\u017B\xB0\u0105\u02DB\u0142\xB4\u013E\u015B\u02C7\xB8\u0161\u015F\u0165\u017A\u02DD\u017E\u017C\u0154\xC1\xC2\u0102\xC4\u0139\u0106\xC7\u010C\xC9\u0118\xCB\u011A\xCD\xCE\u010E\u0110\u0143\u0147\xD3\xD4\u0150\xD6\xD7\u0158\u016E\xDA\u0170\xDC\xDD\u0162\xDF\u0155\xE1\xE2\u0103\xE4\u013A\u0107\xE7\u010D\xE9\u0119\xEB\u011B\xED\xEE\u010F\u0111\u0144\u0148\xF3\xF4\u0151\xF6\xF7\u0159\u016F\xFA\u0171\xFC\xFD\u0163\u02D9"
      },
      "cp28592": "iso88592",
      "iso88593": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0126\u02D8\xA3\xA4\uFFFD\u0124\xA7\xA8\u0130\u015E\u011E\u0134\xAD\uFFFD\u017B\xB0\u0127\xB2\xB3\xB4\xB5\u0125\xB7\xB8\u0131\u015F\u011F\u0135\xBD\uFFFD\u017C\xC0\xC1\xC2\uFFFD\xC4\u010A\u0108\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\uFFFD\xD1\xD2\xD3\xD4\u0120\xD6\xD7\u011C\xD9\xDA\xDB\xDC\u016C\u015C\xDF\xE0\xE1\xE2\uFFFD\xE4\u010B\u0109\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\uFFFD\xF1\xF2\xF3\xF4\u0121\xF6\xF7\u011D\xF9\xFA\xFB\xFC\u016D\u015D\u02D9"
      },
      "cp28593": "iso88593",
      "iso88594": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0104\u0138\u0156\xA4\u0128\u013B\xA7\xA8\u0160\u0112\u0122\u0166\xAD\u017D\xAF\xB0\u0105\u02DB\u0157\xB4\u0129\u013C\u02C7\xB8\u0161\u0113\u0123\u0167\u014A\u017E\u014B\u0100\xC1\xC2\xC3\xC4\xC5\xC6\u012E\u010C\xC9\u0118\xCB\u0116\xCD\xCE\u012A\u0110\u0145\u014C\u0136\xD4\xD5\xD6\xD7\xD8\u0172\xDA\xDB\xDC\u0168\u016A\xDF\u0101\xE1\xE2\xE3\xE4\xE5\xE6\u012F\u010D\xE9\u0119\xEB\u0117\xED\xEE\u012B\u0111\u0146\u014D\u0137\xF4\xF5\xF6\xF7\xF8\u0173\xFA\xFB\xFC\u0169\u016B\u02D9"
      },
      "cp28594": "iso88594",
      "iso88595": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0401\u0402\u0403\u0404\u0405\u0406\u0407\u0408\u0409\u040A\u040B\u040C\xAD\u040E\u040F\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F\u2116\u0451\u0452\u0453\u0454\u0455\u0456\u0457\u0458\u0459\u045A\u045B\u045C\xA7\u045E\u045F"
      },
      "cp28595": "iso88595",
      "iso88596": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\uFFFD\uFFFD\uFFFD\xA4\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u060C\xAD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u061B\uFFFD\uFFFD\uFFFD\u061F\uFFFD\u0621\u0622\u0623\u0624\u0625\u0626\u0627\u0628\u0629\u062A\u062B\u062C\u062D\u062E\u062F\u0630\u0631\u0632\u0633\u0634\u0635\u0636\u0637\u0638\u0639\u063A\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u0640\u0641\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649\u064A\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "cp28596": "iso88596",
      "iso88597": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u2018\u2019\xA3\u20AC\u20AF\xA6\xA7\xA8\xA9\u037A\xAB\xAC\xAD\uFFFD\u2015\xB0\xB1\xB2\xB3\u0384\u0385\u0386\xB7\u0388\u0389\u038A\xBB\u038C\xBD\u038E\u038F\u0390\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039A\u039B\u039C\u039D\u039E\u039F\u03A0\u03A1\uFFFD\u03A3\u03A4\u03A5\u03A6\u03A7\u03A8\u03A9\u03AA\u03AB\u03AC\u03AD\u03AE\u03AF\u03B0\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03B9\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1\u03C2\u03C3\u03C4\u03C5\u03C6\u03C7\u03C8\u03C9\u03CA\u03CB\u03CC\u03CD\u03CE\uFFFD"
      },
      "cp28597": "iso88597",
      "iso88598": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\uFFFD\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xD7\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xF7\xBB\xBC\xBD\xBE\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2017\u05D0\u05D1\u05D2\u05D3\u05D4\u05D5\u05D6\u05D7\u05D8\u05D9\u05DA\u05DB\u05DC\u05DD\u05DE\u05DF\u05E0\u05E1\u05E2\u05E3\u05E4\u05E5\u05E6\u05E7\u05E8\u05E9\u05EA\uFFFD\uFFFD\u200E\u200F\uFFFD"
      },
      "cp28598": "iso88598",
      "iso88599": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\u011E\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\u0130\u015E\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\u011F\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\u0131\u015F\xFF"
      },
      "cp28599": "iso88599",
      "iso885910": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0104\u0112\u0122\u012A\u0128\u0136\xA7\u013B\u0110\u0160\u0166\u017D\xAD\u016A\u014A\xB0\u0105\u0113\u0123\u012B\u0129\u0137\xB7\u013C\u0111\u0161\u0167\u017E\u2015\u016B\u014B\u0100\xC1\xC2\xC3\xC4\xC5\xC6\u012E\u010C\xC9\u0118\xCB\u0116\xCD\xCE\xCF\xD0\u0145\u014C\xD3\xD4\xD5\xD6\u0168\xD8\u0172\xDA\xDB\xDC\xDD\xDE\xDF\u0101\xE1\xE2\xE3\xE4\xE5\xE6\u012F\u010D\xE9\u0119\xEB\u0117\xED\xEE\xEF\xF0\u0146\u014D\xF3\xF4\xF5\xF6\u0169\xF8\u0173\xFA\xFB\xFC\xFD\xFE\u0138"
      },
      "cp28600": "iso885910",
      "iso885911": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0E01\u0E02\u0E03\u0E04\u0E05\u0E06\u0E07\u0E08\u0E09\u0E0A\u0E0B\u0E0C\u0E0D\u0E0E\u0E0F\u0E10\u0E11\u0E12\u0E13\u0E14\u0E15\u0E16\u0E17\u0E18\u0E19\u0E1A\u0E1B\u0E1C\u0E1D\u0E1E\u0E1F\u0E20\u0E21\u0E22\u0E23\u0E24\u0E25\u0E26\u0E27\u0E28\u0E29\u0E2A\u0E2B\u0E2C\u0E2D\u0E2E\u0E2F\u0E30\u0E31\u0E32\u0E33\u0E34\u0E35\u0E36\u0E37\u0E38\u0E39\u0E3A\uFFFD\uFFFD\uFFFD\uFFFD\u0E3F\u0E40\u0E41\u0E42\u0E43\u0E44\u0E45\u0E46\u0E47\u0E48\u0E49\u0E4A\u0E4B\u0E4C\u0E4D\u0E4E\u0E4F\u0E50\u0E51\u0E52\u0E53\u0E54\u0E55\u0E56\u0E57\u0E58\u0E59\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "cp28601": "iso885911",
      "iso885913": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u201D\xA2\xA3\xA4\u201E\xA6\xA7\xD8\xA9\u0156\xAB\xAC\xAD\xAE\xC6\xB0\xB1\xB2\xB3\u201C\xB5\xB6\xB7\xF8\xB9\u0157\xBB\xBC\xBD\xBE\xE6\u0104\u012E\u0100\u0106\xC4\xC5\u0118\u0112\u010C\xC9\u0179\u0116\u0122\u0136\u012A\u013B\u0160\u0143\u0145\xD3\u014C\xD5\xD6\xD7\u0172\u0141\u015A\u016A\xDC\u017B\u017D\xDF\u0105\u012F\u0101\u0107\xE4\xE5\u0119\u0113\u010D\xE9\u017A\u0117\u0123\u0137\u012B\u013C\u0161\u0144\u0146\xF3\u014D\xF5\xF6\xF7\u0173\u0142\u015B\u016B\xFC\u017C\u017E\u2019"
      },
      "cp28603": "iso885913",
      "iso885914": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u1E02\u1E03\xA3\u010A\u010B\u1E0A\xA7\u1E80\xA9\u1E82\u1E0B\u1EF2\xAD\xAE\u0178\u1E1E\u1E1F\u0120\u0121\u1E40\u1E41\xB6\u1E56\u1E81\u1E57\u1E83\u1E60\u1EF3\u1E84\u1E85\u1E61\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\u0174\xD1\xD2\xD3\xD4\xD5\xD6\u1E6A\xD8\xD9\xDA\xDB\xDC\xDD\u0176\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\u0175\xF1\xF2\xF3\xF4\xF5\xF6\u1E6B\xF8\xF9\xFA\xFB\xFC\xFD\u0177\xFF"
      },
      "cp28604": "iso885914",
      "iso885915": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\u20AC\xA5\u0160\xA7\u0161\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\u017D\xB5\xB6\xB7\u017E\xB9\xBA\xBB\u0152\u0153\u0178\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\xD0\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\xDE\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF"
      },
      "cp28605": "iso885915",
      "iso885916": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0104\u0105\u0141\u20AC\u201E\u0160\xA7\u0161\xA9\u0218\xAB\u0179\xAD\u017A\u017B\xB0\xB1\u010C\u0142\u017D\u201D\xB6\xB7\u017E\u010D\u0219\xBB\u0152\u0153\u0178\u017C\xC0\xC1\xC2\u0102\xC4\u0106\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\u0110\u0143\xD2\xD3\xD4\u0150\xD6\u015A\u0170\xD9\xDA\xDB\xDC\u0118\u021A\xDF\xE0\xE1\xE2\u0103\xE4\u0107\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\u0111\u0144\xF2\xF3\xF4\u0151\xF6\u015B\u0171\xF9\xFA\xFB\xFC\u0119\u021B\xFF"
      },
      "cp28606": "iso885916",
      "cp437": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ibm437": "cp437",
      "csibm437": "cp437",
      "cp737": {
        "type": "_sbcs",
        "chars": "\u0391\u0392\u0393\u0394\u0395\u0396\u0397\u0398\u0399\u039A\u039B\u039C\u039D\u039E\u039F\u03A0\u03A1\u03A3\u03A4\u03A5\u03A6\u03A7\u03A8\u03A9\u03B1\u03B2\u03B3\u03B4\u03B5\u03B6\u03B7\u03B8\u03B9\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1\u03C3\u03C2\u03C4\u03C5\u03C6\u03C7\u03C8\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03C9\u03AC\u03AD\u03AE\u03CA\u03AF\u03CC\u03CD\u03CB\u03CE\u0386\u0388\u0389\u038A\u038C\u038E\u038F\xB1\u2265\u2264\u03AA\u03AB\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ibm737": "cp737",
      "csibm737": "cp737",
      "cp775": {
        "type": "_sbcs",
        "chars": "\u0106\xFC\xE9\u0101\xE4\u0123\xE5\u0107\u0142\u0113\u0156\u0157\u012B\u0179\xC4\xC5\xC9\xE6\xC6\u014D\xF6\u0122\xA2\u015A\u015B\xD6\xDC\xF8\xA3\xD8\xD7\xA4\u0100\u012A\xF3\u017B\u017C\u017A\u201D\xA6\xA9\xAE\xAC\xBD\xBC\u0141\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u0104\u010C\u0118\u0116\u2563\u2551\u2557\u255D\u012E\u0160\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u0172\u016A\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u017D\u0105\u010D\u0119\u0117\u012F\u0161\u0173\u016B\u017E\u2518\u250C\u2588\u2584\u258C\u2590\u2580\xD3\xDF\u014C\u0143\xF5\xD5\xB5\u0144\u0136\u0137\u013B\u013C\u0146\u0112\u0145\u2019\xAD\xB1\u201C\xBE\xB6\xA7\xF7\u201E\xB0\u2219\xB7\xB9\xB3\xB2\u25A0\xA0"
      },
      "ibm775": "cp775",
      "csibm775": "cp775",
      "cp850": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xF8\xA3\xD8\xD7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\xC1\xC2\xC0\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253C\xE3\xC3\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\xF0\xD0\xCA\xCB\xC8\u0131\xCD\xCE\xCF\u2518\u250C\u2588\u2584\xA6\xCC\u2580\xD3\xDF\xD4\xD2\xF5\xD5\xB5\xFE\xDE\xDA\xDB\xD9\xFD\xDD\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0"
      },
      "ibm850": "cp850",
      "csibm850": "cp850",
      "cp852": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE4\u016F\u0107\xE7\u0142\xEB\u0150\u0151\xEE\u0179\xC4\u0106\xC9\u0139\u013A\xF4\xF6\u013D\u013E\u015A\u015B\xD6\xDC\u0164\u0165\u0141\xD7\u010D\xE1\xED\xF3\xFA\u0104\u0105\u017D\u017E\u0118\u0119\xAC\u017A\u010C\u015F\xAB\xBB\u2591\u2592\u2593\u2502\u2524\xC1\xC2\u011A\u015E\u2563\u2551\u2557\u255D\u017B\u017C\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u0102\u0103\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\u0111\u0110\u010E\xCB\u010F\u0147\xCD\xCE\u011B\u2518\u250C\u2588\u2584\u0162\u016E\u2580\xD3\xDF\xD4\u0143\u0144\u0148\u0160\u0161\u0154\xDA\u0155\u0170\xFD\xDD\u0163\xB4\xAD\u02DD\u02DB\u02C7\u02D8\xA7\xF7\xB8\xB0\xA8\u02D9\u0171\u0158\u0159\u25A0\xA0"
      },
      "ibm852": "cp852",
      "csibm852": "cp852",
      "cp855": {
        "type": "_sbcs",
        "chars": "\u0452\u0402\u0453\u0403\u0451\u0401\u0454\u0404\u0455\u0405\u0456\u0406\u0457\u0407\u0458\u0408\u0459\u0409\u045A\u040A\u045B\u040B\u045C\u040C\u045E\u040E\u045F\u040F\u044E\u042E\u044A\u042A\u0430\u0410\u0431\u0411\u0446\u0426\u0434\u0414\u0435\u0415\u0444\u0424\u0433\u0413\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u0445\u0425\u0438\u0418\u2563\u2551\u2557\u255D\u0439\u0419\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u043A\u041A\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\u043B\u041B\u043C\u041C\u043D\u041D\u043E\u041E\u043F\u2518\u250C\u2588\u2584\u041F\u044F\u2580\u042F\u0440\u0420\u0441\u0421\u0442\u0422\u0443\u0423\u0436\u0416\u0432\u0412\u044C\u042C\u2116\xAD\u044B\u042B\u0437\u0417\u0448\u0428\u044D\u042D\u0449\u0429\u0447\u0427\xA7\u25A0\xA0"
      },
      "ibm855": "cp855",
      "csibm855": "cp855",
      "cp856": {
        "type": "_sbcs",
        "chars": "\u05D0\u05D1\u05D2\u05D3\u05D4\u05D5\u05D6\u05D7\u05D8\u05D9\u05DA\u05DB\u05DC\u05DD\u05DE\u05DF\u05E0\u05E1\u05E2\u05E3\u05E4\u05E5\u05E6\u05E7\u05E8\u05E9\u05EA\uFFFD\xA3\uFFFD\xD7\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\xAE\xAC\xBD\xBC\uFFFD\xAB\xBB\u2591\u2592\u2593\u2502\u2524\uFFFD\uFFFD\uFFFD\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253C\uFFFD\uFFFD\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u2518\u250C\u2588\u2584\xA6\uFFFD\u2580\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\xB5\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0"
      },
      "ibm856": "cp856",
      "csibm856": "cp856",
      "cp857": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\u0131\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\u0130\xD6\xDC\xF8\xA3\xD8\u015E\u015F\xE1\xED\xF3\xFA\xF1\xD1\u011E\u011F\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\xC1\xC2\xC0\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253C\xE3\xC3\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\xBA\xAA\xCA\xCB\xC8\uFFFD\xCD\xCE\xCF\u2518\u250C\u2588\u2584\xA6\xCC\u2580\xD3\xDF\xD4\xD2\xF5\xD5\xB5\uFFFD\xD7\xDA\xDB\xD9\xEC\xFF\xAF\xB4\xAD\xB1\uFFFD\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0"
      },
      "ibm857": "cp857",
      "csibm857": "cp857",
      "cp858": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xF8\xA3\xD8\xD7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\xAE\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\xC1\xC2\xC0\xA9\u2563\u2551\u2557\u255D\xA2\xA5\u2510\u2514\u2534\u252C\u251C\u2500\u253C\xE3\xC3\u255A\u2554\u2569\u2566\u2560\u2550\u256C\xA4\xF0\xD0\xCA\xCB\xC8\u20AC\xCD\xCE\xCF\u2518\u250C\u2588\u2584\xA6\xCC\u2580\xD3\xDF\xD4\xD2\xF5\xD5\xB5\xFE\xDE\xDA\xDB\xD9\xFD\xDD\xAF\xB4\xAD\xB1\u2017\xBE\xB6\xA7\xF7\xB8\xB0\xA8\xB7\xB9\xB3\xB2\u25A0\xA0"
      },
      "ibm858": "cp858",
      "csibm858": "cp858",
      "cp860": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE3\xE0\xC1\xE7\xEA\xCA\xE8\xCD\xD4\xEC\xC3\xC2\xC9\xC0\xC8\xF4\xF5\xF2\xDA\xF9\xCC\xD5\xDC\xA2\xA3\xD9\u20A7\xD3\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\xD2\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ibm860": "cp860",
      "csibm860": "cp860",
      "cp861": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xD0\xF0\xDE\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xFE\xFB\xDD\xFD\xD6\xDC\xF8\xA3\xD8\u20A7\u0192\xE1\xED\xF3\xFA\xC1\xCD\xD3\xDA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ibm861": "cp861",
      "csibm861": "cp861",
      "cp862": {
        "type": "_sbcs",
        "chars": "\u05D0\u05D1\u05D2\u05D3\u05D4\u05D5\u05D6\u05D7\u05D8\u05D9\u05DA\u05DB\u05DC\u05DD\u05DE\u05DF\u05E0\u05E1\u05E2\u05E3\u05E4\u05E5\u05E6\u05E7\u05E8\u05E9\u05EA\xA2\xA3\xA5\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ibm862": "cp862",
      "csibm862": "cp862",
      "cp863": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xC2\xE0\xB6\xE7\xEA\xEB\xE8\xEF\xEE\u2017\xC0\xA7\xC9\xC8\xCA\xF4\xCB\xCF\xFB\xF9\xA4\xD4\xDC\xA2\xA3\xD9\xDB\u0192\xA6\xB4\xF3\xFA\xA8\xB8\xB3\xAF\xCE\u2310\xAC\xBD\xBC\xBE\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ibm863": "cp863",
      "csibm863": "cp863",
      "cp864": {
        "type": "_sbcs",
        "chars": "\0\x07\b	\n\v\f\r\x1B !\"#$\u066A&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F\xB0\xB7\u2219\u221A\u2592\u2500\u2502\u253C\u2524\u252C\u251C\u2534\u2510\u250C\u2514\u2518\u03B2\u221E\u03C6\xB1\xBD\xBC\u2248\xAB\xBB\uFEF7\uFEF8\uFFFD\uFFFD\uFEFB\uFEFC\uFFFD\xA0\xAD\uFE82\xA3\xA4\uFE84\uFFFD\uFFFD\uFE8E\uFE8F\uFE95\uFE99\u060C\uFE9D\uFEA1\uFEA5\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669\uFED1\u061B\uFEB1\uFEB5\uFEB9\u061F\xA2\uFE80\uFE81\uFE83\uFE85\uFECA\uFE8B\uFE8D\uFE91\uFE93\uFE97\uFE9B\uFE9F\uFEA3\uFEA7\uFEA9\uFEAB\uFEAD\uFEAF\uFEB3\uFEB7\uFEBB\uFEBF\uFEC1\uFEC5\uFECB\uFECF\xA6\xAC\xF7\xD7\uFEC9\u0640\uFED3\uFED7\uFEDB\uFEDF\uFEE3\uFEE7\uFEEB\uFEED\uFEEF\uFEF3\uFEBD\uFECC\uFECE\uFECD\uFEE1\uFE7D\u0651\uFEE5\uFEE9\uFEEC\uFEF0\uFEF2\uFED0\uFED5\uFEF5\uFEF6\uFEDD\uFED9\uFEF1\u25A0\uFFFD"
      },
      "ibm864": "cp864",
      "csibm864": "cp864",
      "cp865": {
        "type": "_sbcs",
        "chars": "\xC7\xFC\xE9\xE2\xE4\xE0\xE5\xE7\xEA\xEB\xE8\xEF\xEE\xEC\xC4\xC5\xC9\xE6\xC6\xF4\xF6\xF2\xFB\xF9\xFF\xD6\xDC\xF8\xA3\xD8\u20A7\u0192\xE1\xED\xF3\xFA\xF1\xD1\xAA\xBA\xBF\u2310\xAC\xBD\xBC\xA1\xAB\xA4\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u03B1\xDF\u0393\u03C0\u03A3\u03C3\xB5\u03C4\u03A6\u0398\u03A9\u03B4\u221E\u03C6\u03B5\u2229\u2261\xB1\u2265\u2264\u2320\u2321\xF7\u2248\xB0\u2219\xB7\u221A\u207F\xB2\u25A0\xA0"
      },
      "ibm865": "cp865",
      "csibm865": "cp865",
      "cp866": {
        "type": "_sbcs",
        "chars": "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F\u0401\u0451\u0404\u0454\u0407\u0457\u040E\u045E\xB0\u2219\xB7\u221A\u2116\xA4\u25A0\xA0"
      },
      "ibm866": "cp866",
      "csibm866": "cp866",
      "cp869": {
        "type": "_sbcs",
        "chars": "\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u0386\uFFFD\xB7\xAC\xA6\u2018\u2019\u0388\u2015\u0389\u038A\u03AA\u038C\uFFFD\uFFFD\u038E\u03AB\xA9\u038F\xB2\xB3\u03AC\xA3\u03AD\u03AE\u03AF\u03CA\u0390\u03CC\u03CD\u0391\u0392\u0393\u0394\u0395\u0396\u0397\xBD\u0398\u0399\xAB\xBB\u2591\u2592\u2593\u2502\u2524\u039A\u039B\u039C\u039D\u2563\u2551\u2557\u255D\u039E\u039F\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u03A0\u03A1\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u03A3\u03A4\u03A5\u03A6\u03A7\u03A8\u03A9\u03B1\u03B2\u03B3\u2518\u250C\u2588\u2584\u03B4\u03B5\u2580\u03B6\u03B7\u03B8\u03B9\u03BA\u03BB\u03BC\u03BD\u03BE\u03BF\u03C0\u03C1\u03C3\u03C2\u03C4\u0384\xAD\xB1\u03C5\u03C6\u03C7\xA7\u03C8\u0385\xB0\xA8\u03C9\u03CB\u03B0\u03CE\u25A0\xA0"
      },
      "ibm869": "cp869",
      "csibm869": "cp869",
      "cp922": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\u203E\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\xC3\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\xCC\xCD\xCE\xCF\u0160\xD1\xD2\xD3\xD4\xD5\xD6\xD7\xD8\xD9\xDA\xDB\xDC\xDD\u017D\xDF\xE0\xE1\xE2\xE3\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\u0161\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\u017E\xFF"
      },
      "ibm922": "cp922",
      "csibm922": "cp922",
      "cp1046": {
        "type": "_sbcs",
        "chars": "\uFE88\xD7\xF7\uF8F6\uF8F5\uF8F4\uF8F7\uFE71\x88\u25A0\u2502\u2500\u2510\u250C\u2514\u2518\uFE79\uFE7B\uFE7D\uFE7F\uFE77\uFE8A\uFEF0\uFEF3\uFEF2\uFECE\uFECF\uFED0\uFEF6\uFEF8\uFEFA\uFEFC\xA0\uF8FA\uF8F9\uF8F8\xA4\uF8FB\uFE8B\uFE91\uFE97\uFE9B\uFE9F\uFEA3\u060C\xAD\uFEA7\uFEB3\u0660\u0661\u0662\u0663\u0664\u0665\u0666\u0667\u0668\u0669\uFEB7\u061B\uFEBB\uFEBF\uFECA\u061F\uFECB\u0621\u0622\u0623\u0624\u0625\u0626\u0627\u0628\u0629\u062A\u062B\u062C\u062D\u062E\u062F\u0630\u0631\u0632\u0633\u0634\u0635\u0636\u0637\uFEC7\u0639\u063A\uFECC\uFE82\uFE84\uFE8E\uFED3\u0640\u0641\u0642\u0643\u0644\u0645\u0646\u0647\u0648\u0649\u064A\u064B\u064C\u064D\u064E\u064F\u0650\u0651\u0652\uFED7\uFEDB\uFEDF\uF8FC\uFEF5\uFEF7\uFEF9\uFEFB\uFEE3\uFEE7\uFEEC\uFEE9\uFFFD"
      },
      "ibm1046": "cp1046",
      "csibm1046": "cp1046",
      "cp1124": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0401\u0402\u0490\u0404\u0405\u0406\u0407\u0408\u0409\u040A\u040B\u040C\xAD\u040E\u040F\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F\u2116\u0451\u0452\u0491\u0454\u0455\u0456\u0457\u0458\u0459\u045A\u045B\u045C\xA7\u045E\u045F"
      },
      "ibm1124": "cp1124",
      "csibm1124": "cp1124",
      "cp1125": {
        "type": "_sbcs",
        "chars": "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u2591\u2592\u2593\u2502\u2524\u2561\u2562\u2556\u2555\u2563\u2551\u2557\u255D\u255C\u255B\u2510\u2514\u2534\u252C\u251C\u2500\u253C\u255E\u255F\u255A\u2554\u2569\u2566\u2560\u2550\u256C\u2567\u2568\u2564\u2565\u2559\u2558\u2552\u2553\u256B\u256A\u2518\u250C\u2588\u2584\u258C\u2590\u2580\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F\u0401\u0451\u0490\u0491\u0404\u0454\u0406\u0456\u0407\u0457\xB7\u221A\u2116\xA4\u25A0\xA0"
      },
      "ibm1125": "cp1125",
      "csibm1125": "cp1125",
      "cp1129": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\u0153\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\u0178\xB5\xB6\xB7\u0152\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\u0102\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\u0300\xCD\xCE\xCF\u0110\xD1\u0309\xD3\xD4\u01A0\xD6\xD7\xD8\xD9\xDA\xDB\xDC\u01AF\u0303\xDF\xE0\xE1\xE2\u0103\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\u0301\xED\xEE\xEF\u0111\xF1\u0323\xF3\xF4\u01A1\xF6\xF7\xF8\xF9\xFA\xFB\xFC\u01B0\u20AB\xFF"
      },
      "ibm1129": "cp1129",
      "csibm1129": "cp1129",
      "cp1133": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0E81\u0E82\u0E84\u0E87\u0E88\u0EAA\u0E8A\u0E8D\u0E94\u0E95\u0E96\u0E97\u0E99\u0E9A\u0E9B\u0E9C\u0E9D\u0E9E\u0E9F\u0EA1\u0EA2\u0EA3\u0EA5\u0EA7\u0EAB\u0EAD\u0EAE\uFFFD\uFFFD\uFFFD\u0EAF\u0EB0\u0EB2\u0EB3\u0EB4\u0EB5\u0EB6\u0EB7\u0EB8\u0EB9\u0EBC\u0EB1\u0EBB\u0EBD\uFFFD\uFFFD\uFFFD\u0EC0\u0EC1\u0EC2\u0EC3\u0EC4\u0EC8\u0EC9\u0ECA\u0ECB\u0ECC\u0ECD\u0EC6\uFFFD\u0EDC\u0EDD\u20AD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u0ED0\u0ED1\u0ED2\u0ED3\u0ED4\u0ED5\u0ED6\u0ED7\u0ED8\u0ED9\uFFFD\uFFFD\xA2\xAC\xA6\uFFFD"
      },
      "ibm1133": "cp1133",
      "csibm1133": "cp1133",
      "cp1161": {
        "type": "_sbcs",
        "chars": "\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u0E48\u0E01\u0E02\u0E03\u0E04\u0E05\u0E06\u0E07\u0E08\u0E09\u0E0A\u0E0B\u0E0C\u0E0D\u0E0E\u0E0F\u0E10\u0E11\u0E12\u0E13\u0E14\u0E15\u0E16\u0E17\u0E18\u0E19\u0E1A\u0E1B\u0E1C\u0E1D\u0E1E\u0E1F\u0E20\u0E21\u0E22\u0E23\u0E24\u0E25\u0E26\u0E27\u0E28\u0E29\u0E2A\u0E2B\u0E2C\u0E2D\u0E2E\u0E2F\u0E30\u0E31\u0E32\u0E33\u0E34\u0E35\u0E36\u0E37\u0E38\u0E39\u0E3A\u0E49\u0E4A\u0E4B\u20AC\u0E3F\u0E40\u0E41\u0E42\u0E43\u0E44\u0E45\u0E46\u0E47\u0E48\u0E49\u0E4A\u0E4B\u0E4C\u0E4D\u0E4E\u0E4F\u0E50\u0E51\u0E52\u0E53\u0E54\u0E55\u0E56\u0E57\u0E58\u0E59\u0E5A\u0E5B\xA2\xAC\xA6\xA0"
      },
      "ibm1161": "cp1161",
      "csibm1161": "cp1161",
      "cp1162": {
        "type": "_sbcs",
        "chars": "\u20AC\x81\x82\x83\x84\u2026\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\u2018\u2019\u201C\u201D\u2022\u2013\u2014\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\u0E01\u0E02\u0E03\u0E04\u0E05\u0E06\u0E07\u0E08\u0E09\u0E0A\u0E0B\u0E0C\u0E0D\u0E0E\u0E0F\u0E10\u0E11\u0E12\u0E13\u0E14\u0E15\u0E16\u0E17\u0E18\u0E19\u0E1A\u0E1B\u0E1C\u0E1D\u0E1E\u0E1F\u0E20\u0E21\u0E22\u0E23\u0E24\u0E25\u0E26\u0E27\u0E28\u0E29\u0E2A\u0E2B\u0E2C\u0E2D\u0E2E\u0E2F\u0E30\u0E31\u0E32\u0E33\u0E34\u0E35\u0E36\u0E37\u0E38\u0E39\u0E3A\uFFFD\uFFFD\uFFFD\uFFFD\u0E3F\u0E40\u0E41\u0E42\u0E43\u0E44\u0E45\u0E46\u0E47\u0E48\u0E49\u0E4A\u0E4B\u0E4C\u0E4D\u0E4E\u0E4F\u0E50\u0E51\u0E52\u0E53\u0E54\u0E55\u0E56\u0E57\u0E58\u0E59\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "ibm1162": "cp1162",
      "csibm1162": "cp1162",
      "cp1163": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xA1\xA2\xA3\u20AC\xA5\xA6\xA7\u0153\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\u0178\xB5\xB6\xB7\u0152\xB9\xBA\xBB\xBC\xBD\xBE\xBF\xC0\xC1\xC2\u0102\xC4\xC5\xC6\xC7\xC8\xC9\xCA\xCB\u0300\xCD\xCE\xCF\u0110\xD1\u0309\xD3\xD4\u01A0\xD6\xD7\xD8\xD9\xDA\xDB\xDC\u01AF\u0303\xDF\xE0\xE1\xE2\u0103\xE4\xE5\xE6\xE7\xE8\xE9\xEA\xEB\u0301\xED\xEE\xEF\u0111\xF1\u0323\xF3\xF4\u01A1\xF6\xF7\xF8\xF9\xFA\xFB\xFC\u01B0\u20AB\xFF"
      },
      "ibm1163": "cp1163",
      "csibm1163": "cp1163",
      "maccroatian": {
        "type": "_sbcs",
        "chars": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\u0160\u2122\xB4\xA8\u2260\u017D\xD8\u221E\xB1\u2264\u2265\u2206\xB5\u2202\u2211\u220F\u0161\u222B\xAA\xBA\u2126\u017E\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u0106\xAB\u010C\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u0110\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\uFFFD\xA9\u2044\xA4\u2039\u203A\xC6\xBB\u2013\xB7\u201A\u201E\u2030\xC2\u0107\xC1\u010D\xC8\xCD\xCE\xCF\xCC\xD3\xD4\u0111\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u03C0\xCB\u02DA\xB8\xCA\xE6\u02C7"
      },
      "maccyrillic": {
        "type": "_sbcs",
        "chars": "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u2020\xB0\xA2\xA3\xA7\u2022\xB6\u0406\xAE\xA9\u2122\u0402\u0452\u2260\u0403\u0453\u221E\xB1\u2264\u2265\u0456\xB5\u2202\u0408\u0404\u0454\u0407\u0457\u0409\u0459\u040A\u045A\u0458\u0405\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\u040B\u045B\u040C\u045C\u0455\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u201E\u040E\u045E\u040F\u045F\u2116\u0401\u0451\u044F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\xA4"
      },
      "macgreek": {
        "type": "_sbcs",
        "chars": "\xC4\xB9\xB2\xC9\xB3\xD6\xDC\u0385\xE0\xE2\xE4\u0384\xA8\xE7\xE9\xE8\xEA\xEB\xA3\u2122\xEE\xEF\u2022\xBD\u2030\xF4\xF6\xA6\xAD\xF9\xFB\xFC\u2020\u0393\u0394\u0398\u039B\u039E\u03A0\xDF\xAE\xA9\u03A3\u03AA\xA7\u2260\xB0\u0387\u0391\xB1\u2264\u2265\xA5\u0392\u0395\u0396\u0397\u0399\u039A\u039C\u03A6\u03AB\u03A8\u03A9\u03AC\u039D\xAC\u039F\u03A1\u2248\u03A4\xAB\xBB\u2026\xA0\u03A5\u03A7\u0386\u0388\u0153\u2013\u2015\u201C\u201D\u2018\u2019\xF7\u0389\u038A\u038C\u038E\u03AD\u03AE\u03AF\u03CC\u038F\u03CD\u03B1\u03B2\u03C8\u03B4\u03B5\u03C6\u03B3\u03B7\u03B9\u03BE\u03BA\u03BB\u03BC\u03BD\u03BF\u03C0\u03CE\u03C1\u03C3\u03C4\u03B8\u03C9\u03C2\u03C7\u03C5\u03B6\u03CA\u03CB\u0390\u03B0\uFFFD"
      },
      "maciceland": {
        "type": "_sbcs",
        "chars": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\xDD\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u2126\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\xA4\xD0\xF0\xDE\xFE\xFD\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uFFFD\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      },
      "macroman": {
        "type": "_sbcs",
        "chars": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u2126\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\xA4\u2039\u203A\uFB01\uFB02\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uFFFD\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      },
      "macromania": {
        "type": "_sbcs",
        "chars": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\u0102\u015E\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u2126\u0103\u015F\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\xA4\u2039\u203A\u0162\u0163\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uFFFD\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      },
      "macthai": {
        "type": "_sbcs",
        "chars": "\xAB\xBB\u2026\uF88C\uF88F\uF892\uF895\uF898\uF88B\uF88E\uF891\uF894\uF897\u201C\u201D\uF899\uFFFD\u2022\uF884\uF889\uF885\uF886\uF887\uF888\uF88A\uF88D\uF890\uF893\uF896\u2018\u2019\uFFFD\xA0\u0E01\u0E02\u0E03\u0E04\u0E05\u0E06\u0E07\u0E08\u0E09\u0E0A\u0E0B\u0E0C\u0E0D\u0E0E\u0E0F\u0E10\u0E11\u0E12\u0E13\u0E14\u0E15\u0E16\u0E17\u0E18\u0E19\u0E1A\u0E1B\u0E1C\u0E1D\u0E1E\u0E1F\u0E20\u0E21\u0E22\u0E23\u0E24\u0E25\u0E26\u0E27\u0E28\u0E29\u0E2A\u0E2B\u0E2C\u0E2D\u0E2E\u0E2F\u0E30\u0E31\u0E32\u0E33\u0E34\u0E35\u0E36\u0E37\u0E38\u0E39\u0E3A\uFEFF\u200B\u2013\u2014\u0E3F\u0E40\u0E41\u0E42\u0E43\u0E44\u0E45\u0E46\u0E47\u0E48\u0E49\u0E4A\u0E4B\u0E4C\u0E4D\u2122\u0E4F\u0E50\u0E51\u0E52\u0E53\u0E54\u0E55\u0E56\u0E57\u0E58\u0E59\xAE\xA9\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "macturkish": {
        "type": "_sbcs",
        "chars": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u2126\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u011E\u011F\u0130\u0131\u015E\u015F\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uFFFD\xD2\xDA\xDB\xD9\uFFFD\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      },
      "macukraine": {
        "type": "_sbcs",
        "chars": "\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u2020\xB0\u0490\xA3\xA7\u2022\xB6\u0406\xAE\xA9\u2122\u0402\u0452\u2260\u0403\u0453\u221E\xB1\u2264\u2265\u0456\xB5\u0491\u0408\u0404\u0454\u0407\u0457\u0409\u0459\u040A\u045A\u0458\u0405\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\u040B\u045B\u040C\u045C\u0455\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u201E\u040E\u045E\u040F\u045F\u2116\u0401\u0451\u044F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\xA4"
      },
      "koi8r": {
        "type": "_sbcs",
        "chars": "\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2580\u2584\u2588\u258C\u2590\u2591\u2592\u2593\u2320\u25A0\u2219\u221A\u2248\u2264\u2265\xA0\u2321\xB0\xB2\xB7\xF7\u2550\u2551\u2552\u0451\u2553\u2554\u2555\u2556\u2557\u2558\u2559\u255A\u255B\u255C\u255D\u255E\u255F\u2560\u2561\u0401\u2562\u2563\u2564\u2565\u2566\u2567\u2568\u2569\u256A\u256B\u256C\xA9\u044E\u0430\u0431\u0446\u0434\u0435\u0444\u0433\u0445\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u044F\u0440\u0441\u0442\u0443\u0436\u0432\u044C\u044B\u0437\u0448\u044D\u0449\u0447\u044A\u042E\u0410\u0411\u0426\u0414\u0415\u0424\u0413\u0425\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u042F\u0420\u0421\u0422\u0423\u0416\u0412\u042C\u042B\u0417\u0428\u042D\u0429\u0427\u042A"
      },
      "koi8u": {
        "type": "_sbcs",
        "chars": "\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2580\u2584\u2588\u258C\u2590\u2591\u2592\u2593\u2320\u25A0\u2219\u221A\u2248\u2264\u2265\xA0\u2321\xB0\xB2\xB7\xF7\u2550\u2551\u2552\u0451\u0454\u2554\u0456\u0457\u2557\u2558\u2559\u255A\u255B\u0491\u255D\u255E\u255F\u2560\u2561\u0401\u0404\u2563\u0406\u0407\u2566\u2567\u2568\u2569\u256A\u0490\u256C\xA9\u044E\u0430\u0431\u0446\u0434\u0435\u0444\u0433\u0445\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u044F\u0440\u0441\u0442\u0443\u0436\u0432\u044C\u044B\u0437\u0448\u044D\u0449\u0447\u044A\u042E\u0410\u0411\u0426\u0414\u0415\u0424\u0413\u0425\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u042F\u0420\u0421\u0422\u0423\u0416\u0412\u042C\u042B\u0417\u0428\u042D\u0429\u0427\u042A"
      },
      "koi8ru": {
        "type": "_sbcs",
        "chars": "\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2580\u2584\u2588\u258C\u2590\u2591\u2592\u2593\u2320\u25A0\u2219\u221A\u2248\u2264\u2265\xA0\u2321\xB0\xB2\xB7\xF7\u2550\u2551\u2552\u0451\u0454\u2554\u0456\u0457\u2557\u2558\u2559\u255A\u255B\u0491\u045E\u255E\u255F\u2560\u2561\u0401\u0404\u2563\u0406\u0407\u2566\u2567\u2568\u2569\u256A\u0490\u040E\xA9\u044E\u0430\u0431\u0446\u0434\u0435\u0444\u0433\u0445\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u044F\u0440\u0441\u0442\u0443\u0436\u0432\u044C\u044B\u0437\u0448\u044D\u0449\u0447\u044A\u042E\u0410\u0411\u0426\u0414\u0415\u0424\u0413\u0425\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u042F\u0420\u0421\u0422\u0423\u0416\u0412\u042C\u042B\u0417\u0428\u042D\u0429\u0427\u042A"
      },
      "koi8t": {
        "type": "_sbcs",
        "chars": "\u049B\u0493\u201A\u0492\u201E\u2026\u2020\u2021\uFFFD\u2030\u04B3\u2039\u04B2\u04B7\u04B6\uFFFD\u049A\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\uFFFD\u203A\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u04EF\u04EE\u0451\xA4\u04E3\xA6\xA7\uFFFD\uFFFD\uFFFD\xAB\xAC\xAD\xAE\uFFFD\xB0\xB1\xB2\u0401\uFFFD\u04E2\xB6\xB7\uFFFD\u2116\uFFFD\xBB\uFFFD\uFFFD\uFFFD\xA9\u044E\u0430\u0431\u0446\u0434\u0435\u0444\u0433\u0445\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u044F\u0440\u0441\u0442\u0443\u0436\u0432\u044C\u044B\u0437\u0448\u044D\u0449\u0447\u044A\u042E\u0410\u0411\u0426\u0414\u0415\u0424\u0413\u0425\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u042F\u0420\u0421\u0422\u0423\u0416\u0412\u042C\u042B\u0417\u0428\u042D\u0429\u0427\u042A"
      },
      "armscii8": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\uFFFD\u0587\u0589)(\xBB\xAB\u2014.\u055D,-\u058A\u2026\u055C\u055B\u055E\u0531\u0561\u0532\u0562\u0533\u0563\u0534\u0564\u0535\u0565\u0536\u0566\u0537\u0567\u0538\u0568\u0539\u0569\u053A\u056A\u053B\u056B\u053C\u056C\u053D\u056D\u053E\u056E\u053F\u056F\u0540\u0570\u0541\u0571\u0542\u0572\u0543\u0573\u0544\u0574\u0545\u0575\u0546\u0576\u0547\u0577\u0548\u0578\u0549\u0579\u054A\u057A\u054B\u057B\u054C\u057C\u054D\u057D\u054E\u057E\u054F\u057F\u0550\u0580\u0551\u0581\u0552\u0582\u0553\u0583\u0554\u0584\u0555\u0585\u0556\u0586\u055A\uFFFD"
      },
      "rk1048": {
        "type": "_sbcs",
        "chars": "\u0402\u0403\u201A\u0453\u201E\u2026\u2020\u2021\u20AC\u2030\u0409\u2039\u040A\u049A\u04BA\u040F\u0452\u2018\u2019\u201C\u201D\u2022\u2013\u2014\uFFFD\u2122\u0459\u203A\u045A\u049B\u04BB\u045F\xA0\u04B0\u04B1\u04D8\xA4\u04E8\xA6\xA7\u0401\xA9\u0492\xAB\xAC\xAD\xAE\u04AE\xB0\xB1\u0406\u0456\u04E9\xB5\xB6\xB7\u0451\u2116\u0493\xBB\u04D9\u04A2\u04A3\u04AF\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F"
      },
      "tcvn": {
        "type": "_sbcs",
        "chars": "\0\xDA\u1EE4\u1EEA\u1EEC\u1EEE\x07\b	\n\v\f\r\u1EE8\u1EF0\u1EF2\u1EF6\u1EF8\xDD\u1EF4\x1B !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F\xC0\u1EA2\xC3\xC1\u1EA0\u1EB6\u1EAC\xC8\u1EBA\u1EBC\xC9\u1EB8\u1EC6\xCC\u1EC8\u0128\xCD\u1ECA\xD2\u1ECE\xD5\xD3\u1ECC\u1ED8\u1EDC\u1EDE\u1EE0\u1EDA\u1EE2\xD9\u1EE6\u0168\xA0\u0102\xC2\xCA\xD4\u01A0\u01AF\u0110\u0103\xE2\xEA\xF4\u01A1\u01B0\u0111\u1EB0\u0300\u0309\u0303\u0301\u0323\xE0\u1EA3\xE3\xE1\u1EA1\u1EB2\u1EB1\u1EB3\u1EB5\u1EAF\u1EB4\u1EAE\u1EA6\u1EA8\u1EAA\u1EA4\u1EC0\u1EB7\u1EA7\u1EA9\u1EAB\u1EA5\u1EAD\xE8\u1EC2\u1EBB\u1EBD\xE9\u1EB9\u1EC1\u1EC3\u1EC5\u1EBF\u1EC7\xEC\u1EC9\u1EC4\u1EBE\u1ED2\u0129\xED\u1ECB\xF2\u1ED4\u1ECF\xF5\xF3\u1ECD\u1ED3\u1ED5\u1ED7\u1ED1\u1ED9\u1EDD\u1EDF\u1EE1\u1EDB\u1EE3\xF9\u1ED6\u1EE7\u0169\xFA\u1EE5\u1EEB\u1EED\u1EEF\u1EE9\u1EF1\u1EF3\u1EF7\u1EF9\xFD\u1EF5\u1ED0"
      },
      "georgianacademy": {
        "type": "_sbcs",
        "chars": "\x80\x81\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\x8D\x8E\x8F\x90\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\x9D\x9E\u0178\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\u10D0\u10D1\u10D2\u10D3\u10D4\u10D5\u10D6\u10D7\u10D8\u10D9\u10DA\u10DB\u10DC\u10DD\u10DE\u10DF\u10E0\u10E1\u10E2\u10E3\u10E4\u10E5\u10E6\u10E7\u10E8\u10E9\u10EA\u10EB\u10EC\u10ED\u10EE\u10EF\u10F0\u10F1\u10F2\u10F3\u10F4\u10F5\u10F6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF"
      },
      "georgianps": {
        "type": "_sbcs",
        "chars": "\x80\x81\u201A\u0192\u201E\u2026\u2020\u2021\u02C6\u2030\u0160\u2039\u0152\x8D\x8E\x8F\x90\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u02DC\u2122\u0161\u203A\u0153\x9D\x9E\u0178\xA0\xA1\xA2\xA3\xA4\xA5\xA6\xA7\xA8\xA9\xAA\xAB\xAC\xAD\xAE\xAF\xB0\xB1\xB2\xB3\xB4\xB5\xB6\xB7\xB8\xB9\xBA\xBB\xBC\xBD\xBE\xBF\u10D0\u10D1\u10D2\u10D3\u10D4\u10D5\u10D6\u10F1\u10D7\u10D8\u10D9\u10DA\u10DB\u10DC\u10F2\u10DD\u10DE\u10DF\u10E0\u10E1\u10E2\u10F3\u10E3\u10E4\u10E5\u10E6\u10E7\u10E8\u10E9\u10EA\u10EB\u10EC\u10ED\u10EE\u10F4\u10EF\u10F0\u10F5\xE6\xE7\xE8\xE9\xEA\xEB\xEC\xED\xEE\xEF\xF0\xF1\xF2\xF3\xF4\xF5\xF6\xF7\xF8\xF9\xFA\xFB\xFC\xFD\xFE\xFF"
      },
      "pt154": {
        "type": "_sbcs",
        "chars": "\u0496\u0492\u04EE\u0493\u201E\u2026\u04B6\u04AE\u04B2\u04AF\u04A0\u04E2\u04A2\u049A\u04BA\u04B8\u0497\u2018\u2019\u201C\u201D\u2022\u2013\u2014\u04B3\u04B7\u04A1\u04E3\u04A3\u049B\u04BB\u04B9\xA0\u040E\u045E\u0408\u04E8\u0498\u04B0\xA7\u0401\xA9\u04D8\xAB\xAC\u04EF\xAE\u049C\xB0\u04B1\u0406\u0456\u0499\u04E9\xB6\xB7\u0451\u2116\u04D9\xBB\u0458\u04AA\u04AB\u049D\u0410\u0411\u0412\u0413\u0414\u0415\u0416\u0417\u0418\u0419\u041A\u041B\u041C\u041D\u041E\u041F\u0420\u0421\u0422\u0423\u0424\u0425\u0426\u0427\u0428\u0429\u042A\u042B\u042C\u042D\u042E\u042F\u0430\u0431\u0432\u0433\u0434\u0435\u0436\u0437\u0438\u0439\u043A\u043B\u043C\u043D\u043E\u043F\u0440\u0441\u0442\u0443\u0444\u0445\u0446\u0447\u0448\u0449\u044A\u044B\u044C\u044D\u044E\u044F"
      },
      "viscii": {
        "type": "_sbcs",
        "chars": "\0\u1EB2\u1EB4\u1EAA\x07\b	\n\v\f\r\u1EF6\u1EF8\x1B\u1EF4 !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~\x7F\u1EA0\u1EAE\u1EB0\u1EB6\u1EA4\u1EA6\u1EA8\u1EAC\u1EBC\u1EB8\u1EBE\u1EC0\u1EC2\u1EC4\u1EC6\u1ED0\u1ED2\u1ED4\u1ED6\u1ED8\u1EE2\u1EDA\u1EDC\u1EDE\u1ECA\u1ECE\u1ECC\u1EC8\u1EE6\u0168\u1EE4\u1EF2\xD5\u1EAF\u1EB1\u1EB7\u1EA5\u1EA7\u1EA9\u1EAD\u1EBD\u1EB9\u1EBF\u1EC1\u1EC3\u1EC5\u1EC7\u1ED1\u1ED3\u1ED5\u1ED7\u1EE0\u01A0\u1ED9\u1EDD\u1EDF\u1ECB\u1EF0\u1EE8\u1EEA\u1EEC\u01A1\u1EDB\u01AF\xC0\xC1\xC2\xC3\u1EA2\u0102\u1EB3\u1EB5\xC8\xC9\xCA\u1EBA\xCC\xCD\u0128\u1EF3\u0110\u1EE9\xD2\xD3\xD4\u1EA1\u1EF7\u1EEB\u1EED\xD9\xDA\u1EF9\u1EF5\xDD\u1EE1\u01B0\xE0\xE1\xE2\xE3\u1EA3\u0103\u1EEF\u1EAB\xE8\xE9\xEA\u1EBB\xEC\xED\u0129\u1EC9\u0111\u1EF1\xF2\xF3\xF4\xF5\u1ECF\u1ECD\u1EE5\xF9\xFA\u0169\u1EE7\xFD\u1EE3\u1EEE"
      },
      "iso646cn": {
        "type": "_sbcs",
        "chars": "\0\x07\b	\n\v\f\r\x1B !\"#\xA5%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}\u203E\x7F\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "iso646jp": {
        "type": "_sbcs",
        "chars": "\0\x07\b	\n\v\f\r\x1B !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\xA5]^_`abcdefghijklmnopqrstuvwxyz{|}\u203E\x7F\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "hproman8": {
        "type": "_sbcs",
        "chars": "\x80\x81\x82\x83\x84\x85\x86\x87\x88\x89\x8A\x8B\x8C\x8D\x8E\x8F\x90\x91\x92\x93\x94\x95\x96\x97\x98\x99\x9A\x9B\x9C\x9D\x9E\x9F\xA0\xC0\xC2\xC8\xCA\xCB\xCE\xCF\xB4\u02CB\u02C6\xA8\u02DC\xD9\xDB\u20A4\xAF\xDD\xFD\xB0\xC7\xE7\xD1\xF1\xA1\xBF\xA4\xA3\xA5\xA7\u0192\xA2\xE2\xEA\xF4\xFB\xE1\xE9\xF3\xFA\xE0\xE8\xF2\xF9\xE4\xEB\xF6\xFC\xC5\xEE\xD8\xC6\xE5\xED\xF8\xE6\xC4\xEC\xD6\xDC\xC9\xEF\xDF\xD4\xC1\xC3\xE3\xD0\xF0\xCD\xCC\xD3\xD2\xD5\xF5\u0160\u0161\xDA\u0178\xFF\xDE\xFE\xB7\xB5\xB6\xBE\u2014\xBC\xBD\xAA\xBA\xAB\u25A0\xBB\xB1\uFFFD"
      },
      "macintosh": {
        "type": "_sbcs",
        "chars": "\xC4\xC5\xC7\xC9\xD1\xD6\xDC\xE1\xE0\xE2\xE4\xE3\xE5\xE7\xE9\xE8\xEA\xEB\xED\xEC\xEE\xEF\xF1\xF3\xF2\xF4\xF6\xF5\xFA\xF9\xFB\xFC\u2020\xB0\xA2\xA3\xA7\u2022\xB6\xDF\xAE\xA9\u2122\xB4\xA8\u2260\xC6\xD8\u221E\xB1\u2264\u2265\xA5\xB5\u2202\u2211\u220F\u03C0\u222B\xAA\xBA\u2126\xE6\xF8\xBF\xA1\xAC\u221A\u0192\u2248\u2206\xAB\xBB\u2026\xA0\xC0\xC3\xD5\u0152\u0153\u2013\u2014\u201C\u201D\u2018\u2019\xF7\u25CA\xFF\u0178\u2044\xA4\u2039\u203A\uFB01\uFB02\u2021\xB7\u201A\u201E\u2030\xC2\xCA\xC1\xCB\xC8\xCD\xCE\xCF\xCC\xD3\xD4\uFFFD\xD2\xDA\xDB\xD9\u0131\u02C6\u02DC\xAF\u02D8\u02D9\u02DA\xB8\u02DD\u02DB\u02C7"
      },
      "ascii": {
        "type": "_sbcs",
        "chars": "\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD"
      },
      "tis620": {
        "type": "_sbcs",
        "chars": "\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\uFFFD\u0E01\u0E02\u0E03\u0E04\u0E05\u0E06\u0E07\u0E08\u0E09\u0E0A\u0E0B\u0E0C\u0E0D\u0E0E\u0E0F\u0E10\u0E11\u0E12\u0E13\u0E14\u0E15\u0E16\u0E17\u0E18\u0E19\u0E1A\u0E1B\u0E1C\u0E1D\u0E1E\u0E1F\u0E20\u0E21\u0E22\u0E23\u0E24\u0E25\u0E26\u0E27\u0E28\u0E29\u0E2A\u0E2B\u0E2C\u0E2D\u0E2E\u0E2F\u0E30\u0E31\u0E32\u0E33\u0E34\u0E35\u0E36\u0E37\u0E38\u0E39\u0E3A\uFFFD\uFFFD\uFFFD\uFFFD\u0E3F\u0E40\u0E41\u0E42\u0E43\u0E44\u0E45\u0E46\u0E47\u0E48\u0E49\u0E4A\u0E4B\u0E4C\u0E4D\u0E4E\u0E4F\u0E50\u0E51\u0E52\u0E53\u0E54\u0E55\u0E56\u0E57\u0E58\u0E59\u0E5A\u0E5B\uFFFD\uFFFD\uFFFD\uFFFD"
      }
    };
  }
});

// node_modules/iconv-lite/encodings/dbcs-codec.js
var require_dbcs_codec = __commonJS({
  "node_modules/iconv-lite/encodings/dbcs-codec.js"(exports) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    exports._dbcs = DBCSCodec;
    var UNASSIGNED = -1;
    var GB18030_CODE = -2;
    var SEQ_START = -10;
    var NODE_START = -1e3;
    var UNASSIGNED_NODE = new Array(256);
    var DEF_CHAR = -1;
    for (i = 0; i < 256; i++)
      UNASSIGNED_NODE[i] = UNASSIGNED;
    var i;
    function DBCSCodec(codecOptions, iconv) {
      this.encodingName = codecOptions.encodingName;
      if (!codecOptions)
        throw new Error("DBCS codec is called without the data.");
      if (!codecOptions.table)
        throw new Error("Encoding '" + this.encodingName + "' has no data.");
      var mappingTable = codecOptions.table();
      this.decodeTables = [];
      this.decodeTables[0] = UNASSIGNED_NODE.slice(0);
      this.decodeTableSeq = [];
      for (var i2 = 0; i2 < mappingTable.length; i2++)
        this._addDecodeChunk(mappingTable[i2]);
      if (typeof codecOptions.gb18030 === "function") {
        this.gb18030 = codecOptions.gb18030();
        var commonThirdByteNodeIdx = this.decodeTables.length;
        this.decodeTables.push(UNASSIGNED_NODE.slice(0));
        var commonFourthByteNodeIdx = this.decodeTables.length;
        this.decodeTables.push(UNASSIGNED_NODE.slice(0));
        var firstByteNode = this.decodeTables[0];
        for (var i2 = 129; i2 <= 254; i2++) {
          var secondByteNode = this.decodeTables[NODE_START - firstByteNode[i2]];
          for (var j = 48; j <= 57; j++) {
            if (secondByteNode[j] === UNASSIGNED) {
              secondByteNode[j] = NODE_START - commonThirdByteNodeIdx;
            } else if (secondByteNode[j] > NODE_START) {
              throw new Error("gb18030 decode tables conflict at byte 2");
            }
            var thirdByteNode = this.decodeTables[NODE_START - secondByteNode[j]];
            for (var k = 129; k <= 254; k++) {
              if (thirdByteNode[k] === UNASSIGNED) {
                thirdByteNode[k] = NODE_START - commonFourthByteNodeIdx;
              } else if (thirdByteNode[k] === NODE_START - commonFourthByteNodeIdx) {
                continue;
              } else if (thirdByteNode[k] > NODE_START) {
                throw new Error("gb18030 decode tables conflict at byte 3");
              }
              var fourthByteNode = this.decodeTables[NODE_START - thirdByteNode[k]];
              for (var l = 48; l <= 57; l++) {
                if (fourthByteNode[l] === UNASSIGNED)
                  fourthByteNode[l] = GB18030_CODE;
              }
            }
          }
        }
      }
      this.defaultCharUnicode = iconv.defaultCharUnicode;
      this.encodeTable = [];
      this.encodeTableSeq = [];
      var skipEncodeChars = {};
      if (codecOptions.encodeSkipVals)
        for (var i2 = 0; i2 < codecOptions.encodeSkipVals.length; i2++) {
          var val = codecOptions.encodeSkipVals[i2];
          if (typeof val === "number")
            skipEncodeChars[val] = true;
          else
            for (var j = val.from; j <= val.to; j++)
              skipEncodeChars[j] = true;
        }
      this._fillEncodeTable(0, 0, skipEncodeChars);
      if (codecOptions.encodeAdd) {
        for (var uChar in codecOptions.encodeAdd)
          if (Object.prototype.hasOwnProperty.call(codecOptions.encodeAdd, uChar))
            this._setEncodeChar(uChar.charCodeAt(0), codecOptions.encodeAdd[uChar]);
      }
      this.defCharSB = this.encodeTable[0][iconv.defaultCharSingleByte.charCodeAt(0)];
      if (this.defCharSB === UNASSIGNED)
        this.defCharSB = this.encodeTable[0]["?"];
      if (this.defCharSB === UNASSIGNED)
        this.defCharSB = "?".charCodeAt(0);
    }
    DBCSCodec.prototype.encoder = DBCSEncoder;
    DBCSCodec.prototype.decoder = DBCSDecoder;
    DBCSCodec.prototype._getDecodeTrieNode = function(addr) {
      var bytes = [];
      for (; addr > 0; addr >>>= 8)
        bytes.push(addr & 255);
      if (bytes.length == 0)
        bytes.push(0);
      var node = this.decodeTables[0];
      for (var i2 = bytes.length - 1; i2 > 0; i2--) {
        var val = node[bytes[i2]];
        if (val == UNASSIGNED) {
          node[bytes[i2]] = NODE_START - this.decodeTables.length;
          this.decodeTables.push(node = UNASSIGNED_NODE.slice(0));
        } else if (val <= NODE_START) {
          node = this.decodeTables[NODE_START - val];
        } else
          throw new Error("Overwrite byte in " + this.encodingName + ", addr: " + addr.toString(16));
      }
      return node;
    };
    DBCSCodec.prototype._addDecodeChunk = function(chunk) {
      var curAddr = parseInt(chunk[0], 16);
      var writeTable = this._getDecodeTrieNode(curAddr);
      curAddr = curAddr & 255;
      for (var k = 1; k < chunk.length; k++) {
        var part = chunk[k];
        if (typeof part === "string") {
          for (var l = 0; l < part.length; ) {
            var code = part.charCodeAt(l++);
            if (55296 <= code && code < 56320) {
              var codeTrail = part.charCodeAt(l++);
              if (56320 <= codeTrail && codeTrail < 57344)
                writeTable[curAddr++] = 65536 + (code - 55296) * 1024 + (codeTrail - 56320);
              else
                throw new Error("Incorrect surrogate pair in " + this.encodingName + " at chunk " + chunk[0]);
            } else if (4080 < code && code <= 4095) {
              var len = 4095 - code + 2;
              var seq = [];
              for (var m = 0; m < len; m++)
                seq.push(part.charCodeAt(l++));
              writeTable[curAddr++] = SEQ_START - this.decodeTableSeq.length;
              this.decodeTableSeq.push(seq);
            } else
              writeTable[curAddr++] = code;
          }
        } else if (typeof part === "number") {
          var charCode = writeTable[curAddr - 1] + 1;
          for (var l = 0; l < part; l++)
            writeTable[curAddr++] = charCode++;
        } else
          throw new Error("Incorrect type '" + typeof part + "' given in " + this.encodingName + " at chunk " + chunk[0]);
      }
      if (curAddr > 255)
        throw new Error("Incorrect chunk in " + this.encodingName + " at addr " + chunk[0] + ": too long" + curAddr);
    };
    DBCSCodec.prototype._getEncodeBucket = function(uCode) {
      var high = uCode >> 8;
      if (this.encodeTable[high] === void 0)
        this.encodeTable[high] = UNASSIGNED_NODE.slice(0);
      return this.encodeTable[high];
    };
    DBCSCodec.prototype._setEncodeChar = function(uCode, dbcsCode) {
      var bucket = this._getEncodeBucket(uCode);
      var low = uCode & 255;
      if (bucket[low] <= SEQ_START)
        this.encodeTableSeq[SEQ_START - bucket[low]][DEF_CHAR] = dbcsCode;
      else if (bucket[low] == UNASSIGNED)
        bucket[low] = dbcsCode;
    };
    DBCSCodec.prototype._setEncodeSequence = function(seq, dbcsCode) {
      var uCode = seq[0];
      var bucket = this._getEncodeBucket(uCode);
      var low = uCode & 255;
      var node;
      if (bucket[low] <= SEQ_START) {
        node = this.encodeTableSeq[SEQ_START - bucket[low]];
      } else {
        node = {};
        if (bucket[low] !== UNASSIGNED)
          node[DEF_CHAR] = bucket[low];
        bucket[low] = SEQ_START - this.encodeTableSeq.length;
        this.encodeTableSeq.push(node);
      }
      for (var j = 1; j < seq.length - 1; j++) {
        var oldVal = node[uCode];
        if (typeof oldVal === "object")
          node = oldVal;
        else {
          node = node[uCode] = {};
          if (oldVal !== void 0)
            node[DEF_CHAR] = oldVal;
        }
      }
      uCode = seq[seq.length - 1];
      node[uCode] = dbcsCode;
    };
    DBCSCodec.prototype._fillEncodeTable = function(nodeIdx, prefix, skipEncodeChars) {
      var node = this.decodeTables[nodeIdx];
      var hasValues = false;
      var subNodeEmpty = {};
      for (var i2 = 0; i2 < 256; i2++) {
        var uCode = node[i2];
        var mbCode = prefix + i2;
        if (skipEncodeChars[mbCode])
          continue;
        if (uCode >= 0) {
          this._setEncodeChar(uCode, mbCode);
          hasValues = true;
        } else if (uCode <= NODE_START) {
          var subNodeIdx = NODE_START - uCode;
          if (!subNodeEmpty[subNodeIdx]) {
            var newPrefix = mbCode << 8 >>> 0;
            if (this._fillEncodeTable(subNodeIdx, newPrefix, skipEncodeChars))
              hasValues = true;
            else
              subNodeEmpty[subNodeIdx] = true;
          }
        } else if (uCode <= SEQ_START) {
          this._setEncodeSequence(this.decodeTableSeq[SEQ_START - uCode], mbCode);
          hasValues = true;
        }
      }
      return hasValues;
    };
    function DBCSEncoder(options, codec) {
      this.leadSurrogate = -1;
      this.seqObj = void 0;
      this.encodeTable = codec.encodeTable;
      this.encodeTableSeq = codec.encodeTableSeq;
      this.defaultCharSingleByte = codec.defCharSB;
      this.gb18030 = codec.gb18030;
    }
    DBCSEncoder.prototype.write = function(str) {
      var newBuf = Buffer3.alloc(str.length * (this.gb18030 ? 4 : 3)), leadSurrogate = this.leadSurrogate, seqObj = this.seqObj, nextChar = -1, i2 = 0, j = 0;
      while (true) {
        if (nextChar === -1) {
          if (i2 == str.length)
            break;
          var uCode = str.charCodeAt(i2++);
        } else {
          var uCode = nextChar;
          nextChar = -1;
        }
        if (55296 <= uCode && uCode < 57344) {
          if (uCode < 56320) {
            if (leadSurrogate === -1) {
              leadSurrogate = uCode;
              continue;
            } else {
              leadSurrogate = uCode;
              uCode = UNASSIGNED;
            }
          } else {
            if (leadSurrogate !== -1) {
              uCode = 65536 + (leadSurrogate - 55296) * 1024 + (uCode - 56320);
              leadSurrogate = -1;
            } else {
              uCode = UNASSIGNED;
            }
          }
        } else if (leadSurrogate !== -1) {
          nextChar = uCode;
          uCode = UNASSIGNED;
          leadSurrogate = -1;
        }
        var dbcsCode = UNASSIGNED;
        if (seqObj !== void 0 && uCode != UNASSIGNED) {
          var resCode = seqObj[uCode];
          if (typeof resCode === "object") {
            seqObj = resCode;
            continue;
          } else if (typeof resCode == "number") {
            dbcsCode = resCode;
          } else if (resCode == void 0) {
            resCode = seqObj[DEF_CHAR];
            if (resCode !== void 0) {
              dbcsCode = resCode;
              nextChar = uCode;
            } else {
            }
          }
          seqObj = void 0;
        } else if (uCode >= 0) {
          var subtable = this.encodeTable[uCode >> 8];
          if (subtable !== void 0)
            dbcsCode = subtable[uCode & 255];
          if (dbcsCode <= SEQ_START) {
            seqObj = this.encodeTableSeq[SEQ_START - dbcsCode];
            continue;
          }
          if (dbcsCode == UNASSIGNED && this.gb18030) {
            var idx = findIdx(this.gb18030.uChars, uCode);
            if (idx != -1) {
              var dbcsCode = this.gb18030.gbChars[idx] + (uCode - this.gb18030.uChars[idx]);
              newBuf[j++] = 129 + Math.floor(dbcsCode / 12600);
              dbcsCode = dbcsCode % 12600;
              newBuf[j++] = 48 + Math.floor(dbcsCode / 1260);
              dbcsCode = dbcsCode % 1260;
              newBuf[j++] = 129 + Math.floor(dbcsCode / 10);
              dbcsCode = dbcsCode % 10;
              newBuf[j++] = 48 + dbcsCode;
              continue;
            }
          }
        }
        if (dbcsCode === UNASSIGNED)
          dbcsCode = this.defaultCharSingleByte;
        if (dbcsCode < 256) {
          newBuf[j++] = dbcsCode;
        } else if (dbcsCode < 65536) {
          newBuf[j++] = dbcsCode >> 8;
          newBuf[j++] = dbcsCode & 255;
        } else if (dbcsCode < 16777216) {
          newBuf[j++] = dbcsCode >> 16;
          newBuf[j++] = dbcsCode >> 8 & 255;
          newBuf[j++] = dbcsCode & 255;
        } else {
          newBuf[j++] = dbcsCode >>> 24;
          newBuf[j++] = dbcsCode >>> 16 & 255;
          newBuf[j++] = dbcsCode >>> 8 & 255;
          newBuf[j++] = dbcsCode & 255;
        }
      }
      this.seqObj = seqObj;
      this.leadSurrogate = leadSurrogate;
      return newBuf.slice(0, j);
    };
    DBCSEncoder.prototype.end = function() {
      if (this.leadSurrogate === -1 && this.seqObj === void 0)
        return;
      var newBuf = Buffer3.alloc(10), j = 0;
      if (this.seqObj) {
        var dbcsCode = this.seqObj[DEF_CHAR];
        if (dbcsCode !== void 0) {
          if (dbcsCode < 256) {
            newBuf[j++] = dbcsCode;
          } else {
            newBuf[j++] = dbcsCode >> 8;
            newBuf[j++] = dbcsCode & 255;
          }
        } else {
        }
        this.seqObj = void 0;
      }
      if (this.leadSurrogate !== -1) {
        newBuf[j++] = this.defaultCharSingleByte;
        this.leadSurrogate = -1;
      }
      return newBuf.slice(0, j);
    };
    DBCSEncoder.prototype.findIdx = findIdx;
    function DBCSDecoder(options, codec) {
      this.nodeIdx = 0;
      this.prevBytes = [];
      this.decodeTables = codec.decodeTables;
      this.decodeTableSeq = codec.decodeTableSeq;
      this.defaultCharUnicode = codec.defaultCharUnicode;
      this.gb18030 = codec.gb18030;
    }
    DBCSDecoder.prototype.write = function(buf) {
      var newBuf = Buffer3.alloc(buf.length * 2), nodeIdx = this.nodeIdx, prevBytes = this.prevBytes, prevOffset = this.prevBytes.length, seqStart = -this.prevBytes.length, uCode;
      for (var i2 = 0, j = 0; i2 < buf.length; i2++) {
        var curByte = i2 >= 0 ? buf[i2] : prevBytes[i2 + prevOffset];
        var uCode = this.decodeTables[nodeIdx][curByte];
        if (uCode >= 0) {
        } else if (uCode === UNASSIGNED) {
          uCode = this.defaultCharUnicode.charCodeAt(0);
          i2 = seqStart;
        } else if (uCode === GB18030_CODE) {
          if (i2 >= 3) {
            var ptr = (buf[i2 - 3] - 129) * 12600 + (buf[i2 - 2] - 48) * 1260 + (buf[i2 - 1] - 129) * 10 + (curByte - 48);
          } else {
            var ptr = (prevBytes[i2 - 3 + prevOffset] - 129) * 12600 + ((i2 - 2 >= 0 ? buf[i2 - 2] : prevBytes[i2 - 2 + prevOffset]) - 48) * 1260 + ((i2 - 1 >= 0 ? buf[i2 - 1] : prevBytes[i2 - 1 + prevOffset]) - 129) * 10 + (curByte - 48);
          }
          var idx = findIdx(this.gb18030.gbChars, ptr);
          uCode = this.gb18030.uChars[idx] + ptr - this.gb18030.gbChars[idx];
        } else if (uCode <= NODE_START) {
          nodeIdx = NODE_START - uCode;
          continue;
        } else if (uCode <= SEQ_START) {
          var seq = this.decodeTableSeq[SEQ_START - uCode];
          for (var k = 0; k < seq.length - 1; k++) {
            uCode = seq[k];
            newBuf[j++] = uCode & 255;
            newBuf[j++] = uCode >> 8;
          }
          uCode = seq[seq.length - 1];
        } else
          throw new Error("iconv-lite internal error: invalid decoding table value " + uCode + " at " + nodeIdx + "/" + curByte);
        if (uCode >= 65536) {
          uCode -= 65536;
          var uCodeLead = 55296 | uCode >> 10;
          newBuf[j++] = uCodeLead & 255;
          newBuf[j++] = uCodeLead >> 8;
          uCode = 56320 | uCode & 1023;
        }
        newBuf[j++] = uCode & 255;
        newBuf[j++] = uCode >> 8;
        nodeIdx = 0;
        seqStart = i2 + 1;
      }
      this.nodeIdx = nodeIdx;
      this.prevBytes = seqStart >= 0 ? Array.prototype.slice.call(buf, seqStart) : prevBytes.slice(seqStart + prevOffset).concat(Array.prototype.slice.call(buf));
      return newBuf.slice(0, j).toString("ucs2");
    };
    DBCSDecoder.prototype.end = function() {
      var ret = "";
      while (this.prevBytes.length > 0) {
        ret += this.defaultCharUnicode;
        var bytesArr = this.prevBytes.slice(1);
        this.prevBytes = [];
        this.nodeIdx = 0;
        if (bytesArr.length > 0)
          ret += this.write(bytesArr);
      }
      this.prevBytes = [];
      this.nodeIdx = 0;
      return ret;
    };
    function findIdx(table, val) {
      if (table[0] > val)
        return -1;
      var l = 0, r = table.length;
      while (l < r - 1) {
        var mid = l + (r - l + 1 >> 1);
        if (table[mid] <= val)
          l = mid;
        else
          r = mid;
      }
      return l;
    }
  }
});

// node_modules/iconv-lite/encodings/tables/shiftjis.json
var require_shiftjis = __commonJS({
  "node_modules/iconv-lite/encodings/tables/shiftjis.json"(exports, module) {
    module.exports = [
      ["0", "\0", 128],
      ["a1", "\uFF61", 62],
      ["8140", "\u3000\u3001\u3002\uFF0C\uFF0E\u30FB\uFF1A\uFF1B\uFF1F\uFF01\u309B\u309C\xB4\uFF40\xA8\uFF3E\uFFE3\uFF3F\u30FD\u30FE\u309D\u309E\u3003\u4EDD\u3005\u3006\u3007\u30FC\u2015\u2010\uFF0F\uFF3C\uFF5E\u2225\uFF5C\u2026\u2025\u2018\u2019\u201C\u201D\uFF08\uFF09\u3014\u3015\uFF3B\uFF3D\uFF5B\uFF5D\u3008", 9, "\uFF0B\uFF0D\xB1\xD7"],
      ["8180", "\xF7\uFF1D\u2260\uFF1C\uFF1E\u2266\u2267\u221E\u2234\u2642\u2640\xB0\u2032\u2033\u2103\uFFE5\uFF04\uFFE0\uFFE1\uFF05\uFF03\uFF06\uFF0A\uFF20\xA7\u2606\u2605\u25CB\u25CF\u25CE\u25C7\u25C6\u25A1\u25A0\u25B3\u25B2\u25BD\u25BC\u203B\u3012\u2192\u2190\u2191\u2193\u3013"],
      ["81b8", "\u2208\u220B\u2286\u2287\u2282\u2283\u222A\u2229"],
      ["81c8", "\u2227\u2228\uFFE2\u21D2\u21D4\u2200\u2203"],
      ["81da", "\u2220\u22A5\u2312\u2202\u2207\u2261\u2252\u226A\u226B\u221A\u223D\u221D\u2235\u222B\u222C"],
      ["81f0", "\u212B\u2030\u266F\u266D\u266A\u2020\u2021\xB6"],
      ["81fc", "\u25EF"],
      ["824f", "\uFF10", 9],
      ["8260", "\uFF21", 25],
      ["8281", "\uFF41", 25],
      ["829f", "\u3041", 82],
      ["8340", "\u30A1", 62],
      ["8380", "\u30E0", 22],
      ["839f", "\u0391", 16, "\u03A3", 6],
      ["83bf", "\u03B1", 16, "\u03C3", 6],
      ["8440", "\u0410", 5, "\u0401\u0416", 25],
      ["8470", "\u0430", 5, "\u0451\u0436", 7],
      ["8480", "\u043E", 17],
      ["849f", "\u2500\u2502\u250C\u2510\u2518\u2514\u251C\u252C\u2524\u2534\u253C\u2501\u2503\u250F\u2513\u251B\u2517\u2523\u2533\u252B\u253B\u254B\u2520\u252F\u2528\u2537\u253F\u251D\u2530\u2525\u2538\u2542"],
      ["8740", "\u2460", 19, "\u2160", 9],
      ["875f", "\u3349\u3314\u3322\u334D\u3318\u3327\u3303\u3336\u3351\u3357\u330D\u3326\u3323\u332B\u334A\u333B\u339C\u339D\u339E\u338E\u338F\u33C4\u33A1"],
      ["877e", "\u337B"],
      ["8780", "\u301D\u301F\u2116\u33CD\u2121\u32A4", 4, "\u3231\u3232\u3239\u337E\u337D\u337C\u2252\u2261\u222B\u222E\u2211\u221A\u22A5\u2220\u221F\u22BF\u2235\u2229\u222A"],
      ["889f", "\u4E9C\u5516\u5A03\u963F\u54C0\u611B\u6328\u59F6\u9022\u8475\u831C\u7A50\u60AA\u63E1\u6E25\u65ED\u8466\u82A6\u9BF5\u6893\u5727\u65A1\u6271\u5B9B\u59D0\u867B\u98F4\u7D62\u7DBE\u9B8E\u6216\u7C9F\u88B7\u5B89\u5EB5\u6309\u6697\u6848\u95C7\u978D\u674F\u4EE5\u4F0A\u4F4D\u4F9D\u5049\u56F2\u5937\u59D4\u5A01\u5C09\u60DF\u610F\u6170\u6613\u6905\u70BA\u754F\u7570\u79FB\u7DAD\u7DEF\u80C3\u840E\u8863\u8B02\u9055\u907A\u533B\u4E95\u4EA5\u57DF\u80B2\u90C1\u78EF\u4E00\u58F1\u6EA2\u9038\u7A32\u8328\u828B\u9C2F\u5141\u5370\u54BD\u54E1\u56E0\u59FB\u5F15\u98F2\u6DEB\u80E4\u852D"],
      ["8940", "\u9662\u9670\u96A0\u97FB\u540B\u53F3\u5B87\u70CF\u7FBD\u8FC2\u96E8\u536F\u9D5C\u7ABA\u4E11\u7893\u81FC\u6E26\u5618\u5504\u6B1D\u851A\u9C3B\u59E5\u53A9\u6D66\u74DC\u958F\u5642\u4E91\u904B\u96F2\u834F\u990C\u53E1\u55B6\u5B30\u5F71\u6620\u66F3\u6804\u6C38\u6CF3\u6D29\u745B\u76C8\u7A4E\u9834\u82F1\u885B\u8A60\u92ED\u6DB2\u75AB\u76CA\u99C5\u60A6\u8B01\u8D8A\u95B2\u698E\u53AD\u5186"],
      ["8980", "\u5712\u5830\u5944\u5BB4\u5EF6\u6028\u63A9\u63F4\u6CBF\u6F14\u708E\u7114\u7159\u71D5\u733F\u7E01\u8276\u82D1\u8597\u9060\u925B\u9D1B\u5869\u65BC\u6C5A\u7525\u51F9\u592E\u5965\u5F80\u5FDC\u62BC\u65FA\u6A2A\u6B27\u6BB4\u738B\u7FC1\u8956\u9D2C\u9D0E\u9EC4\u5CA1\u6C96\u837B\u5104\u5C4B\u61B6\u81C6\u6876\u7261\u4E59\u4FFA\u5378\u6069\u6E29\u7A4F\u97F3\u4E0B\u5316\u4EEE\u4F55\u4F3D\u4FA1\u4F73\u52A0\u53EF\u5609\u590F\u5AC1\u5BB6\u5BE1\u79D1\u6687\u679C\u67B6\u6B4C\u6CB3\u706B\u73C2\u798D\u79BE\u7A3C\u7B87\u82B1\u82DB\u8304\u8377\u83EF\u83D3\u8766\u8AB2\u5629\u8CA8\u8FE6\u904E\u971E\u868A\u4FC4\u5CE8\u6211\u7259\u753B\u81E5\u82BD\u86FE\u8CC0\u96C5\u9913\u99D5\u4ECB\u4F1A\u89E3\u56DE\u584A\u58CA\u5EFB\u5FEB\u602A\u6094\u6062\u61D0\u6212\u62D0\u6539"],
      ["8a40", "\u9B41\u6666\u68B0\u6D77\u7070\u754C\u7686\u7D75\u82A5\u87F9\u958B\u968E\u8C9D\u51F1\u52BE\u5916\u54B3\u5BB3\u5D16\u6168\u6982\u6DAF\u788D\u84CB\u8857\u8A72\u93A7\u9AB8\u6D6C\u99A8\u86D9\u57A3\u67FF\u86CE\u920E\u5283\u5687\u5404\u5ED3\u62E1\u64B9\u683C\u6838\u6BBB\u7372\u78BA\u7A6B\u899A\u89D2\u8D6B\u8F03\u90ED\u95A3\u9694\u9769\u5B66\u5CB3\u697D\u984D\u984E\u639B\u7B20\u6A2B"],
      ["8a80", "\u6A7F\u68B6\u9C0D\u6F5F\u5272\u559D\u6070\u62EC\u6D3B\u6E07\u6ED1\u845B\u8910\u8F44\u4E14\u9C39\u53F6\u691B\u6A3A\u9784\u682A\u515C\u7AC3\u84B2\u91DC\u938C\u565B\u9D28\u6822\u8305\u8431\u7CA5\u5208\u82C5\u74E6\u4E7E\u4F83\u51A0\u5BD2\u520A\u52D8\u52E7\u5DFB\u559A\u582A\u59E6\u5B8C\u5B98\u5BDB\u5E72\u5E79\u60A3\u611F\u6163\u61BE\u63DB\u6562\u67D1\u6853\u68FA\u6B3E\u6B53\u6C57\u6F22\u6F97\u6F45\u74B0\u7518\u76E3\u770B\u7AFF\u7BA1\u7C21\u7DE9\u7F36\u7FF0\u809D\u8266\u839E\u89B3\u8ACC\u8CAB\u9084\u9451\u9593\u9591\u95A2\u9665\u97D3\u9928\u8218\u4E38\u542B\u5CB8\u5DCC\u73A9\u764C\u773C\u5CA9\u7FEB\u8D0B\u96C1\u9811\u9854\u9858\u4F01\u4F0E\u5371\u559C\u5668\u57FA\u5947\u5B09\u5BC4\u5C90\u5E0C\u5E7E\u5FCC\u63EE\u673A\u65D7\u65E2\u671F\u68CB\u68C4"],
      ["8b40", "\u6A5F\u5E30\u6BC5\u6C17\u6C7D\u757F\u7948\u5B63\u7A00\u7D00\u5FBD\u898F\u8A18\u8CB4\u8D77\u8ECC\u8F1D\u98E2\u9A0E\u9B3C\u4E80\u507D\u5100\u5993\u5B9C\u622F\u6280\u64EC\u6B3A\u72A0\u7591\u7947\u7FA9\u87FB\u8ABC\u8B70\u63AC\u83CA\u97A0\u5409\u5403\u55AB\u6854\u6A58\u8A70\u7827\u6775\u9ECD\u5374\u5BA2\u811A\u8650\u9006\u4E18\u4E45\u4EC7\u4F11\u53CA\u5438\u5BAE\u5F13\u6025\u6551"],
      ["8b80", "\u673D\u6C42\u6C72\u6CE3\u7078\u7403\u7A76\u7AAE\u7B08\u7D1A\u7CFE\u7D66\u65E7\u725B\u53BB\u5C45\u5DE8\u62D2\u62E0\u6319\u6E20\u865A\u8A31\u8DDD\u92F8\u6F01\u79A6\u9B5A\u4EA8\u4EAB\u4EAC\u4F9B\u4FA0\u50D1\u5147\u7AF6\u5171\u51F6\u5354\u5321\u537F\u53EB\u55AC\u5883\u5CE1\u5F37\u5F4A\u602F\u6050\u606D\u631F\u6559\u6A4B\u6CC1\u72C2\u72ED\u77EF\u80F8\u8105\u8208\u854E\u90F7\u93E1\u97FF\u9957\u9A5A\u4EF0\u51DD\u5C2D\u6681\u696D\u5C40\u66F2\u6975\u7389\u6850\u7C81\u50C5\u52E4\u5747\u5DFE\u9326\u65A4\u6B23\u6B3D\u7434\u7981\u79BD\u7B4B\u7DCA\u82B9\u83CC\u887F\u895F\u8B39\u8FD1\u91D1\u541F\u9280\u4E5D\u5036\u53E5\u533A\u72D7\u7396\u77E9\u82E6\u8EAF\u99C6\u99C8\u99D2\u5177\u611A\u865E\u55B0\u7A7A\u5076\u5BD3\u9047\u9685\u4E32\u6ADB\u91E7\u5C51\u5C48"],
      ["8c40", "\u6398\u7A9F\u6C93\u9774\u8F61\u7AAA\u718A\u9688\u7C82\u6817\u7E70\u6851\u936C\u52F2\u541B\u85AB\u8A13\u7FA4\u8ECD\u90E1\u5366\u8888\u7941\u4FC2\u50BE\u5211\u5144\u5553\u572D\u73EA\u578B\u5951\u5F62\u5F84\u6075\u6176\u6167\u61A9\u63B2\u643A\u656C\u666F\u6842\u6E13\u7566\u7A3D\u7CFB\u7D4C\u7D99\u7E4B\u7F6B\u830E\u834A\u86CD\u8A08\u8A63\u8B66\u8EFD\u981A\u9D8F\u82B8\u8FCE\u9BE8"],
      ["8c80", "\u5287\u621F\u6483\u6FC0\u9699\u6841\u5091\u6B20\u6C7A\u6F54\u7A74\u7D50\u8840\u8A23\u6708\u4EF6\u5039\u5026\u5065\u517C\u5238\u5263\u55A7\u570F\u5805\u5ACC\u5EFA\u61B2\u61F8\u62F3\u6372\u691C\u6A29\u727D\u72AC\u732E\u7814\u786F\u7D79\u770C\u80A9\u898B\u8B19\u8CE2\u8ED2\u9063\u9375\u967A\u9855\u9A13\u9E78\u5143\u539F\u53B3\u5E7B\u5F26\u6E1B\u6E90\u7384\u73FE\u7D43\u8237\u8A00\u8AFA\u9650\u4E4E\u500B\u53E4\u547C\u56FA\u59D1\u5B64\u5DF1\u5EAB\u5F27\u6238\u6545\u67AF\u6E56\u72D0\u7CCA\u88B4\u80A1\u80E1\u83F0\u864E\u8A87\u8DE8\u9237\u96C7\u9867\u9F13\u4E94\u4E92\u4F0D\u5348\u5449\u543E\u5A2F\u5F8C\u5FA1\u609F\u68A7\u6A8E\u745A\u7881\u8A9E\u8AA4\u8B77\u9190\u4E5E\u9BC9\u4EA4\u4F7C\u4FAF\u5019\u5016\u5149\u516C\u529F\u52B9\u52FE\u539A\u53E3\u5411"],
      ["8d40", "\u540E\u5589\u5751\u57A2\u597D\u5B54\u5B5D\u5B8F\u5DE5\u5DE7\u5DF7\u5E78\u5E83\u5E9A\u5EB7\u5F18\u6052\u614C\u6297\u62D8\u63A7\u653B\u6602\u6643\u66F4\u676D\u6821\u6897\u69CB\u6C5F\u6D2A\u6D69\u6E2F\u6E9D\u7532\u7687\u786C\u7A3F\u7CE0\u7D05\u7D18\u7D5E\u7DB1\u8015\u8003\u80AF\u80B1\u8154\u818F\u822A\u8352\u884C\u8861\u8B1B\u8CA2\u8CFC\u90CA\u9175\u9271\u783F\u92FC\u95A4\u964D"],
      ["8d80", "\u9805\u9999\u9AD8\u9D3B\u525B\u52AB\u53F7\u5408\u58D5\u62F7\u6FE0\u8C6A\u8F5F\u9EB9\u514B\u523B\u544A\u56FD\u7A40\u9177\u9D60\u9ED2\u7344\u6F09\u8170\u7511\u5FFD\u60DA\u9AA8\u72DB\u8FBC\u6B64\u9803\u4ECA\u56F0\u5764\u58BE\u5A5A\u6068\u61C7\u660F\u6606\u6839\u68B1\u6DF7\u75D5\u7D3A\u826E\u9B42\u4E9B\u4F50\u53C9\u5506\u5D6F\u5DE6\u5DEE\u67FB\u6C99\u7473\u7802\u8A50\u9396\u88DF\u5750\u5EA7\u632B\u50B5\u50AC\u518D\u6700\u54C9\u585E\u59BB\u5BB0\u5F69\u624D\u63A1\u683D\u6B73\u6E08\u707D\u91C7\u7280\u7815\u7826\u796D\u658E\u7D30\u83DC\u88C1\u8F09\u969B\u5264\u5728\u6750\u7F6A\u8CA1\u51B4\u5742\u962A\u583A\u698A\u80B4\u54B2\u5D0E\u57FC\u7895\u9DFA\u4F5C\u524A\u548B\u643E\u6628\u6714\u67F5\u7A84\u7B56\u7D22\u932F\u685C\u9BAD\u7B39\u5319\u518A\u5237"],
      ["8e40", "\u5BDF\u62F6\u64AE\u64E6\u672D\u6BBA\u85A9\u96D1\u7690\u9BD6\u634C\u9306\u9BAB\u76BF\u6652\u4E09\u5098\u53C2\u5C71\u60E8\u6492\u6563\u685F\u71E6\u73CA\u7523\u7B97\u7E82\u8695\u8B83\u8CDB\u9178\u9910\u65AC\u66AB\u6B8B\u4ED5\u4ED4\u4F3A\u4F7F\u523A\u53F8\u53F2\u55E3\u56DB\u58EB\u59CB\u59C9\u59FF\u5B50\u5C4D\u5E02\u5E2B\u5FD7\u601D\u6307\u652F\u5B5C\u65AF\u65BD\u65E8\u679D\u6B62"],
      ["8e80", "\u6B7B\u6C0F\u7345\u7949\u79C1\u7CF8\u7D19\u7D2B\u80A2\u8102\u81F3\u8996\u8A5E\u8A69\u8A66\u8A8C\u8AEE\u8CC7\u8CDC\u96CC\u98FC\u6B6F\u4E8B\u4F3C\u4F8D\u5150\u5B57\u5BFA\u6148\u6301\u6642\u6B21\u6ECB\u6CBB\u723E\u74BD\u75D4\u78C1\u793A\u800C\u8033\u81EA\u8494\u8F9E\u6C50\u9E7F\u5F0F\u8B58\u9D2B\u7AFA\u8EF8\u5B8D\u96EB\u4E03\u53F1\u57F7\u5931\u5AC9\u5BA4\u6089\u6E7F\u6F06\u75BE\u8CEA\u5B9F\u8500\u7BE0\u5072\u67F4\u829D\u5C61\u854A\u7E1E\u820E\u5199\u5C04\u6368\u8D66\u659C\u716E\u793E\u7D17\u8005\u8B1D\u8ECA\u906E\u86C7\u90AA\u501F\u52FA\u5C3A\u6753\u707C\u7235\u914C\u91C8\u932B\u82E5\u5BC2\u5F31\u60F9\u4E3B\u53D6\u5B88\u624B\u6731\u6B8A\u72E9\u73E0\u7A2E\u816B\u8DA3\u9152\u9996\u5112\u53D7\u546A\u5BFF\u6388\u6A39\u7DAC\u9700\u56DA\u53CE\u5468"],
      ["8f40", "\u5B97\u5C31\u5DDE\u4FEE\u6101\u62FE\u6D32\u79C0\u79CB\u7D42\u7E4D\u7FD2\u81ED\u821F\u8490\u8846\u8972\u8B90\u8E74\u8F2F\u9031\u914B\u916C\u96C6\u919C\u4EC0\u4F4F\u5145\u5341\u5F93\u620E\u67D4\u6C41\u6E0B\u7363\u7E26\u91CD\u9283\u53D4\u5919\u5BBF\u6DD1\u795D\u7E2E\u7C9B\u587E\u719F\u51FA\u8853\u8FF0\u4FCA\u5CFB\u6625\u77AC\u7AE3\u821C\u99FF\u51C6\u5FAA\u65EC\u696F\u6B89\u6DF3"],
      ["8f80", "\u6E96\u6F64\u76FE\u7D14\u5DE1\u9075\u9187\u9806\u51E6\u521D\u6240\u6691\u66D9\u6E1A\u5EB6\u7DD2\u7F72\u66F8\u85AF\u85F7\u8AF8\u52A9\u53D9\u5973\u5E8F\u5F90\u6055\u92E4\u9664\u50B7\u511F\u52DD\u5320\u5347\u53EC\u54E8\u5546\u5531\u5617\u5968\u59BE\u5A3C\u5BB5\u5C06\u5C0F\u5C11\u5C1A\u5E84\u5E8A\u5EE0\u5F70\u627F\u6284\u62DB\u638C\u6377\u6607\u660C\u662D\u6676\u677E\u68A2\u6A1F\u6A35\u6CBC\u6D88\u6E09\u6E58\u713C\u7126\u7167\u75C7\u7701\u785D\u7901\u7965\u79F0\u7AE0\u7B11\u7CA7\u7D39\u8096\u83D6\u848B\u8549\u885D\u88F3\u8A1F\u8A3C\u8A54\u8A73\u8C61\u8CDE\u91A4\u9266\u937E\u9418\u969C\u9798\u4E0A\u4E08\u4E1E\u4E57\u5197\u5270\u57CE\u5834\u58CC\u5B22\u5E38\u60C5\u64FE\u6761\u6756\u6D44\u72B6\u7573\u7A63\u84B8\u8B72\u91B8\u9320\u5631\u57F4\u98FE"],
      ["9040", "\u62ED\u690D\u6B96\u71ED\u7E54\u8077\u8272\u89E6\u98DF\u8755\u8FB1\u5C3B\u4F38\u4FE1\u4FB5\u5507\u5A20\u5BDD\u5BE9\u5FC3\u614E\u632F\u65B0\u664B\u68EE\u699B\u6D78\u6DF1\u7533\u75B9\u771F\u795E\u79E6\u7D33\u81E3\u82AF\u85AA\u89AA\u8A3A\u8EAB\u8F9B\u9032\u91DD\u9707\u4EBA\u4EC1\u5203\u5875\u58EC\u5C0B\u751A\u5C3D\u814E\u8A0A\u8FC5\u9663\u976D\u7B25\u8ACF\u9808\u9162\u56F3\u53A8"],
      ["9080", "\u9017\u5439\u5782\u5E25\u63A8\u6C34\u708A\u7761\u7C8B\u7FE0\u8870\u9042\u9154\u9310\u9318\u968F\u745E\u9AC4\u5D07\u5D69\u6570\u67A2\u8DA8\u96DB\u636E\u6749\u6919\u83C5\u9817\u96C0\u88FE\u6F84\u647A\u5BF8\u4E16\u702C\u755D\u662F\u51C4\u5236\u52E2\u59D3\u5F81\u6027\u6210\u653F\u6574\u661F\u6674\u68F2\u6816\u6B63\u6E05\u7272\u751F\u76DB\u7CBE\u8056\u58F0\u88FD\u897F\u8AA0\u8A93\u8ACB\u901D\u9192\u9752\u9759\u6589\u7A0E\u8106\u96BB\u5E2D\u60DC\u621A\u65A5\u6614\u6790\u77F3\u7A4D\u7C4D\u7E3E\u810A\u8CAC\u8D64\u8DE1\u8E5F\u78A9\u5207\u62D9\u63A5\u6442\u6298\u8A2D\u7A83\u7BC0\u8AAC\u96EA\u7D76\u820C\u8749\u4ED9\u5148\u5343\u5360\u5BA3\u5C02\u5C16\u5DDD\u6226\u6247\u64B0\u6813\u6834\u6CC9\u6D45\u6D17\u67D3\u6F5C\u714E\u717D\u65CB\u7A7F\u7BAD\u7DDA"],
      ["9140", "\u7E4A\u7FA8\u817A\u821B\u8239\u85A6\u8A6E\u8CCE\u8DF5\u9078\u9077\u92AD\u9291\u9583\u9BAE\u524D\u5584\u6F38\u7136\u5168\u7985\u7E55\u81B3\u7CCE\u564C\u5851\u5CA8\u63AA\u66FE\u66FD\u695A\u72D9\u758F\u758E\u790E\u7956\u79DF\u7C97\u7D20\u7D44\u8607\u8A34\u963B\u9061\u9F20\u50E7\u5275\u53CC\u53E2\u5009\u55AA\u58EE\u594F\u723D\u5B8B\u5C64\u531D\u60E3\u60F3\u635C\u6383\u633F\u63BB"],
      ["9180", "\u64CD\u65E9\u66F9\u5DE3\u69CD\u69FD\u6F15\u71E5\u4E89\u75E9\u76F8\u7A93\u7CDF\u7DCF\u7D9C\u8061\u8349\u8358\u846C\u84BC\u85FB\u88C5\u8D70\u9001\u906D\u9397\u971C\u9A12\u50CF\u5897\u618E\u81D3\u8535\u8D08\u9020\u4FC3\u5074\u5247\u5373\u606F\u6349\u675F\u6E2C\u8DB3\u901F\u4FD7\u5C5E\u8CCA\u65CF\u7D9A\u5352\u8896\u5176\u63C3\u5B58\u5B6B\u5C0A\u640D\u6751\u905C\u4ED6\u591A\u592A\u6C70\u8A51\u553E\u5815\u59A5\u60F0\u6253\u67C1\u8235\u6955\u9640\u99C4\u9A28\u4F53\u5806\u5BFE\u8010\u5CB1\u5E2F\u5F85\u6020\u614B\u6234\u66FF\u6CF0\u6EDE\u80CE\u817F\u82D4\u888B\u8CB8\u9000\u902E\u968A\u9EDB\u9BDB\u4EE3\u53F0\u5927\u7B2C\u918D\u984C\u9DF9\u6EDD\u7027\u5353\u5544\u5B85\u6258\u629E\u62D3\u6CA2\u6FEF\u7422\u8A17\u9438\u6FC1\u8AFE\u8338\u51E7\u86F8\u53EA"],
      ["9240", "\u53E9\u4F46\u9054\u8FB0\u596A\u8131\u5DFD\u7AEA\u8FBF\u68DA\u8C37\u72F8\u9C48\u6A3D\u8AB0\u4E39\u5358\u5606\u5766\u62C5\u63A2\u65E6\u6B4E\u6DE1\u6E5B\u70AD\u77ED\u7AEF\u7BAA\u7DBB\u803D\u80C6\u86CB\u8A95\u935B\u56E3\u58C7\u5F3E\u65AD\u6696\u6A80\u6BB5\u7537\u8AC7\u5024\u77E5\u5730\u5F1B\u6065\u667A\u6C60\u75F4\u7A1A\u7F6E\u81F4\u8718\u9045\u99B3\u7BC9\u755C\u7AF9\u7B51\u84C4"],
      ["9280", "\u9010\u79E9\u7A92\u8336\u5AE1\u7740\u4E2D\u4EF2\u5B99\u5FE0\u62BD\u663C\u67F1\u6CE8\u866B\u8877\u8A3B\u914E\u92F3\u99D0\u6A17\u7026\u732A\u82E7\u8457\u8CAF\u4E01\u5146\u51CB\u558B\u5BF5\u5E16\u5E33\u5E81\u5F14\u5F35\u5F6B\u5FB4\u61F2\u6311\u66A2\u671D\u6F6E\u7252\u753A\u773A\u8074\u8139\u8178\u8776\u8ABF\u8ADC\u8D85\u8DF3\u929A\u9577\u9802\u9CE5\u52C5\u6357\u76F4\u6715\u6C88\u73CD\u8CC3\u93AE\u9673\u6D25\u589C\u690E\u69CC\u8FFD\u939A\u75DB\u901A\u585A\u6802\u63B4\u69FB\u4F43\u6F2C\u67D8\u8FBB\u8526\u7DB4\u9354\u693F\u6F70\u576A\u58F7\u5B2C\u7D2C\u722A\u540A\u91E3\u9DB4\u4EAD\u4F4E\u505C\u5075\u5243\u8C9E\u5448\u5824\u5B9A\u5E1D\u5E95\u5EAD\u5EF7\u5F1F\u608C\u62B5\u633A\u63D0\u68AF\u6C40\u7887\u798E\u7A0B\u7DE0\u8247\u8A02\u8AE6\u8E44\u9013"],
      ["9340", "\u90B8\u912D\u91D8\u9F0E\u6CE5\u6458\u64E2\u6575\u6EF4\u7684\u7B1B\u9069\u93D1\u6EBA\u54F2\u5FB9\u64A4\u8F4D\u8FED\u9244\u5178\u586B\u5929\u5C55\u5E97\u6DFB\u7E8F\u751C\u8CBC\u8EE2\u985B\u70B9\u4F1D\u6BBF\u6FB1\u7530\u96FB\u514E\u5410\u5835\u5857\u59AC\u5C60\u5F92\u6597\u675C\u6E21\u767B\u83DF\u8CED\u9014\u90FD\u934D\u7825\u783A\u52AA\u5EA6\u571F\u5974\u6012\u5012\u515A\u51AC"],
      ["9380", "\u51CD\u5200\u5510\u5854\u5858\u5957\u5B95\u5CF6\u5D8B\u60BC\u6295\u642D\u6771\u6843\u68BC\u68DF\u76D7\u6DD8\u6E6F\u6D9B\u706F\u71C8\u5F53\u75D8\u7977\u7B49\u7B54\u7B52\u7CD6\u7D71\u5230\u8463\u8569\u85E4\u8A0E\u8B04\u8C46\u8E0F\u9003\u900F\u9419\u9676\u982D\u9A30\u95D8\u50CD\u52D5\u540C\u5802\u5C0E\u61A7\u649E\u6D1E\u77B3\u7AE5\u80F4\u8404\u9053\u9285\u5CE0\u9D07\u533F\u5F97\u5FB3\u6D9C\u7279\u7763\u79BF\u7BE4\u6BD2\u72EC\u8AAD\u6803\u6A61\u51F8\u7A81\u6934\u5C4A\u9CF6\u82EB\u5BC5\u9149\u701E\u5678\u5C6F\u60C7\u6566\u6C8C\u8C5A\u9041\u9813\u5451\u66C7\u920D\u5948\u90A3\u5185\u4E4D\u51EA\u8599\u8B0E\u7058\u637A\u934B\u6962\u99B4\u7E04\u7577\u5357\u6960\u8EDF\u96E3\u6C5D\u4E8C\u5C3C\u5F10\u8FE9\u5302\u8CD1\u8089\u8679\u5EFF\u65E5\u4E73\u5165"],
      ["9440", "\u5982\u5C3F\u97EE\u4EFB\u598A\u5FCD\u8A8D\u6FE1\u79B0\u7962\u5BE7\u8471\u732B\u71B1\u5E74\u5FF5\u637B\u649A\u71C3\u7C98\u4E43\u5EFC\u4E4B\u57DC\u56A2\u60A9\u6FC3\u7D0D\u80FD\u8133\u81BF\u8FB2\u8997\u86A4\u5DF4\u628A\u64AD\u8987\u6777\u6CE2\u6D3E\u7436\u7834\u5A46\u7F75\u82AD\u99AC\u4FF3\u5EC3\u62DD\u6392\u6557\u676F\u76C3\u724C\u80CC\u80BA\u8F29\u914D\u500D\u57F9\u5A92\u6885"],
      ["9480", "\u6973\u7164\u72FD\u8CB7\u58F2\u8CE0\u966A\u9019\u877F\u79E4\u77E7\u8429\u4F2F\u5265\u535A\u62CD\u67CF\u6CCA\u767D\u7B94\u7C95\u8236\u8584\u8FEB\u66DD\u6F20\u7206\u7E1B\u83AB\u99C1\u9EA6\u51FD\u7BB1\u7872\u7BB8\u8087\u7B48\u6AE8\u5E61\u808C\u7551\u7560\u516B\u9262\u6E8C\u767A\u9197\u9AEA\u4F10\u7F70\u629C\u7B4F\u95A5\u9CE9\u567A\u5859\u86E4\u96BC\u4F34\u5224\u534A\u53CD\u53DB\u5E06\u642C\u6591\u677F\u6C3E\u6C4E\u7248\u72AF\u73ED\u7554\u7E41\u822C\u85E9\u8CA9\u7BC4\u91C6\u7169\u9812\u98EF\u633D\u6669\u756A\u76E4\u78D0\u8543\u86EE\u532A\u5351\u5426\u5983\u5E87\u5F7C\u60B2\u6249\u6279\u62AB\u6590\u6BD4\u6CCC\u75B2\u76AE\u7891\u79D8\u7DCB\u7F77\u80A5\u88AB\u8AB9\u8CBB\u907F\u975E\u98DB\u6A0B\u7C38\u5099\u5C3E\u5FAE\u6787\u6BD8\u7435\u7709\u7F8E"],
      ["9540", "\u9F3B\u67CA\u7A17\u5339\u758B\u9AED\u5F66\u819D\u83F1\u8098\u5F3C\u5FC5\u7562\u7B46\u903C\u6867\u59EB\u5A9B\u7D10\u767E\u8B2C\u4FF5\u5F6A\u6A19\u6C37\u6F02\u74E2\u7968\u8868\u8A55\u8C79\u5EDF\u63CF\u75C5\u79D2\u82D7\u9328\u92F2\u849C\u86ED\u9C2D\u54C1\u5F6C\u658C\u6D5C\u7015\u8CA7\u8CD3\u983B\u654F\u74F6\u4E0D\u4ED8\u57E0\u592B\u5A66\u5BCC\u51A8\u5E03\u5E9C\u6016\u6276\u6577"],
      ["9580", "\u65A7\u666E\u6D6E\u7236\u7B26\u8150\u819A\u8299\u8B5C\u8CA0\u8CE6\u8D74\u961C\u9644\u4FAE\u64AB\u6B66\u821E\u8461\u856A\u90E8\u5C01\u6953\u98A8\u847A\u8557\u4F0F\u526F\u5FA9\u5E45\u670D\u798F\u8179\u8907\u8986\u6DF5\u5F17\u6255\u6CB8\u4ECF\u7269\u9B92\u5206\u543B\u5674\u58B3\u61A4\u626E\u711A\u596E\u7C89\u7CDE\u7D1B\u96F0\u6587\u805E\u4E19\u4F75\u5175\u5840\u5E63\u5E73\u5F0A\u67C4\u4E26\u853D\u9589\u965B\u7C73\u9801\u50FB\u58C1\u7656\u78A7\u5225\u77A5\u8511\u7B86\u504F\u5909\u7247\u7BC7\u7DE8\u8FBA\u8FD4\u904D\u4FBF\u52C9\u5A29\u5F01\u97AD\u4FDD\u8217\u92EA\u5703\u6355\u6B69\u752B\u88DC\u8F14\u7A42\u52DF\u5893\u6155\u620A\u66AE\u6BCD\u7C3F\u83E9\u5023\u4FF8\u5305\u5446\u5831\u5949\u5B9D\u5CF0\u5CEF\u5D29\u5E96\u62B1\u6367\u653E\u65B9\u670B"],
      ["9640", "\u6CD5\u6CE1\u70F9\u7832\u7E2B\u80DE\u82B3\u840C\u84EC\u8702\u8912\u8A2A\u8C4A\u90A6\u92D2\u98FD\u9CF3\u9D6C\u4E4F\u4EA1\u508D\u5256\u574A\u59A8\u5E3D\u5FD8\u5FD9\u623F\u66B4\u671B\u67D0\u68D2\u5192\u7D21\u80AA\u81A8\u8B00\u8C8C\u8CBF\u927E\u9632\u5420\u982C\u5317\u50D5\u535C\u58A8\u64B2\u6734\u7267\u7766\u7A46\u91E6\u52C3\u6CA1\u6B86\u5800\u5E4C\u5954\u672C\u7FFB\u51E1\u76C6"],
      ["9680", "\u6469\u78E8\u9B54\u9EBB\u57CB\u59B9\u6627\u679A\u6BCE\u54E9\u69D9\u5E55\u819C\u6795\u9BAA\u67FE\u9C52\u685D\u4EA6\u4FE3\u53C8\u62B9\u672B\u6CAB\u8FC4\u4FAD\u7E6D\u9EBF\u4E07\u6162\u6E80\u6F2B\u8513\u5473\u672A\u9B45\u5DF3\u7B95\u5CAC\u5BC6\u871C\u6E4A\u84D1\u7A14\u8108\u5999\u7C8D\u6C11\u7720\u52D9\u5922\u7121\u725F\u77DB\u9727\u9D61\u690B\u5A7F\u5A18\u51A5\u540D\u547D\u660E\u76DF\u8FF7\u9298\u9CF4\u59EA\u725D\u6EC5\u514D\u68C9\u7DBF\u7DEC\u9762\u9EBA\u6478\u6A21\u8302\u5984\u5B5F\u6BDB\u731B\u76F2\u7DB2\u8017\u8499\u5132\u6728\u9ED9\u76EE\u6762\u52FF\u9905\u5C24\u623B\u7C7E\u8CB0\u554F\u60B6\u7D0B\u9580\u5301\u4E5F\u51B6\u591C\u723A\u8036\u91CE\u5F25\u77E2\u5384\u5F79\u7D04\u85AC\u8A33\u8E8D\u9756\u67F3\u85AE\u9453\u6109\u6108\u6CB9\u7652"],
      ["9740", "\u8AED\u8F38\u552F\u4F51\u512A\u52C7\u53CB\u5BA5\u5E7D\u60A0\u6182\u63D6\u6709\u67DA\u6E67\u6D8C\u7336\u7337\u7531\u7950\u88D5\u8A98\u904A\u9091\u90F5\u96C4\u878D\u5915\u4E88\u4F59\u4E0E\u8A89\u8F3F\u9810\u50AD\u5E7C\u5996\u5BB9\u5EB8\u63DA\u63FA\u64C1\u66DC\u694A\u69D8\u6D0B\u6EB6\u7194\u7528\u7AAF\u7F8A\u8000\u8449\u84C9\u8981\u8B21\u8E0A\u9065\u967D\u990A\u617E\u6291\u6B32"],
      ["9780", "\u6C83\u6D74\u7FCC\u7FFC\u6DC0\u7F85\u87BA\u88F8\u6765\u83B1\u983C\u96F7\u6D1B\u7D61\u843D\u916A\u4E71\u5375\u5D50\u6B04\u6FEB\u85CD\u862D\u89A7\u5229\u540F\u5C65\u674E\u68A8\u7406\u7483\u75E2\u88CF\u88E1\u91CC\u96E2\u9678\u5F8B\u7387\u7ACB\u844E\u63A0\u7565\u5289\u6D41\u6E9C\u7409\u7559\u786B\u7C92\u9686\u7ADC\u9F8D\u4FB6\u616E\u65C5\u865C\u4E86\u4EAE\u50DA\u4E21\u51CC\u5BEE\u6599\u6881\u6DBC\u731F\u7642\u77AD\u7A1C\u7CE7\u826F\u8AD2\u907C\u91CF\u9675\u9818\u529B\u7DD1\u502B\u5398\u6797\u6DCB\u71D0\u7433\u81E8\u8F2A\u96A3\u9C57\u9E9F\u7460\u5841\u6D99\u7D2F\u985E\u4EE4\u4F36\u4F8B\u51B7\u52B1\u5DBA\u601C\u73B2\u793C\u82D3\u9234\u96B7\u96F6\u970A\u9E97\u9F62\u66A6\u6B74\u5217\u52A3\u70C8\u88C2\u5EC9\u604B\u6190\u6F23\u7149\u7C3E\u7DF4\u806F"],
      ["9840", "\u84EE\u9023\u932C\u5442\u9B6F\u6AD3\u7089\u8CC2\u8DEF\u9732\u52B4\u5A41\u5ECA\u5F04\u6717\u697C\u6994\u6D6A\u6F0F\u7262\u72FC\u7BED\u8001\u807E\u874B\u90CE\u516D\u9E93\u7984\u808B\u9332\u8AD6\u502D\u548C\u8A71\u6B6A\u8CC4\u8107\u60D1\u67A0\u9DF2\u4E99\u4E98\u9C10\u8A6B\u85C1\u8568\u6900\u6E7E\u7897\u8155"],
      ["989f", "\u5F0C\u4E10\u4E15\u4E2A\u4E31\u4E36\u4E3C\u4E3F\u4E42\u4E56\u4E58\u4E82\u4E85\u8C6B\u4E8A\u8212\u5F0D\u4E8E\u4E9E\u4E9F\u4EA0\u4EA2\u4EB0\u4EB3\u4EB6\u4ECE\u4ECD\u4EC4\u4EC6\u4EC2\u4ED7\u4EDE\u4EED\u4EDF\u4EF7\u4F09\u4F5A\u4F30\u4F5B\u4F5D\u4F57\u4F47\u4F76\u4F88\u4F8F\u4F98\u4F7B\u4F69\u4F70\u4F91\u4F6F\u4F86\u4F96\u5118\u4FD4\u4FDF\u4FCE\u4FD8\u4FDB\u4FD1\u4FDA\u4FD0\u4FE4\u4FE5\u501A\u5028\u5014\u502A\u5025\u5005\u4F1C\u4FF6\u5021\u5029\u502C\u4FFE\u4FEF\u5011\u5006\u5043\u5047\u6703\u5055\u5050\u5048\u505A\u5056\u506C\u5078\u5080\u509A\u5085\u50B4\u50B2"],
      ["9940", "\u50C9\u50CA\u50B3\u50C2\u50D6\u50DE\u50E5\u50ED\u50E3\u50EE\u50F9\u50F5\u5109\u5101\u5102\u5116\u5115\u5114\u511A\u5121\u513A\u5137\u513C\u513B\u513F\u5140\u5152\u514C\u5154\u5162\u7AF8\u5169\u516A\u516E\u5180\u5182\u56D8\u518C\u5189\u518F\u5191\u5193\u5195\u5196\u51A4\u51A6\u51A2\u51A9\u51AA\u51AB\u51B3\u51B1\u51B2\u51B0\u51B5\u51BD\u51C5\u51C9\u51DB\u51E0\u8655\u51E9\u51ED"],
      ["9980", "\u51F0\u51F5\u51FE\u5204\u520B\u5214\u520E\u5227\u522A\u522E\u5233\u5239\u524F\u5244\u524B\u524C\u525E\u5254\u526A\u5274\u5269\u5273\u527F\u527D\u528D\u5294\u5292\u5271\u5288\u5291\u8FA8\u8FA7\u52AC\u52AD\u52BC\u52B5\u52C1\u52CD\u52D7\u52DE\u52E3\u52E6\u98ED\u52E0\u52F3\u52F5\u52F8\u52F9\u5306\u5308\u7538\u530D\u5310\u530F\u5315\u531A\u5323\u532F\u5331\u5333\u5338\u5340\u5346\u5345\u4E17\u5349\u534D\u51D6\u535E\u5369\u536E\u5918\u537B\u5377\u5382\u5396\u53A0\u53A6\u53A5\u53AE\u53B0\u53B6\u53C3\u7C12\u96D9\u53DF\u66FC\u71EE\u53EE\u53E8\u53ED\u53FA\u5401\u543D\u5440\u542C\u542D\u543C\u542E\u5436\u5429\u541D\u544E\u548F\u5475\u548E\u545F\u5471\u5477\u5470\u5492\u547B\u5480\u5476\u5484\u5490\u5486\u54C7\u54A2\u54B8\u54A5\u54AC\u54C4\u54C8\u54A8"],
      ["9a40", "\u54AB\u54C2\u54A4\u54BE\u54BC\u54D8\u54E5\u54E6\u550F\u5514\u54FD\u54EE\u54ED\u54FA\u54E2\u5539\u5540\u5563\u554C\u552E\u555C\u5545\u5556\u5557\u5538\u5533\u555D\u5599\u5580\u54AF\u558A\u559F\u557B\u557E\u5598\u559E\u55AE\u557C\u5583\u55A9\u5587\u55A8\u55DA\u55C5\u55DF\u55C4\u55DC\u55E4\u55D4\u5614\u55F7\u5616\u55FE\u55FD\u561B\u55F9\u564E\u5650\u71DF\u5634\u5636\u5632\u5638"],
      ["9a80", "\u566B\u5664\u562F\u566C\u566A\u5686\u5680\u568A\u56A0\u5694\u568F\u56A5\u56AE\u56B6\u56B4\u56C2\u56BC\u56C1\u56C3\u56C0\u56C8\u56CE\u56D1\u56D3\u56D7\u56EE\u56F9\u5700\u56FF\u5704\u5709\u5708\u570B\u570D\u5713\u5718\u5716\u55C7\u571C\u5726\u5737\u5738\u574E\u573B\u5740\u574F\u5769\u57C0\u5788\u5761\u577F\u5789\u5793\u57A0\u57B3\u57A4\u57AA\u57B0\u57C3\u57C6\u57D4\u57D2\u57D3\u580A\u57D6\u57E3\u580B\u5819\u581D\u5872\u5821\u5862\u584B\u5870\u6BC0\u5852\u583D\u5879\u5885\u58B9\u589F\u58AB\u58BA\u58DE\u58BB\u58B8\u58AE\u58C5\u58D3\u58D1\u58D7\u58D9\u58D8\u58E5\u58DC\u58E4\u58DF\u58EF\u58FA\u58F9\u58FB\u58FC\u58FD\u5902\u590A\u5910\u591B\u68A6\u5925\u592C\u592D\u5932\u5938\u593E\u7AD2\u5955\u5950\u594E\u595A\u5958\u5962\u5960\u5967\u596C\u5969"],
      ["9b40", "\u5978\u5981\u599D\u4F5E\u4FAB\u59A3\u59B2\u59C6\u59E8\u59DC\u598D\u59D9\u59DA\u5A25\u5A1F\u5A11\u5A1C\u5A09\u5A1A\u5A40\u5A6C\u5A49\u5A35\u5A36\u5A62\u5A6A\u5A9A\u5ABC\u5ABE\u5ACB\u5AC2\u5ABD\u5AE3\u5AD7\u5AE6\u5AE9\u5AD6\u5AFA\u5AFB\u5B0C\u5B0B\u5B16\u5B32\u5AD0\u5B2A\u5B36\u5B3E\u5B43\u5B45\u5B40\u5B51\u5B55\u5B5A\u5B5B\u5B65\u5B69\u5B70\u5B73\u5B75\u5B78\u6588\u5B7A\u5B80"],
      ["9b80", "\u5B83\u5BA6\u5BB8\u5BC3\u5BC7\u5BC9\u5BD4\u5BD0\u5BE4\u5BE6\u5BE2\u5BDE\u5BE5\u5BEB\u5BF0\u5BF6\u5BF3\u5C05\u5C07\u5C08\u5C0D\u5C13\u5C20\u5C22\u5C28\u5C38\u5C39\u5C41\u5C46\u5C4E\u5C53\u5C50\u5C4F\u5B71\u5C6C\u5C6E\u4E62\u5C76\u5C79\u5C8C\u5C91\u5C94\u599B\u5CAB\u5CBB\u5CB6\u5CBC\u5CB7\u5CC5\u5CBE\u5CC7\u5CD9\u5CE9\u5CFD\u5CFA\u5CED\u5D8C\u5CEA\u5D0B\u5D15\u5D17\u5D5C\u5D1F\u5D1B\u5D11\u5D14\u5D22\u5D1A\u5D19\u5D18\u5D4C\u5D52\u5D4E\u5D4B\u5D6C\u5D73\u5D76\u5D87\u5D84\u5D82\u5DA2\u5D9D\u5DAC\u5DAE\u5DBD\u5D90\u5DB7\u5DBC\u5DC9\u5DCD\u5DD3\u5DD2\u5DD6\u5DDB\u5DEB\u5DF2\u5DF5\u5E0B\u5E1A\u5E19\u5E11\u5E1B\u5E36\u5E37\u5E44\u5E43\u5E40\u5E4E\u5E57\u5E54\u5E5F\u5E62\u5E64\u5E47\u5E75\u5E76\u5E7A\u9EBC\u5E7F\u5EA0\u5EC1\u5EC2\u5EC8\u5ED0\u5ECF"],
      ["9c40", "\u5ED6\u5EE3\u5EDD\u5EDA\u5EDB\u5EE2\u5EE1\u5EE8\u5EE9\u5EEC\u5EF1\u5EF3\u5EF0\u5EF4\u5EF8\u5EFE\u5F03\u5F09\u5F5D\u5F5C\u5F0B\u5F11\u5F16\u5F29\u5F2D\u5F38\u5F41\u5F48\u5F4C\u5F4E\u5F2F\u5F51\u5F56\u5F57\u5F59\u5F61\u5F6D\u5F73\u5F77\u5F83\u5F82\u5F7F\u5F8A\u5F88\u5F91\u5F87\u5F9E\u5F99\u5F98\u5FA0\u5FA8\u5FAD\u5FBC\u5FD6\u5FFB\u5FE4\u5FF8\u5FF1\u5FDD\u60B3\u5FFF\u6021\u6060"],
      ["9c80", "\u6019\u6010\u6029\u600E\u6031\u601B\u6015\u602B\u6026\u600F\u603A\u605A\u6041\u606A\u6077\u605F\u604A\u6046\u604D\u6063\u6043\u6064\u6042\u606C\u606B\u6059\u6081\u608D\u60E7\u6083\u609A\u6084\u609B\u6096\u6097\u6092\u60A7\u608B\u60E1\u60B8\u60E0\u60D3\u60B4\u5FF0\u60BD\u60C6\u60B5\u60D8\u614D\u6115\u6106\u60F6\u60F7\u6100\u60F4\u60FA\u6103\u6121\u60FB\u60F1\u610D\u610E\u6147\u613E\u6128\u6127\u614A\u613F\u613C\u612C\u6134\u613D\u6142\u6144\u6173\u6177\u6158\u6159\u615A\u616B\u6174\u616F\u6165\u6171\u615F\u615D\u6153\u6175\u6199\u6196\u6187\u61AC\u6194\u619A\u618A\u6191\u61AB\u61AE\u61CC\u61CA\u61C9\u61F7\u61C8\u61C3\u61C6\u61BA\u61CB\u7F79\u61CD\u61E6\u61E3\u61F6\u61FA\u61F4\u61FF\u61FD\u61FC\u61FE\u6200\u6208\u6209\u620D\u620C\u6214\u621B"],
      ["9d40", "\u621E\u6221\u622A\u622E\u6230\u6232\u6233\u6241\u624E\u625E\u6263\u625B\u6260\u6268\u627C\u6282\u6289\u627E\u6292\u6293\u6296\u62D4\u6283\u6294\u62D7\u62D1\u62BB\u62CF\u62FF\u62C6\u64D4\u62C8\u62DC\u62CC\u62CA\u62C2\u62C7\u629B\u62C9\u630C\u62EE\u62F1\u6327\u6302\u6308\u62EF\u62F5\u6350\u633E\u634D\u641C\u634F\u6396\u638E\u6380\u63AB\u6376\u63A3\u638F\u6389\u639F\u63B5\u636B"],
      ["9d80", "\u6369\u63BE\u63E9\u63C0\u63C6\u63E3\u63C9\u63D2\u63F6\u63C4\u6416\u6434\u6406\u6413\u6426\u6436\u651D\u6417\u6428\u640F\u6467\u646F\u6476\u644E\u652A\u6495\u6493\u64A5\u64A9\u6488\u64BC\u64DA\u64D2\u64C5\u64C7\u64BB\u64D8\u64C2\u64F1\u64E7\u8209\u64E0\u64E1\u62AC\u64E3\u64EF\u652C\u64F6\u64F4\u64F2\u64FA\u6500\u64FD\u6518\u651C\u6505\u6524\u6523\u652B\u6534\u6535\u6537\u6536\u6538\u754B\u6548\u6556\u6555\u654D\u6558\u655E\u655D\u6572\u6578\u6582\u6583\u8B8A\u659B\u659F\u65AB\u65B7\u65C3\u65C6\u65C1\u65C4\u65CC\u65D2\u65DB\u65D9\u65E0\u65E1\u65F1\u6772\u660A\u6603\u65FB\u6773\u6635\u6636\u6634\u661C\u664F\u6644\u6649\u6641\u665E\u665D\u6664\u6667\u6668\u665F\u6662\u6670\u6683\u6688\u668E\u6689\u6684\u6698\u669D\u66C1\u66B9\u66C9\u66BE\u66BC"],
      ["9e40", "\u66C4\u66B8\u66D6\u66DA\u66E0\u663F\u66E6\u66E9\u66F0\u66F5\u66F7\u670F\u6716\u671E\u6726\u6727\u9738\u672E\u673F\u6736\u6741\u6738\u6737\u6746\u675E\u6760\u6759\u6763\u6764\u6789\u6770\u67A9\u677C\u676A\u678C\u678B\u67A6\u67A1\u6785\u67B7\u67EF\u67B4\u67EC\u67B3\u67E9\u67B8\u67E4\u67DE\u67DD\u67E2\u67EE\u67B9\u67CE\u67C6\u67E7\u6A9C\u681E\u6846\u6829\u6840\u684D\u6832\u684E"],
      ["9e80", "\u68B3\u682B\u6859\u6863\u6877\u687F\u689F\u688F\u68AD\u6894\u689D\u689B\u6883\u6AAE\u68B9\u6874\u68B5\u68A0\u68BA\u690F\u688D\u687E\u6901\u68CA\u6908\u68D8\u6922\u6926\u68E1\u690C\u68CD\u68D4\u68E7\u68D5\u6936\u6912\u6904\u68D7\u68E3\u6925\u68F9\u68E0\u68EF\u6928\u692A\u691A\u6923\u6921\u68C6\u6979\u6977\u695C\u6978\u696B\u6954\u697E\u696E\u6939\u6974\u693D\u6959\u6930\u6961\u695E\u695D\u6981\u696A\u69B2\u69AE\u69D0\u69BF\u69C1\u69D3\u69BE\u69CE\u5BE8\u69CA\u69DD\u69BB\u69C3\u69A7\u6A2E\u6991\u69A0\u699C\u6995\u69B4\u69DE\u69E8\u6A02\u6A1B\u69FF\u6B0A\u69F9\u69F2\u69E7\u6A05\u69B1\u6A1E\u69ED\u6A14\u69EB\u6A0A\u6A12\u6AC1\u6A23\u6A13\u6A44\u6A0C\u6A72\u6A36\u6A78\u6A47\u6A62\u6A59\u6A66\u6A48\u6A38\u6A22\u6A90\u6A8D\u6AA0\u6A84\u6AA2\u6AA3"],
      ["9f40", "\u6A97\u8617\u6ABB\u6AC3\u6AC2\u6AB8\u6AB3\u6AAC\u6ADE\u6AD1\u6ADF\u6AAA\u6ADA\u6AEA\u6AFB\u6B05\u8616\u6AFA\u6B12\u6B16\u9B31\u6B1F\u6B38\u6B37\u76DC\u6B39\u98EE\u6B47\u6B43\u6B49\u6B50\u6B59\u6B54\u6B5B\u6B5F\u6B61\u6B78\u6B79\u6B7F\u6B80\u6B84\u6B83\u6B8D\u6B98\u6B95\u6B9E\u6BA4\u6BAA\u6BAB\u6BAF\u6BB2\u6BB1\u6BB3\u6BB7\u6BBC\u6BC6\u6BCB\u6BD3\u6BDF\u6BEC\u6BEB\u6BF3\u6BEF"],
      ["9f80", "\u9EBE\u6C08\u6C13\u6C14\u6C1B\u6C24\u6C23\u6C5E\u6C55\u6C62\u6C6A\u6C82\u6C8D\u6C9A\u6C81\u6C9B\u6C7E\u6C68\u6C73\u6C92\u6C90\u6CC4\u6CF1\u6CD3\u6CBD\u6CD7\u6CC5\u6CDD\u6CAE\u6CB1\u6CBE\u6CBA\u6CDB\u6CEF\u6CD9\u6CEA\u6D1F\u884D\u6D36\u6D2B\u6D3D\u6D38\u6D19\u6D35\u6D33\u6D12\u6D0C\u6D63\u6D93\u6D64\u6D5A\u6D79\u6D59\u6D8E\u6D95\u6FE4\u6D85\u6DF9\u6E15\u6E0A\u6DB5\u6DC7\u6DE6\u6DB8\u6DC6\u6DEC\u6DDE\u6DCC\u6DE8\u6DD2\u6DC5\u6DFA\u6DD9\u6DE4\u6DD5\u6DEA\u6DEE\u6E2D\u6E6E\u6E2E\u6E19\u6E72\u6E5F\u6E3E\u6E23\u6E6B\u6E2B\u6E76\u6E4D\u6E1F\u6E43\u6E3A\u6E4E\u6E24\u6EFF\u6E1D\u6E38\u6E82\u6EAA\u6E98\u6EC9\u6EB7\u6ED3\u6EBD\u6EAF\u6EC4\u6EB2\u6ED4\u6ED5\u6E8F\u6EA5\u6EC2\u6E9F\u6F41\u6F11\u704C\u6EEC\u6EF8\u6EFE\u6F3F\u6EF2\u6F31\u6EEF\u6F32\u6ECC"],
      ["e040", "\u6F3E\u6F13\u6EF7\u6F86\u6F7A\u6F78\u6F81\u6F80\u6F6F\u6F5B\u6FF3\u6F6D\u6F82\u6F7C\u6F58\u6F8E\u6F91\u6FC2\u6F66\u6FB3\u6FA3\u6FA1\u6FA4\u6FB9\u6FC6\u6FAA\u6FDF\u6FD5\u6FEC\u6FD4\u6FD8\u6FF1\u6FEE\u6FDB\u7009\u700B\u6FFA\u7011\u7001\u700F\u6FFE\u701B\u701A\u6F74\u701D\u7018\u701F\u7030\u703E\u7032\u7051\u7063\u7099\u7092\u70AF\u70F1\u70AC\u70B8\u70B3\u70AE\u70DF\u70CB\u70DD"],
      ["e080", "\u70D9\u7109\u70FD\u711C\u7119\u7165\u7155\u7188\u7166\u7162\u714C\u7156\u716C\u718F\u71FB\u7184\u7195\u71A8\u71AC\u71D7\u71B9\u71BE\u71D2\u71C9\u71D4\u71CE\u71E0\u71EC\u71E7\u71F5\u71FC\u71F9\u71FF\u720D\u7210\u721B\u7228\u722D\u722C\u7230\u7232\u723B\u723C\u723F\u7240\u7246\u724B\u7258\u7274\u727E\u7282\u7281\u7287\u7292\u7296\u72A2\u72A7\u72B9\u72B2\u72C3\u72C6\u72C4\u72CE\u72D2\u72E2\u72E0\u72E1\u72F9\u72F7\u500F\u7317\u730A\u731C\u7316\u731D\u7334\u732F\u7329\u7325\u733E\u734E\u734F\u9ED8\u7357\u736A\u7368\u7370\u7378\u7375\u737B\u737A\u73C8\u73B3\u73CE\u73BB\u73C0\u73E5\u73EE\u73DE\u74A2\u7405\u746F\u7425\u73F8\u7432\u743A\u7455\u743F\u745F\u7459\u7441\u745C\u7469\u7470\u7463\u746A\u7476\u747E\u748B\u749E\u74A7\u74CA\u74CF\u74D4\u73F1"],
      ["e140", "\u74E0\u74E3\u74E7\u74E9\u74EE\u74F2\u74F0\u74F1\u74F8\u74F7\u7504\u7503\u7505\u750C\u750E\u750D\u7515\u7513\u751E\u7526\u752C\u753C\u7544\u754D\u754A\u7549\u755B\u7546\u755A\u7569\u7564\u7567\u756B\u756D\u7578\u7576\u7586\u7587\u7574\u758A\u7589\u7582\u7594\u759A\u759D\u75A5\u75A3\u75C2\u75B3\u75C3\u75B5\u75BD\u75B8\u75BC\u75B1\u75CD\u75CA\u75D2\u75D9\u75E3\u75DE\u75FE\u75FF"],
      ["e180", "\u75FC\u7601\u75F0\u75FA\u75F2\u75F3\u760B\u760D\u7609\u761F\u7627\u7620\u7621\u7622\u7624\u7634\u7630\u763B\u7647\u7648\u7646\u765C\u7658\u7661\u7662\u7668\u7669\u766A\u7667\u766C\u7670\u7672\u7676\u7678\u767C\u7680\u7683\u7688\u768B\u768E\u7696\u7693\u7699\u769A\u76B0\u76B4\u76B8\u76B9\u76BA\u76C2\u76CD\u76D6\u76D2\u76DE\u76E1\u76E5\u76E7\u76EA\u862F\u76FB\u7708\u7707\u7704\u7729\u7724\u771E\u7725\u7726\u771B\u7737\u7738\u7747\u775A\u7768\u776B\u775B\u7765\u777F\u777E\u7779\u778E\u778B\u7791\u77A0\u779E\u77B0\u77B6\u77B9\u77BF\u77BC\u77BD\u77BB\u77C7\u77CD\u77D7\u77DA\u77DC\u77E3\u77EE\u77FC\u780C\u7812\u7926\u7820\u792A\u7845\u788E\u7874\u7886\u787C\u789A\u788C\u78A3\u78B5\u78AA\u78AF\u78D1\u78C6\u78CB\u78D4\u78BE\u78BC\u78C5\u78CA\u78EC"],
      ["e240", "\u78E7\u78DA\u78FD\u78F4\u7907\u7912\u7911\u7919\u792C\u792B\u7940\u7960\u7957\u795F\u795A\u7955\u7953\u797A\u797F\u798A\u799D\u79A7\u9F4B\u79AA\u79AE\u79B3\u79B9\u79BA\u79C9\u79D5\u79E7\u79EC\u79E1\u79E3\u7A08\u7A0D\u7A18\u7A19\u7A20\u7A1F\u7980\u7A31\u7A3B\u7A3E\u7A37\u7A43\u7A57\u7A49\u7A61\u7A62\u7A69\u9F9D\u7A70\u7A79\u7A7D\u7A88\u7A97\u7A95\u7A98\u7A96\u7AA9\u7AC8\u7AB0"],
      ["e280", "\u7AB6\u7AC5\u7AC4\u7ABF\u9083\u7AC7\u7ACA\u7ACD\u7ACF\u7AD5\u7AD3\u7AD9\u7ADA\u7ADD\u7AE1\u7AE2\u7AE6\u7AED\u7AF0\u7B02\u7B0F\u7B0A\u7B06\u7B33\u7B18\u7B19\u7B1E\u7B35\u7B28\u7B36\u7B50\u7B7A\u7B04\u7B4D\u7B0B\u7B4C\u7B45\u7B75\u7B65\u7B74\u7B67\u7B70\u7B71\u7B6C\u7B6E\u7B9D\u7B98\u7B9F\u7B8D\u7B9C\u7B9A\u7B8B\u7B92\u7B8F\u7B5D\u7B99\u7BCB\u7BC1\u7BCC\u7BCF\u7BB4\u7BC6\u7BDD\u7BE9\u7C11\u7C14\u7BE6\u7BE5\u7C60\u7C00\u7C07\u7C13\u7BF3\u7BF7\u7C17\u7C0D\u7BF6\u7C23\u7C27\u7C2A\u7C1F\u7C37\u7C2B\u7C3D\u7C4C\u7C43\u7C54\u7C4F\u7C40\u7C50\u7C58\u7C5F\u7C64\u7C56\u7C65\u7C6C\u7C75\u7C83\u7C90\u7CA4\u7CAD\u7CA2\u7CAB\u7CA1\u7CA8\u7CB3\u7CB2\u7CB1\u7CAE\u7CB9\u7CBD\u7CC0\u7CC5\u7CC2\u7CD8\u7CD2\u7CDC\u7CE2\u9B3B\u7CEF\u7CF2\u7CF4\u7CF6\u7CFA\u7D06"],
      ["e340", "\u7D02\u7D1C\u7D15\u7D0A\u7D45\u7D4B\u7D2E\u7D32\u7D3F\u7D35\u7D46\u7D73\u7D56\u7D4E\u7D72\u7D68\u7D6E\u7D4F\u7D63\u7D93\u7D89\u7D5B\u7D8F\u7D7D\u7D9B\u7DBA\u7DAE\u7DA3\u7DB5\u7DC7\u7DBD\u7DAB\u7E3D\u7DA2\u7DAF\u7DDC\u7DB8\u7D9F\u7DB0\u7DD8\u7DDD\u7DE4\u7DDE\u7DFB\u7DF2\u7DE1\u7E05\u7E0A\u7E23\u7E21\u7E12\u7E31\u7E1F\u7E09\u7E0B\u7E22\u7E46\u7E66\u7E3B\u7E35\u7E39\u7E43\u7E37"],
      ["e380", "\u7E32\u7E3A\u7E67\u7E5D\u7E56\u7E5E\u7E59\u7E5A\u7E79\u7E6A\u7E69\u7E7C\u7E7B\u7E83\u7DD5\u7E7D\u8FAE\u7E7F\u7E88\u7E89\u7E8C\u7E92\u7E90\u7E93\u7E94\u7E96\u7E8E\u7E9B\u7E9C\u7F38\u7F3A\u7F45\u7F4C\u7F4D\u7F4E\u7F50\u7F51\u7F55\u7F54\u7F58\u7F5F\u7F60\u7F68\u7F69\u7F67\u7F78\u7F82\u7F86\u7F83\u7F88\u7F87\u7F8C\u7F94\u7F9E\u7F9D\u7F9A\u7FA3\u7FAF\u7FB2\u7FB9\u7FAE\u7FB6\u7FB8\u8B71\u7FC5\u7FC6\u7FCA\u7FD5\u7FD4\u7FE1\u7FE6\u7FE9\u7FF3\u7FF9\u98DC\u8006\u8004\u800B\u8012\u8018\u8019\u801C\u8021\u8028\u803F\u803B\u804A\u8046\u8052\u8058\u805A\u805F\u8062\u8068\u8073\u8072\u8070\u8076\u8079\u807D\u807F\u8084\u8086\u8085\u809B\u8093\u809A\u80AD\u5190\u80AC\u80DB\u80E5\u80D9\u80DD\u80C4\u80DA\u80D6\u8109\u80EF\u80F1\u811B\u8129\u8123\u812F\u814B"],
      ["e440", "\u968B\u8146\u813E\u8153\u8151\u80FC\u8171\u816E\u8165\u8166\u8174\u8183\u8188\u818A\u8180\u8182\u81A0\u8195\u81A4\u81A3\u815F\u8193\u81A9\u81B0\u81B5\u81BE\u81B8\u81BD\u81C0\u81C2\u81BA\u81C9\u81CD\u81D1\u81D9\u81D8\u81C8\u81DA\u81DF\u81E0\u81E7\u81FA\u81FB\u81FE\u8201\u8202\u8205\u8207\u820A\u820D\u8210\u8216\u8229\u822B\u8238\u8233\u8240\u8259\u8258\u825D\u825A\u825F\u8264"],
      ["e480", "\u8262\u8268\u826A\u826B\u822E\u8271\u8277\u8278\u827E\u828D\u8292\u82AB\u829F\u82BB\u82AC\u82E1\u82E3\u82DF\u82D2\u82F4\u82F3\u82FA\u8393\u8303\u82FB\u82F9\u82DE\u8306\u82DC\u8309\u82D9\u8335\u8334\u8316\u8332\u8331\u8340\u8339\u8350\u8345\u832F\u832B\u8317\u8318\u8385\u839A\u83AA\u839F\u83A2\u8396\u8323\u838E\u8387\u838A\u837C\u83B5\u8373\u8375\u83A0\u8389\u83A8\u83F4\u8413\u83EB\u83CE\u83FD\u8403\u83D8\u840B\u83C1\u83F7\u8407\u83E0\u83F2\u840D\u8422\u8420\u83BD\u8438\u8506\u83FB\u846D\u842A\u843C\u855A\u8484\u8477\u846B\u84AD\u846E\u8482\u8469\u8446\u842C\u846F\u8479\u8435\u84CA\u8462\u84B9\u84BF\u849F\u84D9\u84CD\u84BB\u84DA\u84D0\u84C1\u84C6\u84D6\u84A1\u8521\u84FF\u84F4\u8517\u8518\u852C\u851F\u8515\u8514\u84FC\u8540\u8563\u8558\u8548"],
      ["e540", "\u8541\u8602\u854B\u8555\u8580\u85A4\u8588\u8591\u858A\u85A8\u856D\u8594\u859B\u85EA\u8587\u859C\u8577\u857E\u8590\u85C9\u85BA\u85CF\u85B9\u85D0\u85D5\u85DD\u85E5\u85DC\u85F9\u860A\u8613\u860B\u85FE\u85FA\u8606\u8622\u861A\u8630\u863F\u864D\u4E55\u8654\u865F\u8667\u8671\u8693\u86A3\u86A9\u86AA\u868B\u868C\u86B6\u86AF\u86C4\u86C6\u86B0\u86C9\u8823\u86AB\u86D4\u86DE\u86E9\u86EC"],
      ["e580", "\u86DF\u86DB\u86EF\u8712\u8706\u8708\u8700\u8703\u86FB\u8711\u8709\u870D\u86F9\u870A\u8734\u873F\u8737\u873B\u8725\u8729\u871A\u8760\u875F\u8778\u874C\u874E\u8774\u8757\u8768\u876E\u8759\u8753\u8763\u876A\u8805\u87A2\u879F\u8782\u87AF\u87CB\u87BD\u87C0\u87D0\u96D6\u87AB\u87C4\u87B3\u87C7\u87C6\u87BB\u87EF\u87F2\u87E0\u880F\u880D\u87FE\u87F6\u87F7\u880E\u87D2\u8811\u8816\u8815\u8822\u8821\u8831\u8836\u8839\u8827\u883B\u8844\u8842\u8852\u8859\u885E\u8862\u886B\u8881\u887E\u889E\u8875\u887D\u88B5\u8872\u8882\u8897\u8892\u88AE\u8899\u88A2\u888D\u88A4\u88B0\u88BF\u88B1\u88C3\u88C4\u88D4\u88D8\u88D9\u88DD\u88F9\u8902\u88FC\u88F4\u88E8\u88F2\u8904\u890C\u890A\u8913\u8943\u891E\u8925\u892A\u892B\u8941\u8944\u893B\u8936\u8938\u894C\u891D\u8960\u895E"],
      ["e640", "\u8966\u8964\u896D\u896A\u896F\u8974\u8977\u897E\u8983\u8988\u898A\u8993\u8998\u89A1\u89A9\u89A6\u89AC\u89AF\u89B2\u89BA\u89BD\u89BF\u89C0\u89DA\u89DC\u89DD\u89E7\u89F4\u89F8\u8A03\u8A16\u8A10\u8A0C\u8A1B\u8A1D\u8A25\u8A36\u8A41\u8A5B\u8A52\u8A46\u8A48\u8A7C\u8A6D\u8A6C\u8A62\u8A85\u8A82\u8A84\u8AA8\u8AA1\u8A91\u8AA5\u8AA6\u8A9A\u8AA3\u8AC4\u8ACD\u8AC2\u8ADA\u8AEB\u8AF3\u8AE7"],
      ["e680", "\u8AE4\u8AF1\u8B14\u8AE0\u8AE2\u8AF7\u8ADE\u8ADB\u8B0C\u8B07\u8B1A\u8AE1\u8B16\u8B10\u8B17\u8B20\u8B33\u97AB\u8B26\u8B2B\u8B3E\u8B28\u8B41\u8B4C\u8B4F\u8B4E\u8B49\u8B56\u8B5B\u8B5A\u8B6B\u8B5F\u8B6C\u8B6F\u8B74\u8B7D\u8B80\u8B8C\u8B8E\u8B92\u8B93\u8B96\u8B99\u8B9A\u8C3A\u8C41\u8C3F\u8C48\u8C4C\u8C4E\u8C50\u8C55\u8C62\u8C6C\u8C78\u8C7A\u8C82\u8C89\u8C85\u8C8A\u8C8D\u8C8E\u8C94\u8C7C\u8C98\u621D\u8CAD\u8CAA\u8CBD\u8CB2\u8CB3\u8CAE\u8CB6\u8CC8\u8CC1\u8CE4\u8CE3\u8CDA\u8CFD\u8CFA\u8CFB\u8D04\u8D05\u8D0A\u8D07\u8D0F\u8D0D\u8D10\u9F4E\u8D13\u8CCD\u8D14\u8D16\u8D67\u8D6D\u8D71\u8D73\u8D81\u8D99\u8DC2\u8DBE\u8DBA\u8DCF\u8DDA\u8DD6\u8DCC\u8DDB\u8DCB\u8DEA\u8DEB\u8DDF\u8DE3\u8DFC\u8E08\u8E09\u8DFF\u8E1D\u8E1E\u8E10\u8E1F\u8E42\u8E35\u8E30\u8E34\u8E4A"],
      ["e740", "\u8E47\u8E49\u8E4C\u8E50\u8E48\u8E59\u8E64\u8E60\u8E2A\u8E63\u8E55\u8E76\u8E72\u8E7C\u8E81\u8E87\u8E85\u8E84\u8E8B\u8E8A\u8E93\u8E91\u8E94\u8E99\u8EAA\u8EA1\u8EAC\u8EB0\u8EC6\u8EB1\u8EBE\u8EC5\u8EC8\u8ECB\u8EDB\u8EE3\u8EFC\u8EFB\u8EEB\u8EFE\u8F0A\u8F05\u8F15\u8F12\u8F19\u8F13\u8F1C\u8F1F\u8F1B\u8F0C\u8F26\u8F33\u8F3B\u8F39\u8F45\u8F42\u8F3E\u8F4C\u8F49\u8F46\u8F4E\u8F57\u8F5C"],
      ["e780", "\u8F62\u8F63\u8F64\u8F9C\u8F9F\u8FA3\u8FAD\u8FAF\u8FB7\u8FDA\u8FE5\u8FE2\u8FEA\u8FEF\u9087\u8FF4\u9005\u8FF9\u8FFA\u9011\u9015\u9021\u900D\u901E\u9016\u900B\u9027\u9036\u9035\u9039\u8FF8\u904F\u9050\u9051\u9052\u900E\u9049\u903E\u9056\u9058\u905E\u9068\u906F\u9076\u96A8\u9072\u9082\u907D\u9081\u9080\u908A\u9089\u908F\u90A8\u90AF\u90B1\u90B5\u90E2\u90E4\u6248\u90DB\u9102\u9112\u9119\u9132\u9130\u914A\u9156\u9158\u9163\u9165\u9169\u9173\u9172\u918B\u9189\u9182\u91A2\u91AB\u91AF\u91AA\u91B5\u91B4\u91BA\u91C0\u91C1\u91C9\u91CB\u91D0\u91D6\u91DF\u91E1\u91DB\u91FC\u91F5\u91F6\u921E\u91FF\u9214\u922C\u9215\u9211\u925E\u9257\u9245\u9249\u9264\u9248\u9295\u923F\u924B\u9250\u929C\u9296\u9293\u929B\u925A\u92CF\u92B9\u92B7\u92E9\u930F\u92FA\u9344\u932E"],
      ["e840", "\u9319\u9322\u931A\u9323\u933A\u9335\u933B\u935C\u9360\u937C\u936E\u9356\u93B0\u93AC\u93AD\u9394\u93B9\u93D6\u93D7\u93E8\u93E5\u93D8\u93C3\u93DD\u93D0\u93C8\u93E4\u941A\u9414\u9413\u9403\u9407\u9410\u9436\u942B\u9435\u9421\u943A\u9441\u9452\u9444\u945B\u9460\u9462\u945E\u946A\u9229\u9470\u9475\u9477\u947D\u945A\u947C\u947E\u9481\u947F\u9582\u9587\u958A\u9594\u9596\u9598\u9599"],
      ["e880", "\u95A0\u95A8\u95A7\u95AD\u95BC\u95BB\u95B9\u95BE\u95CA\u6FF6\u95C3\u95CD\u95CC\u95D5\u95D4\u95D6\u95DC\u95E1\u95E5\u95E2\u9621\u9628\u962E\u962F\u9642\u964C\u964F\u964B\u9677\u965C\u965E\u965D\u965F\u9666\u9672\u966C\u968D\u9698\u9695\u9697\u96AA\u96A7\u96B1\u96B2\u96B0\u96B4\u96B6\u96B8\u96B9\u96CE\u96CB\u96C9\u96CD\u894D\u96DC\u970D\u96D5\u96F9\u9704\u9706\u9708\u9713\u970E\u9711\u970F\u9716\u9719\u9724\u972A\u9730\u9739\u973D\u973E\u9744\u9746\u9748\u9742\u9749\u975C\u9760\u9764\u9766\u9768\u52D2\u976B\u9771\u9779\u9785\u977C\u9781\u977A\u9786\u978B\u978F\u9790\u979C\u97A8\u97A6\u97A3\u97B3\u97B4\u97C3\u97C6\u97C8\u97CB\u97DC\u97ED\u9F4F\u97F2\u7ADF\u97F6\u97F5\u980F\u980C\u9838\u9824\u9821\u9837\u983D\u9846\u984F\u984B\u986B\u986F\u9870"],
      ["e940", "\u9871\u9874\u9873\u98AA\u98AF\u98B1\u98B6\u98C4\u98C3\u98C6\u98E9\u98EB\u9903\u9909\u9912\u9914\u9918\u9921\u991D\u991E\u9924\u9920\u992C\u992E\u993D\u993E\u9942\u9949\u9945\u9950\u994B\u9951\u9952\u994C\u9955\u9997\u9998\u99A5\u99AD\u99AE\u99BC\u99DF\u99DB\u99DD\u99D8\u99D1\u99ED\u99EE\u99F1\u99F2\u99FB\u99F8\u9A01\u9A0F\u9A05\u99E2\u9A19\u9A2B\u9A37\u9A45\u9A42\u9A40\u9A43"],
      ["e980", "\u9A3E\u9A55\u9A4D\u9A5B\u9A57\u9A5F\u9A62\u9A65\u9A64\u9A69\u9A6B\u9A6A\u9AAD\u9AB0\u9ABC\u9AC0\u9ACF\u9AD1\u9AD3\u9AD4\u9ADE\u9ADF\u9AE2\u9AE3\u9AE6\u9AEF\u9AEB\u9AEE\u9AF4\u9AF1\u9AF7\u9AFB\u9B06\u9B18\u9B1A\u9B1F\u9B22\u9B23\u9B25\u9B27\u9B28\u9B29\u9B2A\u9B2E\u9B2F\u9B32\u9B44\u9B43\u9B4F\u9B4D\u9B4E\u9B51\u9B58\u9B74\u9B93\u9B83\u9B91\u9B96\u9B97\u9B9F\u9BA0\u9BA8\u9BB4\u9BC0\u9BCA\u9BB9\u9BC6\u9BCF\u9BD1\u9BD2\u9BE3\u9BE2\u9BE4\u9BD4\u9BE1\u9C3A\u9BF2\u9BF1\u9BF0\u9C15\u9C14\u9C09\u9C13\u9C0C\u9C06\u9C08\u9C12\u9C0A\u9C04\u9C2E\u9C1B\u9C25\u9C24\u9C21\u9C30\u9C47\u9C32\u9C46\u9C3E\u9C5A\u9C60\u9C67\u9C76\u9C78\u9CE7\u9CEC\u9CF0\u9D09\u9D08\u9CEB\u9D03\u9D06\u9D2A\u9D26\u9DAF\u9D23\u9D1F\u9D44\u9D15\u9D12\u9D41\u9D3F\u9D3E\u9D46\u9D48"],
      ["ea40", "\u9D5D\u9D5E\u9D64\u9D51\u9D50\u9D59\u9D72\u9D89\u9D87\u9DAB\u9D6F\u9D7A\u9D9A\u9DA4\u9DA9\u9DB2\u9DC4\u9DC1\u9DBB\u9DB8\u9DBA\u9DC6\u9DCF\u9DC2\u9DD9\u9DD3\u9DF8\u9DE6\u9DED\u9DEF\u9DFD\u9E1A\u9E1B\u9E1E\u9E75\u9E79\u9E7D\u9E81\u9E88\u9E8B\u9E8C\u9E92\u9E95\u9E91\u9E9D\u9EA5\u9EA9\u9EB8\u9EAA\u9EAD\u9761\u9ECC\u9ECE\u9ECF\u9ED0\u9ED4\u9EDC\u9EDE\u9EDD\u9EE0\u9EE5\u9EE8\u9EEF"],
      ["ea80", "\u9EF4\u9EF6\u9EF7\u9EF9\u9EFB\u9EFC\u9EFD\u9F07\u9F08\u76B7\u9F15\u9F21\u9F2C\u9F3E\u9F4A\u9F52\u9F54\u9F63\u9F5F\u9F60\u9F61\u9F66\u9F67\u9F6C\u9F6A\u9F77\u9F72\u9F76\u9F95\u9F9C\u9FA0\u582F\u69C7\u9059\u7464\u51DC\u7199"],
      ["ed40", "\u7E8A\u891C\u9348\u9288\u84DC\u4FC9\u70BB\u6631\u68C8\u92F9\u66FB\u5F45\u4E28\u4EE1\u4EFC\u4F00\u4F03\u4F39\u4F56\u4F92\u4F8A\u4F9A\u4F94\u4FCD\u5040\u5022\u4FFF\u501E\u5046\u5070\u5042\u5094\u50F4\u50D8\u514A\u5164\u519D\u51BE\u51EC\u5215\u529C\u52A6\u52C0\u52DB\u5300\u5307\u5324\u5372\u5393\u53B2\u53DD\uFA0E\u549C\u548A\u54A9\u54FF\u5586\u5759\u5765\u57AC\u57C8\u57C7\uFA0F"],
      ["ed80", "\uFA10\u589E\u58B2\u590B\u5953\u595B\u595D\u5963\u59A4\u59BA\u5B56\u5BC0\u752F\u5BD8\u5BEC\u5C1E\u5CA6\u5CBA\u5CF5\u5D27\u5D53\uFA11\u5D42\u5D6D\u5DB8\u5DB9\u5DD0\u5F21\u5F34\u5F67\u5FB7\u5FDE\u605D\u6085\u608A\u60DE\u60D5\u6120\u60F2\u6111\u6137\u6130\u6198\u6213\u62A6\u63F5\u6460\u649D\u64CE\u654E\u6600\u6615\u663B\u6609\u662E\u661E\u6624\u6665\u6657\u6659\uFA12\u6673\u6699\u66A0\u66B2\u66BF\u66FA\u670E\uF929\u6766\u67BB\u6852\u67C0\u6801\u6844\u68CF\uFA13\u6968\uFA14\u6998\u69E2\u6A30\u6A6B\u6A46\u6A73\u6A7E\u6AE2\u6AE4\u6BD6\u6C3F\u6C5C\u6C86\u6C6F\u6CDA\u6D04\u6D87\u6D6F\u6D96\u6DAC\u6DCF\u6DF8\u6DF2\u6DFC\u6E39\u6E5C\u6E27\u6E3C\u6EBF\u6F88\u6FB5\u6FF5\u7005\u7007\u7028\u7085\u70AB\u710F\u7104\u715C\u7146\u7147\uFA15\u71C1\u71FE\u72B1"],
      ["ee40", "\u72BE\u7324\uFA16\u7377\u73BD\u73C9\u73D6\u73E3\u73D2\u7407\u73F5\u7426\u742A\u7429\u742E\u7462\u7489\u749F\u7501\u756F\u7682\u769C\u769E\u769B\u76A6\uFA17\u7746\u52AF\u7821\u784E\u7864\u787A\u7930\uFA18\uFA19\uFA1A\u7994\uFA1B\u799B\u7AD1\u7AE7\uFA1C\u7AEB\u7B9E\uFA1D\u7D48\u7D5C\u7DB7\u7DA0\u7DD6\u7E52\u7F47\u7FA1\uFA1E\u8301\u8362\u837F\u83C7\u83F6\u8448\u84B4\u8553\u8559"],
      ["ee80", "\u856B\uFA1F\u85B0\uFA20\uFA21\u8807\u88F5\u8A12\u8A37\u8A79\u8AA7\u8ABE\u8ADF\uFA22\u8AF6\u8B53\u8B7F\u8CF0\u8CF4\u8D12\u8D76\uFA23\u8ECF\uFA24\uFA25\u9067\u90DE\uFA26\u9115\u9127\u91DA\u91D7\u91DE\u91ED\u91EE\u91E4\u91E5\u9206\u9210\u920A\u923A\u9240\u923C\u924E\u9259\u9251\u9239\u9267\u92A7\u9277\u9278\u92E7\u92D7\u92D9\u92D0\uFA27\u92D5\u92E0\u92D3\u9325\u9321\u92FB\uFA28\u931E\u92FF\u931D\u9302\u9370\u9357\u93A4\u93C6\u93DE\u93F8\u9431\u9445\u9448\u9592\uF9DC\uFA29\u969D\u96AF\u9733\u973B\u9743\u974D\u974F\u9751\u9755\u9857\u9865\uFA2A\uFA2B\u9927\uFA2C\u999E\u9A4E\u9AD9\u9ADC\u9B75\u9B72\u9B8F\u9BB1\u9BBB\u9C00\u9D70\u9D6B\uFA2D\u9E19\u9ED1"],
      ["eeef", "\u2170", 9, "\uFFE2\uFFE4\uFF07\uFF02"],
      ["f040", "\uE000", 62],
      ["f080", "\uE03F", 124],
      ["f140", "\uE0BC", 62],
      ["f180", "\uE0FB", 124],
      ["f240", "\uE178", 62],
      ["f280", "\uE1B7", 124],
      ["f340", "\uE234", 62],
      ["f380", "\uE273", 124],
      ["f440", "\uE2F0", 62],
      ["f480", "\uE32F", 124],
      ["f540", "\uE3AC", 62],
      ["f580", "\uE3EB", 124],
      ["f640", "\uE468", 62],
      ["f680", "\uE4A7", 124],
      ["f740", "\uE524", 62],
      ["f780", "\uE563", 124],
      ["f840", "\uE5E0", 62],
      ["f880", "\uE61F", 124],
      ["f940", "\uE69C"],
      ["fa40", "\u2170", 9, "\u2160", 9, "\uFFE2\uFFE4\uFF07\uFF02\u3231\u2116\u2121\u2235\u7E8A\u891C\u9348\u9288\u84DC\u4FC9\u70BB\u6631\u68C8\u92F9\u66FB\u5F45\u4E28\u4EE1\u4EFC\u4F00\u4F03\u4F39\u4F56\u4F92\u4F8A\u4F9A\u4F94\u4FCD\u5040\u5022\u4FFF\u501E\u5046\u5070\u5042\u5094\u50F4\u50D8\u514A"],
      ["fa80", "\u5164\u519D\u51BE\u51EC\u5215\u529C\u52A6\u52C0\u52DB\u5300\u5307\u5324\u5372\u5393\u53B2\u53DD\uFA0E\u549C\u548A\u54A9\u54FF\u5586\u5759\u5765\u57AC\u57C8\u57C7\uFA0F\uFA10\u589E\u58B2\u590B\u5953\u595B\u595D\u5963\u59A4\u59BA\u5B56\u5BC0\u752F\u5BD8\u5BEC\u5C1E\u5CA6\u5CBA\u5CF5\u5D27\u5D53\uFA11\u5D42\u5D6D\u5DB8\u5DB9\u5DD0\u5F21\u5F34\u5F67\u5FB7\u5FDE\u605D\u6085\u608A\u60DE\u60D5\u6120\u60F2\u6111\u6137\u6130\u6198\u6213\u62A6\u63F5\u6460\u649D\u64CE\u654E\u6600\u6615\u663B\u6609\u662E\u661E\u6624\u6665\u6657\u6659\uFA12\u6673\u6699\u66A0\u66B2\u66BF\u66FA\u670E\uF929\u6766\u67BB\u6852\u67C0\u6801\u6844\u68CF\uFA13\u6968\uFA14\u6998\u69E2\u6A30\u6A6B\u6A46\u6A73\u6A7E\u6AE2\u6AE4\u6BD6\u6C3F\u6C5C\u6C86\u6C6F\u6CDA\u6D04\u6D87\u6D6F"],
      ["fb40", "\u6D96\u6DAC\u6DCF\u6DF8\u6DF2\u6DFC\u6E39\u6E5C\u6E27\u6E3C\u6EBF\u6F88\u6FB5\u6FF5\u7005\u7007\u7028\u7085\u70AB\u710F\u7104\u715C\u7146\u7147\uFA15\u71C1\u71FE\u72B1\u72BE\u7324\uFA16\u7377\u73BD\u73C9\u73D6\u73E3\u73D2\u7407\u73F5\u7426\u742A\u7429\u742E\u7462\u7489\u749F\u7501\u756F\u7682\u769C\u769E\u769B\u76A6\uFA17\u7746\u52AF\u7821\u784E\u7864\u787A\u7930\uFA18\uFA19"],
      ["fb80", "\uFA1A\u7994\uFA1B\u799B\u7AD1\u7AE7\uFA1C\u7AEB\u7B9E\uFA1D\u7D48\u7D5C\u7DB7\u7DA0\u7DD6\u7E52\u7F47\u7FA1\uFA1E\u8301\u8362\u837F\u83C7\u83F6\u8448\u84B4\u8553\u8559\u856B\uFA1F\u85B0\uFA20\uFA21\u8807\u88F5\u8A12\u8A37\u8A79\u8AA7\u8ABE\u8ADF\uFA22\u8AF6\u8B53\u8B7F\u8CF0\u8CF4\u8D12\u8D76\uFA23\u8ECF\uFA24\uFA25\u9067\u90DE\uFA26\u9115\u9127\u91DA\u91D7\u91DE\u91ED\u91EE\u91E4\u91E5\u9206\u9210\u920A\u923A\u9240\u923C\u924E\u9259\u9251\u9239\u9267\u92A7\u9277\u9278\u92E7\u92D7\u92D9\u92D0\uFA27\u92D5\u92E0\u92D3\u9325\u9321\u92FB\uFA28\u931E\u92FF\u931D\u9302\u9370\u9357\u93A4\u93C6\u93DE\u93F8\u9431\u9445\u9448\u9592\uF9DC\uFA29\u969D\u96AF\u9733\u973B\u9743\u974D\u974F\u9751\u9755\u9857\u9865\uFA2A\uFA2B\u9927\uFA2C\u999E\u9A4E\u9AD9"],
      ["fc40", "\u9ADC\u9B75\u9B72\u9B8F\u9BB1\u9BBB\u9C00\u9D70\u9D6B\uFA2D\u9E19\u9ED1"]
    ];
  }
});

// node_modules/iconv-lite/encodings/tables/eucjp.json
var require_eucjp = __commonJS({
  "node_modules/iconv-lite/encodings/tables/eucjp.json"(exports, module) {
    module.exports = [
      ["0", "\0", 127],
      ["8ea1", "\uFF61", 62],
      ["a1a1", "\u3000\u3001\u3002\uFF0C\uFF0E\u30FB\uFF1A\uFF1B\uFF1F\uFF01\u309B\u309C\xB4\uFF40\xA8\uFF3E\uFFE3\uFF3F\u30FD\u30FE\u309D\u309E\u3003\u4EDD\u3005\u3006\u3007\u30FC\u2015\u2010\uFF0F\uFF3C\uFF5E\u2225\uFF5C\u2026\u2025\u2018\u2019\u201C\u201D\uFF08\uFF09\u3014\u3015\uFF3B\uFF3D\uFF5B\uFF5D\u3008", 9, "\uFF0B\uFF0D\xB1\xD7\xF7\uFF1D\u2260\uFF1C\uFF1E\u2266\u2267\u221E\u2234\u2642\u2640\xB0\u2032\u2033\u2103\uFFE5\uFF04\uFFE0\uFFE1\uFF05\uFF03\uFF06\uFF0A\uFF20\xA7\u2606\u2605\u25CB\u25CF\u25CE\u25C7"],
      ["a2a1", "\u25C6\u25A1\u25A0\u25B3\u25B2\u25BD\u25BC\u203B\u3012\u2192\u2190\u2191\u2193\u3013"],
      ["a2ba", "\u2208\u220B\u2286\u2287\u2282\u2283\u222A\u2229"],
      ["a2ca", "\u2227\u2228\uFFE2\u21D2\u21D4\u2200\u2203"],
      ["a2dc", "\u2220\u22A5\u2312\u2202\u2207\u2261\u2252\u226A\u226B\u221A\u223D\u221D\u2235\u222B\u222C"],
      ["a2f2", "\u212B\u2030\u266F\u266D\u266A\u2020\u2021\xB6"],
      ["a2fe", "\u25EF"],
      ["a3b0", "\uFF10", 9],
      ["a3c1", "\uFF21", 25],
      ["a3e1", "\uFF41", 25],
      ["a4a1", "\u3041", 82],
      ["a5a1", "\u30A1", 85],
      ["a6a1", "\u0391", 16, "\u03A3", 6],
      ["a6c1", "\u03B1", 16, "\u03C3", 6],
      ["a7a1", "\u0410", 5, "\u0401\u0416", 25],
      ["a7d1", "\u0430", 5, "\u0451\u0436", 25],
      ["a8a1", "\u2500\u2502\u250C\u2510\u2518\u2514\u251C\u252C\u2524\u2534\u253C\u2501\u2503\u250F\u2513\u251B\u2517\u2523\u2533\u252B\u253B\u254B\u2520\u252F\u2528\u2537\u253F\u251D\u2530\u2525\u2538\u2542"],
      ["ada1", "\u2460", 19, "\u2160", 9],
      ["adc0", "\u3349\u3314\u3322\u334D\u3318\u3327\u3303\u3336\u3351\u3357\u330D\u3326\u3323\u332B\u334A\u333B\u339C\u339D\u339E\u338E\u338F\u33C4\u33A1"],
      ["addf", "\u337B\u301D\u301F\u2116\u33CD\u2121\u32A4", 4, "\u3231\u3232\u3239\u337E\u337D\u337C\u2252\u2261\u222B\u222E\u2211\u221A\u22A5\u2220\u221F\u22BF\u2235\u2229\u222A"],
      ["b0a1", "\u4E9C\u5516\u5A03\u963F\u54C0\u611B\u6328\u59F6\u9022\u8475\u831C\u7A50\u60AA\u63E1\u6E25\u65ED\u8466\u82A6\u9BF5\u6893\u5727\u65A1\u6271\u5B9B\u59D0\u867B\u98F4\u7D62\u7DBE\u9B8E\u6216\u7C9F\u88B7\u5B89\u5EB5\u6309\u6697\u6848\u95C7\u978D\u674F\u4EE5\u4F0A\u4F4D\u4F9D\u5049\u56F2\u5937\u59D4\u5A01\u5C09\u60DF\u610F\u6170\u6613\u6905\u70BA\u754F\u7570\u79FB\u7DAD\u7DEF\u80C3\u840E\u8863\u8B02\u9055\u907A\u533B\u4E95\u4EA5\u57DF\u80B2\u90C1\u78EF\u4E00\u58F1\u6EA2\u9038\u7A32\u8328\u828B\u9C2F\u5141\u5370\u54BD\u54E1\u56E0\u59FB\u5F15\u98F2\u6DEB\u80E4\u852D"],
      ["b1a1", "\u9662\u9670\u96A0\u97FB\u540B\u53F3\u5B87\u70CF\u7FBD\u8FC2\u96E8\u536F\u9D5C\u7ABA\u4E11\u7893\u81FC\u6E26\u5618\u5504\u6B1D\u851A\u9C3B\u59E5\u53A9\u6D66\u74DC\u958F\u5642\u4E91\u904B\u96F2\u834F\u990C\u53E1\u55B6\u5B30\u5F71\u6620\u66F3\u6804\u6C38\u6CF3\u6D29\u745B\u76C8\u7A4E\u9834\u82F1\u885B\u8A60\u92ED\u6DB2\u75AB\u76CA\u99C5\u60A6\u8B01\u8D8A\u95B2\u698E\u53AD\u5186\u5712\u5830\u5944\u5BB4\u5EF6\u6028\u63A9\u63F4\u6CBF\u6F14\u708E\u7114\u7159\u71D5\u733F\u7E01\u8276\u82D1\u8597\u9060\u925B\u9D1B\u5869\u65BC\u6C5A\u7525\u51F9\u592E\u5965\u5F80\u5FDC"],
      ["b2a1", "\u62BC\u65FA\u6A2A\u6B27\u6BB4\u738B\u7FC1\u8956\u9D2C\u9D0E\u9EC4\u5CA1\u6C96\u837B\u5104\u5C4B\u61B6\u81C6\u6876\u7261\u4E59\u4FFA\u5378\u6069\u6E29\u7A4F\u97F3\u4E0B\u5316\u4EEE\u4F55\u4F3D\u4FA1\u4F73\u52A0\u53EF\u5609\u590F\u5AC1\u5BB6\u5BE1\u79D1\u6687\u679C\u67B6\u6B4C\u6CB3\u706B\u73C2\u798D\u79BE\u7A3C\u7B87\u82B1\u82DB\u8304\u8377\u83EF\u83D3\u8766\u8AB2\u5629\u8CA8\u8FE6\u904E\u971E\u868A\u4FC4\u5CE8\u6211\u7259\u753B\u81E5\u82BD\u86FE\u8CC0\u96C5\u9913\u99D5\u4ECB\u4F1A\u89E3\u56DE\u584A\u58CA\u5EFB\u5FEB\u602A\u6094\u6062\u61D0\u6212\u62D0\u6539"],
      ["b3a1", "\u9B41\u6666\u68B0\u6D77\u7070\u754C\u7686\u7D75\u82A5\u87F9\u958B\u968E\u8C9D\u51F1\u52BE\u5916\u54B3\u5BB3\u5D16\u6168\u6982\u6DAF\u788D\u84CB\u8857\u8A72\u93A7\u9AB8\u6D6C\u99A8\u86D9\u57A3\u67FF\u86CE\u920E\u5283\u5687\u5404\u5ED3\u62E1\u64B9\u683C\u6838\u6BBB\u7372\u78BA\u7A6B\u899A\u89D2\u8D6B\u8F03\u90ED\u95A3\u9694\u9769\u5B66\u5CB3\u697D\u984D\u984E\u639B\u7B20\u6A2B\u6A7F\u68B6\u9C0D\u6F5F\u5272\u559D\u6070\u62EC\u6D3B\u6E07\u6ED1\u845B\u8910\u8F44\u4E14\u9C39\u53F6\u691B\u6A3A\u9784\u682A\u515C\u7AC3\u84B2\u91DC\u938C\u565B\u9D28\u6822\u8305\u8431"],
      ["b4a1", "\u7CA5\u5208\u82C5\u74E6\u4E7E\u4F83\u51A0\u5BD2\u520A\u52D8\u52E7\u5DFB\u559A\u582A\u59E6\u5B8C\u5B98\u5BDB\u5E72\u5E79\u60A3\u611F\u6163\u61BE\u63DB\u6562\u67D1\u6853\u68FA\u6B3E\u6B53\u6C57\u6F22\u6F97\u6F45\u74B0\u7518\u76E3\u770B\u7AFF\u7BA1\u7C21\u7DE9\u7F36\u7FF0\u809D\u8266\u839E\u89B3\u8ACC\u8CAB\u9084\u9451\u9593\u9591\u95A2\u9665\u97D3\u9928\u8218\u4E38\u542B\u5CB8\u5DCC\u73A9\u764C\u773C\u5CA9\u7FEB\u8D0B\u96C1\u9811\u9854\u9858\u4F01\u4F0E\u5371\u559C\u5668\u57FA\u5947\u5B09\u5BC4\u5C90\u5E0C\u5E7E\u5FCC\u63EE\u673A\u65D7\u65E2\u671F\u68CB\u68C4"],
      ["b5a1", "\u6A5F\u5E30\u6BC5\u6C17\u6C7D\u757F\u7948\u5B63\u7A00\u7D00\u5FBD\u898F\u8A18\u8CB4\u8D77\u8ECC\u8F1D\u98E2\u9A0E\u9B3C\u4E80\u507D\u5100\u5993\u5B9C\u622F\u6280\u64EC\u6B3A\u72A0\u7591\u7947\u7FA9\u87FB\u8ABC\u8B70\u63AC\u83CA\u97A0\u5409\u5403\u55AB\u6854\u6A58\u8A70\u7827\u6775\u9ECD\u5374\u5BA2\u811A\u8650\u9006\u4E18\u4E45\u4EC7\u4F11\u53CA\u5438\u5BAE\u5F13\u6025\u6551\u673D\u6C42\u6C72\u6CE3\u7078\u7403\u7A76\u7AAE\u7B08\u7D1A\u7CFE\u7D66\u65E7\u725B\u53BB\u5C45\u5DE8\u62D2\u62E0\u6319\u6E20\u865A\u8A31\u8DDD\u92F8\u6F01\u79A6\u9B5A\u4EA8\u4EAB\u4EAC"],
      ["b6a1", "\u4F9B\u4FA0\u50D1\u5147\u7AF6\u5171\u51F6\u5354\u5321\u537F\u53EB\u55AC\u5883\u5CE1\u5F37\u5F4A\u602F\u6050\u606D\u631F\u6559\u6A4B\u6CC1\u72C2\u72ED\u77EF\u80F8\u8105\u8208\u854E\u90F7\u93E1\u97FF\u9957\u9A5A\u4EF0\u51DD\u5C2D\u6681\u696D\u5C40\u66F2\u6975\u7389\u6850\u7C81\u50C5\u52E4\u5747\u5DFE\u9326\u65A4\u6B23\u6B3D\u7434\u7981\u79BD\u7B4B\u7DCA\u82B9\u83CC\u887F\u895F\u8B39\u8FD1\u91D1\u541F\u9280\u4E5D\u5036\u53E5\u533A\u72D7\u7396\u77E9\u82E6\u8EAF\u99C6\u99C8\u99D2\u5177\u611A\u865E\u55B0\u7A7A\u5076\u5BD3\u9047\u9685\u4E32\u6ADB\u91E7\u5C51\u5C48"],
      ["b7a1", "\u6398\u7A9F\u6C93\u9774\u8F61\u7AAA\u718A\u9688\u7C82\u6817\u7E70\u6851\u936C\u52F2\u541B\u85AB\u8A13\u7FA4\u8ECD\u90E1\u5366\u8888\u7941\u4FC2\u50BE\u5211\u5144\u5553\u572D\u73EA\u578B\u5951\u5F62\u5F84\u6075\u6176\u6167\u61A9\u63B2\u643A\u656C\u666F\u6842\u6E13\u7566\u7A3D\u7CFB\u7D4C\u7D99\u7E4B\u7F6B\u830E\u834A\u86CD\u8A08\u8A63\u8B66\u8EFD\u981A\u9D8F\u82B8\u8FCE\u9BE8\u5287\u621F\u6483\u6FC0\u9699\u6841\u5091\u6B20\u6C7A\u6F54\u7A74\u7D50\u8840\u8A23\u6708\u4EF6\u5039\u5026\u5065\u517C\u5238\u5263\u55A7\u570F\u5805\u5ACC\u5EFA\u61B2\u61F8\u62F3\u6372"],
      ["b8a1", "\u691C\u6A29\u727D\u72AC\u732E\u7814\u786F\u7D79\u770C\u80A9\u898B\u8B19\u8CE2\u8ED2\u9063\u9375\u967A\u9855\u9A13\u9E78\u5143\u539F\u53B3\u5E7B\u5F26\u6E1B\u6E90\u7384\u73FE\u7D43\u8237\u8A00\u8AFA\u9650\u4E4E\u500B\u53E4\u547C\u56FA\u59D1\u5B64\u5DF1\u5EAB\u5F27\u6238\u6545\u67AF\u6E56\u72D0\u7CCA\u88B4\u80A1\u80E1\u83F0\u864E\u8A87\u8DE8\u9237\u96C7\u9867\u9F13\u4E94\u4E92\u4F0D\u5348\u5449\u543E\u5A2F\u5F8C\u5FA1\u609F\u68A7\u6A8E\u745A\u7881\u8A9E\u8AA4\u8B77\u9190\u4E5E\u9BC9\u4EA4\u4F7C\u4FAF\u5019\u5016\u5149\u516C\u529F\u52B9\u52FE\u539A\u53E3\u5411"],
      ["b9a1", "\u540E\u5589\u5751\u57A2\u597D\u5B54\u5B5D\u5B8F\u5DE5\u5DE7\u5DF7\u5E78\u5E83\u5E9A\u5EB7\u5F18\u6052\u614C\u6297\u62D8\u63A7\u653B\u6602\u6643\u66F4\u676D\u6821\u6897\u69CB\u6C5F\u6D2A\u6D69\u6E2F\u6E9D\u7532\u7687\u786C\u7A3F\u7CE0\u7D05\u7D18\u7D5E\u7DB1\u8015\u8003\u80AF\u80B1\u8154\u818F\u822A\u8352\u884C\u8861\u8B1B\u8CA2\u8CFC\u90CA\u9175\u9271\u783F\u92FC\u95A4\u964D\u9805\u9999\u9AD8\u9D3B\u525B\u52AB\u53F7\u5408\u58D5\u62F7\u6FE0\u8C6A\u8F5F\u9EB9\u514B\u523B\u544A\u56FD\u7A40\u9177\u9D60\u9ED2\u7344\u6F09\u8170\u7511\u5FFD\u60DA\u9AA8\u72DB\u8FBC"],
      ["baa1", "\u6B64\u9803\u4ECA\u56F0\u5764\u58BE\u5A5A\u6068\u61C7\u660F\u6606\u6839\u68B1\u6DF7\u75D5\u7D3A\u826E\u9B42\u4E9B\u4F50\u53C9\u5506\u5D6F\u5DE6\u5DEE\u67FB\u6C99\u7473\u7802\u8A50\u9396\u88DF\u5750\u5EA7\u632B\u50B5\u50AC\u518D\u6700\u54C9\u585E\u59BB\u5BB0\u5F69\u624D\u63A1\u683D\u6B73\u6E08\u707D\u91C7\u7280\u7815\u7826\u796D\u658E\u7D30\u83DC\u88C1\u8F09\u969B\u5264\u5728\u6750\u7F6A\u8CA1\u51B4\u5742\u962A\u583A\u698A\u80B4\u54B2\u5D0E\u57FC\u7895\u9DFA\u4F5C\u524A\u548B\u643E\u6628\u6714\u67F5\u7A84\u7B56\u7D22\u932F\u685C\u9BAD\u7B39\u5319\u518A\u5237"],
      ["bba1", "\u5BDF\u62F6\u64AE\u64E6\u672D\u6BBA\u85A9\u96D1\u7690\u9BD6\u634C\u9306\u9BAB\u76BF\u6652\u4E09\u5098\u53C2\u5C71\u60E8\u6492\u6563\u685F\u71E6\u73CA\u7523\u7B97\u7E82\u8695\u8B83\u8CDB\u9178\u9910\u65AC\u66AB\u6B8B\u4ED5\u4ED4\u4F3A\u4F7F\u523A\u53F8\u53F2\u55E3\u56DB\u58EB\u59CB\u59C9\u59FF\u5B50\u5C4D\u5E02\u5E2B\u5FD7\u601D\u6307\u652F\u5B5C\u65AF\u65BD\u65E8\u679D\u6B62\u6B7B\u6C0F\u7345\u7949\u79C1\u7CF8\u7D19\u7D2B\u80A2\u8102\u81F3\u8996\u8A5E\u8A69\u8A66\u8A8C\u8AEE\u8CC7\u8CDC\u96CC\u98FC\u6B6F\u4E8B\u4F3C\u4F8D\u5150\u5B57\u5BFA\u6148\u6301\u6642"],
      ["bca1", "\u6B21\u6ECB\u6CBB\u723E\u74BD\u75D4\u78C1\u793A\u800C\u8033\u81EA\u8494\u8F9E\u6C50\u9E7F\u5F0F\u8B58\u9D2B\u7AFA\u8EF8\u5B8D\u96EB\u4E03\u53F1\u57F7\u5931\u5AC9\u5BA4\u6089\u6E7F\u6F06\u75BE\u8CEA\u5B9F\u8500\u7BE0\u5072\u67F4\u829D\u5C61\u854A\u7E1E\u820E\u5199\u5C04\u6368\u8D66\u659C\u716E\u793E\u7D17\u8005\u8B1D\u8ECA\u906E\u86C7\u90AA\u501F\u52FA\u5C3A\u6753\u707C\u7235\u914C\u91C8\u932B\u82E5\u5BC2\u5F31\u60F9\u4E3B\u53D6\u5B88\u624B\u6731\u6B8A\u72E9\u73E0\u7A2E\u816B\u8DA3\u9152\u9996\u5112\u53D7\u546A\u5BFF\u6388\u6A39\u7DAC\u9700\u56DA\u53CE\u5468"],
      ["bda1", "\u5B97\u5C31\u5DDE\u4FEE\u6101\u62FE\u6D32\u79C0\u79CB\u7D42\u7E4D\u7FD2\u81ED\u821F\u8490\u8846\u8972\u8B90\u8E74\u8F2F\u9031\u914B\u916C\u96C6\u919C\u4EC0\u4F4F\u5145\u5341\u5F93\u620E\u67D4\u6C41\u6E0B\u7363\u7E26\u91CD\u9283\u53D4\u5919\u5BBF\u6DD1\u795D\u7E2E\u7C9B\u587E\u719F\u51FA\u8853\u8FF0\u4FCA\u5CFB\u6625\u77AC\u7AE3\u821C\u99FF\u51C6\u5FAA\u65EC\u696F\u6B89\u6DF3\u6E96\u6F64\u76FE\u7D14\u5DE1\u9075\u9187\u9806\u51E6\u521D\u6240\u6691\u66D9\u6E1A\u5EB6\u7DD2\u7F72\u66F8\u85AF\u85F7\u8AF8\u52A9\u53D9\u5973\u5E8F\u5F90\u6055\u92E4\u9664\u50B7\u511F"],
      ["bea1", "\u52DD\u5320\u5347\u53EC\u54E8\u5546\u5531\u5617\u5968\u59BE\u5A3C\u5BB5\u5C06\u5C0F\u5C11\u5C1A\u5E84\u5E8A\u5EE0\u5F70\u627F\u6284\u62DB\u638C\u6377\u6607\u660C\u662D\u6676\u677E\u68A2\u6A1F\u6A35\u6CBC\u6D88\u6E09\u6E58\u713C\u7126\u7167\u75C7\u7701\u785D\u7901\u7965\u79F0\u7AE0\u7B11\u7CA7\u7D39\u8096\u83D6\u848B\u8549\u885D\u88F3\u8A1F\u8A3C\u8A54\u8A73\u8C61\u8CDE\u91A4\u9266\u937E\u9418\u969C\u9798\u4E0A\u4E08\u4E1E\u4E57\u5197\u5270\u57CE\u5834\u58CC\u5B22\u5E38\u60C5\u64FE\u6761\u6756\u6D44\u72B6\u7573\u7A63\u84B8\u8B72\u91B8\u9320\u5631\u57F4\u98FE"],
      ["bfa1", "\u62ED\u690D\u6B96\u71ED\u7E54\u8077\u8272\u89E6\u98DF\u8755\u8FB1\u5C3B\u4F38\u4FE1\u4FB5\u5507\u5A20\u5BDD\u5BE9\u5FC3\u614E\u632F\u65B0\u664B\u68EE\u699B\u6D78\u6DF1\u7533\u75B9\u771F\u795E\u79E6\u7D33\u81E3\u82AF\u85AA\u89AA\u8A3A\u8EAB\u8F9B\u9032\u91DD\u9707\u4EBA\u4EC1\u5203\u5875\u58EC\u5C0B\u751A\u5C3D\u814E\u8A0A\u8FC5\u9663\u976D\u7B25\u8ACF\u9808\u9162\u56F3\u53A8\u9017\u5439\u5782\u5E25\u63A8\u6C34\u708A\u7761\u7C8B\u7FE0\u8870\u9042\u9154\u9310\u9318\u968F\u745E\u9AC4\u5D07\u5D69\u6570\u67A2\u8DA8\u96DB\u636E\u6749\u6919\u83C5\u9817\u96C0\u88FE"],
      ["c0a1", "\u6F84\u647A\u5BF8\u4E16\u702C\u755D\u662F\u51C4\u5236\u52E2\u59D3\u5F81\u6027\u6210\u653F\u6574\u661F\u6674\u68F2\u6816\u6B63\u6E05\u7272\u751F\u76DB\u7CBE\u8056\u58F0\u88FD\u897F\u8AA0\u8A93\u8ACB\u901D\u9192\u9752\u9759\u6589\u7A0E\u8106\u96BB\u5E2D\u60DC\u621A\u65A5\u6614\u6790\u77F3\u7A4D\u7C4D\u7E3E\u810A\u8CAC\u8D64\u8DE1\u8E5F\u78A9\u5207\u62D9\u63A5\u6442\u6298\u8A2D\u7A83\u7BC0\u8AAC\u96EA\u7D76\u820C\u8749\u4ED9\u5148\u5343\u5360\u5BA3\u5C02\u5C16\u5DDD\u6226\u6247\u64B0\u6813\u6834\u6CC9\u6D45\u6D17\u67D3\u6F5C\u714E\u717D\u65CB\u7A7F\u7BAD\u7DDA"],
      ["c1a1", "\u7E4A\u7FA8\u817A\u821B\u8239\u85A6\u8A6E\u8CCE\u8DF5\u9078\u9077\u92AD\u9291\u9583\u9BAE\u524D\u5584\u6F38\u7136\u5168\u7985\u7E55\u81B3\u7CCE\u564C\u5851\u5CA8\u63AA\u66FE\u66FD\u695A\u72D9\u758F\u758E\u790E\u7956\u79DF\u7C97\u7D20\u7D44\u8607\u8A34\u963B\u9061\u9F20\u50E7\u5275\u53CC\u53E2\u5009\u55AA\u58EE\u594F\u723D\u5B8B\u5C64\u531D\u60E3\u60F3\u635C\u6383\u633F\u63BB\u64CD\u65E9\u66F9\u5DE3\u69CD\u69FD\u6F15\u71E5\u4E89\u75E9\u76F8\u7A93\u7CDF\u7DCF\u7D9C\u8061\u8349\u8358\u846C\u84BC\u85FB\u88C5\u8D70\u9001\u906D\u9397\u971C\u9A12\u50CF\u5897\u618E"],
      ["c2a1", "\u81D3\u8535\u8D08\u9020\u4FC3\u5074\u5247\u5373\u606F\u6349\u675F\u6E2C\u8DB3\u901F\u4FD7\u5C5E\u8CCA\u65CF\u7D9A\u5352\u8896\u5176\u63C3\u5B58\u5B6B\u5C0A\u640D\u6751\u905C\u4ED6\u591A\u592A\u6C70\u8A51\u553E\u5815\u59A5\u60F0\u6253\u67C1\u8235\u6955\u9640\u99C4\u9A28\u4F53\u5806\u5BFE\u8010\u5CB1\u5E2F\u5F85\u6020\u614B\u6234\u66FF\u6CF0\u6EDE\u80CE\u817F\u82D4\u888B\u8CB8\u9000\u902E\u968A\u9EDB\u9BDB\u4EE3\u53F0\u5927\u7B2C\u918D\u984C\u9DF9\u6EDD\u7027\u5353\u5544\u5B85\u6258\u629E\u62D3\u6CA2\u6FEF\u7422\u8A17\u9438\u6FC1\u8AFE\u8338\u51E7\u86F8\u53EA"],
      ["c3a1", "\u53E9\u4F46\u9054\u8FB0\u596A\u8131\u5DFD\u7AEA\u8FBF\u68DA\u8C37\u72F8\u9C48\u6A3D\u8AB0\u4E39\u5358\u5606\u5766\u62C5\u63A2\u65E6\u6B4E\u6DE1\u6E5B\u70AD\u77ED\u7AEF\u7BAA\u7DBB\u803D\u80C6\u86CB\u8A95\u935B\u56E3\u58C7\u5F3E\u65AD\u6696\u6A80\u6BB5\u7537\u8AC7\u5024\u77E5\u5730\u5F1B\u6065\u667A\u6C60\u75F4\u7A1A\u7F6E\u81F4\u8718\u9045\u99B3\u7BC9\u755C\u7AF9\u7B51\u84C4\u9010\u79E9\u7A92\u8336\u5AE1\u7740\u4E2D\u4EF2\u5B99\u5FE0\u62BD\u663C\u67F1\u6CE8\u866B\u8877\u8A3B\u914E\u92F3\u99D0\u6A17\u7026\u732A\u82E7\u8457\u8CAF\u4E01\u5146\u51CB\u558B\u5BF5"],
      ["c4a1", "\u5E16\u5E33\u5E81\u5F14\u5F35\u5F6B\u5FB4\u61F2\u6311\u66A2\u671D\u6F6E\u7252\u753A\u773A\u8074\u8139\u8178\u8776\u8ABF\u8ADC\u8D85\u8DF3\u929A\u9577\u9802\u9CE5\u52C5\u6357\u76F4\u6715\u6C88\u73CD\u8CC3\u93AE\u9673\u6D25\u589C\u690E\u69CC\u8FFD\u939A\u75DB\u901A\u585A\u6802\u63B4\u69FB\u4F43\u6F2C\u67D8\u8FBB\u8526\u7DB4\u9354\u693F\u6F70\u576A\u58F7\u5B2C\u7D2C\u722A\u540A\u91E3\u9DB4\u4EAD\u4F4E\u505C\u5075\u5243\u8C9E\u5448\u5824\u5B9A\u5E1D\u5E95\u5EAD\u5EF7\u5F1F\u608C\u62B5\u633A\u63D0\u68AF\u6C40\u7887\u798E\u7A0B\u7DE0\u8247\u8A02\u8AE6\u8E44\u9013"],
      ["c5a1", "\u90B8\u912D\u91D8\u9F0E\u6CE5\u6458\u64E2\u6575\u6EF4\u7684\u7B1B\u9069\u93D1\u6EBA\u54F2\u5FB9\u64A4\u8F4D\u8FED\u9244\u5178\u586B\u5929\u5C55\u5E97\u6DFB\u7E8F\u751C\u8CBC\u8EE2\u985B\u70B9\u4F1D\u6BBF\u6FB1\u7530\u96FB\u514E\u5410\u5835\u5857\u59AC\u5C60\u5F92\u6597\u675C\u6E21\u767B\u83DF\u8CED\u9014\u90FD\u934D\u7825\u783A\u52AA\u5EA6\u571F\u5974\u6012\u5012\u515A\u51AC\u51CD\u5200\u5510\u5854\u5858\u5957\u5B95\u5CF6\u5D8B\u60BC\u6295\u642D\u6771\u6843\u68BC\u68DF\u76D7\u6DD8\u6E6F\u6D9B\u706F\u71C8\u5F53\u75D8\u7977\u7B49\u7B54\u7B52\u7CD6\u7D71\u5230"],
      ["c6a1", "\u8463\u8569\u85E4\u8A0E\u8B04\u8C46\u8E0F\u9003\u900F\u9419\u9676\u982D\u9A30\u95D8\u50CD\u52D5\u540C\u5802\u5C0E\u61A7\u649E\u6D1E\u77B3\u7AE5\u80F4\u8404\u9053\u9285\u5CE0\u9D07\u533F\u5F97\u5FB3\u6D9C\u7279\u7763\u79BF\u7BE4\u6BD2\u72EC\u8AAD\u6803\u6A61\u51F8\u7A81\u6934\u5C4A\u9CF6\u82EB\u5BC5\u9149\u701E\u5678\u5C6F\u60C7\u6566\u6C8C\u8C5A\u9041\u9813\u5451\u66C7\u920D\u5948\u90A3\u5185\u4E4D\u51EA\u8599\u8B0E\u7058\u637A\u934B\u6962\u99B4\u7E04\u7577\u5357\u6960\u8EDF\u96E3\u6C5D\u4E8C\u5C3C\u5F10\u8FE9\u5302\u8CD1\u8089\u8679\u5EFF\u65E5\u4E73\u5165"],
      ["c7a1", "\u5982\u5C3F\u97EE\u4EFB\u598A\u5FCD\u8A8D\u6FE1\u79B0\u7962\u5BE7\u8471\u732B\u71B1\u5E74\u5FF5\u637B\u649A\u71C3\u7C98\u4E43\u5EFC\u4E4B\u57DC\u56A2\u60A9\u6FC3\u7D0D\u80FD\u8133\u81BF\u8FB2\u8997\u86A4\u5DF4\u628A\u64AD\u8987\u6777\u6CE2\u6D3E\u7436\u7834\u5A46\u7F75\u82AD\u99AC\u4FF3\u5EC3\u62DD\u6392\u6557\u676F\u76C3\u724C\u80CC\u80BA\u8F29\u914D\u500D\u57F9\u5A92\u6885\u6973\u7164\u72FD\u8CB7\u58F2\u8CE0\u966A\u9019\u877F\u79E4\u77E7\u8429\u4F2F\u5265\u535A\u62CD\u67CF\u6CCA\u767D\u7B94\u7C95\u8236\u8584\u8FEB\u66DD\u6F20\u7206\u7E1B\u83AB\u99C1\u9EA6"],
      ["c8a1", "\u51FD\u7BB1\u7872\u7BB8\u8087\u7B48\u6AE8\u5E61\u808C\u7551\u7560\u516B\u9262\u6E8C\u767A\u9197\u9AEA\u4F10\u7F70\u629C\u7B4F\u95A5\u9CE9\u567A\u5859\u86E4\u96BC\u4F34\u5224\u534A\u53CD\u53DB\u5E06\u642C\u6591\u677F\u6C3E\u6C4E\u7248\u72AF\u73ED\u7554\u7E41\u822C\u85E9\u8CA9\u7BC4\u91C6\u7169\u9812\u98EF\u633D\u6669\u756A\u76E4\u78D0\u8543\u86EE\u532A\u5351\u5426\u5983\u5E87\u5F7C\u60B2\u6249\u6279\u62AB\u6590\u6BD4\u6CCC\u75B2\u76AE\u7891\u79D8\u7DCB\u7F77\u80A5\u88AB\u8AB9\u8CBB\u907F\u975E\u98DB\u6A0B\u7C38\u5099\u5C3E\u5FAE\u6787\u6BD8\u7435\u7709\u7F8E"],
      ["c9a1", "\u9F3B\u67CA\u7A17\u5339\u758B\u9AED\u5F66\u819D\u83F1\u8098\u5F3C\u5FC5\u7562\u7B46\u903C\u6867\u59EB\u5A9B\u7D10\u767E\u8B2C\u4FF5\u5F6A\u6A19\u6C37\u6F02\u74E2\u7968\u8868\u8A55\u8C79\u5EDF\u63CF\u75C5\u79D2\u82D7\u9328\u92F2\u849C\u86ED\u9C2D\u54C1\u5F6C\u658C\u6D5C\u7015\u8CA7\u8CD3\u983B\u654F\u74F6\u4E0D\u4ED8\u57E0\u592B\u5A66\u5BCC\u51A8\u5E03\u5E9C\u6016\u6276\u6577\u65A7\u666E\u6D6E\u7236\u7B26\u8150\u819A\u8299\u8B5C\u8CA0\u8CE6\u8D74\u961C\u9644\u4FAE\u64AB\u6B66\u821E\u8461\u856A\u90E8\u5C01\u6953\u98A8\u847A\u8557\u4F0F\u526F\u5FA9\u5E45\u670D"],
      ["caa1", "\u798F\u8179\u8907\u8986\u6DF5\u5F17\u6255\u6CB8\u4ECF\u7269\u9B92\u5206\u543B\u5674\u58B3\u61A4\u626E\u711A\u596E\u7C89\u7CDE\u7D1B\u96F0\u6587\u805E\u4E19\u4F75\u5175\u5840\u5E63\u5E73\u5F0A\u67C4\u4E26\u853D\u9589\u965B\u7C73\u9801\u50FB\u58C1\u7656\u78A7\u5225\u77A5\u8511\u7B86\u504F\u5909\u7247\u7BC7\u7DE8\u8FBA\u8FD4\u904D\u4FBF\u52C9\u5A29\u5F01\u97AD\u4FDD\u8217\u92EA\u5703\u6355\u6B69\u752B\u88DC\u8F14\u7A42\u52DF\u5893\u6155\u620A\u66AE\u6BCD\u7C3F\u83E9\u5023\u4FF8\u5305\u5446\u5831\u5949\u5B9D\u5CF0\u5CEF\u5D29\u5E96\u62B1\u6367\u653E\u65B9\u670B"],
      ["cba1", "\u6CD5\u6CE1\u70F9\u7832\u7E2B\u80DE\u82B3\u840C\u84EC\u8702\u8912\u8A2A\u8C4A\u90A6\u92D2\u98FD\u9CF3\u9D6C\u4E4F\u4EA1\u508D\u5256\u574A\u59A8\u5E3D\u5FD8\u5FD9\u623F\u66B4\u671B\u67D0\u68D2\u5192\u7D21\u80AA\u81A8\u8B00\u8C8C\u8CBF\u927E\u9632\u5420\u982C\u5317\u50D5\u535C\u58A8\u64B2\u6734\u7267\u7766\u7A46\u91E6\u52C3\u6CA1\u6B86\u5800\u5E4C\u5954\u672C\u7FFB\u51E1\u76C6\u6469\u78E8\u9B54\u9EBB\u57CB\u59B9\u6627\u679A\u6BCE\u54E9\u69D9\u5E55\u819C\u6795\u9BAA\u67FE\u9C52\u685D\u4EA6\u4FE3\u53C8\u62B9\u672B\u6CAB\u8FC4\u4FAD\u7E6D\u9EBF\u4E07\u6162\u6E80"],
      ["cca1", "\u6F2B\u8513\u5473\u672A\u9B45\u5DF3\u7B95\u5CAC\u5BC6\u871C\u6E4A\u84D1\u7A14\u8108\u5999\u7C8D\u6C11\u7720\u52D9\u5922\u7121\u725F\u77DB\u9727\u9D61\u690B\u5A7F\u5A18\u51A5\u540D\u547D\u660E\u76DF\u8FF7\u9298\u9CF4\u59EA\u725D\u6EC5\u514D\u68C9\u7DBF\u7DEC\u9762\u9EBA\u6478\u6A21\u8302\u5984\u5B5F\u6BDB\u731B\u76F2\u7DB2\u8017\u8499\u5132\u6728\u9ED9\u76EE\u6762\u52FF\u9905\u5C24\u623B\u7C7E\u8CB0\u554F\u60B6\u7D0B\u9580\u5301\u4E5F\u51B6\u591C\u723A\u8036\u91CE\u5F25\u77E2\u5384\u5F79\u7D04\u85AC\u8A33\u8E8D\u9756\u67F3\u85AE\u9453\u6109\u6108\u6CB9\u7652"],
      ["cda1", "\u8AED\u8F38\u552F\u4F51\u512A\u52C7\u53CB\u5BA5\u5E7D\u60A0\u6182\u63D6\u6709\u67DA\u6E67\u6D8C\u7336\u7337\u7531\u7950\u88D5\u8A98\u904A\u9091\u90F5\u96C4\u878D\u5915\u4E88\u4F59\u4E0E\u8A89\u8F3F\u9810\u50AD\u5E7C\u5996\u5BB9\u5EB8\u63DA\u63FA\u64C1\u66DC\u694A\u69D8\u6D0B\u6EB6\u7194\u7528\u7AAF\u7F8A\u8000\u8449\u84C9\u8981\u8B21\u8E0A\u9065\u967D\u990A\u617E\u6291\u6B32\u6C83\u6D74\u7FCC\u7FFC\u6DC0\u7F85\u87BA\u88F8\u6765\u83B1\u983C\u96F7\u6D1B\u7D61\u843D\u916A\u4E71\u5375\u5D50\u6B04\u6FEB\u85CD\u862D\u89A7\u5229\u540F\u5C65\u674E\u68A8\u7406\u7483"],
      ["cea1", "\u75E2\u88CF\u88E1\u91CC\u96E2\u9678\u5F8B\u7387\u7ACB\u844E\u63A0\u7565\u5289\u6D41\u6E9C\u7409\u7559\u786B\u7C92\u9686\u7ADC\u9F8D\u4FB6\u616E\u65C5\u865C\u4E86\u4EAE\u50DA\u4E21\u51CC\u5BEE\u6599\u6881\u6DBC\u731F\u7642\u77AD\u7A1C\u7CE7\u826F\u8AD2\u907C\u91CF\u9675\u9818\u529B\u7DD1\u502B\u5398\u6797\u6DCB\u71D0\u7433\u81E8\u8F2A\u96A3\u9C57\u9E9F\u7460\u5841\u6D99\u7D2F\u985E\u4EE4\u4F36\u4F8B\u51B7\u52B1\u5DBA\u601C\u73B2\u793C\u82D3\u9234\u96B7\u96F6\u970A\u9E97\u9F62\u66A6\u6B74\u5217\u52A3\u70C8\u88C2\u5EC9\u604B\u6190\u6F23\u7149\u7C3E\u7DF4\u806F"],
      ["cfa1", "\u84EE\u9023\u932C\u5442\u9B6F\u6AD3\u7089\u8CC2\u8DEF\u9732\u52B4\u5A41\u5ECA\u5F04\u6717\u697C\u6994\u6D6A\u6F0F\u7262\u72FC\u7BED\u8001\u807E\u874B\u90CE\u516D\u9E93\u7984\u808B\u9332\u8AD6\u502D\u548C\u8A71\u6B6A\u8CC4\u8107\u60D1\u67A0\u9DF2\u4E99\u4E98\u9C10\u8A6B\u85C1\u8568\u6900\u6E7E\u7897\u8155"],
      ["d0a1", "\u5F0C\u4E10\u4E15\u4E2A\u4E31\u4E36\u4E3C\u4E3F\u4E42\u4E56\u4E58\u4E82\u4E85\u8C6B\u4E8A\u8212\u5F0D\u4E8E\u4E9E\u4E9F\u4EA0\u4EA2\u4EB0\u4EB3\u4EB6\u4ECE\u4ECD\u4EC4\u4EC6\u4EC2\u4ED7\u4EDE\u4EED\u4EDF\u4EF7\u4F09\u4F5A\u4F30\u4F5B\u4F5D\u4F57\u4F47\u4F76\u4F88\u4F8F\u4F98\u4F7B\u4F69\u4F70\u4F91\u4F6F\u4F86\u4F96\u5118\u4FD4\u4FDF\u4FCE\u4FD8\u4FDB\u4FD1\u4FDA\u4FD0\u4FE4\u4FE5\u501A\u5028\u5014\u502A\u5025\u5005\u4F1C\u4FF6\u5021\u5029\u502C\u4FFE\u4FEF\u5011\u5006\u5043\u5047\u6703\u5055\u5050\u5048\u505A\u5056\u506C\u5078\u5080\u509A\u5085\u50B4\u50B2"],
      ["d1a1", "\u50C9\u50CA\u50B3\u50C2\u50D6\u50DE\u50E5\u50ED\u50E3\u50EE\u50F9\u50F5\u5109\u5101\u5102\u5116\u5115\u5114\u511A\u5121\u513A\u5137\u513C\u513B\u513F\u5140\u5152\u514C\u5154\u5162\u7AF8\u5169\u516A\u516E\u5180\u5182\u56D8\u518C\u5189\u518F\u5191\u5193\u5195\u5196\u51A4\u51A6\u51A2\u51A9\u51AA\u51AB\u51B3\u51B1\u51B2\u51B0\u51B5\u51BD\u51C5\u51C9\u51DB\u51E0\u8655\u51E9\u51ED\u51F0\u51F5\u51FE\u5204\u520B\u5214\u520E\u5227\u522A\u522E\u5233\u5239\u524F\u5244\u524B\u524C\u525E\u5254\u526A\u5274\u5269\u5273\u527F\u527D\u528D\u5294\u5292\u5271\u5288\u5291\u8FA8"],
      ["d2a1", "\u8FA7\u52AC\u52AD\u52BC\u52B5\u52C1\u52CD\u52D7\u52DE\u52E3\u52E6\u98ED\u52E0\u52F3\u52F5\u52F8\u52F9\u5306\u5308\u7538\u530D\u5310\u530F\u5315\u531A\u5323\u532F\u5331\u5333\u5338\u5340\u5346\u5345\u4E17\u5349\u534D\u51D6\u535E\u5369\u536E\u5918\u537B\u5377\u5382\u5396\u53A0\u53A6\u53A5\u53AE\u53B0\u53B6\u53C3\u7C12\u96D9\u53DF\u66FC\u71EE\u53EE\u53E8\u53ED\u53FA\u5401\u543D\u5440\u542C\u542D\u543C\u542E\u5436\u5429\u541D\u544E\u548F\u5475\u548E\u545F\u5471\u5477\u5470\u5492\u547B\u5480\u5476\u5484\u5490\u5486\u54C7\u54A2\u54B8\u54A5\u54AC\u54C4\u54C8\u54A8"],
      ["d3a1", "\u54AB\u54C2\u54A4\u54BE\u54BC\u54D8\u54E5\u54E6\u550F\u5514\u54FD\u54EE\u54ED\u54FA\u54E2\u5539\u5540\u5563\u554C\u552E\u555C\u5545\u5556\u5557\u5538\u5533\u555D\u5599\u5580\u54AF\u558A\u559F\u557B\u557E\u5598\u559E\u55AE\u557C\u5583\u55A9\u5587\u55A8\u55DA\u55C5\u55DF\u55C4\u55DC\u55E4\u55D4\u5614\u55F7\u5616\u55FE\u55FD\u561B\u55F9\u564E\u5650\u71DF\u5634\u5636\u5632\u5638\u566B\u5664\u562F\u566C\u566A\u5686\u5680\u568A\u56A0\u5694\u568F\u56A5\u56AE\u56B6\u56B4\u56C2\u56BC\u56C1\u56C3\u56C0\u56C8\u56CE\u56D1\u56D3\u56D7\u56EE\u56F9\u5700\u56FF\u5704\u5709"],
      ["d4a1", "\u5708\u570B\u570D\u5713\u5718\u5716\u55C7\u571C\u5726\u5737\u5738\u574E\u573B\u5740\u574F\u5769\u57C0\u5788\u5761\u577F\u5789\u5793\u57A0\u57B3\u57A4\u57AA\u57B0\u57C3\u57C6\u57D4\u57D2\u57D3\u580A\u57D6\u57E3\u580B\u5819\u581D\u5872\u5821\u5862\u584B\u5870\u6BC0\u5852\u583D\u5879\u5885\u58B9\u589F\u58AB\u58BA\u58DE\u58BB\u58B8\u58AE\u58C5\u58D3\u58D1\u58D7\u58D9\u58D8\u58E5\u58DC\u58E4\u58DF\u58EF\u58FA\u58F9\u58FB\u58FC\u58FD\u5902\u590A\u5910\u591B\u68A6\u5925\u592C\u592D\u5932\u5938\u593E\u7AD2\u5955\u5950\u594E\u595A\u5958\u5962\u5960\u5967\u596C\u5969"],
      ["d5a1", "\u5978\u5981\u599D\u4F5E\u4FAB\u59A3\u59B2\u59C6\u59E8\u59DC\u598D\u59D9\u59DA\u5A25\u5A1F\u5A11\u5A1C\u5A09\u5A1A\u5A40\u5A6C\u5A49\u5A35\u5A36\u5A62\u5A6A\u5A9A\u5ABC\u5ABE\u5ACB\u5AC2\u5ABD\u5AE3\u5AD7\u5AE6\u5AE9\u5AD6\u5AFA\u5AFB\u5B0C\u5B0B\u5B16\u5B32\u5AD0\u5B2A\u5B36\u5B3E\u5B43\u5B45\u5B40\u5B51\u5B55\u5B5A\u5B5B\u5B65\u5B69\u5B70\u5B73\u5B75\u5B78\u6588\u5B7A\u5B80\u5B83\u5BA6\u5BB8\u5BC3\u5BC7\u5BC9\u5BD4\u5BD0\u5BE4\u5BE6\u5BE2\u5BDE\u5BE5\u5BEB\u5BF0\u5BF6\u5BF3\u5C05\u5C07\u5C08\u5C0D\u5C13\u5C20\u5C22\u5C28\u5C38\u5C39\u5C41\u5C46\u5C4E\u5C53"],
      ["d6a1", "\u5C50\u5C4F\u5B71\u5C6C\u5C6E\u4E62\u5C76\u5C79\u5C8C\u5C91\u5C94\u599B\u5CAB\u5CBB\u5CB6\u5CBC\u5CB7\u5CC5\u5CBE\u5CC7\u5CD9\u5CE9\u5CFD\u5CFA\u5CED\u5D8C\u5CEA\u5D0B\u5D15\u5D17\u5D5C\u5D1F\u5D1B\u5D11\u5D14\u5D22\u5D1A\u5D19\u5D18\u5D4C\u5D52\u5D4E\u5D4B\u5D6C\u5D73\u5D76\u5D87\u5D84\u5D82\u5DA2\u5D9D\u5DAC\u5DAE\u5DBD\u5D90\u5DB7\u5DBC\u5DC9\u5DCD\u5DD3\u5DD2\u5DD6\u5DDB\u5DEB\u5DF2\u5DF5\u5E0B\u5E1A\u5E19\u5E11\u5E1B\u5E36\u5E37\u5E44\u5E43\u5E40\u5E4E\u5E57\u5E54\u5E5F\u5E62\u5E64\u5E47\u5E75\u5E76\u5E7A\u9EBC\u5E7F\u5EA0\u5EC1\u5EC2\u5EC8\u5ED0\u5ECF"],
      ["d7a1", "\u5ED6\u5EE3\u5EDD\u5EDA\u5EDB\u5EE2\u5EE1\u5EE8\u5EE9\u5EEC\u5EF1\u5EF3\u5EF0\u5EF4\u5EF8\u5EFE\u5F03\u5F09\u5F5D\u5F5C\u5F0B\u5F11\u5F16\u5F29\u5F2D\u5F38\u5F41\u5F48\u5F4C\u5F4E\u5F2F\u5F51\u5F56\u5F57\u5F59\u5F61\u5F6D\u5F73\u5F77\u5F83\u5F82\u5F7F\u5F8A\u5F88\u5F91\u5F87\u5F9E\u5F99\u5F98\u5FA0\u5FA8\u5FAD\u5FBC\u5FD6\u5FFB\u5FE4\u5FF8\u5FF1\u5FDD\u60B3\u5FFF\u6021\u6060\u6019\u6010\u6029\u600E\u6031\u601B\u6015\u602B\u6026\u600F\u603A\u605A\u6041\u606A\u6077\u605F\u604A\u6046\u604D\u6063\u6043\u6064\u6042\u606C\u606B\u6059\u6081\u608D\u60E7\u6083\u609A"],
      ["d8a1", "\u6084\u609B\u6096\u6097\u6092\u60A7\u608B\u60E1\u60B8\u60E0\u60D3\u60B4\u5FF0\u60BD\u60C6\u60B5\u60D8\u614D\u6115\u6106\u60F6\u60F7\u6100\u60F4\u60FA\u6103\u6121\u60FB\u60F1\u610D\u610E\u6147\u613E\u6128\u6127\u614A\u613F\u613C\u612C\u6134\u613D\u6142\u6144\u6173\u6177\u6158\u6159\u615A\u616B\u6174\u616F\u6165\u6171\u615F\u615D\u6153\u6175\u6199\u6196\u6187\u61AC\u6194\u619A\u618A\u6191\u61AB\u61AE\u61CC\u61CA\u61C9\u61F7\u61C8\u61C3\u61C6\u61BA\u61CB\u7F79\u61CD\u61E6\u61E3\u61F6\u61FA\u61F4\u61FF\u61FD\u61FC\u61FE\u6200\u6208\u6209\u620D\u620C\u6214\u621B"],
      ["d9a1", "\u621E\u6221\u622A\u622E\u6230\u6232\u6233\u6241\u624E\u625E\u6263\u625B\u6260\u6268\u627C\u6282\u6289\u627E\u6292\u6293\u6296\u62D4\u6283\u6294\u62D7\u62D1\u62BB\u62CF\u62FF\u62C6\u64D4\u62C8\u62DC\u62CC\u62CA\u62C2\u62C7\u629B\u62C9\u630C\u62EE\u62F1\u6327\u6302\u6308\u62EF\u62F5\u6350\u633E\u634D\u641C\u634F\u6396\u638E\u6380\u63AB\u6376\u63A3\u638F\u6389\u639F\u63B5\u636B\u6369\u63BE\u63E9\u63C0\u63C6\u63E3\u63C9\u63D2\u63F6\u63C4\u6416\u6434\u6406\u6413\u6426\u6436\u651D\u6417\u6428\u640F\u6467\u646F\u6476\u644E\u652A\u6495\u6493\u64A5\u64A9\u6488\u64BC"],
      ["daa1", "\u64DA\u64D2\u64C5\u64C7\u64BB\u64D8\u64C2\u64F1\u64E7\u8209\u64E0\u64E1\u62AC\u64E3\u64EF\u652C\u64F6\u64F4\u64F2\u64FA\u6500\u64FD\u6518\u651C\u6505\u6524\u6523\u652B\u6534\u6535\u6537\u6536\u6538\u754B\u6548\u6556\u6555\u654D\u6558\u655E\u655D\u6572\u6578\u6582\u6583\u8B8A\u659B\u659F\u65AB\u65B7\u65C3\u65C6\u65C1\u65C4\u65CC\u65D2\u65DB\u65D9\u65E0\u65E1\u65F1\u6772\u660A\u6603\u65FB\u6773\u6635\u6636\u6634\u661C\u664F\u6644\u6649\u6641\u665E\u665D\u6664\u6667\u6668\u665F\u6662\u6670\u6683\u6688\u668E\u6689\u6684\u6698\u669D\u66C1\u66B9\u66C9\u66BE\u66BC"],
      ["dba1", "\u66C4\u66B8\u66D6\u66DA\u66E0\u663F\u66E6\u66E9\u66F0\u66F5\u66F7\u670F\u6716\u671E\u6726\u6727\u9738\u672E\u673F\u6736\u6741\u6738\u6737\u6746\u675E\u6760\u6759\u6763\u6764\u6789\u6770\u67A9\u677C\u676A\u678C\u678B\u67A6\u67A1\u6785\u67B7\u67EF\u67B4\u67EC\u67B3\u67E9\u67B8\u67E4\u67DE\u67DD\u67E2\u67EE\u67B9\u67CE\u67C6\u67E7\u6A9C\u681E\u6846\u6829\u6840\u684D\u6832\u684E\u68B3\u682B\u6859\u6863\u6877\u687F\u689F\u688F\u68AD\u6894\u689D\u689B\u6883\u6AAE\u68B9\u6874\u68B5\u68A0\u68BA\u690F\u688D\u687E\u6901\u68CA\u6908\u68D8\u6922\u6926\u68E1\u690C\u68CD"],
      ["dca1", "\u68D4\u68E7\u68D5\u6936\u6912\u6904\u68D7\u68E3\u6925\u68F9\u68E0\u68EF\u6928\u692A\u691A\u6923\u6921\u68C6\u6979\u6977\u695C\u6978\u696B\u6954\u697E\u696E\u6939\u6974\u693D\u6959\u6930\u6961\u695E\u695D\u6981\u696A\u69B2\u69AE\u69D0\u69BF\u69C1\u69D3\u69BE\u69CE\u5BE8\u69CA\u69DD\u69BB\u69C3\u69A7\u6A2E\u6991\u69A0\u699C\u6995\u69B4\u69DE\u69E8\u6A02\u6A1B\u69FF\u6B0A\u69F9\u69F2\u69E7\u6A05\u69B1\u6A1E\u69ED\u6A14\u69EB\u6A0A\u6A12\u6AC1\u6A23\u6A13\u6A44\u6A0C\u6A72\u6A36\u6A78\u6A47\u6A62\u6A59\u6A66\u6A48\u6A38\u6A22\u6A90\u6A8D\u6AA0\u6A84\u6AA2\u6AA3"],
      ["dda1", "\u6A97\u8617\u6ABB\u6AC3\u6AC2\u6AB8\u6AB3\u6AAC\u6ADE\u6AD1\u6ADF\u6AAA\u6ADA\u6AEA\u6AFB\u6B05\u8616\u6AFA\u6B12\u6B16\u9B31\u6B1F\u6B38\u6B37\u76DC\u6B39\u98EE\u6B47\u6B43\u6B49\u6B50\u6B59\u6B54\u6B5B\u6B5F\u6B61\u6B78\u6B79\u6B7F\u6B80\u6B84\u6B83\u6B8D\u6B98\u6B95\u6B9E\u6BA4\u6BAA\u6BAB\u6BAF\u6BB2\u6BB1\u6BB3\u6BB7\u6BBC\u6BC6\u6BCB\u6BD3\u6BDF\u6BEC\u6BEB\u6BF3\u6BEF\u9EBE\u6C08\u6C13\u6C14\u6C1B\u6C24\u6C23\u6C5E\u6C55\u6C62\u6C6A\u6C82\u6C8D\u6C9A\u6C81\u6C9B\u6C7E\u6C68\u6C73\u6C92\u6C90\u6CC4\u6CF1\u6CD3\u6CBD\u6CD7\u6CC5\u6CDD\u6CAE\u6CB1\u6CBE"],
      ["dea1", "\u6CBA\u6CDB\u6CEF\u6CD9\u6CEA\u6D1F\u884D\u6D36\u6D2B\u6D3D\u6D38\u6D19\u6D35\u6D33\u6D12\u6D0C\u6D63\u6D93\u6D64\u6D5A\u6D79\u6D59\u6D8E\u6D95\u6FE4\u6D85\u6DF9\u6E15\u6E0A\u6DB5\u6DC7\u6DE6\u6DB8\u6DC6\u6DEC\u6DDE\u6DCC\u6DE8\u6DD2\u6DC5\u6DFA\u6DD9\u6DE4\u6DD5\u6DEA\u6DEE\u6E2D\u6E6E\u6E2E\u6E19\u6E72\u6E5F\u6E3E\u6E23\u6E6B\u6E2B\u6E76\u6E4D\u6E1F\u6E43\u6E3A\u6E4E\u6E24\u6EFF\u6E1D\u6E38\u6E82\u6EAA\u6E98\u6EC9\u6EB7\u6ED3\u6EBD\u6EAF\u6EC4\u6EB2\u6ED4\u6ED5\u6E8F\u6EA5\u6EC2\u6E9F\u6F41\u6F11\u704C\u6EEC\u6EF8\u6EFE\u6F3F\u6EF2\u6F31\u6EEF\u6F32\u6ECC"],
      ["dfa1", "\u6F3E\u6F13\u6EF7\u6F86\u6F7A\u6F78\u6F81\u6F80\u6F6F\u6F5B\u6FF3\u6F6D\u6F82\u6F7C\u6F58\u6F8E\u6F91\u6FC2\u6F66\u6FB3\u6FA3\u6FA1\u6FA4\u6FB9\u6FC6\u6FAA\u6FDF\u6FD5\u6FEC\u6FD4\u6FD8\u6FF1\u6FEE\u6FDB\u7009\u700B\u6FFA\u7011\u7001\u700F\u6FFE\u701B\u701A\u6F74\u701D\u7018\u701F\u7030\u703E\u7032\u7051\u7063\u7099\u7092\u70AF\u70F1\u70AC\u70B8\u70B3\u70AE\u70DF\u70CB\u70DD\u70D9\u7109\u70FD\u711C\u7119\u7165\u7155\u7188\u7166\u7162\u714C\u7156\u716C\u718F\u71FB\u7184\u7195\u71A8\u71AC\u71D7\u71B9\u71BE\u71D2\u71C9\u71D4\u71CE\u71E0\u71EC\u71E7\u71F5\u71FC"],
      ["e0a1", "\u71F9\u71FF\u720D\u7210\u721B\u7228\u722D\u722C\u7230\u7232\u723B\u723C\u723F\u7240\u7246\u724B\u7258\u7274\u727E\u7282\u7281\u7287\u7292\u7296\u72A2\u72A7\u72B9\u72B2\u72C3\u72C6\u72C4\u72CE\u72D2\u72E2\u72E0\u72E1\u72F9\u72F7\u500F\u7317\u730A\u731C\u7316\u731D\u7334\u732F\u7329\u7325\u733E\u734E\u734F\u9ED8\u7357\u736A\u7368\u7370\u7378\u7375\u737B\u737A\u73C8\u73B3\u73CE\u73BB\u73C0\u73E5\u73EE\u73DE\u74A2\u7405\u746F\u7425\u73F8\u7432\u743A\u7455\u743F\u745F\u7459\u7441\u745C\u7469\u7470\u7463\u746A\u7476\u747E\u748B\u749E\u74A7\u74CA\u74CF\u74D4\u73F1"],
      ["e1a1", "\u74E0\u74E3\u74E7\u74E9\u74EE\u74F2\u74F0\u74F1\u74F8\u74F7\u7504\u7503\u7505\u750C\u750E\u750D\u7515\u7513\u751E\u7526\u752C\u753C\u7544\u754D\u754A\u7549\u755B\u7546\u755A\u7569\u7564\u7567\u756B\u756D\u7578\u7576\u7586\u7587\u7574\u758A\u7589\u7582\u7594\u759A\u759D\u75A5\u75A3\u75C2\u75B3\u75C3\u75B5\u75BD\u75B8\u75BC\u75B1\u75CD\u75CA\u75D2\u75D9\u75E3\u75DE\u75FE\u75FF\u75FC\u7601\u75F0\u75FA\u75F2\u75F3\u760B\u760D\u7609\u761F\u7627\u7620\u7621\u7622\u7624\u7634\u7630\u763B\u7647\u7648\u7646\u765C\u7658\u7661\u7662\u7668\u7669\u766A\u7667\u766C\u7670"],
      ["e2a1", "\u7672\u7676\u7678\u767C\u7680\u7683\u7688\u768B\u768E\u7696\u7693\u7699\u769A\u76B0\u76B4\u76B8\u76B9\u76BA\u76C2\u76CD\u76D6\u76D2\u76DE\u76E1\u76E5\u76E7\u76EA\u862F\u76FB\u7708\u7707\u7704\u7729\u7724\u771E\u7725\u7726\u771B\u7737\u7738\u7747\u775A\u7768\u776B\u775B\u7765\u777F\u777E\u7779\u778E\u778B\u7791\u77A0\u779E\u77B0\u77B6\u77B9\u77BF\u77BC\u77BD\u77BB\u77C7\u77CD\u77D7\u77DA\u77DC\u77E3\u77EE\u77FC\u780C\u7812\u7926\u7820\u792A\u7845\u788E\u7874\u7886\u787C\u789A\u788C\u78A3\u78B5\u78AA\u78AF\u78D1\u78C6\u78CB\u78D4\u78BE\u78BC\u78C5\u78CA\u78EC"],
      ["e3a1", "\u78E7\u78DA\u78FD\u78F4\u7907\u7912\u7911\u7919\u792C\u792B\u7940\u7960\u7957\u795F\u795A\u7955\u7953\u797A\u797F\u798A\u799D\u79A7\u9F4B\u79AA\u79AE\u79B3\u79B9\u79BA\u79C9\u79D5\u79E7\u79EC\u79E1\u79E3\u7A08\u7A0D\u7A18\u7A19\u7A20\u7A1F\u7980\u7A31\u7A3B\u7A3E\u7A37\u7A43\u7A57\u7A49\u7A61\u7A62\u7A69\u9F9D\u7A70\u7A79\u7A7D\u7A88\u7A97\u7A95\u7A98\u7A96\u7AA9\u7AC8\u7AB0\u7AB6\u7AC5\u7AC4\u7ABF\u9083\u7AC7\u7ACA\u7ACD\u7ACF\u7AD5\u7AD3\u7AD9\u7ADA\u7ADD\u7AE1\u7AE2\u7AE6\u7AED\u7AF0\u7B02\u7B0F\u7B0A\u7B06\u7B33\u7B18\u7B19\u7B1E\u7B35\u7B28\u7B36\u7B50"],
      ["e4a1", "\u7B7A\u7B04\u7B4D\u7B0B\u7B4C\u7B45\u7B75\u7B65\u7B74\u7B67\u7B70\u7B71\u7B6C\u7B6E\u7B9D\u7B98\u7B9F\u7B8D\u7B9C\u7B9A\u7B8B\u7B92\u7B8F\u7B5D\u7B99\u7BCB\u7BC1\u7BCC\u7BCF\u7BB4\u7BC6\u7BDD\u7BE9\u7C11\u7C14\u7BE6\u7BE5\u7C60\u7C00\u7C07\u7C13\u7BF3\u7BF7\u7C17\u7C0D\u7BF6\u7C23\u7C27\u7C2A\u7C1F\u7C37\u7C2B\u7C3D\u7C4C\u7C43\u7C54\u7C4F\u7C40\u7C50\u7C58\u7C5F\u7C64\u7C56\u7C65\u7C6C\u7C75\u7C83\u7C90\u7CA4\u7CAD\u7CA2\u7CAB\u7CA1\u7CA8\u7CB3\u7CB2\u7CB1\u7CAE\u7CB9\u7CBD\u7CC0\u7CC5\u7CC2\u7CD8\u7CD2\u7CDC\u7CE2\u9B3B\u7CEF\u7CF2\u7CF4\u7CF6\u7CFA\u7D06"],
      ["e5a1", "\u7D02\u7D1C\u7D15\u7D0A\u7D45\u7D4B\u7D2E\u7D32\u7D3F\u7D35\u7D46\u7D73\u7D56\u7D4E\u7D72\u7D68\u7D6E\u7D4F\u7D63\u7D93\u7D89\u7D5B\u7D8F\u7D7D\u7D9B\u7DBA\u7DAE\u7DA3\u7DB5\u7DC7\u7DBD\u7DAB\u7E3D\u7DA2\u7DAF\u7DDC\u7DB8\u7D9F\u7DB0\u7DD8\u7DDD\u7DE4\u7DDE\u7DFB\u7DF2\u7DE1\u7E05\u7E0A\u7E23\u7E21\u7E12\u7E31\u7E1F\u7E09\u7E0B\u7E22\u7E46\u7E66\u7E3B\u7E35\u7E39\u7E43\u7E37\u7E32\u7E3A\u7E67\u7E5D\u7E56\u7E5E\u7E59\u7E5A\u7E79\u7E6A\u7E69\u7E7C\u7E7B\u7E83\u7DD5\u7E7D\u8FAE\u7E7F\u7E88\u7E89\u7E8C\u7E92\u7E90\u7E93\u7E94\u7E96\u7E8E\u7E9B\u7E9C\u7F38\u7F3A"],
      ["e6a1", "\u7F45\u7F4C\u7F4D\u7F4E\u7F50\u7F51\u7F55\u7F54\u7F58\u7F5F\u7F60\u7F68\u7F69\u7F67\u7F78\u7F82\u7F86\u7F83\u7F88\u7F87\u7F8C\u7F94\u7F9E\u7F9D\u7F9A\u7FA3\u7FAF\u7FB2\u7FB9\u7FAE\u7FB6\u7FB8\u8B71\u7FC5\u7FC6\u7FCA\u7FD5\u7FD4\u7FE1\u7FE6\u7FE9\u7FF3\u7FF9\u98DC\u8006\u8004\u800B\u8012\u8018\u8019\u801C\u8021\u8028\u803F\u803B\u804A\u8046\u8052\u8058\u805A\u805F\u8062\u8068\u8073\u8072\u8070\u8076\u8079\u807D\u807F\u8084\u8086\u8085\u809B\u8093\u809A\u80AD\u5190\u80AC\u80DB\u80E5\u80D9\u80DD\u80C4\u80DA\u80D6\u8109\u80EF\u80F1\u811B\u8129\u8123\u812F\u814B"],
      ["e7a1", "\u968B\u8146\u813E\u8153\u8151\u80FC\u8171\u816E\u8165\u8166\u8174\u8183\u8188\u818A\u8180\u8182\u81A0\u8195\u81A4\u81A3\u815F\u8193\u81A9\u81B0\u81B5\u81BE\u81B8\u81BD\u81C0\u81C2\u81BA\u81C9\u81CD\u81D1\u81D9\u81D8\u81C8\u81DA\u81DF\u81E0\u81E7\u81FA\u81FB\u81FE\u8201\u8202\u8205\u8207\u820A\u820D\u8210\u8216\u8229\u822B\u8238\u8233\u8240\u8259\u8258\u825D\u825A\u825F\u8264\u8262\u8268\u826A\u826B\u822E\u8271\u8277\u8278\u827E\u828D\u8292\u82AB\u829F\u82BB\u82AC\u82E1\u82E3\u82DF\u82D2\u82F4\u82F3\u82FA\u8393\u8303\u82FB\u82F9\u82DE\u8306\u82DC\u8309\u82D9"],
      ["e8a1", "\u8335\u8334\u8316\u8332\u8331\u8340\u8339\u8350\u8345\u832F\u832B\u8317\u8318\u8385\u839A\u83AA\u839F\u83A2\u8396\u8323\u838E\u8387\u838A\u837C\u83B5\u8373\u8375\u83A0\u8389\u83A8\u83F4\u8413\u83EB\u83CE\u83FD\u8403\u83D8\u840B\u83C1\u83F7\u8407\u83E0\u83F2\u840D\u8422\u8420\u83BD\u8438\u8506\u83FB\u846D\u842A\u843C\u855A\u8484\u8477\u846B\u84AD\u846E\u8482\u8469\u8446\u842C\u846F\u8479\u8435\u84CA\u8462\u84B9\u84BF\u849F\u84D9\u84CD\u84BB\u84DA\u84D0\u84C1\u84C6\u84D6\u84A1\u8521\u84FF\u84F4\u8517\u8518\u852C\u851F\u8515\u8514\u84FC\u8540\u8563\u8558\u8548"],
      ["e9a1", "\u8541\u8602\u854B\u8555\u8580\u85A4\u8588\u8591\u858A\u85A8\u856D\u8594\u859B\u85EA\u8587\u859C\u8577\u857E\u8590\u85C9\u85BA\u85CF\u85B9\u85D0\u85D5\u85DD\u85E5\u85DC\u85F9\u860A\u8613\u860B\u85FE\u85FA\u8606\u8622\u861A\u8630\u863F\u864D\u4E55\u8654\u865F\u8667\u8671\u8693\u86A3\u86A9\u86AA\u868B\u868C\u86B6\u86AF\u86C4\u86C6\u86B0\u86C9\u8823\u86AB\u86D4\u86DE\u86E9\u86EC\u86DF\u86DB\u86EF\u8712\u8706\u8708\u8700\u8703\u86FB\u8711\u8709\u870D\u86F9\u870A\u8734\u873F\u8737\u873B\u8725\u8729\u871A\u8760\u875F\u8778\u874C\u874E\u8774\u8757\u8768\u876E\u8759"],
      ["eaa1", "\u8753\u8763\u876A\u8805\u87A2\u879F\u8782\u87AF\u87CB\u87BD\u87C0\u87D0\u96D6\u87AB\u87C4\u87B3\u87C7\u87C6\u87BB\u87EF\u87F2\u87E0\u880F\u880D\u87FE\u87F6\u87F7\u880E\u87D2\u8811\u8816\u8815\u8822\u8821\u8831\u8836\u8839\u8827\u883B\u8844\u8842\u8852\u8859\u885E\u8862\u886B\u8881\u887E\u889E\u8875\u887D\u88B5\u8872\u8882\u8897\u8892\u88AE\u8899\u88A2\u888D\u88A4\u88B0\u88BF\u88B1\u88C3\u88C4\u88D4\u88D8\u88D9\u88DD\u88F9\u8902\u88FC\u88F4\u88E8\u88F2\u8904\u890C\u890A\u8913\u8943\u891E\u8925\u892A\u892B\u8941\u8944\u893B\u8936\u8938\u894C\u891D\u8960\u895E"],
      ["eba1", "\u8966\u8964\u896D\u896A\u896F\u8974\u8977\u897E\u8983\u8988\u898A\u8993\u8998\u89A1\u89A9\u89A6\u89AC\u89AF\u89B2\u89BA\u89BD\u89BF\u89C0\u89DA\u89DC\u89DD\u89E7\u89F4\u89F8\u8A03\u8A16\u8A10\u8A0C\u8A1B\u8A1D\u8A25\u8A36\u8A41\u8A5B\u8A52\u8A46\u8A48\u8A7C\u8A6D\u8A6C\u8A62\u8A85\u8A82\u8A84\u8AA8\u8AA1\u8A91\u8AA5\u8AA6\u8A9A\u8AA3\u8AC4\u8ACD\u8AC2\u8ADA\u8AEB\u8AF3\u8AE7\u8AE4\u8AF1\u8B14\u8AE0\u8AE2\u8AF7\u8ADE\u8ADB\u8B0C\u8B07\u8B1A\u8AE1\u8B16\u8B10\u8B17\u8B20\u8B33\u97AB\u8B26\u8B2B\u8B3E\u8B28\u8B41\u8B4C\u8B4F\u8B4E\u8B49\u8B56\u8B5B\u8B5A\u8B6B"],
      ["eca1", "\u8B5F\u8B6C\u8B6F\u8B74\u8B7D\u8B80\u8B8C\u8B8E\u8B92\u8B93\u8B96\u8B99\u8B9A\u8C3A\u8C41\u8C3F\u8C48\u8C4C\u8C4E\u8C50\u8C55\u8C62\u8C6C\u8C78\u8C7A\u8C82\u8C89\u8C85\u8C8A\u8C8D\u8C8E\u8C94\u8C7C\u8C98\u621D\u8CAD\u8CAA\u8CBD\u8CB2\u8CB3\u8CAE\u8CB6\u8CC8\u8CC1\u8CE4\u8CE3\u8CDA\u8CFD\u8CFA\u8CFB\u8D04\u8D05\u8D0A\u8D07\u8D0F\u8D0D\u8D10\u9F4E\u8D13\u8CCD\u8D14\u8D16\u8D67\u8D6D\u8D71\u8D73\u8D81\u8D99\u8DC2\u8DBE\u8DBA\u8DCF\u8DDA\u8DD6\u8DCC\u8DDB\u8DCB\u8DEA\u8DEB\u8DDF\u8DE3\u8DFC\u8E08\u8E09\u8DFF\u8E1D\u8E1E\u8E10\u8E1F\u8E42\u8E35\u8E30\u8E34\u8E4A"],
      ["eda1", "\u8E47\u8E49\u8E4C\u8E50\u8E48\u8E59\u8E64\u8E60\u8E2A\u8E63\u8E55\u8E76\u8E72\u8E7C\u8E81\u8E87\u8E85\u8E84\u8E8B\u8E8A\u8E93\u8E91\u8E94\u8E99\u8EAA\u8EA1\u8EAC\u8EB0\u8EC6\u8EB1\u8EBE\u8EC5\u8EC8\u8ECB\u8EDB\u8EE3\u8EFC\u8EFB\u8EEB\u8EFE\u8F0A\u8F05\u8F15\u8F12\u8F19\u8F13\u8F1C\u8F1F\u8F1B\u8F0C\u8F26\u8F33\u8F3B\u8F39\u8F45\u8F42\u8F3E\u8F4C\u8F49\u8F46\u8F4E\u8F57\u8F5C\u8F62\u8F63\u8F64\u8F9C\u8F9F\u8FA3\u8FAD\u8FAF\u8FB7\u8FDA\u8FE5\u8FE2\u8FEA\u8FEF\u9087\u8FF4\u9005\u8FF9\u8FFA\u9011\u9015\u9021\u900D\u901E\u9016\u900B\u9027\u9036\u9035\u9039\u8FF8"],
      ["eea1", "\u904F\u9050\u9051\u9052\u900E\u9049\u903E\u9056\u9058\u905E\u9068\u906F\u9076\u96A8\u9072\u9082\u907D\u9081\u9080\u908A\u9089\u908F\u90A8\u90AF\u90B1\u90B5\u90E2\u90E4\u6248\u90DB\u9102\u9112\u9119\u9132\u9130\u914A\u9156\u9158\u9163\u9165\u9169\u9173\u9172\u918B\u9189\u9182\u91A2\u91AB\u91AF\u91AA\u91B5\u91B4\u91BA\u91C0\u91C1\u91C9\u91CB\u91D0\u91D6\u91DF\u91E1\u91DB\u91FC\u91F5\u91F6\u921E\u91FF\u9214\u922C\u9215\u9211\u925E\u9257\u9245\u9249\u9264\u9248\u9295\u923F\u924B\u9250\u929C\u9296\u9293\u929B\u925A\u92CF\u92B9\u92B7\u92E9\u930F\u92FA\u9344\u932E"],
      ["efa1", "\u9319\u9322\u931A\u9323\u933A\u9335\u933B\u935C\u9360\u937C\u936E\u9356\u93B0\u93AC\u93AD\u9394\u93B9\u93D6\u93D7\u93E8\u93E5\u93D8\u93C3\u93DD\u93D0\u93C8\u93E4\u941A\u9414\u9413\u9403\u9407\u9410\u9436\u942B\u9435\u9421\u943A\u9441\u9452\u9444\u945B\u9460\u9462\u945E\u946A\u9229\u9470\u9475\u9477\u947D\u945A\u947C\u947E\u9481\u947F\u9582\u9587\u958A\u9594\u9596\u9598\u9599\u95A0\u95A8\u95A7\u95AD\u95BC\u95BB\u95B9\u95BE\u95CA\u6FF6\u95C3\u95CD\u95CC\u95D5\u95D4\u95D6\u95DC\u95E1\u95E5\u95E2\u9621\u9628\u962E\u962F\u9642\u964C\u964F\u964B\u9677\u965C\u965E"],
      ["f0a1", "\u965D\u965F\u9666\u9672\u966C\u968D\u9698\u9695\u9697\u96AA\u96A7\u96B1\u96B2\u96B0\u96B4\u96B6\u96B8\u96B9\u96CE\u96CB\u96C9\u96CD\u894D\u96DC\u970D\u96D5\u96F9\u9704\u9706\u9708\u9713\u970E\u9711\u970F\u9716\u9719\u9724\u972A\u9730\u9739\u973D\u973E\u9744\u9746\u9748\u9742\u9749\u975C\u9760\u9764\u9766\u9768\u52D2\u976B\u9771\u9779\u9785\u977C\u9781\u977A\u9786\u978B\u978F\u9790\u979C\u97A8\u97A6\u97A3\u97B3\u97B4\u97C3\u97C6\u97C8\u97CB\u97DC\u97ED\u9F4F\u97F2\u7ADF\u97F6\u97F5\u980F\u980C\u9838\u9824\u9821\u9837\u983D\u9846\u984F\u984B\u986B\u986F\u9870"],
      ["f1a1", "\u9871\u9874\u9873\u98AA\u98AF\u98B1\u98B6\u98C4\u98C3\u98C6\u98E9\u98EB\u9903\u9909\u9912\u9914\u9918\u9921\u991D\u991E\u9924\u9920\u992C\u992E\u993D\u993E\u9942\u9949\u9945\u9950\u994B\u9951\u9952\u994C\u9955\u9997\u9998\u99A5\u99AD\u99AE\u99BC\u99DF\u99DB\u99DD\u99D8\u99D1\u99ED\u99EE\u99F1\u99F2\u99FB\u99F8\u9A01\u9A0F\u9A05\u99E2\u9A19\u9A2B\u9A37\u9A45\u9A42\u9A40\u9A43\u9A3E\u9A55\u9A4D\u9A5B\u9A57\u9A5F\u9A62\u9A65\u9A64\u9A69\u9A6B\u9A6A\u9AAD\u9AB0\u9ABC\u9AC0\u9ACF\u9AD1\u9AD3\u9AD4\u9ADE\u9ADF\u9AE2\u9AE3\u9AE6\u9AEF\u9AEB\u9AEE\u9AF4\u9AF1\u9AF7"],
      ["f2a1", "\u9AFB\u9B06\u9B18\u9B1A\u9B1F\u9B22\u9B23\u9B25\u9B27\u9B28\u9B29\u9B2A\u9B2E\u9B2F\u9B32\u9B44\u9B43\u9B4F\u9B4D\u9B4E\u9B51\u9B58\u9B74\u9B93\u9B83\u9B91\u9B96\u9B97\u9B9F\u9BA0\u9BA8\u9BB4\u9BC0\u9BCA\u9BB9\u9BC6\u9BCF\u9BD1\u9BD2\u9BE3\u9BE2\u9BE4\u9BD4\u9BE1\u9C3A\u9BF2\u9BF1\u9BF0\u9C15\u9C14\u9C09\u9C13\u9C0C\u9C06\u9C08\u9C12\u9C0A\u9C04\u9C2E\u9C1B\u9C25\u9C24\u9C21\u9C30\u9C47\u9C32\u9C46\u9C3E\u9C5A\u9C60\u9C67\u9C76\u9C78\u9CE7\u9CEC\u9CF0\u9D09\u9D08\u9CEB\u9D03\u9D06\u9D2A\u9D26\u9DAF\u9D23\u9D1F\u9D44\u9D15\u9D12\u9D41\u9D3F\u9D3E\u9D46\u9D48"],
      ["f3a1", "\u9D5D\u9D5E\u9D64\u9D51\u9D50\u9D59\u9D72\u9D89\u9D87\u9DAB\u9D6F\u9D7A\u9D9A\u9DA4\u9DA9\u9DB2\u9DC4\u9DC1\u9DBB\u9DB8\u9DBA\u9DC6\u9DCF\u9DC2\u9DD9\u9DD3\u9DF8\u9DE6\u9DED\u9DEF\u9DFD\u9E1A\u9E1B\u9E1E\u9E75\u9E79\u9E7D\u9E81\u9E88\u9E8B\u9E8C\u9E92\u9E95\u9E91\u9E9D\u9EA5\u9EA9\u9EB8\u9EAA\u9EAD\u9761\u9ECC\u9ECE\u9ECF\u9ED0\u9ED4\u9EDC\u9EDE\u9EDD\u9EE0\u9EE5\u9EE8\u9EEF\u9EF4\u9EF6\u9EF7\u9EF9\u9EFB\u9EFC\u9EFD\u9F07\u9F08\u76B7\u9F15\u9F21\u9F2C\u9F3E\u9F4A\u9F52\u9F54\u9F63\u9F5F\u9F60\u9F61\u9F66\u9F67\u9F6C\u9F6A\u9F77\u9F72\u9F76\u9F95\u9F9C\u9FA0"],
      ["f4a1", "\u582F\u69C7\u9059\u7464\u51DC\u7199"],
      ["f9a1", "\u7E8A\u891C\u9348\u9288\u84DC\u4FC9\u70BB\u6631\u68C8\u92F9\u66FB\u5F45\u4E28\u4EE1\u4EFC\u4F00\u4F03\u4F39\u4F56\u4F92\u4F8A\u4F9A\u4F94\u4FCD\u5040\u5022\u4FFF\u501E\u5046\u5070\u5042\u5094\u50F4\u50D8\u514A\u5164\u519D\u51BE\u51EC\u5215\u529C\u52A6\u52C0\u52DB\u5300\u5307\u5324\u5372\u5393\u53B2\u53DD\uFA0E\u549C\u548A\u54A9\u54FF\u5586\u5759\u5765\u57AC\u57C8\u57C7\uFA0F\uFA10\u589E\u58B2\u590B\u5953\u595B\u595D\u5963\u59A4\u59BA\u5B56\u5BC0\u752F\u5BD8\u5BEC\u5C1E\u5CA6\u5CBA\u5CF5\u5D27\u5D53\uFA11\u5D42\u5D6D\u5DB8\u5DB9\u5DD0\u5F21\u5F34\u5F67\u5FB7"],
      ["faa1", "\u5FDE\u605D\u6085\u608A\u60DE\u60D5\u6120\u60F2\u6111\u6137\u6130\u6198\u6213\u62A6\u63F5\u6460\u649D\u64CE\u654E\u6600\u6615\u663B\u6609\u662E\u661E\u6624\u6665\u6657\u6659\uFA12\u6673\u6699\u66A0\u66B2\u66BF\u66FA\u670E\uF929\u6766\u67BB\u6852\u67C0\u6801\u6844\u68CF\uFA13\u6968\uFA14\u6998\u69E2\u6A30\u6A6B\u6A46\u6A73\u6A7E\u6AE2\u6AE4\u6BD6\u6C3F\u6C5C\u6C86\u6C6F\u6CDA\u6D04\u6D87\u6D6F\u6D96\u6DAC\u6DCF\u6DF8\u6DF2\u6DFC\u6E39\u6E5C\u6E27\u6E3C\u6EBF\u6F88\u6FB5\u6FF5\u7005\u7007\u7028\u7085\u70AB\u710F\u7104\u715C\u7146\u7147\uFA15\u71C1\u71FE\u72B1"],
      ["fba1", "\u72BE\u7324\uFA16\u7377\u73BD\u73C9\u73D6\u73E3\u73D2\u7407\u73F5\u7426\u742A\u7429\u742E\u7462\u7489\u749F\u7501\u756F\u7682\u769C\u769E\u769B\u76A6\uFA17\u7746\u52AF\u7821\u784E\u7864\u787A\u7930\uFA18\uFA19\uFA1A\u7994\uFA1B\u799B\u7AD1\u7AE7\uFA1C\u7AEB\u7B9E\uFA1D\u7D48\u7D5C\u7DB7\u7DA0\u7DD6\u7E52\u7F47\u7FA1\uFA1E\u8301\u8362\u837F\u83C7\u83F6\u8448\u84B4\u8553\u8559\u856B\uFA1F\u85B0\uFA20\uFA21\u8807\u88F5\u8A12\u8A37\u8A79\u8AA7\u8ABE\u8ADF\uFA22\u8AF6\u8B53\u8B7F\u8CF0\u8CF4\u8D12\u8D76\uFA23\u8ECF\uFA24\uFA25\u9067\u90DE\uFA26\u9115\u9127\u91DA"],
      ["fca1", "\u91D7\u91DE\u91ED\u91EE\u91E4\u91E5\u9206\u9210\u920A\u923A\u9240\u923C\u924E\u9259\u9251\u9239\u9267\u92A7\u9277\u9278\u92E7\u92D7\u92D9\u92D0\uFA27\u92D5\u92E0\u92D3\u9325\u9321\u92FB\uFA28\u931E\u92FF\u931D\u9302\u9370\u9357\u93A4\u93C6\u93DE\u93F8\u9431\u9445\u9448\u9592\uF9DC\uFA29\u969D\u96AF\u9733\u973B\u9743\u974D\u974F\u9751\u9755\u9857\u9865\uFA2A\uFA2B\u9927\uFA2C\u999E\u9A4E\u9AD9\u9ADC\u9B75\u9B72\u9B8F\u9BB1\u9BBB\u9C00\u9D70\u9D6B\uFA2D\u9E19\u9ED1"],
      ["fcf1", "\u2170", 9, "\uFFE2\uFFE4\uFF07\uFF02"],
      ["8fa2af", "\u02D8\u02C7\xB8\u02D9\u02DD\xAF\u02DB\u02DA\uFF5E\u0384\u0385"],
      ["8fa2c2", "\xA1\xA6\xBF"],
      ["8fa2eb", "\xBA\xAA\xA9\xAE\u2122\xA4\u2116"],
      ["8fa6e1", "\u0386\u0388\u0389\u038A\u03AA"],
      ["8fa6e7", "\u038C"],
      ["8fa6e9", "\u038E\u03AB"],
      ["8fa6ec", "\u038F"],
      ["8fa6f1", "\u03AC\u03AD\u03AE\u03AF\u03CA\u0390\u03CC\u03C2\u03CD\u03CB\u03B0\u03CE"],
      ["8fa7c2", "\u0402", 10, "\u040E\u040F"],
      ["8fa7f2", "\u0452", 10, "\u045E\u045F"],
      ["8fa9a1", "\xC6\u0110"],
      ["8fa9a4", "\u0126"],
      ["8fa9a6", "\u0132"],
      ["8fa9a8", "\u0141\u013F"],
      ["8fa9ab", "\u014A\xD8\u0152"],
      ["8fa9af", "\u0166\xDE"],
      ["8fa9c1", "\xE6\u0111\xF0\u0127\u0131\u0133\u0138\u0142\u0140\u0149\u014B\xF8\u0153\xDF\u0167\xFE"],
      ["8faaa1", "\xC1\xC0\xC4\xC2\u0102\u01CD\u0100\u0104\xC5\xC3\u0106\u0108\u010C\xC7\u010A\u010E\xC9\xC8\xCB\xCA\u011A\u0116\u0112\u0118"],
      ["8faaba", "\u011C\u011E\u0122\u0120\u0124\xCD\xCC\xCF\xCE\u01CF\u0130\u012A\u012E\u0128\u0134\u0136\u0139\u013D\u013B\u0143\u0147\u0145\xD1\xD3\xD2\xD6\xD4\u01D1\u0150\u014C\xD5\u0154\u0158\u0156\u015A\u015C\u0160\u015E\u0164\u0162\xDA\xD9\xDC\xDB\u016C\u01D3\u0170\u016A\u0172\u016E\u0168\u01D7\u01DB\u01D9\u01D5\u0174\xDD\u0178\u0176\u0179\u017D\u017B"],
      ["8faba1", "\xE1\xE0\xE4\xE2\u0103\u01CE\u0101\u0105\xE5\xE3\u0107\u0109\u010D\xE7\u010B\u010F\xE9\xE8\xEB\xEA\u011B\u0117\u0113\u0119\u01F5\u011D\u011F"],
      ["8fabbd", "\u0121\u0125\xED\xEC\xEF\xEE\u01D0"],
      ["8fabc5", "\u012B\u012F\u0129\u0135\u0137\u013A\u013E\u013C\u0144\u0148\u0146\xF1\xF3\xF2\xF6\xF4\u01D2\u0151\u014D\xF5\u0155\u0159\u0157\u015B\u015D\u0161\u015F\u0165\u0163\xFA\xF9\xFC\xFB\u016D\u01D4\u0171\u016B\u0173\u016F\u0169\u01D8\u01DC\u01DA\u01D6\u0175\xFD\xFF\u0177\u017A\u017E\u017C"],
      ["8fb0a1", "\u4E02\u4E04\u4E05\u4E0C\u4E12\u4E1F\u4E23\u4E24\u4E28\u4E2B\u4E2E\u4E2F\u4E30\u4E35\u4E40\u4E41\u4E44\u4E47\u4E51\u4E5A\u4E5C\u4E63\u4E68\u4E69\u4E74\u4E75\u4E79\u4E7F\u4E8D\u4E96\u4E97\u4E9D\u4EAF\u4EB9\u4EC3\u4ED0\u4EDA\u4EDB\u4EE0\u4EE1\u4EE2\u4EE8\u4EEF\u4EF1\u4EF3\u4EF5\u4EFD\u4EFE\u4EFF\u4F00\u4F02\u4F03\u4F08\u4F0B\u4F0C\u4F12\u4F15\u4F16\u4F17\u4F19\u4F2E\u4F31\u4F60\u4F33\u4F35\u4F37\u4F39\u4F3B\u4F3E\u4F40\u4F42\u4F48\u4F49\u4F4B\u4F4C\u4F52\u4F54\u4F56\u4F58\u4F5F\u4F63\u4F6A\u4F6C\u4F6E\u4F71\u4F77\u4F78\u4F79\u4F7A\u4F7D\u4F7E\u4F81\u4F82\u4F84"],
      ["8fb1a1", "\u4F85\u4F89\u4F8A\u4F8C\u4F8E\u4F90\u4F92\u4F93\u4F94\u4F97\u4F99\u4F9A\u4F9E\u4F9F\u4FB2\u4FB7\u4FB9\u4FBB\u4FBC\u4FBD\u4FBE\u4FC0\u4FC1\u4FC5\u4FC6\u4FC8\u4FC9\u4FCB\u4FCC\u4FCD\u4FCF\u4FD2\u4FDC\u4FE0\u4FE2\u4FF0\u4FF2\u4FFC\u4FFD\u4FFF\u5000\u5001\u5004\u5007\u500A\u500C\u500E\u5010\u5013\u5017\u5018\u501B\u501C\u501D\u501E\u5022\u5027\u502E\u5030\u5032\u5033\u5035\u5040\u5041\u5042\u5045\u5046\u504A\u504C\u504E\u5051\u5052\u5053\u5057\u5059\u505F\u5060\u5062\u5063\u5066\u5067\u506A\u506D\u5070\u5071\u503B\u5081\u5083\u5084\u5086\u508A\u508E\u508F\u5090"],
      ["8fb2a1", "\u5092\u5093\u5094\u5096\u509B\u509C\u509E", 4, "\u50AA\u50AF\u50B0\u50B9\u50BA\u50BD\u50C0\u50C3\u50C4\u50C7\u50CC\u50CE\u50D0\u50D3\u50D4\u50D8\u50DC\u50DD\u50DF\u50E2\u50E4\u50E6\u50E8\u50E9\u50EF\u50F1\u50F6\u50FA\u50FE\u5103\u5106\u5107\u5108\u510B\u510C\u510D\u510E\u50F2\u5110\u5117\u5119\u511B\u511C\u511D\u511E\u5123\u5127\u5128\u512C\u512D\u512F\u5131\u5133\u5134\u5135\u5138\u5139\u5142\u514A\u514F\u5153\u5155\u5157\u5158\u515F\u5164\u5166\u517E\u5183\u5184\u518B\u518E\u5198\u519D\u51A1\u51A3\u51AD\u51B8\u51BA\u51BC\u51BE\u51BF\u51C2"],
      ["8fb3a1", "\u51C8\u51CF\u51D1\u51D2\u51D3\u51D5\u51D8\u51DE\u51E2\u51E5\u51EE\u51F2\u51F3\u51F4\u51F7\u5201\u5202\u5205\u5212\u5213\u5215\u5216\u5218\u5222\u5228\u5231\u5232\u5235\u523C\u5245\u5249\u5255\u5257\u5258\u525A\u525C\u525F\u5260\u5261\u5266\u526E\u5277\u5278\u5279\u5280\u5282\u5285\u528A\u528C\u5293\u5295\u5296\u5297\u5298\u529A\u529C\u52A4\u52A5\u52A6\u52A7\u52AF\u52B0\u52B6\u52B7\u52B8\u52BA\u52BB\u52BD\u52C0\u52C4\u52C6\u52C8\u52CC\u52CF\u52D1\u52D4\u52D6\u52DB\u52DC\u52E1\u52E5\u52E8\u52E9\u52EA\u52EC\u52F0\u52F1\u52F4\u52F6\u52F7\u5300\u5303\u530A\u530B"],
      ["8fb4a1", "\u530C\u5311\u5313\u5318\u531B\u531C\u531E\u531F\u5325\u5327\u5328\u5329\u532B\u532C\u532D\u5330\u5332\u5335\u533C\u533D\u533E\u5342\u534C\u534B\u5359\u535B\u5361\u5363\u5365\u536C\u536D\u5372\u5379\u537E\u5383\u5387\u5388\u538E\u5393\u5394\u5399\u539D\u53A1\u53A4\u53AA\u53AB\u53AF\u53B2\u53B4\u53B5\u53B7\u53B8\u53BA\u53BD\u53C0\u53C5\u53CF\u53D2\u53D3\u53D5\u53DA\u53DD\u53DE\u53E0\u53E6\u53E7\u53F5\u5402\u5413\u541A\u5421\u5427\u5428\u542A\u542F\u5431\u5434\u5435\u5443\u5444\u5447\u544D\u544F\u545E\u5462\u5464\u5466\u5467\u5469\u546B\u546D\u546E\u5474\u547F"],
      ["8fb5a1", "\u5481\u5483\u5485\u5488\u5489\u548D\u5491\u5495\u5496\u549C\u549F\u54A1\u54A6\u54A7\u54A9\u54AA\u54AD\u54AE\u54B1\u54B7\u54B9\u54BA\u54BB\u54BF\u54C6\u54CA\u54CD\u54CE\u54E0\u54EA\u54EC\u54EF\u54F6\u54FC\u54FE\u54FF\u5500\u5501\u5505\u5508\u5509\u550C\u550D\u550E\u5515\u552A\u552B\u5532\u5535\u5536\u553B\u553C\u553D\u5541\u5547\u5549\u554A\u554D\u5550\u5551\u5558\u555A\u555B\u555E\u5560\u5561\u5564\u5566\u557F\u5581\u5582\u5586\u5588\u558E\u558F\u5591\u5592\u5593\u5594\u5597\u55A3\u55A4\u55AD\u55B2\u55BF\u55C1\u55C3\u55C6\u55C9\u55CB\u55CC\u55CE\u55D1\u55D2"],
      ["8fb6a1", "\u55D3\u55D7\u55D8\u55DB\u55DE\u55E2\u55E9\u55F6\u55FF\u5605\u5608\u560A\u560D", 5, "\u5619\u562C\u5630\u5633\u5635\u5637\u5639\u563B\u563C\u563D\u563F\u5640\u5641\u5643\u5644\u5646\u5649\u564B\u564D\u564F\u5654\u565E\u5660\u5661\u5662\u5663\u5666\u5669\u566D\u566F\u5671\u5672\u5675\u5684\u5685\u5688\u568B\u568C\u5695\u5699\u569A\u569D\u569E\u569F\u56A6\u56A7\u56A8\u56A9\u56AB\u56AC\u56AD\u56B1\u56B3\u56B7\u56BE\u56C5\u56C9\u56CA\u56CB\u56CF\u56D0\u56CC\u56CD\u56D9\u56DC\u56DD\u56DF\u56E1\u56E4", 4, "\u56F1\u56EB\u56ED"],
      ["8fb7a1", "\u56F6\u56F7\u5701\u5702\u5707\u570A\u570C\u5711\u5715\u571A\u571B\u571D\u5720\u5722\u5723\u5724\u5725\u5729\u572A\u572C\u572E\u572F\u5733\u5734\u573D\u573E\u573F\u5745\u5746\u574C\u574D\u5752\u5762\u5765\u5767\u5768\u576B\u576D", 4, "\u5773\u5774\u5775\u5777\u5779\u577A\u577B\u577C\u577E\u5781\u5783\u578C\u5794\u5797\u5799\u579A\u579C\u579D\u579E\u579F\u57A1\u5795\u57A7\u57A8\u57A9\u57AC\u57B8\u57BD\u57C7\u57C8\u57CC\u57CF\u57D5\u57DD\u57DE\u57E4\u57E6\u57E7\u57E9\u57ED\u57F0\u57F5\u57F6\u57F8\u57FD\u57FE\u57FF\u5803\u5804\u5808\u5809\u57E1"],
      ["8fb8a1", "\u580C\u580D\u581B\u581E\u581F\u5820\u5826\u5827\u582D\u5832\u5839\u583F\u5849\u584C\u584D\u584F\u5850\u5855\u585F\u5861\u5864\u5867\u5868\u5878\u587C\u587F\u5880\u5881\u5887\u5888\u5889\u588A\u588C\u588D\u588F\u5890\u5894\u5896\u589D\u58A0\u58A1\u58A2\u58A6\u58A9\u58B1\u58B2\u58C4\u58BC\u58C2\u58C8\u58CD\u58CE\u58D0\u58D2\u58D4\u58D6\u58DA\u58DD\u58E1\u58E2\u58E9\u58F3\u5905\u5906\u590B\u590C\u5912\u5913\u5914\u8641\u591D\u5921\u5923\u5924\u5928\u592F\u5930\u5933\u5935\u5936\u593F\u5943\u5946\u5952\u5953\u5959\u595B\u595D\u595E\u595F\u5961\u5963\u596B\u596D"],
      ["8fb9a1", "\u596F\u5972\u5975\u5976\u5979\u597B\u597C\u598B\u598C\u598E\u5992\u5995\u5997\u599F\u59A4\u59A7\u59AD\u59AE\u59AF\u59B0\u59B3\u59B7\u59BA\u59BC\u59C1\u59C3\u59C4\u59C8\u59CA\u59CD\u59D2\u59DD\u59DE\u59DF\u59E3\u59E4\u59E7\u59EE\u59EF\u59F1\u59F2\u59F4\u59F7\u5A00\u5A04\u5A0C\u5A0D\u5A0E\u5A12\u5A13\u5A1E\u5A23\u5A24\u5A27\u5A28\u5A2A\u5A2D\u5A30\u5A44\u5A45\u5A47\u5A48\u5A4C\u5A50\u5A55\u5A5E\u5A63\u5A65\u5A67\u5A6D\u5A77\u5A7A\u5A7B\u5A7E\u5A8B\u5A90\u5A93\u5A96\u5A99\u5A9C\u5A9E\u5A9F\u5AA0\u5AA2\u5AA7\u5AAC\u5AB1\u5AB2\u5AB3\u5AB5\u5AB8\u5ABA\u5ABB\u5ABF"],
      ["8fbaa1", "\u5AC4\u5AC6\u5AC8\u5ACF\u5ADA\u5ADC\u5AE0\u5AE5\u5AEA\u5AEE\u5AF5\u5AF6\u5AFD\u5B00\u5B01\u5B08\u5B17\u5B34\u5B19\u5B1B\u5B1D\u5B21\u5B25\u5B2D\u5B38\u5B41\u5B4B\u5B4C\u5B52\u5B56\u5B5E\u5B68\u5B6E\u5B6F\u5B7C\u5B7D\u5B7E\u5B7F\u5B81\u5B84\u5B86\u5B8A\u5B8E\u5B90\u5B91\u5B93\u5B94\u5B96\u5BA8\u5BA9\u5BAC\u5BAD\u5BAF\u5BB1\u5BB2\u5BB7\u5BBA\u5BBC\u5BC0\u5BC1\u5BCD\u5BCF\u5BD6", 4, "\u5BE0\u5BEF\u5BF1\u5BF4\u5BFD\u5C0C\u5C17\u5C1E\u5C1F\u5C23\u5C26\u5C29\u5C2B\u5C2C\u5C2E\u5C30\u5C32\u5C35\u5C36\u5C59\u5C5A\u5C5C\u5C62\u5C63\u5C67\u5C68\u5C69"],
      ["8fbba1", "\u5C6D\u5C70\u5C74\u5C75\u5C7A\u5C7B\u5C7C\u5C7D\u5C87\u5C88\u5C8A\u5C8F\u5C92\u5C9D\u5C9F\u5CA0\u5CA2\u5CA3\u5CA6\u5CAA\u5CB2\u5CB4\u5CB5\u5CBA\u5CC9\u5CCB\u5CD2\u5CDD\u5CD7\u5CEE\u5CF1\u5CF2\u5CF4\u5D01\u5D06\u5D0D\u5D12\u5D2B\u5D23\u5D24\u5D26\u5D27\u5D31\u5D34\u5D39\u5D3D\u5D3F\u5D42\u5D43\u5D46\u5D48\u5D55\u5D51\u5D59\u5D4A\u5D5F\u5D60\u5D61\u5D62\u5D64\u5D6A\u5D6D\u5D70\u5D79\u5D7A\u5D7E\u5D7F\u5D81\u5D83\u5D88\u5D8A\u5D92\u5D93\u5D94\u5D95\u5D99\u5D9B\u5D9F\u5DA0\u5DA7\u5DAB\u5DB0\u5DB4\u5DB8\u5DB9\u5DC3\u5DC7\u5DCB\u5DD0\u5DCE\u5DD8\u5DD9\u5DE0\u5DE4"],
      ["8fbca1", "\u5DE9\u5DF8\u5DF9\u5E00\u5E07\u5E0D\u5E12\u5E14\u5E15\u5E18\u5E1F\u5E20\u5E2E\u5E28\u5E32\u5E35\u5E3E\u5E4B\u5E50\u5E49\u5E51\u5E56\u5E58\u5E5B\u5E5C\u5E5E\u5E68\u5E6A", 4, "\u5E70\u5E80\u5E8B\u5E8E\u5EA2\u5EA4\u5EA5\u5EA8\u5EAA\u5EAC\u5EB1\u5EB3\u5EBD\u5EBE\u5EBF\u5EC6\u5ECC\u5ECB\u5ECE\u5ED1\u5ED2\u5ED4\u5ED5\u5EDC\u5EDE\u5EE5\u5EEB\u5F02\u5F06\u5F07\u5F08\u5F0E\u5F19\u5F1C\u5F1D\u5F21\u5F22\u5F23\u5F24\u5F28\u5F2B\u5F2C\u5F2E\u5F30\u5F34\u5F36\u5F3B\u5F3D\u5F3F\u5F40\u5F44\u5F45\u5F47\u5F4D\u5F50\u5F54\u5F58\u5F5B\u5F60\u5F63\u5F64\u5F67"],
      ["8fbda1", "\u5F6F\u5F72\u5F74\u5F75\u5F78\u5F7A\u5F7D\u5F7E\u5F89\u5F8D\u5F8F\u5F96\u5F9C\u5F9D\u5FA2\u5FA7\u5FAB\u5FA4\u5FAC\u5FAF\u5FB0\u5FB1\u5FB8\u5FC4\u5FC7\u5FC8\u5FC9\u5FCB\u5FD0", 4, "\u5FDE\u5FE1\u5FE2\u5FE8\u5FE9\u5FEA\u5FEC\u5FED\u5FEE\u5FEF\u5FF2\u5FF3\u5FF6\u5FFA\u5FFC\u6007\u600A\u600D\u6013\u6014\u6017\u6018\u601A\u601F\u6024\u602D\u6033\u6035\u6040\u6047\u6048\u6049\u604C\u6051\u6054\u6056\u6057\u605D\u6061\u6067\u6071\u607E\u607F\u6082\u6086\u6088\u608A\u608E\u6091\u6093\u6095\u6098\u609D\u609E\u60A2\u60A4\u60A5\u60A8\u60B0\u60B1\u60B7"],
      ["8fbea1", "\u60BB\u60BE\u60C2\u60C4\u60C8\u60C9\u60CA\u60CB\u60CE\u60CF\u60D4\u60D5\u60D9\u60DB\u60DD\u60DE\u60E2\u60E5\u60F2\u60F5\u60F8\u60FC\u60FD\u6102\u6107\u610A\u610C\u6110", 4, "\u6116\u6117\u6119\u611C\u611E\u6122\u612A\u612B\u6130\u6131\u6135\u6136\u6137\u6139\u6141\u6145\u6146\u6149\u615E\u6160\u616C\u6172\u6178\u617B\u617C\u617F\u6180\u6181\u6183\u6184\u618B\u618D\u6192\u6193\u6197\u6198\u619C\u619D\u619F\u61A0\u61A5\u61A8\u61AA\u61AD\u61B8\u61B9\u61BC\u61C0\u61C1\u61C2\u61CE\u61CF\u61D5\u61DC\u61DD\u61DE\u61DF\u61E1\u61E2\u61E7\u61E9\u61E5"],
      ["8fbfa1", "\u61EC\u61ED\u61EF\u6201\u6203\u6204\u6207\u6213\u6215\u621C\u6220\u6222\u6223\u6227\u6229\u622B\u6239\u623D\u6242\u6243\u6244\u6246\u624C\u6250\u6251\u6252\u6254\u6256\u625A\u625C\u6264\u626D\u626F\u6273\u627A\u627D\u628D\u628E\u628F\u6290\u62A6\u62A8\u62B3\u62B6\u62B7\u62BA\u62BE\u62BF\u62C4\u62CE\u62D5\u62D6\u62DA\u62EA\u62F2\u62F4\u62FC\u62FD\u6303\u6304\u630A\u630B\u630D\u6310\u6313\u6316\u6318\u6329\u632A\u632D\u6335\u6336\u6339\u633C\u6341\u6342\u6343\u6344\u6346\u634A\u634B\u634E\u6352\u6353\u6354\u6358\u635B\u6365\u6366\u636C\u636D\u6371\u6374\u6375"],
      ["8fc0a1", "\u6378\u637C\u637D\u637F\u6382\u6384\u6387\u638A\u6390\u6394\u6395\u6399\u639A\u639E\u63A4\u63A6\u63AD\u63AE\u63AF\u63BD\u63C1\u63C5\u63C8\u63CE\u63D1\u63D3\u63D4\u63D5\u63DC\u63E0\u63E5\u63EA\u63EC\u63F2\u63F3\u63F5\u63F8\u63F9\u6409\u640A\u6410\u6412\u6414\u6418\u641E\u6420\u6422\u6424\u6425\u6429\u642A\u642F\u6430\u6435\u643D\u643F\u644B\u644F\u6451\u6452\u6453\u6454\u645A\u645B\u645C\u645D\u645F\u6460\u6461\u6463\u646D\u6473\u6474\u647B\u647D\u6485\u6487\u648F\u6490\u6491\u6498\u6499\u649B\u649D\u649F\u64A1\u64A3\u64A6\u64A8\u64AC\u64B3\u64BD\u64BE\u64BF"],
      ["8fc1a1", "\u64C4\u64C9\u64CA\u64CB\u64CC\u64CE\u64D0\u64D1\u64D5\u64D7\u64E4\u64E5\u64E9\u64EA\u64ED\u64F0\u64F5\u64F7\u64FB\u64FF\u6501\u6504\u6508\u6509\u650A\u650F\u6513\u6514\u6516\u6519\u651B\u651E\u651F\u6522\u6526\u6529\u652E\u6531\u653A\u653C\u653D\u6543\u6547\u6549\u6550\u6552\u6554\u655F\u6560\u6567\u656B\u657A\u657D\u6581\u6585\u658A\u6592\u6595\u6598\u659D\u65A0\u65A3\u65A6\u65AE\u65B2\u65B3\u65B4\u65BF\u65C2\u65C8\u65C9\u65CE\u65D0\u65D4\u65D6\u65D8\u65DF\u65F0\u65F2\u65F4\u65F5\u65F9\u65FE\u65FF\u6600\u6604\u6608\u6609\u660D\u6611\u6612\u6615\u6616\u661D"],
      ["8fc2a1", "\u661E\u6621\u6622\u6623\u6624\u6626\u6629\u662A\u662B\u662C\u662E\u6630\u6631\u6633\u6639\u6637\u6640\u6645\u6646\u664A\u664C\u6651\u664E\u6657\u6658\u6659\u665B\u665C\u6660\u6661\u66FB\u666A\u666B\u666C\u667E\u6673\u6675\u667F\u6677\u6678\u6679\u667B\u6680\u667C\u668B\u668C\u668D\u6690\u6692\u6699\u669A\u669B\u669C\u669F\u66A0\u66A4\u66AD\u66B1\u66B2\u66B5\u66BB\u66BF\u66C0\u66C2\u66C3\u66C8\u66CC\u66CE\u66CF\u66D4\u66DB\u66DF\u66E8\u66EB\u66EC\u66EE\u66FA\u6705\u6707\u670E\u6713\u6719\u671C\u6720\u6722\u6733\u673E\u6745\u6747\u6748\u674C\u6754\u6755\u675D"],
      ["8fc3a1", "\u6766\u676C\u676E\u6774\u6776\u677B\u6781\u6784\u678E\u678F\u6791\u6793\u6796\u6798\u6799\u679B\u67B0\u67B1\u67B2\u67B5\u67BB\u67BC\u67BD\u67F9\u67C0\u67C2\u67C3\u67C5\u67C8\u67C9\u67D2\u67D7\u67D9\u67DC\u67E1\u67E6\u67F0\u67F2\u67F6\u67F7\u6852\u6814\u6819\u681D\u681F\u6828\u6827\u682C\u682D\u682F\u6830\u6831\u6833\u683B\u683F\u6844\u6845\u684A\u684C\u6855\u6857\u6858\u685B\u686B\u686E", 4, "\u6875\u6879\u687A\u687B\u687C\u6882\u6884\u6886\u6888\u6896\u6898\u689A\u689C\u68A1\u68A3\u68A5\u68A9\u68AA\u68AE\u68B2\u68BB\u68C5\u68C8\u68CC\u68CF"],
      ["8fc4a1", "\u68D0\u68D1\u68D3\u68D6\u68D9\u68DC\u68DD\u68E5\u68E8\u68EA\u68EB\u68EC\u68ED\u68F0\u68F1\u68F5\u68F6\u68FB\u68FC\u68FD\u6906\u6909\u690A\u6910\u6911\u6913\u6916\u6917\u6931\u6933\u6935\u6938\u693B\u6942\u6945\u6949\u694E\u6957\u695B\u6963\u6964\u6965\u6966\u6968\u6969\u696C\u6970\u6971\u6972\u697A\u697B\u697F\u6980\u698D\u6992\u6996\u6998\u69A1\u69A5\u69A6\u69A8\u69AB\u69AD\u69AF\u69B7\u69B8\u69BA\u69BC\u69C5\u69C8\u69D1\u69D6\u69D7\u69E2\u69E5\u69EE\u69EF\u69F1\u69F3\u69F5\u69FE\u6A00\u6A01\u6A03\u6A0F\u6A11\u6A15\u6A1A\u6A1D\u6A20\u6A24\u6A28\u6A30\u6A32"],
      ["8fc5a1", "\u6A34\u6A37\u6A3B\u6A3E\u6A3F\u6A45\u6A46\u6A49\u6A4A\u6A4E\u6A50\u6A51\u6A52\u6A55\u6A56\u6A5B\u6A64\u6A67\u6A6A\u6A71\u6A73\u6A7E\u6A81\u6A83\u6A86\u6A87\u6A89\u6A8B\u6A91\u6A9B\u6A9D\u6A9E\u6A9F\u6AA5\u6AAB\u6AAF\u6AB0\u6AB1\u6AB4\u6ABD\u6ABE\u6ABF\u6AC6\u6AC9\u6AC8\u6ACC\u6AD0\u6AD4\u6AD5\u6AD6\u6ADC\u6ADD\u6AE4\u6AE7\u6AEC\u6AF0\u6AF1\u6AF2\u6AFC\u6AFD\u6B02\u6B03\u6B06\u6B07\u6B09\u6B0F\u6B10\u6B11\u6B17\u6B1B\u6B1E\u6B24\u6B28\u6B2B\u6B2C\u6B2F\u6B35\u6B36\u6B3B\u6B3F\u6B46\u6B4A\u6B4D\u6B52\u6B56\u6B58\u6B5D\u6B60\u6B67\u6B6B\u6B6E\u6B70\u6B75\u6B7D"],
      ["8fc6a1", "\u6B7E\u6B82\u6B85\u6B97\u6B9B\u6B9F\u6BA0\u6BA2\u6BA3\u6BA8\u6BA9\u6BAC\u6BAD\u6BAE\u6BB0\u6BB8\u6BB9\u6BBD\u6BBE\u6BC3\u6BC4\u6BC9\u6BCC\u6BD6\u6BDA\u6BE1\u6BE3\u6BE6\u6BE7\u6BEE\u6BF1\u6BF7\u6BF9\u6BFF\u6C02\u6C04\u6C05\u6C09\u6C0D\u6C0E\u6C10\u6C12\u6C19\u6C1F\u6C26\u6C27\u6C28\u6C2C\u6C2E\u6C33\u6C35\u6C36\u6C3A\u6C3B\u6C3F\u6C4A\u6C4B\u6C4D\u6C4F\u6C52\u6C54\u6C59\u6C5B\u6C5C\u6C6B\u6C6D\u6C6F\u6C74\u6C76\u6C78\u6C79\u6C7B\u6C85\u6C86\u6C87\u6C89\u6C94\u6C95\u6C97\u6C98\u6C9C\u6C9F\u6CB0\u6CB2\u6CB4\u6CC2\u6CC6\u6CCD\u6CCF\u6CD0\u6CD1\u6CD2\u6CD4\u6CD6"],
      ["8fc7a1", "\u6CDA\u6CDC\u6CE0\u6CE7\u6CE9\u6CEB\u6CEC\u6CEE\u6CF2\u6CF4\u6D04\u6D07\u6D0A\u6D0E\u6D0F\u6D11\u6D13\u6D1A\u6D26\u6D27\u6D28\u6C67\u6D2E\u6D2F\u6D31\u6D39\u6D3C\u6D3F\u6D57\u6D5E\u6D5F\u6D61\u6D65\u6D67\u6D6F\u6D70\u6D7C\u6D82\u6D87\u6D91\u6D92\u6D94\u6D96\u6D97\u6D98\u6DAA\u6DAC\u6DB4\u6DB7\u6DB9\u6DBD\u6DBF\u6DC4\u6DC8\u6DCA\u6DCE\u6DCF\u6DD6\u6DDB\u6DDD\u6DDF\u6DE0\u6DE2\u6DE5\u6DE9\u6DEF\u6DF0\u6DF4\u6DF6\u6DFC\u6E00\u6E04\u6E1E\u6E22\u6E27\u6E32\u6E36\u6E39\u6E3B\u6E3C\u6E44\u6E45\u6E48\u6E49\u6E4B\u6E4F\u6E51\u6E52\u6E53\u6E54\u6E57\u6E5C\u6E5D\u6E5E"],
      ["8fc8a1", "\u6E62\u6E63\u6E68\u6E73\u6E7B\u6E7D\u6E8D\u6E93\u6E99\u6EA0\u6EA7\u6EAD\u6EAE\u6EB1\u6EB3\u6EBB\u6EBF\u6EC0\u6EC1\u6EC3\u6EC7\u6EC8\u6ECA\u6ECD\u6ECE\u6ECF\u6EEB\u6EED\u6EEE\u6EF9\u6EFB\u6EFD\u6F04\u6F08\u6F0A\u6F0C\u6F0D\u6F16\u6F18\u6F1A\u6F1B\u6F26\u6F29\u6F2A\u6F2F\u6F30\u6F33\u6F36\u6F3B\u6F3C\u6F2D\u6F4F\u6F51\u6F52\u6F53\u6F57\u6F59\u6F5A\u6F5D\u6F5E\u6F61\u6F62\u6F68\u6F6C\u6F7D\u6F7E\u6F83\u6F87\u6F88\u6F8B\u6F8C\u6F8D\u6F90\u6F92\u6F93\u6F94\u6F96\u6F9A\u6F9F\u6FA0\u6FA5\u6FA6\u6FA7\u6FA8\u6FAE\u6FAF\u6FB0\u6FB5\u6FB6\u6FBC\u6FC5\u6FC7\u6FC8\u6FCA"],
      ["8fc9a1", "\u6FDA\u6FDE\u6FE8\u6FE9\u6FF0\u6FF5\u6FF9\u6FFC\u6FFD\u7000\u7005\u7006\u7007\u700D\u7017\u7020\u7023\u702F\u7034\u7037\u7039\u703C\u7043\u7044\u7048\u7049\u704A\u704B\u7054\u7055\u705D\u705E\u704E\u7064\u7065\u706C\u706E\u7075\u7076\u707E\u7081\u7085\u7086\u7094", 4, "\u709B\u70A4\u70AB\u70B0\u70B1\u70B4\u70B7\u70CA\u70D1\u70D3\u70D4\u70D5\u70D6\u70D8\u70DC\u70E4\u70FA\u7103", 4, "\u710B\u710C\u710F\u711E\u7120\u712B\u712D\u712F\u7130\u7131\u7138\u7141\u7145\u7146\u7147\u714A\u714B\u7150\u7152\u7157\u715A\u715C\u715E\u7160"],
      ["8fcaa1", "\u7168\u7179\u7180\u7185\u7187\u718C\u7192\u719A\u719B\u71A0\u71A2\u71AF\u71B0\u71B2\u71B3\u71BA\u71BF\u71C0\u71C1\u71C4\u71CB\u71CC\u71D3\u71D6\u71D9\u71DA\u71DC\u71F8\u71FE\u7200\u7207\u7208\u7209\u7213\u7217\u721A\u721D\u721F\u7224\u722B\u722F\u7234\u7238\u7239\u7241\u7242\u7243\u7245\u724E\u724F\u7250\u7253\u7255\u7256\u725A\u725C\u725E\u7260\u7263\u7268\u726B\u726E\u726F\u7271\u7277\u7278\u727B\u727C\u727F\u7284\u7289\u728D\u728E\u7293\u729B\u72A8\u72AD\u72AE\u72B1\u72B4\u72BE\u72C1\u72C7\u72C9\u72CC\u72D5\u72D6\u72D8\u72DF\u72E5\u72F3\u72F4\u72FA\u72FB"],
      ["8fcba1", "\u72FE\u7302\u7304\u7305\u7307\u730B\u730D\u7312\u7313\u7318\u7319\u731E\u7322\u7324\u7327\u7328\u732C\u7331\u7332\u7335\u733A\u733B\u733D\u7343\u734D\u7350\u7352\u7356\u7358\u735D\u735E\u735F\u7360\u7366\u7367\u7369\u736B\u736C\u736E\u736F\u7371\u7377\u7379\u737C\u7380\u7381\u7383\u7385\u7386\u738E\u7390\u7393\u7395\u7397\u7398\u739C\u739E\u739F\u73A0\u73A2\u73A5\u73A6\u73AA\u73AB\u73AD\u73B5\u73B7\u73B9\u73BC\u73BD\u73BF\u73C5\u73C6\u73C9\u73CB\u73CC\u73CF\u73D2\u73D3\u73D6\u73D9\u73DD\u73E1\u73E3\u73E6\u73E7\u73E9\u73F4\u73F5\u73F7\u73F9\u73FA\u73FB\u73FD"],
      ["8fcca1", "\u73FF\u7400\u7401\u7404\u7407\u740A\u7411\u741A\u741B\u7424\u7426\u7428", 9, "\u7439\u7440\u7443\u7444\u7446\u7447\u744B\u744D\u7451\u7452\u7457\u745D\u7462\u7466\u7467\u7468\u746B\u746D\u746E\u7471\u7472\u7480\u7481\u7485\u7486\u7487\u7489\u748F\u7490\u7491\u7492\u7498\u7499\u749A\u749C\u749F\u74A0\u74A1\u74A3\u74A6\u74A8\u74A9\u74AA\u74AB\u74AE\u74AF\u74B1\u74B2\u74B5\u74B9\u74BB\u74BF\u74C8\u74C9\u74CC\u74D0\u74D3\u74D8\u74DA\u74DB\u74DE\u74DF\u74E4\u74E8\u74EA\u74EB\u74EF\u74F4\u74FA\u74FB\u74FC\u74FF\u7506"],
      ["8fcda1", "\u7512\u7516\u7517\u7520\u7521\u7524\u7527\u7529\u752A\u752F\u7536\u7539\u753D\u753E\u753F\u7540\u7543\u7547\u7548\u754E\u7550\u7552\u7557\u755E\u755F\u7561\u756F\u7571\u7579", 5, "\u7581\u7585\u7590\u7592\u7593\u7595\u7599\u759C\u75A2\u75A4\u75B4\u75BA\u75BF\u75C0\u75C1\u75C4\u75C6\u75CC\u75CE\u75CF\u75D7\u75DC\u75DF\u75E0\u75E1\u75E4\u75E7\u75EC\u75EE\u75EF\u75F1\u75F9\u7600\u7602\u7603\u7604\u7607\u7608\u760A\u760C\u760F\u7612\u7613\u7615\u7616\u7619\u761B\u761C\u761D\u761E\u7623\u7625\u7626\u7629\u762D\u7632\u7633\u7635\u7638\u7639"],
      ["8fcea1", "\u763A\u763C\u764A\u7640\u7641\u7643\u7644\u7645\u7649\u764B\u7655\u7659\u765F\u7664\u7665\u766D\u766E\u766F\u7671\u7674\u7681\u7685\u768C\u768D\u7695\u769B\u769C\u769D\u769F\u76A0\u76A2", 6, "\u76AA\u76AD\u76BD\u76C1\u76C5\u76C9\u76CB\u76CC\u76CE\u76D4\u76D9\u76E0\u76E6\u76E8\u76EC\u76F0\u76F1\u76F6\u76F9\u76FC\u7700\u7706\u770A\u770E\u7712\u7714\u7715\u7717\u7719\u771A\u771C\u7722\u7728\u772D\u772E\u772F\u7734\u7735\u7736\u7739\u773D\u773E\u7742\u7745\u7746\u774A\u774D\u774E\u774F\u7752\u7756\u7757\u775C\u775E\u775F\u7760\u7762"],
      ["8fcfa1", "\u7764\u7767\u776A\u776C\u7770\u7772\u7773\u7774\u777A\u777D\u7780\u7784\u778C\u778D\u7794\u7795\u7796\u779A\u779F\u77A2\u77A7\u77AA\u77AE\u77AF\u77B1\u77B5\u77BE\u77C3\u77C9\u77D1\u77D2\u77D5\u77D9\u77DE\u77DF\u77E0\u77E4\u77E6\u77EA\u77EC\u77F0\u77F1\u77F4\u77F8\u77FB\u7805\u7806\u7809\u780D\u780E\u7811\u781D\u7821\u7822\u7823\u782D\u782E\u7830\u7835\u7837\u7843\u7844\u7847\u7848\u784C\u784E\u7852\u785C\u785E\u7860\u7861\u7863\u7864\u7868\u786A\u786E\u787A\u787E\u788A\u788F\u7894\u7898\u78A1\u789D\u789E\u789F\u78A4\u78A8\u78AC\u78AD\u78B0\u78B1\u78B2\u78B3"],
      ["8fd0a1", "\u78BB\u78BD\u78BF\u78C7\u78C8\u78C9\u78CC\u78CE\u78D2\u78D3\u78D5\u78D6\u78E4\u78DB\u78DF\u78E0\u78E1\u78E6\u78EA\u78F2\u78F3\u7900\u78F6\u78F7\u78FA\u78FB\u78FF\u7906\u790C\u7910\u791A\u791C\u791E\u791F\u7920\u7925\u7927\u7929\u792D\u7931\u7934\u7935\u793B\u793D\u793F\u7944\u7945\u7946\u794A\u794B\u794F\u7951\u7954\u7958\u795B\u795C\u7967\u7969\u796B\u7972\u7979\u797B\u797C\u797E\u798B\u798C\u7991\u7993\u7994\u7995\u7996\u7998\u799B\u799C\u79A1\u79A8\u79A9\u79AB\u79AF\u79B1\u79B4\u79B8\u79BB\u79C2\u79C4\u79C7\u79C8\u79CA\u79CF\u79D4\u79D6\u79DA\u79DD\u79DE"],
      ["8fd1a1", "\u79E0\u79E2\u79E5\u79EA\u79EB\u79ED\u79F1\u79F8\u79FC\u7A02\u7A03\u7A07\u7A09\u7A0A\u7A0C\u7A11\u7A15\u7A1B\u7A1E\u7A21\u7A27\u7A2B\u7A2D\u7A2F\u7A30\u7A34\u7A35\u7A38\u7A39\u7A3A\u7A44\u7A45\u7A47\u7A48\u7A4C\u7A55\u7A56\u7A59\u7A5C\u7A5D\u7A5F\u7A60\u7A65\u7A67\u7A6A\u7A6D\u7A75\u7A78\u7A7E\u7A80\u7A82\u7A85\u7A86\u7A8A\u7A8B\u7A90\u7A91\u7A94\u7A9E\u7AA0\u7AA3\u7AAC\u7AB3\u7AB5\u7AB9\u7ABB\u7ABC\u7AC6\u7AC9\u7ACC\u7ACE\u7AD1\u7ADB\u7AE8\u7AE9\u7AEB\u7AEC\u7AF1\u7AF4\u7AFB\u7AFD\u7AFE\u7B07\u7B14\u7B1F\u7B23\u7B27\u7B29\u7B2A\u7B2B\u7B2D\u7B2E\u7B2F\u7B30"],
      ["8fd2a1", "\u7B31\u7B34\u7B3D\u7B3F\u7B40\u7B41\u7B47\u7B4E\u7B55\u7B60\u7B64\u7B66\u7B69\u7B6A\u7B6D\u7B6F\u7B72\u7B73\u7B77\u7B84\u7B89\u7B8E\u7B90\u7B91\u7B96\u7B9B\u7B9E\u7BA0\u7BA5\u7BAC\u7BAF\u7BB0\u7BB2\u7BB5\u7BB6\u7BBA\u7BBB\u7BBC\u7BBD\u7BC2\u7BC5\u7BC8\u7BCA\u7BD4\u7BD6\u7BD7\u7BD9\u7BDA\u7BDB\u7BE8\u7BEA\u7BF2\u7BF4\u7BF5\u7BF8\u7BF9\u7BFA\u7BFC\u7BFE\u7C01\u7C02\u7C03\u7C04\u7C06\u7C09\u7C0B\u7C0C\u7C0E\u7C0F\u7C19\u7C1B\u7C20\u7C25\u7C26\u7C28\u7C2C\u7C31\u7C33\u7C34\u7C36\u7C39\u7C3A\u7C46\u7C4A\u7C55\u7C51\u7C52\u7C53\u7C59", 5],
      ["8fd3a1", "\u7C61\u7C63\u7C67\u7C69\u7C6D\u7C6E\u7C70\u7C72\u7C79\u7C7C\u7C7D\u7C86\u7C87\u7C8F\u7C94\u7C9E\u7CA0\u7CA6\u7CB0\u7CB6\u7CB7\u7CBA\u7CBB\u7CBC\u7CBF\u7CC4\u7CC7\u7CC8\u7CC9\u7CCD\u7CCF\u7CD3\u7CD4\u7CD5\u7CD7\u7CD9\u7CDA\u7CDD\u7CE6\u7CE9\u7CEB\u7CF5\u7D03\u7D07\u7D08\u7D09\u7D0F\u7D11\u7D12\u7D13\u7D16\u7D1D\u7D1E\u7D23\u7D26\u7D2A\u7D2D\u7D31\u7D3C\u7D3D\u7D3E\u7D40\u7D41\u7D47\u7D48\u7D4D\u7D51\u7D53\u7D57\u7D59\u7D5A\u7D5C\u7D5D\u7D65\u7D67\u7D6A\u7D70\u7D78\u7D7A\u7D7B\u7D7F\u7D81\u7D82\u7D83\u7D85\u7D86\u7D88\u7D8B\u7D8C\u7D8D\u7D91\u7D96\u7D97\u7D9D"],
      ["8fd4a1", "\u7D9E\u7DA6\u7DA7\u7DAA\u7DB3\u7DB6\u7DB7\u7DB9\u7DC2", 4, "\u7DCC\u7DCD\u7DCE\u7DD7\u7DD9\u7E00\u7DE2\u7DE5\u7DE6\u7DEA\u7DEB\u7DED\u7DF1\u7DF5\u7DF6\u7DF9\u7DFA\u7E08\u7E10\u7E11\u7E15\u7E17\u7E1C\u7E1D\u7E20\u7E27\u7E28\u7E2C\u7E2D\u7E2F\u7E33\u7E36\u7E3F\u7E44\u7E45\u7E47\u7E4E\u7E50\u7E52\u7E58\u7E5F\u7E61\u7E62\u7E65\u7E6B\u7E6E\u7E6F\u7E73\u7E78\u7E7E\u7E81\u7E86\u7E87\u7E8A\u7E8D\u7E91\u7E95\u7E98\u7E9A\u7E9D\u7E9E\u7F3C\u7F3B\u7F3D\u7F3E\u7F3F\u7F43\u7F44\u7F47\u7F4F\u7F52\u7F53\u7F5B\u7F5C\u7F5D\u7F61\u7F63\u7F64\u7F65\u7F66\u7F6D"],
      ["8fd5a1", "\u7F71\u7F7D\u7F7E\u7F7F\u7F80\u7F8B\u7F8D\u7F8F\u7F90\u7F91\u7F96\u7F97\u7F9C\u7FA1\u7FA2\u7FA6\u7FAA\u7FAD\u7FB4\u7FBC\u7FBF\u7FC0\u7FC3\u7FC8\u7FCE\u7FCF\u7FDB\u7FDF\u7FE3\u7FE5\u7FE8\u7FEC\u7FEE\u7FEF\u7FF2\u7FFA\u7FFD\u7FFE\u7FFF\u8007\u8008\u800A\u800D\u800E\u800F\u8011\u8013\u8014\u8016\u801D\u801E\u801F\u8020\u8024\u8026\u802C\u802E\u8030\u8034\u8035\u8037\u8039\u803A\u803C\u803E\u8040\u8044\u8060\u8064\u8066\u806D\u8071\u8075\u8081\u8088\u808E\u809C\u809E\u80A6\u80A7\u80AB\u80B8\u80B9\u80C8\u80CD\u80CF\u80D2\u80D4\u80D5\u80D7\u80D8\u80E0\u80ED\u80EE"],
      ["8fd6a1", "\u80F0\u80F2\u80F3\u80F6\u80F9\u80FA\u80FE\u8103\u810B\u8116\u8117\u8118\u811C\u811E\u8120\u8124\u8127\u812C\u8130\u8135\u813A\u813C\u8145\u8147\u814A\u814C\u8152\u8157\u8160\u8161\u8167\u8168\u8169\u816D\u816F\u8177\u8181\u8190\u8184\u8185\u8186\u818B\u818E\u8196\u8198\u819B\u819E\u81A2\u81AE\u81B2\u81B4\u81BB\u81CB\u81C3\u81C5\u81CA\u81CE\u81CF\u81D5\u81D7\u81DB\u81DD\u81DE\u81E1\u81E4\u81EB\u81EC\u81F0\u81F1\u81F2\u81F5\u81F6\u81F8\u81F9\u81FD\u81FF\u8200\u8203\u820F\u8213\u8214\u8219\u821A\u821D\u8221\u8222\u8228\u8232\u8234\u823A\u8243\u8244\u8245\u8246"],
      ["8fd7a1", "\u824B\u824E\u824F\u8251\u8256\u825C\u8260\u8263\u8267\u826D\u8274\u827B\u827D\u827F\u8280\u8281\u8283\u8284\u8287\u8289\u828A\u828E\u8291\u8294\u8296\u8298\u829A\u829B\u82A0\u82A1\u82A3\u82A4\u82A7\u82A8\u82A9\u82AA\u82AE\u82B0\u82B2\u82B4\u82B7\u82BA\u82BC\u82BE\u82BF\u82C6\u82D0\u82D5\u82DA\u82E0\u82E2\u82E4\u82E8\u82EA\u82ED\u82EF\u82F6\u82F7\u82FD\u82FE\u8300\u8301\u8307\u8308\u830A\u830B\u8354\u831B\u831D\u831E\u831F\u8321\u8322\u832C\u832D\u832E\u8330\u8333\u8337\u833A\u833C\u833D\u8342\u8343\u8344\u8347\u834D\u834E\u8351\u8355\u8356\u8357\u8370\u8378"],
      ["8fd8a1", "\u837D\u837F\u8380\u8382\u8384\u8386\u838D\u8392\u8394\u8395\u8398\u8399\u839B\u839C\u839D\u83A6\u83A7\u83A9\u83AC\u83BE\u83BF\u83C0\u83C7\u83C9\u83CF\u83D0\u83D1\u83D4\u83DD\u8353\u83E8\u83EA\u83F6\u83F8\u83F9\u83FC\u8401\u8406\u840A\u840F\u8411\u8415\u8419\u83AD\u842F\u8439\u8445\u8447\u8448\u844A\u844D\u844F\u8451\u8452\u8456\u8458\u8459\u845A\u845C\u8460\u8464\u8465\u8467\u846A\u8470\u8473\u8474\u8476\u8478\u847C\u847D\u8481\u8485\u8492\u8493\u8495\u849E\u84A6\u84A8\u84A9\u84AA\u84AF\u84B1\u84B4\u84BA\u84BD\u84BE\u84C0\u84C2\u84C7\u84C8\u84CC\u84CF\u84D3"],
      ["8fd9a1", "\u84DC\u84E7\u84EA\u84EF\u84F0\u84F1\u84F2\u84F7\u8532\u84FA\u84FB\u84FD\u8502\u8503\u8507\u850C\u850E\u8510\u851C\u851E\u8522\u8523\u8524\u8525\u8527\u852A\u852B\u852F\u8533\u8534\u8536\u853F\u8546\u854F", 4, "\u8556\u8559\u855C", 6, "\u8564\u856B\u856F\u8579\u857A\u857B\u857D\u857F\u8581\u8585\u8586\u8589\u858B\u858C\u858F\u8593\u8598\u859D\u859F\u85A0\u85A2\u85A5\u85A7\u85B4\u85B6\u85B7\u85B8\u85BC\u85BD\u85BE\u85BF\u85C2\u85C7\u85CA\u85CB\u85CE\u85AD\u85D8\u85DA\u85DF\u85E0\u85E6\u85E8\u85ED\u85F3\u85F6\u85FC"],
      ["8fdaa1", "\u85FF\u8600\u8604\u8605\u860D\u860E\u8610\u8611\u8612\u8618\u8619\u861B\u861E\u8621\u8627\u8629\u8636\u8638\u863A\u863C\u863D\u8640\u8642\u8646\u8652\u8653\u8656\u8657\u8658\u8659\u865D\u8660", 4, "\u8669\u866C\u866F\u8675\u8676\u8677\u867A\u868D\u8691\u8696\u8698\u869A\u869C\u86A1\u86A6\u86A7\u86A8\u86AD\u86B1\u86B3\u86B4\u86B5\u86B7\u86B8\u86B9\u86BF\u86C0\u86C1\u86C3\u86C5\u86D1\u86D2\u86D5\u86D7\u86DA\u86DC\u86E0\u86E3\u86E5\u86E7\u8688\u86FA\u86FC\u86FD\u8704\u8705\u8707\u870B\u870E\u870F\u8710\u8713\u8714\u8719\u871E\u871F\u8721\u8723"],
      ["8fdba1", "\u8728\u872E\u872F\u8731\u8732\u8739\u873A\u873C\u873D\u873E\u8740\u8743\u8745\u874D\u8758\u875D\u8761\u8764\u8765\u876F\u8771\u8772\u877B\u8783", 6, "\u878B\u878C\u8790\u8793\u8795\u8797\u8798\u8799\u879E\u87A0\u87A3\u87A7\u87AC\u87AD\u87AE\u87B1\u87B5\u87BE\u87BF\u87C1\u87C8\u87C9\u87CA\u87CE\u87D5\u87D6\u87D9\u87DA\u87DC\u87DF\u87E2\u87E3\u87E4\u87EA\u87EB\u87ED\u87F1\u87F3\u87F8\u87FA\u87FF\u8801\u8803\u8806\u8809\u880A\u880B\u8810\u8819\u8812\u8813\u8814\u8818\u881A\u881B\u881C\u881E\u881F\u8828\u882D\u882E\u8830\u8832\u8835"],
      ["8fdca1", "\u883A\u883C\u8841\u8843\u8845\u8848\u8849\u884A\u884B\u884E\u8851\u8855\u8856\u8858\u885A\u885C\u885F\u8860\u8864\u8869\u8871\u8879\u887B\u8880\u8898\u889A\u889B\u889C\u889F\u88A0\u88A8\u88AA\u88BA\u88BD\u88BE\u88C0\u88CA", 4, "\u88D1\u88D2\u88D3\u88DB\u88DE\u88E7\u88EF\u88F0\u88F1\u88F5\u88F7\u8901\u8906\u890D\u890E\u890F\u8915\u8916\u8918\u8919\u891A\u891C\u8920\u8926\u8927\u8928\u8930\u8931\u8932\u8935\u8939\u893A\u893E\u8940\u8942\u8945\u8946\u8949\u894F\u8952\u8957\u895A\u895B\u895C\u8961\u8962\u8963\u896B\u896E\u8970\u8973\u8975\u897A"],
      ["8fdda1", "\u897B\u897C\u897D\u8989\u898D\u8990\u8994\u8995\u899B\u899C\u899F\u89A0\u89A5\u89B0\u89B4\u89B5\u89B6\u89B7\u89BC\u89D4", 4, "\u89E5\u89E9\u89EB\u89ED\u89F1\u89F3\u89F6\u89F9\u89FD\u89FF\u8A04\u8A05\u8A07\u8A0F\u8A11\u8A12\u8A14\u8A15\u8A1E\u8A20\u8A22\u8A24\u8A26\u8A2B\u8A2C\u8A2F\u8A35\u8A37\u8A3D\u8A3E\u8A40\u8A43\u8A45\u8A47\u8A49\u8A4D\u8A4E\u8A53\u8A56\u8A57\u8A58\u8A5C\u8A5D\u8A61\u8A65\u8A67\u8A75\u8A76\u8A77\u8A79\u8A7A\u8A7B\u8A7E\u8A7F\u8A80\u8A83\u8A86\u8A8B\u8A8F\u8A90\u8A92\u8A96\u8A97\u8A99\u8A9F\u8AA7\u8AA9\u8AAE\u8AAF\u8AB3"],
      ["8fdea1", "\u8AB6\u8AB7\u8ABB\u8ABE\u8AC3\u8AC6\u8AC8\u8AC9\u8ACA\u8AD1\u8AD3\u8AD4\u8AD5\u8AD7\u8ADD\u8ADF\u8AEC\u8AF0\u8AF4\u8AF5\u8AF6\u8AFC\u8AFF\u8B05\u8B06\u8B0B\u8B11\u8B1C\u8B1E\u8B1F\u8B0A\u8B2D\u8B30\u8B37\u8B3C\u8B42", 4, "\u8B48\u8B52\u8B53\u8B54\u8B59\u8B4D\u8B5E\u8B63\u8B6D\u8B76\u8B78\u8B79\u8B7C\u8B7E\u8B81\u8B84\u8B85\u8B8B\u8B8D\u8B8F\u8B94\u8B95\u8B9C\u8B9E\u8B9F\u8C38\u8C39\u8C3D\u8C3E\u8C45\u8C47\u8C49\u8C4B\u8C4F\u8C51\u8C53\u8C54\u8C57\u8C58\u8C5B\u8C5D\u8C59\u8C63\u8C64\u8C66\u8C68\u8C69\u8C6D\u8C73\u8C75\u8C76\u8C7B\u8C7E\u8C86"],
      ["8fdfa1", "\u8C87\u8C8B\u8C90\u8C92\u8C93\u8C99\u8C9B\u8C9C\u8CA4\u8CB9\u8CBA\u8CC5\u8CC6\u8CC9\u8CCB\u8CCF\u8CD6\u8CD5\u8CD9\u8CDD\u8CE1\u8CE8\u8CEC\u8CEF\u8CF0\u8CF2\u8CF5\u8CF7\u8CF8\u8CFE\u8CFF\u8D01\u8D03\u8D09\u8D12\u8D17\u8D1B\u8D65\u8D69\u8D6C\u8D6E\u8D7F\u8D82\u8D84\u8D88\u8D8D\u8D90\u8D91\u8D95\u8D9E\u8D9F\u8DA0\u8DA6\u8DAB\u8DAC\u8DAF\u8DB2\u8DB5\u8DB7\u8DB9\u8DBB\u8DC0\u8DC5\u8DC6\u8DC7\u8DC8\u8DCA\u8DCE\u8DD1\u8DD4\u8DD5\u8DD7\u8DD9\u8DE4\u8DE5\u8DE7\u8DEC\u8DF0\u8DBC\u8DF1\u8DF2\u8DF4\u8DFD\u8E01\u8E04\u8E05\u8E06\u8E0B\u8E11\u8E14\u8E16\u8E20\u8E21\u8E22"],
      ["8fe0a1", "\u8E23\u8E26\u8E27\u8E31\u8E33\u8E36\u8E37\u8E38\u8E39\u8E3D\u8E40\u8E41\u8E4B\u8E4D\u8E4E\u8E4F\u8E54\u8E5B\u8E5C\u8E5D\u8E5E\u8E61\u8E62\u8E69\u8E6C\u8E6D\u8E6F\u8E70\u8E71\u8E79\u8E7A\u8E7B\u8E82\u8E83\u8E89\u8E90\u8E92\u8E95\u8E9A\u8E9B\u8E9D\u8E9E\u8EA2\u8EA7\u8EA9\u8EAD\u8EAE\u8EB3\u8EB5\u8EBA\u8EBB\u8EC0\u8EC1\u8EC3\u8EC4\u8EC7\u8ECF\u8ED1\u8ED4\u8EDC\u8EE8\u8EEE\u8EF0\u8EF1\u8EF7\u8EF9\u8EFA\u8EED\u8F00\u8F02\u8F07\u8F08\u8F0F\u8F10\u8F16\u8F17\u8F18\u8F1E\u8F20\u8F21\u8F23\u8F25\u8F27\u8F28\u8F2C\u8F2D\u8F2E\u8F34\u8F35\u8F36\u8F37\u8F3A\u8F40\u8F41"],
      ["8fe1a1", "\u8F43\u8F47\u8F4F\u8F51", 4, "\u8F58\u8F5D\u8F5E\u8F65\u8F9D\u8FA0\u8FA1\u8FA4\u8FA5\u8FA6\u8FB5\u8FB6\u8FB8\u8FBE\u8FC0\u8FC1\u8FC6\u8FCA\u8FCB\u8FCD\u8FD0\u8FD2\u8FD3\u8FD5\u8FE0\u8FE3\u8FE4\u8FE8\u8FEE\u8FF1\u8FF5\u8FF6\u8FFB\u8FFE\u9002\u9004\u9008\u900C\u9018\u901B\u9028\u9029\u902F\u902A\u902C\u902D\u9033\u9034\u9037\u903F\u9043\u9044\u904C\u905B\u905D\u9062\u9066\u9067\u906C\u9070\u9074\u9079\u9085\u9088\u908B\u908C\u908E\u9090\u9095\u9097\u9098\u9099\u909B\u90A0\u90A1\u90A2\u90A5\u90B0\u90B2\u90B3\u90B4\u90B6\u90BD\u90CC\u90BE\u90C3"],
      ["8fe2a1", "\u90C4\u90C5\u90C7\u90C8\u90D5\u90D7\u90D8\u90D9\u90DC\u90DD\u90DF\u90E5\u90D2\u90F6\u90EB\u90EF\u90F0\u90F4\u90FE\u90FF\u9100\u9104\u9105\u9106\u9108\u910D\u9110\u9114\u9116\u9117\u9118\u911A\u911C\u911E\u9120\u9125\u9122\u9123\u9127\u9129\u912E\u912F\u9131\u9134\u9136\u9137\u9139\u913A\u913C\u913D\u9143\u9147\u9148\u914F\u9153\u9157\u9159\u915A\u915B\u9161\u9164\u9167\u916D\u9174\u9179\u917A\u917B\u9181\u9183\u9185\u9186\u918A\u918E\u9191\u9193\u9194\u9195\u9198\u919E\u91A1\u91A6\u91A8\u91AC\u91AD\u91AE\u91B0\u91B1\u91B2\u91B3\u91B6\u91BB\u91BC\u91BD\u91BF"],
      ["8fe3a1", "\u91C2\u91C3\u91C5\u91D3\u91D4\u91D7\u91D9\u91DA\u91DE\u91E4\u91E5\u91E9\u91EA\u91EC", 5, "\u91F7\u91F9\u91FB\u91FD\u9200\u9201\u9204\u9205\u9206\u9207\u9209\u920A\u920C\u9210\u9212\u9213\u9216\u9218\u921C\u921D\u9223\u9224\u9225\u9226\u9228\u922E\u922F\u9230\u9233\u9235\u9236\u9238\u9239\u923A\u923C\u923E\u9240\u9242\u9243\u9246\u9247\u924A\u924D\u924E\u924F\u9251\u9258\u9259\u925C\u925D\u9260\u9261\u9265\u9267\u9268\u9269\u926E\u926F\u9270\u9275", 4, "\u927B\u927C\u927D\u927F\u9288\u9289\u928A\u928D\u928E\u9292\u9297"],
      ["8fe4a1", "\u9299\u929F\u92A0\u92A4\u92A5\u92A7\u92A8\u92AB\u92AF\u92B2\u92B6\u92B8\u92BA\u92BB\u92BC\u92BD\u92BF", 4, "\u92C5\u92C6\u92C7\u92C8\u92CB\u92CC\u92CD\u92CE\u92D0\u92D3\u92D5\u92D7\u92D8\u92D9\u92DC\u92DD\u92DF\u92E0\u92E1\u92E3\u92E5\u92E7\u92E8\u92EC\u92EE\u92F0\u92F9\u92FB\u92FF\u9300\u9302\u9308\u930D\u9311\u9314\u9315\u931C\u931D\u931E\u931F\u9321\u9324\u9325\u9327\u9329\u932A\u9333\u9334\u9336\u9337\u9347\u9348\u9349\u9350\u9351\u9352\u9355\u9357\u9358\u935A\u935E\u9364\u9365\u9367\u9369\u936A\u936D\u936F\u9370\u9371\u9373\u9374\u9376"],
      ["8fe5a1", "\u937A\u937D\u937F\u9380\u9381\u9382\u9388\u938A\u938B\u938D\u938F\u9392\u9395\u9398\u939B\u939E\u93A1\u93A3\u93A4\u93A6\u93A8\u93AB\u93B4\u93B5\u93B6\u93BA\u93A9\u93C1\u93C4\u93C5\u93C6\u93C7\u93C9", 4, "\u93D3\u93D9\u93DC\u93DE\u93DF\u93E2\u93E6\u93E7\u93F9\u93F7\u93F8\u93FA\u93FB\u93FD\u9401\u9402\u9404\u9408\u9409\u940D\u940E\u940F\u9415\u9416\u9417\u941F\u942E\u942F\u9431\u9432\u9433\u9434\u943B\u943F\u943D\u9443\u9445\u9448\u944A\u944C\u9455\u9459\u945C\u945F\u9461\u9463\u9468\u946B\u946D\u946E\u946F\u9471\u9472\u9484\u9483\u9578\u9579"],
      ["8fe6a1", "\u957E\u9584\u9588\u958C\u958D\u958E\u959D\u959E\u959F\u95A1\u95A6\u95A9\u95AB\u95AC\u95B4\u95B6\u95BA\u95BD\u95BF\u95C6\u95C8\u95C9\u95CB\u95D0\u95D1\u95D2\u95D3\u95D9\u95DA\u95DD\u95DE\u95DF\u95E0\u95E4\u95E6\u961D\u961E\u9622\u9624\u9625\u9626\u962C\u9631\u9633\u9637\u9638\u9639\u963A\u963C\u963D\u9641\u9652\u9654\u9656\u9657\u9658\u9661\u966E\u9674\u967B\u967C\u967E\u967F\u9681\u9682\u9683\u9684\u9689\u9691\u9696\u969A\u969D\u969F\u96A4\u96A5\u96A6\u96A9\u96AE\u96AF\u96B3\u96BA\u96CA\u96D2\u5DB2\u96D8\u96DA\u96DD\u96DE\u96DF\u96E9\u96EF\u96F1\u96FA\u9702"],
      ["8fe7a1", "\u9703\u9705\u9709\u971A\u971B\u971D\u9721\u9722\u9723\u9728\u9731\u9733\u9741\u9743\u974A\u974E\u974F\u9755\u9757\u9758\u975A\u975B\u9763\u9767\u976A\u976E\u9773\u9776\u9777\u9778\u977B\u977D\u977F\u9780\u9789\u9795\u9796\u9797\u9799\u979A\u979E\u979F\u97A2\u97AC\u97AE\u97B1\u97B2\u97B5\u97B6\u97B8\u97B9\u97BA\u97BC\u97BE\u97BF\u97C1\u97C4\u97C5\u97C7\u97C9\u97CA\u97CC\u97CD\u97CE\u97D0\u97D1\u97D4\u97D7\u97D8\u97D9\u97DD\u97DE\u97E0\u97DB\u97E1\u97E4\u97EF\u97F1\u97F4\u97F7\u97F8\u97FA\u9807\u980A\u9819\u980D\u980E\u9814\u9816\u981C\u981E\u9820\u9823\u9826"],
      ["8fe8a1", "\u982B\u982E\u982F\u9830\u9832\u9833\u9835\u9825\u983E\u9844\u9847\u984A\u9851\u9852\u9853\u9856\u9857\u9859\u985A\u9862\u9863\u9865\u9866\u986A\u986C\u98AB\u98AD\u98AE\u98B0\u98B4\u98B7\u98B8\u98BA\u98BB\u98BF\u98C2\u98C5\u98C8\u98CC\u98E1\u98E3\u98E5\u98E6\u98E7\u98EA\u98F3\u98F6\u9902\u9907\u9908\u9911\u9915\u9916\u9917\u991A\u991B\u991C\u991F\u9922\u9926\u9927\u992B\u9931", 4, "\u9939\u993A\u993B\u993C\u9940\u9941\u9946\u9947\u9948\u994D\u994E\u9954\u9958\u9959\u995B\u995C\u995E\u995F\u9960\u999B\u999D\u999F\u99A6\u99B0\u99B1\u99B2\u99B5"],
      ["8fe9a1", "\u99B9\u99BA\u99BD\u99BF\u99C3\u99C9\u99D3\u99D4\u99D9\u99DA\u99DC\u99DE\u99E7\u99EA\u99EB\u99EC\u99F0\u99F4\u99F5\u99F9\u99FD\u99FE\u9A02\u9A03\u9A04\u9A0B\u9A0C\u9A10\u9A11\u9A16\u9A1E\u9A20\u9A22\u9A23\u9A24\u9A27\u9A2D\u9A2E\u9A33\u9A35\u9A36\u9A38\u9A47\u9A41\u9A44\u9A4A\u9A4B\u9A4C\u9A4E\u9A51\u9A54\u9A56\u9A5D\u9AAA\u9AAC\u9AAE\u9AAF\u9AB2\u9AB4\u9AB5\u9AB6\u9AB9\u9ABB\u9ABE\u9ABF\u9AC1\u9AC3\u9AC6\u9AC8\u9ACE\u9AD0\u9AD2\u9AD5\u9AD6\u9AD7\u9ADB\u9ADC\u9AE0\u9AE4\u9AE5\u9AE7\u9AE9\u9AEC\u9AF2\u9AF3\u9AF5\u9AF9\u9AFA\u9AFD\u9AFF", 4],
      ["8feaa1", "\u9B04\u9B05\u9B08\u9B09\u9B0B\u9B0C\u9B0D\u9B0E\u9B10\u9B12\u9B16\u9B19\u9B1B\u9B1C\u9B20\u9B26\u9B2B\u9B2D\u9B33\u9B34\u9B35\u9B37\u9B39\u9B3A\u9B3D\u9B48\u9B4B\u9B4C\u9B55\u9B56\u9B57\u9B5B\u9B5E\u9B61\u9B63\u9B65\u9B66\u9B68\u9B6A", 4, "\u9B73\u9B75\u9B77\u9B78\u9B79\u9B7F\u9B80\u9B84\u9B85\u9B86\u9B87\u9B89\u9B8A\u9B8B\u9B8D\u9B8F\u9B90\u9B94\u9B9A\u9B9D\u9B9E\u9BA6\u9BA7\u9BA9\u9BAC\u9BB0\u9BB1\u9BB2\u9BB7\u9BB8\u9BBB\u9BBC\u9BBE\u9BBF\u9BC1\u9BC7\u9BC8\u9BCE\u9BD0\u9BD7\u9BD8\u9BDD\u9BDF\u9BE5\u9BE7\u9BEA\u9BEB\u9BEF\u9BF3\u9BF7\u9BF8"],
      ["8feba1", "\u9BF9\u9BFA\u9BFD\u9BFF\u9C00\u9C02\u9C0B\u9C0F\u9C11\u9C16\u9C18\u9C19\u9C1A\u9C1C\u9C1E\u9C22\u9C23\u9C26", 4, "\u9C31\u9C35\u9C36\u9C37\u9C3D\u9C41\u9C43\u9C44\u9C45\u9C49\u9C4A\u9C4E\u9C4F\u9C50\u9C53\u9C54\u9C56\u9C58\u9C5B\u9C5D\u9C5E\u9C5F\u9C63\u9C69\u9C6A\u9C5C\u9C6B\u9C68\u9C6E\u9C70\u9C72\u9C75\u9C77\u9C7B\u9CE6\u9CF2\u9CF7\u9CF9\u9D0B\u9D02\u9D11\u9D17\u9D18\u9D1C\u9D1D\u9D1E\u9D2F\u9D30\u9D32\u9D33\u9D34\u9D3A\u9D3C\u9D45\u9D3D\u9D42\u9D43\u9D47\u9D4A\u9D53\u9D54\u9D5F\u9D63\u9D62\u9D65\u9D69\u9D6A\u9D6B\u9D70\u9D76\u9D77\u9D7B"],
      ["8feca1", "\u9D7C\u9D7E\u9D83\u9D84\u9D86\u9D8A\u9D8D\u9D8E\u9D92\u9D93\u9D95\u9D96\u9D97\u9D98\u9DA1\u9DAA\u9DAC\u9DAE\u9DB1\u9DB5\u9DB9\u9DBC\u9DBF\u9DC3\u9DC7\u9DC9\u9DCA\u9DD4\u9DD5\u9DD6\u9DD7\u9DDA\u9DDE\u9DDF\u9DE0\u9DE5\u9DE7\u9DE9\u9DEB\u9DEE\u9DF0\u9DF3\u9DF4\u9DFE\u9E0A\u9E02\u9E07\u9E0E\u9E10\u9E11\u9E12\u9E15\u9E16\u9E19\u9E1C\u9E1D\u9E7A\u9E7B\u9E7C\u9E80\u9E82\u9E83\u9E84\u9E85\u9E87\u9E8E\u9E8F\u9E96\u9E98\u9E9B\u9E9E\u9EA4\u9EA8\u9EAC\u9EAE\u9EAF\u9EB0\u9EB3\u9EB4\u9EB5\u9EC6\u9EC8\u9ECB\u9ED5\u9EDF\u9EE4\u9EE7\u9EEC\u9EED\u9EEE\u9EF0\u9EF1\u9EF2\u9EF5"],
      ["8feda1", "\u9EF8\u9EFF\u9F02\u9F03\u9F09\u9F0F\u9F10\u9F11\u9F12\u9F14\u9F16\u9F17\u9F19\u9F1A\u9F1B\u9F1F\u9F22\u9F26\u9F2A\u9F2B\u9F2F\u9F31\u9F32\u9F34\u9F37\u9F39\u9F3A\u9F3C\u9F3D\u9F3F\u9F41\u9F43", 4, "\u9F53\u9F55\u9F56\u9F57\u9F58\u9F5A\u9F5D\u9F5E\u9F68\u9F69\u9F6D", 4, "\u9F73\u9F75\u9F7A\u9F7D\u9F8F\u9F90\u9F91\u9F92\u9F94\u9F96\u9F97\u9F9E\u9FA1\u9FA2\u9FA3\u9FA5"]
    ];
  }
});

// node_modules/iconv-lite/encodings/tables/cp936.json
var require_cp936 = __commonJS({
  "node_modules/iconv-lite/encodings/tables/cp936.json"(exports, module) {
    module.exports = [
      ["0", "\0", 127, "\u20AC"],
      ["8140", "\u4E02\u4E04\u4E05\u4E06\u4E0F\u4E12\u4E17\u4E1F\u4E20\u4E21\u4E23\u4E26\u4E29\u4E2E\u4E2F\u4E31\u4E33\u4E35\u4E37\u4E3C\u4E40\u4E41\u4E42\u4E44\u4E46\u4E4A\u4E51\u4E55\u4E57\u4E5A\u4E5B\u4E62\u4E63\u4E64\u4E65\u4E67\u4E68\u4E6A", 5, "\u4E72\u4E74", 9, "\u4E7F", 6, "\u4E87\u4E8A"],
      ["8180", "\u4E90\u4E96\u4E97\u4E99\u4E9C\u4E9D\u4E9E\u4EA3\u4EAA\u4EAF\u4EB0\u4EB1\u4EB4\u4EB6\u4EB7\u4EB8\u4EB9\u4EBC\u4EBD\u4EBE\u4EC8\u4ECC\u4ECF\u4ED0\u4ED2\u4EDA\u4EDB\u4EDC\u4EE0\u4EE2\u4EE6\u4EE7\u4EE9\u4EED\u4EEE\u4EEF\u4EF1\u4EF4\u4EF8\u4EF9\u4EFA\u4EFC\u4EFE\u4F00\u4F02", 6, "\u4F0B\u4F0C\u4F12", 4, "\u4F1C\u4F1D\u4F21\u4F23\u4F28\u4F29\u4F2C\u4F2D\u4F2E\u4F31\u4F33\u4F35\u4F37\u4F39\u4F3B\u4F3E", 4, "\u4F44\u4F45\u4F47", 5, "\u4F52\u4F54\u4F56\u4F61\u4F62\u4F66\u4F68\u4F6A\u4F6B\u4F6D\u4F6E\u4F71\u4F72\u4F75\u4F77\u4F78\u4F79\u4F7A\u4F7D\u4F80\u4F81\u4F82\u4F85\u4F86\u4F87\u4F8A\u4F8C\u4F8E\u4F90\u4F92\u4F93\u4F95\u4F96\u4F98\u4F99\u4F9A\u4F9C\u4F9E\u4F9F\u4FA1\u4FA2"],
      ["8240", "\u4FA4\u4FAB\u4FAD\u4FB0", 4, "\u4FB6", 8, "\u4FC0\u4FC1\u4FC2\u4FC6\u4FC7\u4FC8\u4FC9\u4FCB\u4FCC\u4FCD\u4FD2", 4, "\u4FD9\u4FDB\u4FE0\u4FE2\u4FE4\u4FE5\u4FE7\u4FEB\u4FEC\u4FF0\u4FF2\u4FF4\u4FF5\u4FF6\u4FF7\u4FF9\u4FFB\u4FFC\u4FFD\u4FFF", 11],
      ["8280", "\u500B\u500E\u5010\u5011\u5013\u5015\u5016\u5017\u501B\u501D\u501E\u5020\u5022\u5023\u5024\u5027\u502B\u502F", 10, "\u503B\u503D\u503F\u5040\u5041\u5042\u5044\u5045\u5046\u5049\u504A\u504B\u504D\u5050", 4, "\u5056\u5057\u5058\u5059\u505B\u505D", 7, "\u5066", 5, "\u506D", 8, "\u5078\u5079\u507A\u507C\u507D\u5081\u5082\u5083\u5084\u5086\u5087\u5089\u508A\u508B\u508C\u508E", 20, "\u50A4\u50A6\u50AA\u50AB\u50AD", 4, "\u50B3", 6, "\u50BC"],
      ["8340", "\u50BD", 17, "\u50D0", 5, "\u50D7\u50D8\u50D9\u50DB", 10, "\u50E8\u50E9\u50EA\u50EB\u50EF\u50F0\u50F1\u50F2\u50F4\u50F6", 4, "\u50FC", 9, "\u5108"],
      ["8380", "\u5109\u510A\u510C", 5, "\u5113", 13, "\u5122", 28, "\u5142\u5147\u514A\u514C\u514E\u514F\u5150\u5152\u5153\u5157\u5158\u5159\u515B\u515D", 4, "\u5163\u5164\u5166\u5167\u5169\u516A\u516F\u5172\u517A\u517E\u517F\u5183\u5184\u5186\u5187\u518A\u518B\u518E\u518F\u5190\u5191\u5193\u5194\u5198\u519A\u519D\u519E\u519F\u51A1\u51A3\u51A6", 4, "\u51AD\u51AE\u51B4\u51B8\u51B9\u51BA\u51BE\u51BF\u51C1\u51C2\u51C3\u51C5\u51C8\u51CA\u51CD\u51CE\u51D0\u51D2", 5],
      ["8440", "\u51D8\u51D9\u51DA\u51DC\u51DE\u51DF\u51E2\u51E3\u51E5", 5, "\u51EC\u51EE\u51F1\u51F2\u51F4\u51F7\u51FE\u5204\u5205\u5209\u520B\u520C\u520F\u5210\u5213\u5214\u5215\u521C\u521E\u521F\u5221\u5222\u5223\u5225\u5226\u5227\u522A\u522C\u522F\u5231\u5232\u5234\u5235\u523C\u523E\u5244", 5, "\u524B\u524E\u524F\u5252\u5253\u5255\u5257\u5258"],
      ["8480", "\u5259\u525A\u525B\u525D\u525F\u5260\u5262\u5263\u5264\u5266\u5268\u526B\u526C\u526D\u526E\u5270\u5271\u5273", 9, "\u527E\u5280\u5283", 4, "\u5289", 6, "\u5291\u5292\u5294", 6, "\u529C\u52A4\u52A5\u52A6\u52A7\u52AE\u52AF\u52B0\u52B4", 9, "\u52C0\u52C1\u52C2\u52C4\u52C5\u52C6\u52C8\u52CA\u52CC\u52CD\u52CE\u52CF\u52D1\u52D3\u52D4\u52D5\u52D7\u52D9", 5, "\u52E0\u52E1\u52E2\u52E3\u52E5", 10, "\u52F1", 7, "\u52FB\u52FC\u52FD\u5301\u5302\u5303\u5304\u5307\u5309\u530A\u530B\u530C\u530E"],
      ["8540", "\u5311\u5312\u5313\u5314\u5318\u531B\u531C\u531E\u531F\u5322\u5324\u5325\u5327\u5328\u5329\u532B\u532C\u532D\u532F", 9, "\u533C\u533D\u5340\u5342\u5344\u5346\u534B\u534C\u534D\u5350\u5354\u5358\u5359\u535B\u535D\u5365\u5368\u536A\u536C\u536D\u5372\u5376\u5379\u537B\u537C\u537D\u537E\u5380\u5381\u5383\u5387\u5388\u538A\u538E\u538F"],
      ["8580", "\u5390", 4, "\u5396\u5397\u5399\u539B\u539C\u539E\u53A0\u53A1\u53A4\u53A7\u53AA\u53AB\u53AC\u53AD\u53AF", 6, "\u53B7\u53B8\u53B9\u53BA\u53BC\u53BD\u53BE\u53C0\u53C3", 4, "\u53CE\u53CF\u53D0\u53D2\u53D3\u53D5\u53DA\u53DC\u53DD\u53DE\u53E1\u53E2\u53E7\u53F4\u53FA\u53FE\u53FF\u5400\u5402\u5405\u5407\u540B\u5414\u5418\u5419\u541A\u541C\u5422\u5424\u5425\u542A\u5430\u5433\u5436\u5437\u543A\u543D\u543F\u5441\u5442\u5444\u5445\u5447\u5449\u544C\u544D\u544E\u544F\u5451\u545A\u545D", 4, "\u5463\u5465\u5467\u5469", 7, "\u5474\u5479\u547A\u547E\u547F\u5481\u5483\u5485\u5487\u5488\u5489\u548A\u548D\u5491\u5493\u5497\u5498\u549C\u549E\u549F\u54A0\u54A1"],
      ["8640", "\u54A2\u54A5\u54AE\u54B0\u54B2\u54B5\u54B6\u54B7\u54B9\u54BA\u54BC\u54BE\u54C3\u54C5\u54CA\u54CB\u54D6\u54D8\u54DB\u54E0", 4, "\u54EB\u54EC\u54EF\u54F0\u54F1\u54F4", 5, "\u54FB\u54FE\u5500\u5502\u5503\u5504\u5505\u5508\u550A", 4, "\u5512\u5513\u5515", 5, "\u551C\u551D\u551E\u551F\u5521\u5525\u5526"],
      ["8680", "\u5528\u5529\u552B\u552D\u5532\u5534\u5535\u5536\u5538\u5539\u553A\u553B\u553D\u5540\u5542\u5545\u5547\u5548\u554B", 4, "\u5551\u5552\u5553\u5554\u5557", 4, "\u555D\u555E\u555F\u5560\u5562\u5563\u5568\u5569\u556B\u556F", 5, "\u5579\u557A\u557D\u557F\u5585\u5586\u558C\u558D\u558E\u5590\u5592\u5593\u5595\u5596\u5597\u559A\u559B\u559E\u55A0", 6, "\u55A8", 8, "\u55B2\u55B4\u55B6\u55B8\u55BA\u55BC\u55BF", 4, "\u55C6\u55C7\u55C8\u55CA\u55CB\u55CE\u55CF\u55D0\u55D5\u55D7", 4, "\u55DE\u55E0\u55E2\u55E7\u55E9\u55ED\u55EE\u55F0\u55F1\u55F4\u55F6\u55F8", 4, "\u55FF\u5602\u5603\u5604\u5605"],
      ["8740", "\u5606\u5607\u560A\u560B\u560D\u5610", 7, "\u5619\u561A\u561C\u561D\u5620\u5621\u5622\u5625\u5626\u5628\u5629\u562A\u562B\u562E\u562F\u5630\u5633\u5635\u5637\u5638\u563A\u563C\u563D\u563E\u5640", 11, "\u564F", 4, "\u5655\u5656\u565A\u565B\u565D", 4],
      ["8780", "\u5663\u5665\u5666\u5667\u566D\u566E\u566F\u5670\u5672\u5673\u5674\u5675\u5677\u5678\u5679\u567A\u567D", 7, "\u5687", 6, "\u5690\u5691\u5692\u5694", 14, "\u56A4", 10, "\u56B0", 6, "\u56B8\u56B9\u56BA\u56BB\u56BD", 12, "\u56CB", 8, "\u56D5\u56D6\u56D8\u56D9\u56DC\u56E3\u56E5", 5, "\u56EC\u56EE\u56EF\u56F2\u56F3\u56F6\u56F7\u56F8\u56FB\u56FC\u5700\u5701\u5702\u5705\u5707\u570B", 6],
      ["8840", "\u5712", 9, "\u571D\u571E\u5720\u5721\u5722\u5724\u5725\u5726\u5727\u572B\u5731\u5732\u5734", 4, "\u573C\u573D\u573F\u5741\u5743\u5744\u5745\u5746\u5748\u5749\u574B\u5752", 4, "\u5758\u5759\u5762\u5763\u5765\u5767\u576C\u576E\u5770\u5771\u5772\u5774\u5775\u5778\u5779\u577A\u577D\u577E\u577F\u5780"],
      ["8880", "\u5781\u5787\u5788\u5789\u578A\u578D", 4, "\u5794", 6, "\u579C\u579D\u579E\u579F\u57A5\u57A8\u57AA\u57AC\u57AF\u57B0\u57B1\u57B3\u57B5\u57B6\u57B7\u57B9", 8, "\u57C4", 6, "\u57CC\u57CD\u57D0\u57D1\u57D3\u57D6\u57D7\u57DB\u57DC\u57DE\u57E1\u57E2\u57E3\u57E5", 7, "\u57EE\u57F0\u57F1\u57F2\u57F3\u57F5\u57F6\u57F7\u57FB\u57FC\u57FE\u57FF\u5801\u5803\u5804\u5805\u5808\u5809\u580A\u580C\u580E\u580F\u5810\u5812\u5813\u5814\u5816\u5817\u5818\u581A\u581B\u581C\u581D\u581F\u5822\u5823\u5825", 4, "\u582B", 4, "\u5831\u5832\u5833\u5834\u5836", 7],
      ["8940", "\u583E", 5, "\u5845", 6, "\u584E\u584F\u5850\u5852\u5853\u5855\u5856\u5857\u5859", 4, "\u585F", 5, "\u5866", 4, "\u586D", 16, "\u587F\u5882\u5884\u5886\u5887\u5888\u588A\u588B\u588C"],
      ["8980", "\u588D", 4, "\u5894", 4, "\u589B\u589C\u589D\u58A0", 7, "\u58AA", 17, "\u58BD\u58BE\u58BF\u58C0\u58C2\u58C3\u58C4\u58C6", 10, "\u58D2\u58D3\u58D4\u58D6", 13, "\u58E5", 5, "\u58ED\u58EF\u58F1\u58F2\u58F4\u58F5\u58F7\u58F8\u58FA", 7, "\u5903\u5905\u5906\u5908", 4, "\u590E\u5910\u5911\u5912\u5913\u5917\u5918\u591B\u591D\u591E\u5920\u5921\u5922\u5923\u5926\u5928\u592C\u5930\u5932\u5933\u5935\u5936\u593B"],
      ["8a40", "\u593D\u593E\u593F\u5940\u5943\u5945\u5946\u594A\u594C\u594D\u5950\u5952\u5953\u5959\u595B", 4, "\u5961\u5963\u5964\u5966", 12, "\u5975\u5977\u597A\u597B\u597C\u597E\u597F\u5980\u5985\u5989\u598B\u598C\u598E\u598F\u5990\u5991\u5994\u5995\u5998\u599A\u599B\u599C\u599D\u599F\u59A0\u59A1\u59A2\u59A6"],
      ["8a80", "\u59A7\u59AC\u59AD\u59B0\u59B1\u59B3", 5, "\u59BA\u59BC\u59BD\u59BF", 6, "\u59C7\u59C8\u59C9\u59CC\u59CD\u59CE\u59CF\u59D5\u59D6\u59D9\u59DB\u59DE", 4, "\u59E4\u59E6\u59E7\u59E9\u59EA\u59EB\u59ED", 11, "\u59FA\u59FC\u59FD\u59FE\u5A00\u5A02\u5A0A\u5A0B\u5A0D\u5A0E\u5A0F\u5A10\u5A12\u5A14\u5A15\u5A16\u5A17\u5A19\u5A1A\u5A1B\u5A1D\u5A1E\u5A21\u5A22\u5A24\u5A26\u5A27\u5A28\u5A2A", 6, "\u5A33\u5A35\u5A37", 4, "\u5A3D\u5A3E\u5A3F\u5A41", 4, "\u5A47\u5A48\u5A4B", 9, "\u5A56\u5A57\u5A58\u5A59\u5A5B", 5],
      ["8b40", "\u5A61\u5A63\u5A64\u5A65\u5A66\u5A68\u5A69\u5A6B", 8, "\u5A78\u5A79\u5A7B\u5A7C\u5A7D\u5A7E\u5A80", 17, "\u5A93", 6, "\u5A9C", 13, "\u5AAB\u5AAC"],
      ["8b80", "\u5AAD", 4, "\u5AB4\u5AB6\u5AB7\u5AB9", 4, "\u5ABF\u5AC0\u5AC3", 5, "\u5ACA\u5ACB\u5ACD", 4, "\u5AD3\u5AD5\u5AD7\u5AD9\u5ADA\u5ADB\u5ADD\u5ADE\u5ADF\u5AE2\u5AE4\u5AE5\u5AE7\u5AE8\u5AEA\u5AEC", 4, "\u5AF2", 22, "\u5B0A", 11, "\u5B18", 25, "\u5B33\u5B35\u5B36\u5B38", 7, "\u5B41", 6],
      ["8c40", "\u5B48", 7, "\u5B52\u5B56\u5B5E\u5B60\u5B61\u5B67\u5B68\u5B6B\u5B6D\u5B6E\u5B6F\u5B72\u5B74\u5B76\u5B77\u5B78\u5B79\u5B7B\u5B7C\u5B7E\u5B7F\u5B82\u5B86\u5B8A\u5B8D\u5B8E\u5B90\u5B91\u5B92\u5B94\u5B96\u5B9F\u5BA7\u5BA8\u5BA9\u5BAC\u5BAD\u5BAE\u5BAF\u5BB1\u5BB2\u5BB7\u5BBA\u5BBB\u5BBC\u5BC0\u5BC1\u5BC3\u5BC8\u5BC9\u5BCA\u5BCB\u5BCD\u5BCE\u5BCF"],
      ["8c80", "\u5BD1\u5BD4", 8, "\u5BE0\u5BE2\u5BE3\u5BE6\u5BE7\u5BE9", 4, "\u5BEF\u5BF1", 6, "\u5BFD\u5BFE\u5C00\u5C02\u5C03\u5C05\u5C07\u5C08\u5C0B\u5C0C\u5C0D\u5C0E\u5C10\u5C12\u5C13\u5C17\u5C19\u5C1B\u5C1E\u5C1F\u5C20\u5C21\u5C23\u5C26\u5C28\u5C29\u5C2A\u5C2B\u5C2D\u5C2E\u5C2F\u5C30\u5C32\u5C33\u5C35\u5C36\u5C37\u5C43\u5C44\u5C46\u5C47\u5C4C\u5C4D\u5C52\u5C53\u5C54\u5C56\u5C57\u5C58\u5C5A\u5C5B\u5C5C\u5C5D\u5C5F\u5C62\u5C64\u5C67", 6, "\u5C70\u5C72", 6, "\u5C7B\u5C7C\u5C7D\u5C7E\u5C80\u5C83", 4, "\u5C89\u5C8A\u5C8B\u5C8E\u5C8F\u5C92\u5C93\u5C95\u5C9D", 4, "\u5CA4", 4],
      ["8d40", "\u5CAA\u5CAE\u5CAF\u5CB0\u5CB2\u5CB4\u5CB6\u5CB9\u5CBA\u5CBB\u5CBC\u5CBE\u5CC0\u5CC2\u5CC3\u5CC5", 5, "\u5CCC", 5, "\u5CD3", 5, "\u5CDA", 6, "\u5CE2\u5CE3\u5CE7\u5CE9\u5CEB\u5CEC\u5CEE\u5CEF\u5CF1", 9, "\u5CFC", 4],
      ["8d80", "\u5D01\u5D04\u5D05\u5D08", 5, "\u5D0F", 4, "\u5D15\u5D17\u5D18\u5D19\u5D1A\u5D1C\u5D1D\u5D1F", 4, "\u5D25\u5D28\u5D2A\u5D2B\u5D2C\u5D2F", 4, "\u5D35", 7, "\u5D3F", 7, "\u5D48\u5D49\u5D4D", 10, "\u5D59\u5D5A\u5D5C\u5D5E", 10, "\u5D6A\u5D6D\u5D6E\u5D70\u5D71\u5D72\u5D73\u5D75", 12, "\u5D83", 21, "\u5D9A\u5D9B\u5D9C\u5D9E\u5D9F\u5DA0"],
      ["8e40", "\u5DA1", 21, "\u5DB8", 12, "\u5DC6", 6, "\u5DCE", 12, "\u5DDC\u5DDF\u5DE0\u5DE3\u5DE4\u5DEA\u5DEC\u5DED"],
      ["8e80", "\u5DF0\u5DF5\u5DF6\u5DF8", 4, "\u5DFF\u5E00\u5E04\u5E07\u5E09\u5E0A\u5E0B\u5E0D\u5E0E\u5E12\u5E13\u5E17\u5E1E", 7, "\u5E28", 4, "\u5E2F\u5E30\u5E32", 4, "\u5E39\u5E3A\u5E3E\u5E3F\u5E40\u5E41\u5E43\u5E46", 5, "\u5E4D", 6, "\u5E56", 4, "\u5E5C\u5E5D\u5E5F\u5E60\u5E63", 14, "\u5E75\u5E77\u5E79\u5E7E\u5E81\u5E82\u5E83\u5E85\u5E88\u5E89\u5E8C\u5E8D\u5E8E\u5E92\u5E98\u5E9B\u5E9D\u5EA1\u5EA2\u5EA3\u5EA4\u5EA8", 4, "\u5EAE", 4, "\u5EB4\u5EBA\u5EBB\u5EBC\u5EBD\u5EBF", 6],
      ["8f40", "\u5EC6\u5EC7\u5EC8\u5ECB", 5, "\u5ED4\u5ED5\u5ED7\u5ED8\u5ED9\u5EDA\u5EDC", 11, "\u5EE9\u5EEB", 8, "\u5EF5\u5EF8\u5EF9\u5EFB\u5EFC\u5EFD\u5F05\u5F06\u5F07\u5F09\u5F0C\u5F0D\u5F0E\u5F10\u5F12\u5F14\u5F16\u5F19\u5F1A\u5F1C\u5F1D\u5F1E\u5F21\u5F22\u5F23\u5F24"],
      ["8f80", "\u5F28\u5F2B\u5F2C\u5F2E\u5F30\u5F32", 6, "\u5F3B\u5F3D\u5F3E\u5F3F\u5F41", 14, "\u5F51\u5F54\u5F59\u5F5A\u5F5B\u5F5C\u5F5E\u5F5F\u5F60\u5F63\u5F65\u5F67\u5F68\u5F6B\u5F6E\u5F6F\u5F72\u5F74\u5F75\u5F76\u5F78\u5F7A\u5F7D\u5F7E\u5F7F\u5F83\u5F86\u5F8D\u5F8E\u5F8F\u5F91\u5F93\u5F94\u5F96\u5F9A\u5F9B\u5F9D\u5F9E\u5F9F\u5FA0\u5FA2", 5, "\u5FA9\u5FAB\u5FAC\u5FAF", 5, "\u5FB6\u5FB8\u5FB9\u5FBA\u5FBB\u5FBE", 4, "\u5FC7\u5FC8\u5FCA\u5FCB\u5FCE\u5FD3\u5FD4\u5FD5\u5FDA\u5FDB\u5FDC\u5FDE\u5FDF\u5FE2\u5FE3\u5FE5\u5FE6\u5FE8\u5FE9\u5FEC\u5FEF\u5FF0\u5FF2\u5FF3\u5FF4\u5FF6\u5FF7\u5FF9\u5FFA\u5FFC\u6007"],
      ["9040", "\u6008\u6009\u600B\u600C\u6010\u6011\u6013\u6017\u6018\u601A\u601E\u601F\u6022\u6023\u6024\u602C\u602D\u602E\u6030", 4, "\u6036", 4, "\u603D\u603E\u6040\u6044", 6, "\u604C\u604E\u604F\u6051\u6053\u6054\u6056\u6057\u6058\u605B\u605C\u605E\u605F\u6060\u6061\u6065\u6066\u606E\u6071\u6072\u6074\u6075\u6077\u607E\u6080"],
      ["9080", "\u6081\u6082\u6085\u6086\u6087\u6088\u608A\u608B\u608E\u608F\u6090\u6091\u6093\u6095\u6097\u6098\u6099\u609C\u609E\u60A1\u60A2\u60A4\u60A5\u60A7\u60A9\u60AA\u60AE\u60B0\u60B3\u60B5\u60B6\u60B7\u60B9\u60BA\u60BD", 7, "\u60C7\u60C8\u60C9\u60CC", 4, "\u60D2\u60D3\u60D4\u60D6\u60D7\u60D9\u60DB\u60DE\u60E1", 4, "\u60EA\u60F1\u60F2\u60F5\u60F7\u60F8\u60FB", 4, "\u6102\u6103\u6104\u6105\u6107\u610A\u610B\u610C\u6110", 4, "\u6116\u6117\u6118\u6119\u611B\u611C\u611D\u611E\u6121\u6122\u6125\u6128\u6129\u612A\u612C", 18, "\u6140", 6],
      ["9140", "\u6147\u6149\u614B\u614D\u614F\u6150\u6152\u6153\u6154\u6156", 6, "\u615E\u615F\u6160\u6161\u6163\u6164\u6165\u6166\u6169", 6, "\u6171\u6172\u6173\u6174\u6176\u6178", 18, "\u618C\u618D\u618F", 4, "\u6195"],
      ["9180", "\u6196", 6, "\u619E", 8, "\u61AA\u61AB\u61AD", 9, "\u61B8", 5, "\u61BF\u61C0\u61C1\u61C3", 4, "\u61C9\u61CC", 4, "\u61D3\u61D5", 16, "\u61E7", 13, "\u61F6", 8, "\u6200", 5, "\u6207\u6209\u6213\u6214\u6219\u621C\u621D\u621E\u6220\u6223\u6226\u6227\u6228\u6229\u622B\u622D\u622F\u6230\u6231\u6232\u6235\u6236\u6238", 4, "\u6242\u6244\u6245\u6246\u624A"],
      ["9240", "\u624F\u6250\u6255\u6256\u6257\u6259\u625A\u625C", 6, "\u6264\u6265\u6268\u6271\u6272\u6274\u6275\u6277\u6278\u627A\u627B\u627D\u6281\u6282\u6283\u6285\u6286\u6287\u6288\u628B", 5, "\u6294\u6299\u629C\u629D\u629E\u62A3\u62A6\u62A7\u62A9\u62AA\u62AD\u62AE\u62AF\u62B0\u62B2\u62B3\u62B4\u62B6\u62B7\u62B8\u62BA\u62BE\u62C0\u62C1"],
      ["9280", "\u62C3\u62CB\u62CF\u62D1\u62D5\u62DD\u62DE\u62E0\u62E1\u62E4\u62EA\u62EB\u62F0\u62F2\u62F5\u62F8\u62F9\u62FA\u62FB\u6300\u6303\u6304\u6305\u6306\u630A\u630B\u630C\u630D\u630F\u6310\u6312\u6313\u6314\u6315\u6317\u6318\u6319\u631C\u6326\u6327\u6329\u632C\u632D\u632E\u6330\u6331\u6333", 5, "\u633B\u633C\u633E\u633F\u6340\u6341\u6344\u6347\u6348\u634A\u6351\u6352\u6353\u6354\u6356", 7, "\u6360\u6364\u6365\u6366\u6368\u636A\u636B\u636C\u636F\u6370\u6372\u6373\u6374\u6375\u6378\u6379\u637C\u637D\u637E\u637F\u6381\u6383\u6384\u6385\u6386\u638B\u638D\u6391\u6393\u6394\u6395\u6397\u6399", 6, "\u63A1\u63A4\u63A6\u63AB\u63AF\u63B1\u63B2\u63B5\u63B6\u63B9\u63BB\u63BD\u63BF\u63C0"],
      ["9340", "\u63C1\u63C2\u63C3\u63C5\u63C7\u63C8\u63CA\u63CB\u63CC\u63D1\u63D3\u63D4\u63D5\u63D7", 6, "\u63DF\u63E2\u63E4", 4, "\u63EB\u63EC\u63EE\u63EF\u63F0\u63F1\u63F3\u63F5\u63F7\u63F9\u63FA\u63FB\u63FC\u63FE\u6403\u6404\u6406", 4, "\u640D\u640E\u6411\u6412\u6415", 5, "\u641D\u641F\u6422\u6423\u6424"],
      ["9380", "\u6425\u6427\u6428\u6429\u642B\u642E", 5, "\u6435", 4, "\u643B\u643C\u643E\u6440\u6442\u6443\u6449\u644B", 6, "\u6453\u6455\u6456\u6457\u6459", 4, "\u645F", 7, "\u6468\u646A\u646B\u646C\u646E", 9, "\u647B", 6, "\u6483\u6486\u6488", 8, "\u6493\u6494\u6497\u6498\u649A\u649B\u649C\u649D\u649F", 4, "\u64A5\u64A6\u64A7\u64A8\u64AA\u64AB\u64AF\u64B1\u64B2\u64B3\u64B4\u64B6\u64B9\u64BB\u64BD\u64BE\u64BF\u64C1\u64C3\u64C4\u64C6", 6, "\u64CF\u64D1\u64D3\u64D4\u64D5\u64D6\u64D9\u64DA"],
      ["9440", "\u64DB\u64DC\u64DD\u64DF\u64E0\u64E1\u64E3\u64E5\u64E7", 24, "\u6501", 7, "\u650A", 7, "\u6513", 4, "\u6519", 8],
      ["9480", "\u6522\u6523\u6524\u6526", 4, "\u652C\u652D\u6530\u6531\u6532\u6533\u6537\u653A\u653C\u653D\u6540", 4, "\u6546\u6547\u654A\u654B\u654D\u654E\u6550\u6552\u6553\u6554\u6557\u6558\u655A\u655C\u655F\u6560\u6561\u6564\u6565\u6567\u6568\u6569\u656A\u656D\u656E\u656F\u6571\u6573\u6575\u6576\u6578", 14, "\u6588\u6589\u658A\u658D\u658E\u658F\u6592\u6594\u6595\u6596\u6598\u659A\u659D\u659E\u65A0\u65A2\u65A3\u65A6\u65A8\u65AA\u65AC\u65AE\u65B1", 7, "\u65BA\u65BB\u65BE\u65BF\u65C0\u65C2\u65C7\u65C8\u65C9\u65CA\u65CD\u65D0\u65D1\u65D3\u65D4\u65D5\u65D8", 7, "\u65E1\u65E3\u65E4\u65EA\u65EB"],
      ["9540", "\u65F2\u65F3\u65F4\u65F5\u65F8\u65F9\u65FB", 4, "\u6601\u6604\u6605\u6607\u6608\u6609\u660B\u660D\u6610\u6611\u6612\u6616\u6617\u6618\u661A\u661B\u661C\u661E\u6621\u6622\u6623\u6624\u6626\u6629\u662A\u662B\u662C\u662E\u6630\u6632\u6633\u6637", 4, "\u663D\u663F\u6640\u6642\u6644", 6, "\u664D\u664E\u6650\u6651\u6658"],
      ["9580", "\u6659\u665B\u665C\u665D\u665E\u6660\u6662\u6663\u6665\u6667\u6669", 4, "\u6671\u6672\u6673\u6675\u6678\u6679\u667B\u667C\u667D\u667F\u6680\u6681\u6683\u6685\u6686\u6688\u6689\u668A\u668B\u668D\u668E\u668F\u6690\u6692\u6693\u6694\u6695\u6698", 4, "\u669E", 8, "\u66A9", 4, "\u66AF", 4, "\u66B5\u66B6\u66B7\u66B8\u66BA\u66BB\u66BC\u66BD\u66BF", 25, "\u66DA\u66DE", 7, "\u66E7\u66E8\u66EA", 5, "\u66F1\u66F5\u66F6\u66F8\u66FA\u66FB\u66FD\u6701\u6702\u6703"],
      ["9640", "\u6704\u6705\u6706\u6707\u670C\u670E\u670F\u6711\u6712\u6713\u6716\u6718\u6719\u671A\u671C\u671E\u6720", 5, "\u6727\u6729\u672E\u6730\u6732\u6733\u6736\u6737\u6738\u6739\u673B\u673C\u673E\u673F\u6741\u6744\u6745\u6747\u674A\u674B\u674D\u6752\u6754\u6755\u6757", 4, "\u675D\u6762\u6763\u6764\u6766\u6767\u676B\u676C\u676E\u6771\u6774\u6776"],
      ["9680", "\u6778\u6779\u677A\u677B\u677D\u6780\u6782\u6783\u6785\u6786\u6788\u678A\u678C\u678D\u678E\u678F\u6791\u6792\u6793\u6794\u6796\u6799\u679B\u679F\u67A0\u67A1\u67A4\u67A6\u67A9\u67AC\u67AE\u67B1\u67B2\u67B4\u67B9", 7, "\u67C2\u67C5", 9, "\u67D5\u67D6\u67D7\u67DB\u67DF\u67E1\u67E3\u67E4\u67E6\u67E7\u67E8\u67EA\u67EB\u67ED\u67EE\u67F2\u67F5", 7, "\u67FE\u6801\u6802\u6803\u6804\u6806\u680D\u6810\u6812\u6814\u6815\u6818", 4, "\u681E\u681F\u6820\u6822", 6, "\u682B", 6, "\u6834\u6835\u6836\u683A\u683B\u683F\u6847\u684B\u684D\u684F\u6852\u6856", 5],
      ["9740", "\u685C\u685D\u685E\u685F\u686A\u686C", 7, "\u6875\u6878", 8, "\u6882\u6884\u6887", 7, "\u6890\u6891\u6892\u6894\u6895\u6896\u6898", 9, "\u68A3\u68A4\u68A5\u68A9\u68AA\u68AB\u68AC\u68AE\u68B1\u68B2\u68B4\u68B6\u68B7\u68B8"],
      ["9780", "\u68B9", 6, "\u68C1\u68C3", 5, "\u68CA\u68CC\u68CE\u68CF\u68D0\u68D1\u68D3\u68D4\u68D6\u68D7\u68D9\u68DB", 4, "\u68E1\u68E2\u68E4", 9, "\u68EF\u68F2\u68F3\u68F4\u68F6\u68F7\u68F8\u68FB\u68FD\u68FE\u68FF\u6900\u6902\u6903\u6904\u6906", 4, "\u690C\u690F\u6911\u6913", 11, "\u6921\u6922\u6923\u6925", 7, "\u692E\u692F\u6931\u6932\u6933\u6935\u6936\u6937\u6938\u693A\u693B\u693C\u693E\u6940\u6941\u6943", 16, "\u6955\u6956\u6958\u6959\u695B\u695C\u695F"],
      ["9840", "\u6961\u6962\u6964\u6965\u6967\u6968\u6969\u696A\u696C\u696D\u696F\u6970\u6972", 4, "\u697A\u697B\u697D\u697E\u697F\u6981\u6983\u6985\u698A\u698B\u698C\u698E", 5, "\u6996\u6997\u6999\u699A\u699D", 9, "\u69A9\u69AA\u69AC\u69AE\u69AF\u69B0\u69B2\u69B3\u69B5\u69B6\u69B8\u69B9\u69BA\u69BC\u69BD"],
      ["9880", "\u69BE\u69BF\u69C0\u69C2", 7, "\u69CB\u69CD\u69CF\u69D1\u69D2\u69D3\u69D5", 5, "\u69DC\u69DD\u69DE\u69E1", 11, "\u69EE\u69EF\u69F0\u69F1\u69F3", 9, "\u69FE\u6A00", 9, "\u6A0B", 11, "\u6A19", 5, "\u6A20\u6A22", 5, "\u6A29\u6A2B\u6A2C\u6A2D\u6A2E\u6A30\u6A32\u6A33\u6A34\u6A36", 6, "\u6A3F", 4, "\u6A45\u6A46\u6A48", 7, "\u6A51", 6, "\u6A5A"],
      ["9940", "\u6A5C", 4, "\u6A62\u6A63\u6A64\u6A66", 10, "\u6A72", 6, "\u6A7A\u6A7B\u6A7D\u6A7E\u6A7F\u6A81\u6A82\u6A83\u6A85", 8, "\u6A8F\u6A92", 4, "\u6A98", 7, "\u6AA1", 5],
      ["9980", "\u6AA7\u6AA8\u6AAA\u6AAD", 114, "\u6B25\u6B26\u6B28", 6],
      ["9a40", "\u6B2F\u6B30\u6B31\u6B33\u6B34\u6B35\u6B36\u6B38\u6B3B\u6B3C\u6B3D\u6B3F\u6B40\u6B41\u6B42\u6B44\u6B45\u6B48\u6B4A\u6B4B\u6B4D", 11, "\u6B5A", 7, "\u6B68\u6B69\u6B6B", 13, "\u6B7A\u6B7D\u6B7E\u6B7F\u6B80\u6B85\u6B88"],
      ["9a80", "\u6B8C\u6B8E\u6B8F\u6B90\u6B91\u6B94\u6B95\u6B97\u6B98\u6B99\u6B9C", 4, "\u6BA2", 7, "\u6BAB", 7, "\u6BB6\u6BB8", 6, "\u6BC0\u6BC3\u6BC4\u6BC6", 4, "\u6BCC\u6BCE\u6BD0\u6BD1\u6BD8\u6BDA\u6BDC", 4, "\u6BE2", 7, "\u6BEC\u6BED\u6BEE\u6BF0\u6BF1\u6BF2\u6BF4\u6BF6\u6BF7\u6BF8\u6BFA\u6BFB\u6BFC\u6BFE", 6, "\u6C08", 4, "\u6C0E\u6C12\u6C17\u6C1C\u6C1D\u6C1E\u6C20\u6C23\u6C25\u6C2B\u6C2C\u6C2D\u6C31\u6C33\u6C36\u6C37\u6C39\u6C3A\u6C3B\u6C3C\u6C3E\u6C3F\u6C43\u6C44\u6C45\u6C48\u6C4B", 4, "\u6C51\u6C52\u6C53\u6C56\u6C58"],
      ["9b40", "\u6C59\u6C5A\u6C62\u6C63\u6C65\u6C66\u6C67\u6C6B", 4, "\u6C71\u6C73\u6C75\u6C77\u6C78\u6C7A\u6C7B\u6C7C\u6C7F\u6C80\u6C84\u6C87\u6C8A\u6C8B\u6C8D\u6C8E\u6C91\u6C92\u6C95\u6C96\u6C97\u6C98\u6C9A\u6C9C\u6C9D\u6C9E\u6CA0\u6CA2\u6CA8\u6CAC\u6CAF\u6CB0\u6CB4\u6CB5\u6CB6\u6CB7\u6CBA\u6CC0\u6CC1\u6CC2\u6CC3\u6CC6\u6CC7\u6CC8\u6CCB\u6CCD\u6CCE\u6CCF\u6CD1\u6CD2\u6CD8"],
      ["9b80", "\u6CD9\u6CDA\u6CDC\u6CDD\u6CDF\u6CE4\u6CE6\u6CE7\u6CE9\u6CEC\u6CED\u6CF2\u6CF4\u6CF9\u6CFF\u6D00\u6D02\u6D03\u6D05\u6D06\u6D08\u6D09\u6D0A\u6D0D\u6D0F\u6D10\u6D11\u6D13\u6D14\u6D15\u6D16\u6D18\u6D1C\u6D1D\u6D1F", 5, "\u6D26\u6D28\u6D29\u6D2C\u6D2D\u6D2F\u6D30\u6D34\u6D36\u6D37\u6D38\u6D3A\u6D3F\u6D40\u6D42\u6D44\u6D49\u6D4C\u6D50\u6D55\u6D56\u6D57\u6D58\u6D5B\u6D5D\u6D5F\u6D61\u6D62\u6D64\u6D65\u6D67\u6D68\u6D6B\u6D6C\u6D6D\u6D70\u6D71\u6D72\u6D73\u6D75\u6D76\u6D79\u6D7A\u6D7B\u6D7D", 4, "\u6D83\u6D84\u6D86\u6D87\u6D8A\u6D8B\u6D8D\u6D8F\u6D90\u6D92\u6D96", 4, "\u6D9C\u6DA2\u6DA5\u6DAC\u6DAD\u6DB0\u6DB1\u6DB3\u6DB4\u6DB6\u6DB7\u6DB9", 5, "\u6DC1\u6DC2\u6DC3\u6DC8\u6DC9\u6DCA"],
      ["9c40", "\u6DCD\u6DCE\u6DCF\u6DD0\u6DD2\u6DD3\u6DD4\u6DD5\u6DD7\u6DDA\u6DDB\u6DDC\u6DDF\u6DE2\u6DE3\u6DE5\u6DE7\u6DE8\u6DE9\u6DEA\u6DED\u6DEF\u6DF0\u6DF2\u6DF4\u6DF5\u6DF6\u6DF8\u6DFA\u6DFD", 7, "\u6E06\u6E07\u6E08\u6E09\u6E0B\u6E0F\u6E12\u6E13\u6E15\u6E18\u6E19\u6E1B\u6E1C\u6E1E\u6E1F\u6E22\u6E26\u6E27\u6E28\u6E2A\u6E2C\u6E2E\u6E30\u6E31\u6E33\u6E35"],
      ["9c80", "\u6E36\u6E37\u6E39\u6E3B", 7, "\u6E45", 7, "\u6E4F\u6E50\u6E51\u6E52\u6E55\u6E57\u6E59\u6E5A\u6E5C\u6E5D\u6E5E\u6E60", 10, "\u6E6C\u6E6D\u6E6F", 14, "\u6E80\u6E81\u6E82\u6E84\u6E87\u6E88\u6E8A", 4, "\u6E91", 6, "\u6E99\u6E9A\u6E9B\u6E9D\u6E9E\u6EA0\u6EA1\u6EA3\u6EA4\u6EA6\u6EA8\u6EA9\u6EAB\u6EAC\u6EAD\u6EAE\u6EB0\u6EB3\u6EB5\u6EB8\u6EB9\u6EBC\u6EBE\u6EBF\u6EC0\u6EC3\u6EC4\u6EC5\u6EC6\u6EC8\u6EC9\u6ECA\u6ECC\u6ECD\u6ECE\u6ED0\u6ED2\u6ED6\u6ED8\u6ED9\u6EDB\u6EDC\u6EDD\u6EE3\u6EE7\u6EEA", 5],
      ["9d40", "\u6EF0\u6EF1\u6EF2\u6EF3\u6EF5\u6EF6\u6EF7\u6EF8\u6EFA", 7, "\u6F03\u6F04\u6F05\u6F07\u6F08\u6F0A", 4, "\u6F10\u6F11\u6F12\u6F16", 9, "\u6F21\u6F22\u6F23\u6F25\u6F26\u6F27\u6F28\u6F2C\u6F2E\u6F30\u6F32\u6F34\u6F35\u6F37", 6, "\u6F3F\u6F40\u6F41\u6F42"],
      ["9d80", "\u6F43\u6F44\u6F45\u6F48\u6F49\u6F4A\u6F4C\u6F4E", 9, "\u6F59\u6F5A\u6F5B\u6F5D\u6F5F\u6F60\u6F61\u6F63\u6F64\u6F65\u6F67", 5, "\u6F6F\u6F70\u6F71\u6F73\u6F75\u6F76\u6F77\u6F79\u6F7B\u6F7D", 6, "\u6F85\u6F86\u6F87\u6F8A\u6F8B\u6F8F", 12, "\u6F9D\u6F9E\u6F9F\u6FA0\u6FA2", 4, "\u6FA8", 10, "\u6FB4\u6FB5\u6FB7\u6FB8\u6FBA", 5, "\u6FC1\u6FC3", 5, "\u6FCA", 6, "\u6FD3", 10, "\u6FDF\u6FE2\u6FE3\u6FE4\u6FE5"],
      ["9e40", "\u6FE6", 7, "\u6FF0", 32, "\u7012", 7, "\u701C", 6, "\u7024", 6],
      ["9e80", "\u702B", 9, "\u7036\u7037\u7038\u703A", 17, "\u704D\u704E\u7050", 13, "\u705F", 11, "\u706E\u7071\u7072\u7073\u7074\u7077\u7079\u707A\u707B\u707D\u7081\u7082\u7083\u7084\u7086\u7087\u7088\u708B\u708C\u708D\u708F\u7090\u7091\u7093\u7097\u7098\u709A\u709B\u709E", 12, "\u70B0\u70B2\u70B4\u70B5\u70B6\u70BA\u70BE\u70BF\u70C4\u70C5\u70C6\u70C7\u70C9\u70CB", 12, "\u70DA"],
      ["9f40", "\u70DC\u70DD\u70DE\u70E0\u70E1\u70E2\u70E3\u70E5\u70EA\u70EE\u70F0", 6, "\u70F8\u70FA\u70FB\u70FC\u70FE", 10, "\u710B", 4, "\u7111\u7112\u7114\u7117\u711B", 10, "\u7127", 7, "\u7132\u7133\u7134"],
      ["9f80", "\u7135\u7137", 13, "\u7146\u7147\u7148\u7149\u714B\u714D\u714F", 12, "\u715D\u715F", 4, "\u7165\u7169", 4, "\u716F\u7170\u7171\u7174\u7175\u7176\u7177\u7179\u717B\u717C\u717E", 5, "\u7185", 4, "\u718B\u718C\u718D\u718E\u7190\u7191\u7192\u7193\u7195\u7196\u7197\u719A", 4, "\u71A1", 6, "\u71A9\u71AA\u71AB\u71AD", 5, "\u71B4\u71B6\u71B7\u71B8\u71BA", 8, "\u71C4", 9, "\u71CF", 4],
      ["a040", "\u71D6", 9, "\u71E1\u71E2\u71E3\u71E4\u71E6\u71E8", 5, "\u71EF", 9, "\u71FA", 11, "\u7207", 19],
      ["a080", "\u721B\u721C\u721E", 9, "\u7229\u722B\u722D\u722E\u722F\u7232\u7233\u7234\u723A\u723C\u723E\u7240", 6, "\u7249\u724A\u724B\u724E\u724F\u7250\u7251\u7253\u7254\u7255\u7257\u7258\u725A\u725C\u725E\u7260\u7263\u7264\u7265\u7268\u726A\u726B\u726C\u726D\u7270\u7271\u7273\u7274\u7276\u7277\u7278\u727B\u727C\u727D\u7282\u7283\u7285", 4, "\u728C\u728E\u7290\u7291\u7293", 11, "\u72A0", 11, "\u72AE\u72B1\u72B2\u72B3\u72B5\u72BA", 6, "\u72C5\u72C6\u72C7\u72C9\u72CA\u72CB\u72CC\u72CF\u72D1\u72D3\u72D4\u72D5\u72D6\u72D8\u72DA\u72DB"],
      ["a1a1", "\u3000\u3001\u3002\xB7\u02C9\u02C7\xA8\u3003\u3005\u2014\uFF5E\u2016\u2026\u2018\u2019\u201C\u201D\u3014\u3015\u3008", 7, "\u3016\u3017\u3010\u3011\xB1\xD7\xF7\u2236\u2227\u2228\u2211\u220F\u222A\u2229\u2208\u2237\u221A\u22A5\u2225\u2220\u2312\u2299\u222B\u222E\u2261\u224C\u2248\u223D\u221D\u2260\u226E\u226F\u2264\u2265\u221E\u2235\u2234\u2642\u2640\xB0\u2032\u2033\u2103\uFF04\xA4\uFFE0\uFFE1\u2030\xA7\u2116\u2606\u2605\u25CB\u25CF\u25CE\u25C7\u25C6\u25A1\u25A0\u25B3\u25B2\u203B\u2192\u2190\u2191\u2193\u3013"],
      ["a2a1", "\u2170", 9],
      ["a2b1", "\u2488", 19, "\u2474", 19, "\u2460", 9],
      ["a2e5", "\u3220", 9],
      ["a2f1", "\u2160", 11],
      ["a3a1", "\uFF01\uFF02\uFF03\uFFE5\uFF05", 88, "\uFFE3"],
      ["a4a1", "\u3041", 82],
      ["a5a1", "\u30A1", 85],
      ["a6a1", "\u0391", 16, "\u03A3", 6],
      ["a6c1", "\u03B1", 16, "\u03C3", 6],
      ["a6e0", "\uFE35\uFE36\uFE39\uFE3A\uFE3F\uFE40\uFE3D\uFE3E\uFE41\uFE42\uFE43\uFE44"],
      ["a6ee", "\uFE3B\uFE3C\uFE37\uFE38\uFE31"],
      ["a6f4", "\uFE33\uFE34"],
      ["a7a1", "\u0410", 5, "\u0401\u0416", 25],
      ["a7d1", "\u0430", 5, "\u0451\u0436", 25],
      ["a840", "\u02CA\u02CB\u02D9\u2013\u2015\u2025\u2035\u2105\u2109\u2196\u2197\u2198\u2199\u2215\u221F\u2223\u2252\u2266\u2267\u22BF\u2550", 35, "\u2581", 6],
      ["a880", "\u2588", 7, "\u2593\u2594\u2595\u25BC\u25BD\u25E2\u25E3\u25E4\u25E5\u2609\u2295\u3012\u301D\u301E"],
      ["a8a1", "\u0101\xE1\u01CE\xE0\u0113\xE9\u011B\xE8\u012B\xED\u01D0\xEC\u014D\xF3\u01D2\xF2\u016B\xFA\u01D4\xF9\u01D6\u01D8\u01DA\u01DC\xFC\xEA\u0251"],
      ["a8bd", "\u0144\u0148"],
      ["a8c0", "\u0261"],
      ["a8c5", "\u3105", 36],
      ["a940", "\u3021", 8, "\u32A3\u338E\u338F\u339C\u339D\u339E\u33A1\u33C4\u33CE\u33D1\u33D2\u33D5\uFE30\uFFE2\uFFE4"],
      ["a959", "\u2121\u3231"],
      ["a95c", "\u2010"],
      ["a960", "\u30FC\u309B\u309C\u30FD\u30FE\u3006\u309D\u309E\uFE49", 9, "\uFE54\uFE55\uFE56\uFE57\uFE59", 8],
      ["a980", "\uFE62", 4, "\uFE68\uFE69\uFE6A\uFE6B"],
      ["a996", "\u3007"],
      ["a9a4", "\u2500", 75],
      ["aa40", "\u72DC\u72DD\u72DF\u72E2", 5, "\u72EA\u72EB\u72F5\u72F6\u72F9\u72FD\u72FE\u72FF\u7300\u7302\u7304", 5, "\u730B\u730C\u730D\u730F\u7310\u7311\u7312\u7314\u7318\u7319\u731A\u731F\u7320\u7323\u7324\u7326\u7327\u7328\u732D\u732F\u7330\u7332\u7333\u7335\u7336\u733A\u733B\u733C\u733D\u7340", 8],
      ["aa80", "\u7349\u734A\u734B\u734C\u734E\u734F\u7351\u7353\u7354\u7355\u7356\u7358", 7, "\u7361", 10, "\u736E\u7370\u7371"],
      ["ab40", "\u7372", 11, "\u737F", 4, "\u7385\u7386\u7388\u738A\u738C\u738D\u738F\u7390\u7392\u7393\u7394\u7395\u7397\u7398\u7399\u739A\u739C\u739D\u739E\u73A0\u73A1\u73A3", 5, "\u73AA\u73AC\u73AD\u73B1\u73B4\u73B5\u73B6\u73B8\u73B9\u73BC\u73BD\u73BE\u73BF\u73C1\u73C3", 4],
      ["ab80", "\u73CB\u73CC\u73CE\u73D2", 6, "\u73DA\u73DB\u73DC\u73DD\u73DF\u73E1\u73E2\u73E3\u73E4\u73E6\u73E8\u73EA\u73EB\u73EC\u73EE\u73EF\u73F0\u73F1\u73F3", 4],
      ["ac40", "\u73F8", 10, "\u7404\u7407\u7408\u740B\u740C\u740D\u740E\u7411", 8, "\u741C", 5, "\u7423\u7424\u7427\u7429\u742B\u742D\u742F\u7431\u7432\u7437", 4, "\u743D\u743E\u743F\u7440\u7442", 11],
      ["ac80", "\u744E", 6, "\u7456\u7458\u745D\u7460", 12, "\u746E\u746F\u7471", 4, "\u7478\u7479\u747A"],
      ["ad40", "\u747B\u747C\u747D\u747F\u7482\u7484\u7485\u7486\u7488\u7489\u748A\u748C\u748D\u748F\u7491", 10, "\u749D\u749F", 7, "\u74AA", 15, "\u74BB", 12],
      ["ad80", "\u74C8", 9, "\u74D3", 8, "\u74DD\u74DF\u74E1\u74E5\u74E7", 6, "\u74F0\u74F1\u74F2"],
      ["ae40", "\u74F3\u74F5\u74F8", 6, "\u7500\u7501\u7502\u7503\u7505", 7, "\u750E\u7510\u7512\u7514\u7515\u7516\u7517\u751B\u751D\u751E\u7520", 4, "\u7526\u7527\u752A\u752E\u7534\u7536\u7539\u753C\u753D\u753F\u7541\u7542\u7543\u7544\u7546\u7547\u7549\u754A\u754D\u7550\u7551\u7552\u7553\u7555\u7556\u7557\u7558"],
      ["ae80", "\u755D", 7, "\u7567\u7568\u7569\u756B", 6, "\u7573\u7575\u7576\u7577\u757A", 4, "\u7580\u7581\u7582\u7584\u7585\u7587"],
      ["af40", "\u7588\u7589\u758A\u758C\u758D\u758E\u7590\u7593\u7595\u7598\u759B\u759C\u759E\u75A2\u75A6", 4, "\u75AD\u75B6\u75B7\u75BA\u75BB\u75BF\u75C0\u75C1\u75C6\u75CB\u75CC\u75CE\u75CF\u75D0\u75D1\u75D3\u75D7\u75D9\u75DA\u75DC\u75DD\u75DF\u75E0\u75E1\u75E5\u75E9\u75EC\u75ED\u75EE\u75EF\u75F2\u75F3\u75F5\u75F6\u75F7\u75F8\u75FA\u75FB\u75FD\u75FE\u7602\u7604\u7606\u7607"],
      ["af80", "\u7608\u7609\u760B\u760D\u760E\u760F\u7611\u7612\u7613\u7614\u7616\u761A\u761C\u761D\u761E\u7621\u7623\u7627\u7628\u762C\u762E\u762F\u7631\u7632\u7636\u7637\u7639\u763A\u763B\u763D\u7641\u7642\u7644"],
      ["b040", "\u7645", 6, "\u764E", 5, "\u7655\u7657", 4, "\u765D\u765F\u7660\u7661\u7662\u7664", 6, "\u766C\u766D\u766E\u7670", 7, "\u7679\u767A\u767C\u767F\u7680\u7681\u7683\u7685\u7689\u768A\u768C\u768D\u768F\u7690\u7692\u7694\u7695\u7697\u7698\u769A\u769B"],
      ["b080", "\u769C", 7, "\u76A5", 8, "\u76AF\u76B0\u76B3\u76B5", 9, "\u76C0\u76C1\u76C3\u554A\u963F\u57C3\u6328\u54CE\u5509\u54C0\u7691\u764C\u853C\u77EE\u827E\u788D\u7231\u9698\u978D\u6C28\u5B89\u4FFA\u6309\u6697\u5CB8\u80FA\u6848\u80AE\u6602\u76CE\u51F9\u6556\u71AC\u7FF1\u8884\u50B2\u5965\u61CA\u6FB3\u82AD\u634C\u6252\u53ED\u5427\u7B06\u516B\u75A4\u5DF4\u62D4\u8DCB\u9776\u628A\u8019\u575D\u9738\u7F62\u7238\u767D\u67CF\u767E\u6446\u4F70\u8D25\u62DC\u7A17\u6591\u73ED\u642C\u6273\u822C\u9881\u677F\u7248\u626E\u62CC\u4F34\u74E3\u534A\u529E\u7ECA\u90A6\u5E2E\u6886\u699C\u8180\u7ED1\u68D2\u78C5\u868C\u9551\u508D\u8C24\u82DE\u80DE\u5305\u8912\u5265"],
      ["b140", "\u76C4\u76C7\u76C9\u76CB\u76CC\u76D3\u76D5\u76D9\u76DA\u76DC\u76DD\u76DE\u76E0", 4, "\u76E6", 7, "\u76F0\u76F3\u76F5\u76F6\u76F7\u76FA\u76FB\u76FD\u76FF\u7700\u7702\u7703\u7705\u7706\u770A\u770C\u770E", 10, "\u771B\u771C\u771D\u771E\u7721\u7723\u7724\u7725\u7727\u772A\u772B"],
      ["b180", "\u772C\u772E\u7730", 4, "\u7739\u773B\u773D\u773E\u773F\u7742\u7744\u7745\u7746\u7748", 7, "\u7752", 7, "\u775C\u8584\u96F9\u4FDD\u5821\u9971\u5B9D\u62B1\u62A5\u66B4\u8C79\u9C8D\u7206\u676F\u7891\u60B2\u5351\u5317\u8F88\u80CC\u8D1D\u94A1\u500D\u72C8\u5907\u60EB\u7119\u88AB\u5954\u82EF\u672C\u7B28\u5D29\u7EF7\u752D\u6CF5\u8E66\u8FF8\u903C\u9F3B\u6BD4\u9119\u7B14\u5F7C\u78A7\u84D6\u853D\u6BD5\u6BD9\u6BD6\u5E01\u5E87\u75F9\u95ED\u655D\u5F0A\u5FC5\u8F9F\u58C1\u81C2\u907F\u965B\u97AD\u8FB9\u7F16\u8D2C\u6241\u4FBF\u53D8\u535E\u8FA8\u8FA9\u8FAB\u904D\u6807\u5F6A\u8198\u8868\u9CD6\u618B\u522B\u762A\u5F6C\u658C\u6FD2\u6EE8\u5BBE\u6448\u5175\u51B0\u67C4\u4E19\u79C9\u997C\u70B3"],
      ["b240", "\u775D\u775E\u775F\u7760\u7764\u7767\u7769\u776A\u776D", 11, "\u777A\u777B\u777C\u7781\u7782\u7783\u7786", 5, "\u778F\u7790\u7793", 11, "\u77A1\u77A3\u77A4\u77A6\u77A8\u77AB\u77AD\u77AE\u77AF\u77B1\u77B2\u77B4\u77B6", 4],
      ["b280", "\u77BC\u77BE\u77C0", 12, "\u77CE", 8, "\u77D8\u77D9\u77DA\u77DD", 4, "\u77E4\u75C5\u5E76\u73BB\u83E0\u64AD\u62E8\u94B5\u6CE2\u535A\u52C3\u640F\u94C2\u7B94\u4F2F\u5E1B\u8236\u8116\u818A\u6E24\u6CCA\u9A73\u6355\u535C\u54FA\u8865\u57E0\u4E0D\u5E03\u6B65\u7C3F\u90E8\u6016\u64E6\u731C\u88C1\u6750\u624D\u8D22\u776C\u8E29\u91C7\u5F69\u83DC\u8521\u9910\u53C2\u8695\u6B8B\u60ED\u60E8\u707F\u82CD\u8231\u4ED3\u6CA7\u85CF\u64CD\u7CD9\u69FD\u66F9\u8349\u5395\u7B56\u4FA7\u518C\u6D4B\u5C42\u8E6D\u63D2\u53C9\u832C\u8336\u67E5\u78B4\u643D\u5BDF\u5C94\u5DEE\u8BE7\u62C6\u67F4\u8C7A\u6400\u63BA\u8749\u998B\u8C17\u7F20\u94F2\u4EA7\u9610\u98A4\u660C\u7316"],
      ["b340", "\u77E6\u77E8\u77EA\u77EF\u77F0\u77F1\u77F2\u77F4\u77F5\u77F7\u77F9\u77FA\u77FB\u77FC\u7803", 5, "\u780A\u780B\u780E\u780F\u7810\u7813\u7815\u7819\u781B\u781E\u7820\u7821\u7822\u7824\u7828\u782A\u782B\u782E\u782F\u7831\u7832\u7833\u7835\u7836\u783D\u783F\u7841\u7842\u7843\u7844\u7846\u7848\u7849\u784A\u784B\u784D\u784F\u7851\u7853\u7854\u7858\u7859\u785A"],
      ["b380", "\u785B\u785C\u785E", 11, "\u786F", 7, "\u7878\u7879\u787A\u787B\u787D", 6, "\u573A\u5C1D\u5E38\u957F\u507F\u80A0\u5382\u655E\u7545\u5531\u5021\u8D85\u6284\u949E\u671D\u5632\u6F6E\u5DE2\u5435\u7092\u8F66\u626F\u64A4\u63A3\u5F7B\u6F88\u90F4\u81E3\u8FB0\u5C18\u6668\u5FF1\u6C89\u9648\u8D81\u886C\u6491\u79F0\u57CE\u6A59\u6210\u5448\u4E58\u7A0B\u60E9\u6F84\u8BDA\u627F\u901E\u9A8B\u79E4\u5403\u75F4\u6301\u5319\u6C60\u8FDF\u5F1B\u9A70\u803B\u9F7F\u4F88\u5C3A\u8D64\u7FC5\u65A5\u70BD\u5145\u51B2\u866B\u5D07\u5BA0\u62BD\u916C\u7574\u8E0C\u7A20\u6101\u7B79\u4EC7\u7EF8\u7785\u4E11\u81ED\u521D\u51FA\u6A71\u53A8\u8E87\u9504\u96CF\u6EC1\u9664\u695A"],
      ["b440", "\u7884\u7885\u7886\u7888\u788A\u788B\u788F\u7890\u7892\u7894\u7895\u7896\u7899\u789D\u789E\u78A0\u78A2\u78A4\u78A6\u78A8", 7, "\u78B5\u78B6\u78B7\u78B8\u78BA\u78BB\u78BC\u78BD\u78BF\u78C0\u78C2\u78C3\u78C4\u78C6\u78C7\u78C8\u78CC\u78CD\u78CE\u78CF\u78D1\u78D2\u78D3\u78D6\u78D7\u78D8\u78DA", 9],
      ["b480", "\u78E4\u78E5\u78E6\u78E7\u78E9\u78EA\u78EB\u78ED", 4, "\u78F3\u78F5\u78F6\u78F8\u78F9\u78FB", 5, "\u7902\u7903\u7904\u7906", 6, "\u7840\u50A8\u77D7\u6410\u89E6\u5904\u63E3\u5DDD\u7A7F\u693D\u4F20\u8239\u5598\u4E32\u75AE\u7A97\u5E62\u5E8A\u95EF\u521B\u5439\u708A\u6376\u9524\u5782\u6625\u693F\u9187\u5507\u6DF3\u7EAF\u8822\u6233\u7EF0\u75B5\u8328\u78C1\u96CC\u8F9E\u6148\u74F7\u8BCD\u6B64\u523A\u8D50\u6B21\u806A\u8471\u56F1\u5306\u4ECE\u4E1B\u51D1\u7C97\u918B\u7C07\u4FC3\u8E7F\u7BE1\u7A9C\u6467\u5D14\u50AC\u8106\u7601\u7CB9\u6DEC\u7FE0\u6751\u5B58\u5BF8\u78CB\u64AE\u6413\u63AA\u632B\u9519\u642D\u8FBE\u7B54\u7629\u6253\u5927\u5446\u6B79\u50A3\u6234\u5E26\u6B86\u4EE3\u8D37\u888B\u5F85\u902E"],
      ["b540", "\u790D", 5, "\u7914", 9, "\u791F", 4, "\u7925", 14, "\u7935", 4, "\u793D\u793F\u7942\u7943\u7944\u7945\u7947\u794A", 8, "\u7954\u7955\u7958\u7959\u7961\u7963"],
      ["b580", "\u7964\u7966\u7969\u796A\u796B\u796C\u796E\u7970", 6, "\u7979\u797B", 4, "\u7982\u7983\u7986\u7987\u7988\u7989\u798B\u798C\u798D\u798E\u7990\u7991\u7992\u6020\u803D\u62C5\u4E39\u5355\u90F8\u63B8\u80C6\u65E6\u6C2E\u4F46\u60EE\u6DE1\u8BDE\u5F39\u86CB\u5F53\u6321\u515A\u8361\u6863\u5200\u6363\u8E48\u5012\u5C9B\u7977\u5BFC\u5230\u7A3B\u60BC\u9053\u76D7\u5FB7\u5F97\u7684\u8E6C\u706F\u767B\u7B49\u77AA\u51F3\u9093\u5824\u4F4E\u6EF4\u8FEA\u654C\u7B1B\u72C4\u6DA4\u7FDF\u5AE1\u62B5\u5E95\u5730\u8482\u7B2C\u5E1D\u5F1F\u9012\u7F14\u98A0\u6382\u6EC7\u7898\u70B9\u5178\u975B\u57AB\u7535\u4F43\u7538\u5E97\u60E6\u5960\u6DC0\u6BBF\u7889\u53FC\u96D5\u51CB\u5201\u6389\u540A\u9493\u8C03\u8DCC\u7239\u789F\u8776\u8FED\u8C0D\u53E0"],
      ["b640", "\u7993", 6, "\u799B", 11, "\u79A8", 10, "\u79B4", 4, "\u79BC\u79BF\u79C2\u79C4\u79C5\u79C7\u79C8\u79CA\u79CC\u79CE\u79CF\u79D0\u79D3\u79D4\u79D6\u79D7\u79D9", 5, "\u79E0\u79E1\u79E2\u79E5\u79E8\u79EA"],
      ["b680", "\u79EC\u79EE\u79F1", 6, "\u79F9\u79FA\u79FC\u79FE\u79FF\u7A01\u7A04\u7A05\u7A07\u7A08\u7A09\u7A0A\u7A0C\u7A0F", 4, "\u7A15\u7A16\u7A18\u7A19\u7A1B\u7A1C\u4E01\u76EF\u53EE\u9489\u9876\u9F0E\u952D\u5B9A\u8BA2\u4E22\u4E1C\u51AC\u8463\u61C2\u52A8\u680B\u4F97\u606B\u51BB\u6D1E\u515C\u6296\u6597\u9661\u8C46\u9017\u75D8\u90FD\u7763\u6BD2\u728A\u72EC\u8BFB\u5835\u7779\u8D4C\u675C\u9540\u809A\u5EA6\u6E21\u5992\u7AEF\u77ED\u953B\u6BB5\u65AD\u7F0E\u5806\u5151\u961F\u5BF9\u58A9\u5428\u8E72\u6566\u987F\u56E4\u949D\u76FE\u9041\u6387\u54C6\u591A\u593A\u579B\u8EB2\u6735\u8DFA\u8235\u5241\u60F0\u5815\u86FE\u5CE8\u9E45\u4FC4\u989D\u8BB9\u5A25\u6076\u5384\u627C\u904F\u9102\u997F\u6069\u800C\u513F\u8033\u5C14\u9975\u6D31\u4E8C"],
      ["b740", "\u7A1D\u7A1F\u7A21\u7A22\u7A24", 14, "\u7A34\u7A35\u7A36\u7A38\u7A3A\u7A3E\u7A40", 5, "\u7A47", 9, "\u7A52", 4, "\u7A58", 16],
      ["b780", "\u7A69", 6, "\u7A71\u7A72\u7A73\u7A75\u7A7B\u7A7C\u7A7D\u7A7E\u7A82\u7A85\u7A87\u7A89\u7A8A\u7A8B\u7A8C\u7A8E\u7A8F\u7A90\u7A93\u7A94\u7A99\u7A9A\u7A9B\u7A9E\u7AA1\u7AA2\u8D30\u53D1\u7F5A\u7B4F\u4F10\u4E4F\u9600\u6CD5\u73D0\u85E9\u5E06\u756A\u7FFB\u6A0A\u77FE\u9492\u7E41\u51E1\u70E6\u53CD\u8FD4\u8303\u8D29\u72AF\u996D\u6CDB\u574A\u82B3\u65B9\u80AA\u623F\u9632\u59A8\u4EFF\u8BBF\u7EBA\u653E\u83F2\u975E\u5561\u98DE\u80A5\u532A\u8BFD\u5420\u80BA\u5E9F\u6CB8\u8D39\u82AC\u915A\u5429\u6C1B\u5206\u7EB7\u575F\u711A\u6C7E\u7C89\u594B\u4EFD\u5FFF\u6124\u7CAA\u4E30\u5C01\u67AB\u8702\u5CF0\u950B\u98CE\u75AF\u70FD\u9022\u51AF\u7F1D\u8BBD\u5949\u51E4\u4F5B\u5426\u592B\u6577\u80A4\u5B75\u6276\u62C2\u8F90\u5E45\u6C1F\u7B26\u4F0F\u4FD8\u670D"],
      ["b840", "\u7AA3\u7AA4\u7AA7\u7AA9\u7AAA\u7AAB\u7AAE", 4, "\u7AB4", 10, "\u7AC0", 10, "\u7ACC", 9, "\u7AD7\u7AD8\u7ADA\u7ADB\u7ADC\u7ADD\u7AE1\u7AE2\u7AE4\u7AE7", 5, "\u7AEE\u7AF0\u7AF1\u7AF2\u7AF3"],
      ["b880", "\u7AF4", 4, "\u7AFB\u7AFC\u7AFE\u7B00\u7B01\u7B02\u7B05\u7B07\u7B09\u7B0C\u7B0D\u7B0E\u7B10\u7B12\u7B13\u7B16\u7B17\u7B18\u7B1A\u7B1C\u7B1D\u7B1F\u7B21\u7B22\u7B23\u7B27\u7B29\u7B2D\u6D6E\u6DAA\u798F\u88B1\u5F17\u752B\u629A\u8F85\u4FEF\u91DC\u65A7\u812F\u8151\u5E9C\u8150\u8D74\u526F\u8986\u8D4B\u590D\u5085\u4ED8\u961C\u7236\u8179\u8D1F\u5BCC\u8BA3\u9644\u5987\u7F1A\u5490\u5676\u560E\u8BE5\u6539\u6982\u9499\u76D6\u6E89\u5E72\u7518\u6746\u67D1\u7AFF\u809D\u8D76\u611F\u79C6\u6562\u8D63\u5188\u521A\u94A2\u7F38\u809B\u7EB2\u5C97\u6E2F\u6760\u7BD9\u768B\u9AD8\u818F\u7F94\u7CD5\u641E\u9550\u7A3F\u544A\u54E5\u6B4C\u6401\u6208\u9E3D\u80F3\u7599\u5272\u9769\u845B\u683C\u86E4\u9601\u9694\u94EC\u4E2A\u5404\u7ED9\u6839\u8DDF\u8015\u66F4\u5E9A\u7FB9"],
      ["b940", "\u7B2F\u7B30\u7B32\u7B34\u7B35\u7B36\u7B37\u7B39\u7B3B\u7B3D\u7B3F", 5, "\u7B46\u7B48\u7B4A\u7B4D\u7B4E\u7B53\u7B55\u7B57\u7B59\u7B5C\u7B5E\u7B5F\u7B61\u7B63", 10, "\u7B6F\u7B70\u7B73\u7B74\u7B76\u7B78\u7B7A\u7B7C\u7B7D\u7B7F\u7B81\u7B82\u7B83\u7B84\u7B86", 6, "\u7B8E\u7B8F"],
      ["b980", "\u7B91\u7B92\u7B93\u7B96\u7B98\u7B99\u7B9A\u7B9B\u7B9E\u7B9F\u7BA0\u7BA3\u7BA4\u7BA5\u7BAE\u7BAF\u7BB0\u7BB2\u7BB3\u7BB5\u7BB6\u7BB7\u7BB9", 7, "\u7BC2\u7BC3\u7BC4\u57C2\u803F\u6897\u5DE5\u653B\u529F\u606D\u9F9A\u4F9B\u8EAC\u516C\u5BAB\u5F13\u5DE9\u6C5E\u62F1\u8D21\u5171\u94A9\u52FE\u6C9F\u82DF\u72D7\u57A2\u6784\u8D2D\u591F\u8F9C\u83C7\u5495\u7B8D\u4F30\u6CBD\u5B64\u59D1\u9F13\u53E4\u86CA\u9AA8\u8C37\u80A1\u6545\u987E\u56FA\u96C7\u522E\u74DC\u5250\u5BE1\u6302\u8902\u4E56\u62D0\u602A\u68FA\u5173\u5B98\u51A0\u89C2\u7BA1\u9986\u7F50\u60EF\u704C\u8D2F\u5149\u5E7F\u901B\u7470\u89C4\u572D\u7845\u5F52\u9F9F\u95FA\u8F68\u9B3C\u8BE1\u7678\u6842\u67DC\u8DEA\u8D35\u523D\u8F8A\u6EDA\u68CD\u9505\u90ED\u56FD\u679C\u88F9\u8FC7\u54C8"],
      ["ba40", "\u7BC5\u7BC8\u7BC9\u7BCA\u7BCB\u7BCD\u7BCE\u7BCF\u7BD0\u7BD2\u7BD4", 4, "\u7BDB\u7BDC\u7BDE\u7BDF\u7BE0\u7BE2\u7BE3\u7BE4\u7BE7\u7BE8\u7BE9\u7BEB\u7BEC\u7BED\u7BEF\u7BF0\u7BF2", 4, "\u7BF8\u7BF9\u7BFA\u7BFB\u7BFD\u7BFF", 7, "\u7C08\u7C09\u7C0A\u7C0D\u7C0E\u7C10", 5, "\u7C17\u7C18\u7C19"],
      ["ba80", "\u7C1A", 4, "\u7C20", 5, "\u7C28\u7C29\u7C2B", 12, "\u7C39", 5, "\u7C42\u9AB8\u5B69\u6D77\u6C26\u4EA5\u5BB3\u9A87\u9163\u61A8\u90AF\u97E9\u542B\u6DB5\u5BD2\u51FD\u558A\u7F55\u7FF0\u64BC\u634D\u65F1\u61BE\u608D\u710A\u6C57\u6C49\u592F\u676D\u822A\u58D5\u568E\u8C6A\u6BEB\u90DD\u597D\u8017\u53F7\u6D69\u5475\u559D\u8377\u83CF\u6838\u79BE\u548C\u4F55\u5408\u76D2\u8C89\u9602\u6CB3\u6DB8\u8D6B\u8910\u9E64\u8D3A\u563F\u9ED1\u75D5\u5F88\u72E0\u6068\u54FC\u4EA8\u6A2A\u8861\u6052\u8F70\u54C4\u70D8\u8679\u9E3F\u6D2A\u5B8F\u5F18\u7EA2\u5589\u4FAF\u7334\u543C\u539A\u5019\u540E\u547C\u4E4E\u5FFD\u745A\u58F6\u846B\u80E1\u8774\u72D0\u7CCA\u6E56"],
      ["bb40", "\u7C43", 9, "\u7C4E", 36, "\u7C75", 5, "\u7C7E", 9],
      ["bb80", "\u7C88\u7C8A", 6, "\u7C93\u7C94\u7C96\u7C99\u7C9A\u7C9B\u7CA0\u7CA1\u7CA3\u7CA6\u7CA7\u7CA8\u7CA9\u7CAB\u7CAC\u7CAD\u7CAF\u7CB0\u7CB4", 4, "\u7CBA\u7CBB\u5F27\u864E\u552C\u62A4\u4E92\u6CAA\u6237\u82B1\u54D7\u534E\u733E\u6ED1\u753B\u5212\u5316\u8BDD\u69D0\u5F8A\u6000\u6DEE\u574F\u6B22\u73AF\u6853\u8FD8\u7F13\u6362\u60A3\u5524\u75EA\u8C62\u7115\u6DA3\u5BA6\u5E7B\u8352\u614C\u9EC4\u78FA\u8757\u7C27\u7687\u51F0\u60F6\u714C\u6643\u5E4C\u604D\u8C0E\u7070\u6325\u8F89\u5FBD\u6062\u86D4\u56DE\u6BC1\u6094\u6167\u5349\u60E0\u6666\u8D3F\u79FD\u4F1A\u70E9\u6C47\u8BB3\u8BF2\u7ED8\u8364\u660F\u5A5A\u9B42\u6D51\u6DF7\u8C41\u6D3B\u4F19\u706B\u83B7\u6216\u60D1\u970D\u8D27\u7978\u51FB\u573E\u57FA\u673A\u7578\u7A3D\u79EF\u7B95"],
      ["bc40", "\u7CBF\u7CC0\u7CC2\u7CC3\u7CC4\u7CC6\u7CC9\u7CCB\u7CCE", 6, "\u7CD8\u7CDA\u7CDB\u7CDD\u7CDE\u7CE1", 6, "\u7CE9", 5, "\u7CF0", 7, "\u7CF9\u7CFA\u7CFC", 13, "\u7D0B", 5],
      ["bc80", "\u7D11", 14, "\u7D21\u7D23\u7D24\u7D25\u7D26\u7D28\u7D29\u7D2A\u7D2C\u7D2D\u7D2E\u7D30", 6, "\u808C\u9965\u8FF9\u6FC0\u8BA5\u9E21\u59EC\u7EE9\u7F09\u5409\u6781\u68D8\u8F91\u7C4D\u96C6\u53CA\u6025\u75BE\u6C72\u5373\u5AC9\u7EA7\u6324\u51E0\u810A\u5DF1\u84DF\u6280\u5180\u5B63\u4F0E\u796D\u5242\u60B8\u6D4E\u5BC4\u5BC2\u8BA1\u8BB0\u65E2\u5FCC\u9645\u5993\u7EE7\u7EAA\u5609\u67B7\u5939\u4F73\u5BB6\u52A0\u835A\u988A\u8D3E\u7532\u94BE\u5047\u7A3C\u4EF7\u67B6\u9A7E\u5AC1\u6B7C\u76D1\u575A\u5C16\u7B3A\u95F4\u714E\u517C\u80A9\u8270\u5978\u7F04\u8327\u68C0\u67EC\u78B1\u7877\u62E3\u6361\u7B80\u4FED\u526A\u51CF\u8350\u69DB\u9274\u8DF5\u8D31\u89C1\u952E\u7BAD\u4EF6"],
      ["bd40", "\u7D37", 54, "\u7D6F", 7],
      ["bd80", "\u7D78", 32, "\u5065\u8230\u5251\u996F\u6E10\u6E85\u6DA7\u5EFA\u50F5\u59DC\u5C06\u6D46\u6C5F\u7586\u848B\u6868\u5956\u8BB2\u5320\u9171\u964D\u8549\u6912\u7901\u7126\u80F6\u4EA4\u90CA\u6D47\u9A84\u5A07\u56BC\u6405\u94F0\u77EB\u4FA5\u811A\u72E1\u89D2\u997A\u7F34\u7EDE\u527F\u6559\u9175\u8F7F\u8F83\u53EB\u7A96\u63ED\u63A5\u7686\u79F8\u8857\u9636\u622A\u52AB\u8282\u6854\u6770\u6377\u776B\u7AED\u6D01\u7ED3\u89E3\u59D0\u6212\u85C9\u82A5\u754C\u501F\u4ECB\u75A5\u8BEB\u5C4A\u5DFE\u7B4B\u65A4\u91D1\u4ECA\u6D25\u895F\u7D27\u9526\u4EC5\u8C28\u8FDB\u9773\u664B\u7981\u8FD1\u70EC\u6D78"],
      ["be40", "\u7D99", 12, "\u7DA7", 6, "\u7DAF", 42],
      ["be80", "\u7DDA", 32, "\u5C3D\u52B2\u8346\u5162\u830E\u775B\u6676\u9CB8\u4EAC\u60CA\u7CBE\u7CB3\u7ECF\u4E95\u8B66\u666F\u9888\u9759\u5883\u656C\u955C\u5F84\u75C9\u9756\u7ADF\u7ADE\u51C0\u70AF\u7A98\u63EA\u7A76\u7EA0\u7396\u97ED\u4E45\u7078\u4E5D\u9152\u53A9\u6551\u65E7\u81FC\u8205\u548E\u5C31\u759A\u97A0\u62D8\u72D9\u75BD\u5C45\u9A79\u83CA\u5C40\u5480\u77E9\u4E3E\u6CAE\u805A\u62D2\u636E\u5DE8\u5177\u8DDD\u8E1E\u952F\u4FF1\u53E5\u60E7\u70AC\u5267\u6350\u9E43\u5A1F\u5026\u7737\u5377\u7EE2\u6485\u652B\u6289\u6398\u5014\u7235\u89C9\u51B3\u8BC0\u7EDD\u5747\u83CC\u94A7\u519B\u541B\u5CFB"],
      ["bf40", "\u7DFB", 62],
      ["bf80", "\u7E3A\u7E3C", 4, "\u7E42", 4, "\u7E48", 21, "\u4FCA\u7AE3\u6D5A\u90E1\u9A8F\u5580\u5496\u5361\u54AF\u5F00\u63E9\u6977\u51EF\u6168\u520A\u582A\u52D8\u574E\u780D\u770B\u5EB7\u6177\u7CE0\u625B\u6297\u4EA2\u7095\u8003\u62F7\u70E4\u9760\u5777\u82DB\u67EF\u68F5\u78D5\u9897\u79D1\u58F3\u54B3\u53EF\u6E34\u514B\u523B\u5BA2\u8BFE\u80AF\u5543\u57A6\u6073\u5751\u542D\u7A7A\u6050\u5B54\u63A7\u62A0\u53E3\u6263\u5BC7\u67AF\u54ED\u7A9F\u82E6\u9177\u5E93\u88E4\u5938\u57AE\u630E\u8DE8\u80EF\u5757\u7B77\u4FA9\u5FEB\u5BBD\u6B3E\u5321\u7B50\u72C2\u6846\u77FF\u7736\u65F7\u51B5\u4E8F\u76D4\u5CBF\u7AA5\u8475\u594E\u9B41\u5080"],
      ["c040", "\u7E5E", 35, "\u7E83", 23, "\u7E9C\u7E9D\u7E9E"],
      ["c080", "\u7EAE\u7EB4\u7EBB\u7EBC\u7ED6\u7EE4\u7EEC\u7EF9\u7F0A\u7F10\u7F1E\u7F37\u7F39\u7F3B", 6, "\u7F43\u7F46", 9, "\u7F52\u7F53\u9988\u6127\u6E83\u5764\u6606\u6346\u56F0\u62EC\u6269\u5ED3\u9614\u5783\u62C9\u5587\u8721\u814A\u8FA3\u5566\u83B1\u6765\u8D56\u84DD\u5A6A\u680F\u62E6\u7BEE\u9611\u5170\u6F9C\u8C30\u63FD\u89C8\u61D2\u7F06\u70C2\u6EE5\u7405\u6994\u72FC\u5ECA\u90CE\u6717\u6D6A\u635E\u52B3\u7262\u8001\u4F6C\u59E5\u916A\u70D9\u6D9D\u52D2\u4E50\u96F7\u956D\u857E\u78CA\u7D2F\u5121\u5792\u64C2\u808B\u7C7B\u6CEA\u68F1\u695E\u51B7\u5398\u68A8\u7281\u9ECE\u7BF1\u72F8\u79BB\u6F13\u7406\u674E\u91CC\u9CA4\u793C\u8389\u8354\u540F\u6817\u4E3D\u5389\u52B1\u783E\u5386\u5229\u5088\u4F8B\u4FD0"],
      ["c140", "\u7F56\u7F59\u7F5B\u7F5C\u7F5D\u7F5E\u7F60\u7F63", 4, "\u7F6B\u7F6C\u7F6D\u7F6F\u7F70\u7F73\u7F75\u7F76\u7F77\u7F78\u7F7A\u7F7B\u7F7C\u7F7D\u7F7F\u7F80\u7F82", 7, "\u7F8B\u7F8D\u7F8F", 4, "\u7F95", 4, "\u7F9B\u7F9C\u7FA0\u7FA2\u7FA3\u7FA5\u7FA6\u7FA8", 6, "\u7FB1"],
      ["c180", "\u7FB3", 4, "\u7FBA\u7FBB\u7FBE\u7FC0\u7FC2\u7FC3\u7FC4\u7FC6\u7FC7\u7FC8\u7FC9\u7FCB\u7FCD\u7FCF", 4, "\u7FD6\u7FD7\u7FD9", 5, "\u7FE2\u7FE3\u75E2\u7ACB\u7C92\u6CA5\u96B6\u529B\u7483\u54E9\u4FE9\u8054\u83B2\u8FDE\u9570\u5EC9\u601C\u6D9F\u5E18\u655B\u8138\u94FE\u604B\u70BC\u7EC3\u7CAE\u51C9\u6881\u7CB1\u826F\u4E24\u8F86\u91CF\u667E\u4EAE\u8C05\u64A9\u804A\u50DA\u7597\u71CE\u5BE5\u8FBD\u6F66\u4E86\u6482\u9563\u5ED6\u6599\u5217\u88C2\u70C8\u52A3\u730E\u7433\u6797\u78F7\u9716\u4E34\u90BB\u9CDE\u6DCB\u51DB\u8D41\u541D\u62CE\u73B2\u83F1\u96F6\u9F84\u94C3\u4F36\u7F9A\u51CC\u7075\u9675\u5CAD\u9886\u53E6\u4EE4\u6E9C\u7409\u69B4\u786B\u998F\u7559\u5218\u7624\u6D41\u67F3\u516D\u9F99\u804B\u5499\u7B3C\u7ABF"],
      ["c240", "\u7FE4\u7FE7\u7FE8\u7FEA\u7FEB\u7FEC\u7FED\u7FEF\u7FF2\u7FF4", 6, "\u7FFD\u7FFE\u7FFF\u8002\u8007\u8008\u8009\u800A\u800E\u800F\u8011\u8013\u801A\u801B\u801D\u801E\u801F\u8021\u8023\u8024\u802B", 5, "\u8032\u8034\u8039\u803A\u803C\u803E\u8040\u8041\u8044\u8045\u8047\u8048\u8049\u804E\u804F\u8050\u8051\u8053\u8055\u8056\u8057"],
      ["c280", "\u8059\u805B", 13, "\u806B", 5, "\u8072", 11, "\u9686\u5784\u62E2\u9647\u697C\u5A04\u6402\u7BD3\u6F0F\u964B\u82A6\u5362\u9885\u5E90\u7089\u63B3\u5364\u864F\u9C81\u9E93\u788C\u9732\u8DEF\u8D42\u9E7F\u6F5E\u7984\u5F55\u9646\u622E\u9A74\u5415\u94DD\u4FA3\u65C5\u5C65\u5C61\u7F15\u8651\u6C2F\u5F8B\u7387\u6EE4\u7EFF\u5CE6\u631B\u5B6A\u6EE6\u5375\u4E71\u63A0\u7565\u62A1\u8F6E\u4F26\u4ED1\u6CA6\u7EB6\u8BBA\u841D\u87BA\u7F57\u903B\u9523\u7BA9\u9AA1\u88F8\u843D\u6D1B\u9A86\u7EDC\u5988\u9EBB\u739B\u7801\u8682\u9A6C\u9A82\u561B\u5417\u57CB\u4E70\u9EA6\u5356\u8FC8\u8109\u7792\u9992\u86EE\u6EE1\u8513\u66FC\u6162\u6F2B"],
      ["c340", "\u807E\u8081\u8082\u8085\u8088\u808A\u808D", 5, "\u8094\u8095\u8097\u8099\u809E\u80A3\u80A6\u80A7\u80A8\u80AC\u80B0\u80B3\u80B5\u80B6\u80B8\u80B9\u80BB\u80C5\u80C7", 4, "\u80CF", 6, "\u80D8\u80DF\u80E0\u80E2\u80E3\u80E6\u80EE\u80F5\u80F7\u80F9\u80FB\u80FE\u80FF\u8100\u8101\u8103\u8104\u8105\u8107\u8108\u810B"],
      ["c380", "\u810C\u8115\u8117\u8119\u811B\u811C\u811D\u811F", 12, "\u812D\u812E\u8130\u8133\u8134\u8135\u8137\u8139", 4, "\u813F\u8C29\u8292\u832B\u76F2\u6C13\u5FD9\u83BD\u732B\u8305\u951A\u6BDB\u77DB\u94C6\u536F\u8302\u5192\u5E3D\u8C8C\u8D38\u4E48\u73AB\u679A\u6885\u9176\u9709\u7164\u6CA1\u7709\u5A92\u9541\u6BCF\u7F8E\u6627\u5BD0\u59B9\u5A9A\u95E8\u95F7\u4EEC\u840C\u8499\u6AAC\u76DF\u9530\u731B\u68A6\u5B5F\u772F\u919A\u9761\u7CDC\u8FF7\u8C1C\u5F25\u7C73\u79D8\u89C5\u6CCC\u871C\u5BC6\u5E42\u68C9\u7720\u7EF5\u5195\u514D\u52C9\u5A29\u7F05\u9762\u82D7\u63CF\u7784\u85D0\u79D2\u6E3A\u5E99\u5999\u8511\u706D\u6C11\u62BF\u76BF\u654F\u60AF\u95FD\u660E\u879F\u9E23\u94ED\u540D\u547D\u8C2C\u6478"],
      ["c440", "\u8140", 5, "\u8147\u8149\u814D\u814E\u814F\u8152\u8156\u8157\u8158\u815B", 4, "\u8161\u8162\u8163\u8164\u8166\u8168\u816A\u816B\u816C\u816F\u8172\u8173\u8175\u8176\u8177\u8178\u8181\u8183", 4, "\u8189\u818B\u818C\u818D\u818E\u8190\u8192", 5, "\u8199\u819A\u819E", 4, "\u81A4\u81A5"],
      ["c480", "\u81A7\u81A9\u81AB", 7, "\u81B4", 5, "\u81BC\u81BD\u81BE\u81BF\u81C4\u81C5\u81C7\u81C8\u81C9\u81CB\u81CD", 6, "\u6479\u8611\u6A21\u819C\u78E8\u6469\u9B54\u62B9\u672B\u83AB\u58A8\u9ED8\u6CAB\u6F20\u5BDE\u964C\u8C0B\u725F\u67D0\u62C7\u7261\u4EA9\u59C6\u6BCD\u5893\u66AE\u5E55\u52DF\u6155\u6728\u76EE\u7766\u7267\u7A46\u62FF\u54EA\u5450\u94A0\u90A3\u5A1C\u7EB3\u6C16\u4E43\u5976\u8010\u5948\u5357\u7537\u96BE\u56CA\u6320\u8111\u607C\u95F9\u6DD6\u5462\u9981\u5185\u5AE9\u80FD\u59AE\u9713\u502A\u6CE5\u5C3C\u62DF\u4F60\u533F\u817B\u9006\u6EBA\u852B\u62C8\u5E74\u78BE\u64B5\u637B\u5FF5\u5A18\u917F\u9E1F\u5C3F\u634F\u8042\u5B7D\u556E\u954A\u954D\u6D85\u60A8\u67E0\u72DE\u51DD\u5B81"],
      ["c540", "\u81D4", 14, "\u81E4\u81E5\u81E6\u81E8\u81E9\u81EB\u81EE", 4, "\u81F5", 5, "\u81FD\u81FF\u8203\u8207", 4, "\u820E\u820F\u8211\u8213\u8215", 5, "\u821D\u8220\u8224\u8225\u8226\u8227\u8229\u822E\u8232\u823A\u823C\u823D\u823F"],
      ["c580", "\u8240\u8241\u8242\u8243\u8245\u8246\u8248\u824A\u824C\u824D\u824E\u8250", 7, "\u8259\u825B\u825C\u825D\u825E\u8260", 7, "\u8269\u62E7\u6CDE\u725B\u626D\u94AE\u7EBD\u8113\u6D53\u519C\u5F04\u5974\u52AA\u6012\u5973\u6696\u8650\u759F\u632A\u61E6\u7CEF\u8BFA\u54E6\u6B27\u9E25\u6BB4\u85D5\u5455\u5076\u6CA4\u556A\u8DB4\u722C\u5E15\u6015\u7436\u62CD\u6392\u724C\u5F98\u6E43\u6D3E\u6500\u6F58\u76D8\u78D0\u76FC\u7554\u5224\u53DB\u4E53\u5E9E\u65C1\u802A\u80D6\u629B\u5486\u5228\u70AE\u888D\u8DD1\u6CE1\u5478\u80DA\u57F9\u88F4\u8D54\u966A\u914D\u4F69\u6C9B\u55B7\u76C6\u7830\u62A8\u70F9\u6F8E\u5F6D\u84EC\u68DA\u787C\u7BF7\u81A8\u670B\u9E4F\u6367\u78B0\u576F\u7812\u9739\u6279\u62AB\u5288\u7435\u6BD7"],
      ["c640", "\u826A\u826B\u826C\u826D\u8271\u8275\u8276\u8277\u8278\u827B\u827C\u8280\u8281\u8283\u8285\u8286\u8287\u8289\u828C\u8290\u8293\u8294\u8295\u8296\u829A\u829B\u829E\u82A0\u82A2\u82A3\u82A7\u82B2\u82B5\u82B6\u82BA\u82BB\u82BC\u82BF\u82C0\u82C2\u82C3\u82C5\u82C6\u82C9\u82D0\u82D6\u82D9\u82DA\u82DD\u82E2\u82E7\u82E8\u82E9\u82EA\u82EC\u82ED\u82EE\u82F0\u82F2\u82F3\u82F5\u82F6\u82F8"],
      ["c680", "\u82FA\u82FC", 4, "\u830A\u830B\u830D\u8310\u8312\u8313\u8316\u8318\u8319\u831D", 9, "\u8329\u832A\u832E\u8330\u8332\u8337\u833B\u833D\u5564\u813E\u75B2\u76AE\u5339\u75DE\u50FB\u5C41\u8B6C\u7BC7\u504F\u7247\u9A97\u98D8\u6F02\u74E2\u7968\u6487\u77A5\u62FC\u9891\u8D2B\u54C1\u8058\u4E52\u576A\u82F9\u840D\u5E73\u51ED\u74F6\u8BC4\u5C4F\u5761\u6CFC\u9887\u5A46\u7834\u9B44\u8FEB\u7C95\u5256\u6251\u94FA\u4EC6\u8386\u8461\u83E9\u84B2\u57D4\u6734\u5703\u666E\u6D66\u8C31\u66DD\u7011\u671F\u6B3A\u6816\u621A\u59BB\u4E03\u51C4\u6F06\u67D2\u6C8F\u5176\u68CB\u5947\u6B67\u7566\u5D0E\u8110\u9F50\u65D7\u7948\u7941\u9A91\u8D77\u5C82\u4E5E\u4F01\u542F\u5951\u780C\u5668\u6C14\u8FC4\u5F03\u6C7D\u6CE3\u8BAB\u6390"],
      ["c740", "\u833E\u833F\u8341\u8342\u8344\u8345\u8348\u834A", 4, "\u8353\u8355", 4, "\u835D\u8362\u8370", 6, "\u8379\u837A\u837E", 6, "\u8387\u8388\u838A\u838B\u838C\u838D\u838F\u8390\u8391\u8394\u8395\u8396\u8397\u8399\u839A\u839D\u839F\u83A1", 6, "\u83AC\u83AD\u83AE"],
      ["c780", "\u83AF\u83B5\u83BB\u83BE\u83BF\u83C2\u83C3\u83C4\u83C6\u83C8\u83C9\u83CB\u83CD\u83CE\u83D0\u83D1\u83D2\u83D3\u83D5\u83D7\u83D9\u83DA\u83DB\u83DE\u83E2\u83E3\u83E4\u83E6\u83E7\u83E8\u83EB\u83EC\u83ED\u6070\u6D3D\u7275\u6266\u948E\u94C5\u5343\u8FC1\u7B7E\u4EDF\u8C26\u4E7E\u9ED4\u94B1\u94B3\u524D\u6F5C\u9063\u6D45\u8C34\u5811\u5D4C\u6B20\u6B49\u67AA\u545B\u8154\u7F8C\u5899\u8537\u5F3A\u62A2\u6A47\u9539\u6572\u6084\u6865\u77A7\u4E54\u4FA8\u5DE7\u9798\u64AC\u7FD8\u5CED\u4FCF\u7A8D\u5207\u8304\u4E14\u602F\u7A83\u94A6\u4FB5\u4EB2\u79E6\u7434\u52E4\u82B9\u64D2\u79BD\u5BDD\u6C81\u9752\u8F7B\u6C22\u503E\u537F\u6E05\u64CE\u6674\u6C30\u60C5\u9877\u8BF7\u5E86\u743C\u7A77\u79CB\u4E18\u90B1\u7403\u6C42\u56DA\u914B\u6CC5\u8D8B\u533A\u86C6\u66F2\u8EAF\u5C48\u9A71\u6E20"],
      ["c840", "\u83EE\u83EF\u83F3", 4, "\u83FA\u83FB\u83FC\u83FE\u83FF\u8400\u8402\u8405\u8407\u8408\u8409\u840A\u8410\u8412", 5, "\u8419\u841A\u841B\u841E", 5, "\u8429", 7, "\u8432", 5, "\u8439\u843A\u843B\u843E", 7, "\u8447\u8448\u8449"],
      ["c880", "\u844A", 6, "\u8452", 4, "\u8458\u845D\u845E\u845F\u8460\u8462\u8464", 4, "\u846A\u846E\u846F\u8470\u8472\u8474\u8477\u8479\u847B\u847C\u53D6\u5A36\u9F8B\u8DA3\u53BB\u5708\u98A7\u6743\u919B\u6CC9\u5168\u75CA\u62F3\u72AC\u5238\u529D\u7F3A\u7094\u7638\u5374\u9E4A\u69B7\u786E\u96C0\u88D9\u7FA4\u7136\u71C3\u5189\u67D3\u74E4\u58E4\u6518\u56B7\u8BA9\u9976\u6270\u7ED5\u60F9\u70ED\u58EC\u4EC1\u4EBA\u5FCD\u97E7\u4EFB\u8BA4\u5203\u598A\u7EAB\u6254\u4ECD\u65E5\u620E\u8338\u84C9\u8363\u878D\u7194\u6EB6\u5BB9\u7ED2\u5197\u63C9\u67D4\u8089\u8339\u8815\u5112\u5B7A\u5982\u8FB1\u4E73\u6C5D\u5165\u8925\u8F6F\u962E\u854A\u745E\u9510\u95F0\u6DA6\u82E5\u5F31\u6492\u6D12\u8428\u816E\u9CC3\u585E\u8D5B\u4E09\u53C1"],
      ["c940", "\u847D", 4, "\u8483\u8484\u8485\u8486\u848A\u848D\u848F", 7, "\u8498\u849A\u849B\u849D\u849E\u849F\u84A0\u84A2", 12, "\u84B0\u84B1\u84B3\u84B5\u84B6\u84B7\u84BB\u84BC\u84BE\u84C0\u84C2\u84C3\u84C5\u84C6\u84C7\u84C8\u84CB\u84CC\u84CE\u84CF\u84D2\u84D4\u84D5\u84D7"],
      ["c980", "\u84D8", 4, "\u84DE\u84E1\u84E2\u84E4\u84E7", 4, "\u84ED\u84EE\u84EF\u84F1", 10, "\u84FD\u84FE\u8500\u8501\u8502\u4F1E\u6563\u6851\u55D3\u4E27\u6414\u9A9A\u626B\u5AC2\u745F\u8272\u6DA9\u68EE\u50E7\u838E\u7802\u6740\u5239\u6C99\u7EB1\u50BB\u5565\u715E\u7B5B\u6652\u73CA\u82EB\u6749\u5C71\u5220\u717D\u886B\u95EA\u9655\u64C5\u8D61\u81B3\u5584\u6C55\u6247\u7F2E\u5892\u4F24\u5546\u8D4F\u664C\u4E0A\u5C1A\u88F3\u68A2\u634E\u7A0D\u70E7\u828D\u52FA\u97F6\u5C11\u54E8\u90B5\u7ECD\u5962\u8D4A\u86C7\u820C\u820D\u8D66\u6444\u5C04\u6151\u6D89\u793E\u8BBE\u7837\u7533\u547B\u4F38\u8EAB\u6DF1\u5A20\u7EC5\u795E\u6C88\u5BA1\u5A76\u751A\u80BE\u614E\u6E17\u58F0\u751F\u7525\u7272\u5347\u7EF3"],
      ["ca40", "\u8503", 8, "\u850D\u850E\u850F\u8510\u8512\u8514\u8515\u8516\u8518\u8519\u851B\u851C\u851D\u851E\u8520\u8522", 8, "\u852D", 9, "\u853E", 4, "\u8544\u8545\u8546\u8547\u854B", 10],
      ["ca80", "\u8557\u8558\u855A\u855B\u855C\u855D\u855F", 4, "\u8565\u8566\u8567\u8569", 8, "\u8573\u8575\u8576\u8577\u8578\u857C\u857D\u857F\u8580\u8581\u7701\u76DB\u5269\u80DC\u5723\u5E08\u5931\u72EE\u65BD\u6E7F\u8BD7\u5C38\u8671\u5341\u77F3\u62FE\u65F6\u4EC0\u98DF\u8680\u5B9E\u8BC6\u53F2\u77E2\u4F7F\u5C4E\u9A76\u59CB\u5F0F\u793A\u58EB\u4E16\u67FF\u4E8B\u62ED\u8A93\u901D\u52BF\u662F\u55DC\u566C\u9002\u4ED5\u4F8D\u91CA\u9970\u6C0F\u5E02\u6043\u5BA4\u89C6\u8BD5\u6536\u624B\u9996\u5B88\u5BFF\u6388\u552E\u53D7\u7626\u517D\u852C\u67A2\u68B3\u6B8A\u6292\u8F93\u53D4\u8212\u6DD1\u758F\u4E66\u8D4E\u5B70\u719F\u85AF\u6691\u66D9\u7F72\u8700\u9ECD\u9F20\u5C5E\u672F\u8FF0\u6811\u675F\u620D\u7AD6\u5885\u5EB6\u6570\u6F31"],
      ["cb40", "\u8582\u8583\u8586\u8588", 6, "\u8590", 10, "\u859D", 6, "\u85A5\u85A6\u85A7\u85A9\u85AB\u85AC\u85AD\u85B1", 5, "\u85B8\u85BA", 6, "\u85C2", 6, "\u85CA", 4, "\u85D1\u85D2"],
      ["cb80", "\u85D4\u85D6", 5, "\u85DD", 6, "\u85E5\u85E6\u85E7\u85E8\u85EA", 14, "\u6055\u5237\u800D\u6454\u8870\u7529\u5E05\u6813\u62F4\u971C\u53CC\u723D\u8C01\u6C34\u7761\u7A0E\u542E\u77AC\u987A\u821C\u8BF4\u7855\u6714\u70C1\u65AF\u6495\u5636\u601D\u79C1\u53F8\u4E1D\u6B7B\u8086\u5BFA\u55E3\u56DB\u4F3A\u4F3C\u9972\u5DF3\u677E\u8038\u6002\u9882\u9001\u5B8B\u8BBC\u8BF5\u641C\u8258\u64DE\u55FD\u82CF\u9165\u4FD7\u7D20\u901F\u7C9F\u50F3\u5851\u6EAF\u5BBF\u8BC9\u8083\u9178\u849C\u7B97\u867D\u968B\u968F\u7EE5\u9AD3\u788E\u5C81\u7A57\u9042\u96A7\u795F\u5B59\u635F\u7B0B\u84D1\u68AD\u5506\u7F29\u7410\u7D22\u9501\u6240\u584C\u4ED6\u5B83\u5979\u5854"],
      ["cc40", "\u85F9\u85FA\u85FC\u85FD\u85FE\u8600", 4, "\u8606", 10, "\u8612\u8613\u8614\u8615\u8617", 15, "\u8628\u862A", 13, "\u8639\u863A\u863B\u863D\u863E\u863F\u8640"],
      ["cc80", "\u8641", 11, "\u8652\u8653\u8655", 4, "\u865B\u865C\u865D\u865F\u8660\u8661\u8663", 7, "\u736D\u631E\u8E4B\u8E0F\u80CE\u82D4\u62AC\u53F0\u6CF0\u915E\u592A\u6001\u6C70\u574D\u644A\u8D2A\u762B\u6EE9\u575B\u6A80\u75F0\u6F6D\u8C2D\u8C08\u5766\u6BEF\u8892\u78B3\u63A2\u53F9\u70AD\u6C64\u5858\u642A\u5802\u68E0\u819B\u5510\u7CD6\u5018\u8EBA\u6DCC\u8D9F\u70EB\u638F\u6D9B\u6ED4\u7EE6\u8404\u6843\u9003\u6DD8\u9676\u8BA8\u5957\u7279\u85E4\u817E\u75BC\u8A8A\u68AF\u5254\u8E22\u9511\u63D0\u9898\u8E44\u557C\u4F53\u66FF\u568F\u60D5\u6D95\u5243\u5C49\u5929\u6DFB\u586B\u7530\u751C\u606C\u8214\u8146\u6311\u6761\u8FE2\u773A\u8DF3\u8D34\u94C1\u5E16\u5385\u542C\u70C3"],
      ["cd40", "\u866D\u866F\u8670\u8672", 6, "\u8683", 6, "\u868E", 4, "\u8694\u8696", 5, "\u869E", 4, "\u86A5\u86A6\u86AB\u86AD\u86AE\u86B2\u86B3\u86B7\u86B8\u86B9\u86BB", 4, "\u86C1\u86C2\u86C3\u86C5\u86C8\u86CC\u86CD\u86D2\u86D3\u86D5\u86D6\u86D7\u86DA\u86DC"],
      ["cd80", "\u86DD\u86E0\u86E1\u86E2\u86E3\u86E5\u86E6\u86E7\u86E8\u86EA\u86EB\u86EC\u86EF\u86F5\u86F6\u86F7\u86FA\u86FB\u86FC\u86FD\u86FF\u8701\u8704\u8705\u8706\u870B\u870C\u870E\u870F\u8710\u8711\u8714\u8716\u6C40\u5EF7\u505C\u4EAD\u5EAD\u633A\u8247\u901A\u6850\u916E\u77B3\u540C\u94DC\u5F64\u7AE5\u6876\u6345\u7B52\u7EDF\u75DB\u5077\u6295\u5934\u900F\u51F8\u79C3\u7A81\u56FE\u5F92\u9014\u6D82\u5C60\u571F\u5410\u5154\u6E4D\u56E2\u63A8\u9893\u817F\u8715\u892A\u9000\u541E\u5C6F\u81C0\u62D6\u6258\u8131\u9E35\u9640\u9A6E\u9A7C\u692D\u59A5\u62D3\u553E\u6316\u54C7\u86D9\u6D3C\u5A03\u74E6\u889C\u6B6A\u5916\u8C4C\u5F2F\u6E7E\u73A9\u987D\u4E38\u70F7\u5B8C\u7897\u633D\u665A\u7696\u60CB\u5B9B\u5A49\u4E07\u8155\u6C6A\u738B\u4EA1\u6789\u7F51\u5F80\u65FA\u671B\u5FD8\u5984\u5A01"],
      ["ce40", "\u8719\u871B\u871D\u871F\u8720\u8724\u8726\u8727\u8728\u872A\u872B\u872C\u872D\u872F\u8730\u8732\u8733\u8735\u8736\u8738\u8739\u873A\u873C\u873D\u8740", 6, "\u874A\u874B\u874D\u874F\u8750\u8751\u8752\u8754\u8755\u8756\u8758\u875A", 5, "\u8761\u8762\u8766", 7, "\u876F\u8771\u8772\u8773\u8775"],
      ["ce80", "\u8777\u8778\u8779\u877A\u877F\u8780\u8781\u8784\u8786\u8787\u8789\u878A\u878C\u878E", 4, "\u8794\u8795\u8796\u8798", 6, "\u87A0", 4, "\u5DCD\u5FAE\u5371\u97E6\u8FDD\u6845\u56F4\u552F\u60DF\u4E3A\u6F4D\u7EF4\u82C7\u840E\u59D4\u4F1F\u4F2A\u5C3E\u7EAC\u672A\u851A\u5473\u754F\u80C3\u5582\u9B4F\u4F4D\u6E2D\u8C13\u5C09\u6170\u536B\u761F\u6E29\u868A\u6587\u95FB\u7EB9\u543B\u7A33\u7D0A\u95EE\u55E1\u7FC1\u74EE\u631D\u8717\u6DA1\u7A9D\u6211\u65A1\u5367\u63E1\u6C83\u5DEB\u545C\u94A8\u4E4C\u6C61\u8BEC\u5C4B\u65E0\u829C\u68A7\u543E\u5434\u6BCB\u6B66\u4E94\u6342\u5348\u821E\u4F0D\u4FAE\u575E\u620A\u96FE\u6664\u7269\u52FF\u52A1\u609F\u8BEF\u6614\u7199\u6790\u897F\u7852\u77FD\u6670\u563B\u5438\u9521\u727A"],
      ["cf40", "\u87A5\u87A6\u87A7\u87A9\u87AA\u87AE\u87B0\u87B1\u87B2\u87B4\u87B6\u87B7\u87B8\u87B9\u87BB\u87BC\u87BE\u87BF\u87C1", 4, "\u87C7\u87C8\u87C9\u87CC", 4, "\u87D4", 6, "\u87DC\u87DD\u87DE\u87DF\u87E1\u87E2\u87E3\u87E4\u87E6\u87E7\u87E8\u87E9\u87EB\u87EC\u87ED\u87EF", 9],
      ["cf80", "\u87FA\u87FB\u87FC\u87FD\u87FF\u8800\u8801\u8802\u8804", 5, "\u880B", 7, "\u8814\u8817\u8818\u8819\u881A\u881C", 4, "\u8823\u7A00\u606F\u5E0C\u6089\u819D\u5915\u60DC\u7184\u70EF\u6EAA\u6C50\u7280\u6A84\u88AD\u5E2D\u4E60\u5AB3\u559C\u94E3\u6D17\u7CFB\u9699\u620F\u7EC6\u778E\u867E\u5323\u971E\u8F96\u6687\u5CE1\u4FA0\u72ED\u4E0B\u53A6\u590F\u5413\u6380\u9528\u5148\u4ED9\u9C9C\u7EA4\u54B8\u8D24\u8854\u8237\u95F2\u6D8E\u5F26\u5ACC\u663E\u9669\u73B0\u732E\u53BF\u817A\u9985\u7FA1\u5BAA\u9677\u9650\u7EBF\u76F8\u53A2\u9576\u9999\u7BB1\u8944\u6E58\u4E61\u7FD4\u7965\u8BE6\u60F3\u54CD\u4EAB\u9879\u5DF7\u6A61\u50CF\u5411\u8C61\u8427\u785D\u9704\u524A\u54EE\u56A3\u9500\u6D88\u5BB5\u6DC6\u6653"],
      ["d040", "\u8824", 13, "\u8833", 5, "\u883A\u883B\u883D\u883E\u883F\u8841\u8842\u8843\u8846", 5, "\u884E", 5, "\u8855\u8856\u8858\u885A", 6, "\u8866\u8867\u886A\u886D\u886F\u8871\u8873\u8874\u8875\u8876\u8878\u8879\u887A"],
      ["d080", "\u887B\u887C\u8880\u8883\u8886\u8887\u8889\u888A\u888C\u888E\u888F\u8890\u8891\u8893\u8894\u8895\u8897", 4, "\u889D", 4, "\u88A3\u88A5", 5, "\u5C0F\u5B5D\u6821\u8096\u5578\u7B11\u6548\u6954\u4E9B\u6B47\u874E\u978B\u534F\u631F\u643A\u90AA\u659C\u80C1\u8C10\u5199\u68B0\u5378\u87F9\u61C8\u6CC4\u6CFB\u8C22\u5C51\u85AA\u82AF\u950C\u6B23\u8F9B\u65B0\u5FFB\u5FC3\u4FE1\u8845\u661F\u8165\u7329\u60FA\u5174\u5211\u578B\u5F62\u90A2\u884C\u9192\u5E78\u674F\u6027\u59D3\u5144\u51F6\u80F8\u5308\u6C79\u96C4\u718A\u4F11\u4FEE\u7F9E\u673D\u55C5\u9508\u79C0\u8896\u7EE3\u589F\u620C\u9700\u865A\u5618\u987B\u5F90\u8BB8\u84C4\u9157\u53D9\u65ED\u5E8F\u755C\u6064\u7D6E\u5A7F\u7EEA\u7EED\u8F69\u55A7\u5BA3\u60AC\u65CB\u7384"],
      ["d140", "\u88AC\u88AE\u88AF\u88B0\u88B2", 4, "\u88B8\u88B9\u88BA\u88BB\u88BD\u88BE\u88BF\u88C0\u88C3\u88C4\u88C7\u88C8\u88CA\u88CB\u88CC\u88CD\u88CF\u88D0\u88D1\u88D3\u88D6\u88D7\u88DA", 4, "\u88E0\u88E1\u88E6\u88E7\u88E9", 6, "\u88F2\u88F5\u88F6\u88F7\u88FA\u88FB\u88FD\u88FF\u8900\u8901\u8903", 5],
      ["d180", "\u8909\u890B", 4, "\u8911\u8914", 4, "\u891C", 4, "\u8922\u8923\u8924\u8926\u8927\u8928\u8929\u892C\u892D\u892E\u892F\u8931\u8932\u8933\u8935\u8937\u9009\u7663\u7729\u7EDA\u9774\u859B\u5B66\u7A74\u96EA\u8840\u52CB\u718F\u5FAA\u65EC\u8BE2\u5BFB\u9A6F\u5DE1\u6B89\u6C5B\u8BAD\u8BAF\u900A\u8FC5\u538B\u62BC\u9E26\u9E2D\u5440\u4E2B\u82BD\u7259\u869C\u5D16\u8859\u6DAF\u96C5\u54D1\u4E9A\u8BB6\u7109\u54BD\u9609\u70DF\u6DF9\u76D0\u4E25\u7814\u8712\u5CA9\u5EF6\u8A00\u989C\u960E\u708E\u6CBF\u5944\u63A9\u773C\u884D\u6F14\u8273\u5830\u71D5\u538C\u781A\u96C1\u5501\u5F66\u7130\u5BB4\u8C1A\u9A8C\u6B83\u592E\u9E2F\u79E7\u6768\u626C\u4F6F\u75A1\u7F8A\u6D0B\u9633\u6C27\u4EF0\u75D2\u517B\u6837\u6F3E\u9080\u8170\u5996\u7476"],
      ["d240", "\u8938", 8, "\u8942\u8943\u8945", 24, "\u8960", 5, "\u8967", 19, "\u897C"],
      ["d280", "\u897D\u897E\u8980\u8982\u8984\u8985\u8987", 26, "\u6447\u5C27\u9065\u7A91\u8C23\u59DA\u54AC\u8200\u836F\u8981\u8000\u6930\u564E\u8036\u7237\u91CE\u51B6\u4E5F\u9875\u6396\u4E1A\u53F6\u66F3\u814B\u591C\u6DB2\u4E00\u58F9\u533B\u63D6\u94F1\u4F9D\u4F0A\u8863\u9890\u5937\u9057\u79FB\u4EEA\u80F0\u7591\u6C82\u5B9C\u59E8\u5F5D\u6905\u8681\u501A\u5DF2\u4E59\u77E3\u4EE5\u827A\u6291\u6613\u9091\u5C79\u4EBF\u5F79\u81C6\u9038\u8084\u75AB\u4EA6\u88D4\u610F\u6BC5\u5FC6\u4E49\u76CA\u6EA2\u8BE3\u8BAE\u8C0A\u8BD1\u5F02\u7FFC\u7FCC\u7ECE\u8335\u836B\u56E0\u6BB7\u97F3\u9634\u59FB\u541F\u94F6\u6DEB\u5BC5\u996E\u5C39\u5F15\u9690"],
      ["d340", "\u89A2", 30, "\u89C3\u89CD\u89D3\u89D4\u89D5\u89D7\u89D8\u89D9\u89DB\u89DD\u89DF\u89E0\u89E1\u89E2\u89E4\u89E7\u89E8\u89E9\u89EA\u89EC\u89ED\u89EE\u89F0\u89F1\u89F2\u89F4", 6],
      ["d380", "\u89FB", 4, "\u8A01", 5, "\u8A08", 21, "\u5370\u82F1\u6A31\u5A74\u9E70\u5E94\u7F28\u83B9\u8424\u8425\u8367\u8747\u8FCE\u8D62\u76C8\u5F71\u9896\u786C\u6620\u54DF\u62E5\u4F63\u81C3\u75C8\u5EB8\u96CD\u8E0A\u86F9\u548F\u6CF3\u6D8C\u6C38\u607F\u52C7\u7528\u5E7D\u4F18\u60A0\u5FE7\u5C24\u7531\u90AE\u94C0\u72B9\u6CB9\u6E38\u9149\u6709\u53CB\u53F3\u4F51\u91C9\u8BF1\u53C8\u5E7C\u8FC2\u6DE4\u4E8E\u76C2\u6986\u865E\u611A\u8206\u4F59\u4FDE\u903E\u9C7C\u6109\u6E1D\u6E14\u9685\u4E88\u5A31\u96E8\u4E0E\u5C7F\u79B9\u5B87\u8BED\u7FBD\u7389\u57DF\u828B\u90C1\u5401\u9047\u55BB\u5CEA\u5FA1\u6108\u6B32\u72F1\u80B2\u8A89"],
      ["d440", "\u8A1E", 31, "\u8A3F", 8, "\u8A49", 21],
      ["d480", "\u8A5F", 25, "\u8A7A", 6, "\u6D74\u5BD3\u88D5\u9884\u8C6B\u9A6D\u9E33\u6E0A\u51A4\u5143\u57A3\u8881\u539F\u63F4\u8F95\u56ED\u5458\u5706\u733F\u6E90\u7F18\u8FDC\u82D1\u613F\u6028\u9662\u66F0\u7EA6\u8D8A\u8DC3\u94A5\u5CB3\u7CA4\u6708\u60A6\u9605\u8018\u4E91\u90E7\u5300\u9668\u5141\u8FD0\u8574\u915D\u6655\u97F5\u5B55\u531D\u7838\u6742\u683D\u54C9\u707E\u5BB0\u8F7D\u518D\u5728\u54B1\u6512\u6682\u8D5E\u8D43\u810F\u846C\u906D\u7CDF\u51FF\u85FB\u67A3\u65E9\u6FA1\u86A4\u8E81\u566A\u9020\u7682\u7076\u71E5\u8D23\u62E9\u5219\u6CFD\u8D3C\u600E\u589E\u618E\u66FE\u8D60\u624E\u55B3\u6E23\u672D\u8F67"],
      ["d540", "\u8A81", 7, "\u8A8B", 7, "\u8A94", 46],
      ["d580", "\u8AC3", 32, "\u94E1\u95F8\u7728\u6805\u69A8\u548B\u4E4D\u70B8\u8BC8\u6458\u658B\u5B85\u7A84\u503A\u5BE8\u77BB\u6BE1\u8A79\u7C98\u6CBE\u76CF\u65A9\u8F97\u5D2D\u5C55\u8638\u6808\u5360\u6218\u7AD9\u6E5B\u7EFD\u6A1F\u7AE0\u5F70\u6F33\u5F20\u638C\u6DA8\u6756\u4E08\u5E10\u8D26\u4ED7\u80C0\u7634\u969C\u62DB\u662D\u627E\u6CBC\u8D75\u7167\u7F69\u5146\u8087\u53EC\u906E\u6298\u54F2\u86F0\u8F99\u8005\u9517\u8517\u8FD9\u6D59\u73CD\u659F\u771F\u7504\u7827\u81FB\u8D1E\u9488\u4FA6\u6795\u75B9\u8BCA\u9707\u632F\u9547\u9635\u84B8\u6323\u7741\u5F81\u72F0\u4E89\u6014\u6574\u62EF\u6B63\u653F"],
      ["d640", "\u8AE4", 34, "\u8B08", 27],
      ["d680", "\u8B24\u8B25\u8B27", 30, "\u5E27\u75C7\u90D1\u8BC1\u829D\u679D\u652F\u5431\u8718\u77E5\u80A2\u8102\u6C41\u4E4B\u7EC7\u804C\u76F4\u690D\u6B96\u6267\u503C\u4F84\u5740\u6307\u6B62\u8DBE\u53EA\u65E8\u7EB8\u5FD7\u631A\u63B7\u81F3\u81F4\u7F6E\u5E1C\u5CD9\u5236\u667A\u79E9\u7A1A\u8D28\u7099\u75D4\u6EDE\u6CBB\u7A92\u4E2D\u76C5\u5FE0\u949F\u8877\u7EC8\u79CD\u80BF\u91CD\u4EF2\u4F17\u821F\u5468\u5DDE\u6D32\u8BCC\u7CA5\u8F74\u8098\u5E1A\u5492\u76B1\u5B99\u663C\u9AA4\u73E0\u682A\u86DB\u6731\u732A\u8BF8\u8BDB\u9010\u7AF9\u70DB\u716E\u62C4\u77A9\u5631\u4E3B\u8457\u67F1\u52A9\u86C0\u8D2E\u94F8\u7B51"],
      ["d740", "\u8B46", 31, "\u8B67", 4, "\u8B6D", 25],
      ["d780", "\u8B87", 24, "\u8BAC\u8BB1\u8BBB\u8BC7\u8BD0\u8BEA\u8C09\u8C1E\u4F4F\u6CE8\u795D\u9A7B\u6293\u722A\u62FD\u4E13\u7816\u8F6C\u64B0\u8D5A\u7BC6\u6869\u5E84\u88C5\u5986\u649E\u58EE\u72B6\u690E\u9525\u8FFD\u8D58\u5760\u7F00\u8C06\u51C6\u6349\u62D9\u5353\u684C\u7422\u8301\u914C\u5544\u7740\u707C\u6D4A\u5179\u54A8\u8D44\u59FF\u6ECB\u6DC4\u5B5C\u7D2B\u4ED4\u7C7D\u6ED3\u5B50\u81EA\u6E0D\u5B57\u9B03\u68D5\u8E2A\u5B97\u7EFC\u603B\u7EB5\u90B9\u8D70\u594F\u63CD\u79DF\u8DB3\u5352\u65CF\u7956\u8BC5\u963B\u7EC4\u94BB\u7E82\u5634\u9189\u6700\u7F6A\u5C0A\u9075\u6628\u5DE6\u4F50\u67DE\u505A\u4F5C\u5750\u5EA7"],
      ["d840", "\u8C38", 8, "\u8C42\u8C43\u8C44\u8C45\u8C48\u8C4A\u8C4B\u8C4D", 7, "\u8C56\u8C57\u8C58\u8C59\u8C5B", 5, "\u8C63", 6, "\u8C6C", 6, "\u8C74\u8C75\u8C76\u8C77\u8C7B", 6, "\u8C83\u8C84\u8C86\u8C87"],
      ["d880", "\u8C88\u8C8B\u8C8D", 6, "\u8C95\u8C96\u8C97\u8C99", 20, "\u4E8D\u4E0C\u5140\u4E10\u5EFF\u5345\u4E15\u4E98\u4E1E\u9B32\u5B6C\u5669\u4E28\u79BA\u4E3F\u5315\u4E47\u592D\u723B\u536E\u6C10\u56DF\u80E4\u9997\u6BD3\u777E\u9F17\u4E36\u4E9F\u9F10\u4E5C\u4E69\u4E93\u8288\u5B5B\u556C\u560F\u4EC4\u538D\u539D\u53A3\u53A5\u53AE\u9765\u8D5D\u531A\u53F5\u5326\u532E\u533E\u8D5C\u5366\u5363\u5202\u5208\u520E\u522D\u5233\u523F\u5240\u524C\u525E\u5261\u525C\u84AF\u527D\u5282\u5281\u5290\u5293\u5182\u7F54\u4EBB\u4EC3\u4EC9\u4EC2\u4EE8\u4EE1\u4EEB\u4EDE\u4F1B\u4EF3\u4F22\u4F64\u4EF5\u4F25\u4F27\u4F09\u4F2B\u4F5E\u4F67\u6538\u4F5A\u4F5D"],
      ["d940", "\u8CAE", 62],
      ["d980", "\u8CED", 32, "\u4F5F\u4F57\u4F32\u4F3D\u4F76\u4F74\u4F91\u4F89\u4F83\u4F8F\u4F7E\u4F7B\u4FAA\u4F7C\u4FAC\u4F94\u4FE6\u4FE8\u4FEA\u4FC5\u4FDA\u4FE3\u4FDC\u4FD1\u4FDF\u4FF8\u5029\u504C\u4FF3\u502C\u500F\u502E\u502D\u4FFE\u501C\u500C\u5025\u5028\u507E\u5043\u5055\u5048\u504E\u506C\u507B\u50A5\u50A7\u50A9\u50BA\u50D6\u5106\u50ED\u50EC\u50E6\u50EE\u5107\u510B\u4EDD\u6C3D\u4F58\u4F65\u4FCE\u9FA0\u6C46\u7C74\u516E\u5DFD\u9EC9\u9998\u5181\u5914\u52F9\u530D\u8A07\u5310\u51EB\u5919\u5155\u4EA0\u5156\u4EB3\u886E\u88A4\u4EB5\u8114\u88D2\u7980\u5B34\u8803\u7FB8\u51AB\u51B1\u51BD\u51BC"],
      ["da40", "\u8D0E", 14, "\u8D20\u8D51\u8D52\u8D57\u8D5F\u8D65\u8D68\u8D69\u8D6A\u8D6C\u8D6E\u8D6F\u8D71\u8D72\u8D78", 8, "\u8D82\u8D83\u8D86\u8D87\u8D88\u8D89\u8D8C", 4, "\u8D92\u8D93\u8D95", 9, "\u8DA0\u8DA1"],
      ["da80", "\u8DA2\u8DA4", 12, "\u8DB2\u8DB6\u8DB7\u8DB9\u8DBB\u8DBD\u8DC0\u8DC1\u8DC2\u8DC5\u8DC7\u8DC8\u8DC9\u8DCA\u8DCD\u8DD0\u8DD2\u8DD3\u8DD4\u51C7\u5196\u51A2\u51A5\u8BA0\u8BA6\u8BA7\u8BAA\u8BB4\u8BB5\u8BB7\u8BC2\u8BC3\u8BCB\u8BCF\u8BCE\u8BD2\u8BD3\u8BD4\u8BD6\u8BD8\u8BD9\u8BDC\u8BDF\u8BE0\u8BE4\u8BE8\u8BE9\u8BEE\u8BF0\u8BF3\u8BF6\u8BF9\u8BFC\u8BFF\u8C00\u8C02\u8C04\u8C07\u8C0C\u8C0F\u8C11\u8C12\u8C14\u8C15\u8C16\u8C19\u8C1B\u8C18\u8C1D\u8C1F\u8C20\u8C21\u8C25\u8C27\u8C2A\u8C2B\u8C2E\u8C2F\u8C32\u8C33\u8C35\u8C36\u5369\u537A\u961D\u9622\u9621\u9631\u962A\u963D\u963C\u9642\u9649\u9654\u965F\u9667\u966C\u9672\u9674\u9688\u968D\u9697\u96B0\u9097\u909B\u909D\u9099\u90AC\u90A1\u90B4\u90B3\u90B6\u90BA"],
      ["db40", "\u8DD5\u8DD8\u8DD9\u8DDC\u8DE0\u8DE1\u8DE2\u8DE5\u8DE6\u8DE7\u8DE9\u8DED\u8DEE\u8DF0\u8DF1\u8DF2\u8DF4\u8DF6\u8DFC\u8DFE", 6, "\u8E06\u8E07\u8E08\u8E0B\u8E0D\u8E0E\u8E10\u8E11\u8E12\u8E13\u8E15", 7, "\u8E20\u8E21\u8E24", 4, "\u8E2B\u8E2D\u8E30\u8E32\u8E33\u8E34\u8E36\u8E37\u8E38\u8E3B\u8E3C\u8E3E"],
      ["db80", "\u8E3F\u8E43\u8E45\u8E46\u8E4C", 4, "\u8E53", 5, "\u8E5A", 11, "\u8E67\u8E68\u8E6A\u8E6B\u8E6E\u8E71\u90B8\u90B0\u90CF\u90C5\u90BE\u90D0\u90C4\u90C7\u90D3\u90E6\u90E2\u90DC\u90D7\u90DB\u90EB\u90EF\u90FE\u9104\u9122\u911E\u9123\u9131\u912F\u9139\u9143\u9146\u520D\u5942\u52A2\u52AC\u52AD\u52BE\u54FF\u52D0\u52D6\u52F0\u53DF\u71EE\u77CD\u5EF4\u51F5\u51FC\u9B2F\u53B6\u5F01\u755A\u5DEF\u574C\u57A9\u57A1\u587E\u58BC\u58C5\u58D1\u5729\u572C\u572A\u5733\u5739\u572E\u572F\u575C\u573B\u5742\u5769\u5785\u576B\u5786\u577C\u577B\u5768\u576D\u5776\u5773\u57AD\u57A4\u578C\u57B2\u57CF\u57A7\u57B4\u5793\u57A0\u57D5\u57D8\u57DA\u57D9\u57D2\u57B8\u57F4\u57EF\u57F8\u57E4\u57DD"],
      ["dc40", "\u8E73\u8E75\u8E77", 4, "\u8E7D\u8E7E\u8E80\u8E82\u8E83\u8E84\u8E86\u8E88", 6, "\u8E91\u8E92\u8E93\u8E95", 6, "\u8E9D\u8E9F", 11, "\u8EAD\u8EAE\u8EB0\u8EB1\u8EB3", 6, "\u8EBB", 7],
      ["dc80", "\u8EC3", 10, "\u8ECF", 21, "\u580B\u580D\u57FD\u57ED\u5800\u581E\u5819\u5844\u5820\u5865\u586C\u5881\u5889\u589A\u5880\u99A8\u9F19\u61FF\u8279\u827D\u827F\u828F\u828A\u82A8\u8284\u828E\u8291\u8297\u8299\u82AB\u82B8\u82BE\u82B0\u82C8\u82CA\u82E3\u8298\u82B7\u82AE\u82CB\u82CC\u82C1\u82A9\u82B4\u82A1\u82AA\u829F\u82C4\u82CE\u82A4\u82E1\u8309\u82F7\u82E4\u830F\u8307\u82DC\u82F4\u82D2\u82D8\u830C\u82FB\u82D3\u8311\u831A\u8306\u8314\u8315\u82E0\u82D5\u831C\u8351\u835B\u835C\u8308\u8392\u833C\u8334\u8331\u839B\u835E\u832F\u834F\u8347\u8343\u835F\u8340\u8317\u8360\u832D\u833A\u8333\u8366\u8365"],
      ["dd40", "\u8EE5", 62],
      ["dd80", "\u8F24", 32, "\u8368\u831B\u8369\u836C\u836A\u836D\u836E\u83B0\u8378\u83B3\u83B4\u83A0\u83AA\u8393\u839C\u8385\u837C\u83B6\u83A9\u837D\u83B8\u837B\u8398\u839E\u83A8\u83BA\u83BC\u83C1\u8401\u83E5\u83D8\u5807\u8418\u840B\u83DD\u83FD\u83D6\u841C\u8438\u8411\u8406\u83D4\u83DF\u840F\u8403\u83F8\u83F9\u83EA\u83C5\u83C0\u8426\u83F0\u83E1\u845C\u8451\u845A\u8459\u8473\u8487\u8488\u847A\u8489\u8478\u843C\u8446\u8469\u8476\u848C\u848E\u8431\u846D\u84C1\u84CD\u84D0\u84E6\u84BD\u84D3\u84CA\u84BF\u84BA\u84E0\u84A1\u84B9\u84B4\u8497\u84E5\u84E3\u850C\u750D\u8538\u84F0\u8539\u851F\u853A"],
      ["de40", "\u8F45", 32, "\u8F6A\u8F80\u8F8C\u8F92\u8F9D\u8FA0\u8FA1\u8FA2\u8FA4\u8FA5\u8FA6\u8FA7\u8FAA\u8FAC\u8FAD\u8FAE\u8FAF\u8FB2\u8FB3\u8FB4\u8FB5\u8FB7\u8FB8\u8FBA\u8FBB\u8FBC\u8FBF\u8FC0\u8FC3\u8FC6"],
      ["de80", "\u8FC9", 4, "\u8FCF\u8FD2\u8FD6\u8FD7\u8FDA\u8FE0\u8FE1\u8FE3\u8FE7\u8FEC\u8FEF\u8FF1\u8FF2\u8FF4\u8FF5\u8FF6\u8FFA\u8FFB\u8FFC\u8FFE\u8FFF\u9007\u9008\u900C\u900E\u9013\u9015\u9018\u8556\u853B\u84FF\u84FC\u8559\u8548\u8568\u8564\u855E\u857A\u77A2\u8543\u8572\u857B\u85A4\u85A8\u8587\u858F\u8579\u85AE\u859C\u8585\u85B9\u85B7\u85B0\u85D3\u85C1\u85DC\u85FF\u8627\u8605\u8629\u8616\u863C\u5EFE\u5F08\u593C\u5941\u8037\u5955\u595A\u5958\u530F\u5C22\u5C25\u5C2C\u5C34\u624C\u626A\u629F\u62BB\u62CA\u62DA\u62D7\u62EE\u6322\u62F6\u6339\u634B\u6343\u63AD\u63F6\u6371\u637A\u638E\u63B4\u636D\u63AC\u638A\u6369\u63AE\u63BC\u63F2\u63F8\u63E0\u63FF\u63C4\u63DE\u63CE\u6452\u63C6\u63BE\u6445\u6441\u640B\u641B\u6420\u640C\u6426\u6421\u645E\u6484\u646D\u6496"],
      ["df40", "\u9019\u901C\u9023\u9024\u9025\u9027", 5, "\u9030", 4, "\u9037\u9039\u903A\u903D\u903F\u9040\u9043\u9045\u9046\u9048", 4, "\u904E\u9054\u9055\u9056\u9059\u905A\u905C", 5, "\u9064\u9066\u9067\u9069\u906A\u906B\u906C\u906F", 4, "\u9076", 6, "\u907E\u9081"],
      ["df80", "\u9084\u9085\u9086\u9087\u9089\u908A\u908C", 4, "\u9092\u9094\u9096\u9098\u909A\u909C\u909E\u909F\u90A0\u90A4\u90A5\u90A7\u90A8\u90A9\u90AB\u90AD\u90B2\u90B7\u90BC\u90BD\u90BF\u90C0\u647A\u64B7\u64B8\u6499\u64BA\u64C0\u64D0\u64D7\u64E4\u64E2\u6509\u6525\u652E\u5F0B\u5FD2\u7519\u5F11\u535F\u53F1\u53FD\u53E9\u53E8\u53FB\u5412\u5416\u5406\u544B\u5452\u5453\u5454\u5456\u5443\u5421\u5457\u5459\u5423\u5432\u5482\u5494\u5477\u5471\u5464\u549A\u549B\u5484\u5476\u5466\u549D\u54D0\u54AD\u54C2\u54B4\u54D2\u54A7\u54A6\u54D3\u54D4\u5472\u54A3\u54D5\u54BB\u54BF\u54CC\u54D9\u54DA\u54DC\u54A9\u54AA\u54A4\u54DD\u54CF\u54DE\u551B\u54E7\u5520\u54FD\u5514\u54F3\u5522\u5523\u550F\u5511\u5527\u552A\u5567\u558F\u55B5\u5549\u556D\u5541\u5555\u553F\u5550\u553C"],
      ["e040", "\u90C2\u90C3\u90C6\u90C8\u90C9\u90CB\u90CC\u90CD\u90D2\u90D4\u90D5\u90D6\u90D8\u90D9\u90DA\u90DE\u90DF\u90E0\u90E3\u90E4\u90E5\u90E9\u90EA\u90EC\u90EE\u90F0\u90F1\u90F2\u90F3\u90F5\u90F6\u90F7\u90F9\u90FA\u90FB\u90FC\u90FF\u9100\u9101\u9103\u9105", 19, "\u911A\u911B\u911C"],
      ["e080", "\u911D\u911F\u9120\u9121\u9124", 10, "\u9130\u9132", 6, "\u913A", 8, "\u9144\u5537\u5556\u5575\u5576\u5577\u5533\u5530\u555C\u558B\u55D2\u5583\u55B1\u55B9\u5588\u5581\u559F\u557E\u55D6\u5591\u557B\u55DF\u55BD\u55BE\u5594\u5599\u55EA\u55F7\u55C9\u561F\u55D1\u55EB\u55EC\u55D4\u55E6\u55DD\u55C4\u55EF\u55E5\u55F2\u55F3\u55CC\u55CD\u55E8\u55F5\u55E4\u8F94\u561E\u5608\u560C\u5601\u5624\u5623\u55FE\u5600\u5627\u562D\u5658\u5639\u5657\u562C\u564D\u5662\u5659\u565C\u564C\u5654\u5686\u5664\u5671\u566B\u567B\u567C\u5685\u5693\u56AF\u56D4\u56D7\u56DD\u56E1\u56F5\u56EB\u56F9\u56FF\u5704\u570A\u5709\u571C\u5E0F\u5E19\u5E14\u5E11\u5E31\u5E3B\u5E3C"],
      ["e140", "\u9145\u9147\u9148\u9151\u9153\u9154\u9155\u9156\u9158\u9159\u915B\u915C\u915F\u9160\u9166\u9167\u9168\u916B\u916D\u9173\u917A\u917B\u917C\u9180", 4, "\u9186\u9188\u918A\u918E\u918F\u9193", 6, "\u919C", 5, "\u91A4", 5, "\u91AB\u91AC\u91B0\u91B1\u91B2\u91B3\u91B6\u91B7\u91B8\u91B9\u91BB"],
      ["e180", "\u91BC", 10, "\u91C8\u91CB\u91D0\u91D2", 9, "\u91DD", 8, "\u5E37\u5E44\u5E54\u5E5B\u5E5E\u5E61\u5C8C\u5C7A\u5C8D\u5C90\u5C96\u5C88\u5C98\u5C99\u5C91\u5C9A\u5C9C\u5CB5\u5CA2\u5CBD\u5CAC\u5CAB\u5CB1\u5CA3\u5CC1\u5CB7\u5CC4\u5CD2\u5CE4\u5CCB\u5CE5\u5D02\u5D03\u5D27\u5D26\u5D2E\u5D24\u5D1E\u5D06\u5D1B\u5D58\u5D3E\u5D34\u5D3D\u5D6C\u5D5B\u5D6F\u5D5D\u5D6B\u5D4B\u5D4A\u5D69\u5D74\u5D82\u5D99\u5D9D\u8C73\u5DB7\u5DC5\u5F73\u5F77\u5F82\u5F87\u5F89\u5F8C\u5F95\u5F99\u5F9C\u5FA8\u5FAD\u5FB5\u5FBC\u8862\u5F61\u72AD\u72B0\u72B4\u72B7\u72B8\u72C3\u72C1\u72CE\u72CD\u72D2\u72E8\u72EF\u72E9\u72F2\u72F4\u72F7\u7301\u72F3\u7303\u72FA"],
      ["e240", "\u91E6", 62],
      ["e280", "\u9225", 32, "\u72FB\u7317\u7313\u7321\u730A\u731E\u731D\u7315\u7322\u7339\u7325\u732C\u7338\u7331\u7350\u734D\u7357\u7360\u736C\u736F\u737E\u821B\u5925\u98E7\u5924\u5902\u9963\u9967", 5, "\u9974\u9977\u997D\u9980\u9984\u9987\u998A\u998D\u9990\u9991\u9993\u9994\u9995\u5E80\u5E91\u5E8B\u5E96\u5EA5\u5EA0\u5EB9\u5EB5\u5EBE\u5EB3\u8D53\u5ED2\u5ED1\u5EDB\u5EE8\u5EEA\u81BA\u5FC4\u5FC9\u5FD6\u5FCF\u6003\u5FEE\u6004\u5FE1\u5FE4\u5FFE\u6005\u6006\u5FEA\u5FED\u5FF8\u6019\u6035\u6026\u601B\u600F\u600D\u6029\u602B\u600A\u603F\u6021\u6078\u6079\u607B\u607A\u6042"],
      ["e340", "\u9246", 45, "\u9275", 16],
      ["e380", "\u9286", 7, "\u928F", 24, "\u606A\u607D\u6096\u609A\u60AD\u609D\u6083\u6092\u608C\u609B\u60EC\u60BB\u60B1\u60DD\u60D8\u60C6\u60DA\u60B4\u6120\u6126\u6115\u6123\u60F4\u6100\u610E\u612B\u614A\u6175\u61AC\u6194\u61A7\u61B7\u61D4\u61F5\u5FDD\u96B3\u95E9\u95EB\u95F1\u95F3\u95F5\u95F6\u95FC\u95FE\u9603\u9604\u9606\u9608\u960A\u960B\u960C\u960D\u960F\u9612\u9615\u9616\u9617\u9619\u961A\u4E2C\u723F\u6215\u6C35\u6C54\u6C5C\u6C4A\u6CA3\u6C85\u6C90\u6C94\u6C8C\u6C68\u6C69\u6C74\u6C76\u6C86\u6CA9\u6CD0\u6CD4\u6CAD\u6CF7\u6CF8\u6CF1\u6CD7\u6CB2\u6CE0\u6CD6\u6CFA\u6CEB\u6CEE\u6CB1\u6CD3\u6CEF\u6CFE"],
      ["e440", "\u92A8", 5, "\u92AF", 24, "\u92C9", 31],
      ["e480", "\u92E9", 32, "\u6D39\u6D27\u6D0C\u6D43\u6D48\u6D07\u6D04\u6D19\u6D0E\u6D2B\u6D4D\u6D2E\u6D35\u6D1A\u6D4F\u6D52\u6D54\u6D33\u6D91\u6D6F\u6D9E\u6DA0\u6D5E\u6D93\u6D94\u6D5C\u6D60\u6D7C\u6D63\u6E1A\u6DC7\u6DC5\u6DDE\u6E0E\u6DBF\u6DE0\u6E11\u6DE6\u6DDD\u6DD9\u6E16\u6DAB\u6E0C\u6DAE\u6E2B\u6E6E\u6E4E\u6E6B\u6EB2\u6E5F\u6E86\u6E53\u6E54\u6E32\u6E25\u6E44\u6EDF\u6EB1\u6E98\u6EE0\u6F2D\u6EE2\u6EA5\u6EA7\u6EBD\u6EBB\u6EB7\u6ED7\u6EB4\u6ECF\u6E8F\u6EC2\u6E9F\u6F62\u6F46\u6F47\u6F24\u6F15\u6EF9\u6F2F\u6F36\u6F4B\u6F74\u6F2A\u6F09\u6F29\u6F89\u6F8D\u6F8C\u6F78\u6F72\u6F7C\u6F7A\u6FD1"],
      ["e540", "\u930A", 51, "\u933F", 10],
      ["e580", "\u934A", 31, "\u936B\u6FC9\u6FA7\u6FB9\u6FB6\u6FC2\u6FE1\u6FEE\u6FDE\u6FE0\u6FEF\u701A\u7023\u701B\u7039\u7035\u704F\u705E\u5B80\u5B84\u5B95\u5B93\u5BA5\u5BB8\u752F\u9A9E\u6434\u5BE4\u5BEE\u8930\u5BF0\u8E47\u8B07\u8FB6\u8FD3\u8FD5\u8FE5\u8FEE\u8FE4\u8FE9\u8FE6\u8FF3\u8FE8\u9005\u9004\u900B\u9026\u9011\u900D\u9016\u9021\u9035\u9036\u902D\u902F\u9044\u9051\u9052\u9050\u9068\u9058\u9062\u905B\u66B9\u9074\u907D\u9082\u9088\u9083\u908B\u5F50\u5F57\u5F56\u5F58\u5C3B\u54AB\u5C50\u5C59\u5B71\u5C63\u5C66\u7FBC\u5F2A\u5F29\u5F2D\u8274\u5F3C\u9B3B\u5C6E\u5981\u5983\u598D\u59A9\u59AA\u59A3"],
      ["e640", "\u936C", 34, "\u9390", 27],
      ["e680", "\u93AC", 29, "\u93CB\u93CC\u93CD\u5997\u59CA\u59AB\u599E\u59A4\u59D2\u59B2\u59AF\u59D7\u59BE\u5A05\u5A06\u59DD\u5A08\u59E3\u59D8\u59F9\u5A0C\u5A09\u5A32\u5A34\u5A11\u5A23\u5A13\u5A40\u5A67\u5A4A\u5A55\u5A3C\u5A62\u5A75\u80EC\u5AAA\u5A9B\u5A77\u5A7A\u5ABE\u5AEB\u5AB2\u5AD2\u5AD4\u5AB8\u5AE0\u5AE3\u5AF1\u5AD6\u5AE6\u5AD8\u5ADC\u5B09\u5B17\u5B16\u5B32\u5B37\u5B40\u5C15\u5C1C\u5B5A\u5B65\u5B73\u5B51\u5B53\u5B62\u9A75\u9A77\u9A78\u9A7A\u9A7F\u9A7D\u9A80\u9A81\u9A85\u9A88\u9A8A\u9A90\u9A92\u9A93\u9A96\u9A98\u9A9B\u9A9C\u9A9D\u9A9F\u9AA0\u9AA2\u9AA3\u9AA5\u9AA7\u7E9F\u7EA1\u7EA3\u7EA5\u7EA8\u7EA9"],
      ["e740", "\u93CE", 7, "\u93D7", 54],
      ["e780", "\u940E", 32, "\u7EAD\u7EB0\u7EBE\u7EC0\u7EC1\u7EC2\u7EC9\u7ECB\u7ECC\u7ED0\u7ED4\u7ED7\u7EDB\u7EE0\u7EE1\u7EE8\u7EEB\u7EEE\u7EEF\u7EF1\u7EF2\u7F0D\u7EF6\u7EFA\u7EFB\u7EFE\u7F01\u7F02\u7F03\u7F07\u7F08\u7F0B\u7F0C\u7F0F\u7F11\u7F12\u7F17\u7F19\u7F1C\u7F1B\u7F1F\u7F21", 6, "\u7F2A\u7F2B\u7F2C\u7F2D\u7F2F", 4, "\u7F35\u5E7A\u757F\u5DDB\u753E\u9095\u738E\u7391\u73AE\u73A2\u739F\u73CF\u73C2\u73D1\u73B7\u73B3\u73C0\u73C9\u73C8\u73E5\u73D9\u987C\u740A\u73E9\u73E7\u73DE\u73BA\u73F2\u740F\u742A\u745B\u7426\u7425\u7428\u7430\u742E\u742C"],
      ["e840", "\u942F", 14, "\u943F", 43, "\u946C\u946D\u946E\u946F"],
      ["e880", "\u9470", 20, "\u9491\u9496\u9498\u94C7\u94CF\u94D3\u94D4\u94DA\u94E6\u94FB\u951C\u9520\u741B\u741A\u7441\u745C\u7457\u7455\u7459\u7477\u746D\u747E\u749C\u748E\u7480\u7481\u7487\u748B\u749E\u74A8\u74A9\u7490\u74A7\u74D2\u74BA\u97EA\u97EB\u97EC\u674C\u6753\u675E\u6748\u6769\u67A5\u6787\u676A\u6773\u6798\u67A7\u6775\u67A8\u679E\u67AD\u678B\u6777\u677C\u67F0\u6809\u67D8\u680A\u67E9\u67B0\u680C\u67D9\u67B5\u67DA\u67B3\u67DD\u6800\u67C3\u67B8\u67E2\u680E\u67C1\u67FD\u6832\u6833\u6860\u6861\u684E\u6862\u6844\u6864\u6883\u681D\u6855\u6866\u6841\u6867\u6840\u683E\u684A\u6849\u6829\u68B5\u688F\u6874\u6877\u6893\u686B\u68C2\u696E\u68FC\u691F\u6920\u68F9"],
      ["e940", "\u9527\u9533\u953D\u9543\u9548\u954B\u9555\u955A\u9560\u956E\u9574\u9575\u9577", 7, "\u9580", 42],
      ["e980", "\u95AB", 32, "\u6924\u68F0\u690B\u6901\u6957\u68E3\u6910\u6971\u6939\u6960\u6942\u695D\u6984\u696B\u6980\u6998\u6978\u6934\u69CC\u6987\u6988\u69CE\u6989\u6966\u6963\u6979\u699B\u69A7\u69BB\u69AB\u69AD\u69D4\u69B1\u69C1\u69CA\u69DF\u6995\u69E0\u698D\u69FF\u6A2F\u69ED\u6A17\u6A18\u6A65\u69F2\u6A44\u6A3E\u6AA0\u6A50\u6A5B\u6A35\u6A8E\u6A79\u6A3D\u6A28\u6A58\u6A7C\u6A91\u6A90\u6AA9\u6A97\u6AAB\u7337\u7352\u6B81\u6B82\u6B87\u6B84\u6B92\u6B93\u6B8D\u6B9A\u6B9B\u6BA1\u6BAA\u8F6B\u8F6D\u8F71\u8F72\u8F73\u8F75\u8F76\u8F78\u8F77\u8F79\u8F7A\u8F7C\u8F7E\u8F81\u8F82\u8F84\u8F87\u8F8B"],
      ["ea40", "\u95CC", 27, "\u95EC\u95FF\u9607\u9613\u9618\u961B\u961E\u9620\u9623", 6, "\u962B\u962C\u962D\u962F\u9630\u9637\u9638\u9639\u963A\u963E\u9641\u9643\u964A\u964E\u964F\u9651\u9652\u9653\u9656\u9657"],
      ["ea80", "\u9658\u9659\u965A\u965C\u965D\u965E\u9660\u9663\u9665\u9666\u966B\u966D", 4, "\u9673\u9678", 12, "\u9687\u9689\u968A\u8F8D\u8F8E\u8F8F\u8F98\u8F9A\u8ECE\u620B\u6217\u621B\u621F\u6222\u6221\u6225\u6224\u622C\u81E7\u74EF\u74F4\u74FF\u750F\u7511\u7513\u6534\u65EE\u65EF\u65F0\u660A\u6619\u6772\u6603\u6615\u6600\u7085\u66F7\u661D\u6634\u6631\u6636\u6635\u8006\u665F\u6654\u6641\u664F\u6656\u6661\u6657\u6677\u6684\u668C\u66A7\u669D\u66BE\u66DB\u66DC\u66E6\u66E9\u8D32\u8D33\u8D36\u8D3B\u8D3D\u8D40\u8D45\u8D46\u8D48\u8D49\u8D47\u8D4D\u8D55\u8D59\u89C7\u89CA\u89CB\u89CC\u89CE\u89CF\u89D0\u89D1\u726E\u729F\u725D\u7266\u726F\u727E\u727F\u7284\u728B\u728D\u728F\u7292\u6308\u6332\u63B0"],
      ["eb40", "\u968C\u968E\u9691\u9692\u9693\u9695\u9696\u969A\u969B\u969D", 9, "\u96A8", 7, "\u96B1\u96B2\u96B4\u96B5\u96B7\u96B8\u96BA\u96BB\u96BF\u96C2\u96C3\u96C8\u96CA\u96CB\u96D0\u96D1\u96D3\u96D4\u96D6", 9, "\u96E1", 6, "\u96EB"],
      ["eb80", "\u96EC\u96ED\u96EE\u96F0\u96F1\u96F2\u96F4\u96F5\u96F8\u96FA\u96FB\u96FC\u96FD\u96FF\u9702\u9703\u9705\u970A\u970B\u970C\u9710\u9711\u9712\u9714\u9715\u9717", 4, "\u971D\u971F\u9720\u643F\u64D8\u8004\u6BEA\u6BF3\u6BFD\u6BF5\u6BF9\u6C05\u6C07\u6C06\u6C0D\u6C15\u6C18\u6C19\u6C1A\u6C21\u6C29\u6C24\u6C2A\u6C32\u6535\u6555\u656B\u724D\u7252\u7256\u7230\u8662\u5216\u809F\u809C\u8093\u80BC\u670A\u80BD\u80B1\u80AB\u80AD\u80B4\u80B7\u80E7\u80E8\u80E9\u80EA\u80DB\u80C2\u80C4\u80D9\u80CD\u80D7\u6710\u80DD\u80EB\u80F1\u80F4\u80ED\u810D\u810E\u80F2\u80FC\u6715\u8112\u8C5A\u8136\u811E\u812C\u8118\u8132\u8148\u814C\u8153\u8174\u8159\u815A\u8171\u8160\u8169\u817C\u817D\u816D\u8167\u584D\u5AB5\u8188\u8182\u8191\u6ED5\u81A3\u81AA\u81CC\u6726\u81CA\u81BB"],
      ["ec40", "\u9721", 8, "\u972B\u972C\u972E\u972F\u9731\u9733", 4, "\u973A\u973B\u973C\u973D\u973F", 18, "\u9754\u9755\u9757\u9758\u975A\u975C\u975D\u975F\u9763\u9764\u9766\u9767\u9768\u976A", 7],
      ["ec80", "\u9772\u9775\u9777", 4, "\u977D", 7, "\u9786", 4, "\u978C\u978E\u978F\u9790\u9793\u9795\u9796\u9797\u9799", 4, "\u81C1\u81A6\u6B24\u6B37\u6B39\u6B43\u6B46\u6B59\u98D1\u98D2\u98D3\u98D5\u98D9\u98DA\u6BB3\u5F40\u6BC2\u89F3\u6590\u9F51\u6593\u65BC\u65C6\u65C4\u65C3\u65CC\u65CE\u65D2\u65D6\u7080\u709C\u7096\u709D\u70BB\u70C0\u70B7\u70AB\u70B1\u70E8\u70CA\u7110\u7113\u7116\u712F\u7131\u7173\u715C\u7168\u7145\u7172\u714A\u7178\u717A\u7198\u71B3\u71B5\u71A8\u71A0\u71E0\u71D4\u71E7\u71F9\u721D\u7228\u706C\u7118\u7166\u71B9\u623E\u623D\u6243\u6248\u6249\u793B\u7940\u7946\u7949\u795B\u795C\u7953\u795A\u7962\u7957\u7960\u796F\u7967\u797A\u7985\u798A\u799A\u79A7\u79B3\u5FD1\u5FD0"],
      ["ed40", "\u979E\u979F\u97A1\u97A2\u97A4", 6, "\u97AC\u97AE\u97B0\u97B1\u97B3\u97B5", 46],
      ["ed80", "\u97E4\u97E5\u97E8\u97EE", 4, "\u97F4\u97F7", 23, "\u603C\u605D\u605A\u6067\u6041\u6059\u6063\u60AB\u6106\u610D\u615D\u61A9\u619D\u61CB\u61D1\u6206\u8080\u807F\u6C93\u6CF6\u6DFC\u77F6\u77F8\u7800\u7809\u7817\u7818\u7811\u65AB\u782D\u781C\u781D\u7839\u783A\u783B\u781F\u783C\u7825\u782C\u7823\u7829\u784E\u786D\u7856\u7857\u7826\u7850\u7847\u784C\u786A\u789B\u7893\u789A\u7887\u789C\u78A1\u78A3\u78B2\u78B9\u78A5\u78D4\u78D9\u78C9\u78EC\u78F2\u7905\u78F4\u7913\u7924\u791E\u7934\u9F9B\u9EF9\u9EFB\u9EFC\u76F1\u7704\u770D\u76F9\u7707\u7708\u771A\u7722\u7719\u772D\u7726\u7735\u7738\u7750\u7751\u7747\u7743\u775A\u7768"],
      ["ee40", "\u980F", 62],
      ["ee80", "\u984E", 32, "\u7762\u7765\u777F\u778D\u777D\u7780\u778C\u7791\u779F\u77A0\u77B0\u77B5\u77BD\u753A\u7540\u754E\u754B\u7548\u755B\u7572\u7579\u7583\u7F58\u7F61\u7F5F\u8A48\u7F68\u7F74\u7F71\u7F79\u7F81\u7F7E\u76CD\u76E5\u8832\u9485\u9486\u9487\u948B\u948A\u948C\u948D\u948F\u9490\u9494\u9497\u9495\u949A\u949B\u949C\u94A3\u94A4\u94AB\u94AA\u94AD\u94AC\u94AF\u94B0\u94B2\u94B4\u94B6", 4, "\u94BC\u94BD\u94BF\u94C4\u94C8", 6, "\u94D0\u94D1\u94D2\u94D5\u94D6\u94D7\u94D9\u94D8\u94DB\u94DE\u94DF\u94E0\u94E2\u94E4\u94E5\u94E7\u94E8\u94EA"],
      ["ef40", "\u986F", 5, "\u988B\u988E\u9892\u9895\u9899\u98A3\u98A8", 37, "\u98CF\u98D0\u98D4\u98D6\u98D7\u98DB\u98DC\u98DD\u98E0", 4],
      ["ef80", "\u98E5\u98E6\u98E9", 30, "\u94E9\u94EB\u94EE\u94EF\u94F3\u94F4\u94F5\u94F7\u94F9\u94FC\u94FD\u94FF\u9503\u9502\u9506\u9507\u9509\u950A\u950D\u950E\u950F\u9512", 4, "\u9518\u951B\u951D\u951E\u951F\u9522\u952A\u952B\u9529\u952C\u9531\u9532\u9534\u9536\u9537\u9538\u953C\u953E\u953F\u9542\u9535\u9544\u9545\u9546\u9549\u954C\u954E\u954F\u9552\u9553\u9554\u9556\u9557\u9558\u9559\u955B\u955E\u955F\u955D\u9561\u9562\u9564", 8, "\u956F\u9571\u9572\u9573\u953A\u77E7\u77EC\u96C9\u79D5\u79ED\u79E3\u79EB\u7A06\u5D47\u7A03\u7A02\u7A1E\u7A14"],
      ["f040", "\u9908", 4, "\u990E\u990F\u9911", 28, "\u992F", 26],
      ["f080", "\u994A", 9, "\u9956", 12, "\u9964\u9966\u9973\u9978\u9979\u997B\u997E\u9982\u9983\u9989\u7A39\u7A37\u7A51\u9ECF\u99A5\u7A70\u7688\u768E\u7693\u7699\u76A4\u74DE\u74E0\u752C\u9E20\u9E22\u9E28", 4, "\u9E32\u9E31\u9E36\u9E38\u9E37\u9E39\u9E3A\u9E3E\u9E41\u9E42\u9E44\u9E46\u9E47\u9E48\u9E49\u9E4B\u9E4C\u9E4E\u9E51\u9E55\u9E57\u9E5A\u9E5B\u9E5C\u9E5E\u9E63\u9E66", 6, "\u9E71\u9E6D\u9E73\u7592\u7594\u7596\u75A0\u759D\u75AC\u75A3\u75B3\u75B4\u75B8\u75C4\u75B1\u75B0\u75C3\u75C2\u75D6\u75CD\u75E3\u75E8\u75E6\u75E4\u75EB\u75E7\u7603\u75F1\u75FC\u75FF\u7610\u7600\u7605\u760C\u7617\u760A\u7625\u7618\u7615\u7619"],
      ["f140", "\u998C\u998E\u999A", 10, "\u99A6\u99A7\u99A9", 47],
      ["f180", "\u99D9", 32, "\u761B\u763C\u7622\u7620\u7640\u762D\u7630\u763F\u7635\u7643\u763E\u7633\u764D\u765E\u7654\u765C\u7656\u766B\u766F\u7FCA\u7AE6\u7A78\u7A79\u7A80\u7A86\u7A88\u7A95\u7AA6\u7AA0\u7AAC\u7AA8\u7AAD\u7AB3\u8864\u8869\u8872\u887D\u887F\u8882\u88A2\u88C6\u88B7\u88BC\u88C9\u88E2\u88CE\u88E3\u88E5\u88F1\u891A\u88FC\u88E8\u88FE\u88F0\u8921\u8919\u8913\u891B\u890A\u8934\u892B\u8936\u8941\u8966\u897B\u758B\u80E5\u76B2\u76B4\u77DC\u8012\u8014\u8016\u801C\u8020\u8022\u8025\u8026\u8027\u8029\u8028\u8031\u800B\u8035\u8043\u8046\u804D\u8052\u8069\u8071\u8983\u9878\u9880\u9883"],
      ["f240", "\u99FA", 62],
      ["f280", "\u9A39", 32, "\u9889\u988C\u988D\u988F\u9894\u989A\u989B\u989E\u989F\u98A1\u98A2\u98A5\u98A6\u864D\u8654\u866C\u866E\u867F\u867A\u867C\u867B\u86A8\u868D\u868B\u86AC\u869D\u86A7\u86A3\u86AA\u8693\u86A9\u86B6\u86C4\u86B5\u86CE\u86B0\u86BA\u86B1\u86AF\u86C9\u86CF\u86B4\u86E9\u86F1\u86F2\u86ED\u86F3\u86D0\u8713\u86DE\u86F4\u86DF\u86D8\u86D1\u8703\u8707\u86F8\u8708\u870A\u870D\u8709\u8723\u873B\u871E\u8725\u872E\u871A\u873E\u8748\u8734\u8731\u8729\u8737\u873F\u8782\u8722\u877D\u877E\u877B\u8760\u8770\u874C\u876E\u878B\u8753\u8763\u877C\u8764\u8759\u8765\u8793\u87AF\u87A8\u87D2"],
      ["f340", "\u9A5A", 17, "\u9A72\u9A83\u9A89\u9A8D\u9A8E\u9A94\u9A95\u9A99\u9AA6\u9AA9", 6, "\u9AB2\u9AB3\u9AB4\u9AB5\u9AB9\u9ABB\u9ABD\u9ABE\u9ABF\u9AC3\u9AC4\u9AC6", 4, "\u9ACD\u9ACE\u9ACF\u9AD0\u9AD2\u9AD4\u9AD5\u9AD6\u9AD7\u9AD9\u9ADA\u9ADB\u9ADC"],
      ["f380", "\u9ADD\u9ADE\u9AE0\u9AE2\u9AE3\u9AE4\u9AE5\u9AE7\u9AE8\u9AE9\u9AEA\u9AEC\u9AEE\u9AF0", 8, "\u9AFA\u9AFC", 6, "\u9B04\u9B05\u9B06\u87C6\u8788\u8785\u87AD\u8797\u8783\u87AB\u87E5\u87AC\u87B5\u87B3\u87CB\u87D3\u87BD\u87D1\u87C0\u87CA\u87DB\u87EA\u87E0\u87EE\u8816\u8813\u87FE\u880A\u881B\u8821\u8839\u883C\u7F36\u7F42\u7F44\u7F45\u8210\u7AFA\u7AFD\u7B08\u7B03\u7B04\u7B15\u7B0A\u7B2B\u7B0F\u7B47\u7B38\u7B2A\u7B19\u7B2E\u7B31\u7B20\u7B25\u7B24\u7B33\u7B3E\u7B1E\u7B58\u7B5A\u7B45\u7B75\u7B4C\u7B5D\u7B60\u7B6E\u7B7B\u7B62\u7B72\u7B71\u7B90\u7BA6\u7BA7\u7BB8\u7BAC\u7B9D\u7BA8\u7B85\u7BAA\u7B9C\u7BA2\u7BAB\u7BB4\u7BD1\u7BC1\u7BCC\u7BDD\u7BDA\u7BE5\u7BE6\u7BEA\u7C0C\u7BFE\u7BFC\u7C0F\u7C16\u7C0B"],
      ["f440", "\u9B07\u9B09", 5, "\u9B10\u9B11\u9B12\u9B14", 10, "\u9B20\u9B21\u9B22\u9B24", 10, "\u9B30\u9B31\u9B33", 7, "\u9B3D\u9B3E\u9B3F\u9B40\u9B46\u9B4A\u9B4B\u9B4C\u9B4E\u9B50\u9B52\u9B53\u9B55", 5],
      ["f480", "\u9B5B", 32, "\u7C1F\u7C2A\u7C26\u7C38\u7C41\u7C40\u81FE\u8201\u8202\u8204\u81EC\u8844\u8221\u8222\u8223\u822D\u822F\u8228\u822B\u8238\u823B\u8233\u8234\u823E\u8244\u8249\u824B\u824F\u825A\u825F\u8268\u887E\u8885\u8888\u88D8\u88DF\u895E\u7F9D\u7F9F\u7FA7\u7FAF\u7FB0\u7FB2\u7C7C\u6549\u7C91\u7C9D\u7C9C\u7C9E\u7CA2\u7CB2\u7CBC\u7CBD\u7CC1\u7CC7\u7CCC\u7CCD\u7CC8\u7CC5\u7CD7\u7CE8\u826E\u66A8\u7FBF\u7FCE\u7FD5\u7FE5\u7FE1\u7FE6\u7FE9\u7FEE\u7FF3\u7CF8\u7D77\u7DA6\u7DAE\u7E47\u7E9B\u9EB8\u9EB4\u8D73\u8D84\u8D94\u8D91\u8DB1\u8D67\u8D6D\u8C47\u8C49\u914A\u9150\u914E\u914F\u9164"],
      ["f540", "\u9B7C", 62],
      ["f580", "\u9BBB", 32, "\u9162\u9161\u9170\u9169\u916F\u917D\u917E\u9172\u9174\u9179\u918C\u9185\u9190\u918D\u9191\u91A2\u91A3\u91AA\u91AD\u91AE\u91AF\u91B5\u91B4\u91BA\u8C55\u9E7E\u8DB8\u8DEB\u8E05\u8E59\u8E69\u8DB5\u8DBF\u8DBC\u8DBA\u8DC4\u8DD6\u8DD7\u8DDA\u8DDE\u8DCE\u8DCF\u8DDB\u8DC6\u8DEC\u8DF7\u8DF8\u8DE3\u8DF9\u8DFB\u8DE4\u8E09\u8DFD\u8E14\u8E1D\u8E1F\u8E2C\u8E2E\u8E23\u8E2F\u8E3A\u8E40\u8E39\u8E35\u8E3D\u8E31\u8E49\u8E41\u8E42\u8E51\u8E52\u8E4A\u8E70\u8E76\u8E7C\u8E6F\u8E74\u8E85\u8E8F\u8E94\u8E90\u8E9C\u8E9E\u8C78\u8C82\u8C8A\u8C85\u8C98\u8C94\u659B\u89D6\u89DE\u89DA\u89DC"],
      ["f640", "\u9BDC", 62],
      ["f680", "\u9C1B", 32, "\u89E5\u89EB\u89EF\u8A3E\u8B26\u9753\u96E9\u96F3\u96EF\u9706\u9701\u9708\u970F\u970E\u972A\u972D\u9730\u973E\u9F80\u9F83\u9F85", 5, "\u9F8C\u9EFE\u9F0B\u9F0D\u96B9\u96BC\u96BD\u96CE\u96D2\u77BF\u96E0\u928E\u92AE\u92C8\u933E\u936A\u93CA\u938F\u943E\u946B\u9C7F\u9C82\u9C85\u9C86\u9C87\u9C88\u7A23\u9C8B\u9C8E\u9C90\u9C91\u9C92\u9C94\u9C95\u9C9A\u9C9B\u9C9E", 5, "\u9CA5", 4, "\u9CAB\u9CAD\u9CAE\u9CB0", 7, "\u9CBA\u9CBB\u9CBC\u9CBD\u9CC4\u9CC5\u9CC6\u9CC7\u9CCA\u9CCB"],
      ["f740", "\u9C3C", 62],
      ["f780", "\u9C7B\u9C7D\u9C7E\u9C80\u9C83\u9C84\u9C89\u9C8A\u9C8C\u9C8F\u9C93\u9C96\u9C97\u9C98\u9C99\u9C9D\u9CAA\u9CAC\u9CAF\u9CB9\u9CBE", 4, "\u9CC8\u9CC9\u9CD1\u9CD2\u9CDA\u9CDB\u9CE0\u9CE1\u9CCC", 4, "\u9CD3\u9CD4\u9CD5\u9CD7\u9CD8\u9CD9\u9CDC\u9CDD\u9CDF\u9CE2\u977C\u9785\u9791\u9792\u9794\u97AF\u97AB\u97A3\u97B2\u97B4\u9AB1\u9AB0\u9AB7\u9E58\u9AB6\u9ABA\u9ABC\u9AC1\u9AC0\u9AC5\u9AC2\u9ACB\u9ACC\u9AD1\u9B45\u9B43\u9B47\u9B49\u9B48\u9B4D\u9B51\u98E8\u990D\u992E\u9955\u9954\u9ADF\u9AE1\u9AE6\u9AEF\u9AEB\u9AFB\u9AED\u9AF9\u9B08\u9B0F\u9B13\u9B1F\u9B23\u9EBD\u9EBE\u7E3B\u9E82\u9E87\u9E88\u9E8B\u9E92\u93D6\u9E9D\u9E9F\u9EDB\u9EDC\u9EDD\u9EE0\u9EDF\u9EE2\u9EE9\u9EE7\u9EE5\u9EEA\u9EEF\u9F22\u9F2C\u9F2F\u9F39\u9F37\u9F3D\u9F3E\u9F44"],
      ["f840", "\u9CE3", 62],
      ["f880", "\u9D22", 32],
      ["f940", "\u9D43", 62],
      ["f980", "\u9D82", 32],
      ["fa40", "\u9DA3", 62],
      ["fa80", "\u9DE2", 32],
      ["fb40", "\u9E03", 27, "\u9E24\u9E27\u9E2E\u9E30\u9E34\u9E3B\u9E3C\u9E40\u9E4D\u9E50\u9E52\u9E53\u9E54\u9E56\u9E59\u9E5D\u9E5F\u9E60\u9E61\u9E62\u9E65\u9E6E\u9E6F\u9E72\u9E74", 9, "\u9E80"],
      ["fb80", "\u9E81\u9E83\u9E84\u9E85\u9E86\u9E89\u9E8A\u9E8C", 5, "\u9E94", 8, "\u9E9E\u9EA0", 5, "\u9EA7\u9EA8\u9EA9\u9EAA"],
      ["fc40", "\u9EAB", 8, "\u9EB5\u9EB6\u9EB7\u9EB9\u9EBA\u9EBC\u9EBF", 4, "\u9EC5\u9EC6\u9EC7\u9EC8\u9ECA\u9ECB\u9ECC\u9ED0\u9ED2\u9ED3\u9ED5\u9ED6\u9ED7\u9ED9\u9EDA\u9EDE\u9EE1\u9EE3\u9EE4\u9EE6\u9EE8\u9EEB\u9EEC\u9EED\u9EEE\u9EF0", 8, "\u9EFA\u9EFD\u9EFF", 6],
      ["fc80", "\u9F06", 4, "\u9F0C\u9F0F\u9F11\u9F12\u9F14\u9F15\u9F16\u9F18\u9F1A", 5, "\u9F21\u9F23", 8, "\u9F2D\u9F2E\u9F30\u9F31"],
      ["fd40", "\u9F32", 4, "\u9F38\u9F3A\u9F3C\u9F3F", 4, "\u9F45", 10, "\u9F52", 38],
      ["fd80", "\u9F79", 5, "\u9F81\u9F82\u9F8D", 11, "\u9F9C\u9F9D\u9F9E\u9FA1", 4, "\uF92C\uF979\uF995\uF9E7\uF9F1"],
      ["fe40", "\uFA0C\uFA0D\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA18\uFA1F\uFA20\uFA21\uFA23\uFA24\uFA27\uFA28\uFA29"]
    ];
  }
});

// node_modules/iconv-lite/encodings/tables/gbk-added.json
var require_gbk_added = __commonJS({
  "node_modules/iconv-lite/encodings/tables/gbk-added.json"(exports, module) {
    module.exports = [
      ["a140", "\uE4C6", 62],
      ["a180", "\uE505", 32],
      ["a240", "\uE526", 62],
      ["a280", "\uE565", 32],
      ["a2ab", "\uE766", 5],
      ["a2e3", "\u20AC\uE76D"],
      ["a2ef", "\uE76E\uE76F"],
      ["a2fd", "\uE770\uE771"],
      ["a340", "\uE586", 62],
      ["a380", "\uE5C5", 31, "\u3000"],
      ["a440", "\uE5E6", 62],
      ["a480", "\uE625", 32],
      ["a4f4", "\uE772", 10],
      ["a540", "\uE646", 62],
      ["a580", "\uE685", 32],
      ["a5f7", "\uE77D", 7],
      ["a640", "\uE6A6", 62],
      ["a680", "\uE6E5", 32],
      ["a6b9", "\uE785", 7],
      ["a6d9", "\uE78D", 6],
      ["a6ec", "\uE794\uE795"],
      ["a6f3", "\uE796"],
      ["a6f6", "\uE797", 8],
      ["a740", "\uE706", 62],
      ["a780", "\uE745", 32],
      ["a7c2", "\uE7A0", 14],
      ["a7f2", "\uE7AF", 12],
      ["a896", "\uE7BC", 10],
      ["a8bc", "\u1E3F"],
      ["a8bf", "\u01F9"],
      ["a8c1", "\uE7C9\uE7CA\uE7CB\uE7CC"],
      ["a8ea", "\uE7CD", 20],
      ["a958", "\uE7E2"],
      ["a95b", "\uE7E3"],
      ["a95d", "\uE7E4\uE7E5\uE7E6"],
      ["a989", "\u303E\u2FF0", 11],
      ["a997", "\uE7F4", 12],
      ["a9f0", "\uE801", 14],
      ["aaa1", "\uE000", 93],
      ["aba1", "\uE05E", 93],
      ["aca1", "\uE0BC", 93],
      ["ada1", "\uE11A", 93],
      ["aea1", "\uE178", 93],
      ["afa1", "\uE1D6", 93],
      ["d7fa", "\uE810", 4],
      ["f8a1", "\uE234", 93],
      ["f9a1", "\uE292", 93],
      ["faa1", "\uE2F0", 93],
      ["fba1", "\uE34E", 93],
      ["fca1", "\uE3AC", 93],
      ["fda1", "\uE40A", 93],
      ["fe50", "\u2E81\uE816\uE817\uE818\u2E84\u3473\u3447\u2E88\u2E8B\uE81E\u359E\u361A\u360E\u2E8C\u2E97\u396E\u3918\uE826\u39CF\u39DF\u3A73\u39D0\uE82B\uE82C\u3B4E\u3C6E\u3CE0\u2EA7\uE831\uE832\u2EAA\u4056\u415F\u2EAE\u4337\u2EB3\u2EB6\u2EB7\uE83B\u43B1\u43AC\u2EBB\u43DD\u44D6\u4661\u464C\uE843"],
      ["fe80", "\u4723\u4729\u477C\u478D\u2ECA\u4947\u497A\u497D\u4982\u4983\u4985\u4986\u499F\u499B\u49B7\u49B6\uE854\uE855\u4CA3\u4C9F\u4CA0\u4CA1\u4C77\u4CA2\u4D13", 6, "\u4DAE\uE864\uE468", 93],
      ["8135f437", "\uE7C7"]
    ];
  }
});

// node_modules/iconv-lite/encodings/tables/gb18030-ranges.json
var require_gb18030_ranges = __commonJS({
  "node_modules/iconv-lite/encodings/tables/gb18030-ranges.json"(exports, module) {
    module.exports = { uChars: [128, 165, 169, 178, 184, 216, 226, 235, 238, 244, 248, 251, 253, 258, 276, 284, 300, 325, 329, 334, 364, 463, 465, 467, 469, 471, 473, 475, 477, 506, 594, 610, 712, 716, 730, 930, 938, 962, 970, 1026, 1104, 1106, 8209, 8215, 8218, 8222, 8231, 8241, 8244, 8246, 8252, 8365, 8452, 8454, 8458, 8471, 8482, 8556, 8570, 8596, 8602, 8713, 8720, 8722, 8726, 8731, 8737, 8740, 8742, 8748, 8751, 8760, 8766, 8777, 8781, 8787, 8802, 8808, 8816, 8854, 8858, 8870, 8896, 8979, 9322, 9372, 9548, 9588, 9616, 9622, 9634, 9652, 9662, 9672, 9676, 9680, 9702, 9735, 9738, 9793, 9795, 11906, 11909, 11913, 11917, 11928, 11944, 11947, 11951, 11956, 11960, 11964, 11979, 12284, 12292, 12312, 12319, 12330, 12351, 12436, 12447, 12535, 12543, 12586, 12842, 12850, 12964, 13200, 13215, 13218, 13253, 13263, 13267, 13270, 13384, 13428, 13727, 13839, 13851, 14617, 14703, 14801, 14816, 14964, 15183, 15471, 15585, 16471, 16736, 17208, 17325, 17330, 17374, 17623, 17997, 18018, 18212, 18218, 18301, 18318, 18760, 18811, 18814, 18820, 18823, 18844, 18848, 18872, 19576, 19620, 19738, 19887, 40870, 59244, 59336, 59367, 59413, 59417, 59423, 59431, 59437, 59443, 59452, 59460, 59478, 59493, 63789, 63866, 63894, 63976, 63986, 64016, 64018, 64021, 64025, 64034, 64037, 64042, 65074, 65093, 65107, 65112, 65127, 65132, 65375, 65510, 65536], gbChars: [0, 36, 38, 45, 50, 81, 89, 95, 96, 100, 103, 104, 105, 109, 126, 133, 148, 172, 175, 179, 208, 306, 307, 308, 309, 310, 311, 312, 313, 341, 428, 443, 544, 545, 558, 741, 742, 749, 750, 805, 819, 820, 7922, 7924, 7925, 7927, 7934, 7943, 7944, 7945, 7950, 8062, 8148, 8149, 8152, 8164, 8174, 8236, 8240, 8262, 8264, 8374, 8380, 8381, 8384, 8388, 8390, 8392, 8393, 8394, 8396, 8401, 8406, 8416, 8419, 8424, 8437, 8439, 8445, 8482, 8485, 8496, 8521, 8603, 8936, 8946, 9046, 9050, 9063, 9066, 9076, 9092, 9100, 9108, 9111, 9113, 9131, 9162, 9164, 9218, 9219, 11329, 11331, 11334, 11336, 11346, 11361, 11363, 11366, 11370, 11372, 11375, 11389, 11682, 11686, 11687, 11692, 11694, 11714, 11716, 11723, 11725, 11730, 11736, 11982, 11989, 12102, 12336, 12348, 12350, 12384, 12393, 12395, 12397, 12510, 12553, 12851, 12962, 12973, 13738, 13823, 13919, 13933, 14080, 14298, 14585, 14698, 15583, 15847, 16318, 16434, 16438, 16481, 16729, 17102, 17122, 17315, 17320, 17402, 17418, 17859, 17909, 17911, 17915, 17916, 17936, 17939, 17961, 18664, 18703, 18814, 18962, 19043, 33469, 33470, 33471, 33484, 33485, 33490, 33497, 33501, 33505, 33513, 33520, 33536, 33550, 37845, 37921, 37948, 38029, 38038, 38064, 38065, 38066, 38069, 38075, 38076, 38078, 39108, 39109, 39113, 39114, 39115, 39116, 39265, 39394, 189e3] };
  }
});

// node_modules/iconv-lite/encodings/tables/cp949.json
var require_cp949 = __commonJS({
  "node_modules/iconv-lite/encodings/tables/cp949.json"(exports, module) {
    module.exports = [
      ["0", "\0", 127],
      ["8141", "\uAC02\uAC03\uAC05\uAC06\uAC0B", 4, "\uAC18\uAC1E\uAC1F\uAC21\uAC22\uAC23\uAC25", 6, "\uAC2E\uAC32\uAC33\uAC34"],
      ["8161", "\uAC35\uAC36\uAC37\uAC3A\uAC3B\uAC3D\uAC3E\uAC3F\uAC41", 9, "\uAC4C\uAC4E", 5, "\uAC55"],
      ["8181", "\uAC56\uAC57\uAC59\uAC5A\uAC5B\uAC5D", 18, "\uAC72\uAC73\uAC75\uAC76\uAC79\uAC7B", 4, "\uAC82\uAC87\uAC88\uAC8D\uAC8E\uAC8F\uAC91\uAC92\uAC93\uAC95", 6, "\uAC9E\uACA2", 5, "\uACAB\uACAD\uACAE\uACB1", 6, "\uACBA\uACBE\uACBF\uACC0\uACC2\uACC3\uACC5\uACC6\uACC7\uACC9\uACCA\uACCB\uACCD", 7, "\uACD6\uACD8", 7, "\uACE2\uACE3\uACE5\uACE6\uACE9\uACEB\uACED\uACEE\uACF2\uACF4\uACF7", 4, "\uACFE\uACFF\uAD01\uAD02\uAD03\uAD05\uAD07", 4, "\uAD0E\uAD10\uAD12\uAD13"],
      ["8241", "\uAD14\uAD15\uAD16\uAD17\uAD19\uAD1A\uAD1B\uAD1D\uAD1E\uAD1F\uAD21", 7, "\uAD2A\uAD2B\uAD2E", 5],
      ["8261", "\uAD36\uAD37\uAD39\uAD3A\uAD3B\uAD3D", 6, "\uAD46\uAD48\uAD4A", 5, "\uAD51\uAD52\uAD53\uAD55\uAD56\uAD57"],
      ["8281", "\uAD59", 7, "\uAD62\uAD64", 7, "\uAD6E\uAD6F\uAD71\uAD72\uAD77\uAD78\uAD79\uAD7A\uAD7E\uAD80\uAD83", 4, "\uAD8A\uAD8B\uAD8D\uAD8E\uAD8F\uAD91", 10, "\uAD9E", 5, "\uADA5", 17, "\uADB8", 7, "\uADC2\uADC3\uADC5\uADC6\uADC7\uADC9", 6, "\uADD2\uADD4", 7, "\uADDD\uADDE\uADDF\uADE1\uADE2\uADE3\uADE5", 18],
      ["8341", "\uADFA\uADFB\uADFD\uADFE\uAE02", 5, "\uAE0A\uAE0C\uAE0E", 5, "\uAE15", 7],
      ["8361", "\uAE1D", 18, "\uAE32\uAE33\uAE35\uAE36\uAE39\uAE3B\uAE3C"],
      ["8381", "\uAE3D\uAE3E\uAE3F\uAE42\uAE44\uAE47\uAE48\uAE49\uAE4B\uAE4F\uAE51\uAE52\uAE53\uAE55\uAE57", 4, "\uAE5E\uAE62\uAE63\uAE64\uAE66\uAE67\uAE6A\uAE6B\uAE6D\uAE6E\uAE6F\uAE71", 6, "\uAE7A\uAE7E", 5, "\uAE86", 5, "\uAE8D", 46, "\uAEBF\uAEC1\uAEC2\uAEC3\uAEC5", 6, "\uAECE\uAED2", 5, "\uAEDA\uAEDB\uAEDD", 8],
      ["8441", "\uAEE6\uAEE7\uAEE9\uAEEA\uAEEC\uAEEE", 5, "\uAEF5\uAEF6\uAEF7\uAEF9\uAEFA\uAEFB\uAEFD", 8],
      ["8461", "\uAF06\uAF09\uAF0A\uAF0B\uAF0C\uAF0E\uAF0F\uAF11", 18],
      ["8481", "\uAF24", 7, "\uAF2E\uAF2F\uAF31\uAF33\uAF35", 6, "\uAF3E\uAF40\uAF44\uAF45\uAF46\uAF47\uAF4A", 5, "\uAF51", 10, "\uAF5E", 5, "\uAF66", 18, "\uAF7A", 5, "\uAF81\uAF82\uAF83\uAF85\uAF86\uAF87\uAF89", 6, "\uAF92\uAF93\uAF94\uAF96", 5, "\uAF9D", 26, "\uAFBA\uAFBB\uAFBD\uAFBE"],
      ["8541", "\uAFBF\uAFC1", 5, "\uAFCA\uAFCC\uAFCF", 4, "\uAFD5", 6, "\uAFDD", 4],
      ["8561", "\uAFE2", 5, "\uAFEA", 5, "\uAFF2\uAFF3\uAFF5\uAFF6\uAFF7\uAFF9", 6, "\uB002\uB003"],
      ["8581", "\uB005", 6, "\uB00D\uB00E\uB00F\uB011\uB012\uB013\uB015", 6, "\uB01E", 9, "\uB029", 26, "\uB046\uB047\uB049\uB04B\uB04D\uB04F\uB050\uB051\uB052\uB056\uB058\uB05A\uB05B\uB05C\uB05E", 29, "\uB07E\uB07F\uB081\uB082\uB083\uB085", 6, "\uB08E\uB090\uB092", 5, "\uB09B\uB09D\uB09E\uB0A3\uB0A4"],
      ["8641", "\uB0A5\uB0A6\uB0A7\uB0AA\uB0B0\uB0B2\uB0B6\uB0B7\uB0B9\uB0BA\uB0BB\uB0BD", 6, "\uB0C6\uB0CA", 5, "\uB0D2"],
      ["8661", "\uB0D3\uB0D5\uB0D6\uB0D7\uB0D9", 6, "\uB0E1\uB0E2\uB0E3\uB0E4\uB0E6", 10],
      ["8681", "\uB0F1", 22, "\uB10A\uB10D\uB10E\uB10F\uB111\uB114\uB115\uB116\uB117\uB11A\uB11E", 4, "\uB126\uB127\uB129\uB12A\uB12B\uB12D", 6, "\uB136\uB13A", 5, "\uB142\uB143\uB145\uB146\uB147\uB149", 6, "\uB152\uB153\uB156\uB157\uB159\uB15A\uB15B\uB15D\uB15E\uB15F\uB161", 22, "\uB17A\uB17B\uB17D\uB17E\uB17F\uB181\uB183", 4, "\uB18A\uB18C\uB18E\uB18F\uB190\uB191\uB195\uB196\uB197\uB199\uB19A\uB19B\uB19D"],
      ["8741", "\uB19E", 9, "\uB1A9", 15],
      ["8761", "\uB1B9", 18, "\uB1CD\uB1CE\uB1CF\uB1D1\uB1D2\uB1D3\uB1D5"],
      ["8781", "\uB1D6", 5, "\uB1DE\uB1E0", 7, "\uB1EA\uB1EB\uB1ED\uB1EE\uB1EF\uB1F1", 7, "\uB1FA\uB1FC\uB1FE", 5, "\uB206\uB207\uB209\uB20A\uB20D", 6, "\uB216\uB218\uB21A", 5, "\uB221", 18, "\uB235", 6, "\uB23D", 26, "\uB259\uB25A\uB25B\uB25D\uB25E\uB25F\uB261", 6, "\uB26A", 4],
      ["8841", "\uB26F", 4, "\uB276", 5, "\uB27D", 6, "\uB286\uB287\uB288\uB28A", 4],
      ["8861", "\uB28F\uB292\uB293\uB295\uB296\uB297\uB29B", 4, "\uB2A2\uB2A4\uB2A7\uB2A8\uB2A9\uB2AB\uB2AD\uB2AE\uB2AF\uB2B1\uB2B2\uB2B3\uB2B5\uB2B6\uB2B7"],
      ["8881", "\uB2B8", 15, "\uB2CA\uB2CB\uB2CD\uB2CE\uB2CF\uB2D1\uB2D3", 4, "\uB2DA\uB2DC\uB2DE\uB2DF\uB2E0\uB2E1\uB2E3\uB2E7\uB2E9\uB2EA\uB2F0\uB2F1\uB2F2\uB2F6\uB2FC\uB2FD\uB2FE\uB302\uB303\uB305\uB306\uB307\uB309", 6, "\uB312\uB316", 5, "\uB31D", 54, "\uB357\uB359\uB35A\uB35D\uB360\uB361\uB362\uB363"],
      ["8941", "\uB366\uB368\uB36A\uB36C\uB36D\uB36F\uB372\uB373\uB375\uB376\uB377\uB379", 6, "\uB382\uB386", 5, "\uB38D"],
      ["8961", "\uB38E\uB38F\uB391\uB392\uB393\uB395", 10, "\uB3A2", 5, "\uB3A9\uB3AA\uB3AB\uB3AD"],
      ["8981", "\uB3AE", 21, "\uB3C6\uB3C7\uB3C9\uB3CA\uB3CD\uB3CF\uB3D1\uB3D2\uB3D3\uB3D6\uB3D8\uB3DA\uB3DC\uB3DE\uB3DF\uB3E1\uB3E2\uB3E3\uB3E5\uB3E6\uB3E7\uB3E9", 18, "\uB3FD", 18, "\uB411", 6, "\uB419\uB41A\uB41B\uB41D\uB41E\uB41F\uB421", 6, "\uB42A\uB42C", 7, "\uB435", 15],
      ["8a41", "\uB445", 10, "\uB452\uB453\uB455\uB456\uB457\uB459", 6, "\uB462\uB464\uB466"],
      ["8a61", "\uB467", 4, "\uB46D", 18, "\uB481\uB482"],
      ["8a81", "\uB483", 4, "\uB489", 19, "\uB49E", 5, "\uB4A5\uB4A6\uB4A7\uB4A9\uB4AA\uB4AB\uB4AD", 7, "\uB4B6\uB4B8\uB4BA", 5, "\uB4C1\uB4C2\uB4C3\uB4C5\uB4C6\uB4C7\uB4C9", 6, "\uB4D1\uB4D2\uB4D3\uB4D4\uB4D6", 5, "\uB4DE\uB4DF\uB4E1\uB4E2\uB4E5\uB4E7", 4, "\uB4EE\uB4F0\uB4F2", 5, "\uB4F9", 26, "\uB516\uB517\uB519\uB51A\uB51D"],
      ["8b41", "\uB51E", 5, "\uB526\uB52B", 4, "\uB532\uB533\uB535\uB536\uB537\uB539", 6, "\uB542\uB546"],
      ["8b61", "\uB547\uB548\uB549\uB54A\uB54E\uB54F\uB551\uB552\uB553\uB555", 6, "\uB55E\uB562", 8],
      ["8b81", "\uB56B", 52, "\uB5A2\uB5A3\uB5A5\uB5A6\uB5A7\uB5A9\uB5AC\uB5AD\uB5AE\uB5AF\uB5B2\uB5B6", 4, "\uB5BE\uB5BF\uB5C1\uB5C2\uB5C3\uB5C5", 6, "\uB5CE\uB5D2", 5, "\uB5D9", 18, "\uB5ED", 18],
      ["8c41", "\uB600", 15, "\uB612\uB613\uB615\uB616\uB617\uB619", 4],
      ["8c61", "\uB61E", 6, "\uB626", 5, "\uB62D", 6, "\uB635", 5],
      ["8c81", "\uB63B", 12, "\uB649", 26, "\uB665\uB666\uB667\uB669", 50, "\uB69E\uB69F\uB6A1\uB6A2\uB6A3\uB6A5", 5, "\uB6AD\uB6AE\uB6AF\uB6B0\uB6B2", 16],
      ["8d41", "\uB6C3", 16, "\uB6D5", 8],
      ["8d61", "\uB6DE", 17, "\uB6F1\uB6F2\uB6F3\uB6F5\uB6F6\uB6F7\uB6F9\uB6FA"],
      ["8d81", "\uB6FB", 4, "\uB702\uB703\uB704\uB706", 33, "\uB72A\uB72B\uB72D\uB72E\uB731", 6, "\uB73A\uB73C", 7, "\uB745\uB746\uB747\uB749\uB74A\uB74B\uB74D", 6, "\uB756", 9, "\uB761\uB762\uB763\uB765\uB766\uB767\uB769", 6, "\uB772\uB774\uB776", 5, "\uB77E\uB77F\uB781\uB782\uB783\uB785", 6, "\uB78E\uB793\uB794\uB795\uB79A\uB79B\uB79D\uB79E"],
      ["8e41", "\uB79F\uB7A1", 6, "\uB7AA\uB7AE", 5, "\uB7B6\uB7B7\uB7B9", 8],
      ["8e61", "\uB7C2", 4, "\uB7C8\uB7CA", 19],
      ["8e81", "\uB7DE", 13, "\uB7EE\uB7EF\uB7F1\uB7F2\uB7F3\uB7F5", 6, "\uB7FE\uB802", 4, "\uB80A\uB80B\uB80D\uB80E\uB80F\uB811", 6, "\uB81A\uB81C\uB81E", 5, "\uB826\uB827\uB829\uB82A\uB82B\uB82D", 6, "\uB836\uB83A", 5, "\uB841\uB842\uB843\uB845", 11, "\uB852\uB854", 7, "\uB85E\uB85F\uB861\uB862\uB863\uB865", 6, "\uB86E\uB870\uB872", 5, "\uB879\uB87A\uB87B\uB87D", 7],
      ["8f41", "\uB885", 7, "\uB88E", 17],
      ["8f61", "\uB8A0", 7, "\uB8A9", 6, "\uB8B1\uB8B2\uB8B3\uB8B5\uB8B6\uB8B7\uB8B9", 4],
      ["8f81", "\uB8BE\uB8BF\uB8C2\uB8C4\uB8C6", 5, "\uB8CD\uB8CE\uB8CF\uB8D1\uB8D2\uB8D3\uB8D5", 7, "\uB8DE\uB8E0\uB8E2", 5, "\uB8EA\uB8EB\uB8ED\uB8EE\uB8EF\uB8F1", 6, "\uB8FA\uB8FC\uB8FE", 5, "\uB905", 18, "\uB919", 6, "\uB921", 26, "\uB93E\uB93F\uB941\uB942\uB943\uB945", 6, "\uB94D\uB94E\uB950\uB952", 5],
      ["9041", "\uB95A\uB95B\uB95D\uB95E\uB95F\uB961", 6, "\uB96A\uB96C\uB96E", 5, "\uB976\uB977\uB979\uB97A\uB97B\uB97D"],
      ["9061", "\uB97E", 5, "\uB986\uB988\uB98B\uB98C\uB98F", 15],
      ["9081", "\uB99F", 12, "\uB9AE\uB9AF\uB9B1\uB9B2\uB9B3\uB9B5", 6, "\uB9BE\uB9C0\uB9C2", 5, "\uB9CA\uB9CB\uB9CD\uB9D3", 4, "\uB9DA\uB9DC\uB9DF\uB9E0\uB9E2\uB9E6\uB9E7\uB9E9\uB9EA\uB9EB\uB9ED", 6, "\uB9F6\uB9FB", 4, "\uBA02", 5, "\uBA09", 11, "\uBA16", 33, "\uBA3A\uBA3B\uBA3D\uBA3E\uBA3F\uBA41\uBA43\uBA44\uBA45\uBA46"],
      ["9141", "\uBA47\uBA4A\uBA4C\uBA4F\uBA50\uBA51\uBA52\uBA56\uBA57\uBA59\uBA5A\uBA5B\uBA5D", 6, "\uBA66\uBA6A", 5],
      ["9161", "\uBA72\uBA73\uBA75\uBA76\uBA77\uBA79", 9, "\uBA86\uBA88\uBA89\uBA8A\uBA8B\uBA8D", 5],
      ["9181", "\uBA93", 20, "\uBAAA\uBAAD\uBAAE\uBAAF\uBAB1\uBAB3", 4, "\uBABA\uBABC\uBABE", 5, "\uBAC5\uBAC6\uBAC7\uBAC9", 14, "\uBADA", 33, "\uBAFD\uBAFE\uBAFF\uBB01\uBB02\uBB03\uBB05", 7, "\uBB0E\uBB10\uBB12", 5, "\uBB19\uBB1A\uBB1B\uBB1D\uBB1E\uBB1F\uBB21", 6],
      ["9241", "\uBB28\uBB2A\uBB2C", 7, "\uBB37\uBB39\uBB3A\uBB3F", 4, "\uBB46\uBB48\uBB4A\uBB4B\uBB4C\uBB4E\uBB51\uBB52"],
      ["9261", "\uBB53\uBB55\uBB56\uBB57\uBB59", 7, "\uBB62\uBB64", 7, "\uBB6D", 4],
      ["9281", "\uBB72", 21, "\uBB89\uBB8A\uBB8B\uBB8D\uBB8E\uBB8F\uBB91", 18, "\uBBA5\uBBA6\uBBA7\uBBA9\uBBAA\uBBAB\uBBAD", 6, "\uBBB5\uBBB6\uBBB8", 7, "\uBBC1\uBBC2\uBBC3\uBBC5\uBBC6\uBBC7\uBBC9", 6, "\uBBD1\uBBD2\uBBD4", 35, "\uBBFA\uBBFB\uBBFD\uBBFE\uBC01"],
      ["9341", "\uBC03", 4, "\uBC0A\uBC0E\uBC10\uBC12\uBC13\uBC19\uBC1A\uBC20\uBC21\uBC22\uBC23\uBC26\uBC28\uBC2A\uBC2B\uBC2C\uBC2E\uBC2F\uBC32\uBC33\uBC35"],
      ["9361", "\uBC36\uBC37\uBC39", 6, "\uBC42\uBC46\uBC47\uBC48\uBC4A\uBC4B\uBC4E\uBC4F\uBC51", 8],
      ["9381", "\uBC5A\uBC5B\uBC5C\uBC5E", 37, "\uBC86\uBC87\uBC89\uBC8A\uBC8D\uBC8F", 4, "\uBC96\uBC98\uBC9B", 4, "\uBCA2\uBCA3\uBCA5\uBCA6\uBCA9", 6, "\uBCB2\uBCB6", 5, "\uBCBE\uBCBF\uBCC1\uBCC2\uBCC3\uBCC5", 7, "\uBCCE\uBCD2\uBCD3\uBCD4\uBCD6\uBCD7\uBCD9\uBCDA\uBCDB\uBCDD", 22, "\uBCF7\uBCF9\uBCFA\uBCFB\uBCFD"],
      ["9441", "\uBCFE", 5, "\uBD06\uBD08\uBD0A", 5, "\uBD11\uBD12\uBD13\uBD15", 8],
      ["9461", "\uBD1E", 5, "\uBD25", 6, "\uBD2D", 12],
      ["9481", "\uBD3A", 5, "\uBD41", 6, "\uBD4A\uBD4B\uBD4D\uBD4E\uBD4F\uBD51", 6, "\uBD5A", 9, "\uBD65\uBD66\uBD67\uBD69", 22, "\uBD82\uBD83\uBD85\uBD86\uBD8B", 4, "\uBD92\uBD94\uBD96\uBD97\uBD98\uBD9B\uBD9D", 6, "\uBDA5", 10, "\uBDB1", 6, "\uBDB9", 24],
      ["9541", "\uBDD2\uBDD3\uBDD6\uBDD7\uBDD9\uBDDA\uBDDB\uBDDD", 11, "\uBDEA", 5, "\uBDF1"],
      ["9561", "\uBDF2\uBDF3\uBDF5\uBDF6\uBDF7\uBDF9", 6, "\uBE01\uBE02\uBE04\uBE06", 5, "\uBE0E\uBE0F\uBE11\uBE12\uBE13"],
      ["9581", "\uBE15", 6, "\uBE1E\uBE20", 35, "\uBE46\uBE47\uBE49\uBE4A\uBE4B\uBE4D\uBE4F", 4, "\uBE56\uBE58\uBE5C\uBE5D\uBE5E\uBE5F\uBE62\uBE63\uBE65\uBE66\uBE67\uBE69\uBE6B", 4, "\uBE72\uBE76", 4, "\uBE7E\uBE7F\uBE81\uBE82\uBE83\uBE85", 6, "\uBE8E\uBE92", 5, "\uBE9A", 13, "\uBEA9", 14],
      ["9641", "\uBEB8", 23, "\uBED2\uBED3"],
      ["9661", "\uBED5\uBED6\uBED9", 6, "\uBEE1\uBEE2\uBEE6", 5, "\uBEED", 8],
      ["9681", "\uBEF6", 10, "\uBF02", 5, "\uBF0A", 13, "\uBF1A\uBF1E", 33, "\uBF42\uBF43\uBF45\uBF46\uBF47\uBF49", 6, "\uBF52\uBF53\uBF54\uBF56", 44],
      ["9741", "\uBF83", 16, "\uBF95", 8],
      ["9761", "\uBF9E", 17, "\uBFB1", 7],
      ["9781", "\uBFB9", 11, "\uBFC6", 5, "\uBFCE\uBFCF\uBFD1\uBFD2\uBFD3\uBFD5", 6, "\uBFDD\uBFDE\uBFE0\uBFE2", 89, "\uC03D\uC03E\uC03F"],
      ["9841", "\uC040", 16, "\uC052", 5, "\uC059\uC05A\uC05B"],
      ["9861", "\uC05D\uC05E\uC05F\uC061", 6, "\uC06A", 15],
      ["9881", "\uC07A", 21, "\uC092\uC093\uC095\uC096\uC097\uC099", 6, "\uC0A2\uC0A4\uC0A6", 5, "\uC0AE\uC0B1\uC0B2\uC0B7", 4, "\uC0BE\uC0C2\uC0C3\uC0C4\uC0C6\uC0C7\uC0CA\uC0CB\uC0CD\uC0CE\uC0CF\uC0D1", 6, "\uC0DA\uC0DE", 5, "\uC0E6\uC0E7\uC0E9\uC0EA\uC0EB\uC0ED", 6, "\uC0F6\uC0F8\uC0FA", 5, "\uC101\uC102\uC103\uC105\uC106\uC107\uC109", 6, "\uC111\uC112\uC113\uC114\uC116", 5, "\uC121\uC122\uC125\uC128\uC129\uC12A\uC12B\uC12E"],
      ["9941", "\uC132\uC133\uC134\uC135\uC137\uC13A\uC13B\uC13D\uC13E\uC13F\uC141", 6, "\uC14A\uC14E", 5, "\uC156\uC157"],
      ["9961", "\uC159\uC15A\uC15B\uC15D", 6, "\uC166\uC16A", 5, "\uC171\uC172\uC173\uC175\uC176\uC177\uC179\uC17A\uC17B"],
      ["9981", "\uC17C", 8, "\uC186", 5, "\uC18F\uC191\uC192\uC193\uC195\uC197", 4, "\uC19E\uC1A0\uC1A2\uC1A3\uC1A4\uC1A6\uC1A7\uC1AA\uC1AB\uC1AD\uC1AE\uC1AF\uC1B1", 11, "\uC1BE", 5, "\uC1C5\uC1C6\uC1C7\uC1C9\uC1CA\uC1CB\uC1CD", 6, "\uC1D5\uC1D6\uC1D9", 6, "\uC1E1\uC1E2\uC1E3\uC1E5\uC1E6\uC1E7\uC1E9", 6, "\uC1F2\uC1F4", 7, "\uC1FE\uC1FF\uC201\uC202\uC203\uC205", 6, "\uC20E\uC210\uC212", 5, "\uC21A\uC21B\uC21D\uC21E\uC221\uC222\uC223"],
      ["9a41", "\uC224\uC225\uC226\uC227\uC22A\uC22C\uC22E\uC230\uC233\uC235", 16],
      ["9a61", "\uC246\uC247\uC249", 6, "\uC252\uC253\uC255\uC256\uC257\uC259", 6, "\uC261\uC262\uC263\uC264\uC266"],
      ["9a81", "\uC267", 4, "\uC26E\uC26F\uC271\uC272\uC273\uC275", 6, "\uC27E\uC280\uC282", 5, "\uC28A", 5, "\uC291", 6, "\uC299\uC29A\uC29C\uC29E", 5, "\uC2A6\uC2A7\uC2A9\uC2AA\uC2AB\uC2AE", 5, "\uC2B6\uC2B8\uC2BA", 33, "\uC2DE\uC2DF\uC2E1\uC2E2\uC2E5", 5, "\uC2EE\uC2F0\uC2F2\uC2F3\uC2F4\uC2F5\uC2F7\uC2FA\uC2FD\uC2FE\uC2FF\uC301", 6, "\uC30A\uC30B\uC30E\uC30F"],
      ["9b41", "\uC310\uC311\uC312\uC316\uC317\uC319\uC31A\uC31B\uC31D", 6, "\uC326\uC327\uC32A", 8],
      ["9b61", "\uC333", 17, "\uC346", 7],
      ["9b81", "\uC34E", 25, "\uC36A\uC36B\uC36D\uC36E\uC36F\uC371\uC373", 4, "\uC37A\uC37B\uC37E", 5, "\uC385\uC386\uC387\uC389\uC38A\uC38B\uC38D", 50, "\uC3C1", 22, "\uC3DA"],
      ["9c41", "\uC3DB\uC3DD\uC3DE\uC3E1\uC3E3", 4, "\uC3EA\uC3EB\uC3EC\uC3EE", 5, "\uC3F6\uC3F7\uC3F9", 5],
      ["9c61", "\uC3FF", 8, "\uC409", 6, "\uC411", 9],
      ["9c81", "\uC41B", 8, "\uC425", 6, "\uC42D\uC42E\uC42F\uC431\uC432\uC433\uC435", 6, "\uC43E", 9, "\uC449", 26, "\uC466\uC467\uC469\uC46A\uC46B\uC46D", 6, "\uC476\uC477\uC478\uC47A", 5, "\uC481", 18, "\uC495", 6, "\uC49D", 12],
      ["9d41", "\uC4AA", 13, "\uC4B9\uC4BA\uC4BB\uC4BD", 8],
      ["9d61", "\uC4C6", 25],
      ["9d81", "\uC4E0", 8, "\uC4EA", 5, "\uC4F2\uC4F3\uC4F5\uC4F6\uC4F7\uC4F9\uC4FB\uC4FC\uC4FD\uC4FE\uC502", 9, "\uC50D\uC50E\uC50F\uC511\uC512\uC513\uC515", 6, "\uC51D", 10, "\uC52A\uC52B\uC52D\uC52E\uC52F\uC531", 6, "\uC53A\uC53C\uC53E", 5, "\uC546\uC547\uC54B\uC54F\uC550\uC551\uC552\uC556\uC55A\uC55B\uC55C\uC55F\uC562\uC563\uC565\uC566\uC567\uC569", 6, "\uC572\uC576", 5, "\uC57E\uC57F\uC581\uC582\uC583\uC585\uC586\uC588\uC589\uC58A\uC58B\uC58E\uC590\uC592\uC593\uC594"],
      ["9e41", "\uC596\uC599\uC59A\uC59B\uC59D\uC59E\uC59F\uC5A1", 7, "\uC5AA", 9, "\uC5B6"],
      ["9e61", "\uC5B7\uC5BA\uC5BF", 4, "\uC5CB\uC5CD\uC5CF\uC5D2\uC5D3\uC5D5\uC5D6\uC5D7\uC5D9", 6, "\uC5E2\uC5E4\uC5E6\uC5E7"],
      ["9e81", "\uC5E8\uC5E9\uC5EA\uC5EB\uC5EF\uC5F1\uC5F2\uC5F3\uC5F5\uC5F8\uC5F9\uC5FA\uC5FB\uC602\uC603\uC604\uC609\uC60A\uC60B\uC60D\uC60E\uC60F\uC611", 6, "\uC61A\uC61D", 6, "\uC626\uC627\uC629\uC62A\uC62B\uC62F\uC631\uC632\uC636\uC638\uC63A\uC63C\uC63D\uC63E\uC63F\uC642\uC643\uC645\uC646\uC647\uC649", 6, "\uC652\uC656", 5, "\uC65E\uC65F\uC661", 10, "\uC66D\uC66E\uC670\uC672", 5, "\uC67A\uC67B\uC67D\uC67E\uC67F\uC681", 6, "\uC68A\uC68C\uC68E", 5, "\uC696\uC697\uC699\uC69A\uC69B\uC69D", 6, "\uC6A6"],
      ["9f41", "\uC6A8\uC6AA", 5, "\uC6B2\uC6B3\uC6B5\uC6B6\uC6B7\uC6BB", 4, "\uC6C2\uC6C4\uC6C6", 5, "\uC6CE"],
      ["9f61", "\uC6CF\uC6D1\uC6D2\uC6D3\uC6D5", 6, "\uC6DE\uC6DF\uC6E2", 5, "\uC6EA\uC6EB\uC6ED\uC6EE\uC6EF\uC6F1\uC6F2"],
      ["9f81", "\uC6F3", 4, "\uC6FA\uC6FB\uC6FC\uC6FE", 5, "\uC706\uC707\uC709\uC70A\uC70B\uC70D", 6, "\uC716\uC718\uC71A", 5, "\uC722\uC723\uC725\uC726\uC727\uC729", 6, "\uC732\uC734\uC736\uC738\uC739\uC73A\uC73B\uC73E\uC73F\uC741\uC742\uC743\uC745", 4, "\uC74B\uC74E\uC750\uC759\uC75A\uC75B\uC75D\uC75E\uC75F\uC761", 6, "\uC769\uC76A\uC76C", 7, "\uC776\uC777\uC779\uC77A\uC77B\uC77F\uC780\uC781\uC782\uC786\uC78B\uC78C\uC78D\uC78F\uC792\uC793\uC795\uC799\uC79B", 4, "\uC7A2\uC7A7", 4, "\uC7AE\uC7AF\uC7B1\uC7B2\uC7B3\uC7B5\uC7B6\uC7B7"],
      ["a041", "\uC7B8\uC7B9\uC7BA\uC7BB\uC7BE\uC7C2", 5, "\uC7CA\uC7CB\uC7CD\uC7CF\uC7D1", 6, "\uC7D9\uC7DA\uC7DB\uC7DC"],
      ["a061", "\uC7DE", 5, "\uC7E5\uC7E6\uC7E7\uC7E9\uC7EA\uC7EB\uC7ED", 13],
      ["a081", "\uC7FB", 4, "\uC802\uC803\uC805\uC806\uC807\uC809\uC80B", 4, "\uC812\uC814\uC817", 4, "\uC81E\uC81F\uC821\uC822\uC823\uC825", 6, "\uC82E\uC830\uC832", 5, "\uC839\uC83A\uC83B\uC83D\uC83E\uC83F\uC841", 6, "\uC84A\uC84B\uC84E", 5, "\uC855", 26, "\uC872\uC873\uC875\uC876\uC877\uC879\uC87B", 4, "\uC882\uC884\uC888\uC889\uC88A\uC88E", 5, "\uC895", 7, "\uC89E\uC8A0\uC8A2\uC8A3\uC8A4"],
      ["a141", "\uC8A5\uC8A6\uC8A7\uC8A9", 18, "\uC8BE\uC8BF\uC8C0\uC8C1"],
      ["a161", "\uC8C2\uC8C3\uC8C5\uC8C6\uC8C7\uC8C9\uC8CA\uC8CB\uC8CD", 6, "\uC8D6\uC8D8\uC8DA", 5, "\uC8E2\uC8E3\uC8E5"],
      ["a181", "\uC8E6", 14, "\uC8F6", 5, "\uC8FE\uC8FF\uC901\uC902\uC903\uC907", 4, "\uC90E\u3000\u3001\u3002\xB7\u2025\u2026\xA8\u3003\xAD\u2015\u2225\uFF3C\u223C\u2018\u2019\u201C\u201D\u3014\u3015\u3008", 9, "\xB1\xD7\xF7\u2260\u2264\u2265\u221E\u2234\xB0\u2032\u2033\u2103\u212B\uFFE0\uFFE1\uFFE5\u2642\u2640\u2220\u22A5\u2312\u2202\u2207\u2261\u2252\xA7\u203B\u2606\u2605\u25CB\u25CF\u25CE\u25C7\u25C6\u25A1\u25A0\u25B3\u25B2\u25BD\u25BC\u2192\u2190\u2191\u2193\u2194\u3013\u226A\u226B\u221A\u223D\u221D\u2235\u222B\u222C\u2208\u220B\u2286\u2287\u2282\u2283\u222A\u2229\u2227\u2228\uFFE2"],
      ["a241", "\uC910\uC912", 5, "\uC919", 18],
      ["a261", "\uC92D", 6, "\uC935", 18],
      ["a281", "\uC948", 7, "\uC952\uC953\uC955\uC956\uC957\uC959", 6, "\uC962\uC964", 7, "\uC96D\uC96E\uC96F\u21D2\u21D4\u2200\u2203\xB4\uFF5E\u02C7\u02D8\u02DD\u02DA\u02D9\xB8\u02DB\xA1\xBF\u02D0\u222E\u2211\u220F\xA4\u2109\u2030\u25C1\u25C0\u25B7\u25B6\u2664\u2660\u2661\u2665\u2667\u2663\u2299\u25C8\u25A3\u25D0\u25D1\u2592\u25A4\u25A5\u25A8\u25A7\u25A6\u25A9\u2668\u260F\u260E\u261C\u261E\xB6\u2020\u2021\u2195\u2197\u2199\u2196\u2198\u266D\u2669\u266A\u266C\u327F\u321C\u2116\u33C7\u2122\u33C2\u33D8\u2121\u20AC\xAE"],
      ["a341", "\uC971\uC972\uC973\uC975", 6, "\uC97D", 10, "\uC98A\uC98B\uC98D\uC98E\uC98F"],
      ["a361", "\uC991", 6, "\uC99A\uC99C\uC99E", 16],
      ["a381", "\uC9AF", 16, "\uC9C2\uC9C3\uC9C5\uC9C6\uC9C9\uC9CB", 4, "\uC9D2\uC9D4\uC9D7\uC9D8\uC9DB\uFF01", 58, "\uFFE6\uFF3D", 32, "\uFFE3"],
      ["a441", "\uC9DE\uC9DF\uC9E1\uC9E3\uC9E5\uC9E6\uC9E8\uC9E9\uC9EA\uC9EB\uC9EE\uC9F2", 5, "\uC9FA\uC9FB\uC9FD\uC9FE\uC9FF\uCA01\uCA02\uCA03\uCA04"],
      ["a461", "\uCA05\uCA06\uCA07\uCA0A\uCA0E", 5, "\uCA15\uCA16\uCA17\uCA19", 12],
      ["a481", "\uCA26\uCA27\uCA28\uCA2A", 28, "\u3131", 93],
      ["a541", "\uCA47", 4, "\uCA4E\uCA4F\uCA51\uCA52\uCA53\uCA55", 6, "\uCA5E\uCA62", 5, "\uCA69\uCA6A"],
      ["a561", "\uCA6B", 17, "\uCA7E", 5, "\uCA85\uCA86"],
      ["a581", "\uCA87", 16, "\uCA99", 14, "\u2170", 9],
      ["a5b0", "\u2160", 9],
      ["a5c1", "\u0391", 16, "\u03A3", 6],
      ["a5e1", "\u03B1", 16, "\u03C3", 6],
      ["a641", "\uCAA8", 19, "\uCABE\uCABF\uCAC1\uCAC2\uCAC3\uCAC5"],
      ["a661", "\uCAC6", 5, "\uCACE\uCAD0\uCAD2\uCAD4\uCAD5\uCAD6\uCAD7\uCADA", 5, "\uCAE1", 6],
      ["a681", "\uCAE8\uCAE9\uCAEA\uCAEB\uCAED", 6, "\uCAF5", 18, "\uCB09\uCB0A\u2500\u2502\u250C\u2510\u2518\u2514\u251C\u252C\u2524\u2534\u253C\u2501\u2503\u250F\u2513\u251B\u2517\u2523\u2533\u252B\u253B\u254B\u2520\u252F\u2528\u2537\u253F\u251D\u2530\u2525\u2538\u2542\u2512\u2511\u251A\u2519\u2516\u2515\u250E\u250D\u251E\u251F\u2521\u2522\u2526\u2527\u2529\u252A\u252D\u252E\u2531\u2532\u2535\u2536\u2539\u253A\u253D\u253E\u2540\u2541\u2543", 7],
      ["a741", "\uCB0B", 4, "\uCB11\uCB12\uCB13\uCB15\uCB16\uCB17\uCB19", 6, "\uCB22", 7],
      ["a761", "\uCB2A", 22, "\uCB42\uCB43\uCB44"],
      ["a781", "\uCB45\uCB46\uCB47\uCB4A\uCB4B\uCB4D\uCB4E\uCB4F\uCB51", 6, "\uCB5A\uCB5B\uCB5C\uCB5E", 5, "\uCB65", 7, "\u3395\u3396\u3397\u2113\u3398\u33C4\u33A3\u33A4\u33A5\u33A6\u3399", 9, "\u33CA\u338D\u338E\u338F\u33CF\u3388\u3389\u33C8\u33A7\u33A8\u33B0", 9, "\u3380", 4, "\u33BA", 5, "\u3390", 4, "\u2126\u33C0\u33C1\u338A\u338B\u338C\u33D6\u33C5\u33AD\u33AE\u33AF\u33DB\u33A9\u33AA\u33AB\u33AC\u33DD\u33D0\u33D3\u33C3\u33C9\u33DC\u33C6"],
      ["a841", "\uCB6D", 10, "\uCB7A", 14],
      ["a861", "\uCB89", 18, "\uCB9D", 6],
      ["a881", "\uCBA4", 19, "\uCBB9", 11, "\xC6\xD0\xAA\u0126"],
      ["a8a6", "\u0132"],
      ["a8a8", "\u013F\u0141\xD8\u0152\xBA\xDE\u0166\u014A"],
      ["a8b1", "\u3260", 27, "\u24D0", 25, "\u2460", 14, "\xBD\u2153\u2154\xBC\xBE\u215B\u215C\u215D\u215E"],
      ["a941", "\uCBC5", 14, "\uCBD5", 10],
      ["a961", "\uCBE0\uCBE1\uCBE2\uCBE3\uCBE5\uCBE6\uCBE8\uCBEA", 18],
      ["a981", "\uCBFD", 14, "\uCC0E\uCC0F\uCC11\uCC12\uCC13\uCC15", 6, "\uCC1E\uCC1F\uCC20\uCC23\uCC24\xE6\u0111\xF0\u0127\u0131\u0133\u0138\u0140\u0142\xF8\u0153\xDF\xFE\u0167\u014B\u0149\u3200", 27, "\u249C", 25, "\u2474", 14, "\xB9\xB2\xB3\u2074\u207F\u2081\u2082\u2083\u2084"],
      ["aa41", "\uCC25\uCC26\uCC2A\uCC2B\uCC2D\uCC2F\uCC31", 6, "\uCC3A\uCC3F", 4, "\uCC46\uCC47\uCC49\uCC4A\uCC4B\uCC4D\uCC4E"],
      ["aa61", "\uCC4F", 4, "\uCC56\uCC5A", 5, "\uCC61\uCC62\uCC63\uCC65\uCC67\uCC69", 6, "\uCC71\uCC72"],
      ["aa81", "\uCC73\uCC74\uCC76", 29, "\u3041", 82],
      ["ab41", "\uCC94\uCC95\uCC96\uCC97\uCC9A\uCC9B\uCC9D\uCC9E\uCC9F\uCCA1", 6, "\uCCAA\uCCAE", 5, "\uCCB6\uCCB7\uCCB9"],
      ["ab61", "\uCCBA\uCCBB\uCCBD", 6, "\uCCC6\uCCC8\uCCCA", 5, "\uCCD1\uCCD2\uCCD3\uCCD5", 5],
      ["ab81", "\uCCDB", 8, "\uCCE5", 6, "\uCCED\uCCEE\uCCEF\uCCF1", 12, "\u30A1", 85],
      ["ac41", "\uCCFE\uCCFF\uCD00\uCD02", 5, "\uCD0A\uCD0B\uCD0D\uCD0E\uCD0F\uCD11", 6, "\uCD1A\uCD1C\uCD1E\uCD1F\uCD20"],
      ["ac61", "\uCD21\uCD22\uCD23\uCD25\uCD26\uCD27\uCD29\uCD2A\uCD2B\uCD2D", 11, "\uCD3A", 4],
      ["ac81", "\uCD3F", 28, "\uCD5D\uCD5E\uCD5F\u0410", 5, "\u0401\u0416", 25],
      ["acd1", "\u0430", 5, "\u0451\u0436", 25],
      ["ad41", "\uCD61\uCD62\uCD63\uCD65", 6, "\uCD6E\uCD70\uCD72", 5, "\uCD79", 7],
      ["ad61", "\uCD81", 6, "\uCD89", 10, "\uCD96\uCD97\uCD99\uCD9A\uCD9B\uCD9D\uCD9E\uCD9F"],
      ["ad81", "\uCDA0\uCDA1\uCDA2\uCDA3\uCDA6\uCDA8\uCDAA", 5, "\uCDB1", 18, "\uCDC5"],
      ["ae41", "\uCDC6", 5, "\uCDCD\uCDCE\uCDCF\uCDD1", 16],
      ["ae61", "\uCDE2", 5, "\uCDE9\uCDEA\uCDEB\uCDED\uCDEE\uCDEF\uCDF1", 6, "\uCDFA\uCDFC\uCDFE", 4],
      ["ae81", "\uCE03\uCE05\uCE06\uCE07\uCE09\uCE0A\uCE0B\uCE0D", 6, "\uCE15\uCE16\uCE17\uCE18\uCE1A", 5, "\uCE22\uCE23\uCE25\uCE26\uCE27\uCE29\uCE2A\uCE2B"],
      ["af41", "\uCE2C\uCE2D\uCE2E\uCE2F\uCE32\uCE34\uCE36", 19],
      ["af61", "\uCE4A", 13, "\uCE5A\uCE5B\uCE5D\uCE5E\uCE62", 5, "\uCE6A\uCE6C"],
      ["af81", "\uCE6E", 5, "\uCE76\uCE77\uCE79\uCE7A\uCE7B\uCE7D", 6, "\uCE86\uCE88\uCE8A", 5, "\uCE92\uCE93\uCE95\uCE96\uCE97\uCE99"],
      ["b041", "\uCE9A", 5, "\uCEA2\uCEA6", 5, "\uCEAE", 12],
      ["b061", "\uCEBB", 5, "\uCEC2", 19],
      ["b081", "\uCED6", 13, "\uCEE6\uCEE7\uCEE9\uCEEA\uCEED", 6, "\uCEF6\uCEFA", 5, "\uAC00\uAC01\uAC04\uAC07\uAC08\uAC09\uAC0A\uAC10", 7, "\uAC19", 4, "\uAC20\uAC24\uAC2C\uAC2D\uAC2F\uAC30\uAC31\uAC38\uAC39\uAC3C\uAC40\uAC4B\uAC4D\uAC54\uAC58\uAC5C\uAC70\uAC71\uAC74\uAC77\uAC78\uAC7A\uAC80\uAC81\uAC83\uAC84\uAC85\uAC86\uAC89\uAC8A\uAC8B\uAC8C\uAC90\uAC94\uAC9C\uAC9D\uAC9F\uACA0\uACA1\uACA8\uACA9\uACAA\uACAC\uACAF\uACB0\uACB8\uACB9\uACBB\uACBC\uACBD\uACC1\uACC4\uACC8\uACCC\uACD5\uACD7\uACE0\uACE1\uACE4\uACE7\uACE8\uACEA\uACEC\uACEF\uACF0\uACF1\uACF3\uACF5\uACF6\uACFC\uACFD\uAD00\uAD04\uAD06"],
      ["b141", "\uCF02\uCF03\uCF05\uCF06\uCF07\uCF09", 6, "\uCF12\uCF14\uCF16", 5, "\uCF1D\uCF1E\uCF1F\uCF21\uCF22\uCF23"],
      ["b161", "\uCF25", 6, "\uCF2E\uCF32", 5, "\uCF39", 11],
      ["b181", "\uCF45", 14, "\uCF56\uCF57\uCF59\uCF5A\uCF5B\uCF5D", 6, "\uCF66\uCF68\uCF6A\uCF6B\uCF6C\uAD0C\uAD0D\uAD0F\uAD11\uAD18\uAD1C\uAD20\uAD29\uAD2C\uAD2D\uAD34\uAD35\uAD38\uAD3C\uAD44\uAD45\uAD47\uAD49\uAD50\uAD54\uAD58\uAD61\uAD63\uAD6C\uAD6D\uAD70\uAD73\uAD74\uAD75\uAD76\uAD7B\uAD7C\uAD7D\uAD7F\uAD81\uAD82\uAD88\uAD89\uAD8C\uAD90\uAD9C\uAD9D\uADA4\uADB7\uADC0\uADC1\uADC4\uADC8\uADD0\uADD1\uADD3\uADDC\uADE0\uADE4\uADF8\uADF9\uADFC\uADFF\uAE00\uAE01\uAE08\uAE09\uAE0B\uAE0D\uAE14\uAE30\uAE31\uAE34\uAE37\uAE38\uAE3A\uAE40\uAE41\uAE43\uAE45\uAE46\uAE4A\uAE4C\uAE4D\uAE4E\uAE50\uAE54\uAE56\uAE5C\uAE5D\uAE5F\uAE60\uAE61\uAE65\uAE68\uAE69\uAE6C\uAE70\uAE78"],
      ["b241", "\uCF6D\uCF6E\uCF6F\uCF72\uCF73\uCF75\uCF76\uCF77\uCF79", 6, "\uCF81\uCF82\uCF83\uCF84\uCF86", 5, "\uCF8D"],
      ["b261", "\uCF8E", 18, "\uCFA2", 5, "\uCFA9"],
      ["b281", "\uCFAA", 5, "\uCFB1", 18, "\uCFC5", 6, "\uAE79\uAE7B\uAE7C\uAE7D\uAE84\uAE85\uAE8C\uAEBC\uAEBD\uAEBE\uAEC0\uAEC4\uAECC\uAECD\uAECF\uAED0\uAED1\uAED8\uAED9\uAEDC\uAEE8\uAEEB\uAEED\uAEF4\uAEF8\uAEFC\uAF07\uAF08\uAF0D\uAF10\uAF2C\uAF2D\uAF30\uAF32\uAF34\uAF3C\uAF3D\uAF3F\uAF41\uAF42\uAF43\uAF48\uAF49\uAF50\uAF5C\uAF5D\uAF64\uAF65\uAF79\uAF80\uAF84\uAF88\uAF90\uAF91\uAF95\uAF9C\uAFB8\uAFB9\uAFBC\uAFC0\uAFC7\uAFC8\uAFC9\uAFCB\uAFCD\uAFCE\uAFD4\uAFDC\uAFE8\uAFE9\uAFF0\uAFF1\uAFF4\uAFF8\uB000\uB001\uB004\uB00C\uB010\uB014\uB01C\uB01D\uB028\uB044\uB045\uB048\uB04A\uB04C\uB04E\uB053\uB054\uB055\uB057\uB059"],
      ["b341", "\uCFCC", 19, "\uCFE2\uCFE3\uCFE5\uCFE6\uCFE7\uCFE9"],
      ["b361", "\uCFEA", 5, "\uCFF2\uCFF4\uCFF6", 5, "\uCFFD\uCFFE\uCFFF\uD001\uD002\uD003\uD005", 5],
      ["b381", "\uD00B", 5, "\uD012", 5, "\uD019", 19, "\uB05D\uB07C\uB07D\uB080\uB084\uB08C\uB08D\uB08F\uB091\uB098\uB099\uB09A\uB09C\uB09F\uB0A0\uB0A1\uB0A2\uB0A8\uB0A9\uB0AB", 4, "\uB0B1\uB0B3\uB0B4\uB0B5\uB0B8\uB0BC\uB0C4\uB0C5\uB0C7\uB0C8\uB0C9\uB0D0\uB0D1\uB0D4\uB0D8\uB0E0\uB0E5\uB108\uB109\uB10B\uB10C\uB110\uB112\uB113\uB118\uB119\uB11B\uB11C\uB11D\uB123\uB124\uB125\uB128\uB12C\uB134\uB135\uB137\uB138\uB139\uB140\uB141\uB144\uB148\uB150\uB151\uB154\uB155\uB158\uB15C\uB160\uB178\uB179\uB17C\uB180\uB182\uB188\uB189\uB18B\uB18D\uB192\uB193\uB194\uB198\uB19C\uB1A8\uB1CC\uB1D0\uB1D4\uB1DC\uB1DD"],
      ["b441", "\uD02E", 5, "\uD036\uD037\uD039\uD03A\uD03B\uD03D", 6, "\uD046\uD048\uD04A", 5],
      ["b461", "\uD051\uD052\uD053\uD055\uD056\uD057\uD059", 6, "\uD061", 10, "\uD06E\uD06F"],
      ["b481", "\uD071\uD072\uD073\uD075", 6, "\uD07E\uD07F\uD080\uD082", 18, "\uB1DF\uB1E8\uB1E9\uB1EC\uB1F0\uB1F9\uB1FB\uB1FD\uB204\uB205\uB208\uB20B\uB20C\uB214\uB215\uB217\uB219\uB220\uB234\uB23C\uB258\uB25C\uB260\uB268\uB269\uB274\uB275\uB27C\uB284\uB285\uB289\uB290\uB291\uB294\uB298\uB299\uB29A\uB2A0\uB2A1\uB2A3\uB2A5\uB2A6\uB2AA\uB2AC\uB2B0\uB2B4\uB2C8\uB2C9\uB2CC\uB2D0\uB2D2\uB2D8\uB2D9\uB2DB\uB2DD\uB2E2\uB2E4\uB2E5\uB2E6\uB2E8\uB2EB", 4, "\uB2F3\uB2F4\uB2F5\uB2F7", 4, "\uB2FF\uB300\uB301\uB304\uB308\uB310\uB311\uB313\uB314\uB315\uB31C\uB354\uB355\uB356\uB358\uB35B\uB35C\uB35E\uB35F\uB364\uB365"],
      ["b541", "\uD095", 14, "\uD0A6\uD0A7\uD0A9\uD0AA\uD0AB\uD0AD", 5],
      ["b561", "\uD0B3\uD0B6\uD0B8\uD0BA", 5, "\uD0C2\uD0C3\uD0C5\uD0C6\uD0C7\uD0CA", 5, "\uD0D2\uD0D6", 4],
      ["b581", "\uD0DB\uD0DE\uD0DF\uD0E1\uD0E2\uD0E3\uD0E5", 6, "\uD0EE\uD0F2", 5, "\uD0F9", 11, "\uB367\uB369\uB36B\uB36E\uB370\uB371\uB374\uB378\uB380\uB381\uB383\uB384\uB385\uB38C\uB390\uB394\uB3A0\uB3A1\uB3A8\uB3AC\uB3C4\uB3C5\uB3C8\uB3CB\uB3CC\uB3CE\uB3D0\uB3D4\uB3D5\uB3D7\uB3D9\uB3DB\uB3DD\uB3E0\uB3E4\uB3E8\uB3FC\uB410\uB418\uB41C\uB420\uB428\uB429\uB42B\uB434\uB450\uB451\uB454\uB458\uB460\uB461\uB463\uB465\uB46C\uB480\uB488\uB49D\uB4A4\uB4A8\uB4AC\uB4B5\uB4B7\uB4B9\uB4C0\uB4C4\uB4C8\uB4D0\uB4D5\uB4DC\uB4DD\uB4E0\uB4E3\uB4E4\uB4E6\uB4EC\uB4ED\uB4EF\uB4F1\uB4F8\uB514\uB515\uB518\uB51B\uB51C\uB524\uB525\uB527\uB528\uB529\uB52A\uB530\uB531\uB534\uB538"],
      ["b641", "\uD105", 7, "\uD10E", 17],
      ["b661", "\uD120", 15, "\uD132\uD133\uD135\uD136\uD137\uD139\uD13B\uD13C\uD13D\uD13E"],
      ["b681", "\uD13F\uD142\uD146", 5, "\uD14E\uD14F\uD151\uD152\uD153\uD155", 6, "\uD15E\uD160\uD162", 5, "\uD169\uD16A\uD16B\uD16D\uB540\uB541\uB543\uB544\uB545\uB54B\uB54C\uB54D\uB550\uB554\uB55C\uB55D\uB55F\uB560\uB561\uB5A0\uB5A1\uB5A4\uB5A8\uB5AA\uB5AB\uB5B0\uB5B1\uB5B3\uB5B4\uB5B5\uB5BB\uB5BC\uB5BD\uB5C0\uB5C4\uB5CC\uB5CD\uB5CF\uB5D0\uB5D1\uB5D8\uB5EC\uB610\uB611\uB614\uB618\uB625\uB62C\uB634\uB648\uB664\uB668\uB69C\uB69D\uB6A0\uB6A4\uB6AB\uB6AC\uB6B1\uB6D4\uB6F0\uB6F4\uB6F8\uB700\uB701\uB705\uB728\uB729\uB72C\uB72F\uB730\uB738\uB739\uB73B\uB744\uB748\uB74C\uB754\uB755\uB760\uB764\uB768\uB770\uB771\uB773\uB775\uB77C\uB77D\uB780\uB784\uB78C\uB78D\uB78F\uB790\uB791\uB792\uB796\uB797"],
      ["b741", "\uD16E", 13, "\uD17D", 6, "\uD185\uD186\uD187\uD189\uD18A"],
      ["b761", "\uD18B", 20, "\uD1A2\uD1A3\uD1A5\uD1A6\uD1A7"],
      ["b781", "\uD1A9", 6, "\uD1B2\uD1B4\uD1B6\uD1B7\uD1B8\uD1B9\uD1BB\uD1BD\uD1BE\uD1BF\uD1C1", 14, "\uB798\uB799\uB79C\uB7A0\uB7A8\uB7A9\uB7AB\uB7AC\uB7AD\uB7B4\uB7B5\uB7B8\uB7C7\uB7C9\uB7EC\uB7ED\uB7F0\uB7F4\uB7FC\uB7FD\uB7FF\uB800\uB801\uB807\uB808\uB809\uB80C\uB810\uB818\uB819\uB81B\uB81D\uB824\uB825\uB828\uB82C\uB834\uB835\uB837\uB838\uB839\uB840\uB844\uB851\uB853\uB85C\uB85D\uB860\uB864\uB86C\uB86D\uB86F\uB871\uB878\uB87C\uB88D\uB8A8\uB8B0\uB8B4\uB8B8\uB8C0\uB8C1\uB8C3\uB8C5\uB8CC\uB8D0\uB8D4\uB8DD\uB8DF\uB8E1\uB8E8\uB8E9\uB8EC\uB8F0\uB8F8\uB8F9\uB8FB\uB8FD\uB904\uB918\uB920\uB93C\uB93D\uB940\uB944\uB94C\uB94F\uB951\uB958\uB959\uB95C\uB960\uB968\uB969"],
      ["b841", "\uD1D0", 7, "\uD1D9", 17],
      ["b861", "\uD1EB", 8, "\uD1F5\uD1F6\uD1F7\uD1F9", 13],
      ["b881", "\uD208\uD20A", 5, "\uD211", 24, "\uB96B\uB96D\uB974\uB975\uB978\uB97C\uB984\uB985\uB987\uB989\uB98A\uB98D\uB98E\uB9AC\uB9AD\uB9B0\uB9B4\uB9BC\uB9BD\uB9BF\uB9C1\uB9C8\uB9C9\uB9CC\uB9CE", 4, "\uB9D8\uB9D9\uB9DB\uB9DD\uB9DE\uB9E1\uB9E3\uB9E4\uB9E5\uB9E8\uB9EC\uB9F4\uB9F5\uB9F7\uB9F8\uB9F9\uB9FA\uBA00\uBA01\uBA08\uBA15\uBA38\uBA39\uBA3C\uBA40\uBA42\uBA48\uBA49\uBA4B\uBA4D\uBA4E\uBA53\uBA54\uBA55\uBA58\uBA5C\uBA64\uBA65\uBA67\uBA68\uBA69\uBA70\uBA71\uBA74\uBA78\uBA83\uBA84\uBA85\uBA87\uBA8C\uBAA8\uBAA9\uBAAB\uBAAC\uBAB0\uBAB2\uBAB8\uBAB9\uBABB\uBABD\uBAC4\uBAC8\uBAD8\uBAD9\uBAFC"],
      ["b941", "\uD22A\uD22B\uD22E\uD22F\uD231\uD232\uD233\uD235", 6, "\uD23E\uD240\uD242", 5, "\uD249\uD24A\uD24B\uD24C"],
      ["b961", "\uD24D", 14, "\uD25D", 6, "\uD265\uD266\uD267\uD268"],
      ["b981", "\uD269", 22, "\uD282\uD283\uD285\uD286\uD287\uD289\uD28A\uD28B\uD28C\uBB00\uBB04\uBB0D\uBB0F\uBB11\uBB18\uBB1C\uBB20\uBB29\uBB2B\uBB34\uBB35\uBB36\uBB38\uBB3B\uBB3C\uBB3D\uBB3E\uBB44\uBB45\uBB47\uBB49\uBB4D\uBB4F\uBB50\uBB54\uBB58\uBB61\uBB63\uBB6C\uBB88\uBB8C\uBB90\uBBA4\uBBA8\uBBAC\uBBB4\uBBB7\uBBC0\uBBC4\uBBC8\uBBD0\uBBD3\uBBF8\uBBF9\uBBFC\uBBFF\uBC00\uBC02\uBC08\uBC09\uBC0B\uBC0C\uBC0D\uBC0F\uBC11\uBC14", 4, "\uBC1B", 4, "\uBC24\uBC25\uBC27\uBC29\uBC2D\uBC30\uBC31\uBC34\uBC38\uBC40\uBC41\uBC43\uBC44\uBC45\uBC49\uBC4C\uBC4D\uBC50\uBC5D\uBC84\uBC85\uBC88\uBC8B\uBC8C\uBC8E\uBC94\uBC95\uBC97"],
      ["ba41", "\uD28D\uD28E\uD28F\uD292\uD293\uD294\uD296", 5, "\uD29D\uD29E\uD29F\uD2A1\uD2A2\uD2A3\uD2A5", 6, "\uD2AD"],
      ["ba61", "\uD2AE\uD2AF\uD2B0\uD2B2", 5, "\uD2BA\uD2BB\uD2BD\uD2BE\uD2C1\uD2C3", 4, "\uD2CA\uD2CC", 5],
      ["ba81", "\uD2D2\uD2D3\uD2D5\uD2D6\uD2D7\uD2D9\uD2DA\uD2DB\uD2DD", 6, "\uD2E6", 9, "\uD2F2\uD2F3\uD2F5\uD2F6\uD2F7\uD2F9\uD2FA\uBC99\uBC9A\uBCA0\uBCA1\uBCA4\uBCA7\uBCA8\uBCB0\uBCB1\uBCB3\uBCB4\uBCB5\uBCBC\uBCBD\uBCC0\uBCC4\uBCCD\uBCCF\uBCD0\uBCD1\uBCD5\uBCD8\uBCDC\uBCF4\uBCF5\uBCF6\uBCF8\uBCFC\uBD04\uBD05\uBD07\uBD09\uBD10\uBD14\uBD24\uBD2C\uBD40\uBD48\uBD49\uBD4C\uBD50\uBD58\uBD59\uBD64\uBD68\uBD80\uBD81\uBD84\uBD87\uBD88\uBD89\uBD8A\uBD90\uBD91\uBD93\uBD95\uBD99\uBD9A\uBD9C\uBDA4\uBDB0\uBDB8\uBDD4\uBDD5\uBDD8\uBDDC\uBDE9\uBDF0\uBDF4\uBDF8\uBE00\uBE03\uBE05\uBE0C\uBE0D\uBE10\uBE14\uBE1C\uBE1D\uBE1F\uBE44\uBE45\uBE48\uBE4C\uBE4E\uBE54\uBE55\uBE57\uBE59\uBE5A\uBE5B\uBE60\uBE61\uBE64"],
      ["bb41", "\uD2FB", 4, "\uD302\uD304\uD306", 5, "\uD30F\uD311\uD312\uD313\uD315\uD317", 4, "\uD31E\uD322\uD323"],
      ["bb61", "\uD324\uD326\uD327\uD32A\uD32B\uD32D\uD32E\uD32F\uD331", 6, "\uD33A\uD33E", 5, "\uD346\uD347\uD348\uD349"],
      ["bb81", "\uD34A", 31, "\uBE68\uBE6A\uBE70\uBE71\uBE73\uBE74\uBE75\uBE7B\uBE7C\uBE7D\uBE80\uBE84\uBE8C\uBE8D\uBE8F\uBE90\uBE91\uBE98\uBE99\uBEA8\uBED0\uBED1\uBED4\uBED7\uBED8\uBEE0\uBEE3\uBEE4\uBEE5\uBEEC\uBF01\uBF08\uBF09\uBF18\uBF19\uBF1B\uBF1C\uBF1D\uBF40\uBF41\uBF44\uBF48\uBF50\uBF51\uBF55\uBF94\uBFB0\uBFC5\uBFCC\uBFCD\uBFD0\uBFD4\uBFDC\uBFDF\uBFE1\uC03C\uC051\uC058\uC05C\uC060\uC068\uC069\uC090\uC091\uC094\uC098\uC0A0\uC0A1\uC0A3\uC0A5\uC0AC\uC0AD\uC0AF\uC0B0\uC0B3\uC0B4\uC0B5\uC0B6\uC0BC\uC0BD\uC0BF\uC0C0\uC0C1\uC0C5\uC0C8\uC0C9\uC0CC\uC0D0\uC0D8\uC0D9\uC0DB\uC0DC\uC0DD\uC0E4"],
      ["bc41", "\uD36A", 17, "\uD37E\uD37F\uD381\uD382\uD383\uD385\uD386\uD387"],
      ["bc61", "\uD388\uD389\uD38A\uD38B\uD38E\uD392", 5, "\uD39A\uD39B\uD39D\uD39E\uD39F\uD3A1", 6, "\uD3AA\uD3AC\uD3AE"],
      ["bc81", "\uD3AF", 4, "\uD3B5\uD3B6\uD3B7\uD3B9\uD3BA\uD3BB\uD3BD", 6, "\uD3C6\uD3C7\uD3CA", 5, "\uD3D1", 5, "\uC0E5\uC0E8\uC0EC\uC0F4\uC0F5\uC0F7\uC0F9\uC100\uC104\uC108\uC110\uC115\uC11C", 4, "\uC123\uC124\uC126\uC127\uC12C\uC12D\uC12F\uC130\uC131\uC136\uC138\uC139\uC13C\uC140\uC148\uC149\uC14B\uC14C\uC14D\uC154\uC155\uC158\uC15C\uC164\uC165\uC167\uC168\uC169\uC170\uC174\uC178\uC185\uC18C\uC18D\uC18E\uC190\uC194\uC196\uC19C\uC19D\uC19F\uC1A1\uC1A5\uC1A8\uC1A9\uC1AC\uC1B0\uC1BD\uC1C4\uC1C8\uC1CC\uC1D4\uC1D7\uC1D8\uC1E0\uC1E4\uC1E8\uC1F0\uC1F1\uC1F3\uC1FC\uC1FD\uC200\uC204\uC20C\uC20D\uC20F\uC211\uC218\uC219\uC21C\uC21F\uC220\uC228\uC229\uC22B\uC22D"],
      ["bd41", "\uD3D7\uD3D9", 7, "\uD3E2\uD3E4", 7, "\uD3EE\uD3EF\uD3F1\uD3F2\uD3F3\uD3F5\uD3F6\uD3F7"],
      ["bd61", "\uD3F8\uD3F9\uD3FA\uD3FB\uD3FE\uD400\uD402", 5, "\uD409", 13],
      ["bd81", "\uD417", 5, "\uD41E", 25, "\uC22F\uC231\uC232\uC234\uC248\uC250\uC251\uC254\uC258\uC260\uC265\uC26C\uC26D\uC270\uC274\uC27C\uC27D\uC27F\uC281\uC288\uC289\uC290\uC298\uC29B\uC29D\uC2A4\uC2A5\uC2A8\uC2AC\uC2AD\uC2B4\uC2B5\uC2B7\uC2B9\uC2DC\uC2DD\uC2E0\uC2E3\uC2E4\uC2EB\uC2EC\uC2ED\uC2EF\uC2F1\uC2F6\uC2F8\uC2F9\uC2FB\uC2FC\uC300\uC308\uC309\uC30C\uC30D\uC313\uC314\uC315\uC318\uC31C\uC324\uC325\uC328\uC329\uC345\uC368\uC369\uC36C\uC370\uC372\uC378\uC379\uC37C\uC37D\uC384\uC388\uC38C\uC3C0\uC3D8\uC3D9\uC3DC\uC3DF\uC3E0\uC3E2\uC3E8\uC3E9\uC3ED\uC3F4\uC3F5\uC3F8\uC408\uC410\uC424\uC42C\uC430"],
      ["be41", "\uD438", 7, "\uD441\uD442\uD443\uD445", 14],
      ["be61", "\uD454", 7, "\uD45D\uD45E\uD45F\uD461\uD462\uD463\uD465", 7, "\uD46E\uD470\uD471\uD472"],
      ["be81", "\uD473", 4, "\uD47A\uD47B\uD47D\uD47E\uD481\uD483", 4, "\uD48A\uD48C\uD48E", 5, "\uD495", 8, "\uC434\uC43C\uC43D\uC448\uC464\uC465\uC468\uC46C\uC474\uC475\uC479\uC480\uC494\uC49C\uC4B8\uC4BC\uC4E9\uC4F0\uC4F1\uC4F4\uC4F8\uC4FA\uC4FF\uC500\uC501\uC50C\uC510\uC514\uC51C\uC528\uC529\uC52C\uC530\uC538\uC539\uC53B\uC53D\uC544\uC545\uC548\uC549\uC54A\uC54C\uC54D\uC54E\uC553\uC554\uC555\uC557\uC558\uC559\uC55D\uC55E\uC560\uC561\uC564\uC568\uC570\uC571\uC573\uC574\uC575\uC57C\uC57D\uC580\uC584\uC587\uC58C\uC58D\uC58F\uC591\uC595\uC597\uC598\uC59C\uC5A0\uC5A9\uC5B4\uC5B5\uC5B8\uC5B9\uC5BB\uC5BC\uC5BD\uC5BE\uC5C4", 6, "\uC5CC\uC5CE"],
      ["bf41", "\uD49E", 10, "\uD4AA", 14],
      ["bf61", "\uD4B9", 18, "\uD4CD\uD4CE\uD4CF\uD4D1\uD4D2\uD4D3\uD4D5"],
      ["bf81", "\uD4D6", 5, "\uD4DD\uD4DE\uD4E0", 7, "\uD4E9\uD4EA\uD4EB\uD4ED\uD4EE\uD4EF\uD4F1", 6, "\uD4F9\uD4FA\uD4FC\uC5D0\uC5D1\uC5D4\uC5D8\uC5E0\uC5E1\uC5E3\uC5E5\uC5EC\uC5ED\uC5EE\uC5F0\uC5F4\uC5F6\uC5F7\uC5FC", 5, "\uC605\uC606\uC607\uC608\uC60C\uC610\uC618\uC619\uC61B\uC61C\uC624\uC625\uC628\uC62C\uC62D\uC62E\uC630\uC633\uC634\uC635\uC637\uC639\uC63B\uC640\uC641\uC644\uC648\uC650\uC651\uC653\uC654\uC655\uC65C\uC65D\uC660\uC66C\uC66F\uC671\uC678\uC679\uC67C\uC680\uC688\uC689\uC68B\uC68D\uC694\uC695\uC698\uC69C\uC6A4\uC6A5\uC6A7\uC6A9\uC6B0\uC6B1\uC6B4\uC6B8\uC6B9\uC6BA\uC6C0\uC6C1\uC6C3\uC6C5\uC6CC\uC6CD\uC6D0\uC6D4\uC6DC\uC6DD\uC6E0\uC6E1\uC6E8"],
      ["c041", "\uD4FE", 5, "\uD505\uD506\uD507\uD509\uD50A\uD50B\uD50D", 6, "\uD516\uD518", 5],
      ["c061", "\uD51E", 25],
      ["c081", "\uD538\uD539\uD53A\uD53B\uD53E\uD53F\uD541\uD542\uD543\uD545", 6, "\uD54E\uD550\uD552", 5, "\uD55A\uD55B\uD55D\uD55E\uD55F\uD561\uD562\uD563\uC6E9\uC6EC\uC6F0\uC6F8\uC6F9\uC6FD\uC704\uC705\uC708\uC70C\uC714\uC715\uC717\uC719\uC720\uC721\uC724\uC728\uC730\uC731\uC733\uC735\uC737\uC73C\uC73D\uC740\uC744\uC74A\uC74C\uC74D\uC74F\uC751", 7, "\uC75C\uC760\uC768\uC76B\uC774\uC775\uC778\uC77C\uC77D\uC77E\uC783\uC784\uC785\uC787\uC788\uC789\uC78A\uC78E\uC790\uC791\uC794\uC796\uC797\uC798\uC79A\uC7A0\uC7A1\uC7A3\uC7A4\uC7A5\uC7A6\uC7AC\uC7AD\uC7B0\uC7B4\uC7BC\uC7BD\uC7BF\uC7C0\uC7C1\uC7C8\uC7C9\uC7CC\uC7CE\uC7D0\uC7D8\uC7DD\uC7E4\uC7E8\uC7EC\uC800\uC801\uC804\uC808\uC80A"],
      ["c141", "\uD564\uD566\uD567\uD56A\uD56C\uD56E", 5, "\uD576\uD577\uD579\uD57A\uD57B\uD57D", 6, "\uD586\uD58A\uD58B"],
      ["c161", "\uD58C\uD58D\uD58E\uD58F\uD591", 19, "\uD5A6\uD5A7"],
      ["c181", "\uD5A8", 31, "\uC810\uC811\uC813\uC815\uC816\uC81C\uC81D\uC820\uC824\uC82C\uC82D\uC82F\uC831\uC838\uC83C\uC840\uC848\uC849\uC84C\uC84D\uC854\uC870\uC871\uC874\uC878\uC87A\uC880\uC881\uC883\uC885\uC886\uC887\uC88B\uC88C\uC88D\uC894\uC89D\uC89F\uC8A1\uC8A8\uC8BC\uC8BD\uC8C4\uC8C8\uC8CC\uC8D4\uC8D5\uC8D7\uC8D9\uC8E0\uC8E1\uC8E4\uC8F5\uC8FC\uC8FD\uC900\uC904\uC905\uC906\uC90C\uC90D\uC90F\uC911\uC918\uC92C\uC934\uC950\uC951\uC954\uC958\uC960\uC961\uC963\uC96C\uC970\uC974\uC97C\uC988\uC989\uC98C\uC990\uC998\uC999\uC99B\uC99D\uC9C0\uC9C1\uC9C4\uC9C7\uC9C8\uC9CA\uC9D0\uC9D1\uC9D3"],
      ["c241", "\uD5CA\uD5CB\uD5CD\uD5CE\uD5CF\uD5D1\uD5D3", 4, "\uD5DA\uD5DC\uD5DE", 5, "\uD5E6\uD5E7\uD5E9\uD5EA\uD5EB\uD5ED\uD5EE"],
      ["c261", "\uD5EF", 4, "\uD5F6\uD5F8\uD5FA", 5, "\uD602\uD603\uD605\uD606\uD607\uD609", 6, "\uD612"],
      ["c281", "\uD616", 5, "\uD61D\uD61E\uD61F\uD621\uD622\uD623\uD625", 7, "\uD62E", 9, "\uD63A\uD63B\uC9D5\uC9D6\uC9D9\uC9DA\uC9DC\uC9DD\uC9E0\uC9E2\uC9E4\uC9E7\uC9EC\uC9ED\uC9EF\uC9F0\uC9F1\uC9F8\uC9F9\uC9FC\uCA00\uCA08\uCA09\uCA0B\uCA0C\uCA0D\uCA14\uCA18\uCA29\uCA4C\uCA4D\uCA50\uCA54\uCA5C\uCA5D\uCA5F\uCA60\uCA61\uCA68\uCA7D\uCA84\uCA98\uCABC\uCABD\uCAC0\uCAC4\uCACC\uCACD\uCACF\uCAD1\uCAD3\uCAD8\uCAD9\uCAE0\uCAEC\uCAF4\uCB08\uCB10\uCB14\uCB18\uCB20\uCB21\uCB41\uCB48\uCB49\uCB4C\uCB50\uCB58\uCB59\uCB5D\uCB64\uCB78\uCB79\uCB9C\uCBB8\uCBD4\uCBE4\uCBE7\uCBE9\uCC0C\uCC0D\uCC10\uCC14\uCC1C\uCC1D\uCC21\uCC22\uCC27\uCC28\uCC29\uCC2C\uCC2E\uCC30\uCC38\uCC39\uCC3B"],
      ["c341", "\uD63D\uD63E\uD63F\uD641\uD642\uD643\uD644\uD646\uD647\uD64A\uD64C\uD64E\uD64F\uD650\uD652\uD653\uD656\uD657\uD659\uD65A\uD65B\uD65D", 4],
      ["c361", "\uD662", 4, "\uD668\uD66A", 5, "\uD672\uD673\uD675", 11],
      ["c381", "\uD681\uD682\uD684\uD686", 5, "\uD68E\uD68F\uD691\uD692\uD693\uD695", 7, "\uD69E\uD6A0\uD6A2", 5, "\uD6A9\uD6AA\uCC3C\uCC3D\uCC3E\uCC44\uCC45\uCC48\uCC4C\uCC54\uCC55\uCC57\uCC58\uCC59\uCC60\uCC64\uCC66\uCC68\uCC70\uCC75\uCC98\uCC99\uCC9C\uCCA0\uCCA8\uCCA9\uCCAB\uCCAC\uCCAD\uCCB4\uCCB5\uCCB8\uCCBC\uCCC4\uCCC5\uCCC7\uCCC9\uCCD0\uCCD4\uCCE4\uCCEC\uCCF0\uCD01\uCD08\uCD09\uCD0C\uCD10\uCD18\uCD19\uCD1B\uCD1D\uCD24\uCD28\uCD2C\uCD39\uCD5C\uCD60\uCD64\uCD6C\uCD6D\uCD6F\uCD71\uCD78\uCD88\uCD94\uCD95\uCD98\uCD9C\uCDA4\uCDA5\uCDA7\uCDA9\uCDB0\uCDC4\uCDCC\uCDD0\uCDE8\uCDEC\uCDF0\uCDF8\uCDF9\uCDFB\uCDFD\uCE04\uCE08\uCE0C\uCE14\uCE19\uCE20\uCE21\uCE24\uCE28\uCE30\uCE31\uCE33\uCE35"],
      ["c441", "\uD6AB\uD6AD\uD6AE\uD6AF\uD6B1", 7, "\uD6BA\uD6BC", 7, "\uD6C6\uD6C7\uD6C9\uD6CA\uD6CB"],
      ["c461", "\uD6CD\uD6CE\uD6CF\uD6D0\uD6D2\uD6D3\uD6D5\uD6D6\uD6D8\uD6DA", 5, "\uD6E1\uD6E2\uD6E3\uD6E5\uD6E6\uD6E7\uD6E9", 4],
      ["c481", "\uD6EE\uD6EF\uD6F1\uD6F2\uD6F3\uD6F4\uD6F6", 5, "\uD6FE\uD6FF\uD701\uD702\uD703\uD705", 11, "\uD712\uD713\uD714\uCE58\uCE59\uCE5C\uCE5F\uCE60\uCE61\uCE68\uCE69\uCE6B\uCE6D\uCE74\uCE75\uCE78\uCE7C\uCE84\uCE85\uCE87\uCE89\uCE90\uCE91\uCE94\uCE98\uCEA0\uCEA1\uCEA3\uCEA4\uCEA5\uCEAC\uCEAD\uCEC1\uCEE4\uCEE5\uCEE8\uCEEB\uCEEC\uCEF4\uCEF5\uCEF7\uCEF8\uCEF9\uCF00\uCF01\uCF04\uCF08\uCF10\uCF11\uCF13\uCF15\uCF1C\uCF20\uCF24\uCF2C\uCF2D\uCF2F\uCF30\uCF31\uCF38\uCF54\uCF55\uCF58\uCF5C\uCF64\uCF65\uCF67\uCF69\uCF70\uCF71\uCF74\uCF78\uCF80\uCF85\uCF8C\uCFA1\uCFA8\uCFB0\uCFC4\uCFE0\uCFE1\uCFE4\uCFE8\uCFF0\uCFF1\uCFF3\uCFF5\uCFFC\uD000\uD004\uD011\uD018\uD02D\uD034\uD035\uD038\uD03C"],
      ["c541", "\uD715\uD716\uD717\uD71A\uD71B\uD71D\uD71E\uD71F\uD721", 6, "\uD72A\uD72C\uD72E", 5, "\uD736\uD737\uD739"],
      ["c561", "\uD73A\uD73B\uD73D", 6, "\uD745\uD746\uD748\uD74A", 5, "\uD752\uD753\uD755\uD75A", 4],
      ["c581", "\uD75F\uD762\uD764\uD766\uD767\uD768\uD76A\uD76B\uD76D\uD76E\uD76F\uD771\uD772\uD773\uD775", 6, "\uD77E\uD77F\uD780\uD782", 5, "\uD78A\uD78B\uD044\uD045\uD047\uD049\uD050\uD054\uD058\uD060\uD06C\uD06D\uD070\uD074\uD07C\uD07D\uD081\uD0A4\uD0A5\uD0A8\uD0AC\uD0B4\uD0B5\uD0B7\uD0B9\uD0C0\uD0C1\uD0C4\uD0C8\uD0C9\uD0D0\uD0D1\uD0D3\uD0D4\uD0D5\uD0DC\uD0DD\uD0E0\uD0E4\uD0EC\uD0ED\uD0EF\uD0F0\uD0F1\uD0F8\uD10D\uD130\uD131\uD134\uD138\uD13A\uD140\uD141\uD143\uD144\uD145\uD14C\uD14D\uD150\uD154\uD15C\uD15D\uD15F\uD161\uD168\uD16C\uD17C\uD184\uD188\uD1A0\uD1A1\uD1A4\uD1A8\uD1B0\uD1B1\uD1B3\uD1B5\uD1BA\uD1BC\uD1C0\uD1D8\uD1F4\uD1F8\uD207\uD209\uD210\uD22C\uD22D\uD230\uD234\uD23C\uD23D\uD23F\uD241\uD248\uD25C"],
      ["c641", "\uD78D\uD78E\uD78F\uD791", 6, "\uD79A\uD79C\uD79E", 5],
      ["c6a1", "\uD264\uD280\uD281\uD284\uD288\uD290\uD291\uD295\uD29C\uD2A0\uD2A4\uD2AC\uD2B1\uD2B8\uD2B9\uD2BC\uD2BF\uD2C0\uD2C2\uD2C8\uD2C9\uD2CB\uD2D4\uD2D8\uD2DC\uD2E4\uD2E5\uD2F0\uD2F1\uD2F4\uD2F8\uD300\uD301\uD303\uD305\uD30C\uD30D\uD30E\uD310\uD314\uD316\uD31C\uD31D\uD31F\uD320\uD321\uD325\uD328\uD329\uD32C\uD330\uD338\uD339\uD33B\uD33C\uD33D\uD344\uD345\uD37C\uD37D\uD380\uD384\uD38C\uD38D\uD38F\uD390\uD391\uD398\uD399\uD39C\uD3A0\uD3A8\uD3A9\uD3AB\uD3AD\uD3B4\uD3B8\uD3BC\uD3C4\uD3C5\uD3C8\uD3C9\uD3D0\uD3D8\uD3E1\uD3E3\uD3EC\uD3ED\uD3F0\uD3F4\uD3FC\uD3FD\uD3FF\uD401"],
      ["c7a1", "\uD408\uD41D\uD440\uD444\uD45C\uD460\uD464\uD46D\uD46F\uD478\uD479\uD47C\uD47F\uD480\uD482\uD488\uD489\uD48B\uD48D\uD494\uD4A9\uD4CC\uD4D0\uD4D4\uD4DC\uD4DF\uD4E8\uD4EC\uD4F0\uD4F8\uD4FB\uD4FD\uD504\uD508\uD50C\uD514\uD515\uD517\uD53C\uD53D\uD540\uD544\uD54C\uD54D\uD54F\uD551\uD558\uD559\uD55C\uD560\uD565\uD568\uD569\uD56B\uD56D\uD574\uD575\uD578\uD57C\uD584\uD585\uD587\uD588\uD589\uD590\uD5A5\uD5C8\uD5C9\uD5CC\uD5D0\uD5D2\uD5D8\uD5D9\uD5DB\uD5DD\uD5E4\uD5E5\uD5E8\uD5EC\uD5F4\uD5F5\uD5F7\uD5F9\uD600\uD601\uD604\uD608\uD610\uD611\uD613\uD614\uD615\uD61C\uD620"],
      ["c8a1", "\uD624\uD62D\uD638\uD639\uD63C\uD640\uD645\uD648\uD649\uD64B\uD64D\uD651\uD654\uD655\uD658\uD65C\uD667\uD669\uD670\uD671\uD674\uD683\uD685\uD68C\uD68D\uD690\uD694\uD69D\uD69F\uD6A1\uD6A8\uD6AC\uD6B0\uD6B9\uD6BB\uD6C4\uD6C5\uD6C8\uD6CC\uD6D1\uD6D4\uD6D7\uD6D9\uD6E0\uD6E4\uD6E8\uD6F0\uD6F5\uD6FC\uD6FD\uD700\uD704\uD711\uD718\uD719\uD71C\uD720\uD728\uD729\uD72B\uD72D\uD734\uD735\uD738\uD73C\uD744\uD747\uD749\uD750\uD751\uD754\uD756\uD757\uD758\uD759\uD760\uD761\uD763\uD765\uD769\uD76C\uD770\uD774\uD77C\uD77D\uD781\uD788\uD789\uD78C\uD790\uD798\uD799\uD79B\uD79D"],
      ["caa1", "\u4F3D\u4F73\u5047\u50F9\u52A0\u53EF\u5475\u54E5\u5609\u5AC1\u5BB6\u6687\u67B6\u67B7\u67EF\u6B4C\u73C2\u75C2\u7A3C\u82DB\u8304\u8857\u8888\u8A36\u8CC8\u8DCF\u8EFB\u8FE6\u99D5\u523B\u5374\u5404\u606A\u6164\u6BBC\u73CF\u811A\u89BA\u89D2\u95A3\u4F83\u520A\u58BE\u5978\u59E6\u5E72\u5E79\u61C7\u63C0\u6746\u67EC\u687F\u6F97\u764E\u770B\u78F5\u7A08\u7AFF\u7C21\u809D\u826E\u8271\u8AEB\u9593\u4E6B\u559D\u66F7\u6E34\u78A3\u7AED\u845B\u8910\u874E\u97A8\u52D8\u574E\u582A\u5D4C\u611F\u61BE\u6221\u6562\u67D1\u6A44\u6E1B\u7518\u75B3\u76E3\u77B0\u7D3A\u90AF\u9451\u9452\u9F95"],
      ["cba1", "\u5323\u5CAC\u7532\u80DB\u9240\u9598\u525B\u5808\u59DC\u5CA1\u5D17\u5EB7\u5F3A\u5F4A\u6177\u6C5F\u757A\u7586\u7CE0\u7D73\u7DB1\u7F8C\u8154\u8221\u8591\u8941\u8B1B\u92FC\u964D\u9C47\u4ECB\u4EF7\u500B\u51F1\u584F\u6137\u613E\u6168\u6539\u69EA\u6F11\u75A5\u7686\u76D6\u7B87\u82A5\u84CB\uF900\u93A7\u958B\u5580\u5BA2\u5751\uF901\u7CB3\u7FB9\u91B5\u5028\u53BB\u5C45\u5DE8\u62D2\u636E\u64DA\u64E7\u6E20\u70AC\u795B\u8DDD\u8E1E\uF902\u907D\u9245\u92F8\u4E7E\u4EF6\u5065\u5DFE\u5EFA\u6106\u6957\u8171\u8654\u8E47\u9375\u9A2B\u4E5E\u5091\u6770\u6840\u5109\u528D\u5292\u6AA2"],
      ["cca1", "\u77BC\u9210\u9ED4\u52AB\u602F\u8FF2\u5048\u61A9\u63ED\u64CA\u683C\u6A84\u6FC0\u8188\u89A1\u9694\u5805\u727D\u72AC\u7504\u7D79\u7E6D\u80A9\u898B\u8B74\u9063\u9D51\u6289\u6C7A\u6F54\u7D50\u7F3A\u8A23\u517C\u614A\u7B9D\u8B19\u9257\u938C\u4EAC\u4FD3\u501E\u50BE\u5106\u52C1\u52CD\u537F\u5770\u5883\u5E9A\u5F91\u6176\u61AC\u64CE\u656C\u666F\u66BB\u66F4\u6897\u6D87\u7085\u70F1\u749F\u74A5\u74CA\u75D9\u786C\u78EC\u7ADF\u7AF6\u7D45\u7D93\u8015\u803F\u811B\u8396\u8B66\u8F15\u9015\u93E1\u9803\u9838\u9A5A\u9BE8\u4FC2\u5553\u583A\u5951\u5B63\u5C46\u60B8\u6212\u6842\u68B0"],
      ["cda1", "\u68E8\u6EAA\u754C\u7678\u78CE\u7A3D\u7CFB\u7E6B\u7E7C\u8A08\u8AA1\u8C3F\u968E\u9DC4\u53E4\u53E9\u544A\u5471\u56FA\u59D1\u5B64\u5C3B\u5EAB\u62F7\u6537\u6545\u6572\u66A0\u67AF\u69C1\u6CBD\u75FC\u7690\u777E\u7A3F\u7F94\u8003\u80A1\u818F\u82E6\u82FD\u83F0\u85C1\u8831\u88B4\u8AA5\uF903\u8F9C\u932E\u96C7\u9867\u9AD8\u9F13\u54ED\u659B\u66F2\u688F\u7A40\u8C37\u9D60\u56F0\u5764\u5D11\u6606\u68B1\u68CD\u6EFE\u7428\u889E\u9BE4\u6C68\uF904\u9AA8\u4F9B\u516C\u5171\u529F\u5B54\u5DE5\u6050\u606D\u62F1\u63A7\u653B\u73D9\u7A7A\u86A3\u8CA2\u978F\u4E32\u5BE1\u6208\u679C\u74DC"],
      ["cea1", "\u79D1\u83D3\u8A87\u8AB2\u8DE8\u904E\u934B\u9846\u5ED3\u69E8\u85FF\u90ED\uF905\u51A0\u5B98\u5BEC\u6163\u68FA\u6B3E\u704C\u742F\u74D8\u7BA1\u7F50\u83C5\u89C0\u8CAB\u95DC\u9928\u522E\u605D\u62EC\u9002\u4F8A\u5149\u5321\u58D9\u5EE3\u66E0\u6D38\u709A\u72C2\u73D6\u7B50\u80F1\u945B\u5366\u639B\u7F6B\u4E56\u5080\u584A\u58DE\u602A\u6127\u62D0\u69D0\u9B41\u5B8F\u7D18\u80B1\u8F5F\u4EA4\u50D1\u54AC\u55AC\u5B0C\u5DA0\u5DE7\u652A\u654E\u6821\u6A4B\u72E1\u768E\u77EF\u7D5E\u7FF9\u81A0\u854E\u86DF\u8F03\u8F4E\u90CA\u9903\u9A55\u9BAB\u4E18\u4E45\u4E5D\u4EC7\u4FF1\u5177\u52FE"],
      ["cfa1", "\u5340\u53E3\u53E5\u548E\u5614\u5775\u57A2\u5BC7\u5D87\u5ED0\u61FC\u62D8\u6551\u67B8\u67E9\u69CB\u6B50\u6BC6\u6BEC\u6C42\u6E9D\u7078\u72D7\u7396\u7403\u77BF\u77E9\u7A76\u7D7F\u8009\u81FC\u8205\u820A\u82DF\u8862\u8B33\u8CFC\u8EC0\u9011\u90B1\u9264\u92B6\u99D2\u9A45\u9CE9\u9DD7\u9F9C\u570B\u5C40\u83CA\u97A0\u97AB\u9EB4\u541B\u7A98\u7FA4\u88D9\u8ECD\u90E1\u5800\u5C48\u6398\u7A9F\u5BAE\u5F13\u7A79\u7AAE\u828E\u8EAC\u5026\u5238\u52F8\u5377\u5708\u62F3\u6372\u6B0A\u6DC3\u7737\u53A5\u7357\u8568\u8E76\u95D5\u673A\u6AC3\u6F70\u8A6D\u8ECC\u994B\uF906\u6677\u6B78\u8CB4"],
      ["d0a1", "\u9B3C\uF907\u53EB\u572D\u594E\u63C6\u69FB\u73EA\u7845\u7ABA\u7AC5\u7CFE\u8475\u898F\u8D73\u9035\u95A8\u52FB\u5747\u7547\u7B60\u83CC\u921E\uF908\u6A58\u514B\u524B\u5287\u621F\u68D8\u6975\u9699\u50C5\u52A4\u52E4\u61C3\u65A4\u6839\u69FF\u747E\u7B4B\u82B9\u83EB\u89B2\u8B39\u8FD1\u9949\uF909\u4ECA\u5997\u64D2\u6611\u6A8E\u7434\u7981\u79BD\u82A9\u887E\u887F\u895F\uF90A\u9326\u4F0B\u53CA\u6025\u6271\u6C72\u7D1A\u7D66\u4E98\u5162\u77DC\u80AF\u4F01\u4F0E\u5176\u5180\u55DC\u5668\u573B\u57FA\u57FC\u5914\u5947\u5993\u5BC4\u5C90\u5D0E\u5DF1\u5E7E\u5FCC\u6280\u65D7\u65E3"],
      ["d1a1", "\u671E\u671F\u675E\u68CB\u68C4\u6A5F\u6B3A\u6C23\u6C7D\u6C82\u6DC7\u7398\u7426\u742A\u7482\u74A3\u7578\u757F\u7881\u78EF\u7941\u7947\u7948\u797A\u7B95\u7D00\u7DBA\u7F88\u8006\u802D\u808C\u8A18\u8B4F\u8C48\u8D77\u9321\u9324\u98E2\u9951\u9A0E\u9A0F\u9A65\u9E92\u7DCA\u4F76\u5409\u62EE\u6854\u91D1\u55AB\u513A\uF90B\uF90C\u5A1C\u61E6\uF90D\u62CF\u62FF\uF90E", 5, "\u90A3\uF914", 4, "\u8AFE\uF919\uF91A\uF91B\uF91C\u6696\uF91D\u7156\uF91E\uF91F\u96E3\uF920\u634F\u637A\u5357\uF921\u678F\u6960\u6E73\uF922\u7537\uF923\uF924\uF925"],
      ["d2a1", "\u7D0D\uF926\uF927\u8872\u56CA\u5A18\uF928", 4, "\u4E43\uF92D\u5167\u5948\u67F0\u8010\uF92E\u5973\u5E74\u649A\u79CA\u5FF5\u606C\u62C8\u637B\u5BE7\u5BD7\u52AA\uF92F\u5974\u5F29\u6012\uF930\uF931\uF932\u7459\uF933", 5, "\u99D1\uF939", 10, "\u6FC3\uF944\uF945\u81BF\u8FB2\u60F1\uF946\uF947\u8166\uF948\uF949\u5C3F\uF94A", 7, "\u5AE9\u8A25\u677B\u7D10\uF952", 5, "\u80FD\uF958\uF959\u5C3C\u6CE5\u533F\u6EBA\u591A\u8336"],
      ["d3a1", "\u4E39\u4EB6\u4F46\u55AE\u5718\u58C7\u5F56\u65B7\u65E6\u6A80\u6BB5\u6E4D\u77ED\u7AEF\u7C1E\u7DDE\u86CB\u8892\u9132\u935B\u64BB\u6FBE\u737A\u75B8\u9054\u5556\u574D\u61BA\u64D4\u66C7\u6DE1\u6E5B\u6F6D\u6FB9\u75F0\u8043\u81BD\u8541\u8983\u8AC7\u8B5A\u931F\u6C93\u7553\u7B54\u8E0F\u905D\u5510\u5802\u5858\u5E62\u6207\u649E\u68E0\u7576\u7CD6\u87B3\u9EE8\u4EE3\u5788\u576E\u5927\u5C0D\u5CB1\u5E36\u5F85\u6234\u64E1\u73B3\u81FA\u888B\u8CB8\u968A\u9EDB\u5B85\u5FB7\u60B3\u5012\u5200\u5230\u5716\u5835\u5857\u5C0E\u5C60\u5CF6\u5D8B\u5EA6\u5F92\u60BC\u6311\u6389\u6417\u6843"],
      ["d4a1", "\u68F9\u6AC2\u6DD8\u6E21\u6ED4\u6FE4\u71FE\u76DC\u7779\u79B1\u7A3B\u8404\u89A9\u8CED\u8DF3\u8E48\u9003\u9014\u9053\u90FD\u934D\u9676\u97DC\u6BD2\u7006\u7258\u72A2\u7368\u7763\u79BF\u7BE4\u7E9B\u8B80\u58A9\u60C7\u6566\u65FD\u66BE\u6C8C\u711E\u71C9\u8C5A\u9813\u4E6D\u7A81\u4EDD\u51AC\u51CD\u52D5\u540C\u61A7\u6771\u6850\u68DF\u6D1E\u6F7C\u75BC\u77B3\u7AE5\u80F4\u8463\u9285\u515C\u6597\u675C\u6793\u75D8\u7AC7\u8373\uF95A\u8C46\u9017\u982D\u5C6F\u81C0\u829A\u9041\u906F\u920D\u5F97\u5D9D\u6A59\u71C8\u767B\u7B49\u85E4\u8B04\u9127\u9A30\u5587\u61F6\uF95B\u7669\u7F85"],
      ["d5a1", "\u863F\u87BA\u88F8\u908F\uF95C\u6D1B\u70D9\u73DE\u7D61\u843D\uF95D\u916A\u99F1\uF95E\u4E82\u5375\u6B04\u6B12\u703E\u721B\u862D\u9E1E\u524C\u8FA3\u5D50\u64E5\u652C\u6B16\u6FEB\u7C43\u7E9C\u85CD\u8964\u89BD\u62C9\u81D8\u881F\u5ECA\u6717\u6D6A\u72FC\u7405\u746F\u8782\u90DE\u4F86\u5D0D\u5FA0\u840A\u51B7\u63A0\u7565\u4EAE\u5006\u5169\u51C9\u6881\u6A11\u7CAE\u7CB1\u7CE7\u826F\u8AD2\u8F1B\u91CF\u4FB6\u5137\u52F5\u5442\u5EEC\u616E\u623E\u65C5\u6ADA\u6FFE\u792A\u85DC\u8823\u95AD\u9A62\u9A6A\u9E97\u9ECE\u529B\u66C6\u6B77\u701D\u792B\u8F62\u9742\u6190\u6200\u6523\u6F23"],
      ["d6a1", "\u7149\u7489\u7DF4\u806F\u84EE\u8F26\u9023\u934A\u51BD\u5217\u52A3\u6D0C\u70C8\u88C2\u5EC9\u6582\u6BAE\u6FC2\u7C3E\u7375\u4EE4\u4F36\u56F9\uF95F\u5CBA\u5DBA\u601C\u73B2\u7B2D\u7F9A\u7FCE\u8046\u901E\u9234\u96F6\u9748\u9818\u9F61\u4F8B\u6FA7\u79AE\u91B4\u96B7\u52DE\uF960\u6488\u64C4\u6AD3\u6F5E\u7018\u7210\u76E7\u8001\u8606\u865C\u8DEF\u8F05\u9732\u9B6F\u9DFA\u9E75\u788C\u797F\u7DA0\u83C9\u9304\u9E7F\u9E93\u8AD6\u58DF\u5F04\u6727\u7027\u74CF\u7C60\u807E\u5121\u7028\u7262\u78CA\u8CC2\u8CDA\u8CF4\u96F7\u4E86\u50DA\u5BEE\u5ED6\u6599\u71CE\u7642\u77AD\u804A\u84FC"],
      ["d7a1", "\u907C\u9B27\u9F8D\u58D8\u5A41\u5C62\u6A13\u6DDA\u6F0F\u763B\u7D2F\u7E37\u851E\u8938\u93E4\u964B\u5289\u65D2\u67F3\u69B4\u6D41\u6E9C\u700F\u7409\u7460\u7559\u7624\u786B\u8B2C\u985E\u516D\u622E\u9678\u4F96\u502B\u5D19\u6DEA\u7DB8\u8F2A\u5F8B\u6144\u6817\uF961\u9686\u52D2\u808B\u51DC\u51CC\u695E\u7A1C\u7DBE\u83F1\u9675\u4FDA\u5229\u5398\u540F\u550E\u5C65\u60A7\u674E\u68A8\u6D6C\u7281\u72F8\u7406\u7483\uF962\u75E2\u7C6C\u7F79\u7FB8\u8389\u88CF\u88E1\u91CC\u91D0\u96E2\u9BC9\u541D\u6F7E\u71D0\u7498\u85FA\u8EAA\u96A3\u9C57\u9E9F\u6797\u6DCB\u7433\u81E8\u9716\u782C"],
      ["d8a1", "\u7ACB\u7B20\u7C92\u6469\u746A\u75F2\u78BC\u78E8\u99AC\u9B54\u9EBB\u5BDE\u5E55\u6F20\u819C\u83AB\u9088\u4E07\u534D\u5A29\u5DD2\u5F4E\u6162\u633D\u6669\u66FC\u6EFF\u6F2B\u7063\u779E\u842C\u8513\u883B\u8F13\u9945\u9C3B\u551C\u62B9\u672B\u6CAB\u8309\u896A\u977A\u4EA1\u5984\u5FD8\u5FD9\u671B\u7DB2\u7F54\u8292\u832B\u83BD\u8F1E\u9099\u57CB\u59B9\u5A92\u5BD0\u6627\u679A\u6885\u6BCF\u7164\u7F75\u8CB7\u8CE3\u9081\u9B45\u8108\u8C8A\u964C\u9A40\u9EA5\u5B5F\u6C13\u731B\u76F2\u76DF\u840C\u51AA\u8993\u514D\u5195\u52C9\u68C9\u6C94\u7704\u7720\u7DBF\u7DEC\u9762\u9EB5\u6EC5"],
      ["d9a1", "\u8511\u51A5\u540D\u547D\u660E\u669D\u6927\u6E9F\u76BF\u7791\u8317\u84C2\u879F\u9169\u9298\u9CF4\u8882\u4FAE\u5192\u52DF\u59C6\u5E3D\u6155\u6478\u6479\u66AE\u67D0\u6A21\u6BCD\u6BDB\u725F\u7261\u7441\u7738\u77DB\u8017\u82BC\u8305\u8B00\u8B28\u8C8C\u6728\u6C90\u7267\u76EE\u7766\u7A46\u9DA9\u6B7F\u6C92\u5922\u6726\u8499\u536F\u5893\u5999\u5EDF\u63CF\u6634\u6773\u6E3A\u732B\u7AD7\u82D7\u9328\u52D9\u5DEB\u61AE\u61CB\u620A\u62C7\u64AB\u65E0\u6959\u6B66\u6BCB\u7121\u73F7\u755D\u7E46\u821E\u8302\u856A\u8AA3\u8CBF\u9727\u9D61\u58A8\u9ED8\u5011\u520E\u543B\u554F\u6587"],
      ["daa1", "\u6C76\u7D0A\u7D0B\u805E\u868A\u9580\u96EF\u52FF\u6C95\u7269\u5473\u5A9A\u5C3E\u5D4B\u5F4C\u5FAE\u672A\u68B6\u6963\u6E3C\u6E44\u7709\u7C73\u7F8E\u8587\u8B0E\u8FF7\u9761\u9EF4\u5CB7\u60B6\u610D\u61AB\u654F\u65FB\u65FC\u6C11\u6CEF\u739F\u73C9\u7DE1\u9594\u5BC6\u871C\u8B10\u525D\u535A\u62CD\u640F\u64B2\u6734\u6A38\u6CCA\u73C0\u749E\u7B94\u7C95\u7E1B\u818A\u8236\u8584\u8FEB\u96F9\u99C1\u4F34\u534A\u53CD\u53DB\u62CC\u642C\u6500\u6591\u69C3\u6CEE\u6F58\u73ED\u7554\u7622\u76E4\u76FC\u78D0\u78FB\u792C\u7D46\u822C\u87E0\u8FD4\u9812\u98EF\u52C3\u62D4\u64A5\u6E24\u6F51"],
      ["dba1", "\u767C\u8DCB\u91B1\u9262\u9AEE\u9B43\u5023\u508D\u574A\u59A8\u5C28\u5E47\u5F77\u623F\u653E\u65B9\u65C1\u6609\u678B\u699C\u6EC2\u78C5\u7D21\u80AA\u8180\u822B\u82B3\u84A1\u868C\u8A2A\u8B17\u90A6\u9632\u9F90\u500D\u4FF3\uF963\u57F9\u5F98\u62DC\u6392\u676F\u6E43\u7119\u76C3\u80CC\u80DA\u88F4\u88F5\u8919\u8CE0\u8F29\u914D\u966A\u4F2F\u4F70\u5E1B\u67CF\u6822\u767D\u767E\u9B44\u5E61\u6A0A\u7169\u71D4\u756A\uF964\u7E41\u8543\u85E9\u98DC\u4F10\u7B4F\u7F70\u95A5\u51E1\u5E06\u68B5\u6C3E\u6C4E\u6CDB\u72AF\u7BC4\u8303\u6CD5\u743A\u50FB\u5288\u58C1\u64D8\u6A97\u74A7\u7656"],
      ["dca1", "\u78A7\u8617\u95E2\u9739\uF965\u535E\u5F01\u8B8A\u8FA8\u8FAF\u908A\u5225\u77A5\u9C49\u9F08\u4E19\u5002\u5175\u5C5B\u5E77\u661E\u663A\u67C4\u68C5\u70B3\u7501\u75C5\u79C9\u7ADD\u8F27\u9920\u9A08\u4FDD\u5821\u5831\u5BF6\u666E\u6B65\u6D11\u6E7A\u6F7D\u73E4\u752B\u83E9\u88DC\u8913\u8B5C\u8F14\u4F0F\u50D5\u5310\u535C\u5B93\u5FA9\u670D\u798F\u8179\u832F\u8514\u8907\u8986\u8F39\u8F3B\u99A5\u9C12\u672C\u4E76\u4FF8\u5949\u5C01\u5CEF\u5CF0\u6367\u68D2\u70FD\u71A2\u742B\u7E2B\u84EC\u8702\u9022\u92D2\u9CF3\u4E0D\u4ED8\u4FEF\u5085\u5256\u526F\u5426\u5490\u57E0\u592B\u5A66"],
      ["dda1", "\u5B5A\u5B75\u5BCC\u5E9C\uF966\u6276\u6577\u65A7\u6D6E\u6EA5\u7236\u7B26\u7C3F\u7F36\u8150\u8151\u819A\u8240\u8299\u83A9\u8A03\u8CA0\u8CE6\u8CFB\u8D74\u8DBA\u90E8\u91DC\u961C\u9644\u99D9\u9CE7\u5317\u5206\u5429\u5674\u58B3\u5954\u596E\u5FFF\u61A4\u626E\u6610\u6C7E\u711A\u76C6\u7C89\u7CDE\u7D1B\u82AC\u8CC1\u96F0\uF967\u4F5B\u5F17\u5F7F\u62C2\u5D29\u670B\u68DA\u787C\u7E43\u9D6C\u4E15\u5099\u5315\u532A\u5351\u5983\u5A62\u5E87\u60B2\u618A\u6249\u6279\u6590\u6787\u69A7\u6BD4\u6BD6\u6BD7\u6BD8\u6CB8\uF968\u7435\u75FA\u7812\u7891\u79D5\u79D8\u7C83\u7DCB\u7FE1\u80A5"],
      ["dea1", "\u813E\u81C2\u83F2\u871A\u88E8\u8AB9\u8B6C\u8CBB\u9119\u975E\u98DB\u9F3B\u56AC\u5B2A\u5F6C\u658C\u6AB3\u6BAF\u6D5C\u6FF1\u7015\u725D\u73AD\u8CA7\u8CD3\u983B\u6191\u6C37\u8058\u9A01\u4E4D\u4E8B\u4E9B\u4ED5\u4F3A\u4F3C\u4F7F\u4FDF\u50FF\u53F2\u53F8\u5506\u55E3\u56DB\u58EB\u5962\u5A11\u5BEB\u5BFA\u5C04\u5DF3\u5E2B\u5F99\u601D\u6368\u659C\u65AF\u67F6\u67FB\u68AD\u6B7B\u6C99\u6CD7\u6E23\u7009\u7345\u7802\u793E\u7940\u7960\u79C1\u7BE9\u7D17\u7D72\u8086\u820D\u838E\u84D1\u86C7\u88DF\u8A50\u8A5E\u8B1D\u8CDC\u8D66\u8FAD\u90AA\u98FC\u99DF\u9E9D\u524A\uF969\u6714\uF96A"],
      ["dfa1", "\u5098\u522A\u5C71\u6563\u6C55\u73CA\u7523\u759D\u7B97\u849C\u9178\u9730\u4E77\u6492\u6BBA\u715E\u85A9\u4E09\uF96B\u6749\u68EE\u6E17\u829F\u8518\u886B\u63F7\u6F81\u9212\u98AF\u4E0A\u50B7\u50CF\u511F\u5546\u55AA\u5617\u5B40\u5C19\u5CE0\u5E38\u5E8A\u5EA0\u5EC2\u60F3\u6851\u6A61\u6E58\u723D\u7240\u72C0\u76F8\u7965\u7BB1\u7FD4\u88F3\u89F4\u8A73\u8C61\u8CDE\u971C\u585E\u74BD\u8CFD\u55C7\uF96C\u7A61\u7D22\u8272\u7272\u751F\u7525\uF96D\u7B19\u5885\u58FB\u5DBC\u5E8F\u5EB6\u5F90\u6055\u6292\u637F\u654D\u6691\u66D9\u66F8\u6816\u68F2\u7280\u745E\u7B6E\u7D6E\u7DD6\u7F72"],
      ["e0a1", "\u80E5\u8212\u85AF\u897F\u8A93\u901D\u92E4\u9ECD\u9F20\u5915\u596D\u5E2D\u60DC\u6614\u6673\u6790\u6C50\u6DC5\u6F5F\u77F3\u78A9\u84C6\u91CB\u932B\u4ED9\u50CA\u5148\u5584\u5B0B\u5BA3\u6247\u657E\u65CB\u6E32\u717D\u7401\u7444\u7487\u74BF\u766C\u79AA\u7DDA\u7E55\u7FA8\u817A\u81B3\u8239\u861A\u87EC\u8A75\u8DE3\u9078\u9291\u9425\u994D\u9BAE\u5368\u5C51\u6954\u6CC4\u6D29\u6E2B\u820C\u859B\u893B\u8A2D\u8AAA\u96EA\u9F67\u5261\u66B9\u6BB2\u7E96\u87FE\u8D0D\u9583\u965D\u651D\u6D89\u71EE\uF96E\u57CE\u59D3\u5BAC\u6027\u60FA\u6210\u661F\u665F\u7329\u73F9\u76DB\u7701\u7B6C"],
      ["e1a1", "\u8056\u8072\u8165\u8AA0\u9192\u4E16\u52E2\u6B72\u6D17\u7A05\u7B39\u7D30\uF96F\u8CB0\u53EC\u562F\u5851\u5BB5\u5C0F\u5C11\u5DE2\u6240\u6383\u6414\u662D\u68B3\u6CBC\u6D88\u6EAF\u701F\u70A4\u71D2\u7526\u758F\u758E\u7619\u7B11\u7BE0\u7C2B\u7D20\u7D39\u852C\u856D\u8607\u8A34\u900D\u9061\u90B5\u92B7\u97F6\u9A37\u4FD7\u5C6C\u675F\u6D91\u7C9F\u7E8C\u8B16\u8D16\u901F\u5B6B\u5DFD\u640D\u84C0\u905C\u98E1\u7387\u5B8B\u609A\u677E\u6DDE\u8A1F\u8AA6\u9001\u980C\u5237\uF970\u7051\u788E\u9396\u8870\u91D7\u4FEE\u53D7\u55FD\u56DA\u5782\u58FD\u5AC2\u5B88\u5CAB\u5CC0\u5E25\u6101"],
      ["e2a1", "\u620D\u624B\u6388\u641C\u6536\u6578\u6A39\u6B8A\u6C34\u6D19\u6F31\u71E7\u72E9\u7378\u7407\u74B2\u7626\u7761\u79C0\u7A57\u7AEA\u7CB9\u7D8F\u7DAC\u7E61\u7F9E\u8129\u8331\u8490\u84DA\u85EA\u8896\u8AB0\u8B90\u8F38\u9042\u9083\u916C\u9296\u92B9\u968B\u96A7\u96A8\u96D6\u9700\u9808\u9996\u9AD3\u9B1A\u53D4\u587E\u5919\u5B70\u5BBF\u6DD1\u6F5A\u719F\u7421\u74B9\u8085\u83FD\u5DE1\u5F87\u5FAA\u6042\u65EC\u6812\u696F\u6A53\u6B89\u6D35\u6DF3\u73E3\u76FE\u77AC\u7B4D\u7D14\u8123\u821C\u8340\u84F4\u8563\u8A62\u8AC4\u9187\u931E\u9806\u99B4\u620C\u8853\u8FF0\u9265\u5D07\u5D27"],
      ["e3a1", "\u5D69\u745F\u819D\u8768\u6FD5\u62FE\u7FD2\u8936\u8972\u4E1E\u4E58\u50E7\u52DD\u5347\u627F\u6607\u7E69\u8805\u965E\u4F8D\u5319\u5636\u59CB\u5AA4\u5C38\u5C4E\u5C4D\u5E02\u5F11\u6043\u65BD\u662F\u6642\u67BE\u67F4\u731C\u77E2\u793A\u7FC5\u8494\u84CD\u8996\u8A66\u8A69\u8AE1\u8C55\u8C7A\u57F4\u5BD4\u5F0F\u606F\u62ED\u690D\u6B96\u6E5C\u7184\u7BD2\u8755\u8B58\u8EFE\u98DF\u98FE\u4F38\u4F81\u4FE1\u547B\u5A20\u5BB8\u613C\u65B0\u6668\u71FC\u7533\u795E\u7D33\u814E\u81E3\u8398\u85AA\u85CE\u8703\u8A0A\u8EAB\u8F9B\uF971\u8FC5\u5931\u5BA4\u5BE6\u6089\u5BE9\u5C0B\u5FC3\u6C81"],
      ["e4a1", "\uF972\u6DF1\u700B\u751A\u82AF\u8AF6\u4EC0\u5341\uF973\u96D9\u6C0F\u4E9E\u4FC4\u5152\u555E\u5A25\u5CE8\u6211\u7259\u82BD\u83AA\u86FE\u8859\u8A1D\u963F\u96C5\u9913\u9D09\u9D5D\u580A\u5CB3\u5DBD\u5E44\u60E1\u6115\u63E1\u6A02\u6E25\u9102\u9354\u984E\u9C10\u9F77\u5B89\u5CB8\u6309\u664F\u6848\u773C\u96C1\u978D\u9854\u9B9F\u65A1\u8B01\u8ECB\u95BC\u5535\u5CA9\u5DD6\u5EB5\u6697\u764C\u83F4\u95C7\u58D3\u62BC\u72CE\u9D28\u4EF0\u592E\u600F\u663B\u6B83\u79E7\u9D26\u5393\u54C0\u57C3\u5D16\u611B\u66D6\u6DAF\u788D\u827E\u9698\u9744\u5384\u627C\u6396\u6DB2\u7E0A\u814B\u984D"],
      ["e5a1", "\u6AFB\u7F4C\u9DAF\u9E1A\u4E5F\u503B\u51B6\u591C\u60F9\u63F6\u6930\u723A\u8036\uF974\u91CE\u5F31\uF975\uF976\u7D04\u82E5\u846F\u84BB\u85E5\u8E8D\uF977\u4F6F\uF978\uF979\u58E4\u5B43\u6059\u63DA\u6518\u656D\u6698\uF97A\u694A\u6A23\u6D0B\u7001\u716C\u75D2\u760D\u79B3\u7A70\uF97B\u7F8A\uF97C\u8944\uF97D\u8B93\u91C0\u967D\uF97E\u990A\u5704\u5FA1\u65BC\u6F01\u7600\u79A6\u8A9E\u99AD\u9B5A\u9F6C\u5104\u61B6\u6291\u6A8D\u81C6\u5043\u5830\u5F66\u7109\u8A00\u8AFA\u5B7C\u8616\u4FFA\u513C\u56B4\u5944\u63A9\u6DF9\u5DAA\u696D\u5186\u4E88\u4F59\uF97F\uF980\uF981\u5982\uF982"],
      ["e6a1", "\uF983\u6B5F\u6C5D\uF984\u74B5\u7916\uF985\u8207\u8245\u8339\u8F3F\u8F5D\uF986\u9918\uF987\uF988\uF989\u4EA6\uF98A\u57DF\u5F79\u6613\uF98B\uF98C\u75AB\u7E79\u8B6F\uF98D\u9006\u9A5B\u56A5\u5827\u59F8\u5A1F\u5BB4\uF98E\u5EF6\uF98F\uF990\u6350\u633B\uF991\u693D\u6C87\u6CBF\u6D8E\u6D93\u6DF5\u6F14\uF992\u70DF\u7136\u7159\uF993\u71C3\u71D5\uF994\u784F\u786F\uF995\u7B75\u7DE3\uF996\u7E2F\uF997\u884D\u8EDF\uF998\uF999\uF99A\u925B\uF99B\u9CF6\uF99C\uF99D\uF99E\u6085\u6D85\uF99F\u71B1\uF9A0\uF9A1\u95B1\u53AD\uF9A2\uF9A3\uF9A4\u67D3\uF9A5\u708E\u7130\u7430\u8276\u82D2"],
      ["e7a1", "\uF9A6\u95BB\u9AE5\u9E7D\u66C4\uF9A7\u71C1\u8449\uF9A8\uF9A9\u584B\uF9AA\uF9AB\u5DB8\u5F71\uF9AC\u6620\u668E\u6979\u69AE\u6C38\u6CF3\u6E36\u6F41\u6FDA\u701B\u702F\u7150\u71DF\u7370\uF9AD\u745B\uF9AE\u74D4\u76C8\u7A4E\u7E93\uF9AF\uF9B0\u82F1\u8A60\u8FCE\uF9B1\u9348\uF9B2\u9719\uF9B3\uF9B4\u4E42\u502A\uF9B5\u5208\u53E1\u66F3\u6C6D\u6FCA\u730A\u777F\u7A62\u82AE\u85DD\u8602\uF9B6\u88D4\u8A63\u8B7D\u8C6B\uF9B7\u92B3\uF9B8\u9713\u9810\u4E94\u4F0D\u4FC9\u50B2\u5348\u543E\u5433\u55DA\u5862\u58BA\u5967\u5A1B\u5BE4\u609F\uF9B9\u61CA\u6556\u65FF\u6664\u68A7\u6C5A\u6FB3"],
      ["e8a1", "\u70CF\u71AC\u7352\u7B7D\u8708\u8AA4\u9C32\u9F07\u5C4B\u6C83\u7344\u7389\u923A\u6EAB\u7465\u761F\u7A69\u7E15\u860A\u5140\u58C5\u64C1\u74EE\u7515\u7670\u7FC1\u9095\u96CD\u9954\u6E26\u74E6\u7AA9\u7AAA\u81E5\u86D9\u8778\u8A1B\u5A49\u5B8C\u5B9B\u68A1\u6900\u6D63\u73A9\u7413\u742C\u7897\u7DE9\u7FEB\u8118\u8155\u839E\u8C4C\u962E\u9811\u66F0\u5F80\u65FA\u6789\u6C6A\u738B\u502D\u5A03\u6B6A\u77EE\u5916\u5D6C\u5DCD\u7325\u754F\uF9BA\uF9BB\u50E5\u51F9\u582F\u592D\u5996\u59DA\u5BE5\uF9BC\uF9BD\u5DA2\u62D7\u6416\u6493\u64FE\uF9BE\u66DC\uF9BF\u6A48\uF9C0\u71FF\u7464\uF9C1"],
      ["e9a1", "\u7A88\u7AAF\u7E47\u7E5E\u8000\u8170\uF9C2\u87EF\u8981\u8B20\u9059\uF9C3\u9080\u9952\u617E\u6B32\u6D74\u7E1F\u8925\u8FB1\u4FD1\u50AD\u5197\u52C7\u57C7\u5889\u5BB9\u5EB8\u6142\u6995\u6D8C\u6E67\u6EB6\u7194\u7462\u7528\u752C\u8073\u8338\u84C9\u8E0A\u9394\u93DE\uF9C4\u4E8E\u4F51\u5076\u512A\u53C8\u53CB\u53F3\u5B87\u5BD3\u5C24\u611A\u6182\u65F4\u725B\u7397\u7440\u76C2\u7950\u7991\u79B9\u7D06\u7FBD\u828B\u85D5\u865E\u8FC2\u9047\u90F5\u91EA\u9685\u96E8\u96E9\u52D6\u5F67\u65ED\u6631\u682F\u715C\u7A36\u90C1\u980A\u4E91\uF9C5\u6A52\u6B9E\u6F90\u7189\u8018\u82B8\u8553"],
      ["eaa1", "\u904B\u9695\u96F2\u97FB\u851A\u9B31\u4E90\u718A\u96C4\u5143\u539F\u54E1\u5713\u5712\u57A3\u5A9B\u5AC4\u5BC3\u6028\u613F\u63F4\u6C85\u6D39\u6E72\u6E90\u7230\u733F\u7457\u82D1\u8881\u8F45\u9060\uF9C6\u9662\u9858\u9D1B\u6708\u8D8A\u925E\u4F4D\u5049\u50DE\u5371\u570D\u59D4\u5A01\u5C09\u6170\u6690\u6E2D\u7232\u744B\u7DEF\u80C3\u840E\u8466\u853F\u875F\u885B\u8918\u8B02\u9055\u97CB\u9B4F\u4E73\u4F91\u5112\u516A\uF9C7\u552F\u55A9\u5B7A\u5BA5\u5E7C\u5E7D\u5EBE\u60A0\u60DF\u6108\u6109\u63C4\u6538\u6709\uF9C8\u67D4\u67DA\uF9C9\u6961\u6962\u6CB9\u6D27\uF9CA\u6E38\uF9CB"],
      ["eba1", "\u6FE1\u7336\u7337\uF9CC\u745C\u7531\uF9CD\u7652\uF9CE\uF9CF\u7DAD\u81FE\u8438\u88D5\u8A98\u8ADB\u8AED\u8E30\u8E42\u904A\u903E\u907A\u9149\u91C9\u936E\uF9D0\uF9D1\u5809\uF9D2\u6BD3\u8089\u80B2\uF9D3\uF9D4\u5141\u596B\u5C39\uF9D5\uF9D6\u6F64\u73A7\u80E4\u8D07\uF9D7\u9217\u958F\uF9D8\uF9D9\uF9DA\uF9DB\u807F\u620E\u701C\u7D68\u878D\uF9DC\u57A0\u6069\u6147\u6BB7\u8ABE\u9280\u96B1\u4E59\u541F\u6DEB\u852D\u9670\u97F3\u98EE\u63D6\u6CE3\u9091\u51DD\u61C9\u81BA\u9DF9\u4F9D\u501A\u5100\u5B9C\u610F\u61FF\u64EC\u6905\u6BC5\u7591\u77E3\u7FA9\u8264\u858F\u87FB\u8863\u8ABC"],
      ["eca1", "\u8B70\u91AB\u4E8C\u4EE5\u4F0A\uF9DD\uF9DE\u5937\u59E8\uF9DF\u5DF2\u5F1B\u5F5B\u6021\uF9E0\uF9E1\uF9E2\uF9E3\u723E\u73E5\uF9E4\u7570\u75CD\uF9E5\u79FB\uF9E6\u800C\u8033\u8084\u82E1\u8351\uF9E7\uF9E8\u8CBD\u8CB3\u9087\uF9E9\uF9EA\u98F4\u990C\uF9EB\uF9EC\u7037\u76CA\u7FCA\u7FCC\u7FFC\u8B1A\u4EBA\u4EC1\u5203\u5370\uF9ED\u54BD\u56E0\u59FB\u5BC5\u5F15\u5FCD\u6E6E\uF9EE\uF9EF\u7D6A\u8335\uF9F0\u8693\u8A8D\uF9F1\u976D\u9777\uF9F2\uF9F3\u4E00\u4F5A\u4F7E\u58F9\u65E5\u6EA2\u9038\u93B0\u99B9\u4EFB\u58EC\u598A\u59D9\u6041\uF9F4\uF9F5\u7A14\uF9F6\u834F\u8CC3\u5165\u5344"],
      ["eda1", "\uF9F7\uF9F8\uF9F9\u4ECD\u5269\u5B55\u82BF\u4ED4\u523A\u54A8\u59C9\u59FF\u5B50\u5B57\u5B5C\u6063\u6148\u6ECB\u7099\u716E\u7386\u74F7\u75B5\u78C1\u7D2B\u8005\u81EA\u8328\u8517\u85C9\u8AEE\u8CC7\u96CC\u4F5C\u52FA\u56BC\u65AB\u6628\u707C\u70B8\u7235\u7DBD\u828D\u914C\u96C0\u9D72\u5B71\u68E7\u6B98\u6F7A\u76DE\u5C91\u66AB\u6F5B\u7BB4\u7C2A\u8836\u96DC\u4E08\u4ED7\u5320\u5834\u58BB\u58EF\u596C\u5C07\u5E33\u5E84\u5F35\u638C\u66B2\u6756\u6A1F\u6AA3\u6B0C\u6F3F\u7246\uF9FA\u7350\u748B\u7AE0\u7CA7\u8178\u81DF\u81E7\u838A\u846C\u8523\u8594\u85CF\u88DD\u8D13\u91AC\u9577"],
      ["eea1", "\u969C\u518D\u54C9\u5728\u5BB0\u624D\u6750\u683D\u6893\u6E3D\u6ED3\u707D\u7E21\u88C1\u8CA1\u8F09\u9F4B\u9F4E\u722D\u7B8F\u8ACD\u931A\u4F47\u4F4E\u5132\u5480\u59D0\u5E95\u62B5\u6775\u696E\u6A17\u6CAE\u6E1A\u72D9\u732A\u75BD\u7BB8\u7D35\u82E7\u83F9\u8457\u85F7\u8A5B\u8CAF\u8E87\u9019\u90B8\u96CE\u9F5F\u52E3\u540A\u5AE1\u5BC2\u6458\u6575\u6EF4\u72C4\uF9FB\u7684\u7A4D\u7B1B\u7C4D\u7E3E\u7FDF\u837B\u8B2B\u8CCA\u8D64\u8DE1\u8E5F\u8FEA\u8FF9\u9069\u93D1\u4F43\u4F7A\u50B3\u5168\u5178\u524D\u526A\u5861\u587C\u5960\u5C08\u5C55\u5EDB\u609B\u6230\u6813\u6BBF\u6C08\u6FB1"],
      ["efa1", "\u714E\u7420\u7530\u7538\u7551\u7672\u7B4C\u7B8B\u7BAD\u7BC6\u7E8F\u8A6E\u8F3E\u8F49\u923F\u9293\u9322\u942B\u96FB\u985A\u986B\u991E\u5207\u622A\u6298\u6D59\u7664\u7ACA\u7BC0\u7D76\u5360\u5CBE\u5E97\u6F38\u70B9\u7C98\u9711\u9B8E\u9EDE\u63A5\u647A\u8776\u4E01\u4E95\u4EAD\u505C\u5075\u5448\u59C3\u5B9A\u5E40\u5EAD\u5EF7\u5F81\u60C5\u633A\u653F\u6574\u65CC\u6676\u6678\u67FE\u6968\u6A89\u6B63\u6C40\u6DC0\u6DE8\u6E1F\u6E5E\u701E\u70A1\u738E\u73FD\u753A\u775B\u7887\u798E\u7A0B\u7A7D\u7CBE\u7D8E\u8247\u8A02\u8AEA\u8C9E\u912D\u914A\u91D8\u9266\u92CC\u9320\u9706\u9756"],
      ["f0a1", "\u975C\u9802\u9F0E\u5236\u5291\u557C\u5824\u5E1D\u5F1F\u608C\u63D0\u68AF\u6FDF\u796D\u7B2C\u81CD\u85BA\u88FD\u8AF8\u8E44\u918D\u9664\u969B\u973D\u984C\u9F4A\u4FCE\u5146\u51CB\u52A9\u5632\u5F14\u5F6B\u63AA\u64CD\u65E9\u6641\u66FA\u66F9\u671D\u689D\u68D7\u69FD\u6F15\u6F6E\u7167\u71E5\u722A\u74AA\u773A\u7956\u795A\u79DF\u7A20\u7A95\u7C97\u7CDF\u7D44\u7E70\u8087\u85FB\u86A4\u8A54\u8ABF\u8D99\u8E81\u9020\u906D\u91E3\u963B\u96D5\u9CE5\u65CF\u7C07\u8DB3\u93C3\u5B58\u5C0A\u5352\u62D9\u731D\u5027\u5B97\u5F9E\u60B0\u616B\u68D5\u6DD9\u742E\u7A2E\u7D42\u7D9C\u7E31\u816B"],
      ["f1a1", "\u8E2A\u8E35\u937E\u9418\u4F50\u5750\u5DE6\u5EA7\u632B\u7F6A\u4E3B\u4F4F\u4F8F\u505A\u59DD\u80C4\u546A\u5468\u55FE\u594F\u5B99\u5DDE\u5EDA\u665D\u6731\u67F1\u682A\u6CE8\u6D32\u6E4A\u6F8D\u70B7\u73E0\u7587\u7C4C\u7D02\u7D2C\u7DA2\u821F\u86DB\u8A3B\u8A85\u8D70\u8E8A\u8F33\u9031\u914E\u9152\u9444\u99D0\u7AF9\u7CA5\u4FCA\u5101\u51C6\u57C8\u5BEF\u5CFB\u6659\u6A3D\u6D5A\u6E96\u6FEC\u710C\u756F\u7AE3\u8822\u9021\u9075\u96CB\u99FF\u8301\u4E2D\u4EF2\u8846\u91CD\u537D\u6ADB\u696B\u6C41\u847A\u589E\u618E\u66FE\u62EF\u70DD\u7511\u75C7\u7E52\u84B8\u8B49\u8D08\u4E4B\u53EA"],
      ["f2a1", "\u54AB\u5730\u5740\u5FD7\u6301\u6307\u646F\u652F\u65E8\u667A\u679D\u67B3\u6B62\u6C60\u6C9A\u6F2C\u77E5\u7825\u7949\u7957\u7D19\u80A2\u8102\u81F3\u829D\u82B7\u8718\u8A8C\uF9FC\u8D04\u8DBE\u9072\u76F4\u7A19\u7A37\u7E54\u8077\u5507\u55D4\u5875\u632F\u6422\u6649\u664B\u686D\u699B\u6B84\u6D25\u6EB1\u73CD\u7468\u74A1\u755B\u75B9\u76E1\u771E\u778B\u79E6\u7E09\u7E1D\u81FB\u852F\u8897\u8A3A\u8CD1\u8EEB\u8FB0\u9032\u93AD\u9663\u9673\u9707\u4F84\u53F1\u59EA\u5AC9\u5E19\u684E\u74C6\u75BE\u79E9\u7A92\u81A3\u86ED\u8CEA\u8DCC\u8FED\u659F\u6715\uF9FD\u57F7\u6F57\u7DDD\u8F2F"],
      ["f3a1", "\u93F6\u96C6\u5FB5\u61F2\u6F84\u4E14\u4F98\u501F\u53C9\u55DF\u5D6F\u5DEE\u6B21\u6B64\u78CB\u7B9A\uF9FE\u8E49\u8ECA\u906E\u6349\u643E\u7740\u7A84\u932F\u947F\u9F6A\u64B0\u6FAF\u71E6\u74A8\u74DA\u7AC4\u7C12\u7E82\u7CB2\u7E98\u8B9A\u8D0A\u947D\u9910\u994C\u5239\u5BDF\u64E6\u672D\u7D2E\u50ED\u53C3\u5879\u6158\u6159\u61FA\u65AC\u7AD9\u8B92\u8B96\u5009\u5021\u5275\u5531\u5A3C\u5EE0\u5F70\u6134\u655E\u660C\u6636\u66A2\u69CD\u6EC4\u6F32\u7316\u7621\u7A93\u8139\u8259\u83D6\u84BC\u50B5\u57F0\u5BC0\u5BE8\u5F69\u63A1\u7826\u7DB5\u83DC\u8521\u91C7\u91F5\u518A\u67F5\u7B56"],
      ["f4a1", "\u8CAC\u51C4\u59BB\u60BD\u8655\u501C\uF9FF\u5254\u5C3A\u617D\u621A\u62D3\u64F2\u65A5\u6ECC\u7620\u810A\u8E60\u965F\u96BB\u4EDF\u5343\u5598\u5929\u5DDD\u64C5\u6CC9\u6DFA\u7394\u7A7F\u821B\u85A6\u8CE4\u8E10\u9077\u91E7\u95E1\u9621\u97C6\u51F8\u54F2\u5586\u5FB9\u64A4\u6F88\u7DB4\u8F1F\u8F4D\u9435\u50C9\u5C16\u6CBE\u6DFB\u751B\u77BB\u7C3D\u7C64\u8A79\u8AC2\u581E\u59BE\u5E16\u6377\u7252\u758A\u776B\u8ADC\u8CBC\u8F12\u5EF3\u6674\u6DF8\u807D\u83C1\u8ACB\u9751\u9BD6\uFA00\u5243\u66FF\u6D95\u6EEF\u7DE0\u8AE6\u902E\u905E\u9AD4\u521D\u527F\u54E8\u6194\u6284\u62DB\u68A2"],
      ["f5a1", "\u6912\u695A\u6A35\u7092\u7126\u785D\u7901\u790E\u79D2\u7A0D\u8096\u8278\u82D5\u8349\u8549\u8C82\u8D85\u9162\u918B\u91AE\u4FC3\u56D1\u71ED\u77D7\u8700\u89F8\u5BF8\u5FD6\u6751\u90A8\u53E2\u585A\u5BF5\u60A4\u6181\u6460\u7E3D\u8070\u8525\u9283\u64AE\u50AC\u5D14\u6700\u589C\u62BD\u63A8\u690E\u6978\u6A1E\u6E6B\u76BA\u79CB\u82BB\u8429\u8ACF\u8DA8\u8FFD\u9112\u914B\u919C\u9310\u9318\u939A\u96DB\u9A36\u9C0D\u4E11\u755C\u795D\u7AFA\u7B51\u7BC9\u7E2E\u84C4\u8E59\u8E74\u8EF8\u9010\u6625\u693F\u7443\u51FA\u672E\u9EDC\u5145\u5FE0\u6C96\u87F2\u885D\u8877\u60B4\u81B5\u8403"],
      ["f6a1", "\u8D05\u53D6\u5439\u5634\u5A36\u5C31\u708A\u7FE0\u805A\u8106\u81ED\u8DA3\u9189\u9A5F\u9DF2\u5074\u4EC4\u53A0\u60FB\u6E2C\u5C64\u4F88\u5024\u55E4\u5CD9\u5E5F\u6065\u6894\u6CBB\u6DC4\u71BE\u75D4\u75F4\u7661\u7A1A\u7A49\u7DC7\u7DFB\u7F6E\u81F4\u86A9\u8F1C\u96C9\u99B3\u9F52\u5247\u52C5\u98ED\u89AA\u4E03\u67D2\u6F06\u4FB5\u5BE2\u6795\u6C88\u6D78\u741B\u7827\u91DD\u937C\u87C4\u79E4\u7A31\u5FEB\u4ED6\u54A4\u553E\u58AE\u59A5\u60F0\u6253\u62D6\u6736\u6955\u8235\u9640\u99B1\u99DD\u502C\u5353\u5544\u577C\uFA01\u6258\uFA02\u64E2\u666B\u67DD\u6FC1\u6FEF\u7422\u7438\u8A17"],
      ["f7a1", "\u9438\u5451\u5606\u5766\u5F48\u619A\u6B4E\u7058\u70AD\u7DBB\u8A95\u596A\u812B\u63A2\u7708\u803D\u8CAA\u5854\u642D\u69BB\u5B95\u5E11\u6E6F\uFA03\u8569\u514C\u53F0\u592A\u6020\u614B\u6B86\u6C70\u6CF0\u7B1E\u80CE\u82D4\u8DC6\u90B0\u98B1\uFA04\u64C7\u6FA4\u6491\u6504\u514E\u5410\u571F\u8A0E\u615F\u6876\uFA05\u75DB\u7B52\u7D71\u901A\u5806\u69CC\u817F\u892A\u9000\u9839\u5078\u5957\u59AC\u6295\u900F\u9B2A\u615D\u7279\u95D6\u5761\u5A46\u5DF4\u628A\u64AD\u64FA\u6777\u6CE2\u6D3E\u722C\u7436\u7834\u7F77\u82AD\u8DDB\u9817\u5224\u5742\u677F\u7248\u74E3\u8CA9\u8FA6\u9211"],
      ["f8a1", "\u962A\u516B\u53ED\u634C\u4F69\u5504\u6096\u6557\u6C9B\u6D7F\u724C\u72FD\u7A17\u8987\u8C9D\u5F6D\u6F8E\u70F9\u81A8\u610E\u4FBF\u504F\u6241\u7247\u7BC7\u7DE8\u7FE9\u904D\u97AD\u9A19\u8CB6\u576A\u5E73\u67B0\u840D\u8A55\u5420\u5B16\u5E63\u5EE2\u5F0A\u6583\u80BA\u853D\u9589\u965B\u4F48\u5305\u530D\u530F\u5486\u54FA\u5703\u5E03\u6016\u629B\u62B1\u6355\uFA06\u6CE1\u6D66\u75B1\u7832\u80DE\u812F\u82DE\u8461\u84B2\u888D\u8912\u900B\u92EA\u98FD\u9B91\u5E45\u66B4\u66DD\u7011\u7206\uFA07\u4FF5\u527D\u5F6A\u6153\u6753\u6A19\u6F02\u74E2\u7968\u8868\u8C79\u98C7\u98C4\u9A43"],
      ["f9a1", "\u54C1\u7A1F\u6953\u8AF7\u8C4A\u98A8\u99AE\u5F7C\u62AB\u75B2\u76AE\u88AB\u907F\u9642\u5339\u5F3C\u5FC5\u6CCC\u73CC\u7562\u758B\u7B46\u82FE\u999D\u4E4F\u903C\u4E0B\u4F55\u53A6\u590F\u5EC8\u6630\u6CB3\u7455\u8377\u8766\u8CC0\u9050\u971E\u9C15\u58D1\u5B78\u8650\u8B14\u9DB4\u5BD2\u6068\u608D\u65F1\u6C57\u6F22\u6FA3\u701A\u7F55\u7FF0\u9591\u9592\u9650\u97D3\u5272\u8F44\u51FD\u542B\u54B8\u5563\u558A\u6ABB\u6DB5\u7DD8\u8266\u929C\u9677\u9E79\u5408\u54C8\u76D2\u86E4\u95A4\u95D4\u965C\u4EA2\u4F09\u59EE\u5AE6\u5DF7\u6052\u6297\u676D\u6841\u6C86\u6E2F\u7F38\u809B\u822A"],
      ["faa1", "\uFA08\uFA09\u9805\u4EA5\u5055\u54B3\u5793\u595A\u5B69\u5BB3\u61C8\u6977\u6D77\u7023\u87F9\u89E3\u8A72\u8AE7\u9082\u99ED\u9AB8\u52BE\u6838\u5016\u5E78\u674F\u8347\u884C\u4EAB\u5411\u56AE\u73E6\u9115\u97FF\u9909\u9957\u9999\u5653\u589F\u865B\u8A31\u61B2\u6AF6\u737B\u8ED2\u6B47\u96AA\u9A57\u5955\u7200\u8D6B\u9769\u4FD4\u5CF4\u5F26\u61F8\u665B\u6CEB\u70AB\u7384\u73B9\u73FE\u7729\u774D\u7D43\u7D62\u7E23\u8237\u8852\uFA0A\u8CE2\u9249\u986F\u5B51\u7A74\u8840\u9801\u5ACC\u4FE0\u5354\u593E\u5CFD\u633E\u6D79\u72F9\u8105\u8107\u83A2\u92CF\u9830\u4EA8\u5144\u5211\u578B"],
      ["fba1", "\u5F62\u6CC2\u6ECE\u7005\u7050\u70AF\u7192\u73E9\u7469\u834A\u87A2\u8861\u9008\u90A2\u93A3\u99A8\u516E\u5F57\u60E0\u6167\u66B3\u8559\u8E4A\u91AF\u978B\u4E4E\u4E92\u547C\u58D5\u58FA\u597D\u5CB5\u5F27\u6236\u6248\u660A\u6667\u6BEB\u6D69\u6DCF\u6E56\u6EF8\u6F94\u6FE0\u6FE9\u705D\u72D0\u7425\u745A\u74E0\u7693\u795C\u7CCA\u7E1E\u80E1\u82A6\u846B\u84BF\u864E\u865F\u8774\u8B77\u8C6A\u93AC\u9800\u9865\u60D1\u6216\u9177\u5A5A\u660F\u6DF7\u6E3E\u743F\u9B42\u5FFD\u60DA\u7B0F\u54C4\u5F18\u6C5E\u6CD3\u6D2A\u70D8\u7D05\u8679\u8A0C\u9D3B\u5316\u548C\u5B05\u6A3A\u706B\u7575"],
      ["fca1", "\u798D\u79BE\u82B1\u83EF\u8A71\u8B41\u8CA8\u9774\uFA0B\u64F4\u652B\u78BA\u78BB\u7A6B\u4E38\u559A\u5950\u5BA6\u5E7B\u60A3\u63DB\u6B61\u6665\u6853\u6E19\u7165\u74B0\u7D08\u9084\u9A69\u9C25\u6D3B\u6ED1\u733E\u8C41\u95CA\u51F0\u5E4C\u5FA8\u604D\u60F6\u6130\u614C\u6643\u6644\u69A5\u6CC1\u6E5F\u6EC9\u6F62\u714C\u749C\u7687\u7BC1\u7C27\u8352\u8757\u9051\u968D\u9EC3\u532F\u56DE\u5EFB\u5F8A\u6062\u6094\u61F7\u6666\u6703\u6A9C\u6DEE\u6FAE\u7070\u736A\u7E6A\u81BE\u8334\u86D4\u8AA8\u8CC4\u5283\u7372\u5B96\u6A6B\u9404\u54EE\u5686\u5B5D\u6548\u6585\u66C9\u689F\u6D8D\u6DC6"],
      ["fda1", "\u723B\u80B4\u9175\u9A4D\u4FAF\u5019\u539A\u540E\u543C\u5589\u55C5\u5E3F\u5F8C\u673D\u7166\u73DD\u9005\u52DB\u52F3\u5864\u58CE\u7104\u718F\u71FB\u85B0\u8A13\u6688\u85A8\u55A7\u6684\u714A\u8431\u5349\u5599\u6BC1\u5F59\u5FBD\u63EE\u6689\u7147\u8AF1\u8F1D\u9EBE\u4F11\u643A\u70CB\u7566\u8667\u6064\u8B4E\u9DF8\u5147\u51F6\u5308\u6D36\u80F8\u9ED1\u6615\u6B23\u7098\u75D5\u5403\u5C79\u7D07\u8A16\u6B20\u6B3D\u6B46\u5438\u6070\u6D3D\u7FD5\u8208\u50D6\u51DE\u559C\u566B\u56CD\u59EC\u5B09\u5E0C\u6199\u6198\u6231\u665E\u66E6\u7199\u71B9\u71BA\u72A7\u79A7\u7A00\u7FB2\u8A70"]
    ];
  }
});

// node_modules/iconv-lite/encodings/tables/cp950.json
var require_cp950 = __commonJS({
  "node_modules/iconv-lite/encodings/tables/cp950.json"(exports, module) {
    module.exports = [
      ["0", "\0", 127],
      ["a140", "\u3000\uFF0C\u3001\u3002\uFF0E\u2027\uFF1B\uFF1A\uFF1F\uFF01\uFE30\u2026\u2025\uFE50\uFE51\uFE52\xB7\uFE54\uFE55\uFE56\uFE57\uFF5C\u2013\uFE31\u2014\uFE33\u2574\uFE34\uFE4F\uFF08\uFF09\uFE35\uFE36\uFF5B\uFF5D\uFE37\uFE38\u3014\u3015\uFE39\uFE3A\u3010\u3011\uFE3B\uFE3C\u300A\u300B\uFE3D\uFE3E\u3008\u3009\uFE3F\uFE40\u300C\u300D\uFE41\uFE42\u300E\u300F\uFE43\uFE44\uFE59\uFE5A"],
      ["a1a1", "\uFE5B\uFE5C\uFE5D\uFE5E\u2018\u2019\u201C\u201D\u301D\u301E\u2035\u2032\uFF03\uFF06\uFF0A\u203B\xA7\u3003\u25CB\u25CF\u25B3\u25B2\u25CE\u2606\u2605\u25C7\u25C6\u25A1\u25A0\u25BD\u25BC\u32A3\u2105\xAF\uFFE3\uFF3F\u02CD\uFE49\uFE4A\uFE4D\uFE4E\uFE4B\uFE4C\uFE5F\uFE60\uFE61\uFF0B\uFF0D\xD7\xF7\xB1\u221A\uFF1C\uFF1E\uFF1D\u2266\u2267\u2260\u221E\u2252\u2261\uFE62", 4, "\uFF5E\u2229\u222A\u22A5\u2220\u221F\u22BF\u33D2\u33D1\u222B\u222E\u2235\u2234\u2640\u2642\u2295\u2299\u2191\u2193\u2190\u2192\u2196\u2197\u2199\u2198\u2225\u2223\uFF0F"],
      ["a240", "\uFF3C\u2215\uFE68\uFF04\uFFE5\u3012\uFFE0\uFFE1\uFF05\uFF20\u2103\u2109\uFE69\uFE6A\uFE6B\u33D5\u339C\u339D\u339E\u33CE\u33A1\u338E\u338F\u33C4\xB0\u5159\u515B\u515E\u515D\u5161\u5163\u55E7\u74E9\u7CCE\u2581", 7, "\u258F\u258E\u258D\u258C\u258B\u258A\u2589\u253C\u2534\u252C\u2524\u251C\u2594\u2500\u2502\u2595\u250C\u2510\u2514\u2518\u256D"],
      ["a2a1", "\u256E\u2570\u256F\u2550\u255E\u256A\u2561\u25E2\u25E3\u25E5\u25E4\u2571\u2572\u2573\uFF10", 9, "\u2160", 9, "\u3021", 8, "\u5341\u5344\u5345\uFF21", 25, "\uFF41", 21],
      ["a340", "\uFF57\uFF58\uFF59\uFF5A\u0391", 16, "\u03A3", 6, "\u03B1", 16, "\u03C3", 6, "\u3105", 10],
      ["a3a1", "\u3110", 25, "\u02D9\u02C9\u02CA\u02C7\u02CB"],
      ["a3e1", "\u20AC"],
      ["a440", "\u4E00\u4E59\u4E01\u4E03\u4E43\u4E5D\u4E86\u4E8C\u4EBA\u513F\u5165\u516B\u51E0\u5200\u5201\u529B\u5315\u5341\u535C\u53C8\u4E09\u4E0B\u4E08\u4E0A\u4E2B\u4E38\u51E1\u4E45\u4E48\u4E5F\u4E5E\u4E8E\u4EA1\u5140\u5203\u52FA\u5343\u53C9\u53E3\u571F\u58EB\u5915\u5927\u5973\u5B50\u5B51\u5B53\u5BF8\u5C0F\u5C22\u5C38\u5C71\u5DDD\u5DE5\u5DF1\u5DF2\u5DF3\u5DFE\u5E72\u5EFE\u5F0B\u5F13\u624D"],
      ["a4a1", "\u4E11\u4E10\u4E0D\u4E2D\u4E30\u4E39\u4E4B\u5C39\u4E88\u4E91\u4E95\u4E92\u4E94\u4EA2\u4EC1\u4EC0\u4EC3\u4EC6\u4EC7\u4ECD\u4ECA\u4ECB\u4EC4\u5143\u5141\u5167\u516D\u516E\u516C\u5197\u51F6\u5206\u5207\u5208\u52FB\u52FE\u52FF\u5316\u5339\u5348\u5347\u5345\u535E\u5384\u53CB\u53CA\u53CD\u58EC\u5929\u592B\u592A\u592D\u5B54\u5C11\u5C24\u5C3A\u5C6F\u5DF4\u5E7B\u5EFF\u5F14\u5F15\u5FC3\u6208\u6236\u624B\u624E\u652F\u6587\u6597\u65A4\u65B9\u65E5\u66F0\u6708\u6728\u6B20\u6B62\u6B79\u6BCB\u6BD4\u6BDB\u6C0F\u6C34\u706B\u722A\u7236\u723B\u7247\u7259\u725B\u72AC\u738B\u4E19"],
      ["a540", "\u4E16\u4E15\u4E14\u4E18\u4E3B\u4E4D\u4E4F\u4E4E\u4EE5\u4ED8\u4ED4\u4ED5\u4ED6\u4ED7\u4EE3\u4EE4\u4ED9\u4EDE\u5145\u5144\u5189\u518A\u51AC\u51F9\u51FA\u51F8\u520A\u52A0\u529F\u5305\u5306\u5317\u531D\u4EDF\u534A\u5349\u5361\u5360\u536F\u536E\u53BB\u53EF\u53E4\u53F3\u53EC\u53EE\u53E9\u53E8\u53FC\u53F8\u53F5\u53EB\u53E6\u53EA\u53F2\u53F1\u53F0\u53E5\u53ED\u53FB\u56DB\u56DA\u5916"],
      ["a5a1", "\u592E\u5931\u5974\u5976\u5B55\u5B83\u5C3C\u5DE8\u5DE7\u5DE6\u5E02\u5E03\u5E73\u5E7C\u5F01\u5F18\u5F17\u5FC5\u620A\u6253\u6254\u6252\u6251\u65A5\u65E6\u672E\u672C\u672A\u672B\u672D\u6B63\u6BCD\u6C11\u6C10\u6C38\u6C41\u6C40\u6C3E\u72AF\u7384\u7389\u74DC\u74E6\u7518\u751F\u7528\u7529\u7530\u7531\u7532\u7533\u758B\u767D\u76AE\u76BF\u76EE\u77DB\u77E2\u77F3\u793A\u79BE\u7A74\u7ACB\u4E1E\u4E1F\u4E52\u4E53\u4E69\u4E99\u4EA4\u4EA6\u4EA5\u4EFF\u4F09\u4F19\u4F0A\u4F15\u4F0D\u4F10\u4F11\u4F0F\u4EF2\u4EF6\u4EFB\u4EF0\u4EF3\u4EFD\u4F01\u4F0B\u5149\u5147\u5146\u5148\u5168"],
      ["a640", "\u5171\u518D\u51B0\u5217\u5211\u5212\u520E\u5216\u52A3\u5308\u5321\u5320\u5370\u5371\u5409\u540F\u540C\u540A\u5410\u5401\u540B\u5404\u5411\u540D\u5408\u5403\u540E\u5406\u5412\u56E0\u56DE\u56DD\u5733\u5730\u5728\u572D\u572C\u572F\u5729\u5919\u591A\u5937\u5938\u5984\u5978\u5983\u597D\u5979\u5982\u5981\u5B57\u5B58\u5B87\u5B88\u5B85\u5B89\u5BFA\u5C16\u5C79\u5DDE\u5E06\u5E76\u5E74"],
      ["a6a1", "\u5F0F\u5F1B\u5FD9\u5FD6\u620E\u620C\u620D\u6210\u6263\u625B\u6258\u6536\u65E9\u65E8\u65EC\u65ED\u66F2\u66F3\u6709\u673D\u6734\u6731\u6735\u6B21\u6B64\u6B7B\u6C16\u6C5D\u6C57\u6C59\u6C5F\u6C60\u6C50\u6C55\u6C61\u6C5B\u6C4D\u6C4E\u7070\u725F\u725D\u767E\u7AF9\u7C73\u7CF8\u7F36\u7F8A\u7FBD\u8001\u8003\u800C\u8012\u8033\u807F\u8089\u808B\u808C\u81E3\u81EA\u81F3\u81FC\u820C\u821B\u821F\u826E\u8272\u827E\u866B\u8840\u884C\u8863\u897F\u9621\u4E32\u4EA8\u4F4D\u4F4F\u4F47\u4F57\u4F5E\u4F34\u4F5B\u4F55\u4F30\u4F50\u4F51\u4F3D\u4F3A\u4F38\u4F43\u4F54\u4F3C\u4F46\u4F63"],
      ["a740", "\u4F5C\u4F60\u4F2F\u4F4E\u4F36\u4F59\u4F5D\u4F48\u4F5A\u514C\u514B\u514D\u5175\u51B6\u51B7\u5225\u5224\u5229\u522A\u5228\u52AB\u52A9\u52AA\u52AC\u5323\u5373\u5375\u541D\u542D\u541E\u543E\u5426\u544E\u5427\u5446\u5443\u5433\u5448\u5442\u541B\u5429\u544A\u5439\u543B\u5438\u542E\u5435\u5436\u5420\u543C\u5440\u5431\u542B\u541F\u542C\u56EA\u56F0\u56E4\u56EB\u574A\u5751\u5740\u574D"],
      ["a7a1", "\u5747\u574E\u573E\u5750\u574F\u573B\u58EF\u593E\u599D\u5992\u59A8\u599E\u59A3\u5999\u5996\u598D\u59A4\u5993\u598A\u59A5\u5B5D\u5B5C\u5B5A\u5B5B\u5B8C\u5B8B\u5B8F\u5C2C\u5C40\u5C41\u5C3F\u5C3E\u5C90\u5C91\u5C94\u5C8C\u5DEB\u5E0C\u5E8F\u5E87\u5E8A\u5EF7\u5F04\u5F1F\u5F64\u5F62\u5F77\u5F79\u5FD8\u5FCC\u5FD7\u5FCD\u5FF1\u5FEB\u5FF8\u5FEA\u6212\u6211\u6284\u6297\u6296\u6280\u6276\u6289\u626D\u628A\u627C\u627E\u6279\u6273\u6292\u626F\u6298\u626E\u6295\u6293\u6291\u6286\u6539\u653B\u6538\u65F1\u66F4\u675F\u674E\u674F\u6750\u6751\u675C\u6756\u675E\u6749\u6746\u6760"],
      ["a840", "\u6753\u6757\u6B65\u6BCF\u6C42\u6C5E\u6C99\u6C81\u6C88\u6C89\u6C85\u6C9B\u6C6A\u6C7A\u6C90\u6C70\u6C8C\u6C68\u6C96\u6C92\u6C7D\u6C83\u6C72\u6C7E\u6C74\u6C86\u6C76\u6C8D\u6C94\u6C98\u6C82\u7076\u707C\u707D\u7078\u7262\u7261\u7260\u72C4\u72C2\u7396\u752C\u752B\u7537\u7538\u7682\u76EF\u77E3\u79C1\u79C0\u79BF\u7A76\u7CFB\u7F55\u8096\u8093\u809D\u8098\u809B\u809A\u80B2\u826F\u8292"],
      ["a8a1", "\u828B\u828D\u898B\u89D2\u8A00\u8C37\u8C46\u8C55\u8C9D\u8D64\u8D70\u8DB3\u8EAB\u8ECA\u8F9B\u8FB0\u8FC2\u8FC6\u8FC5\u8FC4\u5DE1\u9091\u90A2\u90AA\u90A6\u90A3\u9149\u91C6\u91CC\u9632\u962E\u9631\u962A\u962C\u4E26\u4E56\u4E73\u4E8B\u4E9B\u4E9E\u4EAB\u4EAC\u4F6F\u4F9D\u4F8D\u4F73\u4F7F\u4F6C\u4F9B\u4F8B\u4F86\u4F83\u4F70\u4F75\u4F88\u4F69\u4F7B\u4F96\u4F7E\u4F8F\u4F91\u4F7A\u5154\u5152\u5155\u5169\u5177\u5176\u5178\u51BD\u51FD\u523B\u5238\u5237\u523A\u5230\u522E\u5236\u5241\u52BE\u52BB\u5352\u5354\u5353\u5351\u5366\u5377\u5378\u5379\u53D6\u53D4\u53D7\u5473\u5475"],
      ["a940", "\u5496\u5478\u5495\u5480\u547B\u5477\u5484\u5492\u5486\u547C\u5490\u5471\u5476\u548C\u549A\u5462\u5468\u548B\u547D\u548E\u56FA\u5783\u5777\u576A\u5769\u5761\u5766\u5764\u577C\u591C\u5949\u5947\u5948\u5944\u5954\u59BE\u59BB\u59D4\u59B9\u59AE\u59D1\u59C6\u59D0\u59CD\u59CB\u59D3\u59CA\u59AF\u59B3\u59D2\u59C5\u5B5F\u5B64\u5B63\u5B97\u5B9A\u5B98\u5B9C\u5B99\u5B9B\u5C1A\u5C48\u5C45"],
      ["a9a1", "\u5C46\u5CB7\u5CA1\u5CB8\u5CA9\u5CAB\u5CB1\u5CB3\u5E18\u5E1A\u5E16\u5E15\u5E1B\u5E11\u5E78\u5E9A\u5E97\u5E9C\u5E95\u5E96\u5EF6\u5F26\u5F27\u5F29\u5F80\u5F81\u5F7F\u5F7C\u5FDD\u5FE0\u5FFD\u5FF5\u5FFF\u600F\u6014\u602F\u6035\u6016\u602A\u6015\u6021\u6027\u6029\u602B\u601B\u6216\u6215\u623F\u623E\u6240\u627F\u62C9\u62CC\u62C4\u62BF\u62C2\u62B9\u62D2\u62DB\u62AB\u62D3\u62D4\u62CB\u62C8\u62A8\u62BD\u62BC\u62D0\u62D9\u62C7\u62CD\u62B5\u62DA\u62B1\u62D8\u62D6\u62D7\u62C6\u62AC\u62CE\u653E\u65A7\u65BC\u65FA\u6614\u6613\u660C\u6606\u6602\u660E\u6600\u660F\u6615\u660A"],
      ["aa40", "\u6607\u670D\u670B\u676D\u678B\u6795\u6771\u679C\u6773\u6777\u6787\u679D\u6797\u676F\u6770\u677F\u6789\u677E\u6790\u6775\u679A\u6793\u677C\u676A\u6772\u6B23\u6B66\u6B67\u6B7F\u6C13\u6C1B\u6CE3\u6CE8\u6CF3\u6CB1\u6CCC\u6CE5\u6CB3\u6CBD\u6CBE\u6CBC\u6CE2\u6CAB\u6CD5\u6CD3\u6CB8\u6CC4\u6CB9\u6CC1\u6CAE\u6CD7\u6CC5\u6CF1\u6CBF\u6CBB\u6CE1\u6CDB\u6CCA\u6CAC\u6CEF\u6CDC\u6CD6\u6CE0"],
      ["aaa1", "\u7095\u708E\u7092\u708A\u7099\u722C\u722D\u7238\u7248\u7267\u7269\u72C0\u72CE\u72D9\u72D7\u72D0\u73A9\u73A8\u739F\u73AB\u73A5\u753D\u759D\u7599\u759A\u7684\u76C2\u76F2\u76F4\u77E5\u77FD\u793E\u7940\u7941\u79C9\u79C8\u7A7A\u7A79\u7AFA\u7CFE\u7F54\u7F8C\u7F8B\u8005\u80BA\u80A5\u80A2\u80B1\u80A1\u80AB\u80A9\u80B4\u80AA\u80AF\u81E5\u81FE\u820D\u82B3\u829D\u8299\u82AD\u82BD\u829F\u82B9\u82B1\u82AC\u82A5\u82AF\u82B8\u82A3\u82B0\u82BE\u82B7\u864E\u8671\u521D\u8868\u8ECB\u8FCE\u8FD4\u8FD1\u90B5\u90B8\u90B1\u90B6\u91C7\u91D1\u9577\u9580\u961C\u9640\u963F\u963B\u9644"],
      ["ab40", "\u9642\u96B9\u96E8\u9752\u975E\u4E9F\u4EAD\u4EAE\u4FE1\u4FB5\u4FAF\u4FBF\u4FE0\u4FD1\u4FCF\u4FDD\u4FC3\u4FB6\u4FD8\u4FDF\u4FCA\u4FD7\u4FAE\u4FD0\u4FC4\u4FC2\u4FDA\u4FCE\u4FDE\u4FB7\u5157\u5192\u5191\u51A0\u524E\u5243\u524A\u524D\u524C\u524B\u5247\u52C7\u52C9\u52C3\u52C1\u530D\u5357\u537B\u539A\u53DB\u54AC\u54C0\u54A8\u54CE\u54C9\u54B8\u54A6\u54B3\u54C7\u54C2\u54BD\u54AA\u54C1"],
      ["aba1", "\u54C4\u54C8\u54AF\u54AB\u54B1\u54BB\u54A9\u54A7\u54BF\u56FF\u5782\u578B\u57A0\u57A3\u57A2\u57CE\u57AE\u5793\u5955\u5951\u594F\u594E\u5950\u59DC\u59D8\u59FF\u59E3\u59E8\u5A03\u59E5\u59EA\u59DA\u59E6\u5A01\u59FB\u5B69\u5BA3\u5BA6\u5BA4\u5BA2\u5BA5\u5C01\u5C4E\u5C4F\u5C4D\u5C4B\u5CD9\u5CD2\u5DF7\u5E1D\u5E25\u5E1F\u5E7D\u5EA0\u5EA6\u5EFA\u5F08\u5F2D\u5F65\u5F88\u5F85\u5F8A\u5F8B\u5F87\u5F8C\u5F89\u6012\u601D\u6020\u6025\u600E\u6028\u604D\u6070\u6068\u6062\u6046\u6043\u606C\u606B\u606A\u6064\u6241\u62DC\u6316\u6309\u62FC\u62ED\u6301\u62EE\u62FD\u6307\u62F1\u62F7"],
      ["ac40", "\u62EF\u62EC\u62FE\u62F4\u6311\u6302\u653F\u6545\u65AB\u65BD\u65E2\u6625\u662D\u6620\u6627\u662F\u661F\u6628\u6631\u6624\u66F7\u67FF\u67D3\u67F1\u67D4\u67D0\u67EC\u67B6\u67AF\u67F5\u67E9\u67EF\u67C4\u67D1\u67B4\u67DA\u67E5\u67B8\u67CF\u67DE\u67F3\u67B0\u67D9\u67E2\u67DD\u67D2\u6B6A\u6B83\u6B86\u6BB5\u6BD2\u6BD7\u6C1F\u6CC9\u6D0B\u6D32\u6D2A\u6D41\u6D25\u6D0C\u6D31\u6D1E\u6D17"],
      ["aca1", "\u6D3B\u6D3D\u6D3E\u6D36\u6D1B\u6CF5\u6D39\u6D27\u6D38\u6D29\u6D2E\u6D35\u6D0E\u6D2B\u70AB\u70BA\u70B3\u70AC\u70AF\u70AD\u70B8\u70AE\u70A4\u7230\u7272\u726F\u7274\u72E9\u72E0\u72E1\u73B7\u73CA\u73BB\u73B2\u73CD\u73C0\u73B3\u751A\u752D\u754F\u754C\u754E\u754B\u75AB\u75A4\u75A5\u75A2\u75A3\u7678\u7686\u7687\u7688\u76C8\u76C6\u76C3\u76C5\u7701\u76F9\u76F8\u7709\u770B\u76FE\u76FC\u7707\u77DC\u7802\u7814\u780C\u780D\u7946\u7949\u7948\u7947\u79B9\u79BA\u79D1\u79D2\u79CB\u7A7F\u7A81\u7AFF\u7AFD\u7C7D\u7D02\u7D05\u7D00\u7D09\u7D07\u7D04\u7D06\u7F38\u7F8E\u7FBF\u8004"],
      ["ad40", "\u8010\u800D\u8011\u8036\u80D6\u80E5\u80DA\u80C3\u80C4\u80CC\u80E1\u80DB\u80CE\u80DE\u80E4\u80DD\u81F4\u8222\u82E7\u8303\u8305\u82E3\u82DB\u82E6\u8304\u82E5\u8302\u8309\u82D2\u82D7\u82F1\u8301\u82DC\u82D4\u82D1\u82DE\u82D3\u82DF\u82EF\u8306\u8650\u8679\u867B\u867A\u884D\u886B\u8981\u89D4\u8A08\u8A02\u8A03\u8C9E\u8CA0\u8D74\u8D73\u8DB4\u8ECD\u8ECC\u8FF0\u8FE6\u8FE2\u8FEA\u8FE5"],
      ["ada1", "\u8FED\u8FEB\u8FE4\u8FE8\u90CA\u90CE\u90C1\u90C3\u914B\u914A\u91CD\u9582\u9650\u964B\u964C\u964D\u9762\u9769\u97CB\u97ED\u97F3\u9801\u98A8\u98DB\u98DF\u9996\u9999\u4E58\u4EB3\u500C\u500D\u5023\u4FEF\u5026\u5025\u4FF8\u5029\u5016\u5006\u503C\u501F\u501A\u5012\u5011\u4FFA\u5000\u5014\u5028\u4FF1\u5021\u500B\u5019\u5018\u4FF3\u4FEE\u502D\u502A\u4FFE\u502B\u5009\u517C\u51A4\u51A5\u51A2\u51CD\u51CC\u51C6\u51CB\u5256\u525C\u5254\u525B\u525D\u532A\u537F\u539F\u539D\u53DF\u54E8\u5510\u5501\u5537\u54FC\u54E5\u54F2\u5506\u54FA\u5514\u54E9\u54ED\u54E1\u5509\u54EE\u54EA"],
      ["ae40", "\u54E6\u5527\u5507\u54FD\u550F\u5703\u5704\u57C2\u57D4\u57CB\u57C3\u5809\u590F\u5957\u5958\u595A\u5A11\u5A18\u5A1C\u5A1F\u5A1B\u5A13\u59EC\u5A20\u5A23\u5A29\u5A25\u5A0C\u5A09\u5B6B\u5C58\u5BB0\u5BB3\u5BB6\u5BB4\u5BAE\u5BB5\u5BB9\u5BB8\u5C04\u5C51\u5C55\u5C50\u5CED\u5CFD\u5CFB\u5CEA\u5CE8\u5CF0\u5CF6\u5D01\u5CF4\u5DEE\u5E2D\u5E2B\u5EAB\u5EAD\u5EA7\u5F31\u5F92\u5F91\u5F90\u6059"],
      ["aea1", "\u6063\u6065\u6050\u6055\u606D\u6069\u606F\u6084\u609F\u609A\u608D\u6094\u608C\u6085\u6096\u6247\u62F3\u6308\u62FF\u634E\u633E\u632F\u6355\u6342\u6346\u634F\u6349\u633A\u6350\u633D\u632A\u632B\u6328\u634D\u634C\u6548\u6549\u6599\u65C1\u65C5\u6642\u6649\u664F\u6643\u6652\u664C\u6645\u6641\u66F8\u6714\u6715\u6717\u6821\u6838\u6848\u6846\u6853\u6839\u6842\u6854\u6829\u68B3\u6817\u684C\u6851\u683D\u67F4\u6850\u6840\u683C\u6843\u682A\u6845\u6813\u6818\u6841\u6B8A\u6B89\u6BB7\u6C23\u6C27\u6C28\u6C26\u6C24\u6CF0\u6D6A\u6D95\u6D88\u6D87\u6D66\u6D78\u6D77\u6D59\u6D93"],
      ["af40", "\u6D6C\u6D89\u6D6E\u6D5A\u6D74\u6D69\u6D8C\u6D8A\u6D79\u6D85\u6D65\u6D94\u70CA\u70D8\u70E4\u70D9\u70C8\u70CF\u7239\u7279\u72FC\u72F9\u72FD\u72F8\u72F7\u7386\u73ED\u7409\u73EE\u73E0\u73EA\u73DE\u7554\u755D\u755C\u755A\u7559\u75BE\u75C5\u75C7\u75B2\u75B3\u75BD\u75BC\u75B9\u75C2\u75B8\u768B\u76B0\u76CA\u76CD\u76CE\u7729\u771F\u7720\u7728\u77E9\u7830\u7827\u7838\u781D\u7834\u7837"],
      ["afa1", "\u7825\u782D\u7820\u781F\u7832\u7955\u7950\u7960\u795F\u7956\u795E\u795D\u7957\u795A\u79E4\u79E3\u79E7\u79DF\u79E6\u79E9\u79D8\u7A84\u7A88\u7AD9\u7B06\u7B11\u7C89\u7D21\u7D17\u7D0B\u7D0A\u7D20\u7D22\u7D14\u7D10\u7D15\u7D1A\u7D1C\u7D0D\u7D19\u7D1B\u7F3A\u7F5F\u7F94\u7FC5\u7FC1\u8006\u8018\u8015\u8019\u8017\u803D\u803F\u80F1\u8102\u80F0\u8105\u80ED\u80F4\u8106\u80F8\u80F3\u8108\u80FD\u810A\u80FC\u80EF\u81ED\u81EC\u8200\u8210\u822A\u822B\u8228\u822C\u82BB\u832B\u8352\u8354\u834A\u8338\u8350\u8349\u8335\u8334\u834F\u8332\u8339\u8336\u8317\u8340\u8331\u8328\u8343"],
      ["b040", "\u8654\u868A\u86AA\u8693\u86A4\u86A9\u868C\u86A3\u869C\u8870\u8877\u8881\u8882\u887D\u8879\u8A18\u8A10\u8A0E\u8A0C\u8A15\u8A0A\u8A17\u8A13\u8A16\u8A0F\u8A11\u8C48\u8C7A\u8C79\u8CA1\u8CA2\u8D77\u8EAC\u8ED2\u8ED4\u8ECF\u8FB1\u9001\u9006\u8FF7\u9000\u8FFA\u8FF4\u9003\u8FFD\u9005\u8FF8\u9095\u90E1\u90DD\u90E2\u9152\u914D\u914C\u91D8\u91DD\u91D7\u91DC\u91D9\u9583\u9662\u9663\u9661"],
      ["b0a1", "\u965B\u965D\u9664\u9658\u965E\u96BB\u98E2\u99AC\u9AA8\u9AD8\u9B25\u9B32\u9B3C\u4E7E\u507A\u507D\u505C\u5047\u5043\u504C\u505A\u5049\u5065\u5076\u504E\u5055\u5075\u5074\u5077\u504F\u500F\u506F\u506D\u515C\u5195\u51F0\u526A\u526F\u52D2\u52D9\u52D8\u52D5\u5310\u530F\u5319\u533F\u5340\u533E\u53C3\u66FC\u5546\u556A\u5566\u5544\u555E\u5561\u5543\u554A\u5531\u5556\u554F\u5555\u552F\u5564\u5538\u552E\u555C\u552C\u5563\u5533\u5541\u5557\u5708\u570B\u5709\u57DF\u5805\u580A\u5806\u57E0\u57E4\u57FA\u5802\u5835\u57F7\u57F9\u5920\u5962\u5A36\u5A41\u5A49\u5A66\u5A6A\u5A40"],
      ["b140", "\u5A3C\u5A62\u5A5A\u5A46\u5A4A\u5B70\u5BC7\u5BC5\u5BC4\u5BC2\u5BBF\u5BC6\u5C09\u5C08\u5C07\u5C60\u5C5C\u5C5D\u5D07\u5D06\u5D0E\u5D1B\u5D16\u5D22\u5D11\u5D29\u5D14\u5D19\u5D24\u5D27\u5D17\u5DE2\u5E38\u5E36\u5E33\u5E37\u5EB7\u5EB8\u5EB6\u5EB5\u5EBE\u5F35\u5F37\u5F57\u5F6C\u5F69\u5F6B\u5F97\u5F99\u5F9E\u5F98\u5FA1\u5FA0\u5F9C\u607F\u60A3\u6089\u60A0\u60A8\u60CB\u60B4\u60E6\u60BD"],
      ["b1a1", "\u60C5\u60BB\u60B5\u60DC\u60BC\u60D8\u60D5\u60C6\u60DF\u60B8\u60DA\u60C7\u621A\u621B\u6248\u63A0\u63A7\u6372\u6396\u63A2\u63A5\u6377\u6367\u6398\u63AA\u6371\u63A9\u6389\u6383\u639B\u636B\u63A8\u6384\u6388\u6399\u63A1\u63AC\u6392\u638F\u6380\u637B\u6369\u6368\u637A\u655D\u6556\u6551\u6559\u6557\u555F\u654F\u6558\u6555\u6554\u659C\u659B\u65AC\u65CF\u65CB\u65CC\u65CE\u665D\u665A\u6664\u6668\u6666\u665E\u66F9\u52D7\u671B\u6881\u68AF\u68A2\u6893\u68B5\u687F\u6876\u68B1\u68A7\u6897\u68B0\u6883\u68C4\u68AD\u6886\u6885\u6894\u689D\u68A8\u689F\u68A1\u6882\u6B32\u6BBA"],
      ["b240", "\u6BEB\u6BEC\u6C2B\u6D8E\u6DBC\u6DF3\u6DD9\u6DB2\u6DE1\u6DCC\u6DE4\u6DFB\u6DFA\u6E05\u6DC7\u6DCB\u6DAF\u6DD1\u6DAE\u6DDE\u6DF9\u6DB8\u6DF7\u6DF5\u6DC5\u6DD2\u6E1A\u6DB5\u6DDA\u6DEB\u6DD8\u6DEA\u6DF1\u6DEE\u6DE8\u6DC6\u6DC4\u6DAA\u6DEC\u6DBF\u6DE6\u70F9\u7109\u710A\u70FD\u70EF\u723D\u727D\u7281\u731C\u731B\u7316\u7313\u7319\u7387\u7405\u740A\u7403\u7406\u73FE\u740D\u74E0\u74F6"],
      ["b2a1", "\u74F7\u751C\u7522\u7565\u7566\u7562\u7570\u758F\u75D4\u75D5\u75B5\u75CA\u75CD\u768E\u76D4\u76D2\u76DB\u7737\u773E\u773C\u7736\u7738\u773A\u786B\u7843\u784E\u7965\u7968\u796D\u79FB\u7A92\u7A95\u7B20\u7B28\u7B1B\u7B2C\u7B26\u7B19\u7B1E\u7B2E\u7C92\u7C97\u7C95\u7D46\u7D43\u7D71\u7D2E\u7D39\u7D3C\u7D40\u7D30\u7D33\u7D44\u7D2F\u7D42\u7D32\u7D31\u7F3D\u7F9E\u7F9A\u7FCC\u7FCE\u7FD2\u801C\u804A\u8046\u812F\u8116\u8123\u812B\u8129\u8130\u8124\u8202\u8235\u8237\u8236\u8239\u838E\u839E\u8398\u8378\u83A2\u8396\u83BD\u83AB\u8392\u838A\u8393\u8389\u83A0\u8377\u837B\u837C"],
      ["b340", "\u8386\u83A7\u8655\u5F6A\u86C7\u86C0\u86B6\u86C4\u86B5\u86C6\u86CB\u86B1\u86AF\u86C9\u8853\u889E\u8888\u88AB\u8892\u8896\u888D\u888B\u8993\u898F\u8A2A\u8A1D\u8A23\u8A25\u8A31\u8A2D\u8A1F\u8A1B\u8A22\u8C49\u8C5A\u8CA9\u8CAC\u8CAB\u8CA8\u8CAA\u8CA7\u8D67\u8D66\u8DBE\u8DBA\u8EDB\u8EDF\u9019\u900D\u901A\u9017\u9023\u901F\u901D\u9010\u9015\u901E\u9020\u900F\u9022\u9016\u901B\u9014"],
      ["b3a1", "\u90E8\u90ED\u90FD\u9157\u91CE\u91F5\u91E6\u91E3\u91E7\u91ED\u91E9\u9589\u966A\u9675\u9673\u9678\u9670\u9674\u9676\u9677\u966C\u96C0\u96EA\u96E9\u7AE0\u7ADF\u9802\u9803\u9B5A\u9CE5\u9E75\u9E7F\u9EA5\u9EBB\u50A2\u508D\u5085\u5099\u5091\u5080\u5096\u5098\u509A\u6700\u51F1\u5272\u5274\u5275\u5269\u52DE\u52DD\u52DB\u535A\u53A5\u557B\u5580\u55A7\u557C\u558A\u559D\u5598\u5582\u559C\u55AA\u5594\u5587\u558B\u5583\u55B3\u55AE\u559F\u553E\u55B2\u559A\u55BB\u55AC\u55B1\u557E\u5589\u55AB\u5599\u570D\u582F\u582A\u5834\u5824\u5830\u5831\u5821\u581D\u5820\u58F9\u58FA\u5960"],
      ["b440", "\u5A77\u5A9A\u5A7F\u5A92\u5A9B\u5AA7\u5B73\u5B71\u5BD2\u5BCC\u5BD3\u5BD0\u5C0A\u5C0B\u5C31\u5D4C\u5D50\u5D34\u5D47\u5DFD\u5E45\u5E3D\u5E40\u5E43\u5E7E\u5ECA\u5EC1\u5EC2\u5EC4\u5F3C\u5F6D\u5FA9\u5FAA\u5FA8\u60D1\u60E1\u60B2\u60B6\u60E0\u611C\u6123\u60FA\u6115\u60F0\u60FB\u60F4\u6168\u60F1\u610E\u60F6\u6109\u6100\u6112\u621F\u6249\u63A3\u638C\u63CF\u63C0\u63E9\u63C9\u63C6\u63CD"],
      ["b4a1", "\u63D2\u63E3\u63D0\u63E1\u63D6\u63ED\u63EE\u6376\u63F4\u63EA\u63DB\u6452\u63DA\u63F9\u655E\u6566\u6562\u6563\u6591\u6590\u65AF\u666E\u6670\u6674\u6676\u666F\u6691\u667A\u667E\u6677\u66FE\u66FF\u671F\u671D\u68FA\u68D5\u68E0\u68D8\u68D7\u6905\u68DF\u68F5\u68EE\u68E7\u68F9\u68D2\u68F2\u68E3\u68CB\u68CD\u690D\u6912\u690E\u68C9\u68DA\u696E\u68FB\u6B3E\u6B3A\u6B3D\u6B98\u6B96\u6BBC\u6BEF\u6C2E\u6C2F\u6C2C\u6E2F\u6E38\u6E54\u6E21\u6E32\u6E67\u6E4A\u6E20\u6E25\u6E23\u6E1B\u6E5B\u6E58\u6E24\u6E56\u6E6E\u6E2D\u6E26\u6E6F\u6E34\u6E4D\u6E3A\u6E2C\u6E43\u6E1D\u6E3E\u6ECB"],
      ["b540", "\u6E89\u6E19\u6E4E\u6E63\u6E44\u6E72\u6E69\u6E5F\u7119\u711A\u7126\u7130\u7121\u7136\u716E\u711C\u724C\u7284\u7280\u7336\u7325\u7334\u7329\u743A\u742A\u7433\u7422\u7425\u7435\u7436\u7434\u742F\u741B\u7426\u7428\u7525\u7526\u756B\u756A\u75E2\u75DB\u75E3\u75D9\u75D8\u75DE\u75E0\u767B\u767C\u7696\u7693\u76B4\u76DC\u774F\u77ED\u785D\u786C\u786F\u7A0D\u7A08\u7A0B\u7A05\u7A00\u7A98"],
      ["b5a1", "\u7A97\u7A96\u7AE5\u7AE3\u7B49\u7B56\u7B46\u7B50\u7B52\u7B54\u7B4D\u7B4B\u7B4F\u7B51\u7C9F\u7CA5\u7D5E\u7D50\u7D68\u7D55\u7D2B\u7D6E\u7D72\u7D61\u7D66\u7D62\u7D70\u7D73\u5584\u7FD4\u7FD5\u800B\u8052\u8085\u8155\u8154\u814B\u8151\u814E\u8139\u8146\u813E\u814C\u8153\u8174\u8212\u821C\u83E9\u8403\u83F8\u840D\u83E0\u83C5\u840B\u83C1\u83EF\u83F1\u83F4\u8457\u840A\u83F0\u840C\u83CC\u83FD\u83F2\u83CA\u8438\u840E\u8404\u83DC\u8407\u83D4\u83DF\u865B\u86DF\u86D9\u86ED\u86D4\u86DB\u86E4\u86D0\u86DE\u8857\u88C1\u88C2\u88B1\u8983\u8996\u8A3B\u8A60\u8A55\u8A5E\u8A3C\u8A41"],
      ["b640", "\u8A54\u8A5B\u8A50\u8A46\u8A34\u8A3A\u8A36\u8A56\u8C61\u8C82\u8CAF\u8CBC\u8CB3\u8CBD\u8CC1\u8CBB\u8CC0\u8CB4\u8CB7\u8CB6\u8CBF\u8CB8\u8D8A\u8D85\u8D81\u8DCE\u8DDD\u8DCB\u8DDA\u8DD1\u8DCC\u8DDB\u8DC6\u8EFB\u8EF8\u8EFC\u8F9C\u902E\u9035\u9031\u9038\u9032\u9036\u9102\u90F5\u9109\u90FE\u9163\u9165\u91CF\u9214\u9215\u9223\u9209\u921E\u920D\u9210\u9207\u9211\u9594\u958F\u958B\u9591"],
      ["b6a1", "\u9593\u9592\u958E\u968A\u968E\u968B\u967D\u9685\u9686\u968D\u9672\u9684\u96C1\u96C5\u96C4\u96C6\u96C7\u96EF\u96F2\u97CC\u9805\u9806\u9808\u98E7\u98EA\u98EF\u98E9\u98F2\u98ED\u99AE\u99AD\u9EC3\u9ECD\u9ED1\u4E82\u50AD\u50B5\u50B2\u50B3\u50C5\u50BE\u50AC\u50B7\u50BB\u50AF\u50C7\u527F\u5277\u527D\u52DF\u52E6\u52E4\u52E2\u52E3\u532F\u55DF\u55E8\u55D3\u55E6\u55CE\u55DC\u55C7\u55D1\u55E3\u55E4\u55EF\u55DA\u55E1\u55C5\u55C6\u55E5\u55C9\u5712\u5713\u585E\u5851\u5858\u5857\u585A\u5854\u586B\u584C\u586D\u584A\u5862\u5852\u584B\u5967\u5AC1\u5AC9\u5ACC\u5ABE\u5ABD\u5ABC"],
      ["b740", "\u5AB3\u5AC2\u5AB2\u5D69\u5D6F\u5E4C\u5E79\u5EC9\u5EC8\u5F12\u5F59\u5FAC\u5FAE\u611A\u610F\u6148\u611F\u60F3\u611B\u60F9\u6101\u6108\u614E\u614C\u6144\u614D\u613E\u6134\u6127\u610D\u6106\u6137\u6221\u6222\u6413\u643E\u641E\u642A\u642D\u643D\u642C\u640F\u641C\u6414\u640D\u6436\u6416\u6417\u6406\u656C\u659F\u65B0\u6697\u6689\u6687\u6688\u6696\u6684\u6698\u668D\u6703\u6994\u696D"],
      ["b7a1", "\u695A\u6977\u6960\u6954\u6975\u6930\u6982\u694A\u6968\u696B\u695E\u6953\u6979\u6986\u695D\u6963\u695B\u6B47\u6B72\u6BC0\u6BBF\u6BD3\u6BFD\u6EA2\u6EAF\u6ED3\u6EB6\u6EC2\u6E90\u6E9D\u6EC7\u6EC5\u6EA5\u6E98\u6EBC\u6EBA\u6EAB\u6ED1\u6E96\u6E9C\u6EC4\u6ED4\u6EAA\u6EA7\u6EB4\u714E\u7159\u7169\u7164\u7149\u7167\u715C\u716C\u7166\u714C\u7165\u715E\u7146\u7168\u7156\u723A\u7252\u7337\u7345\u733F\u733E\u746F\u745A\u7455\u745F\u745E\u7441\u743F\u7459\u745B\u745C\u7576\u7578\u7600\u75F0\u7601\u75F2\u75F1\u75FA\u75FF\u75F4\u75F3\u76DE\u76DF\u775B\u776B\u7766\u775E\u7763"],
      ["b840", "\u7779\u776A\u776C\u775C\u7765\u7768\u7762\u77EE\u788E\u78B0\u7897\u7898\u788C\u7889\u787C\u7891\u7893\u787F\u797A\u797F\u7981\u842C\u79BD\u7A1C\u7A1A\u7A20\u7A14\u7A1F\u7A1E\u7A9F\u7AA0\u7B77\u7BC0\u7B60\u7B6E\u7B67\u7CB1\u7CB3\u7CB5\u7D93\u7D79\u7D91\u7D81\u7D8F\u7D5B\u7F6E\u7F69\u7F6A\u7F72\u7FA9\u7FA8\u7FA4\u8056\u8058\u8086\u8084\u8171\u8170\u8178\u8165\u816E\u8173\u816B"],
      ["b8a1", "\u8179\u817A\u8166\u8205\u8247\u8482\u8477\u843D\u8431\u8475\u8466\u846B\u8449\u846C\u845B\u843C\u8435\u8461\u8463\u8469\u846D\u8446\u865E\u865C\u865F\u86F9\u8713\u8708\u8707\u8700\u86FE\u86FB\u8702\u8703\u8706\u870A\u8859\u88DF\u88D4\u88D9\u88DC\u88D8\u88DD\u88E1\u88CA\u88D5\u88D2\u899C\u89E3\u8A6B\u8A72\u8A73\u8A66\u8A69\u8A70\u8A87\u8A7C\u8A63\u8AA0\u8A71\u8A85\u8A6D\u8A62\u8A6E\u8A6C\u8A79\u8A7B\u8A3E\u8A68\u8C62\u8C8A\u8C89\u8CCA\u8CC7\u8CC8\u8CC4\u8CB2\u8CC3\u8CC2\u8CC5\u8DE1\u8DDF\u8DE8\u8DEF\u8DF3\u8DFA\u8DEA\u8DE4\u8DE6\u8EB2\u8F03\u8F09\u8EFE\u8F0A"],
      ["b940", "\u8F9F\u8FB2\u904B\u904A\u9053\u9042\u9054\u903C\u9055\u9050\u9047\u904F\u904E\u904D\u9051\u903E\u9041\u9112\u9117\u916C\u916A\u9169\u91C9\u9237\u9257\u9238\u923D\u9240\u923E\u925B\u924B\u9264\u9251\u9234\u9249\u924D\u9245\u9239\u923F\u925A\u9598\u9698\u9694\u9695\u96CD\u96CB\u96C9\u96CA\u96F7\u96FB\u96F9\u96F6\u9756\u9774\u9776\u9810\u9811\u9813\u980A\u9812\u980C\u98FC\u98F4"],
      ["b9a1", "\u98FD\u98FE\u99B3\u99B1\u99B4\u9AE1\u9CE9\u9E82\u9F0E\u9F13\u9F20\u50E7\u50EE\u50E5\u50D6\u50ED\u50DA\u50D5\u50CF\u50D1\u50F1\u50CE\u50E9\u5162\u51F3\u5283\u5282\u5331\u53AD\u55FE\u5600\u561B\u5617\u55FD\u5614\u5606\u5609\u560D\u560E\u55F7\u5616\u561F\u5608\u5610\u55F6\u5718\u5716\u5875\u587E\u5883\u5893\u588A\u5879\u5885\u587D\u58FD\u5925\u5922\u5924\u596A\u5969\u5AE1\u5AE6\u5AE9\u5AD7\u5AD6\u5AD8\u5AE3\u5B75\u5BDE\u5BE7\u5BE1\u5BE5\u5BE6\u5BE8\u5BE2\u5BE4\u5BDF\u5C0D\u5C62\u5D84\u5D87\u5E5B\u5E63\u5E55\u5E57\u5E54\u5ED3\u5ED6\u5F0A\u5F46\u5F70\u5FB9\u6147"],
      ["ba40", "\u613F\u614B\u6177\u6162\u6163\u615F\u615A\u6158\u6175\u622A\u6487\u6458\u6454\u64A4\u6478\u645F\u647A\u6451\u6467\u6434\u646D\u647B\u6572\u65A1\u65D7\u65D6\u66A2\u66A8\u669D\u699C\u69A8\u6995\u69C1\u69AE\u69D3\u69CB\u699B\u69B7\u69BB\u69AB\u69B4\u69D0\u69CD\u69AD\u69CC\u69A6\u69C3\u69A3\u6B49\u6B4C\u6C33\u6F33\u6F14\u6EFE\u6F13\u6EF4\u6F29\u6F3E\u6F20\u6F2C\u6F0F\u6F02\u6F22"],
      ["baa1", "\u6EFF\u6EEF\u6F06\u6F31\u6F38\u6F32\u6F23\u6F15\u6F2B\u6F2F\u6F88\u6F2A\u6EEC\u6F01\u6EF2\u6ECC\u6EF7\u7194\u7199\u717D\u718A\u7184\u7192\u723E\u7292\u7296\u7344\u7350\u7464\u7463\u746A\u7470\u746D\u7504\u7591\u7627\u760D\u760B\u7609\u7613\u76E1\u76E3\u7784\u777D\u777F\u7761\u78C1\u789F\u78A7\u78B3\u78A9\u78A3\u798E\u798F\u798D\u7A2E\u7A31\u7AAA\u7AA9\u7AED\u7AEF\u7BA1\u7B95\u7B8B\u7B75\u7B97\u7B9D\u7B94\u7B8F\u7BB8\u7B87\u7B84\u7CB9\u7CBD\u7CBE\u7DBB\u7DB0\u7D9C\u7DBD\u7DBE\u7DA0\u7DCA\u7DB4\u7DB2\u7DB1\u7DBA\u7DA2\u7DBF\u7DB5\u7DB8\u7DAD\u7DD2\u7DC7\u7DAC"],
      ["bb40", "\u7F70\u7FE0\u7FE1\u7FDF\u805E\u805A\u8087\u8150\u8180\u818F\u8188\u818A\u817F\u8182\u81E7\u81FA\u8207\u8214\u821E\u824B\u84C9\u84BF\u84C6\u84C4\u8499\u849E\u84B2\u849C\u84CB\u84B8\u84C0\u84D3\u8490\u84BC\u84D1\u84CA\u873F\u871C\u873B\u8722\u8725\u8734\u8718\u8755\u8737\u8729\u88F3\u8902\u88F4\u88F9\u88F8\u88FD\u88E8\u891A\u88EF\u8AA6\u8A8C\u8A9E\u8AA3\u8A8D\u8AA1\u8A93\u8AA4"],
      ["bba1", "\u8AAA\u8AA5\u8AA8\u8A98\u8A91\u8A9A\u8AA7\u8C6A\u8C8D\u8C8C\u8CD3\u8CD1\u8CD2\u8D6B\u8D99\u8D95\u8DFC\u8F14\u8F12\u8F15\u8F13\u8FA3\u9060\u9058\u905C\u9063\u9059\u905E\u9062\u905D\u905B\u9119\u9118\u911E\u9175\u9178\u9177\u9174\u9278\u9280\u9285\u9298\u9296\u927B\u9293\u929C\u92A8\u927C\u9291\u95A1\u95A8\u95A9\u95A3\u95A5\u95A4\u9699\u969C\u969B\u96CC\u96D2\u9700\u977C\u9785\u97F6\u9817\u9818\u98AF\u98B1\u9903\u9905\u990C\u9909\u99C1\u9AAF\u9AB0\u9AE6\u9B41\u9B42\u9CF4\u9CF6\u9CF3\u9EBC\u9F3B\u9F4A\u5104\u5100\u50FB\u50F5\u50F9\u5102\u5108\u5109\u5105\u51DC"],
      ["bc40", "\u5287\u5288\u5289\u528D\u528A\u52F0\u53B2\u562E\u563B\u5639\u5632\u563F\u5634\u5629\u5653\u564E\u5657\u5674\u5636\u562F\u5630\u5880\u589F\u589E\u58B3\u589C\u58AE\u58A9\u58A6\u596D\u5B09\u5AFB\u5B0B\u5AF5\u5B0C\u5B08\u5BEE\u5BEC\u5BE9\u5BEB\u5C64\u5C65\u5D9D\u5D94\u5E62\u5E5F\u5E61\u5EE2\u5EDA\u5EDF\u5EDD\u5EE3\u5EE0\u5F48\u5F71\u5FB7\u5FB5\u6176\u6167\u616E\u615D\u6155\u6182"],
      ["bca1", "\u617C\u6170\u616B\u617E\u61A7\u6190\u61AB\u618E\u61AC\u619A\u61A4\u6194\u61AE\u622E\u6469\u646F\u6479\u649E\u64B2\u6488\u6490\u64B0\u64A5\u6493\u6495\u64A9\u6492\u64AE\u64AD\u64AB\u649A\u64AC\u6499\u64A2\u64B3\u6575\u6577\u6578\u66AE\u66AB\u66B4\u66B1\u6A23\u6A1F\u69E8\u6A01\u6A1E\u6A19\u69FD\u6A21\u6A13\u6A0A\u69F3\u6A02\u6A05\u69ED\u6A11\u6B50\u6B4E\u6BA4\u6BC5\u6BC6\u6F3F\u6F7C\u6F84\u6F51\u6F66\u6F54\u6F86\u6F6D\u6F5B\u6F78\u6F6E\u6F8E\u6F7A\u6F70\u6F64\u6F97\u6F58\u6ED5\u6F6F\u6F60\u6F5F\u719F\u71AC\u71B1\u71A8\u7256\u729B\u734E\u7357\u7469\u748B\u7483"],
      ["bd40", "\u747E\u7480\u757F\u7620\u7629\u761F\u7624\u7626\u7621\u7622\u769A\u76BA\u76E4\u778E\u7787\u778C\u7791\u778B\u78CB\u78C5\u78BA\u78CA\u78BE\u78D5\u78BC\u78D0\u7A3F\u7A3C\u7A40\u7A3D\u7A37\u7A3B\u7AAF\u7AAE\u7BAD\u7BB1\u7BC4\u7BB4\u7BC6\u7BC7\u7BC1\u7BA0\u7BCC\u7CCA\u7DE0\u7DF4\u7DEF\u7DFB\u7DD8\u7DEC\u7DDD\u7DE8\u7DE3\u7DDA\u7DDE\u7DE9\u7D9E\u7DD9\u7DF2\u7DF9\u7F75\u7F77\u7FAF"],
      ["bda1", "\u7FE9\u8026\u819B\u819C\u819D\u81A0\u819A\u8198\u8517\u853D\u851A\u84EE\u852C\u852D\u8513\u8511\u8523\u8521\u8514\u84EC\u8525\u84FF\u8506\u8782\u8774\u8776\u8760\u8766\u8778\u8768\u8759\u8757\u874C\u8753\u885B\u885D\u8910\u8907\u8912\u8913\u8915\u890A\u8ABC\u8AD2\u8AC7\u8AC4\u8A95\u8ACB\u8AF8\u8AB2\u8AC9\u8AC2\u8ABF\u8AB0\u8AD6\u8ACD\u8AB6\u8AB9\u8ADB\u8C4C\u8C4E\u8C6C\u8CE0\u8CDE\u8CE6\u8CE4\u8CEC\u8CED\u8CE2\u8CE3\u8CDC\u8CEA\u8CE1\u8D6D\u8D9F\u8DA3\u8E2B\u8E10\u8E1D\u8E22\u8E0F\u8E29\u8E1F\u8E21\u8E1E\u8EBA\u8F1D\u8F1B\u8F1F\u8F29\u8F26\u8F2A\u8F1C\u8F1E"],
      ["be40", "\u8F25\u9069\u906E\u9068\u906D\u9077\u9130\u912D\u9127\u9131\u9187\u9189\u918B\u9183\u92C5\u92BB\u92B7\u92EA\u92AC\u92E4\u92C1\u92B3\u92BC\u92D2\u92C7\u92F0\u92B2\u95AD\u95B1\u9704\u9706\u9707\u9709\u9760\u978D\u978B\u978F\u9821\u982B\u981C\u98B3\u990A\u9913\u9912\u9918\u99DD\u99D0\u99DF\u99DB\u99D1\u99D5\u99D2\u99D9\u9AB7\u9AEE\u9AEF\u9B27\u9B45\u9B44\u9B77\u9B6F\u9D06\u9D09"],
      ["bea1", "\u9D03\u9EA9\u9EBE\u9ECE\u58A8\u9F52\u5112\u5118\u5114\u5110\u5115\u5180\u51AA\u51DD\u5291\u5293\u52F3\u5659\u566B\u5679\u5669\u5664\u5678\u566A\u5668\u5665\u5671\u566F\u566C\u5662\u5676\u58C1\u58BE\u58C7\u58C5\u596E\u5B1D\u5B34\u5B78\u5BF0\u5C0E\u5F4A\u61B2\u6191\u61A9\u618A\u61CD\u61B6\u61BE\u61CA\u61C8\u6230\u64C5\u64C1\u64CB\u64BB\u64BC\u64DA\u64C4\u64C7\u64C2\u64CD\u64BF\u64D2\u64D4\u64BE\u6574\u66C6\u66C9\u66B9\u66C4\u66C7\u66B8\u6A3D\u6A38\u6A3A\u6A59\u6A6B\u6A58\u6A39\u6A44\u6A62\u6A61\u6A4B\u6A47\u6A35\u6A5F\u6A48\u6B59\u6B77\u6C05\u6FC2\u6FB1\u6FA1"],
      ["bf40", "\u6FC3\u6FA4\u6FC1\u6FA7\u6FB3\u6FC0\u6FB9\u6FB6\u6FA6\u6FA0\u6FB4\u71BE\u71C9\u71D0\u71D2\u71C8\u71D5\u71B9\u71CE\u71D9\u71DC\u71C3\u71C4\u7368\u749C\u74A3\u7498\u749F\u749E\u74E2\u750C\u750D\u7634\u7638\u763A\u76E7\u76E5\u77A0\u779E\u779F\u77A5\u78E8\u78DA\u78EC\u78E7\u79A6\u7A4D\u7A4E\u7A46\u7A4C\u7A4B\u7ABA\u7BD9\u7C11\u7BC9\u7BE4\u7BDB\u7BE1\u7BE9\u7BE6\u7CD5\u7CD6\u7E0A"],
      ["bfa1", "\u7E11\u7E08\u7E1B\u7E23\u7E1E\u7E1D\u7E09\u7E10\u7F79\u7FB2\u7FF0\u7FF1\u7FEE\u8028\u81B3\u81A9\u81A8\u81FB\u8208\u8258\u8259\u854A\u8559\u8548\u8568\u8569\u8543\u8549\u856D\u856A\u855E\u8783\u879F\u879E\u87A2\u878D\u8861\u892A\u8932\u8925\u892B\u8921\u89AA\u89A6\u8AE6\u8AFA\u8AEB\u8AF1\u8B00\u8ADC\u8AE7\u8AEE\u8AFE\u8B01\u8B02\u8AF7\u8AED\u8AF3\u8AF6\u8AFC\u8C6B\u8C6D\u8C93\u8CF4\u8E44\u8E31\u8E34\u8E42\u8E39\u8E35\u8F3B\u8F2F\u8F38\u8F33\u8FA8\u8FA6\u9075\u9074\u9078\u9072\u907C\u907A\u9134\u9192\u9320\u9336\u92F8\u9333\u932F\u9322\u92FC\u932B\u9304\u931A"],
      ["c040", "\u9310\u9326\u9321\u9315\u932E\u9319\u95BB\u96A7\u96A8\u96AA\u96D5\u970E\u9711\u9716\u970D\u9713\u970F\u975B\u975C\u9766\u9798\u9830\u9838\u983B\u9837\u982D\u9839\u9824\u9910\u9928\u991E\u991B\u9921\u991A\u99ED\u99E2\u99F1\u9AB8\u9ABC\u9AFB\u9AED\u9B28\u9B91\u9D15\u9D23\u9D26\u9D28\u9D12\u9D1B\u9ED8\u9ED4\u9F8D\u9F9C\u512A\u511F\u5121\u5132\u52F5\u568E\u5680\u5690\u5685\u5687"],
      ["c0a1", "\u568F\u58D5\u58D3\u58D1\u58CE\u5B30\u5B2A\u5B24\u5B7A\u5C37\u5C68\u5DBC\u5DBA\u5DBD\u5DB8\u5E6B\u5F4C\u5FBD\u61C9\u61C2\u61C7\u61E6\u61CB\u6232\u6234\u64CE\u64CA\u64D8\u64E0\u64F0\u64E6\u64EC\u64F1\u64E2\u64ED\u6582\u6583\u66D9\u66D6\u6A80\u6A94\u6A84\u6AA2\u6A9C\u6ADB\u6AA3\u6A7E\u6A97\u6A90\u6AA0\u6B5C\u6BAE\u6BDA\u6C08\u6FD8\u6FF1\u6FDF\u6FE0\u6FDB\u6FE4\u6FEB\u6FEF\u6F80\u6FEC\u6FE1\u6FE9\u6FD5\u6FEE\u6FF0\u71E7\u71DF\u71EE\u71E6\u71E5\u71ED\u71EC\u71F4\u71E0\u7235\u7246\u7370\u7372\u74A9\u74B0\u74A6\u74A8\u7646\u7642\u764C\u76EA\u77B3\u77AA\u77B0\u77AC"],
      ["c140", "\u77A7\u77AD\u77EF\u78F7\u78FA\u78F4\u78EF\u7901\u79A7\u79AA\u7A57\u7ABF\u7C07\u7C0D\u7BFE\u7BF7\u7C0C\u7BE0\u7CE0\u7CDC\u7CDE\u7CE2\u7CDF\u7CD9\u7CDD\u7E2E\u7E3E\u7E46\u7E37\u7E32\u7E43\u7E2B\u7E3D\u7E31\u7E45\u7E41\u7E34\u7E39\u7E48\u7E35\u7E3F\u7E2F\u7F44\u7FF3\u7FFC\u8071\u8072\u8070\u806F\u8073\u81C6\u81C3\u81BA\u81C2\u81C0\u81BF\u81BD\u81C9\u81BE\u81E8\u8209\u8271\u85AA"],
      ["c1a1", "\u8584\u857E\u859C\u8591\u8594\u85AF\u859B\u8587\u85A8\u858A\u8667\u87C0\u87D1\u87B3\u87D2\u87C6\u87AB\u87BB\u87BA\u87C8\u87CB\u893B\u8936\u8944\u8938\u893D\u89AC\u8B0E\u8B17\u8B19\u8B1B\u8B0A\u8B20\u8B1D\u8B04\u8B10\u8C41\u8C3F\u8C73\u8CFA\u8CFD\u8CFC\u8CF8\u8CFB\u8DA8\u8E49\u8E4B\u8E48\u8E4A\u8F44\u8F3E\u8F42\u8F45\u8F3F\u907F\u907D\u9084\u9081\u9082\u9080\u9139\u91A3\u919E\u919C\u934D\u9382\u9328\u9375\u934A\u9365\u934B\u9318\u937E\u936C\u935B\u9370\u935A\u9354\u95CA\u95CB\u95CC\u95C8\u95C6\u96B1\u96B8\u96D6\u971C\u971E\u97A0\u97D3\u9846\u98B6\u9935\u9A01"],
      ["c240", "\u99FF\u9BAE\u9BAB\u9BAA\u9BAD\u9D3B\u9D3F\u9E8B\u9ECF\u9EDE\u9EDC\u9EDD\u9EDB\u9F3E\u9F4B\u53E2\u5695\u56AE\u58D9\u58D8\u5B38\u5F5D\u61E3\u6233\u64F4\u64F2\u64FE\u6506\u64FA\u64FB\u64F7\u65B7\u66DC\u6726\u6AB3\u6AAC\u6AC3\u6ABB\u6AB8\u6AC2\u6AAE\u6AAF\u6B5F\u6B78\u6BAF\u7009\u700B\u6FFE\u7006\u6FFA\u7011\u700F\u71FB\u71FC\u71FE\u71F8\u7377\u7375\u74A7\u74BF\u7515\u7656\u7658"],
      ["c2a1", "\u7652\u77BD\u77BF\u77BB\u77BC\u790E\u79AE\u7A61\u7A62\u7A60\u7AC4\u7AC5\u7C2B\u7C27\u7C2A\u7C1E\u7C23\u7C21\u7CE7\u7E54\u7E55\u7E5E\u7E5A\u7E61\u7E52\u7E59\u7F48\u7FF9\u7FFB\u8077\u8076\u81CD\u81CF\u820A\u85CF\u85A9\u85CD\u85D0\u85C9\u85B0\u85BA\u85B9\u85A6\u87EF\u87EC\u87F2\u87E0\u8986\u89B2\u89F4\u8B28\u8B39\u8B2C\u8B2B\u8C50\u8D05\u8E59\u8E63\u8E66\u8E64\u8E5F\u8E55\u8EC0\u8F49\u8F4D\u9087\u9083\u9088\u91AB\u91AC\u91D0\u9394\u938A\u9396\u93A2\u93B3\u93AE\u93AC\u93B0\u9398\u939A\u9397\u95D4\u95D6\u95D0\u95D5\u96E2\u96DC\u96D9\u96DB\u96DE\u9724\u97A3\u97A6"],
      ["c340", "\u97AD\u97F9\u984D\u984F\u984C\u984E\u9853\u98BA\u993E\u993F\u993D\u992E\u99A5\u9A0E\u9AC1\u9B03\u9B06\u9B4F\u9B4E\u9B4D\u9BCA\u9BC9\u9BFD\u9BC8\u9BC0\u9D51\u9D5D\u9D60\u9EE0\u9F15\u9F2C\u5133\u56A5\u58DE\u58DF\u58E2\u5BF5\u9F90\u5EEC\u61F2\u61F7\u61F6\u61F5\u6500\u650F\u66E0\u66DD\u6AE5\u6ADD\u6ADA\u6AD3\u701B\u701F\u7028\u701A\u701D\u7015\u7018\u7206\u720D\u7258\u72A2\u7378"],
      ["c3a1", "\u737A\u74BD\u74CA\u74E3\u7587\u7586\u765F\u7661\u77C7\u7919\u79B1\u7A6B\u7A69\u7C3E\u7C3F\u7C38\u7C3D\u7C37\u7C40\u7E6B\u7E6D\u7E79\u7E69\u7E6A\u7F85\u7E73\u7FB6\u7FB9\u7FB8\u81D8\u85E9\u85DD\u85EA\u85D5\u85E4\u85E5\u85F7\u87FB\u8805\u880D\u87F9\u87FE\u8960\u895F\u8956\u895E\u8B41\u8B5C\u8B58\u8B49\u8B5A\u8B4E\u8B4F\u8B46\u8B59\u8D08\u8D0A\u8E7C\u8E72\u8E87\u8E76\u8E6C\u8E7A\u8E74\u8F54\u8F4E\u8FAD\u908A\u908B\u91B1\u91AE\u93E1\u93D1\u93DF\u93C3\u93C8\u93DC\u93DD\u93D6\u93E2\u93CD\u93D8\u93E4\u93D7\u93E8\u95DC\u96B4\u96E3\u972A\u9727\u9761\u97DC\u97FB\u985E"],
      ["c440", "\u9858\u985B\u98BC\u9945\u9949\u9A16\u9A19\u9B0D\u9BE8\u9BE7\u9BD6\u9BDB\u9D89\u9D61\u9D72\u9D6A\u9D6C\u9E92\u9E97\u9E93\u9EB4\u52F8\u56A8\u56B7\u56B6\u56B4\u56BC\u58E4\u5B40\u5B43\u5B7D\u5BF6\u5DC9\u61F8\u61FA\u6518\u6514\u6519\u66E6\u6727\u6AEC\u703E\u7030\u7032\u7210\u737B\u74CF\u7662\u7665\u7926\u792A\u792C\u792B\u7AC7\u7AF6\u7C4C\u7C43\u7C4D\u7CEF\u7CF0\u8FAE\u7E7D\u7E7C"],
      ["c4a1", "\u7E82\u7F4C\u8000\u81DA\u8266\u85FB\u85F9\u8611\u85FA\u8606\u860B\u8607\u860A\u8814\u8815\u8964\u89BA\u89F8\u8B70\u8B6C\u8B66\u8B6F\u8B5F\u8B6B\u8D0F\u8D0D\u8E89\u8E81\u8E85\u8E82\u91B4\u91CB\u9418\u9403\u93FD\u95E1\u9730\u98C4\u9952\u9951\u99A8\u9A2B\u9A30\u9A37\u9A35\u9C13\u9C0D\u9E79\u9EB5\u9EE8\u9F2F\u9F5F\u9F63\u9F61\u5137\u5138\u56C1\u56C0\u56C2\u5914\u5C6C\u5DCD\u61FC\u61FE\u651D\u651C\u6595\u66E9\u6AFB\u6B04\u6AFA\u6BB2\u704C\u721B\u72A7\u74D6\u74D4\u7669\u77D3\u7C50\u7E8F\u7E8C\u7FBC\u8617\u862D\u861A\u8823\u8822\u8821\u881F\u896A\u896C\u89BD\u8B74"],
      ["c540", "\u8B77\u8B7D\u8D13\u8E8A\u8E8D\u8E8B\u8F5F\u8FAF\u91BA\u942E\u9433\u9435\u943A\u9438\u9432\u942B\u95E2\u9738\u9739\u9732\u97FF\u9867\u9865\u9957\u9A45\u9A43\u9A40\u9A3E\u9ACF\u9B54\u9B51\u9C2D\u9C25\u9DAF\u9DB4\u9DC2\u9DB8\u9E9D\u9EEF\u9F19\u9F5C\u9F66\u9F67\u513C\u513B\u56C8\u56CA\u56C9\u5B7F\u5DD4\u5DD2\u5F4E\u61FF\u6524\u6B0A\u6B61\u7051\u7058\u7380\u74E4\u758A\u766E\u766C"],
      ["c5a1", "\u79B3\u7C60\u7C5F\u807E\u807D\u81DF\u8972\u896F\u89FC\u8B80\u8D16\u8D17\u8E91\u8E93\u8F61\u9148\u9444\u9451\u9452\u973D\u973E\u97C3\u97C1\u986B\u9955\u9A55\u9A4D\u9AD2\u9B1A\u9C49\u9C31\u9C3E\u9C3B\u9DD3\u9DD7\u9F34\u9F6C\u9F6A\u9F94\u56CC\u5DD6\u6200\u6523\u652B\u652A\u66EC\u6B10\u74DA\u7ACA\u7C64\u7C63\u7C65\u7E93\u7E96\u7E94\u81E2\u8638\u863F\u8831\u8B8A\u9090\u908F\u9463\u9460\u9464\u9768\u986F\u995C\u9A5A\u9A5B\u9A57\u9AD3\u9AD4\u9AD1\u9C54\u9C57\u9C56\u9DE5\u9E9F\u9EF4\u56D1\u58E9\u652C\u705E\u7671\u7672\u77D7\u7F50\u7F88\u8836\u8839\u8862\u8B93\u8B92"],
      ["c640", "\u8B96\u8277\u8D1B\u91C0\u946A\u9742\u9748\u9744\u97C6\u9870\u9A5F\u9B22\u9B58\u9C5F\u9DF9\u9DFA\u9E7C\u9E7D\u9F07\u9F77\u9F72\u5EF3\u6B16\u7063\u7C6C\u7C6E\u883B\u89C0\u8EA1\u91C1\u9472\u9470\u9871\u995E\u9AD6\u9B23\u9ECC\u7064\u77DA\u8B9A\u9477\u97C9\u9A62\u9A65\u7E9C\u8B9C\u8EAA\u91C5\u947D\u947E\u947C\u9C77\u9C78\u9EF7\u8C54\u947F\u9E1A\u7228\u9A6A\u9B31\u9E1B\u9E1E\u7C72"],
      ["c940", "\u4E42\u4E5C\u51F5\u531A\u5382\u4E07\u4E0C\u4E47\u4E8D\u56D7\uFA0C\u5C6E\u5F73\u4E0F\u5187\u4E0E\u4E2E\u4E93\u4EC2\u4EC9\u4EC8\u5198\u52FC\u536C\u53B9\u5720\u5903\u592C\u5C10\u5DFF\u65E1\u6BB3\u6BCC\u6C14\u723F\u4E31\u4E3C\u4EE8\u4EDC\u4EE9\u4EE1\u4EDD\u4EDA\u520C\u531C\u534C\u5722\u5723\u5917\u592F\u5B81\u5B84\u5C12\u5C3B\u5C74\u5C73\u5E04\u5E80\u5E82\u5FC9\u6209\u6250\u6C15"],
      ["c9a1", "\u6C36\u6C43\u6C3F\u6C3B\u72AE\u72B0\u738A\u79B8\u808A\u961E\u4F0E\u4F18\u4F2C\u4EF5\u4F14\u4EF1\u4F00\u4EF7\u4F08\u4F1D\u4F02\u4F05\u4F22\u4F13\u4F04\u4EF4\u4F12\u51B1\u5213\u5209\u5210\u52A6\u5322\u531F\u534D\u538A\u5407\u56E1\u56DF\u572E\u572A\u5734\u593C\u5980\u597C\u5985\u597B\u597E\u5977\u597F\u5B56\u5C15\u5C25\u5C7C\u5C7A\u5C7B\u5C7E\u5DDF\u5E75\u5E84\u5F02\u5F1A\u5F74\u5FD5\u5FD4\u5FCF\u625C\u625E\u6264\u6261\u6266\u6262\u6259\u6260\u625A\u6265\u65EF\u65EE\u673E\u6739\u6738\u673B\u673A\u673F\u673C\u6733\u6C18\u6C46\u6C52\u6C5C\u6C4F\u6C4A\u6C54\u6C4B"],
      ["ca40", "\u6C4C\u7071\u725E\u72B4\u72B5\u738E\u752A\u767F\u7A75\u7F51\u8278\u827C\u8280\u827D\u827F\u864D\u897E\u9099\u9097\u9098\u909B\u9094\u9622\u9624\u9620\u9623\u4F56\u4F3B\u4F62\u4F49\u4F53\u4F64\u4F3E\u4F67\u4F52\u4F5F\u4F41\u4F58\u4F2D\u4F33\u4F3F\u4F61\u518F\u51B9\u521C\u521E\u5221\u52AD\u52AE\u5309\u5363\u5372\u538E\u538F\u5430\u5437\u542A\u5454\u5445\u5419\u541C\u5425\u5418"],
      ["caa1", "\u543D\u544F\u5441\u5428\u5424\u5447\u56EE\u56E7\u56E5\u5741\u5745\u574C\u5749\u574B\u5752\u5906\u5940\u59A6\u5998\u59A0\u5997\u598E\u59A2\u5990\u598F\u59A7\u59A1\u5B8E\u5B92\u5C28\u5C2A\u5C8D\u5C8F\u5C88\u5C8B\u5C89\u5C92\u5C8A\u5C86\u5C93\u5C95\u5DE0\u5E0A\u5E0E\u5E8B\u5E89\u5E8C\u5E88\u5E8D\u5F05\u5F1D\u5F78\u5F76\u5FD2\u5FD1\u5FD0\u5FED\u5FE8\u5FEE\u5FF3\u5FE1\u5FE4\u5FE3\u5FFA\u5FEF\u5FF7\u5FFB\u6000\u5FF4\u623A\u6283\u628C\u628E\u628F\u6294\u6287\u6271\u627B\u627A\u6270\u6281\u6288\u6277\u627D\u6272\u6274\u6537\u65F0\u65F4\u65F3\u65F2\u65F5\u6745\u6747"],
      ["cb40", "\u6759\u6755\u674C\u6748\u675D\u674D\u675A\u674B\u6BD0\u6C19\u6C1A\u6C78\u6C67\u6C6B\u6C84\u6C8B\u6C8F\u6C71\u6C6F\u6C69\u6C9A\u6C6D\u6C87\u6C95\u6C9C\u6C66\u6C73\u6C65\u6C7B\u6C8E\u7074\u707A\u7263\u72BF\u72BD\u72C3\u72C6\u72C1\u72BA\u72C5\u7395\u7397\u7393\u7394\u7392\u753A\u7539\u7594\u7595\u7681\u793D\u8034\u8095\u8099\u8090\u8092\u809C\u8290\u828F\u8285\u828E\u8291\u8293"],
      ["cba1", "\u828A\u8283\u8284\u8C78\u8FC9\u8FBF\u909F\u90A1\u90A5\u909E\u90A7\u90A0\u9630\u9628\u962F\u962D\u4E33\u4F98\u4F7C\u4F85\u4F7D\u4F80\u4F87\u4F76\u4F74\u4F89\u4F84\u4F77\u4F4C\u4F97\u4F6A\u4F9A\u4F79\u4F81\u4F78\u4F90\u4F9C\u4F94\u4F9E\u4F92\u4F82\u4F95\u4F6B\u4F6E\u519E\u51BC\u51BE\u5235\u5232\u5233\u5246\u5231\u52BC\u530A\u530B\u533C\u5392\u5394\u5487\u547F\u5481\u5491\u5482\u5488\u546B\u547A\u547E\u5465\u546C\u5474\u5466\u548D\u546F\u5461\u5460\u5498\u5463\u5467\u5464\u56F7\u56F9\u576F\u5772\u576D\u576B\u5771\u5770\u5776\u5780\u5775\u577B\u5773\u5774\u5762"],
      ["cc40", "\u5768\u577D\u590C\u5945\u59B5\u59BA\u59CF\u59CE\u59B2\u59CC\u59C1\u59B6\u59BC\u59C3\u59D6\u59B1\u59BD\u59C0\u59C8\u59B4\u59C7\u5B62\u5B65\u5B93\u5B95\u5C44\u5C47\u5CAE\u5CA4\u5CA0\u5CB5\u5CAF\u5CA8\u5CAC\u5C9F\u5CA3\u5CAD\u5CA2\u5CAA\u5CA7\u5C9D\u5CA5\u5CB6\u5CB0\u5CA6\u5E17\u5E14\u5E19\u5F28\u5F22\u5F23\u5F24\u5F54\u5F82\u5F7E\u5F7D\u5FDE\u5FE5\u602D\u6026\u6019\u6032\u600B"],
      ["cca1", "\u6034\u600A\u6017\u6033\u601A\u601E\u602C\u6022\u600D\u6010\u602E\u6013\u6011\u600C\u6009\u601C\u6214\u623D\u62AD\u62B4\u62D1\u62BE\u62AA\u62B6\u62CA\u62AE\u62B3\u62AF\u62BB\u62A9\u62B0\u62B8\u653D\u65A8\u65BB\u6609\u65FC\u6604\u6612\u6608\u65FB\u6603\u660B\u660D\u6605\u65FD\u6611\u6610\u66F6\u670A\u6785\u676C\u678E\u6792\u6776\u677B\u6798\u6786\u6784\u6774\u678D\u678C\u677A\u679F\u6791\u6799\u6783\u677D\u6781\u6778\u6779\u6794\u6B25\u6B80\u6B7E\u6BDE\u6C1D\u6C93\u6CEC\u6CEB\u6CEE\u6CD9\u6CB6\u6CD4\u6CAD\u6CE7\u6CB7\u6CD0\u6CC2\u6CBA\u6CC3\u6CC6\u6CED\u6CF2"],
      ["cd40", "\u6CD2\u6CDD\u6CB4\u6C8A\u6C9D\u6C80\u6CDE\u6CC0\u6D30\u6CCD\u6CC7\u6CB0\u6CF9\u6CCF\u6CE9\u6CD1\u7094\u7098\u7085\u7093\u7086\u7084\u7091\u7096\u7082\u709A\u7083\u726A\u72D6\u72CB\u72D8\u72C9\u72DC\u72D2\u72D4\u72DA\u72CC\u72D1\u73A4\u73A1\u73AD\u73A6\u73A2\u73A0\u73AC\u739D\u74DD\u74E8\u753F\u7540\u753E\u758C\u7598\u76AF\u76F3\u76F1\u76F0\u76F5\u77F8\u77FC\u77F9\u77FB\u77FA"],
      ["cda1", "\u77F7\u7942\u793F\u79C5\u7A78\u7A7B\u7AFB\u7C75\u7CFD\u8035\u808F\u80AE\u80A3\u80B8\u80B5\u80AD\u8220\u82A0\u82C0\u82AB\u829A\u8298\u829B\u82B5\u82A7\u82AE\u82BC\u829E\u82BA\u82B4\u82A8\u82A1\u82A9\u82C2\u82A4\u82C3\u82B6\u82A2\u8670\u866F\u866D\u866E\u8C56\u8FD2\u8FCB\u8FD3\u8FCD\u8FD6\u8FD5\u8FD7\u90B2\u90B4\u90AF\u90B3\u90B0\u9639\u963D\u963C\u963A\u9643\u4FCD\u4FC5\u4FD3\u4FB2\u4FC9\u4FCB\u4FC1\u4FD4\u4FDC\u4FD9\u4FBB\u4FB3\u4FDB\u4FC7\u4FD6\u4FBA\u4FC0\u4FB9\u4FEC\u5244\u5249\u52C0\u52C2\u533D\u537C\u5397\u5396\u5399\u5398\u54BA\u54A1\u54AD\u54A5\u54CF"],
      ["ce40", "\u54C3\u830D\u54B7\u54AE\u54D6\u54B6\u54C5\u54C6\u54A0\u5470\u54BC\u54A2\u54BE\u5472\u54DE\u54B0\u57B5\u579E\u579F\u57A4\u578C\u5797\u579D\u579B\u5794\u5798\u578F\u5799\u57A5\u579A\u5795\u58F4\u590D\u5953\u59E1\u59DE\u59EE\u5A00\u59F1\u59DD\u59FA\u59FD\u59FC\u59F6\u59E4\u59F2\u59F7\u59DB\u59E9\u59F3\u59F5\u59E0\u59FE\u59F4\u59ED\u5BA8\u5C4C\u5CD0\u5CD8\u5CCC\u5CD7\u5CCB\u5CDB"],
      ["cea1", "\u5CDE\u5CDA\u5CC9\u5CC7\u5CCA\u5CD6\u5CD3\u5CD4\u5CCF\u5CC8\u5CC6\u5CCE\u5CDF\u5CF8\u5DF9\u5E21\u5E22\u5E23\u5E20\u5E24\u5EB0\u5EA4\u5EA2\u5E9B\u5EA3\u5EA5\u5F07\u5F2E\u5F56\u5F86\u6037\u6039\u6054\u6072\u605E\u6045\u6053\u6047\u6049\u605B\u604C\u6040\u6042\u605F\u6024\u6044\u6058\u6066\u606E\u6242\u6243\u62CF\u630D\u630B\u62F5\u630E\u6303\u62EB\u62F9\u630F\u630C\u62F8\u62F6\u6300\u6313\u6314\u62FA\u6315\u62FB\u62F0\u6541\u6543\u65AA\u65BF\u6636\u6621\u6632\u6635\u661C\u6626\u6622\u6633\u662B\u663A\u661D\u6634\u6639\u662E\u670F\u6710\u67C1\u67F2\u67C8\u67BA"],
      ["cf40", "\u67DC\u67BB\u67F8\u67D8\u67C0\u67B7\u67C5\u67EB\u67E4\u67DF\u67B5\u67CD\u67B3\u67F7\u67F6\u67EE\u67E3\u67C2\u67B9\u67CE\u67E7\u67F0\u67B2\u67FC\u67C6\u67ED\u67CC\u67AE\u67E6\u67DB\u67FA\u67C9\u67CA\u67C3\u67EA\u67CB\u6B28\u6B82\u6B84\u6BB6\u6BD6\u6BD8\u6BE0\u6C20\u6C21\u6D28\u6D34\u6D2D\u6D1F\u6D3C\u6D3F\u6D12\u6D0A\u6CDA\u6D33\u6D04\u6D19\u6D3A\u6D1A\u6D11\u6D00\u6D1D\u6D42"],
      ["cfa1", "\u6D01\u6D18\u6D37\u6D03\u6D0F\u6D40\u6D07\u6D20\u6D2C\u6D08\u6D22\u6D09\u6D10\u70B7\u709F\u70BE\u70B1\u70B0\u70A1\u70B4\u70B5\u70A9\u7241\u7249\u724A\u726C\u7270\u7273\u726E\u72CA\u72E4\u72E8\u72EB\u72DF\u72EA\u72E6\u72E3\u7385\u73CC\u73C2\u73C8\u73C5\u73B9\u73B6\u73B5\u73B4\u73EB\u73BF\u73C7\u73BE\u73C3\u73C6\u73B8\u73CB\u74EC\u74EE\u752E\u7547\u7548\u75A7\u75AA\u7679\u76C4\u7708\u7703\u7704\u7705\u770A\u76F7\u76FB\u76FA\u77E7\u77E8\u7806\u7811\u7812\u7805\u7810\u780F\u780E\u7809\u7803\u7813\u794A\u794C\u794B\u7945\u7944\u79D5\u79CD\u79CF\u79D6\u79CE\u7A80"],
      ["d040", "\u7A7E\u7AD1\u7B00\u7B01\u7C7A\u7C78\u7C79\u7C7F\u7C80\u7C81\u7D03\u7D08\u7D01\u7F58\u7F91\u7F8D\u7FBE\u8007\u800E\u800F\u8014\u8037\u80D8\u80C7\u80E0\u80D1\u80C8\u80C2\u80D0\u80C5\u80E3\u80D9\u80DC\u80CA\u80D5\u80C9\u80CF\u80D7\u80E6\u80CD\u81FF\u8221\u8294\u82D9\u82FE\u82F9\u8307\u82E8\u8300\u82D5\u833A\u82EB\u82D6\u82F4\u82EC\u82E1\u82F2\u82F5\u830C\u82FB\u82F6\u82F0\u82EA"],
      ["d0a1", "\u82E4\u82E0\u82FA\u82F3\u82ED\u8677\u8674\u867C\u8673\u8841\u884E\u8867\u886A\u8869\u89D3\u8A04\u8A07\u8D72\u8FE3\u8FE1\u8FEE\u8FE0\u90F1\u90BD\u90BF\u90D5\u90C5\u90BE\u90C7\u90CB\u90C8\u91D4\u91D3\u9654\u964F\u9651\u9653\u964A\u964E\u501E\u5005\u5007\u5013\u5022\u5030\u501B\u4FF5\u4FF4\u5033\u5037\u502C\u4FF6\u4FF7\u5017\u501C\u5020\u5027\u5035\u502F\u5031\u500E\u515A\u5194\u5193\u51CA\u51C4\u51C5\u51C8\u51CE\u5261\u525A\u5252\u525E\u525F\u5255\u5262\u52CD\u530E\u539E\u5526\u54E2\u5517\u5512\u54E7\u54F3\u54E4\u551A\u54FF\u5504\u5508\u54EB\u5511\u5505\u54F1"],
      ["d140", "\u550A\u54FB\u54F7\u54F8\u54E0\u550E\u5503\u550B\u5701\u5702\u57CC\u5832\u57D5\u57D2\u57BA\u57C6\u57BD\u57BC\u57B8\u57B6\u57BF\u57C7\u57D0\u57B9\u57C1\u590E\u594A\u5A19\u5A16\u5A2D\u5A2E\u5A15\u5A0F\u5A17\u5A0A\u5A1E\u5A33\u5B6C\u5BA7\u5BAD\u5BAC\u5C03\u5C56\u5C54\u5CEC\u5CFF\u5CEE\u5CF1\u5CF7\u5D00\u5CF9\u5E29\u5E28\u5EA8\u5EAE\u5EAA\u5EAC\u5F33\u5F30\u5F67\u605D\u605A\u6067"],
      ["d1a1", "\u6041\u60A2\u6088\u6080\u6092\u6081\u609D\u6083\u6095\u609B\u6097\u6087\u609C\u608E\u6219\u6246\u62F2\u6310\u6356\u632C\u6344\u6345\u6336\u6343\u63E4\u6339\u634B\u634A\u633C\u6329\u6341\u6334\u6358\u6354\u6359\u632D\u6347\u6333\u635A\u6351\u6338\u6357\u6340\u6348\u654A\u6546\u65C6\u65C3\u65C4\u65C2\u664A\u665F\u6647\u6651\u6712\u6713\u681F\u681A\u6849\u6832\u6833\u683B\u684B\u684F\u6816\u6831\u681C\u6835\u682B\u682D\u682F\u684E\u6844\u6834\u681D\u6812\u6814\u6826\u6828\u682E\u684D\u683A\u6825\u6820\u6B2C\u6B2F\u6B2D\u6B31\u6B34\u6B6D\u8082\u6B88\u6BE6\u6BE4"],
      ["d240", "\u6BE8\u6BE3\u6BE2\u6BE7\u6C25\u6D7A\u6D63\u6D64\u6D76\u6D0D\u6D61\u6D92\u6D58\u6D62\u6D6D\u6D6F\u6D91\u6D8D\u6DEF\u6D7F\u6D86\u6D5E\u6D67\u6D60\u6D97\u6D70\u6D7C\u6D5F\u6D82\u6D98\u6D2F\u6D68\u6D8B\u6D7E\u6D80\u6D84\u6D16\u6D83\u6D7B\u6D7D\u6D75\u6D90\u70DC\u70D3\u70D1\u70DD\u70CB\u7F39\u70E2\u70D7\u70D2\u70DE\u70E0\u70D4\u70CD\u70C5\u70C6\u70C7\u70DA\u70CE\u70E1\u7242\u7278"],
      ["d2a1", "\u7277\u7276\u7300\u72FA\u72F4\u72FE\u72F6\u72F3\u72FB\u7301\u73D3\u73D9\u73E5\u73D6\u73BC\u73E7\u73E3\u73E9\u73DC\u73D2\u73DB\u73D4\u73DD\u73DA\u73D7\u73D8\u73E8\u74DE\u74DF\u74F4\u74F5\u7521\u755B\u755F\u75B0\u75C1\u75BB\u75C4\u75C0\u75BF\u75B6\u75BA\u768A\u76C9\u771D\u771B\u7710\u7713\u7712\u7723\u7711\u7715\u7719\u771A\u7722\u7727\u7823\u782C\u7822\u7835\u782F\u7828\u782E\u782B\u7821\u7829\u7833\u782A\u7831\u7954\u795B\u794F\u795C\u7953\u7952\u7951\u79EB\u79EC\u79E0\u79EE\u79ED\u79EA\u79DC\u79DE\u79DD\u7A86\u7A89\u7A85\u7A8B\u7A8C\u7A8A\u7A87\u7AD8\u7B10"],
      ["d340", "\u7B04\u7B13\u7B05\u7B0F\u7B08\u7B0A\u7B0E\u7B09\u7B12\u7C84\u7C91\u7C8A\u7C8C\u7C88\u7C8D\u7C85\u7D1E\u7D1D\u7D11\u7D0E\u7D18\u7D16\u7D13\u7D1F\u7D12\u7D0F\u7D0C\u7F5C\u7F61\u7F5E\u7F60\u7F5D\u7F5B\u7F96\u7F92\u7FC3\u7FC2\u7FC0\u8016\u803E\u8039\u80FA\u80F2\u80F9\u80F5\u8101\u80FB\u8100\u8201\u822F\u8225\u8333\u832D\u8344\u8319\u8351\u8325\u8356\u833F\u8341\u8326\u831C\u8322"],
      ["d3a1", "\u8342\u834E\u831B\u832A\u8308\u833C\u834D\u8316\u8324\u8320\u8337\u832F\u8329\u8347\u8345\u834C\u8353\u831E\u832C\u834B\u8327\u8348\u8653\u8652\u86A2\u86A8\u8696\u868D\u8691\u869E\u8687\u8697\u8686\u868B\u869A\u8685\u86A5\u8699\u86A1\u86A7\u8695\u8698\u868E\u869D\u8690\u8694\u8843\u8844\u886D\u8875\u8876\u8872\u8880\u8871\u887F\u886F\u8883\u887E\u8874\u887C\u8A12\u8C47\u8C57\u8C7B\u8CA4\u8CA3\u8D76\u8D78\u8DB5\u8DB7\u8DB6\u8ED1\u8ED3\u8FFE\u8FF5\u9002\u8FFF\u8FFB\u9004\u8FFC\u8FF6\u90D6\u90E0\u90D9\u90DA\u90E3\u90DF\u90E5\u90D8\u90DB\u90D7\u90DC\u90E4\u9150"],
      ["d440", "\u914E\u914F\u91D5\u91E2\u91DA\u965C\u965F\u96BC\u98E3\u9ADF\u9B2F\u4E7F\u5070\u506A\u5061\u505E\u5060\u5053\u504B\u505D\u5072\u5048\u504D\u5041\u505B\u504A\u5062\u5015\u5045\u505F\u5069\u506B\u5063\u5064\u5046\u5040\u506E\u5073\u5057\u5051\u51D0\u526B\u526D\u526C\u526E\u52D6\u52D3\u532D\u539C\u5575\u5576\u553C\u554D\u5550\u5534\u552A\u5551\u5562\u5536\u5535\u5530\u5552\u5545"],
      ["d4a1", "\u550C\u5532\u5565\u554E\u5539\u5548\u552D\u553B\u5540\u554B\u570A\u5707\u57FB\u5814\u57E2\u57F6\u57DC\u57F4\u5800\u57ED\u57FD\u5808\u57F8\u580B\u57F3\u57CF\u5807\u57EE\u57E3\u57F2\u57E5\u57EC\u57E1\u580E\u57FC\u5810\u57E7\u5801\u580C\u57F1\u57E9\u57F0\u580D\u5804\u595C\u5A60\u5A58\u5A55\u5A67\u5A5E\u5A38\u5A35\u5A6D\u5A50\u5A5F\u5A65\u5A6C\u5A53\u5A64\u5A57\u5A43\u5A5D\u5A52\u5A44\u5A5B\u5A48\u5A8E\u5A3E\u5A4D\u5A39\u5A4C\u5A70\u5A69\u5A47\u5A51\u5A56\u5A42\u5A5C\u5B72\u5B6E\u5BC1\u5BC0\u5C59\u5D1E\u5D0B\u5D1D\u5D1A\u5D20\u5D0C\u5D28\u5D0D\u5D26\u5D25\u5D0F"],
      ["d540", "\u5D30\u5D12\u5D23\u5D1F\u5D2E\u5E3E\u5E34\u5EB1\u5EB4\u5EB9\u5EB2\u5EB3\u5F36\u5F38\u5F9B\u5F96\u5F9F\u608A\u6090\u6086\u60BE\u60B0\u60BA\u60D3\u60D4\u60CF\u60E4\u60D9\u60DD\u60C8\u60B1\u60DB\u60B7\u60CA\u60BF\u60C3\u60CD\u60C0\u6332\u6365\u638A\u6382\u637D\u63BD\u639E\u63AD\u639D\u6397\u63AB\u638E\u636F\u6387\u6390\u636E\u63AF\u6375\u639C\u636D\u63AE\u637C\u63A4\u633B\u639F"],
      ["d5a1", "\u6378\u6385\u6381\u6391\u638D\u6370\u6553\u65CD\u6665\u6661\u665B\u6659\u665C\u6662\u6718\u6879\u6887\u6890\u689C\u686D\u686E\u68AE\u68AB\u6956\u686F\u68A3\u68AC\u68A9\u6875\u6874\u68B2\u688F\u6877\u6892\u687C\u686B\u6872\u68AA\u6880\u6871\u687E\u689B\u6896\u688B\u68A0\u6889\u68A4\u6878\u687B\u6891\u688C\u688A\u687D\u6B36\u6B33\u6B37\u6B38\u6B91\u6B8F\u6B8D\u6B8E\u6B8C\u6C2A\u6DC0\u6DAB\u6DB4\u6DB3\u6E74\u6DAC\u6DE9\u6DE2\u6DB7\u6DF6\u6DD4\u6E00\u6DC8\u6DE0\u6DDF\u6DD6\u6DBE\u6DE5\u6DDC\u6DDD\u6DDB\u6DF4\u6DCA\u6DBD\u6DED\u6DF0\u6DBA\u6DD5\u6DC2\u6DCF\u6DC9"],
      ["d640", "\u6DD0\u6DF2\u6DD3\u6DFD\u6DD7\u6DCD\u6DE3\u6DBB\u70FA\u710D\u70F7\u7117\u70F4\u710C\u70F0\u7104\u70F3\u7110\u70FC\u70FF\u7106\u7113\u7100\u70F8\u70F6\u710B\u7102\u710E\u727E\u727B\u727C\u727F\u731D\u7317\u7307\u7311\u7318\u730A\u7308\u72FF\u730F\u731E\u7388\u73F6\u73F8\u73F5\u7404\u7401\u73FD\u7407\u7400\u73FA\u73FC\u73FF\u740C\u740B\u73F4\u7408\u7564\u7563\u75CE\u75D2\u75CF"],
      ["d6a1", "\u75CB\u75CC\u75D1\u75D0\u768F\u7689\u76D3\u7739\u772F\u772D\u7731\u7732\u7734\u7733\u773D\u7725\u773B\u7735\u7848\u7852\u7849\u784D\u784A\u784C\u7826\u7845\u7850\u7964\u7967\u7969\u796A\u7963\u796B\u7961\u79BB\u79FA\u79F8\u79F6\u79F7\u7A8F\u7A94\u7A90\u7B35\u7B47\u7B34\u7B25\u7B30\u7B22\u7B24\u7B33\u7B18\u7B2A\u7B1D\u7B31\u7B2B\u7B2D\u7B2F\u7B32\u7B38\u7B1A\u7B23\u7C94\u7C98\u7C96\u7CA3\u7D35\u7D3D\u7D38\u7D36\u7D3A\u7D45\u7D2C\u7D29\u7D41\u7D47\u7D3E\u7D3F\u7D4A\u7D3B\u7D28\u7F63\u7F95\u7F9C\u7F9D\u7F9B\u7FCA\u7FCB\u7FCD\u7FD0\u7FD1\u7FC7\u7FCF\u7FC9\u801F"],
      ["d740", "\u801E\u801B\u8047\u8043\u8048\u8118\u8125\u8119\u811B\u812D\u811F\u812C\u811E\u8121\u8115\u8127\u811D\u8122\u8211\u8238\u8233\u823A\u8234\u8232\u8274\u8390\u83A3\u83A8\u838D\u837A\u8373\u83A4\u8374\u838F\u8381\u8395\u8399\u8375\u8394\u83A9\u837D\u8383\u838C\u839D\u839B\u83AA\u838B\u837E\u83A5\u83AF\u8388\u8397\u83B0\u837F\u83A6\u8387\u83AE\u8376\u839A\u8659\u8656\u86BF\u86B7"],
      ["d7a1", "\u86C2\u86C1\u86C5\u86BA\u86B0\u86C8\u86B9\u86B3\u86B8\u86CC\u86B4\u86BB\u86BC\u86C3\u86BD\u86BE\u8852\u8889\u8895\u88A8\u88A2\u88AA\u889A\u8891\u88A1\u889F\u8898\u88A7\u8899\u889B\u8897\u88A4\u88AC\u888C\u8893\u888E\u8982\u89D6\u89D9\u89D5\u8A30\u8A27\u8A2C\u8A1E\u8C39\u8C3B\u8C5C\u8C5D\u8C7D\u8CA5\u8D7D\u8D7B\u8D79\u8DBC\u8DC2\u8DB9\u8DBF\u8DC1\u8ED8\u8EDE\u8EDD\u8EDC\u8ED7\u8EE0\u8EE1\u9024\u900B\u9011\u901C\u900C\u9021\u90EF\u90EA\u90F0\u90F4\u90F2\u90F3\u90D4\u90EB\u90EC\u90E9\u9156\u9158\u915A\u9153\u9155\u91EC\u91F4\u91F1\u91F3\u91F8\u91E4\u91F9\u91EA"],
      ["d840", "\u91EB\u91F7\u91E8\u91EE\u957A\u9586\u9588\u967C\u966D\u966B\u9671\u966F\u96BF\u976A\u9804\u98E5\u9997\u509B\u5095\u5094\u509E\u508B\u50A3\u5083\u508C\u508E\u509D\u5068\u509C\u5092\u5082\u5087\u515F\u51D4\u5312\u5311\u53A4\u53A7\u5591\u55A8\u55A5\u55AD\u5577\u5645\u55A2\u5593\u5588\u558F\u55B5\u5581\u55A3\u5592\u55A4\u557D\u558C\u55A6\u557F\u5595\u55A1\u558E\u570C\u5829\u5837"],
      ["d8a1", "\u5819\u581E\u5827\u5823\u5828\u57F5\u5848\u5825\u581C\u581B\u5833\u583F\u5836\u582E\u5839\u5838\u582D\u582C\u583B\u5961\u5AAF\u5A94\u5A9F\u5A7A\u5AA2\u5A9E\u5A78\u5AA6\u5A7C\u5AA5\u5AAC\u5A95\u5AAE\u5A37\u5A84\u5A8A\u5A97\u5A83\u5A8B\u5AA9\u5A7B\u5A7D\u5A8C\u5A9C\u5A8F\u5A93\u5A9D\u5BEA\u5BCD\u5BCB\u5BD4\u5BD1\u5BCA\u5BCE\u5C0C\u5C30\u5D37\u5D43\u5D6B\u5D41\u5D4B\u5D3F\u5D35\u5D51\u5D4E\u5D55\u5D33\u5D3A\u5D52\u5D3D\u5D31\u5D59\u5D42\u5D39\u5D49\u5D38\u5D3C\u5D32\u5D36\u5D40\u5D45\u5E44\u5E41\u5F58\u5FA6\u5FA5\u5FAB\u60C9\u60B9\u60CC\u60E2\u60CE\u60C4\u6114"],
      ["d940", "\u60F2\u610A\u6116\u6105\u60F5\u6113\u60F8\u60FC\u60FE\u60C1\u6103\u6118\u611D\u6110\u60FF\u6104\u610B\u624A\u6394\u63B1\u63B0\u63CE\u63E5\u63E8\u63EF\u63C3\u649D\u63F3\u63CA\u63E0\u63F6\u63D5\u63F2\u63F5\u6461\u63DF\u63BE\u63DD\u63DC\u63C4\u63D8\u63D3\u63C2\u63C7\u63CC\u63CB\u63C8\u63F0\u63D7\u63D9\u6532\u6567\u656A\u6564\u655C\u6568\u6565\u658C\u659D\u659E\u65AE\u65D0\u65D2"],
      ["d9a1", "\u667C\u666C\u667B\u6680\u6671\u6679\u666A\u6672\u6701\u690C\u68D3\u6904\u68DC\u692A\u68EC\u68EA\u68F1\u690F\u68D6\u68F7\u68EB\u68E4\u68F6\u6913\u6910\u68F3\u68E1\u6907\u68CC\u6908\u6970\u68B4\u6911\u68EF\u68C6\u6914\u68F8\u68D0\u68FD\u68FC\u68E8\u690B\u690A\u6917\u68CE\u68C8\u68DD\u68DE\u68E6\u68F4\u68D1\u6906\u68D4\u68E9\u6915\u6925\u68C7\u6B39\u6B3B\u6B3F\u6B3C\u6B94\u6B97\u6B99\u6B95\u6BBD\u6BF0\u6BF2\u6BF3\u6C30\u6DFC\u6E46\u6E47\u6E1F\u6E49\u6E88\u6E3C\u6E3D\u6E45\u6E62\u6E2B\u6E3F\u6E41\u6E5D\u6E73\u6E1C\u6E33\u6E4B\u6E40\u6E51\u6E3B\u6E03\u6E2E\u6E5E"],
      ["da40", "\u6E68\u6E5C\u6E61\u6E31\u6E28\u6E60\u6E71\u6E6B\u6E39\u6E22\u6E30\u6E53\u6E65\u6E27\u6E78\u6E64\u6E77\u6E55\u6E79\u6E52\u6E66\u6E35\u6E36\u6E5A\u7120\u711E\u712F\u70FB\u712E\u7131\u7123\u7125\u7122\u7132\u711F\u7128\u713A\u711B\u724B\u725A\u7288\u7289\u7286\u7285\u728B\u7312\u730B\u7330\u7322\u7331\u7333\u7327\u7332\u732D\u7326\u7323\u7335\u730C\u742E\u742C\u7430\u742B\u7416"],
      ["daa1", "\u741A\u7421\u742D\u7431\u7424\u7423\u741D\u7429\u7420\u7432\u74FB\u752F\u756F\u756C\u75E7\u75DA\u75E1\u75E6\u75DD\u75DF\u75E4\u75D7\u7695\u7692\u76DA\u7746\u7747\u7744\u774D\u7745\u774A\u774E\u774B\u774C\u77DE\u77EC\u7860\u7864\u7865\u785C\u786D\u7871\u786A\u786E\u7870\u7869\u7868\u785E\u7862\u7974\u7973\u7972\u7970\u7A02\u7A0A\u7A03\u7A0C\u7A04\u7A99\u7AE6\u7AE4\u7B4A\u7B3B\u7B44\u7B48\u7B4C\u7B4E\u7B40\u7B58\u7B45\u7CA2\u7C9E\u7CA8\u7CA1\u7D58\u7D6F\u7D63\u7D53\u7D56\u7D67\u7D6A\u7D4F\u7D6D\u7D5C\u7D6B\u7D52\u7D54\u7D69\u7D51\u7D5F\u7D4E\u7F3E\u7F3F\u7F65"],
      ["db40", "\u7F66\u7FA2\u7FA0\u7FA1\u7FD7\u8051\u804F\u8050\u80FE\u80D4\u8143\u814A\u8152\u814F\u8147\u813D\u814D\u813A\u81E6\u81EE\u81F7\u81F8\u81F9\u8204\u823C\u823D\u823F\u8275\u833B\u83CF\u83F9\u8423\u83C0\u83E8\u8412\u83E7\u83E4\u83FC\u83F6\u8410\u83C6\u83C8\u83EB\u83E3\u83BF\u8401\u83DD\u83E5\u83D8\u83FF\u83E1\u83CB\u83CE\u83D6\u83F5\u83C9\u8409\u840F\u83DE\u8411\u8406\u83C2\u83F3"],
      ["dba1", "\u83D5\u83FA\u83C7\u83D1\u83EA\u8413\u83C3\u83EC\u83EE\u83C4\u83FB\u83D7\u83E2\u841B\u83DB\u83FE\u86D8\u86E2\u86E6\u86D3\u86E3\u86DA\u86EA\u86DD\u86EB\u86DC\u86EC\u86E9\u86D7\u86E8\u86D1\u8848\u8856\u8855\u88BA\u88D7\u88B9\u88B8\u88C0\u88BE\u88B6\u88BC\u88B7\u88BD\u88B2\u8901\u88C9\u8995\u8998\u8997\u89DD\u89DA\u89DB\u8A4E\u8A4D\u8A39\u8A59\u8A40\u8A57\u8A58\u8A44\u8A45\u8A52\u8A48\u8A51\u8A4A\u8A4C\u8A4F\u8C5F\u8C81\u8C80\u8CBA\u8CBE\u8CB0\u8CB9\u8CB5\u8D84\u8D80\u8D89\u8DD8\u8DD3\u8DCD\u8DC7\u8DD6\u8DDC\u8DCF\u8DD5\u8DD9\u8DC8\u8DD7\u8DC5\u8EEF\u8EF7\u8EFA"],
      ["dc40", "\u8EF9\u8EE6\u8EEE\u8EE5\u8EF5\u8EE7\u8EE8\u8EF6\u8EEB\u8EF1\u8EEC\u8EF4\u8EE9\u902D\u9034\u902F\u9106\u912C\u9104\u90FF\u90FC\u9108\u90F9\u90FB\u9101\u9100\u9107\u9105\u9103\u9161\u9164\u915F\u9162\u9160\u9201\u920A\u9225\u9203\u921A\u9226\u920F\u920C\u9200\u9212\u91FF\u91FD\u9206\u9204\u9227\u9202\u921C\u9224\u9219\u9217\u9205\u9216\u957B\u958D\u958C\u9590\u9687\u967E\u9688"],
      ["dca1", "\u9689\u9683\u9680\u96C2\u96C8\u96C3\u96F1\u96F0\u976C\u9770\u976E\u9807\u98A9\u98EB\u9CE6\u9EF9\u4E83\u4E84\u4EB6\u50BD\u50BF\u50C6\u50AE\u50C4\u50CA\u50B4\u50C8\u50C2\u50B0\u50C1\u50BA\u50B1\u50CB\u50C9\u50B6\u50B8\u51D7\u527A\u5278\u527B\u527C\u55C3\u55DB\u55CC\u55D0\u55CB\u55CA\u55DD\u55C0\u55D4\u55C4\u55E9\u55BF\u55D2\u558D\u55CF\u55D5\u55E2\u55D6\u55C8\u55F2\u55CD\u55D9\u55C2\u5714\u5853\u5868\u5864\u584F\u584D\u5849\u586F\u5855\u584E\u585D\u5859\u5865\u585B\u583D\u5863\u5871\u58FC\u5AC7\u5AC4\u5ACB\u5ABA\u5AB8\u5AB1\u5AB5\u5AB0\u5ABF\u5AC8\u5ABB\u5AC6"],
      ["dd40", "\u5AB7\u5AC0\u5ACA\u5AB4\u5AB6\u5ACD\u5AB9\u5A90\u5BD6\u5BD8\u5BD9\u5C1F\u5C33\u5D71\u5D63\u5D4A\u5D65\u5D72\u5D6C\u5D5E\u5D68\u5D67\u5D62\u5DF0\u5E4F\u5E4E\u5E4A\u5E4D\u5E4B\u5EC5\u5ECC\u5EC6\u5ECB\u5EC7\u5F40\u5FAF\u5FAD\u60F7\u6149\u614A\u612B\u6145\u6136\u6132\u612E\u6146\u612F\u614F\u6129\u6140\u6220\u9168\u6223\u6225\u6224\u63C5\u63F1\u63EB\u6410\u6412\u6409\u6420\u6424"],
      ["dda1", "\u6433\u6443\u641F\u6415\u6418\u6439\u6437\u6422\u6423\u640C\u6426\u6430\u6428\u6441\u6435\u642F\u640A\u641A\u6440\u6425\u6427\u640B\u63E7\u641B\u642E\u6421\u640E\u656F\u6592\u65D3\u6686\u668C\u6695\u6690\u668B\u668A\u6699\u6694\u6678\u6720\u6966\u695F\u6938\u694E\u6962\u6971\u693F\u6945\u696A\u6939\u6942\u6957\u6959\u697A\u6948\u6949\u6935\u696C\u6933\u693D\u6965\u68F0\u6978\u6934\u6969\u6940\u696F\u6944\u6976\u6958\u6941\u6974\u694C\u693B\u694B\u6937\u695C\u694F\u6951\u6932\u6952\u692F\u697B\u693C\u6B46\u6B45\u6B43\u6B42\u6B48\u6B41\u6B9B\uFA0D\u6BFB\u6BFC"],
      ["de40", "\u6BF9\u6BF7\u6BF8\u6E9B\u6ED6\u6EC8\u6E8F\u6EC0\u6E9F\u6E93\u6E94\u6EA0\u6EB1\u6EB9\u6EC6\u6ED2\u6EBD\u6EC1\u6E9E\u6EC9\u6EB7\u6EB0\u6ECD\u6EA6\u6ECF\u6EB2\u6EBE\u6EC3\u6EDC\u6ED8\u6E99\u6E92\u6E8E\u6E8D\u6EA4\u6EA1\u6EBF\u6EB3\u6ED0\u6ECA\u6E97\u6EAE\u6EA3\u7147\u7154\u7152\u7163\u7160\u7141\u715D\u7162\u7172\u7178\u716A\u7161\u7142\u7158\u7143\u714B\u7170\u715F\u7150\u7153"],
      ["dea1", "\u7144\u714D\u715A\u724F\u728D\u728C\u7291\u7290\u728E\u733C\u7342\u733B\u733A\u7340\u734A\u7349\u7444\u744A\u744B\u7452\u7451\u7457\u7440\u744F\u7450\u744E\u7442\u7446\u744D\u7454\u74E1\u74FF\u74FE\u74FD\u751D\u7579\u7577\u6983\u75EF\u760F\u7603\u75F7\u75FE\u75FC\u75F9\u75F8\u7610\u75FB\u75F6\u75ED\u75F5\u75FD\u7699\u76B5\u76DD\u7755\u775F\u7760\u7752\u7756\u775A\u7769\u7767\u7754\u7759\u776D\u77E0\u7887\u789A\u7894\u788F\u7884\u7895\u7885\u7886\u78A1\u7883\u7879\u7899\u7880\u7896\u787B\u797C\u7982\u797D\u7979\u7A11\u7A18\u7A19\u7A12\u7A17\u7A15\u7A22\u7A13"],
      ["df40", "\u7A1B\u7A10\u7AA3\u7AA2\u7A9E\u7AEB\u7B66\u7B64\u7B6D\u7B74\u7B69\u7B72\u7B65\u7B73\u7B71\u7B70\u7B61\u7B78\u7B76\u7B63\u7CB2\u7CB4\u7CAF\u7D88\u7D86\u7D80\u7D8D\u7D7F\u7D85\u7D7A\u7D8E\u7D7B\u7D83\u7D7C\u7D8C\u7D94\u7D84\u7D7D\u7D92\u7F6D\u7F6B\u7F67\u7F68\u7F6C\u7FA6\u7FA5\u7FA7\u7FDB\u7FDC\u8021\u8164\u8160\u8177\u815C\u8169\u815B\u8162\u8172\u6721\u815E\u8176\u8167\u816F"],
      ["dfa1", "\u8144\u8161\u821D\u8249\u8244\u8240\u8242\u8245\u84F1\u843F\u8456\u8476\u8479\u848F\u848D\u8465\u8451\u8440\u8486\u8467\u8430\u844D\u847D\u845A\u8459\u8474\u8473\u845D\u8507\u845E\u8437\u843A\u8434\u847A\u8443\u8478\u8432\u8445\u8429\u83D9\u844B\u842F\u8442\u842D\u845F\u8470\u8439\u844E\u844C\u8452\u846F\u84C5\u848E\u843B\u8447\u8436\u8433\u8468\u847E\u8444\u842B\u8460\u8454\u846E\u8450\u870B\u8704\u86F7\u870C\u86FA\u86D6\u86F5\u874D\u86F8\u870E\u8709\u8701\u86F6\u870D\u8705\u88D6\u88CB\u88CD\u88CE\u88DE\u88DB\u88DA\u88CC\u88D0\u8985\u899B\u89DF\u89E5\u89E4"],
      ["e040", "\u89E1\u89E0\u89E2\u89DC\u89E6\u8A76\u8A86\u8A7F\u8A61\u8A3F\u8A77\u8A82\u8A84\u8A75\u8A83\u8A81\u8A74\u8A7A\u8C3C\u8C4B\u8C4A\u8C65\u8C64\u8C66\u8C86\u8C84\u8C85\u8CCC\u8D68\u8D69\u8D91\u8D8C\u8D8E\u8D8F\u8D8D\u8D93\u8D94\u8D90\u8D92\u8DF0\u8DE0\u8DEC\u8DF1\u8DEE\u8DD0\u8DE9\u8DE3\u8DE2\u8DE7\u8DF2\u8DEB\u8DF4\u8F06\u8EFF\u8F01\u8F00\u8F05\u8F07\u8F08\u8F02\u8F0B\u9052\u903F"],
      ["e0a1", "\u9044\u9049\u903D\u9110\u910D\u910F\u9111\u9116\u9114\u910B\u910E\u916E\u916F\u9248\u9252\u9230\u923A\u9266\u9233\u9265\u925E\u9283\u922E\u924A\u9246\u926D\u926C\u924F\u9260\u9267\u926F\u9236\u9261\u9270\u9231\u9254\u9263\u9250\u9272\u924E\u9253\u924C\u9256\u9232\u959F\u959C\u959E\u959B\u9692\u9693\u9691\u9697\u96CE\u96FA\u96FD\u96F8\u96F5\u9773\u9777\u9778\u9772\u980F\u980D\u980E\u98AC\u98F6\u98F9\u99AF\u99B2\u99B0\u99B5\u9AAD\u9AAB\u9B5B\u9CEA\u9CED\u9CE7\u9E80\u9EFD\u50E6\u50D4\u50D7\u50E8\u50F3\u50DB\u50EA\u50DD\u50E4\u50D3\u50EC\u50F0\u50EF\u50E3\u50E0"],
      ["e140", "\u51D8\u5280\u5281\u52E9\u52EB\u5330\u53AC\u5627\u5615\u560C\u5612\u55FC\u560F\u561C\u5601\u5613\u5602\u55FA\u561D\u5604\u55FF\u55F9\u5889\u587C\u5890\u5898\u5886\u5881\u587F\u5874\u588B\u587A\u5887\u5891\u588E\u5876\u5882\u5888\u587B\u5894\u588F\u58FE\u596B\u5ADC\u5AEE\u5AE5\u5AD5\u5AEA\u5ADA\u5AED\u5AEB\u5AF3\u5AE2\u5AE0\u5ADB\u5AEC\u5ADE\u5ADD\u5AD9\u5AE8\u5ADF\u5B77\u5BE0"],
      ["e1a1", "\u5BE3\u5C63\u5D82\u5D80\u5D7D\u5D86\u5D7A\u5D81\u5D77\u5D8A\u5D89\u5D88\u5D7E\u5D7C\u5D8D\u5D79\u5D7F\u5E58\u5E59\u5E53\u5ED8\u5ED1\u5ED7\u5ECE\u5EDC\u5ED5\u5ED9\u5ED2\u5ED4\u5F44\u5F43\u5F6F\u5FB6\u612C\u6128\u6141\u615E\u6171\u6173\u6152\u6153\u6172\u616C\u6180\u6174\u6154\u617A\u615B\u6165\u613B\u616A\u6161\u6156\u6229\u6227\u622B\u642B\u644D\u645B\u645D\u6474\u6476\u6472\u6473\u647D\u6475\u6466\u64A6\u644E\u6482\u645E\u645C\u644B\u6453\u6460\u6450\u647F\u643F\u646C\u646B\u6459\u6465\u6477\u6573\u65A0\u66A1\u66A0\u669F\u6705\u6704\u6722\u69B1\u69B6\u69C9"],
      ["e240", "\u69A0\u69CE\u6996\u69B0\u69AC\u69BC\u6991\u6999\u698E\u69A7\u698D\u69A9\u69BE\u69AF\u69BF\u69C4\u69BD\u69A4\u69D4\u69B9\u69CA\u699A\u69CF\u69B3\u6993\u69AA\u69A1\u699E\u69D9\u6997\u6990\u69C2\u69B5\u69A5\u69C6\u6B4A\u6B4D\u6B4B\u6B9E\u6B9F\u6BA0\u6BC3\u6BC4\u6BFE\u6ECE\u6EF5\u6EF1\u6F03\u6F25\u6EF8\u6F37\u6EFB\u6F2E\u6F09\u6F4E\u6F19\u6F1A\u6F27\u6F18\u6F3B\u6F12\u6EED\u6F0A"],
      ["e2a1", "\u6F36\u6F73\u6EF9\u6EEE\u6F2D\u6F40\u6F30\u6F3C\u6F35\u6EEB\u6F07\u6F0E\u6F43\u6F05\u6EFD\u6EF6\u6F39\u6F1C\u6EFC\u6F3A\u6F1F\u6F0D\u6F1E\u6F08\u6F21\u7187\u7190\u7189\u7180\u7185\u7182\u718F\u717B\u7186\u7181\u7197\u7244\u7253\u7297\u7295\u7293\u7343\u734D\u7351\u734C\u7462\u7473\u7471\u7475\u7472\u7467\u746E\u7500\u7502\u7503\u757D\u7590\u7616\u7608\u760C\u7615\u7611\u760A\u7614\u76B8\u7781\u777C\u7785\u7782\u776E\u7780\u776F\u777E\u7783\u78B2\u78AA\u78B4\u78AD\u78A8\u787E\u78AB\u789E\u78A5\u78A0\u78AC\u78A2\u78A4\u7998\u798A\u798B\u7996\u7995\u7994\u7993"],
      ["e340", "\u7997\u7988\u7992\u7990\u7A2B\u7A4A\u7A30\u7A2F\u7A28\u7A26\u7AA8\u7AAB\u7AAC\u7AEE\u7B88\u7B9C\u7B8A\u7B91\u7B90\u7B96\u7B8D\u7B8C\u7B9B\u7B8E\u7B85\u7B98\u5284\u7B99\u7BA4\u7B82\u7CBB\u7CBF\u7CBC\u7CBA\u7DA7\u7DB7\u7DC2\u7DA3\u7DAA\u7DC1\u7DC0\u7DC5\u7D9D\u7DCE\u7DC4\u7DC6\u7DCB\u7DCC\u7DAF\u7DB9\u7D96\u7DBC\u7D9F\u7DA6\u7DAE\u7DA9\u7DA1\u7DC9\u7F73\u7FE2\u7FE3\u7FE5\u7FDE"],
      ["e3a1", "\u8024\u805D\u805C\u8189\u8186\u8183\u8187\u818D\u818C\u818B\u8215\u8497\u84A4\u84A1\u849F\u84BA\u84CE\u84C2\u84AC\u84AE\u84AB\u84B9\u84B4\u84C1\u84CD\u84AA\u849A\u84B1\u84D0\u849D\u84A7\u84BB\u84A2\u8494\u84C7\u84CC\u849B\u84A9\u84AF\u84A8\u84D6\u8498\u84B6\u84CF\u84A0\u84D7\u84D4\u84D2\u84DB\u84B0\u8491\u8661\u8733\u8723\u8728\u876B\u8740\u872E\u871E\u8721\u8719\u871B\u8743\u872C\u8741\u873E\u8746\u8720\u8732\u872A\u872D\u873C\u8712\u873A\u8731\u8735\u8742\u8726\u8727\u8738\u8724\u871A\u8730\u8711\u88F7\u88E7\u88F1\u88F2\u88FA\u88FE\u88EE\u88FC\u88F6\u88FB"],
      ["e440", "\u88F0\u88EC\u88EB\u899D\u89A1\u899F\u899E\u89E9\u89EB\u89E8\u8AAB\u8A99\u8A8B\u8A92\u8A8F\u8A96\u8C3D\u8C68\u8C69\u8CD5\u8CCF\u8CD7\u8D96\u8E09\u8E02\u8DFF\u8E0D\u8DFD\u8E0A\u8E03\u8E07\u8E06\u8E05\u8DFE\u8E00\u8E04\u8F10\u8F11\u8F0E\u8F0D\u9123\u911C\u9120\u9122\u911F\u911D\u911A\u9124\u9121\u911B\u917A\u9172\u9179\u9173\u92A5\u92A4\u9276\u929B\u927A\u92A0\u9294\u92AA\u928D"],
      ["e4a1", "\u92A6\u929A\u92AB\u9279\u9297\u927F\u92A3\u92EE\u928E\u9282\u9295\u92A2\u927D\u9288\u92A1\u928A\u9286\u928C\u9299\u92A7\u927E\u9287\u92A9\u929D\u928B\u922D\u969E\u96A1\u96FF\u9758\u977D\u977A\u977E\u9783\u9780\u9782\u977B\u9784\u9781\u977F\u97CE\u97CD\u9816\u98AD\u98AE\u9902\u9900\u9907\u999D\u999C\u99C3\u99B9\u99BB\u99BA\u99C2\u99BD\u99C7\u9AB1\u9AE3\u9AE7\u9B3E\u9B3F\u9B60\u9B61\u9B5F\u9CF1\u9CF2\u9CF5\u9EA7\u50FF\u5103\u5130\u50F8\u5106\u5107\u50F6\u50FE\u510B\u510C\u50FD\u510A\u528B\u528C\u52F1\u52EF\u5648\u5642\u564C\u5635\u5641\u564A\u5649\u5646\u5658"],
      ["e540", "\u565A\u5640\u5633\u563D\u562C\u563E\u5638\u562A\u563A\u571A\u58AB\u589D\u58B1\u58A0\u58A3\u58AF\u58AC\u58A5\u58A1\u58FF\u5AFF\u5AF4\u5AFD\u5AF7\u5AF6\u5B03\u5AF8\u5B02\u5AF9\u5B01\u5B07\u5B05\u5B0F\u5C67\u5D99\u5D97\u5D9F\u5D92\u5DA2\u5D93\u5D95\u5DA0\u5D9C\u5DA1\u5D9A\u5D9E\u5E69\u5E5D\u5E60\u5E5C\u7DF3\u5EDB\u5EDE\u5EE1\u5F49\u5FB2\u618B\u6183\u6179\u61B1\u61B0\u61A2\u6189"],
      ["e5a1", "\u619B\u6193\u61AF\u61AD\u619F\u6192\u61AA\u61A1\u618D\u6166\u61B3\u622D\u646E\u6470\u6496\u64A0\u6485\u6497\u649C\u648F\u648B\u648A\u648C\u64A3\u649F\u6468\u64B1\u6498\u6576\u657A\u6579\u657B\u65B2\u65B3\u66B5\u66B0\u66A9\u66B2\u66B7\u66AA\u66AF\u6A00\u6A06\u6A17\u69E5\u69F8\u6A15\u69F1\u69E4\u6A20\u69FF\u69EC\u69E2\u6A1B\u6A1D\u69FE\u6A27\u69F2\u69EE\u6A14\u69F7\u69E7\u6A40\u6A08\u69E6\u69FB\u6A0D\u69FC\u69EB\u6A09\u6A04\u6A18\u6A25\u6A0F\u69F6\u6A26\u6A07\u69F4\u6A16\u6B51\u6BA5\u6BA3\u6BA2\u6BA6\u6C01\u6C00\u6BFF\u6C02\u6F41\u6F26\u6F7E\u6F87\u6FC6\u6F92"],
      ["e640", "\u6F8D\u6F89\u6F8C\u6F62\u6F4F\u6F85\u6F5A\u6F96\u6F76\u6F6C\u6F82\u6F55\u6F72\u6F52\u6F50\u6F57\u6F94\u6F93\u6F5D\u6F00\u6F61\u6F6B\u6F7D\u6F67\u6F90\u6F53\u6F8B\u6F69\u6F7F\u6F95\u6F63\u6F77\u6F6A\u6F7B\u71B2\u71AF\u719B\u71B0\u71A0\u719A\u71A9\u71B5\u719D\u71A5\u719E\u71A4\u71A1\u71AA\u719C\u71A7\u71B3\u7298\u729A\u7358\u7352\u735E\u735F\u7360\u735D\u735B\u7361\u735A\u7359"],
      ["e6a1", "\u7362\u7487\u7489\u748A\u7486\u7481\u747D\u7485\u7488\u747C\u7479\u7508\u7507\u757E\u7625\u761E\u7619\u761D\u761C\u7623\u761A\u7628\u761B\u769C\u769D\u769E\u769B\u778D\u778F\u7789\u7788\u78CD\u78BB\u78CF\u78CC\u78D1\u78CE\u78D4\u78C8\u78C3\u78C4\u78C9\u799A\u79A1\u79A0\u799C\u79A2\u799B\u6B76\u7A39\u7AB2\u7AB4\u7AB3\u7BB7\u7BCB\u7BBE\u7BAC\u7BCE\u7BAF\u7BB9\u7BCA\u7BB5\u7CC5\u7CC8\u7CCC\u7CCB\u7DF7\u7DDB\u7DEA\u7DE7\u7DD7\u7DE1\u7E03\u7DFA\u7DE6\u7DF6\u7DF1\u7DF0\u7DEE\u7DDF\u7F76\u7FAC\u7FB0\u7FAD\u7FED\u7FEB\u7FEA\u7FEC\u7FE6\u7FE8\u8064\u8067\u81A3\u819F"],
      ["e740", "\u819E\u8195\u81A2\u8199\u8197\u8216\u824F\u8253\u8252\u8250\u824E\u8251\u8524\u853B\u850F\u8500\u8529\u850E\u8509\u850D\u851F\u850A\u8527\u851C\u84FB\u852B\u84FA\u8508\u850C\u84F4\u852A\u84F2\u8515\u84F7\u84EB\u84F3\u84FC\u8512\u84EA\u84E9\u8516\u84FE\u8528\u851D\u852E\u8502\u84FD\u851E\u84F6\u8531\u8526\u84E7\u84E8\u84F0\u84EF\u84F9\u8518\u8520\u8530\u850B\u8519\u852F\u8662"],
      ["e7a1", "\u8756\u8763\u8764\u8777\u87E1\u8773\u8758\u8754\u875B\u8752\u8761\u875A\u8751\u875E\u876D\u876A\u8750\u874E\u875F\u875D\u876F\u876C\u877A\u876E\u875C\u8765\u874F\u877B\u8775\u8762\u8767\u8769\u885A\u8905\u890C\u8914\u890B\u8917\u8918\u8919\u8906\u8916\u8911\u890E\u8909\u89A2\u89A4\u89A3\u89ED\u89F0\u89EC\u8ACF\u8AC6\u8AB8\u8AD3\u8AD1\u8AD4\u8AD5\u8ABB\u8AD7\u8ABE\u8AC0\u8AC5\u8AD8\u8AC3\u8ABA\u8ABD\u8AD9\u8C3E\u8C4D\u8C8F\u8CE5\u8CDF\u8CD9\u8CE8\u8CDA\u8CDD\u8CE7\u8DA0\u8D9C\u8DA1\u8D9B\u8E20\u8E23\u8E25\u8E24\u8E2E\u8E15\u8E1B\u8E16\u8E11\u8E19\u8E26\u8E27"],
      ["e840", "\u8E14\u8E12\u8E18\u8E13\u8E1C\u8E17\u8E1A\u8F2C\u8F24\u8F18\u8F1A\u8F20\u8F23\u8F16\u8F17\u9073\u9070\u906F\u9067\u906B\u912F\u912B\u9129\u912A\u9132\u9126\u912E\u9185\u9186\u918A\u9181\u9182\u9184\u9180\u92D0\u92C3\u92C4\u92C0\u92D9\u92B6\u92CF\u92F1\u92DF\u92D8\u92E9\u92D7\u92DD\u92CC\u92EF\u92C2\u92E8\u92CA\u92C8\u92CE\u92E6\u92CD\u92D5\u92C9\u92E0\u92DE\u92E7\u92D1\u92D3"],
      ["e8a1", "\u92B5\u92E1\u92C6\u92B4\u957C\u95AC\u95AB\u95AE\u95B0\u96A4\u96A2\u96D3\u9705\u9708\u9702\u975A\u978A\u978E\u9788\u97D0\u97CF\u981E\u981D\u9826\u9829\u9828\u9820\u981B\u9827\u98B2\u9908\u98FA\u9911\u9914\u9916\u9917\u9915\u99DC\u99CD\u99CF\u99D3\u99D4\u99CE\u99C9\u99D6\u99D8\u99CB\u99D7\u99CC\u9AB3\u9AEC\u9AEB\u9AF3\u9AF2\u9AF1\u9B46\u9B43\u9B67\u9B74\u9B71\u9B66\u9B76\u9B75\u9B70\u9B68\u9B64\u9B6C\u9CFC\u9CFA\u9CFD\u9CFF\u9CF7\u9D07\u9D00\u9CF9\u9CFB\u9D08\u9D05\u9D04\u9E83\u9ED3\u9F0F\u9F10\u511C\u5113\u5117\u511A\u5111\u51DE\u5334\u53E1\u5670\u5660\u566E"],
      ["e940", "\u5673\u5666\u5663\u566D\u5672\u565E\u5677\u571C\u571B\u58C8\u58BD\u58C9\u58BF\u58BA\u58C2\u58BC\u58C6\u5B17\u5B19\u5B1B\u5B21\u5B14\u5B13\u5B10\u5B16\u5B28\u5B1A\u5B20\u5B1E\u5BEF\u5DAC\u5DB1\u5DA9\u5DA7\u5DB5\u5DB0\u5DAE\u5DAA\u5DA8\u5DB2\u5DAD\u5DAF\u5DB4\u5E67\u5E68\u5E66\u5E6F\u5EE9\u5EE7\u5EE6\u5EE8\u5EE5\u5F4B\u5FBC\u619D\u61A8\u6196\u61C5\u61B4\u61C6\u61C1\u61CC\u61BA"],
      ["e9a1", "\u61BF\u61B8\u618C\u64D7\u64D6\u64D0\u64CF\u64C9\u64BD\u6489\u64C3\u64DB\u64F3\u64D9\u6533\u657F\u657C\u65A2\u66C8\u66BE\u66C0\u66CA\u66CB\u66CF\u66BD\u66BB\u66BA\u66CC\u6723\u6A34\u6A66\u6A49\u6A67\u6A32\u6A68\u6A3E\u6A5D\u6A6D\u6A76\u6A5B\u6A51\u6A28\u6A5A\u6A3B\u6A3F\u6A41\u6A6A\u6A64\u6A50\u6A4F\u6A54\u6A6F\u6A69\u6A60\u6A3C\u6A5E\u6A56\u6A55\u6A4D\u6A4E\u6A46\u6B55\u6B54\u6B56\u6BA7\u6BAA\u6BAB\u6BC8\u6BC7\u6C04\u6C03\u6C06\u6FAD\u6FCB\u6FA3\u6FC7\u6FBC\u6FCE\u6FC8\u6F5E\u6FC4\u6FBD\u6F9E\u6FCA\u6FA8\u7004\u6FA5\u6FAE\u6FBA\u6FAC\u6FAA\u6FCF\u6FBF\u6FB8"],
      ["ea40", "\u6FA2\u6FC9\u6FAB\u6FCD\u6FAF\u6FB2\u6FB0\u71C5\u71C2\u71BF\u71B8\u71D6\u71C0\u71C1\u71CB\u71D4\u71CA\u71C7\u71CF\u71BD\u71D8\u71BC\u71C6\u71DA\u71DB\u729D\u729E\u7369\u7366\u7367\u736C\u7365\u736B\u736A\u747F\u749A\u74A0\u7494\u7492\u7495\u74A1\u750B\u7580\u762F\u762D\u7631\u763D\u7633\u763C\u7635\u7632\u7630\u76BB\u76E6\u779A\u779D\u77A1\u779C\u779B\u77A2\u77A3\u7795\u7799"],
      ["eaa1", "\u7797\u78DD\u78E9\u78E5\u78EA\u78DE\u78E3\u78DB\u78E1\u78E2\u78ED\u78DF\u78E0\u79A4\u7A44\u7A48\u7A47\u7AB6\u7AB8\u7AB5\u7AB1\u7AB7\u7BDE\u7BE3\u7BE7\u7BDD\u7BD5\u7BE5\u7BDA\u7BE8\u7BF9\u7BD4\u7BEA\u7BE2\u7BDC\u7BEB\u7BD8\u7BDF\u7CD2\u7CD4\u7CD7\u7CD0\u7CD1\u7E12\u7E21\u7E17\u7E0C\u7E1F\u7E20\u7E13\u7E0E\u7E1C\u7E15\u7E1A\u7E22\u7E0B\u7E0F\u7E16\u7E0D\u7E14\u7E25\u7E24\u7F43\u7F7B\u7F7C\u7F7A\u7FB1\u7FEF\u802A\u8029\u806C\u81B1\u81A6\u81AE\u81B9\u81B5\u81AB\u81B0\u81AC\u81B4\u81B2\u81B7\u81A7\u81F2\u8255\u8256\u8257\u8556\u8545\u856B\u854D\u8553\u8561\u8558"],
      ["eb40", "\u8540\u8546\u8564\u8541\u8562\u8544\u8551\u8547\u8563\u853E\u855B\u8571\u854E\u856E\u8575\u8555\u8567\u8560\u858C\u8566\u855D\u8554\u8565\u856C\u8663\u8665\u8664\u879B\u878F\u8797\u8793\u8792\u8788\u8781\u8796\u8798\u8779\u8787\u87A3\u8785\u8790\u8791\u879D\u8784\u8794\u879C\u879A\u8789\u891E\u8926\u8930\u892D\u892E\u8927\u8931\u8922\u8929\u8923\u892F\u892C\u891F\u89F1\u8AE0"],
      ["eba1", "\u8AE2\u8AF2\u8AF4\u8AF5\u8ADD\u8B14\u8AE4\u8ADF\u8AF0\u8AC8\u8ADE\u8AE1\u8AE8\u8AFF\u8AEF\u8AFB\u8C91\u8C92\u8C90\u8CF5\u8CEE\u8CF1\u8CF0\u8CF3\u8D6C\u8D6E\u8DA5\u8DA7\u8E33\u8E3E\u8E38\u8E40\u8E45\u8E36\u8E3C\u8E3D\u8E41\u8E30\u8E3F\u8EBD\u8F36\u8F2E\u8F35\u8F32\u8F39\u8F37\u8F34\u9076\u9079\u907B\u9086\u90FA\u9133\u9135\u9136\u9193\u9190\u9191\u918D\u918F\u9327\u931E\u9308\u931F\u9306\u930F\u937A\u9338\u933C\u931B\u9323\u9312\u9301\u9346\u932D\u930E\u930D\u92CB\u931D\u92FA\u9325\u9313\u92F9\u92F7\u9334\u9302\u9324\u92FF\u9329\u9339\u9335\u932A\u9314\u930C"],
      ["ec40", "\u930B\u92FE\u9309\u9300\u92FB\u9316\u95BC\u95CD\u95BE\u95B9\u95BA\u95B6\u95BF\u95B5\u95BD\u96A9\u96D4\u970B\u9712\u9710\u9799\u9797\u9794\u97F0\u97F8\u9835\u982F\u9832\u9924\u991F\u9927\u9929\u999E\u99EE\u99EC\u99E5\u99E4\u99F0\u99E3\u99EA\u99E9\u99E7\u9AB9\u9ABF\u9AB4\u9ABB\u9AF6\u9AFA\u9AF9\u9AF7\u9B33\u9B80\u9B85\u9B87\u9B7C\u9B7E\u9B7B\u9B82\u9B93\u9B92\u9B90\u9B7A\u9B95"],
      ["eca1", "\u9B7D\u9B88\u9D25\u9D17\u9D20\u9D1E\u9D14\u9D29\u9D1D\u9D18\u9D22\u9D10\u9D19\u9D1F\u9E88\u9E86\u9E87\u9EAE\u9EAD\u9ED5\u9ED6\u9EFA\u9F12\u9F3D\u5126\u5125\u5122\u5124\u5120\u5129\u52F4\u5693\u568C\u568D\u5686\u5684\u5683\u567E\u5682\u567F\u5681\u58D6\u58D4\u58CF\u58D2\u5B2D\u5B25\u5B32\u5B23\u5B2C\u5B27\u5B26\u5B2F\u5B2E\u5B7B\u5BF1\u5BF2\u5DB7\u5E6C\u5E6A\u5FBE\u5FBB\u61C3\u61B5\u61BC\u61E7\u61E0\u61E5\u61E4\u61E8\u61DE\u64EF\u64E9\u64E3\u64EB\u64E4\u64E8\u6581\u6580\u65B6\u65DA\u66D2\u6A8D\u6A96\u6A81\u6AA5\u6A89\u6A9F\u6A9B\u6AA1\u6A9E\u6A87\u6A93\u6A8E"],
      ["ed40", "\u6A95\u6A83\u6AA8\u6AA4\u6A91\u6A7F\u6AA6\u6A9A\u6A85\u6A8C\u6A92\u6B5B\u6BAD\u6C09\u6FCC\u6FA9\u6FF4\u6FD4\u6FE3\u6FDC\u6FED\u6FE7\u6FE6\u6FDE\u6FF2\u6FDD\u6FE2\u6FE8\u71E1\u71F1\u71E8\u71F2\u71E4\u71F0\u71E2\u7373\u736E\u736F\u7497\u74B2\u74AB\u7490\u74AA\u74AD\u74B1\u74A5\u74AF\u7510\u7511\u7512\u750F\u7584\u7643\u7648\u7649\u7647\u76A4\u76E9\u77B5\u77AB\u77B2\u77B7\u77B6"],
      ["eda1", "\u77B4\u77B1\u77A8\u77F0\u78F3\u78FD\u7902\u78FB\u78FC\u78F2\u7905\u78F9\u78FE\u7904\u79AB\u79A8\u7A5C\u7A5B\u7A56\u7A58\u7A54\u7A5A\u7ABE\u7AC0\u7AC1\u7C05\u7C0F\u7BF2\u7C00\u7BFF\u7BFB\u7C0E\u7BF4\u7C0B\u7BF3\u7C02\u7C09\u7C03\u7C01\u7BF8\u7BFD\u7C06\u7BF0\u7BF1\u7C10\u7C0A\u7CE8\u7E2D\u7E3C\u7E42\u7E33\u9848\u7E38\u7E2A\u7E49\u7E40\u7E47\u7E29\u7E4C\u7E30\u7E3B\u7E36\u7E44\u7E3A\u7F45\u7F7F\u7F7E\u7F7D\u7FF4\u7FF2\u802C\u81BB\u81C4\u81CC\u81CA\u81C5\u81C7\u81BC\u81E9\u825B\u825A\u825C\u8583\u8580\u858F\u85A7\u8595\u85A0\u858B\u85A3\u857B\u85A4\u859A\u859E"],
      ["ee40", "\u8577\u857C\u8589\u85A1\u857A\u8578\u8557\u858E\u8596\u8586\u858D\u8599\u859D\u8581\u85A2\u8582\u8588\u8585\u8579\u8576\u8598\u8590\u859F\u8668\u87BE\u87AA\u87AD\u87C5\u87B0\u87AC\u87B9\u87B5\u87BC\u87AE\u87C9\u87C3\u87C2\u87CC\u87B7\u87AF\u87C4\u87CA\u87B4\u87B6\u87BF\u87B8\u87BD\u87DE\u87B2\u8935\u8933\u893C\u893E\u8941\u8952\u8937\u8942\u89AD\u89AF\u89AE\u89F2\u89F3\u8B1E"],
      ["eea1", "\u8B18\u8B16\u8B11\u8B05\u8B0B\u8B22\u8B0F\u8B12\u8B15\u8B07\u8B0D\u8B08\u8B06\u8B1C\u8B13\u8B1A\u8C4F\u8C70\u8C72\u8C71\u8C6F\u8C95\u8C94\u8CF9\u8D6F\u8E4E\u8E4D\u8E53\u8E50\u8E4C\u8E47\u8F43\u8F40\u9085\u907E\u9138\u919A\u91A2\u919B\u9199\u919F\u91A1\u919D\u91A0\u93A1\u9383\u93AF\u9364\u9356\u9347\u937C\u9358\u935C\u9376\u9349\u9350\u9351\u9360\u936D\u938F\u934C\u936A\u9379\u9357\u9355\u9352\u934F\u9371\u9377\u937B\u9361\u935E\u9363\u9367\u9380\u934E\u9359\u95C7\u95C0\u95C9\u95C3\u95C5\u95B7\u96AE\u96B0\u96AC\u9720\u971F\u9718\u971D\u9719\u979A\u97A1\u979C"],
      ["ef40", "\u979E\u979D\u97D5\u97D4\u97F1\u9841\u9844\u984A\u9849\u9845\u9843\u9925\u992B\u992C\u992A\u9933\u9932\u992F\u992D\u9931\u9930\u9998\u99A3\u99A1\u9A02\u99FA\u99F4\u99F7\u99F9\u99F8\u99F6\u99FB\u99FD\u99FE\u99FC\u9A03\u9ABE\u9AFE\u9AFD\u9B01\u9AFC\u9B48\u9B9A\u9BA8\u9B9E\u9B9B\u9BA6\u9BA1\u9BA5\u9BA4\u9B86\u9BA2\u9BA0\u9BAF\u9D33\u9D41\u9D67\u9D36\u9D2E\u9D2F\u9D31\u9D38\u9D30"],
      ["efa1", "\u9D45\u9D42\u9D43\u9D3E\u9D37\u9D40\u9D3D\u7FF5\u9D2D\u9E8A\u9E89\u9E8D\u9EB0\u9EC8\u9EDA\u9EFB\u9EFF\u9F24\u9F23\u9F22\u9F54\u9FA0\u5131\u512D\u512E\u5698\u569C\u5697\u569A\u569D\u5699\u5970\u5B3C\u5C69\u5C6A\u5DC0\u5E6D\u5E6E\u61D8\u61DF\u61ED\u61EE\u61F1\u61EA\u61F0\u61EB\u61D6\u61E9\u64FF\u6504\u64FD\u64F8\u6501\u6503\u64FC\u6594\u65DB\u66DA\u66DB\u66D8\u6AC5\u6AB9\u6ABD\u6AE1\u6AC6\u6ABA\u6AB6\u6AB7\u6AC7\u6AB4\u6AAD\u6B5E\u6BC9\u6C0B\u7007\u700C\u700D\u7001\u7005\u7014\u700E\u6FFF\u7000\u6FFB\u7026\u6FFC\u6FF7\u700A\u7201\u71FF\u71F9\u7203\u71FD\u7376"],
      ["f040", "\u74B8\u74C0\u74B5\u74C1\u74BE\u74B6\u74BB\u74C2\u7514\u7513\u765C\u7664\u7659\u7650\u7653\u7657\u765A\u76A6\u76BD\u76EC\u77C2\u77BA\u78FF\u790C\u7913\u7914\u7909\u7910\u7912\u7911\u79AD\u79AC\u7A5F\u7C1C\u7C29\u7C19\u7C20\u7C1F\u7C2D\u7C1D\u7C26\u7C28\u7C22\u7C25\u7C30\u7E5C\u7E50\u7E56\u7E63\u7E58\u7E62\u7E5F\u7E51\u7E60\u7E57\u7E53\u7FB5\u7FB3\u7FF7\u7FF8\u8075\u81D1\u81D2"],
      ["f0a1", "\u81D0\u825F\u825E\u85B4\u85C6\u85C0\u85C3\u85C2\u85B3\u85B5\u85BD\u85C7\u85C4\u85BF\u85CB\u85CE\u85C8\u85C5\u85B1\u85B6\u85D2\u8624\u85B8\u85B7\u85BE\u8669\u87E7\u87E6\u87E2\u87DB\u87EB\u87EA\u87E5\u87DF\u87F3\u87E4\u87D4\u87DC\u87D3\u87ED\u87D8\u87E3\u87A4\u87D7\u87D9\u8801\u87F4\u87E8\u87DD\u8953\u894B\u894F\u894C\u8946\u8950\u8951\u8949\u8B2A\u8B27\u8B23\u8B33\u8B30\u8B35\u8B47\u8B2F\u8B3C\u8B3E\u8B31\u8B25\u8B37\u8B26\u8B36\u8B2E\u8B24\u8B3B\u8B3D\u8B3A\u8C42\u8C75\u8C99\u8C98\u8C97\u8CFE\u8D04\u8D02\u8D00\u8E5C\u8E62\u8E60\u8E57\u8E56\u8E5E\u8E65\u8E67"],
      ["f140", "\u8E5B\u8E5A\u8E61\u8E5D\u8E69\u8E54\u8F46\u8F47\u8F48\u8F4B\u9128\u913A\u913B\u913E\u91A8\u91A5\u91A7\u91AF\u91AA\u93B5\u938C\u9392\u93B7\u939B\u939D\u9389\u93A7\u938E\u93AA\u939E\u93A6\u9395\u9388\u9399\u939F\u938D\u93B1\u9391\u93B2\u93A4\u93A8\u93B4\u93A3\u93A5\u95D2\u95D3\u95D1\u96B3\u96D7\u96DA\u5DC2\u96DF\u96D8\u96DD\u9723\u9722\u9725\u97AC\u97AE\u97A8\u97AB\u97A4\u97AA"],
      ["f1a1", "\u97A2\u97A5\u97D7\u97D9\u97D6\u97D8\u97FA\u9850\u9851\u9852\u98B8\u9941\u993C\u993A\u9A0F\u9A0B\u9A09\u9A0D\u9A04\u9A11\u9A0A\u9A05\u9A07\u9A06\u9AC0\u9ADC\u9B08\u9B04\u9B05\u9B29\u9B35\u9B4A\u9B4C\u9B4B\u9BC7\u9BC6\u9BC3\u9BBF\u9BC1\u9BB5\u9BB8\u9BD3\u9BB6\u9BC4\u9BB9\u9BBD\u9D5C\u9D53\u9D4F\u9D4A\u9D5B\u9D4B\u9D59\u9D56\u9D4C\u9D57\u9D52\u9D54\u9D5F\u9D58\u9D5A\u9E8E\u9E8C\u9EDF\u9F01\u9F00\u9F16\u9F25\u9F2B\u9F2A\u9F29\u9F28\u9F4C\u9F55\u5134\u5135\u5296\u52F7\u53B4\u56AB\u56AD\u56A6\u56A7\u56AA\u56AC\u58DA\u58DD\u58DB\u5912\u5B3D\u5B3E\u5B3F\u5DC3\u5E70"],
      ["f240", "\u5FBF\u61FB\u6507\u6510\u650D\u6509\u650C\u650E\u6584\u65DE\u65DD\u66DE\u6AE7\u6AE0\u6ACC\u6AD1\u6AD9\u6ACB\u6ADF\u6ADC\u6AD0\u6AEB\u6ACF\u6ACD\u6ADE\u6B60\u6BB0\u6C0C\u7019\u7027\u7020\u7016\u702B\u7021\u7022\u7023\u7029\u7017\u7024\u701C\u702A\u720C\u720A\u7207\u7202\u7205\u72A5\u72A6\u72A4\u72A3\u72A1\u74CB\u74C5\u74B7\u74C3\u7516\u7660\u77C9\u77CA\u77C4\u77F1\u791D\u791B"],
      ["f2a1", "\u7921\u791C\u7917\u791E\u79B0\u7A67\u7A68\u7C33\u7C3C\u7C39\u7C2C\u7C3B\u7CEC\u7CEA\u7E76\u7E75\u7E78\u7E70\u7E77\u7E6F\u7E7A\u7E72\u7E74\u7E68\u7F4B\u7F4A\u7F83\u7F86\u7FB7\u7FFD\u7FFE\u8078\u81D7\u81D5\u8264\u8261\u8263\u85EB\u85F1\u85ED\u85D9\u85E1\u85E8\u85DA\u85D7\u85EC\u85F2\u85F8\u85D8\u85DF\u85E3\u85DC\u85D1\u85F0\u85E6\u85EF\u85DE\u85E2\u8800\u87FA\u8803\u87F6\u87F7\u8809\u880C\u880B\u8806\u87FC\u8808\u87FF\u880A\u8802\u8962\u895A\u895B\u8957\u8961\u895C\u8958\u895D\u8959\u8988\u89B7\u89B6\u89F6\u8B50\u8B48\u8B4A\u8B40\u8B53\u8B56\u8B54\u8B4B\u8B55"],
      ["f340", "\u8B51\u8B42\u8B52\u8B57\u8C43\u8C77\u8C76\u8C9A\u8D06\u8D07\u8D09\u8DAC\u8DAA\u8DAD\u8DAB\u8E6D\u8E78\u8E73\u8E6A\u8E6F\u8E7B\u8EC2\u8F52\u8F51\u8F4F\u8F50\u8F53\u8FB4\u9140\u913F\u91B0\u91AD\u93DE\u93C7\u93CF\u93C2\u93DA\u93D0\u93F9\u93EC\u93CC\u93D9\u93A9\u93E6\u93CA\u93D4\u93EE\u93E3\u93D5\u93C4\u93CE\u93C0\u93D2\u93E7\u957D\u95DA\u95DB\u96E1\u9729\u972B\u972C\u9728\u9726"],
      ["f3a1", "\u97B3\u97B7\u97B6\u97DD\u97DE\u97DF\u985C\u9859\u985D\u9857\u98BF\u98BD\u98BB\u98BE\u9948\u9947\u9943\u99A6\u99A7\u9A1A\u9A15\u9A25\u9A1D\u9A24\u9A1B\u9A22\u9A20\u9A27\u9A23\u9A1E\u9A1C\u9A14\u9AC2\u9B0B\u9B0A\u9B0E\u9B0C\u9B37\u9BEA\u9BEB\u9BE0\u9BDE\u9BE4\u9BE6\u9BE2\u9BF0\u9BD4\u9BD7\u9BEC\u9BDC\u9BD9\u9BE5\u9BD5\u9BE1\u9BDA\u9D77\u9D81\u9D8A\u9D84\u9D88\u9D71\u9D80\u9D78\u9D86\u9D8B\u9D8C\u9D7D\u9D6B\u9D74\u9D75\u9D70\u9D69\u9D85\u9D73\u9D7B\u9D82\u9D6F\u9D79\u9D7F\u9D87\u9D68\u9E94\u9E91\u9EC0\u9EFC\u9F2D\u9F40\u9F41\u9F4D\u9F56\u9F57\u9F58\u5337\u56B2"],
      ["f440", "\u56B5\u56B3\u58E3\u5B45\u5DC6\u5DC7\u5EEE\u5EEF\u5FC0\u5FC1\u61F9\u6517\u6516\u6515\u6513\u65DF\u66E8\u66E3\u66E4\u6AF3\u6AF0\u6AEA\u6AE8\u6AF9\u6AF1\u6AEE\u6AEF\u703C\u7035\u702F\u7037\u7034\u7031\u7042\u7038\u703F\u703A\u7039\u7040\u703B\u7033\u7041\u7213\u7214\u72A8\u737D\u737C\u74BA\u76AB\u76AA\u76BE\u76ED\u77CC\u77CE\u77CF\u77CD\u77F2\u7925\u7923\u7927\u7928\u7924\u7929"],
      ["f4a1", "\u79B2\u7A6E\u7A6C\u7A6D\u7AF7\u7C49\u7C48\u7C4A\u7C47\u7C45\u7CEE\u7E7B\u7E7E\u7E81\u7E80\u7FBA\u7FFF\u8079\u81DB\u81D9\u820B\u8268\u8269\u8622\u85FF\u8601\u85FE\u861B\u8600\u85F6\u8604\u8609\u8605\u860C\u85FD\u8819\u8810\u8811\u8817\u8813\u8816\u8963\u8966\u89B9\u89F7\u8B60\u8B6A\u8B5D\u8B68\u8B63\u8B65\u8B67\u8B6D\u8DAE\u8E86\u8E88\u8E84\u8F59\u8F56\u8F57\u8F55\u8F58\u8F5A\u908D\u9143\u9141\u91B7\u91B5\u91B2\u91B3\u940B\u9413\u93FB\u9420\u940F\u9414\u93FE\u9415\u9410\u9428\u9419\u940D\u93F5\u9400\u93F7\u9407\u940E\u9416\u9412\u93FA\u9409\u93F8\u940A\u93FF"],
      ["f540", "\u93FC\u940C\u93F6\u9411\u9406\u95DE\u95E0\u95DF\u972E\u972F\u97B9\u97BB\u97FD\u97FE\u9860\u9862\u9863\u985F\u98C1\u98C2\u9950\u994E\u9959\u994C\u994B\u9953\u9A32\u9A34\u9A31\u9A2C\u9A2A\u9A36\u9A29\u9A2E\u9A38\u9A2D\u9AC7\u9ACA\u9AC6\u9B10\u9B12\u9B11\u9C0B\u9C08\u9BF7\u9C05\u9C12\u9BF8\u9C40\u9C07\u9C0E\u9C06\u9C17\u9C14\u9C09\u9D9F\u9D99\u9DA4\u9D9D\u9D92\u9D98\u9D90\u9D9B"],
      ["f5a1", "\u9DA0\u9D94\u9D9C\u9DAA\u9D97\u9DA1\u9D9A\u9DA2\u9DA8\u9D9E\u9DA3\u9DBF\u9DA9\u9D96\u9DA6\u9DA7\u9E99\u9E9B\u9E9A\u9EE5\u9EE4\u9EE7\u9EE6\u9F30\u9F2E\u9F5B\u9F60\u9F5E\u9F5D\u9F59\u9F91\u513A\u5139\u5298\u5297\u56C3\u56BD\u56BE\u5B48\u5B47\u5DCB\u5DCF\u5EF1\u61FD\u651B\u6B02\u6AFC\u6B03\u6AF8\u6B00\u7043\u7044\u704A\u7048\u7049\u7045\u7046\u721D\u721A\u7219\u737E\u7517\u766A\u77D0\u792D\u7931\u792F\u7C54\u7C53\u7CF2\u7E8A\u7E87\u7E88\u7E8B\u7E86\u7E8D\u7F4D\u7FBB\u8030\u81DD\u8618\u862A\u8626\u861F\u8623\u861C\u8619\u8627\u862E\u8621\u8620\u8629\u861E\u8625"],
      ["f640", "\u8829\u881D\u881B\u8820\u8824\u881C\u882B\u884A\u896D\u8969\u896E\u896B\u89FA\u8B79\u8B78\u8B45\u8B7A\u8B7B\u8D10\u8D14\u8DAF\u8E8E\u8E8C\u8F5E\u8F5B\u8F5D\u9146\u9144\u9145\u91B9\u943F\u943B\u9436\u9429\u943D\u943C\u9430\u9439\u942A\u9437\u942C\u9440\u9431\u95E5\u95E4\u95E3\u9735\u973A\u97BF\u97E1\u9864\u98C9\u98C6\u98C0\u9958\u9956\u9A39\u9A3D\u9A46\u9A44\u9A42\u9A41\u9A3A"],
      ["f6a1", "\u9A3F\u9ACD\u9B15\u9B17\u9B18\u9B16\u9B3A\u9B52\u9C2B\u9C1D\u9C1C\u9C2C\u9C23\u9C28\u9C29\u9C24\u9C21\u9DB7\u9DB6\u9DBC\u9DC1\u9DC7\u9DCA\u9DCF\u9DBE\u9DC5\u9DC3\u9DBB\u9DB5\u9DCE\u9DB9\u9DBA\u9DAC\u9DC8\u9DB1\u9DAD\u9DCC\u9DB3\u9DCD\u9DB2\u9E7A\u9E9C\u9EEB\u9EEE\u9EED\u9F1B\u9F18\u9F1A\u9F31\u9F4E\u9F65\u9F64\u9F92\u4EB9\u56C6\u56C5\u56CB\u5971\u5B4B\u5B4C\u5DD5\u5DD1\u5EF2\u6521\u6520\u6526\u6522\u6B0B\u6B08\u6B09\u6C0D\u7055\u7056\u7057\u7052\u721E\u721F\u72A9\u737F\u74D8\u74D5\u74D9\u74D7\u766D\u76AD\u7935\u79B4\u7A70\u7A71\u7C57\u7C5C\u7C59\u7C5B\u7C5A"],
      ["f740", "\u7CF4\u7CF1\u7E91\u7F4F\u7F87\u81DE\u826B\u8634\u8635\u8633\u862C\u8632\u8636\u882C\u8828\u8826\u882A\u8825\u8971\u89BF\u89BE\u89FB\u8B7E\u8B84\u8B82\u8B86\u8B85\u8B7F\u8D15\u8E95\u8E94\u8E9A\u8E92\u8E90\u8E96\u8E97\u8F60\u8F62\u9147\u944C\u9450\u944A\u944B\u944F\u9447\u9445\u9448\u9449\u9446\u973F\u97E3\u986A\u9869\u98CB\u9954\u995B\u9A4E\u9A53\u9A54\u9A4C\u9A4F\u9A48\u9A4A"],
      ["f7a1", "\u9A49\u9A52\u9A50\u9AD0\u9B19\u9B2B\u9B3B\u9B56\u9B55\u9C46\u9C48\u9C3F\u9C44\u9C39\u9C33\u9C41\u9C3C\u9C37\u9C34\u9C32\u9C3D\u9C36\u9DDB\u9DD2\u9DDE\u9DDA\u9DCB\u9DD0\u9DDC\u9DD1\u9DDF\u9DE9\u9DD9\u9DD8\u9DD6\u9DF5\u9DD5\u9DDD\u9EB6\u9EF0\u9F35\u9F33\u9F32\u9F42\u9F6B\u9F95\u9FA2\u513D\u5299\u58E8\u58E7\u5972\u5B4D\u5DD8\u882F\u5F4F\u6201\u6203\u6204\u6529\u6525\u6596\u66EB\u6B11\u6B12\u6B0F\u6BCA\u705B\u705A\u7222\u7382\u7381\u7383\u7670\u77D4\u7C67\u7C66\u7E95\u826C\u863A\u8640\u8639\u863C\u8631\u863B\u863E\u8830\u8832\u882E\u8833\u8976\u8974\u8973\u89FE"],
      ["f840", "\u8B8C\u8B8E\u8B8B\u8B88\u8C45\u8D19\u8E98\u8F64\u8F63\u91BC\u9462\u9455\u945D\u9457\u945E\u97C4\u97C5\u9800\u9A56\u9A59\u9B1E\u9B1F\u9B20\u9C52\u9C58\u9C50\u9C4A\u9C4D\u9C4B\u9C55\u9C59\u9C4C\u9C4E\u9DFB\u9DF7\u9DEF\u9DE3\u9DEB\u9DF8\u9DE4\u9DF6\u9DE1\u9DEE\u9DE6\u9DF2\u9DF0\u9DE2\u9DEC\u9DF4\u9DF3\u9DE8\u9DED\u9EC2\u9ED0\u9EF2\u9EF3\u9F06\u9F1C\u9F38\u9F37\u9F36\u9F43\u9F4F"],
      ["f8a1", "\u9F71\u9F70\u9F6E\u9F6F\u56D3\u56CD\u5B4E\u5C6D\u652D\u66ED\u66EE\u6B13\u705F\u7061\u705D\u7060\u7223\u74DB\u74E5\u77D5\u7938\u79B7\u79B6\u7C6A\u7E97\u7F89\u826D\u8643\u8838\u8837\u8835\u884B\u8B94\u8B95\u8E9E\u8E9F\u8EA0\u8E9D\u91BE\u91BD\u91C2\u946B\u9468\u9469\u96E5\u9746\u9743\u9747\u97C7\u97E5\u9A5E\u9AD5\u9B59\u9C63\u9C67\u9C66\u9C62\u9C5E\u9C60\u9E02\u9DFE\u9E07\u9E03\u9E06\u9E05\u9E00\u9E01\u9E09\u9DFF\u9DFD\u9E04\u9EA0\u9F1E\u9F46\u9F74\u9F75\u9F76\u56D4\u652E\u65B8\u6B18\u6B19\u6B17\u6B1A\u7062\u7226\u72AA\u77D8\u77D9\u7939\u7C69\u7C6B\u7CF6\u7E9A"],
      ["f940", "\u7E98\u7E9B\u7E99\u81E0\u81E1\u8646\u8647\u8648\u8979\u897A\u897C\u897B\u89FF\u8B98\u8B99\u8EA5\u8EA4\u8EA3\u946E\u946D\u946F\u9471\u9473\u9749\u9872\u995F\u9C68\u9C6E\u9C6D\u9E0B\u9E0D\u9E10\u9E0F\u9E12\u9E11\u9EA1\u9EF5\u9F09\u9F47\u9F78\u9F7B\u9F7A\u9F79\u571E\u7066\u7C6F\u883C\u8DB2\u8EA6\u91C3\u9474\u9478\u9476\u9475\u9A60\u9C74\u9C73\u9C71\u9C75\u9E14\u9E13\u9EF6\u9F0A"],
      ["f9a1", "\u9FA4\u7068\u7065\u7CF7\u866A\u883E\u883D\u883F\u8B9E\u8C9C\u8EA9\u8EC9\u974B\u9873\u9874\u98CC\u9961\u99AB\u9A64\u9A66\u9A67\u9B24\u9E15\u9E17\u9F48\u6207\u6B1E\u7227\u864C\u8EA8\u9482\u9480\u9481\u9A69\u9A68\u9B2E\u9E19\u7229\u864B\u8B9F\u9483\u9C79\u9EB7\u7675\u9A6B\u9C7A\u9E1D\u7069\u706A\u9EA4\u9F7E\u9F49\u9F98\u7881\u92B9\u88CF\u58BB\u6052\u7CA7\u5AFA\u2554\u2566\u2557\u2560\u256C\u2563\u255A\u2569\u255D\u2552\u2564\u2555\u255E\u256A\u2561\u2558\u2567\u255B\u2553\u2565\u2556\u255F\u256B\u2562\u2559\u2568\u255C\u2551\u2550\u256D\u256E\u2570\u256F\u2593"]
    ];
  }
});

// node_modules/iconv-lite/encodings/tables/big5-added.json
var require_big5_added = __commonJS({
  "node_modules/iconv-lite/encodings/tables/big5-added.json"(exports, module) {
    module.exports = [
      ["8740", "\u43F0\u4C32\u4603\u45A6\u4578\u{27267}\u4D77\u45B3\u{27CB1}\u4CE2\u{27CC5}\u3B95\u4736\u4744\u4C47\u4C40\u{242BF}\u{23617}\u{27352}\u{26E8B}\u{270D2}\u4C57\u{2A351}\u474F\u45DA\u4C85\u{27C6C}\u4D07\u4AA4\u46A1\u{26B23}\u7225\u{25A54}\u{21A63}\u{23E06}\u{23F61}\u664D\u56FB"],
      ["8767", "\u7D95\u591D\u{28BB9}\u3DF4\u9734\u{27BEF}\u5BDB\u{21D5E}\u5AA4\u3625\u{29EB0}\u5AD1\u5BB7\u5CFC\u676E\u8593\u{29945}\u7461\u749D\u3875\u{21D53}\u{2369E}\u{26021}\u3EEC"],
      ["87a1", "\u{258DE}\u3AF5\u7AFC\u9F97\u{24161}\u{2890D}\u{231EA}\u{20A8A}\u{2325E}\u430A\u8484\u9F96\u942F\u4930\u8613\u5896\u974A\u9218\u79D0\u7A32\u6660\u6A29\u889D\u744C\u7BC5\u6782\u7A2C\u524F\u9046\u34E6\u73C4\u{25DB9}\u74C6\u9FC7\u57B3\u492F\u544C\u4131\u{2368E}\u5818\u7A72\u{27B65}\u8B8F\u46AE\u{26E88}\u4181\u{25D99}\u7BAE\u{224BC}\u9FC8\u{224C1}\u{224C9}\u{224CC}\u9FC9\u8504\u{235BB}\u40B4\u9FCA\u44E1\u{2ADFF}\u62C1\u706E\u9FCB"],
      ["8840", "\u31C0", 4, "\u{2010C}\u31C5\u{200D1}\u{200CD}\u31C6\u31C7\u{200CB}\u{21FE8}\u31C8\u{200CA}\u31C9\u31CA\u31CB\u31CC\u{2010E}\u31CD\u31CE\u0100\xC1\u01CD\xC0\u0112\xC9\u011A\xC8\u014C\xD3\u01D1\xD2\u0FFF\xCA\u0304\u1EBE\u0FFF\xCA\u030C\u1EC0\xCA\u0101\xE1\u01CE\xE0\u0251\u0113\xE9\u011B\xE8\u012B\xED\u01D0\xEC\u014D\xF3\u01D2\xF2\u016B\xFA\u01D4\xF9\u01D6\u01D8\u01DA"],
      ["88a1", "\u01DC\xFC\u0FFF\xEA\u0304\u1EBF\u0FFF\xEA\u030C\u1EC1\xEA\u0261\u23DA\u23DB"],
      ["8940", "\u{2A3A9}\u{21145}"],
      ["8943", "\u650A"],
      ["8946", "\u4E3D\u6EDD\u9D4E\u91DF"],
      ["894c", "\u{27735}\u6491\u4F1A\u4F28\u4FA8\u5156\u5174\u519C\u51E4\u52A1\u52A8\u533B\u534E\u53D1\u53D8\u56E2\u58F0\u5904\u5907\u5932\u5934\u5B66\u5B9E\u5B9F\u5C9A\u5E86\u603B\u6589\u67FE\u6804\u6865\u6D4E\u70BC\u7535\u7EA4\u7EAC\u7EBA\u7EC7\u7ECF\u7EDF\u7F06\u7F37\u827A\u82CF\u836F\u89C6\u8BBE\u8BE2\u8F66\u8F67\u8F6E"],
      ["89a1", "\u7411\u7CFC\u7DCD\u6946\u7AC9\u5227"],
      ["89ab", "\u918C\u78B8\u915E\u80BC"],
      ["89b0", "\u8D0B\u80F6\u{209E7}"],
      ["89b5", "\u809F\u9EC7\u4CCD\u9DC9\u9E0C\u4C3E\u{29DF6}\u{2700E}\u9E0A\u{2A133}\u35C1"],
      ["89c1", "\u6E9A\u823E\u7519"],
      ["89c5", "\u4911\u9A6C\u9A8F\u9F99\u7987\u{2846C}\u{21DCA}\u{205D0}\u{22AE6}\u4E24\u4E81\u4E80\u4E87\u4EBF\u4EEB\u4F37\u344C\u4FBD\u3E48\u5003\u5088\u347D\u3493\u34A5\u5186\u5905\u51DB\u51FC\u5205\u4E89\u5279\u5290\u5327\u35C7\u53A9\u3551\u53B0\u3553\u53C2\u5423\u356D\u3572\u3681\u5493\u54A3\u54B4\u54B9\u54D0\u54EF\u5518\u5523\u5528\u3598\u553F\u35A5\u35BF\u55D7\u35C5"],
      ["8a40", "\u{27D84}\u5525"],
      ["8a43", "\u{20C42}\u{20D15}\u{2512B}\u5590\u{22CC6}\u39EC\u{20341}\u8E46\u{24DB8}\u{294E5}\u4053\u{280BE}\u777A\u{22C38}\u3A34\u47D5\u{2815D}\u{269F2}\u{24DEA}\u64DD\u{20D7C}\u{20FB4}\u{20CD5}\u{210F4}\u648D\u8E7E\u{20E96}\u{20C0B}\u{20F64}\u{22CA9}\u{28256}\u{244D3}"],
      ["8a64", "\u{20D46}\u{29A4D}\u{280E9}\u47F4\u{24EA7}\u{22CC2}\u9AB2\u3A67\u{295F4}\u3FED\u3506\u{252C7}\u{297D4}\u{278C8}\u{22D44}\u9D6E\u9815"],
      ["8a76", "\u43D9\u{260A5}\u64B4\u54E3\u{22D4C}\u{22BCA}\u{21077}\u39FB\u{2106F}"],
      ["8aa1", "\u{266DA}\u{26716}\u{279A0}\u64EA\u{25052}\u{20C43}\u8E68\u{221A1}\u{28B4C}\u{20731}"],
      ["8aac", "\u480B\u{201A9}\u3FFA\u5873\u{22D8D}"],
      ["8ab2", "\u{245C8}\u{204FC}\u{26097}\u{20F4C}\u{20D96}\u5579\u40BB\u43BA"],
      ["8abb", "\u4AB4\u{22A66}\u{2109D}\u81AA\u98F5\u{20D9C}\u6379\u39FE\u{22775}\u8DC0\u56A1\u647C\u3E43"],
      ["8ac9", "\u{2A601}\u{20E09}\u{22ACF}\u{22CC9}"],
      ["8ace", "\u{210C8}\u{239C2}\u3992\u3A06\u{2829B}\u3578\u{25E49}\u{220C7}\u5652\u{20F31}\u{22CB2}\u{29720}\u34BC\u6C3D\u{24E3B}"],
      ["8adf", "\u{27574}\u{22E8B}\u{22208}\u{2A65B}\u{28CCD}\u{20E7A}\u{20C34}\u{2681C}\u7F93\u{210CF}\u{22803}\u{22939}\u35FB\u{251E3}\u{20E8C}\u{20F8D}\u{20EAA}\u3F93\u{20F30}\u{20D47}\u{2114F}\u{20E4C}"],
      ["8af6", "\u{20EAB}\u{20BA9}\u{20D48}\u{210C0}\u{2113D}\u3FF9\u{22696}\u6432\u{20FAD}"],
      ["8b40", "\u{233F4}\u{27639}\u{22BCE}\u{20D7E}\u{20D7F}\u{22C51}\u{22C55}\u3A18\u{20E98}\u{210C7}\u{20F2E}\u{2A632}\u{26B50}\u{28CD2}\u{28D99}\u{28CCA}\u95AA\u54CC\u82C4\u55B9"],
      ["8b55", "\u{29EC3}\u9C26\u9AB6\u{2775E}\u{22DEE}\u7140\u816D\u80EC\u5C1C\u{26572}\u8134\u3797\u535F\u{280BD}\u91B6\u{20EFA}\u{20E0F}\u{20E77}\u{20EFB}\u35DD\u{24DEB}\u3609\u{20CD6}\u56AF\u{227B5}\u{210C9}\u{20E10}\u{20E78}\u{21078}\u{21148}\u{28207}\u{21455}\u{20E79}\u{24E50}\u{22DA4}\u5A54\u{2101D}\u{2101E}\u{210F5}\u{210F6}\u579C\u{20E11}"],
      ["8ba1", "\u{27694}\u{282CD}\u{20FB5}\u{20E7B}\u{2517E}\u3703\u{20FB6}\u{21180}\u{252D8}\u{2A2BD}\u{249DA}\u{2183A}\u{24177}\u{2827C}\u5899\u5268\u361A\u{2573D}\u7BB2\u5B68\u4800\u4B2C\u9F27\u49E7\u9C1F\u9B8D\u{25B74}\u{2313D}\u55FB\u35F2\u5689\u4E28\u5902\u{21BC1}\u{2F878}\u9751\u{20086}\u4E5B\u4EBB\u353E\u5C23\u5F51\u5FC4\u38FA\u624C\u6535\u6B7A\u6C35\u6C3A\u706C\u722B\u4E2C\u72AD\u{248E9}\u7F52\u793B\u7CF9\u7F53\u{2626A}\u34C1"],
      ["8bde", "\u{2634B}\u8002\u8080\u{26612}\u{26951}\u535D\u8864\u89C1\u{278B2}\u8BA0\u8D1D\u9485\u9578\u957F\u95E8\u{28E0F}\u97E6\u9875\u98CE\u98DE\u9963\u{29810}\u9C7C\u9E1F\u9EC4\u6B6F\uF907\u4E37\u{20087}\u961D\u6237\u94A2"],
      ["8c40", "\u503B\u6DFE\u{29C73}\u9FA6\u3DC9\u888F\u{2414E}\u7077\u5CF5\u4B20\u{251CD}\u3559\u{25D30}\u6122\u{28A32}\u8FA7\u91F6\u7191\u6719\u73BA\u{23281}\u{2A107}\u3C8B\u{21980}\u4B10\u78E4\u7402\u51AE\u{2870F}\u4009\u6A63\u{2A2BA}\u4223\u860F\u{20A6F}\u7A2A\u{29947}\u{28AEA}\u9755\u704D\u5324\u{2207E}\u93F4\u76D9\u{289E3}\u9FA7\u77DD\u4EA3\u4FF0\u50BC\u4E2F\u4F17\u9FA8\u5434\u7D8B\u5892\u58D0\u{21DB6}\u5E92\u5E99\u5FC2\u{22712}\u658B"],
      ["8ca1", "\u{233F9}\u6919\u6A43\u{23C63}\u6CFF"],
      ["8ca7", "\u7200\u{24505}\u738C\u3EDB\u{24A13}\u5B15\u74B9\u8B83\u{25CA4}\u{25695}\u7A93\u7BEC\u7CC3\u7E6C\u82F8\u8597\u9FA9\u8890\u9FAA\u8EB9\u9FAB\u8FCF\u855F\u99E0\u9221\u9FAC\u{28DB9}\u{2143F}\u4071\u42A2\u5A1A"],
      ["8cc9", "\u9868\u676B\u4276\u573D"],
      ["8cce", "\u85D6\u{2497B}\u82BF\u{2710D}\u4C81\u{26D74}\u5D7B\u{26B15}\u{26FBE}\u9FAD\u9FAE\u5B96\u9FAF\u66E7\u7E5B\u6E57\u79CA\u3D88\u44C3\u{23256}\u{22796}\u439A\u4536"],
      ["8ce6", "\u5CD5\u{23B1A}\u8AF9\u5C78\u3D12\u{23551}\u5D78\u9FB2\u7157\u4558\u{240EC}\u{21E23}\u4C77\u3978\u344A\u{201A4}\u{26C41}\u8ACC\u4FB4\u{20239}\u59BF\u816C\u9856\u{298FA}\u5F3B"],
      ["8d40", "\u{20B9F}"],
      ["8d42", "\u{221C1}\u{2896D}\u4102\u46BB\u{29079}\u3F07\u9FB3\u{2A1B5}\u40F8\u37D6\u46F7\u{26C46}\u417C\u{286B2}\u{273FF}\u456D\u38D4\u{2549A}\u4561\u451B\u4D89\u4C7B\u4D76\u45EA\u3FC8\u{24B0F}\u3661\u44DE\u44BD\u41ED\u5D3E\u5D48\u5D56\u3DFC\u380F\u5DA4\u5DB9\u3820\u3838\u5E42\u5EBD\u5F25\u5F83\u3908\u3914\u393F\u394D\u60D7\u613D\u5CE5\u3989\u61B7\u61B9\u61CF\u39B8\u622C\u6290\u62E5\u6318\u39F8\u56B1"],
      ["8da1", "\u3A03\u63E2\u63FB\u6407\u645A\u3A4B\u64C0\u5D15\u5621\u9F9F\u3A97\u6586\u3ABD\u65FF\u6653\u3AF2\u6692\u3B22\u6716\u3B42\u67A4\u6800\u3B58\u684A\u6884\u3B72\u3B71\u3B7B\u6909\u6943\u725C\u6964\u699F\u6985\u3BBC\u69D6\u3BDD\u6A65\u6A74\u6A71\u6A82\u3BEC\u6A99\u3BF2\u6AAB\u6AB5\u6AD4\u6AF6\u6B81\u6BC1\u6BEA\u6C75\u6CAA\u3CCB\u6D02\u6D06\u6D26\u6D81\u3CEF\u6DA4\u6DB1\u6E15\u6E18\u6E29\u6E86\u{289C0}\u6EBB\u6EE2\u6EDA\u9F7F\u6EE8\u6EE9\u6F24\u6F34\u3D46\u{23F41}\u6F81\u6FBE\u3D6A\u3D75\u71B7\u5C99\u3D8A\u702C\u3D91\u7050\u7054\u706F\u707F\u7089\u{20325}\u43C1\u35F1\u{20ED8}"],
      ["8e40", "\u{23ED7}\u57BE\u{26ED3}\u713E\u{257E0}\u364E\u69A2\u{28BE9}\u5B74\u7A49\u{258E1}\u{294D9}\u7A65\u7A7D\u{259AC}\u7ABB\u7AB0\u7AC2\u7AC3\u71D1\u{2648D}\u41CA\u7ADA\u7ADD\u7AEA\u41EF\u54B2\u{25C01}\u7B0B\u7B55\u7B29\u{2530E}\u{25CFE}\u7BA2\u7B6F\u839C\u{25BB4}\u{26C7F}\u7BD0\u8421\u7B92\u7BB8\u{25D20}\u3DAD\u{25C65}\u8492\u7BFA\u7C06\u7C35\u{25CC1}\u7C44\u7C83\u{24882}\u7CA6\u667D\u{24578}\u7CC9\u7CC7\u7CE6\u7C74\u7CF3\u7CF5\u7CCE"],
      ["8ea1", "\u7E67\u451D\u{26E44}\u7D5D\u{26ED6}\u748D\u7D89\u7DAB\u7135\u7DB3\u7DD2\u{24057}\u{26029}\u7DE4\u3D13\u7DF5\u{217F9}\u7DE5\u{2836D}\u7E1D\u{26121}\u{2615A}\u7E6E\u7E92\u432B\u946C\u7E27\u7F40\u7F41\u7F47\u7936\u{262D0}\u99E1\u7F97\u{26351}\u7FA3\u{21661}\u{20068}\u455C\u{23766}\u4503\u{2833A}\u7FFA\u{26489}\u8005\u8008\u801D\u8028\u802F\u{2A087}\u{26CC3}\u803B\u803C\u8061\u{22714}\u4989\u{26626}\u{23DE3}\u{266E8}\u6725\u80A7\u{28A48}\u8107\u811A\u58B0\u{226F6}\u6C7F\u{26498}\u{24FB8}\u64E7\u{2148A}\u8218\u{2185E}\u6A53\u{24A65}\u{24A95}\u447A\u8229\u{20B0D}\u{26A52}\u{23D7E}\u4FF9\u{214FD}\u84E2\u8362\u{26B0A}\u{249A7}\u{23530}\u{21773}\u{23DF8}\u82AA\u691B\u{2F994}\u41DB"],
      ["8f40", "\u854B\u82D0\u831A\u{20E16}\u{217B4}\u36C1\u{2317D}\u{2355A}\u827B\u82E2\u8318\u{23E8B}\u{26DA3}\u{26B05}\u{26B97}\u{235CE}\u3DBF\u831D\u55EC\u8385\u450B\u{26DA5}\u83AC\u83C1\u83D3\u347E\u{26ED4}\u6A57\u855A\u3496\u{26E42}\u{22EEF}\u8458\u{25BE4}\u8471\u3DD3\u44E4\u6AA7\u844A\u{23CB5}\u7958\u84A8\u{26B96}\u{26E77}\u{26E43}\u84DE\u840F\u8391\u44A0\u8493\u84E4\u{25C91}\u4240\u{25CC0}\u4543\u8534\u5AF2\u{26E99}\u4527\u8573\u4516\u67BF\u8616"],
      ["8fa1", "\u{28625}\u{2863B}\u85C1\u{27088}\u8602\u{21582}\u{270CD}\u{2F9B2}\u456A\u8628\u3648\u{218A2}\u53F7\u{2739A}\u867E\u8771\u{2A0F8}\u87EE\u{22C27}\u87B1\u87DA\u880F\u5661\u866C\u6856\u460F\u8845\u8846\u{275E0}\u{23DB9}\u{275E4}\u885E\u889C\u465B\u88B4\u88B5\u63C1\u88C5\u7777\u{2770F}\u8987\u898A\u89A6\u89A9\u89A7\u89BC\u{28A25}\u89E7\u{27924}\u{27ABD}\u8A9C\u7793\u91FE\u8A90\u{27A59}\u7AE9\u{27B3A}\u{23F8F}\u4713\u{27B38}\u717C\u8B0C\u8B1F\u{25430}\u{25565}\u8B3F\u8B4C\u8B4D\u8AA9\u{24A7A}\u8B90\u8B9B\u8AAF\u{216DF}\u4615\u884F\u8C9B\u{27D54}\u{27D8F}\u{2F9D4}\u3725\u{27D53}\u8CD6\u{27D98}\u{27DBD}\u8D12\u8D03\u{21910}\u8CDB\u705C\u8D11\u{24CC9}\u3ED0\u8D77"],
      ["9040", "\u8DA9\u{28002}\u{21014}\u{2498A}\u3B7C\u{281BC}\u{2710C}\u7AE7\u8EAD\u8EB6\u8EC3\u92D4\u8F19\u8F2D\u{28365}\u{28412}\u8FA5\u9303\u{2A29F}\u{20A50}\u8FB3\u492A\u{289DE}\u{2853D}\u{23DBB}\u5EF8\u{23262}\u8FF9\u{2A014}\u{286BC}\u{28501}\u{22325}\u3980\u{26ED7}\u9037\u{2853C}\u{27ABE}\u9061\u{2856C}\u{2860B}\u90A8\u{28713}\u90C4\u{286E6}\u90AE\u90FD\u9167\u3AF0\u91A9\u91C4\u7CAC\u{28933}\u{21E89}\u920E\u6C9F\u9241\u9262\u{255B9}\u92B9\u{28AC6}\u{23C9B}\u{28B0C}\u{255DB}"],
      ["90a1", "\u{20D31}\u932C\u936B\u{28AE1}\u{28BEB}\u708F\u5AC3\u{28AE2}\u{28AE5}\u4965\u9244\u{28BEC}\u{28C39}\u{28BFF}\u9373\u945B\u8EBC\u9585\u95A6\u9426\u95A0\u6FF6\u42B9\u{2267A}\u{286D8}\u{2127C}\u{23E2E}\u49DF\u6C1C\u967B\u9696\u416C\u96A3\u{26ED5}\u61DA\u96B6\u78F5\u{28AE0}\u96BD\u53CC\u49A1\u{26CB8}\u{20274}\u{26410}\u{290AF}\u{290E5}\u{24AD1}\u{21915}\u{2330A}\u9731\u8642\u9736\u4A0F\u453D\u4585\u{24AE9}\u7075\u5B41\u971B\u975C\u{291D5}\u9757\u5B4A\u{291EB}\u975F\u9425\u50D0\u{230B7}\u{230BC}\u9789\u979F\u97B1\u97BE\u97C0\u97D2\u97E0\u{2546C}\u97EE\u741C\u{29433}\u97FF\u97F5\u{2941D}\u{2797A}\u4AD1\u9834\u9833\u984B\u9866\u3B0E\u{27175}\u3D51\u{20630}\u{2415C}"],
      ["9140", "\u{25706}\u98CA\u98B7\u98C8\u98C7\u4AFF\u{26D27}\u{216D3}\u55B0\u98E1\u98E6\u98EC\u9378\u9939\u{24A29}\u4B72\u{29857}\u{29905}\u99F5\u9A0C\u9A3B\u9A10\u9A58\u{25725}\u36C4\u{290B1}\u{29BD5}\u9AE0\u9AE2\u{29B05}\u9AF4\u4C0E\u9B14\u9B2D\u{28600}\u5034\u9B34\u{269A8}\u38C3\u{2307D}\u9B50\u9B40\u{29D3E}\u5A45\u{21863}\u9B8E\u{2424B}\u9C02\u9BFF\u9C0C\u{29E68}\u9DD4\u{29FB7}\u{2A192}\u{2A1AB}\u{2A0E1}\u{2A123}\u{2A1DF}\u9D7E\u9D83\u{2A134}\u9E0E\u6888"],
      ["91a1", "\u9DC4\u{2215B}\u{2A193}\u{2A220}\u{2193B}\u{2A233}\u9D39\u{2A0B9}\u{2A2B4}\u9E90\u9E95\u9E9E\u9EA2\u4D34\u9EAA\u9EAF\u{24364}\u9EC1\u3B60\u39E5\u3D1D\u4F32\u37BE\u{28C2B}\u9F02\u9F08\u4B96\u9424\u{26DA2}\u9F17\u9F16\u9F39\u569F\u568A\u9F45\u99B8\u{2908B}\u97F2\u847F\u9F62\u9F69\u7ADC\u9F8E\u7216\u4BBE\u{24975}\u{249BB}\u7177\u{249F8}\u{24348}\u{24A51}\u739E\u{28BDA}\u{218FA}\u799F\u{2897E}\u{28E36}\u9369\u93F3\u{28A44}\u92EC\u9381\u93CB\u{2896C}\u{244B9}\u7217\u3EEB\u7772\u7A43\u70D0\u{24473}\u{243F8}\u717E\u{217EF}\u70A3\u{218BE}\u{23599}\u3EC7\u{21885}\u{2542F}\u{217F8}\u3722\u{216FB}\u{21839}\u36E1\u{21774}\u{218D1}\u{25F4B}\u3723\u{216C0}\u575B\u{24A25}\u{213FE}\u{212A8}"],
      ["9240", "\u{213C6}\u{214B6}\u8503\u{236A6}\u8503\u8455\u{24994}\u{27165}\u{23E31}\u{2555C}\u{23EFB}\u{27052}\u44F4\u{236EE}\u{2999D}\u{26F26}\u67F9\u3733\u3C15\u3DE7\u586C\u{21922}\u6810\u4057\u{2373F}\u{240E1}\u{2408B}\u{2410F}\u{26C21}\u54CB\u569E\u{266B1}\u5692\u{20FDF}\u{20BA8}\u{20E0D}\u93C6\u{28B13}\u939C\u4EF8\u512B\u3819\u{24436}\u4EBC\u{20465}\u{2037F}\u4F4B\u4F8A\u{25651}\u5A68\u{201AB}\u{203CB}\u3999\u{2030A}\u{20414}\u3435\u4F29\u{202C0}\u{28EB3}\u{20275}\u8ADA\u{2020C}\u4E98"],
      ["92a1", "\u50CD\u510D\u4FA2\u4F03\u{24A0E}\u{23E8A}\u4F42\u502E\u506C\u5081\u4FCC\u4FE5\u5058\u50FC\u5159\u515B\u515D\u515E\u6E76\u{23595}\u{23E39}\u{23EBF}\u6D72\u{21884}\u{23E89}\u51A8\u51C3\u{205E0}\u44DD\u{204A3}\u{20492}\u{20491}\u8D7A\u{28A9C}\u{2070E}\u5259\u52A4\u{20873}\u52E1\u936E\u467A\u718C\u{2438C}\u{20C20}\u{249AC}\u{210E4}\u69D1\u{20E1D}\u7479\u3EDE\u7499\u7414\u7456\u7398\u4B8E\u{24ABC}\u{2408D}\u53D0\u3584\u720F\u{240C9}\u55B4\u{20345}\u54CD\u{20BC6}\u571D\u925D\u96F4\u9366\u57DD\u578D\u577F\u363E\u58CB\u5A99\u{28A46}\u{216FA}\u{2176F}\u{21710}\u5A2C\u59B8\u928F\u5A7E\u5ACF\u5A12\u{25946}\u{219F3}\u{21861}\u{24295}\u36F5\u6D05\u7443\u5A21\u{25E83}"],
      ["9340", "\u5A81\u{28BD7}\u{20413}\u93E0\u748C\u{21303}\u7105\u4972\u9408\u{289FB}\u93BD\u37A0\u5C1E\u5C9E\u5E5E\u5E48\u{21996}\u{2197C}\u{23AEE}\u5ECD\u5B4F\u{21903}\u{21904}\u3701\u{218A0}\u36DD\u{216FE}\u36D3\u812A\u{28A47}\u{21DBA}\u{23472}\u{289A8}\u5F0C\u5F0E\u{21927}\u{217AB}\u5A6B\u{2173B}\u5B44\u8614\u{275FD}\u8860\u607E\u{22860}\u{2262B}\u5FDB\u3EB8\u{225AF}\u{225BE}\u{29088}\u{26F73}\u61C0\u{2003E}\u{20046}\u{2261B}\u6199\u6198\u6075\u{22C9B}\u{22D07}\u{246D4}\u{2914D}"],
      ["93a1", "\u6471\u{24665}\u{22B6A}\u3A29\u{22B22}\u{23450}\u{298EA}\u{22E78}\u6337\u{2A45B}\u64B6\u6331\u63D1\u{249E3}\u{22D67}\u62A4\u{22CA1}\u643B\u656B\u6972\u3BF4\u{2308E}\u{232AD}\u{24989}\u{232AB}\u550D\u{232E0}\u{218D9}\u{2943F}\u66CE\u{23289}\u{231B3}\u3AE0\u4190\u{25584}\u{28B22}\u{2558F}\u{216FC}\u{2555B}\u{25425}\u78EE\u{23103}\u{2182A}\u{23234}\u3464\u{2320F}\u{23182}\u{242C9}\u668E\u{26D24}\u666B\u4B93\u6630\u{27870}\u{21DEB}\u6663\u{232D2}\u{232E1}\u661E\u{25872}\u38D1\u{2383A}\u{237BC}\u3B99\u{237A2}\u{233FE}\u74D0\u3B96\u678F\u{2462A}\u68B6\u681E\u3BC4\u6ABE\u3863\u{237D5}\u{24487}\u6A33\u6A52\u6AC9\u6B05\u{21912}\u6511\u6898\u6A4C\u3BD7\u6A7A\u6B57\u{23FC0}\u{23C9A}\u93A0\u92F2\u{28BEA}\u{28ACB}"],
      ["9440", "\u9289\u{2801E}\u{289DC}\u9467\u6DA5\u6F0B\u{249EC}\u6D67\u{23F7F}\u3D8F\u6E04\u{2403C}\u5A3D\u6E0A\u5847\u6D24\u7842\u713B\u{2431A}\u{24276}\u70F1\u7250\u7287\u7294\u{2478F}\u{24725}\u5179\u{24AA4}\u{205EB}\u747A\u{23EF8}\u{2365F}\u{24A4A}\u{24917}\u{25FE1}\u3F06\u3EB1\u{24ADF}\u{28C23}\u{23F35}\u60A7\u3EF3\u74CC\u743C\u9387\u7437\u449F\u{26DEA}\u4551\u7583\u3F63\u{24CD9}\u{24D06}\u3F58\u7555\u7673\u{2A5C6}\u3B19\u7468\u{28ACC}\u{249AB}\u{2498E}\u3AFB"],
      ["94a1", "\u3DCD\u{24A4E}\u3EFF\u{249C5}\u{248F3}\u91FA\u5732\u9342\u{28AE3}\u{21864}\u50DF\u{25221}\u{251E7}\u7778\u{23232}\u770E\u770F\u777B\u{24697}\u{23781}\u3A5E\u{248F0}\u7438\u749B\u3EBF\u{24ABA}\u{24AC7}\u40C8\u{24A96}\u{261AE}\u9307\u{25581}\u781E\u788D\u7888\u78D2\u73D0\u7959\u{27741}\u{256E3}\u410E\u799B\u8496\u79A5\u6A2D\u{23EFA}\u7A3A\u79F4\u416E\u{216E6}\u4132\u9235\u79F1\u{20D4C}\u{2498C}\u{20299}\u{23DBA}\u{2176E}\u3597\u556B\u3570\u36AA\u{201D4}\u{20C0D}\u7AE2\u5A59\u{226F5}\u{25AAF}\u{25A9C}\u5A0D\u{2025B}\u78F0\u5A2A\u{25BC6}\u7AFE\u41F9\u7C5D\u7C6D\u4211\u{25BB3}\u{25EBC}\u{25EA6}\u7CCD\u{249F9}\u{217B0}\u7C8E\u7C7C\u7CAE\u6AB2\u7DDC\u7E07\u7DD3\u7F4E\u{26261}"],
      ["9540", "\u{2615C}\u{27B48}\u7D97\u{25E82}\u426A\u{26B75}\u{20916}\u67D6\u{2004E}\u{235CF}\u57C4\u{26412}\u{263F8}\u{24962}\u7FDD\u7B27\u{2082C}\u{25AE9}\u{25D43}\u7B0C\u{25E0E}\u99E6\u8645\u9A63\u6A1C\u{2343F}\u39E2\u{249F7}\u{265AD}\u9A1F\u{265A0}\u8480\u{27127}\u{26CD1}\u44EA\u8137\u4402\u80C6\u8109\u8142\u{267B4}\u98C3\u{26A42}\u8262\u8265\u{26A51}\u8453\u{26DA7}\u8610\u{2721B}\u5A86\u417F\u{21840}\u5B2B\u{218A1}\u5AE4\u{218D8}\u86A0\u{2F9BC}\u{23D8F}\u882D\u{27422}\u5A02"],
      ["95a1", "\u886E\u4F45\u8887\u88BF\u88E6\u8965\u894D\u{25683}\u8954\u{27785}\u{27784}\u{28BF5}\u{28BD9}\u{28B9C}\u{289F9}\u3EAD\u84A3\u46F5\u46CF\u37F2\u8A3D\u8A1C\u{29448}\u5F4D\u922B\u{24284}\u65D4\u7129\u70C4\u{21845}\u9D6D\u8C9F\u8CE9\u{27DDC}\u599A\u77C3\u59F0\u436E\u36D4\u8E2A\u8EA7\u{24C09}\u8F30\u8F4A\u42F4\u6C58\u6FBB\u{22321}\u489B\u6F79\u6E8B\u{217DA}\u9BE9\u36B5\u{2492F}\u90BB\u9097\u5571\u4906\u91BB\u9404\u{28A4B}\u4062\u{28AFC}\u9427\u{28C1D}\u{28C3B}\u84E5\u8A2B\u9599\u95A7\u9597\u9596\u{28D34}\u7445\u3EC2\u{248FF}\u{24A42}\u{243EA}\u3EE7\u{23225}\u968F\u{28EE7}\u{28E66}\u{28E65}\u3ECC\u{249ED}\u{24A78}\u{23FEE}\u7412\u746B\u3EFC\u9741\u{290B0}"],
      ["9640", "\u6847\u4A1D\u{29093}\u{257DF}\u975D\u9368\u{28989}\u{28C26}\u{28B2F}\u{263BE}\u92BA\u5B11\u8B69\u493C\u73F9\u{2421B}\u979B\u9771\u9938\u{20F26}\u5DC1\u{28BC5}\u{24AB2}\u981F\u{294DA}\u92F6\u{295D7}\u91E5\u44C0\u{28B50}\u{24A67}\u{28B64}\u98DC\u{28A45}\u3F00\u922A\u4925\u8414\u993B\u994D\u{27B06}\u3DFD\u999B\u4B6F\u99AA\u9A5C\u{28B65}\u{258C8}\u6A8F\u9A21\u5AFE\u9A2F\u{298F1}\u4B90\u{29948}\u99BC\u4BBD\u4B97\u937D\u5872\u{21302}\u5822\u{249B8}"],
      ["96a1", "\u{214E8}\u7844\u{2271F}\u{23DB8}\u68C5\u3D7D\u9458\u3927\u6150\u{22781}\u{2296B}\u6107\u9C4F\u9C53\u9C7B\u9C35\u9C10\u9B7F\u9BCF\u{29E2D}\u9B9F\u{2A1F5}\u{2A0FE}\u9D21\u4CAE\u{24104}\u9E18\u4CB0\u9D0C\u{2A1B4}\u{2A0ED}\u{2A0F3}\u{2992F}\u9DA5\u84BD\u{26E12}\u{26FDF}\u{26B82}\u85FC\u4533\u{26DA4}\u{26E84}\u{26DF0}\u8420\u85EE\u{26E00}\u{237D7}\u{26064}\u79E2\u{2359C}\u{23640}\u492D\u{249DE}\u3D62\u93DB\u92BE\u9348\u{202BF}\u78B9\u9277\u944D\u4FE4\u3440\u9064\u{2555D}\u783D\u7854\u78B6\u784B\u{21757}\u{231C9}\u{24941}\u369A\u4F72\u6FDA\u6FD9\u701E\u701E\u5414\u{241B5}\u57BB\u58F3\u578A\u9D16\u57D7\u7134\u34AF\u{241AC}\u71EB\u{26C40}\u{24F97}\u5B28\u{217B5}\u{28A49}"],
      ["9740", "\u610C\u5ACE\u5A0B\u42BC\u{24488}\u372C\u4B7B\u{289FC}\u93BB\u93B8\u{218D6}\u{20F1D}\u8472\u{26CC0}\u{21413}\u{242FA}\u{22C26}\u{243C1}\u5994\u{23DB7}\u{26741}\u7DA8\u{2615B}\u{260A4}\u{249B9}\u{2498B}\u{289FA}\u92E5\u73E2\u3EE9\u74B4\u{28B63}\u{2189F}\u3EE1\u{24AB3}\u6AD8\u73F3\u73FB\u3ED6\u{24A3E}\u{24A94}\u{217D9}\u{24A66}\u{203A7}\u{21424}\u{249E5}\u7448\u{24916}\u70A5\u{24976}\u9284\u73E6\u935F\u{204FE}\u9331\u{28ACE}\u{28A16}\u9386\u{28BE7}\u{255D5}\u4935\u{28A82}\u716B"],
      ["97a1", "\u{24943}\u{20CFF}\u56A4\u{2061A}\u{20BEB}\u{20CB8}\u5502\u79C4\u{217FA}\u7DFE\u{216C2}\u{24A50}\u{21852}\u452E\u9401\u370A\u{28AC0}\u{249AD}\u59B0\u{218BF}\u{21883}\u{27484}\u5AA1\u36E2\u{23D5B}\u36B0\u925F\u5A79\u{28A81}\u{21862}\u9374\u3CCD\u{20AB4}\u4A96\u398A\u50F4\u3D69\u3D4C\u{2139C}\u7175\u42FB\u{28218}\u6E0F\u{290E4}\u44EB\u6D57\u{27E4F}\u7067\u6CAF\u3CD6\u{23FED}\u{23E2D}\u6E02\u6F0C\u3D6F\u{203F5}\u7551\u36BC\u34C8\u4680\u3EDA\u4871\u59C4\u926E\u493E\u8F41\u{28C1C}\u{26BC0}\u5812\u57C8\u36D6\u{21452}\u70FE\u{24362}\u{24A71}\u{22FE3}\u{212B0}\u{223BD}\u68B9\u6967\u{21398}\u{234E5}\u{27BF4}\u{236DF}\u{28A83}\u{237D6}\u{233FA}\u{24C9F}\u6A1A\u{236AD}\u{26CB7}\u843E\u44DF\u44CE"],
      ["9840", "\u{26D26}\u{26D51}\u{26C82}\u{26FDE}\u6F17\u{27109}\u833D\u{2173A}\u83ED\u{26C80}\u{27053}\u{217DB}\u5989\u5A82\u{217B3}\u5A61\u5A71\u{21905}\u{241FC}\u372D\u59EF\u{2173C}\u36C7\u718E\u9390\u669A\u{242A5}\u5A6E\u5A2B\u{24293}\u6A2B\u{23EF9}\u{27736}\u{2445B}\u{242CA}\u711D\u{24259}\u{289E1}\u4FB0\u{26D28}\u5CC2\u{244CE}\u{27E4D}\u{243BD}\u6A0C\u{24256}\u{21304}\u70A6\u7133\u{243E9}\u3DA5\u6CDF\u{2F825}\u{24A4F}\u7E65\u59EB\u5D2F\u3DF3\u5F5C\u{24A5D}\u{217DF}\u7DA4\u8426"],
      ["98a1", "\u5485\u{23AFA}\u{23300}\u{20214}\u577E\u{208D5}\u{20619}\u3FE5\u{21F9E}\u{2A2B6}\u7003\u{2915B}\u5D70\u738F\u7CD3\u{28A59}\u{29420}\u4FC8\u7FE7\u72CD\u7310\u{27AF4}\u7338\u7339\u{256F6}\u7341\u7348\u3EA9\u{27B18}\u906C\u71F5\u{248F2}\u73E1\u81F6\u3ECA\u770C\u3ED1\u6CA2\u56FD\u7419\u741E\u741F\u3EE2\u3EF0\u3EF4\u3EFA\u74D3\u3F0E\u3F53\u7542\u756D\u7572\u758D\u3F7C\u75C8\u75DC\u3FC0\u764D\u3FD7\u7674\u3FDC\u767A\u{24F5C}\u7188\u5623\u8980\u5869\u401D\u7743\u4039\u6761\u4045\u35DB\u7798\u406A\u406F\u5C5E\u77BE\u77CB\u58F2\u7818\u70B9\u781C\u40A8\u7839\u7847\u7851\u7866\u8448\u{25535}\u7933\u6803\u7932\u4103"],
      ["9940", "\u4109\u7991\u7999\u8FBB\u7A06\u8FBC\u4167\u7A91\u41B2\u7ABC\u8279\u41C4\u7ACF\u7ADB\u41CF\u4E21\u7B62\u7B6C\u7B7B\u7C12\u7C1B\u4260\u427A\u7C7B\u7C9C\u428C\u7CB8\u4294\u7CED\u8F93\u70C0\u{20CCF}\u7DCF\u7DD4\u7DD0\u7DFD\u7FAE\u7FB4\u729F\u4397\u8020\u8025\u7B39\u802E\u8031\u8054\u3DCC\u57B4\u70A0\u80B7\u80E9\u43ED\u810C\u732A\u810E\u8112\u7560\u8114\u4401\u3B39\u8156\u8159\u815A"],
      ["99a1", "\u4413\u583A\u817C\u8184\u4425\u8193\u442D\u81A5\u57EF\u81C1\u81E4\u8254\u448F\u82A6\u8276\u82CA\u82D8\u82FF\u44B0\u8357\u9669\u698A\u8405\u70F5\u8464\u60E3\u8488\u4504\u84BE\u84E1\u84F8\u8510\u8538\u8552\u453B\u856F\u8570\u85E0\u4577\u8672\u8692\u86B2\u86EF\u9645\u878B\u4606\u4617\u88AE\u88FF\u8924\u8947\u8991\u{27967}\u8A29\u8A38\u8A94\u8AB4\u8C51\u8CD4\u8CF2\u8D1C\u4798\u585F\u8DC3\u47ED\u4EEE\u8E3A\u55D8\u5754\u8E71\u55F5\u8EB0\u4837\u8ECE\u8EE2\u8EE4\u8EED\u8EF2\u8FB7\u8FC1\u8FCA\u8FCC\u9033\u99C4\u48AD\u98E0\u9213\u491E\u9228\u9258\u926B\u92B1\u92AE\u92BF"],
      ["9a40", "\u92E3\u92EB\u92F3\u92F4\u92FD\u9343\u9384\u93AD\u4945\u4951\u9EBF\u9417\u5301\u941D\u942D\u943E\u496A\u9454\u9479\u952D\u95A2\u49A7\u95F4\u9633\u49E5\u67A0\u4A24\u9740\u4A35\u97B2\u97C2\u5654\u4AE4\u60E8\u98B9\u4B19\u98F1\u5844\u990E\u9919\u51B4\u991C\u9937\u9942\u995D\u9962\u4B70\u99C5\u4B9D\u9A3C\u9B0F\u7A83\u9B69\u9B81\u9BDD\u9BF1\u9BF4\u4C6D\u9C20\u376F\u{21BC2}\u9D49\u9C3A"],
      ["9aa1", "\u9EFE\u5650\u9D93\u9DBD\u9DC0\u9DFC\u94F6\u8FB6\u9E7B\u9EAC\u9EB1\u9EBD\u9EC6\u94DC\u9EE2\u9EF1\u9EF8\u7AC8\u9F44\u{20094}\u{202B7}\u{203A0}\u691A\u94C3\u59AC\u{204D7}\u5840\u94C1\u37B9\u{205D5}\u{20615}\u{20676}\u{216BA}\u5757\u7173\u{20AC2}\u{20ACD}\u{20BBF}\u546A\u{2F83B}\u{20BCB}\u549E\u{20BFB}\u{20C3B}\u{20C53}\u{20C65}\u{20C7C}\u60E7\u{20C8D}\u567A\u{20CB5}\u{20CDD}\u{20CED}\u{20D6F}\u{20DB2}\u{20DC8}\u6955\u9C2F\u87A5\u{20E04}\u{20E0E}\u{20ED7}\u{20F90}\u{20F2D}\u{20E73}\u5C20\u{20FBC}\u5E0B\u{2105C}\u{2104F}\u{21076}\u671E\u{2107B}\u{21088}\u{21096}\u3647\u{210BF}\u{210D3}\u{2112F}\u{2113B}\u5364\u84AD\u{212E3}\u{21375}\u{21336}\u8B81\u{21577}\u{21619}\u{217C3}\u{217C7}\u4E78\u70BB\u{2182D}\u{2196A}"],
      ["9b40", "\u{21A2D}\u{21A45}\u{21C2A}\u{21C70}\u{21CAC}\u{21EC8}\u62C3\u{21ED5}\u{21F15}\u7198\u6855\u{22045}\u69E9\u36C8\u{2227C}\u{223D7}\u{223FA}\u{2272A}\u{22871}\u{2294F}\u82FD\u{22967}\u{22993}\u{22AD5}\u89A5\u{22AE8}\u8FA0\u{22B0E}\u97B8\u{22B3F}\u9847\u9ABD\u{22C4C}"],
      ["9b62", "\u{22C88}\u{22CB7}\u{25BE8}\u{22D08}\u{22D12}\u{22DB7}\u{22D95}\u{22E42}\u{22F74}\u{22FCC}\u{23033}\u{23066}\u{2331F}\u{233DE}\u5FB1\u6648\u66BF\u{27A79}\u{23567}\u{235F3}\u7201\u{249BA}\u77D7\u{2361A}\u{23716}\u7E87\u{20346}\u58B5\u670E"],
      ["9ba1", "\u6918\u{23AA7}\u{27657}\u{25FE2}\u{23E11}\u{23EB9}\u{275FE}\u{2209A}\u48D0\u4AB8\u{24119}\u{28A9A}\u{242EE}\u{2430D}\u{2403B}\u{24334}\u{24396}\u{24A45}\u{205CA}\u51D2\u{20611}\u599F\u{21EA8}\u3BBE\u{23CFF}\u{24404}\u{244D6}\u5788\u{24674}\u399B\u{2472F}\u{285E8}\u{299C9}\u3762\u{221C3}\u8B5E\u{28B4E}\u99D6\u{24812}\u{248FB}\u{24A15}\u7209\u{24AC0}\u{20C78}\u5965\u{24EA5}\u{24F86}\u{20779}\u8EDA\u{2502C}\u528F\u573F\u7171\u{25299}\u{25419}\u{23F4A}\u{24AA7}\u55BC\u{25446}\u{2546E}\u{26B52}\u91D4\u3473\u{2553F}\u{27632}\u{2555E}\u4718\u{25562}\u{25566}\u{257C7}\u{2493F}\u{2585D}\u5066\u34FB\u{233CC}\u60DE\u{25903}\u477C\u{28948}\u{25AAE}\u{25B89}\u{25C06}\u{21D90}\u57A1\u7151\u6FB6\u{26102}\u{27C12}\u9056\u{261B2}\u{24F9A}\u8B62\u{26402}\u{2644A}"],
      ["9c40", "\u5D5B\u{26BF7}\u8F36\u{26484}\u{2191C}\u8AEA\u{249F6}\u{26488}\u{23FEF}\u{26512}\u4BC0\u{265BF}\u{266B5}\u{2271B}\u9465\u{257E1}\u6195\u5A27\u{2F8CD}\u4FBB\u56B9\u{24521}\u{266FC}\u4E6A\u{24934}\u9656\u6D8F\u{26CBD}\u3618\u8977\u{26799}\u{2686E}\u{26411}\u{2685E}\u71DF\u{268C7}\u7B42\u{290C0}\u{20A11}\u{26926}\u9104\u{26939}\u7A45\u9DF0\u{269FA}\u9A26\u{26A2D}\u365F\u{26469}\u{20021}\u7983\u{26A34}\u{26B5B}\u5D2C\u{23519}\u83CF\u{26B9D}\u46D0\u{26CA4}\u753B\u8865\u{26DAE}\u58B6"],
      ["9ca1", "\u371C\u{2258D}\u{2704B}\u{271CD}\u3C54\u{27280}\u{27285}\u9281\u{2217A}\u{2728B}\u9330\u{272E6}\u{249D0}\u6C39\u949F\u{27450}\u{20EF8}\u8827\u88F5\u{22926}\u{28473}\u{217B1}\u6EB8\u{24A2A}\u{21820}\u39A4\u36B9\u5C10\u79E3\u453F\u66B6\u{29CAD}\u{298A4}\u8943\u{277CC}\u{27858}\u56D6\u40DF\u{2160A}\u39A1\u{2372F}\u{280E8}\u{213C5}\u71AD\u8366\u{279DD}\u{291A8}\u5A67\u4CB7\u{270AF}\u{289AB}\u{279FD}\u{27A0A}\u{27B0B}\u{27D66}\u{2417A}\u7B43\u797E\u{28009}\u6FB5\u{2A2DF}\u6A03\u{28318}\u53A2\u{26E07}\u93BF\u6836\u975D\u{2816F}\u{28023}\u{269B5}\u{213ED}\u{2322F}\u{28048}\u5D85\u{28C30}\u{28083}\u5715\u9823\u{28949}\u5DAB\u{24988}\u65BE\u69D5\u53D2\u{24AA5}\u{23F81}\u3C11\u6736\u{28090}\u{280F4}\u{2812E}\u{21FA1}\u{2814F}"],
      ["9d40", "\u{28189}\u{281AF}\u{2821A}\u{28306}\u{2832F}\u{2838A}\u35CA\u{28468}\u{286AA}\u48FA\u63E6\u{28956}\u7808\u9255\u{289B8}\u43F2\u{289E7}\u43DF\u{289E8}\u{28B46}\u{28BD4}\u59F8\u{28C09}\u8F0B\u{28FC5}\u{290EC}\u7B51\u{29110}\u{2913C}\u3DF7\u{2915E}\u{24ACA}\u8FD0\u728F\u568B\u{294E7}\u{295E9}\u{295B0}\u{295B8}\u{29732}\u{298D1}\u{29949}\u{2996A}\u{299C3}\u{29A28}\u{29B0E}\u{29D5A}\u{29D9B}\u7E9F\u{29EF8}\u{29F23}\u4CA4\u9547\u{2A293}\u71A2\u{2A2FF}\u4D91\u9012\u{2A5CB}\u4D9C\u{20C9C}\u8FBE\u55C1"],
      ["9da1", "\u8FBA\u{224B0}\u8FB9\u{24A93}\u4509\u7E7F\u6F56\u6AB1\u4EEA\u34E4\u{28B2C}\u{2789D}\u373A\u8E80\u{217F5}\u{28024}\u{28B6C}\u{28B99}\u{27A3E}\u{266AF}\u3DEB\u{27655}\u{23CB7}\u{25635}\u{25956}\u4E9A\u{25E81}\u{26258}\u56BF\u{20E6D}\u8E0E\u5B6D\u{23E88}\u{24C9E}\u63DE\u62D0\u{217F6}\u{2187B}\u6530\u562D\u{25C4A}\u541A\u{25311}\u3DC6\u{29D98}\u4C7D\u5622\u561E\u7F49\u{25ED8}\u5975\u{23D40}\u8770\u4E1C\u{20FEA}\u{20D49}\u{236BA}\u8117\u9D5E\u8D18\u763B\u9C45\u764E\u77B9\u9345\u5432\u8148\u82F7\u5625\u8132\u8418\u80BD\u55EA\u7962\u5643\u5416\u{20E9D}\u35CE\u5605\u55F1\u66F1\u{282E2}\u362D\u7534\u55F0\u55BA\u5497\u5572\u{20C41}\u{20C96}\u5ED0\u{25148}\u{20E76}\u{22C62}"],
      ["9e40", "\u{20EA2}\u9EAB\u7D5A\u55DE\u{21075}\u629D\u976D\u5494\u8CCD\u71F6\u9176\u63FC\u63B9\u63FE\u5569\u{22B43}\u9C72\u{22EB3}\u519A\u34DF\u{20DA7}\u51A7\u544D\u551E\u5513\u7666\u8E2D\u{2688A}\u75B1\u80B6\u8804\u8786\u88C7\u81B6\u841C\u{210C1}\u44EC\u7304\u{24706}\u5B90\u830B\u{26893}\u567B\u{226F4}\u{27D2F}\u{241A3}\u{27D73}\u{26ED0}\u{272B6}\u9170\u{211D9}\u9208\u{23CFC}\u{2A6A9}\u{20EAC}\u{20EF9}\u7266\u{21CA2}\u474E\u{24FC2}\u{27FF9}\u{20FEB}\u40FA"],
      ["9ea1", "\u9C5D\u651F\u{22DA0}\u48F3\u{247E0}\u{29D7C}\u{20FEC}\u{20E0A}\u6062\u{275A3}\u{20FED}"],
      ["9ead", "\u{26048}\u{21187}\u71A3\u7E8E\u9D50\u4E1A\u4E04\u3577\u5B0D\u6CB2\u5367\u36AC\u39DC\u537D\u36A5\u{24618}\u589A\u{24B6E}\u822D\u544B\u57AA\u{25A95}\u{20979}"],
      ["9ec5", "\u3A52\u{22465}\u7374\u{29EAC}\u4D09\u9BED\u{23CFE}\u{29F30}\u4C5B\u{24FA9}\u{2959E}\u{29FDE}\u845C\u{23DB6}\u{272B2}\u{267B3}\u{23720}\u632E\u7D25\u{23EF7}\u{23E2C}\u3A2A\u9008\u52CC\u3E74\u367A\u45E9\u{2048E}\u7640\u5AF0\u{20EB6}\u787A\u{27F2E}\u58A7\u40BF\u567C\u9B8B\u5D74\u7654\u{2A434}\u9E85\u4CE1\u75F9\u37FB\u6119\u{230DA}\u{243F2}"],
      ["9ef5", "\u565D\u{212A9}\u57A7\u{24963}\u{29E06}\u5234\u{270AE}\u35AD\u6C4A\u9D7C"],
      ["9f40", "\u7C56\u9B39\u57DE\u{2176C}\u5C53\u64D3\u{294D0}\u{26335}\u{27164}\u86AD\u{20D28}\u{26D22}\u{24AE2}\u{20D71}"],
      ["9f4f", "\u51FE\u{21F0F}\u5D8E\u9703\u{21DD1}\u9E81\u904C\u7B1F\u9B02\u5CD1\u7BA3\u6268\u6335\u9AFF\u7BCF\u9B2A\u7C7E\u9B2E\u7C42\u7C86\u9C15\u7BFC\u9B09\u9F17\u9C1B\u{2493E}\u9F5A\u5573\u5BC3\u4FFD\u9E98\u4FF2\u5260\u3E06\u52D1\u5767\u5056\u59B7\u5E12\u97C8\u9DAB\u8F5C\u5469\u97B4\u9940\u97BA\u532C\u6130"],
      ["9fa1", "\u692C\u53DA\u9C0A\u9D02\u4C3B\u9641\u6980\u50A6\u7546\u{2176D}\u99DA\u5273"],
      ["9fae", "\u9159\u9681\u915C"],
      ["9fb2", "\u9151\u{28E97}\u637F\u{26D23}\u6ACA\u5611\u918E\u757A\u6285\u{203FC}\u734F\u7C70\u{25C21}\u{23CFD}"],
      ["9fc1", "\u{24919}\u76D6\u9B9D\u4E2A\u{20CD4}\u83BE\u8842"],
      ["9fc9", "\u5C4A\u69C0\u50ED\u577A\u521F\u5DF5\u4ECE\u6C31\u{201F2}\u4F39\u549C\u54DA\u529A\u8D82\u35FE\u5F0C\u35F3"],
      ["9fdb", "\u6B52\u917C\u9FA5\u9B97\u982E\u98B4\u9ABA\u9EA8\u9E84\u717A\u7B14"],
      ["9fe7", "\u6BFA\u8818\u7F78"],
      ["9feb", "\u5620\u{2A64A}\u8E77\u9F53"],
      ["9ff0", "\u8DD4\u8E4F\u9E1C\u8E01\u6282\u{2837D}\u8E28\u8E75\u7AD3\u{24A77}\u7A3E\u78D8\u6CEA\u8A67\u7607"],
      ["a040", "\u{28A5A}\u9F26\u6CCE\u87D6\u75C3\u{2A2B2}\u7853\u{2F840}\u8D0C\u72E2\u7371\u8B2D\u7302\u74F1\u8CEB\u{24ABB}\u862F\u5FBA\u88A0\u44B7"],
      ["a055", "\u{2183B}\u{26E05}"],
      ["a058", "\u8A7E\u{2251B}"],
      ["a05b", "\u60FD\u7667\u9AD7\u9D44\u936E\u9B8F\u87F5"],
      ["a063", "\u880F\u8CF7\u732C\u9721\u9BB0\u35D6\u72B2\u4C07\u7C51\u994A\u{26159}\u6159\u4C04\u9E96\u617D"],
      ["a073", "\u575F\u616F\u62A6\u6239\u62CE\u3A5C\u61E2\u53AA\u{233F5}\u6364\u6802\u35D2"],
      ["a0a1", "\u5D57\u{28BC2}\u8FDA\u{28E39}"],
      ["a0a6", "\u50D9\u{21D46}\u7906\u5332\u9638\u{20F3B}\u4065"],
      ["a0ae", "\u77FE"],
      ["a0b0", "\u7CC2\u{25F1A}\u7CDA\u7A2D\u8066\u8063\u7D4D\u7505\u74F2\u8994\u821A\u670C\u8062\u{27486}\u805B\u74F0\u8103\u7724\u8989\u{267CC}\u7553\u{26ED1}\u87A9\u87CE\u81C8\u878C\u8A49\u8CAD\u8B43\u772B\u74F8\u84DA\u3635\u69B2\u8DA6"],
      ["a0d4", "\u89A9\u7468\u6DB9\u87C1\u{24011}\u74E7\u3DDB\u7176\u60A4\u619C\u3CD1\u7162\u6077"],
      ["a0e2", "\u7F71\u{28B2D}\u7250\u60E9\u4B7E\u5220\u3C18\u{23CC7}\u{25ED7}\u{27656}\u{25531}\u{21944}\u{212FE}\u{29903}\u{26DDC}\u{270AD}\u5CC1\u{261AD}\u{28A0F}\u{23677}\u{200EE}\u{26846}\u{24F0E}\u4562\u5B1F\u{2634C}\u9F50\u9EA6\u{2626B}"],
      ["a3c0", "\u2400", 31, "\u2421"],
      ["c6a1", "\u2460", 9, "\u2474", 9, "\u2170", 9, "\u4E36\u4E3F\u4E85\u4EA0\u5182\u5196\u51AB\u52F9\u5338\u5369\u53B6\u590A\u5B80\u5DDB\u2F33\u5E7F\u5EF4\u5F50\u5F61\u6534\u65E0\u7592\u7676\u8FB5\u96B6\xA8\u02C6\u30FD\u30FE\u309D\u309E\u3003\u4EDD\u3005\u3006\u3007\u30FC\uFF3B\uFF3D\u273D\u3041", 23],
      ["c740", "\u3059", 58, "\u30A1\u30A2\u30A3\u30A4"],
      ["c7a1", "\u30A5", 81, "\u0410", 5, "\u0401\u0416", 4],
      ["c840", "\u041B", 26, "\u0451\u0436", 25, "\u21E7\u21B8\u21B9\u31CF\u{200CC}\u4E5A\u{2008A}\u5202\u4491"],
      ["c8a1", "\u9FB0\u5188\u9FB1\u{27607}"],
      ["c8cd", "\uFFE2\uFFE4\uFF07\uFF02\u3231\u2116\u2121\u309B\u309C\u2E80\u2E84\u2E86\u2E87\u2E88\u2E8A\u2E8C\u2E8D\u2E95\u2E9C\u2E9D\u2EA5\u2EA7\u2EAA\u2EAC\u2EAE\u2EB6\u2EBC\u2EBE\u2EC6\u2ECA\u2ECC\u2ECD\u2ECF\u2ED6\u2ED7\u2EDE\u2EE3"],
      ["c8f5", "\u0283\u0250\u025B\u0254\u0275\u0153\xF8\u014B\u028A\u026A"],
      ["f9fe", "\uFFED"],
      ["fa40", "\u{20547}\u92DB\u{205DF}\u{23FC5}\u854C\u42B5\u73EF\u51B5\u3649\u{24942}\u{289E4}\u9344\u{219DB}\u82EE\u{23CC8}\u783C\u6744\u62DF\u{24933}\u{289AA}\u{202A0}\u{26BB3}\u{21305}\u4FAB\u{224ED}\u5008\u{26D29}\u{27A84}\u{23600}\u{24AB1}\u{22513}\u5029\u{2037E}\u5FA4\u{20380}\u{20347}\u6EDB\u{2041F}\u507D\u5101\u347A\u510E\u986C\u3743\u8416\u{249A4}\u{20487}\u5160\u{233B4}\u516A\u{20BFF}\u{220FC}\u{202E5}\u{22530}\u{2058E}\u{23233}\u{21983}\u5B82\u877D\u{205B3}\u{23C99}\u51B2\u51B8"],
      ["faa1", "\u9D34\u51C9\u51CF\u51D1\u3CDC\u51D3\u{24AA6}\u51B3\u51E2\u5342\u51ED\u83CD\u693E\u{2372D}\u5F7B\u520B\u5226\u523C\u52B5\u5257\u5294\u52B9\u52C5\u7C15\u8542\u52E0\u860D\u{26B13}\u5305\u{28ADE}\u5549\u6ED9\u{23F80}\u{20954}\u{23FEC}\u5333\u5344\u{20BE2}\u6CCB\u{21726}\u681B\u73D5\u604A\u3EAA\u38CC\u{216E8}\u71DD\u44A2\u536D\u5374\u{286AB}\u537E\u537F\u{21596}\u{21613}\u77E6\u5393\u{28A9B}\u53A0\u53AB\u53AE\u73A7\u{25772}\u3F59\u739C\u53C1\u53C5\u6C49\u4E49\u57FE\u53D9\u3AAB\u{20B8F}\u53E0\u{23FEB}\u{22DA3}\u53F6\u{20C77}\u5413\u7079\u552B\u6657\u6D5B\u546D\u{26B53}\u{20D74}\u555D\u548F\u54A4\u47A6\u{2170D}\u{20EDD}\u3DB4\u{20D4D}"],
      ["fb40", "\u{289BC}\u{22698}\u5547\u4CED\u542F\u7417\u5586\u55A9\u5605\u{218D7}\u{2403A}\u4552\u{24435}\u66B3\u{210B4}\u5637\u66CD\u{2328A}\u66A4\u66AD\u564D\u564F\u78F1\u56F1\u9787\u53FE\u5700\u56EF\u56ED\u{28B66}\u3623\u{2124F}\u5746\u{241A5}\u6C6E\u708B\u5742\u36B1\u{26C7E}\u57E6\u{21416}\u5803\u{21454}\u{24363}\u5826\u{24BF5}\u585C\u58AA\u3561\u58E0\u58DC\u{2123C}\u58FB\u5BFF\u5743\u{2A150}\u{24278}\u93D3\u35A1\u591F\u68A6\u36C3\u6E59"],
      ["fba1", "\u{2163E}\u5A24\u5553\u{21692}\u8505\u59C9\u{20D4E}\u{26C81}\u{26D2A}\u{217DC}\u59D9\u{217FB}\u{217B2}\u{26DA6}\u6D71\u{21828}\u{216D5}\u59F9\u{26E45}\u5AAB\u5A63\u36E6\u{249A9}\u5A77\u3708\u5A96\u7465\u5AD3\u{26FA1}\u{22554}\u3D85\u{21911}\u3732\u{216B8}\u5E83\u52D0\u5B76\u6588\u5B7C\u{27A0E}\u4004\u485D\u{20204}\u5BD5\u6160\u{21A34}\u{259CC}\u{205A5}\u5BF3\u5B9D\u4D10\u5C05\u{21B44}\u5C13\u73CE\u5C14\u{21CA5}\u{26B28}\u5C49\u48DD\u5C85\u5CE9\u5CEF\u5D8B\u{21DF9}\u{21E37}\u5D10\u5D18\u5D46\u{21EA4}\u5CBA\u5DD7\u82FC\u382D\u{24901}\u{22049}\u{22173}\u8287\u3836\u3BC2\u5E2E\u6A8A\u5E75\u5E7A\u{244BC}\u{20CD3}\u53A6\u4EB7\u5ED0\u53A8\u{21771}\u5E09\u5EF4\u{28482}"],
      ["fc40", "\u5EF9\u5EFB\u38A0\u5EFC\u683E\u941B\u5F0D\u{201C1}\u{2F894}\u3ADE\u48AE\u{2133A}\u5F3A\u{26888}\u{223D0}\u5F58\u{22471}\u5F63\u97BD\u{26E6E}\u5F72\u9340\u{28A36}\u5FA7\u5DB6\u3D5F\u{25250}\u{21F6A}\u{270F8}\u{22668}\u91D6\u{2029E}\u{28A29}\u6031\u6685\u{21877}\u3963\u3DC7\u3639\u5790\u{227B4}\u7971\u3E40\u609E\u60A4\u60B3\u{24982}\u{2498F}\u{27A53}\u74A4\u50E1\u5AA0\u6164\u8424\u6142\u{2F8A6}\u{26ED2}\u6181\u51F4\u{20656}\u6187\u5BAA\u{23FB7}"],
      ["fca1", "\u{2285F}\u61D3\u{28B9D}\u{2995D}\u61D0\u3932\u{22980}\u{228C1}\u6023\u615C\u651E\u638B\u{20118}\u62C5\u{21770}\u62D5\u{22E0D}\u636C\u{249DF}\u3A17\u6438\u63F8\u{2138E}\u{217FC}\u6490\u6F8A\u{22E36}\u9814\u{2408C}\u{2571D}\u64E1\u64E5\u947B\u3A66\u643A\u3A57\u654D\u6F16\u{24A28}\u{24A23}\u6585\u656D\u655F\u{2307E}\u65B5\u{24940}\u4B37\u65D1\u40D8\u{21829}\u65E0\u65E3\u5FDF\u{23400}\u6618\u{231F7}\u{231F8}\u6644\u{231A4}\u{231A5}\u664B\u{20E75}\u6667\u{251E6}\u6673\u6674\u{21E3D}\u{23231}\u{285F4}\u{231C8}\u{25313}\u77C5\u{228F7}\u99A4\u6702\u{2439C}\u{24A21}\u3B2B\u69FA\u{237C2}\u675E\u6767\u6762\u{241CD}\u{290ED}\u67D7\u44E9\u6822\u6E50\u923C\u6801\u{233E6}\u{26DA0}\u685D"],
      ["fd40", "\u{2346F}\u69E1\u6A0B\u{28ADF}\u6973\u68C3\u{235CD}\u6901\u6900\u3D32\u3A01\u{2363C}\u3B80\u67AC\u6961\u{28A4A}\u42FC\u6936\u6998\u3BA1\u{203C9}\u8363\u5090\u69F9\u{23659}\u{2212A}\u6A45\u{23703}\u6A9D\u3BF3\u67B1\u6AC8\u{2919C}\u3C0D\u6B1D\u{20923}\u60DE\u6B35\u6B74\u{227CD}\u6EB5\u{23ADB}\u{203B5}\u{21958}\u3740\u5421\u{23B5A}\u6BE1\u{23EFC}\u6BDC\u6C37\u{2248B}\u{248F1}\u{26B51}\u6C5A\u8226\u6C79\u{23DBC}\u44C5\u{23DBD}\u{241A4}\u{2490C}\u{24900}"],
      ["fda1", "\u{23CC9}\u36E5\u3CEB\u{20D32}\u9B83\u{231F9}\u{22491}\u7F8F\u6837\u{26D25}\u{26DA1}\u{26DEB}\u6D96\u6D5C\u6E7C\u6F04\u{2497F}\u{24085}\u{26E72}\u8533\u{26F74}\u51C7\u6C9C\u6E1D\u842E\u{28B21}\u6E2F\u{23E2F}\u7453\u{23F82}\u79CC\u6E4F\u5A91\u{2304B}\u6FF8\u370D\u6F9D\u{23E30}\u6EFA\u{21497}\u{2403D}\u4555\u93F0\u6F44\u6F5C\u3D4E\u6F74\u{29170}\u3D3B\u6F9F\u{24144}\u6FD3\u{24091}\u{24155}\u{24039}\u{23FF0}\u{23FB4}\u{2413F}\u51DF\u{24156}\u{24157}\u{24140}\u{261DD}\u704B\u707E\u70A7\u7081\u70CC\u70D5\u70D6\u70DF\u4104\u3DE8\u71B4\u7196\u{24277}\u712B\u7145\u5A88\u714A\u716E\u5C9C\u{24365}\u714F\u9362\u{242C1}\u712C\u{2445A}\u{24A27}\u{24A22}\u71BA\u{28BE8}\u70BD\u720E"],
      ["fe40", "\u9442\u7215\u5911\u9443\u7224\u9341\u{25605}\u722E\u7240\u{24974}\u68BD\u7255\u7257\u3E55\u{23044}\u680D\u6F3D\u7282\u732A\u732B\u{24823}\u{2882B}\u48ED\u{28804}\u7328\u732E\u73CF\u73AA\u{20C3A}\u{26A2E}\u73C9\u7449\u{241E2}\u{216E7}\u{24A24}\u6623\u36C5\u{249B7}\u{2498D}\u{249FB}\u73F7\u7415\u6903\u{24A26}\u7439\u{205C3}\u3ED7\u745C\u{228AD}\u7460\u{28EB2}\u7447\u73E4\u7476\u83B9\u746C\u3730\u7474\u93F1\u6A2C\u7482\u4953\u{24A8C}"],
      ["fea1", "\u{2415F}\u{24A79}\u{28B8F}\u5B46\u{28C03}\u{2189E}\u74C8\u{21988}\u750E\u74E9\u751E\u{28ED9}\u{21A4B}\u5BD7\u{28EAC}\u9385\u754D\u754A\u7567\u756E\u{24F82}\u3F04\u{24D13}\u758E\u745D\u759E\u75B4\u7602\u762C\u7651\u764F\u766F\u7676\u{263F5}\u7690\u81EF\u37F8\u{26911}\u{2690E}\u76A1\u76A5\u76B7\u76CC\u{26F9F}\u8462\u{2509D}\u{2517D}\u{21E1C}\u771E\u7726\u7740\u64AF\u{25220}\u7758\u{232AC}\u77AF\u{28964}\u{28968}\u{216C1}\u77F4\u7809\u{21376}\u{24A12}\u68CA\u78AF\u78C7\u78D3\u96A5\u792E\u{255E0}\u78D7\u7934\u78B1\u{2760C}\u8FB8\u8884\u{28B2B}\u{26083}\u{2261C}\u7986\u8900\u6902\u7980\u{25857}\u799D\u{27B39}\u793C\u79A9\u6E2A\u{27126}\u3EA8\u79C6\u{2910D}\u79D4"]
    ];
  }
});

// node_modules/iconv-lite/encodings/dbcs-data.js
var require_dbcs_data = __commonJS({
  "node_modules/iconv-lite/encodings/dbcs-data.js"(exports, module) {
    "use strict";
    module.exports = {
      "shiftjis": {
        type: "_dbcs",
        table: function() {
          return require_shiftjis();
        },
        encodeAdd: { "\xA5": 92, "\u203E": 126 },
        encodeSkipVals: [{ from: 60736, to: 63808 }]
      },
      "csshiftjis": "shiftjis",
      "mskanji": "shiftjis",
      "sjis": "shiftjis",
      "windows31j": "shiftjis",
      "ms31j": "shiftjis",
      "xsjis": "shiftjis",
      "windows932": "shiftjis",
      "ms932": "shiftjis",
      "932": "shiftjis",
      "cp932": "shiftjis",
      "eucjp": {
        type: "_dbcs",
        table: function() {
          return require_eucjp();
        },
        encodeAdd: { "\xA5": 92, "\u203E": 126 }
      },
      "gb2312": "cp936",
      "gb231280": "cp936",
      "gb23121980": "cp936",
      "csgb2312": "cp936",
      "csiso58gb231280": "cp936",
      "euccn": "cp936",
      "windows936": "cp936",
      "ms936": "cp936",
      "936": "cp936",
      "cp936": {
        type: "_dbcs",
        table: function() {
          return require_cp936();
        }
      },
      "gbk": {
        type: "_dbcs",
        table: function() {
          return require_cp936().concat(require_gbk_added());
        }
      },
      "xgbk": "gbk",
      "isoir58": "gbk",
      "gb18030": {
        type: "_dbcs",
        table: function() {
          return require_cp936().concat(require_gbk_added());
        },
        gb18030: function() {
          return require_gb18030_ranges();
        },
        encodeSkipVals: [128],
        encodeAdd: { "\u20AC": 41699 }
      },
      "chinese": "gb18030",
      "windows949": "cp949",
      "ms949": "cp949",
      "949": "cp949",
      "cp949": {
        type: "_dbcs",
        table: function() {
          return require_cp949();
        }
      },
      "cseuckr": "cp949",
      "csksc56011987": "cp949",
      "euckr": "cp949",
      "isoir149": "cp949",
      "korean": "cp949",
      "ksc56011987": "cp949",
      "ksc56011989": "cp949",
      "ksc5601": "cp949",
      "windows950": "cp950",
      "ms950": "cp950",
      "950": "cp950",
      "cp950": {
        type: "_dbcs",
        table: function() {
          return require_cp950();
        }
      },
      "big5": "big5hkscs",
      "big5hkscs": {
        type: "_dbcs",
        table: function() {
          return require_cp950().concat(require_big5_added());
        },
        encodeSkipVals: [
          36457,
          36463,
          36478,
          36523,
          36532,
          36557,
          36560,
          36695,
          36713,
          36718,
          36811,
          36862,
          36973,
          36986,
          37060,
          37084,
          37105,
          37311,
          37551,
          37552,
          37553,
          37554,
          37585,
          37959,
          38090,
          38361,
          38652,
          39285,
          39798,
          39800,
          39803,
          39878,
          39902,
          39916,
          39926,
          40002,
          40019,
          40034,
          40040,
          40043,
          40055,
          40124,
          40125,
          40144,
          40279,
          40282,
          40388,
          40431,
          40443,
          40617,
          40687,
          40701,
          40800,
          40907,
          41079,
          41180,
          41183,
          36812,
          37576,
          38468,
          38637,
          41636,
          41637,
          41639,
          41638,
          41676,
          41678
        ]
      },
      "cnbig5": "big5hkscs",
      "csbig5": "big5hkscs",
      "xxbig5": "big5hkscs"
    };
  }
});

// node_modules/iconv-lite/encodings/index.js
var require_encodings = __commonJS({
  "node_modules/iconv-lite/encodings/index.js"(exports, module) {
    "use strict";
    var modules = [
      require_internal(),
      require_utf32(),
      require_utf16(),
      require_utf7(),
      require_sbcs_codec(),
      require_sbcs_data(),
      require_sbcs_data_generated(),
      require_dbcs_codec(),
      require_dbcs_data()
    ];
    for (i = 0; i < modules.length; i++) {
      module = modules[i];
      for (enc in module)
        if (Object.prototype.hasOwnProperty.call(module, enc))
          exports[enc] = module[enc];
    }
    var module;
    var enc;
    var i;
  }
});

// node_modules/iconv-lite/lib/streams.js
var require_streams = __commonJS({
  "node_modules/iconv-lite/lib/streams.js"(exports, module) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    module.exports = function(stream_module) {
      var Transform2 = stream_module.Transform;
      function IconvLiteEncoderStream(conv, options) {
        this.conv = conv;
        options = options || {};
        options.decodeStrings = false;
        Transform2.call(this, options);
      }
      IconvLiteEncoderStream.prototype = Object.create(Transform2.prototype, {
        constructor: { value: IconvLiteEncoderStream }
      });
      IconvLiteEncoderStream.prototype._transform = function(chunk, encoding, done2) {
        if (typeof chunk != "string")
          return done2(new Error("Iconv encoding stream needs strings as its input."));
        try {
          var res = this.conv.write(chunk);
          if (res && res.length)
            this.push(res);
          done2();
        } catch (e) {
          done2(e);
        }
      };
      IconvLiteEncoderStream.prototype._flush = function(done2) {
        try {
          var res = this.conv.end();
          if (res && res.length)
            this.push(res);
          done2();
        } catch (e) {
          done2(e);
        }
      };
      IconvLiteEncoderStream.prototype.collect = function(cb) {
        var chunks = [];
        this.on("error", cb);
        this.on("data", function(chunk) {
          chunks.push(chunk);
        });
        this.on("end", function() {
          cb(null, Buffer3.concat(chunks));
        });
        return this;
      };
      function IconvLiteDecoderStream(conv, options) {
        this.conv = conv;
        options = options || {};
        options.encoding = this.encoding = "utf8";
        Transform2.call(this, options);
      }
      IconvLiteDecoderStream.prototype = Object.create(Transform2.prototype, {
        constructor: { value: IconvLiteDecoderStream }
      });
      IconvLiteDecoderStream.prototype._transform = function(chunk, encoding, done2) {
        if (!Buffer3.isBuffer(chunk) && !(chunk instanceof Uint8Array))
          return done2(new Error("Iconv decoding stream needs buffers as its input."));
        try {
          var res = this.conv.write(chunk);
          if (res && res.length)
            this.push(res, this.encoding);
          done2();
        } catch (e) {
          done2(e);
        }
      };
      IconvLiteDecoderStream.prototype._flush = function(done2) {
        try {
          var res = this.conv.end();
          if (res && res.length)
            this.push(res, this.encoding);
          done2();
        } catch (e) {
          done2(e);
        }
      };
      IconvLiteDecoderStream.prototype.collect = function(cb) {
        var res = "";
        this.on("error", cb);
        this.on("data", function(chunk) {
          res += chunk;
        });
        this.on("end", function() {
          cb(null, res);
        });
        return this;
      };
      return {
        IconvLiteEncoderStream,
        IconvLiteDecoderStream
      };
    };
  }
});

// node-modules-polyfills:events
var events_exports = {};
__export(events_exports, {
  EventEmitter: () => EventEmitter,
  default: () => events_default
});
function EventHandlers() {
}
function EventEmitter() {
  EventEmitter.init.call(this);
}
function $getMaxListeners(that) {
  if (that._maxListeners === void 0)
    return EventEmitter.defaultMaxListeners;
  return that._maxListeners;
}
function emitNone(handler, isFn, self2) {
  if (isFn)
    handler.call(self2);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2);
  }
}
function emitOne(handler, isFn, self2, arg1) {
  if (isFn)
    handler.call(self2, arg1);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2, arg1);
  }
}
function emitTwo(handler, isFn, self2, arg1, arg2) {
  if (isFn)
    handler.call(self2, arg1, arg2);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2, arg1, arg2);
  }
}
function emitThree(handler, isFn, self2, arg1, arg2, arg3) {
  if (isFn)
    handler.call(self2, arg1, arg2, arg3);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].call(self2, arg1, arg2, arg3);
  }
}
function emitMany(handler, isFn, self2, args) {
  if (isFn)
    handler.apply(self2, args);
  else {
    var len = handler.length;
    var listeners2 = arrayClone(handler, len);
    for (var i = 0; i < len; ++i)
      listeners2[i].apply(self2, args);
  }
}
function _addListener(target, type, listener, prepend) {
  var m;
  var events;
  var existing;
  if (typeof listener !== "function")
    throw new TypeError('"listener" argument must be a function');
  events = target._events;
  if (!events) {
    events = target._events = new EventHandlers();
    target._eventsCount = 0;
  } else {
    if (events.newListener) {
      target.emit(
        "newListener",
        type,
        listener.listener ? listener.listener : listener
      );
      events = target._events;
    }
    existing = events[type];
  }
  if (!existing) {
    existing = events[type] = listener;
    ++target._eventsCount;
  } else {
    if (typeof existing === "function") {
      existing = events[type] = prepend ? [listener, existing] : [existing, listener];
    } else {
      if (prepend) {
        existing.unshift(listener);
      } else {
        existing.push(listener);
      }
    }
    if (!existing.warned) {
      m = $getMaxListeners(target);
      if (m && m > 0 && existing.length > m) {
        existing.warned = true;
        var w = new Error("Possible EventEmitter memory leak detected. " + existing.length + " " + type + " listeners added. Use emitter.setMaxListeners() to increase limit");
        w.name = "MaxListenersExceededWarning";
        w.emitter = target;
        w.type = type;
        w.count = existing.length;
        emitWarning(w);
      }
    }
  }
  return target;
}
function emitWarning(e) {
  typeof console.warn === "function" ? console.warn(e) : console.log(e);
}
function _onceWrap(target, type, listener) {
  var fired = false;
  function g() {
    target.removeListener(type, g);
    if (!fired) {
      fired = true;
      listener.apply(target, arguments);
    }
  }
  g.listener = listener;
  return g;
}
function listenerCount(type) {
  var events = this._events;
  if (events) {
    var evlistener = events[type];
    if (typeof evlistener === "function") {
      return 1;
    } else if (evlistener) {
      return evlistener.length;
    }
  }
  return 0;
}
function spliceOne(list, index) {
  for (var i = index, k = i + 1, n = list.length; k < n; i += 1, k += 1)
    list[i] = list[k];
  list.pop();
}
function arrayClone(arr, i) {
  var copy2 = new Array(i);
  while (i--)
    copy2[i] = arr[i];
  return copy2;
}
function unwrapListeners(arr) {
  var ret = new Array(arr.length);
  for (var i = 0; i < ret.length; ++i) {
    ret[i] = arr[i].listener || arr[i];
  }
  return ret;
}
var domain, events_default;
var init_events = __esm({
  "node-modules-polyfills:events"() {
    "use strict";
    EventHandlers.prototype = /* @__PURE__ */ Object.create(null);
    events_default = EventEmitter;
    EventEmitter.EventEmitter = EventEmitter;
    EventEmitter.usingDomains = false;
    EventEmitter.prototype.domain = void 0;
    EventEmitter.prototype._events = void 0;
    EventEmitter.prototype._maxListeners = void 0;
    EventEmitter.defaultMaxListeners = 10;
    EventEmitter.init = function() {
      this.domain = null;
      if (EventEmitter.usingDomains) {
        if (domain.active && !(this instanceof domain.Domain)) {
          this.domain = domain.active;
        }
      }
      if (!this._events || this._events === Object.getPrototypeOf(this)._events) {
        this._events = new EventHandlers();
        this._eventsCount = 0;
      }
      this._maxListeners = this._maxListeners || void 0;
    };
    EventEmitter.prototype.setMaxListeners = function setMaxListeners(n) {
      if (typeof n !== "number" || n < 0 || isNaN(n))
        throw new TypeError('"n" argument must be a positive number');
      this._maxListeners = n;
      return this;
    };
    EventEmitter.prototype.getMaxListeners = function getMaxListeners() {
      return $getMaxListeners(this);
    };
    EventEmitter.prototype.emit = function emit(type) {
      var er, handler, len, args, i, events, domain2;
      var needDomainExit = false;
      var doError = type === "error";
      events = this._events;
      if (events)
        doError = doError && events.error == null;
      else if (!doError)
        return false;
      domain2 = this.domain;
      if (doError) {
        er = arguments[1];
        if (domain2) {
          if (!er)
            er = new Error('Uncaught, unspecified "error" event');
          er.domainEmitter = this;
          er.domain = domain2;
          er.domainThrown = false;
          domain2.emit("error", er);
        } else if (er instanceof Error) {
          throw er;
        } else {
          var err = new Error('Uncaught, unspecified "error" event. (' + er + ")");
          err.context = er;
          throw err;
        }
        return false;
      }
      handler = events[type];
      if (!handler)
        return false;
      var isFn = typeof handler === "function";
      len = arguments.length;
      switch (len) {
        case 1:
          emitNone(handler, isFn, this);
          break;
        case 2:
          emitOne(handler, isFn, this, arguments[1]);
          break;
        case 3:
          emitTwo(handler, isFn, this, arguments[1], arguments[2]);
          break;
        case 4:
          emitThree(handler, isFn, this, arguments[1], arguments[2], arguments[3]);
          break;
        default:
          args = new Array(len - 1);
          for (i = 1; i < len; i++)
            args[i - 1] = arguments[i];
          emitMany(handler, isFn, this, args);
      }
      if (needDomainExit)
        domain2.exit();
      return true;
    };
    EventEmitter.prototype.addListener = function addListener(type, listener) {
      return _addListener(this, type, listener, false);
    };
    EventEmitter.prototype.on = EventEmitter.prototype.addListener;
    EventEmitter.prototype.prependListener = function prependListener(type, listener) {
      return _addListener(this, type, listener, true);
    };
    EventEmitter.prototype.once = function once(type, listener) {
      if (typeof listener !== "function")
        throw new TypeError('"listener" argument must be a function');
      this.on(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.prependOnceListener = function prependOnceListener(type, listener) {
      if (typeof listener !== "function")
        throw new TypeError('"listener" argument must be a function');
      this.prependListener(type, _onceWrap(this, type, listener));
      return this;
    };
    EventEmitter.prototype.removeListener = function removeListener(type, listener) {
      var list, events, position, i, originalListener;
      if (typeof listener !== "function")
        throw new TypeError('"listener" argument must be a function');
      events = this._events;
      if (!events)
        return this;
      list = events[type];
      if (!list)
        return this;
      if (list === listener || list.listener && list.listener === listener) {
        if (--this._eventsCount === 0)
          this._events = new EventHandlers();
        else {
          delete events[type];
          if (events.removeListener)
            this.emit("removeListener", type, list.listener || listener);
        }
      } else if (typeof list !== "function") {
        position = -1;
        for (i = list.length; i-- > 0; ) {
          if (list[i] === listener || list[i].listener && list[i].listener === listener) {
            originalListener = list[i].listener;
            position = i;
            break;
          }
        }
        if (position < 0)
          return this;
        if (list.length === 1) {
          list[0] = void 0;
          if (--this._eventsCount === 0) {
            this._events = new EventHandlers();
            return this;
          } else {
            delete events[type];
          }
        } else {
          spliceOne(list, position);
        }
        if (events.removeListener)
          this.emit("removeListener", type, originalListener || listener);
      }
      return this;
    };
    EventEmitter.prototype.removeAllListeners = function removeAllListeners(type) {
      var listeners2, events;
      events = this._events;
      if (!events)
        return this;
      if (!events.removeListener) {
        if (arguments.length === 0) {
          this._events = new EventHandlers();
          this._eventsCount = 0;
        } else if (events[type]) {
          if (--this._eventsCount === 0)
            this._events = new EventHandlers();
          else
            delete events[type];
        }
        return this;
      }
      if (arguments.length === 0) {
        var keys2 = Object.keys(events);
        for (var i = 0, key; i < keys2.length; ++i) {
          key = keys2[i];
          if (key === "removeListener")
            continue;
          this.removeAllListeners(key);
        }
        this.removeAllListeners("removeListener");
        this._events = new EventHandlers();
        this._eventsCount = 0;
        return this;
      }
      listeners2 = events[type];
      if (typeof listeners2 === "function") {
        this.removeListener(type, listeners2);
      } else if (listeners2) {
        do {
          this.removeListener(type, listeners2[listeners2.length - 1]);
        } while (listeners2[0]);
      }
      return this;
    };
    EventEmitter.prototype.listeners = function listeners(type) {
      var evlistener;
      var ret;
      var events = this._events;
      if (!events)
        ret = [];
      else {
        evlistener = events[type];
        if (!evlistener)
          ret = [];
        else if (typeof evlistener === "function")
          ret = [evlistener.listener || evlistener];
        else
          ret = unwrapListeners(evlistener);
      }
      return ret;
    };
    EventEmitter.listenerCount = function(emitter, type) {
      if (typeof emitter.listenerCount === "function") {
        return emitter.listenerCount(type);
      } else {
        return listenerCount.call(emitter, type);
      }
    };
    EventEmitter.prototype.listenerCount = listenerCount;
    EventEmitter.prototype.eventNames = function eventNames() {
      return this._eventsCount > 0 ? Reflect.ownKeys(this._events) : [];
    };
  }
});

// node-modules-polyfills:process
function defaultSetTimout() {
  throw new Error("setTimeout has not been defined");
}
function defaultClearTimeout() {
  throw new Error("clearTimeout has not been defined");
}
function runTimeout(fun) {
  if (cachedSetTimeout === setTimeout) {
    return setTimeout(fun, 0);
  }
  if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
    cachedSetTimeout = setTimeout;
    return setTimeout(fun, 0);
  }
  try {
    return cachedSetTimeout(fun, 0);
  } catch (e) {
    try {
      return cachedSetTimeout.call(null, fun, 0);
    } catch (e2) {
      return cachedSetTimeout.call(this, fun, 0);
    }
  }
}
function runClearTimeout(marker) {
  if (cachedClearTimeout === clearTimeout) {
    return clearTimeout(marker);
  }
  if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
    cachedClearTimeout = clearTimeout;
    return clearTimeout(marker);
  }
  try {
    return cachedClearTimeout(marker);
  } catch (e) {
    try {
      return cachedClearTimeout.call(null, marker);
    } catch (e2) {
      return cachedClearTimeout.call(this, marker);
    }
  }
}
function cleanUpNextTick() {
  if (!draining || !currentQueue) {
    return;
  }
  draining = false;
  if (currentQueue.length) {
    queue = currentQueue.concat(queue);
  } else {
    queueIndex = -1;
  }
  if (queue.length) {
    drainQueue();
  }
}
function drainQueue() {
  if (draining) {
    return;
  }
  var timeout = runTimeout(cleanUpNextTick);
  draining = true;
  var len = queue.length;
  while (len) {
    currentQueue = queue;
    queue = [];
    while (++queueIndex < len) {
      if (currentQueue) {
        currentQueue[queueIndex].run();
      }
    }
    queueIndex = -1;
    len = queue.length;
  }
  currentQueue = null;
  draining = false;
  runClearTimeout(timeout);
}
function nextTick(fun) {
  var args = new Array(arguments.length - 1);
  if (arguments.length > 1) {
    for (var i = 1; i < arguments.length; i++) {
      args[i - 1] = arguments[i];
    }
  }
  queue.push(new Item(fun, args));
  if (queue.length === 1 && !draining) {
    runTimeout(drainQueue);
  }
}
function Item(fun, array) {
  this.fun = fun;
  this.array = array;
}
function noop() {
}
function binding(name) {
  throw new Error("process.binding is not supported");
}
function cwd() {
  return "/";
}
function chdir(dir) {
  throw new Error("process.chdir is not supported");
}
function umask() {
  return 0;
}
function hrtime(previousTimestamp) {
  var clocktime = performanceNow.call(performance) * 1e-3;
  var seconds = Math.floor(clocktime);
  var nanoseconds = Math.floor(clocktime % 1 * 1e9);
  if (previousTimestamp) {
    seconds = seconds - previousTimestamp[0];
    nanoseconds = nanoseconds - previousTimestamp[1];
    if (nanoseconds < 0) {
      seconds--;
      nanoseconds += 1e9;
    }
  }
  return [seconds, nanoseconds];
}
function uptime() {
  var currentTime = new Date();
  var dif = currentTime - startTime;
  return dif / 1e3;
}
var cachedSetTimeout, cachedClearTimeout, queue, draining, currentQueue, queueIndex, title, platform, browser, env, argv, version, versions, release, config, on, addListener2, once2, off, removeListener2, removeAllListeners2, emit2, performance, performanceNow, startTime, browser$1, process_default;
var init_process = __esm({
  "node-modules-polyfills:process"() {
    cachedSetTimeout = defaultSetTimout;
    cachedClearTimeout = defaultClearTimeout;
    if (typeof globalThis.setTimeout === "function") {
      cachedSetTimeout = setTimeout;
    }
    if (typeof globalThis.clearTimeout === "function") {
      cachedClearTimeout = clearTimeout;
    }
    queue = [];
    draining = false;
    queueIndex = -1;
    Item.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    title = "browser";
    platform = "browser";
    browser = true;
    env = {};
    argv = [];
    version = "";
    versions = {};
    release = {};
    config = {};
    on = noop;
    addListener2 = noop;
    once2 = noop;
    off = noop;
    removeListener2 = noop;
    removeAllListeners2 = noop;
    emit2 = noop;
    performance = globalThis.performance || {};
    performanceNow = performance.now || performance.mozNow || performance.msNow || performance.oNow || performance.webkitNow || function() {
      return new Date().getTime();
    };
    startTime = new Date();
    browser$1 = {
      nextTick,
      title,
      browser,
      env,
      argv,
      version,
      versions,
      on,
      addListener: addListener2,
      once: once2,
      off,
      removeListener: removeListener2,
      removeAllListeners: removeAllListeners2,
      emit: emit2,
      binding,
      cwd,
      chdir,
      umask,
      hrtime,
      platform,
      release,
      config,
      uptime
    };
    process_default = browser$1;
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/inherits.js
var inherits, inherits_default;
var init_inherits = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/inherits.js"() {
    if (typeof Object.create === "function") {
      inherits = function inherits2(ctor, superCtor) {
        ctor.super_ = superCtor;
        ctor.prototype = Object.create(superCtor.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      };
    } else {
      inherits = function inherits2(ctor, superCtor) {
        ctor.super_ = superCtor;
        var TempCtor = function() {
        };
        TempCtor.prototype = superCtor.prototype;
        ctor.prototype = new TempCtor();
        ctor.prototype.constructor = ctor;
      };
    }
    inherits_default = inherits;
  }
});

// node-modules-polyfills:util
var util_exports = {};
__export(util_exports, {
  _extend: () => _extend,
  debuglog: () => debuglog,
  default: () => util_default,
  deprecate: () => deprecate,
  format: () => format,
  inherits: () => inherits_default,
  inspect: () => inspect2,
  isArray: () => isArray2,
  isBoolean: () => isBoolean,
  isBuffer: () => isBuffer2,
  isDate: () => isDate,
  isError: () => isError,
  isFunction: () => isFunction,
  isNull: () => isNull,
  isNullOrUndefined: () => isNullOrUndefined,
  isNumber: () => isNumber,
  isObject: () => isObject,
  isPrimitive: () => isPrimitive,
  isRegExp: () => isRegExp,
  isString: () => isString,
  isSymbol: () => isSymbol,
  isUndefined: () => isUndefined,
  log: () => log
});
function format(f) {
  if (!isString(f)) {
    var objects = [];
    for (var i = 0; i < arguments.length; i++) {
      objects.push(inspect2(arguments[i]));
    }
    return objects.join(" ");
  }
  var i = 1;
  var args = arguments;
  var len = args.length;
  var str = String(f).replace(formatRegExp, function(x2) {
    if (x2 === "%%")
      return "%";
    if (i >= len)
      return x2;
    switch (x2) {
      case "%s":
        return String(args[i++]);
      case "%d":
        return Number(args[i++]);
      case "%j":
        try {
          return JSON.stringify(args[i++]);
        } catch (_) {
          return "[Circular]";
        }
      default:
        return x2;
    }
  });
  for (var x = args[i]; i < len; x = args[++i]) {
    if (isNull(x) || !isObject(x)) {
      str += " " + x;
    } else {
      str += " " + inspect2(x);
    }
  }
  return str;
}
function deprecate(fn, msg) {
  if (isUndefined(globalThis.process)) {
    return function() {
      return deprecate(fn, msg).apply(this, arguments);
    };
  }
  if (process_default.noDeprecation === true) {
    return fn;
  }
  var warned = false;
  function deprecated() {
    if (!warned) {
      if (process_default.throwDeprecation) {
        throw new Error(msg);
      } else if (process_default.traceDeprecation) {
        console.trace(msg);
      } else {
        console.error(msg);
      }
      warned = true;
    }
    return fn.apply(this, arguments);
  }
  return deprecated;
}
function debuglog(set) {
  if (isUndefined(debugEnviron))
    debugEnviron = process_default.env.NODE_DEBUG || "";
  set = set.toUpperCase();
  if (!debugs[set]) {
    if (new RegExp("\\b" + set + "\\b", "i").test(debugEnviron)) {
      var pid = 0;
      debugs[set] = function() {
        var msg = format.apply(null, arguments);
        console.error("%s %d: %s", set, pid, msg);
      };
    } else {
      debugs[set] = function() {
      };
    }
  }
  return debugs[set];
}
function inspect2(obj, opts) {
  var ctx = {
    seen: [],
    stylize: stylizeNoColor
  };
  if (arguments.length >= 3)
    ctx.depth = arguments[2];
  if (arguments.length >= 4)
    ctx.colors = arguments[3];
  if (isBoolean(opts)) {
    ctx.showHidden = opts;
  } else if (opts) {
    _extend(ctx, opts);
  }
  if (isUndefined(ctx.showHidden))
    ctx.showHidden = false;
  if (isUndefined(ctx.depth))
    ctx.depth = 2;
  if (isUndefined(ctx.colors))
    ctx.colors = false;
  if (isUndefined(ctx.customInspect))
    ctx.customInspect = true;
  if (ctx.colors)
    ctx.stylize = stylizeWithColor;
  return formatValue(ctx, obj, ctx.depth);
}
function stylizeWithColor(str, styleType) {
  var style = inspect2.styles[styleType];
  if (style) {
    return "\x1B[" + inspect2.colors[style][0] + "m" + str + "\x1B[" + inspect2.colors[style][1] + "m";
  } else {
    return str;
  }
}
function stylizeNoColor(str, styleType) {
  return str;
}
function arrayToHash(array) {
  var hash = {};
  array.forEach(function(val, idx) {
    hash[val] = true;
  });
  return hash;
}
function formatValue(ctx, value, recurseTimes) {
  if (ctx.customInspect && value && isFunction(value.inspect) && value.inspect !== inspect2 && !(value.constructor && value.constructor.prototype === value)) {
    var ret = value.inspect(recurseTimes, ctx);
    if (!isString(ret)) {
      ret = formatValue(ctx, ret, recurseTimes);
    }
    return ret;
  }
  var primitive = formatPrimitive(ctx, value);
  if (primitive) {
    return primitive;
  }
  var keys2 = Object.keys(value);
  var visibleKeys = arrayToHash(keys2);
  if (ctx.showHidden) {
    keys2 = Object.getOwnPropertyNames(value);
  }
  if (isError(value) && (keys2.indexOf("message") >= 0 || keys2.indexOf("description") >= 0)) {
    return formatError(value);
  }
  if (keys2.length === 0) {
    if (isFunction(value)) {
      var name = value.name ? ": " + value.name : "";
      return ctx.stylize("[Function" + name + "]", "special");
    }
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    }
    if (isDate(value)) {
      return ctx.stylize(Date.prototype.toString.call(value), "date");
    }
    if (isError(value)) {
      return formatError(value);
    }
  }
  var base = "", array = false, braces = ["{", "}"];
  if (isArray2(value)) {
    array = true;
    braces = ["[", "]"];
  }
  if (isFunction(value)) {
    var n = value.name ? ": " + value.name : "";
    base = " [Function" + n + "]";
  }
  if (isRegExp(value)) {
    base = " " + RegExp.prototype.toString.call(value);
  }
  if (isDate(value)) {
    base = " " + Date.prototype.toUTCString.call(value);
  }
  if (isError(value)) {
    base = " " + formatError(value);
  }
  if (keys2.length === 0 && (!array || value.length == 0)) {
    return braces[0] + base + braces[1];
  }
  if (recurseTimes < 0) {
    if (isRegExp(value)) {
      return ctx.stylize(RegExp.prototype.toString.call(value), "regexp");
    } else {
      return ctx.stylize("[Object]", "special");
    }
  }
  ctx.seen.push(value);
  var output;
  if (array) {
    output = formatArray(ctx, value, recurseTimes, visibleKeys, keys2);
  } else {
    output = keys2.map(function(key) {
      return formatProperty(ctx, value, recurseTimes, visibleKeys, key, array);
    });
  }
  ctx.seen.pop();
  return reduceToSingleString(output, base, braces);
}
function formatPrimitive(ctx, value) {
  if (isUndefined(value))
    return ctx.stylize("undefined", "undefined");
  if (isString(value)) {
    var simple = "'" + JSON.stringify(value).replace(/^"|"$/g, "").replace(/'/g, "\\'").replace(/\\"/g, '"') + "'";
    return ctx.stylize(simple, "string");
  }
  if (isNumber(value))
    return ctx.stylize("" + value, "number");
  if (isBoolean(value))
    return ctx.stylize("" + value, "boolean");
  if (isNull(value))
    return ctx.stylize("null", "null");
}
function formatError(value) {
  return "[" + Error.prototype.toString.call(value) + "]";
}
function formatArray(ctx, value, recurseTimes, visibleKeys, keys2) {
  var output = [];
  for (var i = 0, l = value.length; i < l; ++i) {
    if (hasOwnProperty(value, String(i))) {
      output.push(formatProperty(
        ctx,
        value,
        recurseTimes,
        visibleKeys,
        String(i),
        true
      ));
    } else {
      output.push("");
    }
  }
  keys2.forEach(function(key) {
    if (!key.match(/^\d+$/)) {
      output.push(formatProperty(
        ctx,
        value,
        recurseTimes,
        visibleKeys,
        key,
        true
      ));
    }
  });
  return output;
}
function formatProperty(ctx, value, recurseTimes, visibleKeys, key, array) {
  var name, str, desc;
  desc = Object.getOwnPropertyDescriptor(value, key) || { value: value[key] };
  if (desc.get) {
    if (desc.set) {
      str = ctx.stylize("[Getter/Setter]", "special");
    } else {
      str = ctx.stylize("[Getter]", "special");
    }
  } else {
    if (desc.set) {
      str = ctx.stylize("[Setter]", "special");
    }
  }
  if (!hasOwnProperty(visibleKeys, key)) {
    name = "[" + key + "]";
  }
  if (!str) {
    if (ctx.seen.indexOf(desc.value) < 0) {
      if (isNull(recurseTimes)) {
        str = formatValue(ctx, desc.value, null);
      } else {
        str = formatValue(ctx, desc.value, recurseTimes - 1);
      }
      if (str.indexOf("\n") > -1) {
        if (array) {
          str = str.split("\n").map(function(line) {
            return "  " + line;
          }).join("\n").substr(2);
        } else {
          str = "\n" + str.split("\n").map(function(line) {
            return "   " + line;
          }).join("\n");
        }
      }
    } else {
      str = ctx.stylize("[Circular]", "special");
    }
  }
  if (isUndefined(name)) {
    if (array && key.match(/^\d+$/)) {
      return str;
    }
    name = JSON.stringify("" + key);
    if (name.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)) {
      name = name.substr(1, name.length - 2);
      name = ctx.stylize(name, "name");
    } else {
      name = name.replace(/'/g, "\\'").replace(/\\"/g, '"').replace(/(^"|"$)/g, "'");
      name = ctx.stylize(name, "string");
    }
  }
  return name + ": " + str;
}
function reduceToSingleString(output, base, braces) {
  var numLinesEst = 0;
  var length = output.reduce(function(prev, cur) {
    numLinesEst++;
    if (cur.indexOf("\n") >= 0)
      numLinesEst++;
    return prev + cur.replace(/\u001b\[\d\d?m/g, "").length + 1;
  }, 0);
  if (length > 60) {
    return braces[0] + (base === "" ? "" : base + "\n ") + " " + output.join(",\n  ") + " " + braces[1];
  }
  return braces[0] + base + " " + output.join(", ") + " " + braces[1];
}
function isArray2(ar) {
  return Array.isArray(ar);
}
function isBoolean(arg) {
  return typeof arg === "boolean";
}
function isNull(arg) {
  return arg === null;
}
function isNullOrUndefined(arg) {
  return arg == null;
}
function isNumber(arg) {
  return typeof arg === "number";
}
function isString(arg) {
  return typeof arg === "string";
}
function isSymbol(arg) {
  return typeof arg === "symbol";
}
function isUndefined(arg) {
  return arg === void 0;
}
function isRegExp(re) {
  return isObject(re) && objectToString(re) === "[object RegExp]";
}
function isObject(arg) {
  return typeof arg === "object" && arg !== null;
}
function isDate(d) {
  return isObject(d) && objectToString(d) === "[object Date]";
}
function isError(e) {
  return isObject(e) && (objectToString(e) === "[object Error]" || e instanceof Error);
}
function isFunction(arg) {
  return typeof arg === "function";
}
function isPrimitive(arg) {
  return arg === null || typeof arg === "boolean" || typeof arg === "number" || typeof arg === "string" || typeof arg === "symbol" || typeof arg === "undefined";
}
function isBuffer2(maybeBuf) {
  return Buffer.isBuffer(maybeBuf);
}
function objectToString(o) {
  return Object.prototype.toString.call(o);
}
function pad(n) {
  return n < 10 ? "0" + n.toString(10) : n.toString(10);
}
function timestamp() {
  var d = new Date();
  var time = [
    pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())
  ].join(":");
  return [d.getDate(), months[d.getMonth()], time].join(" ");
}
function log() {
  console.log("%s - %s", timestamp(), format.apply(null, arguments));
}
function _extend(origin, add) {
  if (!add || !isObject(add))
    return origin;
  var keys2 = Object.keys(add);
  var i = keys2.length;
  while (i--) {
    origin[keys2[i]] = add[keys2[i]];
  }
  return origin;
}
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
var formatRegExp, debugs, debugEnviron, months, util_default;
var init_util = __esm({
  "node-modules-polyfills:util"() {
    init_process();
    init_inherits();
    formatRegExp = /%[sdj%]/g;
    debugs = {};
    inspect2.colors = {
      "bold": [1, 22],
      "italic": [3, 23],
      "underline": [4, 24],
      "inverse": [7, 27],
      "white": [37, 39],
      "grey": [90, 39],
      "black": [30, 39],
      "blue": [34, 39],
      "cyan": [36, 39],
      "green": [32, 39],
      "magenta": [35, 39],
      "red": [31, 39],
      "yellow": [33, 39]
    };
    inspect2.styles = {
      "special": "cyan",
      "number": "yellow",
      "boolean": "yellow",
      "undefined": "grey",
      "null": "bold",
      "string": "green",
      "date": "magenta",
      "regexp": "red"
    };
    months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec"
    ];
    util_default = {
      inherits: inherits_default,
      _extend,
      log,
      isBuffer: isBuffer2,
      isPrimitive,
      isFunction,
      isError,
      isDate,
      isObject,
      isRegExp,
      isUndefined,
      isSymbol,
      isString,
      isNumber,
      isNullOrUndefined,
      isNull,
      isBoolean,
      isArray: isArray2,
      inspect: inspect2,
      deprecate,
      format,
      debuglog
    };
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/buffer-list.js
function BufferList() {
  this.head = null;
  this.tail = null;
  this.length = 0;
}
var buffer_list_default;
var init_buffer_list = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/buffer-list.js"() {
    init_buffer();
    buffer_list_default = BufferList;
    BufferList.prototype.push = function(v) {
      var entry = { data: v, next: null };
      if (this.length > 0)
        this.tail.next = entry;
      else
        this.head = entry;
      this.tail = entry;
      ++this.length;
    };
    BufferList.prototype.unshift = function(v) {
      var entry = { data: v, next: this.head };
      if (this.length === 0)
        this.tail = entry;
      this.head = entry;
      ++this.length;
    };
    BufferList.prototype.shift = function() {
      if (this.length === 0)
        return;
      var ret = this.head.data;
      if (this.length === 1)
        this.head = this.tail = null;
      else
        this.head = this.head.next;
      --this.length;
      return ret;
    };
    BufferList.prototype.clear = function() {
      this.head = this.tail = null;
      this.length = 0;
    };
    BufferList.prototype.join = function(s) {
      if (this.length === 0)
        return "";
      var p = this.head;
      var ret = "" + p.data;
      while (p = p.next) {
        ret += s + p.data;
      }
      return ret;
    };
    BufferList.prototype.concat = function(n) {
      if (this.length === 0)
        return Buffer2.alloc(0);
      if (this.length === 1)
        return this.head.data;
      var ret = Buffer2.allocUnsafe(n >>> 0);
      var p = this.head;
      var i = 0;
      while (p) {
        p.data.copy(ret, i);
        i += p.data.length;
        p = p.next;
      }
      return ret;
    };
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/readable.js
function prependListener2(emitter, event, fn) {
  if (typeof emitter.prependListener === "function") {
    return emitter.prependListener(event, fn);
  } else {
    if (!emitter._events || !emitter._events[event])
      emitter.on(event, fn);
    else if (Array.isArray(emitter._events[event]))
      emitter._events[event].unshift(fn);
    else
      emitter._events[event] = [fn, emitter._events[event]];
  }
}
function listenerCount2(emitter, type) {
  return emitter.listeners(type).length;
}
function ReadableState(options, stream) {
  options = options || {};
  this.objectMode = !!options.objectMode;
  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.readableObjectMode;
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
  this.highWaterMark = ~~this.highWaterMark;
  this.buffer = new buffer_list_default();
  this.length = 0;
  this.pipes = null;
  this.pipesCount = 0;
  this.flowing = null;
  this.ended = false;
  this.endEmitted = false;
  this.reading = false;
  this.sync = true;
  this.needReadable = false;
  this.emittedReadable = false;
  this.readableListening = false;
  this.resumeScheduled = false;
  this.defaultEncoding = options.defaultEncoding || "utf8";
  this.ranOut = false;
  this.awaitDrain = 0;
  this.readingMore = false;
  this.decoder = null;
  this.encoding = null;
  if (options.encoding) {
    this.decoder = new StringDecoder(options.encoding);
    this.encoding = options.encoding;
  }
}
function Readable(options) {
  if (!(this instanceof Readable))
    return new Readable(options);
  this._readableState = new ReadableState(options, this);
  this.readable = true;
  if (options && typeof options.read === "function")
    this._read = options.read;
  events_default.call(this);
}
function readableAddChunk(stream, state, chunk, encoding, addToFront) {
  var er = chunkInvalid(state, chunk);
  if (er) {
    stream.emit("error", er);
  } else if (chunk === null) {
    state.reading = false;
    onEofChunk(stream, state);
  } else if (state.objectMode || chunk && chunk.length > 0) {
    if (state.ended && !addToFront) {
      var e = new Error("stream.push() after EOF");
      stream.emit("error", e);
    } else if (state.endEmitted && addToFront) {
      var _e = new Error("stream.unshift() after end event");
      stream.emit("error", _e);
    } else {
      var skipAdd;
      if (state.decoder && !addToFront && !encoding) {
        chunk = state.decoder.write(chunk);
        skipAdd = !state.objectMode && chunk.length === 0;
      }
      if (!addToFront)
        state.reading = false;
      if (!skipAdd) {
        if (state.flowing && state.length === 0 && !state.sync) {
          stream.emit("data", chunk);
          stream.read(0);
        } else {
          state.length += state.objectMode ? 1 : chunk.length;
          if (addToFront)
            state.buffer.unshift(chunk);
          else
            state.buffer.push(chunk);
          if (state.needReadable)
            emitReadable(stream);
        }
      }
      maybeReadMore(stream, state);
    }
  } else if (!addToFront) {
    state.reading = false;
  }
  return needMoreData(state);
}
function needMoreData(state) {
  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
}
function computeNewHighWaterMark(n) {
  if (n >= MAX_HWM) {
    n = MAX_HWM;
  } else {
    n--;
    n |= n >>> 1;
    n |= n >>> 2;
    n |= n >>> 4;
    n |= n >>> 8;
    n |= n >>> 16;
    n++;
  }
  return n;
}
function howMuchToRead(n, state) {
  if (n <= 0 || state.length === 0 && state.ended)
    return 0;
  if (state.objectMode)
    return 1;
  if (n !== n) {
    if (state.flowing && state.length)
      return state.buffer.head.data.length;
    else
      return state.length;
  }
  if (n > state.highWaterMark)
    state.highWaterMark = computeNewHighWaterMark(n);
  if (n <= state.length)
    return n;
  if (!state.ended) {
    state.needReadable = true;
    return 0;
  }
  return state.length;
}
function chunkInvalid(state, chunk) {
  var er = null;
  if (!Buffer.isBuffer(chunk) && typeof chunk !== "string" && chunk !== null && chunk !== void 0 && !state.objectMode) {
    er = new TypeError("Invalid non-string/buffer chunk");
  }
  return er;
}
function onEofChunk(stream, state) {
  if (state.ended)
    return;
  if (state.decoder) {
    var chunk = state.decoder.end();
    if (chunk && chunk.length) {
      state.buffer.push(chunk);
      state.length += state.objectMode ? 1 : chunk.length;
    }
  }
  state.ended = true;
  emitReadable(stream);
}
function emitReadable(stream) {
  var state = stream._readableState;
  state.needReadable = false;
  if (!state.emittedReadable) {
    debug("emitReadable", state.flowing);
    state.emittedReadable = true;
    if (state.sync)
      nextTick(emitReadable_, stream);
    else
      emitReadable_(stream);
  }
}
function emitReadable_(stream) {
  debug("emit readable");
  stream.emit("readable");
  flow(stream);
}
function maybeReadMore(stream, state) {
  if (!state.readingMore) {
    state.readingMore = true;
    nextTick(maybeReadMore_, stream, state);
  }
}
function maybeReadMore_(stream, state) {
  var len = state.length;
  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
    debug("maybeReadMore read 0");
    stream.read(0);
    if (len === state.length)
      break;
    else
      len = state.length;
  }
  state.readingMore = false;
}
function pipeOnDrain(src) {
  return function() {
    var state = src._readableState;
    debug("pipeOnDrain", state.awaitDrain);
    if (state.awaitDrain)
      state.awaitDrain--;
    if (state.awaitDrain === 0 && src.listeners("data").length) {
      state.flowing = true;
      flow(src);
    }
  };
}
function nReadingNextTick(self2) {
  debug("readable nexttick read 0");
  self2.read(0);
}
function resume(stream, state) {
  if (!state.resumeScheduled) {
    state.resumeScheduled = true;
    nextTick(resume_, stream, state);
  }
}
function resume_(stream, state) {
  if (!state.reading) {
    debug("resume read 0");
    stream.read(0);
  }
  state.resumeScheduled = false;
  state.awaitDrain = 0;
  stream.emit("resume");
  flow(stream);
  if (state.flowing && !state.reading)
    stream.read(0);
}
function flow(stream) {
  var state = stream._readableState;
  debug("flow", state.flowing);
  while (state.flowing && stream.read() !== null) {
  }
}
function fromList(n, state) {
  if (state.length === 0)
    return null;
  var ret;
  if (state.objectMode)
    ret = state.buffer.shift();
  else if (!n || n >= state.length) {
    if (state.decoder)
      ret = state.buffer.join("");
    else if (state.buffer.length === 1)
      ret = state.buffer.head.data;
    else
      ret = state.buffer.concat(state.length);
    state.buffer.clear();
  } else {
    ret = fromListPartial(n, state.buffer, state.decoder);
  }
  return ret;
}
function fromListPartial(n, list, hasStrings) {
  var ret;
  if (n < list.head.data.length) {
    ret = list.head.data.slice(0, n);
    list.head.data = list.head.data.slice(n);
  } else if (n === list.head.data.length) {
    ret = list.shift();
  } else {
    ret = hasStrings ? copyFromBufferString(n, list) : copyFromBuffer(n, list);
  }
  return ret;
}
function copyFromBufferString(n, list) {
  var p = list.head;
  var c = 1;
  var ret = p.data;
  n -= ret.length;
  while (p = p.next) {
    var str = p.data;
    var nb = n > str.length ? str.length : n;
    if (nb === str.length)
      ret += str;
    else
      ret += str.slice(0, n);
    n -= nb;
    if (n === 0) {
      if (nb === str.length) {
        ++c;
        if (p.next)
          list.head = p.next;
        else
          list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = str.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}
function copyFromBuffer(n, list) {
  var ret = Buffer.allocUnsafe(n);
  var p = list.head;
  var c = 1;
  p.data.copy(ret);
  n -= p.data.length;
  while (p = p.next) {
    var buf = p.data;
    var nb = n > buf.length ? buf.length : n;
    buf.copy(ret, ret.length - n, 0, nb);
    n -= nb;
    if (n === 0) {
      if (nb === buf.length) {
        ++c;
        if (p.next)
          list.head = p.next;
        else
          list.head = list.tail = null;
      } else {
        list.head = p;
        p.data = buf.slice(nb);
      }
      break;
    }
    ++c;
  }
  list.length -= c;
  return ret;
}
function endReadable(stream) {
  var state = stream._readableState;
  if (state.length > 0)
    throw new Error('"endReadable()" called on non-empty stream');
  if (!state.endEmitted) {
    state.ended = true;
    nextTick(endReadableNT, state, stream);
  }
}
function endReadableNT(state, stream) {
  if (!state.endEmitted && state.length === 0) {
    state.endEmitted = true;
    stream.readable = false;
    stream.emit("end");
  }
}
function forEach(xs, f) {
  for (var i = 0, l = xs.length; i < l; i++) {
    f(xs[i], i);
  }
}
function indexOf2(xs, x) {
  for (var i = 0, l = xs.length; i < l; i++) {
    if (xs[i] === x)
      return i;
  }
  return -1;
}
var debug, MAX_HWM;
var init_readable = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/readable.js"() {
    "use strict";
    init_events();
    init_util();
    init_buffer_list();
    init_string_decoder();
    init_duplex();
    init_process();
    Readable.ReadableState = ReadableState;
    debug = debuglog("stream");
    inherits_default(Readable, events_default);
    Readable.prototype.push = function(chunk, encoding) {
      var state = this._readableState;
      if (!state.objectMode && typeof chunk === "string") {
        encoding = encoding || state.defaultEncoding;
        if (encoding !== state.encoding) {
          chunk = Buffer.from(chunk, encoding);
          encoding = "";
        }
      }
      return readableAddChunk(this, state, chunk, encoding, false);
    };
    Readable.prototype.unshift = function(chunk) {
      var state = this._readableState;
      return readableAddChunk(this, state, chunk, "", true);
    };
    Readable.prototype.isPaused = function() {
      return this._readableState.flowing === false;
    };
    Readable.prototype.setEncoding = function(enc) {
      this._readableState.decoder = new StringDecoder(enc);
      this._readableState.encoding = enc;
      return this;
    };
    MAX_HWM = 8388608;
    Readable.prototype.read = function(n) {
      debug("read", n);
      n = parseInt(n, 10);
      var state = this._readableState;
      var nOrig = n;
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
        debug("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable(this);
        else
          emitReadable(this);
        return null;
      }
      n = howMuchToRead(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable(this);
        return null;
      }
      var doRead = state.needReadable;
      debug("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug("length less than watermark", doRead);
      }
      if (state.ended || state.reading) {
        doRead = false;
        debug("reading or ended", doRead);
      } else if (doRead) {
        debug("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        this._read(state.highWaterMark);
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead(nOrig, state);
      }
      var ret;
      if (n > 0)
        ret = fromList(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = true;
        n = 0;
      } else {
        state.length -= n;
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable(this);
      }
      if (ret !== null)
        this.emit("data", ret);
      return ret;
    };
    Readable.prototype._read = function(n) {
      this.emit("error", new Error("not implemented"));
    };
    Readable.prototype.pipe = function(dest, pipeOpts) {
      var src = this;
      var state = this._readableState;
      switch (state.pipesCount) {
        case 0:
          state.pipes = dest;
          break;
        case 1:
          state.pipes = [state.pipes, dest];
          break;
        default:
          state.pipes.push(dest);
          break;
      }
      state.pipesCount += 1;
      debug("pipe count=%d opts=%j", state.pipesCount, pipeOpts);
      var doEnd = !pipeOpts || pipeOpts.end !== false;
      var endFn = doEnd ? onend2 : cleanup;
      if (state.endEmitted)
        nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable) {
        debug("onunpipe");
        if (readable === src) {
          cleanup();
        }
      }
      function onend2() {
        debug("onend");
        dest.end();
      }
      var ondrain = pipeOnDrain(src);
      dest.on("drain", ondrain);
      var cleanedUp = false;
      function cleanup() {
        debug("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        dest.removeListener("drain", ondrain);
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend2);
        src.removeListener("end", cleanup);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      var increasedAwaitDrain = false;
      src.on("data", ondata);
      function ondata(chunk) {
        debug("ondata");
        increasedAwaitDrain = false;
        var ret = dest.write(chunk);
        if (false === ret && !increasedAwaitDrain) {
          if ((state.pipesCount === 1 && state.pipes === dest || state.pipesCount > 1 && indexOf2(state.pipes, dest) !== -1) && !cleanedUp) {
            debug("false write response, pause", src._readableState.awaitDrain);
            src._readableState.awaitDrain++;
            increasedAwaitDrain = true;
          }
          src.pause();
        }
      }
      function onerror(er) {
        debug("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (listenerCount2(dest, "error") === 0)
          dest.emit("error", er);
      }
      prependListener2(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (!state.flowing) {
        debug("pipe resume");
        src.resume();
      }
      return dest;
    };
    Readable.prototype.unpipe = function(dest) {
      var state = this._readableState;
      if (state.pipesCount === 0)
        return this;
      if (state.pipesCount === 1) {
        if (dest && dest !== state.pipes)
          return this;
        if (!dest)
          dest = state.pipes;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        if (dest)
          dest.emit("unpipe", this);
        return this;
      }
      if (!dest) {
        var dests = state.pipes;
        var len = state.pipesCount;
        state.pipes = null;
        state.pipesCount = 0;
        state.flowing = false;
        for (var _i = 0; _i < len; _i++) {
          dests[_i].emit("unpipe", this);
        }
        return this;
      }
      var i = indexOf2(state.pipes, dest);
      if (i === -1)
        return this;
      state.pipes.splice(i, 1);
      state.pipesCount -= 1;
      if (state.pipesCount === 1)
        state.pipes = state.pipes[0];
      dest.emit("unpipe", this);
      return this;
    };
    Readable.prototype.on = function(ev, fn) {
      var res = events_default.prototype.on.call(this, ev, fn);
      if (ev === "data") {
        if (this._readableState.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        var state = this._readableState;
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.emittedReadable = false;
          if (!state.reading) {
            nextTick(nReadingNextTick, this);
          } else if (state.length) {
            emitReadable(this, state);
          }
        }
      }
      return res;
    };
    Readable.prototype.addListener = Readable.prototype.on;
    Readable.prototype.resume = function() {
      var state = this._readableState;
      if (!state.flowing) {
        debug("resume");
        state.flowing = true;
        resume(this, state);
      }
      return this;
    };
    Readable.prototype.pause = function() {
      debug("call pause flowing=%j", this._readableState.flowing);
      if (false !== this._readableState.flowing) {
        debug("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      return this;
    };
    Readable.prototype.wrap = function(stream) {
      var state = this._readableState;
      var paused = false;
      var self2 = this;
      stream.on("end", function() {
        debug("wrapped end");
        if (state.decoder && !state.ended) {
          var chunk = state.decoder.end();
          if (chunk && chunk.length)
            self2.push(chunk);
        }
        self2.push(null);
      });
      stream.on("data", function(chunk) {
        debug("wrapped data");
        if (state.decoder)
          chunk = state.decoder.write(chunk);
        if (state.objectMode && (chunk === null || chunk === void 0))
          return;
        else if (!state.objectMode && (!chunk || !chunk.length))
          return;
        var ret = self2.push(chunk);
        if (!ret) {
          paused = true;
          stream.pause();
        }
      });
      for (var i in stream) {
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = function(method) {
            return function() {
              return stream[method].apply(stream, arguments);
            };
          }(i);
        }
      }
      var events = ["error", "close", "destroy", "pause", "resume"];
      forEach(events, function(ev) {
        stream.on(ev, self2.emit.bind(self2, ev));
      });
      self2._read = function(n) {
        debug("wrapped _read", n);
        if (paused) {
          paused = false;
          stream.resume();
        }
      };
      return self2;
    };
    Readable._fromList = fromList;
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/writable.js
function nop() {
}
function WriteReq(chunk, encoding, cb) {
  this.chunk = chunk;
  this.encoding = encoding;
  this.callback = cb;
  this.next = null;
}
function WritableState(options, stream) {
  Object.defineProperty(this, "buffer", {
    get: deprecate(function() {
      return this.getBuffer();
    }, "_writableState.buffer is deprecated. Use _writableState.getBuffer instead.")
  });
  options = options || {};
  this.objectMode = !!options.objectMode;
  if (stream instanceof Duplex)
    this.objectMode = this.objectMode || !!options.writableObjectMode;
  var hwm = options.highWaterMark;
  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
  this.highWaterMark = ~~this.highWaterMark;
  this.needDrain = false;
  this.ending = false;
  this.ended = false;
  this.finished = false;
  var noDecode = options.decodeStrings === false;
  this.decodeStrings = !noDecode;
  this.defaultEncoding = options.defaultEncoding || "utf8";
  this.length = 0;
  this.writing = false;
  this.corked = 0;
  this.sync = true;
  this.bufferProcessing = false;
  this.onwrite = function(er) {
    onwrite(stream, er);
  };
  this.writecb = null;
  this.writelen = 0;
  this.bufferedRequest = null;
  this.lastBufferedRequest = null;
  this.pendingcb = 0;
  this.prefinished = false;
  this.errorEmitted = false;
  this.bufferedRequestCount = 0;
  this.corkedRequestsFree = new CorkedRequest(this);
}
function Writable(options) {
  if (!(this instanceof Writable) && !(this instanceof Duplex))
    return new Writable(options);
  this._writableState = new WritableState(options, this);
  this.writable = true;
  if (options) {
    if (typeof options.write === "function")
      this._write = options.write;
    if (typeof options.writev === "function")
      this._writev = options.writev;
  }
  EventEmitter.call(this);
}
function writeAfterEnd(stream, cb) {
  var er = new Error("write after end");
  stream.emit("error", er);
  nextTick(cb, er);
}
function validChunk(stream, state, chunk, cb) {
  var valid = true;
  var er = false;
  if (chunk === null) {
    er = new TypeError("May not write null values to stream");
  } else if (!Buffer2.isBuffer(chunk) && typeof chunk !== "string" && chunk !== void 0 && !state.objectMode) {
    er = new TypeError("Invalid non-string/buffer chunk");
  }
  if (er) {
    stream.emit("error", er);
    nextTick(cb, er);
    valid = false;
  }
  return valid;
}
function decodeChunk(state, chunk, encoding) {
  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === "string") {
    chunk = Buffer2.from(chunk, encoding);
  }
  return chunk;
}
function writeOrBuffer(stream, state, chunk, encoding, cb) {
  chunk = decodeChunk(state, chunk, encoding);
  if (Buffer2.isBuffer(chunk))
    encoding = "buffer";
  var len = state.objectMode ? 1 : chunk.length;
  state.length += len;
  var ret = state.length < state.highWaterMark;
  if (!ret)
    state.needDrain = true;
  if (state.writing || state.corked) {
    var last = state.lastBufferedRequest;
    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
    if (last) {
      last.next = state.lastBufferedRequest;
    } else {
      state.bufferedRequest = state.lastBufferedRequest;
    }
    state.bufferedRequestCount += 1;
  } else {
    doWrite(stream, state, false, len, chunk, encoding, cb);
  }
  return ret;
}
function doWrite(stream, state, writev, len, chunk, encoding, cb) {
  state.writelen = len;
  state.writecb = cb;
  state.writing = true;
  state.sync = true;
  if (writev)
    stream._writev(chunk, state.onwrite);
  else
    stream._write(chunk, encoding, state.onwrite);
  state.sync = false;
}
function onwriteError(stream, state, sync, er, cb) {
  --state.pendingcb;
  if (sync)
    nextTick(cb, er);
  else
    cb(er);
  stream._writableState.errorEmitted = true;
  stream.emit("error", er);
}
function onwriteStateUpdate(state) {
  state.writing = false;
  state.writecb = null;
  state.length -= state.writelen;
  state.writelen = 0;
}
function onwrite(stream, er) {
  var state = stream._writableState;
  var sync = state.sync;
  var cb = state.writecb;
  onwriteStateUpdate(state);
  if (er)
    onwriteError(stream, state, sync, er, cb);
  else {
    var finished = needFinish(state);
    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
      clearBuffer(stream, state);
    }
    if (sync) {
      nextTick(afterWrite, stream, state, finished, cb);
    } else {
      afterWrite(stream, state, finished, cb);
    }
  }
}
function afterWrite(stream, state, finished, cb) {
  if (!finished)
    onwriteDrain(stream, state);
  state.pendingcb--;
  cb();
  finishMaybe(stream, state);
}
function onwriteDrain(stream, state) {
  if (state.length === 0 && state.needDrain) {
    state.needDrain = false;
    stream.emit("drain");
  }
}
function clearBuffer(stream, state) {
  state.bufferProcessing = true;
  var entry = state.bufferedRequest;
  if (stream._writev && entry && entry.next) {
    var l = state.bufferedRequestCount;
    var buffer = new Array(l);
    var holder = state.corkedRequestsFree;
    holder.entry = entry;
    var count = 0;
    while (entry) {
      buffer[count] = entry;
      entry = entry.next;
      count += 1;
    }
    doWrite(stream, state, true, state.length, buffer, "", holder.finish);
    state.pendingcb++;
    state.lastBufferedRequest = null;
    if (holder.next) {
      state.corkedRequestsFree = holder.next;
      holder.next = null;
    } else {
      state.corkedRequestsFree = new CorkedRequest(state);
    }
  } else {
    while (entry) {
      var chunk = entry.chunk;
      var encoding = entry.encoding;
      var cb = entry.callback;
      var len = state.objectMode ? 1 : chunk.length;
      doWrite(stream, state, false, len, chunk, encoding, cb);
      entry = entry.next;
      if (state.writing) {
        break;
      }
    }
    if (entry === null)
      state.lastBufferedRequest = null;
  }
  state.bufferedRequestCount = 0;
  state.bufferedRequest = entry;
  state.bufferProcessing = false;
}
function needFinish(state) {
  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
}
function prefinish(stream, state) {
  if (!state.prefinished) {
    state.prefinished = true;
    stream.emit("prefinish");
  }
}
function finishMaybe(stream, state) {
  var need = needFinish(state);
  if (need) {
    if (state.pendingcb === 0) {
      prefinish(stream, state);
      state.finished = true;
      stream.emit("finish");
    } else {
      prefinish(stream, state);
    }
  }
  return need;
}
function endWritable(stream, state, cb) {
  state.ending = true;
  finishMaybe(stream, state);
  if (cb) {
    if (state.finished)
      nextTick(cb);
    else
      stream.once("finish", cb);
  }
  state.ended = true;
  stream.writable = false;
}
function CorkedRequest(state) {
  var _this = this;
  this.next = null;
  this.entry = null;
  this.finish = function(err) {
    var entry = _this.entry;
    _this.entry = null;
    while (entry) {
      var cb = entry.callback;
      state.pendingcb--;
      cb(err);
      entry = entry.next;
    }
    if (state.corkedRequestsFree) {
      state.corkedRequestsFree.next = _this;
    } else {
      state.corkedRequestsFree = _this;
    }
  };
}
var init_writable = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/writable.js"() {
    init_util();
    init_buffer();
    init_events();
    init_duplex();
    init_process();
    Writable.WritableState = WritableState;
    inherits_default(Writable, EventEmitter);
    WritableState.prototype.getBuffer = function writableStateGetBuffer() {
      var current = this.bufferedRequest;
      var out = [];
      while (current) {
        out.push(current);
        current = current.next;
      }
      return out;
    };
    Writable.prototype.pipe = function() {
      this.emit("error", new Error("Cannot pipe, not readable"));
    };
    Writable.prototype.write = function(chunk, encoding, cb) {
      var state = this._writableState;
      var ret = false;
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (Buffer2.isBuffer(chunk))
        encoding = "buffer";
      else if (!encoding)
        encoding = state.defaultEncoding;
      if (typeof cb !== "function")
        cb = nop;
      if (state.ended)
        writeAfterEnd(this, cb);
      else if (validChunk(this, state, chunk, cb)) {
        state.pendingcb++;
        ret = writeOrBuffer(this, state, chunk, encoding, cb);
      }
      return ret;
    };
    Writable.prototype.cork = function() {
      var state = this._writableState;
      state.corked++;
    };
    Writable.prototype.uncork = function() {
      var state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest)
          clearBuffer(this, state);
      }
    };
    Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
      if (typeof encoding === "string")
        encoding = encoding.toLowerCase();
      if (!(["hex", "utf8", "utf-8", "ascii", "binary", "base64", "ucs2", "ucs-2", "utf16le", "utf-16le", "raw"].indexOf((encoding + "").toLowerCase()) > -1))
        throw new TypeError("Unknown encoding: " + encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    Writable.prototype._write = function(chunk, encoding, cb) {
      cb(new Error("not implemented"));
    };
    Writable.prototype._writev = null;
    Writable.prototype.end = function(chunk, encoding, cb) {
      var state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      if (chunk !== null && chunk !== void 0)
        this.write(chunk, encoding);
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (!state.ending && !state.finished)
        endWritable(this, state, cb);
    };
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/duplex.js
function Duplex(options) {
  if (!(this instanceof Duplex))
    return new Duplex(options);
  Readable.call(this, options);
  Writable.call(this, options);
  if (options && options.readable === false)
    this.readable = false;
  if (options && options.writable === false)
    this.writable = false;
  this.allowHalfOpen = true;
  if (options && options.allowHalfOpen === false)
    this.allowHalfOpen = false;
  this.once("end", onend);
}
function onend() {
  if (this.allowHalfOpen || this._writableState.ended)
    return;
  nextTick(onEndNT, this);
}
function onEndNT(self2) {
  self2.end();
}
var keys, method, v;
var init_duplex = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/duplex.js"() {
    init_util();
    init_process();
    init_readable();
    init_writable();
    inherits_default(Duplex, Readable);
    keys = Object.keys(Writable.prototype);
    for (v = 0; v < keys.length; v++) {
      method = keys[v];
      if (!Duplex.prototype[method])
        Duplex.prototype[method] = Writable.prototype[method];
    }
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/transform.js
function TransformState(stream) {
  this.afterTransform = function(er, data) {
    return afterTransform(stream, er, data);
  };
  this.needTransform = false;
  this.transforming = false;
  this.writecb = null;
  this.writechunk = null;
  this.writeencoding = null;
}
function afterTransform(stream, er, data) {
  var ts = stream._transformState;
  ts.transforming = false;
  var cb = ts.writecb;
  if (!cb)
    return stream.emit("error", new Error("no writecb in Transform class"));
  ts.writechunk = null;
  ts.writecb = null;
  if (data !== null && data !== void 0)
    stream.push(data);
  cb(er);
  var rs = stream._readableState;
  rs.reading = false;
  if (rs.needReadable || rs.length < rs.highWaterMark) {
    stream._read(rs.highWaterMark);
  }
}
function Transform(options) {
  if (!(this instanceof Transform))
    return new Transform(options);
  Duplex.call(this, options);
  this._transformState = new TransformState(this);
  var stream = this;
  this._readableState.needReadable = true;
  this._readableState.sync = false;
  if (options) {
    if (typeof options.transform === "function")
      this._transform = options.transform;
    if (typeof options.flush === "function")
      this._flush = options.flush;
  }
  this.once("prefinish", function() {
    if (typeof this._flush === "function")
      this._flush(function(er) {
        done(stream, er);
      });
    else
      done(stream);
  });
}
function done(stream, er) {
  if (er)
    return stream.emit("error", er);
  var ws = stream._writableState;
  var ts = stream._transformState;
  if (ws.length)
    throw new Error("Calling transform done when ws.length != 0");
  if (ts.transforming)
    throw new Error("Calling transform done when still transforming");
  return stream.push(null);
}
var init_transform = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/transform.js"() {
    init_duplex();
    init_util();
    inherits_default(Transform, Duplex);
    Transform.prototype.push = function(chunk, encoding) {
      this._transformState.needTransform = false;
      return Duplex.prototype.push.call(this, chunk, encoding);
    };
    Transform.prototype._transform = function(chunk, encoding, cb) {
      throw new Error("Not implemented");
    };
    Transform.prototype._write = function(chunk, encoding, cb) {
      var ts = this._transformState;
      ts.writecb = cb;
      ts.writechunk = chunk;
      ts.writeencoding = encoding;
      if (!ts.transforming) {
        var rs = this._readableState;
        if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark)
          this._read(rs.highWaterMark);
      }
    };
    Transform.prototype._read = function(n) {
      var ts = this._transformState;
      if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
        ts.transforming = true;
        this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
      } else {
        ts.needTransform = true;
      }
    };
  }
});

// node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough.js
function PassThrough(options) {
  if (!(this instanceof PassThrough))
    return new PassThrough(options);
  Transform.call(this, options);
}
var init_passthrough = __esm({
  "node_modules/rollup-plugin-node-polyfills/polyfills/readable-stream/passthrough.js"() {
    init_transform();
    init_util();
    inherits_default(PassThrough, Transform);
    PassThrough.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node-modules-polyfills:stream
var stream_exports = {};
__export(stream_exports, {
  Duplex: () => Duplex,
  PassThrough: () => PassThrough,
  Readable: () => Readable,
  Stream: () => Stream,
  Transform: () => Transform,
  Writable: () => Writable,
  default: () => stream_default
});
function Stream() {
  events_default.call(this);
}
var stream_default;
var init_stream = __esm({
  "node-modules-polyfills:stream"() {
    init_events();
    init_util();
    init_duplex();
    init_readable();
    init_writable();
    init_transform();
    init_passthrough();
    inherits_default(Stream, events_default);
    Stream.Readable = Readable;
    Stream.Writable = Writable;
    Stream.Duplex = Duplex;
    Stream.Transform = Transform;
    Stream.PassThrough = PassThrough;
    Stream.Stream = Stream;
    stream_default = Stream;
    Stream.prototype.pipe = function(dest, options) {
      var source = this;
      function ondata(chunk) {
        if (dest.writable) {
          if (false === dest.write(chunk) && source.pause) {
            source.pause();
          }
        }
      }
      source.on("data", ondata);
      function ondrain() {
        if (source.readable && source.resume) {
          source.resume();
        }
      }
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || options.end !== false)) {
        source.on("end", onend2);
        source.on("close", onclose);
      }
      var didOnEnd = false;
      function onend2() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        dest.end();
      }
      function onclose() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        if (typeof dest.destroy === "function")
          dest.destroy();
      }
      function onerror(er) {
        cleanup();
        if (events_default.listenerCount(this, "error") === 0) {
          throw er;
        }
      }
      source.on("error", onerror);
      dest.on("error", onerror);
      function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend2);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
      }
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
  }
});

// node-modules-polyfills-commonjs:stream
var require_stream = __commonJS({
  "node-modules-polyfills-commonjs:stream"(exports, module) {
    var polyfill = (init_stream(), __toCommonJS(stream_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// node_modules/iconv-lite/lib/index.js
var require_lib = __commonJS({
  "node_modules/iconv-lite/lib/index.js"(exports, module) {
    "use strict";
    var Buffer3 = require_safer().Buffer;
    var bomHandling = require_bom_handling();
    var iconv = module.exports;
    iconv.encodings = null;
    iconv.defaultCharUnicode = "\uFFFD";
    iconv.defaultCharSingleByte = "?";
    iconv.encode = function encode(str, encoding, options) {
      str = "" + (str || "");
      var encoder = iconv.getEncoder(encoding, options);
      var res = encoder.write(str);
      var trail = encoder.end();
      return trail && trail.length > 0 ? Buffer3.concat([res, trail]) : res;
    };
    iconv.decode = function decode(buf, encoding, options) {
      if (typeof buf === "string") {
        if (!iconv.skipDecodeWarning) {
          console.error("Iconv-lite warning: decode()-ing strings is deprecated. Refer to https://github.com/ashtuchkin/iconv-lite/wiki/Use-Buffers-when-decoding");
          iconv.skipDecodeWarning = true;
        }
        buf = Buffer3.from("" + (buf || ""), "binary");
      }
      var decoder = iconv.getDecoder(encoding, options);
      var res = decoder.write(buf);
      var trail = decoder.end();
      return trail ? res + trail : res;
    };
    iconv.encodingExists = function encodingExists(enc) {
      try {
        iconv.getCodec(enc);
        return true;
      } catch (e) {
        return false;
      }
    };
    iconv.toEncoding = iconv.encode;
    iconv.fromEncoding = iconv.decode;
    iconv._codecDataCache = {};
    iconv.getCodec = function getCodec(encoding) {
      if (!iconv.encodings)
        iconv.encodings = require_encodings();
      var enc = iconv._canonicalizeEncoding(encoding);
      var codecOptions = {};
      while (true) {
        var codec = iconv._codecDataCache[enc];
        if (codec)
          return codec;
        var codecDef = iconv.encodings[enc];
        switch (typeof codecDef) {
          case "string":
            enc = codecDef;
            break;
          case "object":
            for (var key in codecDef)
              codecOptions[key] = codecDef[key];
            if (!codecOptions.encodingName)
              codecOptions.encodingName = enc;
            enc = codecDef.type;
            break;
          case "function":
            if (!codecOptions.encodingName)
              codecOptions.encodingName = enc;
            codec = new codecDef(codecOptions, iconv);
            iconv._codecDataCache[codecOptions.encodingName] = codec;
            return codec;
          default:
            throw new Error("Encoding not recognized: '" + encoding + "' (searched as: '" + enc + "')");
        }
      }
    };
    iconv._canonicalizeEncoding = function(encoding) {
      return ("" + encoding).toLowerCase().replace(/:\d{4}$|[^0-9a-z]/g, "");
    };
    iconv.getEncoder = function getEncoder(encoding, options) {
      var codec = iconv.getCodec(encoding), encoder = new codec.encoder(options, codec);
      if (codec.bomAware && options && options.addBOM)
        encoder = new bomHandling.PrependBOM(encoder, options);
      return encoder;
    };
    iconv.getDecoder = function getDecoder(encoding, options) {
      var codec = iconv.getCodec(encoding), decoder = new codec.decoder(options, codec);
      if (codec.bomAware && !(options && options.stripBOM === false))
        decoder = new bomHandling.StripBOM(decoder, options);
      return decoder;
    };
    iconv.enableStreamingAPI = function enableStreamingAPI(stream_module2) {
      if (iconv.supportsStreams)
        return;
      var streams = require_streams()(stream_module2);
      iconv.IconvLiteEncoderStream = streams.IconvLiteEncoderStream;
      iconv.IconvLiteDecoderStream = streams.IconvLiteDecoderStream;
      iconv.encodeStream = function encodeStream(encoding, options) {
        return new iconv.IconvLiteEncoderStream(iconv.getEncoder(encoding, options), options);
      };
      iconv.decodeStream = function decodeStream(encoding, options) {
        return new iconv.IconvLiteDecoderStream(iconv.getDecoder(encoding, options), options);
      };
      iconv.supportsStreams = true;
    };
    var stream_module;
    try {
      stream_module = require_stream();
    } catch (e) {
    }
    if (stream_module && stream_module.Transform) {
      iconv.enableStreamingAPI(stream_module);
    } else {
      iconv.encodeStream = iconv.decodeStream = function() {
        throw new Error("iconv-lite Streaming API is not enabled. Use iconv.enableStreamingAPI(require('stream')); to enable it.");
      };
    }
    if (false) {
      console.error("iconv-lite warning: js files use non-utf8 encoding. See https://github.com/ashtuchkin/iconv-lite/wiki/Javascript-source-file-encodings for more info.");
    }
  }
});

// node_modules/encoding/lib/encoding.js
var require_encoding = __commonJS({
  "node_modules/encoding/lib/encoding.js"(exports, module) {
    "use strict";
    var iconvLite = require_lib();
    module.exports.convert = convert;
    function convert(str, to, from2) {
      from2 = checkEncoding(from2 || "UTF-8");
      to = checkEncoding(to || "UTF-8");
      str = str || "";
      var result;
      if (from2 !== "UTF-8" && typeof str === "string") {
        str = Buffer.from(str, "binary");
      }
      if (from2 === to) {
        if (typeof str === "string") {
          result = Buffer.from(str);
        } else {
          result = str;
        }
      } else {
        try {
          result = convertIconvLite(str, to, from2);
        } catch (E) {
          console.error(E);
          result = str;
        }
      }
      if (typeof result === "string") {
        result = Buffer.from(result, "utf-8");
      }
      return result;
    }
    function convertIconvLite(str, to, from2) {
      if (to === "UTF-8") {
        return iconvLite.decode(str, from2);
      } else if (from2 === "UTF-8") {
        return iconvLite.encode(str, to);
      } else {
        return iconvLite.encode(iconvLite.decode(str, from2), to);
      }
    }
    function checkEncoding(name) {
      return (name || "").toString().trim().replace(/^latin[\-_]?(\d+)$/i, "ISO-8859-$1").replace(/^win(?:dows)?[\-_]?(\d+)$/i, "WINDOWS-$1").replace(/^utf[\-_]?(\d+)$/i, "UTF-$1").replace(/^ks_c_5601\-1987$/i, "CP949").replace(/^us[\-_]?ascii$/i, "ASCII").toUpperCase();
    }
  }
});

// node_modules/gettext-parser/lib/shared.js
var require_shared = __commonJS({
  "node_modules/gettext-parser/lib/shared.js"(exports, module) {
    module.exports.parseHeader = parseHeader;
    module.exports.generateHeader = generateHeader;
    module.exports.formatCharset = formatCharset;
    module.exports.foldLine = foldLine;
    module.exports.compareMsgid = compareMsgid;
    var HEADERS = /* @__PURE__ */ new Map([
      ["project-id-version", "Project-Id-Version"],
      ["report-msgid-bugs-to", "Report-Msgid-Bugs-To"],
      ["pot-creation-date", "POT-Creation-Date"],
      ["po-revision-date", "PO-Revision-Date"],
      ["last-translator", "Last-Translator"],
      ["language-team", "Language-Team"],
      ["language", "Language"],
      ["content-type", "Content-Type"],
      ["content-transfer-encoding", "Content-Transfer-Encoding"],
      ["plural-forms", "Plural-Forms"]
    ]);
    module.exports.HEADERS = HEADERS;
    function parseHeader(str = "") {
      return str.split("\n").reduce((headers, line) => {
        const parts = line.split(":");
        let key = (parts.shift() || "").trim();
        if (key) {
          const value = parts.join(":").trim();
          key = HEADERS.get(key.toLowerCase()) || key;
          headers[key] = value;
        }
        return headers;
      }, {});
    }
    function generateHeader(header = {}) {
      const keys2 = Object.keys(header).filter((key) => !!key);
      if (!keys2.length) {
        return "";
      }
      return keys2.map(
        (key) => `${key}: ${(header[key] || "").trim()}`
      ).join("\n") + "\n";
    }
    function formatCharset(charset = "iso-8859-1", defaultCharset = "iso-8859-1") {
      return charset.toString().toLowerCase().replace(/^utf[-_]?(\d+)$/, "utf-$1").replace(/^win(?:dows)?[-_]?(\d+)$/, "windows-$1").replace(/^latin[-_]?(\d+)$/, "iso-8859-$1").replace(/^(us[-_]?)?ascii$/, "ascii").replace(/^charset$/, defaultCharset).trim();
    }
    function foldLine(str, maxLen = 76) {
      const lines = [];
      const len = str.length;
      let curLine = "";
      let pos = 0;
      let match;
      while (pos < len) {
        curLine = str.substr(pos, maxLen);
        while (curLine.substr(-1) === "\\" && pos + curLine.length < len) {
          curLine += str.charAt(pos + curLine.length);
        }
        if (match = /.*?\\n/.exec(curLine)) {
          curLine = match[0];
        } else if (pos + curLine.length < len) {
          if ((match = /.*\s+/.exec(curLine)) && /[^\s]/.test(match[0])) {
            curLine = match[0];
          } else if ((match = /.*[\x21-\x2f0-9\x5b-\x60\x7b-\x7e]+/.exec(curLine)) && /[^\x21-\x2f0-9\x5b-\x60\x7b-\x7e]/.test(match[0])) {
            curLine = match[0];
          }
        }
        lines.push(curLine);
        pos += curLine.length;
      }
      return lines;
    }
    function compareMsgid({ msgid: left }, { msgid: right }) {
      if (left < right) {
        return -1;
      }
      if (left > right) {
        return 1;
      }
      return 0;
    }
  }
});

// node_modules/readable-stream/lib/ours/primordials.js
var require_primordials = __commonJS({
  "node_modules/readable-stream/lib/ours/primordials.js"(exports, module) {
    "use strict";
    module.exports = {
      ArrayIsArray(self2) {
        return Array.isArray(self2);
      },
      ArrayPrototypeIncludes(self2, el) {
        return self2.includes(el);
      },
      ArrayPrototypeIndexOf(self2, el) {
        return self2.indexOf(el);
      },
      ArrayPrototypeJoin(self2, sep) {
        return self2.join(sep);
      },
      ArrayPrototypeMap(self2, fn) {
        return self2.map(fn);
      },
      ArrayPrototypePop(self2, el) {
        return self2.pop(el);
      },
      ArrayPrototypePush(self2, el) {
        return self2.push(el);
      },
      ArrayPrototypeSlice(self2, start, end) {
        return self2.slice(start, end);
      },
      Error,
      FunctionPrototypeCall(fn, thisArgs, ...args) {
        return fn.call(thisArgs, ...args);
      },
      FunctionPrototypeSymbolHasInstance(self2, instance) {
        return Function.prototype[Symbol.hasInstance].call(self2, instance);
      },
      MathFloor: Math.floor,
      Number,
      NumberIsInteger: Number.isInteger,
      NumberIsNaN: Number.isNaN,
      NumberMAX_SAFE_INTEGER: Number.MAX_SAFE_INTEGER,
      NumberMIN_SAFE_INTEGER: Number.MIN_SAFE_INTEGER,
      NumberParseInt: Number.parseInt,
      ObjectDefineProperties(self2, props) {
        return Object.defineProperties(self2, props);
      },
      ObjectDefineProperty(self2, name, prop) {
        return Object.defineProperty(self2, name, prop);
      },
      ObjectGetOwnPropertyDescriptor(self2, name) {
        return Object.getOwnPropertyDescriptor(self2, name);
      },
      ObjectKeys(obj) {
        return Object.keys(obj);
      },
      ObjectSetPrototypeOf(target, proto) {
        return Object.setPrototypeOf(target, proto);
      },
      Promise,
      PromisePrototypeCatch(self2, fn) {
        return self2.catch(fn);
      },
      PromisePrototypeThen(self2, thenFn, catchFn) {
        return self2.then(thenFn, catchFn);
      },
      PromiseReject(err) {
        return Promise.reject(err);
      },
      ReflectApply: Reflect.apply,
      RegExpPrototypeTest(self2, value) {
        return self2.test(value);
      },
      SafeSet: Set,
      String,
      StringPrototypeSlice(self2, start, end) {
        return self2.slice(start, end);
      },
      StringPrototypeToLowerCase(self2) {
        return self2.toLowerCase();
      },
      StringPrototypeToUpperCase(self2) {
        return self2.toUpperCase();
      },
      StringPrototypeTrim(self2) {
        return self2.trim();
      },
      Symbol,
      SymbolAsyncIterator: Symbol.asyncIterator,
      SymbolHasInstance: Symbol.hasInstance,
      SymbolIterator: Symbol.iterator,
      TypedArrayPrototypeSet(self2, buf, len) {
        return self2.set(buf, len);
      },
      Uint8Array
    };
  }
});

// node_modules/readable-stream/lib/ours/util.js
var require_util = __commonJS({
  "node_modules/readable-stream/lib/ours/util.js"(exports, module) {
    "use strict";
    var bufferModule = require_buffer();
    var AsyncFunction = Object.getPrototypeOf(async function() {
    }).constructor;
    var Blob = globalThis.Blob || bufferModule.Blob;
    var isBlob = typeof Blob !== "undefined" ? function isBlob2(b) {
      return b instanceof Blob;
    } : function isBlob2(b) {
      return false;
    };
    var AggregateError = class extends Error {
      constructor(errors) {
        if (!Array.isArray(errors)) {
          throw new TypeError(`Expected input to be an Array, got ${typeof errors}`);
        }
        let message = "";
        for (let i = 0; i < errors.length; i++) {
          message += `    ${errors[i].stack}
`;
        }
        super(message);
        this.name = "AggregateError";
        this.errors = errors;
      }
    };
    module.exports = {
      AggregateError,
      kEmptyObject: Object.freeze({}),
      once(callback) {
        let called = false;
        return function(...args) {
          if (called) {
            return;
          }
          called = true;
          callback.apply(this, args);
        };
      },
      createDeferredPromise: function() {
        let resolve;
        let reject;
        const promise = new Promise((res, rej) => {
          resolve = res;
          reject = rej;
        });
        return {
          promise,
          resolve,
          reject
        };
      },
      promisify(fn) {
        return new Promise((resolve, reject) => {
          fn((err, ...args) => {
            if (err) {
              return reject(err);
            }
            return resolve(...args);
          });
        });
      },
      debuglog() {
        return function() {
        };
      },
      format(format2, ...args) {
        return format2.replace(/%([sdifj])/g, function(...[_unused, type]) {
          const replacement = args.shift();
          if (type === "f") {
            return replacement.toFixed(6);
          } else if (type === "j") {
            return JSON.stringify(replacement);
          } else if (type === "s" && typeof replacement === "object") {
            const ctor = replacement.constructor !== Object ? replacement.constructor.name : "";
            return `${ctor} {}`.trim();
          } else {
            return replacement.toString();
          }
        });
      },
      inspect(value) {
        switch (typeof value) {
          case "string":
            if (value.includes("'")) {
              if (!value.includes('"')) {
                return `"${value}"`;
              } else if (!value.includes("`") && !value.includes("${")) {
                return `\`${value}\``;
              }
            }
            return `'${value}'`;
          case "number":
            if (isNaN(value)) {
              return "NaN";
            } else if (Object.is(value, -0)) {
              return String(value);
            }
            return value;
          case "bigint":
            return `${String(value)}n`;
          case "boolean":
          case "undefined":
            return String(value);
          case "object":
            return "{}";
        }
      },
      types: {
        isAsyncFunction(fn) {
          return fn instanceof AsyncFunction;
        },
        isArrayBufferView(arr) {
          return ArrayBuffer.isView(arr);
        }
      },
      isBlob
    };
    module.exports.promisify.custom = Symbol.for("nodejs.util.promisify.custom");
  }
});

// node_modules/abort-controller/browser.js
var require_browser = __commonJS({
  "node_modules/abort-controller/browser.js"(exports, module) {
    "use strict";
    var { AbortController, AbortSignal } = typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : void 0;
    module.exports = AbortController;
    module.exports.AbortSignal = AbortSignal;
    module.exports.default = AbortController;
  }
});

// node_modules/readable-stream/lib/ours/errors.js
var require_errors = __commonJS({
  "node_modules/readable-stream/lib/ours/errors.js"(exports, module) {
    "use strict";
    var { format: format2, inspect: inspect3, AggregateError: CustomAggregateError } = require_util();
    var AggregateError = globalThis.AggregateError || CustomAggregateError;
    var kIsNodeError = Symbol("kIsNodeError");
    var kTypes = [
      "string",
      "function",
      "number",
      "object",
      "Function",
      "Object",
      "boolean",
      "bigint",
      "symbol"
    ];
    var classRegExp = /^([A-Z][a-z0-9]*)+$/;
    var nodeInternalPrefix = "__node_internal_";
    var codes = {};
    function assert(value, message) {
      if (!value) {
        throw new codes.ERR_INTERNAL_ASSERTION(message);
      }
    }
    function addNumericalSeparator(val) {
      let res = "";
      let i = val.length;
      const start = val[0] === "-" ? 1 : 0;
      for (; i >= start + 4; i -= 3) {
        res = `_${val.slice(i - 3, i)}${res}`;
      }
      return `${val.slice(0, i)}${res}`;
    }
    function getMessage(key, msg, args) {
      if (typeof msg === "function") {
        assert(
          msg.length <= args.length,
          `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${msg.length}).`
        );
        return msg(...args);
      }
      const expectedLength = (msg.match(/%[dfijoOs]/g) || []).length;
      assert(
        expectedLength === args.length,
        `Code: ${key}; The provided arguments length (${args.length}) does not match the required ones (${expectedLength}).`
      );
      if (args.length === 0) {
        return msg;
      }
      return format2(msg, ...args);
    }
    function E(code, message, Base) {
      if (!Base) {
        Base = Error;
      }
      class NodeError extends Base {
        constructor(...args) {
          super(getMessage(code, message, args));
        }
        toString() {
          return `${this.name} [${code}]: ${this.message}`;
        }
      }
      Object.defineProperties(NodeError.prototype, {
        name: {
          value: Base.name,
          writable: true,
          enumerable: false,
          configurable: true
        },
        toString: {
          value() {
            return `${this.name} [${code}]: ${this.message}`;
          },
          writable: true,
          enumerable: false,
          configurable: true
        }
      });
      NodeError.prototype.code = code;
      NodeError.prototype[kIsNodeError] = true;
      codes[code] = NodeError;
    }
    function hideStackFrames(fn) {
      const hidden = nodeInternalPrefix + fn.name;
      Object.defineProperty(fn, "name", {
        value: hidden
      });
      return fn;
    }
    function aggregateTwoErrors(innerError, outerError) {
      if (innerError && outerError && innerError !== outerError) {
        if (Array.isArray(outerError.errors)) {
          outerError.errors.push(innerError);
          return outerError;
        }
        const err = new AggregateError([outerError, innerError], outerError.message);
        err.code = outerError.code;
        return err;
      }
      return innerError || outerError;
    }
    var AbortError = class extends Error {
      constructor(message = "The operation was aborted", options = void 0) {
        if (options !== void 0 && typeof options !== "object") {
          throw new codes.ERR_INVALID_ARG_TYPE("options", "Object", options);
        }
        super(message, options);
        this.code = "ABORT_ERR";
        this.name = "AbortError";
      }
    };
    E("ERR_ASSERTION", "%s", Error);
    E(
      "ERR_INVALID_ARG_TYPE",
      (name, expected, actual) => {
        assert(typeof name === "string", "'name' must be a string");
        if (!Array.isArray(expected)) {
          expected = [expected];
        }
        let msg = "The ";
        if (name.endsWith(" argument")) {
          msg += `${name} `;
        } else {
          msg += `"${name}" ${name.includes(".") ? "property" : "argument"} `;
        }
        msg += "must be ";
        const types = [];
        const instances = [];
        const other = [];
        for (const value of expected) {
          assert(typeof value === "string", "All expected entries have to be of type string");
          if (kTypes.includes(value)) {
            types.push(value.toLowerCase());
          } else if (classRegExp.test(value)) {
            instances.push(value);
          } else {
            assert(value !== "object", 'The value "object" should be written as "Object"');
            other.push(value);
          }
        }
        if (instances.length > 0) {
          const pos = types.indexOf("object");
          if (pos !== -1) {
            types.splice(types, pos, 1);
            instances.push("Object");
          }
        }
        if (types.length > 0) {
          switch (types.length) {
            case 1:
              msg += `of type ${types[0]}`;
              break;
            case 2:
              msg += `one of type ${types[0]} or ${types[1]}`;
              break;
            default: {
              const last = types.pop();
              msg += `one of type ${types.join(", ")}, or ${last}`;
            }
          }
          if (instances.length > 0 || other.length > 0) {
            msg += " or ";
          }
        }
        if (instances.length > 0) {
          switch (instances.length) {
            case 1:
              msg += `an instance of ${instances[0]}`;
              break;
            case 2:
              msg += `an instance of ${instances[0]} or ${instances[1]}`;
              break;
            default: {
              const last = instances.pop();
              msg += `an instance of ${instances.join(", ")}, or ${last}`;
            }
          }
          if (other.length > 0) {
            msg += " or ";
          }
        }
        switch (other.length) {
          case 0:
            break;
          case 1:
            if (other[0].toLowerCase() !== other[0]) {
              msg += "an ";
            }
            msg += `${other[0]}`;
            break;
          case 2:
            msg += `one of ${other[0]} or ${other[1]}`;
            break;
          default: {
            const last = other.pop();
            msg += `one of ${other.join(", ")}, or ${last}`;
          }
        }
        if (actual == null) {
          msg += `. Received ${actual}`;
        } else if (typeof actual === "function" && actual.name) {
          msg += `. Received function ${actual.name}`;
        } else if (typeof actual === "object") {
          var _actual$constructor;
          if ((_actual$constructor = actual.constructor) !== null && _actual$constructor !== void 0 && _actual$constructor.name) {
            msg += `. Received an instance of ${actual.constructor.name}`;
          } else {
            const inspected = inspect3(actual, {
              depth: -1
            });
            msg += `. Received ${inspected}`;
          }
        } else {
          let inspected = inspect3(actual, {
            colors: false
          });
          if (inspected.length > 25) {
            inspected = `${inspected.slice(0, 25)}...`;
          }
          msg += `. Received type ${typeof actual} (${inspected})`;
        }
        return msg;
      },
      TypeError
    );
    E(
      "ERR_INVALID_ARG_VALUE",
      (name, value, reason = "is invalid") => {
        let inspected = inspect3(value);
        if (inspected.length > 128) {
          inspected = inspected.slice(0, 128) + "...";
        }
        const type = name.includes(".") ? "property" : "argument";
        return `The ${type} '${name}' ${reason}. Received ${inspected}`;
      },
      TypeError
    );
    E(
      "ERR_INVALID_RETURN_VALUE",
      (input, name, value) => {
        var _value$constructor;
        const type = value !== null && value !== void 0 && (_value$constructor = value.constructor) !== null && _value$constructor !== void 0 && _value$constructor.name ? `instance of ${value.constructor.name}` : `type ${typeof value}`;
        return `Expected ${input} to be returned from the "${name}" function but got ${type}.`;
      },
      TypeError
    );
    E(
      "ERR_MISSING_ARGS",
      (...args) => {
        assert(args.length > 0, "At least one arg needs to be specified");
        let msg;
        const len = args.length;
        args = (Array.isArray(args) ? args : [args]).map((a) => `"${a}"`).join(" or ");
        switch (len) {
          case 1:
            msg += `The ${args[0]} argument`;
            break;
          case 2:
            msg += `The ${args[0]} and ${args[1]} arguments`;
            break;
          default:
            {
              const last = args.pop();
              msg += `The ${args.join(", ")}, and ${last} arguments`;
            }
            break;
        }
        return `${msg} must be specified`;
      },
      TypeError
    );
    E(
      "ERR_OUT_OF_RANGE",
      (str, range, input) => {
        assert(range, 'Missing "range" argument');
        let received;
        if (Number.isInteger(input) && Math.abs(input) > 2 ** 32) {
          received = addNumericalSeparator(String(input));
        } else if (typeof input === "bigint") {
          received = String(input);
          if (input > 2n ** 32n || input < -(2n ** 32n)) {
            received = addNumericalSeparator(received);
          }
          received += "n";
        } else {
          received = inspect3(input);
        }
        return `The value of "${str}" is out of range. It must be ${range}. Received ${received}`;
      },
      RangeError
    );
    E("ERR_MULTIPLE_CALLBACK", "Callback called multiple times", Error);
    E("ERR_METHOD_NOT_IMPLEMENTED", "The %s method is not implemented", Error);
    E("ERR_STREAM_ALREADY_FINISHED", "Cannot call %s after a stream was finished", Error);
    E("ERR_STREAM_CANNOT_PIPE", "Cannot pipe, not readable", Error);
    E("ERR_STREAM_DESTROYED", "Cannot call %s after a stream was destroyed", Error);
    E("ERR_STREAM_NULL_VALUES", "May not write null values to stream", TypeError);
    E("ERR_STREAM_PREMATURE_CLOSE", "Premature close", Error);
    E("ERR_STREAM_PUSH_AFTER_EOF", "stream.push() after EOF", Error);
    E("ERR_STREAM_UNSHIFT_AFTER_END_EVENT", "stream.unshift() after end event", Error);
    E("ERR_STREAM_WRITE_AFTER_END", "write after end", Error);
    E("ERR_UNKNOWN_ENCODING", "Unknown encoding: %s", TypeError);
    module.exports = {
      AbortError,
      aggregateTwoErrors: hideStackFrames(aggregateTwoErrors),
      hideStackFrames,
      codes
    };
  }
});

// node_modules/readable-stream/lib/internal/validators.js
var require_validators = __commonJS({
  "node_modules/readable-stream/lib/internal/validators.js"(exports, module) {
    "use strict";
    var {
      ArrayIsArray,
      ArrayPrototypeIncludes,
      ArrayPrototypeJoin,
      ArrayPrototypeMap,
      NumberIsInteger,
      NumberIsNaN,
      NumberMAX_SAFE_INTEGER,
      NumberMIN_SAFE_INTEGER,
      NumberParseInt,
      ObjectPrototypeHasOwnProperty,
      RegExpPrototypeExec,
      String: String2,
      StringPrototypeToUpperCase,
      StringPrototypeTrim
    } = require_primordials();
    var {
      hideStackFrames,
      codes: { ERR_SOCKET_BAD_PORT, ERR_INVALID_ARG_TYPE, ERR_INVALID_ARG_VALUE, ERR_OUT_OF_RANGE, ERR_UNKNOWN_SIGNAL }
    } = require_errors();
    var { normalizeEncoding } = require_util();
    var { isAsyncFunction, isArrayBufferView } = require_util().types;
    var signals = {};
    function isInt32(value) {
      return value === (value | 0);
    }
    function isUint32(value) {
      return value === value >>> 0;
    }
    var octalReg = /^[0-7]+$/;
    var modeDesc = "must be a 32-bit unsigned integer or an octal string";
    function parseFileMode(value, name, def) {
      if (typeof value === "undefined") {
        value = def;
      }
      if (typeof value === "string") {
        if (RegExpPrototypeExec(octalReg, value) === null) {
          throw new ERR_INVALID_ARG_VALUE(name, value, modeDesc);
        }
        value = NumberParseInt(value, 8);
      }
      validateUint32(value, name);
      return value;
    }
    var validateInteger = hideStackFrames((value, name, min = NumberMIN_SAFE_INTEGER, max = NumberMAX_SAFE_INTEGER) => {
      if (typeof value !== "number")
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      if (!NumberIsInteger(value))
        throw new ERR_OUT_OF_RANGE(name, "an integer", value);
      if (value < min || value > max)
        throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
    });
    var validateInt32 = hideStackFrames((value, name, min = -2147483648, max = 2147483647) => {
      if (typeof value !== "number") {
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      }
      if (!NumberIsInteger(value)) {
        throw new ERR_OUT_OF_RANGE(name, "an integer", value);
      }
      if (value < min || value > max) {
        throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
      }
    });
    var validateUint32 = hideStackFrames((value, name, positive = false) => {
      if (typeof value !== "number") {
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      }
      if (!NumberIsInteger(value)) {
        throw new ERR_OUT_OF_RANGE(name, "an integer", value);
      }
      const min = positive ? 1 : 0;
      const max = 4294967295;
      if (value < min || value > max) {
        throw new ERR_OUT_OF_RANGE(name, `>= ${min} && <= ${max}`, value);
      }
    });
    function validateString(value, name) {
      if (typeof value !== "string")
        throw new ERR_INVALID_ARG_TYPE(name, "string", value);
    }
    function validateNumber(value, name, min = void 0, max) {
      if (typeof value !== "number")
        throw new ERR_INVALID_ARG_TYPE(name, "number", value);
      if (min != null && value < min || max != null && value > max || (min != null || max != null) && NumberIsNaN(value)) {
        throw new ERR_OUT_OF_RANGE(
          name,
          `${min != null ? `>= ${min}` : ""}${min != null && max != null ? " && " : ""}${max != null ? `<= ${max}` : ""}`,
          value
        );
      }
    }
    var validateOneOf = hideStackFrames((value, name, oneOf) => {
      if (!ArrayPrototypeIncludes(oneOf, value)) {
        const allowed = ArrayPrototypeJoin(
          ArrayPrototypeMap(oneOf, (v) => typeof v === "string" ? `'${v}'` : String2(v)),
          ", "
        );
        const reason = "must be one of: " + allowed;
        throw new ERR_INVALID_ARG_VALUE(name, value, reason);
      }
    });
    function validateBoolean(value, name) {
      if (typeof value !== "boolean")
        throw new ERR_INVALID_ARG_TYPE(name, "boolean", value);
    }
    function getOwnPropertyValueOrDefault(options, key, defaultValue) {
      return options == null || !ObjectPrototypeHasOwnProperty(options, key) ? defaultValue : options[key];
    }
    var validateObject = hideStackFrames((value, name, options = null) => {
      const allowArray = getOwnPropertyValueOrDefault(options, "allowArray", false);
      const allowFunction = getOwnPropertyValueOrDefault(options, "allowFunction", false);
      const nullable = getOwnPropertyValueOrDefault(options, "nullable", false);
      if (!nullable && value === null || !allowArray && ArrayIsArray(value) || typeof value !== "object" && (!allowFunction || typeof value !== "function")) {
        throw new ERR_INVALID_ARG_TYPE(name, "Object", value);
      }
    });
    var validateArray = hideStackFrames((value, name, minLength = 0) => {
      if (!ArrayIsArray(value)) {
        throw new ERR_INVALID_ARG_TYPE(name, "Array", value);
      }
      if (value.length < minLength) {
        const reason = `must be longer than ${minLength}`;
        throw new ERR_INVALID_ARG_VALUE(name, value, reason);
      }
    });
    function validateSignalName(signal, name = "signal") {
      validateString(signal, name);
      if (signals[signal] === void 0) {
        if (signals[StringPrototypeToUpperCase(signal)] !== void 0) {
          throw new ERR_UNKNOWN_SIGNAL(signal + " (signals must use all capital letters)");
        }
        throw new ERR_UNKNOWN_SIGNAL(signal);
      }
    }
    var validateBuffer = hideStackFrames((buffer, name = "buffer") => {
      if (!isArrayBufferView(buffer)) {
        throw new ERR_INVALID_ARG_TYPE(name, ["Buffer", "TypedArray", "DataView"], buffer);
      }
    });
    function validateEncoding(data, encoding) {
      const normalizedEncoding = normalizeEncoding(encoding);
      const length = data.length;
      if (normalizedEncoding === "hex" && length % 2 !== 0) {
        throw new ERR_INVALID_ARG_VALUE("encoding", encoding, `is invalid for data of length ${length}`);
      }
    }
    function validatePort(port, name = "Port", allowZero = true) {
      if (typeof port !== "number" && typeof port !== "string" || typeof port === "string" && StringPrototypeTrim(port).length === 0 || +port !== +port >>> 0 || port > 65535 || port === 0 && !allowZero) {
        throw new ERR_SOCKET_BAD_PORT(name, port, allowZero);
      }
      return port | 0;
    }
    var validateAbortSignal = hideStackFrames((signal, name) => {
      if (signal !== void 0 && (signal === null || typeof signal !== "object" || !("aborted" in signal))) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
      }
    });
    var validateFunction = hideStackFrames((value, name) => {
      if (typeof value !== "function")
        throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
    });
    var validatePlainFunction = hideStackFrames((value, name) => {
      if (typeof value !== "function" || isAsyncFunction(value))
        throw new ERR_INVALID_ARG_TYPE(name, "Function", value);
    });
    var validateUndefined = hideStackFrames((value, name) => {
      if (value !== void 0)
        throw new ERR_INVALID_ARG_TYPE(name, "undefined", value);
    });
    function validateUnion(value, name, union) {
      if (!ArrayPrototypeIncludes(union, value)) {
        throw new ERR_INVALID_ARG_TYPE(name, `('${ArrayPrototypeJoin(union, "|")}')`, value);
      }
    }
    module.exports = {
      isInt32,
      isUint32,
      parseFileMode,
      validateArray,
      validateBoolean,
      validateBuffer,
      validateEncoding,
      validateFunction,
      validateInt32,
      validateInteger,
      validateNumber,
      validateObject,
      validateOneOf,
      validatePlainFunction,
      validatePort,
      validateSignalName,
      validateString,
      validateUint32,
      validateUndefined,
      validateUnion,
      validateAbortSignal
    };
  }
});

// node_modules/process/browser.js
var require_browser2 = __commonJS({
  "node_modules/process/browser.js"(exports, module) {
    var process2 = module.exports = {};
    var cachedSetTimeout2;
    var cachedClearTimeout2;
    function defaultSetTimout2() {
      throw new Error("setTimeout has not been defined");
    }
    function defaultClearTimeout2() {
      throw new Error("clearTimeout has not been defined");
    }
    (function() {
      try {
        if (typeof setTimeout === "function") {
          cachedSetTimeout2 = setTimeout;
        } else {
          cachedSetTimeout2 = defaultSetTimout2;
        }
      } catch (e) {
        cachedSetTimeout2 = defaultSetTimout2;
      }
      try {
        if (typeof clearTimeout === "function") {
          cachedClearTimeout2 = clearTimeout;
        } else {
          cachedClearTimeout2 = defaultClearTimeout2;
        }
      } catch (e) {
        cachedClearTimeout2 = defaultClearTimeout2;
      }
    })();
    function runTimeout2(fun) {
      if (cachedSetTimeout2 === setTimeout) {
        return setTimeout(fun, 0);
      }
      if ((cachedSetTimeout2 === defaultSetTimout2 || !cachedSetTimeout2) && setTimeout) {
        cachedSetTimeout2 = setTimeout;
        return setTimeout(fun, 0);
      }
      try {
        return cachedSetTimeout2(fun, 0);
      } catch (e) {
        try {
          return cachedSetTimeout2.call(null, fun, 0);
        } catch (e2) {
          return cachedSetTimeout2.call(this, fun, 0);
        }
      }
    }
    function runClearTimeout2(marker) {
      if (cachedClearTimeout2 === clearTimeout) {
        return clearTimeout(marker);
      }
      if ((cachedClearTimeout2 === defaultClearTimeout2 || !cachedClearTimeout2) && clearTimeout) {
        cachedClearTimeout2 = clearTimeout;
        return clearTimeout(marker);
      }
      try {
        return cachedClearTimeout2(marker);
      } catch (e) {
        try {
          return cachedClearTimeout2.call(null, marker);
        } catch (e2) {
          return cachedClearTimeout2.call(this, marker);
        }
      }
    }
    var queue2 = [];
    var draining2 = false;
    var currentQueue2;
    var queueIndex2 = -1;
    function cleanUpNextTick2() {
      if (!draining2 || !currentQueue2) {
        return;
      }
      draining2 = false;
      if (currentQueue2.length) {
        queue2 = currentQueue2.concat(queue2);
      } else {
        queueIndex2 = -1;
      }
      if (queue2.length) {
        drainQueue2();
      }
    }
    function drainQueue2() {
      if (draining2) {
        return;
      }
      var timeout = runTimeout2(cleanUpNextTick2);
      draining2 = true;
      var len = queue2.length;
      while (len) {
        currentQueue2 = queue2;
        queue2 = [];
        while (++queueIndex2 < len) {
          if (currentQueue2) {
            currentQueue2[queueIndex2].run();
          }
        }
        queueIndex2 = -1;
        len = queue2.length;
      }
      currentQueue2 = null;
      draining2 = false;
      runClearTimeout2(timeout);
    }
    process2.nextTick = function(fun) {
      var args = new Array(arguments.length - 1);
      if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
          args[i - 1] = arguments[i];
        }
      }
      queue2.push(new Item2(fun, args));
      if (queue2.length === 1 && !draining2) {
        runTimeout2(drainQueue2);
      }
    };
    function Item2(fun, array) {
      this.fun = fun;
      this.array = array;
    }
    Item2.prototype.run = function() {
      this.fun.apply(null, this.array);
    };
    process2.title = "browser";
    process2.browser = true;
    process2.env = {};
    process2.argv = [];
    process2.version = "";
    process2.versions = {};
    function noop2() {
    }
    process2.on = noop2;
    process2.addListener = noop2;
    process2.once = noop2;
    process2.off = noop2;
    process2.removeListener = noop2;
    process2.removeAllListeners = noop2;
    process2.emit = noop2;
    process2.prependListener = noop2;
    process2.prependOnceListener = noop2;
    process2.listeners = function(name) {
      return [];
    };
    process2.binding = function(name) {
      throw new Error("process.binding is not supported");
    };
    process2.cwd = function() {
      return "/";
    };
    process2.chdir = function(dir) {
      throw new Error("process.chdir is not supported");
    };
    process2.umask = function() {
      return 0;
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/utils.js
var require_utils = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/utils.js"(exports, module) {
    "use strict";
    var { Symbol: Symbol2, SymbolAsyncIterator, SymbolIterator } = require_primordials();
    var kDestroyed = Symbol2("kDestroyed");
    var kIsErrored = Symbol2("kIsErrored");
    var kIsReadable = Symbol2("kIsReadable");
    var kIsDisturbed = Symbol2("kIsDisturbed");
    function isReadableNodeStream(obj, strict = false) {
      var _obj$_readableState;
      return !!(obj && typeof obj.pipe === "function" && typeof obj.on === "function" && (!strict || typeof obj.pause === "function" && typeof obj.resume === "function") && (!obj._writableState || ((_obj$_readableState = obj._readableState) === null || _obj$_readableState === void 0 ? void 0 : _obj$_readableState.readable) !== false) && (!obj._writableState || obj._readableState));
    }
    function isWritableNodeStream(obj) {
      var _obj$_writableState;
      return !!(obj && typeof obj.write === "function" && typeof obj.on === "function" && (!obj._readableState || ((_obj$_writableState = obj._writableState) === null || _obj$_writableState === void 0 ? void 0 : _obj$_writableState.writable) !== false));
    }
    function isDuplexNodeStream(obj) {
      return !!(obj && typeof obj.pipe === "function" && obj._readableState && typeof obj.on === "function" && typeof obj.write === "function");
    }
    function isNodeStream(obj) {
      return obj && (obj._readableState || obj._writableState || typeof obj.write === "function" && typeof obj.on === "function" || typeof obj.pipe === "function" && typeof obj.on === "function");
    }
    function isIterable(obj, isAsync) {
      if (obj == null)
        return false;
      if (isAsync === true)
        return typeof obj[SymbolAsyncIterator] === "function";
      if (isAsync === false)
        return typeof obj[SymbolIterator] === "function";
      return typeof obj[SymbolAsyncIterator] === "function" || typeof obj[SymbolIterator] === "function";
    }
    function isDestroyed(stream) {
      if (!isNodeStream(stream))
        return null;
      const wState = stream._writableState;
      const rState = stream._readableState;
      const state = wState || rState;
      return !!(stream.destroyed || stream[kDestroyed] || state !== null && state !== void 0 && state.destroyed);
    }
    function isWritableEnded(stream) {
      if (!isWritableNodeStream(stream))
        return null;
      if (stream.writableEnded === true)
        return true;
      const wState = stream._writableState;
      if (wState !== null && wState !== void 0 && wState.errored)
        return false;
      if (typeof (wState === null || wState === void 0 ? void 0 : wState.ended) !== "boolean")
        return null;
      return wState.ended;
    }
    function isWritableFinished(stream, strict) {
      if (!isWritableNodeStream(stream))
        return null;
      if (stream.writableFinished === true)
        return true;
      const wState = stream._writableState;
      if (wState !== null && wState !== void 0 && wState.errored)
        return false;
      if (typeof (wState === null || wState === void 0 ? void 0 : wState.finished) !== "boolean")
        return null;
      return !!(wState.finished || strict === false && wState.ended === true && wState.length === 0);
    }
    function isReadableEnded(stream) {
      if (!isReadableNodeStream(stream))
        return null;
      if (stream.readableEnded === true)
        return true;
      const rState = stream._readableState;
      if (!rState || rState.errored)
        return false;
      if (typeof (rState === null || rState === void 0 ? void 0 : rState.ended) !== "boolean")
        return null;
      return rState.ended;
    }
    function isReadableFinished(stream, strict) {
      if (!isReadableNodeStream(stream))
        return null;
      const rState = stream._readableState;
      if (rState !== null && rState !== void 0 && rState.errored)
        return false;
      if (typeof (rState === null || rState === void 0 ? void 0 : rState.endEmitted) !== "boolean")
        return null;
      return !!(rState.endEmitted || strict === false && rState.ended === true && rState.length === 0);
    }
    function isReadable(stream) {
      if (stream && stream[kIsReadable] != null)
        return stream[kIsReadable];
      if (typeof (stream === null || stream === void 0 ? void 0 : stream.readable) !== "boolean")
        return null;
      if (isDestroyed(stream))
        return false;
      return isReadableNodeStream(stream) && stream.readable && !isReadableFinished(stream);
    }
    function isWritable(stream) {
      if (typeof (stream === null || stream === void 0 ? void 0 : stream.writable) !== "boolean")
        return null;
      if (isDestroyed(stream))
        return false;
      return isWritableNodeStream(stream) && stream.writable && !isWritableEnded(stream);
    }
    function isFinished(stream, opts) {
      if (!isNodeStream(stream)) {
        return null;
      }
      if (isDestroyed(stream)) {
        return true;
      }
      if ((opts === null || opts === void 0 ? void 0 : opts.readable) !== false && isReadable(stream)) {
        return false;
      }
      if ((opts === null || opts === void 0 ? void 0 : opts.writable) !== false && isWritable(stream)) {
        return false;
      }
      return true;
    }
    function isWritableErrored(stream) {
      var _stream$_writableStat, _stream$_writableStat2;
      if (!isNodeStream(stream)) {
        return null;
      }
      if (stream.writableErrored) {
        return stream.writableErrored;
      }
      return (_stream$_writableStat = (_stream$_writableStat2 = stream._writableState) === null || _stream$_writableStat2 === void 0 ? void 0 : _stream$_writableStat2.errored) !== null && _stream$_writableStat !== void 0 ? _stream$_writableStat : null;
    }
    function isReadableErrored(stream) {
      var _stream$_readableStat, _stream$_readableStat2;
      if (!isNodeStream(stream)) {
        return null;
      }
      if (stream.readableErrored) {
        return stream.readableErrored;
      }
      return (_stream$_readableStat = (_stream$_readableStat2 = stream._readableState) === null || _stream$_readableStat2 === void 0 ? void 0 : _stream$_readableStat2.errored) !== null && _stream$_readableStat !== void 0 ? _stream$_readableStat : null;
    }
    function isClosed(stream) {
      if (!isNodeStream(stream)) {
        return null;
      }
      if (typeof stream.closed === "boolean") {
        return stream.closed;
      }
      const wState = stream._writableState;
      const rState = stream._readableState;
      if (typeof (wState === null || wState === void 0 ? void 0 : wState.closed) === "boolean" || typeof (rState === null || rState === void 0 ? void 0 : rState.closed) === "boolean") {
        return (wState === null || wState === void 0 ? void 0 : wState.closed) || (rState === null || rState === void 0 ? void 0 : rState.closed);
      }
      if (typeof stream._closed === "boolean" && isOutgoingMessage(stream)) {
        return stream._closed;
      }
      return null;
    }
    function isOutgoingMessage(stream) {
      return typeof stream._closed === "boolean" && typeof stream._defaultKeepAlive === "boolean" && typeof stream._removedConnection === "boolean" && typeof stream._removedContLen === "boolean";
    }
    function isServerResponse(stream) {
      return typeof stream._sent100 === "boolean" && isOutgoingMessage(stream);
    }
    function isServerRequest(stream) {
      var _stream$req;
      return typeof stream._consuming === "boolean" && typeof stream._dumped === "boolean" && ((_stream$req = stream.req) === null || _stream$req === void 0 ? void 0 : _stream$req.upgradeOrConnect) === void 0;
    }
    function willEmitClose(stream) {
      if (!isNodeStream(stream))
        return null;
      const wState = stream._writableState;
      const rState = stream._readableState;
      const state = wState || rState;
      return !state && isServerResponse(stream) || !!(state && state.autoDestroy && state.emitClose && state.closed === false);
    }
    function isDisturbed(stream) {
      var _stream$kIsDisturbed;
      return !!(stream && ((_stream$kIsDisturbed = stream[kIsDisturbed]) !== null && _stream$kIsDisturbed !== void 0 ? _stream$kIsDisturbed : stream.readableDidRead || stream.readableAborted));
    }
    function isErrored(stream) {
      var _ref, _ref2, _ref3, _ref4, _ref5, _stream$kIsErrored, _stream$_readableStat3, _stream$_writableStat3, _stream$_readableStat4, _stream$_writableStat4;
      return !!(stream && ((_ref = (_ref2 = (_ref3 = (_ref4 = (_ref5 = (_stream$kIsErrored = stream[kIsErrored]) !== null && _stream$kIsErrored !== void 0 ? _stream$kIsErrored : stream.readableErrored) !== null && _ref5 !== void 0 ? _ref5 : stream.writableErrored) !== null && _ref4 !== void 0 ? _ref4 : (_stream$_readableStat3 = stream._readableState) === null || _stream$_readableStat3 === void 0 ? void 0 : _stream$_readableStat3.errorEmitted) !== null && _ref3 !== void 0 ? _ref3 : (_stream$_writableStat3 = stream._writableState) === null || _stream$_writableStat3 === void 0 ? void 0 : _stream$_writableStat3.errorEmitted) !== null && _ref2 !== void 0 ? _ref2 : (_stream$_readableStat4 = stream._readableState) === null || _stream$_readableStat4 === void 0 ? void 0 : _stream$_readableStat4.errored) !== null && _ref !== void 0 ? _ref : (_stream$_writableStat4 = stream._writableState) === null || _stream$_writableStat4 === void 0 ? void 0 : _stream$_writableStat4.errored));
    }
    module.exports = {
      kDestroyed,
      isDisturbed,
      kIsDisturbed,
      isErrored,
      kIsErrored,
      isReadable,
      kIsReadable,
      isClosed,
      isDestroyed,
      isDuplexNodeStream,
      isFinished,
      isIterable,
      isReadableNodeStream,
      isReadableEnded,
      isReadableFinished,
      isReadableErrored,
      isNodeStream,
      isWritable,
      isWritableNodeStream,
      isWritableEnded,
      isWritableFinished,
      isWritableErrored,
      isServerRequest,
      isServerResponse,
      willEmitClose
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/end-of-stream.js
var require_end_of_stream = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/end-of-stream.js"(exports, module) {
    var process2 = require_browser2();
    var { AbortError, codes } = require_errors();
    var { ERR_INVALID_ARG_TYPE, ERR_STREAM_PREMATURE_CLOSE } = codes;
    var { kEmptyObject, once: once3 } = require_util();
    var { validateAbortSignal, validateFunction, validateObject } = require_validators();
    var { Promise: Promise2 } = require_primordials();
    var {
      isClosed,
      isReadable,
      isReadableNodeStream,
      isReadableFinished,
      isReadableErrored,
      isWritable,
      isWritableNodeStream,
      isWritableFinished,
      isWritableErrored,
      isNodeStream,
      willEmitClose: _willEmitClose
    } = require_utils();
    function isRequest(stream) {
      return stream.setHeader && typeof stream.abort === "function";
    }
    var nop2 = () => {
    };
    function eos(stream, options, callback) {
      var _options$readable, _options$writable;
      if (arguments.length === 2) {
        callback = options;
        options = kEmptyObject;
      } else if (options == null) {
        options = kEmptyObject;
      } else {
        validateObject(options, "options");
      }
      validateFunction(callback, "callback");
      validateAbortSignal(options.signal, "options.signal");
      callback = once3(callback);
      const readable = (_options$readable = options.readable) !== null && _options$readable !== void 0 ? _options$readable : isReadableNodeStream(stream);
      const writable = (_options$writable = options.writable) !== null && _options$writable !== void 0 ? _options$writable : isWritableNodeStream(stream);
      if (!isNodeStream(stream)) {
        throw new ERR_INVALID_ARG_TYPE("stream", "Stream", stream);
      }
      const wState = stream._writableState;
      const rState = stream._readableState;
      const onlegacyfinish = () => {
        if (!stream.writable) {
          onfinish();
        }
      };
      let willEmitClose = _willEmitClose(stream) && isReadableNodeStream(stream) === readable && isWritableNodeStream(stream) === writable;
      let writableFinished = isWritableFinished(stream, false);
      const onfinish = () => {
        writableFinished = true;
        if (stream.destroyed) {
          willEmitClose = false;
        }
        if (willEmitClose && (!stream.readable || readable)) {
          return;
        }
        if (!readable || readableFinished) {
          callback.call(stream);
        }
      };
      let readableFinished = isReadableFinished(stream, false);
      const onend2 = () => {
        readableFinished = true;
        if (stream.destroyed) {
          willEmitClose = false;
        }
        if (willEmitClose && (!stream.writable || writable)) {
          return;
        }
        if (!writable || writableFinished) {
          callback.call(stream);
        }
      };
      const onerror = (err) => {
        callback.call(stream, err);
      };
      let closed = isClosed(stream);
      const onclose = () => {
        closed = true;
        const errored = isWritableErrored(stream) || isReadableErrored(stream);
        if (errored && typeof errored !== "boolean") {
          return callback.call(stream, errored);
        }
        if (readable && !readableFinished && isReadableNodeStream(stream, true)) {
          if (!isReadableFinished(stream, false))
            return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
        }
        if (writable && !writableFinished) {
          if (!isWritableFinished(stream, false))
            return callback.call(stream, new ERR_STREAM_PREMATURE_CLOSE());
        }
        callback.call(stream);
      };
      const onrequest = () => {
        stream.req.on("finish", onfinish);
      };
      if (isRequest(stream)) {
        stream.on("complete", onfinish);
        if (!willEmitClose) {
          stream.on("abort", onclose);
        }
        if (stream.req) {
          onrequest();
        } else {
          stream.on("request", onrequest);
        }
      } else if (writable && !wState) {
        stream.on("end", onlegacyfinish);
        stream.on("close", onlegacyfinish);
      }
      if (!willEmitClose && typeof stream.aborted === "boolean") {
        stream.on("aborted", onclose);
      }
      stream.on("end", onend2);
      stream.on("finish", onfinish);
      if (options.error !== false) {
        stream.on("error", onerror);
      }
      stream.on("close", onclose);
      if (closed) {
        process2.nextTick(onclose);
      } else if (wState !== null && wState !== void 0 && wState.errorEmitted || rState !== null && rState !== void 0 && rState.errorEmitted) {
        if (!willEmitClose) {
          process2.nextTick(onclose);
        }
      } else if (!readable && (!willEmitClose || isReadable(stream)) && (writableFinished || isWritable(stream) === false)) {
        process2.nextTick(onclose);
      } else if (!writable && (!willEmitClose || isWritable(stream)) && (readableFinished || isReadable(stream) === false)) {
        process2.nextTick(onclose);
      } else if (rState && stream.req && stream.aborted) {
        process2.nextTick(onclose);
      }
      const cleanup = () => {
        callback = nop2;
        stream.removeListener("aborted", onclose);
        stream.removeListener("complete", onfinish);
        stream.removeListener("abort", onclose);
        stream.removeListener("request", onrequest);
        if (stream.req)
          stream.req.removeListener("finish", onfinish);
        stream.removeListener("end", onlegacyfinish);
        stream.removeListener("close", onlegacyfinish);
        stream.removeListener("finish", onfinish);
        stream.removeListener("end", onend2);
        stream.removeListener("error", onerror);
        stream.removeListener("close", onclose);
      };
      if (options.signal && !closed) {
        const abort = () => {
          const endCallback = callback;
          cleanup();
          endCallback.call(
            stream,
            new AbortError(void 0, {
              cause: options.signal.reason
            })
          );
        };
        if (options.signal.aborted) {
          process2.nextTick(abort);
        } else {
          const originalCallback = callback;
          callback = once3((...args) => {
            options.signal.removeEventListener("abort", abort);
            originalCallback.apply(stream, args);
          });
          options.signal.addEventListener("abort", abort);
        }
      }
      return cleanup;
    }
    function finished(stream, opts) {
      return new Promise2((resolve, reject) => {
        eos(stream, opts, (err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }
    module.exports = eos;
    module.exports.finished = finished;
  }
});

// node_modules/readable-stream/lib/internal/streams/operators.js
var require_operators = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/operators.js"(exports, module) {
    "use strict";
    var AbortController = globalThis.AbortController || require_browser().AbortController;
    var {
      codes: { ERR_INVALID_ARG_TYPE, ERR_MISSING_ARGS, ERR_OUT_OF_RANGE },
      AbortError
    } = require_errors();
    var { validateAbortSignal, validateInteger, validateObject } = require_validators();
    var kWeakHandler = require_primordials().Symbol("kWeak");
    var { finished } = require_end_of_stream();
    var {
      ArrayPrototypePush,
      MathFloor,
      Number: Number2,
      NumberIsNaN,
      Promise: Promise2,
      PromiseReject,
      PromisePrototypeThen,
      Symbol: Symbol2
    } = require_primordials();
    var kEmpty = Symbol2("kEmpty");
    var kEof = Symbol2("kEof");
    function map(fn, options) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      let concurrency = 1;
      if ((options === null || options === void 0 ? void 0 : options.concurrency) != null) {
        concurrency = MathFloor(options.concurrency);
      }
      validateInteger(concurrency, "concurrency", 1);
      return async function* map2() {
        var _options$signal, _options$signal2;
        const ac = new AbortController();
        const stream = this;
        const queue2 = [];
        const signal = ac.signal;
        const signalOpt = {
          signal
        };
        const abort = () => ac.abort();
        if (options !== null && options !== void 0 && (_options$signal = options.signal) !== null && _options$signal !== void 0 && _options$signal.aborted) {
          abort();
        }
        options === null || options === void 0 ? void 0 : (_options$signal2 = options.signal) === null || _options$signal2 === void 0 ? void 0 : _options$signal2.addEventListener("abort", abort);
        let next;
        let resume2;
        let done2 = false;
        function onDone() {
          done2 = true;
        }
        async function pump() {
          try {
            for await (let val of stream) {
              var _val;
              if (done2) {
                return;
              }
              if (signal.aborted) {
                throw new AbortError();
              }
              try {
                val = fn(val, signalOpt);
              } catch (err) {
                val = PromiseReject(err);
              }
              if (val === kEmpty) {
                continue;
              }
              if (typeof ((_val = val) === null || _val === void 0 ? void 0 : _val.catch) === "function") {
                val.catch(onDone);
              }
              queue2.push(val);
              if (next) {
                next();
                next = null;
              }
              if (!done2 && queue2.length && queue2.length >= concurrency) {
                await new Promise2((resolve) => {
                  resume2 = resolve;
                });
              }
            }
            queue2.push(kEof);
          } catch (err) {
            const val = PromiseReject(err);
            PromisePrototypeThen(val, void 0, onDone);
            queue2.push(val);
          } finally {
            var _options$signal3;
            done2 = true;
            if (next) {
              next();
              next = null;
            }
            options === null || options === void 0 ? void 0 : (_options$signal3 = options.signal) === null || _options$signal3 === void 0 ? void 0 : _options$signal3.removeEventListener("abort", abort);
          }
        }
        pump();
        try {
          while (true) {
            while (queue2.length > 0) {
              const val = await queue2[0];
              if (val === kEof) {
                return;
              }
              if (signal.aborted) {
                throw new AbortError();
              }
              if (val !== kEmpty) {
                yield val;
              }
              queue2.shift();
              if (resume2) {
                resume2();
                resume2 = null;
              }
            }
            await new Promise2((resolve) => {
              next = resolve;
            });
          }
        } finally {
          ac.abort();
          done2 = true;
          if (resume2) {
            resume2();
            resume2 = null;
          }
        }
      }.call(this);
    }
    function asIndexedPairs(options = void 0) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      return async function* asIndexedPairs2() {
        let index = 0;
        for await (const val of this) {
          var _options$signal4;
          if (options !== null && options !== void 0 && (_options$signal4 = options.signal) !== null && _options$signal4 !== void 0 && _options$signal4.aborted) {
            throw new AbortError({
              cause: options.signal.reason
            });
          }
          yield [index++, val];
        }
      }.call(this);
    }
    async function some(fn, options = void 0) {
      for await (const unused of filter.call(this, fn, options)) {
        return true;
      }
      return false;
    }
    async function every(fn, options = void 0) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      return !await some.call(
        this,
        async (...args) => {
          return !await fn(...args);
        },
        options
      );
    }
    async function find(fn, options) {
      for await (const result of filter.call(this, fn, options)) {
        return result;
      }
      return void 0;
    }
    async function forEach2(fn, options) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      async function forEachFn(value, options2) {
        await fn(value, options2);
        return kEmpty;
      }
      for await (const unused of map.call(this, forEachFn, options))
        ;
    }
    function filter(fn, options) {
      if (typeof fn !== "function") {
        throw new ERR_INVALID_ARG_TYPE("fn", ["Function", "AsyncFunction"], fn);
      }
      async function filterFn(value, options2) {
        if (await fn(value, options2)) {
          return value;
        }
        return kEmpty;
      }
      return map.call(this, filterFn, options);
    }
    var ReduceAwareErrMissingArgs = class extends ERR_MISSING_ARGS {
      constructor() {
        super("reduce");
        this.message = "Reduce of an empty stream requires an initial value";
      }
    };
    async function reduce(reducer, initialValue, options) {
      var _options$signal5;
      if (typeof reducer !== "function") {
        throw new ERR_INVALID_ARG_TYPE("reducer", ["Function", "AsyncFunction"], reducer);
      }
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      let hasInitialValue = arguments.length > 1;
      if (options !== null && options !== void 0 && (_options$signal5 = options.signal) !== null && _options$signal5 !== void 0 && _options$signal5.aborted) {
        const err = new AbortError(void 0, {
          cause: options.signal.reason
        });
        this.once("error", () => {
        });
        await finished(this.destroy(err));
        throw err;
      }
      const ac = new AbortController();
      const signal = ac.signal;
      if (options !== null && options !== void 0 && options.signal) {
        const opts = {
          once: true,
          [kWeakHandler]: this
        };
        options.signal.addEventListener("abort", () => ac.abort(), opts);
      }
      let gotAnyItemFromStream = false;
      try {
        for await (const value of this) {
          var _options$signal6;
          gotAnyItemFromStream = true;
          if (options !== null && options !== void 0 && (_options$signal6 = options.signal) !== null && _options$signal6 !== void 0 && _options$signal6.aborted) {
            throw new AbortError();
          }
          if (!hasInitialValue) {
            initialValue = value;
            hasInitialValue = true;
          } else {
            initialValue = await reducer(initialValue, value, {
              signal
            });
          }
        }
        if (!gotAnyItemFromStream && !hasInitialValue) {
          throw new ReduceAwareErrMissingArgs();
        }
      } finally {
        ac.abort();
      }
      return initialValue;
    }
    async function toArray(options) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      const result = [];
      for await (const val of this) {
        var _options$signal7;
        if (options !== null && options !== void 0 && (_options$signal7 = options.signal) !== null && _options$signal7 !== void 0 && _options$signal7.aborted) {
          throw new AbortError(void 0, {
            cause: options.signal.reason
          });
        }
        ArrayPrototypePush(result, val);
      }
      return result;
    }
    function flatMap(fn, options) {
      const values = map.call(this, fn, options);
      return async function* flatMap2() {
        for await (const val of values) {
          yield* val;
        }
      }.call(this);
    }
    function toIntegerOrInfinity(number) {
      number = Number2(number);
      if (NumberIsNaN(number)) {
        return 0;
      }
      if (number < 0) {
        throw new ERR_OUT_OF_RANGE("number", ">= 0", number);
      }
      return number;
    }
    function drop(number, options = void 0) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      number = toIntegerOrInfinity(number);
      return async function* drop2() {
        var _options$signal8;
        if (options !== null && options !== void 0 && (_options$signal8 = options.signal) !== null && _options$signal8 !== void 0 && _options$signal8.aborted) {
          throw new AbortError();
        }
        for await (const val of this) {
          var _options$signal9;
          if (options !== null && options !== void 0 && (_options$signal9 = options.signal) !== null && _options$signal9 !== void 0 && _options$signal9.aborted) {
            throw new AbortError();
          }
          if (number-- <= 0) {
            yield val;
          }
        }
      }.call(this);
    }
    function take(number, options = void 0) {
      if (options != null) {
        validateObject(options, "options");
      }
      if ((options === null || options === void 0 ? void 0 : options.signal) != null) {
        validateAbortSignal(options.signal, "options.signal");
      }
      number = toIntegerOrInfinity(number);
      return async function* take2() {
        var _options$signal10;
        if (options !== null && options !== void 0 && (_options$signal10 = options.signal) !== null && _options$signal10 !== void 0 && _options$signal10.aborted) {
          throw new AbortError();
        }
        for await (const val of this) {
          var _options$signal11;
          if (options !== null && options !== void 0 && (_options$signal11 = options.signal) !== null && _options$signal11 !== void 0 && _options$signal11.aborted) {
            throw new AbortError();
          }
          if (number-- > 0) {
            yield val;
          } else {
            return;
          }
        }
      }.call(this);
    }
    module.exports.streamReturningOperators = {
      asIndexedPairs,
      drop,
      filter,
      flatMap,
      map,
      take
    };
    module.exports.promiseReturningOperators = {
      every,
      forEach: forEach2,
      reduce,
      toArray,
      some,
      find
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/destroy.js
var require_destroy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/destroy.js"(exports, module) {
    "use strict";
    var process2 = require_browser2();
    var {
      aggregateTwoErrors,
      codes: { ERR_MULTIPLE_CALLBACK },
      AbortError
    } = require_errors();
    var { Symbol: Symbol2 } = require_primordials();
    var { kDestroyed, isDestroyed, isFinished, isServerRequest } = require_utils();
    var kDestroy = Symbol2("kDestroy");
    var kConstruct = Symbol2("kConstruct");
    function checkError(err, w, r) {
      if (err) {
        err.stack;
        if (w && !w.errored) {
          w.errored = err;
        }
        if (r && !r.errored) {
          r.errored = err;
        }
      }
    }
    function destroy(err, cb) {
      const r = this._readableState;
      const w = this._writableState;
      const s = w || r;
      if (w && w.destroyed || r && r.destroyed) {
        if (typeof cb === "function") {
          cb();
        }
        return this;
      }
      checkError(err, w, r);
      if (w) {
        w.destroyed = true;
      }
      if (r) {
        r.destroyed = true;
      }
      if (!s.constructed) {
        this.once(kDestroy, function(er) {
          _destroy(this, aggregateTwoErrors(er, err), cb);
        });
      } else {
        _destroy(this, err, cb);
      }
      return this;
    }
    function _destroy(self2, err, cb) {
      let called = false;
      function onDestroy(err2) {
        if (called) {
          return;
        }
        called = true;
        const r = self2._readableState;
        const w = self2._writableState;
        checkError(err2, w, r);
        if (w) {
          w.closed = true;
        }
        if (r) {
          r.closed = true;
        }
        if (typeof cb === "function") {
          cb(err2);
        }
        if (err2) {
          process2.nextTick(emitErrorCloseNT, self2, err2);
        } else {
          process2.nextTick(emitCloseNT, self2);
        }
      }
      try {
        self2._destroy(err || null, onDestroy);
      } catch (err2) {
        onDestroy(err2);
      }
    }
    function emitErrorCloseNT(self2, err) {
      emitErrorNT(self2, err);
      emitCloseNT(self2);
    }
    function emitCloseNT(self2) {
      const r = self2._readableState;
      const w = self2._writableState;
      if (w) {
        w.closeEmitted = true;
      }
      if (r) {
        r.closeEmitted = true;
      }
      if (w && w.emitClose || r && r.emitClose) {
        self2.emit("close");
      }
    }
    function emitErrorNT(self2, err) {
      const r = self2._readableState;
      const w = self2._writableState;
      if (w && w.errorEmitted || r && r.errorEmitted) {
        return;
      }
      if (w) {
        w.errorEmitted = true;
      }
      if (r) {
        r.errorEmitted = true;
      }
      self2.emit("error", err);
    }
    function undestroy() {
      const r = this._readableState;
      const w = this._writableState;
      if (r) {
        r.constructed = true;
        r.closed = false;
        r.closeEmitted = false;
        r.destroyed = false;
        r.errored = null;
        r.errorEmitted = false;
        r.reading = false;
        r.ended = r.readable === false;
        r.endEmitted = r.readable === false;
      }
      if (w) {
        w.constructed = true;
        w.destroyed = false;
        w.closed = false;
        w.closeEmitted = false;
        w.errored = null;
        w.errorEmitted = false;
        w.finalCalled = false;
        w.prefinished = false;
        w.ended = w.writable === false;
        w.ending = w.writable === false;
        w.finished = w.writable === false;
      }
    }
    function errorOrDestroy(stream, err, sync) {
      const r = stream._readableState;
      const w = stream._writableState;
      if (w && w.destroyed || r && r.destroyed) {
        return this;
      }
      if (r && r.autoDestroy || w && w.autoDestroy)
        stream.destroy(err);
      else if (err) {
        err.stack;
        if (w && !w.errored) {
          w.errored = err;
        }
        if (r && !r.errored) {
          r.errored = err;
        }
        if (sync) {
          process2.nextTick(emitErrorNT, stream, err);
        } else {
          emitErrorNT(stream, err);
        }
      }
    }
    function construct(stream, cb) {
      if (typeof stream._construct !== "function") {
        return;
      }
      const r = stream._readableState;
      const w = stream._writableState;
      if (r) {
        r.constructed = false;
      }
      if (w) {
        w.constructed = false;
      }
      stream.once(kConstruct, cb);
      if (stream.listenerCount(kConstruct) > 1) {
        return;
      }
      process2.nextTick(constructNT, stream);
    }
    function constructNT(stream) {
      let called = false;
      function onConstruct(err) {
        if (called) {
          errorOrDestroy(stream, err !== null && err !== void 0 ? err : new ERR_MULTIPLE_CALLBACK());
          return;
        }
        called = true;
        const r = stream._readableState;
        const w = stream._writableState;
        const s = w || r;
        if (r) {
          r.constructed = true;
        }
        if (w) {
          w.constructed = true;
        }
        if (s.destroyed) {
          stream.emit(kDestroy, err);
        } else if (err) {
          errorOrDestroy(stream, err, true);
        } else {
          process2.nextTick(emitConstructNT, stream);
        }
      }
      try {
        stream._construct(onConstruct);
      } catch (err) {
        onConstruct(err);
      }
    }
    function emitConstructNT(stream) {
      stream.emit(kConstruct);
    }
    function isRequest(stream) {
      return stream && stream.setHeader && typeof stream.abort === "function";
    }
    function emitCloseLegacy(stream) {
      stream.emit("close");
    }
    function emitErrorCloseLegacy(stream, err) {
      stream.emit("error", err);
      process2.nextTick(emitCloseLegacy, stream);
    }
    function destroyer(stream, err) {
      if (!stream || isDestroyed(stream)) {
        return;
      }
      if (!err && !isFinished(stream)) {
        err = new AbortError();
      }
      if (isServerRequest(stream)) {
        stream.socket = null;
        stream.destroy(err);
      } else if (isRequest(stream)) {
        stream.abort();
      } else if (isRequest(stream.req)) {
        stream.req.abort();
      } else if (typeof stream.destroy === "function") {
        stream.destroy(err);
      } else if (typeof stream.close === "function") {
        stream.close();
      } else if (err) {
        process2.nextTick(emitErrorCloseLegacy, stream, err);
      } else {
        process2.nextTick(emitCloseLegacy, stream);
      }
      if (!stream.destroyed) {
        stream[kDestroyed] = true;
      }
    }
    module.exports = {
      construct,
      destroyer,
      destroy,
      undestroy,
      errorOrDestroy
    };
  }
});

// node-modules-polyfills-commonjs:events
var require_events = __commonJS({
  "node-modules-polyfills-commonjs:events"(exports, module) {
    var polyfill = (init_events(), __toCommonJS(events_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/legacy.js
var require_legacy = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/legacy.js"(exports, module) {
    "use strict";
    var { ArrayIsArray, ObjectSetPrototypeOf } = require_primordials();
    var { EventEmitter: EE } = require_events();
    function Stream2(opts) {
      EE.call(this, opts);
    }
    ObjectSetPrototypeOf(Stream2.prototype, EE.prototype);
    ObjectSetPrototypeOf(Stream2, EE);
    Stream2.prototype.pipe = function(dest, options) {
      const source = this;
      function ondata(chunk) {
        if (dest.writable && dest.write(chunk) === false && source.pause) {
          source.pause();
        }
      }
      source.on("data", ondata);
      function ondrain() {
        if (source.readable && source.resume) {
          source.resume();
        }
      }
      dest.on("drain", ondrain);
      if (!dest._isStdio && (!options || options.end !== false)) {
        source.on("end", onend2);
        source.on("close", onclose);
      }
      let didOnEnd = false;
      function onend2() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        dest.end();
      }
      function onclose() {
        if (didOnEnd)
          return;
        didOnEnd = true;
        if (typeof dest.destroy === "function")
          dest.destroy();
      }
      function onerror(er) {
        cleanup();
        if (EE.listenerCount(this, "error") === 0) {
          this.emit("error", er);
        }
      }
      prependListener3(source, "error", onerror);
      prependListener3(dest, "error", onerror);
      function cleanup() {
        source.removeListener("data", ondata);
        dest.removeListener("drain", ondrain);
        source.removeListener("end", onend2);
        source.removeListener("close", onclose);
        source.removeListener("error", onerror);
        dest.removeListener("error", onerror);
        source.removeListener("end", cleanup);
        source.removeListener("close", cleanup);
        dest.removeListener("close", cleanup);
      }
      source.on("end", cleanup);
      source.on("close", cleanup);
      dest.on("close", cleanup);
      dest.emit("pipe", source);
      return dest;
    };
    function prependListener3(emitter, event, fn) {
      if (typeof emitter.prependListener === "function")
        return emitter.prependListener(event, fn);
      if (!emitter._events || !emitter._events[event])
        emitter.on(event, fn);
      else if (ArrayIsArray(emitter._events[event]))
        emitter._events[event].unshift(fn);
      else
        emitter._events[event] = [fn, emitter._events[event]];
    }
    module.exports = {
      Stream: Stream2,
      prependListener: prependListener3
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/add-abort-signal.js
var require_add_abort_signal = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/add-abort-signal.js"(exports, module) {
    "use strict";
    var { AbortError, codes } = require_errors();
    var eos = require_end_of_stream();
    var { ERR_INVALID_ARG_TYPE } = codes;
    var validateAbortSignal = (signal, name) => {
      if (typeof signal !== "object" || !("aborted" in signal)) {
        throw new ERR_INVALID_ARG_TYPE(name, "AbortSignal", signal);
      }
    };
    function isNodeStream(obj) {
      return !!(obj && typeof obj.pipe === "function");
    }
    module.exports.addAbortSignal = function addAbortSignal(signal, stream) {
      validateAbortSignal(signal, "signal");
      if (!isNodeStream(stream)) {
        throw new ERR_INVALID_ARG_TYPE("stream", "stream.Stream", stream);
      }
      return module.exports.addAbortSignalNoValidate(signal, stream);
    };
    module.exports.addAbortSignalNoValidate = function(signal, stream) {
      if (typeof signal !== "object" || !("aborted" in signal)) {
        return stream;
      }
      const onAbort = () => {
        stream.destroy(
          new AbortError(void 0, {
            cause: signal.reason
          })
        );
      };
      if (signal.aborted) {
        onAbort();
      } else {
        signal.addEventListener("abort", onAbort);
        eos(stream, () => signal.removeEventListener("abort", onAbort));
      }
      return stream;
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/buffer_list.js
var require_buffer_list = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/buffer_list.js"(exports, module) {
    "use strict";
    var { StringPrototypeSlice, SymbolIterator, TypedArrayPrototypeSet, Uint8Array: Uint8Array2 } = require_primordials();
    var { Buffer: Buffer3 } = require_buffer();
    var { inspect: inspect3 } = require_util();
    module.exports = class BufferList {
      constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
      }
      push(v) {
        const entry = {
          data: v,
          next: null
        };
        if (this.length > 0)
          this.tail.next = entry;
        else
          this.head = entry;
        this.tail = entry;
        ++this.length;
      }
      unshift(v) {
        const entry = {
          data: v,
          next: this.head
        };
        if (this.length === 0)
          this.tail = entry;
        this.head = entry;
        ++this.length;
      }
      shift() {
        if (this.length === 0)
          return;
        const ret = this.head.data;
        if (this.length === 1)
          this.head = this.tail = null;
        else
          this.head = this.head.next;
        --this.length;
        return ret;
      }
      clear() {
        this.head = this.tail = null;
        this.length = 0;
      }
      join(s) {
        if (this.length === 0)
          return "";
        let p = this.head;
        let ret = "" + p.data;
        while ((p = p.next) !== null)
          ret += s + p.data;
        return ret;
      }
      concat(n) {
        if (this.length === 0)
          return Buffer3.alloc(0);
        const ret = Buffer3.allocUnsafe(n >>> 0);
        let p = this.head;
        let i = 0;
        while (p) {
          TypedArrayPrototypeSet(ret, p.data, i);
          i += p.data.length;
          p = p.next;
        }
        return ret;
      }
      consume(n, hasStrings) {
        const data = this.head.data;
        if (n < data.length) {
          const slice2 = data.slice(0, n);
          this.head.data = data.slice(n);
          return slice2;
        }
        if (n === data.length) {
          return this.shift();
        }
        return hasStrings ? this._getString(n) : this._getBuffer(n);
      }
      first() {
        return this.head.data;
      }
      *[SymbolIterator]() {
        for (let p = this.head; p; p = p.next) {
          yield p.data;
        }
      }
      _getString(n) {
        let ret = "";
        let p = this.head;
        let c = 0;
        do {
          const str = p.data;
          if (n > str.length) {
            ret += str;
            n -= str.length;
          } else {
            if (n === str.length) {
              ret += str;
              ++c;
              if (p.next)
                this.head = p.next;
              else
                this.head = this.tail = null;
            } else {
              ret += StringPrototypeSlice(str, 0, n);
              this.head = p;
              p.data = StringPrototypeSlice(str, n);
            }
            break;
          }
          ++c;
        } while ((p = p.next) !== null);
        this.length -= c;
        return ret;
      }
      _getBuffer(n) {
        const ret = Buffer3.allocUnsafe(n);
        const retLen = n;
        let p = this.head;
        let c = 0;
        do {
          const buf = p.data;
          if (n > buf.length) {
            TypedArrayPrototypeSet(ret, buf, retLen - n);
            n -= buf.length;
          } else {
            if (n === buf.length) {
              TypedArrayPrototypeSet(ret, buf, retLen - n);
              ++c;
              if (p.next)
                this.head = p.next;
              else
                this.head = this.tail = null;
            } else {
              TypedArrayPrototypeSet(ret, new Uint8Array2(buf.buffer, buf.byteOffset, n), retLen - n);
              this.head = p;
              p.data = buf.slice(n);
            }
            break;
          }
          ++c;
        } while ((p = p.next) !== null);
        this.length -= c;
        return ret;
      }
      [Symbol.for("nodejs.util.inspect.custom")](_, options) {
        return inspect3(this, {
          ...options,
          depth: 0,
          customInspect: false
        });
      }
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/state.js
var require_state = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/state.js"(exports, module) {
    "use strict";
    var { MathFloor, NumberIsInteger } = require_primordials();
    var { ERR_INVALID_ARG_VALUE } = require_errors().codes;
    function highWaterMarkFrom(options, isDuplex, duplexKey) {
      return options.highWaterMark != null ? options.highWaterMark : isDuplex ? options[duplexKey] : null;
    }
    function getDefaultHighWaterMark(objectMode) {
      return objectMode ? 16 : 16 * 1024;
    }
    function getHighWaterMark(state, options, duplexKey, isDuplex) {
      const hwm = highWaterMarkFrom(options, isDuplex, duplexKey);
      if (hwm != null) {
        if (!NumberIsInteger(hwm) || hwm < 0) {
          const name = isDuplex ? `options.${duplexKey}` : "options.highWaterMark";
          throw new ERR_INVALID_ARG_VALUE(name, hwm);
        }
        return MathFloor(hwm);
      }
      return getDefaultHighWaterMark(state.objectMode);
    }
    module.exports = {
      getHighWaterMark,
      getDefaultHighWaterMark
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/from.js
var require_from = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/from.js"(exports, module) {
    "use strict";
    var process2 = require_browser2();
    var { PromisePrototypeThen, SymbolAsyncIterator, SymbolIterator } = require_primordials();
    var { Buffer: Buffer3 } = require_buffer();
    var { ERR_INVALID_ARG_TYPE, ERR_STREAM_NULL_VALUES } = require_errors().codes;
    function from2(Readable2, iterable, opts) {
      let iterator;
      if (typeof iterable === "string" || iterable instanceof Buffer3) {
        return new Readable2({
          objectMode: true,
          ...opts,
          read() {
            this.push(iterable);
            this.push(null);
          }
        });
      }
      let isAsync;
      if (iterable && iterable[SymbolAsyncIterator]) {
        isAsync = true;
        iterator = iterable[SymbolAsyncIterator]();
      } else if (iterable && iterable[SymbolIterator]) {
        isAsync = false;
        iterator = iterable[SymbolIterator]();
      } else {
        throw new ERR_INVALID_ARG_TYPE("iterable", ["Iterable"], iterable);
      }
      const readable = new Readable2({
        objectMode: true,
        highWaterMark: 1,
        ...opts
      });
      let reading = false;
      readable._read = function() {
        if (!reading) {
          reading = true;
          next();
        }
      };
      readable._destroy = function(error, cb) {
        PromisePrototypeThen(
          close(error),
          () => process2.nextTick(cb, error),
          (e) => process2.nextTick(cb, e || error)
        );
      };
      async function close(error) {
        const hadError = error !== void 0 && error !== null;
        const hasThrow = typeof iterator.throw === "function";
        if (hadError && hasThrow) {
          const { value, done: done2 } = await iterator.throw(error);
          await value;
          if (done2) {
            return;
          }
        }
        if (typeof iterator.return === "function") {
          const { value } = await iterator.return();
          await value;
        }
      }
      async function next() {
        for (; ; ) {
          try {
            const { value, done: done2 } = isAsync ? await iterator.next() : iterator.next();
            if (done2) {
              readable.push(null);
            } else {
              const res = value && typeof value.then === "function" ? await value : value;
              if (res === null) {
                reading = false;
                throw new ERR_STREAM_NULL_VALUES();
              } else if (readable.push(res)) {
                continue;
              } else {
                reading = false;
              }
            }
          } catch (err) {
            readable.destroy(err);
          }
          break;
        }
      }
      return readable;
    }
    module.exports = from2;
  }
});

// node_modules/readable-stream/lib/internal/streams/readable.js
var require_readable = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/readable.js"(exports, module) {
    var process2 = require_browser2();
    var {
      ArrayPrototypeIndexOf,
      NumberIsInteger,
      NumberIsNaN,
      NumberParseInt,
      ObjectDefineProperties,
      ObjectKeys,
      ObjectSetPrototypeOf,
      Promise: Promise2,
      SafeSet,
      SymbolAsyncIterator,
      Symbol: Symbol2
    } = require_primordials();
    module.exports = Readable2;
    Readable2.ReadableState = ReadableState2;
    var { EventEmitter: EE } = require_events();
    var { Stream: Stream2, prependListener: prependListener3 } = require_legacy();
    var { Buffer: Buffer3 } = require_buffer();
    var { addAbortSignal } = require_add_abort_signal();
    var eos = require_end_of_stream();
    var debug2 = require_util().debuglog("stream", (fn) => {
      debug2 = fn;
    });
    var BufferList2 = require_buffer_list();
    var destroyImpl = require_destroy();
    var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
    var {
      aggregateTwoErrors,
      codes: {
        ERR_INVALID_ARG_TYPE,
        ERR_METHOD_NOT_IMPLEMENTED,
        ERR_OUT_OF_RANGE,
        ERR_STREAM_PUSH_AFTER_EOF,
        ERR_STREAM_UNSHIFT_AFTER_END_EVENT
      }
    } = require_errors();
    var { validateObject } = require_validators();
    var kPaused = Symbol2("kPaused");
    var { StringDecoder: StringDecoder2 } = require_string_decoder();
    var from2 = require_from();
    ObjectSetPrototypeOf(Readable2.prototype, Stream2.prototype);
    ObjectSetPrototypeOf(Readable2, Stream2);
    var nop2 = () => {
    };
    var { errorOrDestroy } = destroyImpl;
    function ReadableState2(options, stream, isDuplex) {
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof require_duplex();
      this.objectMode = !!(options && options.objectMode);
      if (isDuplex)
        this.objectMode = this.objectMode || !!(options && options.readableObjectMode);
      this.highWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
      this.buffer = new BufferList2();
      this.length = 0;
      this.pipes = [];
      this.flowing = null;
      this.ended = false;
      this.endEmitted = false;
      this.reading = false;
      this.constructed = true;
      this.sync = true;
      this.needReadable = false;
      this.emittedReadable = false;
      this.readableListening = false;
      this.resumeScheduled = false;
      this[kPaused] = null;
      this.errorEmitted = false;
      this.emitClose = !options || options.emitClose !== false;
      this.autoDestroy = !options || options.autoDestroy !== false;
      this.destroyed = false;
      this.errored = null;
      this.closed = false;
      this.closeEmitted = false;
      this.defaultEncoding = options && options.defaultEncoding || "utf8";
      this.awaitDrainWriters = null;
      this.multiAwaitDrain = false;
      this.readingMore = false;
      this.dataEmitted = false;
      this.decoder = null;
      this.encoding = null;
      if (options && options.encoding) {
        this.decoder = new StringDecoder2(options.encoding);
        this.encoding = options.encoding;
      }
    }
    function Readable2(options) {
      if (!(this instanceof Readable2))
        return new Readable2(options);
      const isDuplex = this instanceof require_duplex();
      this._readableState = new ReadableState2(options, this, isDuplex);
      if (options) {
        if (typeof options.read === "function")
          this._read = options.read;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.construct === "function")
          this._construct = options.construct;
        if (options.signal && !isDuplex)
          addAbortSignal(options.signal, this);
      }
      Stream2.call(this, options);
      destroyImpl.construct(this, () => {
        if (this._readableState.needReadable) {
          maybeReadMore2(this, this._readableState);
        }
      });
    }
    Readable2.prototype.destroy = destroyImpl.destroy;
    Readable2.prototype._undestroy = destroyImpl.undestroy;
    Readable2.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Readable2.prototype[EE.captureRejectionSymbol] = function(err) {
      this.destroy(err);
    };
    Readable2.prototype.push = function(chunk, encoding) {
      return readableAddChunk2(this, chunk, encoding, false);
    };
    Readable2.prototype.unshift = function(chunk, encoding) {
      return readableAddChunk2(this, chunk, encoding, true);
    };
    function readableAddChunk2(stream, chunk, encoding, addToFront) {
      debug2("readableAddChunk", chunk);
      const state = stream._readableState;
      let err;
      if (!state.objectMode) {
        if (typeof chunk === "string") {
          encoding = encoding || state.defaultEncoding;
          if (state.encoding !== encoding) {
            if (addToFront && state.encoding) {
              chunk = Buffer3.from(chunk, encoding).toString(state.encoding);
            } else {
              chunk = Buffer3.from(chunk, encoding);
              encoding = "";
            }
          }
        } else if (chunk instanceof Buffer3) {
          encoding = "";
        } else if (Stream2._isUint8Array(chunk)) {
          chunk = Stream2._uint8ArrayToBuffer(chunk);
          encoding = "";
        } else if (chunk != null) {
          err = new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
        }
      }
      if (err) {
        errorOrDestroy(stream, err);
      } else if (chunk === null) {
        state.reading = false;
        onEofChunk2(stream, state);
      } else if (state.objectMode || chunk && chunk.length > 0) {
        if (addToFront) {
          if (state.endEmitted)
            errorOrDestroy(stream, new ERR_STREAM_UNSHIFT_AFTER_END_EVENT());
          else if (state.destroyed || state.errored)
            return false;
          else
            addChunk(stream, state, chunk, true);
        } else if (state.ended) {
          errorOrDestroy(stream, new ERR_STREAM_PUSH_AFTER_EOF());
        } else if (state.destroyed || state.errored) {
          return false;
        } else {
          state.reading = false;
          if (state.decoder && !encoding) {
            chunk = state.decoder.write(chunk);
            if (state.objectMode || chunk.length !== 0)
              addChunk(stream, state, chunk, false);
            else
              maybeReadMore2(stream, state);
          } else {
            addChunk(stream, state, chunk, false);
          }
        }
      } else if (!addToFront) {
        state.reading = false;
        maybeReadMore2(stream, state);
      }
      return !state.ended && (state.length < state.highWaterMark || state.length === 0);
    }
    function addChunk(stream, state, chunk, addToFront) {
      if (state.flowing && state.length === 0 && !state.sync && stream.listenerCount("data") > 0) {
        if (state.multiAwaitDrain) {
          state.awaitDrainWriters.clear();
        } else {
          state.awaitDrainWriters = null;
        }
        state.dataEmitted = true;
        stream.emit("data", chunk);
      } else {
        state.length += state.objectMode ? 1 : chunk.length;
        if (addToFront)
          state.buffer.unshift(chunk);
        else
          state.buffer.push(chunk);
        if (state.needReadable)
          emitReadable2(stream);
      }
      maybeReadMore2(stream, state);
    }
    Readable2.prototype.isPaused = function() {
      const state = this._readableState;
      return state[kPaused] === true || state.flowing === false;
    };
    Readable2.prototype.setEncoding = function(enc) {
      const decoder = new StringDecoder2(enc);
      this._readableState.decoder = decoder;
      this._readableState.encoding = this._readableState.decoder.encoding;
      const buffer = this._readableState.buffer;
      let content = "";
      for (const data of buffer) {
        content += decoder.write(data);
      }
      buffer.clear();
      if (content !== "")
        buffer.push(content);
      this._readableState.length = content.length;
      return this;
    };
    var MAX_HWM2 = 1073741824;
    function computeNewHighWaterMark2(n) {
      if (n > MAX_HWM2) {
        throw new ERR_OUT_OF_RANGE("size", "<= 1GiB", n);
      } else {
        n--;
        n |= n >>> 1;
        n |= n >>> 2;
        n |= n >>> 4;
        n |= n >>> 8;
        n |= n >>> 16;
        n++;
      }
      return n;
    }
    function howMuchToRead2(n, state) {
      if (n <= 0 || state.length === 0 && state.ended)
        return 0;
      if (state.objectMode)
        return 1;
      if (NumberIsNaN(n)) {
        if (state.flowing && state.length)
          return state.buffer.first().length;
        return state.length;
      }
      if (n <= state.length)
        return n;
      return state.ended ? state.length : 0;
    }
    Readable2.prototype.read = function(n) {
      debug2("read", n);
      if (n === void 0) {
        n = NaN;
      } else if (!NumberIsInteger(n)) {
        n = NumberParseInt(n, 10);
      }
      const state = this._readableState;
      const nOrig = n;
      if (n > state.highWaterMark)
        state.highWaterMark = computeNewHighWaterMark2(n);
      if (n !== 0)
        state.emittedReadable = false;
      if (n === 0 && state.needReadable && ((state.highWaterMark !== 0 ? state.length >= state.highWaterMark : state.length > 0) || state.ended)) {
        debug2("read: emitReadable", state.length, state.ended);
        if (state.length === 0 && state.ended)
          endReadable2(this);
        else
          emitReadable2(this);
        return null;
      }
      n = howMuchToRead2(n, state);
      if (n === 0 && state.ended) {
        if (state.length === 0)
          endReadable2(this);
        return null;
      }
      let doRead = state.needReadable;
      debug2("need readable", doRead);
      if (state.length === 0 || state.length - n < state.highWaterMark) {
        doRead = true;
        debug2("length less than watermark", doRead);
      }
      if (state.ended || state.reading || state.destroyed || state.errored || !state.constructed) {
        doRead = false;
        debug2("reading, ended or constructing", doRead);
      } else if (doRead) {
        debug2("do read");
        state.reading = true;
        state.sync = true;
        if (state.length === 0)
          state.needReadable = true;
        try {
          this._read(state.highWaterMark);
        } catch (err) {
          errorOrDestroy(this, err);
        }
        state.sync = false;
        if (!state.reading)
          n = howMuchToRead2(nOrig, state);
      }
      let ret;
      if (n > 0)
        ret = fromList2(n, state);
      else
        ret = null;
      if (ret === null) {
        state.needReadable = state.length <= state.highWaterMark;
        n = 0;
      } else {
        state.length -= n;
        if (state.multiAwaitDrain) {
          state.awaitDrainWriters.clear();
        } else {
          state.awaitDrainWriters = null;
        }
      }
      if (state.length === 0) {
        if (!state.ended)
          state.needReadable = true;
        if (nOrig !== n && state.ended)
          endReadable2(this);
      }
      if (ret !== null && !state.errorEmitted && !state.closeEmitted) {
        state.dataEmitted = true;
        this.emit("data", ret);
      }
      return ret;
    };
    function onEofChunk2(stream, state) {
      debug2("onEofChunk");
      if (state.ended)
        return;
      if (state.decoder) {
        const chunk = state.decoder.end();
        if (chunk && chunk.length) {
          state.buffer.push(chunk);
          state.length += state.objectMode ? 1 : chunk.length;
        }
      }
      state.ended = true;
      if (state.sync) {
        emitReadable2(stream);
      } else {
        state.needReadable = false;
        state.emittedReadable = true;
        emitReadable_2(stream);
      }
    }
    function emitReadable2(stream) {
      const state = stream._readableState;
      debug2("emitReadable", state.needReadable, state.emittedReadable);
      state.needReadable = false;
      if (!state.emittedReadable) {
        debug2("emitReadable", state.flowing);
        state.emittedReadable = true;
        process2.nextTick(emitReadable_2, stream);
      }
    }
    function emitReadable_2(stream) {
      const state = stream._readableState;
      debug2("emitReadable_", state.destroyed, state.length, state.ended);
      if (!state.destroyed && !state.errored && (state.length || state.ended)) {
        stream.emit("readable");
        state.emittedReadable = false;
      }
      state.needReadable = !state.flowing && !state.ended && state.length <= state.highWaterMark;
      flow2(stream);
    }
    function maybeReadMore2(stream, state) {
      if (!state.readingMore && state.constructed) {
        state.readingMore = true;
        process2.nextTick(maybeReadMore_2, stream, state);
      }
    }
    function maybeReadMore_2(stream, state) {
      while (!state.reading && !state.ended && (state.length < state.highWaterMark || state.flowing && state.length === 0)) {
        const len = state.length;
        debug2("maybeReadMore read 0");
        stream.read(0);
        if (len === state.length)
          break;
      }
      state.readingMore = false;
    }
    Readable2.prototype._read = function(n) {
      throw new ERR_METHOD_NOT_IMPLEMENTED("_read()");
    };
    Readable2.prototype.pipe = function(dest, pipeOpts) {
      const src = this;
      const state = this._readableState;
      if (state.pipes.length === 1) {
        if (!state.multiAwaitDrain) {
          state.multiAwaitDrain = true;
          state.awaitDrainWriters = new SafeSet(state.awaitDrainWriters ? [state.awaitDrainWriters] : []);
        }
      }
      state.pipes.push(dest);
      debug2("pipe count=%d opts=%j", state.pipes.length, pipeOpts);
      const doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process2.stdout && dest !== process2.stderr;
      const endFn = doEnd ? onend2 : unpipe;
      if (state.endEmitted)
        process2.nextTick(endFn);
      else
        src.once("end", endFn);
      dest.on("unpipe", onunpipe);
      function onunpipe(readable, unpipeInfo) {
        debug2("onunpipe");
        if (readable === src) {
          if (unpipeInfo && unpipeInfo.hasUnpiped === false) {
            unpipeInfo.hasUnpiped = true;
            cleanup();
          }
        }
      }
      function onend2() {
        debug2("onend");
        dest.end();
      }
      let ondrain;
      let cleanedUp = false;
      function cleanup() {
        debug2("cleanup");
        dest.removeListener("close", onclose);
        dest.removeListener("finish", onfinish);
        if (ondrain) {
          dest.removeListener("drain", ondrain);
        }
        dest.removeListener("error", onerror);
        dest.removeListener("unpipe", onunpipe);
        src.removeListener("end", onend2);
        src.removeListener("end", unpipe);
        src.removeListener("data", ondata);
        cleanedUp = true;
        if (ondrain && state.awaitDrainWriters && (!dest._writableState || dest._writableState.needDrain))
          ondrain();
      }
      function pause() {
        if (!cleanedUp) {
          if (state.pipes.length === 1 && state.pipes[0] === dest) {
            debug2("false write response, pause", 0);
            state.awaitDrainWriters = dest;
            state.multiAwaitDrain = false;
          } else if (state.pipes.length > 1 && state.pipes.includes(dest)) {
            debug2("false write response, pause", state.awaitDrainWriters.size);
            state.awaitDrainWriters.add(dest);
          }
          src.pause();
        }
        if (!ondrain) {
          ondrain = pipeOnDrain2(src, dest);
          dest.on("drain", ondrain);
        }
      }
      src.on("data", ondata);
      function ondata(chunk) {
        debug2("ondata");
        const ret = dest.write(chunk);
        debug2("dest.write", ret);
        if (ret === false) {
          pause();
        }
      }
      function onerror(er) {
        debug2("onerror", er);
        unpipe();
        dest.removeListener("error", onerror);
        if (dest.listenerCount("error") === 0) {
          const s = dest._writableState || dest._readableState;
          if (s && !s.errorEmitted) {
            errorOrDestroy(dest, er);
          } else {
            dest.emit("error", er);
          }
        }
      }
      prependListener3(dest, "error", onerror);
      function onclose() {
        dest.removeListener("finish", onfinish);
        unpipe();
      }
      dest.once("close", onclose);
      function onfinish() {
        debug2("onfinish");
        dest.removeListener("close", onclose);
        unpipe();
      }
      dest.once("finish", onfinish);
      function unpipe() {
        debug2("unpipe");
        src.unpipe(dest);
      }
      dest.emit("pipe", src);
      if (dest.writableNeedDrain === true) {
        if (state.flowing) {
          pause();
        }
      } else if (!state.flowing) {
        debug2("pipe resume");
        src.resume();
      }
      return dest;
    };
    function pipeOnDrain2(src, dest) {
      return function pipeOnDrainFunctionResult() {
        const state = src._readableState;
        if (state.awaitDrainWriters === dest) {
          debug2("pipeOnDrain", 1);
          state.awaitDrainWriters = null;
        } else if (state.multiAwaitDrain) {
          debug2("pipeOnDrain", state.awaitDrainWriters.size);
          state.awaitDrainWriters.delete(dest);
        }
        if ((!state.awaitDrainWriters || state.awaitDrainWriters.size === 0) && src.listenerCount("data")) {
          src.resume();
        }
      };
    }
    Readable2.prototype.unpipe = function(dest) {
      const state = this._readableState;
      const unpipeInfo = {
        hasUnpiped: false
      };
      if (state.pipes.length === 0)
        return this;
      if (!dest) {
        const dests = state.pipes;
        state.pipes = [];
        this.pause();
        for (let i = 0; i < dests.length; i++)
          dests[i].emit("unpipe", this, {
            hasUnpiped: false
          });
        return this;
      }
      const index = ArrayPrototypeIndexOf(state.pipes, dest);
      if (index === -1)
        return this;
      state.pipes.splice(index, 1);
      if (state.pipes.length === 0)
        this.pause();
      dest.emit("unpipe", this, unpipeInfo);
      return this;
    };
    Readable2.prototype.on = function(ev, fn) {
      const res = Stream2.prototype.on.call(this, ev, fn);
      const state = this._readableState;
      if (ev === "data") {
        state.readableListening = this.listenerCount("readable") > 0;
        if (state.flowing !== false)
          this.resume();
      } else if (ev === "readable") {
        if (!state.endEmitted && !state.readableListening) {
          state.readableListening = state.needReadable = true;
          state.flowing = false;
          state.emittedReadable = false;
          debug2("on readable", state.length, state.reading);
          if (state.length) {
            emitReadable2(this);
          } else if (!state.reading) {
            process2.nextTick(nReadingNextTick2, this);
          }
        }
      }
      return res;
    };
    Readable2.prototype.addListener = Readable2.prototype.on;
    Readable2.prototype.removeListener = function(ev, fn) {
      const res = Stream2.prototype.removeListener.call(this, ev, fn);
      if (ev === "readable") {
        process2.nextTick(updateReadableListening, this);
      }
      return res;
    };
    Readable2.prototype.off = Readable2.prototype.removeListener;
    Readable2.prototype.removeAllListeners = function(ev) {
      const res = Stream2.prototype.removeAllListeners.apply(this, arguments);
      if (ev === "readable" || ev === void 0) {
        process2.nextTick(updateReadableListening, this);
      }
      return res;
    };
    function updateReadableListening(self2) {
      const state = self2._readableState;
      state.readableListening = self2.listenerCount("readable") > 0;
      if (state.resumeScheduled && state[kPaused] === false) {
        state.flowing = true;
      } else if (self2.listenerCount("data") > 0) {
        self2.resume();
      } else if (!state.readableListening) {
        state.flowing = null;
      }
    }
    function nReadingNextTick2(self2) {
      debug2("readable nexttick read 0");
      self2.read(0);
    }
    Readable2.prototype.resume = function() {
      const state = this._readableState;
      if (!state.flowing) {
        debug2("resume");
        state.flowing = !state.readableListening;
        resume2(this, state);
      }
      state[kPaused] = false;
      return this;
    };
    function resume2(stream, state) {
      if (!state.resumeScheduled) {
        state.resumeScheduled = true;
        process2.nextTick(resume_2, stream, state);
      }
    }
    function resume_2(stream, state) {
      debug2("resume", state.reading);
      if (!state.reading) {
        stream.read(0);
      }
      state.resumeScheduled = false;
      stream.emit("resume");
      flow2(stream);
      if (state.flowing && !state.reading)
        stream.read(0);
    }
    Readable2.prototype.pause = function() {
      debug2("call pause flowing=%j", this._readableState.flowing);
      if (this._readableState.flowing !== false) {
        debug2("pause");
        this._readableState.flowing = false;
        this.emit("pause");
      }
      this._readableState[kPaused] = true;
      return this;
    };
    function flow2(stream) {
      const state = stream._readableState;
      debug2("flow", state.flowing);
      while (state.flowing && stream.read() !== null)
        ;
    }
    Readable2.prototype.wrap = function(stream) {
      let paused = false;
      stream.on("data", (chunk) => {
        if (!this.push(chunk) && stream.pause) {
          paused = true;
          stream.pause();
        }
      });
      stream.on("end", () => {
        this.push(null);
      });
      stream.on("error", (err) => {
        errorOrDestroy(this, err);
      });
      stream.on("close", () => {
        this.destroy();
      });
      stream.on("destroy", () => {
        this.destroy();
      });
      this._read = () => {
        if (paused && stream.resume) {
          paused = false;
          stream.resume();
        }
      };
      const streamKeys = ObjectKeys(stream);
      for (let j = 1; j < streamKeys.length; j++) {
        const i = streamKeys[j];
        if (this[i] === void 0 && typeof stream[i] === "function") {
          this[i] = stream[i].bind(stream);
        }
      }
      return this;
    };
    Readable2.prototype[SymbolAsyncIterator] = function() {
      return streamToAsyncIterator(this);
    };
    Readable2.prototype.iterator = function(options) {
      if (options !== void 0) {
        validateObject(options, "options");
      }
      return streamToAsyncIterator(this, options);
    };
    function streamToAsyncIterator(stream, options) {
      if (typeof stream.read !== "function") {
        stream = Readable2.wrap(stream, {
          objectMode: true
        });
      }
      const iter = createAsyncIterator(stream, options);
      iter.stream = stream;
      return iter;
    }
    async function* createAsyncIterator(stream, options) {
      let callback = nop2;
      function next(resolve) {
        if (this === stream) {
          callback();
          callback = nop2;
        } else {
          callback = resolve;
        }
      }
      stream.on("readable", next);
      let error;
      const cleanup = eos(
        stream,
        {
          writable: false
        },
        (err) => {
          error = err ? aggregateTwoErrors(error, err) : null;
          callback();
          callback = nop2;
        }
      );
      try {
        while (true) {
          const chunk = stream.destroyed ? null : stream.read();
          if (chunk !== null) {
            yield chunk;
          } else if (error) {
            throw error;
          } else if (error === null) {
            return;
          } else {
            await new Promise2(next);
          }
        }
      } catch (err) {
        error = aggregateTwoErrors(error, err);
        throw error;
      } finally {
        if ((error || (options === null || options === void 0 ? void 0 : options.destroyOnReturn) !== false) && (error === void 0 || stream._readableState.autoDestroy)) {
          destroyImpl.destroyer(stream, null);
        } else {
          stream.off("readable", next);
          cleanup();
        }
      }
    }
    ObjectDefineProperties(Readable2.prototype, {
      readable: {
        __proto__: null,
        get() {
          const r = this._readableState;
          return !!r && r.readable !== false && !r.destroyed && !r.errorEmitted && !r.endEmitted;
        },
        set(val) {
          if (this._readableState) {
            this._readableState.readable = !!val;
          }
        }
      },
      readableDidRead: {
        __proto__: null,
        enumerable: false,
        get: function() {
          return this._readableState.dataEmitted;
        }
      },
      readableAborted: {
        __proto__: null,
        enumerable: false,
        get: function() {
          return !!(this._readableState.readable !== false && (this._readableState.destroyed || this._readableState.errored) && !this._readableState.endEmitted);
        }
      },
      readableHighWaterMark: {
        __proto__: null,
        enumerable: false,
        get: function() {
          return this._readableState.highWaterMark;
        }
      },
      readableBuffer: {
        __proto__: null,
        enumerable: false,
        get: function() {
          return this._readableState && this._readableState.buffer;
        }
      },
      readableFlowing: {
        __proto__: null,
        enumerable: false,
        get: function() {
          return this._readableState.flowing;
        },
        set: function(state) {
          if (this._readableState) {
            this._readableState.flowing = state;
          }
        }
      },
      readableLength: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState.length;
        }
      },
      readableObjectMode: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.objectMode : false;
        }
      },
      readableEncoding: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.encoding : null;
        }
      },
      errored: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.errored : null;
        }
      },
      closed: {
        __proto__: null,
        get() {
          return this._readableState ? this._readableState.closed : false;
        }
      },
      destroyed: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.destroyed : false;
        },
        set(value) {
          if (!this._readableState) {
            return;
          }
          this._readableState.destroyed = value;
        }
      },
      readableEnded: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._readableState ? this._readableState.endEmitted : false;
        }
      }
    });
    ObjectDefineProperties(ReadableState2.prototype, {
      pipesCount: {
        __proto__: null,
        get() {
          return this.pipes.length;
        }
      },
      paused: {
        __proto__: null,
        get() {
          return this[kPaused] !== false;
        },
        set(value) {
          this[kPaused] = !!value;
        }
      }
    });
    Readable2._fromList = fromList2;
    function fromList2(n, state) {
      if (state.length === 0)
        return null;
      let ret;
      if (state.objectMode)
        ret = state.buffer.shift();
      else if (!n || n >= state.length) {
        if (state.decoder)
          ret = state.buffer.join("");
        else if (state.buffer.length === 1)
          ret = state.buffer.first();
        else
          ret = state.buffer.concat(state.length);
        state.buffer.clear();
      } else {
        ret = state.buffer.consume(n, state.decoder);
      }
      return ret;
    }
    function endReadable2(stream) {
      const state = stream._readableState;
      debug2("endReadable", state.endEmitted);
      if (!state.endEmitted) {
        state.ended = true;
        process2.nextTick(endReadableNT2, state, stream);
      }
    }
    function endReadableNT2(state, stream) {
      debug2("endReadableNT", state.endEmitted, state.length);
      if (!state.errored && !state.closeEmitted && !state.endEmitted && state.length === 0) {
        state.endEmitted = true;
        stream.emit("end");
        if (stream.writable && stream.allowHalfOpen === false) {
          process2.nextTick(endWritableNT, stream);
        } else if (state.autoDestroy) {
          const wState = stream._writableState;
          const autoDestroy = !wState || wState.autoDestroy && (wState.finished || wState.writable === false);
          if (autoDestroy) {
            stream.destroy();
          }
        }
      }
    }
    function endWritableNT(stream) {
      const writable = stream.writable && !stream.writableEnded && !stream.destroyed;
      if (writable) {
        stream.end();
      }
    }
    Readable2.from = function(iterable, opts) {
      return from2(Readable2, iterable, opts);
    };
    var webStreamsAdapters;
    function lazyWebStreams() {
      if (webStreamsAdapters === void 0)
        webStreamsAdapters = {};
      return webStreamsAdapters;
    }
    Readable2.fromWeb = function(readableStream, options) {
      return lazyWebStreams().newStreamReadableFromReadableStream(readableStream, options);
    };
    Readable2.toWeb = function(streamReadable, options) {
      return lazyWebStreams().newReadableStreamFromStreamReadable(streamReadable, options);
    };
    Readable2.wrap = function(src, options) {
      var _ref, _src$readableObjectMo;
      return new Readable2({
        objectMode: (_ref = (_src$readableObjectMo = src.readableObjectMode) !== null && _src$readableObjectMo !== void 0 ? _src$readableObjectMo : src.objectMode) !== null && _ref !== void 0 ? _ref : true,
        ...options,
        destroy(err, callback) {
          destroyImpl.destroyer(src, err);
          callback(err);
        }
      }).wrap(src);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/writable.js
var require_writable = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/writable.js"(exports, module) {
    var process2 = require_browser2();
    var {
      ArrayPrototypeSlice,
      Error: Error2,
      FunctionPrototypeSymbolHasInstance,
      ObjectDefineProperty,
      ObjectDefineProperties,
      ObjectSetPrototypeOf,
      StringPrototypeToLowerCase,
      Symbol: Symbol2,
      SymbolHasInstance
    } = require_primordials();
    module.exports = Writable2;
    Writable2.WritableState = WritableState2;
    var { EventEmitter: EE } = require_events();
    var Stream2 = require_legacy().Stream;
    var { Buffer: Buffer3 } = require_buffer();
    var destroyImpl = require_destroy();
    var { addAbortSignal } = require_add_abort_signal();
    var { getHighWaterMark, getDefaultHighWaterMark } = require_state();
    var {
      ERR_INVALID_ARG_TYPE,
      ERR_METHOD_NOT_IMPLEMENTED,
      ERR_MULTIPLE_CALLBACK,
      ERR_STREAM_CANNOT_PIPE,
      ERR_STREAM_DESTROYED,
      ERR_STREAM_ALREADY_FINISHED,
      ERR_STREAM_NULL_VALUES,
      ERR_STREAM_WRITE_AFTER_END,
      ERR_UNKNOWN_ENCODING
    } = require_errors().codes;
    var { errorOrDestroy } = destroyImpl;
    ObjectSetPrototypeOf(Writable2.prototype, Stream2.prototype);
    ObjectSetPrototypeOf(Writable2, Stream2);
    function nop2() {
    }
    var kOnFinished = Symbol2("kOnFinished");
    function WritableState2(options, stream, isDuplex) {
      if (typeof isDuplex !== "boolean")
        isDuplex = stream instanceof require_duplex();
      this.objectMode = !!(options && options.objectMode);
      if (isDuplex)
        this.objectMode = this.objectMode || !!(options && options.writableObjectMode);
      this.highWaterMark = options ? getHighWaterMark(this, options, "writableHighWaterMark", isDuplex) : getDefaultHighWaterMark(false);
      this.finalCalled = false;
      this.needDrain = false;
      this.ending = false;
      this.ended = false;
      this.finished = false;
      this.destroyed = false;
      const noDecode = !!(options && options.decodeStrings === false);
      this.decodeStrings = !noDecode;
      this.defaultEncoding = options && options.defaultEncoding || "utf8";
      this.length = 0;
      this.writing = false;
      this.corked = 0;
      this.sync = true;
      this.bufferProcessing = false;
      this.onwrite = onwrite2.bind(void 0, stream);
      this.writecb = null;
      this.writelen = 0;
      this.afterWriteTickInfo = null;
      resetBuffer(this);
      this.pendingcb = 0;
      this.constructed = true;
      this.prefinished = false;
      this.errorEmitted = false;
      this.emitClose = !options || options.emitClose !== false;
      this.autoDestroy = !options || options.autoDestroy !== false;
      this.errored = null;
      this.closed = false;
      this.closeEmitted = false;
      this[kOnFinished] = [];
    }
    function resetBuffer(state) {
      state.buffered = [];
      state.bufferedIndex = 0;
      state.allBuffers = true;
      state.allNoop = true;
    }
    WritableState2.prototype.getBuffer = function getBuffer() {
      return ArrayPrototypeSlice(this.buffered, this.bufferedIndex);
    };
    ObjectDefineProperty(WritableState2.prototype, "bufferedRequestCount", {
      __proto__: null,
      get() {
        return this.buffered.length - this.bufferedIndex;
      }
    });
    function Writable2(options) {
      const isDuplex = this instanceof require_duplex();
      if (!isDuplex && !FunctionPrototypeSymbolHasInstance(Writable2, this))
        return new Writable2(options);
      this._writableState = new WritableState2(options, this, isDuplex);
      if (options) {
        if (typeof options.write === "function")
          this._write = options.write;
        if (typeof options.writev === "function")
          this._writev = options.writev;
        if (typeof options.destroy === "function")
          this._destroy = options.destroy;
        if (typeof options.final === "function")
          this._final = options.final;
        if (typeof options.construct === "function")
          this._construct = options.construct;
        if (options.signal)
          addAbortSignal(options.signal, this);
      }
      Stream2.call(this, options);
      destroyImpl.construct(this, () => {
        const state = this._writableState;
        if (!state.writing) {
          clearBuffer2(this, state);
        }
        finishMaybe2(this, state);
      });
    }
    ObjectDefineProperty(Writable2, SymbolHasInstance, {
      __proto__: null,
      value: function(object) {
        if (FunctionPrototypeSymbolHasInstance(this, object))
          return true;
        if (this !== Writable2)
          return false;
        return object && object._writableState instanceof WritableState2;
      }
    });
    Writable2.prototype.pipe = function() {
      errorOrDestroy(this, new ERR_STREAM_CANNOT_PIPE());
    };
    function _write(stream, chunk, encoding, cb) {
      const state = stream._writableState;
      if (typeof encoding === "function") {
        cb = encoding;
        encoding = state.defaultEncoding;
      } else {
        if (!encoding)
          encoding = state.defaultEncoding;
        else if (encoding !== "buffer" && !Buffer3.isEncoding(encoding))
          throw new ERR_UNKNOWN_ENCODING(encoding);
        if (typeof cb !== "function")
          cb = nop2;
      }
      if (chunk === null) {
        throw new ERR_STREAM_NULL_VALUES();
      } else if (!state.objectMode) {
        if (typeof chunk === "string") {
          if (state.decodeStrings !== false) {
            chunk = Buffer3.from(chunk, encoding);
            encoding = "buffer";
          }
        } else if (chunk instanceof Buffer3) {
          encoding = "buffer";
        } else if (Stream2._isUint8Array(chunk)) {
          chunk = Stream2._uint8ArrayToBuffer(chunk);
          encoding = "buffer";
        } else {
          throw new ERR_INVALID_ARG_TYPE("chunk", ["string", "Buffer", "Uint8Array"], chunk);
        }
      }
      let err;
      if (state.ending) {
        err = new ERR_STREAM_WRITE_AFTER_END();
      } else if (state.destroyed) {
        err = new ERR_STREAM_DESTROYED("write");
      }
      if (err) {
        process2.nextTick(cb, err);
        errorOrDestroy(stream, err, true);
        return err;
      }
      state.pendingcb++;
      return writeOrBuffer2(stream, state, chunk, encoding, cb);
    }
    Writable2.prototype.write = function(chunk, encoding, cb) {
      return _write(this, chunk, encoding, cb) === true;
    };
    Writable2.prototype.cork = function() {
      this._writableState.corked++;
    };
    Writable2.prototype.uncork = function() {
      const state = this._writableState;
      if (state.corked) {
        state.corked--;
        if (!state.writing)
          clearBuffer2(this, state);
      }
    };
    Writable2.prototype.setDefaultEncoding = function setDefaultEncoding2(encoding) {
      if (typeof encoding === "string")
        encoding = StringPrototypeToLowerCase(encoding);
      if (!Buffer3.isEncoding(encoding))
        throw new ERR_UNKNOWN_ENCODING(encoding);
      this._writableState.defaultEncoding = encoding;
      return this;
    };
    function writeOrBuffer2(stream, state, chunk, encoding, callback) {
      const len = state.objectMode ? 1 : chunk.length;
      state.length += len;
      const ret = state.length < state.highWaterMark;
      if (!ret)
        state.needDrain = true;
      if (state.writing || state.corked || state.errored || !state.constructed) {
        state.buffered.push({
          chunk,
          encoding,
          callback
        });
        if (state.allBuffers && encoding !== "buffer") {
          state.allBuffers = false;
        }
        if (state.allNoop && callback !== nop2) {
          state.allNoop = false;
        }
      } else {
        state.writelen = len;
        state.writecb = callback;
        state.writing = true;
        state.sync = true;
        stream._write(chunk, encoding, state.onwrite);
        state.sync = false;
      }
      return ret && !state.errored && !state.destroyed;
    }
    function doWrite2(stream, state, writev, len, chunk, encoding, cb) {
      state.writelen = len;
      state.writecb = cb;
      state.writing = true;
      state.sync = true;
      if (state.destroyed)
        state.onwrite(new ERR_STREAM_DESTROYED("write"));
      else if (writev)
        stream._writev(chunk, state.onwrite);
      else
        stream._write(chunk, encoding, state.onwrite);
      state.sync = false;
    }
    function onwriteError2(stream, state, er, cb) {
      --state.pendingcb;
      cb(er);
      errorBuffer(state);
      errorOrDestroy(stream, er);
    }
    function onwrite2(stream, er) {
      const state = stream._writableState;
      const sync = state.sync;
      const cb = state.writecb;
      if (typeof cb !== "function") {
        errorOrDestroy(stream, new ERR_MULTIPLE_CALLBACK());
        return;
      }
      state.writing = false;
      state.writecb = null;
      state.length -= state.writelen;
      state.writelen = 0;
      if (er) {
        er.stack;
        if (!state.errored) {
          state.errored = er;
        }
        if (stream._readableState && !stream._readableState.errored) {
          stream._readableState.errored = er;
        }
        if (sync) {
          process2.nextTick(onwriteError2, stream, state, er, cb);
        } else {
          onwriteError2(stream, state, er, cb);
        }
      } else {
        if (state.buffered.length > state.bufferedIndex) {
          clearBuffer2(stream, state);
        }
        if (sync) {
          if (state.afterWriteTickInfo !== null && state.afterWriteTickInfo.cb === cb) {
            state.afterWriteTickInfo.count++;
          } else {
            state.afterWriteTickInfo = {
              count: 1,
              cb,
              stream,
              state
            };
            process2.nextTick(afterWriteTick, state.afterWriteTickInfo);
          }
        } else {
          afterWrite2(stream, state, 1, cb);
        }
      }
    }
    function afterWriteTick({ stream, state, count, cb }) {
      state.afterWriteTickInfo = null;
      return afterWrite2(stream, state, count, cb);
    }
    function afterWrite2(stream, state, count, cb) {
      const needDrain = !state.ending && !stream.destroyed && state.length === 0 && state.needDrain;
      if (needDrain) {
        state.needDrain = false;
        stream.emit("drain");
      }
      while (count-- > 0) {
        state.pendingcb--;
        cb();
      }
      if (state.destroyed) {
        errorBuffer(state);
      }
      finishMaybe2(stream, state);
    }
    function errorBuffer(state) {
      if (state.writing) {
        return;
      }
      for (let n = state.bufferedIndex; n < state.buffered.length; ++n) {
        var _state$errored;
        const { chunk, callback } = state.buffered[n];
        const len = state.objectMode ? 1 : chunk.length;
        state.length -= len;
        callback(
          (_state$errored = state.errored) !== null && _state$errored !== void 0 ? _state$errored : new ERR_STREAM_DESTROYED("write")
        );
      }
      const onfinishCallbacks = state[kOnFinished].splice(0);
      for (let i = 0; i < onfinishCallbacks.length; i++) {
        var _state$errored2;
        onfinishCallbacks[i](
          (_state$errored2 = state.errored) !== null && _state$errored2 !== void 0 ? _state$errored2 : new ERR_STREAM_DESTROYED("end")
        );
      }
      resetBuffer(state);
    }
    function clearBuffer2(stream, state) {
      if (state.corked || state.bufferProcessing || state.destroyed || !state.constructed) {
        return;
      }
      const { buffered, bufferedIndex, objectMode } = state;
      const bufferedLength = buffered.length - bufferedIndex;
      if (!bufferedLength) {
        return;
      }
      let i = bufferedIndex;
      state.bufferProcessing = true;
      if (bufferedLength > 1 && stream._writev) {
        state.pendingcb -= bufferedLength - 1;
        const callback = state.allNoop ? nop2 : (err) => {
          for (let n = i; n < buffered.length; ++n) {
            buffered[n].callback(err);
          }
        };
        const chunks = state.allNoop && i === 0 ? buffered : ArrayPrototypeSlice(buffered, i);
        chunks.allBuffers = state.allBuffers;
        doWrite2(stream, state, true, state.length, chunks, "", callback);
        resetBuffer(state);
      } else {
        do {
          const { chunk, encoding, callback } = buffered[i];
          buffered[i++] = null;
          const len = objectMode ? 1 : chunk.length;
          doWrite2(stream, state, false, len, chunk, encoding, callback);
        } while (i < buffered.length && !state.writing);
        if (i === buffered.length) {
          resetBuffer(state);
        } else if (i > 256) {
          buffered.splice(0, i);
          state.bufferedIndex = 0;
        } else {
          state.bufferedIndex = i;
        }
      }
      state.bufferProcessing = false;
    }
    Writable2.prototype._write = function(chunk, encoding, cb) {
      if (this._writev) {
        this._writev(
          [
            {
              chunk,
              encoding
            }
          ],
          cb
        );
      } else {
        throw new ERR_METHOD_NOT_IMPLEMENTED("_write()");
      }
    };
    Writable2.prototype._writev = null;
    Writable2.prototype.end = function(chunk, encoding, cb) {
      const state = this._writableState;
      if (typeof chunk === "function") {
        cb = chunk;
        chunk = null;
        encoding = null;
      } else if (typeof encoding === "function") {
        cb = encoding;
        encoding = null;
      }
      let err;
      if (chunk !== null && chunk !== void 0) {
        const ret = _write(this, chunk, encoding);
        if (ret instanceof Error2) {
          err = ret;
        }
      }
      if (state.corked) {
        state.corked = 1;
        this.uncork();
      }
      if (err) {
      } else if (!state.errored && !state.ending) {
        state.ending = true;
        finishMaybe2(this, state, true);
        state.ended = true;
      } else if (state.finished) {
        err = new ERR_STREAM_ALREADY_FINISHED("end");
      } else if (state.destroyed) {
        err = new ERR_STREAM_DESTROYED("end");
      }
      if (typeof cb === "function") {
        if (err || state.finished) {
          process2.nextTick(cb, err);
        } else {
          state[kOnFinished].push(cb);
        }
      }
      return this;
    };
    function needFinish2(state) {
      return state.ending && !state.destroyed && state.constructed && state.length === 0 && !state.errored && state.buffered.length === 0 && !state.finished && !state.writing && !state.errorEmitted && !state.closeEmitted;
    }
    function callFinal(stream, state) {
      let called = false;
      function onFinish(err) {
        if (called) {
          errorOrDestroy(stream, err !== null && err !== void 0 ? err : ERR_MULTIPLE_CALLBACK());
          return;
        }
        called = true;
        state.pendingcb--;
        if (err) {
          const onfinishCallbacks = state[kOnFinished].splice(0);
          for (let i = 0; i < onfinishCallbacks.length; i++) {
            onfinishCallbacks[i](err);
          }
          errorOrDestroy(stream, err, state.sync);
        } else if (needFinish2(state)) {
          state.prefinished = true;
          stream.emit("prefinish");
          state.pendingcb++;
          process2.nextTick(finish, stream, state);
        }
      }
      state.sync = true;
      state.pendingcb++;
      try {
        stream._final(onFinish);
      } catch (err) {
        onFinish(err);
      }
      state.sync = false;
    }
    function prefinish2(stream, state) {
      if (!state.prefinished && !state.finalCalled) {
        if (typeof stream._final === "function" && !state.destroyed) {
          state.finalCalled = true;
          callFinal(stream, state);
        } else {
          state.prefinished = true;
          stream.emit("prefinish");
        }
      }
    }
    function finishMaybe2(stream, state, sync) {
      if (needFinish2(state)) {
        prefinish2(stream, state);
        if (state.pendingcb === 0) {
          if (sync) {
            state.pendingcb++;
            process2.nextTick(
              (stream2, state2) => {
                if (needFinish2(state2)) {
                  finish(stream2, state2);
                } else {
                  state2.pendingcb--;
                }
              },
              stream,
              state
            );
          } else if (needFinish2(state)) {
            state.pendingcb++;
            finish(stream, state);
          }
        }
      }
    }
    function finish(stream, state) {
      state.pendingcb--;
      state.finished = true;
      const onfinishCallbacks = state[kOnFinished].splice(0);
      for (let i = 0; i < onfinishCallbacks.length; i++) {
        onfinishCallbacks[i]();
      }
      stream.emit("finish");
      if (state.autoDestroy) {
        const rState = stream._readableState;
        const autoDestroy = !rState || rState.autoDestroy && (rState.endEmitted || rState.readable === false);
        if (autoDestroy) {
          stream.destroy();
        }
      }
    }
    ObjectDefineProperties(Writable2.prototype, {
      closed: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.closed : false;
        }
      },
      destroyed: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.destroyed : false;
        },
        set(value) {
          if (this._writableState) {
            this._writableState.destroyed = value;
          }
        }
      },
      writable: {
        __proto__: null,
        get() {
          const w = this._writableState;
          return !!w && w.writable !== false && !w.destroyed && !w.errored && !w.ending && !w.ended;
        },
        set(val) {
          if (this._writableState) {
            this._writableState.writable = !!val;
          }
        }
      },
      writableFinished: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.finished : false;
        }
      },
      writableObjectMode: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.objectMode : false;
        }
      },
      writableBuffer: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.getBuffer();
        }
      },
      writableEnded: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.ending : false;
        }
      },
      writableNeedDrain: {
        __proto__: null,
        get() {
          const wState = this._writableState;
          if (!wState)
            return false;
          return !wState.destroyed && !wState.ending && wState.needDrain;
        }
      },
      writableHighWaterMark: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.highWaterMark;
        }
      },
      writableCorked: {
        __proto__: null,
        get() {
          return this._writableState ? this._writableState.corked : 0;
        }
      },
      writableLength: {
        __proto__: null,
        get() {
          return this._writableState && this._writableState.length;
        }
      },
      errored: {
        __proto__: null,
        enumerable: false,
        get() {
          return this._writableState ? this._writableState.errored : null;
        }
      },
      writableAborted: {
        __proto__: null,
        enumerable: false,
        get: function() {
          return !!(this._writableState.writable !== false && (this._writableState.destroyed || this._writableState.errored) && !this._writableState.finished);
        }
      }
    });
    var destroy = destroyImpl.destroy;
    Writable2.prototype.destroy = function(err, cb) {
      const state = this._writableState;
      if (!state.destroyed && (state.bufferedIndex < state.buffered.length || state[kOnFinished].length)) {
        process2.nextTick(errorBuffer, state);
      }
      destroy.call(this, err, cb);
      return this;
    };
    Writable2.prototype._undestroy = destroyImpl.undestroy;
    Writable2.prototype._destroy = function(err, cb) {
      cb(err);
    };
    Writable2.prototype[EE.captureRejectionSymbol] = function(err) {
      this.destroy(err);
    };
    var webStreamsAdapters;
    function lazyWebStreams() {
      if (webStreamsAdapters === void 0)
        webStreamsAdapters = {};
      return webStreamsAdapters;
    }
    Writable2.fromWeb = function(writableStream, options) {
      return lazyWebStreams().newStreamWritableFromWritableStream(writableStream, options);
    };
    Writable2.toWeb = function(streamWritable) {
      return lazyWebStreams().newWritableStreamFromStreamWritable(streamWritable);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/duplexify.js
var require_duplexify = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/duplexify.js"(exports, module) {
    var process2 = require_browser2();
    var bufferModule = require_buffer();
    var {
      isReadable,
      isWritable,
      isIterable,
      isNodeStream,
      isReadableNodeStream,
      isWritableNodeStream,
      isDuplexNodeStream
    } = require_utils();
    var eos = require_end_of_stream();
    var {
      AbortError,
      codes: { ERR_INVALID_ARG_TYPE, ERR_INVALID_RETURN_VALUE }
    } = require_errors();
    var { destroyer } = require_destroy();
    var Duplex2 = require_duplex();
    var Readable2 = require_readable();
    var { createDeferredPromise } = require_util();
    var from2 = require_from();
    var Blob = globalThis.Blob || bufferModule.Blob;
    var isBlob = typeof Blob !== "undefined" ? function isBlob2(b) {
      return b instanceof Blob;
    } : function isBlob2(b) {
      return false;
    };
    var AbortController = globalThis.AbortController || require_browser().AbortController;
    var { FunctionPrototypeCall } = require_primordials();
    var Duplexify = class extends Duplex2 {
      constructor(options) {
        super(options);
        if ((options === null || options === void 0 ? void 0 : options.readable) === false) {
          this._readableState.readable = false;
          this._readableState.ended = true;
          this._readableState.endEmitted = true;
        }
        if ((options === null || options === void 0 ? void 0 : options.writable) === false) {
          this._writableState.writable = false;
          this._writableState.ending = true;
          this._writableState.ended = true;
          this._writableState.finished = true;
        }
      }
    };
    module.exports = function duplexify(body, name) {
      if (isDuplexNodeStream(body)) {
        return body;
      }
      if (isReadableNodeStream(body)) {
        return _duplexify({
          readable: body
        });
      }
      if (isWritableNodeStream(body)) {
        return _duplexify({
          writable: body
        });
      }
      if (isNodeStream(body)) {
        return _duplexify({
          writable: false,
          readable: false
        });
      }
      if (typeof body === "function") {
        const { value, write: write3, final, destroy } = fromAsyncGen(body);
        if (isIterable(value)) {
          return from2(Duplexify, value, {
            objectMode: true,
            write: write3,
            final,
            destroy
          });
        }
        const then2 = value === null || value === void 0 ? void 0 : value.then;
        if (typeof then2 === "function") {
          let d;
          const promise = FunctionPrototypeCall(
            then2,
            value,
            (val) => {
              if (val != null) {
                throw new ERR_INVALID_RETURN_VALUE("nully", "body", val);
              }
            },
            (err) => {
              destroyer(d, err);
            }
          );
          return d = new Duplexify({
            objectMode: true,
            readable: false,
            write: write3,
            final(cb) {
              final(async () => {
                try {
                  await promise;
                  process2.nextTick(cb, null);
                } catch (err) {
                  process2.nextTick(cb, err);
                }
              });
            },
            destroy
          });
        }
        throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or AsyncFunction", name, value);
      }
      if (isBlob(body)) {
        return duplexify(body.arrayBuffer());
      }
      if (isIterable(body)) {
        return from2(Duplexify, body, {
          objectMode: true,
          writable: false
        });
      }
      if (typeof (body === null || body === void 0 ? void 0 : body.writable) === "object" || typeof (body === null || body === void 0 ? void 0 : body.readable) === "object") {
        const readable = body !== null && body !== void 0 && body.readable ? isReadableNodeStream(body === null || body === void 0 ? void 0 : body.readable) ? body === null || body === void 0 ? void 0 : body.readable : duplexify(body.readable) : void 0;
        const writable = body !== null && body !== void 0 && body.writable ? isWritableNodeStream(body === null || body === void 0 ? void 0 : body.writable) ? body === null || body === void 0 ? void 0 : body.writable : duplexify(body.writable) : void 0;
        return _duplexify({
          readable,
          writable
        });
      }
      const then = body === null || body === void 0 ? void 0 : body.then;
      if (typeof then === "function") {
        let d;
        FunctionPrototypeCall(
          then,
          body,
          (val) => {
            if (val != null) {
              d.push(val);
            }
            d.push(null);
          },
          (err) => {
            destroyer(d, err);
          }
        );
        return d = new Duplexify({
          objectMode: true,
          writable: false,
          read() {
          }
        });
      }
      throw new ERR_INVALID_ARG_TYPE(
        name,
        [
          "Blob",
          "ReadableStream",
          "WritableStream",
          "Stream",
          "Iterable",
          "AsyncIterable",
          "Function",
          "{ readable, writable } pair",
          "Promise"
        ],
        body
      );
    };
    function fromAsyncGen(fn) {
      let { promise, resolve } = createDeferredPromise();
      const ac = new AbortController();
      const signal = ac.signal;
      const value = fn(
        async function* () {
          while (true) {
            const _promise = promise;
            promise = null;
            const { chunk, done: done2, cb } = await _promise;
            process2.nextTick(cb);
            if (done2)
              return;
            if (signal.aborted)
              throw new AbortError(void 0, {
                cause: signal.reason
              });
            ({ promise, resolve } = createDeferredPromise());
            yield chunk;
          }
        }(),
        {
          signal
        }
      );
      return {
        value,
        write(chunk, encoding, cb) {
          const _resolve = resolve;
          resolve = null;
          _resolve({
            chunk,
            done: false,
            cb
          });
        },
        final(cb) {
          const _resolve = resolve;
          resolve = null;
          _resolve({
            done: true,
            cb
          });
        },
        destroy(err, cb) {
          ac.abort();
          cb(err);
        }
      };
    }
    function _duplexify(pair) {
      const r = pair.readable && typeof pair.readable.read !== "function" ? Readable2.wrap(pair.readable) : pair.readable;
      const w = pair.writable;
      let readable = !!isReadable(r);
      let writable = !!isWritable(w);
      let ondrain;
      let onfinish;
      let onreadable;
      let onclose;
      let d;
      function onfinished(err) {
        const cb = onclose;
        onclose = null;
        if (cb) {
          cb(err);
        } else if (err) {
          d.destroy(err);
        } else if (!readable && !writable) {
          d.destroy();
        }
      }
      d = new Duplexify({
        readableObjectMode: !!(r !== null && r !== void 0 && r.readableObjectMode),
        writableObjectMode: !!(w !== null && w !== void 0 && w.writableObjectMode),
        readable,
        writable
      });
      if (writable) {
        eos(w, (err) => {
          writable = false;
          if (err) {
            destroyer(r, err);
          }
          onfinished(err);
        });
        d._write = function(chunk, encoding, callback) {
          if (w.write(chunk, encoding)) {
            callback();
          } else {
            ondrain = callback;
          }
        };
        d._final = function(callback) {
          w.end();
          onfinish = callback;
        };
        w.on("drain", function() {
          if (ondrain) {
            const cb = ondrain;
            ondrain = null;
            cb();
          }
        });
        w.on("finish", function() {
          if (onfinish) {
            const cb = onfinish;
            onfinish = null;
            cb();
          }
        });
      }
      if (readable) {
        eos(r, (err) => {
          readable = false;
          if (err) {
            destroyer(r, err);
          }
          onfinished(err);
        });
        r.on("readable", function() {
          if (onreadable) {
            const cb = onreadable;
            onreadable = null;
            cb();
          }
        });
        r.on("end", function() {
          d.push(null);
        });
        d._read = function() {
          while (true) {
            const buf = r.read();
            if (buf === null) {
              onreadable = d._read;
              return;
            }
            if (!d.push(buf)) {
              return;
            }
          }
        };
      }
      d._destroy = function(err, callback) {
        if (!err && onclose !== null) {
          err = new AbortError();
        }
        onreadable = null;
        ondrain = null;
        onfinish = null;
        if (onclose === null) {
          callback(err);
        } else {
          onclose = callback;
          destroyer(w, err);
          destroyer(r, err);
        }
      };
      return d;
    }
  }
});

// node_modules/readable-stream/lib/internal/streams/duplex.js
var require_duplex = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/duplex.js"(exports, module) {
    "use strict";
    var {
      ObjectDefineProperties,
      ObjectGetOwnPropertyDescriptor,
      ObjectKeys,
      ObjectSetPrototypeOf
    } = require_primordials();
    module.exports = Duplex2;
    var Readable2 = require_readable();
    var Writable2 = require_writable();
    ObjectSetPrototypeOf(Duplex2.prototype, Readable2.prototype);
    ObjectSetPrototypeOf(Duplex2, Readable2);
    {
      const keys2 = ObjectKeys(Writable2.prototype);
      for (let i = 0; i < keys2.length; i++) {
        const method = keys2[i];
        if (!Duplex2.prototype[method])
          Duplex2.prototype[method] = Writable2.prototype[method];
      }
    }
    function Duplex2(options) {
      if (!(this instanceof Duplex2))
        return new Duplex2(options);
      Readable2.call(this, options);
      Writable2.call(this, options);
      if (options) {
        this.allowHalfOpen = options.allowHalfOpen !== false;
        if (options.readable === false) {
          this._readableState.readable = false;
          this._readableState.ended = true;
          this._readableState.endEmitted = true;
        }
        if (options.writable === false) {
          this._writableState.writable = false;
          this._writableState.ending = true;
          this._writableState.ended = true;
          this._writableState.finished = true;
        }
      } else {
        this.allowHalfOpen = true;
      }
    }
    ObjectDefineProperties(Duplex2.prototype, {
      writable: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writable")
      },
      writableHighWaterMark: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableHighWaterMark")
      },
      writableObjectMode: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableObjectMode")
      },
      writableBuffer: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableBuffer")
      },
      writableLength: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableLength")
      },
      writableFinished: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableFinished")
      },
      writableCorked: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableCorked")
      },
      writableEnded: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableEnded")
      },
      writableNeedDrain: {
        __proto__: null,
        ...ObjectGetOwnPropertyDescriptor(Writable2.prototype, "writableNeedDrain")
      },
      destroyed: {
        __proto__: null,
        get() {
          if (this._readableState === void 0 || this._writableState === void 0) {
            return false;
          }
          return this._readableState.destroyed && this._writableState.destroyed;
        },
        set(value) {
          if (this._readableState && this._writableState) {
            this._readableState.destroyed = value;
            this._writableState.destroyed = value;
          }
        }
      }
    });
    var webStreamsAdapters;
    function lazyWebStreams() {
      if (webStreamsAdapters === void 0)
        webStreamsAdapters = {};
      return webStreamsAdapters;
    }
    Duplex2.fromWeb = function(pair, options) {
      return lazyWebStreams().newStreamDuplexFromReadableWritablePair(pair, options);
    };
    Duplex2.toWeb = function(duplex) {
      return lazyWebStreams().newReadableWritablePairFromDuplex(duplex);
    };
    var duplexify;
    Duplex2.from = function(body) {
      if (!duplexify) {
        duplexify = require_duplexify();
      }
      return duplexify(body, "body");
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/transform.js
var require_transform = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/transform.js"(exports, module) {
    "use strict";
    var { ObjectSetPrototypeOf, Symbol: Symbol2 } = require_primordials();
    module.exports = Transform2;
    var { ERR_METHOD_NOT_IMPLEMENTED } = require_errors().codes;
    var Duplex2 = require_duplex();
    var { getHighWaterMark } = require_state();
    ObjectSetPrototypeOf(Transform2.prototype, Duplex2.prototype);
    ObjectSetPrototypeOf(Transform2, Duplex2);
    var kCallback = Symbol2("kCallback");
    function Transform2(options) {
      if (!(this instanceof Transform2))
        return new Transform2(options);
      const readableHighWaterMark = options ? getHighWaterMark(this, options, "readableHighWaterMark", true) : null;
      if (readableHighWaterMark === 0) {
        options = {
          ...options,
          highWaterMark: null,
          readableHighWaterMark,
          writableHighWaterMark: options.writableHighWaterMark || 0
        };
      }
      Duplex2.call(this, options);
      this._readableState.sync = false;
      this[kCallback] = null;
      if (options) {
        if (typeof options.transform === "function")
          this._transform = options.transform;
        if (typeof options.flush === "function")
          this._flush = options.flush;
      }
      this.on("prefinish", prefinish2);
    }
    function final(cb) {
      if (typeof this._flush === "function" && !this.destroyed) {
        this._flush((er, data) => {
          if (er) {
            if (cb) {
              cb(er);
            } else {
              this.destroy(er);
            }
            return;
          }
          if (data != null) {
            this.push(data);
          }
          this.push(null);
          if (cb) {
            cb();
          }
        });
      } else {
        this.push(null);
        if (cb) {
          cb();
        }
      }
    }
    function prefinish2() {
      if (this._final !== final) {
        final.call(this);
      }
    }
    Transform2.prototype._final = final;
    Transform2.prototype._transform = function(chunk, encoding, callback) {
      throw new ERR_METHOD_NOT_IMPLEMENTED("_transform()");
    };
    Transform2.prototype._write = function(chunk, encoding, callback) {
      const rState = this._readableState;
      const wState = this._writableState;
      const length = rState.length;
      this._transform(chunk, encoding, (err, val) => {
        if (err) {
          callback(err);
          return;
        }
        if (val != null) {
          this.push(val);
        }
        if (wState.ended || length === rState.length || rState.length < rState.highWaterMark) {
          callback();
        } else {
          this[kCallback] = callback;
        }
      });
    };
    Transform2.prototype._read = function() {
      if (this[kCallback]) {
        const callback = this[kCallback];
        this[kCallback] = null;
        callback();
      }
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/passthrough.js
var require_passthrough = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/passthrough.js"(exports, module) {
    "use strict";
    var { ObjectSetPrototypeOf } = require_primordials();
    module.exports = PassThrough2;
    var Transform2 = require_transform();
    ObjectSetPrototypeOf(PassThrough2.prototype, Transform2.prototype);
    ObjectSetPrototypeOf(PassThrough2, Transform2);
    function PassThrough2(options) {
      if (!(this instanceof PassThrough2))
        return new PassThrough2(options);
      Transform2.call(this, options);
    }
    PassThrough2.prototype._transform = function(chunk, encoding, cb) {
      cb(null, chunk);
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/pipeline.js
var require_pipeline = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/pipeline.js"(exports, module) {
    var process2 = require_browser2();
    var { ArrayIsArray, Promise: Promise2, SymbolAsyncIterator } = require_primordials();
    var eos = require_end_of_stream();
    var { once: once3 } = require_util();
    var destroyImpl = require_destroy();
    var Duplex2 = require_duplex();
    var {
      aggregateTwoErrors,
      codes: {
        ERR_INVALID_ARG_TYPE,
        ERR_INVALID_RETURN_VALUE,
        ERR_MISSING_ARGS,
        ERR_STREAM_DESTROYED,
        ERR_STREAM_PREMATURE_CLOSE
      },
      AbortError
    } = require_errors();
    var { validateFunction, validateAbortSignal } = require_validators();
    var { isIterable, isReadable, isReadableNodeStream, isNodeStream } = require_utils();
    var AbortController = globalThis.AbortController || require_browser().AbortController;
    var PassThrough2;
    var Readable2;
    function destroyer(stream, reading, writing) {
      let finished = false;
      stream.on("close", () => {
        finished = true;
      });
      const cleanup = eos(
        stream,
        {
          readable: reading,
          writable: writing
        },
        (err) => {
          finished = !err;
        }
      );
      return {
        destroy: (err) => {
          if (finished)
            return;
          finished = true;
          destroyImpl.destroyer(stream, err || new ERR_STREAM_DESTROYED("pipe"));
        },
        cleanup
      };
    }
    function popCallback(streams) {
      validateFunction(streams[streams.length - 1], "streams[stream.length - 1]");
      return streams.pop();
    }
    function makeAsyncIterable(val) {
      if (isIterable(val)) {
        return val;
      } else if (isReadableNodeStream(val)) {
        return fromReadable(val);
      }
      throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable"], val);
    }
    async function* fromReadable(val) {
      if (!Readable2) {
        Readable2 = require_readable();
      }
      yield* Readable2.prototype[SymbolAsyncIterator].call(val);
    }
    async function pump(iterable, writable, finish, { end }) {
      let error;
      let onresolve = null;
      const resume2 = (err) => {
        if (err) {
          error = err;
        }
        if (onresolve) {
          const callback = onresolve;
          onresolve = null;
          callback();
        }
      };
      const wait = () => new Promise2((resolve, reject) => {
        if (error) {
          reject(error);
        } else {
          onresolve = () => {
            if (error) {
              reject(error);
            } else {
              resolve();
            }
          };
        }
      });
      writable.on("drain", resume2);
      const cleanup = eos(
        writable,
        {
          readable: false
        },
        resume2
      );
      try {
        if (writable.writableNeedDrain) {
          await wait();
        }
        for await (const chunk of iterable) {
          if (!writable.write(chunk)) {
            await wait();
          }
        }
        if (end) {
          writable.end();
        }
        await wait();
        finish();
      } catch (err) {
        finish(error !== err ? aggregateTwoErrors(error, err) : err);
      } finally {
        cleanup();
        writable.off("drain", resume2);
      }
    }
    function pipeline(...streams) {
      return pipelineImpl(streams, once3(popCallback(streams)));
    }
    function pipelineImpl(streams, callback, opts) {
      if (streams.length === 1 && ArrayIsArray(streams[0])) {
        streams = streams[0];
      }
      if (streams.length < 2) {
        throw new ERR_MISSING_ARGS("streams");
      }
      const ac = new AbortController();
      const signal = ac.signal;
      const outerSignal = opts === null || opts === void 0 ? void 0 : opts.signal;
      const lastStreamCleanup = [];
      validateAbortSignal(outerSignal, "options.signal");
      function abort() {
        finishImpl(new AbortError());
      }
      outerSignal === null || outerSignal === void 0 ? void 0 : outerSignal.addEventListener("abort", abort);
      let error;
      let value;
      const destroys = [];
      let finishCount = 0;
      function finish(err) {
        finishImpl(err, --finishCount === 0);
      }
      function finishImpl(err, final) {
        if (err && (!error || error.code === "ERR_STREAM_PREMATURE_CLOSE")) {
          error = err;
        }
        if (!error && !final) {
          return;
        }
        while (destroys.length) {
          destroys.shift()(error);
        }
        outerSignal === null || outerSignal === void 0 ? void 0 : outerSignal.removeEventListener("abort", abort);
        ac.abort();
        if (final) {
          if (!error) {
            lastStreamCleanup.forEach((fn) => fn());
          }
          process2.nextTick(callback, error, value);
        }
      }
      let ret;
      for (let i = 0; i < streams.length; i++) {
        const stream = streams[i];
        const reading = i < streams.length - 1;
        const writing = i > 0;
        const end = reading || (opts === null || opts === void 0 ? void 0 : opts.end) !== false;
        const isLastStream = i === streams.length - 1;
        if (isNodeStream(stream)) {
          let onError2 = function(err) {
            if (err && err.name !== "AbortError" && err.code !== "ERR_STREAM_PREMATURE_CLOSE") {
              finish(err);
            }
          };
          var onError = onError2;
          if (end) {
            const { destroy, cleanup } = destroyer(stream, reading, writing);
            destroys.push(destroy);
            if (isReadable(stream) && isLastStream) {
              lastStreamCleanup.push(cleanup);
            }
          }
          stream.on("error", onError2);
          if (isReadable(stream) && isLastStream) {
            lastStreamCleanup.push(() => {
              stream.removeListener("error", onError2);
            });
          }
        }
        if (i === 0) {
          if (typeof stream === "function") {
            ret = stream({
              signal
            });
            if (!isIterable(ret)) {
              throw new ERR_INVALID_RETURN_VALUE("Iterable, AsyncIterable or Stream", "source", ret);
            }
          } else if (isIterable(stream) || isReadableNodeStream(stream)) {
            ret = stream;
          } else {
            ret = Duplex2.from(stream);
          }
        } else if (typeof stream === "function") {
          ret = makeAsyncIterable(ret);
          ret = stream(ret, {
            signal
          });
          if (reading) {
            if (!isIterable(ret, true)) {
              throw new ERR_INVALID_RETURN_VALUE("AsyncIterable", `transform[${i - 1}]`, ret);
            }
          } else {
            var _ret;
            if (!PassThrough2) {
              PassThrough2 = require_passthrough();
            }
            const pt = new PassThrough2({
              objectMode: true
            });
            const then = (_ret = ret) === null || _ret === void 0 ? void 0 : _ret.then;
            if (typeof then === "function") {
              finishCount++;
              then.call(
                ret,
                (val) => {
                  value = val;
                  if (val != null) {
                    pt.write(val);
                  }
                  if (end) {
                    pt.end();
                  }
                  process2.nextTick(finish);
                },
                (err) => {
                  pt.destroy(err);
                  process2.nextTick(finish, err);
                }
              );
            } else if (isIterable(ret, true)) {
              finishCount++;
              pump(ret, pt, finish, {
                end
              });
            } else {
              throw new ERR_INVALID_RETURN_VALUE("AsyncIterable or Promise", "destination", ret);
            }
            ret = pt;
            const { destroy, cleanup } = destroyer(ret, false, true);
            destroys.push(destroy);
            if (isLastStream) {
              lastStreamCleanup.push(cleanup);
            }
          }
        } else if (isNodeStream(stream)) {
          if (isReadableNodeStream(ret)) {
            finishCount += 2;
            const cleanup = pipe(ret, stream, finish, {
              end
            });
            if (isReadable(stream) && isLastStream) {
              lastStreamCleanup.push(cleanup);
            }
          } else if (isIterable(ret)) {
            finishCount++;
            pump(ret, stream, finish, {
              end
            });
          } else {
            throw new ERR_INVALID_ARG_TYPE("val", ["Readable", "Iterable", "AsyncIterable"], ret);
          }
          ret = stream;
        } else {
          ret = Duplex2.from(stream);
        }
      }
      if (signal !== null && signal !== void 0 && signal.aborted || outerSignal !== null && outerSignal !== void 0 && outerSignal.aborted) {
        process2.nextTick(abort);
      }
      return ret;
    }
    function pipe(src, dst, finish, { end }) {
      let ended = false;
      dst.on("close", () => {
        if (!ended) {
          finish(new ERR_STREAM_PREMATURE_CLOSE());
        }
      });
      src.pipe(dst, {
        end
      });
      if (end) {
        src.once("end", () => {
          ended = true;
          dst.end();
        });
      } else {
        finish();
      }
      eos(
        src,
        {
          readable: true,
          writable: false
        },
        (err) => {
          const rState = src._readableState;
          if (err && err.code === "ERR_STREAM_PREMATURE_CLOSE" && rState && rState.ended && !rState.errored && !rState.errorEmitted) {
            src.once("end", finish).once("error", finish);
          } else {
            finish(err);
          }
        }
      );
      return eos(
        dst,
        {
          readable: false,
          writable: true
        },
        finish
      );
    }
    module.exports = {
      pipelineImpl,
      pipeline
    };
  }
});

// node_modules/readable-stream/lib/internal/streams/compose.js
var require_compose = __commonJS({
  "node_modules/readable-stream/lib/internal/streams/compose.js"(exports, module) {
    "use strict";
    var { pipeline } = require_pipeline();
    var Duplex2 = require_duplex();
    var { destroyer } = require_destroy();
    var { isNodeStream, isReadable, isWritable } = require_utils();
    var {
      AbortError,
      codes: { ERR_INVALID_ARG_VALUE, ERR_MISSING_ARGS }
    } = require_errors();
    module.exports = function compose(...streams) {
      if (streams.length === 0) {
        throw new ERR_MISSING_ARGS("streams");
      }
      if (streams.length === 1) {
        return Duplex2.from(streams[0]);
      }
      const orgStreams = [...streams];
      if (typeof streams[0] === "function") {
        streams[0] = Duplex2.from(streams[0]);
      }
      if (typeof streams[streams.length - 1] === "function") {
        const idx = streams.length - 1;
        streams[idx] = Duplex2.from(streams[idx]);
      }
      for (let n = 0; n < streams.length; ++n) {
        if (!isNodeStream(streams[n])) {
          continue;
        }
        if (n < streams.length - 1 && !isReadable(streams[n])) {
          throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be readable");
        }
        if (n > 0 && !isWritable(streams[n])) {
          throw new ERR_INVALID_ARG_VALUE(`streams[${n}]`, orgStreams[n], "must be writable");
        }
      }
      let ondrain;
      let onfinish;
      let onreadable;
      let onclose;
      let d;
      function onfinished(err) {
        const cb = onclose;
        onclose = null;
        if (cb) {
          cb(err);
        } else if (err) {
          d.destroy(err);
        } else if (!readable && !writable) {
          d.destroy();
        }
      }
      const head = streams[0];
      const tail = pipeline(streams, onfinished);
      const writable = !!isWritable(head);
      const readable = !!isReadable(tail);
      d = new Duplex2({
        writableObjectMode: !!(head !== null && head !== void 0 && head.writableObjectMode),
        readableObjectMode: !!(tail !== null && tail !== void 0 && tail.writableObjectMode),
        writable,
        readable
      });
      if (writable) {
        d._write = function(chunk, encoding, callback) {
          if (head.write(chunk, encoding)) {
            callback();
          } else {
            ondrain = callback;
          }
        };
        d._final = function(callback) {
          head.end();
          onfinish = callback;
        };
        head.on("drain", function() {
          if (ondrain) {
            const cb = ondrain;
            ondrain = null;
            cb();
          }
        });
        tail.on("finish", function() {
          if (onfinish) {
            const cb = onfinish;
            onfinish = null;
            cb();
          }
        });
      }
      if (readable) {
        tail.on("readable", function() {
          if (onreadable) {
            const cb = onreadable;
            onreadable = null;
            cb();
          }
        });
        tail.on("end", function() {
          d.push(null);
        });
        d._read = function() {
          while (true) {
            const buf = tail.read();
            if (buf === null) {
              onreadable = d._read;
              return;
            }
            if (!d.push(buf)) {
              return;
            }
          }
        };
      }
      d._destroy = function(err, callback) {
        if (!err && onclose !== null) {
          err = new AbortError();
        }
        onreadable = null;
        ondrain = null;
        onfinish = null;
        if (onclose === null) {
          callback(err);
        } else {
          onclose = callback;
          destroyer(tail, err);
        }
      };
      return d;
    };
  }
});

// node_modules/readable-stream/lib/stream/promises.js
var require_promises = __commonJS({
  "node_modules/readable-stream/lib/stream/promises.js"(exports, module) {
    "use strict";
    var { ArrayPrototypePop, Promise: Promise2 } = require_primordials();
    var { isIterable, isNodeStream } = require_utils();
    var { pipelineImpl: pl } = require_pipeline();
    var { finished } = require_end_of_stream();
    function pipeline(...streams) {
      return new Promise2((resolve, reject) => {
        let signal;
        let end;
        const lastArg = streams[streams.length - 1];
        if (lastArg && typeof lastArg === "object" && !isNodeStream(lastArg) && !isIterable(lastArg)) {
          const options = ArrayPrototypePop(streams);
          signal = options.signal;
          end = options.end;
        }
        pl(
          streams,
          (err, value) => {
            if (err) {
              reject(err);
            } else {
              resolve(value);
            }
          },
          {
            signal,
            end
          }
        );
      });
    }
    module.exports = {
      finished,
      pipeline
    };
  }
});

// node_modules/readable-stream/lib/stream.js
var require_stream2 = __commonJS({
  "node_modules/readable-stream/lib/stream.js"(exports, module) {
    var { Buffer: Buffer3 } = require_buffer();
    var { ObjectDefineProperty, ObjectKeys, ReflectApply } = require_primordials();
    var {
      promisify: { custom: customPromisify }
    } = require_util();
    var { streamReturningOperators, promiseReturningOperators } = require_operators();
    var {
      codes: { ERR_ILLEGAL_CONSTRUCTOR }
    } = require_errors();
    var compose = require_compose();
    var { pipeline } = require_pipeline();
    var { destroyer } = require_destroy();
    var eos = require_end_of_stream();
    var promises = require_promises();
    var utils = require_utils();
    var Stream2 = module.exports = require_legacy().Stream;
    Stream2.isDisturbed = utils.isDisturbed;
    Stream2.isErrored = utils.isErrored;
    Stream2.isReadable = utils.isReadable;
    Stream2.Readable = require_readable();
    for (const key of ObjectKeys(streamReturningOperators)) {
      let fn2 = function(...args) {
        if (new.target) {
          throw ERR_ILLEGAL_CONSTRUCTOR();
        }
        return Stream2.Readable.from(ReflectApply(op, this, args));
      };
      fn = fn2;
      const op = streamReturningOperators[key];
      ObjectDefineProperty(fn2, "name", {
        __proto__: null,
        value: op.name
      });
      ObjectDefineProperty(fn2, "length", {
        __proto__: null,
        value: op.length
      });
      ObjectDefineProperty(Stream2.Readable.prototype, key, {
        __proto__: null,
        value: fn2,
        enumerable: false,
        configurable: true,
        writable: true
      });
    }
    var fn;
    for (const key of ObjectKeys(promiseReturningOperators)) {
      let fn2 = function(...args) {
        if (new.target) {
          throw ERR_ILLEGAL_CONSTRUCTOR();
        }
        return ReflectApply(op, this, args);
      };
      fn = fn2;
      const op = promiseReturningOperators[key];
      ObjectDefineProperty(fn2, "name", {
        __proto__: null,
        value: op.name
      });
      ObjectDefineProperty(fn2, "length", {
        __proto__: null,
        value: op.length
      });
      ObjectDefineProperty(Stream2.Readable.prototype, key, {
        __proto__: null,
        value: fn2,
        enumerable: false,
        configurable: true,
        writable: true
      });
    }
    var fn;
    Stream2.Writable = require_writable();
    Stream2.Duplex = require_duplex();
    Stream2.Transform = require_transform();
    Stream2.PassThrough = require_passthrough();
    Stream2.pipeline = pipeline;
    var { addAbortSignal } = require_add_abort_signal();
    Stream2.addAbortSignal = addAbortSignal;
    Stream2.finished = eos;
    Stream2.destroy = destroyer;
    Stream2.compose = compose;
    ObjectDefineProperty(Stream2, "promises", {
      __proto__: null,
      configurable: true,
      enumerable: true,
      get() {
        return promises;
      }
    });
    ObjectDefineProperty(pipeline, customPromisify, {
      __proto__: null,
      enumerable: true,
      get() {
        return promises.pipeline;
      }
    });
    ObjectDefineProperty(eos, customPromisify, {
      __proto__: null,
      enumerable: true,
      get() {
        return promises.finished;
      }
    });
    Stream2.Stream = Stream2;
    Stream2._isUint8Array = function isUint8Array(value) {
      return value instanceof Uint8Array;
    };
    Stream2._uint8ArrayToBuffer = function _uint8ArrayToBuffer(chunk) {
      return Buffer3.from(chunk.buffer, chunk.byteOffset, chunk.byteLength);
    };
  }
});

// node_modules/readable-stream/lib/ours/browser.js
var require_browser3 = __commonJS({
  "node_modules/readable-stream/lib/ours/browser.js"(exports, module) {
    "use strict";
    var CustomStream = require_stream2();
    var promises = require_promises();
    var originalDestroy = CustomStream.Readable.destroy;
    module.exports = CustomStream.Readable;
    module.exports._uint8ArrayToBuffer = CustomStream._uint8ArrayToBuffer;
    module.exports._isUint8Array = CustomStream._isUint8Array;
    module.exports.isDisturbed = CustomStream.isDisturbed;
    module.exports.isErrored = CustomStream.isErrored;
    module.exports.isReadable = CustomStream.isReadable;
    module.exports.Readable = CustomStream.Readable;
    module.exports.Writable = CustomStream.Writable;
    module.exports.Duplex = CustomStream.Duplex;
    module.exports.Transform = CustomStream.Transform;
    module.exports.PassThrough = CustomStream.PassThrough;
    module.exports.addAbortSignal = CustomStream.addAbortSignal;
    module.exports.finished = CustomStream.finished;
    module.exports.destroy = CustomStream.destroy;
    module.exports.destroy = originalDestroy;
    module.exports.pipeline = CustomStream.pipeline;
    module.exports.compose = CustomStream.compose;
    Object.defineProperty(CustomStream, "promises", {
      configurable: true,
      enumerable: true,
      get() {
        return promises;
      }
    });
    module.exports.Stream = CustomStream.Stream;
    module.exports.default = module.exports;
  }
});

// node-modules-polyfills-commonjs:util
var require_util2 = __commonJS({
  "node-modules-polyfills-commonjs:util"(exports, module) {
    var polyfill = (init_util(), __toCommonJS(util_exports));
    if (polyfill && polyfill.default) {
      module.exports = polyfill.default;
      for (let k in polyfill) {
        module.exports[k] = polyfill[k];
      }
    } else if (polyfill) {
      module.exports = polyfill;
    }
  }
});

// node_modules/gettext-parser/lib/poparser.js
var require_poparser = __commonJS({
  "node_modules/gettext-parser/lib/poparser.js"(exports, module) {
    var encoding = require_encoding();
    var sharedFuncs = require_shared();
    var Transform2 = require_browser3().Transform;
    var util = require_util2();
    module.exports.parse = function(buffer, defaultCharset) {
      const parser = new Parser(buffer, defaultCharset);
      return parser.parse();
    };
    module.exports.stream = function(defaultCharset, options) {
      return new PoParserTransform(defaultCharset, options);
    };
    function Parser(fileContents, defaultCharset = "iso-8859-1") {
      this._charset = defaultCharset;
      this._lex = [];
      this._escaped = false;
      this._node = {};
      this._state = this.states.none;
      this._lineNumber = 1;
      if (typeof fileContents === "string") {
        this._charset = "utf-8";
        this._fileContents = fileContents;
      } else {
        this._fileContents = this._handleCharset(fileContents);
      }
    }
    Parser.prototype.parse = function() {
      this._lexer(this._fileContents);
      return this._finalize(this._lex);
    };
    Parser.prototype._handleCharset = function(buf = "") {
      const str = buf.toString();
      let pos;
      let headers = "";
      let match;
      if ((pos = str.search(/^\s*msgid/im)) >= 0) {
        pos = pos + str.substr(pos + 5).search(/^\s*(msgid|msgctxt)/im);
        headers = str.substr(0, pos >= 0 ? pos + 5 : str.length);
      }
      if (match = headers.match(/[; ]charset\s*=\s*([\w-]+)(?:[\s;]|\\n)*"\s*$/mi)) {
        this._charset = sharedFuncs.formatCharset(match[1], this._charset);
      }
      if (this._charset === "utf-8") {
        return str;
      }
      return this._toString(buf);
    };
    Parser.prototype._toString = function(buf) {
      return encoding.convert(buf, "utf-8", this._charset).toString("utf-8");
    };
    Parser.prototype.states = {
      none: 1,
      comments: 2,
      key: 3,
      string: 4,
      obsolete: 5
    };
    Parser.prototype.types = {
      comments: 1,
      key: 2,
      string: 3,
      obsolete: 4
    };
    Parser.prototype.symbols = {
      quotes: /["']/,
      comments: /#/,
      whitespace: /\s/,
      key: /[\w\-[\]]/,
      keyNames: /^(?:msgctxt|msgid(?:_plural)?|msgstr(?:\[\d+])?)$/
    };
    Parser.prototype._lexer = function(chunk) {
      let chr;
      for (let i = 0, len = chunk.length; i < len; i++) {
        chr = chunk.charAt(i);
        if (chr === "\n") {
          this._lineNumber += 1;
        }
        switch (this._state) {
          case this.states.none:
          case this.states.obsolete:
            if (chr.match(this.symbols.quotes)) {
              this._node = {
                type: this.types.string,
                value: "",
                quote: chr
              };
              this._lex.push(this._node);
              this._state = this.states.string;
            } else if (chr.match(this.symbols.comments)) {
              this._node = {
                type: this.types.comments,
                value: ""
              };
              this._lex.push(this._node);
              this._state = this.states.comments;
            } else if (!chr.match(this.symbols.whitespace)) {
              this._node = {
                type: this.types.key,
                value: chr
              };
              if (this._state === this.states.obsolete) {
                this._node.obsolete = true;
              }
              this._lex.push(this._node);
              this._state = this.states.key;
            }
            break;
          case this.states.comments:
            if (chr === "\n") {
              this._state = this.states.none;
            } else if (chr === "~" && this._node.value === "") {
              this._node.value += chr;
              this._state = this.states.obsolete;
            } else if (chr !== "\r") {
              this._node.value += chr;
            }
            break;
          case this.states.string:
            if (this._escaped) {
              switch (chr) {
                case "t":
                  this._node.value += "	";
                  break;
                case "n":
                  this._node.value += "\n";
                  break;
                case "r":
                  this._node.value += "\r";
                  break;
                default:
                  this._node.value += chr;
              }
              this._escaped = false;
            } else {
              if (chr === this._node.quote) {
                this._state = this.states.none;
              } else if (chr === "\\") {
                this._escaped = true;
                break;
              } else {
                this._node.value += chr;
              }
              this._escaped = false;
            }
            break;
          case this.states.key:
            if (!chr.match(this.symbols.key)) {
              if (!this._node.value.match(this.symbols.keyNames)) {
                const err = new SyntaxError(`Error parsing PO data: Invalid key name "${this._node.value}" at line ${this._lineNumber}. This can be caused by an unescaped quote character in a msgid or msgstr value.`);
                err.lineNumber = this._lineNumber;
                throw err;
              }
              this._state = this.states.none;
              i--;
            } else {
              this._node.value += chr;
            }
            break;
        }
      }
    };
    Parser.prototype._joinStringValues = function(tokens) {
      const response = [];
      let lastNode;
      for (let i = 0, len = tokens.length; i < len; i++) {
        if (lastNode && tokens[i].type === this.types.string && lastNode.type === this.types.string) {
          lastNode.value += tokens[i].value;
        } else if (lastNode && tokens[i].type === this.types.comments && lastNode.type === this.types.comments) {
          lastNode.value += "\n" + tokens[i].value;
        } else {
          response.push(tokens[i]);
          lastNode = tokens[i];
        }
      }
      return response;
    };
    Parser.prototype._parseComments = function(tokens) {
      tokens.forEach((node) => {
        let comment;
        let lines;
        if (node && node.type === this.types.comments) {
          comment = {
            translator: [],
            extracted: [],
            reference: [],
            flag: [],
            previous: []
          };
          lines = (node.value || "").split(/\n/);
          lines.forEach((line) => {
            switch (line.charAt(0) || "") {
              case ":":
                comment.reference.push(line.substr(1).trim());
                break;
              case ".":
                comment.extracted.push(line.substr(1).replace(/^\s+/, ""));
                break;
              case ",":
                comment.flag.push(line.substr(1).replace(/^\s+/, ""));
                break;
              case "|":
                comment.previous.push(line.substr(1).replace(/^\s+/, ""));
                break;
              case "~":
                break;
              default:
                comment.translator.push(line.replace(/^\s+/, ""));
            }
          });
          node.value = {};
          Object.keys(comment).forEach((key) => {
            if (comment[key] && comment[key].length) {
              node.value[key] = comment[key].join("\n");
            }
          });
        }
      });
    };
    Parser.prototype._handleKeys = function(tokens) {
      const response = [];
      let lastNode;
      for (let i = 0, len = tokens.length; i < len; i++) {
        if (tokens[i].type === this.types.key) {
          lastNode = {
            key: tokens[i].value
          };
          if (tokens[i].obsolete) {
            lastNode.obsolete = true;
          }
          if (i && tokens[i - 1].type === this.types.comments) {
            lastNode.comments = tokens[i - 1].value;
          }
          lastNode.value = "";
          response.push(lastNode);
        } else if (tokens[i].type === this.types.string && lastNode) {
          lastNode.value += tokens[i].value;
        }
      }
      return response;
    };
    Parser.prototype._handleValues = function(tokens) {
      const response = [];
      let lastNode;
      let curContext;
      let curComments;
      for (let i = 0, len = tokens.length; i < len; i++) {
        if (tokens[i].key.toLowerCase() === "msgctxt") {
          curContext = tokens[i].value;
          curComments = tokens[i].comments;
        } else if (tokens[i].key.toLowerCase() === "msgid") {
          lastNode = {
            msgid: tokens[i].value
          };
          if (tokens[i].obsolete) {
            lastNode.obsolete = true;
          }
          if (curContext) {
            lastNode.msgctxt = curContext;
          }
          if (curComments) {
            lastNode.comments = curComments;
          }
          if (tokens[i].comments && !lastNode.comments) {
            lastNode.comments = tokens[i].comments;
          }
          curContext = false;
          curComments = false;
          response.push(lastNode);
        } else if (tokens[i].key.toLowerCase() === "msgid_plural") {
          if (lastNode) {
            lastNode.msgid_plural = tokens[i].value;
          }
          if (tokens[i].comments && !lastNode.comments) {
            lastNode.comments = tokens[i].comments;
          }
          curContext = false;
          curComments = false;
        } else if (tokens[i].key.substr(0, 6).toLowerCase() === "msgstr") {
          if (lastNode) {
            lastNode.msgstr = (lastNode.msgstr || []).concat(tokens[i].value);
          }
          if (tokens[i].comments && !lastNode.comments) {
            lastNode.comments = tokens[i].comments;
          }
          curContext = false;
          curComments = false;
        }
      }
      return response;
    };
    Parser.prototype._normalize = function(tokens) {
      const table = {
        charset: this._charset,
        headers: void 0,
        translations: {}
      };
      let msgctxt;
      for (let i = 0, len = tokens.length; i < len; i++) {
        msgctxt = tokens[i].msgctxt || "";
        if (tokens[i].obsolete) {
          if (!table.obsolete) {
            table.obsolete = {};
          }
          if (!table.obsolete[msgctxt]) {
            table.obsolete[msgctxt] = {};
          }
          delete tokens[i].obsolete;
          table.obsolete[msgctxt][tokens[i].msgid] = tokens[i];
          continue;
        }
        if (!table.translations[msgctxt]) {
          table.translations[msgctxt] = {};
        }
        if (!table.headers && !msgctxt && !tokens[i].msgid) {
          table.headers = sharedFuncs.parseHeader(tokens[i].msgstr[0]);
        }
        table.translations[msgctxt][tokens[i].msgid] = tokens[i];
      }
      return table;
    };
    Parser.prototype._finalize = function(tokens) {
      let data = this._joinStringValues(tokens);
      this._parseComments(data);
      data = this._handleKeys(data);
      data = this._handleValues(data);
      return this._normalize(data);
    };
    function PoParserTransform(defaultCharset, options) {
      if (!options && defaultCharset && typeof defaultCharset === "object") {
        options = defaultCharset;
        defaultCharset = void 0;
      }
      this.defaultCharset = defaultCharset;
      this._parser = false;
      this._tokens = {};
      this._cache = [];
      this._cacheSize = 0;
      this.initialTreshold = options.initialTreshold || 2 * 1024;
      Transform2.call(this, options);
      this._writableState.objectMode = false;
      this._readableState.objectMode = true;
    }
    util.inherits(PoParserTransform, Transform2);
    PoParserTransform.prototype._transform = function(chunk, encoding2, done2) {
      let i;
      let len = 0;
      if (!chunk || !chunk.length) {
        return done2();
      }
      if (!this._parser) {
        this._cache.push(chunk);
        this._cacheSize += chunk.length;
        if (this._cacheSize < this.initialTreshold) {
          return setImmediate(done2);
        } else if (this._cacheSize) {
          chunk = Buffer.concat(this._cache, this._cacheSize);
          this._cacheSize = 0;
          this._cache = [];
        }
        this._parser = new Parser(chunk, this.defaultCharset);
      } else if (this._cacheSize) {
        this._cache.push(chunk);
        this._cacheSize += chunk.length;
        chunk = Buffer.concat(this._cache, this._cacheSize);
        this._cacheSize = 0;
        this._cache = [];
      }
      for (i = chunk.length - 1; i >= 0; i--) {
        if (chunk[i] >= 128) {
          len++;
          continue;
        }
        break;
      }
      if (len) {
        this._cache = [chunk.slice(chunk.length - len)];
        this._cacheSize = this._cache[0].length;
        chunk = chunk.slice(0, chunk.length - len);
      }
      if (chunk.length) {
        try {
          this._parser._lexer(this._parser._toString(chunk));
        } catch (error) {
          setImmediate(() => {
            done2(error);
          });
          return;
        }
      }
      setImmediate(done2);
    };
    PoParserTransform.prototype._flush = function(done2) {
      let chunk;
      if (this._cacheSize) {
        chunk = Buffer.concat(this._cache, this._cacheSize);
      }
      if (!this._parser && chunk) {
        this._parser = new Parser(chunk, this.defaultCharset);
      }
      if (chunk) {
        try {
          this._parser._lexer(this._parser._toString(chunk));
        } catch (error) {
          setImmediate(() => {
            done2(error);
          });
          return;
        }
      }
      if (this._parser) {
        this.push(this._parser._finalize(this._parser._lex));
      }
      setImmediate(done2);
    };
  }
});

// node_modules/safe-buffer/index.js
var require_safe_buffer = __commonJS({
  "node_modules/safe-buffer/index.js"(exports, module) {
    var buffer = require_buffer();
    var Buffer3 = buffer.Buffer;
    function copyProps(src, dst) {
      for (var key in src) {
        dst[key] = src[key];
      }
    }
    if (Buffer3.from && Buffer3.alloc && Buffer3.allocUnsafe && Buffer3.allocUnsafeSlow) {
      module.exports = buffer;
    } else {
      copyProps(buffer, exports);
      exports.Buffer = SafeBuffer;
    }
    function SafeBuffer(arg, encodingOrOffset, length) {
      return Buffer3(arg, encodingOrOffset, length);
    }
    SafeBuffer.prototype = Object.create(Buffer3.prototype);
    copyProps(Buffer3, SafeBuffer);
    SafeBuffer.from = function(arg, encodingOrOffset, length) {
      if (typeof arg === "number") {
        throw new TypeError("Argument must not be a number");
      }
      return Buffer3(arg, encodingOrOffset, length);
    };
    SafeBuffer.alloc = function(size, fill2, encoding) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      var buf = Buffer3(size);
      if (fill2 !== void 0) {
        if (typeof encoding === "string") {
          buf.fill(fill2, encoding);
        } else {
          buf.fill(fill2);
        }
      } else {
        buf.fill(0);
      }
      return buf;
    };
    SafeBuffer.allocUnsafe = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return Buffer3(size);
    };
    SafeBuffer.allocUnsafeSlow = function(size) {
      if (typeof size !== "number") {
        throw new TypeError("Argument must be a number");
      }
      return buffer.SlowBuffer(size);
    };
  }
});

// node_modules/content-type/index.js
var require_content_type = __commonJS({
  "node_modules/content-type/index.js"(exports) {
    "use strict";
    var PARAM_REGEXP = /; *([!#$%&'*+.^_`|~0-9A-Za-z-]+) *= *("(?:[\u000b\u0020\u0021\u0023-\u005b\u005d-\u007e\u0080-\u00ff]|\\[\u000b\u0020-\u00ff])*"|[!#$%&'*+.^_`|~0-9A-Za-z-]+) */g;
    var TEXT_REGEXP = /^[\u000b\u0020-\u007e\u0080-\u00ff]+$/;
    var TOKEN_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    var QESC_REGEXP = /\\([\u000b\u0020-\u00ff])/g;
    var QUOTE_REGEXP = /([\\"])/g;
    var TYPE_REGEXP = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+\/[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
    exports.format = format2;
    exports.parse = parse;
    function format2(obj) {
      if (!obj || typeof obj !== "object") {
        throw new TypeError("argument obj is required");
      }
      var parameters = obj.parameters;
      var type = obj.type;
      if (!type || !TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid type");
      }
      var string = type;
      if (parameters && typeof parameters === "object") {
        var param;
        var params = Object.keys(parameters).sort();
        for (var i = 0; i < params.length; i++) {
          param = params[i];
          if (!TOKEN_REGEXP.test(param)) {
            throw new TypeError("invalid parameter name");
          }
          string += "; " + param + "=" + qstring(parameters[param]);
        }
      }
      return string;
    }
    function parse(string) {
      if (!string) {
        throw new TypeError("argument string is required");
      }
      var header = typeof string === "object" ? getcontenttype(string) : string;
      if (typeof header !== "string") {
        throw new TypeError("argument string is required to be a string");
      }
      var index = header.indexOf(";");
      var type = index !== -1 ? header.substr(0, index).trim() : header.trim();
      if (!TYPE_REGEXP.test(type)) {
        throw new TypeError("invalid media type");
      }
      var obj = new ContentType(type.toLowerCase());
      if (index !== -1) {
        var key;
        var match;
        var value;
        PARAM_REGEXP.lastIndex = index;
        while (match = PARAM_REGEXP.exec(header)) {
          if (match.index !== index) {
            throw new TypeError("invalid parameter format");
          }
          index += match[0].length;
          key = match[1].toLowerCase();
          value = match[2];
          if (value[0] === '"') {
            value = value.substr(1, value.length - 2).replace(QESC_REGEXP, "$1");
          }
          obj.parameters[key] = value;
        }
        if (index !== header.length) {
          throw new TypeError("invalid parameter format");
        }
      }
      return obj;
    }
    function getcontenttype(obj) {
      var header;
      if (typeof obj.getHeader === "function") {
        header = obj.getHeader("content-type");
      } else if (typeof obj.headers === "object") {
        header = obj.headers && obj.headers["content-type"];
      }
      if (typeof header !== "string") {
        throw new TypeError("content-type header is missing from object");
      }
      return header;
    }
    function qstring(val) {
      var str = String(val);
      if (TOKEN_REGEXP.test(str)) {
        return str;
      }
      if (str.length > 0 && !TEXT_REGEXP.test(str)) {
        throw new TypeError("invalid parameter value");
      }
      return '"' + str.replace(QUOTE_REGEXP, "\\$1") + '"';
    }
    function ContentType(type) {
      this.parameters = /* @__PURE__ */ Object.create(null);
      this.type = type;
    }
  }
});

// node_modules/gettext-parser/lib/pocompiler.js
var require_pocompiler = __commonJS({
  "node_modules/gettext-parser/lib/pocompiler.js"(exports, module) {
    var { Buffer: Buffer3 } = require_safe_buffer();
    var encoding = require_encoding();
    var sharedFuncs = require_shared();
    var contentType = require_content_type();
    module.exports = function(table, options) {
      const compiler = new Compiler(table, options);
      return compiler.compile();
    };
    function Compiler(table = {}, options = {}) {
      this._table = table;
      this._options = options;
      this._table.translations = this._table.translations || {};
      let { headers = {} } = this._table;
      headers = Object.keys(headers).reduce((result, key) => {
        const lowerKey = key.toLowerCase();
        if (sharedFuncs.HEADERS.has(lowerKey)) {
          result[sharedFuncs.HEADERS.get(lowerKey)] = headers[key];
        } else {
          result[key] = headers[key];
        }
        return result;
      }, {});
      this._table.headers = headers;
      if (!("foldLength" in this._options)) {
        this._options.foldLength = 76;
      }
      if (!("escapeCharacters" in this._options)) {
        this._options.escapeCharacters = true;
      }
      if (!("sort" in this._options)) {
        this._options.sort = false;
      }
      if (!("eol" in this._options)) {
        this._options.eol = "\n";
      }
      this._translations = [];
      this._handleCharset();
    }
    Compiler.prototype._drawComments = function(comments) {
      const lines = [];
      const types = [{
        key: "translator",
        prefix: "# "
      }, {
        key: "reference",
        prefix: "#: "
      }, {
        key: "extracted",
        prefix: "#. "
      }, {
        key: "flag",
        prefix: "#, "
      }, {
        key: "previous",
        prefix: "#| "
      }];
      types.forEach((type) => {
        if (!comments[type.key]) {
          return;
        }
        comments[type.key].split(/\r?\n|\r/).forEach((line) => {
          lines.push(`${type.prefix}${line}`);
        });
      });
      return lines.join(this._options.eol);
    };
    Compiler.prototype._drawBlock = function(block, override = {}, obsolete = false) {
      const response = [];
      const msgctxt = override.msgctxt || block.msgctxt;
      const msgid = override.msgid || block.msgid;
      const msgidPlural = override.msgid_plural || block.msgid_plural;
      const msgstr = [].concat(override.msgstr || block.msgstr);
      let comments = override.comments || block.comments;
      if (comments && (comments = this._drawComments(comments))) {
        response.push(comments);
      }
      if (msgctxt) {
        response.push(this._addPOString("msgctxt", msgctxt, obsolete));
      }
      response.push(this._addPOString("msgid", msgid || "", obsolete));
      if (msgidPlural) {
        response.push(this._addPOString("msgid_plural", msgidPlural, obsolete));
        msgstr.forEach((msgstr2, i) => {
          response.push(this._addPOString(`msgstr[${i}]`, msgstr2 || "", obsolete));
        });
      } else {
        response.push(this._addPOString("msgstr", msgstr[0] || "", obsolete));
      }
      return response.join(this._options.eol);
    };
    Compiler.prototype._addPOString = function(key = "", value = "", obsolete = false) {
      key = key.toString();
      if (obsolete) {
        key = "#~ " + key;
      }
      let { foldLength, eol, escapeCharacters } = this._options;
      if (escapeCharacters) {
        value = value.toString().replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\t/g, "\\t").replace(/\r/g, "\\r");
      }
      value = value.replace(/\n/g, "\\n");
      let lines = [value];
      if (obsolete) {
        eol = eol + "#~ ";
      }
      if (foldLength > 0) {
        lines = sharedFuncs.foldLine(value, foldLength);
      } else {
        if (escapeCharacters) {
          lines = value.split(/\\n/g);
          for (let i = 0; i < lines.length - 1; i++) {
            lines[i] = `${lines[i]}\\n`;
          }
          if (lines.length && lines[lines.length - 1] === "") {
            lines.splice(-1, 1);
          }
        }
      }
      if (lines.length < 2) {
        return `${key} "${lines.shift() || ""}"`;
      }
      return `${key} ""${eol}"${lines.join(`"${eol}"`)}"`;
    };
    Compiler.prototype._handleCharset = function() {
      const ct = contentType.parse(this._table.headers["Content-Type"] || "text/plain");
      const charset = sharedFuncs.formatCharset(this._table.charset || ct.parameters.charset || "utf-8");
      if (ct.parameters.charset) {
        ct.parameters.charset = sharedFuncs.formatCharset(ct.parameters.charset);
      }
      this._table.charset = charset;
      this._table.headers["Content-Type"] = contentType.format(ct);
    };
    Compiler.prototype._prepareSection = function(section) {
      let response = [];
      Object.keys(section).forEach((msgctxt) => {
        if (typeof section[msgctxt] !== "object") {
          return;
        }
        Object.keys(section[msgctxt]).forEach((msgid) => {
          if (typeof section[msgctxt][msgid] !== "object") {
            return;
          }
          if (msgctxt === "" && msgid === "") {
            return;
          }
          response.push(section[msgctxt][msgid]);
        });
      });
      const { sort } = this._options;
      if (sort !== false) {
        if (typeof sort === "function") {
          response = response.sort(sort);
        } else {
          response = response.sort(sharedFuncs.compareMsgid);
        }
      }
      return response;
    };
    Compiler.prototype.compile = function() {
      const headerBlock = this._table.translations[""] && this._table.translations[""][""] || {};
      let response = [];
      const translations = this._prepareSection(this._table.translations);
      response = translations.map((r) => this._drawBlock(r));
      if (typeof this._table.obsolete === "object") {
        const obsolete = this._prepareSection(this._table.obsolete);
        if (obsolete.length) {
          response = response.concat(obsolete.map((r) => this._drawBlock(r, {}, true)));
        }
      }
      const { eol } = this._options;
      response.unshift(this._drawBlock(headerBlock, {
        msgstr: sharedFuncs.generateHeader(this._table.headers)
      }));
      if (this._table.charset === "utf-8" || this._table.charset === "ascii") {
        return Buffer3.from(response.join(eol + eol) + eol, "utf-8");
      }
      return encoding.convert(response.join(eol + eol) + eol, this._table.charset);
    };
  }
});

// node_modules/gettext-parser/lib/moparser.js
var require_moparser = __commonJS({
  "node_modules/gettext-parser/lib/moparser.js"(exports, module) {
    var encoding = require_encoding();
    var sharedFuncs = require_shared();
    module.exports = function(buffer, defaultCharset) {
      const parser = new Parser(buffer, defaultCharset);
      return parser.parse();
    };
    function Parser(fileContents, defaultCharset = "iso-8859-1") {
      this._fileContents = fileContents;
      this._writeFunc = "writeUInt32LE";
      this._readFunc = "readUInt32LE";
      this._charset = defaultCharset;
      this._table = {
        charset: this._charset,
        headers: void 0,
        translations: {}
      };
    }
    Parser.prototype.MAGIC = 2500072158;
    Parser.prototype._checkMagick = function() {
      if (this._fileContents.readUInt32LE(0) === this.MAGIC) {
        this._readFunc = "readUInt32LE";
        this._writeFunc = "writeUInt32LE";
        return true;
      } else if (this._fileContents.readUInt32BE(0) === this.MAGIC) {
        this._readFunc = "readUInt32BE";
        this._writeFunc = "writeUInt32BE";
        return true;
      }
      return false;
    };
    Parser.prototype._loadTranslationTable = function() {
      let offsetOriginals = this._offsetOriginals;
      let offsetTranslations = this._offsetTranslations;
      let position;
      let length;
      let msgid;
      let msgstr;
      for (let i = 0; i < this._total; i++) {
        length = this._fileContents[this._readFunc](offsetOriginals);
        offsetOriginals += 4;
        position = this._fileContents[this._readFunc](offsetOriginals);
        offsetOriginals += 4;
        msgid = this._fileContents.slice(position, position + length);
        length = this._fileContents[this._readFunc](offsetTranslations);
        offsetTranslations += 4;
        position = this._fileContents[this._readFunc](offsetTranslations);
        offsetTranslations += 4;
        msgstr = this._fileContents.slice(position, position + length);
        if (!i && !msgid.toString()) {
          this._handleCharset(msgstr);
        }
        msgid = encoding.convert(msgid, "utf-8", this._charset).toString("utf8");
        msgstr = encoding.convert(msgstr, "utf-8", this._charset).toString("utf8");
        this._addString(msgid, msgstr);
      }
      this._fileContents = null;
    };
    Parser.prototype._handleCharset = function(headers) {
      const headersStr = headers.toString();
      let match;
      if (match = headersStr.match(/[; ]charset\s*=\s*([\w-]+)/i)) {
        this._charset = this._table.charset = sharedFuncs.formatCharset(match[1], this._charset);
      }
      headers = encoding.convert(headers, "utf-8", this._charset).toString("utf8");
      this._table.headers = sharedFuncs.parseHeader(headers);
    };
    Parser.prototype._addString = function(msgid, msgstr) {
      const translation = {};
      let msgctxt;
      let msgidPlural;
      msgid = msgid.split("");
      if (msgid.length > 1) {
        msgctxt = msgid.shift();
        translation.msgctxt = msgctxt;
      } else {
        msgctxt = "";
      }
      msgid = msgid.join("");
      const parts = msgid.split("\0");
      msgid = parts.shift();
      translation.msgid = msgid;
      if (msgidPlural = parts.join("\0")) {
        translation.msgid_plural = msgidPlural;
      }
      msgstr = msgstr.split("\0");
      translation.msgstr = [].concat(msgstr || []);
      if (!this._table.translations[msgctxt]) {
        this._table.translations[msgctxt] = {};
      }
      this._table.translations[msgctxt][msgid] = translation;
    };
    Parser.prototype.parse = function() {
      if (!this._checkMagick()) {
        return false;
      }
      this._revision = this._fileContents[this._readFunc](4);
      this._total = this._fileContents[this._readFunc](8);
      this._offsetOriginals = this._fileContents[this._readFunc](12);
      this._offsetTranslations = this._fileContents[this._readFunc](16);
      this._loadTranslationTable();
      return this._table;
    };
  }
});

// node_modules/gettext-parser/lib/mocompiler.js
var require_mocompiler = __commonJS({
  "node_modules/gettext-parser/lib/mocompiler.js"(exports, module) {
    var { Buffer: Buffer3 } = require_safe_buffer();
    var encoding = require_encoding();
    var sharedFuncs = require_shared();
    var contentType = require_content_type();
    module.exports = function(table) {
      const compiler = new Compiler(table);
      return compiler.compile();
    };
    function Compiler(table = {}) {
      this._table = table;
      let { headers = {}, translations = {} } = this._table;
      headers = Object.keys(headers).reduce((result, key) => {
        const lowerKey = key.toLowerCase();
        if (sharedFuncs.HEADERS.has(lowerKey)) {
          if (lowerKey !== "pot-creation-date") {
            result[sharedFuncs.HEADERS.get(lowerKey)] = headers[key];
          }
        } else {
          result[key] = headers[key];
        }
        return result;
      }, {});
      translations = Object.keys(translations).reduce((result, msgctxt) => {
        const context = translations[msgctxt];
        const msgs = Object.keys(context).reduce((result2, msgid) => {
          const hasTranslation = context[msgid].msgstr.some((item) => !!item.length);
          if (hasTranslation) {
            result2[msgid] = context[msgid];
          }
          return result2;
        }, {});
        if (Object.keys(msgs).length) {
          result[msgctxt] = msgs;
        }
        return result;
      }, {});
      this._table.translations = translations;
      this._table.headers = headers;
      this._translations = [];
      this._writeFunc = "writeUInt32LE";
      this._handleCharset();
    }
    Compiler.prototype.MAGIC = 2500072158;
    Compiler.prototype._handleCharset = function() {
      const ct = contentType.parse(this._table.headers["Content-Type"] || "text/plain");
      const charset = sharedFuncs.formatCharset(this._table.charset || ct.parameters.charset || "utf-8");
      if (ct.parameters.charset) {
        ct.parameters.charset = sharedFuncs.formatCharset(ct.parameters.charset);
      }
      this._table.charset = charset;
      this._table.headers["Content-Type"] = contentType.format(ct);
    };
    Compiler.prototype._generateList = function() {
      const list = [];
      list.push({
        msgid: Buffer3.alloc(0),
        msgstr: encoding.convert(sharedFuncs.generateHeader(this._table.headers), this._table.charset)
      });
      Object.keys(this._table.translations).forEach((msgctxt) => {
        if (typeof this._table.translations[msgctxt] !== "object") {
          return;
        }
        Object.keys(this._table.translations[msgctxt]).forEach((msgid) => {
          if (typeof this._table.translations[msgctxt][msgid] !== "object") {
            return;
          }
          if (msgctxt === "" && msgid === "") {
            return;
          }
          const msgidPlural = this._table.translations[msgctxt][msgid].msgid_plural;
          let key = msgid;
          if (msgctxt) {
            key = msgctxt + "" + key;
          }
          if (msgidPlural) {
            key += "\0" + msgidPlural;
          }
          const value = [].concat(this._table.translations[msgctxt][msgid].msgstr || []).join("\0");
          list.push({
            msgid: encoding.convert(key, this._table.charset),
            msgstr: encoding.convert(value, this._table.charset)
          });
        });
      });
      return list;
    };
    Compiler.prototype._calculateSize = function(list) {
      let msgidLength = 0;
      let msgstrLength = 0;
      let totalLength = 0;
      list.forEach((translation) => {
        msgidLength += translation.msgid.length + 1;
        msgstrLength += translation.msgstr.length + 1;
      });
      totalLength = 4 + 4 + 4 + 4 + 4 + 4 + 4 + (4 + 4) * list.length + (4 + 4) * list.length + msgidLength + msgstrLength;
      return {
        msgid: msgidLength,
        msgstr: msgstrLength,
        total: totalLength
      };
    };
    Compiler.prototype._build = function(list, size) {
      const returnBuffer = Buffer3.alloc(size.total);
      let curPosition = 0;
      let i;
      let len;
      returnBuffer[this._writeFunc](this.MAGIC, 0);
      returnBuffer[this._writeFunc](0, 4);
      returnBuffer[this._writeFunc](list.length, 8);
      returnBuffer[this._writeFunc](28, 12);
      returnBuffer[this._writeFunc](28 + (4 + 4) * list.length, 16);
      returnBuffer[this._writeFunc](0, 20);
      returnBuffer[this._writeFunc](28 + (4 + 4) * list.length * 2, 24);
      curPosition = 28 + 2 * (4 + 4) * list.length;
      for (i = 0, len = list.length; i < len; i++) {
        list[i].msgid.copy(returnBuffer, curPosition);
        returnBuffer[this._writeFunc](list[i].msgid.length, 28 + i * 8);
        returnBuffer[this._writeFunc](curPosition, 28 + i * 8 + 4);
        returnBuffer[curPosition + list[i].msgid.length] = 0;
        curPosition += list[i].msgid.length + 1;
      }
      for (i = 0, len = list.length; i < len; i++) {
        list[i].msgstr.copy(returnBuffer, curPosition);
        returnBuffer[this._writeFunc](list[i].msgstr.length, 28 + (4 + 4) * list.length + i * 8);
        returnBuffer[this._writeFunc](curPosition, 28 + (4 + 4) * list.length + i * 8 + 4);
        returnBuffer[curPosition + list[i].msgstr.length] = 0;
        curPosition += list[i].msgstr.length + 1;
      }
      return returnBuffer;
    };
    Compiler.prototype.compile = function() {
      const list = this._generateList();
      const size = this._calculateSize(list);
      list.sort(sharedFuncs.compareMsgid);
      return this._build(list, size);
    };
  }
});

// node_modules/gettext-parser/index.js
var require_gettext_parser = __commonJS({
  "node_modules/gettext-parser/index.js"(exports, module) {
    var { parse, stream } = require_poparser();
    module.exports.po = {
      parse,
      createParseStream: stream,
      compile: require_pocompiler()
    };
    module.exports.mo = {
      parse: require_moparser(),
      compile: require_mocompiler()
    };
  }
});

// src/index.ts
var import_gettext_parser = __toESM(require_gettext_parser(), 1);
async function readResources(args) {
  const result = [];
  if (args.config.referenceLanguage === "auto") {
    const translationIds = [[""]];
    let testObject = {};
    for (const language of args.config.languages) {
      const resourcePath = args.pluginConfig.pathPattern.replace(
        "{language}",
        language
      );
      const poFile = import_gettext_parser.default.po.parse(
        await args.$fs.readFile(resourcePath, "utf-8")
      );
      translationIds.push(
        Object.keys(poFile.translations[""]).filter(
          (translation) => translation[0] !== ""
        )
      );
    }
    const keys2 = [
      ...new Set(
        translationIds.flatMap((value) => value).filter((value) => value !== "")
      )
    ];
    for (const key of keys2) {
      Object.assign(testObject, { [key]: { msgid: key, msgstr: [" "] } });
    }
    const potFile = {
      headers: { header: "" },
      charset: "uft-8",
      translations: { [""]: testObject }
    };
    result.push(parseResource(potFile, "auto"));
    console.log(potFile, "testob");
  }
  for (const language of args.config.languages) {
    let response;
    try {
      const resourcePath = args.pluginConfig.pathPattern.replace("{language}", language) + "t";
      response = await args.$fs.readFile(resourcePath, "utf-8");
    } catch (error) {
      const resourcePath = args.pluginConfig.pathPattern.replace(
        "{language}",
        language
      );
      response = await args.$fs.readFile(resourcePath, "utf-8");
    }
    const poFile = import_gettext_parser.default.po.parse(response);
    result.push(parseResource(poFile, language));
  }
  console.log(result);
  return result;
}
async function writeResources(args) {
  for (const resource of args.resources) {
    const resourcePath = args.pluginConfig.pathPattern.replace(
      "{language}",
      resource.languageTag.name
    );
    const poFile = serializeResource(resource);
    const text = import_gettext_parser.default.po.compile(poFile);
    await args.$fs.writeFile(resourcePath, text, { encoding: "utf-8" });
  }
}
function parseResource(poFile, language) {
  return {
    metadata: {
      headers: poFile.headers,
      charset: poFile.charset
    },
    type: "Resource",
    languageTag: {
      type: "LanguageTag",
      name: language
    },
    body: Object.values(poFile.translations[""]).filter((translation) => translation.msgid !== "").map((translation) => parseMessage(translation))
  };
}
function parseMessage(translation) {
  return {
    type: "Message",
    metadata: {
      comments: translation.comments
    },
    id: {
      type: "Identifier",
      name: translation.msgid
    },
    pattern: {
      type: "Pattern",
      elements: [{ type: "Text", value: translation.msgstr[0] }]
    }
  };
}
function serializeResource(resource) {
  return {
    headers: resource.metadata.headers,
    charset: resource.metadata.charset,
    translations: {
      "": Object.fromEntries(
        resource.body.map((message) => {
          return [message.id.name, serializeMessage(message)];
        })
      )
    }
  };
}
function serializeMessage(message) {
  return {
    comments: message.metadata,
    msgid: message.id.name,
    msgstr: [message.pattern.elements[0].value]
  };
}
export {
  readResources,
  writeResources
};
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/*! Bundled license information:

safe-buffer/index.js:
  (*! safe-buffer. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> *)

content-type/index.js:
  (*!
   * content-type
   * Copyright(c) 2015 Douglas Christopher Wilson
   * MIT Licensed
   *)
*/
