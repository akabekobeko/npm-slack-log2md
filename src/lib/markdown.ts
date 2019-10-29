import { Message } from './message'
import { Channel } from './channel'
import { User } from './user'

/**
 * Converts the value of the Date object to its equivalent string representation using the specified format.
 * @param date Date and time. Default is current date and time.
 * @param format Date and time format string. Default is "YYYY-MM-DD hh:mm:ss.SSS".
 * @returns Formatted string.
 * @see http://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
 */
const formatDate = (
  date: Date = new Date(),
  format: string = 'YYYY-MM-DD hh:mm:ss.SSS'
): string => {
  const Y = date.getFullYear()
  const M = date.getMonth() + 1
  const D = date.getDate()
  const h = date.getHours()
  const l = 12 < h ? h - 12 : h
  const m = date.getMinutes()
  const s = date.getSeconds()

  let str = format.replace(/YYYY/g, String(Y))
  str = str.replace(/MM/g, ('0' + M).slice(-2))
  str = str.replace(/DD/g, ('0' + D).slice(-2))
  str = str.replace(/hh/g, ('0' + h).slice(-2))
  str = str.replace(/mm/g, ('0' + m).slice(-2))
  str = str.replace(/ss/g, ('0' + s).slice(-2))

  str = str.replace(/M/g, String(M))
  str = str.replace(/D/g, String(D))
  str = str.replace(/h/g, String(h))
  str = str.replace(/m/g, String(m))
  str = str.replace(/s/g, String(s))

  // 12 Hour
  str = str.replace(/l/g, String(l))

  // AM/PM
  str = str.replace(/p/g, h < 12 ? 'AM' : 'PM')

  // Month name
  const monthShortNames = [
    '',
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ]
  const monthFullNames = [
    '',
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ]
  str = str.replace(/b/g, monthShortNames[M])
  str = str.replace(/B/g, monthFullNames[M])

  // milliSeconds
  if (str.match(/S/g)) {
    const S = date.getMilliseconds()
    const ms = ('00' + S).slice(-3)
    for (let i = 0, max = str.match(/S/g)!.length; i < max; ++i) {
      str = str.replace(/S/, ms.substring(i, i + 1))
    }
  }

  return str
}

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
  const time = formatDate(tsToDate(message.timeStamp), 'hh:mm')
  const user = users.get(message.user)

  if (user) {
    if (user.profile.image24 !== '') {
      const image = `![](${user.profile.image24})`
      return `${image} **${getMessageUserName(user)}** ${time}`
    }

    return `**${getMessageUserName(user)}** ${time}`
  }

  if (message.username) {
    return `**${message.username}** ${time}`
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

  // Line break
  body = body.replace(/\n/g, '<br>')

  return body
}

/**
 * Convert the messages to markdown text.
 * Messages are output as a `<table>`. Because <table> is easier to handle than `<ul>`.
 * e.g. `|![](ImageURL) **UserName** DateTime|\n|Message|\n ...`
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
    const header = createHeader(message, users)
    const body = createBody(message, channels, users)

    // Do this because `<table>` are easier to handle than `<ul>`.
    md += `|${header}|\n|${body}|\n`
  }

  return md
}

export default messagesToMarkdown
