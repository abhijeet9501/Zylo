import asyncHandler from "../utils/asyncHandler.util.js";
import User from "../models/user.model.js";
import Follow from "../models/follow.model.js";
import ApiError from "../utils/apiError.util.js";
import { uploadOnCloudinary, deleteUpload } from "../utils/cloudinary.util.js";
import dayjs from "dayjs";


const getProfileData = async (query, userID = null) => {
    try {
        let isFollow = false;
        const user = await User.findOne(query)
            .select("name username avatar.url bio posts")
            .populate({
                path: "posts",
                select: "tweet post_img.url like comments createdAt",
                populate: {
                    path: "user_id",
                    select: "name username avatar.url",
                },
                options: { sort: { createdAt: -1 }, limit: 10 }
            });

        if (user._id == userID) {
            return 169;
        };

        if (!user) throw new ApiError(400, "user not found");

        const followData = await Follow.findOne({ user_id: user._id })
            .select("following follower");

        const followCount = followData ? followData.follower : [];
        const followingCount = followData ? followData.following : [];

        if (userID) {
            if (followCount.includes(userID)) {
                isFollow = true;
            };
        };

        let followList = await User.find({ _id: { $in: followCount } })
            .select("username name avatar.url")
            .limit(10)
            .lean();

        let followingList = await User.find({ _id: { $in: followingCount } })
            .select("username name avatar.url")
            .limit(10)
            .lean();

        if (userID && followData) {
            const myFollows = await Follow.findOne({ user_id: userID }).select("following");
            const myFollowingList = myFollows.following;

            followingList.forEach(id => {
                if (id._id == userID) {
                    id.self = true;
                }
                else if (myFollowingList.includes(id._id)) {
                    id.isFollow = true;
                } else {
                    id.isFollow = false;
                }
            });

            followList.forEach(id => {
                if (id._id == userID) {
                    id.self = true;
                }
                else if (myFollowingList.includes(id._id)) {
                    id.isFollow = true;
                } else {
                    id.isFollow = false;
                }
            });
        };

        if (!userID) {
            userID = user._id;
        };

        const formattedPost = user.posts.map(post => ({
            post_id: post._id,
            user: post.user_id,
            tweet: post.tweet,
            post_img: post.post_img.url || "",
            likeCount: post.like.length,
            commentCount: post.comments.length,
            timeAgo: dayjs(post.createdAt).fromNow(),
            isLiked: post.like.includes(userID),
        }));

        const data = {
            name: user.name,
            username: user.username,
            avatar: user.avatar.url,
            bio: user.bio,
            followCount: followCount.length || 0,
            followingCount: followingCount.length || 0,
            followList,
            followingList,
            formattedPost,
        };

        if (isFollow) data.followStatus = true;

        return data;
    } catch (e) {
        throw new ApiError(500, "Server error!");
    }
};

const getMyProfile = asyncHandler(async (req, res) => {
    const userID = req?.userID;
    if (!userID) throw new ApiError(401, "Unauthorized");

    const data = await getProfileData({ _id: userID });

    res.status(200).json({ success: true, user: data });
});

const getUserProfile = asyncHandler(async (req, res) => {
    const username = (req.params?.username).split(" ").join("").toLowerCase();
    if (!username) throw new ApiError(400, "Username required");

    const data = await getProfileData({ username }, req.userID, true);
    if (data == 169) return res.status(200).json({ success: true, selfProfile: true });

    return res.status(200).json({ success: true, user: data });
});

const basicData = asyncHandler(async (req, res) => {
    const userID = req.userID;
    const user = await User.findById(userID)
        .select("name username avatar.url bio email");
    if (!user) throw new ApiError(400, "User not found!");
    return res.status(200).json({ success: true, user });
});

const updateMyProfile = asyncHandler(async (req, res) => {
    const allowedFields = ["name", "username", "email", "bio"];
    const updates = {};
    for (const key of allowedFields) {
        if (req.body[key]) {
            updates[key] = req.body[key];
        }
    }

    if (Object.keys(updates).length === 0) {
        throw new ApiError(400, "No valid fields provided for update");
    }

    try {
        const user = await User.findByIdAndUpdate(req.userID, updates, { new: true })
            .select("name username email bio avatar -_id");
        const avatar = user?.avatar?.url;
        if (!user) throw new ApiError(404, "User not found");

        return res.status(200).json(
            {
                success: true,
                message: "Profile updated successfully!",
                user,
                avatar,
            }
        );
    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            if (field === "username") throw new ApiError(400, `${field} is already taken!`);
            if (field === "email") throw new ApiError(400, `${field} is already exist in differnet account!`);
        }
        throw new ApiError(500, "Server Error!");
    }
});

const uploadAvatar = asyncHandler(async (req, res) => {
    if (req.file) {
        const data = await uploadOnCloudinary(req.file.path);
        if (data) {
            const userID = req?.userID;
            const user = await User.findByIdAndUpdate(userID, { avatar: { url: data.secure_url, public_id: data.public_id } });
            const publicID = user.avatar.public_id;
            if (publicID) deleteUpload(publicID);

            return res.status(200).json({
                success: true,
                url: data.secure_url,
                message: "file uploaded!"
            });
        }
        throw new ApiError(400, "File not uploaded retry!");
    } else {
        throw new ApiError(400, "File Not found!");
    }
});

const updatePassword = asyncHandler(async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.userID);
    if (!user) {
        return ApiError(404, "User not found!");
    }

    const isMatch = await user.checkPassword(currentPassword);
    if (!isMatch) {
        return ApiError(404, "Incorrect current password!");
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json(
        {
            success: true,
            message: "Password updated successfully"
        }
    );
});

const findUsers = asyncHandler(async (req, res) => {
    const query = req.query.q;

    const users = await User.find({
        $or: [
            { username: { $regex: query, $options: 'i' } },
            { name: { $regex: query, $options: 'i' } }
        ]
    })
        .select("username name avatar.url")
        .limit(5);

    res.status(200)
        .json({
            success: true,
            users,
        });
});


export {
    getMyProfile,
    getUserProfile,
    updateMyProfile,
    uploadAvatar,
    updatePassword,
    basicData,
    findUsers,
};