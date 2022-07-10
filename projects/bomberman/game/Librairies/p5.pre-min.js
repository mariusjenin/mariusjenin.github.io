/*! p5.js v0.7.2 September 02, 2018 */
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.p5 = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var lookup = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

;(function (exports) {
	'use strict';

  var Arr = (typeof Uint8Array !== 'undefined')
    ? Uint8Array
    : Array

	var PLUS   = '+'.charCodeAt(0)
	var SLASH  = '/'.charCodeAt(0)
	var NUMBER = '0'.charCodeAt(0)
	var LOWER  = 'a'.charCodeAt(0)
	var UPPER  = 'A'.charCodeAt(0)
	var PLUS_URL_SAFE = '-'.charCodeAt(0)
	var SLASH_URL_SAFE = '_'.charCodeAt(0)

	function decode (elt) {
		var code = elt.charCodeAt(0)
		if (code === PLUS ||
		    code === PLUS_URL_SAFE)
			return 62 // '+'
		if (code === SLASH ||
		    code === SLASH_URL_SAFE)
			return 63 // '/'
		if (code < NUMBER)
			return -1 //no match
		if (code < NUMBER + 10)
			return code - NUMBER + 26 + 26
		if (code < UPPER + 26)
			return code - UPPER
		if (code < LOWER + 26)
			return code - LOWER + 26
	}

	function b64ToByteArray (b64) {
		var i, j, l, tmp, placeHolders, arr

		if (b64.length % 4 > 0) {
			throw new Error('Invalid string. Length must be a multiple of 4')
		}

		// the number of equal signs (place holders)
		// if there are two placeholders, than the two characters before it
		// represent one byte
		// if there is only one, then the three characters before it represent 2 bytes
		// this is just a cheap hack to not do indexOf twice
		var len = b64.length
		placeHolders = '=' === b64.charAt(len - 2) ? 2 : '=' === b64.charAt(len - 1) ? 1 : 0

		// base64 is 4/3 + up to two characters of the original data
		arr = new Arr(b64.length * 3 / 4 - placeHolders)

		// if there are placeholders, only get up to the last complete 4 chars
		l = placeHolders > 0 ? b64.length - 4 : b64.length

		var L = 0

		function push (v) {
			arr[L++] = v
		}

		for (i = 0, j = 0; i < l; i += 4, j += 3) {
			tmp = (decode(b64.charAt(i)) << 18) | (decode(b64.charAt(i + 1)) << 12) | (decode(b64.charAt(i + 2)) << 6) | decode(b64.charAt(i + 3))
			push((tmp & 0xFF0000) >> 16)
			push((tmp & 0xFF00) >> 8)
			push(tmp & 0xFF)
		}

		if (placeHolders === 2) {
			tmp = (decode(b64.charAt(i)) << 2) | (decode(b64.charAt(i + 1)) >> 4)
			push(tmp & 0xFF)
		} else if (placeHolders === 1) {
			tmp = (decode(b64.charAt(i)) << 10) | (decode(b64.charAt(i + 1)) << 4) | (decode(b64.charAt(i + 2)) >> 2)
			push((tmp >> 8) & 0xFF)
			push(tmp & 0xFF)
		}

		return arr
	}

	function uint8ToBase64 (uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length

		function encode (num) {
			return lookup.charAt(num)
		}

		function tripletToBase64 (num) {
			return encode(num >> 18 & 0x3F) + encode(num >> 12 & 0x3F) + encode(num >> 6 & 0x3F) + encode(num & 0x3F)
		}

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
			output += tripletToBase64(temp)
		}

		// pad the end with zeros, but make sure to not forget the extra bytes
		switch (extraBytes) {
			case 1:
				temp = uint8[uint8.length - 1]
				output += encode(temp >> 2)
				output += encode((temp << 4) & 0x3F)
				output += '=='
				break
			case 2:
				temp = (uint8[uint8.length - 2] << 8) + (uint8[uint8.length - 1])
				output += encode(temp >> 10)
				output += encode((temp >> 4) & 0x3F)
				output += encode((temp << 2) & 0x3F)
				output += '='
				break
		}

		return output
	}

	exports.toByteArray = b64ToByteArray
	exports.fromByteArray = uint8ToBase64
}(typeof exports === 'undefined' ? (this.base64js = {}) : exports))

},{}],2:[function(_dereq_,module,exports){

},{}],3:[function(_dereq_,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = _dereq_('base64-js')
var ieee754 = _dereq_('ieee754')
var isArray = _dereq_('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50
Buffer.poolSize = 8192 // not used by this implementation

var rootParent = {}

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Safari 5-7 lacks support for changing the `Object.prototype.constructor` property
 *     on objects.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

function typedArraySupport () {
  function Bar () {}
  try {
    var arr = new Uint8Array(1)
    arr.foo = function () { return 42 }
    arr.constructor = Bar
    return arr.foo() === 42 && // typed array instances can be augmented
        arr.constructor === Bar && // constructor can be set
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

/**
 * Class: Buffer
 * =============
 *
 * The Buffer constructor returns instances of `Uint8Array` that are augmented
 * with function properties for all the node `Buffer` API functions. We use
 * `Uint8Array` so that square bracket notation works as expected -- it returns
 * a single octet.
 *
 * By augmenting the instances, we can avoid modifying the `Uint8Array`
 * prototype.
 */
function Buffer (arg) {
  if (!(this instanceof Buffer)) {
    // Avoid going through an ArgumentsAdaptorTrampoline in the common case.
    if (arguments.length > 1) return new Buffer(arg, arguments[1])
    return new Buffer(arg)
  }

  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    this.length = 0
    this.parent = undefined
  }

  // Common case.
  if (typeof arg === 'number') {
    return fromNumber(this, arg)
  }

  // Slightly less common case.
  if (typeof arg === 'string') {
    return fromString(this, arg, arguments.length > 1 ? arguments[1] : 'utf8')
  }

  // Unusual.
  return fromObject(this, arg)
}

function fromNumber (that, length) {
  that = allocate(that, length < 0 ? 0 : checked(length) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < length; i++) {
      that[i] = 0
    }
  }
  return that
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') encoding = 'utf8'

  // Assumption: byteLength() return value is always < kMaxLength.
  var length = byteLength(string, encoding) | 0
  that = allocate(that, length)

  that.write(string, encoding)
  return that
}

function fromObject (that, object) {
  if (Buffer.isBuffer(object)) return fromBuffer(that, object)

  if (isArray(object)) return fromArray(that, object)

  if (object == null) {
    throw new TypeError('must start with number, buffer, array or string')
  }

  if (typeof ArrayBuffer !== 'undefined') {
    if (object.buffer instanceof ArrayBuffer) {
      return fromTypedArray(that, object)
    }
    if (object instanceof ArrayBuffer) {
      return fromArrayBuffer(that, object)
    }
  }

  if (object.length) return fromArrayLike(that, object)

  return fromJsonObject(that, object)
}

function fromBuffer (that, buffer) {
  var length = checked(buffer.length) | 0
  that = allocate(that, length)
  buffer.copy(that, 0, 0, length)
  return that
}

function fromArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Duplicate of fromArray() to keep fromArray() monomorphic.
function fromTypedArray (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  // Truncating the elements is probably not what people expect from typed
  // arrays with BYTES_PER_ELEMENT > 1 but it's compatible with the behavior
  // of the old Buffer constructor.
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    array.byteLength
    that = Buffer._augment(new Uint8Array(array))
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromTypedArray(that, new Uint8Array(array))
  }
  return that
}

function fromArrayLike (that, array) {
  var length = checked(array.length) | 0
  that = allocate(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

// Deserialize { type: 'Buffer', data: [1,2,3,...] } into a Buffer object.
// Returns a zero-length buffer for inputs that don't conform to the spec.
function fromJsonObject (that, object) {
  var array
  var length = 0

  if (object.type === 'Buffer' && isArray(object.data)) {
    array = object.data
    length = checked(array.length) | 0
  }
  that = allocate(that, length)

  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
} else {
  // pre-set for values that may exist in the future
  Buffer.prototype.length = undefined
  Buffer.prototype.parent = undefined
}

function allocate (that, length) {
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = Buffer._augment(new Uint8Array(length))
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that.length = length
    that._isBuffer = true
  }

  var fromPool = length !== 0 && length <= Buffer.poolSize >>> 1
  if (fromPool) that.parent = rootParent

  return that
}

function checked (length) {
  // Note: cannot use `length < kMaxLength` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (subject, encoding) {
  if (!(this instanceof SlowBuffer)) return new SlowBuffer(subject, encoding)

  var buf = new Buffer(subject, encoding)
  delete buf.parent
  return buf
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  var i = 0
  var len = Math.min(x, y)
  while (i < len) {
    if (a[i] !== b[i]) break

    ++i
  }

  if (i !== len) {
    x = a[i]
    y = b[i]
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'binary':
    case 'base64':
    case 'raw':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) throw new TypeError('list argument must be an Array of Buffers.')

  if (list.length === 0) {
    return new Buffer(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; i++) {
      length += list[i].length
    }
  }

  var buf = new Buffer(length)
  var pos = 0
  for (i = 0; i < list.length; i++) {
    var item = list[i]
    item.copy(buf, pos)
    pos += item.length
  }
  return buf
}

function byteLength (string, encoding) {
  if (typeof string !== 'string') string = '' + string

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'binary':
      // Deprecated
      case 'raw':
      case 'raws':
        return len
      case 'utf8':
      case 'utf-8':
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  start = start | 0
  end = end === undefined || end === Infinity ? this.length : end | 0

  if (!encoding) encoding = 'utf8'
  if (start < 0) start = 0
  if (end > this.length) end = this.length
  if (end <= start) return ''

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'binary':
        return binarySlice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return 0
  return Buffer.compare(this, b)
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset) {
  if (byteOffset > 0x7fffffff) byteOffset = 0x7fffffff
  else if (byteOffset < -0x80000000) byteOffset = -0x80000000
  byteOffset >>= 0

  if (this.length === 0) return -1
  if (byteOffset >= this.length) return -1

  // Negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = Math.max(this.length + byteOffset, 0)

  if (typeof val === 'string') {
    if (val.length === 0) return -1 // special case: looking for empty string always fails
    return String.prototype.indexOf.call(this, val, byteOffset)
  }
  if (Buffer.isBuffer(val)) {
    return arrayIndexOf(this, val, byteOffset)
  }
  if (typeof val === 'number') {
    if (Buffer.TYPED_ARRAY_SUPPORT && Uint8Array.prototype.indexOf === 'function') {
      return Uint8Array.prototype.indexOf.call(this, val, byteOffset)
    }
    return arrayIndexOf(this, [ val ], byteOffset)
  }

  function arrayIndexOf (arr, val, byteOffset) {
    var foundIndex = -1
    for (var i = 0; byteOffset + i < arr.length; i++) {
      if (arr[byteOffset + i] === val[foundIndex === -1 ? 0 : i - foundIndex]) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === val.length) return byteOffset + foundIndex
      } else {
        foundIndex = -1
      }
    }
    return -1
  }

  throw new TypeError('val must be string, number or Buffer')
}

// `get` is deprecated
Buffer.prototype.get = function get (offset) {
  console.log('.get() is deprecated. Access using array indexes instead.')
  return this.readUInt8(offset)
}

// `set` is deprecated
Buffer.prototype.set = function set (v, offset) {
  console.log('.set() is deprecated. Access using array indexes instead.')
  return this.writeUInt8(v, offset)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new Error('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; i++) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) throw new Error('Invalid hex string')
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function binaryWrite (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    var swap = encoding
    encoding = offset
    offset = length | 0
    length = swap
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'binary':
        return binaryWrite(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function binarySlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; i++) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; i++) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = Buffer._augment(this.subarray(start, end))
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; i++) {
      newBuf[i] = this[i + start]
    }
  }

  if (newBuf.length) newBuf.parent = this.parent || this

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('buffer must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkInt(this, value, offset, byteLength, Math.pow(2, 8 * byteLength), 0)

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; i++) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; i++) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = value < 0 ? 1 : 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (value > max || value < min) throw new RangeError('value is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('index out of range')
  if (offset < 0) throw new RangeError('index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; i--) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; i++) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    target._set(this.subarray(start, start + len), targetStart)
  }

  return len
}

// fill(value, start=0, end=buffer.length)
Buffer.prototype.fill = function fill (value, start, end) {
  if (!value) value = 0
  if (!start) start = 0
  if (!end) end = this.length

  if (end < start) throw new RangeError('end < start')

  // Fill 0 bytes; we're done
  if (end === start) return
  if (this.length === 0) return

  if (start < 0 || start >= this.length) throw new RangeError('start out of bounds')
  if (end < 0 || end > this.length) throw new RangeError('end out of bounds')

  var i
  if (typeof value === 'number') {
    for (i = start; i < end; i++) {
      this[i] = value
    }
  } else {
    var bytes = utf8ToBytes(value.toString())
    var len = bytes.length
    for (i = start; i < end; i++) {
      this[i] = bytes[i % len]
    }
  }

  return this
}

/**
 * Creates a new `ArrayBuffer` with the *copied* memory of the buffer instance.
 * Added in Node 0.12. Only available in browsers that support ArrayBuffer.
 */
Buffer.prototype.toArrayBuffer = function toArrayBuffer () {
  if (typeof Uint8Array !== 'undefined') {
    if (Buffer.TYPED_ARRAY_SUPPORT) {
      return (new Buffer(this)).buffer
    } else {
      var buf = new Uint8Array(this.length)
      for (var i = 0, len = buf.length; i < len; i += 1) {
        buf[i] = this[i]
      }
      return buf.buffer
    }
  } else {
    throw new TypeError('Buffer.toArrayBuffer not supported in this browser')
  }
}

// HELPER FUNCTIONS
// ================

var BP = Buffer.prototype

/**
 * Augment a Uint8Array *instance* (not the Uint8Array class!) with Buffer methods
 */
