import { NextFunction, Request, Response, Router } from "express";
import { createParticipant, findAllParticipants } from "../../../application/useCases";

const router = Router();

router.post("/participant", async (req: Request, res: Response, next: NextFunction) => {
	const { id, name } = req.body;
	try {
		await createParticipant.execute({ id, name });
		res.status(201).json({ success: true });
	} catch (err) {
		res.status(500).json({ success: false, error: err });
	}
});

router.get("/participants", async (req: Request, res: Response, next: NextFunction) => {
	try {
		const participants = await findAllParticipants.execute();
		res.json({ success: true, participants });
	} catch (err) {
		console.log(err);
		res.status(500).json({ success: false });
	}
});

export { router as leaderboardRouter };
