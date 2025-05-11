import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import asyncHandler from "../utils/asyncHandler.util.js"
import ApiError from "../utils/apiError.util.js";

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
    };

    let messages = await Message.find({ room_id: isRoomExists._id })
        .select("message user_id")
        .sort({ createdAt: -1 });

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

export {
    loadRoom,
    getChats,
}