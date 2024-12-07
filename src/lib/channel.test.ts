import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import parseChannel from './channel'

describe('parseChannel', () => {
  test('Parse', () => {
    const values = JSON.parse(
      readFileSync('./examples/data/channels.json', 'utf8')
    ) as any[]
    const channel = parseChannel(values[0])

    // User
    expect(channel.id).toBe('CHANNELID')
    expect(channel.name).toBe('general')
    expect(channel.created).toBe('1524799526')
    expect(channel.creator).toBe('USERID')
    expect(channel.isArchived).toBeFalsy()
    expect(channel.isGeneral).toBeTruthy()
    expect(channel.members[0]).toBe('USERID')

    // Pin
    const pin = channel.pins![0]
    expect(pin.id).toBe('1558706724.000400')
    expect(pin.type).toBe('C')
    expect(pin.created).toBe(1569567288)
    expect(pin.user).toBe('USERID')
    expect(pin.owner).toBe('USERID')

    // Topic
    const topic = channel.topic
    expect(topic.value).toBe('')
    expect(topic.creator).toBe('USERID')
    expect(topic.lastSet).toBe('1524819390')

    // Purpose
    const purpose = channel.purpose
    expect(purpose.value).toBe('')
    expect(purpose.creator).toBe('USERID')
    expect(purpose.lastSet).toBe('1524819558')
  })
})
