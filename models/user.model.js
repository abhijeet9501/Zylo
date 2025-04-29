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
            type: String,
            default: "",
        },
        bio: {
            type: String,
            default: "",
        },
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