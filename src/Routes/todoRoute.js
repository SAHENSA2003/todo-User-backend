import express from "express";
import { CreateTodo, getAllTodo, /*deleteAllTodo, delTodo,  updateTodo*/ } from "../Controllers/todoController.js";
import { hasToken } from "../middleware/hasToken.js";

const todoRouter = express.Router();

todoRouter.post("/new", hasToken, CreateTodo);
todoRouter.get("/getAll",hasToken, getAllTodo);
// todoRouter.delete("/Delete/:id", delTodo);
// todoRouter.delete("/deleteAllTodo",deleteAllTodo);
// todoRouter.put("/edit/:id", updateTodo);


export default todoRouter;