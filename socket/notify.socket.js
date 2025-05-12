import { authSocket } from "../middlewares/socket.middleware.js";

let ioInstance; 

const notifySocket = (io) => {
  const notify = io.of("/notify");
  ioInstance = notify; 
  notify.use(authSocket); 

  notify.on("connection", (socket) => {
    const userId = socket.userID;
    try {
      if (userId) {
        socket.join(userId.toString());
      } 
      socket.on("error", (err) => {
        console.error(`Socket error: ${err.message}`);
      });
    } catch {
      console.log("error notify")
    }
  });
};

export const getIO = () => {
  if (!ioInstance) {
    throw new Error("Socket.IO instance not initialized");
  }
  return ioInstance;
};

export default notifySocket;