import { createClient } from "redis";

const client = createClient({
	url: process.env.REDIS_URL,
});

class RedisRepository {
	constructor() {
		client.on("error", (err) => console.log("REDIS ERROR\n\t", err));
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
