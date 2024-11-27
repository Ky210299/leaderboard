export default interface CachePort {
	save: (cacheKey: string, value: any, exp?: number) => Promise<void>;
	get: (cacheKey: string) => Promise<string | null>;
}
