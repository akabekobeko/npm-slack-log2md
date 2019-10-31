import fs from 'fs'
import path from 'path'
import util from 'util'
import parseChannel, { Channel } from './channel'
import parseUser, { User } from './user'
import parseMessage, { Message } from './message'
import messagesToMarkdown from './markdown'
import Logger from './logger'

const readFileAsync = util.promisify(fs.readFile)
const readdirAsync = util.promisify(fs.readdir)
const writeFileASync = util.promisify(fs.writeFile)
const statAsync = util.promisify(fs.stat)
const mkdirAsync = util.promisify(fs.mkdir)

/** Options of slack-log2md. */
export type Options = {
  /** Directory path of the JSON file exported from Slack. */
  input: string
  /**
   * Directory path to output Markdown file converted from JSON.
   * If a nonexistent directory is specified, the same location as `input` is selected.
   */
  output: string
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
const enumMessageJSONs = async (dir: string): Promise<string[]> => {
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
 * Read channel informations from JSON file.
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
 * Read user informations from JSON file.
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
 * Convert messages in the channel to Markdown.
 * @param src Path of the channel directory.
 * @param dest Path of the output directory.
 * @param channels Dictionary (id/cnannel) of the channels.
 * @param users Dictionary (id/user) of the users.
 */
const convertChannelMessages = async (
  src: string,
  dest: string,
  channels: Map<string, Channel>,
  users: Map<string, User>
) => {
  // Create a sub directory for each channel
  if (!fs.existsSync(dest)) {
    await mkdirAsync(dest)
  }

  const filePaths = await enumMessageJSONs(src)
  for (const filePath of filePaths) {
    const messages = await readMessages(filePath)
    const logName = path.basename(filePath, '.json')
    const body = messagesToMarkdown(messages, channels, users)
    const markdown = `# ${logName}\n\n|Time|Icon|Name|Message|\n|---|---|---|---|\n${body}`
    const destFilePath = path.join(dest, `${logName}.md`)
    await writeFileASync(destFilePath, markdown)
  }
}

/**
 * Converts Slack log JSON in the specified workspace directory to Markdown.
 * @param inputDir Directory path of the JSON file exported from Slack.
 * @param outputDir Directory path to output Markdown file converted from JSON.
 * @param report Display the process reports, default is disable.
 */
const log2Md = async (
  inputDir: string,
  outputDir: string,
  report: boolean = false
): Promise<void> => {
  const logger = new Logger(report)
  logger.log(`src: "${inputDir}"`)
  logger.log(`dest: "${outputDir}"`)
  logger.log('Converted channels...')

  const channels = await readChannels(inputDir)
  const users = await readUsers(inputDir)
  const channelDirs = await enumChannelDirs(inputDir)

  for (const src of channelDirs) {
    const channel = path.basename(src)
    logger.log(`  #${channel}`)
    const dest = path.join(outputDir, channel)
    await convertChannelMessages(src, dest, channels, users)
  }

  logger.log('Completed!!')
}

export default log2Md