Buffer._augment = function _augment (arr) {
  arr.constructor = Buffer
  arr._isBuffer = true

  // save reference to original Uint8Array set method before overwriting
  arr._set = arr.set

  // deprecated
  arr.get = BP.get
  arr.set = BP.set

  arr.write = BP.write
  arr.toString = BP.toString
  arr.toLocaleString = BP.toString
  arr.toJSON = BP.toJSON
  arr.equals = BP.equals
  arr.compare = BP.compare
  arr.indexOf = BP.indexOf
  arr.copy = BP.copy
  arr.slice = BP.slice
  arr.readUIntLE = BP.readUIntLE
  arr.readUIntBE = BP.readUIntBE
  arr.readUInt8 = BP.readUInt8
  arr.readUInt16LE = BP.readUInt16LE
  arr.readUInt16BE = BP.readUInt16BE
  arr.readUInt32LE = BP.readUInt32LE
  arr.readUInt32BE = BP.readUInt32BE
  arr.readIntLE = BP.readIntLE
  arr.readIntBE = BP.readIntBE
  arr.readInt8 = BP.readInt8
  arr.readInt16LE = BP.readInt16LE
  arr.readInt16BE = BP.readInt16BE
  arr.readInt32LE = BP.readInt32LE
  arr.readInt32BE = BP.readInt32BE
  arr.readFloatLE = BP.readFloatLE
  arr.readFloatBE = BP.readFloatBE
  arr.readDoubleLE = BP.readDoubleLE
  arr.readDoubleBE = BP.readDoubleBE
  arr.writeUInt8 = BP.writeUInt8
  arr.writeUIntLE = BP.writeUIntLE
  arr.writeUIntBE = BP.writeUIntBE
  arr.writeUInt16LE = BP.writeUInt16LE
  arr.writeUInt16BE = BP.writeUInt16BE
  arr.writeUInt32LE = BP.writeUInt32LE
  arr.writeUInt32BE = BP.writeUInt32BE
  arr.writeIntLE = BP.writeIntLE
  arr.writeIntBE = BP.writeIntBE
  arr.writeInt8 = BP.writeInt8
  arr.writeInt16LE = BP.writeInt16LE
  arr.writeInt16BE = BP.writeInt16BE
  arr.writeInt32LE = BP.writeInt32LE
  arr.writeInt32BE = BP.writeInt32BE
  arr.writeFloatLE = BP.writeFloatLE
  arr.writeFloatBE = BP.writeFloatBE
  arr.writeDoubleLE = BP.writeDoubleLE
  arr.writeDoubleBE = BP.writeDoubleBE
  arr.fill = BP.fill
  arr.inspect = BP.inspect
  arr.toArrayBuffer = BP.toArrayBuffer

  return arr
}

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; i++) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; i++) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; i++) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":1,"ieee754":7,"isarray":8}],4:[function(_dereq_,module,exports){
(function (process,global){
/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = _dereq_;
    var vertx = r('vertx');
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && typeof _dereq_ === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator$1(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator$1.prototype._enumerate = function (input) {
  for (var i = 0; this._state === PENDING && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator$1.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$1 = c.resolve;

  if (resolve$$1 === resolve$1) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$2) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$1) {
        return resolve$$1(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$1(entry), i);
  }
};

Enumerator$1.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator$1.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all$1(entries) {
  return new Enumerator$1(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race$1(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise$2(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
  }
}

Promise$2.all = all$1;
Promise$2.race = race$1;
Promise$2.resolve = resolve$1;
Promise$2.reject = reject$1;
Promise$2._setScheduler = setScheduler;
Promise$2._setAsap = setAsap;
Promise$2._asap = asap;

Promise$2.prototype = {
  constructor: Promise$2,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

/*global self*/
function polyfill$1() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise$2;
}

// Strange compat..
Promise$2.polyfill = polyfill$1;
Promise$2.Promise = Promise$2;

return Promise$2;

})));



}).call(this,_dereq_('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":11}],5:[function(_dereq_,module,exports){
(function (global, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['exports', 'module'], factory);
  } else if (typeof exports !== 'undefined' && typeof module !== 'undefined') {
    factory(exports, module);
  } else {
    var mod = {
      exports: {}
    };
    factory(mod.exports, mod);
    global.fetchJsonp = mod.exports;
  }
})(this, function (exports, module) {
  'use strict';

  var defaultOptions = {
    timeout: 5000,
    jsonpCallback: 'callback',
    jsonpCallbackFunction: null
  };

  function generateCallbackFunction() {
    return 'jsonp_' + Date.now() + '_' + Math.ceil(Math.random() * 100000);
  }

  function clearFunction(functionName) {
    // IE8 throws an exception when you try to delete a property on window
    // http://stackoverflow.com/a/1824228/751089
    try {
      delete window[functionName];
    } catch (e) {
      window[functionName] = undefined;
    }
  }

  function removeScript(scriptId) {
    var script = document.getElementById(scriptId);
    if (script) {
      document.getElementsByTagName('head')[0].removeChild(script);
    }
  }

  function fetchJsonp(_url) {
    var options = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    // to avoid param reassign
    var url = _url;
    var timeout = options.timeout || defaultOptions.timeout;
    var jsonpCallback = options.jsonpCallback || defaultOptions.jsonpCallback;

    var timeoutId = undefined;

    return new Promise(function (resolve, reject) {
      var callbackFunction = options.jsonpCallbackFunction || generateCallbackFunction();
      var scriptId = jsonpCallback + '_' + callbackFunction;

      window[callbackFunction] = function (response) {
        resolve({
          ok: true,
          // keep consistent with fetch API
          json: function json() {
            return Promise.resolve(response);
          }
        });

        if (timeoutId) clearTimeout(timeoutId);

        removeScript(scriptId);

        clearFunction(callbackFunction);
      };

      // Check if the user set their own params, and if not add a ? to start a list of params
      url += url.indexOf('?') === -1 ? '?' : '&';

      var jsonpScript = document.createElement('script');
      jsonpScript.setAttribute('src', '' + url + jsonpCallback + '=' + callbackFunction);
      if (options.charset) {
        jsonpScript.setAttribute('charset', options.charset);
      }
      jsonpScript.id = scriptId;
      document.getElementsByTagName('head')[0].appendChild(jsonpScript);

      timeoutId = setTimeout(function () {
        reject(new Error('JSONP request to ' + _url + ' timed out'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        window[callbackFunction] = function () {
          clearFunction(callbackFunction);
        };
      }, timeout);

      // Caught if got 404/500
      jsonpScript.onerror = function () {
        reject(new Error('JSONP request to ' + _url + ' failed'));

        clearFunction(callbackFunction);
        removeScript(scriptId);
        if (timeoutId) clearTimeout(timeoutId);
      };
    });
  }

  // export as global function
  /*
  let local;
  if (typeof global !== 'undefined') {
    local = global;
  } else if (typeof self !== 'undefined') {
    local = self;
  } else {
    try {
      local = Function('return this')();
    } catch (e) {
      throw new Error('polyfill failed because global object is unavailable in this environment');
    }
  }
  local.fetchJsonp = fetchJsonp;
  */

  module.exports = fetchJsonp;
});
},{}],6:[function(_dereq_,module,exports){
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/*global self */
/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if (typeof module !== "undefined" && module.exports) {
  module.exports.saveAs = saveAs;
} else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
  define("FileSaver.js", function() {
    return saveAs;
  });
}

},{}],7:[function(_dereq_,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],8:[function(_dereq_,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}],9:[function(_dereq_,module,exports){
/*

 Copyright 2000, Silicon Graphics, Inc. All Rights Reserved.
 Copyright 2015, Google Inc. All Rights Reserved.

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to
 deal in the Software without restriction, including without limitation the
 rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 sell copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice including the dates of first publication and
 either this permission notice or a reference to http://oss.sgi.com/projects/FreeB/
 shall be included in all copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 SILICON GRAPHICS, INC. BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR
 IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 Original Code. The Original Code is: OpenGL Sample Implementation,
 Version 1.2.1, released January 26, 2000, developed by Silicon Graphics,
 Inc. The Original Code is Copyright (c) 1991-2000 Silicon Graphics, Inc.
 Copyright in any portions created by third parties is as indicated
 elsewhere herein. All Rights Reserved.
*/
'use strict';var n;function t(a,b){return a.b===b.b&&a.a===b.a}function u(a,b){return a.b<b.b||a.b===b.b&&a.a<=b.a}function v(a,b,c){var d=b.b-a.b,e=c.b-b.b;return 0<d+e?d<e?b.a-a.a+d/(d+e)*(a.a-c.a):b.a-c.a+e/(d+e)*(c.a-a.a):0}function x(a,b,c){var d=b.b-a.b,e=c.b-b.b;return 0<d+e?(b.a-c.a)*d+(b.a-a.a)*e:0}function z(a,b){return a.a<b.a||a.a===b.a&&a.b<=b.b}function aa(a,b,c){var d=b.a-a.a,e=c.a-b.a;return 0<d+e?d<e?b.b-a.b+d/(d+e)*(a.b-c.b):b.b-c.b+e/(d+e)*(c.b-a.b):0}
function ba(a,b,c){var d=b.a-a.a,e=c.a-b.a;return 0<d+e?(b.b-c.b)*d+(b.b-a.b)*e:0}function ca(a){return u(a.b.a,a.a)}function da(a){return u(a.a,a.b.a)}function A(a,b,c,d){a=0>a?0:a;c=0>c?0:c;return a<=c?0===c?(b+d)/2:b+a/(a+c)*(d-b):d+c/(a+c)*(b-d)};function ea(a){var b=B(a.b);C(b,a.c);C(b.b,a.c);D(b,a.a);return b}function E(a,b){var c=!1,d=!1;a!==b&&(b.a!==a.a&&(d=!0,F(b.a,a.a)),b.d!==a.d&&(c=!0,G(b.d,a.d)),H(b,a),d||(C(b,a.a),a.a.c=a),c||(D(b,a.d),a.d.a=a))}function I(a){var b=a.b,c=!1;a.d!==a.b.d&&(c=!0,G(a.d,a.b.d));a.c===a?F(a.a,null):(a.b.d.a=J(a),a.a.c=a.c,H(a,J(a)),c||D(a,a.d));b.c===b?(F(b.a,null),G(b.d,null)):(a.d.a=J(b),b.a.c=b.c,H(b,J(b)));fa(a)}
function K(a){var b=B(a),c=b.b;H(b,a.e);b.a=a.b.a;C(c,b.a);b.d=c.d=a.d;b=b.b;H(a.b,J(a.b));H(a.b,b);a.b.a=b.a;b.b.a.c=b.b;b.b.d=a.b.d;b.f=a.f;b.b.f=a.b.f;return b}function L(a,b){var c=!1,d=B(a),e=d.b;b.d!==a.d&&(c=!0,G(b.d,a.d));H(d,a.e);H(e,b);d.a=a.b.a;e.a=b.a;d.d=e.d=a.d;a.d.a=e;c||D(d,a.d);return d}function B(a){var b=new M,c=new M,d=a.b.h;c.h=d;d.b.h=b;b.h=a;a.b.h=c;b.b=c;b.c=b;b.e=c;c.b=b;c.c=c;return c.e=b}function H(a,b){var c=a.c,d=b.c;c.b.e=b;d.b.e=a;a.c=d;b.c=c}
function C(a,b){var c=b.f,d=new N(b,c);c.e=d;b.f=d;c=d.c=a;do c.a=d,c=c.c;while(c!==a)}function D(a,b){var c=b.d,d=new ga(b,c);c.b=d;b.d=d;d.a=a;d.c=b.c;c=a;do c.d=d,c=c.e;while(c!==a)}function fa(a){var b=a.h;a=a.b.h;b.b.h=a;a.b.h=b}function F(a,b){var c=a.c,d=c;do d.a=b,d=d.c;while(d!==c);c=a.f;d=a.e;d.f=c;c.e=d}function G(a,b){var c=a.a,d=c;do d.d=b,d=d.e;while(d!==c);c=a.d;d=a.b;d.d=c;c.b=d};function ha(a){var b=0;Math.abs(a[1])>Math.abs(a[0])&&(b=1);Math.abs(a[2])>Math.abs(a[b])&&(b=2);return b};var O=4*1E150;function P(a,b){a.f+=b.f;a.b.f+=b.b.f}function ia(a,b,c){a=a.a;b=b.a;c=c.a;if(b.b.a===a)return c.b.a===a?u(b.a,c.a)?0>=x(c.b.a,b.a,c.a):0<=x(b.b.a,c.a,b.a):0>=x(c.b.a,a,c.a);if(c.b.a===a)return 0<=x(b.b.a,a,b.a);b=v(b.b.a,a,b.a);a=v(c.b.a,a,c.a);return b>=a}function Q(a){a.a.i=null;var b=a.e;b.a.c=b.c;b.c.a=b.a;a.e=null}function ja(a,b){I(a.a);a.c=!1;a.a=b;b.i=a}function ka(a){var b=a.a.a;do a=R(a);while(a.a.a===b);a.c&&(b=L(S(a).a.b,a.a.e),ja(a,b),a=R(a));return a}
function la(a,b,c){var d=new ma;d.a=c;d.e=na(a.f,b.e,d);return c.i=d}function oa(a,b){switch(a.s){case 100130:return 0!==(b&1);case 100131:return 0!==b;case 100132:return 0<b;case 100133:return 0>b;case 100134:return 2<=b||-2>=b}return!1}function pa(a){var b=a.a,c=b.d;c.c=a.d;c.a=b;Q(a)}function T(a,b,c){a=b;for(b=b.a;a!==c;){a.c=!1;var d=S(a),e=d.a;if(e.a!==b.a){if(!d.c){pa(a);break}e=L(b.c.b,e.b);ja(d,e)}b.c!==e&&(E(J(e),e),E(b,e));pa(a);b=d.a;a=d}return b}
function U(a,b,c,d,e,f){var g=!0;do la(a,b,c.b),c=c.c;while(c!==d);for(null===e&&(e=S(b).a.b.c);;){d=S(b);c=d.a.b;if(c.a!==e.a)break;c.c!==e&&(E(J(c),c),E(J(e),c));d.f=b.f-c.f;d.d=oa(a,d.f);b.b=!0;!g&&qa(a,b)&&(P(c,e),Q(b),I(e));g=!1;b=d;e=c}b.b=!0;f&&ra(a,b)}function sa(a,b,c,d,e){var f=[b.g[0],b.g[1],b.g[2]];b.d=null;b.d=a.o?a.o(f,c,d,a.c)||null:null;null===b.d&&(e?a.n||(V(a,100156),a.n=!0):b.d=c[0])}
function ta(a,b,c){var d=[null,null,null,null];d[0]=b.a.d;d[1]=c.a.d;sa(a,b.a,d,[.5,.5,0,0],!1);E(b,c)}function ua(a,b,c,d,e){var f=Math.abs(b.b-a.b)+Math.abs(b.a-a.a),g=Math.abs(c.b-a.b)+Math.abs(c.a-a.a),h=e+1;d[e]=.5*g/(f+g);d[h]=.5*f/(f+g);a.g[0]+=d[e]*b.g[0]+d[h]*c.g[0];a.g[1]+=d[e]*b.g[1]+d[h]*c.g[1];a.g[2]+=d[e]*b.g[2]+d[h]*c.g[2]}
function qa(a,b){var c=S(b),d=b.a,e=c.a;if(u(d.a,e.a)){if(0<x(e.b.a,d.a,e.a))return!1;if(!t(d.a,e.a))K(e.b),E(d,J(e)),b.b=c.b=!0;else if(d.a!==e.a){var c=a.e,f=d.a.h;if(0<=f){var c=c.b,g=c.d,h=c.e,k=c.c,l=k[f];g[l]=g[c.a];k[g[l]]=l;l<=--c.a&&(1>=l?W(c,l):u(h[g[l>>1]],h[g[l]])?W(c,l):va(c,l));h[f]=null;k[f]=c.b;c.b=f}else for(c.c[-(f+1)]=null;0<c.a&&null===c.c[c.d[c.a-1]];)--c.a;ta(a,J(e),d)}}else{if(0>x(d.b.a,e.a,d.a))return!1;R(b).b=b.b=!0;K(d.b);E(J(e),d)}return!0}
function wa(a,b){var c=S(b),d=b.a,e=c.a,f=d.a,g=e.a,h=d.b.a,k=e.b.a,l=new N;x(h,a.a,f);x(k,a.a,g);if(f===g||Math.min(f.a,h.a)>Math.max(g.a,k.a))return!1;if(u(f,g)){if(0<x(k,f,g))return!1}else if(0>x(h,g,f))return!1;var r=h,p=f,q=k,y=g,m,w;u(r,p)||(m=r,r=p,p=m);u(q,y)||(m=q,q=y,y=m);u(r,q)||(m=r,r=q,q=m,m=p,p=y,y=m);u(q,p)?u(p,y)?(m=v(r,q,p),w=v(q,p,y),0>m+w&&(m=-m,w=-w),l.b=A(m,q.b,w,p.b)):(m=x(r,q,p),w=-x(r,y,p),0>m+w&&(m=-m,w=-w),l.b=A(m,q.b,w,y.b)):l.b=(q.b+p.b)/2;z(r,p)||(m=r,r=p,p=m);z(q,y)||
(m=q,q=y,y=m);z(r,q)||(m=r,r=q,q=m,m=p,p=y,y=m);z(q,p)?z(p,y)?(m=aa(r,q,p),w=aa(q,p,y),0>m+w&&(m=-m,w=-w),l.a=A(m,q.a,w,p.a)):(m=ba(r,q,p),w=-ba(r,y,p),0>m+w&&(m=-m,w=-w),l.a=A(m,q.a,w,y.a)):l.a=(q.a+p.a)/2;u(l,a.a)&&(l.b=a.a.b,l.a=a.a.a);r=u(f,g)?f:g;u(r,l)&&(l.b=r.b,l.a=r.a);if(t(l,f)||t(l,g))return qa(a,b),!1;if(!t(h,a.a)&&0<=x(h,a.a,l)||!t(k,a.a)&&0>=x(k,a.a,l)){if(k===a.a)return K(d.b),E(e.b,d),b=ka(b),d=S(b).a,T(a,S(b),c),U(a,b,J(d),d,d,!0),!0;if(h===a.a){K(e.b);E(d.e,J(e));f=c=b;g=f.a.b.a;
do f=R(f);while(f.a.b.a===g);b=f;f=S(b).a.b.c;c.a=J(e);e=T(a,c,null);U(a,b,e.c,d.b.c,f,!0);return!0}0<=x(h,a.a,l)&&(R(b).b=b.b=!0,K(d.b),d.a.b=a.a.b,d.a.a=a.a.a);0>=x(k,a.a,l)&&(b.b=c.b=!0,K(e.b),e.a.b=a.a.b,e.a.a=a.a.a);return!1}K(d.b);K(e.b);E(J(e),d);d.a.b=l.b;d.a.a=l.a;d.a.h=xa(a.e,d.a);d=d.a;e=[0,0,0,0];l=[f.d,h.d,g.d,k.d];d.g[0]=d.g[1]=d.g[2]=0;ua(d,f,h,e,0);ua(d,g,k,e,2);sa(a,d,l,e,!0);R(b).b=b.b=c.b=!0;return!1}
function ra(a,b){for(var c=S(b);;){for(;c.b;)b=c,c=S(c);if(!b.b&&(c=b,b=R(b),null===b||!b.b))break;b.b=!1;var d=b.a,e=c.a,f;if(f=d.b.a!==e.b.a)a:{f=b;var g=S(f),h=f.a,k=g.a,l=void 0;if(u(h.b.a,k.b.a)){if(0>x(h.b.a,k.b.a,h.a)){f=!1;break a}R(f).b=f.b=!0;l=K(h);E(k.b,l);l.d.c=f.d}else{if(0<x(k.b.a,h.b.a,k.a)){f=!1;break a}f.b=g.b=!0;l=K(k);E(h.e,k.b);l.b.d.c=f.d}f=!0}f&&(c.c?(Q(c),I(e),c=S(b),e=c.a):b.c&&(Q(b),I(d),b=R(c),d=b.a));if(d.a!==e.a)if(d.b.a===e.b.a||b.c||c.c||d.b.a!==a.a&&e.b.a!==a.a)qa(a,
b);else if(wa(a,b))break;d.a===e.a&&d.b.a===e.b.a&&(P(e,d),Q(b),I(d),b=R(c))}}
function ya(a,b){a.a=b;for(var c=b.c;null===c.i;)if(c=c.c,c===b.c){var c=a,d=b,e=new ma;e.a=d.c.b;var f=c.f,g=f.a;do g=g.a;while(null!==g.b&&!f.c(f.b,e,g.b));var f=g.b,h=S(f),e=f.a,g=h.a;if(0===x(e.b.a,d,e.a))e=f.a,t(e.a,d)||t(e.b.a,d)||(K(e.b),f.c&&(I(e.c),f.c=!1),E(d.c,e),ya(c,d));else{var k=u(g.b.a,e.b.a)?f:h,h=void 0;f.d||k.c?(k===f?h=L(d.c.b,e.e):h=L(g.b.c.b,d.c).b,k.c?ja(k,h):(e=c,f=la(c,f,h),f.f=R(f).f+f.a.f,f.d=oa(e,f.f)),ya(c,d)):U(c,f,d.c,d.c,null,!0)}return}c=ka(c.i);e=S(c);f=e.a;e=T(a,
e,null);if(e.c===f){var f=e,e=f.c,g=S(c),h=c.a,k=g.a,l=!1;h.b.a!==k.b.a&&wa(a,c);t(h.a,a.a)&&(E(J(e),h),c=ka(c),e=S(c).a,T(a,S(c),g),l=!0);t(k.a,a.a)&&(E(f,J(k)),f=T(a,g,null),l=!0);l?U(a,c,f.c,e,e,!0):(u(k.a,h.a)?d=J(k):d=h,d=L(f.c.b,d),U(a,c,d,d.c,d.c,!1),d.b.i.c=!0,ra(a,c))}else U(a,c,e.c,f,f,!0)}function za(a,b){var c=new ma,d=ea(a.b);d.a.b=O;d.a.a=b;d.b.a.b=-O;d.b.a.a=b;a.a=d.b.a;c.a=d;c.f=0;c.d=!1;c.c=!1;c.h=!0;c.b=!1;d=a.f;d=na(d,d.a,c);c.e=d};function Aa(a){this.a=new Ba;this.b=a;this.c=ia}function na(a,b,c){do b=b.c;while(null!==b.b&&!a.c(a.b,b.b,c));a=new Ba(c,b.a,b);b.a.c=a;return b.a=a};function Ba(a,b,c){this.b=a||null;this.a=b||this;this.c=c||this};function X(){this.d=Y;this.p=this.b=this.q=null;this.j=[0,0,0];this.s=100130;this.n=!1;this.o=this.a=this.e=this.f=null;this.m=!1;this.c=this.r=this.i=this.k=this.l=this.h=null}var Y=0;n=X.prototype;n.x=function(){Z(this,Y)};n.B=function(a,b){switch(a){case 100142:return;case 100140:switch(b){case 100130:case 100131:case 100132:case 100133:case 100134:this.s=b;return}break;case 100141:this.m=!!b;return;default:V(this,100900);return}V(this,100901)};
n.y=function(a){switch(a){case 100142:return 0;case 100140:return this.s;case 100141:return this.m;default:V(this,100900)}return!1};n.A=function(a,b,c){this.j[0]=a;this.j[1]=b;this.j[2]=c};
n.z=function(a,b){var c=b?b:null;switch(a){case 100100:case 100106:this.h=c;break;case 100104:case 100110:this.l=c;break;case 100101:case 100107:this.k=c;break;case 100102:case 100108:this.i=c;break;case 100103:case 100109:this.p=c;break;case 100105:case 100111:this.o=c;break;case 100112:this.r=c;break;default:V(this,100900)}};
n.C=function(a,b){var c=!1,d=[0,0,0];Z(this,2);for(var e=0;3>e;++e){var f=a[e];-1E150>f&&(f=-1E150,c=!0);1E150<f&&(f=1E150,c=!0);d[e]=f}c&&V(this,100155);c=this.q;null===c?(c=ea(this.b),E(c,c.b)):(K(c),c=c.e);c.a.d=b;c.a.g[0]=d[0];c.a.g[1]=d[1];c.a.g[2]=d[2];c.f=1;c.b.f=-1;this.q=c};n.u=function(a){Z(this,Y);this.d=1;this.b=new Ca;this.c=a};n.t=function(){Z(this,1);this.d=2;this.q=null};n.v=function(){Z(this,2);this.d=1};
n.w=function(){Z(this,1);this.d=Y;var a=this.j[0],b=this.j[1],c=this.j[2],d=!1,e=[a,b,c];if(0===a&&0===b&&0===c){for(var b=[-2*1E150,-2*1E150,-2*1E150],f=[2*1E150,2*1E150,2*1E150],c=[],g=[],d=this.b.c,a=d.e;a!==d;a=a.e)for(var h=0;3>h;++h){var k=a.g[h];k<f[h]&&(f[h]=k,g[h]=a);k>b[h]&&(b[h]=k,c[h]=a)}a=0;b[1]-f[1]>b[0]-f[0]&&(a=1);b[2]-f[2]>b[a]-f[a]&&(a=2);if(f[a]>=b[a])e[0]=0,e[1]=0,e[2]=1;else{b=0;f=g[a];c=c[a];g=[0,0,0];f=[f.g[0]-c.g[0],f.g[1]-c.g[1],f.g[2]-c.g[2]];h=[0,0,0];for(a=d.e;a!==d;a=
a.e)h[0]=a.g[0]-c.g[0],h[1]=a.g[1]-c.g[1],h[2]=a.g[2]-c.g[2],g[0]=f[1]*h[2]-f[2]*h[1],g[1]=f[2]*h[0]-f[0]*h[2],g[2]=f[0]*h[1]-f[1]*h[0],k=g[0]*g[0]+g[1]*g[1]+g[2]*g[2],k>b&&(b=k,e[0]=g[0],e[1]=g[1],e[2]=g[2]);0>=b&&(e[0]=e[1]=e[2]=0,e[ha(f)]=1)}d=!0}g=ha(e);a=this.b.c;b=(g+1)%3;c=(g+2)%3;g=0<e[g]?1:-1;for(e=a.e;e!==a;e=e.e)e.b=e.g[b],e.a=g*e.g[c];if(d){e=0;d=this.b.a;for(a=d.b;a!==d;a=a.b)if(b=a.a,!(0>=b.f)){do e+=(b.a.b-b.b.a.b)*(b.a.a+b.b.a.a),b=b.e;while(b!==a.a)}if(0>e)for(e=this.b.c,d=e.e;d!==
e;d=d.e)d.a=-d.a}this.n=!1;e=this.b.b;for(a=e.h;a!==e;a=d)if(d=a.h,b=a.e,t(a.a,a.b.a)&&a.e.e!==a&&(ta(this,b,a),I(a),a=b,b=a.e),b.e===a){if(b!==a){if(b===d||b===d.b)d=d.h;I(b)}if(a===d||a===d.b)d=d.h;I(a)}this.e=e=new Da;d=this.b.c;for(a=d.e;a!==d;a=a.e)a.h=xa(e,a);Ea(e);this.f=new Aa(this);za(this,-O);for(za(this,O);null!==(e=Fa(this.e));){for(;;){a:if(a=this.e,0===a.a)d=Ga(a.b);else if(d=a.c[a.d[a.a-1]],0!==a.b.a&&(a=Ga(a.b),u(a,d))){d=a;break a}if(null===d||!t(d,e))break;d=Fa(this.e);ta(this,e.c,
d.c)}ya(this,e)}this.a=this.f.a.a.b.a.a;for(e=0;null!==(d=this.f.a.a.b);)d.h||++e,Q(d);this.f=null;e=this.e;e.b=null;e.d=null;this.e=e.c=null;e=this.b;for(a=e.a.b;a!==e.a;a=d)d=a.b,a=a.a,a.e.e===a&&(P(a.c,a),I(a));if(!this.n){e=this.b;if(this.m)for(a=e.b.h;a!==e.b;a=d)d=a.h,a.b.d.c!==a.d.c?a.f=a.d.c?1:-1:I(a);else for(a=e.a.b;a!==e.a;a=d)if(d=a.b,a.c){for(a=a.a;u(a.b.a,a.a);a=a.c.b);for(;u(a.a,a.b.a);a=a.e);b=a.c.b;for(c=void 0;a.e!==b;)if(u(a.b.a,b.a)){for(;b.e!==a&&(ca(b.e)||0>=x(b.a,b.b.a,b.e.b.a));)c=
L(b.e,b),b=c.b;b=b.c.b}else{for(;b.e!==a&&(da(a.c.b)||0<=x(a.b.a,a.a,a.c.b.a));)c=L(a,a.c.b),a=c.b;a=a.e}for(;b.e.e!==a;)c=L(b.e,b),b=c.b}if(this.h||this.i||this.k||this.l)if(this.m)for(e=this.b,d=e.a.b;d!==e.a;d=d.b){if(d.c){this.h&&this.h(2,this.c);a=d.a;do this.k&&this.k(a.a.d,this.c),a=a.e;while(a!==d.a);this.i&&this.i(this.c)}}else{e=this.b;d=!!this.l;a=!1;b=-1;for(c=e.a.d;c!==e.a;c=c.d)if(c.c){a||(this.h&&this.h(4,this.c),a=!0);g=c.a;do d&&(f=g.b.d.c?0:1,b!==f&&(b=f,this.l&&this.l(!!b,this.c))),
this.k&&this.k(g.a.d,this.c),g=g.e;while(g!==c.a)}a&&this.i&&this.i(this.c)}if(this.r){e=this.b;for(a=e.a.b;a!==e.a;a=d)if(d=a.b,!a.c){b=a.a;c=b.e;g=void 0;do g=c,c=g.e,g.d=null,null===g.b.d&&(g.c===g?F(g.a,null):(g.a.c=g.c,H(g,J(g))),f=g.b,f.c===f?F(f.a,null):(f.a.c=f.c,H(f,J(f))),fa(g));while(g!==b);b=a.d;a=a.b;a.d=b;b.b=a}this.r(this.b);this.c=this.b=null;return}}this.b=this.c=null};
function Z(a,b){if(a.d!==b)for(;a.d!==b;)if(a.d<b)switch(a.d){case Y:V(a,100151);a.u(null);break;case 1:V(a,100152),a.t()}else switch(a.d){case 2:V(a,100154);a.v();break;case 1:V(a,100153),a.w()}}function V(a,b){a.p&&a.p(b,a.c)};function ga(a,b){this.b=a||this;this.d=b||this;this.a=null;this.c=!1};function M(){this.h=this;this.i=this.d=this.a=this.e=this.c=this.b=null;this.f=0}function J(a){return a.b.e};function Ca(){this.c=new N;this.a=new ga;this.b=new M;this.d=new M;this.b.b=this.d;this.d.b=this.b};function N(a,b){this.e=a||this;this.f=b||this;this.d=this.c=null;this.g=[0,0,0];this.h=this.a=this.b=0};function Da(){this.c=[];this.d=null;this.a=0;this.e=!1;this.b=new Ha}function Ea(a){a.d=[];for(var b=0;b<a.a;b++)a.d[b]=b;a.d.sort(function(a){return function(b,e){return u(a[b],a[e])?1:-1}}(a.c));a.e=!0;Ia(a.b)}function xa(a,b){if(a.e){var c=a.b,d=++c.a;2*d>c.f&&(c.f*=2,c.c=Ja(c.c,c.f+1));var e;0===c.b?e=d:(e=c.b,c.b=c.c[c.b]);c.e[e]=b;c.c[e]=d;c.d[d]=e;c.h&&va(c,d);return e}c=a.a++;a.c[c]=b;return-(c+1)}
function Fa(a){if(0===a.a)return Ka(a.b);var b=a.c[a.d[a.a-1]];if(0!==a.b.a&&u(Ga(a.b),b))return Ka(a.b);do--a.a;while(0<a.a&&null===a.c[a.d[a.a-1]]);return b};function Ha(){this.d=Ja([0],33);this.e=[null,null];this.c=[0,0];this.a=0;this.f=32;this.b=0;this.h=!1;this.d[1]=1}function Ja(a,b){for(var c=Array(b),d=0;d<a.length;d++)c[d]=a[d];for(;d<b;d++)c[d]=0;return c}function Ia(a){for(var b=a.a;1<=b;--b)W(a,b);a.h=!0}function Ga(a){return a.e[a.d[1]]}function Ka(a){var b=a.d,c=a.e,d=a.c,e=b[1],f=c[e];0<a.a&&(b[1]=b[a.a],d[b[1]]=1,c[e]=null,d[e]=a.b,a.b=e,0<--a.a&&W(a,1));return f}
function W(a,b){for(var c=a.d,d=a.e,e=a.c,f=b,g=c[f];;){var h=f<<1;h<a.a&&u(d[c[h+1]],d[c[h]])&&(h+=1);var k=c[h];if(h>a.a||u(d[g],d[k])){c[f]=g;e[g]=f;break}c[f]=k;e[k]=f;f=h}}function va(a,b){for(var c=a.d,d=a.e,e=a.c,f=b,g=c[f];;){var h=f>>1,k=c[h];if(0===h||u(d[k],d[g])){c[f]=g;e[g]=f;break}c[f]=k;e[k]=f;f=h}};function ma(){this.e=this.a=null;this.f=0;this.c=this.b=this.h=this.d=!1}function S(a){return a.e.c.b}function R(a){return a.e.a.b};this.libtess={GluTesselator:X,windingRule:{GLU_TESS_WINDING_ODD:100130,GLU_TESS_WINDING_NONZERO:100131,GLU_TESS_WINDING_POSITIVE:100132,GLU_TESS_WINDING_NEGATIVE:100133,GLU_TESS_WINDING_ABS_GEQ_TWO:100134},primitiveType:{GL_LINE_LOOP:2,GL_TRIANGLES:4,GL_TRIANGLE_STRIP:5,GL_TRIANGLE_FAN:6},errorType:{GLU_TESS_MISSING_BEGIN_POLYGON:100151,GLU_TESS_MISSING_END_POLYGON:100153,GLU_TESS_MISSING_BEGIN_CONTOUR:100152,GLU_TESS_MISSING_END_CONTOUR:100154,GLU_TESS_COORD_TOO_LARGE:100155,GLU_TESS_NEED_COMBINE_CALLBACK:100156},
gluEnum:{GLU_TESS_MESH:100112,GLU_TESS_TOLERANCE:100142,GLU_TESS_WINDING_RULE:100140,GLU_TESS_BOUNDARY_ONLY:100141,GLU_INVALID_ENUM:100900,GLU_INVALID_VALUE:100901,GLU_TESS_BEGIN:100100,GLU_TESS_VERTEX:100101,GLU_TESS_END:100102,GLU_TESS_ERROR:100103,GLU_TESS_EDGE_FLAG:100104,GLU_TESS_COMBINE:100105,GLU_TESS_BEGIN_DATA:100106,GLU_TESS_VERTEX_DATA:100107,GLU_TESS_END_DATA:100108,GLU_TESS_ERROR_DATA:100109,GLU_TESS_EDGE_FLAG_DATA:100110,GLU_TESS_COMBINE_DATA:100111}};X.prototype.gluDeleteTess=X.prototype.x;
X.prototype.gluTessProperty=X.prototype.B;X.prototype.gluGetTessProperty=X.prototype.y;X.prototype.gluTessNormal=X.prototype.A;X.prototype.gluTessCallback=X.prototype.z;X.prototype.gluTessVertex=X.prototype.C;X.prototype.gluTessBeginPolygon=X.prototype.u;X.prototype.gluTessBeginContour=X.prototype.t;X.prototype.gluTessEndContour=X.prototype.v;X.prototype.gluTessEndPolygon=X.prototype.w; if (typeof module !== 'undefined') { module.exports = this.libtess; }

},{}],10:[function(_dereq_,module,exports){
(function (Buffer){
/**
 * https://opentype.js.org v0.9.0 | (c) Frederik De Bleser and other contributors | MIT License | Uses tiny-inflate by Devon Govett and string.prototype.codepointat polyfill by Mathias Bynens
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.opentype = {})));
}(this, (function (exports) { 'use strict';

	/*! https://mths.be/codepointat v0.2.0 by @mathias */
	if (!String.prototype.codePointAt) {
		(function() {
			var defineProperty = (function() {
				// IE 8 only supports `Object.defineProperty` on DOM elements
				try {
					var object = {};
					var $defineProperty = Object.defineProperty;
					var result = $defineProperty(object, object, object) && $defineProperty;
				} catch(error) {}
				return result;
			}());
			var codePointAt = function(position) {
				if (this == null) {
					throw TypeError();
				}
				var string = String(this);
				var size = string.length;
				// `ToInteger`
				var index = position ? Number(position) : 0;
				if (index != index) { // better `isNaN`
					index = 0;
				}
				// Account for out-of-bounds indices:
				if (index < 0 || index >= size) {
					return undefined;
				}
				// Get the first code unit
				var first = string.charCodeAt(index);
				var second;
				if ( // check if it’s the start of a surrogate pair
					first >= 0xD800 && first <= 0xDBFF && // high surrogate
					size > index + 1 // there is a next code unit
				) {
					second = string.charCodeAt(index + 1);
					if (second >= 0xDC00 && second <= 0xDFFF) { // low surrogate
						// https://mathiasbynens.be/notes/javascript-encoding#surrogate-formulae
						return (first - 0xD800) * 0x400 + second - 0xDC00 + 0x10000;
					}
				}
				return first;
			};
			if (defineProperty) {
				defineProperty(String.prototype, 'codePointAt', {
					'value': codePointAt,
					'configurable': true,
					'writable': true
				});
			} else {
				String.prototype.codePointAt = codePointAt;
			}
		}());
	}

	var TINF_OK = 0;
	var TINF_DATA_ERROR = -3;

	function Tree() {
	  this.table = new Uint16Array(16);   /* table of code length counts */
	  this.trans = new Uint16Array(288);  /* code -> symbol translation table */
	}

	function Data(source, dest) {
	  this.source = source;
	  this.sourceIndex = 0;
	  this.tag = 0;
	  this.bitcount = 0;
	  
	  this.dest = dest;
	  this.destLen = 0;
	  
	  this.ltree = new Tree();  /* dynamic length/symbol tree */
	  this.dtree = new Tree();  /* dynamic distance tree */
	}

	/* --------------------------------------------------- *
	 * -- uninitialized global data (static structures) -- *
	 * --------------------------------------------------- */

	var sltree = new Tree();
	var sdtree = new Tree();

	/* extra bits and base tables for length codes */
	var length_bits = new Uint8Array(30);
	var length_base = new Uint16Array(30);

	/* extra bits and base tables for distance codes */
	var dist_bits = new Uint8Array(30);
	var dist_base = new Uint16Array(30);

	/* special ordering of code length codes */
	var clcidx = new Uint8Array([
	  16, 17, 18, 0, 8, 7, 9, 6,
	  10, 5, 11, 4, 12, 3, 13, 2,
	  14, 1, 15
	]);

	/* used by tinf_decode_trees, avoids allocations every call */
	var code_tree = new Tree();
	var lengths = new Uint8Array(288 + 32);

	/* ----------------------- *
	 * -- utility functions -- *
	 * ----------------------- */

	/* build extra bits and base tables */
	function tinf_build_bits_base(bits, base, delta, first) {
	  var i, sum;

	  /* build bits table */
	  for (i = 0; i < delta; ++i) { bits[i] = 0; }
	  for (i = 0; i < 30 - delta; ++i) { bits[i + delta] = i / delta | 0; }

	  /* build base table */
	  for (sum = first, i = 0; i < 30; ++i) {
	    base[i] = sum;
	    sum += 1 << bits[i];
	  }
	}

	/* build the fixed huffman trees */
	function tinf_build_fixed_trees(lt, dt) {
	  var i;

	  /* build fixed length tree */
	  for (i = 0; i < 7; ++i) { lt.table[i] = 0; }

	  lt.table[7] = 24;
	  lt.table[8] = 152;
	  lt.table[9] = 112;

	  for (i = 0; i < 24; ++i) { lt.trans[i] = 256 + i; }
	  for (i = 0; i < 144; ++i) { lt.trans[24 + i] = i; }
	  for (i = 0; i < 8; ++i) { lt.trans[24 + 144 + i] = 280 + i; }
	  for (i = 0; i < 112; ++i) { lt.trans[24 + 144 + 8 + i] = 144 + i; }

	  /* build fixed distance tree */
	  for (i = 0; i < 5; ++i) { dt.table[i] = 0; }

	  dt.table[5] = 32;

	  for (i = 0; i < 32; ++i) { dt.trans[i] = i; }
	}

	/* given an array of code lengths, build a tree */
	var offs = new Uint16Array(16);

	function tinf_build_tree(t, lengths, off, num) {
	  var i, sum;

	  /* clear code length count table */
	  for (i = 0; i < 16; ++i) { t.table[i] = 0; }

	  /* scan symbol lengths, and sum code length counts */
	  for (i = 0; i < num; ++i) { t.table[lengths[off + i]]++; }

	  t.table[0] = 0;

	  /* compute offset table for distribution sort */
	  for (sum = 0, i = 0; i < 16; ++i) {
	    offs[i] = sum;
	    sum += t.table[i];
	  }

	  /* create code->symbol translation table (symbols sorted by code) */
	  for (i = 0; i < num; ++i) {
	    if (lengths[off + i]) { t.trans[offs[lengths[off + i]]++] = i; }
	  }
	}

	/* ---------------------- *
	 * -- decode functions -- *
	 * ---------------------- */

	/* get one bit from source stream */
	function tinf_getbit(d) {
	  /* check if tag is empty */
	  if (!d.bitcount--) {
	    /* load next tag */
	    d.tag = d.source[d.sourceIndex++];
	    d.bitcount = 7;
	  }

	  /* shift bit out of tag */
	  var bit = d.tag & 1;
	  d.tag >>>= 1;

	  return bit;
	}

	/* read a num bit value from a stream and add base */
	function tinf_read_bits(d, num, base) {
	  if (!num)
	    { return base; }

	  while (d.bitcount < 24) {
	    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
	    d.bitcount += 8;
	  }

	  var val = d.tag & (0xffff >>> (16 - num));
	  d.tag >>>= num;
	  d.bitcount -= num;
	  return val + base;
	}

	/* given a data stream and a tree, decode a symbol */
	function tinf_decode_symbol(d, t) {
	  while (d.bitcount < 24) {
	    d.tag |= d.source[d.sourceIndex++] << d.bitcount;
	    d.bitcount += 8;
	  }
	  
	  var sum = 0, cur = 0, len = 0;
	  var tag = d.tag;

	  /* get more bits while code value is above sum */
	  do {
	    cur = 2 * cur + (tag & 1);
	    tag >>>= 1;
	    ++len;

	    sum += t.table[len];
	    cur -= t.table[len];
	  } while (cur >= 0);
	  
	  d.tag = tag;
	  d.bitcount -= len;

	  return t.trans[sum + cur];
	}

	/* given a data stream, decode dynamic trees from it */
	function tinf_decode_trees(d, lt, dt) {
	  var hlit, hdist, hclen;
	  var i, num, length;

	  /* get 5 bits HLIT (257-286) */
	  hlit = tinf_read_bits(d, 5, 257);

	  /* get 5 bits HDIST (1-32) */
	  hdist = tinf_read_bits(d, 5, 1);

	  /* get 4 bits HCLEN (4-19) */
	  hclen = tinf_read_bits(d, 4, 4);

	  for (i = 0; i < 19; ++i) { lengths[i] = 0; }

	  /* read code lengths for code length alphabet */
	  for (i = 0; i < hclen; ++i) {
	    /* get 3 bits code length (0-7) */
	    var clen = tinf_read_bits(d, 3, 0);
	    lengths[clcidx[i]] = clen;
	  }

	  /* build code length tree */
	  tinf_build_tree(code_tree, lengths, 0, 19);

	  /* decode code lengths for the dynamic trees */
	  for (num = 0; num < hlit + hdist;) {
	    var sym = tinf_decode_symbol(d, code_tree);

	    switch (sym) {
	      case 16:
	        /* copy previous code length 3-6 times (read 2 bits) */
	        var prev = lengths[num - 1];
	        for (length = tinf_read_bits(d, 2, 3); length; --length) {
	          lengths[num++] = prev;
	        }
	        break;
	      case 17:
	        /* repeat code length 0 for 3-10 times (read 3 bits) */
	        for (length = tinf_read_bits(d, 3, 3); length; --length) {
	          lengths[num++] = 0;
	        }
	        break;
	      case 18:
	        /* repeat code length 0 for 11-138 times (read 7 bits) */
	        for (length = tinf_read_bits(d, 7, 11); length; --length) {
	          lengths[num++] = 0;
	        }
	        break;
	      default:
	        /* values 0-15 represent the actual code lengths */
	        lengths[num++] = sym;
	        break;
	    }
	  }

	  /* build dynamic trees */
	  tinf_build_tree(lt, lengths, 0, hlit);
	  tinf_build_tree(dt, lengths, hlit, hdist);
	}

	/* ----------------------------- *
	 * -- block inflate functions -- *
	 * ----------------------------- */

	/* given a stream and two trees, inflate a block of data */
	function tinf_inflate_block_data(d, lt, dt) {
	  while (1) {
	    var sym = tinf_decode_symbol(d, lt);

	    /* check for end of block */
	    if (sym === 256) {
	      return TINF_OK;
	    }

	    if (sym < 256) {
	      d.dest[d.destLen++] = sym;
	    } else {
	      var length, dist, offs;
	      var i;

	      sym -= 257;

	      /* possibly get more bits from length code */
	      length = tinf_read_bits(d, length_bits[sym], length_base[sym]);

	      dist = tinf_decode_symbol(d, dt);

	      /* possibly get more bits from distance code */
	      offs = d.destLen - tinf_read_bits(d, dist_bits[dist], dist_base[dist]);

	      /* copy match */
	      for (i = offs; i < offs + length; ++i) {
	        d.dest[d.destLen++] = d.dest[i];
	      }
	    }
	  }
	}

	/* inflate an uncompressed block of data */
	function tinf_inflate_uncompressed_block(d) {
	  var length, invlength;
	  var i;
	  
	  /* unread from bitbuffer */
	  while (d.bitcount > 8) {
	    d.sourceIndex--;
	    d.bitcount -= 8;
	  }

	  /* get length */
	  length = d.source[d.sourceIndex + 1];
	  length = 256 * length + d.source[d.sourceIndex];

	  /* get one's complement of length */
	  invlength = d.source[d.sourceIndex + 3];
	  invlength = 256 * invlength + d.source[d.sourceIndex + 2];

	  /* check length */
	  if (length !== (~invlength & 0x0000ffff))
	    { return TINF_DATA_ERROR; }

	  d.sourceIndex += 4;

	  /* copy block */
	  for (i = length; i; --i)
	    { d.dest[d.destLen++] = d.source[d.sourceIndex++]; }

	  /* make sure we start next block on a byte boundary */
	  d.bitcount = 0;

	  return TINF_OK;
	}

	/* inflate stream from source to dest */
	function tinf_uncompress(source, dest) {
	  var d = new Data(source, dest);
	  var bfinal, btype, res;

	  do {
	    /* read final block flag */
	    bfinal = tinf_getbit(d);

	    /* read block type (2 bits) */
	    btype = tinf_read_bits(d, 2, 0);

	    /* decompress block */
	    switch (btype) {
	      case 0:
	        /* decompress uncompressed block */
	        res = tinf_inflate_uncompressed_block(d);
	        break;
	      case 1:
	        /* decompress block with fixed huffman trees */
	        res = tinf_inflate_block_data(d, sltree, sdtree);
	        break;
	      case 2:
	        /* decompress block with dynamic huffman trees */
	        tinf_decode_trees(d, d.ltree, d.dtree);
	        res = tinf_inflate_block_data(d, d.ltree, d.dtree);
	        break;
	      default:
	        res = TINF_DATA_ERROR;
	    }

	    if (res !== TINF_OK)
	      { throw new Error('Data error'); }

	  } while (!bfinal);

	  if (d.destLen < d.dest.length) {
	    if (typeof d.dest.slice === 'function')
	      { return d.dest.slice(0, d.destLen); }
	    else
	      { return d.dest.subarray(0, d.destLen); }
	  }
	  
	  return d.dest;
	}

	/* -------------------- *
	 * -- initialization -- *
	 * -------------------- */

	/* build fixed huffman trees */
	tinf_build_fixed_trees(sltree, sdtree);

	/* build extra bits and base tables */
	tinf_build_bits_base(length_bits, length_base, 4, 3);
	tinf_build_bits_base(dist_bits, dist_base, 2, 1);

	/* fix a special case */
	length_bits[28] = 0;
	length_base[28] = 258;

	var tinyInflate = tinf_uncompress;

	// The Bounding Box object

	function derive(v0, v1, v2, v3, t) {
	    return Math.pow(1 - t, 3) * v0 +
	        3 * Math.pow(1 - t, 2) * t * v1 +
	        3 * (1 - t) * Math.pow(t, 2) * v2 +
	        Math.pow(t, 3) * v3;
	}
	/**
	 * A bounding box is an enclosing box that describes the smallest measure within which all the points lie.
	 * It is used to calculate the bounding box of a glyph or text path.
	 *
	 * On initialization, x1/y1/x2/y2 will be NaN. Check if the bounding box is empty using `isEmpty()`.
	 *
	 * @exports opentype.BoundingBox
	 * @class
	 * @constructor
	 */
	function BoundingBox() {
	    this.x1 = Number.NaN;
	    this.y1 = Number.NaN;
	    this.x2 = Number.NaN;
	    this.y2 = Number.NaN;
	}

	/**
	 * Returns true if the bounding box is empty, that is, no points have been added to the box yet.
	 */
	BoundingBox.prototype.isEmpty = function() {
	    return isNaN(this.x1) || isNaN(this.y1) || isNaN(this.x2) || isNaN(this.y2);
	};

	/**
	 * Add the point to the bounding box.
	 * The x1/y1/x2/y2 coordinates of the bounding box will now encompass the given point.
	 * @param {number} x - The X coordinate of the point.
	 * @param {number} y - The Y coordinate of the point.
	 */
	BoundingBox.prototype.addPoint = function(x, y) {
	    if (typeof x === 'number') {
	        if (isNaN(this.x1) || isNaN(this.x2)) {
	            this.x1 = x;
	            this.x2 = x;
	        }
	        if (x < this.x1) {
	            this.x1 = x;
	        }
	        if (x > this.x2) {
	            this.x2 = x;
	        }
	    }
	    if (typeof y === 'number') {
	        if (isNaN(this.y1) || isNaN(this.y2)) {
	            this.y1 = y;
	            this.y2 = y;
	        }
	        if (y < this.y1) {
	            this.y1 = y;
	        }
	        if (y > this.y2) {
	            this.y2 = y;
	        }
	    }
	};

	/**
	 * Add a X coordinate to the bounding box.
	 * This extends the bounding box to include the X coordinate.
	 * This function is used internally inside of addBezier.
	 * @param {number} x - The X coordinate of the point.
	 */
	BoundingBox.prototype.addX = function(x) {
	    this.addPoint(x, null);
	};

	/**
	 * Add a Y coordinate to the bounding box.
	 * This extends the bounding box to include the Y coordinate.
	 * This function is used internally inside of addBezier.
	 * @param {number} y - The Y coordinate of the point.
	 */
	BoundingBox.prototype.addY = function(y) {
	    this.addPoint(null, y);
	};

	/**
	 * Add a Bézier curve to the bounding box.
	 * This extends the bounding box to include the entire Bézier.
	 * @param {number} x0 - The starting X coordinate.
	 * @param {number} y0 - The starting Y coordinate.
	 * @param {number} x1 - The X coordinate of the first control point.
	 * @param {number} y1 - The Y coordinate of the first control point.
	 * @param {number} x2 - The X coordinate of the second control point.
	 * @param {number} y2 - The Y coordinate of the second control point.
	 * @param {number} x - The ending X coordinate.
	 * @param {number} y - The ending Y coordinate.
	 */
	BoundingBox.prototype.addBezier = function(x0, y0, x1, y1, x2, y2, x, y) {
	    var this$1 = this;

	    // This code is based on http://nishiohirokazu.blogspot.com/2009/06/how-to-calculate-bezier-curves-bounding.html
	    // and https://github.com/icons8/svg-path-bounding-box

	    var p0 = [x0, y0];
	    var p1 = [x1, y1];
	    var p2 = [x2, y2];
	    var p3 = [x, y];

	    this.addPoint(x0, y0);
	    this.addPoint(x, y);

	    for (var i = 0; i <= 1; i++) {
	        var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
	        var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
	        var c = 3 * p1[i] - 3 * p0[i];

	        if (a === 0) {
	            if (b === 0) { continue; }
	            var t = -c / b;
	            if (0 < t && t < 1) {
	                if (i === 0) { this$1.addX(derive(p0[i], p1[i], p2[i], p3[i], t)); }
	                if (i === 1) { this$1.addY(derive(p0[i], p1[i], p2[i], p3[i], t)); }
	            }
	            continue;
	        }

	        var b2ac = Math.pow(b, 2) - 4 * c * a;
	        if (b2ac < 0) { continue; }
	        var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
	        if (0 < t1 && t1 < 1) {
	            if (i === 0) { this$1.addX(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
	            if (i === 1) { this$1.addY(derive(p0[i], p1[i], p2[i], p3[i], t1)); }
	        }
	        var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
	        if (0 < t2 && t2 < 1) {
	            if (i === 0) { this$1.addX(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
	            if (i === 1) { this$1.addY(derive(p0[i], p1[i], p2[i], p3[i], t2)); }
	        }
	    }
	};

	/**
	 * Add a quadratic curve to the bounding box.
	 * This extends the bounding box to include the entire quadratic curve.
	 * @param {number} x0 - The starting X coordinate.
	 * @param {number} y0 - The starting Y coordinate.
	 * @param {number} x1 - The X coordinate of the control point.
	 * @param {number} y1 - The Y coordinate of the control point.
	 * @param {number} x - The ending X coordinate.
	 * @param {number} y - The ending Y coordinate.
	 */
	BoundingBox.prototype.addQuad = function(x0, y0, x1, y1, x, y) {
	    var cp1x = x0 + 2 / 3 * (x1 - x0);
	    var cp1y = y0 + 2 / 3 * (y1 - y0);
	    var cp2x = cp1x + 1 / 3 * (x - x0);
	    var cp2y = cp1y + 1 / 3 * (y - y0);
	    this.addBezier(x0, y0, cp1x, cp1y, cp2x, cp2y, x, y);
	};

	// Geometric objects

	/**
	 * A bézier path containing a set of path commands similar to a SVG path.
	 * Paths can be drawn on a context using `draw`.
	 * @exports opentype.Path
	 * @class
	 * @constructor
	 */
	function Path() {
	    this.commands = [];
	    this.fill = 'black';
	    this.stroke = null;
	    this.strokeWidth = 1;
	}

	/**
	 * @param  {number} x
	 * @param  {number} y
	 */
	Path.prototype.moveTo = function(x, y) {
	    this.commands.push({
	        type: 'M',
	        x: x,
	        y: y
	    });
	};

	/**
	 * @param  {number} x
	 * @param  {number} y
	 */
	Path.prototype.lineTo = function(x, y) {
	    this.commands.push({
	        type: 'L',
	        x: x,
	        y: y
	    });
	};

	/**
	 * Draws cubic curve
	 * @function
	 * curveTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control 1
	 * @param  {number} y1 - y of control 1
	 * @param  {number} x2 - x of control 2
	 * @param  {number} y2 - y of control 2
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 */

	/**
	 * Draws cubic curve
	 * @function
	 * bezierCurveTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control 1
	 * @param  {number} y1 - y of control 1
	 * @param  {number} x2 - x of control 2
	 * @param  {number} y2 - y of control 2
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 * @see curveTo
	 */
	Path.prototype.curveTo = Path.prototype.bezierCurveTo = function(x1, y1, x2, y2, x, y) {
	    this.commands.push({
	        type: 'C',
	        x1: x1,
	        y1: y1,
	        x2: x2,
	        y2: y2,
	        x: x,
	        y: y
	    });
	};

	/**
	 * Draws quadratic curve
	 * @function
	 * quadraticCurveTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control
	 * @param  {number} y1 - y of control
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 */

	/**
	 * Draws quadratic curve
	 * @function
	 * quadTo
	 * @memberof opentype.Path.prototype
	 * @param  {number} x1 - x of control
	 * @param  {number} y1 - y of control
	 * @param  {number} x - x of path point
	 * @param  {number} y - y of path point
	 */
	Path.prototype.quadTo = Path.prototype.quadraticCurveTo = function(x1, y1, x, y) {
	    this.commands.push({
	        type: 'Q',
	        x1: x1,
	        y1: y1,
	        x: x,
	        y: y
	    });
	};

	/**
	 * Closes the path
	 * @function closePath
	 * @memberof opentype.Path.prototype
	 */

	/**
	 * Close the path
	 * @function close
	 * @memberof opentype.Path.prototype
	 */
	Path.prototype.close = Path.prototype.closePath = function() {
	    this.commands.push({
	        type: 'Z'
	    });
	};

	/**
	 * Add the given path or list of commands to the commands of this path.
	 * @param  {Array} pathOrCommands - another opentype.Path, an opentype.BoundingBox, or an array of commands.
	 */
	Path.prototype.extend = function(pathOrCommands) {
	    if (pathOrCommands.commands) {
	        pathOrCommands = pathOrCommands.commands;
	    } else if (pathOrCommands instanceof BoundingBox) {
	        var box = pathOrCommands;
	        this.moveTo(box.x1, box.y1);
	        this.lineTo(box.x2, box.y1);
	        this.lineTo(box.x2, box.y2);
	        this.lineTo(box.x1, box.y2);
	        this.close();
	        return;
	    }

	    Array.prototype.push.apply(this.commands, pathOrCommands);
	};

	/**
	 * Calculate the bounding box of the path.
	 * @returns {opentype.BoundingBox}
	 */
	Path.prototype.getBoundingBox = function() {
	    var this$1 = this;

	    var box = new BoundingBox();

	    var startX = 0;
	    var startY = 0;
	    var prevX = 0;
	    var prevY = 0;
	    for (var i = 0; i < this.commands.length; i++) {
	        var cmd = this$1.commands[i];
	        switch (cmd.type) {
	            case 'M':
	                box.addPoint(cmd.x, cmd.y);
	                startX = prevX = cmd.x;
	                startY = prevY = cmd.y;
	                break;
	            case 'L':
	                box.addPoint(cmd.x, cmd.y);
	                prevX = cmd.x;
	                prevY = cmd.y;
	                break;
	            case 'Q':
	                box.addQuad(prevX, prevY, cmd.x1, cmd.y1, cmd.x, cmd.y);
	                prevX = cmd.x;
	                prevY = cmd.y;
	                break;
	            case 'C':
	                box.addBezier(prevX, prevY, cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
	                prevX = cmd.x;
	                prevY = cmd.y;
	                break;
	            case 'Z':
	                prevX = startX;
	                prevY = startY;
	                break;
	            default:
	                throw new Error('Unexpected path command ' + cmd.type);
	        }
	    }
	    if (box.isEmpty()) {
	        box.addPoint(0, 0);
	    }
	    return box;
	};

	/**
	 * Draw the path to a 2D context.
	 * @param {CanvasRenderingContext2D} ctx - A 2D drawing context.
	 */
	Path.prototype.draw = function(ctx) {
	    var this$1 = this;

	    ctx.beginPath();
	    for (var i = 0; i < this.commands.length; i += 1) {
	        var cmd = this$1.commands[i];
	        if (cmd.type === 'M') {
	            ctx.moveTo(cmd.x, cmd.y);
	        } else if (cmd.type === 'L') {
	            ctx.lineTo(cmd.x, cmd.y);
	        } else if (cmd.type === 'C') {
	            ctx.bezierCurveTo(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
	        } else if (cmd.type === 'Q') {
	            ctx.quadraticCurveTo(cmd.x1, cmd.y1, cmd.x, cmd.y);
	        } else if (cmd.type === 'Z') {
	            ctx.closePath();
	        }
	    }

	    if (this.fill) {
	        ctx.fillStyle = this.fill;
	        ctx.fill();
	    }

	    if (this.stroke) {
	        ctx.strokeStyle = this.stroke;
	        ctx.lineWidth = this.strokeWidth;
	        ctx.stroke();
	    }
	};

	/**
	 * Convert the Path to a string of path data instructions
	 * See http://www.w3.org/TR/SVG/paths.html#PathData
	 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
	 * @return {string}
	 */
	Path.prototype.toPathData = function(decimalPlaces) {
	    var this$1 = this;

	    decimalPlaces = decimalPlaces !== undefined ? decimalPlaces : 2;

	    function floatToString(v) {
	        if (Math.round(v) === v) {
	            return '' + Math.round(v);
	        } else {
	            return v.toFixed(decimalPlaces);
	        }
	    }

	    function packValues() {
	        var arguments$1 = arguments;

	        var s = '';
	        for (var i = 0; i < arguments.length; i += 1) {
	            var v = arguments$1[i];
	            if (v >= 0 && i > 0) {
	                s += ' ';
	            }

	            s += floatToString(v);
	        }

	        return s;
	    }

	    var d = '';
	    for (var i = 0; i < this.commands.length; i += 1) {
	        var cmd = this$1.commands[i];
	        if (cmd.type === 'M') {
	            d += 'M' + packValues(cmd.x, cmd.y);
	        } else if (cmd.type === 'L') {
	            d += 'L' + packValues(cmd.x, cmd.y);
	        } else if (cmd.type === 'C') {
	            d += 'C' + packValues(cmd.x1, cmd.y1, cmd.x2, cmd.y2, cmd.x, cmd.y);
	        } else if (cmd.type === 'Q') {
	            d += 'Q' + packValues(cmd.x1, cmd.y1, cmd.x, cmd.y);
	        } else if (cmd.type === 'Z') {
	            d += 'Z';
	        }
	    }

	    return d;
	};

	/**
	 * Convert the path to an SVG <path> element, as a string.
	 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
	 * @return {string}
	 */
	Path.prototype.toSVG = function(decimalPlaces) {
	    var svg = '<path d="';
	    svg += this.toPathData(decimalPlaces);
	    svg += '"';
	    if (this.fill && this.fill !== 'black') {
	        if (this.fill === null) {
	            svg += ' fill="none"';
	        } else {
	            svg += ' fill="' + this.fill + '"';
	        }
	    }

	    if (this.stroke) {
	        svg += ' stroke="' + this.stroke + '" stroke-width="' + this.strokeWidth + '"';
	    }

	    svg += '/>';
	    return svg;
	};

	/**
	 * Convert the path to a DOM element.
	 * @param  {number} [decimalPlaces=2] - The amount of decimal places for floating-point values
	 * @return {SVGPathElement}
	 */
	Path.prototype.toDOMElement = function(decimalPlaces) {
	    var temporaryPath = this.toPathData(decimalPlaces);
	    var newPath = document.createElementNS('http://www.w3.org/2000/svg', 'path');

	    newPath.setAttribute('d', temporaryPath);

	    return newPath;
	};

	// Run-time checking of preconditions.

	function fail(message) {
	    throw new Error(message);
	}

	// Precondition function that checks if the given predicate is true.
	// If not, it will throw an error.
	function argument(predicate, message) {
	    if (!predicate) {
	        fail(message);
	    }
	}
	var check = { fail: fail, argument: argument, assert: argument };

	// Data types used in the OpenType font file.

	var LIMIT16 = 32768; // The limit at which a 16-bit number switches signs == 2^15
	var LIMIT32 = 2147483648; // The limit at which a 32-bit number switches signs == 2 ^ 31

	/**
	 * @exports opentype.decode
	 * @class
	 */
	var decode = {};
	/**
	 * @exports opentype.encode
	 * @class
	 */
	var encode = {};
	/**
	 * @exports opentype.sizeOf
	 * @class
	 */
	var sizeOf = {};

	// Return a function that always returns the same value.
	function constant(v) {
	    return function() {
	        return v;
	    };
	}

	// OpenType data types //////////////////////////////////////////////////////

	/**
	 * Convert an 8-bit unsigned integer to a list of 1 byte.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.BYTE = function(v) {
	    check.argument(v >= 0 && v <= 255, 'Byte value should be between 0 and 255.');
	    return [v];
	};
	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.BYTE = constant(1);

	/**
	 * Convert a 8-bit signed integer to a list of 1 byte.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.CHAR = function(v) {
	    return [v.charCodeAt(0)];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.CHAR = constant(1);

	/**
	 * Convert an ASCII string to a list of bytes.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.CHARARRAY = function(v) {
	    var b = [];
	    for (var i = 0; i < v.length; i += 1) {
	        b[i] = v.charCodeAt(i);
	    }

	    return b;
	};

	/**
	 * @param {Array}
	 * @returns {number}
	 */
	sizeOf.CHARARRAY = function(v) {
	    return v.length;
	};

	/**
	 * Convert a 16-bit unsigned integer to a list of 2 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.USHORT = function(v) {
	    return [(v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.USHORT = constant(2);

	/**
	 * Convert a 16-bit signed integer to a list of 2 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.SHORT = function(v) {
	    // Two's complement
	    if (v >= LIMIT16) {
	        v = -(2 * LIMIT16 - v);
	    }

	    return [(v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.SHORT = constant(2);

	/**
	 * Convert a 24-bit unsigned integer to a list of 3 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.UINT24 = function(v) {
	    return [(v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.UINT24 = constant(3);

	/**
	 * Convert a 32-bit unsigned integer to a list of 4 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.ULONG = function(v) {
	    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.ULONG = constant(4);

	/**
	 * Convert a 32-bit unsigned integer to a list of 4 bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.LONG = function(v) {
	    // Two's complement
	    if (v >= LIMIT32) {
	        v = -(2 * LIMIT32 - v);
	    }

	    return [(v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.LONG = constant(4);

	encode.FIXED = encode.ULONG;
	sizeOf.FIXED = sizeOf.ULONG;

	encode.FWORD = encode.SHORT;
	sizeOf.FWORD = sizeOf.SHORT;

	encode.UFWORD = encode.USHORT;
	sizeOf.UFWORD = sizeOf.USHORT;

	/**
	 * Convert a 32-bit Apple Mac timestamp integer to a list of 8 bytes, 64-bit timestamp.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.LONGDATETIME = function(v) {
	    return [0, 0, 0, 0, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.LONGDATETIME = constant(8);

	/**
	 * Convert a 4-char tag to a list of 4 bytes.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.TAG = function(v) {
	    check.argument(v.length === 4, 'Tag should be exactly 4 ASCII characters.');
	    return [v.charCodeAt(0),
	            v.charCodeAt(1),
	            v.charCodeAt(2),
	            v.charCodeAt(3)];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.TAG = constant(4);

	// CFF data types ///////////////////////////////////////////////////////////

	encode.Card8 = encode.BYTE;
	sizeOf.Card8 = sizeOf.BYTE;

	encode.Card16 = encode.USHORT;
	sizeOf.Card16 = sizeOf.USHORT;

	encode.OffSize = encode.BYTE;
	sizeOf.OffSize = sizeOf.BYTE;

	encode.SID = encode.USHORT;
	sizeOf.SID = sizeOf.USHORT;

	// Convert a numeric operand or charstring number to a variable-size list of bytes.
	/**
	 * Convert a numeric operand or charstring number to a variable-size list of bytes.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.NUMBER = function(v) {
	    if (v >= -107 && v <= 107) {
	        return [v + 139];
	    } else if (v >= 108 && v <= 1131) {
	        v = v - 108;
	        return [(v >> 8) + 247, v & 0xFF];
	    } else if (v >= -1131 && v <= -108) {
	        v = -v - 108;
	        return [(v >> 8) + 251, v & 0xFF];
	    } else if (v >= -32768 && v <= 32767) {
	        return encode.NUMBER16(v);
	    } else {
	        return encode.NUMBER32(v);
	    }
	};

	/**
	 * @param {number}
	 * @returns {number}
	 */
	sizeOf.NUMBER = function(v) {
	    return encode.NUMBER(v).length;
	};

	/**
	 * Convert a signed number between -32768 and +32767 to a three-byte value.
	 * This ensures we always use three bytes, but is not the most compact format.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.NUMBER16 = function(v) {
	    return [28, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.NUMBER16 = constant(3);

	/**
	 * Convert a signed number between -(2^31) and +(2^31-1) to a five-byte value.
	 * This is useful if you want to be sure you always use four bytes,
	 * at the expense of wasting a few bytes for smaller numbers.
	 * @param {number}
	 * @returns {Array}
	 */
	encode.NUMBER32 = function(v) {
	    return [29, (v >> 24) & 0xFF, (v >> 16) & 0xFF, (v >> 8) & 0xFF, v & 0xFF];
	};

	/**
	 * @constant
	 * @type {number}
	 */
	sizeOf.NUMBER32 = constant(5);

	/**
	 * @param {number}
	 * @returns {Array}
	 */
	encode.REAL = function(v) {
	    var value = v.toString();

	    // Some numbers use an epsilon to encode the value. (e.g. JavaScript will store 0.0000001 as 1e-7)
	    // This code converts it back to a number without the epsilon.
	    var m = /\.(\d*?)(?:9{5,20}|0{5,20})\d{0,2}(?:e(.+)|$)/.exec(value);
	    if (m) {
	        var epsilon = parseFloat('1e' + ((m[2] ? +m[2] : 0) + m[1].length));
	        value = (Math.round(v * epsilon) / epsilon).toString();
	    }

	    var nibbles = '';
	    for (var i = 0, ii = value.length; i < ii; i += 1) {
	        var c = value[i];
	        if (c === 'e') {
	            nibbles += value[++i] === '-' ? 'c' : 'b';
	        } else if (c === '.') {
	            nibbles += 'a';
	        } else if (c === '-') {
	            nibbles += 'e';
	        } else {
	            nibbles += c;
	        }
	    }

	    nibbles += (nibbles.length & 1) ? 'f' : 'ff';
	    var out = [30];
	    for (var i$1 = 0, ii$1 = nibbles.length; i$1 < ii$1; i$1 += 2) {
	        out.push(parseInt(nibbles.substr(i$1, 2), 16));
	    }

	    return out;
	};

	/**
	 * @param {number}
	 * @returns {number}
	 */
	sizeOf.REAL = function(v) {
	    return encode.REAL(v).length;
	};

	encode.NAME = encode.CHARARRAY;
	sizeOf.NAME = sizeOf.CHARARRAY;

	encode.STRING = encode.CHARARRAY;
	sizeOf.STRING = sizeOf.CHARARRAY;

	/**
	 * @param {DataView} data
	 * @param {number} offset
	 * @param {number} numBytes
	 * @returns {string}
	 */
	decode.UTF8 = function(data, offset, numBytes) {
	    var codePoints = [];
	    var numChars = numBytes;
	    for (var j = 0; j < numChars; j++, offset += 1) {
	        codePoints[j] = data.getUint8(offset);
	    }

	    return String.fromCharCode.apply(null, codePoints);
	};

	/**
	 * @param {DataView} data
	 * @param {number} offset
	 * @param {number} numBytes
	 * @returns {string}
	 */
	decode.UTF16 = function(data, offset, numBytes) {
	    var codePoints = [];
	    var numChars = numBytes / 2;
	    for (var j = 0; j < numChars; j++, offset += 2) {
	        codePoints[j] = data.getUint16(offset);
	    }

	    return String.fromCharCode.apply(null, codePoints);
	};

	/**
	 * Convert a JavaScript string to UTF16-BE.
	 * @param {string}
	 * @returns {Array}
	 */
	encode.UTF16 = function(v) {
	    var b = [];
	    for (var i = 0; i < v.length; i += 1) {
	        var codepoint = v.charCodeAt(i);
	        b[b.length] = (codepoint >> 8) & 0xFF;
	        b[b.length] = codepoint & 0xFF;
	    }

	    return b;
	};

	/**
	 * @param {string}
	 * @returns {number}
	 */
	sizeOf.UTF16 = function(v) {
	    return v.length * 2;
	};

	// Data for converting old eight-bit Macintosh encodings to Unicode.
	// This representation is optimized for decoding; encoding is slower
	// and needs more memory. The assumption is that all opentype.js users
	// want to open fonts, but saving a font will be comparatively rare
	// so it can be more expensive. Keyed by IANA character set name.
	//
	// Python script for generating these strings:
	//
	//     s = u''.join([chr(c).decode('mac_greek') for c in range(128, 256)])
	//     print(s.encode('utf-8'))
	/**
	 * @private
	 */
	var eightBitMacEncodings = {
	    'x-mac-croatian':  // Python: 'mac_croatian'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®Š™´¨≠ŽØ∞±≤≥∆µ∂∑∏š∫ªºΩžø' +
	    '¿¡¬√ƒ≈Ć«Č… ÀÃÕŒœĐ—“”‘’÷◊©⁄€‹›Æ»–·‚„‰ÂćÁčÈÍÎÏÌÓÔđÒÚÛÙıˆ˜¯πË˚¸Êæˇ',
	    'x-mac-cyrillic':  // Python: 'mac_cyrillic'
	    'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ†°Ґ£§•¶І®©™Ђђ≠Ѓѓ∞±≤≥іµґЈЄєЇїЉљЊњ' +
	    'јЅ¬√ƒ≈∆«»… ЋћЌќѕ–—“”‘’÷„ЎўЏџ№Ёёяабвгдежзийклмнопрстуфхцчшщъыьэю',
	    'x-mac-gaelic': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/GAELIC.TXT
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØḂ±≤≥ḃĊċḊḋḞḟĠġṀæø' +
	    'ṁṖṗɼƒſṠ«»… ÀÃÕŒœ–—“”‘’ṡẛÿŸṪ€‹›Ŷŷṫ·Ỳỳ⁊ÂÊÁËÈÍÎÏÌÓÔ♣ÒÚÛÙıÝýŴŵẄẅẀẁẂẃ',
	    'x-mac-greek':  // Python: 'mac_greek'
	    'Ä¹²É³ÖÜ΅àâä΄¨çéèêë£™îï•½‰ôö¦€ùûü†ΓΔΘΛΞΠß®©ΣΪ§≠°·Α±≤≥¥ΒΕΖΗΙΚΜΦΫΨΩ' +
	    'άΝ¬ΟΡ≈Τ«»… ΥΧΆΈœ–―“”‘’÷ΉΊΌΎέήίόΏύαβψδεφγηιξκλμνοπώρστθωςχυζϊϋΐΰ\u00AD',
	    'x-mac-icelandic':  // Python: 'mac_iceland'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûüÝ°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€ÐðÞþý·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
	    'x-mac-inuit': // http://unicode.org/Public/MAPPINGS/VENDORS/APPLE/INUIT.TXT
	    'ᐃᐄᐅᐆᐊᐋᐱᐲᐳᐴᐸᐹᑉᑎᑏᑐᑑᑕᑖᑦᑭᑮᑯᑰᑲᑳᒃᒋᒌᒍᒎᒐᒑ°ᒡᒥᒦ•¶ᒧ®©™ᒨᒪᒫᒻᓂᓃᓄᓅᓇᓈᓐᓯᓰᓱᓲᓴᓵᔅᓕᓖᓗ' +
	    'ᓘᓚᓛᓪᔨᔩᔪᔫᔭ… ᔮᔾᕕᕖᕗ–—“”‘’ᕘᕙᕚᕝᕆᕇᕈᕉᕋᕌᕐᕿᖀᖁᖂᖃᖄᖅᖏᖐᖑᖒᖓᖔᖕᙱᙲᙳᙴᙵᙶᖖᖠᖡᖢᖣᖤᖥᖦᕼŁł',
	    'x-mac-ce':  // Python: 'mac_latin2'
	    'ÄĀāÉĄÖÜáąČäčĆćéŹźĎíďĒēĖóėôöõúĚěü†°Ę£§•¶ß®©™ę¨≠ģĮįĪ≤≥īĶ∂∑łĻļĽľĹĺŅ' +
	    'ņŃ¬√ńŇ∆«»… ňŐÕőŌ–—“”‘’÷◊ōŔŕŘ‹›řŖŗŠ‚„šŚśÁŤťÍŽžŪÓÔūŮÚůŰűŲųÝýķŻŁżĢˇ',
	    macintosh:  // Python: 'mac_roman'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›ﬁﬂ‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
	    'x-mac-romanian':  // Python: 'mac_romanian'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ĂȘ∞±≤≥¥µ∂∑∏π∫ªºΩăș' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸ⁄€‹›Țț‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙıˆ˜¯˘˙˚¸˝˛ˇ',
	    'x-mac-turkish':  // Python: 'mac_turkish'
	    'ÄÅÇÉÑÖÜáàâäãåçéèêëíìîïñóòôöõúùûü†°¢£§•¶ß®©™´¨≠ÆØ∞±≤≥¥µ∂∑∏π∫ªºΩæø' +
	    '¿¡¬√ƒ≈∆«»… ÀÃÕŒœ–—“”‘’÷◊ÿŸĞğİıŞş‡·‚„‰ÂÊÁËÈÍÎÏÌÓÔÒÚÛÙˆ˜¯˘˙˚¸˝˛ˇ'
	};

	/**
	 * Decodes an old-style Macintosh string. Returns either a Unicode JavaScript
	 * string, or 'undefined' if the encoding is unsupported. For example, we do
	 * not support Chinese, Japanese or Korean because these would need large
	 * mapping tables.
	 * @param {DataView} dataView
	 * @param {number} offset
	 * @param {number} dataLength
	 * @param {string} encoding
	 * @returns {string}
	 */
	decode.MACSTRING = function(dataView, offset, dataLength, encoding) {
	    var table = eightBitMacEncodings[encoding];
	    if (table === undefined) {
	        return undefined;
	    }

	    var result = '';
	    for (var i = 0; i < dataLength; i++) {
	        var c = dataView.getUint8(offset + i);
	        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
	        // mapped to U+0000..U+007F; we only need to look up the others.
	        if (c <= 0x7F) {
	            result += String.fromCharCode(c);
	        } else {
	            result += table[c & 0x7F];
	        }
	    }

	    return result;
	};

	// Helper function for encode.MACSTRING. Returns a dictionary for mapping
	// Unicode character codes to their 8-bit MacOS equivalent. This table
	// is not exactly a super cheap data structure, but we do not care because
	// encoding Macintosh strings is only rarely needed in typical applications.
	var macEncodingTableCache = typeof WeakMap === 'function' && new WeakMap();
	var macEncodingCacheKeys;
	var getMacEncodingTable = function (encoding) {
	    // Since we use encoding as a cache key for WeakMap, it has to be
	    // a String object and not a literal. And at least on NodeJS 2.10.1,
	    // WeakMap requires that the same String instance is passed for cache hits.
	    if (!macEncodingCacheKeys) {
	        macEncodingCacheKeys = {};
	        for (var e in eightBitMacEncodings) {
	            /*jshint -W053 */  // Suppress "Do not use String as a constructor."
	            macEncodingCacheKeys[e] = new String(e);
	        }
	    }

	    var cacheKey = macEncodingCacheKeys[encoding];
	    if (cacheKey === undefined) {
	        return undefined;
	    }

	    // We can't do "if (cache.has(key)) {return cache.get(key)}" here:
	    // since garbage collection may run at any time, it could also kick in
	    // between the calls to cache.has() and cache.get(). In that case,
	    // we would return 'undefined' even though we do support the encoding.
	    if (macEncodingTableCache) {
	        var cachedTable = macEncodingTableCache.get(cacheKey);
	        if (cachedTable !== undefined) {
	            return cachedTable;
	        }
	    }

	    var decodingTable = eightBitMacEncodings[encoding];
	    if (decodingTable === undefined) {
	        return undefined;
	    }

	    var encodingTable = {};
	    for (var i = 0; i < decodingTable.length; i++) {
	        encodingTable[decodingTable.charCodeAt(i)] = i + 0x80;
	    }

	    if (macEncodingTableCache) {
	        macEncodingTableCache.set(cacheKey, encodingTable);
	    }

	    return encodingTable;
	};

	/**
	 * Encodes an old-style Macintosh string. Returns a byte array upon success.
	 * If the requested encoding is unsupported, or if the input string contains
	 * a character that cannot be expressed in the encoding, the function returns
	 * 'undefined'.
	 * @param {string} str
	 * @param {string} encoding
	 * @returns {Array}
	 */
	encode.MACSTRING = function(str, encoding) {
	    var table = getMacEncodingTable(encoding);
	    if (table === undefined) {
	        return undefined;
	    }

	    var result = [];
	    for (var i = 0; i < str.length; i++) {
	        var c = str.charCodeAt(i);

	        // In all eight-bit Mac encodings, the characters 0x00..0x7F are
	        // mapped to U+0000..U+007F; we only need to look up the others.
	        if (c >= 0x80) {
	            c = table[c];
	            if (c === undefined) {
	                // str contains a Unicode character that cannot be encoded
	                // in the requested encoding.
	                return undefined;
	            }
	        }
	        result[i] = c;
	        // result.push(c);
	    }

	    return result;
	};

	/**
	 * @param {string} str
	 * @param {string} encoding
	 * @returns {number}
	 */
	sizeOf.MACSTRING = function(str, encoding) {
	    var b = encode.MACSTRING(str, encoding);
	    if (b !== undefined) {
	        return b.length;
	    } else {
	        return 0;
	    }
	};

	// Helper for encode.VARDELTAS
	function isByteEncodable(value) {
	    return value >= -128 && value <= 127;
	}

	// Helper for encode.VARDELTAS
	function encodeVarDeltaRunAsZeroes(deltas, pos, result) {
	    var runLength = 0;
	    var numDeltas = deltas.length;
	    while (pos < numDeltas && runLength < 64 && deltas[pos] === 0) {
	        ++pos;
	        ++runLength;
	    }
	    result.push(0x80 | (runLength - 1));
	    return pos;
	}

	// Helper for encode.VARDELTAS
	function encodeVarDeltaRunAsBytes(deltas, offset, result) {
	    var runLength = 0;
	    var numDeltas = deltas.length;
	    var pos = offset;
	    while (pos < numDeltas && runLength < 64) {
	        var value = deltas[pos];
	        if (!isByteEncodable(value)) {
	            break;
	        }

	        // Within a byte-encoded run of deltas, a single zero is best
	        // stored literally as 0x00 value. However, if we have two or
	        // more zeroes in a sequence, it is better to start a new run.
	        // Fore example, the sequence of deltas [15, 15, 0, 15, 15]
	        // becomes 6 bytes (04 0F 0F 00 0F 0F) when storing the zero
	        // within the current run, but 7 bytes (01 0F 0F 80 01 0F 0F)
	        // when starting a new run.
	        if (value === 0 && pos + 1 < numDeltas && deltas[pos + 1] === 0) {
	            break;
	        }

	        ++pos;
	        ++runLength;
	    }
	    result.push(runLength - 1);
	    for (var i = offset; i < pos; ++i) {
	        result.push((deltas[i] + 256) & 0xff);
	    }
	    return pos;
	}

	// Helper for encode.VARDELTAS
	function encodeVarDeltaRunAsWords(deltas, offset, result) {
	    var runLength = 0;
	    var numDeltas = deltas.length;
	    var pos = offset;
	    while (pos < numDeltas && runLength < 64) {
	        var value = deltas[pos];

	        // Within a word-encoded run of deltas, it is easiest to start
	        // a new run (with a different encoding) whenever we encounter
	        // a zero value. For example, the sequence [0x6666, 0, 0x7777]
	        // needs 7 bytes when storing the zero inside the current run
	        // (42 66 66 00 00 77 77), and equally 7 bytes when starting a
	        // new run (40 66 66 80 40 77 77).
	        if (value === 0) {
	            break;
	        }

	        // Within a word-encoded run of deltas, a single value in the
	        // range (-128..127) should be encoded within the current run
	        // because it is more compact. For example, the sequence
	        // [0x6666, 2, 0x7777] becomes 7 bytes when storing the value
	        // literally (42 66 66 00 02 77 77), but 8 bytes when starting
	        // a new run (40 66 66 00 02 40 77 77).
	        if (isByteEncodable(value) && pos + 1 < numDeltas && isByteEncodable(deltas[pos + 1])) {
	            break;
	        }

	        ++pos;
	        ++runLength;
	    }
	    result.push(0x40 | (runLength - 1));
	    for (var i = offset; i < pos; ++i) {
	        var val = deltas[i];
	        result.push(((val + 0x10000) >> 8) & 0xff, (val + 0x100) & 0xff);
	    }
	    return pos;
	}

	/**
	 * Encode a list of variation adjustment deltas.
	 *
	 * Variation adjustment deltas are used in ‘gvar’ and ‘cvar’ tables.
	 * They indicate how points (in ‘gvar’) or values (in ‘cvar’) get adjusted
	 * when generating instances of variation fonts.
	 *
	 * @see https://www.microsoft.com/typography/otspec/gvar.htm
	 * @see https://developer.apple.com/fonts/TrueType-Reference-Manual/RM06/Chap6gvar.html
	 * @param {Array}
	 * @return {Array}
	 */
	encode.VARDELTAS = function(deltas) {
	    var pos = 0;
	    var result = [];
	    while (pos < deltas.length) {
	        var value = deltas[pos];
	        if (value === 0) {
	            pos = encodeVarDeltaRunAsZeroes(deltas, pos, result);
	        } else if (value >= -128 && value <= 127) {
	            pos = encodeVarDeltaRunAsBytes(deltas, pos, result);
	        } else {
	            pos = encodeVarDeltaRunAsWords(deltas, pos, result);
	        }
	    }
	    return result;
	};

	// Convert a list of values to a CFF INDEX structure.
	// The values should be objects containing name / type / value.
	/**
	 * @param {Array} l
	 * @returns {Array}
	 */
	encode.INDEX = function(l) {
	    //var offset, offsets, offsetEncoder, encodedOffsets, encodedOffset, data,
	    //    i, v;
	    // Because we have to know which data type to use to encode the offsets,
	    // we have to go through the values twice: once to encode the data and
	    // calculate the offsets, then again to encode the offsets using the fitting data type.
	    var offset = 1; // First offset is always 1.
	    var offsets = [offset];
	    var data = [];
	    for (var i = 0; i < l.length; i += 1) {
	        var v = encode.OBJECT(l[i]);
	        Array.prototype.push.apply(data, v);
	        offset += v.length;
	        offsets.push(offset);
	    }

	    if (data.length === 0) {
	        return [0, 0];
	    }

	    var encodedOffsets = [];
	    var offSize = (1 + Math.floor(Math.log(offset) / Math.log(2)) / 8) | 0;
	    var offsetEncoder = [undefined, encode.BYTE, encode.USHORT, encode.UINT24, encode.ULONG][offSize];
	    for (var i$1 = 0; i$1 < offsets.length; i$1 += 1) {
	        var encodedOffset = offsetEncoder(offsets[i$1]);
	        Array.prototype.push.apply(encodedOffsets, encodedOffset);
	    }

	    return Array.prototype.concat(encode.Card16(l.length),
	                           encode.OffSize(offSize),
	                           encodedOffsets,
	                           data);
	};

	/**
	 * @param {Array}
	 * @returns {number}
	 */
	sizeOf.INDEX = function(v) {
	    return encode.INDEX(v).length;
	};

	/**
	 * Convert an object to a CFF DICT structure.
	 * The keys should be numeric.
	 * The values should be objects containing name / type / value.
	 * @param {Object} m
	 * @returns {Array}
	 */
	encode.DICT = function(m) {
	    var d = [];
	    var keys = Object.keys(m);
	    var length = keys.length;

	    for (var i = 0; i < length; i += 1) {
	        // Object.keys() return string keys, but our keys are always numeric.
	        var k = parseInt(keys[i], 0);
	        var v = m[k];
	        // Value comes before the key.
	        d = d.concat(encode.OPERAND(v.value, v.type));
	        d = d.concat(encode.OPERATOR(k));
	    }

	    return d;
	};

	/**
	 * @param {Object}
	 * @returns {number}
	 */
	sizeOf.DICT = function(m) {
	    return encode.DICT(m).length;
	};

	/**
	 * @param {number}
	 * @returns {Array}
	 */
	encode.OPERATOR = function(v) {
	    if (v < 1200) {
	        return [v];
	    } else {
	        return [12, v - 1200];
	    }
	};

	/**
	 * @param {Array} v
	 * @param {string}
	 * @returns {Array}
	 */
	encode.OPERAND = function(v, type) {
	    var d = [];
	    if (Array.isArray(type)) {
	        for (var i = 0; i < type.length; i += 1) {
	            check.argument(v.length === type.length, 'Not enough arguments given for type' + type);
	            d = d.concat(encode.OPERAND(v[i], type[i]));
	        }
	    } else {
	        if (type === 'SID') {
	            d = d.concat(encode.NUMBER(v));
	        } else if (type === 'offset') {
	            // We make it easy for ourselves and always encode offsets as
	            // 4 bytes. This makes offset calculation for the top dict easier.
	            d = d.concat(encode.NUMBER32(v));
	        } else if (type === 'number') {
	            d = d.concat(encode.NUMBER(v));
	        } else if (type === 'real') {
	            d = d.concat(encode.REAL(v));
	        } else {
	            throw new Error('Unknown operand type ' + type);
	            // FIXME Add support for booleans
	        }
	    }

	    return d;
	};

	encode.OP = encode.BYTE;
	sizeOf.OP = sizeOf.BYTE;

	// memoize charstring encoding using WeakMap if available
	var wmm = typeof WeakMap === 'function' && new WeakMap();

	/**
	 * Convert a list of CharString operations to bytes.
	 * @param {Array}
	 * @returns {Array}
	 */
	encode.CHARSTRING = function(ops) {
	    // See encode.MACSTRING for why we don't do "if (wmm && wmm.has(ops))".
	    if (wmm) {
	        var cachedValue = wmm.get(ops);
	        if (cachedValue !== undefined) {
	            return cachedValue;
	        }
	    }

	    var d = [];
	    var length = ops.length;

	    for (var i = 0; i < length; i += 1) {
	        var op = ops[i];
	        d = d.concat(encode[op.type](op.value));
	    }

	    if (wmm) {
	        wmm.set(ops, d);
	    }

	    return d;
	};

	/**
	 * @param {Array}
	 * @returns {number}
	 */
	sizeOf.CHARSTRING = function(ops) {
	    return encode.CHARSTRING(ops).length;
	};

	// Utility functions ////////////////////////////////////////////////////////

	/**
	 * Convert an object containing name / type / value to bytes.
	 * @param {Object}
	 * @returns {Array}
	 */
	encode.OBJECT = function(v) {
	    var encodingFunction = encode[v.type];
	    check.argument(encodingFunction !== undefined, 'No encoding function for type ' + v.type);
	    return encodingFunction(v.value);
	};

	/**
	 * @param {Object}
	 * @returns {number}
	 */
	sizeOf.OBJECT = function(v) {
	    var sizeOfFunction = sizeOf[v.type];
	    check.argument(sizeOfFunction !== undefined, 'No sizeOf function for type ' + v.type);
	    return sizeOfFunction(v.value);
	};

	/**
	 * Convert a table object to bytes.
	 * A table contains a list of fields containing the metadata (name, type and default value).
	 * The table itself has the field values set as attributes.
	 * @param {opentype.Table}
	 * @returns {Array}
	 */
	encode.TABLE = function(table) {
	    var d = [];
	    var length = table.fields.length;
	    var subtables = [];
	    var subtableOffsets = [];

	    for (var i = 0; i < length; i += 1) {
	        var field = table.fields[i];
	        var encodingFunction = encode[field.type];
	        check.argument(encodingFunction !== undefined, 'No encoding function for field type ' + field.type + ' (' + field.name + ')');
	        var value = table[field.name];
	        if (value === undefined) {
	            value = field.value;
	        }

	        var bytes = encodingFunction(value);

	        if (field.type === 'TABLE') {
	            subtableOffsets.push(d.length);
	            d = d.concat([0, 0]);
	            subtables.push(bytes);
	        } else {
	            d = d.concat(bytes);
	        }
	    }

	    for (var i$1 = 0; i$1 < subtables.length; i$1 += 1) {
	        var o = subtableOffsets[i$1];
	        var offset = d.length;
	        check.argument(offset < 65536, 'Table ' + table.tableName + ' too big.');
	        d[o] = offset >> 8;
	        d[o + 1] = offset & 0xff;
	        d = d.concat(subtables[i$1]);
	    }

	    return d;
	};

	/**
	 * @param {opentype.Table}
	 * @returns {number}
	 */
	sizeOf.TABLE = function(table) {
	    var numBytes = 0;
	    var length = table.fields.length;

	    for (var i = 0; i < length; i += 1) {
	        var field = table.fields[i];
	        var sizeOfFunction = sizeOf[field.type];
	        check.argument(sizeOfFunction !== undefined, 'No sizeOf function for field type ' + field.type + ' (' + field.name + ')');
	        var value = table[field.name];
	        if (value === undefined) {
	            value = field.value;
	        }

	        numBytes += sizeOfFunction(value);

	        // Subtables take 2 more bytes for offsets.
	        if (field.type === 'TABLE') {
	            numBytes += 2;
	        }
	    }

	    return numBytes;
	};

	encode.RECORD = encode.TABLE;
	sizeOf.RECORD = sizeOf.TABLE;

	// Merge in a list of bytes.
	encode.LITERAL = function(v) {
	    return v;
	};

	sizeOf.LITERAL = function(v) {
	    return v.length;
	};

	// Table metadata

	/**
	 * @exports opentype.Table
	 * @class
	 * @param {string} tableName
	 * @param {Array} fields
	 * @param {Object} options
	 * @constructor
	 */
	function Table(tableName, fields, options) {
	    var this$1 = this;

	    for (var i = 0; i < fields.length; i += 1) {
	        var field = fields[i];
	        this$1[field.name] = field.value;
	    }

	    this.tableName = tableName;
	    this.fields = fields;
	    if (options) {
	        var optionKeys = Object.keys(options);
	        for (var i$1 = 0; i$1 < optionKeys.length; i$1 += 1) {
	            var k = optionKeys[i$1];
	            var v = options[k];
	            if (this$1[k] !== undefined) {
	                this$1[k] = v;
	            }
	        }
	    }
	}

	/**
	 * Encodes the table and returns an array of bytes
	 * @return {Array}
	 */
	Table.prototype.encode = function() {
	    return encode.TABLE(this);
	};

	/**
	 * Get the size of the table.
	 * @return {number}
	 */
	Table.prototype.sizeOf = function() {
	    return sizeOf.TABLE(this);
	};

	/**
	 * @private
	 */
	function ushortList(itemName, list, count) {
	    if (count === undefined) {
	        count = list.length;
	    }
	    var fields = new Array(list.length + 1);
	    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
	    for (var i = 0; i < list.length; i++) {
	        fields[i + 1] = {name: itemName + i, type: 'USHORT', value: list[i]};
	    }
	    return fields;
	}

	/**
	 * @private
	 */
	function tableList(itemName, records, itemCallback) {
	    var count = records.length;
	    var fields = new Array(count + 1);
	    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
	    for (var i = 0; i < count; i++) {
	        fields[i + 1] = {name: itemName + i, type: 'TABLE', value: itemCallback(records[i], i)};
	    }
	    return fields;
	}

	/**
	 * @private
	 */
	function recordList(itemName, records, itemCallback) {
	    var count = records.length;
	    var fields = [];
	    fields[0] = {name: itemName + 'Count', type: 'USHORT', value: count};
	    for (var i = 0; i < count; i++) {
	        fields = fields.concat(itemCallback(records[i], i));
	    }
	    return fields;
	}

	// Common Layout Tables

	/**
	 * @exports opentype.Coverage
	 * @class
	 * @param {opentype.Table}
	 * @constructor
	 * @extends opentype.Table
	 */
	function Coverage(coverageTable) {
	    if (coverageTable.format === 1) {
	        Table.call(this, 'coverageTable',
	            [{name: 'coverageFormat', type: 'USHORT', value: 1}]
	            .concat(ushortList('glyph', coverageTable.glyphs))
	        );
	    } else {
	        check.assert(false, 'Can\'t create coverage table format 2 yet.');
	    }
	}
	Coverage.prototype = Object.create(Table.prototype);
	Coverage.prototype.constructor = Coverage;

	function ScriptList(scriptListTable) {
	    Table.call(this, 'scriptListTable',
	        recordList('scriptRecord', scriptListTable, function(scriptRecord, i) {
	            var script = scriptRecord.script;
	            var defaultLangSys = script.defaultLangSys;
	            check.assert(!!defaultLangSys, 'Unable to write GSUB: script ' + scriptRecord.tag + ' has no default language system.');
	            return [
	                {name: 'scriptTag' + i, type: 'TAG', value: scriptRecord.tag},
	                {name: 'script' + i, type: 'TABLE', value: new Table('scriptTable', [
	                    {name: 'defaultLangSys', type: 'TABLE', value: new Table('defaultLangSys', [
	                        {name: 'lookupOrder', type: 'USHORT', value: 0},
	                        {name: 'reqFeatureIndex', type: 'USHORT', value: defaultLangSys.reqFeatureIndex}]
	                        .concat(ushortList('featureIndex', defaultLangSys.featureIndexes)))}
	                    ].concat(recordList('langSys', script.langSysRecords, function(langSysRecord, i) {
	                        var langSys = langSysRecord.langSys;
	                        return [
	                            {name: 'langSysTag' + i, type: 'TAG', value: langSysRecord.tag},
	                            {name: 'langSys' + i, type: 'TABLE', value: new Table('langSys', [
	                                {name: 'lookupOrder', type: 'USHORT', value: 0},
	                                {name: 'reqFeatureIndex', type: 'USHORT', value: langSys.reqFeatureIndex}
	                                ].concat(ushortList('featureIndex', langSys.featureIndexes)))}
	                        ];
	                    })))}
	            ];
	        })
	    );
	}
	ScriptList.prototype = Object.create(Table.prototype);
	ScriptList.prototype.constructor = ScriptList;

	/**
	 * @exports opentype.FeatureList
	 * @class
	 * @param {opentype.Table}
	 * @constructor
	 * @extends opentype.Table
	 */
	function FeatureList(featureListTable) {
	    Table.call(this, 'featureListTable',
	        recordList('featureRecord', featureListTable, function(featureRecord, i) {
	            var feature = featureRecord.feature;
	            return [
	                {name: 'featureTag' + i, type: 'TAG', value: featureRecord.tag},
	                {name: 'feature' + i, type: 'TABLE', value: new Table('featureTable', [
	                    {name: 'featureParams', type: 'USHORT', value: feature.featureParams} ].concat(ushortList('lookupListIndex', feature.lookupListIndexes)))}
	            ];
	        })
	    );
	}
	FeatureList.prototype = Object.create(Table.prototype);
	FeatureList.prototype.constructor = FeatureList;

	/**
	 * @exports opentype.LookupList
	 * @class
	 * @param {opentype.Table}
	 * @param {Object}
	 * @constructor
	 * @extends opentype.Table
	 */
	function LookupList(lookupListTable, subtableMakers) {
	    Table.call(this, 'lookupListTable', tableList('lookup', lookupListTable, function(lookupTable) {
	        var subtableCallback = subtableMakers[lookupTable.lookupType];
	        check.assert(!!subtableCallback, 'Unable to write GSUB lookup type ' + lookupTable.lookupType + ' tables.');
	        return new Table('lookupTable', [
	            {name: 'lookupType', type: 'USHORT', value: lookupTable.lookupType},
	            {name: 'lookupFlag', type: 'USHORT', value: lookupTable.lookupFlag}
	        ].concat(tableList('subtable', lookupTable.subtables, subtableCallback)));
	    }));
	}
	LookupList.prototype = Object.create(Table.prototype);
	LookupList.prototype.constructor = LookupList;

	// Record = same as Table, but inlined (a Table has an offset and its data is further in the stream)
	// Don't use offsets inside Records (probable bug), only in Tables.
	var table = {
	    Table: Table,
	    Record: Table,
	    Coverage: Coverage,
	    ScriptList: ScriptList,
	    FeatureList: FeatureList,
	    LookupList: LookupList,
	    ushortList: ushortList,
	    tableList: tableList,
	    recordList: recordList,
	};

	// Parsing utility functions

	// Retrieve an unsigned byte from the DataView.
	function getByte(dataView, offset) {
	    return dataView.getUint8(offset);
	}

	// Retrieve an unsigned 16-bit short from the DataView.
	// The value is stored in big endian.
	function getUShort(dataView, offset) {
	    return dataView.getUint16(offset, false);
	}

	// Retrieve a signed 16-bit short from the DataView.
	// The value is stored in big endian.
	function getShort(dataView, offset) {
	    return dataView.getInt16(offset, false);
	}

	// Retrieve an unsigned 32-bit long from the DataView.
	// The value is stored in big endian.
	function getULong(dataView, offset) {
	    return dataView.getUint32(offset, false);
	}

	// Retrieve a 32-bit signed fixed-point number (16.16) from the DataView.
	// The value is stored in big endian.
	function getFixed(dataView, offset) {
	    var decimal = dataView.getInt16(offset, false);
	    var fraction = dataView.getUint16(offset + 2, false);
	    return decimal + fraction / 65535;
	}

	// Retrieve a 4-character tag from the DataView.
	// Tags are used to identify tables.
	function getTag(dataView, offset) {
	    var tag = '';
	    for (var i = offset; i < offset + 4; i += 1) {
	        tag += String.fromCharCode(dataView.getInt8(i));
	    }

	    return tag;
	}

	// Retrieve an offset from the DataView.
	// Offsets are 1 to 4 bytes in length, depending on the offSize argument.
	function getOffset(dataView, offset, offSize) {
	    var v = 0;
	    for (var i = 0; i < offSize; i += 1) {
	        v <<= 8;
	        v += dataView.getUint8(offset + i);
	    }

	    return v;
	}

	// Retrieve a number of bytes from start offset to the end offset from the DataView.
	function getBytes(dataView, startOffset, endOffset) {
	    var bytes = [];
	    for (var i = startOffset; i < endOffset; i += 1) {
	        bytes.push(dataView.getUint8(i));
	    }

	    return bytes;
	}

	// Convert the list of bytes to a string.
	function bytesToString(bytes) {
	    var s = '';
	    for (var i = 0; i < bytes.length; i += 1) {
	        s += String.fromCharCode(bytes[i]);
	    }

	    return s;
	}

	var typeOffsets = {
	    byte: 1,
	    uShort: 2,
	    short: 2,
	    uLong: 4,
	    fixed: 4,
	    longDateTime: 8,
	    tag: 4
	};

	// A stateful parser that changes the offset whenever a value is retrieved.
	// The data is a DataView.
	function Parser(data, offset) {
	    this.data = data;
	    this.offset = offset;
	    this.relativeOffset = 0;
	}

	Parser.prototype.parseByte = function() {
	    var v = this.data.getUint8(this.offset + this.relativeOffset);
	    this.relativeOffset += 1;
	    return v;
	};

	Parser.prototype.parseChar = function() {
	    var v = this.data.getInt8(this.offset + this.relativeOffset);
	    this.relativeOffset += 1;
	    return v;
	};

	Parser.prototype.parseCard8 = Parser.prototype.parseByte;

	Parser.prototype.parseUShort = function() {
	    var v = this.data.getUint16(this.offset + this.relativeOffset);
	    this.relativeOffset += 2;
	    return v;
	};

	Parser.prototype.parseCard16 = Parser.prototype.parseUShort;
	Parser.prototype.parseSID = Parser.prototype.parseUShort;
	Parser.prototype.parseOffset16 = Parser.prototype.parseUShort;

	Parser.prototype.parseShort = function() {
	    var v = this.data.getInt16(this.offset + this.relativeOffset);
	    this.relativeOffset += 2;
	    return v;
	};

	Parser.prototype.parseF2Dot14 = function() {
	    var v = this.data.getInt16(this.offset + this.relativeOffset) / 16384;
	    this.relativeOffset += 2;
	    return v;
	};

	Parser.prototype.parseULong = function() {
	    var v = getULong(this.data, this.offset + this.relativeOffset);
	    this.relativeOffset += 4;
	    return v;
	};

	Parser.prototype.parseOffset32 = Parser.prototype.parseULong;

	Parser.prototype.parseFixed = function() {
	    var v = getFixed(this.data, this.offset + this.relativeOffset);
	    this.relativeOffset += 4;
	    return v;
	};

	Parser.prototype.parseString = function(length) {
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    var string = '';
	    this.relativeOffset += length;
	    for (var i = 0; i < length; i++) {
	        string += String.fromCharCode(dataView.getUint8(offset + i));
	    }

	    return string;
	};

	Parser.prototype.parseTag = function() {
	    return this.parseString(4);
	};

	// LONGDATETIME is a 64-bit integer.
	// JavaScript and unix timestamps traditionally use 32 bits, so we
	// only take the last 32 bits.
	// + Since until 2038 those bits will be filled by zeros we can ignore them.
	Parser.prototype.parseLongDateTime = function() {
	    var v = getULong(this.data, this.offset + this.relativeOffset + 4);
	    // Subtract seconds between 01/01/1904 and 01/01/1970
	    // to convert Apple Mac timestamp to Standard Unix timestamp
	    v -= 2082844800;
	    this.relativeOffset += 8;
	    return v;
	};

	Parser.prototype.parseVersion = function(minorBase) {
	    var major = getUShort(this.data, this.offset + this.relativeOffset);

	    // How to interpret the minor version is very vague in the spec. 0x5000 is 5, 0x1000 is 1
	    // Default returns the correct number if minor = 0xN000 where N is 0-9
	    // Set minorBase to 1 for tables that use minor = N where N is 0-9
	    var minor = getUShort(this.data, this.offset + this.relativeOffset + 2);
	    this.relativeOffset += 4;
	    if (minorBase === undefined) { minorBase = 0x1000; }
	    return major + minor / minorBase / 10;
	};

	Parser.prototype.skip = function(type, amount) {
	    if (amount === undefined) {
	        amount = 1;
	    }

	    this.relativeOffset += typeOffsets[type] * amount;
	};

	///// Parsing lists and records ///////////////////////////////

	// Parse a list of 32 bit unsigned integers.
	Parser.prototype.parseULongList = function(count) {
	    if (count === undefined) { count = this.parseULong(); }
	    var offsets = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        offsets[i] = dataView.getUint32(offset);
	        offset += 4;
	    }

	    this.relativeOffset += count * 4;
	    return offsets;
	};

	// Parse a list of 16 bit unsigned integers. The length of the list can be read on the stream
	// or provided as an argument.
	Parser.prototype.parseOffset16List =
	Parser.prototype.parseUShortList = function(count) {
	    if (count === undefined) { count = this.parseUShort(); }
	    var offsets = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        offsets[i] = dataView.getUint16(offset);
	        offset += 2;
	    }

	    this.relativeOffset += count * 2;
	    return offsets;
	};

	// Parses a list of 16 bit signed integers.
	Parser.prototype.parseShortList = function(count) {
	    var list = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        list[i] = dataView.getInt16(offset);
	        offset += 2;
	    }

	    this.relativeOffset += count * 2;
	    return list;
	};

	// Parses a list of bytes.
	Parser.prototype.parseByteList = function(count) {
	    var list = new Array(count);
	    var dataView = this.data;
	    var offset = this.offset + this.relativeOffset;
	    for (var i = 0; i < count; i++) {
	        list[i] = dataView.getUint8(offset++);
	    }

	    this.relativeOffset += count;
	    return list;
	};

	/**
	 * Parse a list of items.
	 * Record count is optional, if omitted it is read from the stream.
	 * itemCallback is one of the Parser methods.
	 */
	Parser.prototype.parseList = function(count, itemCallback) {
	    var this$1 = this;

	    if (!itemCallback) {
	        itemCallback = count;
	        count = this.parseUShort();
	    }
	    var list = new Array(count);
	    for (var i = 0; i < count; i++) {
	        list[i] = itemCallback.call(this$1);
	    }
	    return list;
	};

	Parser.prototype.parseList32 = function(count, itemCallback) {
	    var this$1 = this;

	    if (!itemCallback) {
	        itemCallback = count;
	        count = this.parseULong();
	    }
	    var list = new Array(count);
	    for (var i = 0; i < count; i++) {
	        list[i] = itemCallback.call(this$1);
	    }
	    return list;
	};

	/**
	 * Parse a list of records.
	 * Record count is optional, if omitted it is read from the stream.
	 * Example of recordDescription: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
	 */
	Parser.prototype.parseRecordList = function(count, recordDescription) {
	    var this$1 = this;

	    // If the count argument is absent, read it in the stream.
	    if (!recordDescription) {
	        recordDescription = count;
	        count = this.parseUShort();
	    }
	    var records = new Array(count);
	    var fields = Object.keys(recordDescription);
	    for (var i = 0; i < count; i++) {
	        var rec = {};
	        for (var j = 0; j < fields.length; j++) {
	            var fieldName = fields[j];
	            var fieldType = recordDescription[fieldName];
	            rec[fieldName] = fieldType.call(this$1);
	        }
	        records[i] = rec;
	    }
	    return records;
	};

	Parser.prototype.parseRecordList32 = function(count, recordDescription) {
	    var this$1 = this;

	    // If the count argument is absent, read it in the stream.
	    if (!recordDescription) {
	        recordDescription = count;
	        count = this.parseULong();
	    }
	    var records = new Array(count);
	    var fields = Object.keys(recordDescription);
	    for (var i = 0; i < count; i++) {
	        var rec = {};
	        for (var j = 0; j < fields.length; j++) {
	            var fieldName = fields[j];
	            var fieldType = recordDescription[fieldName];
	            rec[fieldName] = fieldType.call(this$1);
	        }
	        records[i] = rec;
	    }
	    return records;
	};

	// Parse a data structure into an object
	// Example of description: { sequenceIndex: Parser.uShort, lookupListIndex: Parser.uShort }
	Parser.prototype.parseStruct = function(description) {
	    var this$1 = this;

	    if (typeof description === 'function') {
	        return description.call(this);
	    } else {
	        var fields = Object.keys(description);
	        var struct = {};
	        for (var j = 0; j < fields.length; j++) {
	            var fieldName = fields[j];
	            var fieldType = description[fieldName];
	            struct[fieldName] = fieldType.call(this$1);
	        }
	        return struct;
	    }
	};

	/**
	 * Parse a GPOS valueRecord
	 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
	 * valueFormat is optional, if omitted it is read from the stream.
	 */
	Parser.prototype.parseValueRecord = function(valueFormat) {
	    if (valueFormat === undefined) {
	        valueFormat = this.parseUShort();
	    }
	    if (valueFormat === 0) {
	        // valueFormat2 in kerning pairs is most often 0
	        // in this case return undefined instead of an empty object, to save space
	        return;
	    }
	    var valueRecord = {};

	    if (valueFormat & 0x0001) { valueRecord.xPlacement = this.parseShort(); }
	    if (valueFormat & 0x0002) { valueRecord.yPlacement = this.parseShort(); }
	    if (valueFormat & 0x0004) { valueRecord.xAdvance = this.parseShort(); }
	    if (valueFormat & 0x0008) { valueRecord.yAdvance = this.parseShort(); }

	    // Device table (non-variable font) / VariationIndex table (variable font) not supported
	    // https://docs.microsoft.com/fr-fr/typography/opentype/spec/chapter2#devVarIdxTbls
	    if (valueFormat & 0x0010) { valueRecord.xPlaDevice = undefined; this.parseShort(); }
	    if (valueFormat & 0x0020) { valueRecord.yPlaDevice = undefined; this.parseShort(); }
	    if (valueFormat & 0x0040) { valueRecord.xAdvDevice = undefined; this.parseShort(); }
	    if (valueFormat & 0x0080) { valueRecord.yAdvDevice = undefined; this.parseShort(); }

	    return valueRecord;
	};

	/**
	 * Parse a list of GPOS valueRecords
	 * https://docs.microsoft.com/en-us/typography/opentype/spec/gpos#value-record
	 * valueFormat and valueCount are read from the stream.
	 */
	Parser.prototype.parseValueRecordList = function() {
	    var this$1 = this;

	    var valueFormat = this.parseUShort();
	    var valueCount = this.parseUShort();
	    var values = new Array(valueCount);
	    for (var i = 0; i < valueCount; i++) {
	        values[i] = this$1.parseValueRecord(valueFormat);
	    }
	    return values;
	};

	Parser.prototype.parsePointer = function(description) {
	    var structOffset = this.parseOffset16();
	    if (structOffset > 0) {
	        // NULL offset => return undefined
	        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
	    }
	    return undefined;
	};

	Parser.prototype.parsePointer32 = function(description) {
	    var structOffset = this.parseOffset32();
	    if (structOffset > 0) {
	        // NULL offset => return undefined
	        return new Parser(this.data, this.offset + structOffset).parseStruct(description);
	    }
	    return undefined;
	};

	/**
	 * Parse a list of offsets to lists of 16-bit integers,
	 * or a list of offsets to lists of offsets to any kind of items.
	 * If itemCallback is not provided, a list of list of UShort is assumed.
	 * If provided, itemCallback is called on each item and must parse the item.
	 * See examples in tables/gsub.js
	 */
	Parser.prototype.parseListOfLists = function(itemCallback) {
	    var this$1 = this;

	    var offsets = this.parseOffset16List();
	    var count = offsets.length;
	    var relativeOffset = this.relativeOffset;
	    var list = new Array(count);
	    for (var i = 0; i < count; i++) {
	        var start = offsets[i];
	        if (start === 0) {
	            // NULL offset
	            // Add i as owned property to list. Convenient with assert.
	            list[i] = undefined;
	            continue;
	        }
	        this$1.relativeOffset = start;
	        if (itemCallback) {
	            var subOffsets = this$1.parseOffset16List();
	            var subList = new Array(subOffsets.length);
	            for (var j = 0; j < subOffsets.length; j++) {
	                this$1.relativeOffset = start + subOffsets[j];
	                subList[j] = itemCallback.call(this$1);
	            }
	            list[i] = subList;
	        } else {
	            list[i] = this$1.parseUShortList();
	        }
	    }
	    this.relativeOffset = relativeOffset;
	    return list;
	};

	///// Complex tables parsing //////////////////////////////////

	// Parse a coverage table in a GSUB, GPOS or GDEF table.
	// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
	// parser.offset must point to the start of the table containing the coverage.
	Parser.prototype.parseCoverage = function() {
	    var this$1 = this;

	    var startOffset = this.offset + this.relativeOffset;
	    var format = this.parseUShort();
	    var count = this.parseUShort();
	    if (format === 1) {
	        return {
	            format: 1,
	            glyphs: this.parseUShortList(count)
	        };
	    } else if (format === 2) {
	        var ranges = new Array(count);
	        for (var i = 0; i < count; i++) {
	            ranges[i] = {
	                start: this$1.parseUShort(),
	                end: this$1.parseUShort(),
	                index: this$1.parseUShort()
	            };
	        }
	        return {
	            format: 2,
	            ranges: ranges
	        };
	    }
	    throw new Error('0x' + startOffset.toString(16) + ': Coverage format must be 1 or 2.');
	};

	// Parse a Class Definition Table in a GSUB, GPOS or GDEF table.
	// https://www.microsoft.com/typography/OTSPEC/chapter2.htm
	Parser.prototype.parseClassDef = function() {
	    var startOffset = this.offset + this.relativeOffset;
	    var format = this.parseUShort();
	    if (format === 1) {
	        return {
	            format: 1,
	            startGlyph: this.parseUShort(),
	            classes: this.parseUShortList()
	        };
	    } else if (format === 2) {
	        return {
	            format: 2,
	            ranges: this.parseRecordList({
	                start: Parser.uShort,
	                end: Parser.uShort,
	                classId: Parser.uShort
	            })
	        };
	    }
	    throw new Error('0x' + startOffset.toString(16) + ': ClassDef format must be 1 or 2.');
	};

	///// Static methods ///////////////////////////////////
	// These convenience methods can be used as callbacks and should be called with "this" context set to a Parser instance.

	Parser.list = function(count, itemCallback) {
	    return function() {
	        return this.parseList(count, itemCallback);
	    };
	};

	Parser.list32 = function(count, itemCallback) {
	    return function() {
	        return this.parseList32(count, itemCallback);
	    };
	};

	Parser.recordList = function(count, recordDescription) {
	    return function() {
	        return this.parseRecordList(count, recordDescription);
	    };
	};

	Parser.recordList32 = function(count, recordDescription) {
	    return function() {
	        return this.parseRecordList32(count, recordDescription);
	    };
	};

	Parser.pointer = function(description) {
	    return function() {
	        return this.parsePointer(description);
	    };
	};

	Parser.pointer32 = function(description) {
	    return function() {
	        return this.parsePointer32(description);
	    };
	};

	Parser.tag = Parser.prototype.parseTag;
	Parser.byte = Parser.prototype.parseByte;
	Parser.uShort = Parser.offset16 = Parser.prototype.parseUShort;
	Parser.uShortList = Parser.prototype.parseUShortList;
	Parser.uLong = Parser.offset32 = Parser.prototype.parseULong;
	Parser.uLongList = Parser.prototype.parseULongList;
	Parser.struct = Parser.prototype.parseStruct;
	Parser.coverage = Parser.prototype.parseCoverage;
	Parser.classDef = Parser.prototype.parseClassDef;

	///// Script, Feature, Lookup lists ///////////////////////////////////////////////
	// https://www.microsoft.com/typography/OTSPEC/chapter2.htm

	var langSysTable = {
	    reserved: Parser.uShort,
	    reqFeatureIndex: Parser.uShort,
	    featureIndexes: Parser.uShortList
	};

	Parser.prototype.parseScriptList = function() {
	    return this.parsePointer(Parser.recordList({
	        tag: Parser.tag,
	        script: Parser.pointer({
	            defaultLangSys: Parser.pointer(langSysTable),
	            langSysRecords: Parser.recordList({
	                tag: Parser.tag,
	                langSys: Parser.pointer(langSysTable)
	            })
	        })
	    })) || [];
	};

	Parser.prototype.parseFeatureList = function() {
	    return this.parsePointer(Parser.recordList({
	        tag: Parser.tag,
	        feature: Parser.pointer({
	            featureParams: Parser.offset16,
	            lookupListIndexes: Parser.uShortList
	        })
	    })) || [];
	};

	Parser.prototype.parseLookupList = function(lookupTableParsers) {
	    return this.parsePointer(Parser.list(Parser.pointer(function() {
	        var lookupType = this.parseUShort();
	        check.argument(1 <= lookupType && lookupType <= 9, 'GPOS/GSUB lookup type ' + lookupType + ' unknown.');
	        var lookupFlag = this.parseUShort();
	        var useMarkFilteringSet = lookupFlag & 0x10;
	        return {
	            lookupType: lookupType,
	            lookupFlag: lookupFlag,
	            subtables: this.parseList(Parser.pointer(lookupTableParsers[lookupType])),
	            markFilteringSet: useMarkFilteringSet ? this.parseUShort() : undefined
	        };
	    }))) || [];
	};

	Parser.prototype.parseFeatureVariationsList = function() {
	    return this.parsePointer32(function() {
	        var majorVersion = this.parseUShort();
	        var minorVersion = this.parseUShort();
	        check.argument(majorVersion === 1 && minorVersion < 1, 'GPOS/GSUB feature variations table unknown.');
	        var featureVariations = this.parseRecordList32({
	            conditionSetOffset: Parser.offset32,
	            featureTableSubstitutionOffset: Parser.offset32
	        });
	        return featureVariations;
	    }) || [];
	};

	var parse = {
	    getByte: getByte,
	    getCard8: getByte,
	    getUShort: getUShort,
	    getCard16: getUShort,
	    getShort: getShort,
	    getULong: getULong,
	    getFixed: getFixed,
	    getTag: getTag,
	    getOffset: getOffset,
	    getBytes: getBytes,
	    bytesToString: bytesToString,
	    Parser: Parser,
	};

	// The `cmap` table stores the mappings from characters to glyphs.

	function parseCmapTableFormat12(cmap, p) {
	    //Skip reserved.
	    p.parseUShort();

	    // Length in bytes of the sub-tables.
	    cmap.length = p.parseULong();
	    cmap.language = p.parseULong();

	    var groupCount;
	    cmap.groupCount = groupCount = p.parseULong();
	    cmap.glyphIndexMap = {};

	    for (var i = 0; i < groupCount; i += 1) {
	        var startCharCode = p.parseULong();
	        var endCharCode = p.parseULong();
	        var startGlyphId = p.parseULong();

	        for (var c = startCharCode; c <= endCharCode; c += 1) {
	            cmap.glyphIndexMap[c] = startGlyphId;
	            startGlyphId++;
	        }
	    }
	}

	function parseCmapTableFormat4(cmap, p, data, start, offset) {
	    // Length in bytes of the sub-tables.
	    cmap.length = p.parseUShort();
	    cmap.language = p.parseUShort();

	    // segCount is stored x 2.
	    var segCount;
	    cmap.segCount = segCount = p.parseUShort() >> 1;

	    // Skip searchRange, entrySelector, rangeShift.
	    p.skip('uShort', 3);

	    // The "unrolled" mapping from character codes to glyph indices.
	    cmap.glyphIndexMap = {};
	    var endCountParser = new parse.Parser(data, start + offset + 14);
	    var startCountParser = new parse.Parser(data, start + offset + 16 + segCount * 2);
	    var idDeltaParser = new parse.Parser(data, start + offset + 16 + segCount * 4);
	    var idRangeOffsetParser = new parse.Parser(data, start + offset + 16 + segCount * 6);
	    var glyphIndexOffset = start + offset + 16 + segCount * 8;
	    for (var i = 0; i < segCount - 1; i += 1) {
	        var glyphIndex = (void 0);
	        var endCount = endCountParser.parseUShort();
	        var startCount = startCountParser.parseUShort();
	        var idDelta = idDeltaParser.parseShort();
	        var idRangeOffset = idRangeOffsetParser.parseUShort();
	        for (var c = startCount; c <= endCount; c += 1) {
	            if (idRangeOffset !== 0) {
	                // The idRangeOffset is relative to the current position in the idRangeOffset array.
	                // Take the current offset in the idRangeOffset array.
	                glyphIndexOffset = (idRangeOffsetParser.offset + idRangeOffsetParser.relativeOffset - 2);

	                // Add the value of the idRangeOffset, which will move us into the glyphIndex array.
	                glyphIndexOffset += idRangeOffset;

	                // Then add the character index of the current segment, multiplied by 2 for USHORTs.
	                glyphIndexOffset += (c - startCount) * 2;
	                glyphIndex = parse.getUShort(data, glyphIndexOffset);
	                if (glyphIndex !== 0) {
	                    glyphIndex = (glyphIndex + idDelta) & 0xFFFF;
	                }
	            } else {
	                glyphIndex = (c + idDelta) & 0xFFFF;
	            }

	            cmap.glyphIndexMap[c] = glyphIndex;
	        }
	    }
	}

	// Parse the `cmap` table. This table stores the mappings from characters to glyphs.
	// There are many available formats, but we only support the Windows format 4 and 12.
	// This function returns a `CmapEncoding` object or null if no supported format could be found.
	function parseCmapTable(data, start) {
	    var cmap = {};
	    cmap.version = parse.getUShort(data, start);
	    check.argument(cmap.version === 0, 'cmap table version should be 0.');

	    // The cmap table can contain many sub-tables, each with their own format.
	    // We're only interested in a "platform 0" (Unicode format) and "platform 3" (Windows format) table.
	    cmap.numTables = parse.getUShort(data, start + 2);
	    var offset = -1;
	    for (var i = cmap.numTables - 1; i >= 0; i -= 1) {
	        var platformId = parse.getUShort(data, start + 4 + (i * 8));
	        var encodingId = parse.getUShort(data, start + 4 + (i * 8) + 2);
	        if ((platformId === 3 && (encodingId === 0 || encodingId === 1 || encodingId === 10)) ||
	            (platformId === 0 && (encodingId === 0 || encodingId === 1 || encodingId === 2 || encodingId === 3 || encodingId === 4))) {
	            offset = parse.getULong(data, start + 4 + (i * 8) + 4);
	            break;
	        }
	    }

	    if (offset === -1) {
	        // There is no cmap table in the font that we support.
	        throw new Error('No valid cmap sub-tables found.');
	    }

	    var p = new parse.Parser(data, start + offset);
	    cmap.format = p.parseUShort();

	    if (cmap.format === 12) {
	        parseCmapTableFormat12(cmap, p);
	    } else if (cmap.format === 4) {
	        parseCmapTableFormat4(cmap, p, data, start, offset);
	    } else {
	        throw new Error('Only format 4 and 12 cmap tables are supported (found format ' + cmap.format + ').');
	    }

	    return cmap;
	}

	function addSegment(t, code, glyphIndex) {
	    t.segments.push({
	        end: code,
	        start: code,
	        delta: -(code - glyphIndex),
	        offset: 0,
	        glyphIndex: glyphIndex
	    });
	}

	function addTerminatorSegment(t) {
	    t.segments.push({
	        end: 0xFFFF,
	        start: 0xFFFF,
	        delta: 1,
	        offset: 0
	    });
	}

	// Make cmap table, format 4 by default, 12 if needed only
	function makeCmapTable(glyphs) {
	    // Plan 0 is the base Unicode Plan but emojis, for example are on another plan, and needs cmap 12 format (with 32bit)
	    var isPlan0Only = true;
	    var i;

	    // Check if we need to add cmap format 12 or if format 4 only is fine
	    for (i = glyphs.length - 1; i > 0; i -= 1) {
	        var g = glyphs.get(i);
	        if (g.unicode > 65535) {
	            console.log('Adding CMAP format 12 (needed!)');
	            isPlan0Only = false;
	            break;
	        }
	    }

	    var cmapTable = [
	        {name: 'version', type: 'USHORT', value: 0},
	        {name: 'numTables', type: 'USHORT', value: isPlan0Only ? 1 : 2},

	        // CMAP 4 header
	        {name: 'platformID', type: 'USHORT', value: 3},
	        {name: 'encodingID', type: 'USHORT', value: 1},
	        {name: 'offset', type: 'ULONG', value: isPlan0Only ? 12 : (12 + 8)}
	    ];

	    if (!isPlan0Only)
	        { cmapTable = cmapTable.concat([
	            // CMAP 12 header
	            {name: 'cmap12PlatformID', type: 'USHORT', value: 3}, // We encode only for PlatformID = 3 (Windows) because it is supported everywhere
	            {name: 'cmap12EncodingID', type: 'USHORT', value: 10},
	            {name: 'cmap12Offset', type: 'ULONG', value: 0}
	        ]); }

	    cmapTable = cmapTable.concat([
	        // CMAP 4 Subtable
	        {name: 'format', type: 'USHORT', value: 4},
	        {name: 'cmap4Length', type: 'USHORT', value: 0},
	        {name: 'language', type: 'USHORT', value: 0},
	        {name: 'segCountX2', type: 'USHORT', value: 0},
	        {name: 'searchRange', type: 'USHORT', value: 0},
	        {name: 'entrySelector', type: 'USHORT', value: 0},
	        {name: 'rangeShift', type: 'USHORT', value: 0}
	    ]);

	    var t = new table.Table('cmap', cmapTable);

	    t.segments = [];
	    for (i = 0; i < glyphs.length; i += 1) {
	        var glyph = glyphs.get(i);
	        for (var j = 0; j < glyph.unicodes.length; j += 1) {
	            addSegment(t, glyph.unicodes[j], i);
	        }

	        t.segments = t.segments.sort(function (a, b) {
	            return a.start - b.start;
	        });
	    }

	    addTerminatorSegment(t);

	    var segCount = t.segments.length;
	    var segCountToRemove = 0;

	    // CMAP 4
	    // Set up parallel segment arrays.
	    var endCounts = [];
	    var startCounts = [];
	    var idDeltas = [];
	    var idRangeOffsets = [];
	    var glyphIds = [];

	    // CMAP 12
	    var cmap12Groups = [];

	    // Reminder this loop is not following the specification at 100%
	    // The specification -> find suites of characters and make a group
	    // Here we're doing one group for each letter
	    // Doing as the spec can save 8 times (or more) space
	    for (i = 0; i < segCount; i += 1) {
	        var segment = t.segments[i];

	        // CMAP 4
	        if (segment.end <= 65535 && segment.start <= 65535) {
	            endCounts = endCounts.concat({name: 'end_' + i, type: 'USHORT', value: segment.end});
	            startCounts = startCounts.concat({name: 'start_' + i, type: 'USHORT', value: segment.start});
	            idDeltas = idDeltas.concat({name: 'idDelta_' + i, type: 'SHORT', value: segment.delta});
	            idRangeOffsets = idRangeOffsets.concat({name: 'idRangeOffset_' + i, type: 'USHORT', value: segment.offset});
	            if (segment.glyphId !== undefined) {
	                glyphIds = glyphIds.concat({name: 'glyph_' + i, type: 'USHORT', value: segment.glyphId});
	            }
	        } else {
	            // Skip Unicode > 65535 (16bit unsigned max) for CMAP 4, will be added in CMAP 12
	            segCountToRemove += 1;
	        }

	        // CMAP 12
	        // Skip Terminator Segment
	        if (!isPlan0Only && segment.glyphIndex !== undefined) {
	            cmap12Groups = cmap12Groups.concat({name: 'cmap12Start_' + i, type: 'ULONG', value: segment.start});
	            cmap12Groups = cmap12Groups.concat({name: 'cmap12End_' + i, type: 'ULONG', value: segment.end});
	            cmap12Groups = cmap12Groups.concat({name: 'cmap12Glyph_' + i, type: 'ULONG', value: segment.glyphIndex});
	        }
	    }

	    // CMAP 4 Subtable
	    t.segCountX2 = (segCount - segCountToRemove) * 2;
	    t.searchRange = Math.pow(2, Math.floor(Math.log((segCount - segCountToRemove)) / Math.log(2))) * 2;
	    t.entrySelector = Math.log(t.searchRange / 2) / Math.log(2);
	    t.rangeShift = t.segCountX2 - t.searchRange;

	    t.fields = t.fields.concat(endCounts);
	    t.fields.push({name: 'reservedPad', type: 'USHORT', value: 0});
	    t.fields = t.fields.concat(startCounts);
	    t.fields = t.fields.concat(idDeltas);
	    t.fields = t.fields.concat(idRangeOffsets);
	    t.fields = t.fields.concat(glyphIds);

	    t.cmap4Length = 14 + // Subtable header
	        endCounts.length * 2 +
	        2 + // reservedPad
	        startCounts.length * 2 +
	        idDeltas.length * 2 +
	        idRangeOffsets.length * 2 +
	        glyphIds.length * 2;

	    if (!isPlan0Only) {
	        // CMAP 12 Subtable
	        var cmap12Length = 16 + // Subtable header
	            cmap12Groups.length * 4;

	        t.cmap12Offset = 12 + (2 * 2) + 4 + t.cmap4Length;
	        t.fields = t.fields.concat([
	            {name: 'cmap12Format', type: 'USHORT', value: 12},
	            {name: 'cmap12Reserved', type: 'USHORT', value: 0},
	            {name: 'cmap12Length', type: 'ULONG', value: cmap12Length},
	            {name: 'cmap12Language', type: 'ULONG', value: 0},
	            {name: 'cmap12nGroups', type: 'ULONG', value: cmap12Groups.length / 3}
	        ]);

	        t.fields = t.fields.concat(cmap12Groups);
	    }

	    return t;
	}

	var cmap = { parse: parseCmapTable, make: makeCmapTable };

	// Glyph encoding

	var cffStandardStrings = [
	    '.notdef', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
	    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
	    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
	    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
	    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
	    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
	    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', 'exclamdown', 'cent', 'sterling',
	    'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle', 'quotedblleft', 'guillemotleft',
	    'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'endash', 'dagger', 'daggerdbl', 'periodcentered', 'paragraph',
	    'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright', 'guillemotright', 'ellipsis', 'perthousand',
	    'questiondown', 'grave', 'acute', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'dieresis', 'ring',
	    'cedilla', 'hungarumlaut', 'ogonek', 'caron', 'emdash', 'AE', 'ordfeminine', 'Lslash', 'Oslash', 'OE',
	    'ordmasculine', 'ae', 'dotlessi', 'lslash', 'oslash', 'oe', 'germandbls', 'onesuperior', 'logicalnot', 'mu',
	    'trademark', 'Eth', 'onehalf', 'plusminus', 'Thorn', 'onequarter', 'divide', 'brokenbar', 'degree', 'thorn',
	    'threequarters', 'twosuperior', 'registered', 'minus', 'eth', 'multiply', 'threesuperior', 'copyright',
	    'Aacute', 'Acircumflex', 'Adieresis', 'Agrave', 'Aring', 'Atilde', 'Ccedilla', 'Eacute', 'Ecircumflex',
	    'Edieresis', 'Egrave', 'Iacute', 'Icircumflex', 'Idieresis', 'Igrave', 'Ntilde', 'Oacute', 'Ocircumflex',
	    'Odieresis', 'Ograve', 'Otilde', 'Scaron', 'Uacute', 'Ucircumflex', 'Udieresis', 'Ugrave', 'Yacute',
	    'Ydieresis', 'Zcaron', 'aacute', 'acircumflex', 'adieresis', 'agrave', 'aring', 'atilde', 'ccedilla', 'eacute',
	    'ecircumflex', 'edieresis', 'egrave', 'iacute', 'icircumflex', 'idieresis', 'igrave', 'ntilde', 'oacute',
	    'ocircumflex', 'odieresis', 'ograve', 'otilde', 'scaron', 'uacute', 'ucircumflex', 'udieresis', 'ugrave',
	    'yacute', 'ydieresis', 'zcaron', 'exclamsmall', 'Hungarumlautsmall', 'dollaroldstyle', 'dollarsuperior',
	    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', '266 ff', 'onedotenleader',
	    'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle', 'fouroldstyle', 'fiveoldstyle', 'sixoldstyle',
	    'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'commasuperior', 'threequartersemdash', 'periodsuperior',
	    'questionsmall', 'asuperior', 'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', 'isuperior', 'lsuperior',
	    'msuperior', 'nsuperior', 'osuperior', 'rsuperior', 'ssuperior', 'tsuperior', 'ff', 'ffi', 'ffl',
	    'parenleftinferior', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
	    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
	    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
	    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', 'exclamdownsmall',
	    'centoldstyle', 'Lslashsmall', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall', 'Brevesmall', 'Caronsmall',
	    'Dotaccentsmall', 'Macronsmall', 'figuredash', 'hypheninferior', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall',
	    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds',
	    'zerosuperior', 'foursuperior', 'fivesuperior', 'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior',
	    'zeroinferior', 'oneinferior', 'twoinferior', 'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior',
	    'seveninferior', 'eightinferior', 'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior',
	    'commainferior', 'Agravesmall', 'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall',
	    'Aringsmall', 'AEsmall', 'Ccedillasmall', 'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall',
	    'Igravesmall', 'Iacutesmall', 'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall',
	    'Oacutesmall', 'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall',
	    'Uacutesmall', 'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall', '001.000',
	    '001.001', '001.002', '001.003', 'Black', 'Bold', 'Book', 'Light', 'Medium', 'Regular', 'Roman', 'Semibold'];

	var cffStandardEncoding = [
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    '', '', '', '', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent', 'ampersand', 'quoteright',
	    'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash', 'zero', 'one', 'two',
	    'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less', 'equal', 'greater',
	    'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S',
	    'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright', 'asciicircum', 'underscore',
	    'quoteleft', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't',
	    'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde', '', '', '', '', '', '', '', '',
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    'exclamdown', 'cent', 'sterling', 'fraction', 'yen', 'florin', 'section', 'currency', 'quotesingle',
	    'quotedblleft', 'guillemotleft', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', '', 'endash', 'dagger',
	    'daggerdbl', 'periodcentered', '', 'paragraph', 'bullet', 'quotesinglbase', 'quotedblbase', 'quotedblright',
	    'guillemotright', 'ellipsis', 'perthousand', '', 'questiondown', '', 'grave', 'acute', 'circumflex', 'tilde',
	    'macron', 'breve', 'dotaccent', 'dieresis', '', 'ring', 'cedilla', '', 'hungarumlaut', 'ogonek', 'caron',
	    'emdash', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', 'AE', '', 'ordfeminine', '', '', '',
	    '', 'Lslash', 'Oslash', 'OE', 'ordmasculine', '', '', '', '', '', 'ae', '', '', '', 'dotlessi', '', '',
	    'lslash', 'oslash', 'oe', 'germandbls'];

	var cffExpertEncoding = [
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    '', '', '', '', 'space', 'exclamsmall', 'Hungarumlautsmall', '', 'dollaroldstyle', 'dollarsuperior',
	    'ampersandsmall', 'Acutesmall', 'parenleftsuperior', 'parenrightsuperior', 'twodotenleader', 'onedotenleader',
	    'comma', 'hyphen', 'period', 'fraction', 'zerooldstyle', 'oneoldstyle', 'twooldstyle', 'threeoldstyle',
	    'fouroldstyle', 'fiveoldstyle', 'sixoldstyle', 'sevenoldstyle', 'eightoldstyle', 'nineoldstyle', 'colon',
	    'semicolon', 'commasuperior', 'threequartersemdash', 'periodsuperior', 'questionsmall', '', 'asuperior',
	    'bsuperior', 'centsuperior', 'dsuperior', 'esuperior', '', '', 'isuperior', '', '', 'lsuperior', 'msuperior',
	    'nsuperior', 'osuperior', '', '', 'rsuperior', 'ssuperior', 'tsuperior', '', 'ff', 'fi', 'fl', 'ffi', 'ffl',
	    'parenleftinferior', '', 'parenrightinferior', 'Circumflexsmall', 'hyphensuperior', 'Gravesmall', 'Asmall',
	    'Bsmall', 'Csmall', 'Dsmall', 'Esmall', 'Fsmall', 'Gsmall', 'Hsmall', 'Ismall', 'Jsmall', 'Ksmall', 'Lsmall',
	    'Msmall', 'Nsmall', 'Osmall', 'Psmall', 'Qsmall', 'Rsmall', 'Ssmall', 'Tsmall', 'Usmall', 'Vsmall', 'Wsmall',
	    'Xsmall', 'Ysmall', 'Zsmall', 'colonmonetary', 'onefitted', 'rupiah', 'Tildesmall', '', '', '', '', '', '', '',
	    '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '', '',
	    'exclamdownsmall', 'centoldstyle', 'Lslashsmall', '', '', 'Scaronsmall', 'Zcaronsmall', 'Dieresissmall',
	    'Brevesmall', 'Caronsmall', '', 'Dotaccentsmall', '', '', 'Macronsmall', '', '', 'figuredash', 'hypheninferior',
	    '', '', 'Ogoneksmall', 'Ringsmall', 'Cedillasmall', '', '', '', 'onequarter', 'onehalf', 'threequarters',
	    'questiondownsmall', 'oneeighth', 'threeeighths', 'fiveeighths', 'seveneighths', 'onethird', 'twothirds', '',
	    '', 'zerosuperior', 'onesuperior', 'twosuperior', 'threesuperior', 'foursuperior', 'fivesuperior',
	    'sixsuperior', 'sevensuperior', 'eightsuperior', 'ninesuperior', 'zeroinferior', 'oneinferior', 'twoinferior',
	    'threeinferior', 'fourinferior', 'fiveinferior', 'sixinferior', 'seveninferior', 'eightinferior',
	    'nineinferior', 'centinferior', 'dollarinferior', 'periodinferior', 'commainferior', 'Agravesmall',
	    'Aacutesmall', 'Acircumflexsmall', 'Atildesmall', 'Adieresissmall', 'Aringsmall', 'AEsmall', 'Ccedillasmall',
	    'Egravesmall', 'Eacutesmall', 'Ecircumflexsmall', 'Edieresissmall', 'Igravesmall', 'Iacutesmall',
	    'Icircumflexsmall', 'Idieresissmall', 'Ethsmall', 'Ntildesmall', 'Ogravesmall', 'Oacutesmall',
	    'Ocircumflexsmall', 'Otildesmall', 'Odieresissmall', 'OEsmall', 'Oslashsmall', 'Ugravesmall', 'Uacutesmall',
	    'Ucircumflexsmall', 'Udieresissmall', 'Yacutesmall', 'Thornsmall', 'Ydieresissmall'];

	var standardNames = [
	    '.notdef', '.null', 'nonmarkingreturn', 'space', 'exclam', 'quotedbl', 'numbersign', 'dollar', 'percent',
	    'ampersand', 'quotesingle', 'parenleft', 'parenright', 'asterisk', 'plus', 'comma', 'hyphen', 'period', 'slash',
	    'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'colon', 'semicolon', 'less',
	    'equal', 'greater', 'question', 'at', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O',
	    'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', 'bracketleft', 'backslash', 'bracketright',
	    'asciicircum', 'underscore', 'grave', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o',
	    'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'braceleft', 'bar', 'braceright', 'asciitilde',
	    'Adieresis', 'Aring', 'Ccedilla', 'Eacute', 'Ntilde', 'Odieresis', 'Udieresis', 'aacute', 'agrave',
	    'acircumflex', 'adieresis', 'atilde', 'aring', 'ccedilla', 'eacute', 'egrave', 'ecircumflex', 'edieresis',
	    'iacute', 'igrave', 'icircumflex', 'idieresis', 'ntilde', 'oacute', 'ograve', 'ocircumflex', 'odieresis',
	    'otilde', 'uacute', 'ugrave', 'ucircumflex', 'udieresis', 'dagger', 'degree', 'cent', 'sterling', 'section',
	    'bullet', 'paragraph', 'germandbls', 'registered', 'copyright', 'trademark', 'acute', 'dieresis', 'notequal',
	    'AE', 'Oslash', 'infinity', 'plusminus', 'lessequal', 'greaterequal', 'yen', 'mu', 'partialdiff', 'summation',
	    'product', 'pi', 'integral', 'ordfeminine', 'ordmasculine', 'Omega', 'ae', 'oslash', 'questiondown',
	    'exclamdown', 'logicalnot', 'radical', 'florin', 'approxequal', 'Delta', 'guillemotleft', 'guillemotright',
	    'ellipsis', 'nonbreakingspace', 'Agrave', 'Atilde', 'Otilde', 'OE', 'oe', 'endash', 'emdash', 'quotedblleft',
	    'quotedblright', 'quoteleft', 'quoteright', 'divide', 'lozenge', 'ydieresis', 'Ydieresis', 'fraction',
	    'currency', 'guilsinglleft', 'guilsinglright', 'fi', 'fl', 'daggerdbl', 'periodcentered', 'quotesinglbase',
	    'quotedblbase', 'perthousand', 'Acircumflex', 'Ecircumflex', 'Aacute', 'Edieresis', 'Egrave', 'Iacute',
	    'Icircumflex', 'Idieresis', 'Igrave', 'Oacute', 'Ocircumflex', 'apple', 'Ograve', 'Uacute', 'Ucircumflex',
	    'Ugrave', 'dotlessi', 'circumflex', 'tilde', 'macron', 'breve', 'dotaccent', 'ring', 'cedilla', 'hungarumlaut',
	    'ogonek', 'caron', 'Lslash', 'lslash', 'Scaron', 'scaron', 'Zcaron', 'zcaron', 'brokenbar', 'Eth', 'eth',
	    'Yacute', 'yacute', 'Thorn', 'thorn', 'minus', 'multiply', 'onesuperior', 'twosuperior', 'threesuperior',
	    'onehalf', 'onequarter', 'threequarters', 'franc', 'Gbreve', 'gbreve', 'Idotaccent', 'Scedilla', 'scedilla',
	    'Cacute', 'cacute', 'Ccaron', 'ccaron', 'dcroat'];

	/**
	 * This is the encoding used for fonts created from scratch.
	 * It loops through all glyphs and finds the appropriate unicode value.
	 * Since it's linear time, other encodings will be faster.
	 * @exports opentype.DefaultEncoding
	 * @class
	 * @constructor
	 * @param {opentype.Font}
	 */
	function DefaultEncoding(font) {
	    this.font = font;
	}

	DefaultEncoding.prototype.charToGlyphIndex = function(c) {
	    var code = c.codePointAt(0);
	    var glyphs = this.font.glyphs;
	    if (glyphs) {
	        for (var i = 0; i < glyphs.length; i += 1) {
	            var glyph = glyphs.get(i);
	            for (var j = 0; j < glyph.unicodes.length; j += 1) {
	                if (glyph.unicodes[j] === code) {
	                    return i;
	                }
	            }
	        }
	    }
	    return null;
	};

	/**
	 * @exports opentype.CmapEncoding
	 * @class
	 * @constructor
	 * @param {Object} cmap - a object with the cmap encoded data
	 */
	function CmapEncoding(cmap) {
	    this.cmap = cmap;
	}

	/**
	 * @param  {string} c - the character
	 * @return {number} The glyph index.
	 */
	CmapEncoding.prototype.charToGlyphIndex = function(c) {
	    return this.cmap.glyphIndexMap[c.codePointAt(0)] || 0;
	};

	/**
	 * @exports opentype.CffEncoding
	 * @class
	 * @constructor
	 * @param {string} encoding - The encoding
	 * @param {Array} charset - The character set.
	 */
	function CffEncoding(encoding, charset) {
	    this.encoding = encoding;
	    this.charset = charset;
	}

	/**
	 * @param  {string} s - The character
	 * @return {number} The index.
	 */
	CffEncoding.prototype.charToGlyphIndex = function(s) {
	    var code = s.codePointAt(0);
	    var charName = this.encoding[code];
	    return this.charset.indexOf(charName);
	};

	/**
	 * @exports opentype.GlyphNames
	 * @class
	 * @constructor
	 * @param {Object} post
	 */
	function GlyphNames(post) {
	    var this$1 = this;

	    switch (post.version) {
	        case 1:
	            this.names = standardNames.slice();
	            break;
	        case 2:
	            this.names = new Array(post.numberOfGlyphs);
	            for (var i = 0; i < post.numberOfGlyphs; i++) {
	                if (post.glyphNameIndex[i] < standardNames.length) {
	                    this$1.names[i] = standardNames[post.glyphNameIndex[i]];
	                } else {
	                    this$1.names[i] = post.names[post.glyphNameIndex[i] - standardNames.length];
	                }
	            }

	            break;
	        case 2.5:
	            this.names = new Array(post.numberOfGlyphs);
	            for (var i$1 = 0; i$1 < post.numberOfGlyphs; i$1++) {
	                this$1.names[i$1] = standardNames[i$1 + post.glyphNameIndex[i$1]];
	            }

	            break;
	        case 3:
	            this.names = [];
	            break;
	        default:
	            this.names = [];
	            break;
	    }
	}

	/**
	 * Gets the index of a glyph by name.
	 * @param  {string} name - The glyph name
	 * @return {number} The index
	 */
	GlyphNames.prototype.nameToGlyphIndex = function(name) {
	    return this.names.indexOf(name);
	};

	/**
	 * @param  {number} gid
	 * @return {string}
	 */
	GlyphNames.prototype.glyphIndexToName = function(gid) {
	    return this.names[gid];
	};

	/**
	 * @alias opentype.addGlyphNames
	 * @param {opentype.Font}
	 */
	function addGlyphNames(font) {
	    var glyph;
	    var glyphIndexMap = font.tables.cmap.glyphIndexMap;
	    var charCodes = Object.keys(glyphIndexMap);

	    for (var i = 0; i < charCodes.length; i += 1) {
	        var c = charCodes[i];
	        var glyphIndex = glyphIndexMap[c];
	        glyph = font.glyphs.get(glyphIndex);
	        glyph.addUnicode(parseInt(c));
	    }

	    for (var i$1 = 0; i$1 < font.glyphs.length; i$1 += 1) {
	        glyph = font.glyphs.get(i$1);
	        if (font.cffEncoding) {
	            if (font.isCIDFont) {
	                glyph.name = 'gid' + i$1;
	            } else {
	                glyph.name = font.cffEncoding.charset[i$1];
	            }
	        } else if (font.glyphNames.names) {
	            glyph.name = font.glyphNames.glyphIndexToName(i$1);
	        }
	    }
	}

	// Drawing utility functions.

	// Draw a line on the given context from point `x1,y1` to point `x2,y2`.
	function line(ctx, x1, y1, x2, y2) {
	    ctx.beginPath();
	    ctx.moveTo(x1, y1);
	    ctx.lineTo(x2, y2);
	    ctx.stroke();
	}

	var draw = { line: line };

	// The Glyph object
	// import glyf from './tables/glyf' Can't be imported here, because it's a circular dependency

	function getPathDefinition(glyph, path) {
	    var _path = path || new Path();
	    return {
	        configurable: true,

	        get: function() {
	            if (typeof _path === 'function') {
	                _path = _path();
	            }

	            return _path;
	        },

	        set: function(p) {
	            _path = p;
	        }
	    };
	}
	/**
	 * @typedef GlyphOptions
	 * @type Object
	 * @property {string} [name] - The glyph name
	 * @property {number} [unicode]
	 * @property {Array} [unicodes]
	 * @property {number} [xMin]
	 * @property {number} [yMin]
	 * @property {number} [xMax]
	 * @property {number} [yMax]
	 * @property {number} [advanceWidth]
	 */

	// A Glyph is an individual mark that often corresponds to a character.
	// Some glyphs, such as ligatures, are a combination of many characters.
	// Glyphs are the basic building blocks of a font.
	//
	// The `Glyph` class contains utility methods for drawing the path and its points.
	/**
	 * @exports opentype.Glyph
	 * @class
	 * @param {GlyphOptions}
	 * @constructor
	 */
	function Glyph(options) {
	    // By putting all the code on a prototype function (which is only declared once)
	    // we reduce the memory requirements for larger fonts by some 2%
	    this.bindConstructorValues(options);
	}

	/**
	 * @param  {GlyphOptions}
	 */
	Glyph.prototype.bindConstructorValues = function(options) {
	    this.index = options.index || 0;

	    // These three values cannot be deferred for memory optimization:
	    this.name = options.name || null;
	    this.unicode = options.unicode || undefined;
	    this.unicodes = options.unicodes || options.unicode !== undefined ? [options.unicode] : [];

	    // But by binding these values only when necessary, we reduce can
	    // the memory requirements by almost 3% for larger fonts.
	    if (options.xMin) {
	        this.xMin = options.xMin;
	    }

	    if (options.yMin) {
	        this.yMin = options.yMin;
	    }

	    if (options.xMax) {
	        this.xMax = options.xMax;
	    }

	    if (options.yMax) {
	        this.yMax = options.yMax;
	    }

	    if (options.advanceWidth) {
	        this.advanceWidth = options.advanceWidth;
	    }

	    // The path for a glyph is the most memory intensive, and is bound as a value
	    // with a getter/setter to ensure we actually do path parsing only once the
	    // path is actually needed by anything.
	    Object.defineProperty(this, 'path', getPathDefinition(this, options.path));
	};

	/**
	 * @param {number}
	 */
	Glyph.prototype.addUnicode = function(unicode) {
	    if (this.unicodes.length === 0) {
	        this.unicode = unicode;
	    }

	    this.unicodes.push(unicode);
	};

	/**
	 * Calculate the minimum bounding box for this glyph.
	 * @return {opentype.BoundingBox}
	 */
	Glyph.prototype.getBoundingBox = function() {
	    return this.path.getBoundingBox();
	};

	/**
	 * Convert the glyph to a Path we can draw on a drawing context.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {Object=} options - xScale, yScale to stretch the glyph.
	 * @param  {opentype.Font} if hinting is to be used, the font
	 * @return {opentype.Path}
	 */
	Glyph.prototype.getPath = function(x, y, fontSize, options, font) {
	    x = x !== undefined ? x : 0;
	    y = y !== undefined ? y : 0;
	    fontSize = fontSize !== undefined ? fontSize : 72;
	    var commands;
	    var hPoints;
	    if (!options) { options = { }; }
	    var xScale = options.xScale;
	    var yScale = options.yScale;

	    if (options.hinting && font && font.hinting) {
	        // in case of hinting, the hinting engine takes care
	        // of scaling the points (not the path) before hinting.
	        hPoints = this.path && font.hinting.exec(this, fontSize);
	        // in case the hinting engine failed hPoints is undefined
	        // and thus reverts to plain rending
	    }

	    if (hPoints) {
	        // Call font.hinting.getCommands instead of `glyf.getPath(hPoints).commands` to avoid a circular dependency
	        commands = font.hinting.getCommands(hPoints);
	        x = Math.round(x);
	        y = Math.round(y);
	        // TODO in case of hinting xyScaling is not yet supported
	        xScale = yScale = 1;
	    } else {
	        commands = this.path.commands;
	        var scale = 1 / this.path.unitsPerEm * fontSize;
	        if (xScale === undefined) { xScale = scale; }
	        if (yScale === undefined) { yScale = scale; }
	    }

	    var p = new Path();
	    for (var i = 0; i < commands.length; i += 1) {
	        var cmd = commands[i];
	        if (cmd.type === 'M') {
	            p.moveTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'L') {
	            p.lineTo(x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'Q') {
	            p.quadraticCurveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
	                               x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'C') {
	            p.curveTo(x + (cmd.x1 * xScale), y + (-cmd.y1 * yScale),
	                      x + (cmd.x2 * xScale), y + (-cmd.y2 * yScale),
	                      x + (cmd.x * xScale), y + (-cmd.y * yScale));
	        } else if (cmd.type === 'Z') {
	            p.closePath();
	        }
	    }

	    return p;
	};

	/**
	 * Split the glyph into contours.
	 * This function is here for backwards compatibility, and to
	 * provide raw access to the TrueType glyph outlines.
	 * @return {Array}
	 */
	Glyph.prototype.getContours = function() {
	    var this$1 = this;

	    if (this.points === undefined) {
	        return [];
	    }

	    var contours = [];
	    var currentContour = [];
	    for (var i = 0; i < this.points.length; i += 1) {
	        var pt = this$1.points[i];
	        currentContour.push(pt);
	        if (pt.lastPointOfContour) {
	            contours.push(currentContour);
	            currentContour = [];
	        }
	    }

	    check.argument(currentContour.length === 0, 'There are still points left in the current contour.');
	    return contours;
	};

	/**
	 * Calculate the xMin/yMin/xMax/yMax/lsb/rsb for a Glyph.
	 * @return {Object}
	 */
	Glyph.prototype.getMetrics = function() {
	    var commands = this.path.commands;
	    var xCoords = [];
	    var yCoords = [];
	    for (var i = 0; i < commands.length; i += 1) {
	        var cmd = commands[i];
	        if (cmd.type !== 'Z') {
	            xCoords.push(cmd.x);
	            yCoords.push(cmd.y);
	        }

	        if (cmd.type === 'Q' || cmd.type === 'C') {
	            xCoords.push(cmd.x1);
	            yCoords.push(cmd.y1);
	        }

	        if (cmd.type === 'C') {
	            xCoords.push(cmd.x2);
	            yCoords.push(cmd.y2);
	        }
	    }

	    var metrics = {
	        xMin: Math.min.apply(null, xCoords),
	        yMin: Math.min.apply(null, yCoords),
	        xMax: Math.max.apply(null, xCoords),
	        yMax: Math.max.apply(null, yCoords),
	        leftSideBearing: this.leftSideBearing
	    };

	    if (!isFinite(metrics.xMin)) {
	        metrics.xMin = 0;
	    }

	    if (!isFinite(metrics.xMax)) {
	        metrics.xMax = this.advanceWidth;
	    }

	    if (!isFinite(metrics.yMin)) {
	        metrics.yMin = 0;
	    }

	    if (!isFinite(metrics.yMax)) {
	        metrics.yMax = 0;
	    }

	    metrics.rightSideBearing = this.advanceWidth - metrics.leftSideBearing - (metrics.xMax - metrics.xMin);
	    return metrics;
	};

	/**
	 * Draw the glyph on the given context.
	 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 * @param  {Object=} options - xScale, yScale to stretch the glyph.
	 */
	Glyph.prototype.draw = function(ctx, x, y, fontSize, options) {
	    this.getPath(x, y, fontSize, options).draw(ctx);
	};

	/**
	 * Draw the points of the glyph.
	 * On-curve points will be drawn in blue, off-curve points will be drawn in red.
	 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 */
	Glyph.prototype.drawPoints = function(ctx, x, y, fontSize) {
	    function drawCircles(l, x, y, scale) {
	        var PI_SQ = Math.PI * 2;
	        ctx.beginPath();
	        for (var j = 0; j < l.length; j += 1) {
	            ctx.moveTo(x + (l[j].x * scale), y + (l[j].y * scale));
	            ctx.arc(x + (l[j].x * scale), y + (l[j].y * scale), 2, 0, PI_SQ, false);
	        }

	        ctx.closePath();
	        ctx.fill();
	    }

	    x = x !== undefined ? x : 0;
	    y = y !== undefined ? y : 0;
	    fontSize = fontSize !== undefined ? fontSize : 24;
	    var scale = 1 / this.path.unitsPerEm * fontSize;

	    var blueCircles = [];
	    var redCircles = [];
	    var path = this.path;
	    for (var i = 0; i < path.commands.length; i += 1) {
	        var cmd = path.commands[i];
	        if (cmd.x !== undefined) {
	            blueCircles.push({x: cmd.x, y: -cmd.y});
	        }

	        if (cmd.x1 !== undefined) {
	            redCircles.push({x: cmd.x1, y: -cmd.y1});
	        }

	        if (cmd.x2 !== undefined) {
	            redCircles.push({x: cmd.x2, y: -cmd.y2});
	        }
	    }

	    ctx.fillStyle = 'blue';
	    drawCircles(blueCircles, x, y, scale);
	    ctx.fillStyle = 'red';
	    drawCircles(redCircles, x, y, scale);
	};

	/**
	 * Draw lines indicating important font measurements.
	 * Black lines indicate the origin of the coordinate system (point 0,0).
	 * Blue lines indicate the glyph bounding box.
	 * Green line indicates the advance width of the glyph.
	 * @param  {CanvasRenderingContext2D} ctx - A 2D drawing context, like Canvas.
	 * @param  {number} [x=0] - Horizontal position of the beginning of the text.
	 * @param  {number} [y=0] - Vertical position of the *baseline* of the text.
	 * @param  {number} [fontSize=72] - Font size in pixels. We scale the glyph units by `1 / unitsPerEm * fontSize`.
	 */
	Glyph.prototype.drawMetrics = function(ctx, x, y, fontSize) {
	    var scale;
	    x = x !== undefined ? x : 0;
	    y = y !== undefined ? y : 0;
	    fontSize = fontSize !== undefined ? fontSize : 24;
	    scale = 1 / this.path.unitsPerEm * fontSize;
	    ctx.lineWidth = 1;

	    // Draw the origin
	    ctx.strokeStyle = 'black';
	    draw.line(ctx, x, -10000, x, 10000);
	    draw.line(ctx, -10000, y, 10000, y);

	    // This code is here due to memory optimization: by not using
	    // defaults in the constructor, we save a notable amount of memory.
	    var xMin = this.xMin || 0;
	    var yMin = this.yMin || 0;
	    var xMax = this.xMax || 0;
	    var yMax = this.yMax || 0;
	    var advanceWidth = this.advanceWidth || 0;

	    // Draw the glyph box
	    ctx.strokeStyle = 'blue';
	    draw.line(ctx, x + (xMin * scale), -10000, x + (xMin * scale), 10000);
	    draw.line(ctx, x + (xMax * scale), -10000, x + (xMax * scale), 10000);
	    draw.line(ctx, -10000, y + (-yMin * scale), 10000, y + (-yMin * scale));
	    draw.line(ctx, -10000, y + (-yMax * scale), 10000, y + (-yMax * scale));

	    // Draw the advance width
	    ctx.strokeStyle = 'green';
	    draw.line(ctx, x + (advanceWidth * scale), -10000, x + (advanceWidth * scale), 10000);
	};

	// The GlyphSet object

	// Define a property on the glyph that depends on the path being loaded.
	function defineDependentProperty(glyph, externalName, internalName) {
	    Object.defineProperty(glyph, externalName, {
	        get: function() {
	            // Request the path property to make sure the path is loaded.
	            glyph.path; // jshint ignore:line
	            return glyph[internalName];
	        },
	        set: function(newValue) {
	            glyph[internalName] = newValue;
	        },
	        enumerable: true,
	        configurable: true
	    });
	}

	/**
	 * A GlyphSet represents all glyphs available in the font, but modelled using
	 * a deferred glyph loader, for retrieving glyphs only once they are absolutely
	 * necessary, to keep the memory footprint down.
	 * @exports opentype.GlyphSet
	 * @class
	 * @param {opentype.Font}
	 * @param {Array}
	 */
	function GlyphSet(font, glyphs) {
	    var this$1 = this;

	    this.font = font;
	    this.glyphs = {};
	    if (Array.isArray(glyphs)) {
	        for (var i = 0; i < glyphs.length; i++) {
	            this$1.glyphs[i] = glyphs[i];
	        }
	    }

	    this.length = (glyphs && glyphs.length) || 0;
	}

	/**
	 * @param  {number} index
	 * @return {opentype.Glyph}
	 */
	GlyphSet.prototype.get = function(index) {
	    if (typeof this.glyphs[index] === 'function') {
	        this.glyphs[index] = this.glyphs[index]();
	    }

	    return this.glyphs[index];
	};

	/**
	 * @param  {number} index
	 * @param  {Object}
	 */
	GlyphSet.prototype.push = function(index, loader) {
	    this.glyphs[index] = loader;
	    this.length++;
	};

	/**
	 * @alias opentype.glyphLoader
	 * @param  {opentype.Font} font
	 * @param  {number} index
	 * @return {opentype.Glyph}
	 */
	function glyphLoader(font, index) {
	    return new Glyph({index: index, font: font});
	}

	/**
	 * Generate a stub glyph that can be filled with all metadata *except*
	 * the "points" and "path" properties, which must be loaded only once
	 * the glyph's path is actually requested for text shaping.
	 * @alias opentype.ttfGlyphLoader
	 * @param  {opentype.Font} font
	 * @param  {number} index
	 * @param  {Function} parseGlyph
	 * @param  {Objec.           ���tMtM  ��tM     ..          ���tMtM ��tM     AB o m b e  �r m a n   ��  ����BOMBER~1    d�ItMtM  �ItM9                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     