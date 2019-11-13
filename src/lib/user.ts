import { unescapeStr } from './metadata'

/** User profile. */
export type Profile = {
  /** ? */
  title: string
  /** Phone number. */
  phone: string
  /** Skype address. */
  skype: string
  /** Real name. JSON: `real_name`. */
  realName: string
  /** Normalized real name. JSON: `real_name_normalized`. */
  realNameNormalized: string
  /** Display name. JSON: `display_name`. */
  displayName: string
  /** Normalized display name. JSON: `display_name_normalized`. */
  displayNameNormalized: string
  /** ? */
  fields: any
  /** Text of an account status. JSON: `status_text`. */
  statusText: string
  /** Emoji of an account status. JSON: `status_emoji`. */
  statusEmoji: string
  /** Account expiration. JSON: `status_expiration`. */
  statusExpiration: number
  /** Hash of avatar (Image data?). JSON: `avatar_hash`. */
  avatarHash: string
  /** Accout image URL (Original size). `/` is escaped = `\/`. JSON: `image_original`. */
  imageOriginal: string
  /** `true` if using a custom image. JSON: `is_custom_image`. */
  isCustomImage: boolean
  /** Accout image URL (24x24). `/` is escaped = `\/`. JSON: `image_24`. */
  image24: string
  /** Accout image URL (32x32). `/` is escaped = `\/`. JSON: `image_32`. */
  image32: string
  /** Accout image URL (48x48). `/` is escaped = `\/`. JSON: `image_48`. */
  image48: string
  /** Accout image URL (72x72). `/` is escaped = `\/`. JSON: `image_72`. */
  image72: string
  /** Accout image URL (192x192). `/` is escaped = `\/`. JSON: `image_192`. */
  image192: string
  /** Accout image URL (512x512). `/` is escaped = `\/`. JSON: `image_512`. */
  image512: string
  /** Accout image URL (1024x1024). `/` is escaped = `\/`. JSON: `image_1024`. */
  image1024: string
  /** Canonical text of an account status. JSON: `status_text_canonical`. */
  statusTextCanonical: string
  /** The team (Organization) to which the user belongs. */
  team: string
  /** E-mail address. */
  email?: string
  /** First name. JSON: `first_name`. */
  firstName?: string
  /** Last name. JSON: `last_name`. */
  lastName?: string
  /** `true` if the user is a Slack bot. */
  botId?: string
  /** Identifier of the application using the Slack API. JSON: `api_app_id`. */
  apiAppId?: string
  /** `true` if always active. JSON: `always_active`. */
  alwaysActive?: boolean
}

/** User information. */
export type User = {
  /** Identifier of the user. */
  id: string
  /** Identifier of the team to which the user belongs. JSON: `team_id`. */
  teamId: string
  /** Account name of the user. */
  name: string
  /** `true` if the user has been deleted. */
  deleted: boolean
  /** Color of the user. */
  color: string
  /** Real name of the user. JSON: `real_name`. */
  realName: string
  /** The time zone where the user is located. e.g. `Asia/Tokyo`. JSON: `time_zone`. */
  timeZone: string
  /** Time zone label name where the user is located. e.g. `Japan Standard Time`. JSON: `time_zone_label`. */
  timeZoneLabel: string
  /** Offset from UNIX Timestamp in the time zone where the user is located. JSON: `time_zone_offset`. */
  timeZoneOffset: number
  /** Profile of the user. */
  profile: Profile
  /** `true` if the user is a workspace administrator. JSON: `is_admin`. */
  isAdmin: boolean
  /** `true` if the user is the owner of the workspace. JSON: `is_owner`. */
  isOwner: boolean
  /** `true` if the user is the primary owner of the workspace. JSON: `is_primary_owner`. */
  isPrimaryOwner: boolean
  /** `true` for restricted users. JSON: `is_restricted`. */
  isRestricted: boolean
  /** `true` for ultra restricted users. JSON: `is_ultra_restricted`. */
  isUltraRestricted: boolean
  /** `true` if the user is Slack bot. JSON: `is_bot`. */
  isBot: boolean
  /** `true` if the user is an application user. JSON: `is_app_user`. */
  isAppUser: boolean
  /** Date and time when user information was updated (UNIX Timestamp). */
  updated: number
}

/**
 * Parse profile by user information.
 * @param obj Object of the user information.
 * @returns Profile.
 */
const parseProfile = (obj: any): Profile => {
  return {
    title: obj.title || '',
    phone: obj.phone || '',
    skype: obj.skype || '',
    realName: obj.real_name || '',
    realNameNormalized: obj.real_name_normalized || '',
    displayName: obj.display_name || '',
    displayNameNormalized: obj.display_name_normalized || '',
    fields: obj.fields || {},
    statusText: obj.status_text || '',
    statusEmoji: obj.status_emoji || '',
    statusExpiration: obj.status_expiration || 0,
    avatarHash: obj.avatar_hash || '',
    imageOriginal: obj.image_original ? unescapeStr(obj.image_original) : '',
    isCustomImage: obj.is_custom_image,
    image24: obj.image_24 ? unescapeStr(obj.image_24) : '',
    image32: obj.image_32 ? unescapeStr(obj.image_32) : '',
    image48: obj.image_48 ? unescapeStr(obj.image_48) : '',
    image72: obj.image_72 ? unescapeStr(obj.image_72) : '',
    image192: obj.image_192 ? unescapeStr(obj.image_192) : '',
    image512: obj.image_512 ? unescapeStr(obj.image_512) : '',
    image1024: obj.image_1024 ? unescapeStr(obj.image_1024) : '',
    statusTextCanonical: obj.status_text_canonical || '',
    team: obj.team || '',
    email: obj.email,
    firstName: obj.first_name,
    lastName: obj.last_name,
    botId: obj.bot_id,
    apiAppId: obj.api_app_id,
    alwaysActive: obj.always_active
  }
}

/**
 * Parse user information.
 * @param obj Element of the `users.json` array.
 * @returns User information.
 */
const parseUser = (obj: any): User => {
  return {
    id: obj.id || '',
    teamId: obj.team_id || '',
    name: obj.name || '',
    deleted: obj.deleted || '',
    color: obj.color || '',
    realName: obj.real_name || '',
    timeZone: obj.tz ? unescapeStr(obj.tz) : '',
    timeZoneLabel: obj.tz_label || '',
    timeZoneOffset: obj.tz_offset || '',
    isAdmin: obj.is_admin || false,
    isOwner: obj.is_owner || false,
    isPrimaryOwner: obj.is_primary_owner || false,
    isRestricted: obj.is_restricted || false,
    isUltraRestricted: obj.is_ultra_restricted || false,
    isBot: obj.is_bot || false,
    isAppUser: obj.is_app_user || false,
    updated: obj.updated || 0,
    profile: parseProfile(obj.profile)
  }
}

export default parseUser
