import mongoose from "mongoose";

const followSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        follower: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        following: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ]
    }
);

const Follow = mongoose.model("Follow", followSchema);

export default Follow;