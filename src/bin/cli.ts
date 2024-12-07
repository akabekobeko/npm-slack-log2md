import { Command } from 'commander'
import slackLog2Md, { Options } from '../lib/index'

/**
 * Parse the arguments of command line interface.
 * @param argv Arguments of command line interface.
 * @returns Parsed options.
 */
export const parseArgv = (argv: string[]) => {
  const program = new Command()
  program
    .usage('slack-log2md [options]')
    .description('Slack log file (JSON) to Markdown file.')
    .option(
      '-i, --input <Path>',
      'Directory path of the JSON file exported from Slack.'
    )
    .option(
      '-o, --output <Path>',
      'Directory path to output Markdown file converted from JSON.'
    )
    .option('-r, --report', 'Display the process reports, default is disable.')
    .option(
      '--grouping-same-day-by-utc',
      'Output Markdown grouped on the same day as UTC date.'
    )
    .option(
      '--github-wiki',
      'Support output for GitHub Wiki. e.g. `general/2019-11-16.md` -> `slack-general-2019-11-16.md`'
    )
    .option(
      '--add-unique-message-id',
      'Add unique identifier for a message. Set the time in the Time field to `<span id ="XXXX">21:34</span>`.'
    )
    .option('--ignore-channel-login', 'Ignore channel login messages.')
    .version(require('../../package.json').version, '-v, --version')

  program.on('--help', () => {
    console.log(`
Examples:
  $ slack-log2md -i ./logs -o ./dist -r

See also:
  https://github.com/akabekobeko/npm-slack-log2md`)
  })

  // Print help and exit if there are no arguments
  if (argv.length < 3) {
    program.help()
  }

  program.parse(argv)
  const opts = program.opts()

  return {
    input: opts.input,
    output: opts.output,
    report: opts.report,
    groupingSameDayByUTC: !!opts.groupingSameDayByUtc,
    githubWiki: !!opts.githubWiki,
    addUniqueMessageId: !!opts.addUniqueMessageId,
    ignore: {
      channelLogin: opts.ignoreChannelLogin,
    },
  }
}

/**
 * Run the tool based on command line arguments.
 * @param argv Arguments of command line interface.
 * @returns Path of generated files.
 */
const exec = (argv: string[]): Promise<void> => {
  const options = parseArgv(argv)
  return slackLog2Md(options.input, options.output, options)
}

export default exec
