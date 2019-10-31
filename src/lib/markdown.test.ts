import { readChannels, readUsers, readMessages } from './log2md'
import messagesToMarkdown from './markdown'

describe('messagesToMarkdown', () => {
  it('Create markdown', async () => {
    const channels = await readChannels('./examples/data')
    const users = await readUsers('./examples/data')
    const messages = await readMessages('./examples/data/general/messages.json')
    const actual = messagesToMarkdown(messages, channels, users)
    const expexted =
      '|13:43|![](https://example.com/test/72.png)|test|`@test` has joined the channel|\n|07:02|![](https://example.com/test/72.png)|test|`@test` `#general` Sample message<br>Sample<br><br>Sample|\n|07:02|![](https://example.com/bot/72.png)|Sample Bot|:flag-gb::  Sample message.|\n'

    expect(actual).toBe(expexted)
  })
})
