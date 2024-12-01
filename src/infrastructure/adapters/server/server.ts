import express, { json, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { leaderboardRouter } from "./routes";

const app = express();

// Middlewares
app.use(json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

// ROUTES
app.get("/live", async (req: Request, res: Response) => {
    res.send("live");
});

app.use("/v1", leaderboardRouter);

export default app;
