import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Types.ObjectId,
            ref: "User",
        },
        post_img: {
            url: {
                type: String,
                default: ""
            },
            public_id: String,
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
        comments: [
            {
                user_id: {
                    type: mongoose.Types.ObjectId,
                    ref: "User",
                },
                comment: {
                    type: String,
                }
            },
        ],
    },
    { timestamps: true }
);

const Post = mongoose.model("Post", postSchema);

export default Post;