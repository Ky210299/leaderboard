import UseCases from "./useCases";
import { PersistencyService, CacheService } from "../domain";
import { Activity, Participant, Score } from "../domain/DTOs";
import { mongoPersistencyService, redisCacheService } from ".";

class AddScore extends UseCases {
    constructor(persistenceService: PersistencyService, cacheService: CacheService) {
        if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid persistency instance');
        } else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid cache instance');
        }
        super(persistenceService, cacheService, null);
    }

    public async execute(
        participantId: Participant["id"],
        activity: Activity,
        score: Score["value"],
    ) {
        const { id: activityId, initialScore, title } = activity;
        if (participantId == null || activity == null || !activityId)
            throw new Error("Invalid score data");

        const activityOfParticipant = await this.persistence?.findActivityOfParticipant(
            participantId,
            activityId,
        );
        if (activityOfParticipant == null && !!initialScore && !!title)
            await this.cache?.delete("activities");
        else
            throw new Error(
                "When a player's score is updated in a new activity, it is necessary to specify the initial score of said activity and its title",
            );

        await this.persistence?.addToScore(participantId, activity, score);
        return await this.persistence?.findParticipantById(participantId);
    }
}

export const addScore = new AddScore(mongoPersistencyService, redisCacheService);
