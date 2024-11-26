import ServerPort from "../ports/server";

export default class ServerService {
	private readonly server: ServerPort;

	constructor(server: ServerPort) {
		this.server = server;
	}
	public startServer() {
		this.server.start();
	}
	public stopServer() {
		this.server.stop();
	}
}
