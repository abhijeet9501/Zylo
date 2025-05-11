
const chatSocket = (io) => {
  const chat = io.of("/chat");

  chat.on("connection", (socket) => {
    console.log(`New client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("error", (err) => {
      console.error(`Socket error: ${err.message}`);
    });
  });

};

export default chatSocket;