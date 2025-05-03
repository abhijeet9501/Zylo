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

const logOut = asyncHandler(async (req, res) => {
    const token = req.cookies?.uid;
    if (!token) return ApiError(400);
    if (verifyToken(token))
    {
        res.clearCookie('uid', {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",    
            sameSite: 'Strict',
        });
        return res.status(200).json({message: "logout success!"});
    };
    return ApiError(500);
});

export {
    isAuthenticated,
    logOut,
}