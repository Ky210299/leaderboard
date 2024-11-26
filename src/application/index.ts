import { PersistencyService, CacheService } from "../domain";
import MongoRepository from "../infrastructure/adapters/persistency/mongoRepository";
import RedisCache from "../infrastructure/adapters/cache/redis";

const mongo = new MongoRepository();
const redis = new RedisCache();

export const mongoPersistencyService = new PersistencyService(mongo);
export const redisCacheService = new CacheService(redis);
