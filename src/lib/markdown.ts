import { Message } from './message'
import { Channel } from './channel'
import { User } from './user'

/**
 * Slack taimestamp (`ts` series) is converted to `Date` by JavaScript.
 * @param ts Slack taimestamp (`ts` series).
 * @returns `Date` by JavaScript.
 */
const tsToDate = (ts: string): Date => {
  return new Date(Number(ts) * 1000)
}

/**
 * Get the user name.
 * @param user User.
 * @returns If the display name exists, do it. Otherwise, account name.
 */
const getMessageUserName = (user: User) => {
  if (user.profile.displayName !== '') {
    // Decode multibyte characters because they are URL encoded
    return decodeURI(user.profile.displayName)
  }

  return user.name
}

/**
 * Create the header markdown.
 * @param message Message.
 * @param users Users.
 * @returns Header markdown.
 * @throws There is no user information.
 */
const createHeader = (message: Message, users: Map<string, User>): string => {
  const datetime = tsToDate(message.timeStamp)

  if (message.userProfile) {
    const profile = message.userProfile
    return `[${profile.displayName}](${profile.image72}) **${profile.displayName}** ${datetime}  \n`
  }

  const user = users.get(message.user)
  if (user) {
    const profile = user.profile
    return `[${profile.displayName}](${profile.image72}) **${profile.displayName}** ${datetime}  \n`
  }

  if (message.username) {
    return `**${message.username}** ${datetime}  \n`
  }

  throw new Error('There is no user information.')
}

/**
 * Create the markdown.of the message body.
 * @param message Message.
 * @param users Users.
 * @returns Header markdown.
 * @throws There is no user information.
 */
const createBody = (
  message: Message,
  channels: Map<string, Channel>,
  users: Map<string, User>
): string => {
  let body = message.text

  // Replace `<@USERID>` to `@user`
  body = body.replace(/<@(.*?)>/g, (_, $1) => {
    const user = users.get($1)
    if (user) {
      return `\`@${getMessageUserName(user)}\``
    }

    return `\`@${$1}\``
  })

  // Replace `<#CHANNELID>` to `@channel`
  body = body.replace(/<#(.*?)>/g, (_, $1) => {
    const channel = channels.get($1)
    if (channel) {
      return `\`#${channel.name}\``
    }

    return `\`@${$1}\``
  })

  return body
}

/**
 * Convert the messages to markdown text.
 * @param messages Messages
 * @param channels Channels
 * @param users Users
 * @returns Markdown text.
 */
const messagesToMarkdown = (
  messages: Message[],
  channels: Map<string, Channel>,
  users: Map<string, User>
): string => {
  let md = ''
  for (const message of messages) {
    md += `- ${createHeader(message, users)}${createBody(
      message,
      channels,
      users
    )}\n`
  }

  return md
}

export default messagesToMarkdown
