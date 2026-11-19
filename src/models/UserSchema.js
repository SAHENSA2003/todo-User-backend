import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    Password: {
        type: String,
        required: true
    },
    otp: {
        type: String,
    },
    otpExpires: {
        type: Date
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    isLoggedIn: {
        type: Boolean,
        default: false
    },
});

export default mongoose.model("UserData", UserSchema);