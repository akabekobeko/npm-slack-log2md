/**
 * emoji-toolkit (https://github.com/joypixels/emoji-toolkit) API.
 * @see https://github.com/joypixels/emoji-toolkit/blob/master/examples/JAVASCRIPT.md
 */
export type Emoji = {
  /**
   * Convert Shortnames to Images.
   * @param str Shortnames. e.g. `:flag_gb:`, `:smile:`, ...etc
   * @returns `<image>` tag. e.g. `<img class="joypixels" alt="🇬🇧" title=":flag_gb:" src="https://cdn.jsdelivr.net/joypixels/assets/5.0/png/unicode/32/1f1ec-1f1e7.png"/>`
   */
  shortnameToImage: (str: string) => string
  /**
   * Convert Native Unicode Emoji and Shortnames Directly to Images.
   * @param str Native Unicode Emoji and Shortnames.
   * @returns `<image>` tag. e.g. `<img class="joypixels" alt="🇬🇧" title=":flag_gb:" src="https://cdn.jsdelivr.net/joypixels/assets/5.0/png/unicode/32/1f1ec-1f1e7.png"/>`
   */
  toImage: (str: string) => string
  /**
   * Convert Native Unicode Emoji to Shortnames.
   * @param str Native Unicode Emoji.
   * @returns Shortnames. e.g. `:flag_gb:`, `:smile:`, ...etc
   */
  toShort: (str: string) => string
  /**
   * Convert Shortnames to Native Unicode.
   * @param str Shortnames. e.g. `:flag_gb:`, `:smile:`, ...etc
   * @returns Native Unicode. e.g. `🇬🇧`
   */
  shortnameToUnicode: (str: string) => string
}

const emoji = require('emoji-toolkit') as Emoji
export default emoji
