import mongoose from "mongoose";
import { getIO } from "../socket/notify.socket.js"; 

const notificationSchema = new mongoose.Schema(
  {
    notification: {
      type: String,
      enum: ["follow", "like", "comment", "chat"],
      required: true,
    },
    user_id: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    from_user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: {
      type: String,
    }
  },
  { timestamps: true }
);


notificationSchema.pre("save", async function (next) {
  try {
    const notify = getIO(); 
    const notification = this;

    const eventType = notification.notification === "chat" ? "notify-chat" : "notify";

    notify
      .to(notification.user_id.toString())
      .emit(eventType);
    next(); 
  } catch {
    next(); 
  }
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;