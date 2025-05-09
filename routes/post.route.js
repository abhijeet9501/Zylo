import { commentOnPost, createPost, deletePost, getFollowingPosts, getPostComment, getPosts, likePost } from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/profile.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import express from "express";

const router = express.Router();


router.post("/createpost", isAuthenticated, upload.single("post"),createPost);
router.delete("/deletePost", isAuthenticated, deletePost);
router.put("/like", isAuthenticated, likePost);
router.post("/comment", isAuthenticated, commentOnPost);

router.get("/posts", isAuthenticated, getPosts);
router.get("/followpost", isAuthenticated, getFollowingPosts);
router.post("/getcomment", isAuthenticated, getPostComment);

export default router;