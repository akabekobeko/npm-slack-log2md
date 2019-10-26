import fs from 'fs'
import path from 'path'
import util from 'util'
import parseChannel, { Channel } from './channel'
import parseUser, { User } from './user'

/** Options of slack-log2md. */
export type Options = {
  /** Directory path of the JSON file exported from Slack. */
  input: string
  /** Directory path to output Markdown file converted from JSON. */
  output: string
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

  const readFileAsync = util.promisify(fs.readFile)
  const values = JSON.parse(await readFileAsync(filePath, 'utf8'))

  if (!Array.isArray(values)) {
    throw new Error('The data is not an array.')
  }

  return values
}

/**
 * Enumerate channel information from JSON file.
 * @param dir Path of JSON directory.
 * @returns Map of the channel information.
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
 * Enumerate user information from JSON file.
 * @param dir Path of JSON directory.
 * @returns Map of the user information.
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
 *
 * @param options Options.
 */
const convert = async (options: Options) => {
  const channels = await readChannels(options.input)
  const users = await readUsers(options.input)
}

export default convert
module.exports = convert
