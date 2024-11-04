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
	addParticipant: (participant: Omit<Participant, "id">) => Promise<Participant>;

	updateScore: (
		particiapant: Participant["id"],
		activity: Activity,
		scoreValue: UpdateScoreOptions,
	) => Promise<Score>;

	findParticipant: (participantId: Participant["id"]) => Promise<Participant>;

	findAllParticipants: () => Promise<Participant[]>;

	findParticipantScoreByActivity: (
		participantId: Participant["id"],
		activity: Activity,
	) => Promise<Leaderboard>;

	deleteParticipantById: (participantId: Participant["id"]) => Promise<void>;
}
