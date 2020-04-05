const cron = require('node-cron');

function createHourlyCronJob(task, immediate = true) {
  const frequency = '0 */1 * * *';

  return immediate
    ? new ImmediateCronJob(frequency, task)
    : new CronJob(frequency, task);
}

class CronJob {

  constructor(frequency, task) {
    this.frequency = frequency;
    this.task = task;
    this.job = null;
  }

  start() {
    if (this.job) {
      throw new Error('Job has already started');
    }

    this.job = cron.schedule(this.frequency, this.task, { scheduled: false });

    this.job.start();
  }

  destroy() {
    if (this.job) {
      this.job.destroy();
    }
  }

}

class ImmediateCronJob extends CronJob {

  constructor(frequency, task) {
    super(frequency, task);
  }

  start() {
    if (this.job) {
      throw new Error('Job has already started');
    }

    this.task();

    super.start();
  }

}

module.exports = {
  createHourlyCronJob,
};
