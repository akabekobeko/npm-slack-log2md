import { readChannels, readUsers, readMessages } from './log2md'
import messagesToMarkdown from './markdown'

describe('messagesToMarkdown', () => {
  it('Create markdown', async () => {
    const channels = await readChannels('./examples/data')
    const users = await readUsers('./examples/data')
    const messages = await readMessages('./examples/data/general/messages.json')
    const actual = messagesToMarkdown(messages, channels, users)
    const expexted =
      '|![](https://example.com/24.png) **test** 13:43|\n|`@test` has joined the channel|\n|![](https://example.com/24.png) **test** 07:02|\n|`@test` `#general` Sample message<br>Sample<br><br>Sample|\n|**Sample Bot** 07:02|\n|:flag-gb::  Sample message.|\n'

    expect(actual).toBe(expexted)
  })
})
