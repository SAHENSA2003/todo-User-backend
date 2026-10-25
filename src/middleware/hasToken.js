import UserSchema from "../models/UserSchema.js";
import jwt from "jsonwebtoken";

export const hasToken = async (req, res,next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith("Bearer")) {
            return res.status(401).json({
                success: false,
                message: "Token authorization invalid or not found"
            })
        } else {
            const token = authHeader.split(" ")[1];
            jwt.verify(token, process.env.secretKey, async (err, decoded) => {
                if (err) {
                    if (err.name === "TokenExpiredError") {
                        return res.status(401).json({
                            success: false,
                            message: "Token expired!"
                        })
                    }
                    return res.status(401).json({
                        success: false,
                        message: "Token invalid!!"
                    })
                }
                else {
                    console.log(decoded);
                    // const { id } = decoded;
                    const id = decoded.id;
                    console.log(id)
                    const user = await UserSchema.findById(id);
                    if (!user) {
                        return res.status(401).json({
                            success: false,
                            message: "user not found!!!"
                        })
                    }
                    req.userId = id;
                    next();
                }
            })
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
};
