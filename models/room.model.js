import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
    {
        users: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        latestMsgAt: {
            type: Date,
            default: Date.now,
        }
    },
);

const Room = mongoose.model("Room", roomSchema);

export default Room;