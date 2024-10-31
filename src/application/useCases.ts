import { CacheService, PersistencyService, ServerService } from "../domain";

export default class UseCasesExecutor {
	private readonly persistence: PersistencyService;
	private readonly cache: CacheService;
	private readonly server: ServerService;

	constructor(
		persistenceService: PersistencyService,
		cacheService: CacheService,
		serverService: ServerService,
	) {
		this.persistence = persistenceService;
		this.cache = cacheService;
		this.server = serverService;
	}
}
