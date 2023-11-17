import RedisStore from 'connect-redis';
import { createClient } from 'redis';

function setupRedisStore(): RedisStore {
    const redisClient = createClient();
    redisClient.connect().catch(console.error);
    return new RedisStore({
        client: redisClient,
        disableTouch: true,
    });
}

export { setupRedisStore };
