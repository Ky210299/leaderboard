import { Activity, Leaderboard, Participant, Score } from "../DTOs";
import Repository, { UPDATE_SCORE_OPTIONS_TYPES } from "../ports/repository";

export default class PersistencyService {
	private readonly persistency: Repository;

	constructor(persistency: Repository) {
		this.persistency = persistency;
	}

	public async addParticipant(participant: Participant) {
		if (!participant.id || !participant.name) throw new Error("Invalid participant data");
		return this.persistency.addParticipant(participant);
	}

	public async addToScore(
		participantId: Participant["id"],
		activity: Activity,
		score: Score["value"],
	) {
		if (!score || score === 0) return;
		this.persistency.sumToScore(participantId, activity, score);
	}

	public async subtractToScore(
		participantId: Participant["id"],
		activity: Activity,
		score: Score["value"],
	) {
		if (!score || score === 0) return;

		const existParticipant = await this.persistency.findParticipantById(participantId);
		if (existParticipant == null) throw new Error("Participant not found");
		this.persistency.sumToScore(participantId, activity, -score);
	}

	public async setScore(
		participantId: Participant["id"],
		activity: Activity,
		score: Score["value"],
	) {
		const existParticipant = await this.persistency.findParticipantById(participantId);
		if (existParticipant == null) throw new Error("Participant not found");

		this.persistency.setScore(participantId, activity, score);
	}

	public async findParticipantById(participantId: Participant["id"]) {
		return this.persistency.findParticipantById(participantId);
	}

	public async findAllParticipants() {
		return this.persistency.findAllParticipants();
	}

	public async deleteParticipant(participantId: Participant["id"]) {
		this.persistency.deleteParticipantById(participantId);
	}
}
