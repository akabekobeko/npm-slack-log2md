/** Reaction to the message. */
export type Reaction = {
  /** Predefined reaction name. e.g. `clap`. */
  name: string
  /** Identifier collection of users who have reacted. */
  users: string[]
  /** Number of reactions. */
  count: number
}

/** Information for examining the reply message for a message. */
export type Reply = {
  /**  Identifier of the user. */
  user: string
  /** Post date (UNIX Timestamp). e.g. `1569458609.000200`. JSON: 'ts'. */
  timeStamp: string
}

/** User profile. */
export type UserProfile = {
  /** Avatar hash (Image data?). JSON: 'avatar_hash'. */
  avatarHash: string
  /** Accout image URL (72.72). `/` is escaped = `\/`. JSON: 'image_72'. */
  image72: string
  /** First name. JSON: 'first_name'. */
  firstName: string
  /** Real name. JSON: 'real_name'. */
  realName: string
  /** Display name. JSON: 'display_name'. */
  displayName: string
  /** Identifier of team. */
  team: string
  /** Account name. */
  name: string
  /** `true` for restricted users. JSON: 'is_restricted'. */
  isRestricted: boolean
  /** `true` for ultra restricted users. JSON: 'is_ultra_restricted'. */
  isUltraRestricted: boolean
}

/**
 * An attached files to the message.
 * It actually has a lot of properties, but it is limited to what is needed as a message.
 */
export type File = {
  /** Permanent link for the file. */
  permalink: string
}

/**
 * An attached messages to the message.
 * It actually has a lot of properties, but it is limited to what is needed as a message.
 * @see https://api.slack.com/docs/message-attachments
 */
export type Attachement = {
  /** A plain-text summary of the attachment. This text will be used in clients that don't show formatted text (eg. IRC, mobile notifications) and should not contain any markup. */
  fallback: string
  /** This is optional text that appears above the message attachment block. */
  pretext: string
  /** This is the main text in a message attachment, and can contain standard message markup. */
  text: string
}

/** Message on channel. */
export type Message = {
  /**  Identifier of the user who posted the message. */
  user: string
  /** Type of message. e.g. `message`. */
  type: string
  /** Sub type of message. e,g. `channel_join`. */
  subtype?: string
  /** Post date and time (UNIX Timestamp). e.g. `1569458609.000200`. JSON: 'ts'. */
  timeStamp: string
  /** Message body text. Replaced special links: Channel = `<#CHANNELID>`, User = `<@USERID>`, Link = `<URL>`. */
  text: string
  /** Reactions to the message. */
  reactions: Reaction[]
  /** Replies to the message. */
  replies: Reply[]
  /** An attached files to the message */
  files: File[]
  /** An attached messages to the message */
  attachments: Attachement[]
  /** Purpose text. Replaced special links. */
  purpose?: string
  /** Identifier of client message (UUID?). JSON: 'client_msg_id'. */
  clientMessageId?: string
  /** Identifier of team. */
  team?: string
  /** Identifier of user team. JSON: `user_team`. */
  userTeam?: string
  /** Identifier of source team. JSON: `source_team`. */
  sourceTeam?: string
  /** User profile. JSON: `user_profile`. */
  userProfile?: UserProfile
  /** Identifier of the user who invited this user. */
  inviter?: string
  /** User name. */
  username?: string
  /** Identifier of Slack bot. JSON: `bot_id`. */
  botId?: string
  /** Number of the reply. JSON: `reply_count`. */
  replyCount?: number
  /** Number of the reply user. JSON: `reply_users_count`. */
  replyUsersCount?: number
  /** Last reply date and time (UNIX Timestamp). JSON: `latest_reply`. */
  latestReply?: string
  /** Reply users. JSON: `reply_users`. */
  replyUsers?: string[]
  /** The message posting date and time (UNIX Timestamp) of the thread with which the message is associated. e.g. `1569458609.000200`. JSON: `thread_ts`. */
  threadTimeStamp?: string
  /** Identifier of the parent user. JSON: `parent_user_id`. */
  parentUserId?: string
  /** `true` if subscribed. */
  subscribed?: true
  /** The date and time (UNIX Timestamp) when the message was last read. e.g. `1569458609.000200`. JSON: `last_read`. */
  lastRead?: string
}

