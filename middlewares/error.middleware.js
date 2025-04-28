const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode;
    const message = err.message || "Something went wrong!";
    res.status(statusCode).json(message);
};

export default errorMiddleware;