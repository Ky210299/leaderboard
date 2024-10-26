import { createClient } from "@redis/client";

const client = createClient({
	url: process.env.REDIS_URL,
});
client.on("error", (err) => console.log("REDIS ERROR\n\t", err));

export class ReddisManager {
	constructor() {
		this.connect();
	}
	private async connect() {
		await client.connect();
	}
}
