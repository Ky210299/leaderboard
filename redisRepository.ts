import {createClient} from "redis"

const client = createClient({
	url: process.env.REDIS_URL,
});
client.on("error", (err) => console.log("REDIS ERROR\n\t", err));

export class RedisRepository {
	constructor() {
		this.connect();
	}
	private async connect() {
		try {
			await client.connect();
		} catch (err) {
			console.log(err);
		}
	}
}
