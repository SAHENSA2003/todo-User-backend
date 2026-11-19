import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    UserName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    Password: {
        type: String,
        required: true
    },
    picture:{
       type:String,
       require:true
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