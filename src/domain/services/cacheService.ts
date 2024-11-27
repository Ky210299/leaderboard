import { Activity, Leaderboard, Participant } from "../DTOs";
import CachePort from "../ports/cache";

export default class CacheService {
	private readonly cache: CachePort;
	constructor(cacheAdapter: CachePort) {
		this.cache = cacheAdapter;
	}

	public async saveLeaderboardOfActivity(activityId: Activity["id"], leaderboard: Leaderboard) {
		const exp = 10 * 1000; // 10 sec;
		await this.cache.save(activityId, leaderboard, exp);
	}

	public async getLeaderboardOfActivity(activityId: Activity["id"]) {
		const value = await this.cache.get(activityId);
		return value;
	}

	public async getParticipants() {
		const value = await this.cache.get("participants");
		return value;
	}

	public async saveParticipants(participants: Participant[]) {
		await this.cache.save("participants", participants);
	}
}
