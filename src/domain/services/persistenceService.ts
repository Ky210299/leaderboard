import { Game, Player } from "../DTOs";
import Repository, { UPDATE_SCORE_OPTIONS_TYPES } from "../ports/repository";

export default class PersistencyService {
	private readonly persistency: Repository;

	constructor(persistency: Repository) {
		this.persistency = persistency;
	}

	public addPlayer(player: Omit<Player, "id">) {
		return this.persistency.addPlayer(player);
	}

	public addGame(game: Omit<Game, "id">) {
		return this.persistency.addGame(game);
	}

	public addToScore(playerId: Player["id"], gameId: Game["id"], amount: number) {
		return this.persistency.updateScore(playerId, gameId, {
			type: UPDATE_SCORE_OPTIONS_TYPES.ADD,
			value: amount,
		});
	}

	public subtractToScore(playerId: Player["id"], gameId: Game["id"], amount: number) {
		return this.persistency.updateScore(playerId, gameId, {
			type: UPDATE_SCORE_OPTIONS_TYPES.SUBTRACT,
			value: amount,
		});
	}

	public setScore(playerId: Player["id"], gameId: Game["id"], amount: number) {
		return this.persistency.updateScore(playerId, gameId, {
			type: UPDATE_SCORE_OPTIONS_TYPES.SET,
			value: amount,
		});
	}

	public findPlayerById(playerId: Player["id"]) {
		return this.persistency.findPlayer(playerId);
	}

	public findScoresOfPlayerById(playerId: Player["id"]) {
		return this.persistency.findPlayerScores(playerId);
	}

	public findScoreOfPlayerInGame(playerId: Player["id"], gameId: Game["id"]) {
		return this.persistency.findPlayerScoreByGame(playerId, gameId);
	}

	public deleteGameById(gameId: Game["id"]) {
		return this.persistency.deleteGameById(gameId);
	}

	public deletePlayerById(playerId: Player["id"]) {
		return this.persistency.deletePlayerById(playerId);
	}
}
