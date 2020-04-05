const axios = require('axios')


module.exports.Dispatcher = class Dispatcher {
  constructor() {
    this.slack = axios.create({
      baseURL: 'https://hooks.slack.com/services',
      timeout: 30000,
    })
  }

  async sendToSlack(data) {
    const body = this.buildBody(data);
    return this.slack.post(`${process.env.SLACK_URL}`, body)
  }

  buildBody(data) {
    const text = `\n🤢 ${data.confirmed}\t\n☠️ ${data.deaths}\t\n😎 ${data.recovered}`
    const body = {
      text
    }
    return
  }
}