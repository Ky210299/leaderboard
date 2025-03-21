import ExpressServer from "./express";

const server = new ExpressServer();
const { PORT } = process.env;
if (!PORT) throw new Error("Not PORT found");
server.start(Number(PORT));
