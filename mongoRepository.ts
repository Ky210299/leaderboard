import { MongoClient } from "mongodb";
const MONGO_URL = process.env.MONGO_URL;
export default class MongoRepository {
	constructor() {
		if (!MONGO_URL) throw new Error("No connection string");
		const mongo = new MongoClient(MONGO_URL, {});
		(async () => {
			try {
				await mongo.connect();
				console.log("mongo connected");
			} catch (err) {
				throw err;
			} finally {
				mongo.close();
			}
		})();
	}
}