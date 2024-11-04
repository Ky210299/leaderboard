import { MongoClient, ObjectId } from "mongodb";
import { Repository } from "../../../domain";
import { Participant } from "../../../domain/DTOs";

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_HOST || !MONGO_DB) {
	throw new Error("Bad Credentials");
}

export const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT || 27017}`;

const MONGO_COLLECTIONS = {
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
	private readonly leaderboardCursor;
	constructor() {
		this.mongo = new MongoClient(mongo_url);
		this.init()
			.then((data) => console.log("Mongo Client connected: \n\t", data))
			.catch((err) => console.log("Error connecting Mongo, \n\t", err));
		this.leaderboardCursor = this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.LEADERBOARD);
	}

	private async init() {
		await this.mongo.connect();
		const dbStats = await this.mongo.db(MONGO_DB).stats();
		console.log("\tMongo db statistics:\n\t", dbStats);
	}

	public async addParticipant(participant: Omit<Participant, "id">) {
		try {
			const newParticipantRef = await this.leaderboardCursor.insertOne(participant);
			const newParticipant = await this.leaderboardCursor.findOne({
				_id: newParticipantRef.insertedId,
			});
			if (!newParticipant) throw new Error("Error inserting the new participant");
			return { ...newParticipant, id: newParticipant._id.toString(), name: newParticipant.name };
		} catch (err) {
			console.log(err);
			throw err;
		}
	}
}

export const mongo = new MongoRepository();
