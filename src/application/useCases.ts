import { mongoPersistencyService, redisCacheService } from ".";
import { CacheService, PersistencyService, ServerService } from "../domain";
import { Participant } from "../domain/DTOs";

class UseCases {
	protected readonly persistence: PersistencyService | null;
	protected readonly cache: CacheService | null;
	protected readonly server: ServerService | null;

	constructor(
		persistenceService: PersistencyService | null,
		cacheService: CacheService | null,
		serverService: ServerService | null,
	) {
		this.persistence = persistenceService || null;
		this.cache = cacheService || null;
		this.server = serverService || null;
	}

	protected static isValidPersistencyServiceInstance(instance: any) {
		return instance != null && instance instanceof PersistencyService;
	}
	protected static isValidCacheServiceInstance(instance: any) {
		return instance != null && instance instanceof CacheService;
	}
	protected static isValidServerServiceInstance(instance: any) {
		return instance != null && instance instanceof ServerService;
	}

	protected havePersistency() {
		return this.persistence != null;
	}
	protected haveCache() {
		return this.cache != null;
	}
	protected haveServer() {
		return this.server != null;
	}
}

class CreateParticipant extends UseCases {
	constructor(persistenceService: PersistencyService, cacheService: CacheService) {
		if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
			throw new Error('The "Create Participant Use Case" need a valid persistency instance');
		} else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
			throw new Error('The "Create Participant Use Case" need a valid cache instance');
		}
		super(persistenceService, cacheService, null);
	}

	async execute(participant: Participant) {
		if (participant == null) throw new Error("Invalid participant data");
		const { id, name } = participant;
		if (id == null || !name) throw new Error("Invalid participant data");
		const added = await this.persistence?.addParticipant(participant);
		if (added) await this.cache?.delete("participants");
	}
}

class FindAllParticipants extends UseCases {
	constructor(persistenceService: PersistencyService, cacheService: CacheService) {
		if (UseCases.isValidPersistencyServiceInstance(persistenceService) === false) {
			throw new Error('The "Create Participant Use Case" need a valid persistency instance');
		} else if (UseCases.isValidCacheServiceInstance(cacheService) === false) {
			throw new Error('The "Create Participant Use Case" need a valid cache instance');
		}
		super(persistenceService, cacheService, null);
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
export const findAllParticipants = new FindAllParticipants(
	mongoPersistencyService,
	redisCacheService,
);
export const createParticipant = new CreateParticipant(mongoPersistencyService, redisCacheService);
