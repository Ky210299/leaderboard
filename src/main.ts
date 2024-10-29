import { mongo } from "./mongoRepository";
import { redis } from "./redisRepository";

(async () => {
	try {
		await mongo.savePlayer({ nickname: "Ky3", id: "Kyid3" });
		await mongo.saveScore({ playerId: "Kyid3", score: 300, gameId: "dota" });
		const data = await mongo.getLeaderboard("dota");
		console.log("LEADERBOARD DATA => ", data);
	} catch (err) {
		console.log("ERROR: ", err);
	}
})();
