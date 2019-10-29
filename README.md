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

### API

#### slackLog2Md(src, dest)

Converts Slack log JSON in the specified workspace directory to Markdown.

|Argument|Type|Description|
|---|---|---|
|src|`String`|Directory path of log file exported from Slack.|
|dest|`String`|Directory path to output Markdown file converted from log. If a nonexistent directory is specified, the same location as `input` is selected.|

Sample code:

```js
const slackLog2Md = require('slack-log2md');
slackLog2Md('./logs', './output');
```

# ChangeLog

- [CHANGELOG](CHANGELOG.md)

# License

- [MIT](LICENSE.txt)
