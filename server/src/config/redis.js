import { createClient } from 'redis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

console.log('🔍 Connecting to Redis:', redisUrl.replace(/:[^:@]+@/, ':****@'));

export const redis = createClient({
  url: redisUrl,
  socket: {
    // ElastiCache-specific settings
    tls: false, // Set to true if using TLS/SSL
    connectTimeout: 10000,
  },
});

redis.on('error', (err) => {
  console.error('❌ Redis error:', err);
});

redis.on('connect', () => {
  console.log('🔌 Redis connecting...');
});

redis.on('ready', () => {
  console.log('✅ Redis connected and ready');
});

redis.on('end', () => {
  console.warn('⚠️  Redis connection ended');
});

// Connect
export async function connectRedis() {
    await redis.connect();
    console.log("Redis connected");
}