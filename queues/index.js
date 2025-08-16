import Queue from "bull";
import { setTimeout } from "timers/promises";
import sendOtp from "../helpers/sendOtp.js";
import requestService from "../helpers/requestService.js";
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
const serviceRequestQueue = new Queue("service-request-queue", queueOptions);

// Processors
const sendOtpLayer = async (job) => {
  try {
    const { to } = job.data;
    await sendOtp(to);
    console.log(`OTP sent to ${to}`);
    return { status: "success", recipient: to };
  } catch (error) {
    console.error(`OTP send failed for ${job.data.to}:`, error.message);
    throw new Error(`Failed to send OTP: ${error.message}`);
  }
};

const uploadImageLayer = async (job) => {
  try {
    const { file, uploadOptions } = job.data;
    const result = await uploadImage(file, uploadOptions);
    console.log(`Image uploaded: ${result.url}`);
    return result;
  } catch (error) {
    console.error("Image upload failed:", error.message);
    throw new Error(`Image upload failed: ${error.message}`);
  }
};

const serviceRequestLayer = async (job) => {
  try {
    const { email, requester, service } = job.data;
    await requestService(email, requester, service);
    console.log(`Service request sent to ${email}`);
    return { 
      status: "success",
      recipient: email,
      service,
      requester
    };
  } catch (error) {
    console.error(`Service request failed for ${job.data.email}:`, error.message);
    throw new Error(`Service request failed: ${error.message}`);
  }
};

// Register processors with concurrency
otpQueue.process(5, sendOtpLayer);
uploadQueue.process(2, uploadImageLayer);
serviceRequestQueue.process(1, serviceRequestLayer);

// Enhanced queue event listener
const registerQueueEvents = (queue) => {
  queue.on("completed", (job, result) => {
    console.log(`Job ${job.id} completed`, result);
    job.remove(); // Optional: clean up completed jobs
  });

  queue.on("failed", (job, err) => {
    console.error(`Job ${job.id} failed after ${job.attemptsMade} attempts:`, err.message);
    // Could add logic to notify admin after final failure
  });

  queue.on("waiting", (jobId) => {
    console.log(`Job ${jobId} is waiting`);
  });

  queue.on("active", (job) => {
    console.log(`Job ${job.id} is now active`);
  });

  queue.on("error", (err) => {
    console.error("Queue error:", err.message);
  });
};

registerQueueEvents(otpQueue);
registerQueueEvents(uploadQueue);
registerQueueEvents(serviceRequestQueue);

// Job adders with additional options
const sendOtpLater = (to, options = {}) => {
  return otpQueue.add({ to }, options);
};

const uploadImageLater = (file, uploadOptions = {}, jobOptions = {}) => {
  return uploadQueue.add({ file, uploadOptions }, jobOptions);
};

const requestServiceLater = (email, requester, service, options = {}) => {
  return serviceRequestQueue.add({ email, requester, service }, options);
};

// Enhanced cleanup
const cleanup = async () => {
  try {
    console.log("Closing queues gracefully...");
    await Promise.allSettled([
      otpQueue.close(),
      uploadQueue.close(),
      serviceRequestQueue.close(),
    ]);
    console.log("All queues closed");
  } catch (error) {
    console.error("Error during cleanup:", error.message);
    process.exit(1);
  }
};

process.on("SIGTERM", cleanup);
process.on("SIGINT", cleanup);

export { 
  sendOtpLater, 
  uploadImageLater,
  requestServiceLater,
};