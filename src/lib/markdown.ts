import { Message } from './message'
import { Channel } from './channel'
import { User } from './user'
import getMetadata, { getNameFromUser } from './metadata'
import emoji from './emoji'

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
      const name = getNameFromUser(user)
      if (name) {
        return `\`@${name}\``
      }
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

  // Emoji `:flag-gb:`
  body = body.replace(/\:["']?([a-zA-Z0-9_\-]+)["']?\:/g, (match) => {
    // On Slack `-` but the short name is` _`, e.g. `:flag-gb:` -> `:flag_gb:`
    const str = match.replace('-', '_')
    return emoji.shortnameToUnicode(str)
  })

  // Line break
  body = body.replace(/\n/g, '<br>')

  return body
}

/**
 * Convert the messages to markdown text.
 * Messages are output as a `<table>`. Because <table> is easier to handle than `<ul>`.
 * e.g. `|18:42|![](https://example.com/test/72.png)|User Name|Message|\n ...`
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
    const { time, imageURL, username } = getMetadata(message, users)
    const image = imageURL === '' ? '' : `![](${imageURL})`
    const body = createBody(message, channels, users)
    md += `|${time}|${image}|${username}|${body}|\n`
  }

  return md
}

export default messagesToMarkdown
