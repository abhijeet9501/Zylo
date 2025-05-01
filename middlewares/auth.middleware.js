import { verifyToken } from "../utils/token.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";

const isLoggedIn =  asyncHandler( async (req, res, next) => {
    const token = req.cookies?.uid;
    if (!token) return next();

    const isValidToken = verifyToken(token);
    if (!isValidToken) return next();

    const user = await User.findById(isValidToken.id);
    if (!user) return next();

    return res.status(200)
    .json(
        {
            name: user.name,
            username: user.username,
            avatar: user.avatar,
            message: "Already logged in!",
            success: true,
        }
    );
});

const isAlreadyExists = asyncHandler (async (req, res, next) => {
    const { username, email } = req.body;
    if (!username || !email) throw new ApiError(400, "All fields are required!");

    const isExist = await User.findOne(
        {$or: [{username}, {email}]}
    );
    if (!isExist) return next();
    if (isExist.username === username) throw new ApiError(400, "Username already taken!")
    if (isExist.email === email) throw new ApiError(400, "Email already exist!");
});


export {
    isLoggedIn,
    isAlreadyExists,
}