import { verifyToken } from "../utils/token.util.js";
import cookie from "cookie";
import ApiError from "../utils/apiError.util.js";

const authSocket = async (socket, next) => {
    try{
        const rawCookies = socket.handshake.headers.cookie;
        const { uid } = cookie.parse(rawCookies);
        if (!uid) return;
        const decode = verifyToken(uid);
        if (!decode) return;
        socket.userID = decode.id;
        next();
    } catch {
        throw new ApiError(400, "Auth failed");
    };
};

export { 
    authSocket, 
};