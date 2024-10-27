import { createClient } from "redis";

const client = createClient({
	url: process.env.REDIS_URL,
});

export default class RedisRepository {
	constructor() {
		client.on("error", (err) => console.log("REDIS ERROR\n\t", err));
		(async () => {
			try {
				client.connect();
				console.log("redis connected");
			} catch (err) {
				throw err;
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
