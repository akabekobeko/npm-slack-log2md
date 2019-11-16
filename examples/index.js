const slackLog2Md = require('slack-log2md')

const options = {
  input: './data',
  output: './dest',
  report: true,
  groupingSameDayByUTC: true,
  githubWiki: false,
  ignore: {
    channelLogin: true
  }
}

slackLog2Md(options).catch((err) => {
  console.error(err)
})
