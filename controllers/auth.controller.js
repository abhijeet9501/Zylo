import { generateToken } from "../utils/token.util.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import ApiError from "../utils/apiError.util.js";
import User from "../models/user.model.js";


const register = asyncHandler (async (req, res) => {
    const {name, username, email, password} = req.body;

    if (!name || !username || !email || !password) {
        throw new ApiError(400, "All fields are required!");
    }
    
    const user = new User({
        name,
        username,
        email,
        password,
    });
    await user.save();

    const token = generateToken(user._id);
    if (token) {
        res.cookie("uid", token);
        res.status(200).json(
            {
                message: "Register Sucessful!",
            }
        );
    } else {
        throw new ApiError(400, "Error while registering");
    }
});

const login = asyncHandler (async (req, res) => {
    const {username, password} = req.body;
    if (!username || ! password) throw errorResponse("All fields are required!", 400);

    const user = await User.findOne({username});

    if (user && (await user.checkPassword(password)))
    {
        const token = generateToken(user._id);
        res.cookie("uid", token);
        res.status(200).json(
            {
                name: user.name,
                username: user.username,
                avatar: user.avatar,
                message: "Login successful!",
            }
        );
    } else {
        throw new ApiError(400, "Incorrect username or password!");
    }
});

export {
    register,
    login,
};