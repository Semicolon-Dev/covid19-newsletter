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
    const dispatcher = new Dispatcher();
    const cache = new Cache();

    if (!todayData) {
      console.log(`SKIP: No new data found.`)
      return;
    }

    console.log(`GOT DATA: ${JSON.stringify(todayData)}`);

    if (cache.isHit(todayData)) {
      console.log(`SKIP: Notification already sent.`)
      return;
    }


    console.log(`SENT DATA: ${JSON.stringify(todayData)}`);
    return dispatcher.sendToSlack(todayData);
  } catch (err) {
    console.error(err);
  }
}

(async function main() {
  const cronJob = createHourlyCronJob(job);

  // try {
  //   cronJob.start();
  //   console.log("STARTED JOB.");
  // } catch (error) {
  //   cronJob.destroy();
  //   console.log(`DESTROYED JOB: ${error}`);
  //   throw error;
  // }

  // Keep alive
  setInterval(() => {
    console.log("HEALTH CHECK")
    job()
  }, 60000);
})();
