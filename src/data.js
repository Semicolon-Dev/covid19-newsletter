const axios = require('axios');

// CREDITS: https://github.com/pomber/covid19
const JSON_URL = 'https://pomber.github.io/covid19';

module.exports.Covid19Service = class Covid19Service {
  api;

  constructor() {
    this.api = axios.create({
      baseURL: JSON_URL,
      timeout: 30000,
    })
  }

  async getAll() {
    const { data } = await this.api.get('/timeseries.json');
    return data;
  }

  async getDataByCountry(country) {
    const data = await this.getAll();
    const countryData = data[country];
    return countryData;
  }

  async getDataByDate(date) {
    // TODO
  }

  async getDataByCountryAndDate(country, date = Date.now()) {
    const countryData = await this.getDataByCountry(country);
    const formattedDate = this._getFormattedDate(date);

    const countryDataForDate = countryData.find(this._hasDataForDay(formattedDate));

    return countryDataForDate;
  }

  _getFormattedDate = (rawDate) => {
    const _date = new Date(rawDate);
    const formattedDate = this._formatDate(_date);
    return formattedDate;
  }

  _formatDate = (date) => {
    const year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(date);
    const month = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(date);
    const day = new Intl.DateTimeFormat('en', { day: 'numeric' }).format(date);

    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate;
  }

  _hasDataForDay = (day) => (data) => {
    return data.date === day;
  }
}