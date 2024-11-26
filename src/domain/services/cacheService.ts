import { Activity } from "../DTOs";
import CachePort from "../ports/cache";

export default class CacheService {
	private readonly cache: CachePort;
	constructor(cacheAdapter: CachePort) {
		this.cache = cacheAdapter;
	}

	public async saveLeaderboardByGameId(gameId: Activity["id"]) {
		return;
	}

	public async getLeaderboardByGame(gameId: Activity["id"]) {
		return;
	}
}
