import { NextFunction, Request, Response, Router } from "express";
import { createParticipant, findAllParticipants, updateParticipant } from "../../../application";

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

router.patch(
    "/participant/:participantId",
    async (req: Request, res: Response, next: NextFunction) => {
        const { participantId } = req.params;
        const { id, name } = req.body;

        console.log("pid: \n", participantId, "body: \n", req.body);

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

export { router as leaderboardRouter };
