import slackLog2Md, { Options } from 'slack-log2md'

const options: Options = {
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
