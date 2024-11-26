export default interface ServerPort {
	start: (port: number) => void;
	stop: () => void;
}
