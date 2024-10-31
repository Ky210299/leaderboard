import ServerPort from "../ports/server";

export default class ServerService {
	private readonly server: ServerPort;

	constructor(server: ServerPort) {
		this.server = server;
	}
}
