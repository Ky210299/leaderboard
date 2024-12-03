import { Activity, Leaderboard, Participant } from "../DTOs";
import CachePort from "../ports/cache";

export default class CacheService {
    private readonly cache: CachePort;
    constructor(cacheAdapter: CachePort) {
        this.cache = cacheAdapter;
    }

    public async saveLeaderboardOfActivity(activityId: Activity["id"], leaderboard: Leaderboard) {
        const cacheKey = `leaderboard-${activityId}`;
        const exp = 10; // 10 sec;
        await this.cache.save(cacheKey, leaderboard, exp);
    }

    public async getLeaderboardOfActivity(activityId: Activity["id"]) {
        const cacheKey = `leaderboard-${activityId}`;
        const value = await this.cache.get(cacheKey);
        return value;
    }

    public async getParticipants() {
        const value = await this.cache.get("participants");
        return value;
    }

    public async saveParticipants(participants: Participant[]) {
        await this.cache.save("participants", participants);
    }

    public async delete(cacheKey: string) {
        await this.cache.delete(cacheKey);
    }
}
