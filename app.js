import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";
import profilerouter from "./routes/profile.route.js";
import followRouter from "./routes/follow.route.js";
import postRouter from "./routes/post.route.js";
import chatRouter from "./routes/chat.route.js";
import notifyRouter from "./routes/notification.route.js";
import path from "path";
import { fileURLToPath } from 'url';

import http from "http";
const app = express();
const server = http.createServer(app);

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.static(path.join((path.dirname(fileURLToPath(import.meta.url)), "public"))));
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/profile", profilerouter);
app.use("/api/v1/follow", followRouter);
app.use("/api/v1/post", postRouter);
app.use("/api/v1/chat", chatRouter);
app.use("/api/v1/notify", notifyRouter);
app.use(errorMiddleware);

export {
    server,
};