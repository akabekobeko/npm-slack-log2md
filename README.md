# slack-log2md

[![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg)](https://nodejs.org/)
[![npm version](https://badge.fury.io/js/slack-log2md.svg)](https://badge.fury.io/js/slack-log2md)
![test](https://github.com/akabekobeko/npm-slack-log2md/workflows/test/badge.svg)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier)

Slack log file (JSON) to Markdown file.

## Installation

```shell
$ npm install slack-log2md
```

## Usage

Markdown file is generated from Slack log file JSON by running CLI or Node.js API.

### Markdown

The generated Markdown file has the following format.

```markdown
# 2019-10-31

|Time|Icon|Name|Message|
|---|---|---|---|
|13:43|![](https://example.com/test/72.png)|test|`@test` has joined the channel|
|07:02|![](https://example.com/test/72.png)|test|`@test` `#general` Sample message<br>Sample<br><br>Sample|
|07:02|![](https://example.com/bot/72.png)|Sample Bot|🇬🇧: Sample message.|
|15:22|![](https://example.com/test/72.png)|test|Quote: <br><blockquote>Sample<br>Text</blockquote>Please read the above.|
|18:09|![](https://example.com/test/72.png)|test|Code: <br><pre>const value = 'code';<br>console.log(value);</pre><br>Please read the above.|
|18:09|![](https://example.com/test/72.png)|test|Files.<br>https://example.com/files/sample.jpg<br>https://example.com/files/sample.md|
|18:09|![](https://example.com/test/72.png)|test|Sample.<br>Pre-text<blockquote>[sample/example] Text</blockquote><br><blockquote><!here> Text</blockquote>|
```

- The message is output as a `<table>` tag.
- If a profile image is set for the user, the URL is referenced and displayed.
- The user will use the display name if there is one, otherwise it will be the account name.
- The time is always UTC.
- `@user` and `#channel` in the body text enclose the target name in `<code>` tags.
- Emoji code (e.g. `:smile:`, `:flag-gb:`, ...etc)  is converted to the corresponding Unicode character.
- Convert line breaks `\n` to `<br>` tags.
- Convert quotes (`> text`, `&gt; text` on log) to `<blockquote>` tags.
- Convert code block to `<pre>` tags.

### CLI

```shell
Usage:  slack-log2md [options]

Slack log file (JSON) to Markdown file.

Options:
  -i, --input <Path>          Directory path of the JSON file exported from Slack.
  -o, --output <Path>         Directory path to output Markdown file converted from JSON.
  -r, --report                Display the process reports, default is disable.
  --grouping-same-day-by-utc  Output Markdown grouped on the same day as UTC date.
  --github-wiki               Support output for GitHub Wiki. e.g. `general/2019-11-16.md` -> `slack-general-2019-11-16.md`
  --add-unique-message-id     Add unique identifier for a message. Set the time in the Time field to `<span id ="XXXX">21:34</span>`.
  --ignore-channel-login      Ignore channel login messages.
  -v, --version               output the version number
  -h, --help                  output usage information

Examples:
  $ slack-log2md -i ./logs -o ./dist -r

See also:
  https://github.com/akabekobeko/npm-slack-log2md
```

### Node.js API

#### slackLog2Md(src, dest, options)

Converts Slack log JSON in the specified workspace directory to Markdown.

Parameters:

|Parameter|Type|Default|Description|
|---|---|---|---|
|src|`String`||Directory path of log file exported from Slack.|
|dest|`String`||Directory path to output Markdown file converted from log. If a nonexistent directory is specified, the same location as `input` is selected.|
|options|`Options`|`{}`||

Options:

|Parameter|Type|Default|Description|
|---|---|---|---|
|report|`Boolean`|`false`|`true` to display the processing status of the tool to `stdout`.|
|groupingSameDayByUTC|`Boolean`|`false`|`true` if messages in the channel are grouped by the same day in UTC. If `false`, the group is the output log file unit.|
|githubWiki|`Boolean`|`false`|`true` if support output for GitHub Wiki. Single directory, all file names are unique, avoid conflicts with existing page names. e.g. `general/2019-11-16.md` -> `slack-general-2019-11-16.md`.|
|addUniqueMessageId|`Boolean`|`false`|Add unique identifier for a message. Set the time in the `Time` field to `<span id ="XXXX">21:34</span>`.|
|ignore.channelLogin|`Boolean`|`false`|Specifies the type of message to ignore.|

Sample code:

```js
const slackLog2Md = require('slack-log2md');

const options = {
  report: true,
  groupingSameDayByUTC: true,
  githubWiki: true,
  addUniqueMessageId: false,
  ignore: {
    channelLogin: true
  }
};

slackLog2Md('./logs', './dest', options).catch((err) => {
  console.error(err)
});
```

# ChangeLog

- [CHANGELOG](CHANGELOG.md)

# License

- [MIT](LICENSE.txt)
