import UseCases from "./useCases";
import { PersistencyService, CacheService } from "../domain";
import { mongoPersistencyService, redisCacheService } from ".";

class FindAllParticipants extends UseCases {
    constructor(persistenceService: PersistencyService, cacheService: CacheService) {
        if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid persistency instance');
        } else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
            throw new Error('The "Create Participant Use Case" need a valid cache instance');
        }
        super(persistenceService, cacheService);
    }

    async execute() {
        const cachedValue = await this.cache?.getParticipants();
        if (cachedValue !== null) {
            return cachedValue;
        } else {
            const participants = await this.persistence?.findAllParticipants();
            if (participants != null) await this.cache?.saveParticipants(participants);
            return participants;
        }
    }
}

export const findAllParticipants = new FindAllParticipants(
    mongoPersistencyService,
    redisCacheService,
);
