import express from "express";
import { upload } from "../Controllers/multerController.js";
import uploadPicture from "../Controllers/insertPicture.js";

const multerRoute = express.Router();

multerRoute.post("/uploadPic",upload.single("picture"),uploadPicture);

export default multerRoute;