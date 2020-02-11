const slackLog2Md = require('slack-log2md')

const options = {
  report: true,
  groupingSameDayByUTC: true,
  githubWiki: true,
  ignore: {
    channelLogin: true
  }
}

slackLog2Md('./data', './dest', options).catch((err) => {
  console.error(err)
})
