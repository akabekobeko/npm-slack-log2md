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
  /** Post date (UTC). e.g. `1569458609.000200`. */
  ts: string
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

/** Message on channel. */
export type Message = {
  /**  Identifier of the user who posted the message. */
  user: string
  /** Type of message. e.g. `message`. */
  type: string
  /** Sub type of message. e,g. `channel_join`. */
  subtype?: string
  /** Post date and time (UTC). e.g. `1569458609.000200`. */
  ts: string
  /** Message body text. Replaced special links: Channel = `<#CHANNELID>`, User = `<@USERID>`, Link = `<URL>`. */
  text: string
  /** Purpose text. Replaced special links. */
  purpose?: string
  /** Identifier of client message (UUID?). JSON: 'client_msg_id'. */
  clientMessageId?: string
  /** Identifier of team. */
  team?: string
  /** Identifier of user team. JSON: `user_team`. */
  userTeam?: string
  /** Identifier of source team. JSON: `source_team`. */
  sourceTeam?: 'TAE8V835Y'
  /** User profile. JSON: `user_profile`. */
  user_profile?: UserProfile
  /** Identifier of the user who invited this user. */
  inviter?: string
  /** User name. */
  username?: string
  /** Identifier of Slack bot. JSON: `bot_id`. */
  bot_id?: string
  /** Reactions to the message. */
  reactions?: Reaction[]
  /** Replies to the message. */
  replies?: Reply[]
  /** The message posting date and time (UTC) of the thread with which the message is associated. e.g. `1569458609.000200`. JSON: `thread_ts`. */
  thread_ts?: string
  /** Identifier of the parent user. JSON: `parent_user_id`. */
  parent_user_id?: 'UAE8V83GA'
  /** `true` if subscribed. */
  subscribed?: true
  /** The date and time (UTC) when the message was last read. e.g. `1569458609.000200`. JSON: `last_read`. */
  last_read?: string
}
