const errorMiddleware = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Something went wrong!";

    res.status(statusCode)
    .json(
        {
            sucess: false,
            message,
        }
    );
};

export { errorMiddleware };
