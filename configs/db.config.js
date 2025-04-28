import mongoose from "mongoose";
import "dotenv/config";

const connectToDB = async () => {
    await mongoose.connect(process.env.URL)
    .then(() => {
        console.log("Connected to database!");
    })
    .catch(() => {
        console.log("Error while connecting to database!");
    });
};

export {
    connectToDB
};