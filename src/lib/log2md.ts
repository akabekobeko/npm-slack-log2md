import fs from 'fs'
import path from 'path'
import util from 'util'
import parseChannel, { Channel } from './channel'
import parseUser, { User } from './user'
import parseMessage, { Message } from './message'
import messagesToMarkdown, { MarkdownOptions } from './markdown'
import Logger from './logger'
import { tsToDate, formatDate } from './metadata'

const readFileAsync = util.promisify(fs.readFile)
const readdirAsync = util.promisify(fs.readdir)
const writeFileASync = util.promisify(fs.writeFile)
const statAsync = util.promisify(fs.stat)
const mkdirAsync = util.promisify(fs.mkdir)

/** Message types to ignore. */
export type IgnoreMessage = {
  /** `true` to ignore the channel login message. */
  channelLogin: boolean
}

/** Options of slack-log2md. */
export type Log2MdOptions = {
  /** `true` to display the processing status of the tool to `stdout`. */
  report: boolean

  /**
   * `true` if messages in the channel are grouped by the same day in UTC.
   * If `false`, the group is the output log file unit.
   */
  groupingSameDayByUTC: boolean

  /**
   * Support output for GitHub Wiki.
   * Single directory, all file names are unique, avoid conflicts with existing page names.
   * e.g. `general/2019-11-16.md` -> `slack-general-2019-11-16.md`
   */
  githubWiki: boolean

  /** Add unique identifier for a message. Set the time in the Time field to `<span id ="XXXX">21:34</span>`. */
  addUniqueMessageId: boolean

  /** Specifies the type of message to ignore. */
  ignore: IgnoreMessage
}

/**
 * Enumerate the directory that becomes the channel.
 * @param rootDir Path of the workspace root directory.
 * @returns Collection of the directory paths.
 */
const enumChannelDirs = async (rootDir: string): Promise<string[]> => {
  const items = await readdirAsync(rootDir)
  const results: string[] = []

  for (const item of items) {
    const dir = path.join(rootDir, item)
    const stat = await statAsync(dir)
    if (stat.isDirectory()) {
      results.push(dir)
    }
  }

  return results
}

/**
 * Enumerates the path of the JSON file that is the channel log.
 * @param dir Path of the channel directory.
 * @returns Collection of the JSON file paths.
 */
const enumMessageJSON = async (dir: string): Promise<string[]> => {
  const items = await readdirAsync(dir)
  const results: string[] = []

  for (const item of items) {
    if (!item.endsWith('.json')) {
      continue
    }

    const filePath = path.join(dir, item)
    const stat = await statAsync(filePath)
    if (stat.isDirectory()) {
      continue
    }

    results.push(filePath)
  }

  return results
}

/**
 * Read array from JSON file.
 * @param filePath Path of JSON file.
 * @returns Array.
 */
const readArrayFromJSON = async (filePath: string): Promise<any[]> => {
  if (!fs.existsSync(filePath)) {
    throw new Error(`File does not exist. "${filePath}"`)
  }

  const values = JSON.parse(await readFileAsync(filePath, 'utf8'))
  if (!Array.isArray(values)) {
    throw new Error('Data is not an array.')
  }

  return values
}

/**
 * Read channel information from JSON file.
 * @param dir Path of JSON directory.
 * @returns Dictionary (id/channel) of the channels.
 */
export const readChannels = async (
  dir: string
): Promise<Map<string, Channel>> => {
  const values = await readArrayFromJSON(path.join(dir, 'channels.json'))
  const channels = new Map<string, Channel>()

  for (const value of values) {
    const channel = parseChannel(value)
    channels.set(channel.id, channel)
  }

  return channels
}

/**
 * Read user information from JSON file.
 * @param dir Path of JSON directory.
 * @returns Dictionary (id/user) of the users.
 */
export const readUsers = async (dir: string): Promise<Map<string, User>> => {
  const values = await readArrayFromJSON(path.join(dir, 'users.json'))
  const users = new Map<string, User>()

  for (const value of values) {
    const user = parseUser(value)
    users.set(user.id, user)
  }

  return users
}

/**
 * Read messages from JSON file.
 * @param dir Path of JSON file.
 * @returns Messages.
 */
export const readMessages = async (filePath: string): Promise<Message[]> => {
  const values = await readArrayFromJSON(filePath)
  const messages: Message[] = []
  for (const value of values) {
    messages.push(await parseMessage(value))
  }

  return messages
}

/**
 * Check if the message should be ignored.
 * @param message Message.
 * @param ignore Message types of ignore.
 * @returns `true` if it should be ignored.
 */
const isIgnore = (message: Message, ignore: IgnoreMessage): boolean => {
  if (ignore.channelLogin) {
    return message.subtype === 'channel_join'
  }

  return false
}

/**
 * Create the log file name.
 * @param channelName Channel name.
 * @param logName log name.
 * @param githubWiki Support the GitHub Wiki.
 * @returns Log file name.
 */
const createLogFileName = (
  channelName: string,
  logName: string,
  githubWiki: boolean
) => {
  return githubWiki ? `slack-${channelName}-${logName}` : logName
}

/**
 * Convert messages in the channel to Markdown by same day (UTC).
 * @param src Path of the channel directory.
 * @param dest Path of the output directory.
 * @param channelName Channel name.
 * @param channels Dictionary (id/channel) of the channels.
 * @param users Dictionary (id/user) of the users.
 * @param options Options.
 */