/**
 * Remove backslash escaping from string. e.g. `https:\/\/secure.gravatar.com\/avatar\/`
 * @param str URL.
 * @returns Unescaped string.
 */
const unescapeStr = (str: string) => {
  return str.replace('\\', '')
}

/**
 * Parse a reactions by message.
 * @param obj Object of the array value.
 * @returns Reactions.
 */
const parseReactions = (obj: any): Reaction[] => {
  const reactions: Reaction[] = []
  if (!Array.isArray(obj)) {
    return reactions
  }

  for (const value of obj) {
    reactions.push({
      name: value.name || '',
      users: value.users || [],
      count: value.count || 0
    })
  }

  return reactions
}

/**
 * Parse a replies by message.
 * @param obj Object of the message value.
 * @returns Replies.
 */
const parseReplies = (obj: any): Reply[] => {
  const replies: Reply[] = []
  if (!Array.isArray(obj)) {
    return replies
  }

  for (const value of obj) {
    replies.push({
      user: value.user || '',
      timeStamp: value.ts || ''
    })
  }

  return replies
}

/**
 * Parse an attached files by message.
 * @param obj Object of the array value.
 * @returns Files.
 */
const parseFiles = (obj: any): File[] => {
  const files: File[] = []
  if (!Array.isArray(obj)) {
    return files
  }

  for (const value of obj) {
    files.push({
      permalink: value.permalink || ''
    })
  }

  return files
}

/**
 * Parse an attached messages by message.
 * @param obj Object of the array value.
 * @returns Attachements.
 */
const parseAttachements = (obj: any): Attachement[] => {
  const attachements: Attachement[] = []
  if (!Array.isArray(obj)) {
    return attachements
  }

  for (const value of obj) {
    attachements.push({
      fallback: value.fallback || '',
      pretext: value.pretext || '',
      text: value.text || ''
    })
  }

  return attachements
}

/**
 * Parse an user profile by message.
 * @param obj Object of the message value.
 * @returns User profile.
 */
const parseUserProfile = (obj: any): UserProfile => {
  return {
    avatarHash: obj.avatar_hash || '',
    image72: obj.image_72 ? unescapeStr(obj.image_72) : '',
    firstName: obj.first_name || '',
    realName: obj.real_name || '',
    displayName: obj.display_name || '',
    team: obj.team || '',
    name: obj.name || '',
    isRestricted: obj.is_restricted || false,
    isUltraRestricted: obj.is_ultra_restricted || false
  }
}

/**
 * Parse channel information.
 * @param obj Element of the message array.
 * @returns Channel information.
 */
const parseMessage = (obj: any): Message => {
  return {
    user: obj.user || '',
    type: obj.type || '',
    subtype: obj.subtype || '',
    timeStamp: obj.ts || '',
    text: obj.text || '',
    reactions: parseReactions(obj.reactions),
    replies: parseReplies(obj.replies),
    files: parseFiles(obj.files),
    attachments: parseAttachements(obj.attachments),
    purpose: obj.purpose,
    clientMessageId: obj.client_msg_id,
    team: obj.team,
    userTeam: obj.user_team,
    sourceTeam: obj.source_team,
    userProfile: obj.user_profile
      ? parseUserProfile(obj.user_profile)
      : obj.user_profile,
    inviter: obj.inviter,
    username: obj.username,
    botId: obj.bot_id,
    replyCount: obj.reply_count,
    replyUsersCount: obj.reply_users_count,
    latestReply: obj.latest_reply,
    replyUsers: obj.reply_users,
    threadTimeStamp: obj.thread_ts,
    parentUserId: obj.parent_user_id,
    subscribed: obj.subscribed,
    lastRead: obj.last_read
  }
}

export default parseMessage
