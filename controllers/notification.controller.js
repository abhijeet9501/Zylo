import asyncHandler from "../utils/asyncHandler.util.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
dayjs.extend(relativeTime);


const getNotification = asyncHandler (async (req, res) => {
    const userID = req.userID;

    const notification = await Notification.find({user_id: userID})
    .select("notification from_user message createdAt")
    .populate("from_user", "username avatar.url")
    .limit(10)
    .sort({createdAt: -1});
    if (!notification) throw new ApiError(400, "Notification not found");

    const data = notification.map(item => ({
        username: item.from_user.username,
        avatar: item.from_user.avatar.url,
        message: item.message,
        timeAgo: dayjs(item.createdAt).fromNow(),
    }));

    res.status(200)
    .json(
        {
            success: true,
            data,
        }
    )
});

export {
    getNotification,
}