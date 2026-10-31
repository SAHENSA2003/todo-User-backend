import mongoose from "mongoose";

const SessionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "UserData",
        required: true,
    }
});

export default mongoose.model("Session", SessionSchema);