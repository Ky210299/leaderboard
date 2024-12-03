import { NextFunction, Request, Response, Router } from "express";
import {
    createParticipant,
    findAllParticipants,
    updateParticipant,
    addScore,
    setScore,
    subtractScore,
    getLeaderboard,
} from "../../../application";
import { UPDATE_SCORE_OPTIONS_TYPES } from "../../../domain/ports/repository";

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

router.get("/leaderboard/:activityId", async (req: Request, res: Response, next: NextFunction) => {
    const { activityId } = req.params;
    if (!activityId) {
        res.status(400).json({ success: false, message: "Invalid data" });
        return;
    }
    try {
        const leaderboard = await getLeaderboard.execute(activityId);
        res.json({ success: true, data: leaderboard });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
});

router.patch(
    "/participant/:participantId",
    async (req: Request, res: Response, next: NextFunction) => {
        const { participantId } = req.params;
        const { id, name } = req.body;

        if (!participantId) res.status(400).json({ success: false, message: "Invalid data" });
        if (!id && !name) res.status(204).send();

        try {
            const updatedParticipant = await updateParticipant.execute(participantId, { id, name });
            res.status(200).json({ success: true, data: updatedParticipant });
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false });
        }
    },
);

router.patch(
    "/participant/:participantId/score",
    async (req: Request, res: Response, next: NextFunction) => {
        const { method } = req.query;
        const { participantId } = req.params;
        const { activity, score } = req.body;

        if (!participantId || activity == null || !activity.id) {
            res.status(400).json({ success: false, message: "Invalid data" });
            return;
        }
        try {
            let updatedParticipant;
            switch (method) {
                case UPDATE_SCORE_OPTIONS_TYPES.ADD:
                    updatedParticipant = await addScore.execute(participantId, activity, score);
                    break;
                case UPDATE_SCORE_OPTIONS_TYPES.SUBTRACT:
                    updatedParticipant = await subtractScore.execute(
                        participantId,
                        activity,
                        score,
                    );
                    break;
                case UPDATE_SCORE_OPTIONS_TYPES.SET:
                    updatedParticipant = await setScore.execute(participantId, activity, score);
                    break;
                default:
                    res.status(400).json({ success: false, message: "Invalid method" });
                    return;
            }
            res.status(200).json({ success: true, data: updatedParticipant });
            return;
        } catch (err) {
            console.log(err);
            res.status(500).json({ success: false, message: "Internal server error" });
            return;
        }
    },
);

export { router as leaderboardRouter };
