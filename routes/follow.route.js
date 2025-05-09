import { follow, unFollow, whoToFollow } from "../controllers/follow.controller.js";
import { isAuthenticated } from "../middlewares/profile.middleware.js";

import express from "express";

const router = express.Router();

router.post("/follow", isAuthenticated, follow);
router.post("/unfollow", isAuthenticated, unFollow);
router.get("/whotofollow", isAuthenticated, whoToFollow);

export default router;