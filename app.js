import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";


const app = express();

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get('/', (req, res) => {
    res.send("Your server is running fine!");
});

export {
    app
};