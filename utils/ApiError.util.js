class apiError extends Error {
    constructor (
        statusCode,
        message = "Something went wrong!",
    ) {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default apiError;