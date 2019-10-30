import fs from 'fs'
import util from 'util'
import log2md from './log2md'

/** Options of slack-log2md. */
export type Options = {
  /** Directory path of the JSON file exported from Slack. */
  input: string
  /**
   * Directory path to output Markdown file converted from JSON.
   * If a nonexistent directory is specified, the same location as `input` is selected.
   */
  output: string

  /** `true` to display the processing status of the tool to `stdout`. */
  report: boolean
}

/**
 * Check options.
 * @param options Original data.
 * @returns Checked data.
 * @throws The directory specified in `input` does not exist
 */
const checkOptions = async (options: Options) => {
  // Make a copy because the argument is not rewritten
  const opts = options

  if (!fs.existsSync(opts.input)) {
    throw new Error(`Log directory does not exist. "${opts.input}"`)
  }

  // If the output destination does not exist and cannot be created, set it to `input`
  if (!fs.existsSync(opts.output)) {
    const mkdirAsync = util.promisify(fs.mkdir)
    try {
      await mkdirAsync(opts.output)
    } catch (err) {
      opts.output = opts.input
    }
  }

  return opts
}

/**
 * Converts Slack log JSON in the specified workspace directory to Markdown.
 * @param options Options.
 */
const slackLog2Md = async (options: Options): Promise<void> => {
  const opts = await checkOptions(options)
  return log2md(opts.input, opts.output, opts.report)
}

export default slackLog2Md
module.exports = slackLog2Md
