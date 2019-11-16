import slackLog2Md, { Options } from 'slack-log2md'

const options: Options = {
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
