import slackLog2Md from 'slack-log2md'

const options = {
  input: './data',
  output: './dest',
  report: true
}

slackLog2Md(options).catch((err) => {
  console.error(err)
})
