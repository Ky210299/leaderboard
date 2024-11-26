import { createClient } from "redis";
import { CachePort } from "../../../domain";

const { REDIS_HOST, REDIS_PORT } = process.env;

if (!REDIS_HOST || !REDIS_PORT) throw new Error("Bad Redis configuration");

const client = createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

export default class RedisCache implements CachePort {
	constructor() {
		client.on("error", (err) => console.log("REDIS ERROR\n\t", err));
		(async () => {
			try {
				client.connect();
				console.log("redis connected");
			} catch (err) {
				console.log("Error connecting redis", err);
			} finally {
				client.disconnect();
			}
		})();
	}
}

export const redis = new RedisCache();
