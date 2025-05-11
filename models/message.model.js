import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
    {
        room_id: {
            type: mongoose.Types.ObjectId,
            ref: "Room",
        },
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        message: {
            type: String,
            required: true,
        },
    }, 
    {timestamps: true}
);

const Message = mongoose.model("Message", messageSchema);

export default Message;