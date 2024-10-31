import { Game, Player, Score } from "../DTOs";

const UPDATE_SCORE_OPTIONS_TYPES = {
	ADD: "add",
	SUBSTRACT: "sub",
	SET: "set",
} as const;

type UpdateScoreOptions =
	| { type: typeof UPDATE_SCORE_OPTIONS_TYPES.ADD; value: number }
	| { type: typeof UPDATE_SCORE_OPTIONS_TYPES.SUBSTRACT; value: number }
	| { type: typeof UPDATE_SCORE_OPTIONS_TYPES.SET; value: number };

export default interface Repository {
	addPlayer: (player: Omit<Player, "id">) => Promise<Player>;
	addGame: (game: Omit<Game, "id">) => Promise<Game>;
	updateScore: (
		playerId: Player["id"],
		gameId: Game["id"],
		newScore: UpdateScoreOptions,
	) => Promise<Score>;
	findPlayer: (playerId: Player["id"]) => Promise<Player>;
	findPlayerScores: (playerId: Player["id"]) => Promise<Score[]>;
	findPlayerScoreByGame: (playerId: Player["id"], gameId: Game["id"]) => Promise<Score>;
	deletePlayerById: (playerId: Player["id"]) => Promise<void>;
	deleteGameById: (gameId: Game["id"]) => Promise<void>;
}
