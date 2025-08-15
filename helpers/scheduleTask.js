import cron from "node-cron";
import Task from "../models/Task.js";
import sendMail from "./sendMail.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read email template
const emailTemplatePath = path.join(
  __dirname,
  "..",
  "templates",
  "task-reminder.html"
);

const emailTemplate = fs.readFileSync(emailTemplatePath, "utf-8");

// Function to check and send scheduled task reminders

const checkScheduledTasks = async () => {
  console.log("Checking scheduled tasks...");
}


const startTaskScheduler = () => {
  cron.schedule("*/10 * * * *", checkScheduledTasks);
  console.log("Task reminder scheduler started (every 10 minutes)");
};


export default startTaskScheduler;