import Queue from 'bull';
import { setTimeout } from 'timers/promises';
import sendOtp from '../helpers/sendOtp.js';

// Create a queue
const taskQueue = new Queue('email queue', process.env.REDIS_CLIENT, {
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
  },
});

// Define your processing function
const sendOtpLayer = async (job) => {
  const { to } = job.data;
  // Your email sending logic here
  sendOtp(to)
  console.log(`Sending email to ${to}`);
  // Simulate work with modern timers/promises
  await setTimeout(2000);
};

// Add processor
taskQueue.process( sendOtpLayer );

taskQueue.on('completed', (job) => {
  console.log(`Job ${job.id} completed`);
});

taskQueue.on('failed', (job, err) => {
  console.error(`Job ${job.id} failed:`, err);
});

// Create a delayable function (could also be an arrow function)
const sendOtpLater = (to) => {
  return taskQueue.add({ to });
};



export { sendOtpLater, taskQueue };