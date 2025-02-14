const { scheduleReminder } = require('../../services/scheduler');
const ActionableStep = require('../../models/ActionableStep');
const { default: mongoose } = require('mongoose');

describe('Scheduler Integration', () => {
  it('should schedule new reminder', async () => {
    const step = new ActionableStep({
      patientId: new mongoose.Types.ObjectId(),
      noteId: new mongoose.Types.ObjectId(),
      type: 'plan',
      description: 'Take medication',
      schedule: new Date(Date.now() + 1000), // 1 second from now
      totalRepeats: 7
    });

    await step.save();
    const job = await scheduleReminder(step);

    expect(job).toBeDefined();
    expect(typeof job.cancel).toBe('function');
  });

 it('should handle missed check-ins', async () => {
  const step = new ActionableStep({
    patientId: new mongoose.Types.ObjectId(),
    noteId: new mongoose.Types.ObjectId(),
    type: 'plan',
    description: 'Take medication',
    schedule: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    totalRepeats: 7,
    repeatCount: 0
  });

  await step.save();

  // Directly trigger the reminder job without waiting for the real time passage
  await scheduleReminder(step);

  const updatedStep = await ActionableStep.findById(step._id);
  expect(updatedStep.repeatCount).toBe(1);
});


jest.mock('node-schedule', () => ({
  scheduleJob: jest.fn((date, callback) => {
    // Immediately invoke the callback for testing
    setImmediate(callback);
  }),
}));

it('should handle missed check-ins', async () => {
  const step = new ActionableStep({
    patientId: new mongoose.Types.ObjectId(),
    noteId: new mongoose.Types.ObjectId(),
    type: 'plan',
    description: 'Take medication',
    schedule: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    totalRepeats: 7,
    repeatCount: 0
  });

  await step.save();
  await scheduleReminder(step);  // Trigger the scheduled reminder

  const updatedStep = await ActionableStep.findById(step._id);
  expect(updatedStep.repeatCount).toBe(1);  // Ensure repeatCount has been updated
});

});