import { Activity, Leaderboard, Participant, Score } from "../DTOs";

export const UPDATE_SCORE_OPTIONS_TYPES = {
	ADD: "add",
	SUBTRACT: "sub",
	SET: "set",
} as const;

export type UpdateScoreOptions =
	| { type: typeof UPDATE_SCORE_OPTIONS_TYPES.ADD; value: number }
	| { type: typeof UPDATE_SCORE_OPTIONS_TYPES.SUBTRACT; value: number }
	| { type: typeof UPDATE_SCORE_OPTIONS_TYPES.SET; value: number };

export default interface Repository {
	addParticipant: (participant: Participant) => Promise<void>;

	findParticipantById: (participantId: Participant["id"]) => Promise<Participant | null>;

	findParticipantByName: (participantName: Participant["name"]) => Promise<Participant | null>;

	sumToScore: (
		participantId: Participant["id"],
		activity: Activity,
		score: Score["value"],
	) => Promise<void>;

	setScore: (
		participantId: Participant["id"],
		activity: Activity,
		score: Score["value"],
	) => Promise<void>;

	findAllParticipants: () => Promise<Participant[]>;

	deleteParticipantById: (participantId: Participant["id"]) => Promise<void>;
}
