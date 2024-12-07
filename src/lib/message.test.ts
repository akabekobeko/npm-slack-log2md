import { describe, test, expect } from 'vitest'
import { readFileSync } from 'node:fs'
import parseMessage from './message'

describe('parseMessage', () => {
  const values = JSON.parse(
    readFileSync('./examples/data/general/messages.json', 'utf8')
  ) as any[]

  test('Channel join', () => {
    const message = parseMessage(values[0])
    expect(message.user).toBe('USERID')
    expect(message.type).toBe('message')
    expect(message.subtype).toBe('channel_join')
    expect(message.timeStamp).toBe('1569073381.002100')
    expect(message.text).toBe('<@USERID> has joined the channel')
  })

  test('Message', () => {
    const message = parseMessage(values[1])
    expect(message.user).toBe('USERID')
    expect(message.type).toBe('message')
    expect(message.timeStamp).toBe('1570172544.014600')
    expect(message.text).toBe(
      '<@USERID> <#CHANNELID|general> Sample message\nSample\n\nSample'
    )
    expect(message.clientMessageId).toBe('363953ac-f635-4cfa-99f3-70f87b04a9cc')
    expect(message.team).toBe('TEAMID')
    expect(message.userTeam).toBe('TEAMID')
    expect(message.sourceTeam).toBe('TEAMID')
    expect(message.threadTimeStamp).toBe('1570172544.014600')
    expect(message.replyCount).toBe(4)
    expect(message.replyUsersCount).toBe(3)
    expect(message.latestReply).toBe('1570175686.020000')
    expect(message.replyUsers![0]).toBe('USERID')
    expect(message.subscribed).toBeTruthy()
    expect(message.lastRead).toBe('1570175686.020000')

    // Reply
    const reply = message.replies![0]
    expect(reply.user).toBe('USERID')
    expect(reply.timeStamp).toBe('1570173879.019200')

    // Reaction
    const reaction = message.reactions![0]
    expect(reaction.name).toBe('+1')
    expect(reaction.users[0]).toBe('USERID')
    expect(reaction.count).toBe(1)

    // User profile
    const profile = message.userProfile!
    expect(profile.avatarHash).toBe('e258f5ed5ba8')
    expect(profile.image72).toBe('https://example.com/test/72.png')
    expect(profile.firstName).toBe('First')
    expect(profile.realName).toBe('Real')
    expect(profile.displayName).toBe('test')
    expect(profile.team).toBe('TEAMID')
    expect(profile.isRestricted).toBeFalsy()
    expect(profile.isUltraRestricted).toBeFalsy()
  })

  test('Bot', () => {
    const message = parseMessage(values[2])
    expect(message.type).toBe('message')
    expect(message.subtype).toBe('bot_message')
    expect(message.timeStamp).toBe('1570172545.014700')
    expect(message.username).toBe('Sample Bot')
    expect(message.text).toBe(':flag-gb::  Sample message.')
    expect(message.botId).toBe('BOTID')
  })

  test('Files', () => {
    const message = parseMessage(values[5])
    expect(message.files.length).toBe(2)
    expect(message.files[0]!.permalink).toBe(
      'https://example.com/files/sample.jpg'
    )
    expect(message.files[1]!.permalink).toBe(
      'https://example.com/files/sample.md'
    )
  })

  test('Attachement', () => {
    const message = parseMessage(values[6])
    expect(message.attachments.length).toBe(2)

    let attachment = message.attachments[0]
    expect(attachment.pretext).toBe('Pre-text')
    expect(attachment.fallback).toBe('[sample/example] Text')
    expect(attachment.text).toBe('')

    attachment = message.attachments[1]
    expect(attachment.pretext).toBe('')
    expect(attachment.fallback).toBe(
      '[October 20th, 2019 11:29 AM] test: <!here> Text'
    )
    expect(attachment.text).toBe('<!here> Text')
  })
})
