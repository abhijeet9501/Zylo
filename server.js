import { server } from "./app.js";
import { Server } from "socket.io";
import cors from "cors";
import { connectToDB } from "./configs/db.config.js";
import chatSocket from "./socket/chat.socket.js";
import notifySocket from "./socket/notify.socket.js";
import "dotenv/config";

const startServer = async () => {
    await connectToDB();

    const io = new Server(server, cors());
    chatSocket(io);
    notifySocket(io);

    server.listen(process.env.PORT, "0.0.0.0",() => {
        console.log(`Server Running At http://localhost:${process.env.PORT}`);
    });
};

startServer();