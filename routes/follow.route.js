import { follow, unFollow } from "../controllers/follow.controller.js";
import { isAuthenticated } from "../middlewares/profile.middleware.js";

import express from "express";

const router = express.Router();

router.post("/tofollow", isAuthenticated, follow);
router.post("/tounfollow", isAuthenticated, unFollow);

export default router;