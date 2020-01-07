import { Message, File, Attachement } from './message'
import { Channel } from './channel'
import { User } from './user'
import getMetadata, { getNameFromUser, unescapeStr } from './metadata'
import emoji from './emoji'

/**
 * Replace `<@USERID>` in text to `@ user`.
 * @param text Text.
 * @param users Users.
 * @returns Replaced text.
 */
const replaceUserId = (text: string, users: Map<string, User>): string => {
  return text.replace(/<@(.*?)>/g, (_, $1) => {
    const user = users.get($1)
    if (user) {
      const name = getNameFromUser(user)
      if (name) {
        return `\`@${name}\``
      }
    }

    return `\`@${$1}\``
  })
}

/**
 * Replace `<#CHANNELID|Name>` in text to `#channel`.
 * @param text Text.
 * @param channels Channels.
 * @returns Replaced text.
 */
const replaceChannelId = (
  text: string,
  channels: Map<string, Channel>
): string => {
  return text.replace(/\<#(.*?)\|(.*?)\>/g, (_, $1, $2) => {
    const channel = channels.get($1)
    if (channel) {
      return `\`#${channel.name}\``
    }

    return `\`#${$2}\``
  })
}

/**
 * Replace Emoji to Unicode char. e.g. `:flag-gb:` -> `🇬🇧`.
 * @param text Text.
 * @returns Replaced text.
 */
const replaceEmoji = (text: string): string => {
  return text.replace(/\:["']?([a-zA-Z0-9_\-]+)["']?\:/g, (match) => {
    // On Slack `-` but the short name is` _`, e.g. `:flag-gb:` -> `:flag_gb:`
    const str = match.replace('-', '_')
    return emoji.shortnameToUnicode(str)
  })
}

/**
 * Replace `&gt; Text` to `<blockquote>Text</blockquote>`.
 * Slack quotes are written with `>`. But in JSON this is escaped to become a character reference `&gt;`.
 * @param text Text.
 * @returns Replaced text.
 */
const replaceBlockquote = (text: string): string => {
  return text.replace(/(^&gt; ?[^\n]+\n*)+/gm, (match) => {
    const str = match.replace(/\n$/gm, '').replace(/^&gt; ?/gm, '')
    return `<blockquote>${str}</blockquote>`
  })
}

/**
 * Replace GFM code block to `<pre>Code</pre>`.
 * @param text Text.
 * @returns Replaced text.
 */
const replacePre = (text: string): string => {
  return text.replace(/```[a-z]*\n[\s\S]*?\n```/gm, (match) => {
    const code = match.replace(/```\n|\n```|```/gm, '')
    return `<pre>${code}</pre>`
  })
}

/**
 * Replace `\n` to `<br>`.
 * @param text Text.
 * @returns Replaced text.
 */
const replaceLineBreak = (text: string): string => {
  return text.replace(/\n/g, '<br>')
}

/**
 * Replace any data for the message body text.
 * @param text Text.
 * @param channels Channels.
 * @param users Users.
 * @returns Replaced text.
 */
const replaceBody = (
  text: string,
  channels: Map<string, Channel>,
  users: Map<string, User>
): string => {
  text = replaceUserId(text, users)
  text = replaceChannelId(text, channels)
  text = replaceEmoji(text)
  text = replaceBlockquote(text)
  text = replacePre(text)
  text = replaceLineBreak(text)

  return text
}

/**
 * Create the markdown of file links.
 * @param files An attached files for message.
 * @returns Markdown text. Empty string if file does not exist.
 */
const createFileLinks = (files: File[]): string => {
  if (files.length === 0) {
    return ''
  }

  let links = `${unescapeStr(files[0].permalink)}`
  for (let i = 1; i < files.length; ++i) {
    links += `<br>${unescapeStr(files[i].permalink)}`
  }

  return links
}

const createAttachementValue = (
  attachement: Attachement,
  channels: Map<string, Channel>,
  users: Map<string, User>
): string => {
  let text = attachement.pretext
  if (attachement.text) {
    // `text` is markdown
    text += `<blockquote>${replaceBody(
      attachement.text,
      channels,
      users
    )}</blockquote>`
  } else if (attachement.fallback) {
    // `fallback` is plain text, but escaped the backslash
    text += `<blockquote>${unescapeStr(attachement.fallback)}</blockquote>`
  }

  return text
}

/**
 * Create an attachement text.
 * @param attachements Attachements.
 * @param channels Channnels.
 * @param users Users.
 * @returns Markdown text.
 */
const createAttachement = (
  attachements: Attachement[],
  channels: Map<string, Channel>,
  users: Map<string, User>
): string => {
  if (attachements.length === 0) {
    return ''
  }

  let text = createAttachementValue(attachements[0], channels, users)
  for (let i = 1; i < attachements.length; ++i) {
    text += `<br>${createAttachementValue(attachements[i], channels, users)}`
  }

  return text
}

/**
 * Create the markdown.of the message table body.
 * @param message Message.
 * @param channels Channels.
 * @param users Users.
 * @returns Header markdown.
 */
const createBody = (
  message: Message,
  channels: Map<string, Channel>,
  users: Map<string, User>
): string => {
  // Target the copy so as not to destroy the arguments
  let body = replaceBody(message.text, channels, users)

  const links = createFileLinks(message.files)
  if (links !== '') {
    if (body === '') {
      body = links
    } else {
      body += `<br>${links}`
    }
  }

  const attachement = createAttachement(message.attachments, channels, users)
  if (attachement !== '') {
    if (body === '') {
      body = attachement
    } else {
      body += `<br>${attachement}`
    }
  }

  return body
}

/**
 * Convert the messages to markdown text.
 * Messages are output as a `<table>`. Because <table> is easier to handle than `<ul>`.
 * e.g. `|Time|Icon|Name|Message|\n|---|---|---|---|\n|18:42|![](https://example.com/test/72.png)|User Name|Message|\n ...`
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
  let md = '|Time (UTC)|Icon|Name|Message|\n|---|---|---|---|\n'
  for (const message of messages) {
    const { time, imageURL, username } = getMetadata(message, users)
    const image = imageURL === '' ? '' : `![](${imageURL})`
    const body = createBody(message, channels, users)
    md += `|${time}|${image}|${username}|${body}|\n`
  }

  return md
}

export default messagesToMarkdown
