import ServerPort from "../ports/server";

export default class ServerService {
	private readonly server: ServerPort;

	constructor(server: ServerPort) {
		this.server = server;
	}
	public startServer(port: number) {
		this.server.start(port);
	}
	public stopServer() {
		this.server.stop();
	}
}
