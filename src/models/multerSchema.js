import mongoose from "mongoose";

const multerSchema = new mongoose.Schema({
    picture: {
        type: String,
        require: true
    }
}, { timestamps: true });


export default mongoose.model("upload", multerSchema);