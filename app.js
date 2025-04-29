import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import authRouter from "./routes/auth.route.js";


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/api/v1/auth", authRouter);
app.use(errorMiddleware);

export {
    app
};