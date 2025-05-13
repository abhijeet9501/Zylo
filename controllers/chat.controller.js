import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import asyncHandler from "../utils/asyncHandler.util.js"
import ApiError from "../utils/apiError.util.js";
import Notification from "../models/notification.model.js";

const loadRoom = asyncHandler(async (req, res) => {
    const userID = req.userID;
    const username = req.body.username;

    if (!username) throw new ApiError(400, "Username not found");

    const userToAdd = await User.findOne({ username }).select("name username avatar.url");
    if (!userToAdd) throw new ApiError(400, "User not found!");

    let isRoomExists = await Room.findOne(
        { users: { $all: [userID, userToAdd._id] } }
    );

    if (!isRoomExists) {
        isRoomExists = new Room(
            {
                users: [userID, userToAdd._id],
            }
        );
        await isRoomExists.save();
        const user = await User.findById(userID);
        user.rooms.push(isRoomExists._id);
        await user.save();
        const addUser = await User.findById(userToAdd._id);
        addUser.rooms.push(isRoomExists._id);
        await addUser.save();
        const notify = new Notification({
            user_id: userToAdd._id,
            from_user: userID,
            notification: "chat",
            message: "started chat with you",
        });
        await notify.save();
    };

    let messages = await Message.find({ room_id: isRoomExists._id })
        .select("message user_id");

    return res.status(200)
        .json(
            {
                room_id: isRoomExists._id,
                userToAdd,
                messages,
                myId: userID,
            },
        );
});

const getChats = asyncHandler(async (req, res) => {
    const userID = req.userID;

    const user = await User.findById(userID)
        .select("rooms")
        .populate(
            {
                path: "rooms",
                options: { sort: { latestMsgAt: -1 } },
                populate: {
                    path: "users",
                    select: "name avatar.url username",
                },
            }
        );
        
    const rooms = [];
    user.rooms.forEach((room) => {
        const filteredRoom = room.toObject();
        filteredRoom.users = room.users.filter(
            (u) => u._id.toString() !== userID.toString()
        );
        rooms.push(filteredRoom);
    });

    return res.status(200)
        .json({
            success: true,
            rooms,
        });
});

const sendMsg = async (userID, roomID, msg) => {
    try {
        const room = await Room.findById(roomID);
        if (!room) throw new ApiError(400, "Room not found");

        const newMsg = new Message({
            user_id: userID,
            room_id: room._id,
            message: msg,
        });
        await newMsg.save();

        await room.updateOne({ latestMsgAt: new Date() });

    } catch {
        throw new ApiError(400, "Can't send message");
    }
};

export {
    loadRoom,
    getChats,
    sendMsg,
}