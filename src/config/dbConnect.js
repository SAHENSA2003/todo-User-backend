import mongoose from "mongoose";
import dotenv from "dotenv/config";


export async function dbConnect() {
    try {
        const url =  process.env.MONGO_URL;
        await mongoose.connect(url);
        console.log("dbConnected successfully to the data base",`[${mongoose.connection.name}]`);
    } catch (error) {
        console.log("db not connected!!")
    }
}

