const Redis = require('ioredis');
const EventEmitter = require('events');

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Check if we have a valid Redis TCP URL (must start with redis:// or rediss://)
const isValidRedisUrl = redisUrl.startsWith('redis://') || redisUrl.startsWith('rediss://');

// Detect if using TLS (Upstash uses rediss://)
const useTLS = redisUrl.startsWith('rediss://');

// In-memory fallback when Redis is unavailable
class MockRedisClient extends EventEmitter {
  constructor(name) {
    super();
    this._cache = new Map();
    this._name = name;
    console.warn(`⚠️  ${name}: Using in-memory fallback (no Redis connection)`);
    // Emit connect event asynchronously so listeners can be attached
    setTimeout(() => this.emit('connect'), 0);
  }
  async get(key) { return this._cache.get(key) || null; }
  async set(key, value) { this._cache.set(key, value); return 'OK'; }
  async setex(key, ttl, value) { this._cache.set(key, value); setTimeout(() => this._cache.delete(key), ttl * 1000); return 'OK'; }
  async del(key) { this._cache.delete(key); return 1; }
  async publish() { return 0; }
  async subscribe() { return; }
  async unsubscribe() { return; }
  on(event, fn) { super.on(event, fn); return this; }
  async connect() { return; }
  async quit() { return; }
}

let redisClient;
let redisPubSub;

if (isValidRedisUrl) {
  const commonOpts = {
    retryStrategy(times) {
      if (times > 5) return null;
      return Math.min(times * 500, 3000);
    },
    maxRetriesPerRequest: 3,
    lazyConnect: true,
    ...(useTLS ? { tls: { rejectUnauthorized: false } } : {})
  };

  redisClient = new Redis(redisUrl, { ...commonOpts });
  redisPubSub = new Redis(redisUrl, { ...commonOpts });

  redisClient.on('connect', () => console.log('✅ Redis Client Connected'));
  redisClient.on('error', (err) => console.error('Redis Client Error:', err.message));

  redisPubSub.on('connect', () => console.log('✅ Redis Pub/Sub Connected'));
  redisPubSub.on('error', (err) => console.error('Redis Pub/Sub Error:', err.message));

  // Attempt non-blocking connection
  (async () => {
    try { await redisClient.connect(); } catch (e) {
      console.warn('⚠️  Redis Client connection failed, switching to in-memory fallback');
      redisClient = new MockRedisClient('Redis Client');
    }
    try { await redisPubSub.connect(); } catch (e) {
      console.warn('⚠️  Redis Pub/Sub connection failed, switching to in-memory fallback');
      redisPubSub = new MockRedisClient('Redis Pub/Sub');
    }
  })();
} else {
  console.warn('⚠️  REDIS_URL is not a valid redis:// or rediss:// URL. Using in-memory fallback.');
  console.warn('   To connect to Upstash Redis, set REDIS_URL=rediss://default:PASSWORD@endpoint.upstash.io:6379');
  redisClient = new MockRedisClient('Redis Client');
  redisPubSub = new MockRedisClient('Redis Pub/Sub');
}

module.exports = {
  get redisClient() { return redisClient; },
  get redisPubSub() { return redisPubSub; }
};
