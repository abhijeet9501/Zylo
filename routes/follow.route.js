import { follow, removeFollow, whoToFollow } from "../controllers/follow.controller.js";
import { isAuthenticated } from "../middlewares/profile.middleware.js";

import express from "express";

const router = express.Router();

router.post("/follow", isAuthenticated, follow);
router.post("/removefollow", isAuthenticated, removeFollow);
router.get("/whotofollow", isAuthenticated, whoToFollow);

export default router;