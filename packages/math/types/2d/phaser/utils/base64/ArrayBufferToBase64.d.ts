export default ArrayBufferToBase64;
/**
 * Converts an ArrayBuffer into a base64 string.
 *
 * The resulting string can optionally be a data uri if the `mediaType` argument is provided.
 *
 * See https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs for more details.
 *
 * @function Phaser.Utils.Base64.ArrayBufferToBase64
 * @since 3.18.0
 *
 * @param {ArrayBuffer} arrayBuffer - The Array Buffer to encode.
 * @param {string} [mediaType] - An optional media type, i.e. `audio/ogg` or `image/jpeg`. If included the resulting string will be a data URI.
 *
 * @return {string} The base64 encoded Array Buffer.
 */
declare function ArrayBufferToBase64(arrayBuffer: ArrayBuffer, mediaType?: string): string;
