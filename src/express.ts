import ServerPort from "./serverPort";
import app from "./serverAdapter";

export default class ExpressServer implements ServerPort {
    private readonly server = app;
    private appInstance: ReturnType<typeof app.listen> | null;
    constructor() {
        this.appInstance = null;
    }

    public start(port: number) {
        const appInstance = this.appInstance;
        if (appInstance !== null) return;
        this.appInstance = app.listen(port, () => {
            console.log(`Aplication running on port: ${port}`);
        });
    }
    public stop() {
        const appInstance = this.appInstance;
        if (appInstance != null) {
            this.appInstance = null;
            appInstance.close();
        }
    }
}
