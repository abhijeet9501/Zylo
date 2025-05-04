import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        post_img: {
            type: String,
        },
        tweet: {
            type: String,
            required: true,
        },
        like: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
        comment: [
            {
                type: mongoose.Types.ObjectId,
                ref: "User",
            },
        ],
    }, 
    {timestamps: true}
);

const Post = mongoose.model("Post", postSchema);

export default Post;