import { Game, Leaderboard } from "../DTOs";

export default interface CachePort {
	getLeaderboardByGame: (gameId: Game["id"]) => Promise<Leaderboard>;
	updateLeaderboardByGame: (gameId: Game["id"]) => Promise<void>;
}
