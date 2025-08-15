import { createClient } from 'redis';


// Create Redis client
const redisClient = createClient({
  url: process.env.REDIS_CLIENT, // Default connection string
});

// Handle connection errors
redisClient.on('error', (err) => {
  console.error('Redis Client Error', err);
});

// Connect to Redis
await redisClient.connect();


export default redisClient