import { MongoClient, ObjectId } from "mongodb";
import { Repository } from "../../../domain";

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_HOST || !MONGO_DB) {
	throw new Error("Bad Credentials");
}

export const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT || 27017}`;

const MONGO_COLLECTIONS = {
	SCORES: "scores",
	PLAYERS: "players",
	GAMES: "games",
	LEADERBOARD: "leaderboard",
};

export type Score = {
	id: ObjectId;
	playerId: Player["id"];
	score: number;
	gameId: Game["id"];
};
export type Player = { id: ObjectId; nickname: string };
export type Game = { id: ObjectId; title: string; plataform?: string };

export default class MongoRepository implements Repository {
	private readonly mongo;

	constructor() {
		this.mongo = new MongoClient(mongo_url);
		this.init()
			.then((data) => console.log("Mongo Client connected: \n\t", data))
			.catch((err) => console.log("Error connecting Mongo, \n\t", err));
	}

	private async init() {
		await this.mongo.connect();
		const dbStats = await this.mongo.db(MONGO_DB).stats();
		console.log("\tMongo db statistics:\n\t", dbStats);
	}

	public async existGame(gameId: Game["id"]) {
		if (!gameId) throw new Error("Undefined id");
		const game = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.GAMES)
			.findOne({ _id: new ObjectId(gameId) });
		return game !== null;
	}
	public async existPlayer(playerId: Player["id"]) {
		const player = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.PLAYERS)
			.findOne({ _id: new ObjectId(playerId) });
		return player !== null;
	}
	public async existScore(playerId: Player["id"], gameId: Game["id"]) {
		const score = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.findOne({ playerId, gameId });
		return score !== null;
	}

	public async updateGame(gameId: Game["id"], newGameData: Partial<Game>) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.GAMES)
			.findOneAndUpdate(
				{ _id: new ObjectId(gameId) },
				{ $set: newGameData },
				{ returnDocument: "after" },
			);
	}

	public async updatePlayer(playerId: Player["id"], newPlayerData: Partial<Player>) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.PLAYERS)
			.findOneAndUpdate({ id: playerId }, { $set: newPlayerData }, { returnDocument: "after" });
	}

	public async updateScore(playerId: Player["id"], gameId: Game["id"], newScore: Score["score"]) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.findOneAndUpdate(
				{ playerId, gameId },
				{ $set: { score: newScore } },
				{ returnDocument: "after" },
			);
	}

	public async addGame(game: Omit<Game, "id">) {
		const newGame = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.GAMES)
			.insertOne(game);
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.GAMES)
			.findOne({ _id: newGame.insertedId });
	}

	public async saveScore(score: Omit<Score, "id">) {
		const newScore = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.insertOne({ ...score, lastUpdate: new Date() });
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.findOne({ _id: newScore.insertedId });
	}

	public async savePlayer(player: Omit<Player, "id">) {
		const newPlayer = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.PLAYERS)
			.insertOne(player);
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.PLAYERS)
			.findOne({ _id: newPlayer.insertedId });
	}

	public async getPlayer(playerId: Player["id"]) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.PLAYERS)
			.findOne({ _id: new ObjectId(playerId) });
	}
	public async getGame(gameId: Game["id"]) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.GAMES)
			.findOne({ _id: new ObjectId(gameId) });
	}
	public async getScore(playerId: Player["id"], gameId: Game["id"]) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.findOne({ playerId: new ObjectId(playerId), gameId: new ObjectId(gameId) });
	}

	public async getLeaderboardByGame(gameId: Game["id"]) {
		const result = this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.SCORES)
			.aggregate([
				{
					$match: {
						gameId: new ObjectId(gameId),
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
						_id: 1,
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
