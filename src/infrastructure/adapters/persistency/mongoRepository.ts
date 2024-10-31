import { MongoClient, ObjectId } from "mongodb";
import { Repository } from "../../../domain";
import { Game, Player, Score } from "../../../domain/DTOs";
import { UPDATE_SCORE_OPTIONS_TYPES, UpdateScoreOptions } from "../../../domain/ports/repository";

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_HOST || !MONGO_DB) {
	throw new Error("Bad MongoDB Credentials");
}

export const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT || 27017}`;

const MONGO_COLLECTIONS = {
	SCORES: "scores",
	PLAYERS: "players",
	GAMES: "games",
	LEADERBOARD: "leaderboard",
};

type MongoScore = {
	id: ObjectId;
	playerId: MongoPlayer["id"];
	score: number;
	gameId: MongoGame["id"];
};
type MongoPlayer = { id: ObjectId; nickname: string };
type MongoGame = { id: ObjectId; title: string; plataform?: string };

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

	public async updateScore(playerId: Player["id"], gameId: Game["id"], option: UpdateScoreOptions) {
		const { type, value } = option;
		let cursor = this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.SCORES);

		const currentScore = (await cursor.findOne({ playerId, gameId })) as unknown as Score;
		if (!currentScore) throw new Error("Not score found");

		switch (type) {
			case UPDATE_SCORE_OPTIONS_TYPES.ADD: {
				try {
					await cursor.findOneAndUpdate(
						{ playerId, gameId },
						{ $set: { score: currentScore.score + value } },
						{ returnDocument: "after" },
					);
				} catch (err) {}
			}
			case UPDATE_SCORE_OPTIONS_TYPES.SUBTRACT: {
				try {
					await cursor.findOneAndUpdate(
						{ playerId, gameId },
						{ $set: { score: currentScore.score - value } },
						{ returnDocument: "after" },
					);
				} catch (err) {}
			}
			case UPDATE_SCORE_OPTIONS_TYPES.SET:
				{
					try {
						await cursor.findOneAndUpdate(
							{ playerId, gameId },
							{ $set: { score: value } },
							{ returnDocument: "after" },
						);
					} catch (err) {}
				}
				const newScore = await cursor.findOne({ playerId, gameId });
				if (!newScore) throw new Error("Error retrieving score");
				return { playerId, gameId, score: newScore.score };
		}
	}

	public async addGame(game: Omit<Game, "id">) {
		try {
			const newGame = await this.mongo
				.db(MONGO_DB)
				.collection(MONGO_COLLECTIONS.GAMES)
				.insertOne(game);
			const foundGame = await this.mongo
				.db(MONGO_DB)
				.collection(MONGO_COLLECTIONS.GAMES)
				.findOne({ _id: newGame.insertedId });
			if (!foundGame) throw new Error("Error adding game");
			return { title: foundGame.title, id: foundGame._id.toString() };
		} catch (err) {
			throw err;
		}
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

	public async addPlayer(player: Omit<Player, "id">) {
		const cursor = this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.PLAYERS);

		const newPlayerRef = await cursor.insertOne(player);

		const newPlayer = await cursor.findOne({ _id: newPlayerRef.insertedId });
		if (!newPlayer) throw new Error("Error retrieving player after inserted");

		return { id: newPlayer._id.toString(), nickname: newPlayer.nickname };
	}

	public async findPlayer(playerId: Player["id"]) {
		const cursor = this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.PLAYERS);
		const player = await cursor.findOne({ _id: new ObjectId(playerId) });
		if (!player) throw new Error("Not player found");
		return { id: player._id.toString(), nickname: player.nickname };
	}
	public async getGame(gameId: Game["id"]) {
		return await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.GAMES)
			.findOne({ _id: new ObjectId(gameId) });
	}
	public async findPlayerScoreByGame(playerId: Player["id"], gameId: Game["id"]) {
		const cursor = this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.SCORES);
		const score = await cursor.findOne({
			playerId: new ObjectId(playerId),
			gameId: new ObjectId(gameId),
		});

		if (!score) throw new Error("Not score found");
		return { id: score._id.toString(), playerId, gameId, score: score.score };
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
