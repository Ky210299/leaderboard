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
    updateParticipant: (
        participantId: Participant["id"],
        participantData: Partial<Participant>,
    ) => Promise<void>;

    existParticipant: (participantId: Participant["id"]) => Promise<boolean>;

    findActivityOfParticipant: (
        participantId: Participant["id"],
        activityId: Activity["id"],
    ) => Promise<{ activity: Activity; score: Score["value"] } | null>;

    addParticipant: (participant: Participant) => Promise<void>;

    findScoresByActivityId: (activityId: Activity["id"]) => Promise<Leaderboard>;

    findParticipantById: (participantId: Participant["id"]) => Promise<Participant | null>;

    findParticipantByName: (participantName: Participant["name"]) => Promise<Participant | null>;

    findActivities: () => Promise<Activity[]>;

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
