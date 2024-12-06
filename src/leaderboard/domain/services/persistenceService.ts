import { Activity, Participant, Score } from "../DTOs";
import Repository from "../ports/repository";

export default class PersistencyService {
    private readonly persistency: Repository;

    constructor(persistency: Repository) {
        this.persistency = persistency;
    }

    public async addParticipant(participant: Participant) {
        if (!participant.id || !participant.name) throw new Error("Invalid participant data");
        const mappedParticipant: Participant = {
            ...participant,
            id: participant.id.toString(),
        };

        const alreadyExistParticipant = await this.persistency.existParticipant(
            mappedParticipant.id,
        );
        if (alreadyExistParticipant) return false;
        await this.persistency.addParticipant(mappedParticipant);
        return true;
    }

    public async updateParticipant(
        participantId: Participant["id"],
        participantData: Partial<Participant>,
    ) {
        const mappedData: Partial<Participant> = {};
        Object.entries(participantData).forEach(([key, value]) => {
            if (value != null) {
                mappedData[key as keyof Participant] = value;
            }
        });
        await this.persistency.updateParticipant(participantId, mappedData);
    }

    public async addToScore(
        participantId: Participant["id"],
        activity: Activity,
        score: Score["value"],
    ) {
        if (!score || score === 0) return;

        const mappedActivity: Activity = {
            ...activity,
            id: activity.id.toString(),
        };

        await this.persistency.sumToScore(participantId, mappedActivity, Math.abs(score));
    }

    public async subtractToScore(
        participantId: Participant["id"],
        activity: Activity,
        score: Score["value"],
    ) {
        if (!score || score === 0) return;

        const existParticipant = await this.persistency.findParticipantById(participantId);
        if (existParticipant == null) throw new Error("Participant not found");

        const mappedActivity: Activity = {
            ...activity,
            id: activity.id.toString(),
        };

        await this.persistency.sumToScore(participantId, mappedActivity, -Math.abs(score));
    }

    public async setScore(
        participantId: Participant["id"],
        activity: Activity,
        score: Score["value"],
    ) {
        let scoreToSet;
        if (typeof score !== "number" || score == null) scoreToSet = activity.initialScore || 0;
        else scoreToSet = score;

        const existParticipant = await this.persistency.findParticipantById(participantId);
        if (existParticipant == null) throw new Error("Participant not found");

        const mappedActivity: Activity = {
            ...activity,
            id: activity.id.toString(),
        };

        await this.persistency.setScore(participantId, mappedActivity, scoreToSet);
    }

    public async findParticipantById(participantId: Participant["id"]) {
        const participant = await this.persistency.findParticipantById(participantId);
        if (!participant) return null;
        const { id, name } = participant;
        return { id, name };
    }

    public async findAllParticipants() {
        return this.persistency.findAllParticipants();
    }
    public async findScoresByActivity(activityId: Activity["id"]) {
        const scores = this.persistency.findScoresByActivityId(activityId);
        return scores;
    }

    public async findActivityOfParticipant(
        participantId: Participant["id"],
        activityId: Activity["id"],
    ) {
        const activity = await this.persistency.findActivityOfParticipant(
            participantId,
            activityId,
        );
        if (activity == null) return null;
        return activity;
    }

    public async findAllActivities() {
        return await this.persistency.findActivities();
    }

    public async deleteParticipant(participantId: Participant["id"]) {
        await this.persistency.deleteParticipantById(participantId);
    }
}
