import { mongoPersistencyService, redisCacheService } from ".";
import { CacheService, PersistencyService } from "../domain";
import { Activity } from "../domain/DTOs";
import UseCases from "./useCases";

class GetLeaderboard extends UseCases {
    constructor(persistenceService: PersistencyService, cacheService: CacheService) {
        if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid persistency instance');
        } else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid cache instance');
        }
        super(persistenceService, cacheService);
    }

    async execute(activityId: Activity["id"]) {
        const cachedValue = await this.cache?.getLeaderboardOfActivity(activityId);
        if (cachedValue !== null) return cachedValue;
        const leaderboard = await this.persistence?.findScoresByActivity(activityId);
        if (!leaderboard) return [];
        await this.cache?.saveLeaderboardOfActivity(activityId, leaderboard);
        return leaderboard;
    }
}

export const getLeaderboard = new GetLeaderboard(mongoPersistencyService, redisCacheService);
