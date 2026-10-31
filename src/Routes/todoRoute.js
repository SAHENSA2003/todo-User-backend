import express from "express";
import { CreateTodo, getAllTodo, delTodo,updateTodo /*deleteAllTodo,*/ } from "../Controllers/todoController.js";
import { hasToken } from "../middleware/hasToken.js";

const todoRouter = express.Router();

todoRouter.post("/new", hasToken, CreateTodo);
todoRouter.get("/getAll", hasToken, getAllTodo);
todoRouter.delete("/Delete/:id", hasToken, delTodo);
todoRouter.put("/edit/:id",hasToken, updateTodo);
// todoRouter.delete("/deleteAllTodo",deleteAllTodo);



export default todoRouter;