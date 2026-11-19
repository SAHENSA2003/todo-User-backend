import jwt from "jsonwebtoken";
import crypto from "crypto";
import bcrypt from "bcrypt";
import dotenv from "dotenv/config"
import { verifyMail } from "../emailVerify/verifymail.js";


export const sha256 = (str) => {
    crypto.createHash("sha256").update(str).digest("hex")
};

export const generateAndSendCredential = async (user) => {
    const otp = crypto.randomInt(100000, 1000000).toString();
    console.log(otp);

    const token = jwt.sign({ id: user._id, purpose: "verify" }, process.env.secretKey, { "expiresIn": "5m" });
    console.log(token);

    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpires = new Date(Date.now() + 1 * 60 * 1000);

    await user.save();

    await verifyMail(token, otp, user.email, user.UserName);

};