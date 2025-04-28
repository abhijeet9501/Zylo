export const errorResponse = (message, statusCode) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
};