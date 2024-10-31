import { PersistencyPort } from "./ports/repository";

export default class PersistencyService {
	private readonly persistency: PersistencyPort;
	constructor(persistency: PersistencyPort) {
		this.persistency = persistency;
	}
}