const convertChannelMessagesSameDay = async (
  src: string,
  dest: string,
  channelName: string,
  channels: Map<string, Channel>,
  users: Map<string, User>,
  options: Log2MdOptions
) => {
  // Create a sub directory for each channel
  if (!fs.existsSync(dest)) {
    await mkdirAsync(dest)
  }

  // Group messages in a channel on the same day (UTC).
  const filePaths = await enumMessageJSON(src)
  const logs = new Map<string, Message[]>()
  for (const filePath of filePaths) {
    const messages = await readMessages(filePath)
    for (const message of messages) {
      if (isIgnore(message, options.ignore)) {
        continue
      }

      const date = formatDate(tsToDate(message.timeStamp), 'YYYY-MM-DD', true)
      const targets = logs.get(date)
      if (targets) {
        targets.push(message)
      } else {
        logs.set(date, [message])
      }
    }
  }

  // Output markdown
  let logNames: string[][] = []
  const opts: MarkdownOptions = {
    addUniqueMessageId: options.addUniqueMessageId
  }
  for (const logName of logs.keys()) {
    const messages = logs.get(logName)!
    const table = messagesToMarkdown(messages, channels, users, opts)
    const markdown = `# ${logName}\n\n${table}`
    const logFileName = createLogFileName(
      channelName,
      logName,
      options.githubWiki!
    )
    const destFilePath = path.join(dest, `${logFileName}.md`)
    await writeFileASync(destFilePath, markdown)

    // e.g. `['2019-11-16', 'slack-channel-2019-11-16']`
    logNames.push([logName, logFileName])
  }

  // Output index (Descending of date)
  let indexMd = ''
  logNames = logNames.sort((a, b) => (a === b ? 0 : a < b ? 1 : -1))
  for (const logName of logNames) {
    if (options.githubWiki) {
      indexMd += `- [[${logName[0]}|${logName[1]}]]\n`
    } else {
      indexMd += `- [${logName[0]}](${logName[0]}.md)\n`
    }
  }

  if (indexMd !== '') {
    const fileName = options.githubWiki ? `slack-${channelName}.md` : 'index.md'
    const destFilePath = path.join(dest, fileName)
    await writeFileASync(destFilePath, `# ${path.basename(src)}\n\n${indexMd}`)
  }
}

/**
 * Convert messages in the channel to Markdown.
 * @param src Path of the channel directory.
 * @param dest Path of the output directory.
 * @param channelName Channel name.
 * @param channels Dictionary (id/channel) of the channels.
 * @param users Dictionary (id/user) of the users.
 * @param options Options.
 */
const convertChannelMessages = async (
  src: string,
  dest: string,
  channelName: string,
  channels: Map<string, Channel>,
  users: Map<string, User>,
  options: Log2MdOptions
) => {
  // Create a sub directory for each channel
  if (!fs.existsSync(dest)) {
    await mkdirAsync(dest)
  }

  // Sort in descending order for index page, log conversion does not depend on the order
  const filePaths = (await enumMessageJSON(src)).sort((a, b) =>
    a === b ? 0 : a < b ? 1 : -1
  )

  let indexMd = ''
  const opts: MarkdownOptions = {
    addUniqueMessageId: options.addUniqueMessageId
  }
  for (const filePath of filePaths) {
    const messages = (await readMessages(filePath)).filter(
      (message) => !isIgnore(message, options.ignore)
    )
    if (messages.length === 0) {
      continue
    }

    const table = messagesToMarkdown(messages, channels, users, opts)
    const logName = path.basename(filePath, '.json')
    const markdown = `# ${logName}\n\n${table}`
    const logFileName = createLogFileName(
      channelName,
      logName,
      options.githubWiki!
    )
    const destFilePath = path.join(dest, `${logFileName}.md`)
    await writeFileASync(destFilePath, markdown)

    if (options.githubWiki) {
      indexMd += `- [[${logName}|${logFileName}]]\n`
    } else {
      indexMd += `- [${logName}](${logName}.md)\n`
    }
  }

  // Index page
  if (indexMd !== '') {
    const fileName = options.githubWiki ? `slack-${channelName}.md` : 'index.md'
    const destFilePath = path.join(dest, fileName)
    await writeFileASync(destFilePath, `# ${path.basename(src)}\n\n${indexMd}`)
  }
}

/**
 * Converts Slack log JSON in the specified workspace directory to Markdown.
 * @param inputDir Directory path of the JSON file exported from Slack.
 * @param outputDir Directory path to output Markdown file converted from JSON.
 * @param options Options.
 */
const log2Md = async (
  inputDir: string,
  outputDir: string,
  options: Log2MdOptions
): Promise<void> => {
  const logger = new Logger(!!options.report)
  logger.log(`src: "${inputDir}"`)
  logger.log(`dest: "${outputDir}"`)
  logger.log('Converted channels...')

  const channels = await readChannels(inputDir)
  const users = await readUsers(inputDir)
  const channelDirs = await enumChannelDirs(inputDir)

  for (const src of channelDirs) {
    const channel = path.basename(src)
    logger.log(`  #${channel}`)

    const dest = options.githubWiki ? outputDir : path.join(outputDir, channel)
    if (options.groupingSameDayByUTC) {
      await convertChannelMessagesSameDay(
        src,
        dest,
        channel,
        channels,
        users,
        options
      )
    } else {
      await convertChannelMessages(src, dest, channel, channels, users, options)
    }
  }

  logger.log('Completed!!')
}

export default log2Md
