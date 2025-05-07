import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { uploadOnCloudinary, deleteUpload } from "../utils/cloudinary.util.js";
import ApiError from "../utils/apiError.util.js";
import User from "../models/user.model.js";

const createPost = asyncHandler(async (req, res) => {
    const tweet = req.body.tweet;
    const userID = req.userID;
    let postCreate;

    if (req.file) {
        const data = await uploadOnCloudinary(req.file.path, "post");
        if (!data) throw new ApiError(400, "Post image not uploaded!");

        postCreate = new Post({
            user_id: userID,
            post_img: { url: data.secure_url, public_id: data.public_id },
            tweet,
        });
    } else {
        postCreate = new Post({
            user_id: userID,
            tweet,
        });
    }

    await postCreate.save();

    const user = await  User.findById(userID);
    user.posts.push(postCreate._id);
    await user.save();

    return res.status(200).json({
        success: true,
        post: postCreate,
        message: "Post uploaded",
    });
});


const deletePost = asyncHandler (async (req, res) => {
    const postID = req.body.post_id;
    if (!postID) throw new ApiError(400, "Post not found!");
    const findPost = await Post.findById(postID);
    if (!findPost) throw new ApiError(400, "Post not found!");

    const public_id = findPost.post_img.public_id;
    if (public_id) await deleteUpload(public_id);

    await User.updateOne(
        {_id: req.userID},
        {$pull: {posts: findPost._id}}
    );

    await findPost.deleteOne();
    return res.status(200).json({ success: true, message: "Post deleted" });
});

const likePost = asyncHandler (async (req, res) => {
    const userID = req.userID;
    const post_id = req.body.post_id;
    if (!post_id) throw new ApiError(400, "Post id required!");
    
    const post = await Post.findById(post_id);
    if (!post) throw new ApiError(404, "Post not found!");
    let likeLength = post.like.length;
    if (post.like.includes(userID)) {
        await Post.updateOne(
            {_id: post_id},
            {$pull: {like: userID}},
        );
        likeLength--;
    } else if (!post.like.includes(userID)) {
        post.like.push(userID);
        await post.save();
        likeLength++;
    }
    
    return res.status(200)
    .json({
        success: true, 
        likeLength,
    });
});

const commentOnPost = asyncHandler (async (req, res) => {
    const post_id = req.body.post_id;
    if (!post_id) throw new ApiError(400, "Post not found!");

    const { comment } = req.body;
    if (!comment || comment=="") throw new ApiError(400, "comment required");

    const user = await User.findById(req.userID);
    if (!user) throw new ApiError(400, "User not found!");

    const update = await Post.updateOne(
        { _id: post_id },
        {$push: {
            comments: {
                user_id: user._id,
                comment,
            }
        }}
    );

    if (update.matchedCount === 0) {
        throw new ApiError(404, "Post not found!");
    };

    res.status(200)
    .json({
        success: true,
        message: "Comment added successfully",
    });

});

export {
    createPost,
    deletePost,
    likePost,
    commentOnPost,
};