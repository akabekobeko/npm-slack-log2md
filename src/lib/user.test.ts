import fs from 'fs'
import parseUser from './user'

describe('parseUser', () => {
  it('Parse', () => {
    const values = JSON.parse(
      fs.readFileSync('./examples/data/users.json', 'utf8')
    ) as any[]
    const user = parseUser(values[0])

    // User
    expect(user.id).toBe('USERID')
    expect(user.teamId).toBe('TEAMID')
    expect(user.name).toBe('test')
    expect(user.deleted).toBeFalsy()
    expect(user.color).toBe('385a86')
    expect(user.realName).toBe('test')
    expect(user.timeZone).toBe('Asia/Tokyo')
    expect(user.timeZoneLabel).toBe('Japan Standard Time')
    expect(user.timeZoneOffset).toBe(32400)
    expect(user.isAdmin).toBeTruthy()
    expect(user.isOwner).toBeFalsy()
    expect(user.isPrimaryOwner).toBeFalsy()
    expect(user.isRestricted).toBeFalsy()
    expect(user.isUltraRestricted).toBeFalsy()
    expect(user.isBot).toBeFalsy()
    expect(user.isAppUser).toBeFalsy()
    expect(user.updated).toBe(1557905109)

    // Profile
    const profile = user.profile
    expect(profile.title).toBe('')
    expect(profile.phone).toBe('')
    expect(profile.skype).toBe('')
    expect(profile.realName).toBe('test')
    expect(profile.realNameNormalized).toBe('test')
    expect(profile.displayName).toBe('test')
    expect(profile.displayNameNormalized).toBe('test')
    expect(profile.statusText).toBe('')
    expect(profile.statusEmoji).toBe('')
    expect(profile.statusExpiration).toBe(0)
    expect(profile.avatarHash).toBe('TEST')
    expect(profile.imageOriginal).toBe('https://example.com/test/original.png')
    expect(profile.isCustomImage).toBeTruthy()
    expect(profile.email).toBe('test@example.com')
    expect(profile.firstName).toBe('test')
    expect(profile.lastName).toBe('')
    expect(profile.image24).toBe('https://example.com/test/24.png')
    expect(profile.image32).toBe('https://example.com/test/32.png')
    expect(profile.image48).toBe('https://example.com/test/48.png')
    expect(profile.image72).toBe('https://example.com/test/72.png')
    expect(profile.image192).toBe('https://example.com/test/192.png')
    expect(profile.image512).toBe('https://example.com/test/512.png')
    expect(profile.image1024).toBe('https://example.com/test/1024.png')
    expect(profile.statusTextCanonical).toBe('')
    expect(profile.team).toBe('TEST')
  })
})
