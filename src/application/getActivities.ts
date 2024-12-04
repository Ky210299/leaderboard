import { mongoPersistencyService, redisCacheService } from ".";
import { CacheService, PersistencyService } from "../domain";
import UseCases from "./useCases";

class GetActivities extends UseCases {
    constructor(persistenceService: PersistencyService, cacheService: CacheService) {
        if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid persistency instance');
        } else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid cache instance');
        }
        super(persistenceService, cacheService, null);
    }

    public async execute() {
        const cachedValue = await this.cache?.getActivities();
        if (cachedValue !== null) return cachedValue;
        const activities = await this.persistence?.findAllActivities();
        if (activities == null) return [];
        await this.cache?.saveActivities(activities);
        return activities;
    }
}

export const getActivities = new GetActivities(mongoPersistencyService, redisCacheService);
