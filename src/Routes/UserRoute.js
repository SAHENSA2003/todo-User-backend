import express from "express";
import { CreateUser, deleteAll, delUser, getAllUser, login, logout, logoutAll, reVerifyToken, verifyToken } from "../Controllers/UserController.js";
import { hasToken } from "../middleware/hasToken.js";
import { validate } from "../validator/validate.js";
import { userValidateSchema } from "../validator/userValidator.js";


const userRouter = express.Router();

userRouter.post("/register", validate(userValidateSchema), CreateUser);
userRouter.delete("/DeleteAll", deleteAll);
userRouter.delete("/delUser/:id", delUser);
userRouter.get("/getAllUser", getAllUser);
userRouter.get("/verify", verifyToken);
userRouter.get("/reVerify", reVerifyToken);
userRouter.post("/login", login);
userRouter.delete("/logout", hasToken, logout);
userRouter.delete("/logoutAll", hasToken, logoutAll);

export default userRouter;