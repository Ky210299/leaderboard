import { Leaderboard } from "../DTOs";

export default interface CachePort {
	getLeaderboard: () => Promise<Leaderboard>;
	updateLeaderboard: () => Promise<void>;
}
