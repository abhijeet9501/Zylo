import asyncHandler from "../utils/asyncHandler.util.js";
import Follow from "../models/follow.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";
import Notification from "../models/notification.model.js";

const follow = asyncHandler (async (req, res) => {
    let isFollow = false;
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
        isFollow = true;
        const notify = new Notification(
            {
                user_id: userToFollow._id,
                notification: "like",
                from_user: userID,
                message: "started following you",
            }
        );
        await notify.save();
    } else if (!isToFollow.follower.includes(userID)) {
        isToFollow.follower.push(userID);
        await isToFollow.save();
        isFollow = true;
        const notify = new Notification(
            {
                user_id: userToFollow._id,
                notification: "like",
                from_user: userID,
                message: "started following you",
            }
        );
        await notify.save();
    } else {
        await Follow.updateOne(
            {user_id: userToFollow._id},
            {$pull: {follower: userID}},
        );
        await Notification.deleteOne({
            user_id: userToFollow._id,
            notification: "like",
            from_user: userID,
        });
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
    } else {
        await Follow.updateOne(
            {user_id: userID},
            {$pull: {following: userToFollow._id}},
        );
    }

    return res.status(200)
    .json(
        {
            success: true,
            isFollow,
            message: `You started following ${userToFollow.username}`,
        }
    );
});


const removeFollow = asyncHandler (async (req, res) => {
    const userID = req.userID;
    const userToUnfollow = req.body.username;
    if (!userToUnfollow) throw new ApiError(400, "Provide user to unfollow");

    const userToUnfollowID = await User.findOne({username: userToUnfollow});
    if (!userToUnfollowID) throw new ApiError(400, "user to remove not found");

    const unFollowUser = await Follow.updateOne(
        {user_id: userID},
        {$pull: {follower: userToUnfollowID._id}},
    );

    const removeFollowingUser = await Follow.updateOne(
        {user_id: userToUnfollowID._id},
        {$pull: {following: userID}},
    );

    return res.status(200)
    .json({
        success: true,
        message: `You removed ${userToUnfollowID.username}`,
    });
});

const whoToFollow = asyncHandler (async (req, res) => {
    const follow = await Follow.findOne({ user_id: req.userID }).select("following");
    const following = follow ? follow.following : [];

    const users = await User.find({
        _id: { $nin: [...following, req.userID] },
    })
    .select("name username avatar.url")
    .limit(5);

    res.status(200).json({
        success: true,
        users,
    });
});

export {
    follow,
    removeFollow,
    whoToFollow,
};