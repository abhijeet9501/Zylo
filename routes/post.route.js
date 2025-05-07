import { commentOnPost, createPost, deletePost, likePost } from "../controllers/post.controller.js";
import { isAuthenticated } from "../middlewares/profile.middleware.js";
import upload from "../middlewares/multer.middleware.js";
import express from "express";

const router = express.Router();


router.post("/createpost", isAuthenticated, upload.single("post"),createPost);
router.delete("/deletePost", isAuthenticated, deletePost);
router.put("/like", isAuthenticated, likePost);
router.post("/comment", isAuthenticated, commentOnPost);

export default router;