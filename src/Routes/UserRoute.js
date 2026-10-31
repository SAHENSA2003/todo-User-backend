import express from "express";
import { CreateUser, deleteAll, delUser, getAllUser, login, logout, reVerifyToken, verifyToken } from "../Controllers/UserController.js";
import { hasToken } from "../middleware/hasToken.js";

const userRouter = express.Router();

userRouter.post("/register", CreateUser);
userRouter.delete("/DeleteAll", deleteAll);
userRouter.delete("/delUser/:id",delUser);
userRouter.get("/getAllUser", getAllUser);
userRouter.get("/verify", verifyToken);
userRouter.get("/reVerify",reVerifyToken);
userRouter.post("/login",login);
userRouter.delete("/logout",hasToken,logout);

export default userRouter;