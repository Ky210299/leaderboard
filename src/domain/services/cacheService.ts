import { CachePort } from "./ports/cache";

export default class CacheService {
	private readonly cache: CachePort;
	constructor(cacheAdapter: CachePort) {
		this.cache = cacheAdapter;
	}
}
