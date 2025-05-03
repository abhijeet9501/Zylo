import { getMyProfile, getUserProfile, updateMyProfile, uploadAvatar } from "../controllers/profile.controller.js";
import { isAuthenticated, logOut } from "../middlewares/profile.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import express from "express";

const router = express.Router();


router.get("/me", isAuthenticated, getMyProfile);
router.put("/update", isAuthenticated, updateMyProfile);
router.get("/:username", isAuthenticated, getUserProfile);
router.post("/avatar", isAuthenticated, upload.single("avatar"), uploadAvatar);
router.post("/logout", logOut);

export default router;