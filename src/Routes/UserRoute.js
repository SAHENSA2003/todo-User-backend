import express from "express";
import { CreateUser, deleteAll, delUser, getAllUser, login, verifyToken } from "../Controllers/UserController.js";

const userRouter = express.Router();

userRouter.post("/register", CreateUser);
userRouter.delete("/DeleteAll", deleteAll);
userRouter.delete("/delUser/:id",delUser);
userRouter.get("/getAllUser", getAllUser);
userRouter.get("/verify", verifyToken);
userRouter.post("/login",login); 

export default userRouter;