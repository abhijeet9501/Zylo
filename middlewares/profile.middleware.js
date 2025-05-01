import asyncHandler from "../utils/asyncHandler.util.js";
import { verifyToken } from "../utils/token.util.js";
import ApiError from "../utils/apiError.util.js";

const isAuthenticated = asyncHandler (async (req, res, next) =>
    {
        const token = req.cookies?.uid;
        if (!token) throw new ApiError(401, "Unauthorized");
        const decoded = verifyToken(token);
        if (!decoded) throw new ApiError(401, "Invalid token");
        const userID = decoded.id;
        req.userID = userID;
        next();
    }
);

export {
    isAuthenticated,
}