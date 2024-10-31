import { ServerPort } from "../../../domain";
import app from "./server";

export default class ExpressServer implements ServerPort {
	private readonly server = app;
}
