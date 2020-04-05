const axios = require('axios')


module.exports.Dispatcher = class Dispatcher {
  constructor() {
    this.slack = axios.create({
      baseURL: 'https://hooks.slack.com/services',
      timeout: 30000,
    })
    const body = {
      text: "Connected",
    }
    this._sendToSlack(body);
  }

  async sendData(data) {
    const body = this._buildDataBody(data);
    return this._sendToSlack(body);
  }

  _sendToSlack(payload) {
    return this.slack.post(`${process.env.SLACK_URL}`, payload);
  }

  _buildDataBody(data) {
    const text = `\n🤢 ${data.confirmed}\t\n☠️ ${data.deaths}\t\n😎 ${data.recovered}`
    const body = {
      text
    }
    return body;
  }
}