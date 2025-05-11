import Room from "../models/room.model.js";
import Message from "../models/message.model.js";
import { authSocket } from "../middlewares/socket.middleware.js";
import ApiError from "../utils/apiError.util.js";


const chatSocket = (io) => {
  const chat = io.of("/chat");
  chat.use(authSocket);

  chat.on("connection", (socket) => {
    
    socket.on("join-room", (roomId) => {
        socket.join(roomId);
    });
    socket.on("send-msg", (data) => {
        const { message, roomId } = data;
        if (!message) throw new ApiError(400, "Message not found!");
        socket.to(roomId).emit("receive-msg", (message));
    })

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("error", (err) => {
      console.error(`Socket error: ${err.message}`);
    });
  });

};

export default chatSocket;