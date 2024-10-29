import { MongoClient } from "mongodb";

const { MONGO_HOST } = process.env;
const { MONGO_DB } = process.env;
const { MONGO_USER } = process.env;
const { MONGO_PASSWORD } = process.env;
const { MONGO_PORT } = process.env;

if (!MONGO_HOST || !MONGO_DB || !MONGO_USER || !MONGO_PASSWORD || !MONGO_PORT)
	throw new Error("Bad Credentials");

const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT}/${MONGO_DB}`;

const MONGO_COLLECTIONS = {
	SCORES: "scores",
	PLAYERS: "players",
	GAMES: "games",
	LEADERBOARD: "leaderboard",
};

type Score = {
	playerId: string;
	score: number;
	game: Game;
	lastUpdate: Date;
	rank: number;
};
type Player = { id: string; nickname: string };
type Game = { title: string; plataform?: string };

export default class MongoRepository {
	private readonly mongo;

	constructor() {
		this.mongo = new MongoClient(mongo_url);

		(async () => {
			try {
				await this.init();
			} catch (err) {
				throw err;
			}
		})();
	}
	private async init() {
		await this.mongo.connect();
		const existingCollections = await this.mongo.db().collections();
		const collectionsNames = existingCollections.map((collection) => collection.collectionName);

		if (!collectionsNames.includes(MONGO_COLLECTIONS.PLAYERS)) {
			await this.mongo.db().createCollection(MONGO_COLLECTIONS.PLAYERS);
		} else if (!collectionsNames.includes(MONGO_COLLECTIONS.GAMES)) {
			await this.mongo.db().createCollection(MONGO_COLLECTIONS.GAMES);
		} else if (!collectionsNames.includes(MONGO_COLLECTIONS.SCORES)) {
			const scoreCollection = await this.mongo.db().createCollection(MONGO_COLLECTIONS.SCORES);
			await this.mongo.db().createIndex(scoreCollection.collectionName, { score: -1 });
		} else if (!collectionsNames.includes(MONGO_COLLECTIONS.LEADERBOARD)) {
			const baseCollection = MONGO_COLLECTIONS.PLAYERS;

			const pipeline = [
				{
					$lookup: {
						from: MONGO_COLLECTIONS.SCORES,
						localField: "id",
						foreingField: "playerId",
						as: "scoreData",
					},
				},
				{
					$unwind: "$scoreData",
				},
				{
					$setWindowFields: {
						sortBy: { "scoreData.score": -1 },
						output: { rank: { $rank: {} } },
					},
				},
				{
					$project: {
						"scoreData.id": true,
						"scoreData.rank": true,
						"scoreData.nickname": true,
						"scoreData.score": true,
						"scoreData.game.title": true,
						"scoreData.lastUpdate": true,
					},
				},
			];
		}
	}

	public async addGame(game: Game) {
		return await this.mongo.db().collection(MONGO_COLLECTIONS.GAMES).insertOne(game);
	}
	public async saveScore(score: Score) {
		return await this.mongo.db().collection(MONGO_COLLECTIONS.SCORES).insertOne(score);
	}

	public async saveUser(player: Player) {
		return await this.mongo.db().collection(MONGO_COLLECTIONS.PLAYERS).insertOne(player);
	}
	public async getLeaderboard(game: Game) {}
}
