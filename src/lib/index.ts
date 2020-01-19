import fs from 'fs'
import util from 'util'
import log2md, { Log2MdOptions, IgnoreMessage } from './log2md'

/** Options of slack-log2md. */
export type Options = {
  /** `true` to display the processing status of the tool to `stdout`. */
  report?: boolean

  /**
   * `true` if messages in the channel are grouped by the same day in UTC.
   * If `false`, the group is the output log file unit.
   */
  groupingSameDayByUTC?: boolean

  /**
   * Support output for GitHub Wiki.
   * Single directory, all file names are unique, avoid conflicts with existing page names.
   * e.g. `general/2019-11-16.md` -> `slack-general-2019-11-16.md`
   */
  githubWiki?: boolean

  /** Add unique identifier for a message. Set the time in the Time field to `<span id ="XXXX">21:34</span>`. */
  addUniqueMessageId?: boolean

  /** Specifies the type of message to ignore. */
  ignore?: IgnoreMessage
}

/**
 * Check options.
 * @param options Original data.
 * @returns Checked data.
 */
const checkOptions = (options: Options): Log2MdOptions => {
  const ignore = options.ignore
    ? { channelLogin: !!options.ignore.channelLogin }
    : { channelLogin: false }

  return {
    report: !!options.report,
    groupingSameDayByUTC: !!options.groupingSameDayByUTC,
    githubWiki: !!options.githubWiki,
    addUniqueMessageId: !!options.addUniqueMessageId,
    ignore
  }
}

/**
 * Converts Slack log JSON in the specified workspace directory to Markdown.
 * @param src Directory path of the JSON file exported from Slack.
 * @param dest Directory path to output Markdown file converted from JSON.
 * @param options Options.
 */
const slackLog2Md = async (
  src: string,
  dest: string,
  options: Options = {}
): Promise<void> => {
  if (!fs.existsSync(src)) {
    throw new Error(`Log directory does not exist. "${src}"`)
  }

  // If the output destination does not exist and cannot be created, set it to `src`
  if (!fs.existsSync(dest)) {
    const mkdirAsync = util.promisify(fs.mkdir)
    try {
      await mkdirAsync(dest)
    } catch (err) {
      dest = src
    }
  }

  const opts = checkOptions(options)
  return log2md(src, dest, opts)
}

export default slackLog2Md
module.exports = slackLog2Md
