import { getChats, loadRoom } from "../controllers/chat.controller.js";
import { authSocket } from "../middlewares/socket.middleware.js";
import { isAuthenticated } from "../middlewares/profile.middleware.js";
import express from "express";


const router = express.Router();

router.post("/loadchat", isAuthenticated, loadRoom);
router.get("/getchat", isAuthenticated, getChats);

export default router;