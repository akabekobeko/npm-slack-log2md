# slack-log2md

[![Support Node of LTS](https://img.shields.io/badge/node-LTS-brightgreen.svg)](https://nodejs.org/)
[![npm version](https://badge.fury.io/js/slack-log2md.svg)](https://badge.fury.io/js/slack-log2md)
[![Build Status](https://travis-ci.org/akabekobeko/npm-slack-log2md.svg?branch=master)](https://travis-ci.org/akabekobeko/npm-slack-log2md)
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
|messages|
|---|
|![](https://example.com/24.png) **test** 13:43|
|`@test` has joined the channel|
|![](https://example.com/24.png) **test** 07:02|
|`@test` `#general` Sample message<br>Sample<br><br>Sample|
|**Sample Bot** 07:02|
|:flag-gb::  Sample message.|
```

- The message is output as a single column `<table>`
- The table header will be the Slack log JSON file name
- The message is output alternately with header (user and time) and body text
- If a profile image is set for the user, the URL is referenced and displayed.
- The user will use the display name if there is one, otherwise it will be the account name
- The time is always UTC
- `@user` and `#channel` in the body text enclose the target name in `<code>` tag.
- Line breaks `\n` in the body text are converted to `<br>` tags

### CLI



```shell
Usage:  slack-log2md [options]

Slack log file (JSON) to Markdown file.

Options:
  -i, --input <Path>   Directory path of the JSON file exported from Slack.
  -o, --output <Path>  Directory path to output Markdown file converted from JSON.
  -r, --report         Display the process reports, default is disable.
  -v, --version        output the version number
  -h, --help           output usage information

Examples:
  $ slack-log2md -i ./logs -o ./dist -r

See also:
  https://github.com/akabekobeko/npm-slack-log2md
```

### Node.js API

#### slackLog2Md(options)

Converts Slack log JSON in the specified workspace directory to Markdown.

Options:

|Property|Type|Description|
|---|---|---|
|src|`String`|Directory path of log file exported from Slack.|
|dest|`String`|Directory path to output Markdown file converted from log. If a nonexistent directory is specified, the same location as `input` is selected.|
|report|`Boolean`|`true` to display the processing status of the tool to `stdout`.|

Sample code:

```js
const slackLog2Md = require('slack-log2md');

const options = {
  input: './data',
  output: './dest',
  report: true
};

slackLog2Md(options).catch((err) => {
  console.error(err)
});
```

# ChangeLog

- [CHANGELOG](CHANGELOG.md)

# License

- [MIT](LICENSE.txt)
