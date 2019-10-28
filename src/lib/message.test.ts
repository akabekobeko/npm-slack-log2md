import fs from 'fs'
import parseMessage from './message'

describe('parseMessage', () => {
  const values = JSON.parse(
    fs.readFileSync('./examples/data/messages.json', 'utf8')
  ) as any[]

  it('Channel join', () => {
    const message = parseMessage(values[0])
    expect(message.user).toBe('USERID')
    expect(message.type).toBe('message')
    expect(message.subtype).toBe('channel_join')
    expect(message.timeStamp).toBe('1569073381.002100')
    expect(message.text).toBe('<@USERID> has joined the channel')
  })

  it('Message', () => {
    const message = parseMessage(values[1])
    expect(message.user).toBe('USERID')
    expect(message.type).toBe('message')
    expect(message.timeStamp).toBe('1570172544.014600')
    expect(message.text).toBe('<@USERID> Sample message')
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
    expect(profile.image72).toBe('https://example.com/sample.jpg')
    expect(profile.firstName).toBe('First')
    expect(profile.realName).toBe('Real')
    expect(profile.displayName).toBe('sample')
    expect(profile.team).toBe('TEAMID')
    expect(profile.isRestricted).toBeFalsy()
    expect(profile.isUltraRestricted).toBeFalsy()
  })

  it('Bot', () => {
    const message = parseMessage(values[2])
    expect(message.type).toBe('message')
    expect(message.subtype).toBe('bot_message')
    expect(message.timeStamp).toBe('1570172545.014700')
    expect(message.username).toBe('Sample Bot')
    expect(message.text).toBe(':flag-gb::  Sample message.')
    expect(message.botId).toBe('BOTID')
  })
})
