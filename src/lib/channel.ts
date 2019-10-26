/** Header message (Purpose, Topic) of the channel. */
export type HeaderMessage = {
  /** Text of the header message. */
  value: string
  /** Create of the header message. */
  creator: string
  /** The date and time when the header message was last set. JSON: `last_set`. */
  lastSet: string
}

/** Pinned data. */
export type Pin = {
  /** Identifier of the pin. */
  id: string
  /** Type of pin. e.g. `C` */
  type: string
  /** Date and time the pinned (UTC). */
  created: number
  /** Identifier of the user. */
  user: string
  /** Identifier of the owner user. */
  owner: string
}

/** Channel information. */
export type Channel = {
  /** Identifier of the channel. */
  id: string
  /** Name of the channel. */
  name: string
  /** Date and time the channel was created (UTC). */
  created: string
  /** Creator of the channel. */
  creator: string
  /** `true` if the channel was archived. JSON: `is_archived`. */
  isArchived: boolean
  /** `true` if the channel is general. JSON: `is_general`. */
  isGeneral: boolean
  /** Identifier collection of a channel member. */
  members: string[]
  /** The purpose of the channel. */
  purpose: HeaderMessage
  /** Header message of the channel. */
  topic: HeaderMessage
  /** Collection of pinned messages and files */
  pins: Pin[]
}

/**
 * Parse header message by channel.
 * @param obj An object of the `channels.json` array value.
 * @returns Header message.
 */
const parseHeaderMessage = (obj: any): HeaderMessage => {
  return {
    value: obj.value as string,
    creator: obj.creator as string,
    lastSet: obj.last_set as string
  }
}

/**
 * Parse pinned data by channel.
 * @param obj An object of the `channels.json` array value.
 * @returns Collection of the pinned data.
 */
const parsePins = (obj: any | undefined): Pin[] => {
  const pins: Pin[] = []
  if (!Array.isArray(obj)) {
    return pins
  }

  for (const value of obj) {
    pins.push({
      id: value.id,
      type: value.type,
      created: value.created,
      user: value.user,
      owner: value.owner
    })
  }

  return pins
}

/**
 * Parse channel information.
 * @param obj An element of the `channels.json` array.
 * @returns Channel information.
 */
const parseChannel = (obj: any): Channel => {
  const pins: Pin[] = []
  if (obj.pins) {
    for (const value of obj.pins) {
    }
  }

  return {
    id: obj.id as string,
    name: obj.name as string,
    created: obj.created as string,
    creator: obj.creator as string,
    isArchived: obj.is_archived as boolean,
    isGeneral: obj.is_general as boolean,
    members: obj.members as string[],
    purpose: parseHeaderMessage(obj.purpose),
    topic: parseHeaderMessage(obj.topic),
    pins: parsePins(obj.pins)
  }
}

export default parseChannel
