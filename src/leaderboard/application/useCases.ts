import { mongoPersistencyService, redisCacheService } from ".";
import { CacheService, PersistencyService } from "../domain";

export default class UseCases {
    protected readonly persistence: PersistencyService | null;
    protected readonly cache: CacheService | null;

    constructor(persistenceService: PersistencyService | null, cacheService: CacheService | null) {
        this.persistence = persistenceService || null;
        this.cache = cacheService || null;
    }

    protected static isValidPersistencyServiceInstance(instance: any) {
        return instance != null && instance instanceof PersistencyService;
    }
    protected static isValidCacheServiceInstance(instance: any) {
        return instance != null && instance instanceof CacheService;
    }

    protected havePersistency() {
        return this.persistence != null;
    }
    protected haveCache() {
        return this.cache != null;
    }
}
