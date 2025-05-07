import asyncHandler from "../utils/asyncHandler.util.js";
import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";

const follow = asyncHandler (async (req, res) => {
    const userID = req.userID;
    const usernameToFollow = req.body?.username;
    if (!usernameToFollow)  throw new ApiError(400, "Provide user to follow");

    const userToFollow = await User.findOne({username: usernameToFollow});
    if (!userToFollow)  throw new ApiError(400, "User not found to follow");

    const isToFollow = await Follow.findOne({user_id: userToFollow._id});

    if (!isToFollow) {
        const follow = new Follow (
            {
                user_id: userToFollow._id,
                follower: [userID],
            },
        );
        await follow.save();
    } else if (!isToFollow.follower.includes(userID)) {
        isToFollow.follower.push(userID);
        await isToFollow.save();
    }

    const isToFollowing = await Follow.findOne({user_id: userID});

    if (!isToFollowing) {
        const follow = new Follow (
            {
                user_id: userID,
                following: [userToFollow._id],
            },
        );
        await follow.save();
    } else if (!isToFollowing.following.includes(userToFollow._id)) {
        isToFollowing.following.push(userToFollow._id);
        await isToFollowing.save();
    }

    return res.status(200)
    .json(
        {
            success: true,
            message: `You started following ${userToFollow.username}`,
        }
    );
});


const unFollow = asyncHandler (async (req, res) => {
    const userID = req.userID;
    const userToUnfollow = req.body.username;
    if (!userToUnfollow) throw new ApiError(400, "Provide user to unfollow");

    const userToUnfollowID = await User.findOne({username: userToUnfollow});

    const unFollowUser = await Follow.updateOne(
        {user_id: userID},
        {$pull: {following: userToUnfollowID._id}},
    );

    const removeFollowingUser = await Follow.updateOne(
        {user_id: userToUnfollowID._id},
        {$pull: {follower: userID}},
    );

    return res.status(200)
    .json({
        success: true,
        message: `You unfollowed ${userToUnfollowID.username}`,
    });
});

export {
    follow,
    unFollow,
};