import { register, login } from "../controllers/auth.controller.js";
import { isLoggedIn, isAlreadyExists } from "../middlewares/auth.middleware.js";

import express from "express";

const router = express.Router();

router.post("/register", isLoggedIn, isAlreadyExists, register);
router.post("/login", isLoggedIn, login);


export default router;