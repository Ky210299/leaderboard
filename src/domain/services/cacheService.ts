import { Game } from "../DTOs";
import CachePort from "../ports/cache";

export default class CacheService {
	private readonly cache: CachePort;
	constructor(cacheAdapter: CachePort) {
		this.cache = cacheAdapter;
	}

	public async saveLeaderboardByGameId(gameId: Game["id"]) {
		return await this.cache.updateLeaderboardByGame(gameId);
	}

	public async getLeaderboardByGame(gameId: Game["id"]) {
		return await this.cache.getLeaderboardByGame(gameId);
	}
}
