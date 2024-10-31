import { Game, Leaderboard } from "../DTOs";

export default interface CachePort {
	getLeaderboardByGame: (game: Game["id"]) => Promise<Leaderboard>;
	updateLeaderboardByGame: (game: Game["id"]) => Promise<void>;
}
