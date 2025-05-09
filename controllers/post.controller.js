import Post from "../models/post.model.js";
import asyncHandler from "../utils/asyncHandler.util.js";
import { uploadOnCloudinary, deleteUpload } from "../utils/cloudinary.util.js";
import ApiError from "../utils/apiError.util.js";
import User from "../models/user.model.js";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime.js";
import Follow from "../models/follow.model.js";

dayjs.extend(relativeTime);

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

    const post = await Post.findById(postCreate._id)
    .select("tweet post_img.url _id")
    .populate("user_id", "name username avatar.url");

    return res.status(200).json({
        success: true,
        post: {
            _id: post._id,
            tweet: post.tweet,
            image: post.post_img?.url || "",
            likeCount: post.like?.length || 0,
            commentCount: post.comments?.length || 0,
            timeAgo: dayjs(post.createdAt).fromNow(),
            user: post.user_id,
        },
        message: "Post uploaded",
    });
});


const deletePost = asyncHandler (async (req, res) => {
    const postID = req.body.post_id;
    if (!postID) throw new ApiError(400, "Post not found!");
    const findPost = await Post.findById(postID);
    if (!findPost) throw new ApiError(400, "Post not found!");
    if (findPost.user_id.toString() !== req.userID) throw new ApiError(403, "Unauthorized to delete this post");

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
    let like = false;
    if (post.like.includes(userID)) {
        await Post.updateOne(
            {_id: post_id},
            {$pull: {like: userID}},
        );
        likeLength--;
    } else {
        post.like.push(userID);
        await post.save();
        like = true;
        likeLength++;
    }
    
    return res.status(200)
    .json({
        success: true, 
        likeLength,
        like,
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

    const commentData = await Post.findById(post_id)
    .select("comments")
    .populate("comments.user_id", "name username avatar.url");

    res.status(200)
    .json({
        success: true,
        commentData,
        message: "Comment added successfully",
    });

});

const getPosts = asyncHandler (async (req, res) => {
    const posts = await Post.find()
    .sort({createdAt: -1})
    .limit(15)
    .populate("user_id",  "name username avatar.url")
    .select("tweet post_img.url like comments createdAt");

    const filteredPosts = posts.map(post => ({
        _id: post._id,
        user: post.user_id,
        tweet: post.tweet,
        image: post.post_img?.url || "",
        likeCount: post.like?.length || 0,
        commentCount: post.comments?.length || 0,
        timeAgo: dayjs(post.createdAt).fromNow(),
        like: undefined,
        comments: undefined,
        createdAt: undefined,
    }));

    res.status(200)
    .json(
        {
            success: true,
            filteredPosts,
        }
    );
});

const getFollowingPosts = asyncHandler (async (req, res) => {
    const follow = await Follow.findOne({user_id: req.userID}).select("following");
    const following = follow.following;
    if (!follow.following || !follow.following.length) {
        return res.status(200).json({
            success: true,
            posts: [],
        });
    }

    const posts = await Post.find({
        user_id: {$in: following},
    })
    .sort({createdAt: -1})
    .limit(15)
    .populate("user_id",  "name username avatar.url")
    .select("tweet post_img.url like comments createdAt");

    const filteredPosts = posts.map(post => ({
        _id: post._id,
        user: post.user_id,
        tweet: post.tweet,
        image: post.post_img?.url || "",
        likeCount: post.like?.length || 0,
        commentCount: post.comments?.length || 0,
        timeAgo: dayjs(post.createdAt).fromNow(),
        like: undefined,
        comments: undefined,
        createdAt: undefined,
    }));

    res.status(200)
    .json(
        {
            success: true,
            filteredPosts,
        }
    );
});

const getPostComment = asyncHandler (async (req, res) => {
    const post_id = req.body.post_id;
    if (!post_id) throw new ApiError(400, "Post id not found!");

    const comment = await Post.findById(post_id)
    .select("comments")
    .populate("comments.user_id", "name username avatar.url");

    const comments = [...comment.comments].reverse();
    res.status(200)
    .json(
        {
            success: true,
            comments,
        }
    );
});

export {
    createPost,
    deletePost,
    likePost,
    commentOnPost,
    getPosts,
    getFollowingPosts,
    getPostComment,
};