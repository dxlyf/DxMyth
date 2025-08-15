export default Base64ToArrayBuffer;
/**
 * Converts a base64 string, either with or without a data uri, into an Array Buffer.
 *
 * @function Phaser.Utils.Base64.Base64ToArrayBuffer
 * @since 3.18.0
 *
 * @param {string} base64 - The base64 string to be decoded. Can optionally contain a data URI header, which will be stripped out prior to decoding.
 *
 * @return {ArrayBuffer} An ArrayBuffer decoded from the base64 data.
 */
declare function Base64ToArrayBuffer(base64: string): ArrayBuffer;
