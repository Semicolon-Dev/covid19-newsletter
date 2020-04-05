require('dotenv').config()

const { Dispatcher } = require('./dispatcher');
const { Covid19Service } = require('./data');
const { Cache } = require('./ezCache');
const { createHourlyCronJob } = require('./cron');

async function job() {
  try {
    const country = "Portugal";
    const service = new Covid19Service();
    const todayData = await service.getDataByCountryAndDate(country);

    if (!todayData) {
      console.log(`SKIP: No new data found.`)
      return;
    }

    console.log(`GOT DATA: ${JSON.stringify(todayData)}`);

    const cache = new Cache();

    if (cache.isHit(todayData)) {
      console.log(`SKIP: Notification already sent.`)
      return;
    }

    const dispatcher = new Dispatcher();

    console.log(`SENT DATA: ${JSON.stringify(todayData)}`);
    return dispatcher.sendToSlack(todayData);
  } catch (err) {
    console.error(err);
  }
}

(async function main() {
  const cronJob = createHourlyCronJob(job);

  try {
    cronJob.start();
  } catch (error) {
    cronJob.destroy();
    throw error;
  }
})();
