import { NextFunction, Request, Response, Router } from "express";
import { createParticipant } from "../../../application/useCases";

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

export { router as leaderboardRouter };
