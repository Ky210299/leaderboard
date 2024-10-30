import { mongo } from "./mongoRepository";
import { redis } from "./redisRepository";

(async () => {
	try {
		const exist = await mongo.existGame("2");
		console.log(exist);
	} catch (err) {
		console.log("ERROR: ", err);
	}
})();
