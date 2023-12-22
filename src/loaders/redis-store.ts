import RedisStore from 'connect-redis';
import Redis from 'ioredis';

function setupRedisStore(): RedisStore {
    const redisClient = new Redis();

    return new RedisStore({
        client: redisClient,
        disableTouch: true,
    });
}

export { setupRedisStore };
