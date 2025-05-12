import asyncHandler from "../utils/asyncHandler.util.js";
import Notification from "../models/notification.model.js";
import User from "../models/user.model.js";
import ApiError from "../utils/apiError.util.js";


const getNotification = asyncHandler (async (req, res) => {
    const userID = req.userID;

    const notification = await Notification.findOne({user_id: userID})
    .select("notification from_user")
    .populate("from_user", "username avatar.url")
    .limit(10)
    .sort({createdAt: -1});
    if (!notification) throw new ApiError(400, "Notification not found");

    res.status(200)
    .json(
        {
            success: true,
            notification,
        }
    )
});

export {
    getNotification,
}