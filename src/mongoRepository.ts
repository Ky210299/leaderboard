import { MongoClient } from "mongodb";

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_HOST || !MONGO_DB) {
	throw new Error("Bad Credentials");
}

const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT || 27017}`;

const MONGO_COLLECTIONS = {
	SCORES: "scores",
	PLAYERS: "players",
	GAMES: "games",
	LEADERBOARD: "leaderboard",
};

type Score = {
	playerId: string;
	score: number;
	gameId: Game["id"];
};
type Player = { id: string; nickname: string };
type Game = { id: string; title: string; plataform?: string };

export class MongoRepository {
	private readonly mongo;

	constructor() {
		this.mongo = new MongoClient(mongo_url);
		(async () => {
			try {
				await this.init();
			} catch (err) {
				console.log("error instantiating mongo ", err);
			}
		})();
	}
	private async init() {
		await this.mongo.connect();
		const dbStats = await this.mongo.db(MONGO_DB).stats();
		console.log("stats: ", dbStats);
	}

	public async addGame(game: Game) {
		return await this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.GAMES).insertOne(game);
	}
	public async saveScore(score: Score) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.insertOne({ ...score, lastUpdate: new Date() });
	}

	public async savePlayer(player: Player) {
		return await this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.PLAYERS).insertOne(player);
	}

	public async getLeaderboard(gameId: Game["id"]) {
		const result = this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.aggregate([
				{
					$match: {
						gameId: gameId,
					},
				},
				{
					$setWindowFields: {
						sortBy: {
							score: -1,
						},
						output: {
							rank: { $rank: {} },
						},
					},
				},
				{
					$lookup: {
						from: MONGO_COLLECTIONS.PLAYERS,
						localField: "playerId",
						foreignField: "id",
						as: "player",
					},
				},
				{
					$lookup: {
						from: MONGO_COLLECTIONS.GAMES,
						localField: "gameId",
						foreignField: "id",
						as: "game",
					},
				},
				{ $unwind: "$player" },
				{ $unwind: "$game" },
				{
					$project: {
						_id: 0,
						rank: 1,
						"player.nickname": 1,
						score: 1,
						"game.title": 1,
					},
				},
			])
			.toArray();
		return result;
	}
}

export const mongo = new MongoRepository();
