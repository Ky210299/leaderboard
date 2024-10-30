import { createClient } from "redis";

const { REDIS_HOST, REDIS_PORT } = process.env;

if (!REDIS_HOST || !REDIS_PORT) throw new Error("Bad Redis configuration");

const client = createClient({
	url: `redis://${REDIS_HOST}:${REDIS_PORT}`,
});

export default class RedisRepository {
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

	public async set(key: any, value: any) {
		try {
			await client.connect();
			return await client.set(JSON.stringify(key), JSON.stringify(value));
		} catch (err) {
			throw err;
		} finally {
			await client.disconnect();
		}
	}
	public async get(key: any) {
		try {
			await client.connect();
			return await client.get(JSON.stringify(key));
		} catch (err) {
			throw err;
		} finally {
			await client.disconnect();
		}
	}
}

export const redis = new RedisRepository();
