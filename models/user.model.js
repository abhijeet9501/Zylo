import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        username: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
        avatar: {
            url: {
                type: String,
                default: "",
            },
            public_id: String,
        },
        bio: {
            type: String,
            default: "",
        },
        posts: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Post",
            }
        ],
        chat_room: [
            {
                type: mongoose.Types.ObjectId,
                ref: "Room",
            },
        ],
    }, 
    {timestamps: true}
);

userSchema.pre("save", async function(next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

userSchema.methods.checkPassword = async function(password) {
    try {
        return await bcrypt.compare(password, this.password);
    }
    catch {
        return null;
    }
};

const User = mongoose.model("User", userSchema);

export default User;