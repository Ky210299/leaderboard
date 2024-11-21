import { Collection, MongoClient, ObjectId } from "mongodb";
import { Repository } from "../../../domain";
import { Activity, Participant, Score } from "../../../domain/DTOs";
import { UPDATE_SCORE_OPTIONS_TYPES, UpdateScoreOptions } from "../../../domain/ports/repository";

const { MONGO_USER, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DB } = process.env;

if (!MONGO_USER || !MONGO_PASSWORD || !MONGO_HOST || !MONGO_DB) {
	throw new Error("Bad Credentials");
}

export const mongo_url = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_HOST}:${MONGO_PORT || 27017}`;

const MONGO_COLLECTIONS = {
	LEADERBOARD: "leaderboard",
};

type MongoLeaderboard = {
	participant: Participant;
	activity?: Activity;
	score?: Score["value"];
};

export default class MongoRepository implements Repository {
	private readonly mongo;
	private readonly leaderboardSchema: Collection<MongoLeaderboard>;

	constructor() {
		this.mongo = new MongoClient(mongo_url);
		this.init()
			.then((data) => console.log("Mongo Client connected: \n\t", data))
			.catch((err) => console.log("Error connecting Mongo, \n\t", err));
		this.leaderboardSchema = this.mongo.db(MONGO_DB).collection(MONGO_COLLECTIONS.LEADERBOARD);
	}

	private async init() {
		await this.mongo.connect();
		const dbStats = await this.mongo.db(MONGO_DB).stats();
		console.log("\tMongo db statistics:\n\t", dbStats);
	}

	// Insert a participant
	public async addParticipant(participant: Participant) {
		await this.leaderboardSchema.insertOne({ participant: participant });
	}

	public async findAllParticipants() {
		const pipeline = [];
		const options = {};

		pipeline.push({
			$group: {
				id: "$id",
				name: { $first: "$name" },
				activities: {
					$push: {
						title: "$activity.title",
						category: "$activity.category",
						plataform: "$activity.plataform",
						score: "$score",
					},
				},
			},
		});

		const participants = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.LEADERBOARD)
			.aggregate(pipeline, options)
			.project<
				Participant & { activities: Array<Activity & Score["value"]> }
			>({ id: 1, name: 1, activities: 1 })
			.toArray();
		return participants;
	}

	public async findParticipantById(participantId: Participant["id"]) {
		const participant = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.LEADERBOARD)
			.findOne({ id: participantId });
		if (!participant) return null;
		const { id, name } = participant;
		return { id, name };
	}

	public async findParticipantByName(participantName: Participant["name"]) {
		const pipeline = [];
		const options = {};

		pipeline.push({ $match: { name: participantName } });

		pipeline.push({
			$group: {
				activities: {
					$push: {
						title: "$activity.title",
						category: "$activity.category",
						plataform: "$activity.plataform",
						score: "$score",
					},
				},
			},
		});

		const participant = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.LEADERBOARD)
			.aggregate(pipeline, options)
			.project<
				Participant & { activities: Array<Activity & Score["value"]> }
			>({ id: 1, name: 1, activities: 1 })
			.toArray();

		if (!participant.at(0)) return null;
		return participant.at(0);
	}

	private async findActivitiesOfParticipant(participantId: Participant["id"]) {
		const activities = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.LEADERBOARD)
			.find({ id: participantId }, { projection: { activity: 1, score: 1 } })
			.toArray();
		return activities;
	}

	private async findActivityOfParticiapnt(
		participantId: Participant["id"],
		activityId: Activity["id"],
	) {
		const activity = await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.LEADERBOARD)
			.findOne(
				{ id: participantId, activity: { id: activityId } },
				{ projection: { activity: 1 } },
			);
		if (activity == null) return null;
		const { _id, id, title, category, plataform, region, score } = activity;
		return { _id, id, title, category, plataform, region, score };
	}

	private async updateScore(id: ObjectId, newScore: Score["value"]) {
		await this.mongo
			.db(MONGO_DB)
			.collection(MONGO_COLLECTIONS.LEADERBOARD)
			.updateOne({ _id: id }, { $set: { score: newScore } });
	}

	public async sumToScore(participantId: Participant["id"], activity: Activity, score: number) {
		const participantActivity = await this.findActivityOfParticiapnt(participantId, activity.id);
		if (participantActivity === null) throw 1;

		const { _id, score: oldScore } = participantActivity;
		if (_id == null) throw 1;

		if (oldScore == null || typeof oldScore !== "number") {
			await this.updateScore(_id, score);
		} else {
			const newScore = oldScore + score;
			await this.updateScore(_id, newScore);
		}
	}

	public async setScore(participantId: Participant["id"], activity: Activity, score: number) {
		const participantActivity = await this.findActivityOfParticiapnt(participantId, activity.id);
		if (participantActivity === null) throw 1;

		const { _id } = participantActivity;
		if (_id == null) throw 1;

		await this.updateScore(participantActivity._id, score);
	}
}

export const mongo = new MongoRepository();
