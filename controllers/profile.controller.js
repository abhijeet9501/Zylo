import asyncHandler from "../utils/asyncHandler.util.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";
import uploadOnCloudinary from "../utils/cloudinary.utli.js";

const getMyProfile = asyncHandler (async (req, res) => 
    {
        const userID = req?.userID;
        if (!userID) throw new ApiError(401, "Unauthorized");

        const user = await User.findById(userID).select("-password -_id");
        if (!user) throw new ApiError(404, "User not found");

        return res.status(200)
        .json(
            {
                sucess: true,
                data: user,
            }
        );
    }
);

const getUserProfile = asyncHandler (async (req, res) => {
    const username = (req.params?.username).split(" ").join("").toLowerCase();
    if (username) {
        const user = await User.findOne({username}).select("name username bio avatar");
        if (!user) throw new ApiError(400, "User not found!");
        return res.status(200)
        .json(
            {
                sucess: true,
                user,
            }
        );
    }
    throw new ApiError(500);
});

const updateMyProfile = asyncHandler (async (req, res) => {
    const allowedFields = ["name", "username", "email", "bio"];
    const updates = {};
    for (const key of allowedFields) {
        if (req.body[key])
        {
            updates[key] = req.body[key];
        }
    }
    
    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }
    
    try {
        const user = await User.findByIdAndUpdate(req.userID, updates, {new: true})
        .select("name username email bio avatar");
        if (!user) throw new ApiError(404, "User not found");
    
        return res.status(200).json(
            {
                sucess: true,
                message: "Profile updated successfully!",
                user,
            }
        );
    }catch (error) {
        if (error.code === 11000)
        {
            const field = Object.keys(error.keyPattern)[0];
            if (field === "username") throw new ApiError(400, `${field} is already taken!`);
            if (field === "email") throw new ApiError(400, `${field} is already exist in differnet account!`);
        }
        throw new ApiError(500, "Server Error!");
    }
});

const uploadAvatar = asyncHandler (async (req, res) => {
    if (req.file) {
        const data = await uploadOnCloudinary(req.file.path);
        if (data) {
            return res.status(200).json({
                url: data,
                message: "file uploaded!"
            });
        } 
        throw new ApiError(400, "File not uploaded retry!");
    } else {
        throw new ApiError(400, "File Not found!");
    }
});

export {
    getMyProfile,
    getUserProfile,
    updateMyProfile,
    uploadAvatar,
}