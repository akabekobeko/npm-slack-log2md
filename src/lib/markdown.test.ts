import { readChannels, readUsers, readMessages } from './log2md'
import messagesToMarkdown from './markdown'

describe('messagesToMarkdown', () => {
  it('Create markdown', async () => {
    const channels = await readChannels('./examples/data')
    const users = await readUsers('./examples/data')
    const messages = await readMessages('./examples/data/general/messages.json')
    const actual = messagesToMarkdown(messages, channels, users)
    const expexted = `|Time|Icon|Name|Message|
|---|---|---|---|
|13:43|![](https://example.com/test/72.png)|test|\`@test\` has joined the channel|
|07:02|![](https://example.com/test/72.png)|test|\`@test\` \`#general\` Sample message<br>Sample<br><br>Sample|
|07:02|![](https://example.com/bot/72.png)|Sample Bot|🇬🇧:  Sample message.|
|15:22|![](https://example.com/test/72.png)|test|Quote: <br><blockquote>Sample<br>Text</blockquote>Please read the above.|
|18:09|![](https://example.com/test/72.png)|test|Code: <br><pre>const value = 'code';<br>console.log(value);</pre><br>Please read the above.|
`
    //'|13:43|![](https://example.com/test/72.png)|test|`@test` has joined the channel|\n|07:02|![](https://example.com/test/72.png)|test|`@test` `#general` Sample message<br>Sample<br><br>Sample|\n|07:02|![](https://example.com/bot/72.png)|Sample Bot|🇬🇧:  Sample message.|\n'

    expect(actual).toBe(expexted)
  })
})
