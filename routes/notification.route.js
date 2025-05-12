import express from "express";
import { isAuthenticated } from "../middlewares/profile.middleware.js";
import { getNotification } from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/getnotify", isAuthenticated, getNotification);

export default router;