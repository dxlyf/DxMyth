export default UUID;
/**
 * @author       Richard Davey <rich@phaser.io>
 * @copyright    2013-2025 Phaser Studio Inc.
 * @license      {@link https://opensource.org/licenses/MIT|MIT License}
 */
/**
 * Creates and returns an RFC4122 version 4 compliant UUID.
 *
 * The string is in the form: `xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx` where each `x` is replaced with a random
 * hexadecimal digit from 0 to f, and `y` is replaced with a random hexadecimal digit from 8 to b.
 *
 * @function Phaser.Utils.String.UUID
 * @since 3.12.0
 *
 * @return {string} The UUID string.
 */
declare function UUID(): string;
