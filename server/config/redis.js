const Redis = require('ioredis');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Main redis client for caching and general ops
const redisClient = new Redis(redisUrl, {
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  }
});

redisClient.on('connect', () => {
    console.log('Redis Client Connected');
});

redisClient.on('error', (err) => {
    console.error('Redis Client Error', err);
});

// Separate redis client for Pub/Sub connections
const redisPubSub = new Redis(redisUrl, {
  retryStrategy(times) {
    return Math.min(times * 50, 2000);
  }
});

redisPubSub.on('connect', () => {
    console.log('Redis Pub/Sub Connected');
});

module.exports = {
  redisClient,
  redisPubSub
};
