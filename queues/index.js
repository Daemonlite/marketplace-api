import Queue from "bull";
import { setTimeout } from "timers/promises";
import sendOtp from "../helpers/sendOtp.js";
import { uploadImage } from "../helpers/uploadImage.js";

// Queue configuration
const queueOptions = {
  redis: process.env.REDIS_CLIENT,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 1000,
    },
  },
};

// Create separate queues
const otpQueue = new Queue("otp-queue", queueOptions);
const uploadQueue = new Queue("upload-queue", queueOptions);

// OTP Processor
const sendOtpLayer = async (job) => {
  try {
    const { to } = job.data;
    await sendOtp(to);
    console.log(`OTP sent to ${to}`);
    return { status: "success" };
  } catch (error) {
    console.error(`OTP send failed for ${job.data.to}:`, error);
    throw error; // Will trigger retry
  }
};

// Image Upload Processor
const uploadImageLayer = async (job) => {
  try {
    const { file } = job.data;
    const result = await uploadImage(file);
    console.log(`Image uploaded: ${result.url}`);
    return result;
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error;
  }
};

// Register processors with concurrency
otpQueue.process(5, sendOtpLayer); // Process up to 5 OTP jobs concurrently
uploadQueue.process(2, uploadImageLayer); // Process up to 2 uploads concurrently

// Event listeners for both queues
const registerQueueEvents = (queue) => {
  queue.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
  });

  queue.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed:`, err);
  });

  queue.on("error", (err) => {
    console.error("Queue error:", err);
  });
};

registerQueueEvents(otpQueue);
registerQueueEvents(uploadQueue);

// Job adders
const sendOtpLater = (to) => {
  return otpQueue.add({ to });
};

const uploadImageLater = (file) => {
  return uploadQueue.add({ file });
};

// Graceful shutdown
const cleanup = async () => {
  await Promise.all([
    otpQueue.close(),
    uploadQueue.close(),
  ]);
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);

export { sendOtpLater, uploadImageLater, otpQueue, uploadQueue };