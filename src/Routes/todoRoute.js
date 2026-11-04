import express from "express";
import { CreateTodo, getAllTodo, delTodo, updateTodo, /*deleteAllTodo,*/ 
paginate} from "../Controllers/todoController.js";
import { hasToken } from "../middleware/hasToken.js";
import { taskValidateSchema } from "../validator/taskValidator.js";
import { validate } from "../validator/validate.js";

const todoRouter = express.Router();

todoRouter.post("/new", hasToken, validate(taskValidateSchema), CreateTodo);
todoRouter.get("/getAll", hasToken, getAllTodo);
todoRouter.delete("/Delete/:id", hasToken, delTodo);
todoRouter.put("/edit/:id", hasToken, validate(taskValidateSchema), updateTodo);
todoRouter.get("/paginate",hasToken,paginate);
// todoRouter.delete("/deleteAllTodo",deleteAllTodo);



export default todoRouter;