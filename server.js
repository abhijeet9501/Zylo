import { app } from "./app.js";
import { connectToDB } from "./configs/db.config.js";
import "dotenv/config";

const startServer = async () => {
    await connectToDB();

    app.listen(process.env.PORT, () => {
        console.log(`Server Running At http://localhost:${process.env.PORT}`);
    });
};

startServer();