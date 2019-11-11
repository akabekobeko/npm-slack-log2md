import slackLog2Md, { Options } from 'slack-log2md'

const options: Options = {
  input: './vivlio',
  output: './dest',
  report: true,
  groupingSameDayByUTC: true,
  ignore: {
    channelLogin: true
  }
}

slackLog2Md(options).catch((err) => {
  console.error(err)
})
