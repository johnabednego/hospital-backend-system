const schedule = require('node-schedule');
const ActionableStep = require('../models/ActionableStep');

const scheduleReminder = async (step) => {
  const job = schedule.scheduleJob(step.schedule, async () => {
    if (!step.completed) {
      step.repeatCount += 1;
      if (step.repeatCount <= step.totalRepeats) {
        // Reschedule for next day
        step.schedule.setDate(step.schedule.getDate() + 1);
        await step.save();
        scheduleReminder(step);
      }
    }
  });

  return job;
};

module.exports = { scheduleReminder };