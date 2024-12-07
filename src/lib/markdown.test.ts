import { describe, test, expect } from 'vitest'
import { readChannels, readUsers, readMessages } from './log2md'
import messagesToMarkdown from './markdown'

describe('messagesToMarkdown', () => {
  test('Create markdown', async () => {
    const channels = await readChannels('./examples/data')
    const users = await readUsers('./examples/data')
    const messages = await readMessages('./examples/data/general/messages.json')
    const actual = messagesToMarkdown(messages, channels, users, {
      addUniqueMessageId: false,
    })
    const expected = `|Time (UTC)|Icon|Name|Message|
|---|---|---|---|
|13:43|![](https://example.com/test/72.png)|test|\`@test\` has joined the channel|
|07:02|![](https://example.com/test/72.png)|test|\`@test\` \`#general\` Sample message<br>Sample<br><br>Sample|
|07:02|![](https://example.com/bot/72.png)|Sample Bot|🇬🇧:  Sample message.|
|15:22|![](https://example.com/test/72.png)|test|Quote: <br><blockquote>Sample<br>Text</blockquote>Please read the above.|
|18:09|![](https://example.com/test/72.png)|test|Code: <br><pre>const value = 'code';<br>console.log(value);</pre><br>Please read the above.|
|18:09|![](https://example.com/test/72.png)|test|Files.<br>https://example.com/files/sample.jpg<br>https://example.com/files/sample.md|
|18:09|![](https://example.com/test/72.png)|test|Sample.<br>Pre-text<blockquote>[sample/example] Text</blockquote><br><blockquote><!here> Text</blockquote>|
`
    expect(actual).toBe(expected)
  })

  test('With an unique identifier of message', async () => {
    const channels = await readChannels('./examples/data')
    const users = await readUsers('./examples/data')
    const messages = await readMessages('./examples/data/general/messages.json')
    const actual = messagesToMarkdown(messages, channels, users, {
      addUniqueMessageId: true,
    })
    const expected = `|Time (UTC)|Icon|Name|Message|
|---|---|---|---|
|<span id="1569073381.002100">13:43</span>|![](https://example.com/test/72.png)|test|\`@test\` has joined the channel|
|<span id="1570172544.014600">07:02</span>|![](https://example.com/test/72.png)|test|\`@test\` \`#general\` Sample message<br>Sample<br><br>Sample|
|<span id="1570172545.014700">07:02</span>|![](https://example.com/bot/72.png)|Sample Bot|🇬🇧:  Sample message.|
|<span id="1570202544.012700">15:22</span>|![](https://example.com/test/72.png)|test|Quote: <br><blockquote>Sample<br>Text</blockquote>Please read the above.|
|<span id="1570212554.014000">18:09</span>|![](https://example.com/test/72.png)|test|Code: <br><pre>const value = 'code';<br>console.log(value);</pre><br>Please read the above.|
|<span id="1570212554.017000">18:09</span>|![](https://example.com/test/72.png)|test|Files.<br>https://example.com/files/sample.jpg<br>https://example.com/files/sample.md|
|<span id="1570212554.014000">18:09</span>|![](https://example.com/test/72.png)|test|Sample.<br>Pre-text<blockquote>[sample/example] Text</blockquote><br><blockquote><!here> Text</blockquote>|
`
    expect(actual).toBe(expected)
  })
})
