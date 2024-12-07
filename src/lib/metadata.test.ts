import { describe, test, expect } from 'vitest'
import { readUsers, readMessages } from './log2md'
import getMetadata from './metadata'

describe('getMetadata', () => {
  test('Metadata', async () => {
    const users = await readUsers('./examples/data')
    const messages = await readMessages('./examples/data/general/messages.json')

    let data = getMetadata(messages[0], users)
    expect(data.time).toBe('13:43')
    expect(data.username).toBe('test')
    expect(data.imageURL).toBe('https://example.com/test/72.png')

    data = getMetadata(messages[1], users)
    expect(data.time).toBe('07:02')
    expect(data.username).toBe('test')
    expect(data.imageURL).toBe('https://example.com/test/72.png')

    data = getMetadata(messages[2], users)
    expect(data.time).toBe('07:02')
    expect(data.username).toBe('Sample Bot')
    expect(data.imageURL).toBe('https://example.com/bot/72.png')
  })
})
