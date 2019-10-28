import fs from 'fs'
import path from 'path'
import util from 'util'
import parseChannel, { Channel } from './channel'
import parseUser, { User } from './user'
import parseMessage, { Message } from './message'
import messagesToMarkdown from './markdown'

const readFileAsync = util.promisify(fs.readFile)
const readdirAsync = util.promisify(fs.readdir)
const writeFileASync = util.promisify(fs.writeFile)
const statAsync = util.promisify(fs.stat)

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
    throw new Error('File does not exist.')
  }

  const values = JSON.parse(await readFileAsync(filePath, 'utf8'))
  if (!Array.isArray(values)) {
    throw new Error('The data is not an array.')
  }

  return values
}

/**
 * Read channel informations from JSON file.
 * @param dir Path of JSON directory.
 * @returns Dictionary (id/channel) of the channels.
 */
const readChannels = async (dir: string): Promise<Map<string, Channel>> => {
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
const readUsers = async (dir: string): Promise<Map<string, User>> => {
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
const readMessages = async (filePath: string): Promise<Message[]> => {
  const values = await readArrayFromJSON(filePath)
  const messages: Message[] = []
  for (const value of values) {
    messages.push(await parseMessage(value))
  }

  return messages
}

/**
 * Check options.
 * @param options Original data.
 * @returns Checked data.
 * @throws The directory specified in `input` does not exist
 */
const checkOptions = (options: Options) => {
  // Make a copy because the argument is not rewritten
  const opts = options

  if (!fs.existsSync(opts.input)) {
    throw new Error(`Workspace directory does not exist. "${opts.input}"`)
  }

  if (!fs.existsSync(opts.output)) {
    opts.output = opts.input
  }

  return opts
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
  const filePaths = await enumMessageJSONs(src)
  for (const filePath of filePaths) {
    const messages = await readMessages(filePath)
    const markdown = messagesToMarkdown(messages, channels, users)
    const destFilePath = path.join(
      dest,
      `${path.basename(filePath, '.json')}.md`
    )
    await writeFileASync(destFilePath, markdown)
  }
}

/**
 * Converts Slack log JSON in the specified workspace directory to Markdown.
 * @param options Options.
 */
const convert = async (options: Options): Promise<void> => {
  const opts = checkOptions(options)
  const channels = await readChannels(opts.input)
  const users = await readUsers(opts.input)
  const channelDirs = await enumChannelDirs(opts.input)

  for (const src of channelDirs) {
    const dest = path.join(opts.output, path.basename(src))
    await convertChannelMessages(src, dest, channels, users)
  }
}

export default convert
module.exports = convert
