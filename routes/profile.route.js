import { getMyProfile, getUserProfile, updateMyProfile, updatePassword, uploadAvatar, basicData } from "../controllers/profile.controller.js";
import { isAuthenticated, logOut } from "../middlewares/profile.middleware.js";
import upload from "../middlewares/multer.middleware.js";

import express from "express";

const router = express.Router();


router.get("/me", isAuthenticated, getMyProfile);
router.get("/basic", isAuthenticated, basicData);
router.get("/:username", isAuthenticated, getUserProfile);
router.put("/update", isAuthenticated, updateMyProfile);
router.post("/avatar", isAuthenticated, upload.single("avatar"), uploadAvatar);
router.put("/password", isAuthenticated, updatePassword);
router.post("/logout", logOut);

export default router;