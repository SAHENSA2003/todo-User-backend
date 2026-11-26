import express from "express";
import { CreateUser, deleteAll, delUser, forgetPassword, getAllUser, login, logout, logoutAll, reVerifyUser, setNewPassword, verifyUser } from "../Controllers/UserController.js";
import { hasToken } from "../middleware/hasToken.js";
import { validate } from "../validator/validate.js";
import { forgetPasswordSchema, setNewPasswordSchema, userValidateSchema } from "../validator/userValidator.js";


const userRouter = express.Router();

userRouter.post("/register", validate(userValidateSchema), CreateUser);
userRouter.delete("/DeleteAll", deleteAll);
userRouter.delete("/delUser/:id", delUser);
userRouter.get("/getAllUser", getAllUser);
userRouter.get("/verify", verifyUser);
userRouter.get("/reVerify", reVerifyUser);
userRouter.post("/login", login);
userRouter.delete("/logout", hasToken, logout);
userRouter.delete("/logoutAll", hasToken, logoutAll);
userRouter.post("/forget-password",validate(forgetPasswordSchema),forgetPassword);
userRouter.post("/reset-password",validate(setNewPasswordSchema),setNewPassword);

export default userRouter;