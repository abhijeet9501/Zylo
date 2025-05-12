import { verifyToken } from "../utils/token.util.js";
import cookie from "cookie";

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
        console.log("User id not found");
        return;
    };
};

export { 
    authSocket, 
};