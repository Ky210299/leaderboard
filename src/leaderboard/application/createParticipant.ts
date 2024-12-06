import UseCases from "./useCases";
import { PersistencyService, CacheService } from "../domain";
import { Participant } from "../domain/DTOs";
import { mongoPersistencyService, redisCacheService } from ".";

class CreateParticipant extends UseCases {
    constructor(persistenceService: PersistencyService, cacheService: CacheService) {
        if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid persistency instance');
        } else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid cache instance');
        }
        super(persistenceService, cacheService);
    }

    async execute(participant: Participant) {
        if (participant == null) throw new Error("Invalid participant data");
        const { id, name } = participant;
        if (id == null || !name) throw new Error("Invalid participant data");
        const added = await this.persistence?.addParticipant(participant);
        if (added) await this.cache?.delete("participants");
    }
}

export const createParticipant = new CreateParticipant(mongoPersistencyService, redisCacheService);
