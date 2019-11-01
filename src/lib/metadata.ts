import { Message } from './message'
import { User } from './user'

/** Message metadata. */
export type Metadata = {
  /** `hh: mm` format time (UTC). */
  time: string
  /** Display name or account name of the user. */
  username: string
  /** Image URL of the user. */
  imageURL: string
}

/**
 * Converts the value of the Date object to its equivalent string representation using the specified format.
 * @param date Date and time. Default is current date and time.
 * @param format Date and time format string. Default is "YYYY-MM-DD hh:mm:ss.SSS".
 * @returns Formatted string.
 * @see http://qiita.com/osakanafish/items/c64fe8a34e7221e811d0
 */
const formatDate = (
  date: Date = new Date(),
  format: string = 'YYYY-MM-DD hh:mm:ss.SSS',
  isUTC: boolean = false
): string => {
  const Y = isUTC ? date.getUTCFullYear() : date.getFullYear()
  const M = (isUTC ? date.getUTCMonth() : date.getMonth()) + 1
  const D = isUTC ? date.getUTCDate() : date.getDate()
  const h = isUTC ? date.getUTCHours() : date.getHours()
  const l = 12 < h ? h - 12 : h
  const m = isUTC ? date.getUTCMinutes() : date.getMinutes()
  const s = isUTC ? date.getUTCSeconds() : date.getSeconds()

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
    const S = date.getUTCMilliseconds()
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
 * Get the user by message.
 * @param message Message.
 * @param users Users.
 * @returns User.
 */
const getUser = (
  message: Message,
  users: Map<string, User>
): User | undefined => {
  if (message.botId) {
    for (const user of users.values()) {
      if (message.botId === user.profile.botId) {
        return user
      }
    }
  }

  return users.get(message.user)
}

/**
 * Get the name from the user.
 * @param user User.
 * @returns Name. If it cannot be obtained, it is an empty string.
 */
export const getNameFromUser = (user: User): string => {
  const profile = user.profile
  if (profile.displayName !== '') {
    return profile.displayName
  } else if (profile.realName !== '') {
    return profile.realName
  }

  return ''
}

/**
 * Get the user name.
 * @param message Message.
 * @param user User.
 * @returns User name.
 */
const getName = (message: Message, user: User | undefined): string => {
  // Slack bot has `message.username` instead of user as display name
  if (message.username) {
    return message.username
  }

  // Non-Slack Bot can get the data from this property
  if (message.userProfile) {
    const profile = message.userProfile
    if (profile.displayName !== '') {
      return profile.displayName
    } else if (profile.realName !== '') {
      return profile.realName
    }
  }

  // From the user information if not in the message
  if (user) {
    return getNameFromUser(user)
  }

  // May be an Exception
  return ''
}

const getImageURL = (message: Message, user: User | undefined): string => {
  // Non-Slack Bot can get the data from this property
  if (message.userProfile) {
    return message.userProfile.image72
  }

  // Slack bot or otherwise
  if (user) {
    return user.profile.image72
  }

  // Image is optional, do not make it an Exception
  return ''
}

/**
 * Create the metadate of message.
 * @param message Message.
 * @param users Users.
 * @returns Metadata.
 */
const getMetadata = (message: Message, users: Map<string, User>): Metadata => {
  const user = getUser(message, users)
  return {
    time: formatDate(tsToDate(message.timeStamp), 'hh:mm', true),
    username: getName(message, user),
    imageURL: getImageURL(message, user)
  }
}

export default getMetadata
