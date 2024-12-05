import express, { json, Request, Response } from "express";
import cors from "cors";
import morgan from "morgan";
import helmet from "helmet";
import { leaderboardRouter } from "./routes";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc from "swagger-jsdoc";

const jSDocOptions = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Leaderboard",
            version: "1.0.0",
        },
    },
    apis: ["./routesDoc"],
};

const swaggerOptions = swaggerJSDoc(jSDocOptions);

const app = express();

// Middlewares
app.use(json());
app.use(cors());
app.use(morgan("dev"));
app.use(helmet());

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerOptions));

// ROUTES
app.get("/live", async (req: Request, res: Response) => {
    res.send("live");
});

app.use("/v1", leaderboardRouter);

export default app;
