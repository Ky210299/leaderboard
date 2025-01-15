function handleError(err: Error) {
    const { NODE_ENV } = process.env;
    const isProduction = NODE_ENV === "production";
    if (!isProduction) return err;
    console.error(err);
    err.stack = undefined;
    err.name = "error";
    err.message = "Internal Server Error";
    return err;
}

class ApplicationError extends Error {
    private _code: number;
    get code(): number {
        return this._code;
    }
    set code(code: number) {
        this._code = code;
    }
    constructor(message: string, code: number) {
        super(message);
        this._code = code;
    }
}
