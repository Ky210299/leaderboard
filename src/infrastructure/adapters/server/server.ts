import express, { json } from "express";
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
app.use("/v1", leaderboardRouter);

export default app;
