import mongoose from "mongoose";

 const todoSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"UserData",
        required:true,
    }
 }, {timestamps:true});

 export default mongoose.model("UserTasks",todoSchema);