import { sendMsg } from "../controllers/chat.controller.js";
import { authSocket } from "../middlewares/socket.middleware.js";

let previousID = null;


const chatSocket = (io) => {
  const chat = io.of("/chat");
  chat.use(authSocket);

  chat.on("connection", (socket) => {
    
    socket.on("join-room", (roomId) => {
        if (previousID) {
            socket.leave(previousID);
            previousID = null;
        }
        previousID = roomId;
        socket.join(roomId);
    });

    socket.on("send-msg", (data) => {
        const { message, roomId } = data;
        if (!message) return;
        sendMsg(socket.userID, roomId, message);
        socket.to(roomId).emit("receive-msg", (message));
    })

    socket.on("disconnect", () => {
      
    });

    socket.on("error", (err) => {
      console.error(`Socket error: ${err.message}`);
    });
  });

};

export default chatSocket;