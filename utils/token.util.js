import jwt from "jsonwebtoken";
import "dotenv/config";

export const generateToken = (userID) => {
    try {
        return jwt.sign(
            {
                _id: userID,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {expiresIn: process.env.ACCESS_TOKEN_EXPIRY},
        );
    }
    catch {
        return null;
    }
};

export const verifyToken = (token) => {
    try {
        return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    }
    catch {
        return null;
    }
};
