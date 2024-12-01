import UseCases from "./useCases";
import { PersistencyService, CacheService } from "../domain";
import { Participant } from "../domain/DTOs";
import { mongoPersistencyService, redisCacheService } from ".";

class UpdateParticipant extends UseCases {
    constructor(persistenceService: PersistencyService, cacheService: CacheService) {
        if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid persistency instance');
        } else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid cache instance');
        }
        super(persistenceService, cacheService, null);
    }

    public async execute(participantId: Participant["id"], participantData: Partial<Participant>) {
        if (participantData == null) throw new Error("Invalid data");
        await this.persistence?.updateParticipant(participantId, participantData);
        await this.cache?.delete("participants");
        return await this.persistence?.findParticipantById(participantId);
    }
}

export const updateParticipant = new UpdateParticipant(mongoPersistencyService, redisCacheService);
