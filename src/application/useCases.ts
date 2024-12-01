import { mongoPersistencyService, redisCacheService } from ".";
import { CacheService, PersistencyService, ServerService } from "../domain";

export default class UseCases {
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
