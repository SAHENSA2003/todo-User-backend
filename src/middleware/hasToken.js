import SessionSchema from "../models/SessionSchema.js";
import UserSchema from "../models/UserSchema.js";
import jwt from "jsonwebtoken";

export const hasToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Token authorization invalid or not found"
            })
        }
        const token = authHeader.split(" ")[1];
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.secretKey);
            console.log("decoded:", decoded);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ success: false, message: "Token expired!" });
            }
            return res.status(401).json({ success: false, message: "Token invalid!!" });
        }

        const session = await SessionSchema.findById(decoded.id);
        if (!session) {
            return res.status(401).json({
                success: false,
                message: "session ended , please re-login"
            });
        }
        req.userId = session.userId;
        req.sessionId = session._id;
        next();

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};
