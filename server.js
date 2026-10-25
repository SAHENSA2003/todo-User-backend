import express from "express";
import dotenv from "dotenv/config";
import { dbConnect } from "./src/config/dbConnect.js";
import userRouter from "./src/Routes/UserRoute.js";
import todoRouter from "./src/Routes/todoRoute.js";

const app = express();
const prot = process.env.PORT || 8001;
dbConnect();

app.use(express.json());
app.use("/",todoRouter);
app.use("/", userRouter);

app.listen(prot, () => {
    console.log(`App is running on prot ${prot}`);
});