
const notifySocket = (io) => {
  const notify = io.of("/notify");

  notify.on("connection", (socket) => {
    console.log(`New notify client connected: ${socket.id}`);

    socket.on("disconnect", () => {
      console.log(`Client disconnected: ${socket.id}`);
    });

    socket.on("error", (err) => {
      console.error(`Socket error: ${err.message}`);
    });
  });

};

export default notifySocket;